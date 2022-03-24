import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types'

import styles from './styles';

export default class UserCardThreadPlaceholder extends Component {
  static propTypes = {
    /** Amount of time (in seconds) to wait before starting the animation */
    delay: PropTypes.number,
    /** Style for the wrapper */
    style: PropTypes.object,
  }
  static defaultProps = {
    delay: 0,
    style: {},
  }

  render() {
    const { delay, className, style } = this.props

    return (
      <View
        style={[styles.usercardthreadPh, { animationDelay: delay + 's', ...style }]}>
        <View style={styles.usercardthreadPhAvatar} />
        <View style={styles.usercardthreadPhText} />
      </View>
    )
  }
}
