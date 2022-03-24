import React, { Component } from 'react'
import { View, Text, Platform, ActivityIndicator, FlatList, Alert, NetInfo } from 'react-native'
import PropTypes from 'prop-types'
import UserRowView from '../../organisms/UserRowView/UserRowView'
import { Query } from 'react-apollo'
import CareTeamQL from '../../graphql/CareTeamQL'
import { AppColor} from '../../../../_shared/Color';
import deviceLog from 'react-native-device-log'
import { LogSeparator } from '../../../../_shared/constants/AppConfig'

import styles from './styles'

export default class CareTeamView extends Component {
  static propTypes = {
    /** userId to fetch careteam with */
    selectedPatientUserId: PropTypes.string.isRequired,
    /* used to fetch careteam on caregiver CC app */
    caregiver: PropTypes.bool,
    /* has messaging permissions or not */
    showMessages: PropTypes.bool.isRequired,
    /* used to make call in CC patient stack */
    makeCall: PropTypes.func
  }

  static defaultProps = {
    caregiver: false,
    makeCall: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      isConnected: true
    }
  }

  callUser(item){
    this.props.makeCall(item)
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
        profileImage={item.profileImage}
        overAllStatus={item.overallStatus}
        username={item.displayName}
        isActive={item.isActive}
        activeOpacity={90}
        recipientId={item.id}
        showMessages={this.props.showMessages}
        caregiver={this.props.caregiver}
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

    const { selectedPatientUserId, caregiver } = this.props
    const { isConnected } = this.state

    if(caregiver) {
      if(!selectedPatientUserId) {
        return (
          <View style={styles.noneSelectedContainerStyle}>
            <Text style={styles.textStyle}>No Patients or Care Teams to Show</Text>
          </View>
        )
      }
      
      return (
        <View style={styles.mainContainerStyle}>
            <Query
                fetchPolicy={'cache-and-network'}
                query={CareTeamQL.getUsers(selectedPatientUserId)} 
                skip={!selectedPatientUserId}
                pollInterval={isConnected ? 5000 : 0}>
                {({ loading, error, data, networkStatus, client }) => {
                    /* This checks whether or not there have been any changes 
                        in the results of the query.
                     */
                    const { complete } = client.cache.diff({
                      query: CareTeamQL.getUsers(selectedPatientUserId),
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

                    let users = []

                    if (data && data.user) {
                        users = data.user.canDirectCallUsers.filter(u => u.isActive)

                        if(users.length > 0) {
                          return (
                              <View>
                                  <View style={styles.sepViewStyle}/> 
                                  <FlatList
                                      data={users}
                                      renderItem={this._renderItem}
                                      ItemSeparatorComponent={this.renderSeparator}
                                      keyExtractor={item => item.id}
                                  />
                                  <View style={styles.sepViewStyle}/>
                              </View>
                          )
                      } 
                      
                      return (
                          <View style={styles.noneSelectedContainerStyle}>
                            <Text style={styles.textStyle}>No Care Team members assigned</Text>
                          </View>
                      )
                    }

                    return null
                }}
            </Query>
        </View>
      )
    }

    return (
        <View style={styles.mainContainerStyle}>
            <Query
                fetchPolicy={'cache-and-network'}
                query={CareTeamQL.getUsers(selectedPatientUserId)} 
                pollInterval={isConnected ? 5000 : 0}>
                {({ loading, error, data, networkStatus, client }) => {
                    /* This checks whether or not there have been any changes 
                        in the results of the query.
                     */
                    const { complete } = client.cache.diff({
                      query: CareTeamQL.getUsers(selectedPatientUserId),
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

                    let users = []

                    if (data && data.user) {
                        users = data.user.canDirectCallUsers.filter(u => u.isActive)

                        if(users.length > 0) {
                          return (
                              <View>
                                  <View style={styles.callFirstButtonContainerStyle}>
                                      <Text style={styles.textStyle}>Your Care Team</Text>
                                  </View>
                                  <View style={styles.sepViewStyle}/> 
                                  <FlatList
                                      data={users}
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
                                <Text style={styles.textStyle}>Your Care Team</Text>
                            </View>
                            <View style={styles.sepViewStyle}/> 
                            <View style={styles.emptyContainerStyle}>
                                <Text style={styles.emptyStyle}>No Care Team members assigned</Text>
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