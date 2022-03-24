import React, { Component } from 'react'
import {
    Text,
    View,
    TextInput
} from 'react-native';
import { SynziColor } from '../../../../_shared/Color';
import SegmentedControlTab from 'react-native-segmented-control-tab'

import styles from './styles';

export default class CreateCaregiverForm extends Component {

    onChangeTextHandler = (text) => {
        const { labelText } = this.props
        this.props.onChangeText(labelText, text)
    }

    render() {

        const { 
            labelText, 
            required, 
            warningText, 
            placeHolderText, 
            keyboardType, 
            isSegmentedControl, 
            segmentValues,
            segmentedControlHandler,
            selectedIndex,
            textValue,
            isSpacer,
            formSatisfied,
        } = this.props

        if(isSpacer){
            return(
                <View style={{ height:50 }} />
            )
        }

        if(isSegmentedControl){
            return(
                <View style={{ marginTop:20, paddingLeft:10, paddingRight:10 }}>
                    <View 
                        style={{
                            flexDirection:'row',
                            justifyContent:required ? 'space-between': 'flex-start',
                            marginBottom:5
                        }}
                    >
                        <Text style={{color:'white'}}>{labelText}</Text>
                    </View>
                    <SegmentedControlTab
                        activeTabStyle={{backgroundColor:SynziColor.SYNZI_BLUE}}
                        activeTabTextStyle={{color:'white'}}
                        tabStyle={{borderColor:SynziColor.SYNZI_BLUE}}
                        tabTextStyle={{color:'black'}}
                        values={segmentValues}
                        selectedIndex={selectedIndex}
                        onTabPress={segmentedControlHandler}
                    />
                </View>
            )
        }

        if(labelText === 'PHONE') {
            return (
                <View style={{ marginTop:20, paddingLeft:10, paddingRight:10 }}>
                    <View 
                        style={{
                            flexDirection:'row',
                            justifyContent:required ? 'space-between': 'flex-start',
                            marginBottom:5
                        }}
                    >
                        <Text style={{color:'white'}}>{labelText}</Text>
                        {required && 
                            <Text style={{color:SynziColor.SYNZI_BLUE, fontSize:12}}>REQUIRED</Text>
                        }
                    </View>
                    <TextInput
                        style={{
                            paddingLeft:10,
                            backgroundColor:'white',
                            borderRadius:5,
                            height:35
                        }}
                        maxLength={12}
                        underlineColorAndroid="transparent"
                        value={textValue}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        placeholder={placeHolderText}
                        keyboardType={keyboardType}
                        onChangeText={this.onChangeTextHandler}
                    />
                    {(required && !formSatisfied) && 
                        <Text style={{marginTop: 5, color:'red', fontSize:12}}>{warningText}</Text>
                    }
                    {(!required && !formSatisfied && textValue.length > 0) && 
                        <Text style={{marginTop: 5, color:'red', fontSize:12}}>{warningText}</Text>
                    }
                </View>
            )
        }

        return (
            <View style={{ marginTop:20, paddingLeft:10, paddingRight:10 }}>
                <View 
                    style={{
                        flexDirection:'row',
                        justifyContent:required ? 'space-between': 'flex-start',
                        marginBottom:5
                    }}
                >
                    <Text style={{color:'white'}}>{labelText}</Text>
                    {required && 
                        <Text style={{color:SynziColor.SYNZI_BLUE, fontSize:12}}>REQUIRED</Text>
                    }
                </View>
                <TextInput
                    style={{
                        paddingLeft:10,
                        backgroundColor:'white',
                        borderRadius:5,
                        height:35
                    }}
                    underlineColorAndroid="transparent"
                    value={textValue}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    placeholder={placeHolderText}
                    keyboardType={keyboardType}
                    onChangeText={this.onChangeTextHandler}
                />
                {(required && !formSatisfied) && 
                    <Text style={{marginTop: 5, color:'red', fontSize:12}}>{warningText}</Text>
                }
                {(!required && !formSatisfied && textValue.length > 0) && 
                    <Text style={{marginTop: 5, color:'red', fontSize:12}}>{warningText}</Text>
                }
            </View>
        )
    }
}