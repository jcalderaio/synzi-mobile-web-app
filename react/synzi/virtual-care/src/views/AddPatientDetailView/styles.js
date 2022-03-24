import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor } from '../../../../_shared/Color';
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'
import {
    Platform
} from 'react-native';


export default createStyleSheet({

    //Tablet Styles
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
    },
    onDemandHeaderContainerStyle:{
        height: 70,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection:'row',
    },
    onDemandAvatarContainerStyle: {
        height:45,
        width:45,
        marginLeft:10
    },
    onDemandTextContainerStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        height: 45,
        marginLeft:5,
        marginRight:5
    },
    onDemandTextStyle: {
        color: 'white',
        fontSize: (Platform.OS === 'android' || allowSidebar) ? 18 : 16,
        fontWeight: '400',
    }
})




