import React, { Component } from 'react'
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    View
} from 'react-native';
import styles from './styles';



export default class SynziButton extends Component {

    render() {

        const { loading, disabled, theme, onPress, buttonText} = this.props

        var buttonStyle = disabled ? styles.blueContainerDisbaledStyle : styles.blueContainerStyle

        if(theme === 'green'){
            buttonStyle = disabled ? styles.greenContainerDisabledStyle : styles.greenContainerStyle
        }

        if(loading){
            return (
                <TouchableOpacity 
                    onPress={onPress} 
                    style={buttonStyle}
                    disabled={disabled}>
                    <View style={styles.loadingContainerStyle}>
                        <ActivityIndicator
                            color={'black'}
                            style={{ marginRight: 10 }}
                            size={'small'} 
                        />
                        <Text style={styles.textStyle}>
                            {buttonText}
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        }

        return (
            <TouchableOpacity 
                onPress={onPress} 
                style={buttonStyle}>
                <Text style={styles.textStyle}>
                    {buttonText}
                </Text>
            </TouchableOpacity>
        )
    }
}
