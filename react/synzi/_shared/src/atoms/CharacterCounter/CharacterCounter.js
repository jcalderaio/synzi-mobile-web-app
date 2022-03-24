import React, { Component } from 'react'
import {Text, View} from 'react-native';
import PropTypes from 'prop-types'

import styles from './styles'

export default class CharacterCounter extends Component {
  static propTypes = {
    /** Text to be tested for count */
    text: PropTypes.string.isRequired,
    /** Number for maximum allowed text length */
    maxLength: PropTypes.number.isRequired,
  }

  render() {
    const { text, maxLength, style } = this.props

    let textStyle = ''
    if (text.length > maxLength) {
      textStyle = styles.charactercounterOverMax
    } else if (text.length / maxLength > 0.75) {
      textStyle = styles.charactercounter75
    } else {
      textStyle = styles.charactercounter
    }

    return (
      <View
        style={styles.charactercounter}
      >
        <Text style={{ color: 'white' }}>
          <Text style={textStyle}>{text.length}</Text> of {maxLength}
        </Text>
      </View>
    )
  }
}
