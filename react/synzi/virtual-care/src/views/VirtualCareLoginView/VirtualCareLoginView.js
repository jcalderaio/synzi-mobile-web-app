import React, { Component, Fragment } from 'react'
import {
    View,
    AsyncStorage,
    Alert,
    ActivityIndicator,
    NativeModules,
    PushNotificationIOS,
    Platform
} from 'react-native';


//GraphQL
import { Mutation, Query } from 'react-apollo'
import jwtDecode from 'jwt-decode'
import deviceLog from 'react-native-device-log'

//Styles
import styles from './styles'

//Shared src
import { AppConfig, LogSeparator, guid } from '../../../../_shared/constants/AppConfig'
import { SynziColor } from '../../../../_shared/Color';
import LargeSynziLogoView from '../../../../_shared/src/atoms/LargeSynziLogoView/LargeSynziLogoView'
import AppVersionLabel from '../../../../_shared/src/atoms/AppVersionLabel/AppVersionLabel'
import AuthQl from '../../../../_shared/graphql/AuthQL'
import EnvManager from '../../../../_shared/services/EnvManager'

//VC Specific
import LoginForm from '../../organisms/LoginForm/LoginForm'
import ForgotPasswordButton from '../../atoms/ForgotPasswordButton/ForgotPasswordButton'

//iOS Notifications
import PushNotification from 'react-native-push-notification'

//Orientation
import Orientation from 'react-native-orientation-locker'
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'

// Check if user needs to download new version
import DeviceInfo from 'react-native-device-info';
import AppLink from 'react-native-app-link';
import EnvQL from '../../../../_shared/graphql/EnvQL'

// Toast Message
import { showMessage } from "react-native-flash-message"

import Reactotron from 'reactotron-react-native'

export default class VirtualCareLoginView extends Component {

    constructor(props) {
        super(props)

        let defaultUsername = ''
        let defaultPassword = ''
        if (__DEV__) {
            switch (EnvManager.getInstance().getCode()) {
                default: 
                    defaultUsername = 'mmg-eddr1'
                    defaultPassword = 'Synzi123#'
            }
        }

        this.state = {
            username: defaultUsername, 
            password: defaultPassword,
            loginLoading: false,
            errorMessage: '',
            loading: true,
            modalPickerVisible: false,
            userId: null,
            deviceId: guid(),
            platform: Platform.OS === 'ios' ? 'ios' : 'android',
            userData: null,
            checkLogin: false,
            loggedIn: false,
            hasMinimumVersion: true,
            fetchedvcMinVersion: false,
            showError: false
        }

        this.handleUserNameChange = this.handleUserNameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleFiveTap = this.handleFiveTap.bind(this)
        this.handleEnvironmentPickerTap = this.handleEnvironmentPickerTap.bind(this)
        this.handlePasswordReset = this.handlePasswordReset.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.handlePasswordExpiration = this.handlePasswordExpiration.bind(this)
       
    }

    componentWillMount() {
        Reactotron.log(`VirtualCareLoginView CWM`)
        // Loads username after first successful login with that username
        this.loadFromStorage(AppConfig.USER_NAME);
    }

    // This loads username from storage after first successful login saves the username
    async loadFromStorage(key) {
        try {
            await AsyncStorage.getItem(key)
              .then(value => {
                if (value !== null) {
                  this.setState({ username: value });
                }
              })
              .done();
        } catch (error) {
            Reactotron.log(error);
        }
    };

