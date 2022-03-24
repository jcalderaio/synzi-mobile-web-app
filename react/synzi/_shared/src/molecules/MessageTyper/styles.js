import { Platform } from 'react-native'
import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor } from '../../../Color';

export default createStyleSheet({
  messagetyper: {
    position: 'relative',
    flexDirection: 'row',
    //justifyContent: 'flex-end',
    //alignItems: 'center',
    //boxSizing: 'border-box',
    paddingVertical: (Platform.OS === 'ios') ? 8 : 0,
    paddingHorizontal: 8,
  },
  messagetyperInput: {
    color: 'white',
    flex: 1,
    fontSize: 14,
    //lineHeight: 16,
    //outline: 'none',
    //border: 'none',
    borderRadius: 4,
    //boxSizing: 'border-box',
    //resize: 'none'
  },
  submitButtonWrapperStyle: {
    justifyContent: 'center',
    paddingRight: 15,
    paddingLeft: 5,
  },
});
