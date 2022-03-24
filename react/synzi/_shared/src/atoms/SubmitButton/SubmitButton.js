import React, { Component } from 'react'
import {
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types'
import { AppColor, SynziColor } from '../../../Color';



export default class SubmitButton extends Component {
    static propTypes = {
        /** Called when the message is sent */
        onPress: PropTypes.func.isRequired,
        /** RecipientName */
        size: PropTypes.number,
        /** Dictates whether the button is disabled */
        disabled: PropTypes.bool,
        /** Style for the wrapper */
        style: PropTypes.object,
    }
    static defaultProps = {
        style: {},
        size: 45,
        disabled: false
    }

    render() {

        const { size, onPress, disabled, style } = this.props
        var submitIconColor = SynziColor.SYNZI_BLUE

        return (
          <TouchableOpacity
            disabled={disabled} 
            onPress={onPress}
            style={style}
          >
          <Image
            style={{ 
                width: size, 
                height: size,
                tintColor: submitIconColor,
            }}
            resizeMode={'contain'}
            source={require('../../../images/icons/submitIcon.png')} 
          />
          </TouchableOpacity>
      )
    }
}