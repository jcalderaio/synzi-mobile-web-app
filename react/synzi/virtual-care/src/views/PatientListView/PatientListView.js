import React, { Component } from 'react'
import { 
    Text, 
    View, 
    Platform,
    ActivityIndicator,
    FlatList,
    ScrollView
} from 'react-native';
import { AppColor } from '../../../../_shared/Color'
import PatientsQL from '../../../../_shared/graphql/PatientsQL'
import PatientRowView from '../../organisms/PatientRowView/PatientRowView'
import AddPatientBarView from '../../organisms/AddPatientBarView/AddPatientBarView'
import { LogSeparator } from '../../../../_shared/constants/AppConfig'
import { Query } from 'react-apollo'
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'
import deviceLog from 'react-native-device-log'
import styles from './styles'
import PatientContainerView from '../PatientContainerView/PatientContainerView';
import Reactotron from 'reactotron-react-native'

export default class PatientListView extends Component {

    constructor(props) {
        super(props);

        this.navigateToPatientDetail = this.navigateToPatientDetail.bind(this)
        this.cancelAddNewPatientHandler = this.cancelAddNewPatientHandler.bind(this)
        this.navigateToAddPatientDetail = this.navigateToAddPatientDetail.bind(this)

        this.initialData = []

        this.state = {
            patientId: '',
            showPlaceHolder: true,
        }
    }



    cancelAddNewPatientHandler(){
        this.setState({showPlaceHolder: true})
    }

    navigateToAddPatientDetail(patientId){

        
        Reactotron.log(`Showing Add Patient Form`)
        deviceLog.log(`Showing Add Patient Form`)

        const { userId, userName } = this.props

        let addPatientObject = {
            patientId:patientId,
            currentUserId:userId,
            currentUserName:userName,
            languages:this.languages,
            defaultLanguage: this.defaultLanguage
        }


        if(allowSidebar){
            this.setState({ showPlaceHolder: false, patientId: patientId })
        }else{
            this.props.phoneUIAddPatient(addPatientObject)
        }
    }

    navigateToPatientDetail(patientId){

        
        Reactotron.error(`Showing Patient Detail : patientId:${patientId}`)
        deviceLog.log(`Showing Patient Detail : patientId:${patientId}`)
    
        this.setState({ patientId: patientId, showPlaceHolder: false })
    }


