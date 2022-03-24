import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color';


export default createStyleSheet({

    textStyle: {
        alignSelf: 'center',
        color: SynziColor.SYNZI_WHITE,
        fontSize: 16,
        fontWeight: '600',
        paddingTop: 10,
        paddingBottom: 10
    },
    underLineViewStyle:{
        height:2,
        backgroundColor: SynziColor.SYNZI_BLUE,
    },
});
