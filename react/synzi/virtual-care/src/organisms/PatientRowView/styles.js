
import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color';


export default createStyleSheet({
    rowContainerStyle: {
        backgroundColor: 'black',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 70,
    },
    selectedRowContainerStyle: {
        backgroundColor: SynziColor.SYNZI_BLUE,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 70,
    },
    userAvatarStyle:{
        marginLeft:20,
        width: 38,
        height: 38,
    },
    textContainerStyle:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        height: 45,
        marginLeft:20,
        marginRight:20
    },
    callButtonStyle:{
        marginRight:20
    },
    userNameTextStyle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '400',
    },
    tagContainerViewStyle:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 3
    },
});