    componentDidMount(){

        //Lock to portriat
        if(!allowSidebar) {
            Orientation.lockToPortrait(); 
        }
        
        //Push Token For Android
        if (NativeModules.AppInfo && Platform.OS === 'android') {
            NativeModules.AppInfo.getToken(
                (error) => {
                    
                    Reactotron.log(`ANDROID-PUSH-TOKEN Error: ${error}`)
                    deviceLog.log(`ANDROID-PUSH-TOKEN Error: ${error}`)
                    Reactotron.log('hello rendering world')
                },
                (token) => {
                    
                    Reactotron.log(`ANDROID-PUSH-TOKEN: ${token}`)
                    deviceLog.log(`ANDROID-PUSH-TOKEN: ${token}`)
                    this.setState({ deviceId: token, platform: 'android' })
                },
            )
        }

        //Push Token for IOS
        if(Platform.OS == 'ios'){
            
            PushNotification.configure({

                onRegister: function(tokenData) {
                    
                    let token = tokenData['token']
                    Reactotron.log(`IOS PUSH-TOKEN: ${token}`)
                    deviceLog.log(`IOS PUSH-TOKEN: ${token}`)
                    Reactotron.log(`IOS PUSH-TOKEN: ${token}`)
                    this.setState({ deviceId: token, platform: 'ios'  })
                }.bind(this),
            
                // (required) Called when a remote or local notification is opened or received
                onNotification: function(notification) {
                    Reactotron.log( 'IOS NOTIFICATION:', notification );
                    notification.finish(PushNotificationIOS.FetchResult.NoData);
                }.bind(this),
            
                // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
                senderID: "YOUR GCM (OR FCM) SENDER ID",
            
                // IOS ONLY (optional): default: all - Permissions to register.
                permissions: {
                    alert: true,
                    badge: true,
                    sound: true
                },
            
                // Should the initial notification be popped automatically
                // default: true
                popInitialNotification: true,
            
                /**
                  * (optional) default: true
                  * - Specified if permissions (ios) and token (android and ios) will requested or not,
                  * - if not, you must call PushNotificationsHandler.requestPermissions() later
                  */
                requestPermissions: true,
            });
        }
            
        //Load any saved login token
        this.loadToken().done();
    }

    componentWillUnmount(){
        if(allowSidebar) {
            Orientation.unlockAllOrientations()
        }
    }

    componentDidUpdate() {

        const { refreshEnv } = this.props.screenProps
        
        if(refreshEnv){

            this.loadToken().done();
            this.props.screenProps.environmentReset()
        }
        
    }


    handleLogout(){
        //Orientation.lockToPortrait()
        this.setState({ userData: null, checkLogin: false })
        this.props.screenProps.closeSocket(true)
        AsyncStorage.removeItem(AppConfig.AUTH_TOKEN)
        this.setState({ loading: false })
    }

    
    async loadToken(){
        try{

            /** Attempt to get saved values for the user. 
             * Token and UserID are set during the initial login */

            var value = await AsyncStorage.multiGet([AppConfig.AUTH_TOKEN, AppConfig.USER_ID]);

            //We have a token and user id, nivigate to the dashboard
            if(value[0][1] != null && 
                value[1][1] != null){
                
                let token = value[0][1]
                let userId = value[1][1]
 
                
                Reactotron.log(`Login Token Found, UserID: ${value[1][1]}`)
                deviceLog.log(`Login Token Found, UserID: ${value[1][1]}`)
                
                //Navigate to Dashboard
                this.props.navigation.navigate('Dashboard', {
                    userId: userId,
                    accessToken: token,
                    handleLogout: this.handleLogout
                });
        
            }else{

                
                Reactotron.error('No Login Token Found, Please Login')
                deviceLog.log('No Login Token Found, Please Login')
 
                //Clear navigation history
                this.props.navigation.popToTop()
                
                this.setState({ loading: false })

            }

        } catch(error){
            
            Reactotron.error('Error getting login token ', error)
            deviceLog.log(`Error getting login token: ${error}`)

            this.setState({ loading: false })
        }
    }


    handleUserNameChange(text) {
        this.setState({ username: text })
    }

    handlePasswordChange(text) {
        this.setState({ password: text })
    }

    handlePasswordExpiration(daysTillExpiration, expirationCutoff, userId, accessToken) {
        if(daysTillExpiration <= expirationCutoff) {
            if(daysTillExpiration <= 0) {
                Alert.alert(
                    'Password Warning',
                    "Your password is expired. Please use the `Forgot Password' button on the bottom of the Login Page to reset your password",
                    [
                        { text: 'Go to Login', onPress: () => this.handleLogout() },
                    ],
                    { cancelable: false }
                )
            } 
            else {
                Alert.alert(
                    'Password Warning',
                    `Your password expires in ${daysTillExpiration} days. Please use the 'Forgot Password' button on the bottom of the Login Page to reset your password`,
                    [
                        { text: 'Go to Login', onPress: () => this.handleLogout() },
                        { text: 'Continue to App', onPress: () => this.handleLoginSuccess(userId, accessToken) }
                    ],
                    { cancelable: false }
                )
            }
        } else {
            this.handleLoginSuccess(userId, accessToken)
        }

        return(
            <View style={styles.loadingContainerStyle}>{this.renderLoadingState()}</View>
        )
    }

