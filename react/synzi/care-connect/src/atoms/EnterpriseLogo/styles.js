import {
    Platform
} from 'react-native';
import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color';


export default createStyleSheet({
    logoContainerStyle: {
        backgroundColor: SynziColor.SYNZI_WHITE,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        alignSelf: 'stretch',
    },
});