import React, { Component } from 'react'
import {
    TouchableOpacity,
    Text
} from 'react-native';
import styles from './styles';



export default class ForgotPasswordButton extends Component {

    render() {
        return (
            <TouchableOpacity 
                onPress={this.props.onPress} 
                style={styles.buttonContainerStyle}
                data-testid='login-forgot-link'>
                <Text style={styles.textStyle}>
                    Forgot Password
                </Text>
            </TouchableOpacity>
        )
    }
}