import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    FlatList,
    ActivityIndicator,
    Platform,
    Alert
} from 'react-native';
import styles from './styles'
import UserRowView from '../../organisms/UserRowView/UserRowView'
import { AppColor} from '../../../../_shared/Color';
import { Query } from 'react-apollo'
import deviceLog from 'react-native-device-log'
import UsersQL from '../../../../_shared/graphql/UsersQL';

import { withNavigation } from 'react-navigation';

class SearchUsersView extends Component {

    constructor(props) {
        super(props)

        this.searchData = []
        this.showCallUserAlert = this.showCallUserAlert.bind(this)
    }


    callUser(item){

        const { makeCall, userName } = this.props
        makeCall(item)
    }

    callFirstAvailable(item){
        deviceLog.log(`Calling First Available`)
    }

    showCallUserAlert(item){
        Alert.alert(
            'Call',
            `Are you sure you want to call\n${item.displayName}?`,
            [
                { text: 'Cancel', onPress: () => null },
                { text: 'Yes', onPress: () => this.callUser(item) }
            ],
            { cancelable: false }
        )
    }

    _renderItem = ({item, separators}) => (
        <UserRowView
            cameFrom={'SearchUsersView'}
            currentUserProfileImage={this.props.currentUserProfileImage}
            messagesEnabled={this.props.messagesEnabled}
            currentUserId={this.returnCurrentUserId()}
            userId={item.id}
            isFavorite={item.favorite}
            profileImage={item.profileImage}
            searchRow={true}
            userName={item.displayName}
            overAllStatus={item.overallStatus}
            callUser={() => this.showCallUserAlert(item)}
            navTo={this.props.navigation.navigate}
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

    returnCurrentUserId(){
        const { userId } = this.props
        return userId
    }



    renderResults(data){

        return (
            <View>
                <View style={styles.searchBarResultsViewStyle}>
                    <Text style={styles.searchResultsTextStyle}>{`${data.length} Search Results`}</Text>
                </View>
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

        const { userId, searchTerm } = this.props

        if(searchTerm !== ''){

            let text = searchTerm.toLowerCase()
            
            let filteredData = this.searchData.filter((item) => {
                return item.displayName.toLowerCase().match(text)
            })

            return(
                <View>{this.renderResults(filteredData)}</View>
            )
        }

        return(
            <View style={styles.mainContainerStyle}>
            
                <Query
                    pollInterval={5000}
                    fetchPolicy={'network-only'}
                    query={UsersQL.getUsersToCall(userId)}>
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

                            let user = data['user']

                            if(user){
        
                                let users = user['canCallUsers']
                                this.searchData = users

                                return(
                                    <View>{this.renderResults(this.searchData)}</View>
                                )

                            }

                            return (
                                <View style={styles.usersContainerStyle}>{this.renderErrorState('No Users Found')}</View>
                            )

                        }

                        return (
                            <View style={styles.usersContainerStyle}>{this.renderErrorState('No Users Found')}</View>
                        )
                        
                    }}
                </Query>
                
            </View>
        )

    }

}

export default withNavigation(SearchUsersView)