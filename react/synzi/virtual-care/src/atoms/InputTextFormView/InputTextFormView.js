import React, { Component } from 'react'
import {
    Text,
    View,
    TextInput,
    Dimensions,
    Picker
} from 'react-native';
import styles from './styles';
import { SynziColor } from '../../../../_shared/Color';
import DatePicker from 'react-native-datepicker'
import SegmentedControlTab from 'react-native-segmented-control-tab'



export default class InputTextFormView extends Component {

    constructor(props) {
        super(props)

        this.onChangeTextHandler = this.onChangeTextHandler.bind(this)

        this.state = {
            width:0,
            date:null
        };
    }

    onLayout(event) {
        const { width } = event.nativeEvent.layout;
        this.setState({ width: width });
    }


    onChangeTextHandler(text){
        const { labelText } = this.props
        this.props.onChangeText(labelText, text)
    }


    render() {

        const { 
            labelText, 
            required, 
            warningText, 
            placeHolderText, 
            isDateInput, 
            keyboardType, 
            isSegmentedControl, 
            segmentValues,
            segmentedControlHandler,
            selectedIndex,
            textValue,
            isSpacer,
            onChangeDate,
            languageListHandler,
            formSatisfied,
            isNewPatientForm,
            editing
        } = this.props

        const { width } = this.state

        if(isSpacer){
            return(
                <View style={{ height:50 }} />
            )
        }


        if(!isNewPatientForm && !editing){

            return (
                <View style={{ marginTop:20, paddingLeft:10, paddingRight:10 }}>
                    <View style={{
                            flexDirection:'row',
                            justifyContent:required ? 'space-between': 'flex-start',
                            marginBottom:5
                        }}>
                        <Text style={{color:'white'}}>{labelText}</Text>
                    </View>
                    <Text style={{ backgroundColor:'black', borderRadius:5, height:35, color:SynziColor.SYNZI_BLUE }}>{textValue}</Text>
                </View>
              
            )

        }


        if(isSegmentedControl){
            return(
                <View style={{ marginTop:20, paddingLeft:10, paddingRight:10 }}>
                    <View style={{
                            flexDirection:'row',
                            justifyContent:required ? 'space-between': 'flex-start',
                            marginBottom:5
                        }}>
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


        if(isDateInput){
            return(
                <View onLayout={(event) => this.onLayout(event)} style={{ marginTop:20, paddingLeft:10, paddingRight:10 }}>
                    <View style={{
                            flexDirection:'row',
                            justifyContent:required ? 'space-between': 'flex-start',
                            marginBottom:5
                        }}>
                        <Text style={{color:'white'}}>{labelText}</Text>
                        {required && 
                            <Text style={{color:SynziColor.SYNZI_BLUE, fontSize:12}}>REQUIRED</Text>
                        }
                    </View>
                    <View style={{backgroundColor:'white', height:35, borderRadius:5}}/>
                    <DatePicker
                        style={{
                            position:'absolute',
                            borderRadius:5,
                            height:20,
                            top: 23,
                            marginLeft:10,
                            marginRight:10,
                            width:width-20,
                        }}
                        date={textValue}
                        mode="date"
                        placeholder="MM/DD/YYYY"
                        format="MM/DD/YYYY"
                        minDate="1900-01-01"
                        maxDate="2030-12-31"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={styles.datePickerStyle}
                        onDateChange={onChangeDate}
                        showIcon={false}
                    />
                    <Text style={{marginTop: 5, color:'red', fontSize:12}}>{(editing || formSatisfied) ? '' : warningText}</Text>
                </View>
            )
        }

        return (
            <View style={{ marginTop:20, paddingLeft:10, paddingRight:10 }}>
                <View style={{
                        flexDirection:'row',
                        justifyContent:required ? 'space-between': 'flex-start',
                        marginBottom:5
                    }}>
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
                    onFocus={languageListHandler ? languageListHandler : null}
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