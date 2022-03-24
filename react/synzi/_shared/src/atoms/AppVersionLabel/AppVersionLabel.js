import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import styles from './styles';
import { AppConfig } from '../../../../_shared/constants/AppConfig'
import EnvManager from '../../../../_shared/services/EnvManager'
import DeviceInfo from 'react-native-device-info';
import Reactotron from 'reactotron-react-native'

export default class AppVersionLabel extends Component {

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
        Reactotron.log(" ==========================> PRESS count = " + this.state.envHitCount)
        clearTimeout(this.timerId)
        if (this.state.envHitCount === 4) {
            this.timerId = null
            this.props.fivePressTap()
        } else {
            this.timerId = setTimeout(() => this.resetCount(), 500)
        }
    }

    render() {
        return (
            <TouchableOpacity onPress={this.onPress} activeOpacity={100}>
                <View style={styles.labelContainerStyle}>
                    <Text style={styles.boldTextStyle}>{`${DeviceInfo.getReadableVersion()} ${EnvManager.getInstance().getEnvShortName()}`}</Text>
                    <Text style={styles.normalTextStyle}>{AppConfig.synziCopyrightString}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}