import React from 'react'
import { 
    View, 
    StatusBar,
    Button
} from 'react-native'
import { LogView } from 'react-native-device-log'
import styles from './styles'


export default class LogsContainerView extends React.Component {
    
    static navigationOptions = ({ navigation }) => {

        const params = navigation.state.params || {};
     
        return {
            headerLeft: (
                <Button
                    onPress={() => navigation.dismiss()}
                    title='OK'
                    color='black'
                />
            )
        }
    }
    componentDidMount(){
        StatusBar.setBarStyle('dark-content', true)
    }

    componentWillUnmount(){
        StatusBar.setBarStyle('light-content', true)
    }

    render() {

        return (
            <View style={styles.containerStyle}>
                <LogView inverted={false} multiExpanded={false} timeStampFormat='HH:mm:ss'></LogView>
            </View>
        )
    }
}