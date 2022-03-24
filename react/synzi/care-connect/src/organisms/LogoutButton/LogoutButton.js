import React, { Component } from 'react'
import {
    TouchableOpacity,
    Alert,
    Image
} from 'react-native';

import styles from './styles'
import LogoutImage from '../../../../care-connect/src/images/logout.png'

export default class LogoutButton extends Component {
    constructor(props) {
        super(props)
    }
    
    render() {
      
        const { displayName, logout } = this.props

        return(
                <TouchableOpacity 
                    onPress={() => {
                        Alert.alert(
                            'Logout',
                            `Logout user ${displayName}?`,
                            [
                                { text: 'Cancel', onPress: () => null },
                                { text: 'Yes', onPress: () => logout()}
                            ],
                            { cancelable: false }
                        )
                    }}
                    style={{paddingLeft: 5}}
                >
                    <Image
                        style = {styles.logoutButtonStyle}
                        resizeMode={'contain'}
                        source={LogoutImage}
                    />
                </TouchableOpacity>
        ) 
        
    }

}