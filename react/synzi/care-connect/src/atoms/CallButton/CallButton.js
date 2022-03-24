import React, { Component } from 'react'
import {
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import { AppColor, SynziColor } from '../../../../_shared/Color';



export default class UserCallButton extends Component {

    render() {

        const { isActive, overAllStatus, width, height, onPress } = this.props

        var statusColor = AppColor.USER_DISCONNECTED_COLOR

        switch(overAllStatus) {
            case 'available':
                statusColor = AppColor.USER_CONNECTED_COLOR
                break;
            case 'disconnected':
                statusColor = AppColor.USER_DISCONNECTED_COLOR
                break;
            case 'busy':
                statusColor = AppColor.USER_BUSY_COLOR
                break;
            default:
                statusColor = AppColor.USER_DISCONNECTED_COLOR
        }

        // Groups
        if (overAllStatus == null) {
            return (
                <TouchableOpacity
                    disabled={!isActive} 
                    onPress={onPress}>
                    <View 
                        style={
                            {
                                width: width ? width : 50, 
                                height: height ? height : 50,
                                borderRadius : width ? width/2 : 25,
                                backgroundColor: isActive ? AppColor.BRIGHT_GREEN : SynziColor.SYNZI_DARK_GRAY, 
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: isActive ? 1.0 : 0.5
                            }
                        }>
                        <Image
                            style={{ 
                                width: 25, 
                                height: 25,
                            }}
                            resizeMode={'contain'}
                            source={require('../../../../_shared/images/icons/phoneIcon.png')} 
                        />
                    </View>
                </TouchableOpacity>
            )
        } 
        else {
            return (
                <TouchableOpacity
                    disabled={!isActive} 
                    onPress={onPress}>
                    <View 
                        style={
                            {
                                width: width ? width : 50, 
                                height: height ? height : 50,
                                borderRadius : width ? width/2 : 25,
                                backgroundColor: statusColor, 
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: isActive ? 1.0 : 0.5
                            }
                        }>
                        <Image
                            style={{ 
                                width: 25, 
                                height: 25,
                            }}
                            resizeMode={'contain'}
                            source={require('../../../../_shared/images/icons/phoneIcon.png')} 
                        />
                    </View>
                </TouchableOpacity>
            )
        }
    }
}