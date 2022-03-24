import gql from 'graphql-tag'

class EnterpriseQL {
  getInfo() {
    return gql`
      query enterpriseInfo($id: ID!) {
        enterpriseInfo(where: {id: $id}) {
          id
          image
        }
      }
    `
  }
}

export default new EnterpriseQL()
