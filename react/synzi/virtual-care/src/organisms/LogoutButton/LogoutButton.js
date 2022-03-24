import React, { Component, Fragment } from 'react'
import {
    TouchableOpacity,
    Alert,
    Text,
    View
} from 'react-native';
import styles from './styles'
import UserAvatarView from '../../atoms/UserAvatarView/UserAvatarView'
import UsersQl from '../../../../_shared/graphql/UsersQL'
import { Query } from 'react-apollo'

//Wide/Narrow Layout & Orientation Change Detection
import OrientationResponsiveComponent from '../../../../_shared/src/OrientationResponsiveComponent'


export default class LogoutButton extends OrientationResponsiveComponent {

    renderButton(userStatus){

        const { userName, logout } = this.props

        return(
            <TouchableOpacity 
                onPress={e => {
                    Alert.alert(
                        'Logout',
                        `Logout user ${userName}?`,
                        [
                            { text: 'Cancel', onPress: () => null },
                            { text: 'Yes', onPress: () => logout()}
                            // { text: 'Yes', onPress: () => this.closeSocket()}
                        ],
                        { cancelable: false }
                    )
                    e.preventDefault()
                }}>
                {this.isWide() ? this.renderTabletAvatar(userStatus) : this.renderPhoneAvatar(userStatus)}
            </TouchableOpacity>
        )
    }

    renderTabletAvatar(userStatus){

        const { userName, profileImage } = this.props

        return(
            <View style={styles.userAvatarContainerStyle}>
                <UserAvatarView 
                    profileImage={profileImage}
                    width={42}
                    height={42}
                    overAllStatus={userStatus}
                />
                <Text style={styles.userNameTextStyle}>{userName}</Text>
            </View>
        )
    }


    renderPhoneAvatar(userStatus){

        const { profileImage } = this.props

        return(
            <UserAvatarView 
                profileImage={profileImage}
                width={42}
                height={42}
                overAllStatus={userStatus}
            />
        )
    }


    render() {

        const { userId } = this.props

        return (

            <Query
                pollInterval={5000}
                query={UsersQl.getByIdShort(userId)}
                fetchPolicy="network-only">
                {({ loading, error, data }) => {

                    var userStatus = 'disconnected'

                    if(data['user']){
                        let user = data['user']
                        userStatus = user['overallStatus'] ? user['overallStatus'] : 'disconnected'
                    }

                    return (
                        <Fragment>{this.renderButton(userStatus)}</Fragment>
                    )
                }}
            </Query>
        )
    }
}