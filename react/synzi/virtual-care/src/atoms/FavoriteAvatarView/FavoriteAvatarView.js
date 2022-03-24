import React, { Component } from 'react'
import {
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import { AppColor } from '../../../../_shared/Color';
import { CachedImage } from "react-native-img-cache";
import styles from './styles';

import GenericUserIcon from '../../../../_shared/images/icons/genericUserIcon2.png'

const AVATAR_SIDE = 50

export default class FavoriteAvatarView extends Component {


    renderCachedImage(offline){

        const { profileImage } = this.props

        return(
            <View>
                <CachedImage 
                    style={{
                        width: AVATAR_SIDE,
                        height: AVATAR_SIDE,
                        borderRadius : AVATAR_SIDE/2,
                        borderColor: 'white',
                        borderWidth: 1.0,
                    }}
                    source={{ uri: profileImage }}>
                </CachedImage>
                {offline ? this.renderInActiveCoverView() : null}
            </View>
        )
    }

    renderDefaultImage(offline){
        return(
            <View>
                <Image
                    style={{
                        width: AVATAR_SIDE,
                        height: AVATAR_SIDE,
                        borderRadius : AVATAR_SIDE/2,
                        borderColor: 'white',
                        borderWidth: 1.0,
                    }}
                    resizeMode={'cover'}
                    source={GenericUserIcon}
                />
                {offline ? this.renderInActiveCoverView() : null}
            </View>
        )
    }


    renderIndicator(statusColor){
        return(
            <View style={{
                    backgroundColor: statusColor,
                    position: 'absolute',
                    top: AVATAR_SIDE-15,
                    left: AVATAR_SIDE+5,
                    width: 14,
                    height: 14,
                    borderRadius:7,
                    borderWidth:1,
                    borderColor:'white',
                    marginBottom: 5,
                }}
            />
        )
    }

    renderInActiveCoverView(){
        return(
            <View
                style={{
                    position:'absolute',
                    width: AVATAR_SIDE-2,
                    height: AVATAR_SIDE-2,
                    top: 1,
                    left: 1,
                    borderRadius : AVATAR_SIDE/2,
                    backgroundColor: 'black',
                    opacity:0.5
                }}
            />
        )
    }


    render() {


        const { profileImage, displayName, overallStatus, onUserClick } = this.props

        const defaultImage = (profileImage === undefined || profileImage === '')

        var statusColor = AppColor.USER_DISCONNECTED_COLOR

        var offline = false

        switch(overallStatus) {
            case 'available':
                statusColor = AppColor.USER_CONNECTED_COLOR
                break;
            case 'disconnected':
                statusColor = AppColor.USER_DISCONNECTED_COLOR
                offline = true
                break;
            case 'busy':
                statusColor = AppColor.USER_BUSY_COLOR
                break;
            default:
                statusColor = AppColor.USER_DISCONNECTED_COLOR
                offline = true
        }


        return (
            
            <View style={styles.favoriteAvatarContainerStyle}>
                <TouchableOpacity
                    onPress={onUserClick}
                    activeOpacity={offline ? 1 : 0.5}
                    style={styles.touchableOpacityStyle}
                >
                    {defaultImage ? this.renderDefaultImage(offline) : this.renderCachedImage(offline)}
                    {this.renderIndicator(statusColor)}
                    <Text 
                        style={styles.favoriteAvatarTextStyle}
                        numberOfLines={2}>
                        {displayName}
                    </Text>
                </TouchableOpacity>
            </View>
           
        )
    }
}

