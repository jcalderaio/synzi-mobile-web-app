import React, { Component } from 'react'
import {
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Platform
} from 'react-native';
import DeleteIcon from 'react-native-vector-icons/Ionicons'
import { CachedImage } from "react-native-img-cache";
import styles from './styles';


export default class SearchBarView extends Component {

    constructor(props) {
        super(props)
    }

    // returnCloseButton(){

    //     return(
    //         <TouchableOpacity 
    //             onPress={this.props.closeSearch} 
    //             style={styles.searchCloseButtonStyle}
    //             disabled={false}>
    //             <Image
    //                 style = {{
    //                     width: 30,
    //                     height: 30,
    //                 }}
    //                 resizeMode={'contain'}
    //                 source={require('../../../../_shared/images/icons/searchCloseButton.png')}
    //             />
    //         </TouchableOpacity>
    //     )
    // }
    
    render() {

        const { searching, logoImage } = this.props

        const logoUrl = logoImage ? logoImage : ''

        return(
            <View style={styles.searchBarContainerStyle}>
                <View style={styles.searchButtonContainerStyle}>
                    <Image
                        style={styles.iconSize}
                        resizeMode={'contain'}
                        source={require('../../../../_shared/images/icons/searchIcon.png')}
                    />
                    <TextInput
                        underlineColorAndroid="transparent"
                        secureTextEntry={false}
                        keyboardType={'default'}
                        placeholder={'Search'}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        style={styles.inputStyle}
                        value={this.props.searchTerm}
                        onChangeText={this.props.onChangeText}
                        onFocus={this.props.onFocus}
                        onSubmitEditing={this.props.onSubmitEditing}
                        returnKeyType={this.props.ready ? 'done' : null}
                    />
                </View>
                {(logoUrl !== '') && 
                    <CachedImage 
                        style = {{
                            width: 200,
                            height: 50,
                        }}
                        resizeMode={'contain'}
                        source={{ uri: logoUrl }} 
                    />
                }
                {logoUrl === '' && 
                    <Image
                        style = {{
                            width: 200,
                            height: 50,
                        }}
                        resizeMode={'contain'}
                        source={require('../../../../_shared/images/logos/logo_placeholder.png')}
                    />
                }
                <View style={styles.searchCloseButtonContainerStyle}>
                    {searching &&
                        <DeleteIcon 
                            onPress={this.props.closeSearch}
                            name="ios-close" 
                            style={styles.searchCloseButtonStyle} 
                            size={55} 
                            //color="grey" 
                        />
                    }
                </View>
            </View>
        ) 
        
    }

}

