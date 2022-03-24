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

        const { overAllStatus, size } = this.props

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

        var opacity = (statusColor === AppColor.USER_BUSY_COLOR) ? 0.5 : 1.0
        var disabled = (overAllStatus === 'available') ? false : true

        return (
            <TouchableOpacity
                disabled={disabled} 
                onPress={this.props.onPress}>
                <View 
                    style={
                        {
                            width: size ? size : 50, 
                            height: size ? size : 50,
                            borderRadius : size ? size/2 : 25,
                            backgroundColor: statusColor, 
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: opacity
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