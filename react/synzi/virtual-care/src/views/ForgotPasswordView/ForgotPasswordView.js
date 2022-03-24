import React, { Component } from 'react'
import { 
    Button
} from 'react-native';

import AuthQL from '../../../../_shared/graphql/AuthQL'
import { LogSeparator } from '../../../../_shared/constants/AppConfig'
import { Mutation } from 'react-apollo'
import deviceLog from 'react-native-device-log'

import ForgotPasswordForm from '../ForgotPasswordForm/ForgotPasswordForm'
import Reactotron from 'reactotron-react-native'



export default class ForgotPasswordView extends Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        
        return {
            headerLeft: (
                <Button
                    onPress={() => navigation.goBack()}
                    title='Cancel'
                    color='black'
                />
            )
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            navigateToLogin: false,
            username: '',
            loading: false,
            showSuccess: false,
            errorMessage: '',
        }

        this.handleChange = this.handleChange.bind(this)
        this.goBackToLogin = this.goBackToLogin.bind(this)
    }


    handleChange(text) {
        this.setState({ username: text })
    }

    handleSuccess = data => {
        
        Reactotron.log(`Forgot Password Success`)
        deviceLog.log(`Forgot Password Success`)

        this.setState({ showSuccess: true, loading: false })
    }

    handleError = error => {
        
        Reactotron.log(`Forgot Password Error: ${error}`)
        deviceLog.log(`Forgot Password Error: ${error}`)

        this.setState({
          showSuccess: false,
          loading: false,
          errorMessage: error.message,
        })
    }

    goBackToLogin(){
        this.props.navigation.goBack()
    }


    render(){

        const {
            username,
            loading,
            showSuccess,
            errorMessage,
        } = this.state

        return(
            <Mutation
                mutation={AuthQL.forgotPassword()}
                variables={{ username }}
                onCompleted={data => this.handleSuccess(data)}
                onError={error => this.handleError(error)}>
                {mutate => (
                    <ForgotPasswordForm
                        onSubmit={e => {
                            e.preventDefault()
                            this.setState({ loading: true })
                            mutate()
                        }}
                        username={username}
                        onInputChange={this.handleChange}
                        showSuccess={showSuccess}
                        loading={loading}
                        errorMessage={errorMessage}
                        goBackToLogin={this.goBackToLogin}
                    />
                )}
            </Mutation>
        )

    }
    
}