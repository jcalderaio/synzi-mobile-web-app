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
import PatientProgramsList from './PatientProgramsList'


//Styles
import styles from './styles'

export default class PatientProgramsContainer extends Component {
  static propTypes = {
    /** Programs user is currently enrolled in */
    currentlyEnrolledPrograms: PropTypes.array,
    /** Id of the patient */
    patientId: PropTypes.string,
    /** Flag to show programsListModal */
    showProgramsListModal: PropTypes.bool.isRequired,
    /** Id of current Enterprise*/
    enterpriseId: PropTypes.string.isRequired,
  }
  static defaultProps = {
    currentlyEnrolledPrograms: [],
    patientId: '',
  }

  render() {
    const { dismissHandler, enterpriseId, patientId, showProgramsListModal, currentlyEnrolledPrograms, displayName } = this.props

    const ENTERPRISE_PROGRAMS_QUERY = EnterpriseQL.getPrograms()
    const PROGRAM_ADD_MUTATION = PatientsQL.enrollPatient()

    return (
      <Query
        query={ENTERPRISE_PROGRAMS_QUERY}
        variables={{ id: enterpriseId }}>
        {({ loading, data, refetch }) => {
          if (loading) return null

          let enrolledProgramIds = currentlyEnrolledPrograms.map(item => item.program.id)

          let programs = data.enterprise.programs
          
          programs = programs.filter(program => enrolledProgramIds.indexOf(program.id) < 0)

          return (
            <Mutation mutation={PROGRAM_ADD_MUTATION}>
              {(addProgram, { error }) => {
                if (error) return null
                     return (
                      <Modal 
                        visible={showProgramsListModal}
                        animationType={'slide'}>
                          <PatientProgramsList
                              displayName={displayName}
                              dismissHandler={dismissHandler}
                              programs={programs}
                              onAddProgram={id => {
                                const variables = {
                                  patientId: patientId,
                                  programId: id,
                                }
                                addProgram({ variables })
                              }}
                              onProgramRefresh={() => {
                                refetch()
                              }}
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

