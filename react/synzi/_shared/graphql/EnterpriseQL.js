import gql from 'graphql-tag'

class EntepriseQl {
  getInfo() {
    return gql`
      query entepriseInfo($id: ID!) {
        enterpriseInfo(where: { id: $id }) {
          id
          name
          image
        }
      }
    `
  }

  getLanguagesLookupList() {
    return gql`
      query getGlobalLanguageList {
        languages {
          id
          code
          name
          isActive
        }
      }
    `
  }

  getLanguage() {
    return gql`
      query getEnterpriseLanguage($id: ID!) {
        enterprise(where: { id: $id }) {
          id
          language {
            id
            code
            name
          }
        }
      }
    `
  }

  getPrograms() {
    return gql`
      query getPrograms($id: ID) {
        enterprise(where: { id: $id }) {
          id
          programs(where: { isActive: true }) {
            id
            name
            isActive
          }
        }
      }
    `
  }

  getCareTeamsLookup() {
    return gql`
      query getCareTeamsLookup($id: ID!) {
        enterprise(where: { id: $id }) {
          id
          roles(where: { type: "patient" }) {
            id
            name
            isActive
          }
        }
      }
    `
  }
}

export default new EntepriseQl()
