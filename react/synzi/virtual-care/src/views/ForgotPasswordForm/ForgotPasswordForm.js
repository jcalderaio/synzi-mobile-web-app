import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types'
import styles from './styles';
import SynziButton from '../../../../_shared/src/atoms/SynziButton/SynziButton'
import SynziInputField from '../../../../_shared/src/atoms/SynziInputField/SynziInputField'


export default class ForgotPasswordForm extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        const {
            username,
            onSubmit,
            onInputChange,
            showSuccess,
            loading,
            errorMessage,
            goBackToLogin
        } = this.props
      
        let title = 'Forgot your password?'
        let message = 'Enter your username and we will send you a link to recover your password.'
      
        if (showSuccess) {
            title = 'Thanks!'
            message = 'Please check your email, including Spam or Junk folders, for instructions to recover your password.'
        }

        return(
            <View style={styles.formContainerStyle}>
                <View/>
                <View style={styles.subformContainerStyle}>
                    <Text style={styles.forgotPasswordHeaderTextStyle}>{title}</Text>
                    <Text style={styles.instructionTextStyle}>{message}</Text>
                    
                    {!showSuccess && errorMessage !== '' && (
                        <Text style={styles.errorMessageTextStyle}>{errorMessage}</Text>
                    )}

                    {!showSuccess && (
                        <TextInput
                            underlineColorAndroid="transparent"
                            secureTextEntry={false}
                            placeholder={'Enter your username'}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            style={styles.inputTextStyle}
                            value={username}
                            onChangeText={onInputChange}
                            returnKeyType={this.props.ready ? 'done' : null}
                        />
                    )}

                    {!showSuccess && (
                        <TouchableOpacity
                            onPress={onSubmit}
                            data-testid='login-forgot-link'
                            disabled={username === '' ? true : false}>
                            <View style={username === '' ? styles.sendEmailButtonDisabledStyle : styles.sendEmailButtonStyle }>
                                {loading && (
                                    <ActivityIndicator 
                                        style={styles.activityIndicatorStyle}
                                        size='small' 
                                        color='white'/>
                                )}
                                <Text style={styles.sendEmailButtonTextStyle}>Send Email</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity
                        onPress={goBackToLogin}>
                        <View style={styles.backToLoginButtonStyle}>
                            <Text style={styles.sendEmailButtonTextStyle}>Go to login</Text>
                        </View>
                    </TouchableOpacity>

                </View>
                <Image
                    style={styles.logoImageStyle}
                    resizeMode={'contain'}
                    source={require('../../../../_shared/images/logos/synzi_white_small_logo.png')}
                />
            </View>
        )
    }
}
