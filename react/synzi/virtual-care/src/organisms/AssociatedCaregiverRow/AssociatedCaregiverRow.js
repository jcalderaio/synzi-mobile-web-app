import React, { Component } from 'react'
import {
    View,
    Image,
    Text
} from 'react-native';
import PropTypes from 'prop-types'
import UserAvatarView from '../../atoms/UserAvatarView/UserAvatarView'
import OnDemandButton from '../../atoms/OnDemandButton/OnDemandButton'
import UserCallButton from '../../atoms/UserCallButton/UserCallButton'
import MessageButton from '../../../../_shared/src/atoms/MessageButton/MessageButton'

import styles from './styles';
import Reactotron from 'reactotron-react-native'

export default class AssociatedCaregiverRow extends Component {

  static propTypes = {
    /* A function that is called when onDemand button is pressed */
    sendOnDemandMessage: PropTypes.func.isRequired,
    /* A function that is called when call button is pressed */
    callUser: PropTypes.func.isRequired,
    /** A function that exposes the react-navigation API to allow 
     * for navigating outside of its main stack 
    */
    navTo: PropTypes.func.isRequired,
    /** Caregivers profile image */
    profileImage: PropTypes.string,
    /** ID for onDemand message */
    odmId: PropTypes.string.isRequired,
    /** ID for secure messages*/
    secureMessageId: PropTypes.string.isRequired,
    /** Caregivers online status */
    overAllStatus: PropTypes.string.isRequired,
    /** Caregivers display name */
    userName: PropTypes.string.isRequired,
    /** If enabled, show messages icon */
    messagesEnabled: PropTypes.bool.isRequired,
    /** If enabled, show onDemand icon */
    onDemandmessagesEnabled: PropTypes.bool.isRequired,
    /** The display name of the logged in user (for TopBar) */
    loggedInDisplayName: PropTypes.string.required,
     /** The profile image of the logged in user (for TopBar) */
    loggedInProfileImage: PropTypes.string.required,
     /** The userId of the logged in user (for TopBar) */
    loggedInUserId: PropTypes.number.required
  }

    render() {

        const { sendOnDemandMessage, callUser, navTo, profileImage, overAllStatus, userName, messagesEnabled, onDemandmessagesEnabled, loggedInUserId, loggedInProfileImage, loggedInDisplayName, odmId, secureMessageId } = this.props
        const isActive = (overAllStatus === 'available')

        return (
            <View style={styles.rowContainerStyle}>
                <View style={styles.userAvatarStyle}>
                    <UserAvatarView
                        profileImage={profileImage}
                        width={42}
                        height={42}
                        overAllStatus={overAllStatus}
                    />
                </View>
                <View style={isActive ? styles.textContainerStyle : styles.textContainerInactiveStyle}>
                    <Text style={styles.userNameTextStyle}>{userName}</Text>
                </View>
                <View style={styles.callButtonStyle}>
                    {onDemandmessagesEnabled &&
                      <OnDemandButton
                          size={42}
                          onPress={() => sendOnDemandMessage(userName, profileImage, odmId)}
                      />
                    }
                    <View style={{ paddingLeft: 10 }}>
                      <UserCallButton 
                        size={42}
                        isActive={isActive}
                        onPress={callUser}
                        overAllStatus={overAllStatus}
                      />
                    </View>
                    {messagesEnabled && 
                        <View style={{paddingLeft: 10}}>
                            <MessageButton 
                                size={42}
                                isActive={true}
                                onPress={() => {
                                    navTo('VCSecureMessageDetail', { 
                                        userId: loggedInUserId,
                                        recipientId: secureMessageId,
                                        profileImage: loggedInProfileImage,
                                        userName: loggedInDisplayName
                                    })
                                }}
                            />
                        </View>
                    }
                </View>

            </View>
        )
    }
}