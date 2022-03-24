import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../Color';


export default createStyleSheet({

    mainContainerStyle: {
        flexDirection: 'row',
        backgroundColor: 'rgba(23, 37, 67, 1)',
        width: 300,
        height: 150,
        borderRadius : 75,
        marginBottom: 35,
        borderColor: 'black',
        borderWidth: 2.0,
    },
    primaryImageContainer: {
        flex:1, 
        justifyContent: 'center'
    },
    incomingPrimaryAvatarStyle: {
        width:150,
        height:150,
        borderRadius : 75,
        borderColor: 'white',
        borderWidth: 1.0,
        opacity:1.0
    },
    incomingSecondaryAvatarStyle: {
        width: 70,
        height: 70,
        borderRadius : 35,
        borderColor: 'white',
        borderWidth: 1.0,
        opacity:1.0,
    },
    incomingCallTextStyle: {
        color: SynziColor.SYNZI_BLUE,
        fontSize: 16,
        marginTop: 3
    },
    callerNameTextStyle:{
        color: 'white',
        width: 130,
        fontSize: 16,
        fontWeight: '400',
        marginTop: 3
    },
    secondaryContainer: {
        flex :1, 
        flexDirection: 'column'
    },
    secondaryImageContainer: {
        flex: 1, 
        marginLeft: 40, 
        justifyContent: 'flex-end'
    }
});
