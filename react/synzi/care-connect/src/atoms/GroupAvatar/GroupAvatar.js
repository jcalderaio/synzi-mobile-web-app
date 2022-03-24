import React, { Component } from 'react'
import {
    Text,
    View,
    Image
} from 'react-native';
import PropTypes from 'prop-types'
import styles from './styles';
import { AppColor } from '../../../../_shared/Color';

import GroupIcon from '../../images/group-icon.png'
import GenericMask from '../../../../_shared/images/icons/genericUserMask.png'

export default class GroupAvatar extends Component {
    static propTypes = {
        /** Width of the avatar */
        width: PropTypes.number,
        /** Height of the avatar */
        height: PropTypes.number,
    }
    static defaultProps = {
        width: 50,
        height: 50
    }

    render() {
        const { width, height } = this.props

        return (
            <View>
                <Image
                    style={
                        {
                            width: width, 
                            height: height,
                            borderRadius : width ? width/2 : 25,
                            borderColor: 'white',
                            borderWidth: 1.0,
                            marginRight: 10
                        }
                    }
                    resizeMode={'cover'}
                    source={GroupIcon}
                />
                <Image
                    style={
                        {
                            position: 'absolute',
                            width: width, 
                            height: height,
                            opacity: 1.0
                        }
                    }
                    resizeMode={'cover'}
                    source={GenericMask}
                />
            </View>
           
        )
    }
}