import gql from 'graphql-tag'

class AuthQl {
  login() {
    return gql`
    mutation loginUser($username: String!, $password: String!, $app: String!, $deviceId: String!, $platform: String!) {
      tokenAuth(
        data: {
          username: $username
          password: $password
          app: $app
          deviceId: $deviceId
          platform: $platform
        }
      ) {
        accessToken
      }
    }
    `
  }

  checkPasswordExpiration() {
    return gql`
      query checkPasswordExpiration($userId: ID!) {
        user(where: { id: $userId }) {
          credentials {
            daysToExpire
          }
          enterprise {
            staffPasswordWarning
          }
        }
      }
    `
  }

  forgotPassword() {
    return gql`
      mutation forgotPassword($username: String!) {
        forgotPassword(where: { username: $username }) {
          ok
        }
      }
    `
  }

  logout() {
    return gql`
      mutation LogoutUser {
        logout {
          status
        }
      }
    `
  }

}

export default new AuthQl()
