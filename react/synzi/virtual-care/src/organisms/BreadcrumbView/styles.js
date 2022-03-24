import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent'
import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color';


export default createStyleSheet({
    breadcrumbContainerStyle: {
        backgroundColor: SynziColor.SYNZI_WHITE,
        height: allowSidebar ? 80 : 55,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection:'row'
    },
    breadcrumbButtonContainerStyle:{
        paddingLeft:12,
    }
});

