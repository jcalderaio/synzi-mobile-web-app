import React, { Component } from 'react'
import {
    Text,
    View,
} from 'react-native';
import styles from './styles';



export default class UserTagView extends Component {

    render() {
        return (
            <View style={styles.tagTextContainerStyle}>
                <Text style={styles.tagTextStyle}>{this.props.tagText}</Text>
            </View>
        )
    }
}

