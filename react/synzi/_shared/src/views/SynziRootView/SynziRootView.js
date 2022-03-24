import React, { Component, Fragment } from 'react'
import {
    AsyncStorage,
    View,
    Modal
} from 'react-native';
import { isVirtualCare } from '../../../constants/AppConfig'

// Styles
import {SynziColor} from '../../../Color'

/* Virtual Care Screens */
import VirtualCareLoginView from '../../../../virtual-care/src/views/VirtualCareLoginView/VirtualCareLoginView'
import DashboardView from '../../../../virtual-care/src/views/DashboardView/DashboardView'
import PatientContainerView from '../../../../virtual-care/src/views/PatientContainerView/PatientContainerView'
import GroupUsersView from '../../../../virtual-care/src/views/GroupUsersView/GroupUsersView'
import LogsContainerView from '../../../../_shared/src/views/LogsContainerView/LogsContainerView'
import EnvironmentContainerView from '../../../../_shared/src/views/EnvironmentContainerView/EnvironmentContainerView'
import ForgotPasswordView from '../../../../virtual-care/src/views/ForgotPasswordView/ForgotPasswordView'
import VCSecureMessageDetailScreen from '../../../../virtual-care/src/screens/SecureMessageDetailScreen/SecureMessageDetailScreen'
import CaregiverScreen from '../../../../virtual-care/src/screens/CaregiverScreen/CaregiverScreen'
import CreateCaregiverScreen from '../../../../virtual-care/src/screens/CreateCaregiverScreen/CreateCaregiverScreen'
import EditCaregiverScreen from '../../../../virtual-care/src/screens/EditCaregiverScreen/EditCaregiverScreen'

/* Start Care Connect Screens */

// Shared
import InviteCodeScreen from '../../../../care-connect/src/screens/InviteCodeScreen/InviteCodeScreen'
import GetNewInviteToken from '../../../../care-connect/src/screens/GetNewInviteToken/GetNewInviteToken'
import SecureMessagesScreen from '../../../../care-connect/src/screens/SecureMessagesScreen/SecureMessagesScreen'
import SecureMessageDetailScreen from '../../../../care-connect/src/screens/SecureMessageDetailScreen/SecureMessageDetailScreen'
import AppContainerScreen from '../../../../care-connect/src/screens/AppContainerScreen/AppContainerScreen'

// Patient
import PatientLoginScreen from '../../../../care-connect/src/screens/PatientLoginScreen/PatientLoginScreen'
import PatientHomeScreen from '../../../../care-connect/src/screens/PatientHomeScreen/PatientHomeScreen'

// Caregiver
import CaregiverLoginScreen from '../../../../care-connect/src/screens/CaregiverLoginScreen/CaregiverLoginScreen'
import CaregiverHomeScreen from '../../../../care-connect/src/screens/CaregiverHomeScreen/CaregiverHomeScreen'

/* End Care Connect Screens */

//React Navigation
import { createStackNavigator, createDrawerNavigator } from 'react-navigation'
import { fadeIn } from 'react-navigation-transitions'

//Logs
import deviceLog, { InMemoryAdapter} from 'react-native-device-log'
import CallManagerUI from '../../../services/CallManager/CallManagerUI/CallManagerUI'

//Logout
import { Mutation } from 'react-apollo'
import AuthQl from '../../../graphql/AuthQL'

import Reactotron from 'reactotron-react-native'

console.disableYellowBox = true;

//Logging
deviceLog.init(InMemoryAdapter /* You can send new InMemoryAdapter() if you do not want to persist here*/
,{
  //Options (all optional):
  logToConsole : false, //Send logs to console as well as device-log
  logRNErrors : false, // Will pick up RN-errors and send them to the device log
  maxNumberToRender : 2000, // 0 or undefined == unlimited
  maxNumberToPersist : 2000 // 0 or undefined == unlimited
}).then(() => {
 
  //When the deviceLog has been initialized we can clear it if we want to:
  //deviceLog.clear();
 
});



