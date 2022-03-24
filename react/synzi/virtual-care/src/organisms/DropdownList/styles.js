import { Platform } from 'react-native';
import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor } from '../../../../_shared/Color';

export default createStyleSheet({
  labelStyle: {
    fontWeight: 'bold',
    color: SynziColor.SYNZI_BLUE,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10
  },
  dropdownWrapper: {
    paddingHorizontal: 10,
  },
  dropdownInput: {
    inputIOS: {
      fontSize: 13,
      backgroundColor: 'white',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: SynziColor.SYNZI_BLUE,
      borderRadius: 4,
      color: 'black'
    },
    inputAndroid: {
        fontSize: 13,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: SynziColor.SYNZI_BLUE,
        borderRadius: 4,
        color: 'black'
    },
  }
});