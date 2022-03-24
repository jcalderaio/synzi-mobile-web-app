import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import { CachedImage } from "react-native-img-cache";
import PropTypes from 'prop-types'
import styles from './styles';

import GenericUserIconLarge from '../../../images/icons/genericUserIconLarge.png'

export default class AvatarRelated extends Component {
  static propTypes = {
    /** Image for the primary person */
    primaryImage: PropTypes.string.isRequired,
    /** Image for the relater person */
    secondaryImage: PropTypes.string.isRequired,
    /** display name of associated patient */
    secondaryDisplayName: PropTypes.string.isRequired
  }

  renderCachedPrimaryImage(profileImage){
    return(
        <CachedImage
            style={
                {
                    width:136,
                    height:136,
                    borderRadius : 68,
                    borderColor: 'white',
                    borderWidth: 1.0,
                    opacity:1.0,
                }
            }
            source={{ uri: profileImage }} 
        />
    )
  }

  renderPrimaryDefaultImage(){
      return(
          <Image
              style={styles.incomingPrimaryAvatarStyle}
              resizeMode={'cover'}
              source={GenericUserIconLarge}
          />
      )
  }

  renderCachedSecondaryImage(profileImage){
    return(
        <CachedImage
            style={
                {
                    width: 70,
                    height: 70,
                    borderRadius : 35,
                    borderColor: 'white',
                    borderWidth: 1.0,
                    opacity:1.0,
                }
            }
            source={{ uri: profileImage }} 
        />
    )
  }

  renderSecondaryDefaultImage(){
      return(
          <Image
              style={styles.incomingSecondaryAvatarStyle}
              resizeMode={'cover'}
              source={GenericUserIconLarge}
          />
      )
  }

  render() {
    const { primaryImage, secondaryImage, secondaryDisplayName } = this.props

    return (
      <View style={styles.mainContainerStyle}>
        <View style={styles.primaryImageContainer}>
          {primaryImage != '' ? this.renderCachedPrimaryImage(primaryImage) : this.renderPrimaryDefaultImage()}
        </View>

        <View style={styles.secondaryContainer}>
          <Text style={styles.incomingCallTextStyle}>Regarding</Text>
          <Text style={styles.callerNameTextStyle}>{secondaryDisplayName}</Text>

          <View style={styles.secondaryImageContainer}>
            {secondaryImage != '' ? this.renderCachedSecondaryImage(secondaryImage) : this.renderSecondaryDefaultImage()}
          </View>
        </View>
      </View>
    )
  }
}
