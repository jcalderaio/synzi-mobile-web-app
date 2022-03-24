import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor } from '../../../Color';

export default createStyleSheet({
  messagebubbleSent: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    borderRadius: 4,
    backgroundColor: '#e7e7e7'
  },
  messagebubbleTextSent: {
    fontSize: 13,
    padding: 10,
    color: 'black',
    fontWeight: '500',
  }
});

