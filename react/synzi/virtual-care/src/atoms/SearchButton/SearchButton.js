import React, { Component } from 'react'
import {
    TouchableOpacity,
    Text,
    View,
    Image
} from 'react-native';
import styles from './styles';



export default class SearchButton extends Component {

    render() {
        return (
            <TouchableOpacity 
                onPress={this.props.onPress} 
                style={styles.buttonContainerStyle}
                data-testid='login-forgot-link'>
                <View style={styles.buttonContainerStyle}>
                    <Image
                        style={styles.iconSize}
                        resizeMode={'contain'}
                        source={require('../../../../_shared/images/icons/searchIcon.png')}
                    />
                    <Text style={styles.textStyle}>
                        Search
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}