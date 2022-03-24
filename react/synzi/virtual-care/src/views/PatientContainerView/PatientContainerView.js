import React, { Component } from 'react'
import { 
    View,
    Image,
    ActivityIndicator,
    Text
} from 'react-native';
import AddPatientDetailView from '../AddPatientDetailView/AddPatientDetailView'
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'
import { Query } from 'react-apollo'
import PatientsQl from '../../../../_shared/graphql/PatientsQL'
import styles from './styles'
import Reactotron from 'reactotron-react-native'


export default class PatientContainerView extends Component {

    constructor(props) {
        super(props)
    }

    renderLoadingState(){
        return(
            <ActivityIndicator size={'large'} />
        )
    }

    renderErrorState(errorText){
        return(
            <Text style={styles.errorTextStyle}>{errorText}</Text>
        )
    }


    render(){

        if(allowSidebar){

            const { 
                patientId,
                userId,
                languages,
                defaultLanguage,
                enterpriseId,
                cancelAddNewPatientHandler,
                showPlaceHolder,
                screenProps,
                messagesEnabled,
                onDemandmessagesEnabled,
                userName,
                profileImage
            } = this.props

            if(showPlaceHolder){
                return(
                    <View style={styles.loadingContainerStyle}>
                        <Image
                            style={
                                {
                                    width: 250, 
                                    height: 250,
                                    opacity: 0.2
                                }
                            }
                            resizeMode={'contain'}
                            source={require('../../../../_shared/images/icons/patientDefault.png')}
                        />
                    </View>
                )
            }

            //Add New Patient Form
            if(patientId === ''){
                return(
                    <AddPatientDetailView
                        languages={languages}
                        defaultLanguage={defaultLanguage}
                        enterpriseId={enterpriseId}
                        cancelAddNewPatientHandler={cancelAddNewPatientHandler}
                    />
                )
            }

            //Existing Patient
            return(
                <Query
                    query={PatientsQl.getById()}
                    variables={{ id: patientId }}
                    pollInterval={3000}
                    fetchPolicy={"network-only"}>
                    {({ loading, error, data, networkStatus, client }) => { 
                        
                        if(loading && networkStatus != 6){
                            return (
                                <View style={styles.loadingContainerStyle}>{this.renderLoadingState()}</View>
                            )
                        }
                
                        if(error){
                            return (
                                <View style={styles.loadingContainerStyle}>{this.renderErrorState(error.message)}</View>
                            )
                        }


                        if(data) {
                            return(
                                <AddPatientDetailView
                                    currentlyAssignedCaregivers={data.user.patient.caregivers.filter(c => c.user.isActive)}
                                    overallStatus={data.user.overallStatus}
                                    realPatientId={data.user.patient.id}
                                    currentlyEnrolledPrograms={data.user.patient.enrollments}
                                    currentAssignments={data.user.assignments}
                                    recipientId={data.user.id}
                                    possibleAssignments={data.user.enterprise.careteams}
                                    messagesEnabled={messagesEnabled}
                                    onDemandmessagesEnabled={onDemandmessagesEnabled}
                                    patientData={data}
                                    screenProps={screenProps}
                                    userId={userId}
                                    patientId={patientId}
                                    languages={languages}
                                    defaultLanguage={defaultLanguage}
                                    enterpriseId={enterpriseId}
                                    cancelAddNewPatientHandler={cancelAddNewPatientHandler}
                                    userName={userName}
                                    profileImage={profileImage}
                                />
                            )
                        }
                        
                    }}
                </Query>
            )
    
        }else{

         
             let patientId = this.props.navigation.getParam('patientId')
             let enterpriseId = this.props.navigation.getParam('enterpriseId')
             let languages = this.props.navigation.getParam('languages')
             let defaultLanguage = this.props.navigation.getParam('defaultLanguage')
             let userName = this.props.navigation.getParam('userName', '');
             let userId = this.props.navigation.getParam('userId', 0);
             let profileImage = this.props.navigation.getParam('profileImage', '0');
             let socketState = this.props.navigation.getParam('socketState')
             let closeSocket = this.props.navigation.getParam('closeSocket')
             let makeCall = this.props.navigation.getParam('makeCall')
             let messagesEnabled = this.props.navigation.getParam('messagesEnabled', false)
             let onDemandmessagesEnabled = this.props.navigation.getParam('onDemandmessagesEnabled', false)


            //Add New Patient Form
            if(patientId === ''){
                return(
                    <AddPatientDetailView
                        socketState={socketState}
                        languages={languages}
                        defaultLanguage={defaultLanguage}
                        enterpriseId={enterpriseId}
                        goBack={this.props.navigation.goBack}
                        userId={userId}
                        profileImage={profileImage}
                        userName={userName}
                    />
                )

            }

             //Existing Patients
             return(
                <Query
                    query={PatientsQl.getById()}
                    variables={{ id: patientId }}
                    pollInterval={3000}
                    fetchPolicy={"cache-and-network"}>
                    {({ loading, error, data, refetch, networkStatus, client }) => {

                        /* This checks whether or not there have been any changes 
                            in the results of the query.
                        */
                        const { complete } = client.cache.diff({
                            query: PatientsQl.getById(),
                            variables: { id: patientId },
                            returnPartialData: true,
                            optimistic: false
                        });
                        
                        if(loading && !complete && networkStatus != 6){
                            return (
                                <View style={styles.loadingContainerStyle}>{this.renderLoadingState()}</View>
                            )
                        }
                
                        if(error){
                            return (
                                <View style={styles.loadingContainerStyle}>{this.renderErrorState(error.message)}</View>
                            )
                        }

                        if(data){
                            return(
                                <AddPatientDetailView
                                    currentlyAssignedCaregivers={data.user.patient.caregivers.filter(c => c.user.isActive)}
                                    overallStatus={data.user.overallStatus}
                                    realPatientId={data.user.patient.id}
                                    currentlyEnrolledPrograms={data.user.patient.enrollments}
                                    currentAssignments={data.user.assignments}
                                    recipientId={data.user.id}
                                    possibleAssignments={data.user.enterprise.careteams}
                                    onDemandmessagesEnabled={onDemandmessagesEnabled}
                                    messagesEnabled={messagesEnabled}
                                    patientData={data}
                                    userId={userId}
                                    profileImage={profileImage}
                                    userName={userName}
                                    socketState={socketState}
                                    closeSocket={closeSocket}
                                    patientId={patientId}
                                    languages={languages}
                                    defaultLanguage={defaultLanguage}
                                    enterpriseId={enterpriseId}
                                    goBack={this.props.navigation.goBack}
                                    makeCall={makeCall}
                                />
                            )

                        }
                        
                    }}
                </Query>
            )

        }
       
    }

}
