import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native';
import PropTypes from 'prop-types'

import friendlyTime from 'friendly-time'
import moment from 'moment'

import styles from './styles';

export default class TimeStamp extends Component {
  static propTypes = {
    /** A timestamp in UTC ISO format */
    timestamp: PropTypes.string.isRequired,
    /** ClassName for the wrapper */
    className: PropTypes.string,
    /** Style for the wrapper */
    style: PropTypes.object,
    /** Pull to Side */
    type: PropTypes.oneOf(['send', 'receive']),
  }
  static defaultProps = {
    timestamp: '',
    className: '',
    style: {},
    type: 'receive'
  }

  render() {
    const { timestamp, className, style, type, ...rest } = this.props

    // convert timestamp to local time and then friendly it up!
    const localTimeStamp = moment
      .utc(timestamp)
      .local()
      .toDate()
    const niceTime = friendlyTime(localTimeStamp)

    if(type === 'send') {
      return (
        <View style={styles.timestampRight} {...rest}>
          <Text style={styles.timestamp}>{niceTime}</Text>
        </View>
      )
    }
    return (
      <View {...rest}>
        <Text style={styles.timestamp}>{niceTime}</Text>
      </View>
    )
  }
}
