import gql from 'graphql-tag'

class CaregiverQL {

  createCaregiver() {
    return gql`
      mutation createCaregiver(
        $patientUserId: ID!,
        $displayName: String!,
        $enterpriseId: ID!,
        $contactType: String!,
        $email: String!,
        $phone: String!,
        $username: String!,
        $password: String!
      ) {
        createCaregiver(
          data: {
            patientUserId: $patientUserId,
            user: {
              create: {
                username: $username
                password: $password
                displayName: $displayName
                email: $email
                phone: $phone
                isCaregiver: true
                contactType: $contactType
                enterprise: {
                  connect: {id: $enterpriseId}
                }
              }
            }
          }
        ) {
          id
        }
      }
    `
  }

  editCaregiver() {
    return gql`
      mutation updateCaregiver(
        $id: ID!,
        $displayName: String!,
        $contactType: String!,
        $email: String!,
        $phone: String!,
        $enterpriseId: ID!
      ) {
        updateCaregiver(
          data: {
            id: $id,
            user: {
              update: {
                displayName: $displayName
                email: $email
                phone: $phone
                isCaregiver: true
                contactType: $contactType
                enterprise: {
                  connect: {id: $enterpriseId}
                }
              }
            }
          }
        ) {
          id
        }
      }
    `
  }

  getAllCaregivers() {
    return gql`
      query allCaregivers {
        caregivers {
          id
          user {
            id
            displayName
            profileImage
            overallStatus
            phone
            email
            isActive
          }
        }
      }
    `
  }

  getCaregiversByPatientId() {
    return gql`
      query getByIdShort($patientId: ID!) {
        patient(where: {id: $patientId}) {
          id
    			user {
            displayName
            id
          }
          caregivers {
            id
            user {
              id
              displayName
              profileImage
              overallStatus
              phone
              email
              isActive
            }
          }
        }
      }
    `
  }

  getCaregiversByPhone() {
    return gql`
      query getCaregiversByPhone($phone: String) {
        caregivers(where: {phone: $phone}) {
          id
          user {
            id
            contactType
            displayName
            profileImage
            overallStatus
            phone
            email
            isActive
            enterprise {
              id
            }
          }
        }
      }
    `
  }

  assignCaregiver() {
    return gql`
      mutation assignCaregiver($patientId: ID!, $caregiverId: ID!) {
        assignCaregiver(data: {patientId: $patientId, caregiverId: $caregiverId}) {
          id
          caregivers {
            id
            user {
              id
              displayName
            }
          }
        }
      }
    `
  }

  unassignCaregiver() {
    return gql`
      mutation unassignCaregiver(
        $patientId: ID!,
        $caregiverId: ID!
      ) {
        unassignCaregiver(
          data: {
              patientId: $patientId
              caregiverId: $caregiverId
          }
        ) {
          id
          caregivers {
            id
            user {
              id
              displayName
            }
          }
        }
      }
    `
  }

  sendInvite() {
    return gql`
      mutation resendCaregiverInvite($id: ID!) {
        resendCaregiverInvite(where: {id: $id}) {
          resetToken
          status
        }
      }
    `
  }

}

export default new CaregiverQL()
