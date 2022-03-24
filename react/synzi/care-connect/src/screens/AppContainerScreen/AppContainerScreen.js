import React, { Component } from 'react'
import { View, Text, ScrollView, StatusBar, ActivityIndicator, KeyboardAvoidingView, Button } from 'react-native'
import deviceLog from 'react-native-device-log'
import AppVersionLabel from '../../../../_shared/src/atoms/AppVersionLabel/AppVersionLabel'
import { AppConfig, LogSeparator } from '../../../../_shared/constants/AppConfig'
import EnterpriseLogo from '../../atoms/EnterpriseLogo/EnterpriseLogo'
import { defaultTo, isEmpty } from 'lodash'

// GraphQL
import AuthUtils from '../../../../_shared/helpers/AuthUtils'
import UsersQL from '../../graphql/UsersQL'
import { Query } from 'react-apollo'
import {SynziColor} from '../../../../_shared/Color'
import SynziTapableLogoView from '../../../../_shared/src/atoms/SynziTapableLogoView/SynziTapableLogoView'
import Reactotron from 'reactotron-react-native'

import styles from './styles'; 

export default class AppContainerScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerStyle: {
        backgroundColor: SynziColor.SYNZI_WHITE,
        marginTop: 10
    },
    gesturesEnabled: false,
    // Hides the back button on this screen
    headerLeft: null,
    // Sets the color of the buttons in the header
    headerTintColor: SynziColor.SYNZI_BLUE,
    headerTitle: 
    <SynziTapableLogoView
        nav = {navigation}
    />
  })
  
  constructor(props) {
    super(props)

    this.state = {
      currentUser: null
    }
  }

  messagesEnabled = user => {
    if (isEmpty(user)) return false
  
    const perms = defaultTo(user.enterprise.permissionsByType, [])
    if (perms.length === 0) return false
  
    const hasPermission = perms.filter(perm =>
      perm.code.includes('secure_messaging')
    )
  
    if (hasPermission.length === 0) return false
  
    return hasPermission[0].isActive
  }

  render() {
    const { params } = this.props.navigation.state
    const userId = params ? params.userId : null
    const userType = params ? params.userType : ''

    const GET_USER_PERMISSIONS_QUERY = UsersQL.getPermissions()

    Reactotron.log("userID from AppContainer: ", userId)

    return(
      <Query 
        query={GET_USER_PERMISSIONS_QUERY} 
        variables={{ id: userId }}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return (
              <View style={styles.outerContainer}>
                <EnterpriseLogo />
                <View style={styles.mainContainerStyle}>
                  <View>
                    <View style={styles.loadingContainerStyle}>
                        <ActivityIndicator size={'large'} />
                    </View>
                  </View>
                  <View style={styles.appVersionStyle}>
                    <AppVersionLabel
                      fivePressTap={() => this.props.navigation.navigate('LogsModal')}
                    />
                  </View>
                </View>
              </View>
            )
          }

          if (error) return null

          if(data.user) {
            const user = data.user
          
            let areMessagesEnabled = this.messagesEnabled(user)
            AuthUtils.setPermissions('secure_messaging', areMessagesEnabled)
            setTimeout(() => {
              if(userType === AppConfig.USER_TYPE_CAREGIVER) {
                this.props.navigation.navigate('caregiverDrawerStack');
              } else if (userType === AppConfig.USER_TYPE_PATIENT) {
                this.props.navigation.navigate('patientDrawerStack');
              }
            }, 100)
          }

          return (
            <View style={styles.outerContainer}>
              <EnterpriseLogo />
              <View style={styles.mainContainerStyle}>
                <View>
                  <View style={styles.loadingContainerStyle}>
                      <ActivityIndicator size={'large'} />
                  </View>
                </View>
                <View style={styles.appVersionStyle}>
                  <AppVersionLabel
                    fivePressTap={() => this.props.navigation.navigate('LogsModal')}
                  />
                </View>
              </View>
            </View>
          )
          
        }}
      </Query>
    )
  }
}