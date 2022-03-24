import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Platform,
    Image
} from 'react-native';

import { AppConfig } from '../../../../_shared/constants/AppConfig'



export default class AddPartyButton extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress} activeOpacity={50}>
                <Image
                    style = {{
                        width: 50,
                        height: 50,
                        marginLeft: Platform.OS === 'android' ? 20 : 0
                    }}
                    resizeMode={'contain'}
                    source={require('../../../../_shared/images/icons/callAnswerButton.png')}
                />
            </TouchableOpacity>
        )
    }
}