import React, { Component } from 'react'
import {
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types'
import { AppColor, SynziColor } from '../../../../_shared/Color';


export default class MessageButton extends Component {
    static propTypes = {
        /** Flag that notates whether button should be dimmed */
        disabled: PropTypes.bool,
        /** Size of the button (it's round, so same width/height) */
        size: PropTypes.number,
        /** Function to call when button pressed */
        onPress: PropTypes.func.isRequired,
        /** Style for the wrapper */
        style: PropTypes.object,
    }

    static defaultProps = {
        style: {},
        disabled: false,
        size: 50
    }

    render() {

        const { disabled, size, onPress, style } = this.props
        var messageIconColor = SynziColor.SYNZI_BLUE

        return (
          <TouchableOpacity
              disabled={disabled} 
              onPress={onPress}
              style={style}
          >
              <View 
                  style={
                      {
                          width: size, 
                          height: size,
                          borderRadius : size/2,
                          backgroundColor: !disabled ? messageIconColor : AppColor.USER_DISCONNECTED_COLOR, 
                          justifyContent: 'center',
                          alignItems: 'center',
                          opacity: !disabled ? 1.0 : 0.5
                      }
                  }>
                  <Image
                      style={{ 
                          width: 25, 
                          height: 25,
                          paddingRight: 30
                      }}
                      resizeMode={'contain'}
                      source={require('../../../../_shared/images/icons/submitIcon.png')} 
                  />
              </View>
          </TouchableOpacity>
      )
    }
}