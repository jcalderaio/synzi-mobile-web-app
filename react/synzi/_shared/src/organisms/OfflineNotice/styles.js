import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../Color';


export default createStyleSheet({

    mainContainerStyle: {
        flexDirection: 'column',
        backgroundColor: 'rgba(23, 37, 67, 0.9)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    connectionWarningStyle: {
        backgroundColor: '#f0ad4e',
        height: 90
    },
    callerNameTextStyle:{
        alignSelf: 'center',
        color: 'white',
        fontSize: 28,
        fontWeight: '400',
        textAlign: 'center',
        paddingHorizontal: 30
    },
    loadingContainerStyle: {
        paddingVertical: 0
    },
    titleTextStyle: {
        color: 'white',
        textAlign: 'center',
        paddingTop: 30,
        fontSize: 16
    },
    messageTextStyle: {
        color: 'white',
        textAlign: 'center',
        paddingTop: 5,
        fontSize: 14
    }
});
