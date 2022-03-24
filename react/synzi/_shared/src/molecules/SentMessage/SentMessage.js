import React, { Component } from 'react'
import { View, Text, Platform, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'

import MessageBubbleSent from '../../atoms/MessageBubbleSent/MessageBubbleSent'
import TimeStamp from '../../atoms/TimeStamp/TimeStamp'
import Avatar from '../../atoms/Avatar/Avatar'

import styles from './styles'

export default class SentMessage extends Component {
  static propTypes = {
    /** Text to display */
    message: PropTypes.string.isRequired,
    /** Timestamp for the message */
    timestamp: PropTypes.string.isRequired,
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
      className,
      style,
      ...rest
    } = this.props

    return (
      <View style={[style, styles.sentmessage]} {...rest}>
        <MessageBubbleSent message={message} />
        <View style={{ paddingTop: 3 }}>
          <TimeStamp timestamp={timestamp} type={'send'} />
        </View>
      </View>
    )
  }
}
