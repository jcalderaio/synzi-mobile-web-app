import {
    Platform
} from 'react-native';
import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color';


export default createStyleSheet({

    datePickerStyle: {
        dateIcon: {
            right: 20,
            top: -3,
            width: 30,
        },
        dateText: {
            color: 'black',
            fontSize: 16,
            fontWeight: '600',
        },
        dateInput:{
            borderWidth: 0
        },
        placeholderText: {
            fontSize: 14,
            fontWeight: '600',
        }
    }
   
});
