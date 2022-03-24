import React, { Component } from 'react'
import PropTypes from 'prop-types'

import PatientSectionTitle from '../../Molecules/PatientSectionTitle/PatientSectionTitle'
import PatientButton from '../../Atoms/PatientButton/PatientButton'
import TagSection from '../../Molecules/TagSection/TagSection'

import './PatientDetails.css'

export default class PatientCareTeams extends Component {
  // static propTypes = {
  //   /** A patient to display */
  //   user: PropTypes.shape({
  //     id: PropTypes.string.isRequired,
  //     phone: PropTypes.string,
  //     email: PropTypes.string,
  //     careTeams: PropTypes.arrayOf(
  //       PropTypes.shape({
  //         id: PropTypes.string.isRequired,
  //         name: PropTypes.string.isRequired,
  //       })
  //     ),
  //     patient: PropTypes.arrayOf(
  //       PropTypes.shape({
  //         id: PropTypes.string,
  //         contactType: PropTypes.string,
  //         language: PropTypes.shape({
  //           name: PropTypes.string,
  //         }),
  //       })
  //     ),
  //   }).isRequired,
  //   /** A lookup list of all programs available to a patient */
  //   careTeamsLookup: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       id: PropTypes.string.isRequired,
  //       name: PropTypes.string.isRequired,
  //     })
  //   ).isRequired,
  //   /** Called to save changes to the BE */
  //   onSave: PropTypes.func.isRequired,
  // }

  constructor(props) {
    super(props)
    this.state = {
      showPrograms: false,
      currentPatientId: this.props.user.patient.id,
    }

    this.handleHidePrograms = this.handleHidePrograms.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user.patient.id !== this.props.user.patient.id) {
      this.setState({
        showPrograms: false,
        currentPatientId: this.props.user.patient.id,
      })
    }
  }

  handleShowPrograms = () => {
    this.setState({ showPrograms: true })
  }

  handleHidePrograms() {
    this.setState({ showPrograms: false })
  }

  handleDeleteProgram = () => {
    this.props.onSave()
  }

  handleChange(e) {
    this.props.onSave(e)
  }

  render() {
    const { user, careTeamsLookup } = this.props
    const { showPrograms } = this.state

    const editModeClass = showPrograms ? 'patient-row--editing' : ''

    return (
      <div className="patientdetails-section-wrap patientdetails-section-careteams">
        <PatientSectionTitle
          icon="careTeam"
          text="Care Team"
          wrapStyle={{ marginTop: 0 }}>
          <PatientButton
            label="Assign"
            icon="plus"
            onClick={this.handleShowPrograms}
            data-testid={`edit-button-communication-prefs`}
          />
        </PatientSectionTitle>

        <div className="patientdetails-section">
          <div className={`patientdetails-row ${editModeClass}`}>
            <TagSection
              title="Care Team"
              tags={user.roles}
              possibleTags={careTeamsLookup}
              showSelectPane={showPrograms}
              onClose={this.handleHidePrograms}
              onChange={this.handleChange}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    )
  }
}
