import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';

//Styles
import styles from './styles'

export default class PatientProgramRows extends Component {

    render() {

        const { assignmentText, addCareTeam } = this.props

        return (
            <View>
                <TouchableOpacity onPress={() => addCareTeam()}>
                    <View style={{flexDirection:'row', alignItems:'center', height: 60, justifyContent:'space-between', paddingLeft:10,  paddingRight:10, backgroundColor:'black'}}>
                        <Text style={{ color: 'white' , fontSize: 16}}>
                            {assignmentText}
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.sepViewStyle}/>
            </View>
        )
    }
}