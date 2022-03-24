import React, { Component } from 'react'

import deviceLog from 'react-native-device-log'
import { AppConfig, LogSeparator} from '../../../_shared/constants/AppConfig'

// GraphQL
// import UsersQL from '../../../_shared/graphql/UsersQL'
import UsersQL from '../graphql/UsersQL'
import { Query } from 'react-apollo'

import Reactotron from 'reactotron-react-native'

export default class SaveCurrentUser extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      currentUser: null
    }
  }

  render() {
    const { userId, saveCurrentUser } = this.props
    const { currentUser } = this.state
    
    // Reactotron.log("currentUser: ", currentUser)
    if(currentUser !== null){
      return null;
    }

    return (
        <Query 
          query={UsersQL.getByIdShort(userId)}
          pollInterval={0}
        >
            {({ loading, error, data }) => {
                if (loading) {
                    return null
                }
                
                if (error) {
                    
                    Reactotron.error(`Get User Failure : ${error.message}`)
                    deviceLog.log(`Get User Failure : ${error.message}`)
                }
                
                if(data && data.user){
                    Reactotron.log("SaveCurrentUser.data.user = ", data.user)

                    let user = data.user
                    let displayName = user.displayName
                    let userId = user.id
                    let enterpriseId = user.enterprise.id

                    //Set the user on the call manager
                    saveCurrentUser(user)
                    this.setState({ currentUser: user })

                    
                    Reactotron.log(`Get Enterprise Success: DisplayName: ${displayName}, enterpriseId: ${enterpriseId}`)
                    deviceLog.log(`Get Enterprise Success: DisplayName: ${displayName}, enterpriseId: ${enterpriseId}`)

                }
                return null
            }}
        </Query>
    )

  }
}
