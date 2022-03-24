import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor } from '../../../../_shared/Color';


export default createStyleSheet({

    loginContainerStyle: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: 300,
        height: 300,
    },
    inputFormContainerStyle : {
        height: 120,
        width: 280
    },
    sepStyle : {
        height: 40
    },
    loginButtonStyle : {
        width: 240,
        justifyContent: 'flex-end',
        marginTop: 70
    },
    inputFormHeadingStyle:{
        width:240,
        height:20,
        alignSelf: 'center',
        textAlign:'left',
        color:'white',
        fontSize: 12,
    },
    inputFormStyle:{
        width:240,
        height:40,
        backgroundColor: 'white',
        alignSelf: 'center',
        textAlign:'center',
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 20
    }

});
