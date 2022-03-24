
import { createStyleSheet } from '../../../../../features/base/styles';
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'


export default createStyleSheet({
    favoriteAvatarContainerStyle: {
        width:90, 
        marginRight:allowSidebar ? 20 : 0
    },
    touchableOpacityStyle:{
        alignItems:'center', 
        justifyContent:'flex-start', 
        flexDirection:'column', 
        flex:1
    },
    favoritesGrayBarStyle: {
        backgroundColor: '#999999',
        height: 3,
    },
    favoriteAvatarTextStyle: {
        marginTop: 5, 
        marginBottom: 10, 
        justifyContent:'center', 
        textAlign:'center',
    },
    flatListStyle:{
        height: 100,
        paddingLeft:15
    }

});




