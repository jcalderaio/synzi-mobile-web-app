import { Platform } from 'react-native';
import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor } from '../../../../_shared/Color';

export default createStyleSheet({
    programContainerStyle: {
        alignItems: 'center', 
        paddingBottom: 10, 
        flexDirection:'row', 
        justifyContent:'flex-start'
    },
    flagIconStyle: {
        width: 30, 
        height: 30,
        marginRight:15,
        tintColor: SynziColor.SYNZI_BLUE,
    },
    programTextStyle: {
        color: SynziColor.SYNZI_BLUE, 
        fontSize: 16
    },
    enrollButtonContainerStyle: {
        flex:1, 
        flexDirection:'row', 
        justifyContent:'flex-end', 
        marginRight:10
    },
    enrollTextStyle: {
        color: SynziColor.SYNZI_BLUE, 
        fontWeight: 'bold',
        fontSize: 12,
    },
    buttonStyle: {
        flexDirection:'row',
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: SynziColor.SYNZI_BLUE,
        padding: 3
    }
});
