import React, { Component } from 'react'
import {
    TouchableOpacity,
    Alert,
    Image
} from 'react-native';
import PropTypes from 'prop-types'

import styles from './styles'
import MenuImage from '../../../../care-connect/src/images/hamburger.png'

export default class MenuButton extends Component {
  static propTypes = {
    /** Function when press menu */
    menuPress: PropTypes.func.isRequired
  }

    constructor(props) {
        super(props)
    }
    
    render() {
      
        const { menuPress } = this.props

        return(
                <TouchableOpacity 
                    onPress={() => menuPress()}
                    style={{paddingLeft: 5}}
                >
                    <Image
                        style = {styles.menuButtonStyle}
                        resizeMode={'contain'}
                        source={MenuImage}
                    />
                </TouchableOpacity>
        ) 
        
    }

}