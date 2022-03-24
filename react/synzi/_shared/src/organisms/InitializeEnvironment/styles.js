import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../Color';


export default createStyleSheet({

    mainContainerStyle: {
        flexDirection: 'column',
        // backgroundColor: 'rgba(23, 37, 67, 0.9)',
        backgroundColor: SynziColor.SYNZI_BLACK,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    callerNameTextStyle:{
        alignSelf: 'center',
        color: SynziColor.SYNZI_MEDIUM_GRAY,
        fontSize: 28,
        fontWeight: '400',
        textAlign: 'center',
        paddingHorizontal: 30
    },
    loadingContainerStyle: {
        paddingVertical: 40
    },
    errorTextStyle: {
        fontSize: 16,
        color: SynziColor.SYNZI_MEDIUM_GRAY,
        fontWeight: '400',
        textAlign:'center'
    }
});
