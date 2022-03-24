import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color';


export default createStyleSheet({

    containerStyle: {
        flex: 1,
        backgroundColor: 'red',
    },
    headerContainerStyle:{
        height: 60,
        backgroundColor: SynziColor.SYNZI_MEDIUM_GRAY,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    childContainerStyle:{
        flex: 1
    },
    buttonTextContainer:{
        width:70,
        height:30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:25
    },
    headerTextContainer:{
        width:150,
        height:30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:25
    },
    boldTextStyle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 14
    }


})
