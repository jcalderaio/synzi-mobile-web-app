import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor } from '../../../../_shared/Color';


export default createStyleSheet({

    blueContainerStyle: {
        backgroundColor: SynziColor.SYNZI_BLUE,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    blueContainerDisabledStyle: {
        backgroundColor: SynziColor.SYNZI_BLUE,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    greenContainerStyle: {
        backgroundColor: AppColor.BRIGHT_GREEN,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    greenContainerDisabledStyle: {
        backgroundColor: AppColor.BRIGHT_GREEN,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        alignSelf: 'center',
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
        paddingTop: 10,
        paddingBottom: 10
    },
    loadingContainerStyle:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
   
});
