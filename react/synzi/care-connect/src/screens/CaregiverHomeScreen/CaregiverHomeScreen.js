import React, { Component } from 'react'
import { View, Text, Platform, TouchableOpacity, Alert, ScrollView, StatusBar, ActivityIndicator, AsyncStorage } from 'react-native'
import AssociatedPatientsBar from '../../organisms/AssociatedPatientsBar/AssociatedPatientsBar'
import GroupsView from '../../views/GroupsView/GroupsView'
import CareTeamView from '../../views/CareTeamView/CareTeamView'
import EnterpriseLogo from '../../atoms/EnterpriseLogo/EnterpriseLogo'
import AppVersionLabel from '../../../../_shared/src/atoms/AppVersionLabel/AppVersionLabel'
import MenuButton from '../../organisms/MenuButton/MenuButton'
import LogoutButton from '../../organisms/LogoutButton/LogoutButton'

import { withNavigation, DrawerActions } from 'react-navigation'

// Helpers
import EnvManager from '../../../../_shared/services/EnvManager'
import deviceLog from 'react-native-device-log'
import { AppConfig, LogSeparator} from '../../../../_shared/constants/AppConfig'
import AuthUtils from '../../../../_shared/helpers/AuthUtils'

// GraphQL
import UsersQL from '../../../../_shared/graphql/UsersQL'
import { Query } from 'react-apollo'
import SaveCurrentUser from '../../graphql/SaveCurrentUser'

import Reactotron from 'reactotron-react-native'

// Check if user needs to download new version
import DeviceInfo from 'react-native-device-info';
import AppLink from 'react-native-app-link';

import {SynziColor} from '../../../../_shared/Color'
import SynziTapableLogoView from '../../../../_shared/src/atoms/SynziTapableLogoView/SynziTapableLogoView'

//Styles
import styles from './styles';

export default class CaregiverHomeScreen extends Component {
  // Adds a header to this screen
  static navigationOptions = ({navigation}) => ({
    headerStyle: {
        backgroundColor: SynziColor.SYNZI_WHITE,
        marginTop: 10
    },
    gesturesEnabled: false,
    // Hides the back button on this screen
    headerLeft: navigation.getParam('showDrawer') 
      ? 
      (
        <MenuButton 
          menuPress={() => navigation.toggleDrawer()}
        />
      ) 
      : 
    null,
    headerRight: (
      <LogoutButton 
        displayName={navigation.getParam('displayName')}
        logout={navigation.getParam('logout')}
      />
    ),
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
      userId: 0,
      username: '',
      displayName: '',
      mounted: false,
      showMessages: false,
      selectedPatientUserId: '', 
      accessToken: ''
    }

    this.logout = this.logout.bind(this)
    this.handleFiveTap = this.handleFiveTap.bind(this)
    this.handleEnvPicker = this.handleEnvPicker.bind(this)
  }

  async componentDidMount() {

    const userId = await AuthUtils.getUserId()
    const username = await AuthUtils.getUsername()
    const accessToken = await AuthUtils.getToken()
    const displayName = await AuthUtils.getDisplayNameFromInviteToken()
    const messagePermissions = await AuthUtils.getPermissions("secure_messaging")
    this.setState({ userId, username, displayName, mounted: true, showMessages: messagePermissions, accessToken })  
    
    // Sets the logout function for use in react navigation on this page
    this.props.navigation.setParams({ displayName, logout: this.logout, handleEnvPicker: this.handleEnvPicker, showDrawer: messagePermissions })
    this.props.screenProps.connectToSocket(accessToken)
    
    // Retreives last tab from AsyncStorage. If "messages", navigate to secure message screen
    const tab = await AsyncStorage.getItem(AppConfig.LAST_CCTAB)
    if(tab === 'messages') {
      this.props.navigation.navigate('Secure Messages')
    } 
  }

  handleFiveTap(){
    this.props.navigation.navigate('LogsModal')
  }

  handleEnvPicker(){
    this.props.navigation.navigate('EnvModal')
  } 

  renderHomescreenError = () => {
    return(
        <View style={styles.mainContainerStyle}>
           <Text>Error Loading User</Text>
        </View>
    )
  }

