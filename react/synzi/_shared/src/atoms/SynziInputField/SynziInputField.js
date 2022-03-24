import React, { Component } from 'react'
import {
    View,
    TextInput
} from 'react-native';
import styles from './styles';



export default class SynziInputField extends Component {

    render() {
        return (
            <View style={styles.inputContainerStyle}>
                <TextInput
                    underlineColorAndroid="transparent"
                    secureTextEntry={this.props.secureTextEntry}
                    placeholder={this.props.placeholder}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    style={styles.inputStyle}
                    value={this.props.value}
                    onChangeText={this.props.onChangeText}
                    returnKeyType={this.props.ready ? 'done' : null}
                />
            </View>
        )
    }
}