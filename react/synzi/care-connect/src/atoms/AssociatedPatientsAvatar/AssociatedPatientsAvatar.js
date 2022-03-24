import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types'
import Avatar from '../../../../_shared/src/atoms/Avatar/Avatar'
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'
import ChevronDownIcon from 'react-native-vector-icons/Octicons'

import styles from './styles';

export default class AssociatedPatientsAvatar extends Component {
  static propTypes = {
    /* sets the patient Id of selected patient to state on HomeScreen */
    setPatientUserId: PropTypes.func.isRequired,
    /* id of the patient */
    patientUserId: PropTypes.string.isRequired,
    /** Name of Patient */
    displayName: PropTypes.string.isRequired,
    /** Profile image of patient */
    profileImage: PropTypes.string.isRequired,
    /** Is the user selected? */
    selected: PropTypes.bool.isRequired,
  }

    render() {


        const { displayName, profileImage, selected, setPatientUserId, patientUserId } = this.props

        if(selected) {
          return (
            
                <TouchableOpacity
                    onPress={() => setPatientUserId(patientUserId)}
                    activeOpacity={1}
                    style={styles.touchableOpacityStyle}
                >
                    <View style={{ paddingLeft: 10 }}>
                      <Avatar 
                        imgUrl={profileImage}
                        dimmed={false}
                        patientBar={true}
                      />
                    </View>
                    <Text 
                        style={styles.userNameTextStyle}
                        numberOfLines={2}>
                        {displayName}
                    </Text>
                    <ChevronDownIcon 
                      name="chevron-down" 
                      size={allowSidebar ? 24 : 16} 
                      color="white" 
                    />
                </TouchableOpacity>
        
          )
        }

        return (
            <View style={styles.inactivePatientAvatarContainerStyle}>
                <TouchableOpacity
                    onPress={() => setPatientUserId(patientUserId)}
                    activeOpacity={0.5}
                    style={styles.inactiveTouchableOpacityStyle}
                >
                    <View style={{ paddingLeft: 10 }}>
                      <Avatar 
                        imgUrl={profileImage}
                        dimmed={true}
                        patientBar={true}
                      />
                    </View>
                    <Text 
                        style={styles.inactiveUserNameTextStyle}
                        numberOfLines={2}>
                        {displayName}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}