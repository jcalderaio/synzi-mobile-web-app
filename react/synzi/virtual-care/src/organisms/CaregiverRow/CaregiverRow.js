import React, { Component } from 'react'
import {
    View,
    Image,
    Alert,
    Text,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types'
import UserAvatarView from '../../atoms/UserAvatarView/UserAvatarView'
import Avatar from '../../../../_shared/src/atoms/Avatar/Avatar'
import CaregiverQL from '../../../../_shared/graphql/CaregiverQL'
import { AppColor, SynziColor} from '../../../../_shared/Color';
import { Mutation } from 'react-apollo'
// Toast Message
import { showMessage } from "react-native-flash-message"
import { formatPhone }  from '../../../../_shared/helpers/Helpers'

import styles from './styles';
import Reactotron from 'reactotron-react-native'

export default class CaregiverRow extends Component {

  static propTypes = {
    /** Go back to patient profile screen */
    goBack: PropTypes.func.isRequired,
    /** Caregivers profile image */
    caregiverProfileImage: PropTypes.string.isRequired,
    /** Caregivers display name */
    caregiverName: PropTypes.string.isRequired,
    /** Caregivers display name */
    caregiverId: PropTypes.string.isRequired,
    /** Caregivers phone number */
    phone: PropTypes.string.isRequired,
    /** The name of the patient the Caregiver is associated with */
    patientName: PropTypes.string.isRequired,
    /** The id of the patient the Caregiver is associated with */
    patientId: PropTypes.string.isRequired,
  }

    handleAssignError = (error) => {
        Reactotron.error(`User assign error: ${error}`)
    }

    render() {

        const { goBack, caregiverProfileImage, caregiverName, caregiverId, phone, patientName, patientId } = this.props
        const ASSIGN_CAREGIVER_MUTATION = CaregiverQL.assignCaregiver()
        let formattedPhone = formatPhone(phone).formattedPhone

        return (
            <Mutation
                mutation={ASSIGN_CAREGIVER_MUTATION}
                variables={{ patientId, caregiverId }}
                onError={error => this.handleAssignError(error)}
            >
                {(assignCaregiver, {client}) => (
                    <TouchableOpacity 
                        onPress={() => {
                            Alert.alert(
                                `Would you like to assign ${caregiverName} as a Caregiver?`,
                                `\nThey will be able to receive messages and/or calls on behalf of ${patientName}`,
                                [
                                    { text: 'Cancel', onPress: () => null },
                                    { text: 'Assign', onPress: () => {
                                        assignCaregiver()
                                        goBack()
                                        showMessage({
                                            message: 'Success',
                                            description: `${this.props.caregiverName} has been successfully assigned to ${this.props.patientName}`,
                                            backgroundColor: AppColor.BRIGHT_GREEN,
                                            icon: "success",
                                            duration: 4000,
                                            color: 'black'
                                        });
                                    } }
                                ],
                                { cancelable: false }
                            )
                        }}
                    >
                        <View style={styles.rowContainerStyle}>
                            <View style={styles.userAvatarStyle}>
                                <Avatar
                                    imgUrl={caregiverProfileImage}
                                />
                            </View>
                            <View style={styles.textContainerStyle}>
                                <Text style={styles.userNameTextStyle}>{caregiverName}</Text>
                                <Text style={styles.phoneTextStyle}>{formattedPhone}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            </Mutation>
        )
    }
}
