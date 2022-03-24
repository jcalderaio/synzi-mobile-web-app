import { AsyncStorage } from 'react-native';
import jwtDecode from 'jwt-decode'
import { defaultTo } from 'lodash'

import { AppConfig } from '../constants/AppConfig'
import Reactotron from 'reactotron-react-native'

class AuthUtils {
  async loggedIn() {
    if (await this.getToken() && await this.getUserId()) {
      return true
    }

    return false
  }

  async logout() {
    try {
      await AsyncStorage.removeItem(AppConfig.AUTH_TOKEN)
    } catch (error) {
      Reactotron.log(`AuthUtils Logout Error: ${error}`)
    }
  }

  async setToken(token) {
    try {
        await AsyncStorage.setItem(AppConfig.AUTH_TOKEN, token)
        Reactotron.log("Auth Token set. Token:  ", token)
    } catch (error) {
        Reactotron.log(`AuthUtils setToken Error: ${error}`)
    }
  }

  async getToken() {
    try {
        const authToken = await AsyncStorage.getItem(AppConfig.AUTH_TOKEN)
        if (authToken !== null) {
            // We have data!!
            // Reactotron.log("Auth Token:  ", authToken)
            return authToken;
        } else {
            // Reactotron.log("Auth Token:  ", authToken)
            return null
        }
    } catch (error) {
        Reactotron.log(`AuthUtils getToken Error: ${error}`)
    }
  }

  async setUsername(username) {
    try {
        await AsyncStorage.setItem(AppConfig.USER_NAME, username)
        Reactotron.log("Username set. Username:  ", username)
    } catch (error) {
        Reactotron.log(`AuthUtils setUsername Error: ${error}`)
    }
  }

  async getUsername() {
    try {
        const username = await AsyncStorage.getItem(AppConfig.USER_NAME)
        Reactotron.log("getUsername:  ", username)
        return username;
    } catch (error) {
        Reactotron.log(`AuthUtils getUsername Error: ${error}`)
        return null
    }
  }

  // Usertype used through CC to change behaviors for Patients vs. Caregivers
  // FixMe: Find a better way to track the type of the currently logged in user!
  async setUserType(userType) {
    try {
        await AsyncStorage.setItem(AppConfig.USER_TYPE, userType)
    } catch (error) {
        Reactotron.log(`AuthUtils setUserType Error: ${error}`)
    }
  }

  async getUserType() {
    try {
      const userType = await AsyncStorage.getItem(AppConfig.USER_TYPE)
      if (!userType) return null

      return userType
    } catch (error) {
      Reactotron.log(`AuthUtils getUserType Error: ${error}`)
      return ''
    }
  }

  // ===== invite handling...
 
  // IMPORTANT: Pull usertype from invite token for showing appropriate login screen
  decodeUserTypeFromToken(token) {
    if (!token) return null

    let decoded = null
    try {
      decoded = jwtDecode(token)
    } catch (error) {
      return null
    }

    usertype = decoded.identity.usertype

    if (!usertype) return null

    return usertype.toString()
  }

  async setInviteToken(token) {
    try {
        await AsyncStorage.setItem(AppConfig.INVITE_TOKEN, token)
    } catch (error) {
        Reactotron.log(`AuthUtils setInviteToken Error: ${error}`)
    }
  }

  async getInviteToken() {
    try {
      const inviteToken = await AsyncStorage.getItem(AppConfig.INVITE_TOKEN)
      if (inviteToken !== null) {
           // We have data!!
          return inviteToken;
      }
      return ''
    } catch (error) {
      Reactotron.log(`AuthUtils getInviteToken Error: ${error}`)
      return ''
    }
  }

  async setNewInviteToken(token) {
    try {
        await AsyncStorage.setItem(AppConfig.NEW_INVITE_TOKEN, token)
    } catch (error) {
        Reactotron.log(`AuthUtils setNewInviteToken Error: ${error}`)
    }
  }

  async getNewInviteToken() {
    try {
      const inviteToken = await AsyncStorage.getItem(AppConfig.NEW_INVITE_TOKEN)
      if (inviteToken !== null) {
           // We have data!!
          return inviteToken;
      }
      return ''
    } catch (error) {
      //Reactotron.log(`AuthUtils setNewInviteToken Error: ${error}`)
      return ''
    }
  }
  async setCurrentInviteToken(token) {
    try {
      await AsyncStorage.setItem(AppConfig.CURRENT_USER_INVITE_TOKEN, token)
    } catch (error) {
      Reactotron.log(`AuthUtils setCurrentInviteToken Error: ${error}`)
    }
  }

  async getCurrentInviteToken() {
    try {
      const inviteToken = await AsyncStorage.getItem(AppConfig.CURRENT_USER_INVITE_TOKEN)
      if (inviteToken !== null) {
           // We have data!!
          return inviteToken;
      }
      return ''
    } catch (error) {
      Reactotron.log(`AuthUtils getCurrentInviteToken Error: ${error}`)
      return ''
    }
  }

  async getDisplayNameFromInviteToken() {
    let displayName = null
    const token = await this.getInviteToken()

    if (!token) return null

    let decoded = null

    try {
      decoded = jwtDecode(token)
    } catch (error) {
      return null
    }

    displayName = defaultTo(decoded.identity.display_name, null)

    if (!displayName) return null

    return displayName.toString()
  }
  
