import { Platform } from 'react-native';
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'
import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor} from '../../../../_shared/Color';


export default createStyleSheet({
    searchBarContainer: {
        backgroundColor: '#001431', 
        //flex: allowSidebar ? 0.08 : 0.13, 
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBarWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.3,
        borderColor: 'grey',
        borderRadius: 5,
        paddingLeft: 10,
        height: 40
    },
    searchBarInput: {
      height: (Platform.OS === 'android') ? 40 : undefined,
      paddingLeft: 13,
      color: 'grey',
      flex: 1,
      fontSize: allowSidebar ? 20 : null
    },
    deleteIconStyle: {
      paddingRight: 10, 
      paddingLeft: 10
    }
});

