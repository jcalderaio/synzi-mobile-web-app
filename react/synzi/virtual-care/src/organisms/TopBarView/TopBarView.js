import React, { Component } from 'react'
import {
    View,
    Image,
    TouchableOpacity,
    Text
} from 'react-native';
import DashboardNavButton from '../../atoms/DashboardNavButton/DashboardNavButton'
import LogoutButton from '../LogoutButton/LogoutButton'
import { phoneStyles, tabletStyles } from './styles';
import deviceLog from 'react-native-device-log'
import SynziLogo from '../../../../_shared/images/logos/synzi_blue_logo.png'
import IconBadge from 'react-native-icon-badge'
import Reactotron from 'reactotron-react-native'
import ErrorPage from '../../../../_shared/src/views/ErrorPage/ErrorPage'

//Wide/Narrow Layout & Orientation Change Detection
import OrientationResponsiveComponent from '../../../../_shared/src/OrientationResponsiveComponent'

//Graphql
import MessagesQL from '../../../../_shared/graphql/MessagesQL'
import { Query } from 'react-apollo'

// export default class TopBarView extends Component {
export default class TopBarView extends OrientationResponsiveComponent {

    constructor(props) {
        super(props)
        this.doLogout = this.doLogout.bind(this)
        // this.state = { orientationChange: false }
    }

    // componentWillMount() {
    //     Dimensions.addEventListener('change', newDimensions => {
    //         // Retrieve and save new dimensions
    //         screenWidth = newDimensions.window.width;
    //         screenHeight = newDimensions.window.height;
    //         console.log("*** Dimensions Change: " + screenWidth + " x " + screenHeight)

    //         const toggledValue = !this.state.orientationChange
    //         this.setState({ orientationChange: toggledValue })
    //     })
    // }
    // componentWillUnmount() {
    //     Dimensions.removeEventListener('change', () => {});
    // }

    doLogout() {
        Reactotron.log(" ********** DO LOGOUT ********** ")
        deviceLog.log(`User ${this.props.userName} requested logout, closing socket, etc.`)

        // close socket with flag to finish logout when socket has finished disconnecting
        this.props.closeSocket(true)
    }

    /* ========================= RENDER ========================= */

    renderPhone(unreadMessages){

        const { showTab, userName, canCallStaff, canCallPatients, canSecureMessage, profileImage, screenProps, userId } = this.props;

        let tripleButtons = false
        let dualButtons = false
        let noUnderscore = true

        // 1, 2, or 3 menu items at top of screen
        if(canCallStaff && canCallPatients){
            if(canSecureMessage) {
                tripleButtons = true
                noUnderscore = false
            }
            else {
                dualButtons = true
                noUnderscore = false
            }
        }

        const styles = phoneStyles

        return(
            <View style={styles.phoneContainerStyle}>
                <View style={styles.synziLogoContainerStyle}>
                    <Image
                        style = {{
                            width: 70,
                            height: 30,
                        }}
                        resizeMode={'contain'}
                        source={SynziLogo}
                    />
                </View>
                <View style={tripleButtons ? styles.userControlGroupTripleButtonContainerStyle : (dualButtons ? styles.userControlGroupDualButtonContainerStyle : styles.userControlGroupSingleButtonContainerStyle)} >
                    {canCallStaff && (
                        <DashboardNavButton
                            noUnderscore={noUnderscore}
                            hideUndersore={showTab !== 'staff'}
                            onPress={() => this.props.toggleTabUI('staff')}>
                            Staff
                        </DashboardNavButton>
                    )}
                    
                    {canCallPatients && (
                        <DashboardNavButton
                            noUnderscore={noUnderscore}
                            hideUndersore={showTab !== 'patients'}
                            onPress={() => this.props.toggleTabUI('patients')}>
                            Patients
                        </DashboardNavButton>
                    )}

                    {canSecureMessage && (
                        <IconBadge
                                MainElement={
                                    <DashboardNavButton
                                        noUnderscore={noUnderscore}
                                        hideUndersore={showTab !== 'secureMessages'}
                                        onPress={() => this.props.toggleTabUI('secureMessages')}>
                                        Messages
                                    </DashboardNavButton>
                                }
                                /*
                                // Shows the exact unread message count in the Avatar's badge
                                BadgeElement={
                                    <Text style={{color: 'black', fontSize: 12}}>{unreadCount}</Text>
                                }
                                */
                                BadgeElement={
                                    <Text style={{color: 'black', fontSize: 12}}>{' '}</Text>
                                }
                                IconBadgeStyle={
                                    {
                                        width:20,
                                        height:20,
                                        left: 60,
                                        backgroundColor: '#F4DC22'
                                    }
                                }
                                Hidden={!unreadMessages}
                        />
                    )}
                </View>
                <View style={styles.userAvatarContainerStyle}>
                    <LogoutButton
                        userId={userId}
                        logout={this.doLogout}
                        profileImage={profileImage}
                        userName={userName}
                        screenProps={screenProps}
                    />
                </View>
            </View>
        )

    }


