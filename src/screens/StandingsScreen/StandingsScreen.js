import React from 'react';
import {
  View,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  TouchableHighlight,
} from 'react-native';

import ListView from 'deprecated-react-native-listview';

import Svg, {Circle, Line} from 'react-native-svg';

import {styles, negativeData} from './Style';
import WavyArea from './../../components/WavyArea/WavyArea';
import UserItem from './../../components/UserItem/UserItem';

import InviteItem from './../../components/InviteItem/InviteItem';
import InviteNoFriendScreen from './../../components/InviteNoFriendScreen/InviteNoFriendScreen';
import InviteFriendsWave from './../../components/InviteFriendsWave/InviteFriendsWave';
import Aux from './../../helpers/Aux';
import {getSponsor} from './../../helpers/Sponsors.js';

import {
  getLeaderboard,
  getMonthlyLeaderboard,
  getWeeklyLeaderboard,
  getLeaderboardByCity,
  getMonthlyLeaderboardByCity,
  getWeeklyLeaderboardByCity,
  getWeeklyFriendLeaderboard,
  getWeeklyLeaderboardNew,
  getSpecificPositionNew,
} from './../../domains/standings/ActionCreators';
import {connect} from 'react-redux';
import pointsDecimal from '../../helpers/pointsDecimal';
import OwnIcon from '../../components/OwnIcon/OwnIcon';
import {createSelector} from 'reselect';
import {getFollowedState} from './../../domains/follow/Selectors';
import {getFollowingUser} from './../../domains/follow/ActionCreators';
import {strings} from '../../config/i18n';

import LinearGradient from 'react-native-linear-gradient';
import {changeScreenProfile} from './../../domains/trainings/ActionCreators';

// import { pushNotifications } from "./../../services";