    checkIfNewerVersion = () => {
        const vcMinVersion = global.SYNZI_vcMinVersion

        const currentVersion = DeviceInfo.getReadableVersion().split(".")
        const platform = Platform.OS

        const newestVersion = vcMinVersion.split(".")
            
        let updateFlag = false
        for(var i = 0; i < 3; ++i) {
            if(Number(newestVersion[i]) > Number(currentVersion[i])) {
                updateFlag = true
                break
            } else if(Number(newestVersion[i]) === Number(currentVersion[i])) {
                continue
            } else {
                updateFlag = false
                break
            }
        }

        if(updateFlag) {
            this.setState({ hasMinimumVersion: false, loginLoading: false })
            Alert.alert(
                'Please Update This App',
                "Please upgrade this app to ensure full functionality.",
                [
                    { text: 'Update', onPress: () => {
                        if(platform === 'ios') {
                            AppLink.maybeOpenURL('https://itunes.apple.com/us/app/synzi-virtual-care/id1382769792', { appName: 'Virtual Care', appStoreId: '1382769792' }).done()
                        } else {
                            AppLink.maybeOpenURL('https://play.google.com/store/apps/details?id=com.synzi.virtualcare', { appName: 'Virtual Care', playStoreId: 'com.synzi.virtualcare' }).done()
                        }
                    }},
                ],
                { cancelable: false }
            )
        } else {
            this.setState({ hasMinimumVersion: true })
        }
    }

    handleLoginSuccess = (userId, accessToken) => {
        const { username } = this.state

        Reactotron.log(`Login Success: token: ${accessToken}`)
        deviceLog.log(`Login Success: token: ${accessToken}`)

        //Save items to local storage
        AsyncStorage.setItem(AppConfig.USER_NAME, username)

        //Set the state
        this.setState({ loginLoading: false, loggedIn: true})

        this.props.navigation.navigate('Dashboard', {
            userId: userId,
            accessToken: accessToken,
            handleLogout: this.handleLogout
        });
        
    }


    handleLoginError = error => {

        Reactotron.log(`SignIn Error: ${error}`)
        deviceLog.log(`SignIn Error: ${error}`)

        let errorMessage = error.message
    
        if (error.message.includes('Max Attempts Exceeded')) {
            errorMessage = `Account locked due to too many invalid password attempts. Please contact an administrator, or use the 'Forgot Password' button (below) to reset your password`
        } 
        else if (error.message.includes('Bad Username or Password')) {
           errorMessage = 'Sorry, we can\'t find that username and password combination.'
        }
        else if (error.message.includes('Inactive Enterprise') || error.message.includes('Inactive User')) {
            errorMessage = 'Access not allowed. Please contact an administrator to access this application.'
        }
        else if (error.message.includes('Password Expired')) {
            errorMessage = 'Your password is expired. Please contact an administrator to reset your password.'
        }

        Reactotron.log(`SignIn Error: ${errorMessage}`)
        deviceLog.log(`SignIn Error: ${errorMessage}`)

        showMessage({
            message: 'Sign In Error',
            description: errorMessage,
            backgroundColor: SynziColor.SYNZI_YELLOW,
            icon: "warning",
            duration: 6000
        });

        this.setState({ loginLoading: false })
    }

    handlePasswordReset(){
        this.props.navigation.navigate('ForgotPasswordModal')
    }

    handleFiveTap(){
        this.props.navigation.navigate('LogsModal')
    }


    handleEnvironmentPickerTap(){
        this.props.navigation.navigate('EnvModal')
    }

    renderLoadingState(){
        return(
            <ActivityIndicator size={'large'} />
        )
    }