/****************************  SHARED ROUTES ************************************************************ */
const DebugStack = createStackNavigator({
    LogsModal: {
        screen: LogsContainerView,
        navigationOptions: {
            title: 'Logs',
        }
    },
    EnvModal: {
        screen: EnvironmentContainerView,
        navigationOptions: {
            title: 'Environments',
        }
    },
  }, {
    navigationOptions: {
        gesturesEnabled: false,
    },
    transitionConfig: () => fadeIn(),
    headerMode: 'screen',
  }
)


/*************************  VIRTUAL CARE ROUTES ********************************************************* */
const VirtualCareNavStack = createStackNavigator({
    Login: {
        screen: VirtualCareLoginView,
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        }
    },
    Dashboard: {
        screen: DashboardView,
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        }
    },
    GroupUsers: {
        screen: GroupUsersView,
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        }
    },
    AddPatientDetail: {
        screen: PatientContainerView,
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        }
    },
    VCSecureMessageDetail: {
        screen: VCSecureMessageDetailScreen,
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        }
    },
    Caregiver: {
        screen: CaregiverScreen,
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        }
    },
    CreateCaregiver: {
        screen: CreateCaregiverScreen,
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        }
    },
    EditCaregiver: {
        screen: EditCaregiverScreen,
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        }
    }
},
{
    initialRouteName: 'Login',
        transitionConfig: () => fadeIn(),
    },
)

//Modal Navigation
const VirtualCareRootStack = createStackNavigator(
    {
      Main: {
        screen: VirtualCareNavStack,
        navigationOptions: {
            header: null // Will hide header for HomePage
        }
      },
      debugStack: { 
        screen: DebugStack,
        navigationOptions: {
            header: null // Will hide header for Log and Env Picker
        }
      },
      ForgotPasswordModal: {
        screen: ForgotPasswordView,
        navigationOptions: {
            title: 'Forgot Password',
        }
      },
    },
    {
      mode: 'modal',
    }
);

/*************************  CARE CONNECT ROUTES ********************************************************* */

const PatientHomeScreenStack = createStackNavigator(
    {
      PatientHomeScreen: {
        screen: PatientHomeScreen,
      }
    },
    {
      initialRouteName: 'PatientHomeScreen',
      navigationOptions: ({ navigation }) => ({
        gesturesEnabled: false,
      }),
      transitionConfig: () => fadeIn(),
      headerMode: 'screen'
    }
);

const CaregiverHomeScreenStack = createStackNavigator(
    {
      CaregiverHomeScreen: {
        screen: CaregiverHomeScreen,
      }
    },
    {
      initialRouteName: 'CaregiverHomeScreen',
      navigationOptions: ({ navigation }) => ({
        gesturesEnabled: false,
      }),
      transitionConfig: () => fadeIn(),
      headerMode: 'screen'
    }
);

const SecureMessagesScreenStack = createStackNavigator(
    {
      SecureMessagesScreen: {
        screen: SecureMessagesScreen,
      },
      SecureMessageDetail: {
        screen: SecureMessageDetailScreen
      }
    },
    {
      initialRouteName: 'SecureMessagesScreen',
      navigationOptions: ({ navigation }) => ({
        gesturesEnabled: false,
      }),
      transitionConfig: () => fadeIn(),
      headerMode: 'screen',
    }
);

const PatientDrawerStack = createDrawerNavigator({
   'Patient Home': { screen: PatientHomeScreenStack },
   'Secure Messages': { screen: SecureMessagesScreenStack }
},
{
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => fadeIn(),
  }
)

const CaregiverDrawerStack = createDrawerNavigator({
    'Caregiver Home': { screen: CaregiverHomeScreenStack },
    'Secure Messages': { screen: SecureMessagesScreenStack }
 },
 {
     navigationOptions: {
       gesturesEnabled: false,
     },
     transitionConfig: () => fadeIn(),
   }
 )

const LoginStack = createStackNavigator({
    InviteCode: { screen: InviteCodeScreen },
    RefetchInvite: { screen: GetNewInviteToken },
    PatientLogin: { screen: PatientLoginScreen },
    CaregiverLogin: { screen: CaregiverLoginScreen },
    AppContainer: { screen: AppContainerScreen },
  }, {
    initialRouteName: 'InviteCode',
    navigationOptions: {
        gesturesEnabled: false,
    },
    transitionConfig: () => fadeIn(),
    headerMode: 'screen',
  }
)

