import React, { Component } from 'react'
import { 
    View, 
    Button, 
    ActivityIndicator, 
    Text, 
    StatusBar,
    AsyncStorage
} from 'react-native'
import { AppConfig } from '../../../../_shared/constants/AppConfig'
import EnvironmentPickerView from '../EnvironmentPickerView/EnvironmentPickerView'
import EnvManager from '../../../services/EnvManager'
import EnvQL from '../../../../_shared/graphql/EnvQL'
import { Query } from 'react-apollo'
import styles from './styles';



export default class EnvironmentContainerView extends Component {

    static navigationOptions = ({ navigation }) => {
        
        const params = navigation.state.params || {};
     
        return {
            headerLeft: (
                <Button
                    onPress={() => navigation.dismiss()}
                    title='OK'
                    color='black'
                />
            )
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            envChanged: false
        }

        this.onPressItem = this.onPressItem.bind(this)
    }

    onPressItem(){
        this.setState( { envChanged: true } )
        StatusBar.setBarStyle('light-content', true)
    }

    componentDidMount(){
        StatusBar.setBarStyle('dark-content', true)
    }

    componentWillUnmount(){
        if (this.state.envChanged) {
            this.props.screenProps.refreshEnvironment()
        }
    }

    renderErrorState(){
        return(
            <Text style={styles.errorTextStyle}>Error Loading Environments</Text>
        )
    }

    renderLoadingState(){
        return(
            <ActivityIndicator size={'large'} />
        )
    }


    render() {

        return (
            <Query query={EnvQL.getEnvironments()}>
                {({ loading, error, data }) => {

                    if(loading){
                        return (
                            <View style={styles.errorContainerStyle}>{this.renderLoadingState()}</View>
                        )
                    }

                    if (error) {
                        return (
                            <View style={styles.errorContainerStyle}>{this.renderErrorState()}</View>
                        )
                    }

                    if(data.envs){

                        var tempData = []

                            data.envs.map((value, i) => {
                            var selected = (EnvManager.getInstance().getCode() === value["code"])
                            var envObject = {
                                "selected":selected, 
                                name:value["name"], 
                                graphqlUrl:value["graphqlUrl"],
                                restUrl:value["restUrl"], 
                                socketUrl:value["socketUrl"], 
                                assetsUrl:value["assetsUrl"],  
                                code:value["code"],
                                isActive:value["isActive"]
                            }

                            tempData[i] = envObject
                        })

                        return(
                        <View style={styles.pickerContainerStyle}>
                            <EnvironmentPickerView
                                pickerData={tempData}
                                pickerRowSelected={this.onPressItem}
                            />
                        </View>
                        )
                    }

                    //Catch all
                    return (
                        <View style={styles.pickerContainerStyle}></View>
                    )
                }}
            </Query>
        )
    }
}
