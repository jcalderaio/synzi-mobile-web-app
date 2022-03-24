import React, { Component } from 'react'
import {
    View, 
    Alert,
    Text,
    TextInput
} from 'react-native';
import styles from './styles';
import SynziButton from '../../../../_shared/src/atoms/SynziButton/SynziButton'
import DatePicker from 'react-native-datepicker'


export default class ConfirmBirthdayForm extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        const {
            dob,
            onDateChange,
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
                    <Text style={styles.inputFormHeadingStyle}>DATE OF BIRTH</Text>
                    <DatePicker
                        androidMode={'spinner'}
                        style={styles.inputFormStyle}
                        date={dob}
                        mode="date"
                        placeholder="Select Birthday"
                        format="YYYY-MM-DD"
                        minDate="1900-01-01"
                        maxDate="2030-12-31"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={styles.datePickerStyle}
                        onDateChange={onDateChange}
                    />
                </View>
                <View style={styles.loginButtonStyle}>
                    <SynziButton 
                        loading={loginLoading}
                        buttonText={loginLoading ? '' : 'Continue'}
                        theme='blue'
                        data-testid='birthday-submit-button'
                        activeOpacity={0.2}
                        onPress={() => onSignin()}
                    />
                </View>
                <View style={styles.sepStyle}/>
            </View>
        )
    }
}