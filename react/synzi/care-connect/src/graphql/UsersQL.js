import gql from 'graphql-tag'

class UsersQl {
  getByIdShort(id) {
    return gql`
    {
      user(where: { id: ${id} }) {
        id
        displayName
        profileImage
        overallStatus
        enterprise {
          id
          name
        }
        permissions(where: {type: "staff"}) {
          code
        }
      }
    }
    `
  }
  getPermissions() {
    return gql`
      query getCurrentUser($id: ID!) {
        user(where: { id: $id }) {
          id
          displayName
          profileImage
          overallStatus
          unreadMessages
          enterprise {
            id
            name
            permissionsByType(permissionType: "enterprise") {
              id
              code
              isActive
            }
          }
          permissions(where: { type: "staff" }) {
            id
            code
          }
        }
      }
    `
  }
}

export default new UsersQl()
