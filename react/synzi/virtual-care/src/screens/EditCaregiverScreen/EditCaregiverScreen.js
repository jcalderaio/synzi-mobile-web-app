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
import ResendCaregiverInviteButton from '../../atoms/ResendCaregiverInviteButton/ResendCaregiverInviteButton'
import { AppColor, SynziColor} from '../../../../_shared/Color';
import { Query, Mutation } from 'react-apollo'
import CaregiverQL from '../../../../_shared/graphql/CaregiverQL'
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'
import { formatPhone }  from '../../../../_shared/helpers/Helpers'
import deviceLog from 'react-native-device-log'

// Toast Message
import { showMessage } from "react-native-flash-message"

import styles from './styles'

export default class EditCaregiverScreen extends Component {

    constructor(props) {
        super(props)

        let name = this.props.navigation.getParam('caregiverDisplayName')
        let contactType = this.props.navigation.getParam('contactType')
        let email = this.props.navigation.getParam('email')
        let phone = formatPhone(this.props.navigation.getParam('phone')).formattedPhone
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
            rawPhone: this.props.navigation.getParam('phone'),
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

        const name = this.returnFormText('NAME')
        const contactType = this.returnFormText('MESSAGE TYPE')
        const email = this.returnFormText('EMAIL')
        const phone = formatPhone(this.returnFormText('PHONE')).rawPhone
        const enterpriseId = this.props.navigation.getParam('enterpriseId', "0");
        const caregiverId = this.props.navigation.getParam('caregiverId', "0");

        return { 
            enterpriseId,
            displayName: name,
            contactType: (contactType === 'Text Only') ? 'SMS' : 'BOTH',
            email,
            phone,
            id: caregiverId
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

    handleEditError = (error) => {
        let errorMessage = error.message

        // if (error.message.includes('EditCaregiver failed with duplicate phone')) {
        //     let phone = this.returnFormText('PHONE')
        //     errorMessage = `You already have a Caregiver with phone # ${phone}`
        // } 

        if (error.message.includes('Caregiver already exists with phone number')) {
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
        this.props.navigation.goBack()
    }

    handleEdited = data => {
        this.navigateBack()

        showMessage({
            message: 'Success',
            description: `Your changes to ${this.returnFormText('NAME')} have been saved`,
            backgroundColor: AppColor.BRIGHT_GREEN,
            icon: "success",
            duration: 4000,
            color: 'black'
        });                                                               
    }

    render(){

        const loggedInDisplayName = this.props.navigation.getParam('loggedInDisplayName', '');
        const loggedInUserId = this.props.navigation.getParam('loggedInUserId', 0);
        const loggedInProfileImage = this.props.navigation.getParam('loggedInProfileImage', '0');
        const caregiverId = this.props.navigation.getParam('caregiverId', "0");

        const EDIT_CAREGIVER_MUTATION = CaregiverQL.editCaregiver()

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
                                userId={loggedInUserId}
                                profileImage={loggedInProfileImage}
                                userName={loggedInDisplayName}
                                hideButtons={true}
                                socketState={this.props.screenProps.socketState}
                                closeSocket={this.props.screenProps.closeSocket}
                            />
                            <BreadcrumbView
                                //logoImage={enterpriseImage}
                                breadCrumbText={'Edit Caregiver'}
                                goBack={() => this.navigateBack()}
                            />
                                <Mutation
                                    mutation={EDIT_CAREGIVER_MUTATION}
                                    variables={this.returnFormPayload()}
                                    onCompleted={data => this.handleEdited(data)}
                                    onError={error => this.handleEditError(error)}
                                >
                                    {(editCaregiver, {client}) => (
                                        <View style={{flex: 1}}>
                                            <View style={{
                                                paddingVertical: 10,
                                                flexDirection:'row',
                                                justifyContent:'flex-end',
                                                marginRight:10
                                                }}>
                                                <ResendCaregiverInviteButton
                                                    caregiverId={caregiverId}
                                                />
                                            </View>
                                            <View style={styles.caregiverSeparatorStyle}></View>
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
                                                                `Edit Caregiver`,
                                                                `Do you want to save your edits to ${this.returnFormText('NAME')}?`,
                                                                [
                                                                    { text: 'Cancel', onPress: () => null },
                                                                    { text: 'Save', onPress: () => editCaregiver()}
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
                                                        title="Save"
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
                                userId={loggedInUserId}
                                profileImage={loggedInProfileImage}
                                userName={loggedInDisplayName}
                                hideButtons={true}
                                socketState={this.props.screenProps.socketState}
                                closeSocket={this.props.screenProps.closeSocket}
                            />
                            <BreadcrumbView
                                //logoImage={enterpriseImage}
                                breadCrumbText={'Edit Caregiver'}
                                goBack={() => this.navigateBack()}
                            />
                                <Mutation
                                    mutation={EDIT_CAREGIVER_MUTATION}
                                    variables={this.returnFormPayload()}
                                    onCompleted={data => this.handleEdited(data)}
                                    onError={error => this.handleEditError(error)}
                                >
                                    {(editCaregiver, {client}) => (
                                        <View style={{flex: 1}}>
                                            <View style={{
                                                paddingVertical: 10,
                                                flexDirection:'row',
                                                justifyContent:'flex-end',
                                                marginRight:10
                                                }}>
                                                <ResendCaregiverInviteButton
                                                    caregiverId={caregiverId}
                                                />
                                            </View>
                                            <View style={styles.caregiverSeparatorStyle}></View>
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
                                                                `Edit Caregiver`,
                                                                `Do you want to save your edits to ${this.returnFormText('NAME')}?`,
                                                                [
                                                                    { text: 'Cancel', onPress: () => null },
                                                                    { text: 'Save', onPress: () => editCaregiver()}
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
                                                        title="Save"
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
