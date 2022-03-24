import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  Platform,
  Alert,
  NetInfo,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Button } from 'react-native-elements';
import CaregiverSearchBar from '../../organisms/CaregiverSearchBar/CaregiverSearchBar';
import { LogSeparator } from '../../../../_shared/constants/AppConfig';
import TopBarView from '../../organisms/TopBarView/TopBarView';
import CaregiverRow from '../../organisms/CaregiverRow/CaregiverRow';
import BreadcrumbView from '../../organisms/BreadcrumbView/BreadcrumbView';
import { AppColor } from '../../../../_shared/Color';
import CaregiverQL from '../../../../_shared/graphql/CaregiverQL';
import { Query } from 'react-apollo';
import { formatPhone } from '../../../../_shared/helpers/Helpers';
import { withNavigationFocus } from 'react-navigation';
import { allowSidebar } from '../../../../_shared/src/OrientationResponsiveComponent';
import deviceLog from 'react-native-device-log';
import Reactotron from 'reactotron-react-native';

import styles from './styles';

class CaregiverScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
      rawPhone: '',
      formattedPhone: '',
    };
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange
    );
  }

  // If coming from CreateCaregiver, send user to PatientDetail screen.
  componentDidUpdate() {
    const fromScreen = this.props.navigation.getParam('fromScreen');
    if (
      allowSidebar &&
      this.props.isFocused &&
      fromScreen === 'CreateCaregiver'
    ) {
      this.props.navigation.goBack();
    }
  }

  handleConnectivityChange = (isConnected) => {
    this.setState({ isConnected });
  };

  _renderItem = ({ item, separators }) => {
    const patientName = this.props.navigation.getParam('patientName', '');
    const patientId = this.props.navigation.getParam('patientId', '0');

    return (
      <CaregiverRow
        caregiverProfileImage={item.user.profileImage}
        caregiverName={item.user.displayName}
        caregiverId={item.id}
        patientName={patientName}
        patientId={patientId}
        phone={item.user.phone}
        goBack={() => this.props.navigation.goBack()}
      />
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: Platform.OS === 'ios' ? 1 : 0.5,
          width: '100%',
          backgroundColor: AppColor.LIST_SEP_COLOR,
        }}
      />
    );
  };

  renderErrorState(errorText) {
    return <Text style={styles.errorTextStyle}>{errorText}</Text>;
  }

  renderLoadingState() {
    return <ActivityIndicator size={'large'} />;
  }

  _handleResults(results) {
    this.setState({ results });
  }

  render() {
    const userName = this.props.navigation.getParam('userName', '');
    const userId = this.props.navigation.getParam('userId', 0);
    const profileImage = this.props.navigation.getParam('profileImage', '0');
    const enterpriseId = this.props.navigation.getParam('enterpriseId', '0');
    const patientName = this.props.navigation.getParam('patientName', '');
    const patientId = this.props.navigation.getParam('patientId', '0');
    const patientUserId = this.props.navigation.getParam('patientUserId', '0');
    //const enterpriseImage = this.props.navigation.getParam('enterpriseImage', '0');

    const { isConnected, rawPhone, formattedPhone } = this.state;

    const GET_CAREGIVERS_BY_PHONE = CaregiverQL.getCaregiversByPhone();

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.mainContainerStyle}>
          <TopBarView
            userId={userId}
            profileImage={profileImage}
            userName={userName}
            hideButtons={true}
            socketState={this.props.screenProps.socketState}
            closeSocket={this.props.screenProps.closeSocket}
          />
          <BreadcrumbView
            //logoImage={enterpriseImage}
            navigateCreateCaregiver={() => {
              this.props.navigation.navigate('CreateCaregiver', {
                userName,
                userId,
                profileImage,
                enterpriseId,
                patientName,
                patientUserId,
                phoneNumber: rawPhone.length === 10 ? rawPhone : null,
              });
            }}
            isCaregiver={true}
            breadCrumbText={'Find a Caregiver'}
            goBack={() => this.props.navigation.goBack()}
          />
          <CaregiverSearchBar
            clearSearch={() =>
              this.setState({ rawPhone: '', formattedPhone: '' })
            }
            searchTerm={formattedPhone}
            updateSearch={(phone) => this.setState(formatPhone(phone))}
          />
          <Query
            fetchPolicy={'cache-and-network'}
            pollInterval={isConnected ? 5000 : 0}
            variables={{ phone: rawPhone }}
            query={GET_CAREGIVERS_BY_PHONE}
            skip={rawPhone.length < 10}
          >
            {({ loading, error, data, networkStatus }) => {
              if (loading && networkStatus !== 6) {
                return (
                  <View style={styles.usersContainerStyle}>
                    {this.renderLoadingState()}
                  </View>
                );
              }

              if (error) {
                return (
                  <View style={styles.usersContainerStyle}>
                    {this.renderErrorState(error.message)}
                  </View>
                );
              }

              let caregivers = [];

              if (data) {
                caregivers = data.caregivers.filter((c) => c.user.isActive);

                if (caregivers.length > 0) {
                  return (
                    <FlatList
                      data={caregivers}
                      renderItem={this._renderItem}
                      ItemSeparatorComponent={this.renderSeparator}
                      keyExtractor={(item) => item.id}
                    />
                  );
                }

                return (
                  <View style={styles.noResultsContainerStyle}>
                    <Text style={styles.noResultsStyle}>
                      We couldn't find a Caregiver with that phone number.
                    </Text>
                    <View style={styles.buttonContainerStyle}>
                      <Button
                        onPress={() => {
                          this.props.navigation.navigate('CreateCaregiver', {
                            userName,
                            userId,
                            profileImage,
                            enterpriseId,
                            patientName,
                            patientUserId,
                            phoneNumber:
                              rawPhone.length === 10 ? rawPhone : null,
                          });
                        }}
                        buttonStyle={styles.createButton.buttonStyle}
                        titleStyle={styles.createButton.titleStyle}
                        title="Create a Caregiver with that number"
                        type="outline"
                      />
                    </View>
                  </View>
                );
              }

              return null;
            }}
          </Query>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default withNavigationFocus(CaregiverScreen);
