import React, { Component, Fragment } from 'react'
import { 
    View,
    Image,
    Text,
    FlatList,
    Alert,
    ActivityIndicator,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    Keyboard
} from 'react-native';
import { AppColor, SynziColor} from '../../../../_shared/Color';
import { Button } from 'react-native-elements'
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'
import TopBarView from '../../organisms/TopBarView/TopBarView'
import BreadcrumbView from '../../organisms/BreadcrumbView/BreadcrumbView'
import InputTextFormView from '../../atoms/InputTextFormView/InputTextFormView'
import PatientsQL from '../../../../_shared/graphql/PatientsQL'
import { Mutation } from 'react-apollo'
import AddPatientModalLanguageList from '../AddPatientModalLanguageList/AddPatientModalLanguageList'
import PatientAvatarView from '../../atoms/PatientAvatarView/PatientAvatarView'
import OnDemandButton from '../../atoms/OnDemandButton/OnDemandButton'
import UserCallButton from '../../atoms/UserCallButton/UserCallButton'
import MessageButton from '../../../../_shared/src/atoms/MessageButton/MessageButton'
import ResendPatientInviteButton from '../../atoms/ResendPatientInviteButton/ResendPatientInviteButton'

// Programs
import PatientProgramsContainer from '../../organisms/PatientPrograms/PatientProgramsContainer'
import ProgramsHeader from '../../organisms/ProgramsHeader/ProgramsHeader'
import ProgramButton from '../../atoms/ProgramButton/ProgramButton'

// Assignments
import AssignmentsHeader from '../../organisms/AssignmentsHeader/AssignmentsHeader'
import PatientCareTeamsContainer from '../../organisms/PatientCareTeamAssignments/PatientCareTeamsContainer'
import AssignmentButton from '../../atoms/AssignmentButton/AssignmentButton'

// Caregivers
import CaregiverHeader from '../../organisms/CaregiverHeader/CaregiverHeader'
import AssociatedCaregiversList from '../../organisms/AssociatedCaregiversList/AssociatedCaregiversList.js'

// OnDemand Messages
import OnDemandContainer from '../../organisms/OnDemandMessages/OnDemandContainer'

import { withNavigation } from 'react-navigation';

import Reactotron from 'reactotron-react-native'

//Styles
import styles from './styles'

class AddPatientDetailView extends Component {

