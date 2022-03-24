import React, { Component } from 'react'
import { 
  View,
  Image,
  ActivityIndicator,
  Text,
  Modal
} from 'react-native';
import PropTypes from 'prop-types'
import { Mutation, Query } from 'react-apollo'
import PatientsQL from '../../../../_shared/graphql/PatientsQL'
import EnterpriseQL from '../../../../_shared/graphql/EnterpriseQL'
import PatientAssignmentsList from './PatientAssignmentsList'
//import PatientCareTeams from './PatientCareTeams'
//import ErrorPage from './ErrorPage'

import styles from './styles'

export default class PatientCareTeamsContainer extends Component {
  static propTypes = {
    /** Array of currently enrolled assignments */
    currentAssignments: PropTypes.array,
    /** Id of the patient */
    userId: PropTypes.string,
    /** Flag to show showAssignmentsListModal */
    showAssignmentsListModal: PropTypes.bool.isRequired,
    /** Enterprise ID */
    enterpriseId: PropTypes.string.isRequired,
  }
  static defaultProps = {
    currentAssignments: [],
    userId: '',
  }

  render() {
    //const { user, ...rest } = this.props

    const { userId, enterpriseId, currentAssignments, dismissHandler, displayName, showAssignmentsListModal } = this.props

    // TODO: Wondering if this should be moved to a parent as it is the same for all
    // patients? but then it will have to poll. Maybe not.
    const ENTERPRISE_CARE_TEAM_QUERY = EnterpriseQL.getCareTeamsLookup()
    const ADD_CARE_TEAM_MUTATION = PatientsQL.addCareTeam()

    return (
      <Query
        query={ENTERPRISE_CARE_TEAM_QUERY}
        variables={{ id: enterpriseId }}>
        {({ loading, error, data, refetch }) => {
          if (loading) return null

          let currentAssignmentsIds = currentAssignments.map(item => item.id)

          let careTeams = []
          if (!error) {
            careTeams = data.enterprise.roles
            careTeams = careTeams.filter(item => currentAssignmentsIds.indexOf(item.id) < 0)
          }

          return (
            <Mutation mutation={ADD_CARE_TEAM_MUTATION}>
              {(addCareTeam, { error }) => {
                if (error) { 
                  return null
                }

                return (
                    <Modal 
                      visible={showAssignmentsListModal}
                      animationType={'slide'}>
                        <PatientAssignmentsList
                            displayName={displayName}
                            dismissHandler={dismissHandler}
                            assignments={careTeams}
                            onAddCareTeam={id => {
                                const variables = {
                                  userId: userId,
                                  assignmentId: id,
                                }
          
                                addCareTeam({ variables })
                            }}
                            onAssignmentsRefresh={() => {
                              refetch()
                            }}
                            //careTeamsLookup={careTeams}
                        />
                    </Modal>
                 )
              }}
            </Mutation>
          )
        }}
      </Query>
    )
  }
}