import gql from 'graphql-tag'

class MessagesQL {
  getThreads() {
    return gql`
      query getThreads {
        unreadMessages
        secureMessageThreads {
          id
          name
          unreadMessages
          messages(last: 1) {
            id
            text
            seen
            timestamp
            sender {
              id
              displayName
              profileImage
            }
            recipient {
              id
              displayName
              profileImage
            }
          }
        }
      }
    `
  }

  markSecureMessageThreadSeen() {
    return gql`
      mutation markSecureMessageThreadSeen($recipientId: ID!) {
        markSecureMessageThreadSeen(recipient: { id: $recipientId }) {
          id
          unreadMessages
        }
      }
    `
  }

  getThreadByRecipient() {
    return gql`
      query getThreadByRecipient($recipientId: ID!) {
        user: user(where: { id: $recipientId }) {
          id
          displayName
        }
        thread: secureMessageThread(recipient: { id: $recipientId }) {
          id
          unreadMessages
          messages {
            id
            text
            seen
            timestamp
            sender {
              id
              displayName
              profileImage
            }
            recipient {
              id
              displayName
              profileImage
            }
          }
        }
      }
    `
  }

  sendMessage() {
    return gql`
      mutation sendMessage($recipientId: ID!, $text: String!) {
        sendSecureMessage(
          data: { recipient: { connect: { id: $recipientId } }, text: $text }
        ) {
          id
          text
          seen
          timestamp
          sender {
            id
            displayName
            profileImage
          }
          recipient {
            id
            displayName
            profileImage
          }
        }
      }
    `
  }

  getUnreadMessages() {
    return gql`
      query getUnreadMessages($userId: ID!) {
        user(where: { id: $userId }) {
          unreadMessages
        }
      }
    `
  }

  messageThreadsChanged() {
    return gql`
      query messageThreadsChanged {
        messageThreadsChanged
      }
    `
  }

  // -------------------------------------------------------------------------
  // On Demand
  // -------------------------------------------------------------------------
  // FIXME: This needs update so that it only returns templates that are active and odm and published
  // waiting on BE to update queries to fix
  getOnDemandLookup() {
    return gql`
      query getTemplatesLookup($enterpriseId: ID!) {
        enterprise(where: { id: $enterpriseId }) {
          id
          templates(where:{isOdm:true, isActive:true, hasPublishedTranslations: true}) {
            id
            name
            defaultMTTranslation {
              id
              language {
                id
                code
                name
              }
            }
            mttranslations(where:{isPublished:true}) {
              id
              publishedMTT {
                id
              }
              language {
                id
                code
                name
              }
            }
          }
        }
      }
    `
  }

  getTranslation() {
    return gql`
      query getTranslation($translationId: ID!) {
        mttranslation(where: { id: $translationId }) {
          id
          publishedMTT {
            id
            smsContent
          }
        }
      }
    `
  }

  sendOnDemandMessage() {
    return gql`
      mutation sendOnDemandMessage($recipientId: ID!, $text: String!, $publishedMttId: ID!) {
        sendOnDemandMessage(recipientId: $recipientId, message: $text, publishedMttId: $publishedMttId) {
          id
        }
      }
    `
  }
}

export default new MessagesQL()
