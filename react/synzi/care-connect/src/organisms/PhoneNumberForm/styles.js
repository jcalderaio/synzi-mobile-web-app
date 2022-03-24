import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor } from '../../../../_shared/Color';
import {normalize} from '../../helpers/ResponsiveStylesheet';


export default createStyleSheet({

    loginContainerStyle: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: normalize(300),
        height: normalize(300),
    },
    inputFormContainerStyle : {
        height: normalize(120),
        width: normalize(280)
    },
    sepStyle : {
        height: normalize(40)
    },
    loginButtonStyle : {
        width: normalize(240),
        justifyContent: 'flex-end',
    },
    inputFormHeadingStyle:{
        width: normalize(240),
        height: normalize(20),
        alignSelf: 'center',
        textAlign:'left',
        color:'white',
        fontSize: normalize(12),
    },
    inputFormStyle:{
        width: normalize(240),
        height: normalize(40),
        backgroundColor: 'white',
        alignSelf: 'center',
        textAlign:'center',
        color: 'black',
        fontSize: normalize(16),
        fontWeight: '600',
        marginBottom: normalize(20)
    },
    datePickerStyle: {
        dateIcon: {
            position: 'absolute',
            right: 0,
            top: 4,
            marginLeft: 0
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
            fontSize: normalize(16),
            fontWeight: '600'
        }
    }
});
