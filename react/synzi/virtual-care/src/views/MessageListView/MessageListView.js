import React, { Component, Fragment } from 'react'
import { View, Text, Platform, ActivityIndicator, FlatList, ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import MessageRowView from '../../../../_shared/src/molecules/MessageRowView/MessageRowView'
import { Query } from 'react-apollo'
import MessagesQL from '../../../../_shared/graphql/MessagesQL'
import AuthUtils from '../../../../_shared/helpers/AuthUtils'
import { AppColor} from '../../../../_shared/Color';
import deviceLog from 'react-native-device-log'
import { LogSeparator, isVirtualCare } from '../../../../_shared/constants/AppConfig'
import NoMessages from './NoMessages'

import { withNavigation } from 'react-navigation';

import Reactotron from 'reactotron-react-native'

import styles from './styles'

class MessageListView extends Component {
  static propTypes = {
    /** A string to filter the list of patients by */
    filter: PropTypes.string,
  }
  static defaultProps = {
    filter: '',
  }

  handleThreadClick(id) {
    this.props.threadSelected(id)
  }

  _renderItem = ({item, separators}) => (
    <MessageRowView 
        userName={item.them.displayName}
        profileImage={item.them.profileImage ? item.them.profileImage : ''}
        message={item.messages[0].text}
        timestamp={item.messages[0].timestamp}
        unread={item.unreadMessages > 0}
        unreadCount={item.unreadMessages}
        selected={false}
        onClick={() => {
          this.handleThreadClick(item.them.id)
        }}
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
    const THREADS_QUERY = MessagesQL.getThreads()
    const THREADS_CHANGED_QUERY = MessagesQL.messageThreadsChanged()

    return (
        <View style={styles.mainContainerStyle}>
            <Query
              query={THREADS_QUERY}
            >
                {({ loading, error, data, refetch: refetchList }) => {
                    if (loading) {
                        return (
                            <View>
                                <View style={styles.loadingContainerStyle}>
                                    <ActivityIndicator size={'large'} />
                                </View>
                            </View>
                        )
                    }

                    if(error) {
                      return (
                        <View>
                            <View style={styles.loadingContainerStyle}>
                                {this.renderErrorState(error.message)}
                            </View>
                        </View>
                      )
                    }

                    let threads = []

                    threads = [...data.secureMessageThreads]

                    // go through all the messages and copy whomever the other user is to a 'them' field.
                    // We could be either the sender or the recipient of a message
                    // This just makes it easier for us later when building the list
                    threads.forEach(thread => {
                      if (thread.messages[0].sender.id === userId) {
                        thread.them = thread.messages[0].recipient
                      } else {
                        thread.them = thread.messages[0].sender
                      }
                    })
                    
                    return (
                      <Query
                        query={THREADS_CHANGED_QUERY}
                        pollInterval={5000}
                        fetchPolicy={'cache-and-network'}
                      >
                        {({
                          loading: unreadCountLoading,
                          error: threadsChangedError,
                          data: unreadCountData,
                          networkStatus: newMessageStatus,
                        }) => {
                          // This query polls the BE to see if any new messages are available for this recipient.
                          // If so, it will refetch the main query to get new messages
                          if(threadsChangedError) {
                            return (
                              <View>
                                  <View style={styles.loadingContainerStyle}>
                                      {this.renderErrorState(threadsChangedError.message)}
                                  </View>
                              </View>
                            )
                          }

                          if (!unreadCountLoading && unreadCountData.messageThreadsChanged) {
                            refetchList()
                          }
          
                          if (data.secureMessageThreads.length === 0) {
                            return <NoMessages />
                          } else {
                            return (
                              <ScrollView>
                                  <View style={styles.sepViewStyle}/> 
                                    <FlatList
                                        data={threads}
                                        renderItem={this._renderItem}
                                        ItemSeparatorComponent={this.renderSeparator}
                                        keyExtractor={item => item.id}
                                    />
                                  <View style={styles.sepViewStyle}/>
                              </ScrollView>
                            )
                          }
                        }}
                      </Query>
                    )

                }}
            </Query>
        </View>
    )
  }
}

export default withNavigation(MessageListView)

