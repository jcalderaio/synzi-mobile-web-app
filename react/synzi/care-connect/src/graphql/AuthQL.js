import gql from 'graphql-tag'

class AuthQL {
  login() {
    // this is not very secure!
    return gql`
      mutation AltTokenAuth($username: String!, $dob: String!, $app: String!, $deviceId: String!, $platform: String!) {
        altTokenAuth(
          data: {
            username: $username
            dob: $dob
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

  caregiverLogin() {
    // this is not very secure!
    return gql`
      mutation CaregiverTokenAuth(
        $username: String!,
        $phone: String!,
        $app: String!,
        $deviceId: String!,
        $platform: String!
      
      ) {
        caregiverTokenAuth(data: {
          username: $username,
          phone: $phone,
          app: $app,
          deviceId: $deviceId,
          platform: $platform
      
        }) {
          accessToken
          refreshToken
        }
      }
    `
  }

}

export default new AuthQL()
