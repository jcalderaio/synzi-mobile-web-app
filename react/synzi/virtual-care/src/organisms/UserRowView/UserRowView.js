import React, { Component } from 'react'
import {
    View,
    Image,
    Text
} from 'react-native';
import styles from './styles';
import UserAvatarView from '../../atoms/UserAvatarView/UserAvatarView'
import UserCallButton from '../../atoms/UserCallButton/UserCallButton'
import MessageButton from '../../../../_shared/src/atoms/MessageButton/MessageButton'
import UserTagView from '../../atoms/UserTagView/UserTagView'
import FavoriteStarButton from '../../atoms/FavoriteStarButton/FavoriteStarButton'

export default class UserRowView extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        const { navTo, searchRow, overAllStatus, profileImage, isFavorite, currentUserId, userId, messagesEnabled, userName, currentUserProfileImage, loggedInDisplayName } = this.props
        const isActive = (overAllStatus === 'available')

        return (
            <View style={searchRow ? styles.searchRowContainerStyle : styles.rowContainerStyle}>
                <FavoriteStarButton
                    userId={userId}
                    currentUserId={currentUserId}
                    isFavorite={isFavorite}
                />
                <View style={styles.userAvatarStyle}>
                    <UserAvatarView
                        profileImage={profileImage}
                        width={42}
                        height={42}
                        searchAvatar={searchRow}
                        overAllStatus={overAllStatus}
                    />
                </View>
                <View style={isActive ? styles.textContainerStyle : styles.textContainerInactiveStyle}>
                    <Text style={styles.userNameTextStyle}>{userName}</Text>
                </View>
                <View style={styles.callButtonStyle}>
                    <UserCallButton 
                        size={42}
                        isActive={isActive}
                        onPress={this.props.callUser}
                        overAllStatus={overAllStatus}
                    />
                    {messagesEnabled && 
                        <View style={{paddingLeft: 10}}>
                            <MessageButton 
                                size={42}
                                isActive={true}
                                onPress={() => {
                                    navTo('VCSecureMessageDetail', { 
                                        userId: currentUserId,
                                        recipientId: userId,
                                        profileImage: currentUserProfileImage,
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