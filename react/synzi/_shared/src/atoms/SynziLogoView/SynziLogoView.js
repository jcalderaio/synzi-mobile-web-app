import React, { Component } from 'react'
import {
    View,
    Image
} from 'react-native';


export default class SynziLogoView extends Component {

    render() {
  
        if(this.props.isBlue){
            return (
                <View>
                    <Image
                        style = {{
                            width: this.props.width ? this.props.width : 250, 
                            height: this.props.width ? this.props.width/.24 : 60,
                        }}
                        resizeMode={'contain'}
                        source={require('../../../images/logos/synzi_blue_logo.png')}
                    />
                </View>
            )
        }

        if(this.props.isWhite){
            return (
                <View>
                    <Image
                        style = {{
                            width: this.props.width ? this.props.width : 250, 
                            height: this.props.width ? this.props.width/.24 : 60,
                        }}
                        resizeMode={'contain'}
                        source={require('../../../images/logos/synzi_white_logo.png')}
                    />
                </View>
            )
        }
       
        return (
            <View>
                <Image
                    style = {{
                        width: this.props.width ? this.props.width : 250, 
                        height: this.props.width ? this.props.width/.24 : 60,
                    }}
                    resizeMode={'contain'}
                    source={require('../../../images/logos/synzi_black_logo.png')}
                />
            </View>
        )
    }
}