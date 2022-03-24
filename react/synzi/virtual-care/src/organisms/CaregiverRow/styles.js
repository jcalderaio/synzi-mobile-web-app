
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
    searchRowContainerStyle: {
        backgroundColor: '#001431',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 70,
    },
    userAvatarStyle:{
        marginLeft: 20,
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
    textContainerInactiveStyle:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        height: 45,
        marginLeft:20,
        marginRight:20,
        opacity: 0.5
    },
    callButtonStyle:{
        flexDirection: 'row',
        marginRight:20
    },
    userNameTextStyle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '400',
    },
    phoneTextStyle: {
        color: 'gray',
        fontSize: 13,
        paddingTop: 3,
    },
    tagContainerViewStyle:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 3
    },
    errorTextStyle: {
        fontSize: 16,
        color: SynziColor.SYNZI_DARK_GRAY,
        fontWeight: '400',
        alignSelf:'center'
    },
});

