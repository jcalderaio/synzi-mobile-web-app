import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor } from '../../../../_shared/Color';
import {normalize} from '../../helpers/ResponsiveStylesheet';

export default createStyleSheet({
  usercardthreadButton: {
    position: 'relative',
    height: 72,
    width: '100%',
    paddingLeft: 10,
  
    border: 'none',
    borderBottom: '1px solid',
    borderBottomColor: '#324157',
    backgroundColor: 'transparent',
    outline: 'none',
    textAlign: 'left'
  },
  usercardthread: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  
    height: '100%',
    width: '100%'
  },
  usercardthreadLabel: {
    textAlign: 'left',
    margin: 0,
    padding: 0,
    fontSize: 14,
    fontWeight: '300',
  
    color: 'rgba(255, 255, 255, 0.4)',
  
    width: 244,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  usercardthreadSnippet: {
    color: 'rgba(255, 255, 255, 0.4)',
  
    fontSize: 11,
    fontWeight: '300',
  
    width: '224px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  usercardthreadInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  usercardthreadTime: {
    color: 'rgba(255, 255, 255, 0.4)',
  
    fontSize: 12,
    fontWeight: '300',
  
    position: 'absolute',
    top: 2,
    right: 6
  },
  usercardthreadUnread: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500'
  },
  /* Following are for the placeholder */
  usercardthreadPh: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  
    width: '100%',
    height: 72,
  
    border: 'none',
    borderBottom: '1px solid #2c2c2c',
  
    animation: 'shimmer 2s infinite',
  },
  usercardthreadPhAvatar: {
    height: '28px',
    width: '28px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '50%',
    margin: '0 10px'
  },
  usercardthreadPhText: {
    height: '18px',
    width: '100px',
    borderRadius: '9px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
  }
});
