import React, { Component } from 'react'
import {
    View, 
    Alert,
    Text,
    TextInput
} from 'react-native';
import styles from './styles';
import SynziButton from '../../../../_shared/src/atoms/SynziButton/SynziButton'
import SynziInputField from '../../../../_shared/src/atoms/SynziInputField/SynziInputField'



export default class LoginForm extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        const {
            username,
            password,
            onUserNameChange,
            onPasswordChange,
            onSignin,
            loginLoading,
        } = this.props

        return (
            <View style={styles.loginContainerStyle}>
                <View style={styles.sepStyle}/>
                <View style={styles.inputFormContainerStyle}>
                    <Text style={styles.inputFormHeadingStyle}>USERNAME</Text>
                    <TextInput
                        underlineColorAndroid="transparent"
                        secureTextEntry={false}
                        placeholder={'Enter your username'}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        style={styles.inputFormStyle}
                        value={username}
                        data-testid='login-username'
                        onChangeText={onUserNameChange}
                        returnKeyType={null}
                    />
                    <Text style={styles.inputFormHeadingStyle}>PASSWORD</Text>
                    <TextInput
                        underlineColorAndroid="transparent"
                        secureTextEntry={true}
                        placeholder={'Enter your password'}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        style={styles.inputFormStyle}
                        value={password}
                        data-testid='login-password'
                        onChangeText={onPasswordChange}
                        returnKeyType={null}
                    />
                </View>
                <View style={styles.loginButtonStyle}>
                    <SynziButton 
                        loading={loginLoading}
                        buttonText={loginLoading ? 'Signing In' : 'Sign In'}
                        theme='blue'
                        data-testid='login-submit-button'
                        activeOpacity={0.2}
                        onPress={onSignin}
                    />
                </View>
                <View style={styles.sepStyle}/>
            </View>
        )

    }

}