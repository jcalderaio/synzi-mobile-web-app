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

export default class ProgramButton extends Component {
    
    static propTypes = {
        /** Name of the program */
        programText: PropTypes.string.isRequired,
        /** Function to remove program */
        onRemoveProgram: PropTypes.func.isRequired
    }

    showAlert(onRemoveProgram){

      const { displayName, programText } = this.props
        
      Alert.alert(
          'Remove Program',
          `Are you sure you would like to disenroll ${displayName} from ${programText}?`,
          [
              { text: 'Cancel', onPress: () => null},
              { text: 'Yes', onPress: () => onRemoveProgram() },
          ],
          { cancelable: false }
      )
    }

    render() {
        const { programText, onRemoveProgram, isActive } = this.props
        
        return (
          <View style={{ paddingBottom: 10 }}>
            <View style={[styles.borderContainerStyle, { backgroundColor: isActive ? SynziColor.SYNZI_BLUE : SynziColor.SYNZI_MEDIUM_GRAY, borderColor: isActive ? SynziColor.SYNZI_BLUE : SynziColor.SYNZI_MEDIUM_GRAY }]}>
              <View style={styles.programContainerStyle}>
                <Text style={styles.programTextStyle}>{programText.toUpperCase()}</Text>
                <View style={styles.programButtonContainerStyle}>
                  <TouchableOpacity 
                    onPress={() => this.showAlert(onRemoveProgram)}
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