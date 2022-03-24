import {
    AsyncStorage
} from 'react-native'

import { AppConfig, LogSeparator} from '../../_shared/constants/AppConfig'
import deviceLog from 'react-native-device-log'
import Reactotron from 'reactotron-react-native'

const debugLocal = false

export default class EnvManager {

    static myInstance = null

    static getInstance() {
        if (EnvManager.myInstance == null) {
            EnvManager.myInstance = new EnvManager()
        }
        
        return this.myInstance;
    }
    
   
    getEnvShortName(){
        if(this.getCode() === 'prod'){
            return ''
        }
        return `(${this.code})`
    }


    getEnvName(){
        return String(this.envName)
    }

    setEnvName(value){
        this.envName = value
    }

    //Code
    getCode(){
        return String(this.code)
    }

    setCode(value){
        this.code = value
    }


    //RestUrl
    setRestUrl(value){
        this.restUrl = value
    }

    getRestUrl(){
        if(debugLocal){
            return 'https://api-danny.synzi.com'
        }
        return String(this.restUrl)
    }


    //GraphQL
    setGraphQLUrl(value){
        this.graphQLUrl = value
    }

    getGraphQLUrl(){
        if(debugLocal){
            return 'https://api-danny.synzi.com/api'
        }
        return String(this.graphQLUrl)
    }

    //Socket URL
    setSocketUrl(value){
        this.socketUrl = value
    }

    getSocketUrl(){
        if(debugLocal){
            return 'https://api-danny.synzi.com'
        }
        return String(this.socketUrl)
    }


    //Jitsi URL
    setJitsiUrl(value){

        var pattern = /^((http|https|ftp):\/\/)/;

        if(!pattern.test(value) && value !== "") {
            value = "https://" + value;
        }

        this.jitsiUrl = value
    }

    getJitsiUrl(){
        if(debugLocal){
            return 'https://beta.meet.jit.si'
        }
        return this.jitsiUrl ? String(this.jitsiUrl) : ''
    }


    //Assets Url
    setAssetsUrl(value){
        this.assetsUrl = value
    }

    getAssetsUrl(){
        return String(this.assetsUrl)
    }
      


    saveEnvironment(urlObject){

        this.envName = urlObject[AppConfig.NAME_KEY]
        this.code = urlObject[AppConfig.CODE_KEY]
        this.graphQLUrl = urlObject[AppConfig.GRAPHQL_URL_KEY]
        this.restUrl = urlObject[AppConfig.RESTURL_URL_KEY]
        this.socketUrl =  urlObject[AppConfig.SOCKETURL_URL_KEY]
        this.assetsUrl = urlObject[AppConfig.ASSETS_URL_KEY]

        
        Reactotron.log(`Saving Environment: ${EnvManager.getInstance().getEnvName()}`) 
        Reactotron.log(`Code: ${EnvManager.getInstance().getCode()}`)
        Reactotron.log(`GraphQL URL: ${EnvManager.getInstance().getGraphQLUrl()}`)
        Reactotron.log(`Rest URL: ${EnvManager.getInstance().getRestUrl()}`)
        Reactotron.log(`Socket URL: ${EnvManager.getInstance().getSocketUrl()}`)
   
        // AsyncStorage.setItem(AppConfig.GRAPHQL_URL_KEY, urlObject[AppConfig.GRAPHQL_URL_KEY])
        AsyncStorage.multiSet([
            [AppConfig.GRAPHQL_URL_KEY,  urlObject[AppConfig.GRAPHQL_URL_KEY]],
            [AppConfig.RESTURL_URL_KEY,  urlObject[AppConfig.RESTURL_URL_KEY]],
            [AppConfig.SOCKETURL_URL_KEY,  urlObject[AppConfig.SOCKETURL_URL_KEY]],
            [AppConfig.ASSETS_URL_KEY,  urlObject[AppConfig.ASSETS_URL_KEY]],
            [AppConfig.NAME_KEY,  urlObject[AppConfig.NAME_KEY]],
            [AppConfig.CODE_KEY, urlObject[AppConfig.CODE_KEY]],
        ])
        
    }

}