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
    NetInfo
} from 'react-native';
import styles from './styles'
import { LogSeparator} from '../../../../_shared/constants/AppConfig'
import TopBarView from '../../organisms/TopBarView/TopBarView'
import UserRowView from '../../organisms/UserRowView/UserRowView'
import BreadcrumbView from '../../organisms/BreadcrumbView/BreadcrumbView'
import { AppColor} from '../../../../_shared/Color';
import { Query } from 'react-apollo'
import deviceLog from 'react-native-device-log'
import GroupsQL from '../../../../_shared/graphql/GroupsQL';
import Reactotron from 'reactotron-react-native'

export default class GroupUsersView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isConnected: true
        }
        this.profileImage = null
        this.showCallUserAlert = this.showCallUserAlert.bind(this)
        this.showCallFirstAvailableAlert = this.showCallFirstAvailableAlert.bind(this)
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

    callUser(item){
        const userName = this.props.navigation.getParam('userName', '');
        this.props.screenProps.makeCall(item)
    }

    callFirstAvailable(item){
        const groupId = this.props.navigation.getParam('groupId', 0);
        const groupData = {
            id: groupId,
            displayName:item.displayName
        }

        this.props.screenProps.makeGroupCall(groupData)
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

    showCallFirstAvailableAlert(item){
        Alert.alert(
            'Call',
            'Are you sure you want to call first available?',
            [
                { text: 'Cancel', onPress: () => null },
                { text: 'Yes', onPress: () => this.callFirstAvailable(item) }
            ],
            { cancelable: false }
        )
    }


    _renderItem = ({item, separators}) => (
        <UserRowView 
            currentUserProfileImage={this.profileImage}
            messagesEnabled={this.props.navigation.getParam('messagesEnabled', false)}
            loggedInDisplayName={this.props.navigation.getParam('loggedInDisplayName', '')}
            currentUserId={this.returnCurrentUserId()}
            userId={item.id}
            isFavorite={item.favorite}
            profileImage={item.profileImage}
            userName={item.displayName}
            overAllStatus={item.overallStatus}
            activeOpacity={90}
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
        return this.props.navigation.getParam('userId', 0);
    }


    render(){

        const userName = this.props.navigation.getParam('userName', '');
        const groupName = this.props.navigation.getParam('groupName', '');
        const userId = this.props.navigation.getParam('userId', 0);
        const groupId = this.props.navigation.getParam('groupId', 0);
        const profileImage = this.props.navigation.getParam('profileImage', '0');
        const enterpriseImage = this.props.navigation.getParam('enterpriseImage', '0');

        this.profileImage = profileImage

        const { isConnected } = this.state
 
        return(
            <View style={styles.mainContainerStyle}>
                <TopBarView
                    userId={userId}
                    profileImage={profileImage}
                    userName={userName}
                    hideButtons={true}
                    socketState={this.props.screenProps.socketState}
                    closeSocket={this.props.screenProps.closeSocket}
                />
                <BreadcrumbView
                    logoImage={enterpriseImage}
                    breadCrumbText={groupName}
                    goBack={() => this.props.navigation.goBack()}
                />
                <View style={styles.callFirstButtonContainerStyle}>
                    <TouchableOpacity 
                        onPress={this.showCallFirstAvailableAlert} 
                        style={styles.callFirstButtonStyle}
                        disabled={this.props.disabled}>
                        <Image
                            style = {styles.phoneIconStyle}
                            resizeMode={'contain'}
                            source={require('../../../../_shared/images/icons/phoneIcon.png')}
                        />
                        <Text style={styles.textStyle}>
                            Call First Available
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.sepViewStyle}/>

                
                <Query
                    fetchPolicy={'cache-and-network'}
                    pollInterval={isConnected ? 5000 : 0}
                    query={GroupsQL.getGroupByFavorites(groupId, userId)}>
                    {({ loading, error, data, networkStatus, client }) => {

                        Reactotron.log(`Loading Groups, id: ${groupId}`)

                        /* This checks whether or not there have been any changes 
                            in the results of the query.
                        */
                       const { complete } = client.cache.diff({
                            query: GroupsQL.getGroupByFavorites(groupId, userId),
                            returnPartialData: true,
                            optimistic: false
                        }); 

                        // If loading, and not polling, and new results, show loading indicator
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
                            
                            let group = data['group']

                            if(group){

                                let groupUsers = group.users

                                if(groupUsers.length > 0){
                                    return (
                                        <FlatList
                                            data={groupUsers}
                                            renderItem={this._renderItem}
                                            ItemSeparatorComponent={this.renderSeparator}
                                            keyExtractor={item => item.displayName}
                                        />
                                    )
                                }
                            }

                            return (
                                <View style={styles.usersContainerStyle}>{this.renderErrorState('No Users Found')}</View>
                            )

                        }

                        return (
                            <View style={styles.usersContainerStyle}>{this.renderErrorState('Error Loading Users')}</View>
                        )
                        
                    }}
                </Query>
                
            </View>
        )

    }

}
