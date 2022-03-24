import React, { Component } from 'react'
import { 
    TouchableOpacity, 
    Image,
    View,
    Text
} from 'react-native'
import PropTypes from 'prop-types'

//Styles
import styles from './styles'

export default class AssignmentsHeader extends Component {
    
    static propTypes = {
        /** Function navigate to CareGiver screen */
        goToCaregiverScreen: PropTypes.func.isRequired,
    }

    render() {
        const { goToCaregiverScreen } = this.props
        
        return (
          <View style={styles.caregiverContainerStyle}>
                <Image
                    style={styles.caregiverIconStyle}
                    resizeMode={'contain'}
                    source={require('../../../../_shared/images/icons/icon-care-giver.png')} 
                />
                <Text style={styles.assignmentTextStyle}>Caregivers</Text>
                <View style={styles.assignButtonContainerStyle}>
                  <TouchableOpacity 
                    onPress={() => goToCaregiverScreen()}
                    style={styles.buttonStyle}
                  >
                    <Text style={styles.assignTextStyle}>+ ASSIGN</Text>
                  </TouchableOpacity>         
                </View>
          </View>
        )
    }
}

                    



