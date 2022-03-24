import { Platform } from 'react-native';
import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor } from '../../../../_shared/Color';

export default createStyleSheet({
  mainContainerStyle:{
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'flex-start',
      backgroundColor: 'black',
  },
  loadingContainerStyle: {
      backgroundColor: 'black',
      //height: 130,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 175
  },
  errorTextStyle: {
      fontSize: 16,
      color: SynziColor.SYNZI_DARK_GRAY,
      fontWeight: '400',
      alignSelf:'center'
  },
  ondemandmessageWrap: {
    flex: 1,
    marginTop: 10
  },
  ondemandmessageTitle: {
    textAlign: 'center',
    color: SynziColor.SYNZI_WHITE,
    marginBottom: 3
  },
  pickerMessage: {
    fontWeight: 'bold',
    color: SynziColor.SYNZI_BLUE,
    marginTop: 5,
    paddingLeft: 10
  },
  ondemandmessagePhi: {
    fontStyle: 'italic',
    color: SynziColor.SYNZI_BLUE,
    marginTop: 20,
    //marginBottom: 4,
    paddingLeft: 10,
    paddingRight: 10
  },
  ondemandmessageButton: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    backgroundColor: SynziColor.SYNZI_BLUE,
    border: 'none',
    paddingLeft: 4,
    marginLeft: 'auto',
    borderRadius: '50%',
    outline: 'none',
    height: 36,
    width: 36,
  
    /* margin-left: 10px; */
  },
  ondemandmessageInput: {
    backgroundColor: SynziColor.SYNZI_WHITE,
    paddingHorizontal: 5,
    flex: 0.9,
    fontSize: 13,
    borderRadius: 2,
  },
  ondemandmessageMessageWrapper: {
    marginTop: 10,
    paddingHorizontal: 10,
    height: 75
  },
  ondemandmessageInfoRow: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10
  }
});