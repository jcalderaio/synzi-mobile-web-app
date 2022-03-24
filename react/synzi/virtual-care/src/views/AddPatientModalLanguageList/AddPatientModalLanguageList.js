import React, { Component } from 'react'
import { 
    View,
    Text,
    FlatList,
    Platform,
    Button,
    TouchableOpacity,
    StatusBar
} from 'react-native';
import { AppColor } from '../../../../_shared/Color'
import AddPatientLanguageListRowView from '../../atoms/AddPatientLanguageListRowView/AddPatientLanguageListRowView'



export default class AddPatientModalLanguageList extends Component {

    constructor(props) {
        super(props)

        //Get the current selected language
        let languageCode = this.props.currentSelectedLanguage['code']

        //Get the index of currently selected language against the raw language list
        var index = this.props.languages.map(function (obj) { 
            return obj.code; 
        }).indexOf(languageCode);

        //Get a copy of the language list with the current language selected set to true
        let newLanguageList = this.props.languages.map((value, i) => {
            value.selected = false
            if (index === i) {
                return { ...value, selected: !value.selected }
            }
            return value
        })

        //Set the state
        this.state = { 
            languages: newLanguageList
        }
    }

    componentDidMount(){
        StatusBar.setBarStyle('dark-content', true)
    }

    componentWillUnmount(){
        StatusBar.setBarStyle('light-content', true)
    }

    _renderItem = ({item, index, separators}) => (
        <AddPatientLanguageListRowView
            onPress={() => this.pickerRowSelected(index)}
            languageText={item.name}
            isSelected={item.selected}
        />
    )


    pickerRowSelected = index => {

        const { languageSelected } = this.props

        this.newState = this.state.languages.map((value, i) => {
            value.selected = false
            if (index === i) {
                languageSelected(value)
                return { ...value, selected: !value.selected }
            }
            return value
        })

        this.setState({ languages: this.newState })

    }


    renderSeparator = () => {
        return (
            <View
                style={{
                  height: Platform.OS === 'ios' ? 1 : 0.5,
                  width: '100%',
                  backgroundColor: AppColor.LIST_SEP_COLOR,
                }}
            />
        )
    }


    render(){

        const { dismissHandler } = this.props

        const { languages } = this.state

        return(
            <View style={{flex:1}}>
                <View style={{
                    backgroundColor:'white', 
                    height: 70, 
                    flexDirection:'row', 
                    alignItems:'center',
                    justifyContent:'space-between',
                    paddingTop:10
                }}>
                    <TouchableOpacity 
                        disabled={false}
                        onPress={dismissHandler}>
                        <Text style={{ paddingLeft:10, color:'black', fontSize:18, fontWeight:'400' }}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={{ color:'black', fontSize:18, fontWeight:'800' }}>Languages</Text>
                    <View style={{ width:65, height:30, backgroundColor:'white' }}></View>
                </View>
                <FlatList
                    data={languages}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={this.renderSeparator}
                    keyExtractor={item => item.name}
                />
            </View>
        )
    }

}
