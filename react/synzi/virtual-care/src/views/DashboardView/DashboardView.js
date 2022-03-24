import React, { Component, Fragment} from 'react'
import {
    View,
    StatusBar,
    Platform,
    AsyncStorage,
    Alert,
    Text,
    Keyboard
} from 'react-native';
import styles from './styles'
import { AppConfig, LogSeparator} from '../../../../_shared/constants/AppConfig'
import PatientListView from '../PatientListView/PatientListView'
import SearchBarView from '../../organisms/SearchBarView/SearchBarView'
import GroupListView from '../GroupListView/GroupListView'
import TopBarView from '../../organisms/TopBarView/TopBarView'
import AppVersionLabel from '../../../../_shared/src/atoms/AppVersionLabel/AppVersionLabel'
import UsersQl from '../../../../_shared/graphql/UsersQL'
import EnterpriseQL from '../../../../care-connect/src/graphql/EnterpriseQL'
import SearchUsersView from '../SearchUsersView/SearchUsersView'
import { Query } from 'react-apollo'
import deviceLog from 'react-native-device-log'
import { canCallPatients, canCallStaff, messagesEnabled, onDemandmessagesEnabled } from '../../../../_shared/helpers/UserPermissions'
import FavoritesView from '../../organisms/FavoritesView/FavoritesView';
import ErrorPage from '../../../../_shared/src/views/ErrorPage/ErrorPage'

// Messages
import MessageListView from '../MessageListView/MessageListView'

// Check if user needs to download new version
import DeviceInfo from 'react-native-device-info';
import AppLink from 'react-native-app-link';

import Reactotron from 'reactotron-react-native'

export default class DashboardView extends Component {

    constructor(props) {
        super(props)

        this.user = null
        this.enterpriseLogo = null

        this.state = {
            showTab: null,
            showUserSearch: false,
            searchTerm: ''
        }

        this.handleFiveTap = this.handleFiveTap.bind(this)
        this.navigateToGroupUsers = this.navigateToGroupUsers.bind(this)
        this.navigateToPhoneAddPatientDetail = this.navigateToPhoneAddPatientDetail.bind(this)
        this.navigateToMessageDetails = this.navigateToMessageDetails.bind(this)
        this.renderSecureMessages = this.renderSecureMessages.bind(this)
        this.toggleTabUI = this.toggleTabUI.bind(this)
        this.showSearch = this.showSearch.bind(this)
        this.hideSearch = this.hideSearch.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
    }

    async componentWillMount() {
        const showTab = await AsyncStorage.getItem(AppConfig.LAST_TAB)
        if(showTab !== null) {
            this.setState({ showTab })
        } else {
            this.setState({ showTab: 'staff' })
        }
        
    }

    handleFiveTap(){
        this.props.navigation.navigate('LogsModal')
    }


    renderDashboardError(){
        return(
            <View style={styles.mainContainerStyle}>
                <Text>Error Loading User</Text>
            </View>
        )
    }

    navigateToGroupUsers(groupID, groupName, userName){

        const userId = this.props.navigation.getParam('userId', '0');
        const loggedInDisplayName = this.user['displayName']

        const profileImage = this.returnProfileImage()

        
        Reactotron.log(`Getting groups for user: ${userId}`)
        deviceLog.log(`Getting groups for user: ${userId}`)
        
        this.props.navigation.navigate('GroupUsers', {
            messagesEnabled: messagesEnabled(this.user),
            loggedInDisplayName: loggedInDisplayName,
            groupId: Number(groupID),
            groupName: groupName,
            userName: userName,
            userId: userId,
            profileImage: profileImage,
            enterpriseImage: this.enterpriseLogo
        });
    }

    navigateToPhoneAddPatientDetail(patientObject){

        Reactotron.log("patient Object: ", patientObject)

        const profileImage = this.returnProfileImage()
        const loggedInDisplayName = this.user['displayName']

        let enterprise = this.user['enterprise']
        let enterpriseId = enterprise['id']

        this.props.navigation.navigate('AddPatientDetail', {
            onDemandmessagesEnabled: onDemandmessagesEnabled(this.user),
            messagesEnabled: messagesEnabled(this.user),
            loggedInDisplayName: loggedInDisplayName,
            patientId: patientObject['patientId'],
            profileImage: profileImage,
            userId: patientObject['currentUserId'],
            userName: patientObject['currentUserName'],
            enterpriseId: enterpriseId,
            languages: patientObject['languages'],
            defaultLanguage: patientObject['defaultLanguage'],
            socketState:this.props.screenProps.socketState,
            closeSocket:this.props.screenProps.closeSocket,
            makeCall:this.props.screenProps.makeCall
        });
    }

