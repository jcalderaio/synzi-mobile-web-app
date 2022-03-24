import React, { PureComponent } from 'react'
import { View, Text, Modal, ActivityIndicator } from 'react-native'

import { AsyncStorage } from 'react-native';
import { AppConfig, isVirtualCare } from '../../../constants/AppConfig'
import EnvManager from '../../../services/EnvManager'
import deviceLog from 'react-native-device-log'
import DeviceInfo from 'react-native-device-info';

import ApolloClient from 'apollo-boost'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider, Query } from 'react-apollo'
import EnvQL from '../../../graphql/EnvQL'
import Reactotron from 'reactotron-react-native'

import styles from './styles'

export default class InitializeEnvironment extends PureComponent {
    constructor(props) {
        super(props)
        // Reactotron.log(">>>>>>>>>> InitializeEnvironment :: URL prop:", this.props)

        this.DEFAULT_GRAPHQL_URL = 'https://api.care.synzi.com/api'

        this.state = {
            graphQLUrl: '',
            client: null,
            useLegacyApi: false,
        }

        this.setupEnv = this.setupEnv.bind(this)
        this.setupApolloClient = this.setupApolloClient.bind(this)
        this.initializeApiUrl = this.initializeApiUrl.bind(this)
    }

    componentWillMount(){
        this.initializeApiUrl()
    }

    initializeApiUrl(useLegacyApi=false, retryUrl='') {
        Reactotron.warn("InitializeEnvironment initializeApiUrl")
        // Reactotron.log(">>>>>>>>>> initializeApiUrl() :: useLegacyApi? ", useLegacyApi, " :: retry url:", retryUrl)
        this.setState({ graphQLUrl:'', client:null, useLegacyApi: useLegacyApi })

        //Load Environment for Synzi
        const bundleId = DeviceInfo.getBundleId();
        const buildNumber = String(DeviceInfo.getBuildNumber());
        const brand = DeviceInfo.getBrand();
        const readableVersion = DeviceInfo.getReadableVersion();
        const systemName = DeviceInfo.getSystemName();
        const systemVersion = DeviceInfo.getSystemVersion();
        const appName = DeviceInfo.getApplicationName();

        
        Reactotron.log(`APP-LAUNCH: ${appName} ${readableVersion}`)
        deviceLog.log(`APP-LAUNCH: ${appName} ${readableVersion}`)

        
        Reactotron.log(`STATS: bundleId: ${bundleId}, System: ${systemName}, System Version: ${systemVersion}, Hardware: ${brand}`)
        deviceLog.log(`STATS: bundleId: ${bundleId}, System: ${systemName}, System Version: ${systemVersion}, Hardware: ${brand}`)

        //TODO: Move to EnvManager as default values?
        EnvManager.getInstance().setGraphQLUrl('')
        EnvManager.getInstance().setEnvName('')
        EnvManager.getInstance().setCode('')
        EnvManager.getInstance().setRestUrl('')
        EnvManager.getInstance().setSocketUrl('')
        EnvManager.getInstance().setJitsiUrl('')
        EnvManager.getInstance().setAssetsUrl('')

        if (retryUrl) {
            Reactotron.log("InitializeEnvironment ---> initializeApiUrl() --> retryUrl")
            this.setupApolloClient(retryUrl)
        } else {
            try {
                AsyncStorage.getItem(AppConfig.GRAPHQL_URL_KEY).then(response => {
                    Reactotron.warn("InitializeEnvironment ---> initializeApiUrl() --> graphql_url_key found. goto setupApolloClient")
                    const graphQLUrl = response ? response : this.DEFAULT_GRAPHQL_URL
                    this.setupApolloClient(graphQLUrl)
                })
            } catch (e) {
                Reactotron.log(">>>>>>>>>> catching local storage error and using default url")
                // not local storage not found, use default
                this.setupApolloClient(this.DEFAULT_GRAPHQL_URL)
            }
        }
    }

    setupApolloClient(graphQLUrl) {
        Reactotron.warn("InitializeEnvironment >>>>>>>>>> setupApolloClient() :: graphQLUrl:", graphQLUrl)
        deviceLog.log(`setupApolloClient() :: ${graphQLUrl}`)

        //reset error handling
        this.ignoreErrorInRender = false

        //NOTE: Set then get url in EnvManager so it can handle prefix (https), etc.
        EnvManager.getInstance().setGraphQLUrl(graphQLUrl)
        global.SYNZI_client = new ApolloClient({
            uri:EnvManager.getInstance().getGraphQLUrl(),
            cache: new InMemoryCache(),
            request: async (operation) => {
                const token = await AsyncStorage.getItem(AppConfig.AUTH_TOKEN)
                //Reactotron.warn("WelcomePage.native.js --> setupApolloClient " + token)  
                operation.setContext({
                    headers: {
                        authorization: token ? `Bearer ${token}` : "",
                    },
                })
            },
            onError: ({ graphQLErrors, networkError, operation }) => {
                Reactotron.log("********* operation:", operation.query.loc.source.body)
                if (graphQLErrors) {
                    Reactotron.log(graphQLErrors)
                    //special case for 2.1.3 release testing while 2.1.2 is running in prod-live env
                    const message = graphQLErrors[0].message
                    deviceLog.log(`GRAPHQL ERROR: ${message}`)
                    if (message.indexOf('Cannot query field "currentEnv"') > -1) {
                        Reactotron.log(">>>>>>>>>> ENV NOT YET UPDATED")
                        deviceLog.log("ENV not updated - retrying w/legacy api")

                        this.ignoreErrorInRender = true

                        // need to keep environment selection that error handling in render() will reset
                        const retryUrl = EnvManager.getInstance().getGraphQLUrl()

                        // need a short wait here to allow the render() function to process the error 
                        // before we restart the process
                        setTimeout(() => {
                            this.initializeApiUrl(true, retryUrl)
                        }, 20)
                    }
                }
                if (networkError) {
                    Reactotron.log(networkError)
                    deviceLog.log(`NETWORK ERROR: ${networkError}`)
                }
            },
        })

        this.setState({ graphQLUrl, client: global.SYNZI_client })
    }

