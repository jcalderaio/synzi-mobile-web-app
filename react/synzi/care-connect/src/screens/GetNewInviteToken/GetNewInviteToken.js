import React, { Component } from 'react'
import { View, Text, ActivityIndicator, Modal } from 'react-native'
import { Mutation } from 'react-apollo'
import UsersQL from '../../../../_shared/graphql/UsersQL'
import AuthUtils from '../../../../_shared/helpers/AuthUtils'
import deviceLog from 'react-native-device-log'
import { isVirtualCare } from '../../../../_shared/constants/AppConfig'
import Reactotron from 'reactotron-react-native'

import styles from './styles'

export default class GetNewInviteToken extends Component {
  renderError(){
    return (
      <Modal 
        transparent={true}
        visible={true}
      >
        <View style={styles.mainErrorContainerStyle}>
          <Text style={styles.callerNameTextStyle}>Unable to connect at this time.</Text>
          <Text style={styles.errorpageMessage}>
            Please check your Internet connection and try again. 
            If the problem persists, please request a new invite link from your service provider.
          </Text>
        </View>
      </Modal>
    )
  }

  renderLoadingState(){
    return(
        <ActivityIndicator size={'large'} />
    )
  }

  getLoadingIndicator() {
    const appName = isVirtualCare() ? 'Virtual Care' : 'Care Connect'
    const message1 = `${appName}`
    const message2 = `Connecting`
      return (
            <View style={styles.mainContainerStyle}>
              <Text style={styles.callerNameTextStyle}>{message1}</Text>
                <View>
                  <ActivityIndicator 
                    size={'large'} 
                    color={'white'}
                    style={styles.loadingContainerStyle} 
                  />
                </View>
              <Text style={styles.callerNameTextStyle}>{message2}</Text>
            </View>
      )
  }

  render() {
    const { params } = this.props.navigation.state
    const userId = params ? params.userId : ''
    const code = params ? params.userType : ''

    const REFETCH_INVITE_CODE = UsersQL.getInviteToken()

    return(
      <Mutation
          mutation={REFETCH_INVITE_CODE}
          variables={{ id: userId }}
          onCompleted={(data) => {
              const inviteToken = data.getInviteToken.inviteToken

              if(code === 'newInviteToken') {
                AuthUtils.setNewInviteToken(inviteToken)
              } else {
                AuthUtils.setInviteToken(inviteToken)
              }

              this.props.navigation.goBack()
          }}
        >
          {(mutate, {loading, error, client, called}) => {
              if(loading) {
                return this.getLoadingIndicator()
              }

              if(error) {
                deviceLog.log(`****** REFETCH INVITE ERROR. error= ${error.message}`)
                Reactotron.error(`****** REFETCH INVITE ERROR. error= ${error.message}`)
                this.renderError()
              }

              if(!called) {
                mutate()
              }
              return this.getLoadingIndicator()
          }}
      </Mutation>
    )
  }
}