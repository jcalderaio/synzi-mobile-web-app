import React, { Component } from 'react'
import { Text, View, Button, Linking, Modal } from 'react-native';
import PropTypes from 'prop-types'
import { includesErrorMessage } from '../../../helpers/Helpers'
import { handledErrors } from '../../../helpers/handledErrorMessages'
import { SynziColor } from '../../../Color';

// Toast Message
import { showMessage } from "react-native-flash-message"

import { withNavigation } from 'react-navigation';

import styles from './styles'

export default class ErrorPage extends Component {
  static propTypes = {
    /* triggers logout */
    closeSocket: PropTypes.func.isRequired,
    /** The error code for the error  */
    code: PropTypes.string,
    /** The error message */
    message: PropTypes.string,
    /** function to close exit error screen */
    goBack: PropTypes.func.isRequired,
    /** Error object to display */
    error: PropTypes.object.isRequired
  }
  static defaultProps = {
    code: null,
    message: 'There was an error'
  }

  state = {
    showError: false,
    showModal: true
  }

  logout = () => {
    this.props.closeSocket(true)
  }

  handleShowErrorToggle = () => {
    this.setState({ showError: !this.state.showError })
  }

  render() {
    const { code, message, goBack, error } = this.props
    const { showError, showModal } = this.state

    // ********************************************************
    //
    // Decide if a handled action is required
    //
    // ********************************************************
    if (error) {
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        if (
          includesErrorMessage(error.graphQLErrors, handledErrors.TOKEN_EXPIRED)
        ) {

          showMessage({
            message: "You have been logged out",
            description: "We log users out after a period of inactivity to ensure your account remains secure.",
            backgroundColor: SynziColor.SYNZI_YELLOW,
            icon: "warning",
            duration: 7000
          });

          this.logout()
          
        }

        if (
          includesErrorMessage(error.graphQLErrors, handledErrors.TOKEN_REVOKED)
        ) {

          showMessage({
            message: "You have been logged out",
            description: "Your account has been disabled",
            backgroundColor: SynziColor.SYNZI_YELLOW,
            icon: "warning",
            duration: 7000
          });
          
          this.logout()
          
        }
      }
    }

    // ********************************************************
    //
    // Show error page
    //
    // ********************************************************
    const errorVisibility = showError
      ? styles.errorpageErrorShow
      : styles.errorpageErrorHide

    let errorCode = 'Not provided'
    if (code) errorCode = code

    let errorMessage = ''
    if (error) {
      if (error.graphQLErrors.length > 0) {
        errorCode = 'GraphQl Error'
        error.graphQLErrors.forEach(
          error => (errorMessage = error.message + '\n\n')
        )
      }

      if (
        error.networkError &&
        error.networkError.result &&
        error.networkError.result.errors.length > 0
      ) {
        errorCode = 'Network Error'
        error.networkError.result.errors.forEach(
          error => (errorMessage = error.message + '\n\n')
        )
      }
    } else {
      errorMessage = message
    }

    return (
      <Modal 
        transparent={true}
        visible={showModal}
      >
        <View style={styles.mainContainerStyle}>
          <Text style={styles.callerNameTextStyle}>Sorry, something has gone wrong.</Text>
          <Text style={styles.errorpageMessage}>
            It's not your fault and thanks for your patience while we work on
            the issue.
          </Text>
          <Text style={styles.errorpageMessage}>In the meantime, you can go to our <Text onPress={() => Linking.openURL("https://synzi.com/support/")} style={{color: 'blue'}}>support</Text> page for help.</Text>
            <View>

              {showError &&
                <View style={[styles.errorpageMessage, errorVisibility]}>
                  <Text style={styles.errorpageMessage}>
                    <Text style={{ fontStyle: 'italic', fontWeight: 'bold' }}>Code: </Text> {errorCode}
                  </Text>
                  
                  <Text style={styles.errorpageMessage}>
                    <Text style={{ fontStyle: 'italic', fontWeight: 'bold' }}>Message: </Text> {errorMessage}
                  </Text>
                </View>
              }

              <Button
                style={styles.errorpageErrorButton}
                onPress={this.handleShowErrorToggle}
                title={"Display Error"}
              />
              <Button
                style={styles.errorpageErrorButton}
                onPress={() => {
                  this.setState({ showModal: false })
                  goBack()
                }}
                title={"Exit"}
              />
            </View>
        </View>
      </Modal>
    )
    
  }
}