    constructor(props) {
        super(props)

        this.displayName = ''


        let displayName = null
        let identifier = null
        let overallStatus = null
        let patientObject = null
        let languageObject = null
        let profileImage = null
        let email = null
        let phone = null
        let dob = null
        let zipCode = null
        let last4Social = null
        let idValue = null
        let contactType = null
        let messageTypeIndex = 2
        let messageTypeString = 'BOTH'

        if(this.props.patientData){

            let user = this.props.patientData['user']
            displayName = user['displayName'] ? user['displayName'] : 'unknown'
            this.displayName = displayName
            email = user['email'] ? user['email'] : ''
            phone = user['phone'] ? user['phone'] : ''
            
            let patient = user['patient']
            profileImage = user['profileImage'] ? user['profileImage'] : ''
            overallStatus = user['overallStatus'] ? user['overallStatus'] : 'disconnected'

            
            if(patient !== undefined){
                let dateOfBirth = (patient['dateOfBirth'] !== null) ? patient['dateOfBirth'] : ''
                contactType = patient['contactType'] ? patient['contactType'] : ''
                languageObject =  patient['language'] ? patient['language'] : null
                identifier = patient['identifier'] ? patient['identifier'] : ''
                zipCode = patient['zipCode'] ? patient['zipCode'] : ''
                last4Social = patient['ssnLast4'] ? patient['ssnLast4'] : ''
                idValue = patient['id'] ? patient['id'] : ''

                let dobArray = dateOfBirth.split("-");
                let year = dobArray[0]
                let month = dobArray[1]
                let day = dobArray[2]
                dob = `${month}/${day}/${year}`

                if(contactType === 'EMAIL'){
                    messageTypeIndex = 0
                    messageTypeString = 'EMAIL'
                }else if(contactType === 'SMS'){
                    messageTypeIndex = 1
                    messageTypeString = 'SMS'
                }else if(contactType === 'BOTH'){
                    messageTypeIndex = 2
                    messageTypeString = 'BOTH'
                }

            }

            patientObject = {
                id: this.props.patientId,
                displayName: displayName,
                profileImage: profileImage
            }

        }

       
        let languages = this.props.languages ? this.props.languages : this.props.navigation.getParam('languages')
        let defaultLanguage = null
        if(languageObject && this.props.patientData){
            defaultLanguage = languageObject
        }else{
            defaultLanguage = this.props.defaultLanguage ? this.props.defaultLanguage : this.props.navigation.getParam('defaultLanguage')
        }

        let defaultLanguageName = defaultLanguage['name']

        this.cancelHandler = this.cancelHandler.bind(this)
        this.successHandler = this.successHandler.bind(this)
        this.segmentedControlHandler = this.segmentedControlHandler.bind(this)
        this.onChangeTextHandler = this.onChangeTextHandler.bind(this)
        this.onChangeDate = this.onChangeDate.bind(this)
        this.languageListHandler = this.languageListHandler.bind(this)
        this.languageModalDismissHandler = this.languageModalDismissHandler.bind(this)
        this.languageSelectedHandler = this.languageSelectedHandler.bind(this)
        this.showCallPatientAlert = this.showCallPatientAlert.bind(this)

        const isNewPatientForm = (this.props.patientId === undefined) ? true : false

        this.state = {
            idValue:idValue,
            editing:false,
            onDemandPatient: true,
            profileImage:profileImage,
            profileImageCaregiver: '',
            identifier:identifier,
            displayName:displayName,
            displayNameCaregiver: '',
            overallStatus:overallStatus,
            patientObject:patientObject,
            newPatientForm:isNewPatientForm,
            showLanguageListModal:false,
            showProgramsListModal:false,
            showAssignmentsListModal: false,
            showOnDemandMessage: false,
            formValid:false,
            recipientId: this.props.recipientId,
            recipientIdCaregiver: '',
            refresh:false,
            languages:languages,
            currentSelectedLanguage:defaultLanguage,
            formData:[
                { 
                    isNewPatientForm:isNewPatientForm,
                    labelText:'IDENTIFIER',
                    warningText:'Please enter an identifier',
                    required:true,
                    formSatisfied:identifier ? true : false,
                    keyboardType:'default',
                    onChangeText:this.onChangeTextHandler,
                    textValue:identifier ? identifier : '',
                    regEx:/^[a-zA-Z0-9-+',_()[\] ]{3,50}$/
                },
                { 
                    isNewPatientForm:isNewPatientForm,
                    labelText:'DISPLAY NAME',
                    warningText:'Please enter a display name',
                    required:true,
                    formSatisfied:displayName ? true : false,
                    keyboardType:'default',
                    onChangeText:this.onChangeTextHandler,
                    textValue:displayName ? displayName : '',
                    regEx:/^/
                },
                { 
                    isNewPatientForm:isNewPatientForm,
                    labelText:'DATE OF BIRTH',
                    warningText:'Please enter a date of birth',
                    required:true,
                    formSatisfied:dob ? dob : '',
                    keyboardType:'default',
                    isDateInput:true,
                    placeHolderText:'MM/DD/YYYY',
                    onDateChange:this.onChangeDate,
                    textValue:dob ? dob : '',
                    regEx:/^((0?[13578]|10|12)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[01]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1}))|(0?[2469]|11)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[0]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1})))$/
                },
                { 
                    isNewPatientForm:isNewPatientForm,
                    labelText:'LAST 4 DIGITS OF SSN',
                    warningText:'Please enter the last 4 digits of you SSN',
                    required:false,
                    formSatisfied:true,
                    keyboardType:'numeric',
                    onChangeText:this.onChangeTextHandler,
                    textValue:last4Social ? last4Social : '',
                    regEx:/^\d{4}(?:[-\s]\d{4})?$/
                },
                { 
                    isNewPatientForm:isNewPatientForm,
                    labelText:'ZIP CODE',
                    warningText:'Please enter a zipcode',
                    required:false,
                    formSatisfied:true,
                    keyboardType:'numeric',
                    onChangeText:this.onChangeTextHandler,
                    textValue:zipCode ? zipCode : '',
                    regEx:/^\d{5}(?:[-\s]\d{4})?$/
                },
                { 
                    isNewPatientForm:isNewPatientForm,
                    labelText:'MESSAGE TYPE',
                    warningText:'',
                    required:false,
                    formSatisfied:true,
                    isSegmentedControl:true,
                    selectedIndex:messageTypeIndex,
                    segmentedControlHandler:this.segmentedControlHandler,
                    segmentValues:['EMAIL', 'SMS', 'BOTH'],
                    textValue:messageTypeString
                },
                { 
                    isNewPatientForm:isNewPatientForm,
                    labelText:'EMAIL',
                    warningText:'You must provide an email address',
                    required:true,
                    formSatisfied:(email || messageTypeString === 'SMS')  ? true : false,
                    keyboardType:'default',
                    onChangeText:this.onChangeTextHandler,
                    textValue:email ? email : '',
                    regEx:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
                },
                { 
                    isNewPatientForm:isNewPatientForm,
                    labelText:'PHONE',
                    warningText:'You must provide a phone number for SMS messages',
                    required:true,
                    formSatisfied:(phone || messageTypeString === 'EMAIL') ? true : false,
                    keyboardType:'numeric',
                    onChangeText:this.onChangeTextHandler,
                    textValue:phone ? phone : '',
                    regEx:/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
                },
                { 
                    isNewPatientForm:isNewPatientForm,
                    labelText:'LANGUAGE',
                    warningText:'You must provide a phone number for SMS messages',
                    keyboardType:'default',
                    required:false,
                    formSatisfied:true,
                    textValue:defaultLanguageName,
                    languageListHandler:this.languageListHandler
                },
                /*
                { 
                    labelText:'SPACER1',
                    isSpacer:true,
                },
                { 
                    labelText:'SPACER2',
                    isSpacer:true,
                },
                { 
                    labelText:'SPACER3',
                    isSpacer:true,
                },
                { 
                    labelText:'SPACER4',
                    isSpacer:true,
                },
                { 
                    labelText:'SPACER5',
                    isSpacer:true,
                },
                { 
                    labelText:'SPACER6',
                    isSpacer:true,
                }
                */

            ]

        };
       
    }

    _renderItem = ({item, separators}) => {

        const { editing } = this.state

        if(editing || item.textValue) {
            return (
                <InputTextFormView
                    labelText={item.labelText}
                    warningText={item.warningText}
                    placeHolderText={item.placeHolderText}
                    required={item.required}
                    isDateInput={item.isDateInput}
                    keyboardType={item.keyboardType}
                    isSegmentedControl={item.isSegmentedControl}
                    selectedIndex={item.selectedIndex}
                    segmentedControlHandler={item.segmentedControlHandler}
                    segmentValues={item.segmentValues}
                    onChangeText={item.onChangeText}
                    textValue={item.textValue}
                    isSpacer={item.isSpacer}
                    onChangeDate={this.onChangeDate}
                    languageListHandler={item.languageListHandler}
                    formSatisfied={item.formSatisfied}
                    regEx={item.regEx}
                    isNewPatientForm={item.isNewPatientForm}
                    editing={this.state.editing}
                />
            )
        } else if(item.isNewPatientForm) {
            return (
                <InputTextFormView
                    labelText={item.labelText}
                    warningText={item.warningText}
                    placeHolderText={item.placeHolderText}
                    required={item.required}
                    isDateInput={item.isDateInput}
                    keyboardType={item.keyboardType}
                    isSegmentedControl={item.isSegmentedControl}
                    selectedIndex={item.selectedIndex}
                    segmentedControlHandler={item.segmentedControlHandler}
                    segmentValues={item.segmentValues}
                    onChangeText={item.onChangeText}
                    textValue={item.textValue}
                    isSpacer={item.isSpacer}
                    onChangeDate={this.onChangeDate}
                    languageListHandler={item.languageListHandler}
                    formSatisfied={item.formSatisfied}
                    regEx={item.regEx}
                    isNewPatientForm={item.isNewPatientForm}
                    editing={this.state.editing}
                />
            )
        }
    }

    renderSeparator = () => {
        return (
            null
        )
    }

    callUser(user, patientUserId){
        //global.PATIENT_ID = this.props.realPatientId

        if(allowSidebar){
            const { screenProps } = this.props
            screenProps.makeCall(user, patientUserId, this.props.realPatientId)
        }else{
            const { makeCall } = this.props
            makeCall(user, patientUserId, this.props.realPatientId)

        }
    }

    showCallPatientAlert(user, patientUserId = null){
        Alert.alert(
            'Call',
            `Are you sure you want to call\n${user['displayName']}?`,
            [
                { text: 'Cancel', onPress: () => null },
                { text: 'Yes', onPress: () => this.callUser(user, patientUserId) }
            ],
            { cancelable: false }
        )
    }

    successHandler(){

        if(allowSidebar){

            const { cancelAddNewPatientHandler } = this.props
            cancelAddNewPatientHandler()

        }else{
            this.cancelHandler()
        }
        
    }


    cancelHandler(){
        this.props.goBack()
    }
    
    handleError(error) {
        if(error.message.includes('Patient exists for identifier')) {
            Alert.alert(
                'Error',
                `Patient already exists with that identifier. Please choose a different identifier.`,
                [
                    { text: 'Ok', onPress: () => null },
                ],
                { cancelable: false }
            )
        }
        else {
            Alert.alert(
                'Error',
                `${error}?`,
                [
                    { text: 'Ok', onPress: () => null },
                ],
                { cancelable: false }
            )
        }
    }

    languageListHandler(){
        this.setState({ showLanguageListModal: true })
    }

    languageModalDismissHandler(){
        this.setState({ showLanguageListModal: false })
    }

    languageSelectedHandler(language){

        const { formData, refresh } = this.state
        
        var index = formData.map(function (obj) { 
            return obj.labelText; 
        }).indexOf('LANGUAGE');

        const items = formData;
        items[index].textValue = language['name']

        this.setState({ 
            showLanguageListModal: false,
            currentSelectedLanguage: language,
            refresh: !refresh,
            formData
        })
    }


    segmentedControlHandler(segment){

        const { formData, refresh } = this.state

        //Get the index of the form element
        var index = formData.map(function (obj) { 
            return obj.labelText; 
        }).indexOf('MESSAGE TYPE');

        //Update the selected index
        const items = formData;
        items[index].selectedIndex = segment
        

        //Get the segment values from the segmented control form
        let segmentValue = items[index].segmentValues[segment]
        items[index].textValue = segmentValue

        var emailRequired = false
        var phoneRequired = false

        switch(segmentValue) {
            case 'EMAIL':
                emailRequired = true
                phoneRequired =  false
                break;
            case 'SMS':
                emailRequired = false
                phoneRequired =  true
                break;
            case 'BOTH':
                emailRequired = true
                phoneRequired =  true
                break;
            default:
        }

        //Get the index of the email form
        var emailIndex = formData.map(function (obj) { 
            return obj.labelText; 
        }).indexOf('EMAIL');

        //Get the index of the phone form
        var phoneIndex = formData.map(function (obj) { 
            return obj.labelText; 
        }).indexOf('PHONE');

        //Set the values for isRequired
        items[emailIndex].required = emailRequired
        items[phoneIndex].required = phoneRequired
        
        //Update state
        this.setState({
            formValid:this.validForm(),
            refresh:!refresh,
            formData,
        });
        
    }


    onChangeTextHandler(element, text){

        const { formData, refresh } = this.state

        //Get the index of the form element
        var index = formData.map(function (obj) { 
            return obj.labelText; 
        }).indexOf(element);

        //Update the text
        const items = formData;
        items[index].textValue = text

   
        items[index].formSatisfied = this.formSatisfied(items[index].textValue, items[index].regEx)
        
        
        if(items[index].isRequired === false && items[index].textValue.length === 0){
            items[index].formSatisfied = true
        }

        //Update state
        this.setState({
            formValid:this.validForm(),
            refresh:!refresh,
            formData,
        });

    }

    formSatisfied(value, regEx){

        if(value.length > 0){
            if(regEx.test(value)){
                return true
            }else{
                return false
            }
        }
        return false
    }


    onChangeDate(date){
        
        const { formData, refresh } = this.state

        //Get the index of the form element
        var index = formData.map(function (obj) { 
            return obj.labelText; 
        }).indexOf('DATE OF BIRTH');


        //Update the date
        const items = formData;
        items[index].textValue = date

        if(items[index].required){
            items[index].formSatisfied = this.formSatisfied(items[index].textValue, items[index].regEx)
        }

        //Update state
        this.setState({
            formValid:this.validForm(),
            refresh:!refresh,
            formData,
        });

    }



    validForm(){

        const { formData } = this.state

        for (let item of formData) {
            if(item.required && !item.formSatisfied){
                return false
            }
        }

        return true
    }


    returnFormText(formName){

        const { formData } = this.state

        for (let item of formData) {
            if(item.labelText === formName){
                if(item.textValue !== '' && item.textValue !== undefined){
                    return item.textValue
                }
            }
        }

        return ''
    }



    returnFormPayload(enterpriseId){

        const { currentSelectedLanguage, editing, idValue } = this.state

        let identifier = this.returnFormText('IDENTIFIER')
        let displayName = this.returnFormText('DISPLAY NAME')
        let dateOfBirth = this.returnFormText('DATE OF BIRTH')
        let ssnNumber = this.returnFormText('LAST 4 DIGITS OF SSN')
        let zipCode = this.returnFormText('ZIP CODE')
        let contactType = this.returnFormText('MESSAGE TYPE')
        let email = this.returnFormText('EMAIL')
        let phone = this.returnFormText('PHONE')
        let language = currentSelectedLanguage['code']
        let userName = `${identifier}${Math.floor(Math.random() * 1000000)}`

        let object = null

        if(editing){

            //Convert back to server formatting
            let dobArray = dateOfBirth.split("/");
            let year = dobArray[2]
            let month = dobArray[0]
            let day = dobArray[1]
            let dob = `${year}-${month}-${day}`

            object = {
                variables: { 
                    patientID: idValue,
                    username: userName,
                    identifier: identifier,
                    dateOfBirth: dob,
                    displayName: displayName,
                    zipCode: zipCode,
                    enterpriseId: enterpriseId,
                    ssnLast4: ssnNumber,
                    contactType: contactType,
                    email: email,
                    phone: phone,
                    language: language,
                }

            }

        }else{

            object = {
                variables: { 
                    username: userName,
                    password: 'HasNotBeenSet2018#',
                    identifier: identifier,
                    dateOfBirth: dateOfBirth,
                    displayName: displayName,
                    zipCode: zipCode,
                    enterpriseId: enterpriseId,
                    ssnLast4: ssnNumber,
                    contactType: contactType,
                    email: email,
                    phone: phone,
                    language: language,
                }
            }
        }


        Reactotron.log('userName: ' + userName)
        Reactotron.log('password: ' + 'HasNotBeenSet2018#')
        Reactotron.log('identifier: ' + identifier)
        Reactotron.log('dateOfBirth: ' + dateOfBirth)
        Reactotron.log('displayName: ' + displayName)
        Reactotron.log('ssnNumber: ' + ssnNumber)
        Reactotron.log('zipCode: ' + zipCode)
        Reactotron.log('contactType: ' + contactType)
        Reactotron.log('email: ' + email)
        Reactotron.log('phone: ' + phone)
        Reactotron.log('language: ' + language)

        return object

    }
    


    renderHeaderView(){

        const { 
            newPatientForm, 
            displayName,
            displayNameCaregiver, 
            identifier,
            patientObject,
            profileImage,
            profileImageCaregiver,
            showOnDemandMessage,
            onDemandPatient
         } = this.state

        const { messagesEnabled, onDemandmessagesEnabled, userId, patientId, userName, overallStatus } = this.props

        // Grab the logged in user's displayName from react navigation's parameters
        let loggedInDisplayName = ''

        if(!allowSidebar) {
            loggedInDisplayName = this.props.navigation.getParam('loggedInDisplayName', '')
        }
        else {
            loggedInDisplayName = userName
        }

        //this.state.profileImage

        let buttonCount = 1
        let buttonSize = 55
        let paddingRight = 20

        if(onDemandmessagesEnabled) ++buttonCount
        if(messagesEnabled) ++buttonCount

        if(buttonCount == 2) {
            buttonSize = 50
            paddingRight = 10
        }
        else if(buttonCount === 3) {
            buttonSize = 45
            paddingRight = 10
        }

        if(showOnDemandMessage) {
            return(
                <View>
                    <View style={styles.onDemandHeaderContainerStyle}>
                            <View style={styles.onDemandAvatarContainerStyle}>
                                <PatientAvatarView
                                    profileImage={onDemandPatient ? profileImage : profileImageCaregiver}
                                    width={45}
                                    height={45}
                                />
                            </View>
                            <View style={styles.onDemandTextContainerStyle}>
                                <Text style={styles.onDemandTextStyle}>Send a one-time message to {onDemandPatient ? displayName : displayNameCaregiver}</Text>
                            </View>
                        </View>
                    <View style={styles.patientSeparatorStyle}></View>
                </View>
            )
        }

        return(
            <View>
                {!newPatientForm &&
                    <View style={styles.patientDataHeaderContainerStyle}>
                        <View style={styles.patientAvatarContainerStyle}>
                            <PatientAvatarView
                                profileImage={profileImage}
                                width={75}
                                height={75}
                            />
                        </View>
                        <View style={styles.patientNameContainerStyle}>
                            <Text style={styles.patientNameTextStyle}>{displayName}</Text>
                            <View style={styles.patientTagContainerViewStyle}>
                                <Text style={styles.patientBlueTextStyle}>{identifier}</Text>
                            </View>
                        </View>
                        <View style={styles.patientCallButtonContainerStyle}>
                            {onDemandmessagesEnabled &&
                                <View style={{paddingRight: paddingRight}}>
                                    <OnDemandButton
                                        size={buttonSize}
                                        onPress={() => this.setState({ onDemandPatient: true, showOnDemandMessage: true })}
                                    />
                                </View>
                            }
                            <View style={{paddingRight: paddingRight}}>
                                <UserCallButton
                                    size={buttonSize}
                                    overAllStatus={overallStatus}
                                    isActive={true}
                                    onPress={() => this.showCallPatientAlert(patientObject)}
                                />
                            </View>
                            {messagesEnabled && 
                                <View style={{paddingRight: paddingRight}}>
                                    <MessageButton 
                                        size={buttonSize}
                                        isActive={true}
                                        onPress={() => {
                                            this.props.navigation.navigate('VCSecureMessageDetail', { 
                                                userId: userId,
                                                recipientId: patientId,
                                                profileImage: this.props.profileImage,
                                                userName: loggedInDisplayName
                                            })
                                        }}
                                    />
                                </View>
                            }
                        </View>
                    </View>
                }
                {this.renderEditBar()}
                <View style={styles.patientSeparatorStyle}></View>
            </View>
        )
    }

    renderEditBar(){

        const { editing, newPatientForm, idValue, refresh } = this.state

        return(
            <View style={{
                marginTop: newPatientForm ? 20 : 0,
                paddingBottom:10,
                marginLeft:10,
                flexDirection:'row',
                justifyContent:'flex-start'
            }}>
                <Image
                    style={{
                        width:25,
                        height:19,
                        marginRight:15
                    }}
                    resizeMode={'contain'}
                    source={require('../../../../_shared/images/icons/Personal-Info-Icon.png')}
                />
                <Text style={styles.patientBlueTextStyle}>{newPatientForm ? 'New Patient Personal Info' : 'Personal Info'}</Text>
                {(!editing && !newPatientForm) && 
                <View style={{
                    flex:1,
                    flexDirection:'row',
                    justifyContent:'flex-end',
                    marginRight:10
                    }}>
                    <ResendPatientInviteButton
                        patientId={idValue}
                    />
                    <TouchableOpacity onPress={() => this.setState({ editing:true, formValid:this.validForm(), refresh:!refresh })}>
                        <Image
                            style={{
                                width:50,
                                height:25,
                            }}
                            resizeMode={'contain'}
                            source={require('../../../../_shared/images/icons/Edit-Info-Icon.png')}
                        />
                    </TouchableOpacity>
                </View>}
            </View>
        )
    }


    renderButtonGroup(enterpriseId, createPatient, updatePatient){

        const { formValid, editing } = this.state
        
        if(allowSidebar){

            const { cancelAddNewPatientHandler } = this.props

            return(
                <View style={styles.buttonGroupStyle}>
                    <View style={styles.buttonContainerStyle}>
                        <Button
                            onPress={() => cancelAddNewPatientHandler()}
                            buttonStyle={styles.cancelButton.buttonStyle}
                            titleStyle={styles.cancelButton.titleStyle}
                            title="Cancel"
                            type="outline"
                        />
                    </View>
                    <View style={styles.buttonContainerStyle}>
                        <Button
                            onPress={() => editing ? updatePatient(this.returnFormPayload(enterpriseId)) : createPatient(this.returnFormPayload(enterpriseId))}
                            disabled={!formValid}
                            disabledStyle={styles.createButton.disabledStyle}
                            disabledTitleStyle={styles.createButton.disabledTitleStyle}
                            buttonStyle={styles.createButton.buttonStyle}
                            titleStyle={styles.createButton.titleStyle}
                            color={SynziColor.SYNZI_BLUE}
                            title="Save"
                        />
                    </View>
                </View>
            )

        }else{

            return(
                <View style={styles.buttonGroupStyle}>
                    <View style={styles.buttonContainerStyle}>
                        <Button
                            onPress={this.cancelHandler}
                            buttonStyle={styles.cancelButton.buttonStyle}
                            titleStyle={styles.cancelButton.titleStyle}
                            title="Cancel"
                            type="outline"
                        />
                    </View>
                    <View style={styles.buttonContainerStyle}>
                        <Button
                            onPress={() => editing ? updatePatient(this.returnFormPayload(enterpriseId)) : createPatient(this.returnFormPayload(enterpriseId))}
                            disabled={!formValid}
                            disabledStyle={styles.createButton.disabledStyle}
                            disabledTitleStyle={styles.createButton.disabledTitleStyle}
                            buttonStyle={styles.createButton.buttonStyle}
                            titleStyle={styles.createButton.titleStyle}
                            color={SynziColor.SYNZI_BLUE}
                            title="Save"
                        />
                    </View>
                </View>
            )

        }
        
    }

    renderForm(){
        const { formData, refresh, editing, newPatientForm, displayName, showProgramsListModal, showAssignmentsListModal, recipientId, patientObject } = this.state
        const { userName, userId, profileImage, enterpriseId, realPatientId, currentlyEnrolledPrograms, currentAssignments, possibleAssignments, messagesEnabled, onDemandmessagesEnabled, currentlyAssignedCaregivers } = this.props

        // GraphQL
        const REMOVE_PROGRAM_MUTATION = PatientsQL.disenrollPatient()
        const REMOVE_CARE_TEAM_MUTATION = PatientsQL.removeCareTeam()

        return(
            <ScrollView style={{ flex: 1 }}>
                <PatientProgramsContainer 
                    displayName={displayName}
                    currentlyEnrolledPrograms={currentlyEnrolledPrograms}
                    patientId={realPatientId}
                    showProgramsListModal={showProgramsListModal}
                    dismissHandler={() => this.setState({ showProgramsListModal: false })}
                    enterpriseId={enterpriseId}
                />
                <PatientCareTeamsContainer 
                    //possibleAssignments={possibleAssignments}
                    displayName={displayName}
                    showAssignmentsListModal={showAssignmentsListModal}
                    enterpriseId={enterpriseId}
                    patientId={realPatientId}
                    userId={recipientId}
                    currentAssignments={currentAssignments}
                    dismissHandler={() => this.setState({ showAssignmentsListModal: false })}
                />
                <FlatList
                    extraData={refresh}
                    data={formData}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={this.renderSeparator}
                    keyExtractor={item => item.labelText}
                />
                {(!editing && !newPatientForm) &&
                    <View style={{ paddingTop: 20, paddingBottom: 120, paddingLeft: 10, flex: 1 }}>
                        {/** PROGRAMS */}
                        <View style={{paddingBottom: 30}}>
                            <ProgramsHeader 
                                showProgramsModal={() => this.setState({ showProgramsListModal: true })}
                            />
                            <View style={styles.patientSeparatorStyle}></View>
                            {(currentlyEnrolledPrograms) &&
                                <Mutation mutation={REMOVE_PROGRAM_MUTATION}>
                                    {(removeProgram, { error }) => {
                                        if (error) return null
                                        
                                        return (
                                            <View style={{ paddingTop: 15 }}>
                                                {currentlyEnrolledPrograms.map(item => {
                                                    let variables = {
                                                        enrollmentId: item.id
                                                    }

                                                    return (
                                                        <ProgramButton
                                                            displayName={displayName}
                                                            key={item.id}
                                                            isActive={item.program.isActive}
                                                            programText={item.program.name}
                                                            onRemoveProgram={() => removeProgram({ variables })}
                                                        />
                                                    )
                                                })}
                                            </View>
                                        ) 
                                        
                                    }}
                                </Mutation>
                            }
                        </View>
                        {/** ASSIGNMENTS */}
                        <View style={{paddingBottom: 30}}>
                            <AssignmentsHeader 
                                showAssignmentsModal={() => this.setState({ showAssignmentsListModal: true })}
                            />
                            <View style={styles.patientSeparatorStyle}></View>
                            {(currentAssignments) &&
                                <Mutation mutation={REMOVE_CARE_TEAM_MUTATION}>
                                    {(removeCareTeam, { error }) => {
                                        if (error) return null
                                        
                                        return (
                                            <View style={{ paddingTop: 15 }}>
                                                {currentAssignments.map(item => {
                                                    let variables = {
                                                        userId: recipientId,
                                                        assignmentId: item.id,
                                                    }

                                                    return (
                                                        <AssignmentButton
                                                            displayName={displayName}
                                                            key={item.id}
                                                            isActive={item.isActive}
                                                            assignmentText={item.name}
                                                            onRemoveCareTeam={() => removeCareTeam({ variables })}
                                                        />
                                                    )
                                                })}
                                            </View>
                                        ) 
                                        
                                    }}
                                </Mutation>
                            }
                        </View>
                        {/** CAREGIVER */}
                        <View style={{paddingBottom: 10}}>
                            <CaregiverHeader 
                                goToCaregiverScreen={() => {
                                    this.props.navigation.navigate('Caregiver', {
                                        userName: userName,
                                        userId: userId,
                                        profileImage: profileImage,
                                        enterpriseId: enterpriseId,
                                        patientName: displayName,
                                        patientId: realPatientId,
                                        patientUserId: recipientId
                                    });
                                }}
                            />
                            <View style={styles.patientSeparatorStyle}></View>
                            <View style={{ paddingTop: 15 }}>
                                <AssociatedCaregiversList 
                                    currentlyAssignedCaregivers={currentlyAssignedCaregivers}
                                    makeCall={this.showCallPatientAlert}
                                    patientUserId={recipientId}
                                    messagesEnabled={messagesEnabled}
                                    onDemandmessagesEnabled={onDemandmessagesEnabled}
                                    patientName={displayName}
                                    patientId={realPatientId}
                                    enterpriseId={enterpriseId}
                                    navTo={this.props.navigation.navigate}
                                    loggedInDisplayName={this.props.userName}
                                    loggedInProfileImage={this.props.profileImage}
                                    loggedInUserId={this.props.userId}
                                    sendOnDemandMessage={(displayNameCaregiver, profileImageCaregiver, recipientIdCaregiver) => {
                                        this.setState({ onDemandPatient: false, showOnDemandMessage: true, displayNameCaregiver, profileImageCaregiver, recipientIdCaregiver })
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                }
                {(editing || newPatientForm) &&
                    <View style={{ paddingBottom: 150 }} />
                }
            </ScrollView>
        )
    }

    renderFormGroup(createPatient, updatePatient){
        
        const { enterpriseId } = this.props

        const { showLanguageListModal, languages, currentSelectedLanguage, newPatientForm, editing, showOnDemandMessage, recipientId, onDemandPatient, recipientIdCaregiver, displayName, displayNameCaregiver } = this.state

        if(allowSidebar){

            if(showOnDemandMessage) {
                return(
                    <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                        <View style={styles.tabletItemContainer}>
                            <Modal 
                                visible={showLanguageListModal}
                                animationType={'slide'}>
                                <AddPatientModalLanguageList
                                    dismissHandler={this.languageModalDismissHandler}
                                    languages={languages}
                                    currentSelectedLanguage={currentSelectedLanguage}
                                    languageSelected={this.languageSelectedHandler}
                                />
                            </Modal>
                            {this.renderHeaderView()}
                            <OnDemandContainer 
                                enterpriseId={enterpriseId}
                                goBack={() => this.setState({ onDemandPatient: true, showOnDemandMessage: false })}
                                recipientId={onDemandPatient ? recipientId : recipientIdCaregiver}
                                displayName={onDemandPatient ? displayName : displayNameCaregiver}
                                setToPatient={() => this.setState({ onDemandPatient: true })}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                )
            }
            else {
                return (
                    <View style={styles.tabletItemContainer}>
                        <Modal 
                            visible={showLanguageListModal}
                            animationType={'slide'}
                        >
                            <AddPatientModalLanguageList
                                dismissHandler={this.languageModalDismissHandler}
                                languages={languages}
                                currentSelectedLanguage={currentSelectedLanguage}
                                languageSelected={this.languageSelectedHandler}
                            />
                        </Modal>
                        {this.renderHeaderView()}
                        {this.renderForm()}
                        {(newPatientForm || editing) && this.renderButtonGroup(enterpriseId, createPatient, updatePatient)}
                    </View>
                )
            }

        }else{
            
            const { userName, userId, profileImage } = this.props
            const { showOnDemandMessage, editing } = this.state

            if(showOnDemandMessage) {
                return(
                    <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                        <View style={{backgroundColor:'black', flex:1}}> 
                            <Modal 
                                visible={showLanguageListModal}
                                animationType={'slide'}>
                                <AddPatientModalLanguageList
                                    dismissHandler={this.languageModalDismissHandler}
                                    languages={languages}
                                    currentSelectedLanguage={currentSelectedLanguage}
                                    languageSelected={this.languageSelectedHandler}
                                />
                            </Modal>
                            <TopBarView
                                userId={userId}
                                profileImage={profileImage}
                                userName={userName}
                                hideButtons={true}
                                socketState={this.props.socketState}
                                closeSocket={this.props.closeSocket}
                            />
                            <BreadcrumbView
                                breadCrumbText={'Add Patient Detail'}
                                goBack={() => this.props.goBack()}
                            />
                            {this.renderHeaderView()}
                            <OnDemandContainer 
                                enterpriseId={enterpriseId}
                                editing={editing}
                                goBack={() => this.setState({ onDemandPatient: true, showOnDemandMessage: false })}
                                recipientId={onDemandPatient ? recipientId : recipientIdCaregiver}
                                displayName={onDemandPatient ? displayName : displayNameCaregiver}
                                setToPatient={() => this.setState({ onDemandPatient: true })}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                )
            }
            else {
                return(
                    <View style={{backgroundColor:'black', flex:1}}> 
                            <Modal 
                                visible={showLanguageListModal}
                                animationType={'slide'}>
                                <AddPatientModalLanguageList
                                    dismissHandler={this.languageModalDismissHandler}
                                    languages={languages}
                                    currentSelectedLanguage={currentSelectedLanguage}
                                    languageSelected={this.languageSelectedHandler}
                                />
                            </Modal>
                            <TopBarView
                                userId={userId}
                                profileImage={profileImage}
                                userName={userName}
                                hideButtons={true}
                                socketState={this.props.socketState}
                                closeSocket={this.props.closeSocket}
                            />
                            <BreadcrumbView
                                breadCrumbText={'Add Patient Detail'}
                                goBack={() => this.props.goBack()}
                            />
                            {this.renderHeaderView()}
                            {this.renderForm()}
                            {(newPatientForm || editing) && this.renderButtonGroup(enterpriseId, createPatient, updatePatient)}
                    </View>
                )
            }

        }
        
    }


    render(){

        const { editing } = this.state

        if(editing){

            const UPDATE_PATIENT_MUTATION = PatientsQL.updatePatient()

            return(
                <Mutation
                    mutation={UPDATE_PATIENT_MUTATION}
                    onCompleted={this.successHandler}
                    onError={this.handleError}>
                    {(updatePatient, { loading }) => {
    
                        return(
                            <Fragment>{this.renderFormGroup(null, updatePatient)}</Fragment>
                        )
                        
                    }}
                </Mutation>
    
            )

        }

        const CREATE_PATIENT_MUTATION = PatientsQL.createPatient()

        return(

            <Mutation
                mutation={CREATE_PATIENT_MUTATION}
                onCompleted={this.successHandler}
                onError={this.handleError}>
                {(createPatient, { loading }) => {

                    return(
                        <Fragment>{this.renderFormGroup(createPatient, null)}</Fragment>
                    )
                    
                }}
            </Mutation>

        )

    }

}

export default withNavigation(AddPatientDetailView);
