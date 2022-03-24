import {
    Platform
} from 'react-native';
import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color';


export default createStyleSheet({
    searchBarContainerStyle: {
        backgroundColor: SynziColor.SYNZI_WHITE,
        height: 70,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection:'row'
    },
    searchButtonContainerStyle:{
        width:90,
        height:50,
        marginLeft:5,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection:'row',
    },
    searchCloseButtonContainerStyle:{
        width:90,
        height:50,
        marginLeft:5,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection:'row',
        paddingRight: 10
    },
    inputStyle:{
        textAlign: 'left',
        color: '#000',
        paddingRight: 5,
        paddingLeft: 5,
        marginLeft: 5,
        fontSize: 18,
        lineHeight: 23,
        height: Platform.OS === 'ios' ? 30 : 60,
        width: 200
    },
    iconSize:{
        marginLeft: 10,
        width:20,
        height:20
    },
    searchCloseButtonStyle:{
        marginRight: 25,
    }
});

