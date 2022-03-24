import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform
} from 'react-native';

import SynziLogo from '../../../../_shared/images/logos/synzi_blue_logo.png'

export default class SynziTapableLogoView extends Component {

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
            const envPicker = this.props.nav.getParam('handleEnvPicker')
            if(envPicker){
                envPicker()
            }
        } else {
            this.timerId = setTimeout(() => this.resetCount(), 500)
        }
    }

    render() {
        return (
            <TouchableOpacity onPress={this.onPress} activeOpacity={100}>
                <Image
                    style = {{
                        width: 70,
                        height: 30,
                        marginLeft: Platform.OS === 'android' ? 20 : 0
                    }}
                    resizeMode={'contain'}
                    source={SynziLogo}
                />
            </TouchableOpacity>
        )
    }
}