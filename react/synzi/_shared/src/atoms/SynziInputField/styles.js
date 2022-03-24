import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor } from '../../../../_shared/Color';


export default createStyleSheet({

    inputContainerStyle: {
        height: 20,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 5,
        marginBottom: 0,
        marginLeft: 20,
        marginRight: 20
    },

    inputStyle: {
        textAlign: 'center',
        color: '#000',
        paddingRight: 5,
        paddingLeft: 5,
        fontSize: 18,
        flex: 2,
        backgroundColor: '#ffffff',
        height: 45
    },
   
});
