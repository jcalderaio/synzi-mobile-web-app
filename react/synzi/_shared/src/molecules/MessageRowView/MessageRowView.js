import React, { Component } from 'react'
import {
    View,
    Image,
    TouchableOpacity,
    Text
} from 'react-native';
import PropTypes from 'prop-types'
import styles from './styles';
import Avatar from '../../atoms/Avatar/Avatar'
import TimeStamp from '../../atoms/TimeStamp/TimeStamp'

export default class MessageRowView extends Component {
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

    constructor(props) {
        super(props)
    }

    render() {
      const {
        userName,
        profileImage,
        unread,
        timestamp,
        message,
        onClick,
        unreadCount,
        selected,
      } = this.props
    
      const unreadClass = unread ? styles.userUnreadStyle : ''

      return(
        <TouchableOpacity 
          style={styles.rowContainerStyle}
          onPress={onClick}
        >
            <View style={styles.userAvatarStyle}>
                <Avatar
                  imgUrl={profileImage}
                  dimmed={!unread}
                  unreadCount={unreadCount}
                  useFor={'List'}
                />
            </View>
            <View style={unread ? styles.detailsContainerStyle : styles.detailsContainerInactiveStyle}>
                <Text style={styles.userNameTextStyle}>{userName}</Text>
                <Text numberOfLines={1} style={styles.messageTextStyle}>{message}</Text>
            </View>
            <View style={styles.timeStampAlignStyle}>
              <TimeStamp
                style={styles.timeStampTextStyle}
                timestamp={timestamp}
              />
              <Text style={{ paddingBottom: 3 }} />
            </View>

        </TouchableOpacity>
      )
        
    }
}
