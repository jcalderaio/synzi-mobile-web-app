import React, { Component } from 'react'
import {
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types'
import { AppColor, SynziColor } from '../../../Color';


export default class MessageButton extends Component {
    static propTypes = {
        /** Flag that notates whether button should be dimmed */
        isActive: PropTypes.bool,
        /** Size of the button (it's round, so same width/height) */
        size: PropTypes.number,
        /** Function to call when button pressed */
        onPress: PropTypes.func.isRequired,
    }

    static defaultProps = {
        isActive: true,
        size: 50
    }

    render() {

        const { isActive, size, onPress } = this.props
        var messageIconColor = SynziColor.SYNZI_BLUE

        return (
          <TouchableOpacity
              disabled={!isActive} 
              onPress={onPress}>
              <View 
                  style={
                      {
                          width: size, 
                          height: size,
                          borderRadius : size/2,
                          backgroundColor: isActive ? messageIconColor : AppColor.USER_DISCONNECTED_COLOR, 
                          justifyContent: 'center',
                          alignItems: 'center',
                          opacity: isActive ? 1.0 : 0.5
                      }
                  }>
                  <Image
                      style={{ 
                          width: 25, 
                          height: 25,
                      }}
                      resizeMode={'contain'}
                      source={require('../../../images/icons/messageIcon.png')} 
                  />
              </View>
          </TouchableOpacity>
      )
    }
}