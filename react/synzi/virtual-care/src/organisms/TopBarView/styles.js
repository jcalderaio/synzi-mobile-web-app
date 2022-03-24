import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor } from '../../../../_shared/Color';

const generateStyles = (isWideHeader) => {
    return({

        mainContainerStyle: {
            backgroundColor: 'black',
            justifyContent: 'center',
            height: 80,
        },
        topHeaderContainerStyle: {
            height: 80,
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
            flexDirection: 'row',
            flex: 1
        },
        buttonsHiddenContainerStyle: {
            height: 80,
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginTop: 10,
            flexDirection: 'row',
            flex: 1
        },
        topHeaderContainerPhoneStyle: {
            height: 80,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            flexDirection: 'row',
            flex: 1
        },
        synziLogoContainerStyle :{
            height: 45,
            width: (isWideHeader ? 150 : 80),
            marginLeft: (isWideHeader ? 20 : 10),
            marginTop: (isWideHeader ? 0 : 5),
            alignItems: 'flex-start',
            justifyContent: 'center',
        },
        userControlGroupSingleButtonContainerStyle :{
            height: 45,
            width: (isWideHeader ? 170 : 140),
            marginTop: (isWideHeader ? 0 : 5),
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
        },
        userControlGroupDualButtonContainerStyle :{
            height: 45,
            width: (isWideHeader ? 170 : 140),
            marginTop: (isWideHeader ? 0 : 5),
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
        },
        userControlGroupTripleButtonContainerStyle :{
            flex: 1,
            height: 45,
            //width: (isWideHeader ? 170 : 190),
            marginRight: 15,
            marginTop: (isWideHeader ? 0 : 5),
            justifyContent: 'space-around',
            flexDirection: 'row',
            alignItems: 'center',
        },
        userAvatarContainerStyle :{
            width: (isWideHeader ? 200 : 45),
            marginRight: 10,
            marginTop: (isWideHeader ? 0 : 5),
            justifyContent: 'flex-end',
            flexDirection: 'row',
            alignItems: 'center',
        },
        navButtonContainerStyle :{
            height: 45,
            width: 75,
            alignItems: 'center',
            justifyContent: 'center',
        },
        userNameTextStyle: {
            color: 'white',
            fontSize: 16,
            fontWeight: '600',
        },

         /** Phone Styles */
        phoneContainerStyle:{
            backgroundColor: 'black',
            height: 80,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        }
    })
};


export const phoneStyles = createStyleSheet(generateStyles(false))
export const tabletStyles = createStyleSheet(generateStyles(true))