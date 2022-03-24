import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types'

import Avatar from '../../atoms/Avatar/Avatar'
import TimeStamp from '../../atoms/TimeStamp/TimeStamp'

import styles from './styles';

export default class UserCardThread extends Component {
  static propTypes = {
    /** Name of the user to display */
    userName: PropTypes.string.isRequired,
    /** User profile pic */
    profileImage: PropTypes.string,
    /** If true, will display in an unread state */
    unread: PropTypes.bool.isRequired,
    /** Timestamp in UTC of the last message */
    timestamp: PropTypes.string.isRequired,
    /** The text of the last message recieved */
    message: PropTypes.string.isRequired,
    /** function called when the user is clicked */
    onClick: PropTypes.func.isRequired,
    /** If true the card will show a selected state */
    selected: PropTypes.bool,
  }
  static defaultProps = {
    selected: false,
  }

  render() {
    const {
      userName,
      profileImage,
      unread,
      timestamp,
      message,
      onClick,
      selected,
    } = this.props

    const unreadClass = unread ? styles.usercardthreadUnread : ''

    return (
      <TouchableOpacity
        style={styles.usercardthreadButton}
        onPress={onClick}>
        <View style={styles.usercardthread}>
          <View style={{ marginRight: 10 }}>
            <NewAvatar imgUrl={profileImage} />
          </View>
          <View style={styles.usercardthreadInfo}>
            <Text style={styles.usercardthreadLabel}>{userName}</Text>
            <Text style={styles.usercardthreadSnippet}>{message}</Text>
          </View>
        </View>
        <TimeStamp
          timestamp={timestamp}
          //className={`usercardthread-time ${unreadClass}`}
        />
      </TouchableOpacity>
    )
  }
}
