import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';


export default class AddPatientLanguageListRowView extends Component {


    renderImage = selected => {
        if (selected) {
            return (
                <Image
                  style={{ height: 30, width: 30,}}
                  resizeMode={'center'}
                  source={require('../../../../_shared/images/icons/checkmark.png')}
                />
            )
        }
        return null
    }


    render() {

        const { languageText, onPress, isSelected } = this.props

        return (
            <TouchableOpacity onPress={onPress} activeOpacity={1}>
                <View style={{flexDirection:'row', alignItems:'center', height: 60, justifyContent:'space-between', paddingLeft:10,  paddingRight:10, backgroundColor:'black'}}>
                    <Text style={{ color: 'white' , fontSize: 16}}>
                        {languageText}
                    </Text>
                    <View>{this.renderImage(isSelected)}</View>
                </View>
            </TouchableOpacity>
        )
    }
}