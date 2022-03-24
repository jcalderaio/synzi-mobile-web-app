import gql from 'graphql-tag'

class GroupsQL {
  getGroups(id) {
    return gql`
    {
      user(where: {id: ${id}}) {
        id
        displayName
        isStaff
        canCallGroups {
          id
          name
          isActive
        }
      }
    }
    `
  }
}

export default new GroupsQL()
