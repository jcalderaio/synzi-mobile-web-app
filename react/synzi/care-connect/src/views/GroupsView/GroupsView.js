import React, { Component } from 'react'
import { View, Text, Platform, ActivityIndicator, FlatList, Alert } from 'react-native'
import PropTypes from 'prop-types'
import UserRowView from '../../organisms/UserRowView/UserRowView'
import { Query } from 'react-apollo'
import GroupsQL from '../../graphql/GroupsQL'
import { AppColor} from '../../../../_shared/Color';
import deviceLog from 'react-native-device-log'
import { LogSeparator } from '../../../../_shared/constants/AppConfig'

import styles from './styles'

export default class GroupsView extends Component {
    callUser(item){
        const groupData = {
            id: item.id,
            displayName:item.name
        }
    
        this.props.makeGroupCall(groupData)
    }

  showCallUserAlert(item){
    Alert.alert(
        'Call',
        `Are you sure you want to call\n${item.name}?`,
        [
            { text: 'Cancel', onPress: () => null },
            { text: 'Yes', onPress: () => this.callUser(item) }
        ],
        { cancelable: false }
    )
  }

  _renderItem = ({item, separators}) => (
    <UserRowView 
        overAllStatus={null}
        username={item.name}
        isActive={item.isActive}
        activeOpacity={90}
        callUser={() => this.showCallUserAlert(item)}
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

  render() {
    const { userId } = this.props

    return (
        <View style={styles.mainContainerStyle}>
                
            <Query
                fetchPolicy={'cache-and-network'}
                query={GroupsQL.getGroups(userId)} 
                pollInterval={5000}
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
                      
                    if (loading && !complete && networkStatus !== 6) {
                        return (
                            <View>
                                <View style={styles.loadingContainerStyle}>
                                    <ActivityIndicator />
                                </View>
                                <View style={styles.sepViewStyle}/> 
                            </View>
                        )
                    }

                    if(error) {
                        this.renderErrorState(error)
                    }

                    let groups = []
                    if (data && data.user) {
                        groups = data.user.canCallGroups

                        if(groups.length > 0) {
                            return (
                                <View>
                                    <View style={styles.callFirstButtonContainerStyle}>
                                        <Text style={styles.textStyle}>First Available Staff</Text>
                                    </View>
                                    <View style={styles.sepViewStyle}/> 
                                    <FlatList
                                        data={groups}
                                        renderItem={this._renderItem}
                                        ItemSeparatorComponent={this.renderSeparator}
                                        keyExtractor={item => item.id}
                                    />
                                    <View style={styles.sepViewStyle}/>
                                </View>
                            )
                        } 
                        
                        return (
                            <View>
                                <View style={styles.callFirstButtonContainerStyle}>
                                    <Text style={styles.textStyle}>First Available</Text>
                                </View>
                                <View style={styles.sepViewStyle}/> 
                                <View style={styles.emptyContainerStyle}>
                                    <Text style={styles.emptyStyle}>No groups assigned</Text>
                                </View>
                                <View style={styles.sepViewStyle}/>
                            </View>
                        )
                    }

                    return null
                }}
            </Query>
                
        </View>
    )
  }
}