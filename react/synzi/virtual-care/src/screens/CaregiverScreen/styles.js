
import { createStyleSheet } from '../../../../../features/base/styles';
import { SynziColor, AppColor} from '../../../../_shared/Color';


export default createStyleSheet({
    mainContainerStyle:{
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'black',
    },
    sepViewStyle:{
        height: 1,
        backgroundColor: AppColor.LIST_SEP_COLOR,
    },
    textStyle: {
        alignSelf: 'center',
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
        paddingTop: 10,
        paddingBottom: 10
    },
    usersContainerStyle:{
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    errorTextStyle: {
        fontSize: 16,
        color: SynziColor.SYNZI_DARK_GRAY,
        fontWeight: '400',
        alignSelf:'center'
    },
    noResultsContainerStyle:{
        backgroundColor: 'black',
        alignItems: 'center',
        paddingTop: 40,
        flex: 1,
    },
    noResultsStyle: {
        fontSize: 16,
        color: SynziColor.SYNZI_BLUE,
        fontWeight: '400',
        textAlign:'center',
        paddingHorizontal: 20,
    },
    flatListStyle:{
        alignItems: 'flex-start',
        backgroundColor: 'black',
        flex: 1
    },
    searchBarContainer: {
        backgroundColor: '#001431', 
        flex: 0.12, 
        justifyContent: 'center'
    },
    searchBarWrapper: {
        flexDirection: 'row',
        marginHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.3,
        borderColor: 'grey',
        borderRadius: 5,
        paddingLeft: 10
    },
    buttonContainerStyle: {
        flex: 1, 
        paddingHorizontal: 20,
        paddingTop: 80
    },
    createButton: {
        buttonStyle: {
            borderWidth: 1, 
            borderRadius: 5, 
            borderColor: SynziColor.SYNZI_BLUE, 
            color: SynziColor.SYNZI_BLUE
        },
        titleStyle: {
            color: SynziColor.SYNZI_BLUE
        }
    },
});

