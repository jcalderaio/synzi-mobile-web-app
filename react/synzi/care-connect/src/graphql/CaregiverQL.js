import gql from 'graphql-tag'

class CaregiverQL {

  getAssociatedPatientsByCaregiverUserId() {
    return gql`
      query getPatientsByUserId($id: ID!) {
        user(where: { id: $id }) {
          id
          caregiver {
            id
            patients {
              id
              user {
                id
                displayName
                profileImage
                overallStatus
                isActive
              }
            }
          }
        }
      }
    `
  }

}

export default new CaregiverQL()