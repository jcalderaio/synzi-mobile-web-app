import React, { Component } from 'react'
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native'
import DismissKeyboard from 'dismissKeyboard'
import PropTypes from 'prop-types'

import AuthUtils from '../../../../_shared/helpers/AuthUtils'
import Icon from 'react-native-vector-icons/FontAwesome';
import SubmitButton from '../../atoms/SubmitButton/SubmitButton'

import styles from './styles'

export default class MessageTyper extends Component {
  static propTypes = {
    /** Called when the message is sent */
    onSend: PropTypes.func.isRequired,
    /** RecipientName */
    recipientId: PropTypes.string.isRequired,
    /** Style for the wrapper */
    style: PropTypes.object,
  }
  static defaultProps = {
    style: {},
  }
  constructor(props) {
    super(props)
    this.state = {
      message: '',
    }
  }

  // Pulls the draft for the thread and shows in TextInput
  async componentDidMount() {
    // Retrieve draft from AsyncStorage
    let message = await AuthUtils.getDraft(this.props.recipientId)
    // If message Not Null, set to message in state
    if(message !== null) {
      this.setState({ message })
    }
  }

  handleSend = recipientId => {
    if(this.state.message === '') {
      alert("Please enter a message")
      return 
    }
    // Get rid of extra blank lines in the message
    let message = this.state.message.replace(/(\r\n|\n|\r)/gm,"")
    // Clear the message in state
    this.setState({ message: '' })
    // Set draft to blank
    AuthUtils.setDraft(recipientId, '')
    // Send message
    this.props.onSend(message)
    // Close the keyboard
    DismissKeyboard()
    //this.props.refetch()
  }

  handleChangeText = (recipientId, message) => {
    // Get rid of extra blank lines in the message
    message = message.replace(/(\r\n|\n|\r)/gm,"")
    // Set message (as user types) to message in state
    this.setState({ message })
    // Sets the message as a draft
    AuthUtils.setDraft(recipientId, message)
  }

  render() {
    const { style, recipientId } = this.props
    const { message } = this.state

    return (
      <View style={style}>
        <View style={styles.messagetyper}>
          <TextInput
            underlineColorAndroid="transparent"
            keyboardType="default"
            returnKeyType="send"
            placeholder="Type a new message"
            onChangeText={message => this.handleChangeText(recipientId, message)}
            multiline = {true}
            style={styles.messagetyperInput}
            value={message}
            blurOnSubmit={true}
            onSubmitEditing={() => this.handleSend(recipientId)}
            enablesReturnKeyAutomatically={true}
          />
          <View 
            style={styles.submitButtonWrapperStyle}
          >
            <SubmitButton 
              size={25}
              onPress={() => this.handleSend(recipientId)}
            />
          </View>
        </View>
      </View>
    )
  }
}