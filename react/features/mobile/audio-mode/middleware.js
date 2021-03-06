/* @flow */

import { NativeModules } from 'react-native';

import { APP_WILL_MOUNT } from '../../base/app';
import {
    CONFERENCE_FAILED,
    CONFERENCE_LEFT,
    CONFERENCE_JOINED,
    SET_AUDIO_ONLY
} from '../../base/conference';
import { MiddlewareRegistry } from '../../base/redux';

import Reactotron from 'reactotron-react-native'

/**
 * Middleware that captures conference actions and sets the correct audio mode
 * based on the type of conference. Audio-only conferences don't use the speaker
 * by default, and video conferences do.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(({ getState }) => next => action => {
    const AudioMode = NativeModules.AudioMode;

    if (AudioMode) {
        let mode;

        switch (action.type) {
        case APP_WILL_MOUNT:
        case CONFERENCE_FAILED:
        case CONFERENCE_LEFT:
            mode = AudioMode.DEFAULT;
            break;

        /*
         * NOTE: We moved the audio mode setting from CONFERENCE_WILL_JOIN to
         * CONFERENCE_JOINED because in case of a locked room, the app goes
         * through CONFERENCE_FAILED state and gets to CONFERENCE_JOINED only
         * after a correct password, so we want to make sure we have the correct
         * audio mode set up when we finally get to the conf, but also make sure
         * that the app is in the right audio mode if the user leaves the
         * conference after the password prompt appears.
         */
        case CONFERENCE_JOINED:
        case SET_AUDIO_ONLY: {
            if (getState()['features/base/conference'].conference
                    || action.conference) {
                mode
                    = action.audioOnly
                        ? AudioMode.AUDIO_CALL
                        : AudioMode.VIDEO_CALL;
            }
            break;
        }
        }

        if (typeof mode !== 'undefined') {
            AudioMode.setMode(mode)
                .catch(err =>
                    Reactotron.error(
                        `Failed to set audio mode ${String(mode)}: ${err}`));
        }
    }

    return next(action);
});
