import React, { Component } from 'react'
import { View, Text, Platform, KeyboardAvoidingView, ScrollView } from 'react-native'
import PropTypes from 'prop-types'

import SentMessage from '../../../../_shared/src/molecules/SentMessage/SentMessage'
import ReceivedMessage from '../../../../_shared/src/molecules/ReceivedMessage/ReceivedMessage'
import MessageTyper from '../../../../_shared/src/molecules/MessageTyper/MessageTyper'

import InvertibleScrollView from 'react-native-invertible-scroll-view'

import styles from './styles'

export default class MessageThread extends Component {
  static propTypes = {
    /** A thread to display */
    thread: PropTypes.shape({
      id: PropTypes.string.isRequired,
      messages: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          timestamp: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired,
          sender: PropTypes.shape({
            id: PropTypes.string.isRequired,
            displayName: PropTypes.string.isRequired,
            profileImage: PropTypes.string.isRequired,
          }),
          recipient: PropTypes.shape({
            id: PropTypes.string.isRequired,
            displayName: PropTypes.string.isRequired,
            profileImage: PropTypes.string.isRequired,
          }),
        })
      ),
    }),
    /** If provided, will show at the start of thread */
    startMessage: PropTypes.string.isRequired,
    /** The name of the permis being messaged */
    recipientName: PropTypes.string.isRequired,
    /** Send a new message */
    onSend: PropTypes.func,
    /** Called to mark the thread as seen */
    onSeen: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.onSeen()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.thread !== prevProps.thread) {
      this.props.onSeen()
    }
  }

  render() {
    const { thread, startMessage, recipientName, onSend, myId } = this.props

    const messages = thread ? thread.messages : []

    const showStartMessage = startMessage ? true : false

    let renderThread = null

    if (messages) {
      renderThread = messages.map(message => {
        if (message.sender.id === myId) {
          return (
            <SentMessage
              key={message.id}
              message={message.text}
              timestamp={message.timestamp}
              style={{ marginBottom: 20 }}
            />
          )
        } else {
          return (
            <ReceivedMessage
              key={message.id}
              message={message.text}
              timestamp={message.timestamp}
              profileImage={message.sender.profileImage}
              style={{ marginBottom: 20 }}
            />
          )
        }
      })
    }

    return (
      <InvertibleScrollView 
        inverted 
        style={{ marginBottom: 20 }}
        keyboardDismissMode='on-drag'
      >
        <View style={styles.mainContainerStyle}>
          <View style={styles.messagethreadMessages}>
            {showStartMessage && (
              <Text style={styles.messagethreadStart}>{startMessage}</Text>
            )}
            {renderThread}
          </View>
        </View>
      </InvertibleScrollView>
    )
  }
}
