import gql from 'graphql-tag'

class PatientsQl {

  getAll(enterpriseId) {
    return gql`
      query getGlobalLanguageList {
        languages {
          id
          code
          name
          isActive
        }
        enterprise(where: { id: ${enterpriseId} }) {
          id
          language {
            id
            code
            name
          }
          patients: users(where: { isPatient: true, isActive: true }) {
            id
            displayName
            profileImage
            overallStatus  
          }
        }
      }
    `
  }

  createPatient() {
    return gql`
      mutation createPatient(
        $username: String!
        $password: String!
        $identifier: String!
        $dateOfBirth: String!
        $displayName: String!
        $ssnLast4: String!
        $zipCode: String
        $enterpriseId: ID
        $contactType: String
        $email: String!
        $phone: String!
        $language: String
      ) {
        createPatient(
          data: {
            identifier: $identifier
            ssnLast4: $ssnLast4
            zipCode: $zipCode
            contactType: $contactType
            dateOfBirth: $dateOfBirth
            language: { connect: { code: $language } }
            user: {
              create: {
                username: $username
                password: $password
                displayName: $displayName
                email: $email
                phone: $phone
                isAdmin: false
                isStaff: false
                isSynziAdmin: false
                isPatient: true
                enterprise: { connect: { id: $enterpriseId } }
              }
            }
          }
        ) {
          user {
            id
            displayName
            email
            phone
            isAdmin
            isStaff
            isSynziAdmin
            isPatient
            profileImage
            overallStatus
            isActive
            enterprise {
              id
              careteams: roles(where:{type:"patient", isActive:true}) {
                id
                name
              }
            }
            assignments: roles {
              id
              name
              isActive
            }
            patient {
              id
              identifier
              dateOfBirth
              ssnLast4
              zipCode
              contactType
              language {
                id
                code
                name
              }
              enrollments(where: {isActive: true}) {
                id
                program {
                  id
                  name
                }
              }
            }
          }
        }
      }
    `
  }

  getById() {
    return gql`
      query getPatientUserById($id: ID!) {
        user(where: {id: $id}) {
          id
          displayName
          phone
          email
          isAdmin
          isStaff
          isSynziAdmin
          isPatient
          profileImage
          overallStatus
          isActive
          enterprise {
            id
            careteams: roles(where:{type:"patient", isActive:true}) {
              id
              name
            }
          }
          assignments: roles {
            id
            name
            isActive
          }
          patient {
            id
            identifier
            dateOfBirth
            zipCode
            contactType
            ssnLast4
            language {
              id
              code
              name
            }
            enrollments(where: {isActive: true}) {
              id
              program {
                id
                name
                isActive
              }
            }
            caregivers {
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
              }
            }
          }
        }
      }
    `
  }


  updatePatient() {
    return gql`
      mutation UpdatePatient(
        $patientID: ID!
        $contactType: String
        $email: String
        $phone: String
        $language: String
        $identifier: String
        $displayName: String
        $ssnLast4: String
        $zipCode: String
        $dateOfBirth: Date
      ) {
        updatePatient(
          where: { id: $patientID }
          data: {
            identifier: $identifier
            contactType: $contactType
            dateOfBirth: $dateOfBirth
            ssnLast4: $ssnLast4
            zipCode: $zipCode
            language: { connect: { code: $language } }
            user: { 
              update: 
              { 
                phone: $phone, 
                email: $email, 
                displayName: $displayName 
              } 
            }
          }
        ) {
          id
          identifier
          dateOfBirth
          ssnLast4
          zipCode
          user {
            id
            displayName
          }
          contactType
          language {
            id
            code
            name
          }
        }
      }
    `
  }

  sendInvite() {
    return gql`
      mutation resendPatientInvite($id: ID!) {
        resendPatientInvite(where: { id: $id }) {
          status
          resetToken
        }
      }
    `
  }

  // Enroll a patient into a single program
  enrollPatient() {
    return gql`
      mutation enrollPatient($programId: ID, $patientId: ID) {
        createEnrolledPatient(
          data: {
            program: { connect: { id: $programId } }
            patient: { connect: { id: $patientId } }
          }
        ) {
          id
        }
      }
    `
  }

  // Remove a patient from a single program
  disenrollPatient() {
    return gql`
      mutation disenrollPatient($enrollmentId: ID) {
        disenrollEnrolledPatient(where: {id: $enrollmentId }) {
          isActive
          disenrollDate
          id
        }
      }
    `
  }

  // Add an assignment to a patient
  addCareTeam() {
    return gql`
      mutation addCareTeam($userId: ID, $assignmentId: ID) {
        updateUser(where:{id:$userId},data:{
          roles:{
            append:{id:$assignmentId}
          }
        }) {
          roles {
            id
          }
        }
      }
    `
  }

  // Remove an assignment from a patient
  removeCareTeam() {
    return gql`
      mutation removeCareTeam($userId: ID, $assignmentId: ID) {
        updateUser(where:{id:$userId},data:{
          roles:{
            drop:{id:$assignmentId}
          }
        }) {
          roles {
            id
          }
        }
      }
    `
  }

  updateCareTeam() {
    return gql`
      mutation UpdatePatient($roles: RoleManyInput, $userId: ID!) {
        updateUser(where: { id: $userId }, data: { roles: $roles }) {
          id
          roles {
            id
            name
          }
          patient {
            id
          }
        }
      }
    `
  }

  getDisplayName() {
    return gql`
      query getPatientUserById($id: ID!) {
        user(where: {id: $id}) {
          displayName
        }
      }
    `
  }
  
}

export default new PatientsQl()
