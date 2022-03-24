import React, { Component } from 'react'
import { View, Text, Platform, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'

import MessageBubbleReceived from '../../atoms/MessageBubbleReceived/MessageBubbleReceived'
import TimeStamp from '../../atoms/TimeStamp/TimeStamp'
import Avatar from '../../atoms/Avatar/Avatar'

import styles from './styles'

export default class ReceivedMessage extends Component {
  static propTypes = {
    /** Text to display */
    message: PropTypes.string.isRequired,
    /** Timestamp for the message */
    timestamp: PropTypes.string.isRequired,
    /** Path to the users profile pic */
    profileImage: PropTypes.string.isRequired,
    /** ClassName for the wrapper */
    className: PropTypes.string,
    /** Style for the wrapper */
    style: PropTypes.object,
  }
  static defaultProps = {
    className: '',
    style: {},
  }

  render() {
    const {
      message,
      timestamp,
      profileImage,
      className,
      style,
      ...rest
    } = this.props

    return (
      <View style={[style, styles.receivedmessage]} {...rest}>
        <View style={{ marginTop: 4 }}>
          <Avatar size={28} imgUrl={profileImage} />
        </View>
        <View>
          <MessageBubbleReceived message={message} />
          <TimeStamp timestamp={timestamp} type={'receive'} />
        </View>
      </View>
    )
  }
}
