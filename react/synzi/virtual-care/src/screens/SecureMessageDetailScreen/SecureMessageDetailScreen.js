import React, { Component } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types'
import EnvManager from '../../../../_shared/services/EnvManager'
import AuthUtils from '../../../../_shared/helpers/AuthUtils'
import MessageThreadView from '../../views/MessageThreadView/MessageThreadView'
import BreadcrumbView from '../../organisms/BreadcrumbView/BreadcrumbView'
import TopBarView from '../../organisms/TopBarView/TopBarView'
import { Query } from 'react-apollo'
import PatientsQL from '../../../../_shared/graphql/PatientsQL'
import deviceLog from 'react-native-device-log'
import Reactotron from 'reactotron-react-native'

//Styles
import styles from './styles';  

import {SynziColor} from '../../../../_shared/Color'


export default class SecureMessageDetailScreen extends Component {
  static propTypes = {
    /** A string to filter the list of patients by */
    filter: PropTypes.string
  }
  static defaultProps = {
    filter: '',
  }

  constructor(props) {
    super(props)

    this.state = {
      userId: 0,
      recipientId: 0,
      profileImage: '',
      userName: ''
    }
  }

  async componentDidMount() {
    // Gets recipient param from either Message Button (call screen) or thread click (Secure Messages screen)
    const { params } = this.props.navigation.state
    const userId = params ? params.userId : null
    const recipientId = params ? params.recipientId : null
    const profileImage = params ? params.profileImage : '0'
    const userName = params ? params.userName : ''

    this.setState({ userId, recipientId, profileImage, userName })
  }
  
  render() {
    const { userId, recipientId, profileImage, userName } = this.state

    const RECIPIENT_DISPLAY_NAME_QUERY = PatientsQL.getDisplayName()

    if(recipientId === 0 || recipientId === null) return null

    return (
      <View style={styles.phoneContainer}>
          <TopBarView
              userId={userId}
              profileImage={profileImage}
              userName={userName}
              hideButtons={true}
              socketState={this.props.screenProps.socketState}
              closeSocket={this.props.screenProps.closeSocket}
          />
          <Query
                query={RECIPIENT_DISPLAY_NAME_QUERY}
                variables={{ id: recipientId }}
              >
                {({ loading, error, data }) => {
                  //-------------------------------------------------------------------------
                  // Handle loading
                  //-------------------------------------------------------------------------
                  if (loading) {
                    return (
                      <React.Fragment>
                        <BreadcrumbView
                          breadCrumbText={`Messages`}
                          goBack={() => this.props.navigation.goBack()}
                        />
                        <MessageThreadView recipientId={recipientId} myId={userId} />
                      </React.Fragment>
                    )
                  }

                  if(error) {
                    Reactotron.log("SecureMessageDetailScreen RECIPIENT_DISPLAY_NAME_QUERY error: ", error.message)
                    deviceLog.log(`SecureMessageDetailScreen RECIPIENT_DISPLAY_NAME_QUERY error: : ${error.message}`)
                    return null
                  }

                  if(!error && data) {
                    const recipientDisplayName = data.user.displayName

                    return (
                      <React.Fragment>
                        <BreadcrumbView
                          breadCrumbText={`Messages  >  ${recipientDisplayName}`}
                          goBack={() => this.props.navigation.goBack()}
                        />
                        <MessageThreadView recipientId={recipientId} myId={userId} />
                      </React.Fragment>
                    )
                  }
                  
                }}
              </Query>
      </View>
    )
  }
}