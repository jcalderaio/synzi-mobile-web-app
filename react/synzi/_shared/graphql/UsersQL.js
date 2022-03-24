import gql from 'graphql-tag'

class UsersQl {
  getAll() {
    return gql`
      {
        users {
          id
          displayName
        }
      }
    `
  }

  getAllByEnterprise(enterpriseId) {
    return gql`
    {
      enterprise(where: {id: ${enterpriseId}}) {
        id
        name
        users {
          id
          displayName
          isActive
        }
      }
    }
    `
  }


  updateUserFavorite() {
    return gql`
      mutation updateUser($id: ID!, $favorites: UserManyInput!) {
        updateUser(data: { favorites: $favorites }, where: { id: $id }) {
          displayName
          favorites {
            id
            displayName
          }
        }
      }
    `
  }

  getUserFavorites(userId) {
    return gql`
    {
        user(where: { id: ${userId} }) {
          id
          displayName
          favorites: canCallFavorites {
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

  getUsersToCall(userId) {
    return gql`
      {
        user(where: { id: ${userId} }) {
          id
          displayName
          canCallUsers {
            id
            displayName
            favorite
            profileImage
            overallStatus
          }
        }
      }
    `
  }

  getAllByGroup(groupId) {
    return gql`
    {
      group(where: {id: ${groupId}}) {
        id
        name
        isActive
        users {
          id
          displayName
          isActive
        }
      }
    }
    `
  }

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
          permissionsByType(permissionType: "enterprise") {
            id
            code
            isActive
          }
        }
        permissions(where: {type: "staff"}) {
          code
        }
      }
      currentEnv {
        vcMinVersion
        ccMinVersion
      }
    }
    `
  }

  getById(id, enterpriseId) {
    return gql`
    {
      user(where: { id: ${id} }) {
        id
        displayName
        email
        phone
        isActive
        isAdmin
        isStaff
        isPatient
        isSynziAdmin
        roles {
          id
          name
        }
        groups {
          id
          name
        }
      }
      credentialByUserId(userId: ${id}) {
        username
      }
      enterprise(where: {id: ${enterpriseId}}) {
        id
        roles {
          id
          name
        }
      }
      enterprise(where: {id: ${enterpriseId}}) {
        id
        groups {
          id
          name
          isActive
        }
      }
    }
    `
  }

  getNewUser(enterpriseId) {
    return gql`
      {
        enterprise(where: {id: ${enterpriseId}}) {
          id
          roles {
            id
            name
          }
        }
        enterprise(where: {id: ${enterpriseId}}) {
          id
          groups {
            id
            name
            isActive
          }
        }
      }
    `
  }

  //FIXME: This needs to be fixed when Login is finalized.

  addNew() {
    return gql`
      mutation createUser(
        $username: String!
        $displayName: String!
        $email: String
        $phone: String
        $isAdmin: Boolean
        $isStaff: Boolean
        $isSynziAdmin: Boolean
        $isPatient: Boolean
        $enterprise: ID
        $groups: GroupManyInput
        $roles: RoleManyInput
      ) {
        createUser(
          data: {
            username: $username
            displayName: $displayName
            password: "PasswordHasNotBeenSet"
            email: $email
            phone: $phone
            isAdmin: $isAdmin
            isStaff: $isStaff
            isSynziAdmin: $isSynziAdmin
            isPatient: $isPatient
            enterprise: { connect: { id: $enterprise } }
            groups: $groups
            roles: $roles
          }
        ) {
          id
          displayName
        }
      }
    `
  }

  update() {
    return gql`
      mutation UpdateUser(
        $id: ID!
        $displayName: String
        $email: String
        $phone: String
        $isAdmin: Boolean
        $isStaff: Boolean
        $isSynziAdmin: Boolean
        $isPatient: Boolean
        $enterprise: ID
        $groups: GroupManyInput
        $roles: RoleManyInput
      ) {
        updateUser(
          data: {
            displayName: $displayName
            email: $email
            phone: $phone
            isAdmin: $isAdmin
            isStaff: $isStaff
            isSynziAdmin: $isSynziAdmin
            isPatient: $isPatient
            enterprise: { connect: { id: $enterprise } }
            groups: $groups
            roles: $roles
          }
          where: { id: $id }
        ) {
          id
          displayName
        }
      }
    `
  }

  disable() {
    return gql`
      mutation disableUser($id: ID!) {
        disableUser(where: { id: $id }) {
          id
        }
      }
    `
  }

  enable() {
    return gql`
      mutation enableUser($id: ID!) {
        enableUser(where: { id: $id }) {
          id
        }
      }
    `
  }

  getInviteToken() {
    return gql`
      mutation getInviteToken($id: ID!) {
        getInviteToken(where: {id: $id}) {
          inviteToken
        }
      }
    `
  }
}

export default new UsersQl()
