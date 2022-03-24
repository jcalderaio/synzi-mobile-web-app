import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../Color';


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
        marginLeft:20,
        width: 38,
        height: 38,
    },
    detailsContainerStyle:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        height: 45,
        marginLeft:20,
        marginRight:20
    },
    detailsContainerInactiveStyle:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        height: 45,
        marginLeft:20,
        marginRight:20,
        opacity: 0.5
    },
    messageTextStyle: {
        color: 'gray',
        fontSize: 13,
        paddingTop: 3,
    },
    timeStampAlignStyle:{
        marginRight:20,
    },
    timeStampTextStyle: {
        color: 'gray',
        fontSize: 12
    },
    userNameTextStyle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '400',
    },
    userUnreadStyle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500'
    },
});

