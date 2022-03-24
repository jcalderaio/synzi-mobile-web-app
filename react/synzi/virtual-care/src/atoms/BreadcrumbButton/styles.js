import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color';


export default createStyleSheet({

    buttonContainerStyle: {
        flexDirection: 'row',
        height:30,
    },
    textLinkStyle: {
        alignSelf: 'center',
        color: SynziColor.SYNZI_BLUE,
        fontSize: 14,
        fontWeight: '600',
        justifyContent: 'center',
        marginLeft:7
    },
    textStyle: {
        alignSelf: 'center',
        color: 'black',
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
