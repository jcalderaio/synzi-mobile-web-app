import React, { Component } from 'react'
import { View, Text, Platform, ActivityIndicator, KeyboardAvoidingView, Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import MessageThread from './MessageThread'
import { Query, Mutation } from 'react-apollo'
import MessagesQL from '../../../../_shared/graphql/MessagesQL'
import deviceLog from 'react-native-device-log'
import { LogSeparator } from '../../../../_shared/constants/AppConfig'
import MessageTyper from '../../../../_shared/src/molecules/MessageTyper/MessageTyper'
import EnterpriseLogo from '../../atoms/EnterpriseLogo/EnterpriseLogo'
import Reactotron from 'reactotron-react-native'

import styles from './styles'

const { height: fullHeight } = Dimensions.get('window')

export default class MessageThreadView extends Component {
  state = {
    offset: 0
  }

  onLayout = ({
    nativeEvent: { layout: { height } },
  }) => {
    const offset = fullHeight - height;
    this.setState({ offset });
  }
  
  handleErrors = error => {
    if (error && !error.message.includes('No SecureMessageThread found')) {
      Reactotron.log("ThreadViewError: ", error.message)
      deviceLog.log(`ThreadViewError: ${error.message}`)
      return null
    }
  }

  renderErrorState(errorText){
    return(
        <Text style={styles.errorTextStyle}>{errorText}</Text>
    )
  }

  render() {
    const { ...rest } = this.props

    const MESSAGE_THREAD_QUERY = MessagesQL.getThreadByRecipient()
    const SEND_MESSAGE_MUTATION = MessagesQL.sendMessage()
    const MARK_THREAD_SEEN_MUTATION = MessagesQL.markSecureMessageThreadSeen()
    const THREADS_CHANGED_QUERY = MessagesQL.messageThreadsChanged()

    const { recipientId, myId } = this.props

    if(Platform.OS === 'ios') {
      return (
        <View style={{ flex: 1 }} onLayout={this.onLayout}>
          <KeyboardAvoidingView 
            style={styles.outerContainer} 
            behavior="padding" 
            keyboardVerticalOffset={this.state.offset}
          >
            <EnterpriseLogo />
            <View style={styles.mainContainerStyle}>
              <Query
                query={MESSAGE_THREAD_QUERY}
                variables={{ recipientId }}
                pollInterval={30000}
                errorPolicy="all"
              >
                {({ loading, error, data, refetch }) => {
                  //-------------------------------------------------------------------------
                  // Handle loading
                  //-------------------------------------------------------------------------
                  if (loading) {
                    return (
                        <View>
                            <View style={styles.loadingContainerStyle}>
                                <ActivityIndicator size={'large'} />
                            </View>
                        </View>
                    )
                }
    
                  //-------------------------------------------------------------------------
                  // Checks if thread has started or not
                  //-------------------------------------------------------------------------
                  let thread = null
                  let startMessage = ''
                  let displayName = ''
    
                  if (!error) {
                    startMessage = '-- This is the start of your conversation --'
                    displayName = data.user.displayName
                  }
                  // If Error 
                  else {
                    if(error.message.includes('No SecureMessageThread found')) {
                      startMessage = 'You are starting a new message. Type the message below and click Send.'
                    } else {
                      this.handleErrors(error)
                    }
                  }

                  thread = (data && data.thread) ? data.thread : null
    
                  //-------------------------------------------------------------------------
                  // Render messages
                  //-------------------------------------------------------------------------
                  return (
                    <Mutation mutation={SEND_MESSAGE_MUTATION}
                      refetchQueries={[
                        { query: MESSAGE_THREAD_QUERY, variables: { recipientId } }
                      ]}
                      update={(cache, { data: {sendSecureMessage} }) => {
                        //Reactotron.log("UPDATED QUERY AFTER SEND MESSAGE: ", sendSecureMessage)
                      }}>
                      {(sendMessage, { data, error: errorSendMessage }) => {
                        this.handleErrors(errorSendMessage)
    
                        return (
                          <Mutation mutation={MARK_THREAD_SEEN_MUTATION}>
                            {(markSeen, { error: errorMarkSeen }) => {
                              this.handleErrors(errorMarkSeen)
    
                              return (
                                <Query
                                  query={THREADS_CHANGED_QUERY}
                                  pollInterval={3000}
                                  fetchPolicy={'cache-and-network'}
                                >
                                  {({
                                    loading: unreadCountLoading,
                                    error: threadsChangedError,
                                    data: unreadCountData,
                                    networkStatus: newMessageStatus,
                                  }) => {
                                    // This query polls the BE to see if any new messages are available for this recipient.
                                    // If so, it will refetch the main query to get new messages
                                    if(threadsChangedError) {
                                      return(
                                        <Text style={styles.errorTextStyle}>{threadsChangedError.message}</Text>
                                      )
                                    }
                                    
          
                                    if (!unreadCountLoading && unreadCountData.messageThreadsChanged) {
                                      refetch()
                                    }

                                    return (
                                      <React.Fragment>
                                        <MessageThread
                                          recipientName={displayName}
                                          myId={myId}
                                          thread={thread}
                                          // TODO: When we add pagination the following should only show if the first message is included
                                          startMessage={startMessage}
                                          onSeen={() => {
                                            const variables = { recipientId }
                                            // call if a thread exists
                                            if (thread) {
                                              markSeen({ variables })
                                            }
                                          }}
                                          getNewThreads={refetch}
                                          {...this.props}
                                        />
                                        <View style={{ paddingBottom: 20, paddingHorizontal: 5 }}>
                                          <MessageTyper 
                                            style={styles.messagethreadTyper} 
                                            onSend={(text => {
                                              const variables = { text, recipientId }
                                              sendMessage({ variables })
                                            })} 
                                            recipientId={recipientId} 
                                          />
                                        </View>
                                      </React.Fragment>
                                    )

                                    
                                  }}
                                </Query>
                              )
                            }}
                          </Mutation>
                        )
                      }}
                    </Mutation>
                  )
                }}
              </Query>
            </View>
          </KeyboardAvoidingView>
        </View>
      )
    }
    // Else if(Platform.OS === 'android)
    return (
      <View 
        style={styles.outerContainer} 
      >
        <EnterpriseLogo />
        <View style={styles.mainContainerStyle}>
          <Query
            query={MESSAGE_THREAD_QUERY}
            variables={{ recipientId }}
            pollInterval={30000}>
            {({ loading, error, data, refetch }) => {
              //-------------------------------------------------------------------------
              // Handle loading
              //-------------------------------------------------------------------------
              if (loading) {
                return (
                    <View>
                        <View style={styles.loadingContainerStyle}>
                            <ActivityIndicator size={'large'} />
                        </View>
                    </View>
                )
            }

              //-------------------------------------------------------------------------
              // Checks if thread has started or not
              //-------------------------------------------------------------------------
              let thread = null
              let startMessage = ''
              let displayName = ''

              if (!error) {
                startMessage = '-- This is the start of your conversation --'
                displayName = data.user.displayName
              }
              // If Error 
              else {
                if(error.message.includes('No SecureMessageThread found')) {
                  startMessage = 'You are starting a new message. Type the message below and click Send.'
                } else {
                  this.handleErrors(error)
                }
              }

              thread = (data && data.thread) ? data.thread : null

              //-------------------------------------------------------------------------
              // Render messages
              //-------------------------------------------------------------------------
              return (
                <Mutation mutation={SEND_MESSAGE_MUTATION}
                  refetchQueries={[
                    { query: MESSAGE_THREAD_QUERY, variables: { recipientId } }
                  ]}
                  update={(cache, { data: {sendSecureMessage} }) => {
                    //Reactotron.log("UPDATED QUERY AFTER SEND MESSAGE: ", sendSecureMessage)
                  }}>
                  {(sendMessage, { data, error: errorSendMessage }) => {
                    this.handleErrors(errorSendMessage)

                    return (
                      <Mutation mutation={MARK_THREAD_SEEN_MUTATION}>
                        {(markSeen, { error: errorMarkSeen }) => {
                          this.handleErrors(errorMarkSeen)

                          return (
                            <Query
                              query={THREADS_CHANGED_QUERY}
                              pollInterval={3000}
                              fetchPolicy={'cache-and-network'}
                            >
                              {({
                                loading: unreadCountLoading,
                                error: threadsChangedError,
                                data: unreadCountData,
                                networkStatus: newMessageStatus,
                              }) => {
                                // This query polls the BE to see if any new messages are available for this recipient.
                                // If so, it will refetch the main query to get new messages
                                if(threadsChangedError) {
                                  return(
                                    <Text style={styles.errorTextStyle}>{threadsChangedError.message}</Text>
                                  )
                                }
                                
      
                                if (!unreadCountLoading && unreadCountData.messageThreadsChanged) {
                                  refetch()
                                }

                                return (
                                  <React.Fragment>
                                    <MessageThread
                                      recipientName={displayName}
                                      myId={myId}
                                      thread={thread}
                                      // TODO: When we add pagination the following should only show if the first message is included
                                      startMessage={startMessage}
                                      onSeen={() => {
                                        const variables = { recipientId }
                                        // call if a thread exists
                                        if (thread) {
                                          markSeen({ variables })
                                        }
                                      }}
                                      getNewThreads={refetch}
                                      {...this.props}
                                    />
                                    <View style={{ paddingBottom: 20, paddingHorizontal: 5 }}>
                                      <MessageTyper 
                                        style={styles.messagethreadTyper} 
                                        onSend={(text => {
                                          const variables = { text, recipientId }
                                          sendMessage({ variables })
                                        })} 
                                        recipientId={recipientId} 
                                      />
                                    </View>
                                  </React.Fragment>
                                )

                                
                              }}
                            </Query>
                          )
                        }}
                      </Mutation>
                    )
                  }}
                </Mutation>
              )
            }}
          </Query>
        </View>
      </View>
    )
  }
}

      