/** Global config shared between the 2 apps */
import DeviceInfo from 'react-native-device-info';

export class AppConfig {

    //Strings
    static synziCopyrightString = 'COPYRIGHT © 2019 SYNZI'

    //Keys
    static INVITE_TOKEN = 'invite_token'
    static AUTH_TOKEN = 'auth_token'
    static USER_ID = 'user_id'
    static USER_NAME = 'user_name'
    static USER_TYPE = 'user_type'
    static ENTERPRISE_ID = 'ent_id'
    static ENTERPRISE_LOGO = 'enterprise_logo'
    static INCOMING_CALL_ROOM_NAME = 'room_name'
    static NEW_INVITE_TOKEN = 'new_invite_token'
    static CURRENT_USER_INVITE_TOKEN = 'current_user_invite_token'
    static LAST_TAB = 'last_tab'
    static LAST_CCTAB = 'last_cctab'

    //Env Keys
    static ENV_OBJECT = 'env_object'
    static GRAPHQL_URL_KEY = 'graphqlUrl'
    static RESTURL_URL_KEY = 'restUrl'
    static SOCKETURL_URL_KEY = 'socketUrl'
    static JITSIVIDEO_URL_KEY = 'videoUrl'
    static ASSETS_URL_KEY = 'assetsUrl'
    static NAME_KEY = 'name'
    static CODE_KEY = 'code'

    //User Types
    //static USER_TYPE_STAFF = 'staff'
    static USER_TYPE_PATIENT = 'patient'
    static USER_TYPE_CAREGIVER = 'caregiver'
}


export function LogSeparator() {
    return '----------------------------------'
}

export function isVirtualCare(){
    /** TODO: We'll need to update this to the new prod bundle id's when we cut over */
    const bundleId = DeviceInfo.getBundleId();
    if(bundleId === 'com.synzi.virtualcare'){
        return true
    }
    return false
}

export function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}