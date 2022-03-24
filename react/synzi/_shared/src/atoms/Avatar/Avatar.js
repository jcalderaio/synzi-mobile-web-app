import React, { Component } from 'react'
import {
    View,
    Image,
    Text
} from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'
import { AppColor } from '../../../Color'
import { CachedImage } from "react-native-img-cache"
import IconBadge from 'react-native-icon-badge'

import GenericUserIcon from '../../../images/icons/genericUserIcon2.png'
import GenericUserMask from '../../../images/icons/genericUserMask.png'
import GenericUserMaskSearch from '../../../images/icons/genericUserMask_search.png'

export default class Avatar extends Component {
    static propTypes = {
      /* For patient bar */
      patientBar: PropTypes.bool,
      /** Size for the avatar */
      size: PropTypes.number,
      /** Url to an image to display */
      imgUrl: PropTypes.string,
      /** Dim Avatar if no unread messages */
      dimmed: PropTypes.bool,
      /** Unread count */
      unreadCount: PropTypes.number,
      /** Unread count */
      useFor: PropTypes.oneOf(['List', 'Thread']),
    }
    static defaultProps = {
      size: 42,
      imgUrl: '',
      dimmed: false,
      unreadCount: 0,
      useFor: 'Thread',
      patientBar: false
    }

    renderCachedImage(imgUrl, dimmed){

        return(
            <CachedImage 
                style={
                    {
                        width: this.props.size, 
                        height: this.props.size,
                        borderRadius : this.props.size/2,
                        borderColor: 'white',
                        borderWidth: 1.0,
                        marginRight: 10,
                        opacity: dimmed ? 0.2 : 1
                    }
                }
                source={{ uri: imgUrl }} 
            />
        )
    }

    renderDefaultImage(dimmed){
        return(
            <Image
                style={
                    {
                        width: this.props.size, 
                        height: this.props.size,
                        borderRadius : this.props.size/2,
                        borderColor: 'white',
                        borderWidth: 1.0,
                        marginRight: 10,
                        opacity: dimmed ? 0.2 : 1
                    }
                }
                resizeMode={'cover'}
                source={GenericUserIcon}
            />
        )
    }

    returnMask(dimmed) {
        const { patientBar } = this.props

        if(patientBar) {
            return(
                <Image
                    style={
                        {
                            position: 'absolute',
                            width: this.props.size, 
                            height: this.props.size,
                            opacity: dimmed ? 0.5 : 1
                        }
                    }
                    resizeMode={'cover'}
                    source={GenericUserMaskSearch}
                />
            )
        }

        return(
            <Image
                style={
                    {
                        position: 'absolute',
                        width: this.props.size, 
                        height: this.props.size,
                        opacity: dimmed ? 0.5 : 1
                    }
                }
                resizeMode={'cover'}
                source={GenericUserMask}
            />
        )
        
    }
    render() {
        const { imgUrl, dimmed, unreadCount, useFor } = this.props

        const defaultImage = (imgUrl === undefined || imgUrl === '')

        if(useFor === 'List') {
            return (
            
                <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
                    <IconBadge
                        MainElement={
                            <View>
                                {defaultImage ? this.renderDefaultImage(dimmed) : this.renderCachedImage(imgUrl, dimmed)}
                                {this.returnMask(dimmed)}
                            </View>
                        }
                        /*
                        // Shows the exact unread message count in the Avatar's badge
                        BadgeElement={
                            <Text style={{color: 'black', fontSize: 12}}>{unreadCount}</Text>
                        }
                        */
                        BadgeElement={
                            <Text style={{color: 'black', fontSize: 12}}>{' '}</Text>
                        }
                        IconBadgeStyle={
                            {width:20,
                            height:20,
                            backgroundColor: '#F4DC22'}
                        }
                        Hidden={dimmed}
                    />
                </View>
               
            )
        }
        
        return (
            <View>
                {defaultImage ? this.renderDefaultImage(dimmed) : this.renderCachedImage(imgUrl, dimmed)}
                {this.returnMask(dimmed)}
            </View>
        )
        
    }
}