  async getUserId() {
    let userId = null
    const token = await this.getToken()

    if (!token) return null

    let decoded = null
    try {
      decoded = jwtDecode(token)
    } catch (error) {
      return null
    }

    userId = decoded.identity.user_id

    if (!userId) return null

    return userId.toString()
  }

  decodeUserIdFromToken(token) {
    if (!token) return null

    let decoded = null
    try {
      decoded = jwtDecode(token)
    } catch (error) {
      return null
    }

    userId = decoded.identity.user_id

    if (!userId) return null

    return userId.toString()
  }

  async setDraft(recipientId, message) {
    try {
      await AsyncStorage.setItem(recipientId, message)
    } catch (error) {
        Reactotron.log(`Message typer: ${error}`)
    }
  }

  async getDraft(recipientId) {
    try {
      const message = await AsyncStorage.getItem(recipientId)
      if (message !== null) {
          // We have data!!
          return message;
      }
      else {
        return null
      }
    } catch (error) {
        Reactotron.log(`Message typer: ${error}`)
    }
  }

  async setPermissions(permission, bool) {
    try {
      await AsyncStorage.setItem(permission, JSON.stringify(bool))
    } catch (error) {
        Reactotron.log(`Set Permission: ${error}`)
    }
  }

  async getPermissions(permission) {
    try {
      const bool = await AsyncStorage.getItem(permission)
      if (bool !== null) {
          // We have data!!
          return JSON.parse(bool)
      }
      else {
        return false
      }
    } catch (error) {
        Reactotron.log(`Get Permission: ${error}`)
    }
  }

  async setEnterpriseId(entId) {
    try {
      await AsyncStorage.setItem(AppConfig.ENTERPRISE_ID, entId)
      Reactotron.log("AuthUtils setEnterpriseId -  entId:  ", entId)
    } catch (error) {
      Reactotron.log(`AuthUtils setEnterpriseId Error: ${error}`)
    }
  }

  async getEnterpriseId() {
    try {
      const entId = await AsyncStorage.getItem(AppConfig.ENTERPRISE_ID)
      if (entId !== null) {
        // We have data!!
        Reactotron.log("AuthUtils getEnterpriseId already stored:  ", entId)
        return entId
      } else {
        entId = await this.setEnterpriseId()
        Reactotron.log("AuthUtils getEnterpriseId newly stored:  ", entId)
        return null
      }
    } catch (error) {
        Reactotron.log(`AuthUtils getEnterpriseId Error: ${error}`)
        return null
    }
  }

  async getEnterpriseIdFromInviteToken() {
    let entId = null
    const token = await this.getInviteToken()

    if (!token) return null

    let decoded = null
    try {
      decoded = jwtDecode(token)
    } catch (error) {
      return null
    }

    // Reactotron.log("DECODED INVITE TOKEN: ", decoded)

    entId = decoded.identity.enterprise_id

    if (!entId) return null

    return entId.toString()
  }

  async setEnterpriseLogo(imgUrl) {
    // try {
    //     await AsyncStorage.setItem(AppConfig.ENTERPRISE_LOGO, imgUrl)
    //     Reactotron.log("EnterpriseLogo set imgUrl:  ", imgUrl)
    // } catch (error) {
    //     Reactotron.log(`AuthUtils setEnterpriseLogo Error: ${error}`)
    // }
    Reactotron.log("AuthUtils setEnterpriseLogo :: SKIPPING LOCAL STORAGE")
  }

  async getEnterpriseLogo() {
    // try {
    //     const imgUrl = await AsyncStorage.getItem(AppConfig.ENTERPRISE_LOGO)
    //     Reactotron.log("AuthUtils getEnterpriseLogo:  ", imgUrl)
    //     return imgUrl;
    // } catch (error) {
    //     Reactotron.log(`AuthUtils getEnterpriseLogo Error: ${error}`)
    //     return null
    // }
    Reactotron.log("AuthUtils getEnterpriseLogo :: SKIPPING LOCAL STORAGE")
    return null
  }

  async getUsernameFromInvite() {
    let username = null
    const token = await this.getInviteToken()
    return this.decodeUsernameFromToken(token)
  }
  async getUsernameFromNewInvite() {
    let username = null
    const token = await this.getNewInviteToken()
    return this.decodeUsernameFromToken(token)
  }
  decodeUsernameFromToken(token) {
    if (!token) return null

    let decoded = null
    try {
      decoded = jwtDecode(token)
    } catch (error) {
      return null
    }

    username = decoded.identity.username

    if (!username) return null

    return username.toString()
  }

  transformBirthday(dob) {
    // Coming in as "MM/DD/YYYY" and leaving as "YYYY-MM-DD"
    let YYYY = dob.substring(6, 10)
    let MM = dob.substring(0, 2)
    let DD = dob.substring(3, 5)

    return `${YYYY}-${MM}-${DD}`
  }

  /******************************************************************************************
   * Create a short somewhat unique id
   *
   * returns a short string of random characters to use as an id.
   * Note: not guaranteed to be unique.
   *
   * From: https://stackoverflow.com/a/1349426/208079
   ****************************************************************************************** */
  makeId() {
    var text = ''
    var possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < 8; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length))

    return text
  }
}

export default new AuthUtils()
