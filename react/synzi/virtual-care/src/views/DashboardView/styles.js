import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color';
import {
    Dimensions
} from 'react-native';


export default createStyleSheet({

    mainContainerStyle: {
        backgroundColor: 'black',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
    },
    topHeaderContainerStyle: {
        backgroundColor: 'black',
        height: 80,
        alignSelf: "stretch",
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    topHeaderContainerStylePhone: {
        backgroundColor: 'black',
        height: 80,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBarContainerStyle: {
        backgroundColor: SynziColor.SYNZI_WHITE,
        height: 80,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection:'row'
    },
    searchButtonContainerStyle:{
        width:130,
        height:50,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    groupsContainerStyle: {
        backgroundColor: 'black',
        flex:1
    },
    versionLabelContainerStyle :{
        backgroundColor: 'black',
        height: 30,
        alignItems: 'center'
    },
    synziLogoContainerStyle :{
        height: 40,
        width: 130,
        marginLeft: 30,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userControlGroupContainerStyle :{
        height: 55,
        width: 420,
        marginRight: 7,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    userAvatarContainerStyle :{
        height: 45,
        width: 220,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
    },
    navButtonContainerStyle :{
        height: 45,
        width: 75,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainerStyle:{
        backgroundColor: '#001431',
        position: 'absolute',
        top: 0,
        flexDirection: 'column',
        height: Dimensions.get('window').height-150,
        width: Dimensions.get('window').width,
    }
});
