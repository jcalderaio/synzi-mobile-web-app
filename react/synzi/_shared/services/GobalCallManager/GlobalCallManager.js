import React, { Component, Fragment } from 'react'
import {
    View,
    AsyncStorage,
    Alert,
    AppState,
    NetInfo,
    ActivityIndicator,
    NativeModules,
    PushNotificationIOS,
    Platform
} from 'react-native';

import axios from 'axios'
import { connect } from 'react-redux';
import { translate } from '../../../../features/base/i18n';
import { LogSeparator, AppConfig, isVirtualCare } from '../../constants/AppConfig'

import io from 'socket.io-client';
import deviceLog from 'react-native-device-log'
import Sound from 'react-native-sound'
import Orientation from 'react-native-orientation-locker'
import { allowSidebar } from '../../src/OrientationResponsiveComponent'
import EnvManager from '../EnvManager'
import { setHangupPressed } from '../../../../features/toolbox/actions.native'
import { appNavigate } from '../../../../features/app'

import Reactotron from 'reactotron-react-native'

class GlobalCallManager extends Component {

    constructor(props) {
        super(props)

        this.socket = null
        this.shownPartyLeftAlert = false
        this.patientUserId = null

        // Please leave for debugging if other state issues surface in the future
        // Reactotron.log(`socket explore: set initial state in constructor`)
        // deviceLog.log("GlobalCallManager CONSTRUCTOR")

        this.state = {
            isConnected: true,
            connectSocket: false,
            socketState: 'disconnected',
            loggingOut: false,
            currentUser: null,
            incomingCallObject: null,
            outgoingCallObject: null,
            outgoingCallGroupId: null,
            roomToJoin:null,
            //accessToken: null,
            appState: AppState.currentState,
            retryCall: false,
            refreshEnv: false,
            initialized: false,
            showDroppedCall: false
        }

        this.connectToSocket = this.connectToSocket.bind(this)
        this.closeSocket = this.closeSocket.bind(this)
        this.ignoreIncomingCall = this.ignoreIncomingCall.bind(this)
        this.saveCurrentUser = this.saveCurrentUser.bind(this)
        this.makeCall = this.makeCall.bind(this)
        this.cancelCall = this.cancelCall.bind(this)
        this.acceptCall = this.acceptCall.bind(this)
        this.makeGroupCall = this.makeGroupCall.bind(this)
        this.skipCall = this.skipCall.bind(this)
        this.retryCallAction = this.retryCallAction.bind(this)
        this.refreshEnvironment = this.refreshEnvironment.bind(this)
        this.finishSignout = this.finishSignout.bind(this)
        this.handleCallCancelled = this.handleCallCancelled.bind(this)

        this.createRingerSoundAndPlay(false)


    }

