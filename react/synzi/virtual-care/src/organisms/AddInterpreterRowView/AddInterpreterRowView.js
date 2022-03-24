import React, { Component } from 'react'
import {
    View,
    Text
} from 'react-native';
import styles from './styles';
import UserCallButton from '../../atoms/UserCallButton/UserCallButton'

export default class AddIntepreterRowView extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        const { overAllStatus, userName } = this.props

        return (
            <View style={styles.searchRowContainerStyle}>
                <View style={styles.textContainerStyle}>
                    <Text style={styles.userNameTextStyle}>{userName}</Text>
                </View>
                <View style={styles.callButtonStyle}>
                    <UserCallButton 
                        size={42}
                        isActive={true}
                        onPress={this.props.callUser}
                        overAllStatus={overAllStatus}
                    />
                </View>
            </View>
        )
    }
}