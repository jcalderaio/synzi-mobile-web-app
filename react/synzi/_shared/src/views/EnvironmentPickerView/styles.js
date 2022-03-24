import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color'


export default createStyleSheet({

    pickerItemWrapperStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      pickerItemStyle: {
        backgroundColor: 'black',
        height: 60,
        justifyContent: 'center',
        flex: 1,
      },
      pickerItemHeaderTextStyle: {
        fontSize: 18,
        fontWeight: 'normal',
        color: SynziColor.SYNZI_MEDIUM_GRAY,
        marginLeft: 10,
      },
      pickerItemHeaderInActiveTextStyle: {
        fontSize: 18,
        fontWeight: 'normal',
        color: '#666666',
        marginLeft: 10,
      },
      pickerItemSubHeaderTextStyle: {
        fontSize: 12,
        fontWeight: 'normal',
        color: '#666666',
        marginLeft: 10,
      },
      pickerItemCheckMark: {
        height: 60,
        width: 60,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
      },
      pickerCheckMarkImage: {
        height: 30,
        width: 30,
      },

});
