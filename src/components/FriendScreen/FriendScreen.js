import React from "react";
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
  ListView
} from "react-native";


import { styles, negativeData } from "./Style";
import WavyArea from "./../../components/WavyArea/WavyArea";
import FriendItem from "./../../components/FriendItem/FriendItem";
import Aux from "./../../helpers/Aux";
import {
  getFollowingUser,
  getFollowersUser,
  postFollowUser,
  deleteFollowedUser,
  setFriendSelected
} from "./../../domains/follow/ActionCreators";
import {
  getFollowedState,
  getFollowState,
  getStatusState,
  getTabState
} from "./../../domains/follow/Selectors";
import { getProfile } from "./../../domains/login/Selectors";
import { connect } from "react-redux";

import OwnIcon from "../../components/OwnIcon/OwnIcon";
import LinearGradient from "react-native-linear-gradient";
import InviteNoFriendScreen from "./../../components/InviteNoFriendScreen/InviteNoFriendScreen";
import InviteFriendsWave from "./../../components/InviteFriendsWave/InviteFriendsWave";

import {
  createSelector,
  createSelectorCreator,
  defaultMemoize
} from "reselect";

import JsonQuery from "json-query";
import { data } from "./../../assets/ListCities";

import { strings } from "../../config/i18n";

import branch, { RegisterViewEvent, BranchEvent } from "react-native-branch";

const defaultBUO = {
  title: "MUV"
};

export function getLevelFirstCharFromInt(level) {
  switch (level) {
    case 1:
      return "N";
      break;

    case 2:
      return "R";
      break;
    case 3:
      return "P";
      break;
    case 4:
      return "S";
      break;

    default:
      return "N";
      break;
  }
}

class FriendScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoading: true,
      refreshing: false,

      results: [],
      url: "",
      loadingUrl: false
    };
    this.buo = null;

    this.displayStandings = false;
  }

  randomString() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  writeToClipboard = async () => {
    await Clipboard.setString(this.state.url);
  };

  addResult(type, slug, payload) {
    let result = { type, slug, payload };
    this.setState({
      results: [result, ...this.state.results].slice(0, 10)
    });
  }

  createBranchUniversalObject = async () => {
    try {
      let result = await branch.createBranchUniversalObject(
        this.randomString(),
        defaultBUO
      );
      if (this.buo) this.buo.release();
      this.buo = result;
      console.log("createBranchUniversalObject", result);
      this.addResult("success", "createBranchUniversalObject", result);
    } catch (err) {
      console.log("createBranchUniversalObject err", err.toString());
      this.addResult("error", "createBranchUniversalObject", err.toString());
    }
  };

  generateShortUrl = async () => {
    this.setState({ loadingUrl: true });
    if (!this.buo) await this.createBranchUniversalObject();
    try {
      let linkProperties = {
        sender_id: this.props.infoProfile.user_id,
        first_name: this.props.infoProfile.first_name,
        last_name: this.props.infoProfile.last_name,
        avatar: this.props.infoProfile.avatar,
        points: this.props.Points,
        role: this.props.infoProfile.role,
        coins: this.props.infoProfile.coins,
        level: JSON.stringify(this.props.infoProfile.level),
        roleIndex: JSON.stringify(this.props.roleAll),
        city: this.props.infoProfile.city
          ? this.props.infoProfile.city.city_name
            ? this.props.infoProfile.city.city_name
            : ""
          : ""
        // roleUser: this.props.loginState.role.roleUser,
        // indexRole: this.props.loginState.role.indexRole
      };
      let result = await this.buo.generateShortUrl({}, linkProperties);

      // console.log("generateShortUrl", result);
      // alert(result.url);
      console.log("linkProperties", linkProperties);

      console.log(result.url);

      this.setState({ url: result.url, loadingUrl: false });

      this.addResult("success", "generateShortUrl", result);

      this.props.navigation.navigate("InviteScreen", { url: result.url });

      if (!this.buo) return;
      this.buo.release();
    } catch (err) {
      console.log("generateShortUrl err", err);
      this.addResult("error", "generateShortUrl", err.toString());
      this.setState({ loadingUrl: false });
    }
  };

  componentWillMount() {
    // pushNotifications.configure();
    // pushNotifications.userIsStillNotification();

    this.props.dispatch(getFollowingUser());
    this.props.dispatch(getFollowersUser());
    // this.props.dispatch(postFollowUser({ followed_user_id: 47 }));
  }

  onRefresh() {
    this.setState({ refreshing: true });

    if (this.props.selected === "FOLLOWING") {
      this.props.dispatch(getFollowingUser());
    } else {
      this.props.dispatch(getFollowersUser());
    }

    const loading = setInterval(() => {
      {
        this.setState({ refreshing: false });
        clearTimeout(loading);
      }
    }, 1000);
  }
  componentWillReceiveProps(props) {
    // console.log("props");
    // console.log(this.props);
    // console.log(props);
    // console.log(this.state);
    // if (
    //   this.props.selected === "FOLLOWING" &&
    //   this.props.followed.length !== props.followed.length
    // ) {
    //   this._handleChangeSelectable("followed", props);
    //   this.setState({ showLoading: false });
    // } else if (
    //   this.props.selected === "FOLLOWERS" &&
    //   this.props.follow.length !== props.follow.length
    // ) {
    //   this._handleChangeSelectable("follow", props);
    //   this.setState({ showLoading: false });
    // } else (this.props.selected !== props.selected)
    // {
    //   if (this.props.selected === "FOLLOWERS") {
    //     this._handleChangeSelectable("followed", props);
    //     this.setState({ showLoading: false });
    //   } else {
    //     this._handleChangeSelectable("follow", props);
    //     this.setState({ showLoading: false });
    //   }
    // }
  }

  _handleChangeSelectable = (select, props) => {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    // alert(select);

    if (select == "followed")
      this.setState({
        dataSource: ds.cloneWithRows(props.followed),
        number: props.followed.length
      });
    else if (select == "follow")
      this.setState({
        dataSource: ds.cloneWithRows(props.follow),
        number: props.follow.length
      });
    else
      this.setState({
        dataSource: ds.cloneWithRows(props.followed),
        number: props.followed.length
      });
  };

  displayWavyArea() {
    if (this.displayStandings)
      return (
        <WavyArea
          data={negativeData}
          color={"#3D3D3D"}
          style={styles.overlayWave}
        />
      );
  }

  goToFriend = (data, can_follow) => {
    this.props.navigation.navigate("FriendDetail", {
      friendData: data,
      can_follow
    });
  };

  goToCity = (id, city) => {
    this.props.navigation.navigate("CityDetailScreenBlurFromFriends", {
      city: id,
      cityName: city
    });
  };

  deleteFriendFollowed = id => {
    this.props.dispatch(deleteFollowedUser({ id }));
  };

  deleteFriendFollow = id => {
    this.props.dispatch(deleteFollowedUser({ id }));
  };

  addFriendFollowed = id => {
    this.props.dispatch(
      postFollowUser({
        followed_user_id: id
      })
    );
  };

  addFriendFollow = id => {
    this.props.dispatch(
      postFollowUser({
        followed_user_id: id
      })
    );
  };

  /**
   * controlla se l'id passato
   * è un utente che segui
   */
  checkFollowingFromId = id => {
    return this.props.followed.filter(item => item.user_followed.user_id == id)
      .length > 0
      ? true
      : false;
  };

  renderPageFollowers() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    if (this.props.follow.length === 0) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width,
              height: 50,
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center",
              alignSelf: "center",
              alignItems: "center"
            }}
          />
          <InviteNoFriendScreen
            infoProfile={this.props.infoProfile}
            navigation={this.props.navigation}
          />
        </ScrollView>
      );
    }

    this.displayStandings = true;
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
          style={styles.challengesListFollowers}
          dataSource={ds.cloneWithRows(this.props.follow)}
          renderRow={(item, sectionID, rowID) => {
            const row = parseInt(rowID) + 1;

            // console.log(this.checkFollowingFromId(item.user_follower.user_id));

            if (
              row === 1 &&
              item.user_follower.user_id != this.props.infoProfile.user_id
            ) {
              return (
                <Aux key={rowID}>
                  <FriendItem
                    user={{ ...item, position: row }}
                    rowID={rowID}
                    index={""}
                    activeSelectable={this.props.activeSelectable}
                    blockRanking={true}
                    goToFriend={this.goToFriend}
                    goToCity={this.goToCity}
                    deleteFriend={this.deleteFriendFollow}
                    addFriend={this.addFriendFollow}
                    followed={this.props.followed}
                    level={getLevelFirstCharFromInt(item.user_follower.level)}
                    modalType={
                      item.user_follower.role
                        ? item.user_follower.role === "none" ||
                          item.user_follower.role === "muver"
                          ? 0
                          : parseInt(item.user_follower.role)
                        : 0
                    }
                    city={
                      item.user_follower.city ?
                    item.user_follower.city.city_name : ''
                    }
                    friendData={item.user_follower}
                    follower={true}
                    can_follow={this.checkFollowingFromId(
                      item.user_follower.user_id
                    )}
                  />
                  {
                    // aggiungo delo spazio in piu cosi posso scrollare tutta la lista anche se c'e l'onda e la notifica
                  }
                </Aux>
              );
            } else if (
              this.props.follow.length === row &&
              item.user_follower.user_id != this.props.infoProfile.user_id
            ) {
              return (
                <Aux key={rowID}>
                  <FriendItem
                    user={{ ...item, position: row }}
                    rowID={rowID}
                    activeSelectable={this.props.activeSelectable}
                    blockRanking={true}
                    index={""}
                    goToFriend={this.goToFriend}
                    goToCity={this.goToCity}
                    deleteFriend={this.deleteFriendFollow}
                    addFriend={this.addFriendFollow}
                    followed={this.props.followed}
                    level={getLevelFirstCharFromInt(item.user_follower.level)}
                    modalType={
                      item.user_follower.role
                        ? item.user_follower.role === "none" ||
                          item.user_follower.role === "muver"
                          ? 0
                          : parseInt(item.user_follower.role)
                        : 0
                    }
                    city={
                      item.user_follower.city ?
                    item.user_follower.city.city_name : ''
                    }
                    friendData={item.user_follower}
                    follower={true}
                    can_follow={this.checkFollowingFromId(
                      item.user_follower.user_id
                    )}
                  />
                  {
                    // aggiungo delo spazio in piu cosi posso scrollare tutta la lista anche se c'e l'onda e la notifica
                  }
                  <View
                    key={0}
                    style={{
                      paddingTop: Dimensions.get("window").height * 0.23
                    }}
                  />
                  <View
                    key={1}
                    style={{
                      paddingTop: Dimensions.get("window").height * 0.23
                    }}
                  />
                  <View
                    key={2}
                    style={{
                      paddingTop: Dimensions.get("window").height * 0.23
                    }}
                  />
                </Aux>
              );
            } else if (
              item.user_follower.user_id != this.props.infoProfile.user_id
            ) {
              return (
                <FriendItem
                  user={{ ...item, position: row }}
                  rowID={rowID}
                  activeSelectable={this.props.activeSelectable}
                  blockRanking={true}
                  index={""}
                  goToFriend={this.goToFriend}
                  goToCity={this.goToCity}
                  deleteFriend={this.deleteFriendFollow}
                  addFriend={this.addFriendFollow}
                  followed={this.props.followed}
                  level={getLevelFirstCharFromInt(item.user_follower.level)}
                  modalType={
                    item.user_follower.role
                      ? item.user_follower.role === "none" ||
                        item.user_follower.role === "muver"
                        ? 0
                        : parseInt(item.user_follower.role)
                      : 0
                  }
                  city={
                    item.user_follower.city ?
                    item.user_follower.city.city_name : ''
                  }
                  friendData={item.user_follower}
                  follower={true}
                  can_follow={this.checkFollowingFromId(
                    item.user_follower.user_id
                  )}
                />
              );
            } else return <View />;
          }}
        />
      </View>
    );
  }

  renderPage() {
    this.displayStandings = true;

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
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
          style={styles.challengesList}
          dataSource={ds.cloneWithRows(this.props.followed)}
          renderRow={(item, sectionID, rowID) => {
            const row = parseInt(rowID) + 1;
            if (
              row === 1 &&
              item.user_followed.user_id != this.props.infoProfile.user_id
            ) {
              return (
                <Aux key={rowID}>
                  <View
                    key={0}
                    style={{
                      height: 30,
                      backgroundColor: "#F7F8F9"
                    }}
                  />
                  <FriendItem
                    user={{ ...item, position: row }}
                    rowID={rowID}
                    level={getLevelFirstCharFromInt(item.user_followed.level)}
                    index={""}
                    modalType={
                      item.user_followed.role
                        ? item.user_followed.role === "none" ||
                          item.user_followed.role === "muver"
                          ? 0
                          : parseInt(item.user_followed.role)
                        : 0
                    }
                    activeSelectable={this.props.activeSelectable}
                    blockRanking={true}
                    city={
                      item.user_followed.city ?
                    item.user_followed.city.city_name : ''
                    }
                    goToFriend={this.goToFriend}
                    goToCity={this.goToCity}
                    deleteFriend={this.deleteFriendFollowed}
                    friendData={item.user_followed}
                    // follower={true}
                    can_follow={this.checkFollowingFromId(
                      item.user_followed.user_id
                    )}
                  />
                  {
                    // aggiungo delo spazio in piu cosi posso scrollare tutta la lista anche se c'e l'onda e la notifica
                  }
                </Aux>
              );
            } else if (
              this.props.followed.length === row &&
              item.user_followed.user_id != this.props.infoProfile.user_id
            ) {
              return (
                <Aux key={rowID}>
                  <FriendItem
                    user={{ ...item, position: row }}
                    rowID={rowID}
                    modalType={
                      item.user_followed.role
                        ? item.user_followed.role === "none" ||
                          item.user_followed.role === "muver"
                          ? 0
                          : parseInt(item.user_followed.role)
                        : 0
                    }
                    activeSelectable={this.props.activeSelectable}
                    blockRanking={true}
                    index={""}
                    goToFriend={this.goToFriend}
                    goToCity={this.goToCity}
                    deleteFriend={this.deleteFriendFollowed}
                    level={getLevelFirstCharFromInt(item.user_followed.level)}
                    city={
                      item.user_followed.city ?
                    item.user_followed.city.city_name : ''
                    }
                    friendData={item.user_followed}
                    can_follow={this.checkFollowingFromId(
                      item.user_followed.user_id
                    )}
                  />
                  {
                    // aggiungo delo spazio in piu cosi posso scrollare tutta la lista anche se c'e l'onda e la notifica
                    <View
                      key={0}
                      style={{
                        paddingTop: Dimensions.get("window").height * 0.23
                      }}
                    />
                  }
                </Aux>
              );
            } else if (
              item.user_followed.user_id != this.props.infoProfile.user_id
            ) {
              return (
                <FriendItem
                  user={{ ...item, position: row }}
                  rowID={rowID}
                  modalType={
                    item.user_followed.role
                      ? item.user_followed.role === "none" ||
                        item.user_followed.role === "muver"
                        ? 0
                        : parseInt(item.user_followed.role)
                      : 0
                  }
                  activeSelectable={this.props.activeSelectable}
                  blockRanking={true}
                  index={""}
                  goToFriend={this.goToFriend}
                  goToCity={this.goToCity}
                  deleteFriend={this.deleteFriendFollowed}
                  level={getLevelFirstCharFromInt(item.user_followed.level)}
                  city={  item.user_followed.city ?
                    item.user_followed.city.city_name : ''
                  }
                  friendData={item.user_followed}
                  can_follow={this.checkFollowingFromId(
                    item.user_followed.user_id
                  )}
                />
              );
            } else return <View />;
          }}
        />
      </View>
    );
  }

  onSelect = value => {
    this.props.dispatch(setFriendSelected(value));
  };

  renderBody() {
    const number = this.props.followed.length;
    if (this.props.status && number === 0) {
      return (
        <View style={{ top: 150 }}>
          <ActivityIndicator size="large" color="#3D3D3D" />
          <View style={styles.challengesList} />
        </View>
      );
    } else {
      return this.renderPage();
    }
  }

  renderBodyFollowers() {
    const number = this.props.follow.length;
    if (this.props.status && number === 0) {
      return (
        <View style={{ top: 150 }}>
          <ActivityIndicator size="large" color="#3D3D3D" />
          <View style={styles.challengesList} />
        </View>
      );
    } else {
      return this.renderPageFollowers();
    }
  }

  header() {
    const selectedTime = this.props.selected == "FOLLOWING";
    return (
      <View
        style={{
          flexDirection: "column",
          alignContent: "center",
          height: 50,
          justifyContent: "center"
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "center"
          }}
        >
          <TouchableWithoutFeedback onPress={() => this.onSelect("FOLLOWING")}>
            <View
              style={{
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  color: selectedTime ? "#3D3D3D" : "#9D9B9C",
                  fontFamily: "OpenSans-Regular",

                  fontSize: 10,
                  fontWeight: "bold",
                  // marginBottom: 4,
                  marginVertical: 0,
                  textAlign: "center"
                }}
              >
                FOLLOWING ({this.props.followed.length})
              </Text>
              <View
                style={{
                  borderBottomColor: "#9D9B9C",
                  borderBottomWidth: selectedTime ? 1 : 0
                }}
              />
            </View>
          </TouchableWithoutFeedback>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "center",
              height: 30,
              width: 50,
              alignSelf: "center",
              alignItems: "center",
              top: -2
            }}
          >
            <OwnIcon
              name="follower_icn_bottom"
              size={28}
              style={{ position: "relative", left: 14 }}
              color="#3D3D3D"
            />
            <OwnIcon
              name="follower_icn_top"
              size={28}
              style={{ position: "relative", left: -14 }}
              color="#FAB21E"
            />
          </View>
          <TouchableWithoutFeedback
            onPress={() => this.onSelect("FOLLOWERS")}
            style={{ flex: 1 }}
          >
            <View
              style={{
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  color: selectedTime ? "#9D9B9C" : "#3D3D3D",
                  fontFamily: "OpenSans-Regular",

                  fontSize: 10,
                  fontWeight: "bold",
                  // marginBottom: 4,
                  marginVertical: 0,
                  textAlign: "center"
                }}
              >
                FOLLOWERS ({this.props.follow.length})
              </Text>
              <View
                style={{
                  borderBottomColor: "#9D9B9C",
                  borderBottomWidth: selectedTime ? 0 : 1
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  invite = () => {
    //console.log(this.props);
    this.generateShortUrl();
  };

  renderWaveFollowing = () => {
    return (
      <Aux>
        <ImageBackground
          source={require("../../assets/images/invite_friend_banner.png")}
          style={styles.backgroundImage}
        />
        <View style={styles.backgroundImage}>
          <View style={[styles.userContainer, styles.firstUser]}>
            <View style={{ flexDirection: "column", alignContent: "center" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignContent: "center",
                  alignSelf: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.25,
                    alignContent: "center",
                    alignSelf: "center",
                    alignItems: "center"
                  }}
                >
                  <Image
                    style={{
                      width: 65,
                      height: 65
                    }}
                    source={require("../../assets/images/friends_banner_icn.png")}
                  />
                </View>
                <View style={{ width: Dimensions.get("window").width * 0.5 }}>
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontWeight: "400",
                      color: "#3D3D3D",
                      fontSize: 12,
                      textAlign: "left"
                    }}
                  >
                    {strings("playing_with_fr")} {strings("gaining_2_coins")}
                  </Text>
                </View>
                <View style={{ width: 10 }} />
                <View style={{ width: Dimensions.get("window").width * 0.2 }}>
                  <Image
                    style={{
                      width: 45,
                      height: 45,
                      position: "absolute",
                      top: -65,
                      left: 20
                    }}
                    source={require("../../assets/images/coins_icn_friends_banner.png")}
                  />
                  <LinearGradient
                    start={{ x: 0.0, y: 0.0 }}
                    end={{ x: 1.0, y: 0.0 }}
                    locations={[0, 1.0]}
                    colors={["#7D4D99", "#6497CC"]}
                    style={styles.button}
                  >
                    <TouchableHighlight
                      onPress={this.invite}
                      style={{
                        width: Dimensions.get("window").width * 0.17,
                        height: 30,
                        borderRadius: 5,
                        alignItems: "center"
                      }}

                      // disabled={this.props.status === "Inviting" ? true : false}
                    >
                      <View
                        style={{
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {!this.state.loadingUrl ? (
                          <Text
                            style={{
                              // margin: 10,
                              color: "#FFFFFF",
                              fontFamily: "OpenSans-Regular",

                              fontSize: 14
                            }}
                          >
                            {strings("invite")}
                          </Text>
                        ) : (
                          <ActivityIndicator size="small" color="white" />
                        )}
                      </View>
                    </TouchableHighlight>
                  </LinearGradient>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.backgroundView}>
          <View style={[styles.userContainer, styles.firstUser]}>
            <View style={{ flexDirection: "column", alignContent: "center" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignContent: "center",
                  alignSelf: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.25,
                    alignContent: "center",
                    alignSelf: "center",
                    alignItems: "center"
                  }}
                />
                <View
                  style={{ width: Dimensions.get("window").width * 0.55 }}
                />
                <View style={{ width: Dimensions.get("window").width * 0.2 }}>
                  <TouchableHighlight
                    onPress={this.handleResetPassword}

                    // disabled={this.props.status === "Inviting" ? true : false}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {this.props.status !== "Inviting" ? (
                        <Text
                          style={{
                            // margin: 10,
                            color: "#FFFFFF",
                            fontFamily: "OpenSans-Regular",

                            fontSize: 14
                          }}
                        >
                          {strings("invite")}
                        </Text>
                      ) : (
                        <ActivityIndicator size="small" color="white" />
                      )}
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Aux>
    );
  };

  renderBodyFollowing = () => {
    return (
      <Aux>
        {this.renderBody()}
        <InviteFriendsWave
          navigation={this.props.navigation}
          typeInvite="Friend"
        ></InviteFriendsWave>
      </Aux>
    );
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
          backgroundColor: "white",
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "#FFFFFF"
        }}
      >
        {this.header()}
        {this.props.selected === "FOLLOWING" ? (
          <Aux>{this.renderBodyFollowing()}</Aux>
        ) : (
          <View>{this.renderBodyFollowers()}</View>
        )}
      </View>
    );
  }
}

const withConnect = connect(state => {
  return {
    infoProfile: getProfile(state),

    level: state.trainings.name ? state.trainings.name : "Newbie",
    role: state.login.role ? state.login.role.roleUser : 0,
    followed: getFollowedState(state),
    follow: getFollowState(state),
    status: getStatusState(state),
    selected: getTabState(state)
  };
});

export default withConnect(FriendScreen);

// export default StandingsScreen;
