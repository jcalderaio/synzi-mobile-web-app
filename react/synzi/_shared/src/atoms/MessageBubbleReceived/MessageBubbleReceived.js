import React, { Component } from 'react'
import { View, Text, Platform, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'

import styles from './styles'

export default class MessageBubbleReceived extends Component {
  static propTypes = {
    /** The type of message bubble to display */
    type: PropTypes.oneOf(['sent', 'received']),
    /** Text to display */
    message: PropTypes.string.isRequired,
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
    const { type, message, className, style, ...rest } = this.props

    return (
      <View
        style={styles.messagebubbleReceived}
        {...rest}>
        <Text style={styles.messagebubbleTextReceived}>{message}</Text>
      </View>
    )
  }
}
