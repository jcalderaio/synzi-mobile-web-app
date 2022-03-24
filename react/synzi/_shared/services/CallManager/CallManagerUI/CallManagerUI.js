import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';
import { isVirtualCare } from '../../../constants/AppConfig'
import { CachedImage } from "react-native-img-cache";
import DeviceInfo from 'react-native-device-info';
import Reactotron from 'reactotron-react-native'
import deviceLog from 'react-native-device-log'
import AvatarRelated from '../../../src/molecules/AvatarRelated/AvatarRelated'
import styles from './styles';


export default class CallManagerUI extends Component {

    constructor(props) {
        super(props)
    }


    renderRetryUI(){

        return(
            <View style={styles.buttonContainerStyle}>
                <TouchableOpacity
                    onPress={() => cancelCall(outgoingCallObject)} >
                    <Image
                        style = {{
                            width: 70, 
                            height: 70,
                        }}
                        resizeMode={'contain'}
                        source={require('../../../images/icons/callDeclineButton.png')}
                    />
                    <Text style={styles.buttonTextStyle}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => skipCall()} >
                    <Image
                        style = {{
                            width: 70, 
                            height: 70,
                        }}
                        resizeMode={'contain'}
                        source={require('../../../images/icons/callSkipButton.png')}
                    />
                    <Text style={styles.buttonTextStyle}>Skip To Next</Text>
                </TouchableOpacity>
            </View>
        )

    }


    renderIncomingCallButtons(){

        const {
            ignoreIncomingCall,
            acceptCall,
            incomingCallObject,
        } = this.props

        

        return(
            <View style={styles.buttonContainerStyle}>
                <TouchableOpacity
                    onPress={() => acceptCall(incomingCallObject)} >
                    <Image
                        style = {{
                            width: 70, 
                            height: 70,
                        }}
                        resizeMode={'contain'}
                        source={require('../../../images/icons/callAnswerButton.png')}
                    />
                    <Text style={styles.buttonTextStyle}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => ignoreIncomingCall(incomingCallObject)} >
                    <Image
                        style = {{
                            width: 70, 
                            height: 70,
                        }}
                        resizeMode={'contain'}
                        source={require('../../../images/icons/callDeclineButton.png')}
                    />
                    <Text style={styles.buttonTextStyle}>Decline</Text>
                </TouchableOpacity>
            </View>
        )
    }


    renderRetryCallUI(){

        const {
            cancelCall,
            outgoingCallObject,
            retryCallAction,
        } = this.props

        return(
            <View style={styles.buttonContainerStyle}>
                <TouchableOpacity
                    onPress={() => cancelCall(outgoingCallObject)} >
                    <Image
                        style = {{
                            width: 70, 
                            height: 70,
                        }}
                        resizeMode={'contain'}
                        source={require('../../../images/icons/callDeclineButton.png')}
                    />
                    <Text style={styles.buttonTextStyle}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => retryCallAction(outgoingCallObject)} >
                    <Image
                        style = {{
                            width: 70, 
                            height: 70,
                        }}
                        resizeMode={'contain'}
                        source={require('../../../images/icons/callRetryButton.png')}
                    />
                    <Text style={styles.buttonTextStyle}>Retry</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderOutGoingCallButtons(){

        const {
            cancelCall,
            outgoingCallObject,
            skipCall,
        } = this.props

        if(outgoingCallObject.single_user){
            return(
                <View style={styles.buttonContainerSingleStyle}>
                    <TouchableOpacity
                        onPress={() => cancelCall(outgoingCallObject)} >
                        <Image
                            style = {{
                                width: 70, 
                                height: 70,
                            }}
                            resizeMode={'contain'}
                            source={require('../../../images/icons/callDeclineButton.png')}
                        />
                        <Text style={styles.buttonTextStyle}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )
        }

        else if(!isVirtualCare()) {
            return(
                <View style={styles.buttonContainerSingleStyle}>
                    <TouchableOpacity
                        onPress={() => cancelCall(outgoingCallObject)} >
                        <Image
                            style = {{
                                width: 70, 
                                height: 70,
                            }}
                            resizeMode={'contain'}
                            source={require('../../../images/icons/callDeclineButton.png')}
                        />
                        <Text style={styles.buttonTextStyle}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )
        }

        return(
            <View style={styles.buttonContainerStyle}>
                <TouchableOpacity
                    onPress={() => cancelCall(outgoingCallObject)} >
                    <Image
                        style = {{
                            width: 70, 
                            height: 70,
                        }}
                        resizeMode={'contain'}
                        source={require('../../../images/icons/callDeclineButton.png')}
                    />
                    <Text style={styles.buttonTextStyle}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => skipCall()} >
                    <Image
                        style = {{
                            width: 70, 
                            height: 70,
                        }}
                        resizeMode={'contain'}
                        source={require('../../../images/icons/callSkipButton.png')}
                    />
                    <Text style={styles.buttonTextStyle}>Skip To Next</Text>
                </TouchableOpacity>
            </View>
        )
    }


    renderCachedImage(profileImage){
        return(
            <CachedImage
                style={
                    {
                        width:150,
                        height:150,
                        marginBottom: 35,
                        borderRadius : 75,
                        borderColor: 'white',
                        borderWidth: 1.0,
                        marginRight: 10,
                        opacity:1.0
                    }
                }
                source={{ uri: profileImage }} 
            />
        )
    }

    renderDefaultImage(){
        return(
            <Image
                style={styles.incomingAvatarStyle}
                resizeMode={'contain'}
                source={require('../../../images/icons/genericUserIconLarge.png')}
            />
        )
    }


    render() {

        const {
            incomingCallObject,
            outgoingCallObject,
            retryCall
        } = this.props

        let incomingCall = incomingCallObject ? true : false

        let relatedUser = false
        if(incomingCall) relatedUser = incomingCallObject.relatedUser ? true : false

        var retryMessage = null

        if(outgoingCallObject !== undefined && outgoingCallObject.single_user){
            retryMessage = `${outgoingCallObject.displayName} didn't answer.\n Would you like to retry?`
        }else{
            retryMessage = `No one was available to answer your call.\n Would you like to retry?`
        }


        let profileImage = (incomingCall ? incomingCallObject.profileImage : outgoingCallObject.profileImage)
        let useProfileImage = (profileImage !== '')

        let relatedUserImage = (relatedUser ? incomingCallObject.relatedImg : '')

 
        if(retryCall){
            return (
                <View style={styles.mainContainerRetryStyle}>
                    <View  style={styles.backgroundViewStyle}>
                        {useProfileImage ? this.renderCachedImage(profileImage) : this.renderDefaultImage()}
                        <Text style={styles.callerNameTextStyle}>{retryMessage}</Text>
                        {this.renderRetryCallUI()}
                    </View>
                </View>
            )
        }

        if(relatedUser) {
            return (
                <View style={retryCall ? styles.mainContainerRetryStyle :  styles.mainContainerStyle}>
                    <View  style={styles.backgroundViewStyle}>
                        <AvatarRelated
                            primaryImage={profileImage}
                            secondaryImage={relatedUserImage}
                            secondaryDisplayName={incomingCallObject.relatedDisplayName}
                        />
                        <Text style={styles.incomingCallTextStyle}>Incoming Call</Text>
                        <Text style={styles.callerNameTextStyle}>{incomingCallObject.callerName}</Text>
                        {this.renderIncomingCallButtons()}
                    </View>
                </View>
            )
        }

        return (
            <View style={retryCall ? styles.mainContainerRetryStyle :  styles.mainContainerStyle}>
                <View  style={styles.backgroundViewStyle}>
                    {useProfileImage ? this.renderCachedImage(profileImage) : this.renderDefaultImage()}
                    <Text style={styles.incomingCallTextStyle}>{incomingCall ?  'Incoming Call' : 'Calling'}</Text>
                    <Text style={styles.callerNameTextStyle}>{incomingCall ? incomingCallObject.callerName : outgoingCallObject.displayName}</Text>
                    {incomingCall ? this.renderIncomingCallButtons() : this.renderOutGoingCallButtons()}
                </View>
            </View>
        )

    }

}
