import React, { Component } from 'react'
import { 
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StatusBar,
    Alert
} from 'react-native';
import PatientProgramRows from './PatientProgramRows'

//Styles
import styles from './styles'


export default class PatientProgramsList extends Component {

    componentDidMount(){
        StatusBar.setBarStyle('dark-content', true)
    }

    componentWillUnmount(){
        StatusBar.setBarStyle('light-content', true)
    }

    addProgramHandler(id, name) {
        const { displayName } = this.props

        Alert.alert(
            'Add Program',
            `Are you sure you would like to enroll ${displayName} in ${name}?`,
            [
                { text: 'Cancel', onPress: () => null},
                { text: 'Yes', onPress: () => {
                    const { onAddProgram, dismissHandler, onProgramRefresh } = this.props

                    onAddProgram(id)
                    onProgramRefresh()
                    dismissHandler()
                } },
            ],
            { cancelable: false }
        )
    }

    _renderItem = ({item}) => (
        <PatientProgramRows
            addProgram={() => this.addProgramHandler(item.id, item.name)}
            programText={item.name}
        />
    )

    render(){

        const { dismissHandler, programs } = this.props

        return(
            <View style={{flex: 1, backgroundColor: 'black'}}>
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
                    <Text style={{ color:'black', fontSize:18, fontWeight:'800' }}>Programs</Text>
                    <View style={{ width:65, height:30, backgroundColor:'white' }} />
                </View>
                <FlatList
                    data={programs}
                    renderItem={this._renderItem}
                    keyExtractor={item => item.id}
                />
            </View>
        )
    }
}
