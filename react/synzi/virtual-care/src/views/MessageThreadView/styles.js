import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor } from '../../../../_shared/Color';

export default createStyleSheet({
    outerContainer: {
        flex: 1
    },
    mainContainerStyle:{
        backgroundColor: 'black',
        flexDirection: 'column',
        justifyContent: 'space-around',
        flex: 1
    },
    callFirstButtonContainerStyle: {
        backgroundColor: 'black',
        height: 60,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    emptyContainerStyle: {
        backgroundColor: 'black',
        height: 70,
        //alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainerStyle: {
        backgroundColor: 'black',
        //height: 130,
        alignItems: 'center',
        justifyContent: 'center',
    },
    callFirstButtonStyle:{
        backgroundColor: AppColor.BRIGHT_GREEN,
        width: 240,
        height: 40,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sepViewStyle:{
        height: 1,
        backgroundColor: AppColor.LIST_SEP_COLOR,
    },
    phoneIconStyle:{
        width:20,
        height:20,
        marginRight:15
    },
    textStyle: {
        //alignSelf: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20
    },
    emptyStyle: {
        //alignSelf: 'center',
        color: 'white',
        fontSize: 14,
        fontWeight: '300',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30
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
    },
    messagethreadMessages: {
        paddingTop: 20,
        // Padding between last message, and message input
        //paddingBottom: 45,
        paddingLeft: 10,
        paddingRight: 10
    },
    messagethreadStart: {
        color: 'rgba(146, 170, 215, 0.6)',
        textAlign: 'center',
        fontSize: 12,
        lineHeight: 24,
        marginBottom: 10
    },
    messagethreadTyper: {
        backgroundColor: '#111',
    
        paddingHorizontal: 10,
    
        width: '100%',
        borderWidth: 1,
        borderColor: '#324157',
        borderRadius: 25
    }
});
