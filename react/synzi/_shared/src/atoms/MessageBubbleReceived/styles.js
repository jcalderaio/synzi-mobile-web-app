import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor } from '../../../../_shared/Color';

export default createStyleSheet({
  messagebubbleReceived: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    borderRadius: 4,
    //backgroundColor: '#1b1b1b'
    backgroundColor: SynziColor.SYNZI_BLUE,
    //opacity: 0.3
  },
  messagebubbleTextReceived: {
    fontSize: 13,
    padding: 10,
    //color: 'rgb(255, 255, 255)',
    color: 'black',
    fontWeight: '500',
  }
});