    toggleTabUI(tab){
        Keyboard.dismiss()
        this.setState({ showTab: tab, showUserSearch: false, searchTerm: '' })
        AsyncStorage.setItem(AppConfig.LAST_TAB, tab)
    }


    showSearch(){
        this.setState({ showUserSearch: true })
    }

    hideSearch(){
        Keyboard.dismiss()
        this.setState({ showUserSearch: false, searchTerm: ''})
    }


    onChangeText(text){
        this.setState({ searchTerm: text})
    }


    returnProfileImage(){
        var profileImage = ''
        if(this.user['profileImage'] !== ''){
            profileImage = this.user['profileImage']
        }
        return profileImage
    }


    renderDashboard(){

        let enterprise = this.user['enterprise']
        let enterpriseId = enterprise['id']

        
        if(this.enterpriseLogo !== null){

            return(
                <Fragment>{this.renderMainDashBoard()}</Fragment>
            )  

        }else{

            return(
                <Query
                fetchPolicy="network-only"
                query={EnterpriseQL.getInfo()}
                variables={{ id: enterpriseId }}>
                    {({ loading, error, data }) => {
                    if (loading) return null
                
                    if (error) return <ErrorPage error={error} closeSocket={this.props.screenProps.closeSocket} />

                    else if (data.enterpriseInfo.image) {
                        
                        Reactotron.log(`Get Enterprise Logo : ${data.enterpriseInfo.image}`)
                        deviceLog.log(`Get Enterprise Logo : ${data.enterpriseInfo.image}`)

                        this.enterpriseLogo = data.enterpriseInfo.image
                    }

                    const accessToken = this.props.navigation.getParam('accessToken', null);
                    this.props.screenProps.connectToSocket(accessToken)
    
                    return(
                        <Fragment>{this.renderMainDashBoard()}</Fragment>
                    )  
    
                }}
                </Query>
                
            )

        }

    }


    renderMainDashBoard(){

        const { showTab, searchTerm, showUserSearch } = this.state

        let userName= this.user['displayName']
        let userId = this.user['id']

        const profileImage = this.returnProfileImage()

        return(
            <View style={styles.mainContainerStyle}>
                <TopBarView
                    userId={userId}
                    closeSocket={this.props.screenProps.closeSocket}
                    userName={userName}
                    profileImage={profileImage}
                    socketState={this.props.screenProps.socketState}
                    showTab={showTab}
                    toggleTabUI={this.toggleTabUI}
                    canSecureMessage={messagesEnabled(this.user)}
                    canCallStaff={canCallStaff(this.user.permissions)}
                    canCallPatients={canCallPatients(this.user.permissions)}
                />  
                <SearchBarView
                    logoImage={this.enterpriseLogo}
                    onFocus={this.showSearch}
                    onSubmitEditing={this.hideSearch}
                    searchTerm={searchTerm}
                    onChangeText={this.onChangeText}
                    searching={showUserSearch}
                    closeSearch={this.hideSearch}
                />
                {showTab === 'patients' ? this.renderPatients() : (showTab === 'staff' ? this.renderStaff() : this.renderSecureMessages())}
                <View style={styles.versionLabelContainerStyle}>
                    <AppVersionLabel
                        fivePressTap={() => this.props.navigation.navigate('LogsModal')}
                    />  
                </View>
            </View>
        )
    }

    renderSecureMessages() {
        const { showUserSearch } = this.state
        let userId = this.user['id']

        return(
            <View style={styles.groupsContainerStyle}>
                <View style={styles.groupsContainerStyle}>
                    <MessageListView 
                        userId={userId}
                        threadSelected={this.navigateToMessageDetails}
                    />
                </View>
                {showUserSearch ? this.renderSearch() : null}
            </View>
        )
    }

    navigateToMessageDetails(recipientId) {
        let userId = this.user['id']
        const userName = this.user['displayName']
        const profileImage = this.returnProfileImage()

        this.props.navigation.navigate('VCSecureMessageDetail', { 
            userId: userId,
            recipientId: recipientId,
            profileImage: profileImage,
            userName: userName
        })
    }

    renderStaff(){

        const { showUserSearch } = this.state
        const profileImage = this.returnProfileImage()

        let enterprise = this.user['enterprise']
        let enterpriseId = enterprise['id']
        let userId = this.user['id']
        let userName= this.user['displayName']
        
        return(
            <View style={styles.groupsContainerStyle}>
                <FavoritesView
                    navTo={this.props.navigation.navigate}
                    messagesEnabled={messagesEnabled(this.user)}
                    currentUserProfileImage={profileImage}
                    userId={userId}
                    makeCall={this.props.screenProps.makeCall}
                    userName={userName}
                />
                <View style={styles.groupsContainerStyle}>
                    <GroupListView
                        userId={userId}
                        enterpriseId={enterpriseId}
                        groupSelected={this.navigateToGroupUsers}
                        userName={userName}
                    />
                </View>
                {showUserSearch ? this.renderSearch() : null}
            </View>
        )
    }

