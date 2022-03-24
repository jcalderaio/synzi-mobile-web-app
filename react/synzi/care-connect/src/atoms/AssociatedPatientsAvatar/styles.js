import { createStyleSheet } from '../../../../../features/base/styles';
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'
import { SynziColor, AppColor } from '../../../../_shared/Color';


export default createStyleSheet({
    patientAvatarContainerStyle: {
        width:100, 
        justifyContent: 'center',
        alignItems: 'center',
        marginRight:allowSidebar ? 20 : 0
    },
    inactivePatientAvatarContainerStyle: {
        width:100, 
        justifyContent: 'center',
        alignItems: 'center',
        marginRight:allowSidebar ? 20 : 0
    },
    touchableOpacityStyle:{
        alignItems:'center', 
        justifyContent:'flex-start', 
        flexDirection:'column', 
        flex:1
    },
    inactiveTouchableOpacityStyle:{
        alignItems:'center', 
        justifyContent:'flex-start', 
        flexDirection:'column', 
        flex:1
    },
    userNameTextStyle: {
        color: SynziColor.SYNZI_WHITE,
        marginTop: 5,
        justifyContent:'center', 
        textAlign:'center'
    },
    inactiveUserNameTextStyle: {
        color: SynziColor.SYNZI_WHITE,
        marginTop: 5, 
        justifyContent:'center', 
        textAlign:'center',
        opacity: 0.5
    },
    flatListStyle:{
        height: 100,
        paddingLeft:15
    }

});