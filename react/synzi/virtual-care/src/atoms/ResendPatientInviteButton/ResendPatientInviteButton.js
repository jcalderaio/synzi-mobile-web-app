import React from 'react'
import { 
    TouchableOpacity, 
    Image,
    Alert,
    ActivityIndicator,
    View
} from 'react-native'
import PropTypes from 'prop-types'
import PatientsQl from '../../../../_shared/graphql/PatientsQL'
import { Mutation } from 'react-apollo'



export default class ResendPatientInviteButton extends React.Component {
    
    static propTypes = {
        /** ID of the patient */
        patientId: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props)
        this.onCompleteHandler = this.onCompleteHandler.bind(this)
        this.onErrorHandler = this.onErrorHandler.bind(this)
    }


    onCompleteHandler(){
  
        Alert.alert(
            'Success',
            `The invitation was sent successfully.`,
            [
                { text: 'Ok', onPress: () => null},
            ],
            { cancelable: false }
        )
    }

    onErrorHandler(error){
  
        Alert.alert(
            'Error',
            `${error.message}`,
            [
                { text: 'Ok', onPress: () => null},
            ],
            { cancelable: false }
        )
    }


    showAlert(resendPatientInvite){
        
        Alert.alert(
            'Resend',
            `Are you sure you want to resend the invite?`,
            [
                { text: 'Cancel', onPress: () => null},
                { text: 'Yes', onPress: () =>  resendPatientInvite() },
            ],
            { cancelable: false }
        )
    }

    render() {


        const { patientId } = this.props

        const RESEND_PATIENT_INVITE = PatientsQl.sendInvite()
        
        return(

            <Mutation
                mutation={RESEND_PATIENT_INVITE}
                variables={{ id: patientId }}
                onCompleted={this.onCompleteHandler}
                onError={this.onErrorHandler}>
                {(resendPatientInvite, { loading, error, data }) => {
                    

                    if(loading){
                        return <View style={{width:120, height:25, justifyContent:'center'}}><ActivityIndicator size={'small'}/></View>
                    }

                    return(
                        <TouchableOpacity onPress={() => this.showAlert(resendPatientInvite)}>
                            <Image
                                style={{
                                    width:120,
                                    height:25,
                                }}
                                resizeMode={'contain'}
                                source={require('../../../../_shared/images/icons/Resend-Icon.png')}
                            />
                        </TouchableOpacity>
                    )
                    
                }}
            </Mutation>

        )
        
    }

}



