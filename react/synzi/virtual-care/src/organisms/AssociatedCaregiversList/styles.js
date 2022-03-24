
import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor} from '../../../../_shared/Color';


export default createStyleSheet({
    mainContainerStyle:{
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'black',
    },
    sepViewStyle:{
        height: 1,
        backgroundColor: AppColor.LIST_SEP_COLOR,
    },
    textStyle: {
        alignSelf: 'center',
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
        paddingTop: 10,
        paddingBottom: 10
    },
    usersContainerStyle:{
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    errorTextStyle: {
        fontSize: 16,
        color: SynziColor.SYNZI_DARK_GRAY,
        fontWeight: '400',
        alignSelf:'center'
    },
    flatListStyle:{
        alignItems: 'flex-start',
        backgroundColor: 'black',
        flex: 1
    }
});

