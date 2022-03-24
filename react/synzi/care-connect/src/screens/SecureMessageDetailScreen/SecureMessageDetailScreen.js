import React, { Component } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView } from 'react-native';
import deviceLog from 'react-native-device-log'
import AppVersionLabel from '../../../../_shared/src/atoms/AppVersionLabel/AppVersionLabel'
import EnvManager from '../../../../_shared/services/EnvManager'
import AuthUtils from '../../../../_shared/helpers/AuthUtils'
import branch from 'react-native-branch'
import EnterpriseLogo from '../../atoms/EnterpriseLogo/EnterpriseLogo'
import MessageThreadView from '../../views/MessageThreadView/MessageThreadView'
import MessageTyper from '../../../../_shared/src/molecules/MessageTyper/MessageTyper'

// Shared src
import { AppConfig, LogSeparator } from '../../../../_shared/constants/AppConfig'

//Styles
import styles from './styles';  

import {SynziColor} from '../../../../_shared/Color'
import SynziTapableLogoView from '../../../../_shared/src/atoms/SynziTapableLogoView/SynziTapableLogoView'


export default class SecureMessageDetailScreen extends Component {
  // Adds a header to this screen
  static navigationOptions = ({navigation}) => ({
    headerStyle: {
        backgroundColor: SynziColor.SYNZI_WHITE,
        marginTop: 10
    },
    gesturesEnabled: false,
    // Hides the back button on this screen
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
      userId: 0,
      recipientId: 0
    }
  }

  async componentDidMount() {

    // Gets recipient param from either Message Button (call screen) or thread click (Secure Messages screen)
    const { params } = this.props.navigation.state
    const recipientId = params ? params.recipientId : null

    const userId = await AuthUtils.getUserId()
    this.setState({ userId, recipientId })
  }
  
  render() {
    const { userId, recipientId } = this.state

    if(recipientId === 0) return null
    
    return <MessageThreadView recipientId={recipientId} myId={userId} />
    
  }
}