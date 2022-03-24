import React, { Component } from 'react'
import {
    Text,
    View,
    Image
} from 'react-native';
import PropTypes from 'prop-types'
import styles from './styles';
import { AppColor } from '../../../../_shared/Color';
import { CachedImage } from "react-native-img-cache";

import GenericUserIcon from '../../../../_shared/images/icons/genericUserIcon2.png'
import GenericUserMask from '../../../../_shared/images/icons/genericUserMask.png'

export default class UserAvatarView extends Component {
    static propTypes = {
        /** Width of the avatar */
        width: PropTypes.number,
        /** Height of the avatar */
        height: PropTypes.number,
        /** Image URL of the avatar's image */
        profileImage: PropTypes.string

    }
    static defaultProps = {
        width: 50,
        height: 50,
        profileImage: undefined
    }

    renderCachedImage(isActive){

        const { profileImage, width, height } = this.props

        return(
            <CachedImage 
                style={
                    {
                        width: width, 
                        height: height,
                        borderRadius : width ? width/2 : 25,
                        borderColor: 'white',
                        borderWidth: 1.0,
                        marginRight: 10,
                        opacity: isActive ? 1.0 : 0.2
                    }
                }
                source={{ uri: profileImage }} 
            />
        )
    }

    renderDefaultImage(isActive){
        const { width, height } = this.props

        return(
            <Image
                style={
                    {
                        width: width, 
                        height: height,
                        borderRadius : width ? width/2 : 25,
                        borderColor: 'white',
                        borderWidth: 1.0,
                        marginRight: 10,
                        opacity: isActive ? 1.0 : 0.2
                    }
                }
                resizeMode={'cover'}
                source={GenericUserIcon}
            />
        )
    }

    returnMask(isActive){
        const { width, height } = this.props

        return(
            <Image
                style={
                    {
                        position: 'absolute',
                        width: width, 
                        height: height,
                        opacity: isActive ? 1.0 : 0.5
                    }
                }
                resizeMode={'cover'}
                source={GenericUserMask}
            />
        )
    }
    render() {

        
        const { profileImage } = this.props

        const defaultImage = (profileImage === undefined || profileImage === '')

        var statusColor = AppColor.USER_DISCONNECTED_COLOR

        var isActive = false

        switch(this.props.overAllStatus) {
            case 'available':
                statusColor = AppColor.USER_CONNECTED_COLOR
                isActive = true
                break;
            case 'disconnected':
                statusColor = AppColor.USER_DISCONNECTED_COLOR
                isActive = false
                break;
            case 'busy':
                statusColor = AppColor.USER_BUSY_COLOR
                isActive = true
                break;
            default:
                statusColor = AppColor.USER_DISCONNECTED_COLOR
                isActive = false
        }

        return (
            
            <View>
                {defaultImage ? this.renderDefaultImage(isActive) : this.renderCachedImage(isActive)}
                {this.returnMask(isActive)}
                <View style={
                    {
                        backgroundColor: statusColor,
                        position: 'absolute',
                        top: 28,
                        left: 30,
                        width: 12,
                        height: 12,
                        borderRadius:8,
                        borderWidth:1,
                        borderColor:'white',
                        opacity: isActive ? 1.0 : 0.5
                    }}/>
            </View>
           
        )
    }
}