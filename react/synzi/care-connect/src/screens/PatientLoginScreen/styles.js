import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color';
import {normalize} from '../../helpers/ResponsiveStylesheet';
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'

export default createStyleSheet({
  outerContainer: {
    flex: 1
  },
  mainContainerStyle: {
    backgroundColor: 'black',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignSelf: 'stretch',
    flex: 1
  },
  dashboardContainerStyle: {
    flex: 1,
    backgroundColor: 'black'
  },
  logginInContainerStyle: {
    backgroundColor: 'black',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1
  },
  logginInGroupStyle: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 90
  },
  loginGroupStyle: {
    alignItems: 'center'
  },
  logoStyle: {
    marginBottom: normalize(60)
  },
  sepStyle: {
    height: normalize(50)
  },
  smallSepStyle: {
    marginTop: normalize(20)
  },
  loadingContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  continueButtonStyle: {
    width: normalize(240),
    justifyContent: 'flex-end',
    //marginTop: 70
  },
  titleTextStyle: {
    paddingHorizontal: normalize(50),
    alignSelf: 'center',
    textAlign:'center',
    color: '#fff',
    fontSize: (allowSidebar ? normalize(18) : normalize(16)),
    fontWeight: '400',
    marginBottom: normalize(15)
    //marginTop: 15
  },
  messageTextStyle: {
    fontSize: (allowSidebar ? normalize(14) : normalize(12)),
    color: '#fff',
    paddingHorizontal: normalize(50),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: normalize(15)
  },
});