    createRingerSoundAndPlay(playSound){
        this.ringerSound  = new Sound('ringtone.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                return;
            }
            this.ringerSound.setNumberOfLoops(-1);

            if(playSound){
                this.ringerSound.play()
            }
        });
    }

    componentDidUpdate(prevProps) {
        // Reactotron.log(`socket explore: componentDidUpdate() :: hangupPressed before: ${prevProps.hangupPressed} now: ${this.props.hangupPressed}`)

        this.shownPartyLeftAlert = false

        if(!prevProps.hangupPressed && this.props.hangupPressed){

            const { roomToJoin } = this.state
            Reactotron.log(`socket explore: HANDLE HANGUP PRESSED :: room = ${roomToJoin}`)
            
            if(roomToJoin !== null){

                
                Reactotron.log(`socket: HANGUP CALL: room: ${roomToJoin}`)
                deviceLog.log(`HANGUP CALL: room: ${roomToJoin}`)

                const roomData = { room: roomToJoin }
                this.sendSocketMessage('HANGUP', roomData)
                this.setState({ incomingCallObject: null, outgoingCallObject: null, roomToJoin: null })
                this.props.dispatch(setHangupPressed(false))
            }

        }
        
    }
    
    playRingerSound(){

        if(!this.ringerSound){
            this.createRingerSoundAndPlay(true)
        }else{
            this.ringerSound.play((success) => {
                if (!success) {
                    this.ringerSound.reset();
                }
            });
        }
    }

    stopRingerSound(){
        if(this.ringerSound){
            this.ringerSound.stop(() => {});
            this.ringerSound.release()
            this.ringerSound = null
        }
    }

    componentWillMount() {
        Reactotron.warn("GlobalCall Manager CWM")
        //State Change Listener
        AppState.addEventListener('change', this.handleAppStateChange);
        Orientation.unlockAllOrientations()
    };

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }
      
    componentWillUnmount(){
        this.ringerSound.release()
        AppState.removeEventListener('change', this.handleAppStateChange);
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
        if(!allowSidebar) {
            Orientation.lockToPortrait(); 
        }
    }

    // If network disconnected, sets this.state.isConnected to false. Else, sets to true.
    handleConnectivityChange = () => {
        NetInfo.isConnected.fetch(global.SYNZI_graphqlUrl).then(isConnected => {
            this.setState({ isConnected })

            if(isConnected) {

                const { roomToJoin } = this.state

                if(roomToJoin) {
                    deviceLog.log(`roomToJoin=${roomToJoin}`)
                    // we were in a call when the socket disconnected, so try to reconnect to the call
                    this.socket.emit(
                        'NETWORK-REESTABLISHED',
                        { room: this.state.roomToJoin },
                        incomingData => {
                          this.handleReconnectToCall(incomingData, roomToJoin)
                        }
                    )
                }
            }
        });
    };

      // If reconnect to call, and no other caller is in the room, hangup
      handleReconnectToCall = (callInProgress, roomToJoin) => {
          
        if(!callInProgress) {
            const roomData = { room: roomToJoin }
            this.sendSocketMessage('HANGUP', roomData)
            this.setState({ incomingCallObject: null, outgoingCallObject: null, roomToJoin: null, retryCall: false, showDroppedCall: true })
            this.props.dispatch(setHangupPressed(true))
            this.props.dispatch(appNavigate(undefined))

            if(!this.shownPartyLeftAlert) {
                Alert.alert(
                    'Call Error',
                    'The other party has left the call',
                    [
                        { text: 'Ok', onPress: () => null },
                    ],
                    { cancelable: false }
                )
            }
        }
    }


    //State Change Handler
    handleAppStateChange = (nextAppState) => {

        // if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
        if (nextAppState === 'active') {
            //Call the API with our state
            this.appState('foreground').then(() => {});

        // }else if(this.state.appState === 'inactive' || nextAppState === 'background'){
        } else {
            // cancel a call if the app is dropping to the background while making a call
            if (this.state.outgoingCallObject) {
                Reactotron.log("CANCELLING CALL REQUEST WHEN DROPPING TO BACKGROUND", this.state.outgoingCallObject)
                deviceLog.log("CANCELLING CALL REQUEST WHEN DROPPING TO BACKGROUND")
                this.cancelCall(this.state.outgoingCallObject)
            }

            // stop ringing sound so it doesn't continue to play forever
            if (this.state.incomingCallObject && !this.state.roomToJoin) {
                Reactotron.log("socket explore: STOP RINGING SOUND")
                this.stopRingerSound()
            }
            
            //Call the API with our state
            this.appState('background').then(() => {});
        }
        this.setState({appState: nextAppState});
       
    }

     //REST Call for app state
     async appState(appState) {

        Reactotron.warn("GlobalCallManager appState()")

        const appName = isVirtualCare() ? 'care' : 'connect'

        const { accessToken } = this.state
        // Reactotron.log(`** socket explore: appState() :: set to ${appState} for ${appName} with token ${accessToken}`)

        if(accessToken === null || accessToken === undefined){
            return
        }

        axios.defaults.headers.post['Authorization'] = "Bearer " + accessToken;
        axios.defaults.headers.post['Content-Type'] = 'application/json';


        try {
            const response = await axios.post(EnvManager.getInstance().getRestUrl() + '/state/app',
                {
                    app: appName,
                    state: appState,
                },
            )
            
            
            Reactotron.log(`socket extra API: ${EnvManager.getInstance().getRestUrl()}/state/app, state: ${appState}, status: ${response.status}, appName: ${appName}, appState: ${appState}, env: ${EnvManager.getInstance().getEnvShortName()}`)
            deviceLog.log(`API: ${EnvManager.getInstance().getRestUrl()}/state/app, state: ${appState}, status: ${response.status}, appName: ${appName}, appState: ${appState} env: ${EnvManager.getInstance().getEnvShortName()}`)


            if (appState === 'foreground') {
                Reactotron.log(`** socket explore: reconnect socket on foreground`)
                this.connectToSocketOnForeground()
            } else if (this.state.roomToJoin) {
                Reactotron.log(`** socket explore: leave socket open on background when in a call`)
            } else {
                Reactotron.log(`** socket explore: disconnect socket on background when not in a call`)
                this.closeSocket()
            }

            return {}

        } catch (error) {

            
            Reactotron.log(`socket extra API: ${EnvManager.getInstance().getRestUrl()}/state/app, state: ${appState}, error: ${error.response.status}`)
            deviceLog.log(`API: ${EnvManager.getInstance().getRestUrl()}/state/app, state: ${appState}, error: ${error.response.status}`)

            //Something went wrong, send the user back to the login page
            deviceLog.log('Unathorized, Please login')
            // this.props.navigation.navigate('Login')


            if (error.response.status === 400 || 401) {
                return {}
            } else {
                return {}
            }
        }
    }


    async connectToSocketOnForeground(){
       
        try{

            var token = await AsyncStorage.getItem(AppConfig.AUTH_TOKEN);

            if(token !== null){

                /** If we have a token, try to connect the socket */
                this.connectToSocket(token)
                
            }

            /** NO-OP If there is no token. The user had previosuly logged out or never logged in */

        } catch(error){

            
            Reactotron.error('Error getting login token ', error)
          
        }
    }


    closeSocket(isLogout){
        Reactotron.log("===> GlobalCallManager.closeSocket() :: logging out? " + isLogout)
        deviceLog.log(`Close Socket`)
        this.setState( { loggingOut: isLogout} )
        if(this.socket){
            this.socket.disconnect()
            this.socket = null
        }
    }


    handleCallCancelled() {
        Reactotron.log(`socket explore: handle CALL-CANCELED`)
        deviceLog.log(`handle CALL-CANCELED`)

        this.stopRingerSound()

        this.setState({ incomingCallObject: null, roomToJoin: null, retryCall: false, outgoingCallGroupId: null })
    }


    setSocketConnectedState() {
        
        Reactotron.warn(`GlobalCallManager setSocketConnectedState() id: ${this.socket.id}`)
        deviceLog.log(`setSocketConnectedState() id: ${this.socket.id}`)

        const setSocketAvailable = () => {
            Reactotron.log("setSocketAvailable()")
            this.setState({ 
                socketState: 'available', 
                initialized: true,
            })

            this.sendSocketMessage('re-connect', null)
        }

        if (this.state.incomingCallObject && !this.state.roomToJoin) {
            Reactotron.log("socket explore: HIDE INCOMING CALL OVERLAY, WAIT BRIEFLY BEFORE RECONNECTING")
            deviceLog.log("HIDE INCOMING CALL OVERLAY, WAIT BRIEFLY BEFORE RECONNECTING")

            //hide the overlay in case it was on when the app dropped to the background
            this.handleCallCancelled()

            // wait a brief moment for overlay to hide before reconnecting
            setTimeout(setSocketAvailable, 20)
        } else {
            Reactotron.log("socket explore: (RE)CONNECT IMMEDIATELY")
            deviceLog.log("RECONNECT IMMEDIATELY")
            // immediately re-connect
            setSocketAvailable()
        }
    }

    connectToSocket(token){
        
        Reactotron.log(`Socket Explore: Connect/Check Socket :: appState = ${this.state.appState} :: token = ${token}`)
        
        const { appState } = this.state

        if(appState === 'background'){
            return
        }

        if(this.socket !== null && this.socket.connected){
            Reactotron.log(`socket explore: is connected :: initialized? ${this.state.initialized}`)
            if (!this.state.initialized) this.setupSocketEvents()
            return
        }


        const transportOptions = {
            jsonp: false,
            secure: true,
            transports: ['websocket'],
            //autoConnect: true,
            query: {
                jwt: token
            }
        }

        
        Reactotron.log(`Socket Start`)
        deviceLog.log(`Socket Start`)
        deviceLog.log(EnvManager.getInstance().getSocketUrl())
        deviceLog.log(EnvManager.getInstance().getJitsiUrl())
        // deviceLog.log(transportOptions)

        /** Store for use with app state REST call */
        Reactotron.log(`** Store Access Token: ${token}`)
        this.setState({ accessToken: token })
        
        //Create the socket
        this.socket = io(EnvManager.getInstance().getSocketUrl(), transportOptions)

        if (this.socket) {
            Reactotron.log(`socket explore: socket created - ready to setup events...`)
            this.setupSocketEvents()
        } else {
            Reactotron.log('SOCKET FAILED TO INSTANTIATE - RETRY AFTER SHORT WAIT')
            deviceLog.log('SOCKET FAILED TO INSTANTIATE - RETRY AFTER SHORT WAIT')
            setTimeout(() => {
                this.connectToSocket(token)
            }, 500)
        }
    }

    setupSocketEvents() {
        Reactotron.warn('GlobalCallManager setupSocketEvents()')
        deviceLog.log('setupSocketEvents()')

        this.socket.on('error', (error) => {
            
            Reactotron.log('Socket ERROR', error)
            deviceLog.log('Socket ERROR')
            deviceLog.log(error)
        })

        //Socket callbacks
        this.socket.on('connect_failed', () => {
            
            Reactotron.log('Socket Event: Failed to Connect')
            deviceLog.log('Socket Failed to Connect')
        })


        this.socket.on('disconnect', () => {
            
            Reactotron.log(`Socket Event: Disconnected`)
            deviceLog.log(`Socket Disconnected`)

            this.setState({ socketState: 'disconnected' })
        })


        this.socket.on('connect', () => {
            
            Reactotron.log(`Socket Event: Connected: ${this.socket.connected}, socket id: ${this.socket.id}`)
            deviceLog.log(`** Socket Connected :: id: ${this.socket.id}`)

            this.setSocketConnectedState()
        })

        this.socket.on('CONNECTED', data => {
            Reactotron.warn(`Connected, got data. \nvideoServerUrl: ${data.jitsi_url}, \nvideoServerUsername: ${data.jitsi_username}, \nvideoServerPassword: ${data.jitsi_password}`)
            deviceLog.log(`Connected, got data. \nvideoServerUrl: ${data.jitsi_url}, \nvideoServerUsername: ${data.jitsi_username}, \nvideoServerPassword: ${data.jitsi_password}`)

            // Set jitsi_video URL, username, and password for each conference
            EnvManager.getInstance().setJitsiUrl(data.jitsi_url)
            global.SYNZI_videoServerUsername = data.jitsi_username
            global.SYNZI_videoServerPassword = data.jitsi_password
        })


        this.socket.on('INCOMING-CALL', data => {
            
            Reactotron.log(`socket event: INCOMING-CALL data: ${data}`)
            deviceLog.log(LogSeparator())
            deviceLog.log(`INCOMING-CALL`)
            deviceLog.log(data)

            const { currentUser } = this.state

            let callee = {
                id: currentUser.id,
                displayName: currentUser.displayName
            }

            var incomingCallObject = null

            /** For whatever reason, the format is different 
             * when this message comes in on re-connect */
 
            if(data['msg']){

                let msg = data['msg']

                // If call includes a patient, store their patientId. Else, store 0.
                global.PATIENT_ID = (msg['patient_id']) ? msg['patient_id'] : 0

                if(msg['related_user'] != '') {

                    incomingCallObject = {
                        callerName:msg['from_display_name'],
                        roomName:msg['room'], 
                        timeOutTaskId:msg['timeout_task_id'], 
                        from_id:msg['from_user'],
                        callee: callee,
                        profileImage:msg['from_profile_image'],
                        group:msg['group'],
                        sid:msg['sid'],
                        relatedUser: msg['related_user'],
                        relatedDisplayName: msg['related_display_name'],
                        relatedImg: msg['related_img']
                    }
                } else {
                    incomingCallObject = {
                        callerName:msg['from_display_name'],
                        roomName:msg['room'], 
                        timeOutTaskId:msg['timeout_task_id'], 
                        from_id:msg['from_user'],
                        callee: callee,
                        profileImage:msg['from_profile_image'],
                        group:msg['group'],
                        sid:msg['sid']
                    }
                }

            }else{

                // If the person calling is a patient, store their patientId. Else, store 0.
                global.PATIENT_ID = (data['patient_id']) ? data['patient_id'] : 0

                if(data['related_user'] != '') {
                    
                    incomingCallObject = {
                        callerName:data['from_display_name'],
                        roomName:data['room'], 
                        timeOutTaskId:data['timeout_task_id'], 
                        from_id:data['from_user'],
                        callee: callee,
                        profileImage:data['from_profile_image'],
                        group:data['group'],
                        sid:data['sid'],
                        relatedUser: data['related_user'],
                        relatedDisplayName: data['related_display_name'],
                        relatedImg: data['related_img']
                    }
                } else {
                    incomingCallObject = {
                        callerName:data['from_display_name'],
                        roomName:data['room'], 
                        timeOutTaskId:data['timeout_task_id'], 
                        from_id:data['from_user'],
                        callee: callee,
                        profileImage:data['from_profile_image'],
                        group:data['group'],
                        sid:data['sid']
                    }
                }
            }

            Reactotron.log(`INCOMING-CALL from: ${ incomingCallObject.callerName }, id: ${ incomingCallObject.from_id }, room: ${ incomingCallObject.roomName }`)
            deviceLog.log(`INCOMING-CALL from: ${ incomingCallObject.callerName }, id: ${ incomingCallObject.from_id }, room: ${ incomingCallObject.roomName }`)

            this.playRingerSound()

            this.setState({ incomingCallObject: incomingCallObject, retryCall: false, outgoingCallGroupId: null })
            
        })


        this.socket.on('CALL-CANCELED', data => {
            
            Reactotron.log(`socket event: CALL-CANCELED`)
            deviceLog.log(`CALL-CANCELED`)

            this.handleCallCancelled(data)
        })

        this.socket.on('CALL-IGNORED', data => {
            
            Reactotron.log(`socket event: CALL-IGNORED`)
            deviceLog.log(`CALL-IGNORED`)
            this.setState({ retryCall: true, outgoingCallGroupId: null })
        })

        this.socket.on('CALL-ACCEPTED', data => {
            
            Reactotron.log(`socket event: CALL-ACCEPTED`)
            deviceLog.log(`CALL-ACCEPTED`)
            this.setState({ roomToJoin: data['room'], outgoingCallObject: null, outgoingCallGroupId: null })
        })
      
        // The call being placed was not answered before the timeout
        this.socket.on('CALL-TIMEOUT', data => {
            
            Reactotron.log(`socket event: CALL-TIMEOUT`)
            deviceLog.log(`CALL-TIMEOUT`)
            this.setState({ retryCall: true, outgoingCallGroupId: null })
        })
      
        // The incoming call was not answered before the timeout
        this.socket.on('CALL-MISSED', data => {
            
            Reactotron.log(`socket event: CALL-MISSED`)
            deviceLog.log(`CALL-MISSED`)

            this.stopRingerSound()
            this.setState({ incomingCallObject: null, roomToJoin: null, retryCall: false, outgoingCallGroupId: null })
        })
      
        this.socket.on('STOP-RINGING', () => {
            
            Reactotron.log(`socket event: STOP-RINGING`)
            deviceLog.log(`STOP-RINGING`)

            this.stopRingerSound()
            this.setState({ incomingCallObject: null, roomToJoin: null, retryCall: false, outgoingCallGroupId: null })
        })


        this.socket.on('AWAITING_PICKUP', data => {
            
            Reactotron.log(`socket event: AWAITING_PICKUP`)
            deviceLog.log(`AWAITING_PICKUP`)

            var outgoingCallObject = this.state.outgoingCallObject
            if(outgoingCallObject) {
                outgoingCallObject.room = data.room
                Reactotron.log(`socket: AWAITING-PICKUP user: ${outgoingCallObject.displayName}, roomName: ${outgoingCallObject.room}`)
                this.setState({ outgoingCallObject: outgoingCallObject })
            }

            //this.setState({ room: data.room, timeOutTaskId: data.timeout_task_id })
        })
      
        this.socket.on('CALL-COMPLETE', () => {
            
            Reactotron.log(`socket event: CALL-COMPLETE`)
            deviceLog.log(`CALL-COMPLETE`)

            if (this.state.appState === 'background') {
                Reactotron.log(`socket explore: Catch app state in background and Disconnect WebSocket`)
                this.closeSocket()
            }

            this.props.dispatch(appNavigate(undefined));
            this.setState({ incomingCallObject: null, outgoingCallObject: null, roomToJoin: null, retryCall: false, outgoingCallGroupId: null })
        })

          // A new user was chosen during a group call (current user did not answer)
        this.socket.on('CALL-GROUP-NEXT', data => {
            
            Reactotron.log(`socket event: CALL-GROUP-NEXT data: ${data}`)
            deviceLog.log(`CALL-GROUP-NEXT`)
            deviceLog.log(data)

            const timeOutTaskId = data.timeout_task_id ? data.timeout_task_id : ''

            var outgoingCallObject = {
                timeOutTaskId:timeOutTaskId,
                incomingUserId:data.to_user, 
                incomingSid:data.sid, 
                displayName:data.to_display_name,
                profileImage:data.to_profile_image,
                room:data.room,
            }

            Reactotron.log(`CALL-GROUP-NEXT: 
                timeOutTaskId: ${outgoingCallObject.timeOutTaskId}, 
                incomingUserId: ${outgoingCallObject.incomingUserId},
                incomingSid: ${outgoingCallObject.incomingSid},
                displayName: ${outgoingCallObject.displayName},
                profileImage: ${outgoingCallObject.profileImage},
                room: ${outgoingCallObject.room}`
            )
            deviceLog.log(`CALL-GROUP-NEXT: 
                timeOutTaskId: ${outgoingCallObject.timeOutTaskId}, 
                incomingUserId: ${outgoingCallObject.incomingUserId},
                incomingSid: ${outgoingCallObject.incomingSid},
                displayName: ${outgoingCallObject.displayName},
                profileImage: ${outgoingCallObject.profileImage},
                room: ${outgoingCallObject.room}`
            )

            this.setState({ outgoingCallObject: outgoingCallObject, retryCall: false })
        })
    
        // No one answered a group call (everyone being called declined or timed out)
        this.socket.on('CALL-GROUP-TIMEOUT', data => {
            
            Reactotron.log(`socket event: CALL-GROUP-TIMEOUT`)
            deviceLog.log(`CALL-GROUP-TIMEOUT`)

            //NOTE: Need call object in order to show overlays
            //    in group timeout always use generic profile image
            var outgoingCallObject = {
                profileImage: '',
                group: this.state.outgoingCallGroupId
            }

            this.setState({ outgoingCallObject: outgoingCallObject, retryCall: true })
        })

        /*
            If the current user is on a call on another device, 
            prevent user from calling on this one

        this.socket.on('ALREADY_IN_CALL', data => {
            
            Reactotron.log(`socket event: ALREADY_IN_CALL`)
            deviceLog.log(`ALREADY_IN_CALL`)

            this.setState({ incomingCallObject: null, outgoingCallObject: null, roomToJoin: null, retryCall: false, outgoingCallGroupId: null })

            Alert.alert(
                'Call Error',
                'You can’t make calls from multiple devices',
                [
                    { text: 'Ok', onPress: () => null },
                ],
                { cancelable: false }
            )
        })
        */

        // If connection happens so fast the 'connect' event isn't ready
        setTimeout(() => {
            Reactotron.log("===> socket connected? ", this.socket.connected)
            Reactotron.log("===> state initialized? ", this.state.initialized)
            if (this.socket.connected && !this.state.initialized) {
                
                Reactotron.log(`socket exception: CATCH CONNECT BEFORE EVENT`)
                deviceLog.log(`CATCH CONNECT BEFORE EVENT`)

                this.setSocketConnectedState()
            }
        }, 500)
    }

    sendSocketMessage(message, data) {
        Reactotron.log(`socket emit: SEND SOCKET MESSAGE '${message}' - connected? ${this.socket.connected}`)
        deviceLog.log(`SEND SOCKET MESSAGE '${message}' - connected? ${this.socket.connected}`)
        Reactotron.log(`SEND SOCKET MESSAGE '${message}' - connected? ${this.socket.connected}`)

        if (this.socket.connected) {
           this.socket.emit(message, data)
        } else {
           //this.showSocketOfflineMessage()
        }
    }



    ignoreIncomingCall(incomingCallObject){
        Reactotron.log(`socket: IGNORE-INCOMING-CALL from: ${incomingCallObject.callerName}, id: ${incomingCallObject.from_id}, roomName: ${incomingCallObject.roomName}`)
        deviceLog.log(`IGNORE-INCOMING-CALL from: ${incomingCallObject.callerName}, id: ${incomingCallObject.from_id}, roomName: ${incomingCallObject.roomName}`)

        this.stopRingerSound()
        
        this.sendSocketMessage('IGNORE-CALL', {
            from_user: incomingCallObject.from_id,
            room:incomingCallObject.roomName,
            timeout_task_id:incomingCallObject.timeOutTaskId,
            group:incomingCallObject.group,
            sid:incomingCallObject.sid
        })

        this.setState({ incomingCallObject: null, retryCall: false })

    }

    skipCall() {
        const { outgoingCallObject, currentUser, outgoingCallGroupId } = this.state
        
        
        Reactotron.log(`socket: SKIP-GROUP-CALLER: 
            from_user: ${currentUser.id}, 
            to_user: ${outgoingCallObject.incomingUserId},
            timeout_task_id: ${outgoingCallObject.timeOutTaskId},
            group: ${outgoingCallGroupId},
            sid: ${outgoingCallObject.incomingSid},
            room: ${outgoingCallObject.room}`
        )

        deviceLog.log(`SKIP-GROUP-CALLER: 
            from_user: ${currentUser.id}, 
            to_user: ${outgoingCallObject.incomingUserId},
            timeout_task_id: ${outgoingCallObject.timeOutTaskId},
            group: ${outgoingCallGroupId},
            sid: ${outgoingCallObject.incomingSid},
            room: ${outgoingCallObject.room}`
        )

        this.sendSocketMessage('SKIP-GROUP-CALLER', {
            from_user: currentUser.id,
            to_user: outgoingCallObject.incomingUserId,
            timeout_task_id: outgoingCallObject.timeOutTaskId,
            group: outgoingCallGroupId,
            sid: outgoingCallObject.incomingSid,
            room: outgoingCallObject.room,
        })
    }


     //Accept Incoming Call
     acceptCall(incomingCallObject){
        Reactotron.log(`socket: ACCEPT-INCOMING-CALL from: ${incomingCallObject['callerName']}, room: ${incomingCallObject['roomName']}`)
        deviceLog.log(`ACCEPT-INCOMING-CALL from: ${incomingCallObject['callerName']}, room: ${incomingCallObject['roomName']}`)

        const answerData = {
            room: incomingCallObject['roomName'],
            timeout_task_id: incomingCallObject['timeOutTaskId'],
            group: incomingCallObject['group']
        }

        this.stopRingerSound()
        this.sendSocketMessage('ANSWER-CALL', answerData)

        // NOTE: No need to for storing room info here as the BE will send CALL-ACCEPTED as acknowledgment of our answer
        // this.setState({ roomToJoin: incomingCallObject['roomName'] })
    }



    makeGroupCall(outgoingCallObject){
        /*
        const { currentUser, roomToJoin } = this.state

            Check that the user is not on a call on another device. but allow if they are 
            already on a call on this device, (they are adding a caller to an existing call)
        
        if(currentUser.overallStatus !== 'available' && !roomToJoin) {

            Alert.alert(
                'Call Error',
                'You can’t make calls from multiple devices',
                [
                    { text: 'Ok', onPress: () => null },
                ],
                { cancelable: false }
            )

            return null
        }
        */

        const groupId = outgoingCallObject.id

        
        deviceLog.log(LogSeparator())
        Reactotron.log(`socket: CALLING first available: group id: ${groupId}`)
        deviceLog.log(`CALLING first available: group id: ${groupId}`)

        const groupData = {
            group: groupId,
        }

        this.sendSocketMessage('TICKLE-GROUP', groupData)
        this.setState({ outgoingCallGroupId: groupId });
    }

     //Make an outgoing call
    makeCall(outgoingCallObject, patientUserId, patientId){
        const { roomToJoin } = this.state
        // If VC is making a call to a patient, store their patientId. 
        // If adding someone to the call, leave patientId as-is. 
        // Else, set it to 0.
        if(!roomToJoin) {
            global.PATIENT_ID = (patientId) ? patientId : 0
        }

        outgoingCallObject.single_user = true

        var data = null 
        
        deviceLog.log(LogSeparator())
        if(roomToJoin){
            Reactotron.log(`socket: ADDING user: ${outgoingCallObject.displayName}, room: ${roomToJoin}`)
            deviceLog.log(`ADDING user: ${outgoingCallObject.displayName}, room: ${roomToJoin}`)

            if(patientUserId) {
                this.patientUserId = patientUserId

                data = {
                    to_user: outgoingCallObject.id,
                    room:roomToJoin,
                    related_user: patientUserId
                }
            } else {
                this.patientUserId = null

                data = {
                    to_user: outgoingCallObject.id,
                    room:roomToJoin,
                }
            }

        }else{
            Reactotron.log(`socket: CALLING user: ${outgoingCallObject.displayName}, id: ${outgoingCallObject.id}`)
            deviceLog.log(`CALLING user: ${outgoingCallObject.displayName}, id: ${outgoingCallObject.id}`)

            if(patientUserId) {
                this.patientUserId = patientUserId

                data = {
                    to_user: outgoingCallObject.id,
                    related_user: patientUserId
                }
            } else {
                this.patientUserId = null
                
                data = {
                    to_user: outgoingCallObject.id,
                }
            }
        }

        // if a patient is in the call, send their user id along
        if (global.PATIENT_ID) {
            data.patient_id = global.PATIENT_ID
        }
       
        this.sendSocketMessage('TICKLE', data)
        this.setState({ outgoingCallObject: outgoingCallObject, retryCall: false, outgoingCallGroupId: null });
    }


    //Cancel an outgoing call
    cancelCall(outgoingCallObject) {

        const { currentUser } = this.state

        const outGoingUserID = outgoingCallObject.incomingUserId || outgoingCallObject.id

        
        Reactotron.log(`socket: CANCEL CALLING user: ${outgoingCallObject.displayName}, id: ${outGoingUserID}, roomName: ${outgoingCallObject.room}`)
        deviceLog.log(`CANCEL CALLING user: ${outgoingCallObject.displayName}, id: ${outGoingUserID}, roomName: ${outgoingCallObject.room}`)

        this.sendSocketMessage('CANCEL-CALL', {
            to_user: outGoingUserID,
            from_user: currentUser.id,
            room: outgoingCallObject.room
        })

        this.setState({ outgoingCallObject: null, roomToJoin: null, retryCall: false, outgoingCallGroupId: null, showDroppedCall: false });
    }


    retryCallAction(outgoingCallObject) {

        const { outgoingCallGroupId } = this.state

        deviceLog.log(LogSeparator())
        if(outgoingCallGroupId !== null){

            const groupData = {
                group: outgoingCallGroupId
            }
            
            Reactotron.log(`socket: RETRY-CALL-GROUP-CALL: id:${outgoingCallGroupId}`)
            deviceLog.log(`RETRY-CALL-GROUP-CALL: id:${outgoingCallGroupId}`)

            this.sendSocketMessage('TICKLE-GROUP', groupData)

        }else{

            const data = null

            if(this.patientUserId) {
                data = {
                    to_user: outgoingCallObject.id,
                    related_user: this.patientUserId
                }
            } else {
                data = {
                    to_user: outgoingCallObject.id,
                }
            }

            Reactotron.log(`socket: RETRY-CALL-CALL: to_user:${outgoingCallObject.id}`)
            deviceLog.log(`RETRY-CALL-CALL: to_user:${outgoingCallObject.id}`)

            // if a patient is in the call, send their user id along
            if (global.PATIENT_ID) {
                data.patient_id = global.PATIENT_ID
            }

            this.sendSocketMessage('TICKLE', data)
            this.setState({ outgoingCallObject: outgoingCallObject, retryCall: false, outgoingCallGroupId: null });

        }

    }

    refreshEnvironment(){
        //TODO: Close socket and log out, then let that handling clear the token

        
        AsyncStorage.removeItem(AppConfig.AUTH_TOKEN)
        Reactotron.log('Environment Changed, Removed access token')
        deviceLog.log('Environment Changed, Removed access token')
              
        this.setState({ refreshEnv: true })

        Alert.alert(
            'Environment Changed',
            `Please restart the app in order for changes to take effect`,
            [
                // { text: 'Ok', onPress: () => this.setState({ refreshEnv: false }) },
                { text: 'Ok', onPress: () => {
                    Reactotron.log('MUST CLOSE APP')
                    deviceLog.log('MUST CLOSE APP')
                } },
            ],
            { cancelable: false }
        )

    }

    saveCurrentUser(user){
        this.setState({ currentUser: user })
    }

    finishSignout() {
        Reactotron.log("finishSignout()")
        //Clear authentication to force login again
        AsyncStorage.removeItem(AppConfig.AUTH_TOKEN)
        //Clear authentication to force login again
        AsyncStorage.removeItem(AppConfig.USER_NAME)
        // Set VC tab to staff so it goes back to main tab when user logs out
        AsyncStorage.setItem(AppConfig.LAST_TAB, 'staff')
        // Set CC tab to home so it goes back to main tab when user logs out
        AsyncStorage.setItem(AppConfig.LAST_CCTAB, 'home')
        //This will cause app to return to login and clear navigation history
        this.setState( { loggingOut: false, accessToken: null, initialized: false } )
    }

    render() {
        Reactotron.warn("GlobalCallManager RENDER")
        // deviceLog.log("GlobalCallManager RENDER")
        Reactotron.log("GlobalCallManager Current User: ", this.state.currentUser)
        
        const { 
            socketState,
            refreshEnv, 
            loggingOut,
            incomingCallObject,
            outgoingCallObject,
            roomToJoin,
            retryCall,
            currentUser,
            initialized,
            showDroppedCall
        }  = this.state;

        const { children } = this.props;

        const childrenWithProps = React.Children.map(children, child => 
            React.cloneElement(child, {
                currentUser: currentUser,
                saveCurrentUser: this.saveCurrentUser,
                connectToSocket: this.connectToSocket,
                closeSocket: this.closeSocket,
                socketState: socketState,
                incomingCallObject: incomingCallObject,
                ignoreIncomingCall: this.ignoreIncomingCall,
                makeCall: this.makeCall,
                outgoingCallObject: outgoingCallObject,
                cancelCall: this.cancelCall,
                acceptCall: this.acceptCall,
                roomToJoin: roomToJoin,
                makeGroupCall: this.makeGroupCall,
                skipCall: this.skipCall,
                retryCall: retryCall,
                retryCallAction: this.retryCallAction,
                refreshEnvironment: this.refreshEnvironment,
                currentUserId: (currentUser === null) ? null : currentUser.id,
                isVirtualCare: isVirtualCare(),
                triggerLogout: loggingOut && socketState === 'disconnected',
                finishSignout: this.finishSignout,
                showDroppedCall: showDroppedCall
            })
        );

        if (refreshEnv) {
            Reactotron.log(" :: REFRESH")
            // deviceLog.log(" :: REFRESH")
            return <View style={{
                backgroundColor: '#000000',
                position: 'absolute',
                top: 0,
                left: 0,
                width: 1,
                height: 1,
                borderRadius:0,
                borderWidth:0,
                borderColor:'black',
                opacity: 0
                }}
            />
        } else {
            Reactotron.log(" ::::::::::::::: APP ENABLED :: socket state = " + socketState)
            Reactotron.log(" :: APP ENABLED :: socket state = " + socketState
                + " :: initialized? " + initialized
                + " :: roomToJoin? " + roomToJoin
                + " :: loggingOut? " + loggingOut
            )
            if (socketState === 'disconnected' && initialized && roomToJoin === null && !loggingOut) {
                Reactotron.log('WebSocket Disconnected')
                deviceLog.log(`WebSocket Disconnected`)
                return (
                    <View style={{
                        backgroundColor: '#121212',
                        position: 'absolute',
                        top: 28,
                        left: 30,
                        width: 120,
                        height: 120,
                        borderRadius:0,
                        borderWidth:0,
                        borderColor:'black',
                        opacity: 1.0
                        }}
                    />
                )
            } else {
                return (<Fragment>{childrenWithProps}</Fragment>)
            }
        }
    }
}


function _mapStateToProps(state) {
   
    const { hangupPressed } = state['features/toolbox'];

    return {
        hangupPressed: hangupPressed
    };
}

export default translate(connect(_mapStateToProps)(GlobalCallManager));