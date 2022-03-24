import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    Platform,
    Alert,
    NetInfo,
    TouchableWithoutFeedback,
    Keyboard,
    FlatList,
    KeyboardAvoidingView
} from 'react-native';
import { Button } from 'react-native-elements'
import { LogSeparator} from '../../../../_shared/constants/AppConfig'
import TopBarView from '../../organisms/TopBarView/TopBarView'
import BreadcrumbView from '../../organisms/BreadcrumbView/BreadcrumbView'
import CreateCaregiverForm from '../../organisms/CreateCaregiverForm/CreateCaregiverForm'
import { AppColor, SynziColor} from '../../../../_shared/Color';
import { Query, Mutation } from 'react-apollo'
import CaregiverQL from '../../../../_shared/graphql/CaregiverQL'
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'
import { formatPhone }  from '../../../../_shared/helpers/Helpers'
import deviceLog from 'react-native-device-log'

// Toast Message
import { showMessage } from "react-native-flash-message"

import styles from './styles'

export default class CreateCaregiverScreen extends Component {

    constructor(props) {
        super(props)

        let name = null
        let contactType = null
        let email = null
        let phone = this.props.navigation.getParam('phoneNumber') ? formatPhone(this.props.navigation.getParam('phoneNumber')).formattedPhone : null
        let messageTypeIndex = 0
        let messageTypeString = 'Text & Email'

        if(contactType === 'Text & Email') {
            messageTypeIndex = 0
            messageTypeString = 'Text & Email'
        }else if(contactType === 'Text Only') {
            messageTypeIndex = 1
            messageTypeString = 'Text Only'
        }

        this.state = {
            offset: 0,
            rawPhone: this.props.navigation.getParam('phoneNumber') ? this.props.navigation.getParam('phoneNumber') : '',
            isConnected: true,
            formValid: false,
            refresh: false,
            formData: [
                { 
                    labelText:'NAME',
                    warningText:'Please enter a name',
                    required:true,
                    formSatisfied:name ? true : false,
                    keyboardType:'default',
                    onChangeText:this.onChangeTextHandler,
                    textValue:name ? name : '',
                    regEx:/^/
                },
                { 
                    labelText:'MESSAGE TYPE',
                    warningText:'',
                    required:false,
                    formSatisfied:true,
                    isSegmentedControl:true,
                    selectedIndex:messageTypeIndex,
                    segmentedControlHandler:this.segmentedControlHandler,
                    segmentValues:['Text & Email', 'Text Only'],
                    textValue:messageTypeString
                },
                { 
                    labelText:'EMAIL',
                    warningText:'You must provide an email address',
                    required:true,
                    formSatisfied:(email || messageTypeString === 'Text Only')  ? true : false,
                    keyboardType:'default',
                    onChangeText:this.onChangeTextHandler,
                    textValue:email ? email : '',
                    regEx:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
                },
                { 
                    labelText:'PHONE',
                    warningText:'You must provide a phone number',
                    required:true,
                    formSatisfied: phone ? true : false,
                    keyboardType: Platform.OS === 'ios' ? "number-pad" : "numeric",
                    onChangeText:this.onChangeTextHandler,
                    textValue:phone ? phone : '',
                    regEx:/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
                }
            ]
        }
    }

    _renderItem = ({item, separators}) => (

        <CreateCaregiverForm
            labelText={item.labelText}
            warningText={item.warningText}
            required={item.required}
            keyboardType={item.keyboardType}
            isSegmentedControl={item.isSegmentedControl}
            selectedIndex={item.selectedIndex}
            segmentedControlHandler={item.segmentedControlHandler}
            segmentValues={item.segmentValues}
            onChangeText={item.onChangeText}
            textValue={item.textValue}
            isSpacer={item.isSpacer}
            formSatisfied={item.formSatisfied}
            regEx={item.regEx}
        />

    )

    renderSeparator = () => {
        return (
            null
        )
    }

