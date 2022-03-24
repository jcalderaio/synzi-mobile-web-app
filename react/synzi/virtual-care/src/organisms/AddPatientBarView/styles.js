
import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color';


export default createStyleSheet({
    containerStyle: {
        backgroundColor: SynziColor.SYNZI_MEDIUM_GRAY,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
    },
    titleTextStyle: {
        color: 'black',
        fontSize: 16,
        fontWeight: '400',
        marginLeft: 20
    },
});

