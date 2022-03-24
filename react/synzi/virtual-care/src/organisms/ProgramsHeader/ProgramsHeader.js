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

export default class ProgramsHeader extends Component {
    
    static propTypes = {
        /** Function to show programs modal */
        showProgramsModal: PropTypes.func.isRequired,
    }

    render() {
        const { showProgramsModal } = this.props
        
        return (
          <View style={styles.programContainerStyle}>
                <Image
                    style={styles.flagIconStyle}
                    resizeMode={'contain'}
                    source={require('../../../../_shared/images/icons/flagIcon.png')} 
                />
                <Text style={styles.programTextStyle}>Programs</Text>
                <View style={styles.enrollButtonContainerStyle}>
                  <TouchableOpacity 
                    onPress={() => showProgramsModal()}
                    style={styles.buttonStyle}
                  >
                    <Text style={styles.enrollTextStyle}>+ ENROLL</Text>
                  </TouchableOpacity>         
                </View>
          </View>
        )
    }
}

                    



