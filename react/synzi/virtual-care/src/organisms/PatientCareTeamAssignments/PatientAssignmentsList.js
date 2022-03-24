import React, { Component } from 'react'
import { 
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StatusBar,
    Alert
} from 'react-native';
import PatientAssignmentRows from './PatientAssignmentRows'

//Styles
import styles from './styles'


export default class PatientAssignmentsList extends Component {

    componentDidMount(){
        StatusBar.setBarStyle('dark-content', true)
    }

    componentWillUnmount(){
        StatusBar.setBarStyle('light-content', true)
    }

    addCareTeamHandler(id, name) {
        const { displayName } = this.props

        Alert.alert(
            'Add Assignment',
            `Are you sure you would like to add ${displayName} to ${name}?`,
            [
                { text: 'Cancel', onPress: () => null},
                { text: 'Yes', onPress: () => {
                    const { onAddCareTeam, dismissHandler, onAssignmentsRefresh } = this.props

                    onAddCareTeam(id)
                    onAssignmentsRefresh()
                    //careTeamsLookup()
                    dismissHandler()
                } },
            ],
            { cancelable: false }
        )
    }

    _renderItem = ({item}) => (
        <PatientAssignmentRows
            addCareTeam={() => this.addCareTeamHandler(item.id, item.name)}
            assignmentText={item.name}
        />
    )

    render(){

        const { dismissHandler, assignments } = this.props

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
                    <Text style={{ color:'black', fontSize:18, fontWeight:'800' }}>Assignments</Text>
                    <View style={{ width:65, height:30, backgroundColor:'white' }} />
                </View>
                <FlatList
                    data={assignments}
                    renderItem={this._renderItem}
                    keyExtractor={item => item.id}
                />
            </View>
        )
    }
}
