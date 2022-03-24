import React, { Component } from 'react'
import { 
    TouchableOpacity, 
    Image,
    Alert,
    ActivityIndicator,
    View,
    Text,
    Button
} from 'react-native'
import PropTypes from 'prop-types'
import { SynziColor } from '../../../../_shared/Color';

//Styles
import styles from './styles'

export default class AssignmentsHeader extends Component {
    
    static propTypes = {
        /** Function to show programs modal */
        showAssignmentsModal: PropTypes.func.isRequired,
    }

    render() {
        const { showAssignmentsModal } = this.props
        
        return (
          <View style={styles.assignmentContainerStyle}>
                <Image
                    style={styles.stethoscopeIconStyle}
                    resizeMode={'contain'}
                    source={require('../../../../_shared/images/icons/stethoscope.png')} 
                />
                <Text style={styles.assignmentTextStyle}>Care Teams</Text>
                <View style={styles.assignButtonContainerStyle}>
                  <TouchableOpacity 
                    onPress={() => showAssignmentsModal()}
                    style={styles.buttonStyle}
                  >
                    <Text style={styles.assignTextStyle}>+ ASSIGN</Text>
                  </TouchableOpacity>         
                </View>
          </View>
        )
    }
}

                    



