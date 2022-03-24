import React, { Component } from 'react'
import { View, Text } from 'react-native'

//Styles
import styles from './styles';

export default class NoMessages extends Component {
  render() {
    return (
      <View style={styles.loadingContainerStyle}>
        {/*<Icon name="comments" size="massive" /> */}
        <View style={{ paddingHorizontal: 30}}>
          <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
            You don't have any messages yet.
          </Text>
          <Text style={{ paddingTop: 30, color: 'white', fontSize: 16, textAlign: 'center' }}>
            To send a message, click the message button Icon
            next to a Staff member or Patient.
          </Text>
        </View>
      </View>
    )
  }
}