    // Push info for object with environment urls into EnvManager
    setupEnv(currentEnv) {
    	Reactotron.warn("InitializeEnvironment >>>>>>>>>> setupEnv() :: currentEnv:", currentEnv)
        deviceLog.log("setupEnv() :: currentEnv:", currentEnv)

        //"foundIt" is used to show error message in render() below, if necessary
    	var foundIt = false

        if (currentEnv) {
            foundIt = true
            EnvManager.getInstance().saveEnvironment(currentEnv)
   
            global.SYNZI_vcMinVersion = currentEnv.vcMinVersion
            global.SYNZI_ccMinVersion = currentEnv.ccMinVersion
            global.SYNZI_graphqlUrl = currentEnv.graphqlUrl
            this.props.initialized()
        }

    	return foundIt
    }

    //
    //handle case where null is returned (happens if config on server doesn't match environment data)
    setupEnvLegacy(envs) {
        Reactotron.warn("InitializeEnvironment >>>>>>>>>> setupEnvLegacy() :: envs:", envs)
        deviceLog.log("setupEnvLegacy()")

        //"foundIt" is used to show error message in render() below, if necessary
        var foundIt = false

        const currentUrl = this.state.graphQLUrl.toLowerCase()
        for (var i=0; i<envs.length; ++i) {
            if (envs[i][AppConfig.GRAPHQL_URL_KEY].toLowerCase().indexOf(currentUrl) > -1) {
                foundIt = true
                EnvManager.getInstance().saveEnvironment(envs[i])
            }
        }

        if (foundIt) {
            global.SYNZI_vcMinVersion = envs.vcMinVersion
            global.SYNZI_ccMinVersion = envs.ccMinVersion
            global.SYNZI_graphqlUrl = envs.graphqlUrl
            this.props.initialized()
        }

        return foundIt
    }

    // Loading splash while app is initializing
    getLoadingIndicator() {
	    const appName = (isVirtualCare() === true) ? 'Virtual Care' : 'Care Connect'
	    const message1 = `${appName}`
	    const message2 = `Initializing`
        return (
              <View style={styles.mainContainerStyle}>
                <Text style={styles.callerNameTextStyle}>{message1}</Text>
                  <View>
                    <ActivityIndicator 
                      size={'large'} 
                      color={'white'}
                      style={styles.loadingContainerStyle} 
                    />
                  </View>
                <Text style={styles.callerNameTextStyle}>{message2}</Text>
              </View>
        )

    }

    getErrorDisplay() {
	    const appName = (isVirtualCare() === true) ? 'Virtual Care' : 'Care Connect'
        return (
            <Modal transparent={true}>
              <View style={styles.mainContainerStyle}>
                <Text style={styles.callerNameTextStyle}>{appName}{'\n'}</Text>
                <Text style={styles.errorTextStyle}>Could not reach the server at this time.{'\n'}</Text>
                <View style={{ paddingHorizontal: 40 }}>
                    <Text style={styles.errorTextStyle}>Please check your wifi and cellular data and try again.</Text>
                </View>
              </View>
            </Modal>
        )
    }


  render() {
    Reactotron.warn("InitializeEnvironment RENDER")
    const { graphQLUrl, client, useLegacyApi } = this.state
    // Reactotron.log(">>>>>>>>>>>>>>>>> render() :: use legacy api? " + useLegacyApi + " :: graphQLUrl:", graphQLUrl)

    if (client) {
        return (
            <ApolloProvider client={client}>
                <Query query={(useLegacyApi) ? EnvQL.getEnvironments() : EnvQL.currentEnv()}>
                {({ loading, error, data }) => {
                    // NOTE: Nothing special for loading, the indicator is already showing (see below)
                    // Reactotron.log(">>>>>>>>>> loading:", loading)
                    // Reactotron.log('>>>>>>>>>> data:', data)
                    // Reactotron.log(">>>>>>>>>> legacy?", useLegacyApi)

                    if (error) {
                    	// Reactotron.log('>>>>>>>>>> error:', error)
                     //    Reactotron.log('>>>>>>>>>> ignore?', this.ignoreErrorInRender)
                        // if on prod show error, otherwise retry production - solves case where env like prod-staging is turned off
                        if (EnvManager.getInstance().getGraphQLUrl() === this.DEFAULT_GRAPHQL_URL) {
                        	return this.getErrorDisplay()
                        } else if (!this.ignoreErrorInRender) {
                            AsyncStorage.removeItem(AppConfig.GRAPHQL_URL_KEY)
                            this.initializeApiUrl()
                        }
                    } else if (!loading && data && data.currentEnv) {
                		const foundIt = this.setupEnv(data.currentEnv)
                		if (!foundIt) return this.getErrorDisplay()
                    } else if (!loading && data && data.envs) {
                        const foundIt = this.setupEnvLegacy(data.envs)
                        if (!foundIt) return this.getErrorDisplay()
                    }

                    return this.getLoadingIndicator()

                }}
                </Query>
            </ApolloProvider>
        )

    } else {
        return this.getLoadingIndicator()
    }
  }
}