    _renderItem = ({item, separators}) => (
        <PatientRowView
            overallStatus={item.overallStatus}
            profileImage={item.profileImage}
            userName={item.displayName}
            activeOpacity={90}
            selectedPatient={this.state.patientId}
            patientId={item.id}
            selectPatient={() => this.navigateToAddPatientDetail(item.id)}
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

    renderNoPatientsState(){
        return(
            <Text style={styles.errorTextStyle}>No Patients Found</Text>
        )
    }

    renderErrorState(){
        return(
            <Text style={styles.errorTextStyle}>Error Loading Patients</Text>
        )
    }

    renderLoadingState(){
        return(
            <ActivityIndicator size={'large'} />
        )
    }


    renderTabletUI(){

        const { patientId, showPlaceHolder } = this.state

        const { screenProps, enterpriseId, messagesEnabled, onDemandmessagesEnabled, userId, userName, profileImage } = this.props

        return(
            <View style={styles.contentContainerStyle}>
               
                    <PatientContainerView
                        profileImage={profileImage}
                        onDemandmessagesEnabled={onDemandmessagesEnabled}
                        userName={userName}
                        messagesEnabled={messagesEnabled}
                        screenProps={screenProps}
                        showPlaceHolder={showPlaceHolder}
                        userId={userId}
                        patientId={patientId}
                        languages={this.languages}
                        defaultLanguage={this.defaultLanguage}
                        enterpriseId={enterpriseId}
                        cancelAddNewPatientHandler={this.cancelAddNewPatientHandler}
                    />
                
               
            </View>
        )
    }

    render(){

        const { searchTerm, enterpriseId} = this.props

        if(searchTerm !== ''){

            let text = searchTerm.toLowerCase()
            let filteredData = this.initialData.filter((item) => {
                return item.displayName.toLowerCase().match(text)
            })
            
            return(
                <View style={styles.mainContainerStyle}>
                    <View style={allowSidebar ? styles.leftNavContainerStyle : styles.leftNavPhoneContainerStyle}>
                        <View style={{ flex: 1 }}>
                            <AddPatientBarView
                                addPatient={() => this.navigateToAddPatientDetail('')}
                            />
                            <ScrollView style={{ flex: 1}}>
                                <FlatList
                                    data={filteredData}
                                    renderItem={this._renderItem}
                                    ItemSeparatorComponent={this.renderSeparator}
                                    keyExtractor={item => item.displayName}
                                    extraData={this.state.patientId}
                                />
                            </ScrollView>
                        </View>
                    </View>
                    {allowSidebar ? this.renderTabletUI() : null}
                </View>
            )
              
        }
        

        return(
            <Query
                fetchPolicy={'cache-and-network'}
                pollInterval={5000}
                query={PatientsQL.getAll(enterpriseId)}>
                {({ loading, error, data, networkStatus, client }) => {

                     /* This checks whether or not there have been any changes 
                        in the results of the query.
                    */
                   const { complete } = client.cache.diff({
                        query: PatientsQL.getAll(enterpriseId),
                        returnPartialData: true,
                        optimistic: false
                    });

                    // If loading, and not polling, and new results, show loading indicator
                    if (loading && !complete && networkStatus !== 6){
                        return (
                            <View style={styles.spinnerStyle}>{this.renderLoadingState()}</View>
                        )
                    }

                    if (error) {
                        
                        Reactotron.error('Get Patients Error : ', error.message)
                        deviceLog.log(`Get Patients Error : ${error.message}`)
                        return (
                            <View style={styles.errorContainerStyle}>{this.renderErrorState()}</View>
                        )
                    }


                    let enterprise = data['enterprise']
        
                    if(enterprise){

                        this.initialData = enterprise['patients']
                        this.backupData = this.initialData
                        this.languages = data['languages']
                        this.defaultLanguage = enterprise['language']

                        if(this.initialData.length > 0){
                            return (
                                <View style={styles.mainContainerStyle}>
                                    <View style={allowSidebar ? styles.leftNavContainerStyle : styles.leftNavPhoneContainerStyle}>
                                        <View style={{ flex: 1 }}>
                                            <AddPatientBarView
                                                addPatient={() => this.navigateToAddPatientDetail('')}
                                            />
                                            <ScrollView style={{ flex: 1 }}>
                                                <FlatList
                                                    data={this.initialData}
                                                    renderItem={this._renderItem}
                                                    ItemSeparatorComponent={this.renderSeparator}
                                                    keyExtractor={item => item.displayName}
                                                    extraData={this.state.patientId}
                                                />
                                            </ScrollView>
                                        </View>
                                    </View>
                                    {allowSidebar ? this.renderTabletUI() : null}
                                </View>
                            )
                        }
                        // If no patients, return AddPatientBar and empty list 
                        else {
                            return (
                                <View style={styles.mainContainerStyle}>
                                    <View style={allowSidebar ? styles.leftNavContainerStyle : styles.leftNavPhoneContainerStyle}>
                                        <View style={{ flex: 1 }}>
                                            <AddPatientBarView
                                                addPatient={() => this.navigateToAddPatientDetail('')}
                                            />
                                        </View>
                                    </View>
                                    {allowSidebar ? this.renderTabletUI() : null}
                                </View>
                            )
                        }

                    }

                    return (
                        <View style={styles.errorContainerStyle}>{this.renderErrorState()}</View>
                    )
                }}
            </Query>
        )
        
    }

}


