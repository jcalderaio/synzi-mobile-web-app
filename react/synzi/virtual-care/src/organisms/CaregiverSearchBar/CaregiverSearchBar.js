import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    Platform,
    Alert,
    TextInput
} from 'react-native';
import PropTypes from 'prop-types'
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'
import SearchIcon from 'react-native-vector-icons/FontAwesome'
import DeleteIcon from 'react-native-vector-icons/Entypo'
import { LogSeparator} from '../../../../_shared/constants/AppConfig'
import { AppColor} from '../../../../_shared/Color';
import deviceLog from 'react-native-device-log'
import Reactotron from 'reactotron-react-native'

import styles from './styles'

export default class CaregiverSearchBar extends Component {
  static propTypes = {
    /** Search term from search bar */
    searchTerm: PropTypes.string.isRequired,
    /** Function to update search term */
    updateSearch: PropTypes.func.isRequired,
    /** Function to clear search bar input */
    clearSearch: PropTypes.func.isRequired,
  }

    render(){
        const { searchTerm, updateSearch, clearSearch } = this.props
 
        return(
          <View style={styles.searchBarContainer}>
            <View style={styles.searchBarWrapper}>
                <SearchIcon 
                  name="search" 
                  size={allowSidebar ? 24 : 16} 
                  color="grey" 
                />
                <TextInput
                    underlineColorAndroid="transparent"
                    maxLength={12}
                    keyboardType={Platform.OS === 'ios' ? "number-pad" : "numeric"}
                    returnKeyType={null}
                    placeholder="Enter phone number..."
                    placeholderTextColor="grey"
                    onChangeText={updateSearch}
                    style={styles.searchBarInput}
                    value={searchTerm}
                />
                {(searchTerm.length > 0) &&
                  <DeleteIcon 
                    onPress={() => clearSearch()}
                    name="circle-with-cross" 
                    style={styles.deleteIconStyle} 
                    size={allowSidebar ? 24 : 16} 
                    color="grey" 
                  />
                }
            </View>
          </View>
        )

    }

}