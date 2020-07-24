import React from 'react';
import {
  View,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Text,
  TouchableWithoutFeedback,
  ImageBackground,
  Image,
  TouchableHighlight,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';

import ListView from 'deprecated-react-native-listview';

import {styles, negativeData} from './Style';
import WavyArea from './../../components/WavyArea/WavyArea';
import FriendItem from './../../components/FriendItem/FriendItem';

import FriendsThreesome from './../../components/FriendsThreesome/FriendsThreesome';
import FriendSingleReceiveInvite from './../../components/FriendSingleReceiveInvite/FriendSingleReceiveInvite';

import Aux from './../../helpers/Aux';
import {
  getFollowingUser,
  getFollowersUser,
  postFollowUser,
  deleteFollowedUser,
  setFriendSelected,
  getListFriend,
  getListRequestFriend,
  getListSendRequestFriend,
  searchUsers,
  sendRequestFriend,
} from './../../domains/follow/ActionCreators';
import {
  getFollowedState,
  getFollowState,
  getStatusState,
  getTabState,
  getlistFriendWithSendRequestState,
  getAllTypeFriendState,
  getNumFriendsState,
} from './../../domains/follow/Selectors';
import {getProfile} from './../../domains/login/Selectors';
import {connect} from 'react-redux';

import AlertCarPooling from '../../components/AlertCarPooling/AlertCarPooling';

import {createSelector, createSelectorCreator, defaultMemoize} from 'reselect';

import JsonQuery from 'json-query';
import {data} from './../../assets/ListCities';

import {strings} from '../../config/i18n';

import branch, {RegisterViewEvent, BranchEvent} from 'react-native-branch';

import {store} from './../../store';
const defaultBUO = {
  title: 'MUV',
};

class SearchFriendsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoading: true,
      refreshing: false,
      nickname: '',
      resultsFriends: [],
      url: '',
      loadingUrl: false,
      AlertCarPooling: false,
      userInvite: {username: 'pippo', id: 0, avatar: 1},
    };
    this.buo = null;

    this.displayStandings = false;
  }

  componentWillMount() {
    this.props.dispatch(getListFriend());
    this.props.dispatch(getListRequestFriend());
    this.props.dispatch(getListSendRequestFriend());
    // searchUsers('ang', data => console.log(data))
  }

  onRefresh() {
    this.setState({refreshing: true});
    this.props.dispatch(getListFriend());
    this.props.dispatch(getListRequestFriend());
    this.props.dispatch(getListSendRequestFriend());

    const loading = setInterval(() => {
      {
        this.setState({refreshing: false});
        clearTimeout(loading);
      }
    }, 1000);
  }
  componentWillReceiveProps(props) {}

  saveSearch = (array) => {
    // funzione per dividere gli array in gruppi di tre per poter fare la schermata
    Array.prototype.chunk = function (n) {
      if (!this.length) {
        return [];
      }
      return [this.slice(0, n)].concat(this.slice(n).chunk(n));
    };

    const listFriend = store.getState().follow.listFriend;
    const listSendRequestFriend = store.getState().follow.listSendRequestFriend;
    console.log(array);
    console.log(listFriend);
    console.log(listSendRequestFriend);
    let arrayWithMyFriends = array.map((elem) => {
      if (listFriend.findIndex((friend) => friend.id == elem.id) != -1) {
        return {
          ...elem,
          type: 'friend',
        };
      } else if (
        listSendRequestFriend.findIndex(
          (friend) => friend.to_user.id == elem.id,
        ) != -1
      ) {
        return {
          ...elem,
          type: 'sendFriend',
        };
      } else {
        return {
          ...elem,
          type: 'inviteFriend',
        };
      }
    });
    console.log(arrayWithMyFriends);

    // prima di divedere controllo se ci sono gia miei amici o se ho invitato qualcuno
    this.setState({resultsFriends: arrayWithMyFriends.chunk(3)});
  };

  handleNickname = (text) => {
    this.setState({nickname: text});

    searchUsers(text, this.saveSearch);
  };

  closeKeyboard = () => {
    setTimeout(() => {
      Keyboard.dismiss();
    }, 500);
  };

  headerSearch() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignContent: 'center',
          alignSelf: 'center',
          width: Dimensions.get('window').width * 0.9,
          height: 70,
          justifyContent: 'space-around',
        }}>
        <View style={styles.input}>
          <TextInput
            value={this.state.nickname}
            autoCapitalize="none"
            placeholder={strings('id_20_21')}
            // placeholderTextColor={"#FFFFFF"}
            // displayError={!this.state.ValidationEmail}
            // errorStyle={{ color: "red" }}
            // errorMessage="Email is invalid"
            style={styles.inputText}
            onChangeText={this.handleNickname}
            blurOnSubmit={false}
            // onSubmitEditing={text => {
            //   this.focusNextField("Password");
            // }}
            // keyboardType="email-address"
            autoCorrect={false}
            // onFocus={this.onFocus}
            returnKeyType={'search'}
            selectionColor={'#707070'}
            onSubmitEditing={this.closeKeyboard}
            // onBlur={() => {
            //   this.setState({ placeholderEmail: strings("id_06") });
            // }}
          />
        </View>
      </View>
    );
  }

  headerCounter() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignContent: 'center',
          alignSelf: 'center',
          width: Dimensions.get('window').width * 0.9,
          height: 110,
          justifyContent: 'space-around',
        }}>
        <View
          style={{
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Montserrat-ExtraBold',
              color: '#000000',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {strings('id_20_19')}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{
              width: 70,
              height: 70,
            }}
            source={require('../../assets/images/friends_banner_icn.png')}
          />
        </View>
      </View>
    );
  }

  renderFriendList() {
    this.displayStandings = true;

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    return (
      <View>
        <ListView
          removeClippedSubviews={false}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          contentContainerStyle={{paddingBottom: 300}}
          style={styles.challengesList}
          dataSource={ds.cloneWithRows(this.state.resultsFriends)}
          renderHeader={() => (
            <View
              style={{
                flexDirection: 'column',
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                width: Dimensions.get('window').width,
              }}>
              <View
                style={{
                  height: 40,
                }}
              />
              <View
                style={{
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'center',
                  paddingTop: 25,
                  paddingBottom: 25,
                  width: Dimensions.get('window').width * 0.9,
                }}>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    color: '#3D3D3D',
                    fontSize: 15,

                    textAlign: 'center',
                  }}>
                  {strings('id_20_22')}
                </Text>
              </View>
              {this.headerSearch()}
              <View
                style={{
                  width: Dimensions.get('window').width * 0.9,
                  height: 30,
                  borderBottomColor: '#FAB21E',
                  borderBottomWidth: 4,
                  borderRadius: 2,
                }}
              />
            </View>
          )}
          renderRow={(item, sectionID, rowID) => {
            const row = parseInt(rowID) + 1;
            if (
              row === 1
              // &&
              // item.user_followed.user_id != this.props.infoProfile.user_id
            ) {
              return (
                <Aux key={rowID}>
                  <FriendsThreesome
                    group={item}
                    row={row}
                    action={this.showAlertCarPooling}
                  />
                </Aux>
              );
            } else if (this.state.resultsFriends.length === row) {
              return (
                <Aux key={rowID}>
                  <FriendsThreesome
                    group={item}
                    row={row}
                    action={this.showAlertCarPooling}
                  />
                  {
                    // aggiungo delo spazio in piu cosi posso scrollare tutta la lista anche se c'e l'onda e la notifica
                    <View style={{width: 400, height: 800}}></View>
                  }
                </Aux>
              );
            } else {
              return (
                <FriendsThreesome
                  group={item}
                  row={row}
                  action={this.showAlertCarPooling}
                />
              );
            }
          }}
        />
      </View>
    );
  }

  renderFriendPage() {
    return this.renderFriendList();
  }

  renderFriend = () => {
    return <Aux>{this.renderFriendPage()}</Aux>;
  };

  closeTutorialCarPooling = () => {
    this.setState({
      AlertCarPooling: false,
    });
  };

  sendRequest = (data) => {
    sendRequestFriend(data, searchUsers(this.state.nickname, this.saveSearch));
    this.closeTutorialCarPooling();
  };

  showAlertCarPooling = (userInvite) => {
    this.setState({
      AlertCarPooling: true,
      userInvite,
    });
  };

  render() {
    return (
      <View
        // style={styles.mainContainer}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
        style={{
          backgroundColor: 'white',
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          backgroundColor: '#FFFFFF',
        }}>
        <AlertCarPooling
          isModalVisible={this.state.AlertCarPooling}
          closeModal={this.closeTutorialCarPooling}
          confermModal={this.sendRequest}
          type={'SearchFriend'}
          infoAlert={this.state.userInvite}
          infoSend={{message: '', to_user: this.state.userInvite.id}}
        />
        {this.renderFriend()}

        <ImageBackground
          source={require('../../assets/images/friend/friends_page_wave.png')}
          style={styles.backgroundImageAbsolute}>
          {this.headerCounter()}
        </ImageBackground>
      </View>
    );
  }
}

const withConnect = connect((state) => {
  return {
    status: getStatusState(state),
  };
});

export default withConnect(SearchFriendsScreen);

// export default StandingsScreen;
