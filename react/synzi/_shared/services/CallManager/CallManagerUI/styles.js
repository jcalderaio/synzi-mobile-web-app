import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../Color';


export default createStyleSheet({

    mainContainerStyle: {
        flexDirection: 'column',
        backgroundColor: 'rgba(23, 37, 67, 0.9)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainContainerRetryStyle: {
        flexDirection: 'column',
        backgroundColor: 'rgba(88, 23, 39, 0.9)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainerStyle: {
        width: 250,
        height: 100,
        //backgroundColor: 'red',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonContainerSingleStyle: {
        width: 250,
        height: 100,
        //backgroundColor: 'red',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    incomingAvatarStyle: {
        width:150,
        height:150,
        marginBottom: 35
    },
    incomingCallTextStyle: {
        alignSelf: 'center',
        color: SynziColor.SYNZI_BLUE,
        fontSize: 18,
        marginBottom: 5
    },
    callerNameTextStyle:{
        alignSelf: 'center',
        color: 'white',
        fontSize: 32,
        fontWeight: '400',
        marginBottom: 50,
        textAlign: 'center'
    },
    buttonTextStyle: {
        alignSelf: 'center',
        color: SynziColor.SYNZI_BLUE,
        fontSize: 16,
        paddingTop: 10,
    },
});
