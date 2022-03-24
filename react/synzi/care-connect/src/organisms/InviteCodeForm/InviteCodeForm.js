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



export default class InviteCodeForm extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        const {
            inviteCode,
            onInviteCodeChange,
            hasError,
            errorMessage,
            onSignin,
            loginLoading,
        } = this.props
        
        if(hasError){
            Alert.alert(
                'Sign In Error',
                errorMessage,
                [
                    { text: 'Ok', onPress: () => null }
                ],
                { cancelable: false }
            )
        }

        return (
            <View style={styles.loginContainerStyle}>
                <View style={styles.sepStyle}/>
                <View style={styles.inputFormContainerStyle}>
                    <Text style={styles.inputFormHeadingStyle}>ACCESS CODE</Text>
                    <TextInput
                        underlineColorAndroid="transparent"
                        secureTextEntry={false}
                        placeholder={'Enter your access code'}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        style={styles.inputFormStyle}
                        value={inviteCode}
                        data-testid='login-access-code'
                        onChangeText={onInviteCodeChange}
                        returnKeyType={null}
                    />
                </View>
                <View style={styles.loginButtonStyle}>
                    <SynziButton 
                        loading={loginLoading}
                        buttonText={loginLoading ? '' : 'Continue'}
                        buttonText="Continue"
                        theme='blue'
                        data-testid='access-code-submit-button'
                        activeOpacity={0.2}
                        onPress={() => onSignin()}
                    />
                </View>
                <View style={styles.sepStyle}/>
            </View>
        )
    }
}