    render(){

        const {
            username,
            password,
            errorMessage,
            loading,
            deviceId,
            platform,
            loginLoading,
            checkLogin,
            userData,
            loggedIn,
            hasMinimumVersion,
            fetchedvcMinVersion,
            showError
        } = this.state

        const app = 'care'

        const loginError = this.props.navigation.getParam('userLoginError');

        if(loginError === 'Token expired' && !showError) {
            showMessage({
                message: "You have been logged out",
                description: "We log users out after a period of inactivity to ensure your account remains secure.",
                backgroundColor: SynziColor.SYNZI_YELLOW,
                icon: "warning",
                duration: 7000
            });
            this.setState({ showError: true })
        }

        if(loading && !loginError){
            return(
                <View style={styles.loadingContainerStyle}>{this.renderLoadingState()}</View>
            )
        }

        if(!fetchedvcMinVersion) {

            const VERSION_QUERY = EnvQL.currentEnv()
      
            return (
              <Query
                query={VERSION_QUERY}
                fetchPolicy={'network-only'}
              >
                {({ loading, error, data }) => {
                    if(error) {
                      Reactotron.error(`GetPasswordExpiration Error: ${error.message}`)
                    }
      
                    if(loading) {
                        return(
                            <View style={styles.loadingContainerStyle}>{this.renderLoadingState()}</View>
                        )
                    }
      
                    if(data && data.currentEnv) {
      
                      global.SYNZI_vcMinVersion = data.currentEnv.vcMinVersion
      
                      this.setState({ fetchedvcMinVersion: true })
      
                      return(
                        <View style={styles.loadingContainerStyle}>{this.renderLoadingState()}</View>
                    )
      
                    }
        
                    return(
                        <View style={styles.loadingContainerStyle}>{this.renderLoadingState()}</View>
                    )
                    
                }}
              </Query>
            )
        }
        
        if(!loggedIn && checkLogin && userData && hasMinimumVersion) {
            const { accessToken } = userData.tokenAuth
            let token = accessToken
            
            const decoded = jwtDecode(token)
            const userId = decoded.identity.user_id.toString()

            //Save AUTH_TOKEN to storage to use token on headers and run query
            AsyncStorage.multiSet([[AppConfig.AUTH_TOKEN, token], [AppConfig.USER_ID, userId]])

            const GET_PASSWORD_EXPIRATION = AuthQl.checkPasswordExpiration()

            return (
                <Query
                  query={GET_PASSWORD_EXPIRATION}
                  variables={{ userId }}
                  fetchPolicy={'network-only'}
                >
                  {({ loading, error, data }) => {
                      if(error) {
                        Reactotron.error(`GetPasswordExpiration Error: ${error.message}`)
                      }

                      if(!loading && data && data.user && data.user.credentials && data.user.enterprise) {
                        const daysToExpiration = data.user.credentials.daysToExpire
                        const expirationCutoff = data.user.enterprise.staffPasswordWarning

                        return <Fragment>{this.handlePasswordExpiration(daysToExpiration, expirationCutoff, userId, accessToken)}</Fragment>
                      }
          
                      return(
                        <View style={styles.loadingContainerStyle}>{this.renderLoadingState()}</View>
                      )
                      
                  }}
                </Query>
            )

        }

        return(
            <Mutation
                mutation={AuthQl.login()}
                variables={{username, password, app, deviceId, platform}}
                onCompleted={data => this.setState({ userData: data, checkLogin: true })}
                onError={error => this.handleLoginError(error)}>
                {(mutate, {client}) => (
                    <View style={styles.mainContainerStyle}>
                        <View />
                        <View style={styles.loginGroupStyle}>
                        <View style={styles.sepStyle}/>
                            <LargeSynziLogoView 
                                style={styles.logoStyle}
                                isBlue={true}
                                logoFivePressTap={this.handleEnvironmentPickerTap}
                            />
                            <LoginForm
                                onSignin={e => {
                                    
                                    Reactotron.log(`Sign In:, username: ${username}, password: ${password}, app: ${app}, deviceId: ${deviceId}, platform: ${platform}, env: ${EnvManager.getInstance().getEnvShortName()}`)
                                    deviceLog.log(`Sign In:, username: ${username}, password: ${password}, app: ${app}, deviceId: ${deviceId}, platform: ${platform}, env: ${EnvManager.getInstance().getEnvShortName()}`)
                                    this.setState({ loginLoading: true })
                                    this.checkIfNewerVersion()
                                    e.preventDefault()
                                    client.resetStore().then(() => {
                                        mutate()
                                    })
                                }}
                                loginLoading={loginLoading}
                                username={username}
                                password={password}
                                onUserNameChange={this.handleUserNameChange}
                                onPasswordChange={this.handlePasswordChange}
                                errorMessage={errorMessage}
                            />
                            <ForgotPasswordButton
                                onPress={this.handlePasswordReset}
                            />
                        </View>
                        <View style={styles.sepStyle}/>
                        <AppVersionLabel
                            fivePressTap={this.handleFiveTap}
                        />
                    </View>
                )}
            </Mutation>
        )
        
    }

}