    renderPhoneNoButtons(){

        const { profileImage, userName, screenProps, userId } = this.props;
        const styles = phoneStyles

        return(
            <View style={styles.phoneContainerStyle}>
                <View style={styles.synziLogoContainerStyle}>
                    <Image
                        style = {{
                            width: 70,
                            height: 30,
                        }}
                        resizeMode={'contain'}
                        source={SynziLogo}
                    />
                </View>
                <View style={styles.userAvatarContainerStyle}>
                    <LogoutButton
                        userId={userId}
                        profileImage={profileImage}
                        userName={userName}
                        logout={this.doLogout}
                        screenProps={screenProps}
                    />
                </View>
            </View>
        )

    }


    renderTablet(unreadMessages){

        const { showTab, userName, canCallStaff, canCallPatients, canSecureMessage, profileImage, screenProps, userId } = this.props;
        const styles = tabletStyles

        let tripleButtons = false
        let dualButtons = false
        let noUnderscore = true

        // 1, 2, or 3 menu items at top of screen
        if(canCallStaff && canCallPatients){
            if(canSecureMessage) {
                tripleButtons = true
                noUnderscore = false
            }
            else {
                dualButtons = true
                noUnderscore = false
            }
        }

        return(
            <View style={styles.topHeaderContainerStyle}>
                <View style={styles.synziLogoContainerStyle}>
                    <Image
                        style = {{
                            width: 70,
                            height: 30,
                        }}
                        resizeMode={'contain'}
                        source={SynziLogo}
                    />
                </View>
                <View style={tripleButtons ? styles.userControlGroupTripleButtonContainerStyle : (dualButtons ? styles.userControlGroupDualButtonContainerStyle : styles.userControlGroupSingleButtonContainerStyle)} >
                    {canCallStaff && (
                        <DashboardNavButton
                            noUnderscore={noUnderscore}
                            hideUndersore={showTab !== 'staff'}
                            onPress={() => this.props.toggleTabUI('staff')}>
                            Staff
                        </DashboardNavButton>
                    )}
            
                    {canCallPatients && (
                        <DashboardNavButton
                            noUnderscore={noUnderscore}
                            hideUndersore={showTab !== 'patients'}
                            onPress={() => this.props.toggleTabUI('patients')}>
                            Patients
                        </DashboardNavButton>
                    )}

                    {canSecureMessage && (
                        <IconBadge
                                MainElement={
                                    <DashboardNavButton
                                        noUnderscore={noUnderscore}
                                        hideUndersore={showTab !== 'secureMessages'}
                                        onPress={() => this.props.toggleTabUI('secureMessages')}>
                                        Messages
                                    </DashboardNavButton>
                                }
                                /*
                                // Shows the exact unread message count in the Avatar's badge
                                BadgeElement={
                                    <Text style={{color: 'black', fontSize: 12}}>{unreadCount}</Text>
                                }
                                */
                                BadgeElement={
                                    <Text style={{color: 'black', fontSize: 12}}>{' '}</Text>
                                }
                                IconBadgeStyle={
                                    {
                                        width:20,
                                        height:20,
                                        left: 60,
                                        backgroundColor: '#F4DC22'
                                    }
                                }
                                Hidden={!unreadMessages}
                        />
                    )}
                </View>
                <View>
                    <LogoutButton
                        userId={userId}
                        profileImage={profileImage}
                        userName={userName}
                        logout={this.doLogout}
                        screenProps={screenProps}
                    />
                </View>
            </View>
        )
    }


    renderTabletNoButtons(){

        const { userName, profileImage, screenProps, userId } = this.props;
        const styles = tabletStyles

        return(
            <View style={styles.topHeaderContainerStyle}>
                <View style={styles.synziLogoContainerStyle}>
                    <Image
                        style = {{
                            width: 70,
                            height: 30,
                        }}
                        resizeMode={'contain'}
                        source={SynziLogo}
                    />
                </View>
                <View>
                    <LogoutButton
                        userId={userId}
                        profileImage={profileImage}
                        userName={userName}
                        logout={this.doLogout}
                        screenProps={screenProps}
                    />
                </View>
            </View>
        )
        
    }


    render() {

        const { hideButtons, userId } = this.props;

        const GET_UNREAD_MESSAGES = MessagesQL.getUnreadMessages()

        return (
            <Query 
                query={GET_UNREAD_MESSAGES}
                fetchPolicy="network-only"
                pollInterval={2000}
                variables={{ userId }}
            >
                {({ error, data, networkStatus }) => {

                    if(error) return <ErrorPage error={error} closeSocket={this.props.closeSocket} />

                    let unreadMessages = 0

                    if(data && data.user && data.user.unreadMessages){
                        unreadMessages = data.user.unreadMessages
                    }

                    let styles = phoneStyles

                    if(this.isWide()){
                        styles = tabletStyles

                        if(hideButtons){
                            return(
                                <View style={styles.mainContainerStyle}>{this.renderTabletNoButtons(unreadMessages)}</View>
                            )
                        }else{
                            return(
                                <View style={styles.mainContainerStyle}>{this.renderTablet(unreadMessages)}</View>
                            )
                        }
            
                    }else{
            
                        if(hideButtons){
                            return(
                                <View>{this.renderPhoneNoButtons(unreadMessages)}</View>
                            )
                        }else{
                            return(
                                <View>{this.renderPhone(unreadMessages)}</View>
                            )
                        }
                    }
                }}
            </Query>
        )


        
    }
}