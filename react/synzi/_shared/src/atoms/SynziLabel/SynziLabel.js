import React, { Component } from 'react'
import {
    View,
    Text
} from 'react-native';
import styles from './styles';




export default class SynziLabel extends Component {

    render() {
        return (
            <View style={styles.labelContainerStyle}>
                <Text style={styles.normalTextStyle}>{this.props.textValue}</Text>
            </View>
        )
    }
}