// Manifest of possible screens
const CareConnectRootStack = createStackNavigator({
    loginStack: { screen: LoginStack },
    patientDrawerStack: { screen: PatientDrawerStack },
    caregiverDrawerStack: { screen: CaregiverDrawerStack },
    debugStack: { screen: DebugStack },
  }, {
    initialRouteName: 'loginStack',
    navigationOptions: {
        gesturesEnabled: false,
    },
    // Default config for all screens
    headerMode: 'none',
    transitionConfig: () => fadeIn(),
  }
)

export default class SynziRootView extends Component {

    renderIncomingCallUI(){

        //Incoming Call Props
        const { incomingCallObject, ignoreIncomingCall, joinRoom } = this.props

        return(
            <CallManagerUI 
                ignoreIncomingCall={ignoreIncomingCall}
                acceptCall={this.props.acceptCall}
                incomingCallObject={incomingCallObject}
            />
        )
    }


    renderOutGoingCallUI(){

        const {
            outgoingCallObject,
            cancelCall,
            skipCall,
            retryCall,
            retryCallAction
        } = this.props

        return(
            <CallManagerUI 
                retryCall={retryCall}
                retryCallAction={retryCallAction}
                cancelCall={cancelCall}
                skipCall={skipCall}
                outgoingCallObject={outgoingCallObject}
            />
        )
    }


    render(){

        //Environment Picker Refresh
        const { refreshEnv } = this.props

        //Save Logged In User to GlobalCallManager State
        const { saveCurrentUser } = this.props

        //Refresh Environment
        const { refreshEnvironment } = this.props

        //Socket State Props
        const { socketState, connectToSocket, closeSocket } = this.props

        //Incoming Call Props
        const { incomingCallObject } = this.props

        //Outgoing Call Props
        const { makeCall, outgoingCallObject, makeGroupCall, skipCall } = this.props

        //Logout Props
        const { triggerLogout, finishSignout } = this.props

        let showModal = (incomingCallObject !== null || outgoingCallObject !== null)
        let incomingCall = (incomingCallObject !== null)
        let outgoingCall = (outgoingCallObject !== null)

        /** UI in the navigation stack communicates with the CallManager through 
        * screenProps property on the navigation stack itself. */

        let props = {
            finishSignout,
            socketState,
            refreshEnv,
            connectToSocket,
            closeSocket,
            saveCurrentUser,
            makeCall,
            makeGroupCall,
            skipCall,
            refreshEnvironment,
        };

        return(
            <Fragment>
                {triggerLogout && (
                    <Mutation
                        mutation={AuthQl.logout()}
                        onCompleted={(data) => {
                            Reactotron.log(" =====> signout result:", data)
                            finishSignout()
                        }}
                        onError={error => {
                            Reactotron.log(" =====> signout error: ", error)
                            deviceLog.log('Signout Error: ' + error.message)
                            finishSignout()
                        }}>
                        {(mutate, {client, loading, called}) => {
                            if (!loading && !called) {
                                client.clearStore().then(() => {
                                    mutate()
                                })
                            }
                            return (
                                <View style={{
                                    backgroundColor: '#000000',
                                    position: 'absolute',
                                    top: 28,
                                    left: 30,
                                    width: 120,
                                    height: 120,
                                    borderRadius:0,
                                    borderWidth:0,
                                    borderColor:'black',
                                    opacity: 1.0
                                    }}
                                />
                            )
                        }}
                    </Mutation>
                )}
                {!triggerLogout && (
                    <Fragment>
                       <Modal
                            animationType='fade'
                            transparent={true}
                            visible={showModal}
                            onDismiss={null}>
                            {incomingCall ? this.renderIncomingCallUI() : null}
                            {outgoingCall ? this.renderOutGoingCallUI() : null}
                        </Modal>
                        {isVirtualCare() &&
                            <VirtualCareRootStack screenProps={props} />
                        }
                        {!isVirtualCare() &&
                            <CareConnectRootStack screenProps={props} />
                        }
                    </Fragment>
                )}
            </Fragment>
        )
    }
}