  setPatientUserId = patientUserId => {
    this.setState({ selectedPatientUserId: patientUserId })
  }

  logout() {
    Reactotron.log(" ********** DO LOGOUT ********** ")
    Reactotron.log("props:", this.props)
    deviceLog.log(`User ${this.props.userName} requested logout, closing socket, etc.`)

    // close socket with flag to finish logout when socket has finished disconnecting
    this.props.screenProps.closeSocket(true)  // change name to clearer
  }

  checkIfNewerVersion = (ccMinVersion) => {
      const currentVersion = DeviceInfo.getReadableVersion().split(".")
      const platform = Platform.OS

      const newestVersion = ccMinVersion.split(".")
          
      let updateFlag = false
      for(var i = 0; i < 3; ++i) {
        if(Number(newestVersion[i]) > Number(currentVersion[i])) {
            updateFlag = true
            break
        } else if(Number(newestVersion[i]) === Number(currentVersion[i])) {
            continue
        } else {
            updateFlag = false
            break
        }
      }

      if(updateFlag) {
        Alert.alert(
            'Please Update This App',
            "Please upgrade this app to ensure full functionality.",
            [
                { text: 'Update', onPress: () => {
                    if(platform === 'ios') {
                        AppLink.maybeOpenURL('https://itunes.apple.com/us/app/synzi-care-connect/id1438109873', { appName: 'Care Connect', appStoreId: '1438109873' }).done()
                    } else {
                        AppLink.maybeOpenURL('https://play.google.com/store/apps/details?id=com.synzi.careconnect', { appName: 'Care Connect', playStoreId: 'com.synzi.careconnect' }).done()
                    }
                }},
            ],
            { cancelable: false }
        )
      } 
  }

  render() {
    const { makeCall, makeGroupCall }  = this.props.screenProps
    const { userId, mounted, showMessages, selectedPatientUserId, accessToken } = this.state

    StatusBar.setBarStyle('dark-content', true)
    StatusBar.setBackgroundColor('white')

    Reactotron.log(`Caregiver HomeScreen render with userid = ${userId}, :: mounted? , ${mounted}, accessToken: ${accessToken}`)
    if (!mounted) return null

    return (
        <Query 
            query={UsersQL.getByIdShort(userId)}
            fetchPolicy={'cache-and-network'}
            pollInterval={10000}
        >
            {({ error, data, loading, networkStatus, client }) => {
                /* This checks whether or not there have been any changes 
                  in the results of the query.
                */

                const { complete } = client.cache.diff({
                  query: UsersQL.getByIdShort(userId),
                  returnPartialData: true,
                  optimistic: false
                });
                          
                if (loading && !complete && networkStatus !== 6) {
                    //Reactotron.error(`Error Loading Caregiver Home, error= ${error}, loading = ${loading}, networkStat= ${networkStatus}, Access Token= ${accessToken}`)

                    return (
                      <View style={styles.loadingContainerStyle}>
                        <ActivityIndicator />
                      </View>
                    )
                }

                if(error) { // try moving above loading
                  return (
                    <View style={styles.outerContainer}>{this.renderHomescreenError()}</View>
                  )
                }

                if(data && data.user){
                    this.props.screenProps.saveCurrentUser(data.user)
                    this.checkIfNewerVersion(data.currentEnv.ccMinVersion)
                    
                    return (
                      <View style={styles.outerContainer}>
                        <EnterpriseLogo imgUrl={''} />  
                        <View style={styles.mainContainerStyle}>
                          <AssociatedPatientsBar userId={userId} selectedPatientUserId={selectedPatientUserId} setPatientUserId={this.setPatientUserId} />
                          <ScrollView>
                            <CareTeamView selectedPatientUserId={selectedPatientUserId} caregiver={true} makeCall={makeCall} showMessages={showMessages} />
                            <View style={styles.sepStyle} />
                          </ScrollView>
                          <View style={styles.appVersionStyle}>
                            <AppVersionLabel
                              fivePressTap={this.handleFiveTap}
                            />
                          </View>
                        </View>
                      </View>
                    );
                }

                return null
            }}
        </Query>
    )
  }
}