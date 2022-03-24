import { Platform } from 'react-native'
import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor} from '../../../../_shared/Color';
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'

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
    },
    tabletItemContainer: {
        flex:1
    },
    patientSeparatorStyle:{
        height:1,
        backgroundColor:SynziColor.SYNZI_DARK_GRAY,
    },
    patientBlueTextStyle:{
        color: SynziColor.SYNZI_BLUE,
        fontSize: 16,
        fontWeight: '500',
        width:110,
    },
    patientDataHeaderContainerStyle:{
        height: 120,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection:'row',
    },
    patientAvatarContainerStyle:{
        height:75,
        width:75,
        marginLeft:15
    },
    patientNameContainerStyle:{
        height:85,
        width:200,
        marginLeft: allowSidebar ? 10 : 5,
        flex:1,
        justifyContent: 'center',
    },
    patientNameTextStyle: {
        color: 'white',
        fontSize: (Platform.OS === 'android' || allowSidebar) ? 18 : 16,
        width: (Platform.OS === 'android' || allowSidebar) ? 140 : 110
    },
    patientTagContainerViewStyle:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 3
    },
    patientCallButtonContainerStyle:{
        flex: 1,
        flexDirection: 'row',
        marginRight: 5,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height:75,
        width:75,
    },
    loadingContainerStyle:{
        alignItems: 'center',
        justifyContent: 'center',
        flex:1,
    },
    buttonGroupStyle: {
        flexDirection:'row', 
        justifyContent:'center', 
        paddingVertical: 10
    },
    buttonContainerStyle: {
        flex: 1, 
        paddingHorizontal: 10
    },
    cancelButton: {
        buttonStyle: {
            borderWidth: 1.5, 
            borderRadius: 5, 
            borderColor: SynziColor.SYNZI_BLUE, 
            color: SynziColor.SYNZI_BLUE
        },
        titleStyle: {
            color: SynziColor.SYNZI_BLUE, 
            fontWeight: 'bold'
        }
    },
    createButton: {
        buttonStyle: {
            borderWidth: 1.5, 
            borderRadius: 5, 
            borderColor: SynziColor.SYNZI_BLUE, 
            backgroundColor: SynziColor.SYNZI_BLUE
        },
        titleStyle: {
            color: 'black', 
            fontWeight: 'bold'
        },
        disabledStyle: {
            borderWidth: 1.5, 
            borderRadius: 5, 
            borderColor: SynziColor.SYNZI_BLUE, 
            backgroundColor: SynziColor.SYNZI_BLUE,
            opacity: 0.25
        },
        disabledTitleStyle: {
            color: 'black', 
            fontWeight: 'bold'
        }
    }
});

