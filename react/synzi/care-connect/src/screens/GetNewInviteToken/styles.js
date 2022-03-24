import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color';


export default createStyleSheet({

    mainContainerStyle: {
        flexDirection: 'column',
        // backgroundColor: 'rgba(23, 37, 67, 0.9)',
        backgroundColor: SynziColor.SYNZI_BLACK,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    callerNameTextStyle:{
        alignSelf: 'center',
        color: SynziColor.SYNZI_MEDIUM_GRAY,
        fontSize: 28,
        fontWeight: '400',
        textAlign: 'center',
        paddingHorizontal: 30
    },
    loadingContainerStyle: {
        paddingVertical: 40
    },
    errorTextStyle: {
        fontSize: 16,
        color: SynziColor.SYNZI_MEDIUM_GRAY,
        fontWeight: '400',
        textAlign:'center'
    },
    errorpageMessage: { 
        paddingTop: 20,
        fontWeight: '300',
        fontSize: 14,
        color: 'white',
        paddingHorizontal: 20,
        textAlign: 'center'
      },
      errorpageErrorButton: { 
        position: 'absolute',
        bottom: 20,
        left: 50,
        right: 50,
      
        fontWeight: '300',
        fontSize: 10,
        textAlign: 'center',
      
        color: '#607396',
        backgroundColor: 'transparent',
      
        border: 'none',
        paddingVertical: 2,
        paddingHorizontal: 4
      },
      mainErrorContainerStyle: { 
        flexDirection: 'column',
        backgroundColor: 'rgba(23, 37, 67, 0.9)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
});
