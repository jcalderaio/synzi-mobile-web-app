import React, { Component } from 'react'
import {
    TouchableOpacity,
    Text,
    View,
    Image
} from 'react-native';
import styles from './styles';



export default class BreadCrumbButton extends Component {

    render() {

        let sep = ' > '

        return (
            <View style={styles.buttonContainerStyle}>
                <TouchableOpacity 
                    onPress={this.props.onPress}>
                    <View style={styles.buttonContainerStyle}>
                        <Text style={styles.textLinkStyle}>
                            Back
                        </Text>
                    </View>
                </TouchableOpacity>
                <Text style={styles.textStyle}>
                    {sep}
                </Text>
                <Text style={styles.textStyle}>
                    {this.props.breadCrumbText}
                </Text>
            </View>
        )
    }
}