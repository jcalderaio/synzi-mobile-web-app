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
import PropTypes from 'prop-types'
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'
import { LogSeparator} from '../../../../_shared/constants/AppConfig'
import TopBarView from '../../organisms/TopBarView/TopBarView'
import AssociatedCaregiverRow from '../../organisms/AssociatedCaregiverRow/AssociatedCaregiverRow'
import BreadcrumbView from '../../organisms/BreadcrumbView/BreadcrumbView'
import { AppColor} from '../../../../_shared/Color';
import { Query, Mutation } from 'react-apollo'
import deviceLog from 'react-native-device-log'
import CaregiverQL from '../../../../_shared/graphql/CaregiverQL'
import Reactotron from 'reactotron-react-native'

// React Navigation
import { withNavigation } from 'react-navigation';

// Toast Message
import { showMessage } from "react-native-flash-message"

import styles from './styles'

// Swipe left to delete
import Swipeout from 'react-native-swipeout';
import TrashIcon from 'react-native-vector-icons/FontAwesome5'
import EditCaregiverIcon from 'react-native-vector-icons/MaterialCommunityIcons'

class AssociatedCaregiversList extends Component {
  static propTypes = {
    /* patient that is calling caregiver in regards to */
    patientUserId: PropTypes.string.isRequired,
    /** When clicked, shows prompt to call caregiver */
    makeCall: PropTypes.func.isRequired,
    /** When clicked, shows onDemand message screen for Caregiver */
    sendOnDemandMessage: PropTypes.func.isRequired,
    /** If enabled, show messages icon */
    messagesEnabled: PropTypes.bool.isRequired,
    /** If enabled, show onDemand icon */
    onDemandmessagesEnabled: PropTypes.bool.isRequired,
    /** The name of the patient the Caregiver is associated with */
    patientName: PropTypes.string.isRequired,
    /** The id of the patient the Caregiver is associated with */
    patientId: PropTypes.string.isRequired,
    /** The id of the enterprise */
    enterpriseId: PropTypes.number.isRequired,
    /** A function that exposes the react-navigation API to allow 
     * for navigating outside of its main stack 
    */
    navTo: PropTypes.func.isRequired,
    /** The display name of the logged in user (for TopBar) */
    loggedInDisplayName: PropTypes.string.isRequired,
     /** The profile image of the logged in user (for TopBar) */
    loggedInProfileImage: PropTypes.string.isRequired,
     /** The userId of the logged in user (for TopBar) */
    loggedInUserId: PropTypes.number.isRequired
  }

    constructor(props) {
        super(props)
        this.caregiverDisplayName = ""

        this.state = {
            isConnected: true
        }
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

    handleRemoveError = (error) => {
        Reactotron.error(`User creation error: ${error}`)
    }

    _renderItem = ({item, separators}) => {
        const UNASSIGN_CAREGIVER_MUTATION = CaregiverQL.unassignCaregiver()
        const patientId = this.props.patientId
        const caregiverId = item.id

        return (
            <Mutation
                mutation={UNASSIGN_CAREGIVER_MUTATION}
                variables={{ patientId, caregiverId }}
                onError={error => this.handleRemoveError(error)}
            >
                {(unassignCaregiver, {client}) => {
                    var swipeoutBtns = [
                        {
                            component:
                            (
                              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 3 }}>
                                <EditCaregiverIcon size={allowSidebar ? 40 : 34} name='account-edit' />
                              </View>
                            ),
                            type: "delete",
                            backgroundColor: '#7F99CE',
                            onPress: () => {
                                this.props.navigation.navigate('EditCaregiver', {
                                    loggedInProfileImage: this.props.loggedInProfileImage,
                                    loggedInDisplayName: this.props.loggedInDisplayName,
                                    loggedInUserId: this.props.loggedInUserId,
                                    enterpriseId: this.props.enterpriseId,
                                    caregiverDisplayName: item.user.displayName,
                                    caregiverId: caregiverId,
                                    contactType: item.user.contactType,
                                    email: item.user.email,
                                    phone: item.user.phone,
                                });
                            }
                        },
                        {
                            component:
                            (
                              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TrashIcon size={allowSidebar ? 26 : 22} name='trash'/>
                              </View>
                            ),
                            type: "delete",
                            backgroundColor: '#C60B0B',
                            onPress: () => {
                                Alert.alert(
                                    `Do you want to remove ${item.user.displayName} as a Caregiver?`,
                                    `\nThey will no longer receive messages and/or calls on behalf of ${this.props.patientName}`,
                                    [
                                        { text: 'Keep', onPress: () => null },
                                        { text: 'Remove', onPress: () => {
                                            unassignCaregiver()
                                            showMessage({
                                                message: 'Success',
                                                description: `${item.user.displayName} has been successfully removed from ${this.props.patientName}`,
                                                backgroundColor: AppColor.BRIGHT_GREEN,
                                                icon: "success",
                                                duration: 4000,
                                                color: 'black'
                                            });
                                        } }
                                    ],
                                    { cancelable: false }
                                )
                            }
                        }
                    ]

                   return (
                        <Swipeout
                            right={swipeoutBtns}
                            autoClose
                            backgroundColor={'#7F99CE'}
                            buttonWidth={allowSidebar ? 75 : 65}
                        >
                            <AssociatedCaregiverRow 
                                loggedInProfileImage={this.props.profileImage}
                                messagesEnabled={this.props.messagesEnabled}
                                onDemandmessagesEnabled={this.props.onDemandmessagesEnabled}
                                sendOnDemandMessage={this.props.sendOnDemandMessage}
                                loggedInDisplayName={this.props.loggedInDisplayName}
                                loggedInUserId={this.props.loggedInUserId}
                                odmId={item.user.id}
                                secureMessageId={item.user.id}
                                profileImage={item.user.profileImage}
                                userName={item.user.displayName}
                                overAllStatus={item.user.overallStatus}
                                activeOpacity={90}
                                callUser={() => this.props.makeCall(item.user, this.props.patientUserId)}
                                navTo={(this.props.navTo)}
                            />
                        </Swipeout>
                   )
                }}
            </Mutation>
        )
    }

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

    render(){
        const { currentlyAssignedCaregivers } = this.props
 
        if(currentlyAssignedCaregivers.length > 0) {
            return (
                <View style={styles.mainContainerStyle}>
                    <FlatList
                        data={currentlyAssignedCaregivers}
                        renderItem={this._renderItem}
                        ItemSeparatorComponent={this.renderSeparator}
                        keyExtractor={item => item.id}
                    />     
                </View>
            )
        } else   {
            return null
        }
    }
}

export default withNavigation(AssociatedCaregiversList);

