import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color';


export default createStyleSheet({

    formContainerStyle: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: SynziColor.SYNZI_BLUE,
        flex: 1
    },
    subformContainerStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: SynziColor.SYNZI_BLUE,
        width: 300,
        height: 340
    },
    forgotPasswordHeaderTextStyle:{
        fontSize: 22,
        color: 'white',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 20
    },
    instructionTextStyle:{
        fontSize: 16,
        color: 'black',
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 20
    },
    errorMessageTextStyle:{
        fontSize: 16,
        color: '#2a6218',
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 10
    },
    inputTextStyle:{
        textAlign: 'center',
        color: '#000',
        paddingRight: 5,
        paddingLeft: 5,
        fontSize: 18,
        backgroundColor: '#ffffff',
        borderRadius: 7,
        height: 40,
        width: 240,
        marginBottom: 30
    },
    buttonStyle:{
        marginBottom: 20,
        width: 200,
    },
    logoImageStyle:{
        width: 100,
        height: 50,
        marginBottom: 20
    },
    sendEmailButtonStyle:{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: SynziColor.SYNZI_MEDIUM_BLUE,
        width: 200,
        height: 50,
        borderRadius:5,
        marginBottom: 30
    },
    sendEmailButtonDisabledStyle:{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: SynziColor.SYNZI_MEDIUM_BLUE,
        width: 200,
        height: 50,
        borderRadius:5,
        marginBottom: 30,
        opacity: 0.5
    },
    sendEmailButtonTextStyle:{
        alignSelf: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    backToLoginButtonStyle:{
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        height: 50,
    },
    activityIndicatorStyle:{
        marginRight: 10
    }

})