import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor } from '../../../../_shared/Color';
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'


export default createStyleSheet({
    patientBarContainerStyle: {
        backgroundColor: "#001431",
        height: allowSidebar ? 120 : 110,
        justifyContent: 'center',
    },
    patientsBarStyle: {
        backgroundColor: '#999999',
        height: 3,
        marginBottom: allowSidebar ? 0 : 10
    },
    patientsListContainerStyle:{
        justifyContent: 'center',
        height: 97,
    },
    patientsTextStyle: {
        marginTop:5,
        fontSize: 12,
        color: SynziColor.SYNZI_DARK_GRAY,
        fontWeight: '400',
        alignSelf:'center'
    },
    loadingContainerStyle: {
        backgroundColor: 'black',
        height: 130,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatListStyle:{
        height: allowSidebar ? 100 : 80,
        paddingLeft:15
    },
    errorTextStyle: {
        marginTop:5,
        fontSize: 14,
        color: SynziColor.SYNZI_DARK_GRAY,
        fontWeight: '400',
        alignSelf:'center'
    },

});