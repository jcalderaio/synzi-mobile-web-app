// @flow

// FIXME The bundler-related (and the browser-related) polyfills were born at
// the very early days of prototyping the execution of lib-jitsi-meet on
// react-native. Today, the feature base/lib-jitsi-meet should not be
// responsible for such polyfills because it is not the only feature relying on
// them. Additionally, the polyfills are usually necessary earlier than the
// execution of base/lib-jitsi-meet (which is understandable given that the
// polyfills are globals). The remaining problem to be solved here is where to
// collect the polyfills' files.
import './features/base/lib-jitsi-meet/native/polyfills-bundler';

// FIXME: Remove once react-native-webrtc and react-native-prompt import
// PropTypes from 'prop-types' instead of 'react'.
import './features/base/react/prop-types-polyfill';

import React, { Component } from 'react';
import { AppRegistry, Linking, NativeModules, View, Platform, AsyncStorage } from 'react-native';

// Check if user needs to download new version
import DeviceInfo from 'react-native-device-info';
import AppLink from 'react-native-app-link';

import { App } from './features/app';
import { equals } from './features/base/redux';
import { IncomingCallApp } from './features/mobile/incoming-call';
import { AppConfig, LogSeparator } from './synzi/_shared/constants/AppConfig'

import OfflineNotice from './synzi/_shared/src/organisms/OfflineNotice/OfflineNotice'
import InitializeEnvironment from './synzi/_shared/src/organisms/InitializeEnvironment/InitializeEnvironment'

import FlashMessage from "react-native-flash-message";

import Reactotron, { networking } from 'reactotron-react-native'

if(__DEV__) {
    const scriptURL = NativeModules.SourceCode.scriptURL;
    const scriptHostname = scriptURL.split('://')[1].split(':')[0];
    Reactotron.configure({host:scriptHostname}).useReactNative().use(networking()).connect().clear()
} 

/**
 * The type of the React {@code Component} props of {@link Root}.
 */
type Props = {

    /**
     * The URL, if any, with which the app was launched.
     */
    url: Object | string
};

/**
 * The type of the React {@code Component} state of {@link Root}.
 */
type State = {

    /**
     * The URL, if any, with which the app was launched.
     */
    url: ?Object | string
};

/**
 * React Native doesn't support specifying props to the main/root component (in
 * the JS/JSX source code). So create a wrapper React Component (class) around
 * features/app's App instead.
 *
 * @extends Component
 */
class Root extends Component<Props, State> {
    /**
     * Initializes a new {@code Root} instance.
     *
     * @param {Props} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);

        this.state = {
            url: null,
            envLoaded: false
        };

        /** ST-332 - we are going to block comment the whole url loaded mechanism as we only care of branch links, 
         * we are not trying to launch video as of now */
        
        // Handle the URL, if any, with which the app was launched. But props
        // have precedence.

        // if (typeof this.props.url === 'undefined') {
        //     this._getInitialURL()
        //         .then(url => {
        //             if (typeof this.state.url === 'undefined') {
        //                 this.setState({ url });
        //             }
        //         })
        //         .catch(err => {
        //             Reactotron.error('Failed to get initial URL', err);

        //             if (typeof this.state.url === 'undefined') {
        //                 // Start with an empty URL if getting the initial URL
        //                 // fails; otherwise, nothing will be rendered.
        //                 this.setState({ url: null });
        //             }
        //         });
        // }
    }

    /**
     * Gets the initial URL the app was launched with. This can be a universal
     * (or deep) link, or a CallKit intent in iOS. Since the native
     * {@code Linking} module doesn't provide a way to access intents in iOS,
     * those are handled with the {@code LaunchOptions} module, which
     * essentially provides a replacement which takes that into consideration.
     *
     * @private
     * @returns {Promise} - A promise which will be fulfilled with the URL that
     * the app was launched with.
     */
    componentDidMount() {
        // Set VC tab to staff so it goes back to main tab when app killed
        AsyncStorage.setItem(AppConfig.LAST_TAB, 'staff')
        // Set CC tab to home so it goes back to main tab when app killed
        AsyncStorage.setItem(AppConfig.LAST_CCTAB, 'home')
    }

    _getInitialURL() {
        Reactotron.warn("index.native.js _getInitialURL()")
        if (NativeModules.LaunchOptions) {
            return NativeModules.LaunchOptions.getInitialURL();
        }

        return Linking.getInitialURL();
    }

    /**
     * Implements React's {@link Component#componentWillReceiveProps()}.
     *
     * New props can be set from the native side by setting the appProperties
     * property (on iOS) or calling setAppProperties (on Android).
     *
     * @inheritdoc
     */
    componentWillReceiveProps({ url }) {
        equals(this.props.url, url) || this.setState({ url: url || null });
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { url, envLoaded } = this.state;

        // XXX We don't render the App component until we get the initial URL.
        // Either it's null or some other non-null defined value.
        if (typeof url === 'undefined' || !envLoaded) {
            Reactotron.warn("index.native.js Return <InitializeEnvironment>")
            return <React.Fragment>
                <InitializeEnvironment 
                    url={url}
                    initialized={()  => {
                        this.setState({ envLoaded: true })
                    }}
                />
            </React.Fragment>
        }

        const {
            // The following props are forked in state:
            url: _, // eslint-disable-line no-unused-vars

            // The remaining props are passed through to App.
            ...props
        } = this.props;

        Reactotron.warn("index.native.js Return <App />")

        return (
            <React.Fragment>
                <OfflineNotice />
                {/**  Check version*/}
                <App
                    { ...props }
                    url={url}
                />  
                <FlashMessage position="top"/>
            </React.Fragment>
        );
        
    }
}

// Register the main/root Component of JitsiMeetView.
AppRegistry.registerComponent('App', () => Root);

// Register the main/root Component of IncomingCallView.
AppRegistry.registerComponent('IncomingCallApp', () => IncomingCallApp);