    renderSearch(){

        const { searchTerm } = this.state
        
        const profileImage = this.returnProfileImage()
        let userId = this.user['id']
        let userName= this.user['displayName']

        return(
            <View style={styles.searchContainerStyle}>
                <SearchUsersView 
                    currentUserProfileImage={profileImage}
                    messagesEnabled={messagesEnabled(this.user)}
                    userId={userId}
                    userName={userName}
                    searchTerm={searchTerm}
                    makeCall={this.props.screenProps.makeCall}
                />
            </View>
        )
    }

    renderPatients(){

        const { searchTerm } = this.state

        const { screenProps } = this.props

        let userName = this.user['displayName']
        let userId = this.user['id']
        let enterprise = this.user['enterprise']
        let enterpriseId = enterprise['id']
        const profileImage = this.returnProfileImage()

            /*
            onDemandmessagesEnabled: onDemandmessagesEnabled(this.user),
            ,
            loggedInDisplayName: loggedInDisplayName,
            patientId: patientObject['patientId'],
            profileImage: profileImage,
            userId: patientObject['currentUserId'],
            userName: patientObject['currentUserName'],
            enterpriseId: enterpriseId,
            languages: patientObject['languages'],
            defaultLanguage: patientObject['defaultLanguage'],
            socketState:this.props.screenProps.socketState,
            closeSocket:this.props.screenProps.closeSocket,
            makeCall:this.props.screenProps.makeCall
            */

        return(
            <View style={styles.groupsContainerStyle}>
                <PatientListView
                    onDemandmessagesEnabled={onDemandmessagesEnabled(this.user)}
                    messagesEnabled={messagesEnabled(this.user)}
                    userName={userName}
                    profileImage={profileImage}
                    userId={userId}
                    phoneUIAddPatient={this.navigateToPhoneAddPatientDetail}
                    searchTerm={searchTerm}
                    enterpriseId={enterpriseId}
                    screenProps={screenProps}
                />
            </View>
        )
    }

    checkIfNewerVersion = (vcMinVersion) => {
        const currentVersion = DeviceInfo.getReadableVersion().split(".")
        const platform = Platform.OS

        const newestVersion = vcMinVersion.split(".")
            
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
                            AppLink.maybeOpenURL('https://itunes.apple.com/us/app/synzi-virtual-care/id1382769792', { appName: 'Virtual Care', appStoreId: '1382769792' }).done()
                        } else {
                            AppLink.maybeOpenURL('https://play.google.com/store/apps/details?id=com.synzi.virtualcare', { appName: 'Virtual Care', playStoreId: 'com.synzi.virtualcare' }).done()
                        }
                    }},
                ],
                { cancelable: false }
            )
        } 
    }


    render() {

        const { navigation } = this.props;
        const userId = navigation.getParam('userId', '0');

        /** Only effects iOS */
        StatusBar.setBarStyle('light-content', true)

        if (userId === '0') {
            return null
        }

        return (
            <Query 
                query={UsersQl.getByIdShort(userId)}
                fetchPolicy="network-only"
                pollInterval={10000}
            >
                {({ error, data }) => {
                    
                    if (error) return <ErrorPage error={error} closeSocket={this.props.screenProps.closeSocket} />

                    if(data.user){

                        this.user = data['user']
                        let userName = this.user['displayName']
                        let userId = this.user['id']
                        let enterprise = this.user['enterprise']
                        let enterpriseId = enterprise['id']

                        //Store the user id for later
                        AsyncStorage.setItem(AppConfig.USER_ID, userId)

                        //Set the user on the call manager
                        this.props.screenProps.saveCurrentUser(this.user)

                        this.checkIfNewerVersion(data.currentEnv.vcMinVersion)

                        Reactotron.log(`Get Enterprise Success: Username: ${userName}, enterpriseId: ${enterpriseId}`)
                        deviceLog.log(`Get Enterprise Success: Username: ${userName}, enterpriseId: ${enterpriseId}`)
    
                        return (
                            <View style={styles.mainContainerStyle}>{this.renderDashboard()}</View>
                        )
                    }

                    /** Catch all - if no user, show error */
                    return (
                        <View style={styles.mainContainerStyle}>{this.renderDashboardError()}</View>
                    )
                }}
            </Query>
        )

    }

}