    segmentedControlHandler = (segment) => {

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
            case 'Text & Email':
                emailRequired = true
                phoneRequired =  true
                break;
            case 'Text Only':
                emailRequired = false
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
            formValid: this.validForm(),
            refresh: !refresh,
            formData,
        });
        
    }

    onChangeTextHandler = (element, text) => {

        const { formData, refresh } = this.state

        //Get the index of the form element
        var index = formData.map(function (obj) { 
            return obj.labelText; 
        }).indexOf(element);

        const items = formData;

        if(index === 3) {
             //Update the phone text
            items[index].textValue = formatPhone(text).formattedPhone
            items[index].formSatisfied = this.formSatisfied(items[index].textValue, items[index].regEx)
        } else {
            //Update the text
            items[index].textValue = text
            items[index].formSatisfied = this.formSatisfied(items[index].textValue, items[index].regEx)
        }
        
        if(items[index].isRequired === false && items[index].textValue.length === 0){
            items[index].formSatisfied = true
        }

        //Update state
        this.setState({
            formValid: this.validForm(),
            refresh: !refresh,
            formData,
        });

    }

    formSatisfied = (value, regEx) => {

        if(value.length > 0){
            if(regEx.test(value)){
                return true
            }else{
                return false
            }
        }
        return false
    }

    validForm = () => {

        const { formData } = this.state

        for (let item of formData) {
            if(item.required && !item.formSatisfied) {
                return false
            }
        }

        return true
    }

    returnFormText = (formName) => {

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

    returnFormPayload = () => {

        let name = this.returnFormText('NAME')
        let contactType = this.returnFormText('MESSAGE TYPE')
        let email = this.returnFormText('EMAIL')
        let phone = formatPhone(this.returnFormText('PHONE')).rawPhone
        const enterpriseId = this.props.navigation.getParam('enterpriseId', "0");
        const patientUserId = this.props.navigation.getParam('patientUserId', 0);

        return { 
            enterpriseId,
            displayName: name,
            contactType: (contactType === 'Text Only') ? 'SMS' : 'BOTH',
            email,
            phone,
            patientUserId,
            username: "",
            password: ""
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

    renderErrorState(errorText){
        return(
            <Text style={styles.errorTextStyle}>{errorText}</Text>
        )
    }

    renderLoadingState(){
        return(
            <ActivityIndicator size={'large'} />
        )
    }

    handleCreateError = (error) => {
        let errorMessage = error.message

        if (error.message.includes('CreateCaregiver failed with duplicate phone')) {
            let phone = this.returnFormText('PHONE')
            errorMessage = `You already have a Caregiver with phone # ${phone}`
        } 

        showMessage({
            message: 'Duplicate Caregiver Error',
            description: errorMessage,
            backgroundColor: SynziColor.SYNZI_YELLOW,
            duration: 6000
        });

    }

    navigateBack = () => {
        if(allowSidebar){ 
            this.props.navigation.navigate('Caregiver', { fromScreen: 'CreateCaregiver' })
        } else {
            this.props.navigation.navigate('AddPatientDetail')
        }
    }

    handleCompleted = data => {
        const patientName = this.props.navigation.getParam('patientName', '');

        this.navigateBack()

        showMessage({
            message: 'Success',
            description: `${this.returnFormText('NAME')} has been successfully assigned to ${patientName}`,
            backgroundColor: AppColor.BRIGHT_GREEN,
            icon: "success",
            duration: 4000,
            color: 'black'
        });                                                               
    }

    render(){

        const userName = this.props.navigation.getParam('userName', '');
        const userId = this.props.navigation.getParam('userId', 0);
        const profileImage = this.props.navigation.getParam('profileImage', '0');
        const enterpriseId = this.props.navigation.getParam('enterpriseId', "0");
        const patientName = this.props.navigation.getParam('patientName', '');
        //const enterpriseImage = this.props.navigation.getParam('enterpriseImage', '0');

        const CREATE_CAREGIVER_MUTATION = CaregiverQL.createCaregiver()

        const { isConnected, formData, refresh, formValid } = this.state
 
        if(Platform.OS === 'ios') {
            return (
                <KeyboardAvoidingView 
                    behavior="padding" 
                    style={{ flex: 1 }} 
                >
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <View style={styles.mainContainerStyle}>
                            <TopBarView
                                userId={userId}
                                profileImage={profileImage}
                                userName={userName}
                                hideButtons={true}
                                socketState={this.props.screenProps.socketState}
                                closeSocket={this.props.screenProps.closeSocket}
                            />
                            <BreadcrumbView
                                //logoImage={enterpriseImage}
                                breadCrumbText={'Create New Caregiver Account'}
                                goBack={() => this.props.navigation.goBack()}
                            />
                                <Mutation
                                    mutation={CREATE_CAREGIVER_MUTATION}
                                    variables={this.returnFormPayload()}
                                    onCompleted={data => this.handleCompleted(data)}
                                    onError={error => this.handleCreateError(error)}
                                >
                                    {(createCaregiver, {client}) => (
                                        <View style={{flex: 1}}>
                                            <FlatList
                                                extraData={refresh}
                                                data={formData}
                                                renderItem={this._renderItem}
                                                ItemSeparatorComponent={this.renderSeparator}
                                                keyExtractor={item => item.labelText}
                                            />
                                            <View style={styles.buttonGroupStyle}>
                                                <View style={styles.buttonContainerStyle}>
                                                    <Button
                                                        onPress={() => {
                                                            this.navigateBack()
                                                        }}
                                                        buttonStyle={styles.cancelButton.buttonStyle}
                                                        titleStyle={styles.cancelButton.titleStyle}
                                                        title="Cancel"
                                                        type="outline"
                                                    />
                                                </View>
                                                <View style={styles.buttonContainerStyle}>
                                                    <Button
                                                        onPress={() => {
                                                            Alert.alert(
                                                                `Would you like to assign ${this.returnFormText('NAME')} as a Caregiver?`,
                                                                `\nThey will be able to receive messages and/or calls on behalf of ${patientName}`,
                                                                [
                                                                    { text: 'Cancel', onPress: () => null },
                                                                    { text: 'Assign', onPress: () => createCaregiver()}
                                                                ],
                                                                { cancelable: false }
                                                            )
                                                        }}
                                                        disabled={!formValid}
                                                        disabledStyle={styles.createButton.disabledStyle}
                                                        disabledTitleStyle={styles.createButton.disabledTitleStyle}
                                                        buttonStyle={styles.createButton.buttonStyle}
                                                        titleStyle={styles.createButton.titleStyle}
                                                        color={SynziColor.SYNZI_BLUE}
                                                        title="Create"
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                </Mutation>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            )
        } else {
            return (
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={styles.mainContainerStyle}>
                        <TopBarView
                            userId={userId}
                            profileImage={profileImage}
                            userName={userName}
                            hideButtons={true}
                            socketState={this.props.screenProps.socketState}
                            closeSocket={this.props.screenProps.closeSocket}
                        />
                        <BreadcrumbView
                            //logoImage={enterpriseImage}
                            breadCrumbText={'Create New Caregiver Account'}
                            goBack={() => this.props.navigation.goBack()}
                        />
                            <Mutation
                                mutation={CREATE_CAREGIVER_MUTATION}
                                variables={this.returnFormPayload()}
                                onCompleted={data => this.handleCompleted(data)}
                                onError={error => this.handleCreateError(error)}
                            >
                                {(createCaregiver, {client}) => (
                                    <View style={{flex: 1}}>
                                        <FlatList
                                            extraData={refresh}
                                            data={formData}
                                            renderItem={this._renderItem}
                                            ItemSeparatorComponent={this.renderSeparator}
                                            keyExtractor={item => item.labelText}
                                        />
                                        <View style={styles.buttonGroupStyle}>
                                            <View style={styles.buttonContainerStyle}>
                                                <Button
                                                    onPress={() => {
                                                        this.navigateBack()
                                                    }}
                                                    buttonStyle={styles.cancelButton.buttonStyle}
                                                    titleStyle={styles.cancelButton.titleStyle}
                                                    title="Cancel"
                                                    type="outline"
                                                />
                                            </View>
                                            <View style={styles.buttonContainerStyle}>
                                                <Button
                                                    onPress={() => {
                                                        Alert.alert(
                                                            `Would you like to assign ${this.returnFormText('NAME')} as a Caregiver?`,
                                                            `\nThey will be able to receive messages and/or calls on behalf of ${patientName}`,
                                                            [
                                                                { text: 'Cancel', onPress: () => null },
                                                                { text: 'Assign', onPress: () => createCaregiver()}
                                                            ],
                                                            { cancelable: false }
                                                        )
                                                    }}
                                                    disabled={!formValid}
                                                    disabledStyle={styles.createButton.disabledStyle}
                                                    disabledTitleStyle={styles.createButton.disabledTitleStyle}
                                                    buttonStyle={styles.createButton.buttonStyle}
                                                    titleStyle={styles.createButton.titleStyle}
                                                    color={SynziColor.SYNZI_BLUE}
                                                    title="Create"
                                                />
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </Mutation>
                    </View>
                </TouchableWithoutFeedback>
            )
        }
    }
}
