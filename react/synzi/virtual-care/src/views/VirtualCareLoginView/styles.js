import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color';


export default createStyleSheet({

    
    mainContainerStyle: {
        backgroundColor: 'black',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        flex: 1,
    },
    dashboardContainerStyle: {
        flex: 1,
        backgroundColor: 'black',
    },
    logginInContainerStyle: {
        backgroundColor: 'black',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1,
    },
    logginInGroupStyle:{
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 90
    },
    loginGroupStyle:{
        alignItems: 'center',
    },
    logoStyle: {
        marginBottom: 0,
        backgroundColor: 'red',
    },
    sepStyle: {
        height: 50
    },
    loadingContainerStyle:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },

});
