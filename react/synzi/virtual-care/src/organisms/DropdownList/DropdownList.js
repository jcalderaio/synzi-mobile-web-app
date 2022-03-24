import React, { Component } from 'react'
import {Text, View, Picker} from 'react-native';
import PropTypes from 'prop-types'
import RNPickerSelect from 'react-native-picker-select'
import { SynziColor } from '../../../../_shared/Color'

import styles from './styles'

export default class DropdownList extends Component {
  static propTypes = {
    /** Label text for the input selected */
    label: PropTypes.string,
    /** The current selected value in the dropdown */
    value: PropTypes.string,
    placeholder: PropTypes.object,
    disabled: PropTypes.bool
  }
  static defaultProps = {
    label: '',
    placeholder: {},
    disabled: false
  }

  render() {
    const {
      label,
      items,
      style,
      value,
      placeholder,
      defaultValue,
      onValueChange,
      disabled
    } = this.props

    return (
      <View style={style}>
        <View>
          <Text style={styles.labelStyle}>{label}:</Text>
        </View>
        <View style={styles.dropdownWrapper}>
          <RNPickerSelect 
            useNativeAndroidPickerStyle={false}
            items={items}
            value={value}
            placeholder={placeholder}
            onValueChange={onValueChange}
            disabled={disabled}
            style={styles.dropdownInput}
          />
        </View>
      </View>
    )
  }
}
