import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color';


export default createStyleSheet({

    tagTextStyle: {
        color: 'white',
        fontSize: 11,
        fontWeight: '200',
    },
    tagTextContainerStyle:{
        borderRadius: 7,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 2,
        paddingBottom: 2,
        marginRight: 5,
        backgroundColor: SynziColor.SYNZI_ULTRA_DARK_GRAY,
    }
   
});


