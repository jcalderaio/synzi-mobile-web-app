import { createStyleSheet } from '../../../../../features/base/styles';
import { AppColor } from '../../../../_shared/Color';


export default createStyleSheet({

    iconSize:{
        width:50,
        height:50,
    },
    statusViewStyle:{
        backgroundColor: AppColor.BRIGHT_GREEN,
        position: 'absolute',
        top: 28,
        left: 30,
        width: 14,
        height: 14,
        borderRadius:8,
        borderWidth:1,
        borderColor:'black'
    },
    statusViewDisconnectedStyle:{
        backgroundColor: AppColor.BRIGHT_GREEN,
        position: 'absolute',
        top: 28,
        left: 30,
        width: 14,
        height: 14,
        borderRadius:8,
        borderWidth:1,
        borderColor:'black'
    },
   
});
