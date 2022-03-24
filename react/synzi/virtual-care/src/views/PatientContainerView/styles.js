import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor } from '../../../../_shared/Color';


export default createStyleSheet({

    //Tablet Styles
    loadingContainerStyle:{
        alignItems: 'center',
        justifyContent: 'center',
        flex:1,
        backgroundColor:'black'
    },
    errorTextStyle: {
        fontSize: 16,
        color: SynziColor.SYNZI_DARK_GRAY,
        fontWeight: '400',
        alignSelf:'center'
    },
})




