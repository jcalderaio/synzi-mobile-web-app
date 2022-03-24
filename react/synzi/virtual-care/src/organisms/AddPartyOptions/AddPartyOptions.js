import React, { Component } from 'react'
import { 
    TouchableOpacity, 
    Image,
    View,
    Text
} from 'react-native'
import PropTypes from 'prop-types'
import ActionSheet from 'react-native-actionsheet'
import Reactotron from 'reactotron-react-native'

export default class AddPartyOptions extends Component {
    
    static propTypes = {
        /* patientId of the patient IF they are on the call, else 0 */
        patientId: PropTypes.number.isRequired,
        /* shows the modal list of the staff to add to the call */
        showAddStaffModal: PropTypes.func.isRequired,
        /* shows the modal list of the caregivers of the patient on the call to add to the call */
        showAddCaregiverModal: PropTypes.func.isRequired,
        /* the reference to the AddPartyOptions component*/
        inputRef: PropTypes.func.isRequired
    }

    render() {
        const { patientId, showAddStaffModal, showAddCaregiverModal, showAddInterpreterModal, interpreterEnabled, inputRef } = this.props

        let actionSheetOptions = []

        // Interpreter enabled and VC <--> VC

        // Interpreter enabled and VC <--> CC Patient

        // Interpreter enabled and VC <--> CC Caregiver

        if(interpreterEnabled && patientId !== 0) {
            actionSheetOptions = [
                'Staff', 
                'Caregivers',
                'Interpreters',
                'Cancel'
            ]

            return (
                <ActionSheet
                  ref={inputRef}
                  options={actionSheetOptions}
                  title={"Add someone to the call?"}
                  cancelButtonIndex={3}
                  onPress={(index) => { 
                      if(index === 0) {
                        showAddStaffModal()
                      } 
                      else if (index === 1) {
                        showAddCaregiverModal()
                      } 
                      else if (index === 2) {
                        showAddInterpreterModal()
                      }
                  }}
                />
            )
        } else if(interpreterEnabled && patientId === 0) {
            actionSheetOptions = [
                'Staff', 
                'Interpreters',
                'Cancel'
            ]

            return (
                <ActionSheet
                  ref={inputRef}
                  options={actionSheetOptions}
                  title={"Add someone to the call?"}
                  cancelButtonIndex={2}
                  onPress={(index) => { 
                      if(index === 0) {
                        showAddStaffModal()
                      } 
                      else if (index === 1) {
                        showAddInterpreterModal()
                      } 
                  }}
                />
            )
        } else if(!interpreterEnabled && patientId !== 0) {
            actionSheetOptions = [
                'Staff', 
                'Caregivers',
                'Cancel'
            ]

            return (
                <ActionSheet
                  ref={inputRef}
                  options={actionSheetOptions}
                  title={"Add someone to the call?"}
                  cancelButtonIndex={2}
                  onPress={(index) => { 
                      if(index === 0) {
                        showAddStaffModal()
                      } 
                      else if (index === 1) {
                        showAddCaregiverModal()
                      } 
                  }}
                />
            )
        } else if(!interpreterEnabled && patientId === 0) {
            actionSheetOptions = [
                'Staff',
                'Cancel'
            ]

            return (
                <ActionSheet
                  ref={inputRef}
                  options={actionSheetOptions}
                  title={"Add someone to the call?"}
                  cancelButtonIndex={1}
                  onPress={(index) => { 
                      if(index === 0) {
                        showAddStaffModal()
                      }  
                  }}
                />
            )
        }
    }
}

                    



