import React, { Component } from 'react'
import {
  View,
  FlatList,
  Text,
  Platform,
  TouchableHighlight,
  Image,
  AsyncStorage
} from 'react-native'
import { AppConfig } from '../../../../_shared/constants/AppConfig'
import EnvManager from '../../../services/EnvManager'
import styles from './styles';



export default class EnvironmentPickerView extends Component {

    constructor(props) {
        super(props)

        this.state = { 
          data:this.props.pickerData,
        }
      
    }


    renderSeparator = () => {
        return (
            <View
                style={{
                  height: Platform.OS === 'ios' ? 1 : 0.5,
                  width: '100%',
                  backgroundColor: '#666666',
                }}
            />
        )
    }

    renderImage = selected => {
        if (selected) {
            return (
                <Image
                  style={styles.pickerCheckMarkImage}
                  resizeMode={'center'}
                  source={require('../../../../_shared/images/icons/checkmark.png')}
                />
            )
        }
        return null
    }


    pickerRowSelected = index => {
        this.newState = this.state.data.map((value, i) => {
            value.selected = false
            if (index === i) {
                EnvManager.getInstance().saveEnvironment(value)
                return { ...value, selected: !value.selected }
            }
            return value
        })

        // clearTimeout(this.selectionTimer)
        // this.selectionTimer = setTimeout(() => this.props.pickerCancelled(), 500)
        this.setState({ data: this.newState })

        this.props.pickerRowSelected()
    }

    renderItem = ({ item, index, separators }) => {

        if(!item.isActive){
            return(
                <View style={styles.pickerItemWrapperStyle}>
                    <View style={styles.pickerItemStyle}>
                        <Text style={styles.pickerItemHeaderInActiveTextStyle}>{item.name} (currently inactive)</Text>
                        <Text style={styles.pickerItemSubHeaderTextStyle}>{item.restUrl}</Text>
                    </View>
                    <View style={styles.pickerItemCheckMark}>
                        {this.renderImage(item.selected)}
                    </View>
                </View>
            )
        }

        return (
            <TouchableHighlight
                onPress={() => this.pickerRowSelected(index)}
                onShowUnderlay={separators.highlight}
                onHideUnderlay={separators.unhighlight}
                activeOpacity={90}>
                <View style={styles.pickerItemWrapperStyle}>
                    <View style={styles.pickerItemStyle}>
                        <Text style={styles.pickerItemHeaderTextStyle}>{item.name} ({item.code})</Text>
                        <Text style={styles.pickerItemSubHeaderTextStyle}>{item.restUrl}</Text>
                    </View>
                    <View style={styles.pickerItemCheckMark}>
                        {this.renderImage(item.selected)}
                    </View>
                  </View>
            </TouchableHighlight>
        )
    }


    renderLoadingItem(){
        return(
            <SynziSpinner size={'large'}/>
        )
    }

    renderList(){
        return(
            <FlatList
                ItemSeparatorComponent={this.renderSeparator}
                data={this.state.data}
                keyExtractor={item => item.name}
                renderItem={rowData => this.renderItem(rowData)}
            />
        )
    }

    render() {
        return (
            <View >
                {this.renderList()}
            </View>
        )
    }
}
