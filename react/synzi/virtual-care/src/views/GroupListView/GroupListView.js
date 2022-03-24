import React, { Component } from 'react'
import { 
    Text, 
    View, 
    TouchableOpacity,
    ActivityIndicator,
    NetInfo
} from 'react-native';
import GridView from 'react-native-super-grid';
import GroupsQL from '../../../../_shared/graphql/GroupsQL'
import { LogSeparator } from '../../../../_shared/constants/AppConfig'
import { Query } from 'react-apollo'
import deviceLog from 'react-native-device-log'
import Reactotron from 'reactotron-react-native'

//Styles
import styles from './styles'

//Wide/Narrow Layout & Orientation Change Detection
import OrientationResponsiveComponent from '../../../../_shared/src/OrientationResponsiveComponent'


export default class GroupListView extends OrientationResponsiveComponent {

    constructor(props) {
        super(props);
        this.state = {
            isConnected: true
        }
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    handleConnectivityChange = isConnected => {
        this.setState({ isConnected })
    };


    renderNoGroupsState(){
        return(
            <Text style={styles.errorTextStyle}>No Groups Found</Text>
        )
    }

    renderErrorState(){
        return(
            <Text style={styles.errorTextStyle}>Error Loading Groups</Text>
        )
    }

    renderLoadingState(){
        return(
            <ActivityIndicator size={'large'} />
        )
    }

    render(){

        const { enterpriseId, userName, userId } = this.props;

        if(userId === 0){
            return (
                <View style={styles.errorContainerStyle}>{this.renderErrorState()}</View>
            )
        }

        const { isConnected } = this.state

        return(
            <Query
                fetchPolicy={'cache-and-network'}
                pollInterval={isConnected ? 5000 : 0}
                query={GroupsQL.getGroups(userId)}
            >
                {({ loading, error, data, networkStatus, client }) => {

                    /* This checks whether or not there have been any changes 
                        in the results of the query.
                    */
                    const { complete } = client.cache.diff({
                        query: GroupsQL.getGroups(userId),
                        returnPartialData: true,
                        optimistic: false
                    });      

                    // If loading, and not polling, and new results, show loading indicator
                    if (loading && !complete && networkStatus !== 6){
                        return (
                            <View style={styles.spinnerStyle}>{this.renderLoadingState()}</View>
                        )
                    }

                    if (error) {
                        
                        Reactotron.error('Get Groups Error : ', error.message)
                        deviceLog.log(`Get Groups Error : ${error.message}`)
                        
                        return (
                            <View style={styles.errorContainerStyle}>{this.renderErrorState()}</View>
                        )
                    }

                    let userObject = data['user']
                    if(userObject){

                        let groups = userObject['canCallGroups']

                        if(groups.length){
                            return (
                                <GridView
                                    spacing={this.isWide() ? 20 : 10}
                                    itemDimension={this.isWide() ? 130 : 320}
                                    items={groups}
                                    style={styles.gridView}
                                    renderItem={item => (
                                        <TouchableOpacity onPress={() => this.props.groupSelected(item.id, item.name, userName)}>
                                            <View style={this.isWide() ? styles.itemContainerWide : styles.itemContainerNarrow}>
                                                <Text style={styles.itemName}>{item.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                            )

                        }else{

                            
                            Reactotron.error(`No groups found for enterprise id: ${enterpriseId}`)
                            deviceLog.log(`No groups found for enterprise id: ${enterpriseId}`)

                            return(
                                <View style={styles.errorContainerStyle}>{this.renderNoGroupsState()}</View>
                            )
                        }
                        
                    }
                    return (
                        <View style={styles.errorContainerStyle}>{this.renderErrorState()}</View>
                    )
                }}
            </Query>
        )

    }

}