import React, { Component } from 'react'
import { Text, TouchableHighlight, View, Alert, ActivityIndicator, Button} from 'react-native';
import PropTypes from 'prop-types'
import deviceLog from 'react-native-device-log'
import { Query, Mutation } from 'react-apollo'
import MessagesQl from '../../../../_shared/graphql/MessagesQL'
import UsersQl from '../../../../_shared/graphql/UsersQL'
import { AppConfig, LogSeparator, guid } from '../../../../_shared/constants/AppConfig'
import ErrorPage from '../../../../_shared/src/views/ErrorPage/ErrorPage'
import Reactotron from 'reactotron-react-native'

import OnDemandMessage from './OnDemandMessage'

import styles from './styles'

export default class OnDemandMessageContainer extends Component {
  static propTypes = {
    /* sets user to patient when go back to patient screen*/
    setToPatient: PropTypes.func.isRequired,
    /** UserId of user who will recieve the message */
    recipientId: PropTypes.string.isRequired,
    /** displayName of user who will receive the message */
    displayName: PropTypes.string.isRequired,
    /** function to close secure message and display patient details instead */
    goBack: PropTypes.func.isRequired,
    /** Id of current Enterprise*/
    enterpriseId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      translationId: ''
    }

    this.handleGetMessageText = this.handleGetMessageText.bind(this)
  }

  componentDidMount() {
    Reactotron.error(`${this.props.displayName} has a recipientId: ${this.props.recipientId}`)
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Due to how we are using polling, this component will
    // update and rerender everyting a parent polls and gets data
    // We need to override that behavior and only update when we have
    // a change we want.
    if (nextState.translationId !== this.state.translationId) {
      Reactotron.log(`SCU called and updating with nextState.translationId: ${nextState.translationId}`)
      deviceLog.log(`SCU called and updating with nextState.translationId: ${nextState.translationId}`)
      return true
    }

    return false
  }

  handleGetMessageText(translationId) {
    Reactotron.log(`handleGetMessageText called with translation id: ${translationId}`)
    deviceLog.log(`handleGetMessageText called with translation id: ${translationId}`)

    this.setState({ translationId })
  }

  handleSendComplete(name, goBack) {
    alert(`Message was sent to ${name}`)
    this.props.setToPatient()
    goBack()
  }

  render() {
    const { translationId } = this.state
    const { recipientId, displayName, goBack, enterpriseId } = this.props

    if (!recipientId) return null

    const GET_RECIPIENT_QUERY = MessagesQl.getOnDemandLookup()
    const GET_TRANSLATION_QUERY = MessagesQl.getTranslation()
    const SEND_MESSAGE_MUTATION = MessagesQl.sendOnDemandMessage()

    return (
        <Query
            query={GET_RECIPIENT_QUERY}
            variables={{ enterpriseId }}
            fetchPolicy="network-only"
        >
            {({ loading, error, data }) => {

              if (loading) {
                return (
                  <View style={styles.loadingContainerStyle}>
                      <ActivityIndicator />
                  </View>
                )
              }

              if(error) {
                return <ErrorPage error={error} goBack={() => goBack()} />
              }

              deviceLog.log(`GET_RECIPIENT_QUERY complete`)
              const templates = data.enterprise.templates

              //-------------------------------------------------------------------------
              // Render OnDemandMessage input
              //-------------------------------------------------------------------------
              return (
                <Mutation
                  mutation={SEND_MESSAGE_MUTATION}
                  onCompleted={() => {
                    Reactotron.log(`SEND_MESSAGE_MUTATION complete`)
                    deviceLog.log(`SEND_MESSAGE_MUTATION complete`)
                    this.handleSendComplete(displayName, goBack)
                  }}>
                  {(sendMessage, { loading, data, error }) => {
                    if (loading) {
                      return (
                        <View style={styles.loadingContainerStyle}>
                            <ActivityIndicator />
                        </View>
                      )
                    }
          
                    if (error) {
                      if (error.message.includes('Recipient is not a patient')) {
                          
                          Reactotron.log(`SEND_MESSAGE_MUTATION errored with 'Recipient is not a patient: ${error}`)
                          deviceLog.log(`SEND_MESSAGE_MUTATION errored with 'Recipient is not a patient: ${error}`)
                          alert(`These types of messages can only be sent to patients`)
                      } else {
                          
                          Reactotron.log(`OnDemandContainer Error: ${error}`)
                          deviceLog.log(`OnDemandContainer Error: ${error}`)
                          return <ErrorPage error={error} goBack={() => goBack()} />
                      }
                    }

                    // Only execute the query when we have a translation id (the user picked a language)
                    const skipTranslation = (!translationId || translationId === '-1') ? true : false
              
                    return (
                      <Query
                        query={GET_TRANSLATION_QUERY}
                        skip={skipTranslation}
                        variables={{ translationId }}
                        fetchPolicy="network-only"
                        >
                        {({
                          loading: translationLoading,
                          error: translationError,
                          data: translationData,
                        }) => {
                          if (translationError) {
                            return <ErrorPage error={translationError} goBack={() => goBack()} />
                          }
    
                          let message = ''
                          let publishedMttId = ''
                          if (!translationLoading && translationData) {
                            if (translationData.mttranslation.publishedMTT) {
                              message = translationData.mttranslation.publishedMTT.smsContent
                              publishedMttId = translationData.mttranslation.publishedMTT.id
                            } else {
                              return (
                                <ErrorPage
                                  error={translationError}
                                  code="No published translation found"
                                  message={`Message with id = ${translationId}, does not have a published version`}
                                  goBack={() => goBack()}
                                />
                              )
                            }
                          }

                          // if we have skipped and translationId is -1 we need to force
                          // an update to the props we send to the child or it won't update
                          if (skipTranslation && translationId === '-1') {
                            message = ''
                            publishedMttId = ''
                          }

                          
                          Reactotron.log(`GET_TRANSLATION_QUERY complete with skip=${skipTranslation}`)
                          deviceLog.log(`GET_TRANSLATION_QUERY complete with skip=${skipTranslation}`)
    
                          
                          Reactotron.log(`GET_TRANSLATION_QUERY message='${message}`)
                          deviceLog.log(`GET_TRANSLATION_QUERY complete with skip=${skipTranslation}`)

    
                          return (
                            <OnDemandMessage
                              displayName={displayName}
                              templates={templates}
                              messageText={(skipTranslation) ? '' : message}
                              onGetMessageText={this.handleGetMessageText}
                              onSend={text => {
                                sendMessage({ variables: { recipientId, text, publishedMttId } })
                              }}
                              loading={loading}
                            />
                          )
                        }}
                      </Query>
                    )
                    
                  }}
                </Mutation>
              )
            }}
        </Query>
    )
  }
}
