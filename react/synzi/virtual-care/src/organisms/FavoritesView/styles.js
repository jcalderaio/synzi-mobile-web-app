
import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor } from '../../../../_shared/Color';
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'



export default createStyleSheet({
    favoritesContainerStyle: {
        backgroundColor: SynziColor.SYNZI_MEDIUM_GRAY,
        height: allowSidebar ? 120 : 110,
        justifyContent: 'flex-start',
    },
    favoritesGrayBarStyle: {
        backgroundColor: '#999999',
        height: 3,
        marginBottom: allowSidebar ? 0 : 10
    },
    favoritesListContainerStyle:{
        justifyContent: 'center',
        height: 97,
    },
    favoritesTextStyle: {
        marginTop:5,
        fontSize: 12,
        color: SynziColor.SYNZI_DARK_GRAY,
        fontWeight: '400',
        alignSelf:'center'
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




