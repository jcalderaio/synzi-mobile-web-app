import gql from 'graphql-tag'

class CareTeamQL {
  getUsers(id) {
    return gql`
    {
      user(where: {id: ${id}}) {
        id
        displayName
        isStaff
        canDirectCallUsers {
          id
          displayName
          profileImage
          overallStatus
          isActive
        }
      }
    }
    `
  }
}

export default new CareTeamQL()
