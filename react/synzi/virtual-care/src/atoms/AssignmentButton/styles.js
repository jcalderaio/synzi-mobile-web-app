import { Platform } from 'react-native';
import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor } from '../../../../_shared/Color';

export default createStyleSheet({
  borderContainerStyle: {
    flex:1, 
    alignItems: 'center', 
    marginRight: 10,
    flexDirection:'row',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: SynziColor.SYNZI_BLUE,
    padding: 5,
    backgroundColor: SynziColor.SYNZI_BLUE
  },
  programContainerStyle: {
    alignItems: 'center', 
    flexDirection:'row', 
    justifyContent:'flex-start'
  },
  programTextStyle: {
    color: 'white', 
    fontWeight: 'bold',
    fontSize: 13,
  },
  programButtonContainerStyle: {
      flex:1, 
      flexDirection:'row', 
      justifyContent:'flex-end', 
      marginRight:10
  },
  enrollTextStyle: {
      color: SynziColor.SYNZI_BLUE, 
      fontWeight: 'bold',
      fontSize: 12,
  },
  buttonStyle: {
      flexDirection:'row',
      alignItems: 'center', 
      justifyContent: 'center',
      borderRadius: 4,
      borderWidth: 2,
      borderColor: SynziColor.SYNZI_BLUE,
      padding: 3
  },
  deleteIconStyle: {
    width: 20, 
    height: 20,
    tintColor: 'red'
  },
});
