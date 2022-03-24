import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Modal, Text, TouchableHighlight, View, Alert, ActivityIndicator, TextInput, Keyboard, KeyboardAvoidingView, Dimensions, Picker, Platform} from 'react-native';
import deviceLog from 'react-native-device-log'
import SubmitButton from '../../../../_shared/src/atoms/SubmitButton/SubmitButton'
import Avatar from '../../../../_shared/src/atoms/Avatar/Avatar'
import CharacterCounter from '../../../../_shared/src/atoms/CharacterCounter/CharacterCounter'
import DropdownList from '../DropdownList/DropdownList'
import OnDemandSubmitButton from '../../atoms/OnDemandButton/OnDemandSubmitButton'
import { SynziColor, AppColor } from '../../../../_shared/Color'
import Reactotron from 'reactotron-react-native'

import styles from './styles'

const { height: fullHeight } = Dimensions.get('window')

export default class OnDemandMessage extends Component {
  static propTypes = {
    /** displayName of user who will receive the message */
    displayName: PropTypes.string.isRequired,
    /** function called to send the message */
    onSend: PropTypes.func.isRequired,
    /** flag that dictates whether OnDemand mutation is running */
    loading: PropTypes.bool,
    /** An array of template objects */
    /** A list of templates that can be used for populating messages */
    templates: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        mttranslations: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            language: PropTypes.shape({
              id: PropTypes.string.isRequired,
              code: PropTypes.string.isRequired,
              name: PropTypes.string.isRequired,
            }).isRequired,
          }).isRequired
        ).isRequired,
      }).isRequired
    ),
    /** Can use predfined message text */
    messageText: PropTypes.string,
    /** Called to retrieve a templates message text */
    onGetMessageText: PropTypes.func.isRequired,
  }
  static defaultProps = {
    messageText: '',
    loading: false,
  }
  
  onLayout = ({
    nativeEvent: { layout: { height } },
  }) => {
    const offset = fullHeight - height;
    this.setState({ offset });
  }

  constructor(props) {
    super(props)
    this.state = {
      message: '',
      offset: 0,
      errorMessage: '',
      templateId: '-1',
      translationId: '',
      hasError: false,
      languageLookup: [],
      disableLanguage: true,
    }

    this.handleTemplateChange = this.handleTemplateChange.bind(this)
    this.handleLanguageChange = this.handleLanguageChange.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.messageText !== '' &&
      this.props.messageText !== prevProps.messageText
    ) {

      Reactotron.log(`CDU updated state.message='${this.props.messageText}`)
      deviceLog.log(`CDU updated state.message='${this.props.messageText}`)

      this.setState({ message: this.props.messageText })
    }
  }

  handleSend = () => {
    this.props.onSend(this.state.message)
    Keyboard.dismiss()
  }

  handleTemplateChange(value) {
    Reactotron.log(`template changed to id: ${value}`)
    deviceLog.log(`template changed to id: ${value}`)

    const defaultTranslationId = this.getDefaultTemplateLanguage(value)

    //this.setState({ templateId: value, message: '' })
    this.setState({ templateId: value })
    this.updateLanguages(value, defaultTranslationId)

    this.props.onGetMessageText(defaultTranslationId)

    if (value === '-1') {
      this.setState({ message: '' })
    }
  }

  handleLanguageChange(value) {
    Reactotron.log(`language changed to translationId: ${value}`)
    deviceLog.log(`language changed to translationId: ${value}`)

    Reactotron.log(`calling props.onGetMessageText: ${value}`)
    deviceLog.log(`calling props.onGetMessageText: ${value}`)

    this.setState({ translationId: value })

    if(value === null) {
      this.setState({ message: '' })
    }

    this.props.onGetMessageText(value)
  }

  updateLanguages = (templateId, defaultTranslationId) => {
    Reactotron.log(`updating languages to match templateId: ${templateId}`)
    deviceLog.log(`updating languages to match templateId: ${templateId}`)

    if (templateId === '-1') {
      this.setState({
        translationId: '',
        languageLookup: [],
        disableLanguage: true,
      })
      return
    }

    // find the chosen template
    const template = this.props.templates.filter(
      template => template.id === templateId
    )

    // Update list of language options
    let languageLookup = []
    template[0].mttranslations.forEach(translation => {
      if (translation.publishedMTT) {
        languageLookup.push({
          label: translation.language.name,
          key: translation.language.id,
          value: translation.id
        })
      }
    })

    this.setState({
      languageLookup,
      translationId: defaultTranslationId,
      disableLanguage: false,
    })
  }

  getDefaultTemplateLanguage = templateId => {
    // Get the default translation for a provided template

    // only if it is a real template
    if (templateId !== '-1') {
      const template = this.props.templates.filter(
        template => template.id === templateId
      )

      return template[0].defaultMTTranslation.id
    }

    return '-1'
  }

  render() {
    const { displayName, loading, templates } = this.props
    const {
      offset,
      templateId,
      translationId,
      message,
      languageLookup,
      errorMessage,
      hasError,
      disableLanguage,
    } = this.state

    if(hasError) {
      return <ErrorPage error={errorMessage} goBack={() => goBack()} />
    }

    const templateOptions = templates.map(template => {
      return {
        label: template.name,
        key: template.id,
        value: template.id
      }
    })
    // Add a 'no template' option
    templateOptions.unshift({
      label: 'Custom',
      key: '-1',
      value: '-1'
    })

    return (
      <View style={styles.ondemandmessageWrap} onLayout={this.onLayout}>
        
          <DropdownList
            label="Template"
            items={templateOptions}
            value={templateId}
            onValueChange={this.handleTemplateChange}
          />

          {!disableLanguage &&
            <DropdownList
              label="Language"
              items={languageLookup}
              value={translationId}
              disabled={disableLanguage}
              onValueChange={this.handleLanguageChange}
            />
          }

          <Text style={styles.ondemandmessagePhi}>
              <Text style={{ fontWeight: 'bold' }}>Reminder:</Text> This is sent over insecure channels. Do not include
              PHI!
          </Text>

          <KeyboardAvoidingView 
            style={styles.outerContainer} 
            behavior="position" 
            keyboardVerticalOffset={offset}
          >
            <View style={styles.ondemandmessageMessageWrapper}>
              <TextInput
                underlineColorAndroid="transparent"
                returnKeyType="send"
                keyboardType="default"
                placeholder={(!message || message === ' ' || disableLanguage) ? 'Type a new message' : null}
                onChangeText={message => this.setState({ message })}
                style={styles.ondemandmessageInput}
                multiline = {true}
                textAlignVertical={'top'}
                blurOnSubmit={true}
                onSubmitEditing={() => this.handleSend(message)}
                value={(!message || message === ' ' || disableLanguage) ? null : message}
                enablesReturnKeyAutomatically={true}
              />
            </View>
          </KeyboardAvoidingView>

          <View style={styles.ondemandmessageInfoRow}>
            <CharacterCounter
              text={message}
              maxLength={430}
            />
          </View>
    
          <OnDemandSubmitButton 
            onPress={this.handleSend}
            style={{ marginLeft: 'auto', paddingBottom: 10, paddingRight: 20 }}
            disabled={message === '' || loading}
          />
         
      </View>
    )
   
  }
}
