import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor } from '../../../../_shared/Color';


export default createStyleSheet({

    //Tablet Styles
    buttonContainerStyle: {
        width:100,
        height:50,
        backgroundColor:SynziColor.SYNZI_BLUE,
        marginRight:15,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center'
    },

    //Tablet Styles
    buttonContainerDisabledStyle: {
        width:100,
        height:50,
        backgroundColor:SynziColor.SYNZI_BLUE,
        marginRight:15,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        opacity:0.25
    },
    
})




