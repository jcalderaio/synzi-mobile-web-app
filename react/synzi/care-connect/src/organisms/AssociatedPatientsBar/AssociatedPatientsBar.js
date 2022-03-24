import React, { Component } from 'react'
import {
    View,
    Image,
    Text,
    FlatList,
    ActivityIndicator,
    Alert,
    NetInfo,
    TouchableWithoutFeedback
} from 'react-native';
import PropTypes from 'prop-types'
import { LogSeparator} from '../../../../_shared/constants/AppConfig'
import AssociatedPatientsAvatar from '../../atoms/AssociatedPatientsAvatar/AssociatedPatientsAvatar'
import CaregiverQL from '../../graphql/CaregiverQL'
import { Query } from 'react-apollo'
import deviceLog from 'react-native-device-log'
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'
import Reactotron from 'reactotron-react-native'
import styles from './styles';

export default class AssociatedPatientsBar extends Component {
    static propTypes = {
        /** userId of Caregiver */
        userId: PropTypes.string.isRequired,
        /* userId of selected patient */
        selectedPatientUserId: PropTypes.string.isRequired,
        /* function to set selected patient */
        setPatientUserId: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props)
        this.selectFirstUser = true

        this.state = {
            isConnected: true,
            firstPatientSelected: false
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

    setPatientUserId = patientUserId => {
        this.setState({ patientUserId })
    }

    _renderItem = ({item, separators}) => {
        const { setPatientUserId } = this.props

        // Automatically select first Patient to show caregivers
        if(this.selectFirstUser) {
            setPatientUserId(item.user.id)
            this.selectFirstUser = false
        }

        return(
            <AssociatedPatientsAvatar 
                displayName={item.user.displayName}
                profileImage={item.user.profileImage}
                patientUserId={item.user.id}
                setPatientUserId={this.props.setPatientUserId}
                selected={this.props.selectedPatientUserId === item.user.id}
            />
        )
    }

    renderErrorView(){
        return(
            <Text style={styles.errorTextStyle}>Error Loading Patients</Text>
        )
    }


    renderLoadingView(){
        return(
            <ActivityIndicator size={'large'} />
        )
    }
    
    render() {

        const { userId } = this.props
        const { isConnected } = this.state

        const GET_PATIENTS_BY_CAREGIVER_ID = CaregiverQL.getAssociatedPatientsByCaregiverUserId()

        return(
                <View style={styles.patientBarContainerStyle}>
                    {allowSidebar &&
                        <View>
                            <Text style={styles.patientsTextStyle}>Associated Patients</Text>
                        </View>
                    }
                    <View style={styles.patientsListContainerStyle}>
                        <Query
                            fetchPolicy={'cache-and-network'}
                            pollInterval={isConnected ? 5000 : 0}
                            variables={{ id: userId }}
                            query={GET_PATIENTS_BY_CAREGIVER_ID}
                        >
                            {({ loading, error, data, networkStatus, client }) => {

                                /* This checks whether or not there have been any changes 
                                    in the results of the query.
                                */
                                const { complete } = client.cache.diff({
                                    query: GET_PATIENTS_BY_CAREGIVER_ID,
                                    variables: { id: userId },
                                    returnPartialData: true,
                                    optimistic: false
                                });

                                // If loading, and not polling, and new results, show loading indicator
                                if (loading && !complete && networkStatus !== 6){
                                    return(
                                        <View style={styles.loadingContainerStyle}>
                                            <ActivityIndicator />
                                        </View>
                                    )   
                                }

                                if (error) {
                                    Reactotron.error(`error loading Associated Patients bar: ${error}`)
                                    return(
                                        <Text style={styles.errorTextStyle}>Error Loading Patients</Text>
                                    )
                                }
                        
                                let patients = []
                                if(data && data.user) {
                                    patients = data.user.caregiver.patients.filter(p => p.user.isActive)

                                    if(patients.length > 0) {
                                        return (
                                            <View>
                                                <FlatList
                                                    style={styles.flatListStyle}
                                                    horizontal={true}
                                                    data={patients}
                                                    renderItem={this._renderItem}
                                                    keyExtractor={item => item.id}
                                                    ListFooterComponent={<View style={{width:30}}></View>}
                                                />
                                            </View>
                                        )
                                    }

                                    return(
                                        <Text style={styles.errorTextStyle}>No Patients to Show</Text>
                                    )

                                }

                                return null
                                
                            }}
                        </Query>
                    </View>
                </View>
        ) 
    }
}