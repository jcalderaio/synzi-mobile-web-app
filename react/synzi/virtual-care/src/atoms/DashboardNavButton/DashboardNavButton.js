import React, { Component } from 'react'
import {
    TouchableOpacity,
    Text,
    View
} from 'react-native';
import styles from './styles';



export default class DashboardNavButton extends Component {

    constructor(props) {
        super(props)
    }


    render() {

        const { hideUndersore, noUnderscore } = this.props;
        
        if(hideUndersore || noUnderscore){

            return (
                <TouchableOpacity 
                    onPress={this.props.onPress}>
                    <View style={styles.containerStyle}>
                        <Text numberOfLines={2} style={styles.textStyle}>
                            {this.props.children}
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        }

        return (
            <TouchableOpacity 
                onPress={this.props.onPress}>
                <View style={styles.containerStyle}>
                    <Text numberOfLines={2} style={styles.textStyle}>
                        {this.props.children}
                    </Text>
                    <View style={styles.underLineViewStyle}/>
                </View>
            </TouchableOpacity>
        )
    }
}