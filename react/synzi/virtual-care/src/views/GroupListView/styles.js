import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color';


export default createStyleSheet({

    gridView: {
        paddingTop: 25,
        flex: 1,
    },
    itemContainerWide: {
        justifyContent: 'center',
        borderRadius: 5,
        padding: 0,
        height: 100,
        backgroundColor:'#e8f0fe',
        paddingLeft:5,
        paddingRight:5,
    },
    itemContainerNarrow: {
        justifyContent: 'center',
        borderRadius: 5,
        padding: 0,
        height: 65,
        backgroundColor:'#e8f0fe',
        paddingLeft:5,
        paddingRight:5,
    },
    itemName: {
        fontSize: 16,
        color: SynziColor.SYNZI_DARK_BLUE,
        fontWeight: '800',
        textAlign: 'center'
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
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