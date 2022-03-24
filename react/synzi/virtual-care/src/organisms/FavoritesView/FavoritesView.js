import React, { Component } from 'react'
import {
    View,
    Image,
    Text,
    FlatList,
    ActivityIndicator,
    Alert,
    NetInfo
} from 'react-native';
import styles from './styles';
import { LogSeparator} from '../../../../_shared/constants/AppConfig'
import FavoriteAvatarView from '../../atoms/FavoriteAvatarView/FavoriteAvatarView'
import UsersQl from '../../../../_shared/graphql/UsersQL'
import { Query } from 'react-apollo'
import deviceLog from 'react-native-device-log'
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'


export default class FavoritesView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isConnected: true
        }
        this.showCallUserAlert = this.showCallUserAlert.bind(this)
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
        const { makeCall } = this.props
        makeCall(item)
    }


    showCallUserAlert(item){
        const { messagesEnabled, currentUserProfileImage, userName, userId, navTo } = this.props

        let online = ((item.overallStatus === 'offline') || (item.overallStatus === 'unavailable') || (item.overallStatus === 'busy')) ? false : true

        if(online && messagesEnabled) {
            Alert.alert(
                `Call/Message`,
                `Would you like to call or message \n${item.displayName}?`,
                [
                    { text: 'Call', onPress: () => this.callUser(item) },
                    { text: 'Message', onPress: () => {
                        navTo('VCSecureMessageDetail', { 
                            userId: userId,
                            recipientId: item.id,
                            profileImage: currentUserProfileImage,
                            userName: userName
                        })
                    } },
                    { text: 'Cancel', onPress: () => null, style: 'destructive' },
                ],
                { cancelable: false }
            )
        }
        else if (online && !messagesEnabled) {
            this.callUser(item)
        }
        else if (!online && messagesEnabled) {
            navTo('VCSecureMessageDetail', { 
                userId: userId,
                recipientId: item.id,
                profileImage: currentUserProfileImage,
                userName: userName
            })
        }
    }

    _renderItem = ({item, separators}) => (
        <FavoriteAvatarView 
            displayName={item.displayName}
            profileImage={item.profileImage}
            overallStatus={item.overallStatus}
            isActive={item.isActive}
            onUserClick={() => this.showCallUserAlert(item)}
        />
    )

    renderErrorView(){
        return(
            <Text style={styles.errorTextStyle}>Error Loading Favorites</Text>
        )
    }


    renderLoadingView(){
        return(
            <ActivityIndicator size={'large'} />
        )
    }
    
    render() {

        const { userId } = this.props

        const { isConnected } = this.state


        return(
            <View style={styles.favoritesContainerStyle}>
                <View style={styles.favoritesGrayBarStyle}/>
                {allowSidebar &&
                    <View>
                        <Text style={styles.favoritesTextStyle}>Favorites</Text>
                    </View>
                }
                <View style={styles.favoritesListContainerStyle}>
                    <Query
                        fetchPolicy={'cache-and-network'}
                        pollInterval={isConnected ? 5000 : 0}
                        query={UsersQl.getUserFavorites(userId)}
                    >
                        {({ loading, error, data, networkStatus, client }) => {

                            /* This checks whether or not there have been any changes 
                                in the results of the query.
                            */
                            const { complete } = client.cache.diff({
                                query: UsersQl.getUserFavorites(userId),
                                returnPartialData: true,
                                optimistic: false
                            });

                            // If loading, and not polling, and new results, show loading indicator
                            if (loading && !complete && networkStatus !== 6){
                                return(
                                    <ActivityIndicator size={'large'} />
                                )   
                            }

                            if (error) {
                                return(
                                    <Text style={styles.errorTextStyle}>Error Loading Favorites</Text>
                                )
                            }
                    
                            let favs = []
                            if(data) {
                                favs = data.user.favorites
                            }

                            return (
                                <FlatList
                                    style={styles.flatListStyle}
                                    horizontal={true}
                                    data={favs}
                                    renderItem={this._renderItem}
                                    keyExtractor={item => item.displayName}
                                    ListFooterComponent={<View style={{width:30}}></View>}
                                />
                            )
                        }}
                    </Query>
                </View>
            </View>
        ) 
    }
}