import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import styles from './styles';
import UserAvatarView from '../../atoms/UserAvatarView/UserAvatarView'
import { SynziColor } from '../../../../_shared/Color';


export default class PatientRowView extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        const { profileImage, overallStatus, selectedPatient, patientId } = this.props

        const selected = selectedPatient === patientId 
        const rowStyle = selected ? styles.selectedRowContainerStyle : styles.rowContainerStyle
        const tintColor = selected ? SynziColor.SYNZI_BLUE : null

        return(
            <TouchableOpacity onPress={this.props.selectPatient}>
                <View style={rowStyle}>
                    <View style={styles.userAvatarStyle}>
                        <UserAvatarView
                            tintColor={tintColor}
                            isPatient={true}
                            overAllStatus={overallStatus}
                            profileImage={profileImage}
                            width={42}
                            height={42}
                        />
                    </View>
                    <View style={styles.textContainerStyle}>
                        <Text style={styles.userNameTextStyle}>{this.props.userName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
        
    }

}