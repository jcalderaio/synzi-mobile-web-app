import React, { Component } from 'react'
import {
    View,
    Image,
    Text
} from 'react-native';
import styles from './styles';
import GroupAvatar from '../../atoms/GroupAvatar/GroupAvatar'
import UserAvatar from '../../atoms/UserAvatar/UserAvatar'
import CallButton from '../../atoms/CallButton/CallButton'
import MessageButton from '../../../../_shared/src/atoms/MessageButton/MessageButton'

import { withNavigation } from 'react-navigation';

class UserRowView extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        const { isActive, username, callUser, overAllStatus, profileImage, recipientId, showMessages, caregiver } = this.props

        // If overall status == null, return Groups
        if (overAllStatus == null) {
            return(
                <View style={styles.rowContainerStyle}>
                    <View style={styles.userAvatarStyle}>
                        <GroupAvatar
                            width={42}
                            height={42}
                            isActive={isActive}
                        />
                    </View>
                    <View style={isActive ? styles.textContainerStyle : styles.textContainerInactiveStyle}>
                        <Text style={styles.userNameTextStyle}>{username}</Text>
                    </View>
                    <View style={styles.callButtonStyle}>
                        <CallButton 
                            width={42}
                            height={42}
                            isActive={isActive}
                            onPress={callUser}
                            overAllStatus={null}
                        />
                    </View>
    
                </View>
            )
        }
        // Else return CareTeam
        else {
            return(
                <View style={styles.rowContainerStyle}>
                    <View style={styles.userAvatarStyle}>
                        <UserAvatar
                            profileImage={profileImage}
                            width={42}
                            height={42}
                            overAllStatus={overAllStatus}
                        />
                    </View>
                    <View style={isActive ? styles.textContainerStyle : styles.textContainerInactiveStyle}>
                        <Text style={styles.userNameTextStyle}>{username}</Text>
                    </View>
                    <View style={styles.callButtonStyle}>
                        {!caregiver &&
                            <CallButton 
                                width={42}
                                height={42}
                                isActive={(overAllStatus === 'available')}
                                onPress={callUser}
                                overAllStatus={overAllStatus}
                            />
                        }
                        {showMessages && 
                            <View style={{paddingLeft: 10}}>
                                <MessageButton 
                                    size={42}
                                    isActive={true}
                                    onPress={() => this.props.navigation.navigate('SecureMessageDetail', { recipientId })}
                                />
                            </View>
                        }
                    </View>
    
                </View>
            )
        }
        
    }
}

export default withNavigation(UserRowView);