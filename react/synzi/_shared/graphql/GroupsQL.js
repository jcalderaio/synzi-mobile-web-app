import gql from 'graphql-tag'


class GroupsQl {

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
        enterprise {id name}
      }
    }
    `
  }

  //note: users are automatically filtered to only those that are active
  getGroupByFavorites(groupId, userId) {
    return gql`
      {
        group: groupByUserFavorites(group: { id: ${groupId} }, user: { id: ${userId} }) {
          id
          name
          isActive
          users(where:{isActive:true}) {
            id
            displayName
            profileImage
            overallStatus
            favorite
            isActive
          }
        }
      }
    `
  }

}

export default new GroupsQl()