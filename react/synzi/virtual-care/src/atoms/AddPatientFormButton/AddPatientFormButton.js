import React, { Component } from 'react'
import {
    TouchableOpacity,
    Text,
    View,
    Image
} from 'react-native';
import styles from './styles';



export default class AddPatientFormButton extends Component {

    render() {

        const { buttonText, buttonHandler, disabled } = this.props

        return (
            <TouchableOpacity 
                onPress={buttonHandler} 
                disabled={disabled}>
                <View style={disabled ? styles.buttonContainerDisabledStyle : styles.buttonContainerStyle}>
                    <Text style={{ fontSize: 16 }}>{buttonText}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

