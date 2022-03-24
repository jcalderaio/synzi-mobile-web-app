import React, { Component, Fragment } from 'react'
import {
  View,
  Text, 
  Image, 
  Platform, 
  AsyncStorage, 
  Alert, 
  ActivityIndicator, 
  NativeModules, 
  PushNotificationIOS, 
  StatusBar, 
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import PhoneNumberForm from '../../organisms/PhoneNumberForm/PhoneNumberForm'
import EnterpriseLogo from '../../atoms/EnterpriseLogo/EnterpriseLogo'

//GraphQL
import { Query, Mutation } from 'react-apollo'
import jwtDecode from 'jwt-decode'
import deviceLog from 'react-native-device-log'
import AuthQL from '../../graphql/AuthQL'
import AuthUtils from '../../../../_shared/helpers/AuthUtils'

// Shared src
import { AppConfig, LogSeparator } from '../../../../_shared/constants/AppConfig'
import { formatPhone }  from '../../../../_shared/helpers/Helpers'

import AppVersionLabel from '../../../../_shared/src/atoms/AppVersionLabel/AppVersionLabel'
import EnvManager from '../../../../_shared/services/EnvManager'
import PushNotification from 'react-native-push-notification'

import {SynziColor} from '../../../../_shared/Color'
import SynziTapableLogoView from '../../../../_shared/src/atoms/SynziTapableLogoView/SynziTapableLogoView'
import Reactotron from 'reactotron-react-native'

// Check if user needs to download new version
import DeviceInfo from 'react-native-device-info';
import AppLink from 'react-native-app-link';

import EnvQL from '../../../../_shared/graphql/EnvQL'
import AuthQl from '../../../../_shared/graphql/AuthQL'

// Toast Message
import { showMessage } from "react-native-flash-message"

//Styles
import styles from './styles';

export default class CaregiverLoginScreen extends Component {
  // Adds a header to this screen
  static navigationOptions = ({navigation}) => ({
    headerStyle: {
        backgroundColor: SynziColor.SYNZI_WHITE,
        marginTop: 10
    },
    gesturesEnabled: false,
    // Hides the back button on this screen
    headerLeft: null,
    // Sets the color of the buttons in the header
    headerTintColor: SynziColor.SYNZI_BLUE,
    headerTitle: 
    <SynziTapableLogoView
        nav = {navigation}
    />
  })

  constructor(props) {
    super(props)

    this.state = {
      userChanged: false,
      triggerLogout: false,
      username: '',
      displayName: '',
      rawPhone: '',
      formattedPhone: '',
      errorMessage: '',
      screenLoading: true,
      modalPickerVisible: false,
      userId: null,
      deviceId: 'iOS-Sim',          // Carolyn said send the same as Virtual Care
      platform: Platform.OS === 'ios' ? 'ios' : 'android',   // Carolyn said send the same as Virtual Care
      app: 'connect',    // Carolyn said this will be 'connect'
      navigateToDashboard: false,
      getEntepriseData: false,
      enterpriseId: '',
      inviteToken: '',
      entId: '',
      logoImage: '',
      fetchedccMinVersion: false,
      hasMinimumVersion: true
    }

    this.handleEnvPicker = this.handleEnvPicker.bind(this)
    this.handleFiveTap = this.handleFiveTap.bind(this)
    //this.handleLogout = this.handleLogout.bind(this)
  }

  async componentDidMount() {
        /** TODO: unify all the push notification code into a shared class (SynziRootView perhaps) */
        //Push Token For Android
        if (NativeModules.AppInfo && Platform.OS === 'android') {
          NativeModules.AppInfo.getToken(
            (error) => {
              
              Reactotron.log(`ANDROID-PUSH-TOKEN Error: ${error}`)
              deviceLog.log(`ANDROID-PUSH-TOKEN Error: ${error}`)
            },
            (token) => {
              
              Reactotron.log(`ANDROID-PUSH-TOKEN: ${token}`)
              deviceLog.log(`ANDROID-PUSH-TOKEN: ${token}`)
              this.setState({ deviceId: token })
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
                this.setState({ deviceId: token })
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

      this.processTokenOrStoredLogin()
      this.setState({screenLoading: false})
      this.props.navigation.setParams({ handleEnvPicker: this.handleEnvPicker })

    }
    
    async processTokenOrStoredLogin() {
        /**
         *     If directed here by branch.io
         *     or
         *     USER ENTERED TOKEN MANUALLY FROM ACCESS CODE SCREEN, 
         *     and sets it as the invite link token,
         *     pick username off of the invite code
        */
        // 
        // Reactotron.log("processTokenOrStoredLogin :: this.props.navigation = ", this.props.navigation)
        // deviceLog.log(LogSeparator())
        // deviceLog.log("processTokenOrStoredLogin :: this.props.navigation = ", this.props.navigation)
        Reactotron.log(`No Login token found - process invite token`)

        const { params } = this.props.navigation.state;
        let inviteCode = params ? params.inviteCode : null;
        let username = ''
        let entId = ''
        let displayName = ''
        // If coming from Access Code Screen
        if(inviteCode != null) {
          await AuthUtils.setCurrentInviteToken(inviteCode)
          Reactotron.log(`Param from Invite Screen = InviteToken: ${inviteCode}`)
        } 
        // If sent here from Logout OR InviteCode screen
        else {
          inviteCode = await AuthUtils.getCurrentInviteToken()
          Reactotron.log(`Use Stored Invite token`)
        }

        // Set invite code on Async Storage
        await AuthUtils.setInviteToken(inviteCode)
        username = await AuthUtils.getUsernameFromInvite()
        displayName = await AuthUtils.getDisplayNameFromInviteToken()
        entId = await AuthUtils.getEnterpriseIdFromInviteToken()
        Reactotron.log(`username: ${username}`)

        // Reactotron.log("username changing? ", username, this.state.username)
        // Reactotron.log("displayName changing? ", displayName, this.state.displayName)
        // Reactotron.log("entId changing? ", entId, this.state.entId)
        if (username !== this.state.username
          || displayName !== this.state.displayName
          || entId !== this.state.entId
        ) {
          Reactotron.log("****** CAREGIVER USER CHANGING - SET STATE")
          await AuthUtils.setNewInviteToken('')
          const isLoggedIn = await AuthUtils.loggedIn()
          this.setState({ username, displayName, entId, userChanged: true, triggerLogout: isLoggedIn })
        }
  }

  async componentWillUpdate() {
    //Reactotron.log("PatientLoginScreen componentWillUpdate() :: props:", this.props, ":: state", this.state)
    setTimeout(() => {
      this.processTokenOrStoredLogin()
    }, 20)
  }

  componentDidUpdate() {
    //Reactotron.log("*** PatientLoginScreen componentDidUpdate()")

    const { refreshEnv } = this.props.screenProps
    
    if(refreshEnv){

        this.loadToken().done();
        this.props.screenProps.environmentReset()
    }
  }

  checkIfNewerVersion = () => {
      const ccMinVersion = global.SYNZI_ccMinVersion

      const currentVersion = DeviceInfo.getReadableVersion().split(".")
      const platform = Platform.OS

      const newestVersion = ccMinVersion.split(".")
          
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
        this.setState({ hasMinimumVersion: false, screenLoading: false })
        Alert.alert(
            'Please Update This App',
            "Please upgrade this app to ensure full functionality.",
            [
                { text: 'Update', onPress: () => {
                    if(platform === 'ios') {
                        AppLink.maybeOpenURL('https://itunes.apple.com/us/app/synzi-care-connect/id1438109873', { appName: 'Care Connect', appStoreId: '1438109873' }).done()
                    } else {
                        AppLink.maybeOpenURL('https://play.google.com/store/apps/details?id=com.synzi.careconnect', { appName: 'Care Connect', playStoreId: 'com.synzi.careconnect' }).done()
                    }
                }},
            ],
            { cancelable: false }
        )
      } else {
        this.setState({ hasMinimumVersion: true })
     }
  }

  handleFiveTap(){
    this.props.navigation.navigate('LogsModal')
  }

  handleEnvPicker(){
    this.props.navigation.navigate('EnvModal')
  } 

  async handleLoginSuccess (data) {
      const { hasMinimumVersion } = this.state

      if(hasMinimumVersion) {
        const { accessToken } = data.caregiverTokenAuth
        // Save token to local storage
        await AuthUtils.setToken(accessToken)
        
        Reactotron.log(`Caregiver Login Success: token: ${accessToken}`)
        deviceLog.log(`Caregiver Login Success: token: ${accessToken}`)

        const decoded = jwtDecode(accessToken)
        const userId = decoded.identity.user_id.toString()

        // Set username in AsyncStorage
        await AuthUtils.setUsername(this.state.username)

        // Lock in invite token in AsyncStorage
        const inviteCode = await AuthUtils.getInviteToken()
        await AuthUtils.setCurrentInviteToken(inviteCode)
        await AuthUtils.setUserType(AppConfig.USER_TYPE_CAREGIVER)
        await AuthUtils.setNewInviteToken('')

        this.setState({ rawPhone: '', formattedPhone: '', getEntepriseData: true, userId, screenLoading: false, userChanged: false, triggerLogout: false })

        this.props.navigation.navigate('AppContainer', {
          userId,
          userType: AppConfig.USER_TYPE_CAREGIVER
        });
      }
  }


  handleLoginError = error => {

    Reactotron.log(`SignIn Error: token: ${error}`)
    deviceLog.log(`SignIn Error: token: ${error}`)

    Reactotron.log(`Tried signing in with username: ${this.state.username}`)
    deviceLog.log(`Tried signing in with username: ${this.state.username}`)

    Reactotron.log(`Tried signing in with phone: ${this.state.rawPhone}`)
    deviceLog.log(`Tried signing in with phone: ${this.state.rawPhone}`)

    let errorMessage = error.message

    if (this.state.rawPhone === '') {
      errorMessage = 'Please enter your phone number.'
    } 
    else if (error.message.includes('Incorrect Phone')) {
      errorMessage = 'Sorry, the phone number you entered does not match our records.'
    } 
    else if (error.message.includes('Inactive Enterprise') || error.message.includes('Inactive User')) {
      errorMessage = 'Access not allowed. Please contact an administrator to access this application.'
    }

    showMessage({
      message: 'Sign In Error',
      description: errorMessage,
      backgroundColor: SynziColor.SYNZI_YELLOW,
      icon: "warning",
      duration: 6000
    });

    this.setState({ rawPhone: '', formattedPhone: '', screenLoading: false })
  }

  render() {
    /** Only affects iOS */
    StatusBar.setBarStyle('dark-content', true)
    StatusBar.setBackgroundColor('white')

    const {
      username,
      displayName,
      rawPhone,
      formattedPhone,
      app,
      deviceId,
      platform,
      errorMessage,
      screenLoading,
      entId,
      fetchedccMinVersion,
      userChanged, 
      triggerLogout
    } = this.state

    if(!fetchedccMinVersion) {

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
                  <View style={styles.loadingContainerStyle}>
                    <ActivityIndicator size={'large'} />
                  </View>
                )
              }

              if(data && data.currentEnv) {

                global.SYNZI_ccMinVersion = data.currentEnv.ccMinVersion

                this.setState({ fetchedccMinVersion: true })

                return (
                  <View style={styles.loadingContainerStyle}>
                    <ActivityIndicator size={'large'} />
                  </View>
                )

              }
  
              return(
                  <View style={styles.loadingContainerStyle}>
                    <ActivityIndicator size={'large'} />
                  </View>
              )
              
          }}
        </Query>
      )
    }

    Reactotron.log("=> CaregiverLoginScreen user changed? ", userChanged, "triggerLogout? ", triggerLogout)

    if(triggerLogout) {
      return(
        <Mutation
            mutation={AuthQl.logout()}
            onCompleted={(data) => {
                Reactotron.error(" =====> auto-signout complete: ", data)
                deviceLog.log('Auto-signout Complete: ' + data)
                this.props.screenProps.finishSignout()
            }}
            onError={error => {
                Reactotron.error(" =====> auto-signout error: ", error)
                deviceLog.log('Auto-signout Error: ' + error.message)
                this.props.screenProps.finishSignout()
            }}
          >
            {(signOut, {client, loading: signOutLoading, called}) => {
                if(!signOutLoading && !called) {
                  client.clearStore().then(() => {
                    signOut().then(async () => {
                      newToken = await AuthUtils.getInviteToken()
                      await AuthUtils.setNewInviteToken(newToken)
                      AsyncStorage.removeItem(AppConfig.AUTH_TOKEN)
                      AsyncStorage.setItem(AppConfig.LAST_CCTAB, 'home')
                      this.setState({ triggerLogout: false })
                    })
                  })
                }
                return null
            }}
        </Mutation>
      )
    }
    
    return (
      <Mutation
        mutation={AuthQL.caregiverLogin()}
        variables={{username, phone: rawPhone, app, deviceId, platform}}
        onCompleted={data => this.handleLoginSuccess(data)}
        onError={error => this.handleLoginError(error)}>
          {(mutate, {client, loading: loginLoading}) => (
            <View style={styles.outerContainer}>
              <EnterpriseLogo entId={entId} />
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.mainContainerStyle}>
                <View style={styles.smallSepStyle}>
                  <Text style={styles.titleTextStyle}>Welcome to Care Connect{displayName ? `, ${displayName}` : ''} </Text>
                  <View>
                    <Text style={styles.messageTextStyle}>Before we begin I need to confirm your identity.</Text>
                    <Text style={styles.messageTextStyle}>Please enter your mobile phone number to continue.</Text>
                  </View>
                </View>
                <View />
                <View style={styles.loginGroupStyle}>
                  <PhoneNumberForm 
                    onSignin={() => {
                      this.checkIfNewerVersion()
                      client.resetStore().then(() => {
                        mutate()
                      })
                    }}
                    loginLoading={loginLoading}
                    formattedPhone={formattedPhone}
                    handleChangePhone={phone => this.setState(formatPhone(phone))}
                  />
                </View>
                <AppVersionLabel
                    fivePressTap={this.handleFiveTap}
                />
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
      </Mutation>
    )
  }
}