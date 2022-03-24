import React, { Component } from 'react';
import { View, Text, ScrollView, StatusBar, ActivityIndicator, KeyboardAvoidingView, AsyncStorage } from 'react-native'
import InviteCodeForm from '../../organisms/InviteCodeForm/InviteCodeForm'
import deviceLog from 'react-native-device-log'
import MenuButton from '../../organisms/MenuButton/MenuButton'
import AppVersionLabel from '../../../../_shared/src/atoms/AppVersionLabel/AppVersionLabel'
import EnvManager from '../../../../_shared/services/EnvManager'
import AuthUtils from '../../../../_shared/helpers/AuthUtils'
import branch from 'react-native-branch'
import LogoutButton from '../../organisms/LogoutButton/LogoutButton'
import EnterpriseLogo from '../../atoms/EnterpriseLogo/EnterpriseLogo'
import Reactotron from 'reactotron-react-native'
import { AppConfig, LogSeparator} from '../../../../_shared/constants/AppConfig'

import {SynziColor} from '../../../../_shared/Color'
import SynziTapableLogoView from '../../../../_shared/src/atoms/SynziTapableLogoView/SynziTapableLogoView'

import MessageListView from '../../views/MessageListView/MessageListView'

//Styles
import styles from './styles';  

export default class SecureMessagesScreen extends Component {
  // Adds a header to this screen
  static navigationOptions = ({navigation}) => ({
    headerStyle: {
        backgroundColor: SynziColor.SYNZI_WHITE,
        marginTop: 10
    },
    gesturesEnabled: false,
    // Hides the back button on this screen
    headerLeft: (
      <MenuButton 
        menuPress={() => {
          navigation.toggleDrawer()
          //Set the CCTab to "home", so it doesn't navigate straight back here when user goes home tab
          AsyncStorage.setItem(AppConfig.LAST_CCTAB, 'home')
        }}
      />
    ),
    headerRight: (
      <LogoutButton 
        displayName={navigation.getParam('displayName')}
        logout={navigation.getParam('logout')}
      />
    ),
    // Sets the color of the buttons in the header
    headerTintColor: SynziColor.SYNZI_BLUE,
    headerTitle: 
    <SynziTapableLogoView
        nav = {navigation}
    />
  })

  constructor(props) {
    super(props)

    this.user = null

    this.state = {
      displayName: ''
    }

    this.logout = this.logout.bind(this)
    this.handleFiveTap = this.handleFiveTap.bind(this)
    this.handleEnvPicker = this.handleEnvPicker.bind(this)
  }

  handleFiveTap(){
    this.props.navigation.navigate('LogsModal')
  }

  handleEnvPicker(){
    this.props.navigation.navigate('EnvModal')
  }

  async componentDidMount() {
    const displayName = await AuthUtils.getDisplayNameFromInviteToken()
    //await AuthUtils.setUserId(userId)
    this.setState({ displayName })

    // Set the CCTab to "messages", so it navigates to this screen if send to BG then FG
    AsyncStorage.setItem(AppConfig.LAST_CCTAB, 'messages')
    
    // Sets the logout function for use in react navigation on this page
    this.props.navigation.setParams({ displayName: displayName, logout: this.logout, handleEnvPicker: this.handleEnvPicker })
  }

  logout() {
    Reactotron.log(" ********** DO LOGOUT ********** ")
    Reactotron.log("props:", this.props)
    deviceLog.log(`User ${this.props.userName} requested logout, closing socket, etc.`)

    //close socket with flag to finish logout when socket has finished disconnecting
    this.props.screenProps.closeSocket(true)
  }
  
  render() {
    return(
      <View style={styles.outerContainer}>
        <EnterpriseLogo imgUrl={''} />
        <View style={styles.mainContainerStyle}>
          <MessageListView />
          <View style={styles.appVersionStyle}>
            <AppVersionLabel
              fivePressTap={() => this.props.navigation.navigate('LogsModal')}
            />
          </View>
        </View>
      </View>
    )
  }
}
