import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color';


export default createStyleSheet({

    buttonContainerStyle: {
        flexDirection: 'row',
        width:100,
        height:30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        alignSelf: 'center',
        color: SynziColor.SYNZI_DARK_BLUE,
        fontSize: 14,
        fontWeight: '600',
        justifyContent: 'center',
        marginLeft:7
    },
    iconSize:{
        width:20,
        height:20,
    }
   
});
