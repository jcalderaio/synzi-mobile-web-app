import React, { Component } from 'react'
import {
    Text,
    View,
    Image
} from 'react-native';
import PropTypes from 'prop-types'
import { CachedImage } from "react-native-img-cache";

import GenericUserIcon from '../../../../_shared/images/icons/genericUserIcon2.png'
import GenericUserMask from '../../../../_shared/images/icons/genericUserMask.png'


export default class PatientAvatarView extends Component {
    static propTypes = {
        /** Width of the avatar */
        width: PropTypes.number,
        /** Height of the avatar */
        height: PropTypes.number,
        /** Image URL of the avatar's image */
        profileImage: PropTypes.string

    }
    static defaultProps = {
        width: 50,
        height: 50,
        profileImage: undefined
    }

    renderCachedImage(){

        const { profileImage, width, height } = this.props

        return(
            <CachedImage 
                style={
                    {
                        width: width, 
                        height: height,
                        borderRadius : width ? width/2 : 25,
                        borderColor: 'white',
                        borderWidth: 1.0,
                        marginRight: 10,
                        opacity: 1.0
                    }
                }
                source={{ uri: profileImage }} 
            />
        )
    }


    renderDefaultImage(){
        const { profileImage, width, height } = this.props

        return(
            <Image
                style={
                    {
                        width: width, 
                        height: height,
                        borderRadius : width ? width/2 : 25,
                        borderColor: 'white',
                        borderWidth: 1.0,
                        marginRight: 10,
                    }
                }
                resizeMode={'cover'}
                source={GenericUserIcon}
            />
        )
    }

    render() {

        const { profileImage, width, height } = this.props

        const defaultImage = (profileImage === undefined || profileImage === '')

        return (
            
            <View>
                {defaultImage ? this.renderDefaultImage() : this.renderCachedImage()}
                <Image
                    style={
                        {
                            position: 'absolute',
                            width: width, 
                            height: height,
                        }
                    }
                    resizeMode={'cover'}
                    source={GenericUserMask}
                />
            </View>
           
        )
    }
}