class StandingsScreen extends React.Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      showLoading: true,
      refreshing: false,
      refreshingFriend: false,
      endScrollRefresh: false,
    };

    this.displayStandings = false;
  }
  componentWillMount() {
    // pushNotifications.configure();
    // pushNotifications.userIsStillNotification();
    // this.props.dispatch(getLeaderboardByCity());
    // if (this.props.standingsState.error) {
    //   Alert.alert("Oops", "Seems like an error occured, pull to refresh");
    // }
  }

  myProfile = () => {
    // this.props.dispatch(changeScreenProfile("myself"));
    this.props.navigation.navigate('Info');
  };

  onRefresh() {
    this.setState({refreshing: true});
    // this.props.dispatch(getLeaderboard());
    // this.props.dispatch(getLeaderboardByCity());

    // if (this.props.activeSelectable == "global")
    //   if (this.props.selectedTime == "monthly")
    //     this.props.dispatch(getMonthlyLeaderboard());
    //   else if (this.props.selectedTime == "weekly")
    //     this.props.dispatch(getWeeklyLeaderboardNew());
    //   else this.props.dispatch(getLeaderboard());
    // else if (this.props.activeSelectable == "city")
    //   if (this.props.selectedTime == "monthly")
    //     this.props.dispatch(getMonthlyLeaderboardByCity());
    //   else if (this.props.selectedTime == "weekly")
    //     this.props.dispatch(getWeeklyLeaderboardByCity());
    //   else this.props.dispatch(getLeaderboardByCity());
    getSpecificPositionNew();
    if (this.props.activeSelectable == 'global') {
      this.props.dispatch(getWeeklyLeaderboardNew());
    } else if (this.props.activeSelectable == 'city') {
      this.props.dispatch(getWeeklyLeaderboardByCity());
    } else {
      this.props.dispatch(getWeeklyFriendLeaderboard());
      this.props.dispatch(getFollowingUser());
    }

    if (this.props.checkBlock) {
      // quando aggiorno controllo anche l'orario per sapere se devo frizzare la classifica
      this.props.checkBlock();
    }
    if (this.props.standingsState.error) {
      Alert.alert('Oops', 'Seems like an error occured, pull to refresh');
    }
    const loading = setInterval(() => {
      if (this.props.standingsState.standing.length > 0) {
        this.setState({refreshing: false});
        clearTimeout(loading);
      }
    }, 1000);
  }
  // componentWillReceiveProps(props) {
  //   if (
  //     props.standingsState.selectedTiming !=
  //     this.props.standingsState.selectedTiming
  //   ) {
  //     // activeSelectable;
  //     // selectedTime;
  //     // if (props.activeSelectable == "global")
  //     //   if (props.selectedTime == "monthly")
  //     //     this.props.dispatch(getMonthlyLeaderboard());
  //     //   else if (props.selectedTime == "weekly")
  //     //     this.props.dispatch(getWeeklyLeaderboardNew());
  //     //   else this.props.dispatch(getLeaderboard());
  //     // else if (props.activeSelectable == "city")
  //     //   if (props.selectedTime == "monthly")
  //     //     this.props.dispatch(getMonthlyLeaderboardByCity());
  //     //   else if (props.selectedTime == "weekly")
  //     //     this.props.dispatch(getWeeklyLeaderboardByCity());
  //     //   else this.props.dispatch(getLeaderboardByCity());

  //   }

  //   if (this.props.checkBlock) {
  //     // quando aggiorno controllo anche l'orario per sapere se devo frizzare la classifica
  //     this.props.checkBlock();
  //   }
  //   // if (props.standingsState.standing.length > 0)
  //   this.setState({ showLoading: false });
  // }

  onRefreshFriend() {
    this.setState({refreshingFriend: true});
    this.props.dispatch(getWeeklyFriendLeaderboard());
    this.props.dispatch(getFollowingUser());

    const loading = setInterval(() => {
      this.setState({refreshingFriend: false});
      clearTimeout(loading);
    }, 1000);
  }

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 25;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  endRequestInEndDrag = () => {
    this.setState({endScrollRefresh: false});
  };

  // quando scendo tutti gli utenti, ne carico altri
  onScrollEndDrag = (event) => {
    // console.log("scroll");
    // // console.log(this.props.allFeedOrder.length);

    if (this.isCloseToBottom(event.nativeEvent)) {
      const activeSelectable = this.props.activeSelectable;

      let number = 0;
      if (activeSelectable == 'global') {
        number = this.props.standingsState.standing.length;
      } else if (activeSelectable == 'city') {
        number = this.props.standingsState.cityStanding.length;
      } else if (activeSelectable == 'friend') {
        number = this.props.standingsState.infoUserFriendsClassification
          .numFriend;
      } else {
        // community

        number = this.props.standingsState.infoUserCommunityClassification
          .numFriend;
      }
      this.setState({endScrollRefresh: true});
      if (this.props.activeSelectable == 'global') {
        this.props.dispatch(
          getWeeklyLeaderboardNew({
            limit: 100,
            offset: parseInt(number / 100) * 100,
            afterRequest: this.endRequestInEndDrag,
          }),
        );
      } else if (this.props.activeSelectable == 'city') {
        this.props.dispatch(getWeeklyLeaderboardByCity());
      } else {
        this.props.dispatch(getWeeklyFriendLeaderboard());
        this.props.dispatch(getFollowingUser());
      }
    }
  };

  displayWavyArea() {
    if (this.displayStandings)
      return (
        <WavyArea
          data={negativeData}
          color={'#3D3D3D'}
          style={styles.overlayWave}
        />
      );
  }

  renderPage(
    number,
    dataSource,
    position,
    totPoints,
    activeSelectable,
    colorStar,
  ) {
    this.displayStandings = true;

    return (
      <View>
        <ListView
          removeClippedSubviews={false}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              refreshing={this.props.standingsState.fetchingData}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          style={styles.challengesList}
          dataSource={dataSource}
          onScrollEndDrag={this.onScrollEndDrag}
          renderRow={(item, sectionID, rowID) => {
            const row = parseInt(rowID) + 1;
            if (row === 1) {
              return (
                <Aux key={rowID}>
                  {
                    // aggiungo delo spazio in piu sopra cosi sotto l'onda ho lo stesso colore del primo partecipante
                    <View
                      key={0}
                      style={{
                        height: 30,
                        backgroundColor: '#F7F8F9',
                      }}
                    />
                  }
                  <UserItem
                    navigation={this.props.navigation}
                    // myProfile={this.myProfile}
                    user={{
                      ...item,
                      position: row,
                      id: this.props.infoProfile.user_id,
                    }}
                    rowID={rowID}
                    level={item.referred_route__user__level__name}
                    modalType={
                      item.referred_route__user__role
                        ? item.referred_route__user__role === 'none' ||
                          item.referred_route__user__role === 'muver'
                          ? 0
                          : parseInt(item.referred_route__user__role)
                        : 0
                    }
                    activeSelectable={this.props.activeSelectable}
                    blockRanking={number > 3 ? this.props.blockRanking : false}
                    community={item.referred_route__user__community__name}
                    city={
                      activeSelectable != 'city'
                        ? item.referred_route__user__city__city_name
                        : ''
                    }
                    colorStar={colorStar}
                  />
                  {number === row ? this.endList(activeSelectable) : <View />}
                </Aux>
              );
            } else if (number === row) {
              return (
                <Aux key={rowID}>
                  <UserItem
                    // myProfile={this.myProfile}
                    navigation={this.props.navigation}
                    user={{
                      ...item,
                      position: row,
                      id: this.props.infoProfile.user_id,
                    }}
                    rowID={rowID}
                    level={item.referred_route__user__level__name}
                    modalType={
                      item.referred_route__user__role
                        ? item.referred_route__user__role === 'none' ||
                          item.referred_route__user__role === 'muver'
                          ? 0
                          : parseInt(item.referred_route__user__role)
                        : 0
                    }
                    activeSelectable={this.props.activeSelectable}
                    blockRanking={number > 3 ? this.props.blockRanking : false}
                    community={item.referred_route__user__community__name}
                    city={
                      activeSelectable != 'city'
                        ? item.referred_route__user__city__city_name
                        : ''
                    }
                    colorStar={colorStar}
                  />
                  {this.endScroll(this.state.endScrollRefresh)}
                  {/* {this.endList(activeSelectable, number)} */}
                </Aux>
              );
            } else {
              return (
                <UserItem
                  // myProfile={this.myProfile}
                  navigation={this.props.navigation}
                  user={{
                    ...item,
                    position: row,
                    id: this.props.infoProfile.user_id,
                  }}
                  rowID={rowID}
                  level={item.referred_route__user__level__name}
                  modalType={
                    item.referred_route__user__role
                      ? item.referred_route__user__role === 'none' ||
                        item.referred_route__user__role === 'muver'
                        ? 0
                        : parseInt(item.referred_route__user__role)
                      : 0
                  }
                  activeSelectable={this.props.activeSelectable}
                  blockRanking={number > 3 ? this.props.blockRanking : false}
                  community={item.referred_route__user__community__name}
                  city={
                    activeSelectable != 'city'
                      ? item.referred_route__user__city__city_name
                      : ''
                  }
                  colorStar={colorStar}
                />
              );
            }
          }}
        />
      </View>
    );
  }

  renderEmptyFriend() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshingFriend}
            onRefresh={this.onRefreshFriend.bind(this)}
          />
        }
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}>
        <View
          style={{
            width: Dimensions.get('window').width,
            height: 150,
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
          }}
        />
        <InviteNoFriendScreen
          infoProfile={this.props.infoProfile}
          navigation={this.props.navigation}
          Points={0}
        />
        <View
          style={{
            width: Dimensions.get('window').width,
            height: 150,
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
          }}
        />
      </ScrollView>
    );
  }

  renderEmptyCity() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.props.standingsState.fetchingData}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}>
        <View
          style={{
            width: Dimensions.get('window').width,
            height: 200,
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
          }}
        />
        <View
          style={{
            width: Dimensions.get('window').width * 0.6,
            height: Dimensions.get('window').width * 0.6,
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            alignSelf: 'center',
          }}>
          <Image
            source={require('./../../assets/images/city_tournament_empty.png')}
            style={{
              width: Dimensions.get('window').width * 0.6,
              height: Dimensions.get('window').width * 0.6,
            }}
          />
        </View>
        <View
          style={{
            width: Dimensions.get('window').width,
            height: 50,
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
          }}
        />
        <InviteFriendsWave
          navigation={this.props.navigation}
          typeInvite="City"></InviteFriendsWave>
        <View
          style={{
            width: Dimensions.get('window').width,
            height: 200,
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
          }}
        />
      </ScrollView>
    );
  }

  endScroll = (endScrollRefresh) => {
    return (
      <View>
        {endScrollRefresh ? (
          <ActivityIndicator
            style={{
              alignContent: 'center',
              flex: 1,
              paddingTop: 10,

              alignItems: 'center',
              alignSelf: 'center',
            }}
            size="large"
            color="#3D3D3D"
          />
        ) : (
          <View />
        )}
        <View
          style={{
            height: Dimensions.get('window').height / 10,
          }}
        />
        {
          // aggiungo delo spazio in meno dato che il padding lo aggiunto prima su android e quindi qua non lo aggiungo
        }
        <View style={{height: Dimensions.get('window').height * 0.23}} />
      </View>
    );
  };

  // metto aggiungi amici alla fine sono sono in friend
  // aggiungo delo spazio in piu cosi posso scrollare tutta la lista anche se c'e l'onda e la notifica
  // se la classifica è bloccata, c'e uno spazio in piu dato header piu grande
  endList = (activeSelectable, number) => {
    if (activeSelectable == 'friend') {
      return (
        <Aux>
          <InviteItem
            infoProfile={this.props.infoProfile}
            navigation={this.props.navigation}
            Points={0}
          />
          <View
            style={{
              paddingTop: this.props.blockRanking
                ? Dimensions.get('window').height * 0.23 + 80
                : Dimensions.get('window').height * 0.23 + 80,
            }}
          />
        </Aux>
      );
    } else if (activeSelectable == 'city') {
      return (
        <Aux>
          <InviteItem
            infoProfile={this.props.infoProfile}
            navigation={this.props.navigation}
            Points={0}
            description={
              number > 3
                ? strings('invite_your_fri')
                : 'Invite at least 3 friends to activate the Weekly Challenge'
            }
          />
          <View
            style={{
              paddingTop: this.props.blockRanking
                ? Dimensions.get('window').height * 0.23 + 80
                : Dimensions.get('window').height * 0.23 + 80,
            }}
          />
        </Aux>
      );
    } else
      return (
        <View
          style={{
            paddingTop: this.props.blockRanking
              ? Dimensions.get('window').height * 0.23 + 80
              : Dimensions.get('window').height * 0.23 + 80,
          }}
        />
      );
  };
  renderBody(
    number,
    dataSource,
    position,
    totPoints,
    activeSelectable,
    colorStar,
  ) {
    console.log(activeSelectable);
    console.log(number);
    // se non ho utenti e ancora devo caricare la lista
    if (this.props.standingsState.fetchingData && number === 0) {
      return (
        <View style={{top: 160}}>
          <ActivityIndicator size="large" color="#3D3D3D" />
          <View style={styles.challengesList} />
        </View>
      );
    } else if (activeSelectable === 'friend' && number === '-') {
      console.log('nessun amico');
      return <View>{this.renderEmptyFriend()}</View>;
    } else if (activeSelectable == 'city' && number == 0) {
      console.log('nessun utente in città');
      return <View>{this.renderEmptyCity()}</View>;
    } else {
      return this.renderPage(
        number,
        dataSource,
        position,
        totPoints,
        activeSelectable,
        colorStar,
      );
    }
  }

  selectType = (selectedTime) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'flex-end',
            width: Dimensions.get('window').width / 2 - 15,
          }}>
          <TouchableWithoutFeedback
            onPress={() => this.props.changeActiveSelectable('City')}>
            <View
              style={{
                flexDirection: 'column',
                alignContent: 'center',
                justifyContent: 'center',
                height: 40,
                // right: 10
              }}>
              <Text
                style={{
                  color: selectedTime ? '#FFFFFF' : '#9D9B9C',
                  fontFamily: 'Montserrat-ExtraBold',

                  fontSize: 10,
                  fontWeight: 'bold',
                  // marginBottom: 4,
                  marginVertical: 0,
                  textAlign: 'center',
                }}>
                {this.props.city}
              </Text>
              <View
                style={{
                  borderBottomColor: '#FAB21E',
                  borderBottomWidth: selectedTime ? 1 : 0,
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'center',
            height: 30,
            width: 30,
          }}
        />

        <View
          style={{
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'center',
            height: 25,
            width: 25,
            position: 'absolute',
          }}>
          {/* <Svg height={30} width={30} viewBox="0 0 100 100">
                  <Circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#FAB21E"
                    strokeWidth="2"
                    fill="#3D3D3D"
                  />
                  <Line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="25"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <Line
                    x1="50"
                    y1="50"
                    x2="75"
                    y2="75"
                    stroke="white"
                    strokeWidth="2"
                  />
                </Svg> */}
          <OwnIcon name="world_icn" size={25} color="#FFFFFF" />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'flex-start',
            width: Dimensions.get('window').width / 2 - 15,
          }}>
          <TouchableWithoutFeedback
            onPress={() => this.props.changeActiveSelectable('Global')}
            style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'column',
                alignContent: 'center',
                justifyContent: 'center',
                height: 40,
              }}>
              <Text
                style={{
                  color: selectedTime ? '#9D9B9C' : '#FFFFFF',
                  fontFamily: 'Montserrat-ExtraBold',

                  fontSize: 10,
                  fontWeight: 'bold',
                  // marginBottom: 4,
                  marginVertical: 0,
                  textAlign: 'center',
                }}>
                WORLD
              </Text>
              <View
                style={{
                  borderBottomColor: '#FAB21E',
                  borderBottomWidth: selectedTime ? 0 : 1,
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };

  selectTypeNew = (community, checkSponsor) => {
    // community
    // controllo se è una community o sponsor

    // deve essere una community e avere un nome

    if (community && !checkSponsor) {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'flex-end',
              width: Dimensions.get('window').width * 0.5 - 90,
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.props.changeActiveSelectable('City')}>
              <View
                style={{
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'center',
                  height: 40,
                  // right: 10
                }}>
                <Text
                  style={{
                    color:
                      this.props.activeSelectable == 'city'
                        ? '#FFFFFF'
                        : '#9D9B9C',
                    fontFamily: 'Montserrat-ExtraBold',

                    fontSize: 10,
                    fontWeight: 'bold',
                    // marginBottom: 4,
                    marginVertical: 0,
                    textAlign: 'center',
                  }}>
                  {this.props.city}
                </Text>
                <View
                  style={{
                    borderBottomColor: '#FAB21E',
                    borderBottomWidth:
                      this.props.activeSelectable == 'city' ? 1 : 0,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'center',
              width: 180,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: 30,

                // - 38
              }}>
              <OwnIcon name="rank_arrow_up_icn" size={20} color={'#9D9B9C'} />
              <OwnIcon
                name="rank_arrow_down_icn"
                size={20}
                color={'#FFFFFF'}
                style={{right: 12}}
              />
            </View>
            <TouchableWithoutFeedback
              onPress={() => this.props.changeActiveSelectable('Global')}
              style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'center',
                  height: 40,
                }}>
                <Text
                  style={{
                    color:
                      this.props.activeSelectable == 'global'
                        ? '#FFFFFF'
                        : '#9D9B9C',
                    fontFamily: 'Montserrat-ExtraBold',

                    fontSize: 10,
                    fontWeight: 'bold',
                    // marginBottom: 4,
                    marginVertical: 0,
                    textAlign: 'center',
                  }}>
                  WORLD
                </Text>
                <View
                  style={{
                    borderBottomColor: '#FAB21E',
                    borderBottomWidth:
                      this.props.activeSelectable == 'global' ? 1 : 0,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: 30,
                // - 38
              }}>
              <OwnIcon name="rank_arrow_up_icn" size={20} color={'#9D9B9C'} />
              <OwnIcon
                name="rank_arrow_down_icn"
                size={20}
                color={'#FFFFFF'}
                style={{right: 12}}
              />
            </View>

            <TouchableWithoutFeedback
              onPress={() => this.props.changeActiveSelectable('Friend')}
              style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'center',
                  height: 40,
                }}>
                <Text
                  style={{
                    color:
                      this.props.activeSelectable == 'friend'
                        ? '#FFFFFF'
                        : '#9D9B9C',
                    fontFamily: 'Montserrat-ExtraBold',

                    fontSize: 10,
                    fontWeight: 'bold',
                    // marginBottom: 4,
                    marginVertical: 0,
                    textAlign: 'center',
                  }}>
                  FRIENDS
                </Text>
                <View
                  style={{
                    borderBottomColor: '#FAB21E',
                    borderBottomWidth:
                      this.props.activeSelectable == 'friend' ? 1 : 0,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: 30,
                // - 38
              }}>
              <OwnIcon name="rank_arrow_up_icn" size={20} color={'#9D9B9C'} />
              <OwnIcon
                name="rank_arrow_down_icn"
                size={20}
                color={'#FFFFFF'}
                style={{right: 12}}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'flex-start',
              width: Dimensions.get('window').width * 0.5 - 90,
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.props.changeActiveSelectable('Community')}
              style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'center',
                  height: 40,
                }}>
                <Text
                  style={{
                    color:
                      this.props.activeSelectable == 'community'
                        ? '#FFFFFF'
                        : '#9D9B9C',
                    fontFamily: 'Montserrat-ExtraBold',

                    fontSize: 10,
                    fontWeight: 'bold',
                    // marginBottom: 4,
                    marginVertical: 0,
                    textAlign: 'center',
                  }}>
                  COMMUNITY
                </Text>
                <View
                  style={{
                    borderBottomColor: '#FFFFFF',
                    borderBottomWidth:
                      this.props.activeSelectable == 'community' ? 1 : 0,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'flex-end',
              width: Dimensions.get('window').width * 0.3,
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.props.changeActiveSelectable('City')}>
              <View
                style={{
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'center',
                  height: 40,
                  // right: 10
                }}>
                <Text
                  style={{
                    color:
                      this.props.activeSelectable == 'city'
                        ? '#FFFFFF'
                        : '#9D9B9C',
                    fontFamily: 'Montserrat-ExtraBold',

                    fontSize: 10,
                    fontWeight: 'bold',
                    // marginBottom: 4,
                    marginVertical: 0,
                    textAlign: 'center',
                  }}>
                  {this.props.city}
                </Text>
                <View
                  style={{
                    borderBottomColor: '#FAB21E',
                    borderBottomWidth:
                      this.props.activeSelectable == 'city' ? 1 : 0,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'center',
              width: 120,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: 30,

                // - 38
              }}>
              <OwnIcon name="rank_arrow_up_icn" size={20} color={'#9D9B9C'} />
              <OwnIcon
                name="rank_arrow_down_icn"
                size={20}
                color={'#FFFFFF'}
                style={{right: 12}}
              />
            </View>
            <TouchableWithoutFeedback
              onPress={() => this.props.changeActiveSelectable('Global')}
              style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'center',
                  height: 40,
                }}>
                <Text
                  style={{
                    color:
                      this.props.activeSelectable == 'global'
                        ? '#FFFFFF'
                        : '#9D9B9C',
                    fontFamily: 'Montserrat-ExtraBold',

                    fontSize: 10,
                    fontWeight: 'bold',
                    // marginBottom: 4,
                    marginVertical: 0,
                    textAlign: 'center',
                  }}>
                  WORLD
                </Text>
                <View
                  style={{
                    borderBottomColor: '#FAB21E',
                    borderBottomWidth:
                      this.props.activeSelectable == 'global' ? 1 : 0,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: 30,
                // - 38
              }}>
              <OwnIcon name="rank_arrow_up_icn" size={20} color={'#9D9B9C'} />
              <OwnIcon
                name="rank_arrow_down_icn"
                size={20}
                color={'#FFFFFF'}
                style={{right: 12}}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'flex-start',
              width: Dimensions.get('window').width * 0.3,
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.props.changeActiveSelectable('Friend')}
              style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'center',
                  height: 40,
                }}>
                <Text
                  style={{
                    color:
                      this.props.activeSelectable == 'friend'
                        ? '#FFFFFF'
                        : '#9D9B9C',
                    fontFamily: 'Montserrat-ExtraBold',

                    fontSize: 10,
                    fontWeight: 'bold',
                    // marginBottom: 4,
                    marginVertical: 0,
                    textAlign: 'center',
                  }}>
                  FRIENDS
                </Text>
                <View
                  style={{
                    borderBottomColor: '#FAB21E',
                    borderBottomWidth:
                      this.props.activeSelectable == 'friend' ? 1 : 0,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      );
    }
  };

  render() {
    let number = 0;
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    let dataSource = ds.cloneWithRows([]);
    let position = '-';
    let totPoints = 0;

    const community = this.props.community
      ? this.props.community.name
        ? true
        : false
      : false;

    const communityInfo = community
      ? getSponsor(this.props.community.name)
      : {community: 1};
    const checkSponsor = communityInfo.sponsor;
    // const threeFields = community
    //   ? { width: Dimensions.get("window").width / 3 }
    //   : {};

    const activeSelectable = this.props.activeSelectable;
    let colorWave = '#3D3D3D';
    let colorStar = '#fab21e';
    let colorStarFirst = '#fab21e';

    if (activeSelectable == 'global') {
      dataSource = ds.cloneWithRows(this.props.standingsState.standing);
      position = this.props.standingsState.infoUserGlobalClassification.index;
      totPoints = this.props.standingsState.infoUserGlobalClassification.points;
      number = this.props.standingsState.standing.length;
    } else if (activeSelectable == 'city') {
      dataSource = ds.cloneWithRows(this.props.standingsState.cityStanding);
      position = this.props.standingsState.infoUserCityClassification.index;
      totPoints = this.props.standingsState.infoUserCityClassification.points;
      number = this.props.standingsState.cityStanding.length;
    } else if (activeSelectable == 'friend') {
      const userFollowed = this.props.followed.length
        ? this.props.followed.map((friend) => friend.user_followed.user_id)
        : [];

      let friendStandings = [];

      if (userFollowed.length) {
        const {user_id} = this.props.infoProfile;
        friendStandings = this.props.standingsState.standing.filter(
          (user) =>
            userFollowed.indexOf(user.referred_route__user_id) !== -1 ||
            user.referred_route__user_id === user_id,
        );
        console.log(friendStandings);
      }
      if (this.props.standingsState.infoUserFriendsClassification) {
        dataSource = ds.cloneWithRows(friendStandings);
        position = this.props.standingsState.infoUserFriendsClassification
          .index;
        totPoints = this.props.standingsState.infoUserFriendsClassification
          .points;
        number = this.props.standingsState.infoUserFriendsClassification
          .numFriend;
      }
    } else {
      // community
      dataSource = ds.cloneWithRows(
        this.props.standingsState.communityStanding,
      );
      position = this.props.standingsState.infoUserCommunityClassification
        .index;
      totPoints = this.props.standingsState.infoUserCommunityClassification
        .points;
      number = this.props.standingsState.infoUserCommunityClassification
        .numFriend;
      colorWave = this.props.community
        ? this.props.community.community_color
          ? this.props.community.community_color
          : '#533DCE'
        : '#533DCE';
      colorStar = colorWave;
      colorStarFirst = '#ffffff';
    }

    return (
      <View
        // style={styles.mainContainer}
        refreshControl={
          <RefreshControl
            refreshing={this.props.standingsState.fetchingData}
            onRefresh={this.onRefresh.bind(this)}
          />
        }>
        {this.renderBody(
          number,
          dataSource,
          position,
          totPoints,
          activeSelectable,
          colorStar,
        )}
        <WavyArea
          data={negativeData}
          color={colorWave}
          style={styles.overlayWave}
        />
        <View style={[styles.userContainer, styles.firstUser]}>
          <View
            style={{
              flexDirection: 'column',
              alignContent: 'center',
            }}>
            {/* {this.selectTypeNew(community, checkSponsor)} */}
            <View>
              <UserItem
                // myProfile={this.myProfile}
                navigation={this.props.navigation}
                currentUser={true}
                user={{
                  username: this.props.infoProfile.username,

                  avatar: this.props.infoProfile.avatar,
                  id: this.props.infoProfile.id,

                  points: totPoints,
                  position:
                    position !== '-' && typeof position !== 'object'
                      ? position + 1
                      : '-',
                  referred_route__user__city_id: this.props.infoProfile.city
                    ? this.props.infoProfile.city.id
                      ? this.props.infoProfile.city.id
                      : 0
                    : 0,
                }}
                // lo faccio piu piccolo dato che sopra metto il selettore per il periodo
                style={{height: 85}}
                level={this.props.level}
                fontColor={'#fff'}
                modalType={this.props.role}
                blockRanking={number > 3 ? this.props.blockRanking : false}
                activeSelectable={this.props.activeSelectable}
                community={
                  this.props.infoProfile.community
                    ? this.props.infoProfile.community.name
                    : null
                }
                city={
                  activeSelectable != 'city'
                    ? this.props.infoProfile.city
                      ? this.props.infoProfile.city.city_name
                      : ''
                    : ''
                }
                colorStar={colorStarFirst}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const getProfile = (state) => state.login.infoProfile;
const getProfileNotSave = (state) => state.login.infoProfileNotSave;

const getProfileState = createSelector(
  [getProfile, getProfileNotSave],
  (infoProfile, infoProfileNotSave) => {
    return {
      ...infoProfile,
      ...infoProfileNotSave,
    };
  },
);

const getStandings = (state) => state.standings;

const getStandingsState = createSelector(
  [getStandings],
  (StandingsState) => StandingsState,
);

const getLevel = (state) => state.trainings.name;

const getLevelState = createSelector([getLevel], (level) =>
  level ? level : 'Newbie',
);

const getRole = (state) => state.login.role;

const getRoleState = createSelector([getRole], (role) =>
  role.roleUser ? (role.roleUser ? role.roleUser : 0) : 0,
);

/* 
state.statistics.reduce(
  (acc, item) => (acc > item.points ? acc : item.points),
  0 ) */
// modal_type
const withConnect = connect((state) => {
  return {
    // standingsState: getStandingsState(state),
    infoProfile: getProfileState(state),
    level: getLevelState(state),
    role: getRoleState(state),
    followed: getFollowedState(state),
  };
});

export default withConnect(StandingsScreen);

// export default StandingsScreen;
