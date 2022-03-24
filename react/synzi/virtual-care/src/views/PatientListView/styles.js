import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color';


export default createStyleSheet({

    gridView: {
        paddingTop: 25,
        flex: 1,
    },
    mainContainerStyle:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    leftNavPhoneContainerStyle:{
        flex:1,
    },
    leftNavContainerStyle:{
        width: 275
    },
    contentContainerStyle:{
        flex:1,
    },
    spinnerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorContainerStyle:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorTextStyle: {
      fontSize: 16,
      color: SynziColor.SYNZI_DARK_GRAY,
      fontWeight: '400',
      alignSelf:'center'
    },
})