import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    FlatList,
    ActivityIndicator,
    Platform,
    Alert,
    AsyncStorage,
    ScrollView
} from 'react-native';
import styles from './styles'
import UserRowView from '../../../../virtual-care/src/organisms/UserRowView/UserRowView'

import { AppColor} from '../../../../_shared/Color';
import { Query } from 'react-apollo'
import deviceLog from 'react-native-device-log'
import CaregiverQL from '../../../../_shared/graphql/CaregiverQL';
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import EnvManager from '../../../../_shared/services/EnvManager'
import { AppConfig } from '../../../../_shared/constants/AppConfig'
import Reactotron from 'reactotron-react-native'


export default class AddCaregiverContainerView extends Component {

    constructor(props) {
        super(props)

        this.client = new ApolloClient({
            uri:EnvManager.getInstance().getGraphQLUrl(),
            request: async (operation) => {
                const token = await AsyncStorage.getItem(AppConfig.AUTH_TOKEN)
                //Reactotron.log("********* operation:", operation.query.loc.source.body)  
                operation.setContext({
                    headers: {
                        authorization: 'Bearer ' + token,
                    },
                })
            },
            onError: ({ graphQLErrors, networkError }) => {
                if (graphQLErrors) {
                    Reactotron.log(graphQLErrors)
                    deviceLog.log(`GRAPHQL ERROR:  ${graphQLErrors}`)
                }
                if (networkError) {
                    Reactotron.log(networkError)
                    deviceLog.log(`NETWORK ERROR:  ${networkError}`)
                }
            },
        })
    }


    callUser(item){

        const { makeCall } = this.props
        makeCall(item, this.patientUserId)
        this.props.hideModal()
    }

    showCallUserAlert(item){
        Alert.alert(
            'Call',
            `Are you sure you want to add\n${item.displayName}?`,
            [
                { text: 'Cancel', onPress: () => null },
                { text: 'Yes', onPress: () => this.callUser(item) }
            ],
            { cancelable: false }
        )
    }

    _renderItem = ({item, separators}) => (
        <UserRowView
            profileImage={item.user.profileImage}
            searchRow={true}
            userName={item.user.displayName}
            overAllStatus={item.user.overallStatus}
            callUser={() => this.showCallUserAlert(item.user)}
            navTo={Reactotron.log}
        />
    )

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


    renderErrorState(errorText){
        return(
            <Text style={styles.errorTextStyle}>{errorText}</Text>
        )
    }

    renderLoadingState(){
        return(
            <ActivityIndicator size={'large'} />
        )
    }


    renderResults(data){

        return (
            <View>
                <FlatList
                    data={data}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={this.renderSeparator}
                    keyExtractor={item => item.id}
                />
            </View>
        )
    }


    render(){

        const { patientId } = this.props
        const GET_CAREGIVERS_BY_PATIENT_ID_QUERY = CaregiverQL.getCaregiversByPatientId()

        if(patientId === 0) return null

        return(
            <ApolloProvider client={this.client}>
                <View style={styles.mainContainerStyle}>
                    <View style={styles.headerStyle}>
                        <TouchableOpacity onPress={this.props.hideModal} activeOpacity={50}>
                            <Text style={styles.headerTextBackStyle}>Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTextStyle}>Add Caregiver</Text>
                        <Text style={styles.headerTextEmptyStyle}>Empty</Text>
                    </View>
                
                    <Query 
                        query={GET_CAREGIVERS_BY_PATIENT_ID_QUERY}
                        pollInterval={5000}
                        fetchPolicy={'network-only'}
                        variables={{ patientId }}
                    >
                        {({ loading, error, data }) => {

                            if(loading){
                                return (
                                    <View style={styles.usersContainerStyle}>{this.renderLoadingState()}</View>
                                )
                            }

                            if(error){
                                return (
                                    <View style={styles.usersContainerStyle}>{this.renderErrorState(error.message)}</View>
                                )
                            }

                            if(data){

                                this.patientUserId = data.patient.user.id
                                const caregivers = data.patient.caregivers.filter(c => c.user.isActive)

                                if(caregivers.length > 0){
            
                                    this.searchData = caregivers

                                    return(
                                        <ScrollView style={{flex: 1}}>{this.renderResults(this.searchData)}</ScrollView>
                                    )

                                }

                                return (
                                    <View style={styles.usersContainerStyle}>{this.renderErrorState('No Caregivers Available')}</View>
                                )

                            }

                            return (
                                <View style={styles.usersContainerStyle}>{this.renderErrorState('No Caregivers Available')}</View>
                            )
                            
                        }}
                    </Query>
                    
                </View>
            </ApolloProvider>
        )

    }

}