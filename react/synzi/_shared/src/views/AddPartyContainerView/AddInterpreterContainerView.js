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
import AddInterpreterRowView from '../../../../virtual-care/src/organisms/AddInterpreterRowView/AddInterpreterRowView'
import { AppColor} from '../../../../_shared/Color';
import { Query } from 'react-apollo'
import deviceLog from 'react-native-device-log'
import UsersQL from '../../../../_shared/graphql/UsersQL';
import EnterpriseQL from '../../../../_shared/graphql/EnterpriseQL';
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import EnvManager from '../../../../_shared/services/EnvManager'
import { AppConfig } from '../../../../_shared/constants/AppConfig'
import Reactotron from 'reactotron-react-native'
import AuthUtils from '../../../helpers/AuthUtils';


export default class AddInterpreterContainerView extends Component {

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

    _renderItem = ({item, separators}) => (
        <AddInterpreterRowView
            searchRow={true}
            userName={item.name}
            overAllStatus={'available'}
            callUser={() => alert("calling interpeter")}
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
                    keyExtractor={item => item.displayName}
                />
            </View>
        )
    }


    render(){
        return(
            <ApolloProvider client={this.client}>
                <View style={styles.mainContainerStyle}>
                    <View style={styles.headerStyle}>
                        <TouchableOpacity onPress={this.props.hideModal} activeOpacity={50}>
                            <Text style={styles.headerTextBackStyle}>Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTextStyle}>Add Interpreter</Text>
                        <Text style={styles.headerTextEmptyStyle}>Empty</Text>
                    </View>
                
                    <Query query={EnterpriseQL.getLanguagesLookupList()}
                        pollInterval={5000}
                        fetchPolicy={'network-only'}>
                        {({ loading, error, data, networkStatus, client }) => {
                             /* This checks whether or not there have been any changes 
                                in the results of the query.
                            */
                            const { complete } = client.cache.diff({
                                query: EnterpriseQL.getLanguagesLookupList(),
                                returnPartialData: true,
                                optimistic: false
                            });

                            if(loading && !complete && networkStatus !== 6){
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

                                let languages = data.languages.filter(l => l.isActive)

                                if(languages.length > 0){

                                    return(
                                        <ScrollView style={{flex: 1}}>{this.renderResults(languages)}</ScrollView>
                                    )

                                }

                                return (
                                    <View style={styles.usersContainerStyle}>{this.renderErrorState('No Staff Available')}</View>
                                )

                            }

                            return (
                                <View style={styles.usersContainerStyle}>{this.renderErrorState('No Staff Available')}</View>
                            )
                            
                        }}
                    </Query>
                    
                </View>
            </ApolloProvider>
        )

    }

}