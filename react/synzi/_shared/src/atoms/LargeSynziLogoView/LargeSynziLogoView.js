import React, { Component } from 'react'
import {
    View,
    Image,
    TouchableOpacity,
    Text
} from 'react-native';
import styles from './styles';

/** Should safely render at 300 pixels across or less */

export default class LargeSynziLogoView extends Component {

    constructor(props) {
        super(props)
    
        this.timerId = null
  
        this.state = {
            envHitCount: 0,
        }
    }

    async componentDidMount() {
        this.resetCount()
    }

    resetCount() {
        this.setState({
            envHitCount: 0,
        })
    }

    onPress = () => {
        this.setState({ envHitCount: this.state.envHitCount + 1 })
        clearTimeout(this.timerId)
        if (this.state.envHitCount === 4) {
            this.timerId = null
            this.props.logoFivePressTap()
        } else {
            this.timerId = setTimeout(() => this.resetCount(), 500)
        }
    }

    render() {
  
        if(this.props.isBlue){
            return (
                <TouchableOpacity onPress={this.onPress} activeOpacity={100}>
                    <View>
                        <Image
                            style={styles.size}
                            resizeMode={'contain'}
                            source={require('../../../images/logos/synzi_blue_logo.png')}
                        />
                        <Text style={styles.appTitleStyle}>Virtual Care</Text>
                    </View>
                </TouchableOpacity>
            )
        }

        if(this.props.isWhite){
            return (
                <TouchableOpacity onPress={this.onPress} activeOpacity={100}>
                    <View>
                        <Image
                            style={styles.size}
                            resizeMode={'contain'}
                            source={require('../../../images/logos/synzi_white_logo.png')}
                        />
                    </View>
                </TouchableOpacity>
            )
        }
       
        return (
            <TouchableOpacity onPress={this.onPress} activeOpacity={100}>
                <View>
                    <Image
                        style={styles.size}
                        resizeMode={'contain'}
                        source={require('../../../images/logos/synzi_black_logo.png')}
                    />
                </View>
            </TouchableOpacity>
        )
    }
}