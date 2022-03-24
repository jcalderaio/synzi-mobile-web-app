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

export default class AssignmentButton extends Component {
    
    static propTypes = {
        /** Name of the program */
        assignmentText: PropTypes.string.isRequired,
        /** Function to remove program */
        onRemoveCareTeam: PropTypes.func.isRequired
    }

    showAlert(onRemoveCareTeam){

      const { displayName, assignmentText } = this.props
        
      Alert.alert(
          'Remove Assignment',
          `Are you sure you would like to remove ${displayName} from ${assignmentText}?`,
          [
              { text: 'Cancel', onPress: () => null},
              { text: 'Yes', onPress: () => onRemoveCareTeam() }
          ],
          { cancelable: false }
      )
    }

    render() {
        const { assignmentText, onRemoveCareTeam, isActive } = this.props
        
        return (
          <View style={{ paddingBottom: 10 }}>
            <View style={[styles.borderContainerStyle, { backgroundColor: isActive ? SynziColor.SYNZI_BLUE : SynziColor.SYNZI_MEDIUM_GRAY, borderColor: isActive ? SynziColor.SYNZI_BLUE : SynziColor.SYNZI_MEDIUM_GRAY }]}>
              <View style={styles.programContainerStyle}>
                <Text style={styles.programTextStyle}>{assignmentText.toUpperCase()}</Text>
                <View style={styles.programButtonContainerStyle}>
                  <TouchableOpacity 
                    onPress={() => this.showAlert(onRemoveCareTeam)}
                  >
                    <Image
                      style={styles.deleteIconStyle}
                      resizeMode={'contain'}
                      source={require('../../../../_shared/images/icons/delete.png')} 
                    />
                  </TouchableOpacity>         
                </View>
              </View>
            </View>
          </View>
        )
    }
}