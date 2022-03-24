import React, { Component } from 'react'
import { View, Text, Modal, NetInfo, ActivityIndicator } from 'react-native'
import { isVirtualCare } from '../../../constants/AppConfig'
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import deviceLog from 'react-native-device-log'
import Reactotron from 'reactotron-react-native'

import styles from './styles'

export default class OfflineNotice extends Component {
  state = {
    isConnected: true
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    if(this.connectionOutTimer) clearTimeout(this.connectionOutTimer)
  }

  /* NetInfo is not reliable as to whether it is connected or not. This is because 
    sometimes it treats 3G as connected, but sometimes it treats it as not connected.
    This is why, no matter what NetInfo returns, we ping our GraphQL server. If the 
    ping works, then we are connected. If not, then we are not connected.
  */

  goOffline = () => {
    this.connectionOutTimer = setTimeout(() => {
      this.setState({ isConnected: false })
    }, 1000)
  }

  goOnline = () => {
    this.setState({ isConnected: true })
    if(this.connectionOutTimer) clearTimeout(this.connectionOutTimer)
  }

  handleConnectivityChange = () => {
    NetInfo.isConnected.fetch(global.SYNZI_graphqlUrl).then(isConnected => {
      if(!isConnected) {
        this.goOffline()
      } 
      else {
        this.goOnline()
      }
    });
  };

  render() {
    const { isConnected } = this.state
    let appName = (isVirtualCare() === true) ? 'Virtual Care' : 'Care Connect'

    const message1 = `${appName} requires an internet connection.`
    const message2 = `Please reconnect to continue.`
    
    if(!isConnected) {
      return (
        <Modal transparent={true}>
          <View style={styles.connectionWarningStyle}>
            <Text style={styles.titleTextStyle}>{message1}</Text>
            <Text style={styles.messageTextStyle}>{message2}</Text>
          </View>
          <View style={styles.mainContainerStyle}>
              <View>
                <ActivityIndicator 
                  size={'large'} 
                  color={'white'} 
                />
              </View>
          </View>
        </Modal>
      )
    } 

    return null
  }
}