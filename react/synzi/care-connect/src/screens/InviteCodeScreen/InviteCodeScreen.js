import React, { Component } from 'react';
import { View, Text, StatusBar, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import InviteCodeForm from '../../organisms/InviteCodeForm/InviteCodeForm'
import deviceLog from 'react-native-device-log'
import AppVersionLabel from '../../../../_shared/src/atoms/AppVersionLabel/AppVersionLabel'
import EnvManager from '../../../../_shared/services/EnvManager'
import AuthUtils from '../../../../_shared/helpers/AuthUtils'
import branch from 'react-native-branch'
import { StackActions, NavigationActions } from 'react-navigation';

// Shared src
import { AppConfig } from '../../../../_shared/constants/AppConfig'

//Styles
import styles from './styles';  

import {SynziColor} from '../../../../_shared/Color'
import SynziTapableLogoView from '../../../../_shared/src/atoms/SynziTapableLogoView/SynziTapableLogoView'

//Orientation
import Orientation from 'react-native-orientation-locker'
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'

import Reactotron from 'reactotron-react-native'


// The user will rarely start on this screen. However, when they do, they will type in an invite token (like we have hardcoded here).
export default class InviteCodeScreen extends Component {
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

    let defaultInviteCode = ''
    switch (EnvManager.getInstance().getCode()) {
      case 'dev-stg':
        //ENV: "dev-stg", Display: "Jack Toledo", DOB: "01/01/2018", Branch Link: "https://vcare.app.link/1122"
        defaultInviteCode = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NTQ5MTA4NDIsIm5iZiI6MTU1NDkxMDg0MiwianRpIjoiNGFhZjE5NWUtYWNjOS00MjQyLWJjYWMtMDk3MDUzZWY4NWY3IiwiZXhwIjoxNTU0OTk3MjQyLCJpZGVudGl0eSI6eyJ1c2VybmFtZSI6InBhdGllbnQtMS0yMDE5MDQxMHQxNTQwMDY0MjQzMTEwMDAwIiwidXNlcl9pZCI6MTE5LCJkaXNwbGF5X25hbWUiOiJUZXN0IFVzZXIiLCJlbnRlcnByaXNlX2lkIjoxfSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.liPpfEv0rtdtLEsEoauo1-xnh-KVe3okI6zDU349h-8"
        break;
      default:
        // leave empty string
    }

    this.state = {
      inviteCode: defaultInviteCode,
      loginLoading: false,
      loading: true,
      errorMessage: '',
      modalPickerVisible: false,
    }

    this.handleLaunchWithInviteCode = this.handleLaunchWithInviteCode.bind(this)
    this.handleInviteCodeChange = this.handleInviteCodeChange.bind(this)
    this.handleEnvPicker = this.handleEnvPicker.bind(this)
    this.handleFiveTap = this.handleFiveTap.bind(this)
    this.trackBranchLinks = this.trackBranchLinks.bind(this)
  }

  componentWillMount() {
    this.props.navigation.popToTop()
    // Reactotron.log("******************************* MOUNT *******************************")
    branch.subscribe(this.trackBranchLinks)
  }

  componentWillUnmount() {
    if(allowSidebar) {
      Orientation.unlockAllOrientations()
    }
    
    // Reactotron.log("****************************** UNMOUNT ******************************")
    // NOTE: If unsubscribe can be made to work, then move subscribe to componentDidMount
    // branch.unsubscribe(this.trackBranchLinks)
  }

  async trackBranchLinks({ error, params }) {
      if (error) {
        Reactotron.error('*****************   Error from Branch:  ***************** ' + error)
        return
      }
    
      // params will never be null if error is null
      //Reactotron.log('=====> BRANCH PARAMS: ', params)
    
      // NOTE from CRB: Looks like token is coming through params even on iOS
      if (params['token']) {
        const inviteCode = params['token']
        Reactotron.log("*****************   Branch is working where invite token is: ", inviteCode, " *****************")
        // handle this launch with fallback when nav fails because component isn't ready to navigate yet

        let userType = AuthUtils.decodeUserTypeFromToken(inviteCode)

        if(!userType) {
          const userId = AuthUtils.decodeUserIdFromToken(inviteCode)
          this.props.navigation.navigate('RefetchInvite', { userId, code: 'newInviteToken' })
        } else {
          await AuthUtils.setNewInviteToken(inviteCode)
        }

        this.loadToken()
        // Route non-Branch URL if appropriate.
        return
      }
    
      if (!params['+clicked_branch_link']) {
        // Indicates initialization success and some other conditions.
        // No link was opened.
        Reactotron.log("*****************   Branch Initialization success, but no link opened *****************")
        return
      }
    
      // A Branch link was opened.
      // Route link based on data in params.
        Reactotron.log("*****************   Branch link opened - no token found in params: ", params, " *****************")
  }

  async componentDidMount() {
    //Lock to portriat
    if(!allowSidebar) {
      Orientation.lockToPortrait(); 
    }

    // Reactotron.log("*** InviteCodeScreen.componentDidMount()")
    // Load any saved login token
    this.loadToken().done()
    this.props.navigation.setParams({ handleEnvPicker: this.handleEnvPicker })
  }

  async loadToken(){
    Reactotron.log("****************************** LOAD TOKEN ******************************")
    //Reactotron.log("InviteCodeScreen.loadToken() :: this.props.navigation.state = ", this.props.navigation.state)
    

    try{
        let token = await AuthUtils.getToken()
        let username = await AuthUtils.getUsername()
        let userId = await AuthUtils.getUserId()
        let userType = await AuthUtils.getUserType()

        Reactotron.warn(`*** previous login: , ${username}, ${userId}, ${userType}`)

        /** Check branch.io and use it to change user. 
         * Stored when branch subscription is triggered. */

        const newInviteCode = await AuthUtils.getNewInviteToken()
        if (newInviteCode !== '') {
          let newUser = AuthUtils.decodeUsernameFromToken(newInviteCode)
          let newUserType = AuthUtils.decodeUserTypeFromToken(newInviteCode)
          Reactotron.warn(`****** new username= ${newUser}, new userType= ${newUserType}, previous username= ${username}, previous userType= ${userType}`)

          if (!token || newUser !== username) {
            //switch users
            Reactotron.log("*** SWITCH USERS")
            deviceLog.log("*** SWITCH USERS")
            Reactotron.warn("*** SWITCH USERS")
            this.handleLaunchWithInviteCode(newInviteCode, newUserType)
            return
          } // else keep current login
        }

        /** Attempt to get saved values for the user:
         * Token and Username are set during the initial login
         * Invite Code set on PatientLoginScreen load */

        if(token != null && username != null){
          // AuthToken AND username found in local storage. Go to Dashboard.
            
          Reactotron.log(`Login Token Found, LoginToken: ${token}`)
          deviceLog.log(`Login Token Found, LoginToken: ${token}`)

          Reactotron.log(`Login Token Found, Username: ${username}`)
          deviceLog.log(`Login Token Found, Username: ${username}`)

          Reactotron.warn(`*** Login Token Found, Username: ${username}, UserType: ${userType}`)
          
          //Navigate to Dashboard
          if(userType === AppConfig.USER_TYPE_CAREGIVER) {
            this.props.navigation.navigate('caregiverDrawerStack');
          } else {
            this.props.navigation.navigate('patientDrawerStack');
          }
        } else {
          // No previous login to fall back on so look for previous invite

          let inviteCode = await AuthUtils.getInviteToken()

          if (inviteCode !== '') {
            let userType = AuthUtils.decodeUserTypeFromToken(inviteCode)

            if(!userType) {
              const userId = AuthUtils.decodeUserIdFromToken(inviteCode)
              this.props.navigation.navigate('RefetchInvite', { userId, code: 'inviteToken' })
              inviteCode = await AuthUtils.getInviteToken()
              userType = AuthUtils.decodeUserTypeFromToken(inviteCode)
            } 
            // Already been to birthdate screen, so go back there
            Reactotron.error('No Login Token Found, Please Login using invite token')
            deviceLog.log('No Login Token Found, Please Login using invite token')
            this.handleLaunchWithInviteCode(inviteCode, userType)

          } else {
            // No Username AND No AuthToken found in local memory. Stay on this page.
            Reactotron.error('No Token Found, Please Provide Access Token')
            deviceLog.log('No Token Token Found, Please Provide Access Token')

            this.setState({ loading: false })
          }

        }

    } catch(error){
        Reactotron.error('Error getting login token ', error)
        deviceLog.log(`Error getting login token: ${error}`)

        this.setState({ loading: false })
    }
  }

  handleLogout(){
    this.setState({ loading: false })
  }

  handleLaunchWithInviteCode(inviteCode, userType) {
    Reactotron.log("Launching with Invite Code ==> NAVIGATING TO " + userType + " LOGIN NOW " + inviteCode)
    deviceLog.log("Launching with Invite Code ==> NAVIGATING TO " + userType + " LOGIN NOW " + inviteCode)
    Reactotron.warn(`*** Launching with Invite Code ==> NAVIGATING TO  ${userType}   LOGIN NOW   ${inviteCode}`)
    Reactotron.error('NavigationActions')
    Reactotron.error(NavigationActions)
    
    if(userType === AppConfig.USER_TYPE_CAREGIVER) {
      // Clears the React Navigation stack
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'CaregiverLogin', params: { inviteCode } })],
      });
      this.props.navigation.dispatch(resetAction);
    } else if(userType === AppConfig.USER_TYPE_PATIENT) {
      // Clears the React Navigation stack
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'PatientLogin', params: { inviteCode } })],
      });
      this.props.navigation.dispatch(resetAction);
    } else {
      Reactotron.error('**LOAD NEW TOKEN**')
      deviceLog.log('**LOAD NEW TOKEN**')
      Reactotron.warn('**LOAD NEW TOKEN**')
    }
  }

  handleInviteCodeChange(text) {
    this.setState({ inviteCode: text })
  }

  handleFiveTap(){
    this.props.navigation.navigate('LogsModal')
  }

  handleEnvPicker(){
    this.props.navigation.navigate('EnvModal')
  } 

  render() {
    /** Only affects iOS */
    StatusBar.setBarStyle('dark-content', true)
    StatusBar.setBackgroundColor('white')

    const {
      inviteCode,
      errorMessage,
      loading,
      loginLoading
    } = this.state

    if(loading){
      return(
          <View style={styles.loadingContainerStyle}>
            <ActivityIndicator size={'large'} />
          </View>
      )
    }
    
    return (
      <View style={styles.mainContainerStyle}>
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.smallSepStyle}>
            <Text style={styles.titleTextStyle}>Welcome to Care Connect</Text>
            <Text style={styles.messageTextStyle}>Before we begin I just need to confirm your identity.</Text>
            <Text style={styles.messageTextStyle}>You should receive an email or text message inviting you to join.</Text>
            <Text style={styles.messageTextStyle}>Please click the link provided or enter your invite code to continue.</Text>
          </View>
          <View />
          <View style={styles.loginGroupStyle}>
            <InviteCodeForm 
              // On login, navigate to PatientLoginScreen, and pass along "inviteCode" as a variable in params.
              onSignin={() => this.handleLaunchWithInviteCode(inviteCode)} 
              loginLoading={loginLoading}
              inviteCode={inviteCode}
              onInviteCodeChange={this.handleInviteCodeChange}
              errorMessage={errorMessage}  
            />
          </View>
        </KeyboardAvoidingView>
        <View style={styles.sepStyle}/>
        <AppVersionLabel
            fivePressTap={this.handleFiveTap}
        />
      </View>
    );
  }
}
