import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import styles from './styles';



export default class AddPatientBarView extends Component {

    constructor(props) {
        super(props)
    }


    render() {

        const { addPatient } = this.props

        return(
            <View style={styles.containerStyle}>
                <Text style={styles.titleTextStyle}>Patients</Text>
                <TouchableOpacity
                    onPress={addPatient}>
                        <Image
                            style={{ 
                                width: 45, 
                                height: 45,
                                marginRight: 10
                            }}
                            resizeMode={'contain'}
                            source={require('../../../../_shared/images/icons/addPatientButton.png')} 
                        />
                </TouchableOpacity>
            </View>
        )
        
    }

}
