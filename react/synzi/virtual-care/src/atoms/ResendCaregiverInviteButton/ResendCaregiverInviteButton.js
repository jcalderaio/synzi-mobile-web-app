import React from 'react'
import { 
    TouchableOpacity, 
    Image,
    Alert,
    ActivityIndicator,
    View
} from 'react-native'
import PropTypes from 'prop-types'
import CaregiverQL from '../../../../_shared/graphql/CaregiverQL'
import { Mutation } from 'react-apollo'



export default class ResendCaregiverInviteButton extends React.Component {
    
    static propTypes = {
        /** ID of the caregiver */
        caregiverId: PropTypes.string.isRequired,
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


    showAlert(resendCaregiverInvite){
        
        Alert.alert(
            'Resend',
            `Are you sure you want to resend the invite?`,
            [
                { text: 'Cancel', onPress: () => null},
                { text: 'Yes', onPress: () =>  resendCaregiverInvite() },
            ],
            { cancelable: false }
        )
    }

    render() {


        const { caregiverId } = this.props

        const RESEND_CAREGIVER_INVITE = CaregiverQL.sendInvite()
        
        return(

            <Mutation
                mutation={RESEND_CAREGIVER_INVITE}
                variables={{ id: caregiverId }}
                onCompleted={this.onCompleteHandler}
                onError={this.onErrorHandler}>
                {(resendCaregiverInvite, { loading, error, data }) => {
                    

                    if(loading){
                        return <View style={{width:120, height:25, justifyContent:'center'}}><ActivityIndicator size={'small'}/></View>
                    }

                    return(
                        <TouchableOpacity onPress={() => this.showAlert(resendCaregiverInvite)}>
                            <Image
                                style={{
                                    width:120,
                                    height:25,
                                }}
                                resizeMode={'cover'}
                                source={require('../../../../_shared/images/icons/Resend-Icon.png')}
                            />
                        </TouchableOpacity>
                    )
                    
                }}
            </Mutation>

        )
        
    }

}



