import React, { Component } from 'react'
import {
    View, 
    Alert,
    Text,
    TextInput,
    Platform
} from 'react-native';
import PropTypes from 'prop-types'
import SynziButton from '../../../../_shared/src/atoms/SynziButton/SynziButton'

import styles from './styles';

export default class PhoneNumberForm extends Component {

    static propTypes = {
        /** Phone number input */
        formattedPhone: PropTypes.string.isRequired,
        /** Function to change phone number */
        handleChangePhone: PropTypes.func.isRequired,
        /** Is button loading? */
        loginLoading: PropTypes.bool.isRequired,
        /** Function to run when click continue button*/
        onSignin: PropTypes.func.isRequired
    }

    render() {

        const {
            formattedPhone,
            handleChangePhone,
            onSignin,
            loginLoading,
        } = this.props


        return (
            <View style={styles.loginContainerStyle}>
                <View style={styles.sepStyle}/>
                <View style={styles.inputFormContainerStyle}>
                    <Text style={styles.inputFormHeadingStyle}>MOBILE PHONE NUMBER</Text>
                    <TextInput
                        underlineColorAndroid="transparent"
                        maxLength={12}
                        keyboardType={Platform.OS === 'ios' ? "number-pad" : "numeric"}
                        returnKeyType="send"
                        placeholder="Enter phone number..."
                        placeholderTextColor="grey"
                        onChangeText={handleChangePhone}
                        style={styles.inputFormStyle}
                        value={formattedPhone}
                    />
                </View>
                <View style={styles.loginButtonStyle}>
                    <SynziButton 
                        loading={loginLoading}
                        buttonText={loginLoading ? '' : 'Continue'}
                        theme='blue'
                        activeOpacity={0.2}
                        onPress={() => onSignin()}
                    />
                </View>
                <View style={styles.sepStyle}/>
            </View>
        )
    }
}