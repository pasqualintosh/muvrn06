import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Image,
  ImageBackground,
  NativeModules,
  Share,
  ScrollView,
  ActivityIndicator,
  TouchableHighlight,
  FlatList,
  RefreshControl
} from "react-native";

import { connect } from "react-redux";

import OwnIcon from "../../components/OwnIcon/OwnIcon";
import Aux from "../../helpers/Aux";

import Svg, {
  Circle,
  Line,
  Defs,
  Pattern,
  Path,
  Rect,
  Ellipse
} from "react-native-svg";

import LinearGradient from "react-native-linear-gradient";
import { createSelector } from "reselect";

import {
  citiesImage,
  imagesCity
} from "./../../components/FriendItem/FriendItem";
import { citiesDescription } from "./../CityScreenCards/CityScreenCards";
import { images } from "./../../components/InfoUserHome/InfoUserHome";
import GameUserItem from "./../../components/GameUserItem/GameUserItem";
import GameReverseUserItem from "./../../components/GameReverseUserItem/GameReverseUserItem";
import { medalSmallGlobalView } from "./../TrophiesRanking/TrophiesRanking";
import pointsDecimal from "../../helpers/pointsDecimal";
import {
  getWeeklySingleMatch
} from "./../../domains/screen/ActionCreators"
import ArrowGame from "./../../components/ArrowGame/ArrowGame";
import ArrowGif from "./../../components/ArrowGif/ArrowGif";

class GameWeekCityTournamentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      match: {},
      day: 0,
      hour: 0,
      minutes: 0,
      loadMatch: false,
      refreshing: false,
      height: 80,
      endTimer: false,
      user_sponsor_array: [] // [{id:int,sponsor:int}]
    };
  }

  _onRefresh = () => {
    this.setState({
      refreshing: true
    })
    this.props.dispatch(getWeeklySingleMatch({ match_id: this.state.match.season_match.season_match_id, start_match: this.state.match.season_match.start_match, saveData: this.saveMatch,
      currentMatch: false }));
  }

  changePage = index => {
    this.game.scrollToIndex({ index: index - 1 });
    this.setState({
      index: index - 1
    });
  };

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }
  timerTournament = (end_match) => {
    // (year, month, day, hours, minutes, seconds, milliseconds)

    let startTournament = new Date(end_match);
    console.log(startTournament);

    let today = new Date();

    let e_msec = startTournament - today;
    console.log(e_msec);
    let e_mins = Math.floor(e_msec / 60000);
    let e_hrs = Math.floor(e_mins / 60);
    let e_days = Math.floor(e_hrs / 24);
    let e_a_hrs = e_hrs - e_days * 24;
    let e_a_mins = Math.floor(e_msec / 60000) - e_hrs * 60;
    console.log(e_a_mins);

    if (e_days < 0) {
      this.setState({
        endTimer: true
      });
      if (this.timer) clearTimeout(this.timer);
    } else if (e_days > 0 || e_hrs > 0 || e_a_mins > 0) {
      this.setState({
        day: e_days,
        hour: e_a_hrs,
        minutes: e_a_mins
      });
    }
  };

  saveMatch = (data) => {

    if (this.props.standingsState.length > 0) {
      let user_id_array = new Array();
    if (data.weekly_user_standing_home) {
    if (data.weekly_user_standing_home.first_pos) {
    user_id_array.push(
      data.weekly_user_standing_home.first_pos.user_id.user_id
    );
    }
    if (data.weekly_user_standing_home.second_pos) {
    user_id_array.push(
      data.weekly_user_standing_home.second_pos.user_id.user_id
    );
    }
    if (data.weekly_user_standing_home.third_pos) {
    user_id_array.push(
      data.weekly_user_standing_home.third_pos.user_id.user_id
    );
    }
  }
    if (data.weekly_user_standing_away) {
    if (data.weekly_user_standing_away.first_pos) {
    user_id_array.push(
      data.weekly_user_standing_away.first_pos.user_id.user_id
    );
    }
    if (data.weekly_user_standing_away.second_pos) {
    user_id_array.push(
      data.weekly_user_standing_away.second_pos.user_id.user_id
    );
    }
    if (data.weekly_user_standing_away.third_pos) {
    user_id_array.push(
      data.weekly_user_standing_away.third_pos.user_id.user_id
    );
    }
    }
      let user_sponsor_array = this.props.standingsState.filter(e => {
        if (user_id_array.includes(e.referred_route__user_id)) return e;
      });
      // console.log(user_id_array);
      // console.log(user_sponsor_array);
      this.setState({ user_sponsor_array });
    }

    this.setState({
      match: data,
      loadMatch: true,
      refreshing: false
    })
  }

  getUserSponsorFromUserId = id => {
    console.log(id);
    console.log(this.state.user_sponsor_array);
    if (
      this.state.user_sponsor_array.filter(e => {
        if (e.referred_route__user_id == id) return e;
      }).length > 0
    ) {
      console.log("object_");
      console.log(
        this.state.user_sponsor_array.filter(e => {
          if (e.referred_route__user_id == id) return e;
        })[0].referred_route__user__community__name
      );
      return this.state.user_sponsor_array.filter(e => {
        if (e.referred_route__user_id == id) return e;
      })[0].referred_route__user__community__name;
    } else return null;
  };

  componentWillMount() {
    const height = Dimensions.get("window").height * 0.14 > 150 ? 150 : Dimensions.get("window").height * 0.14 < 80 ? 80 : Dimensions.get("window").height * 0.14
    
    const match = this.props.navigation.getParam("match", {});
    console.log(match)
    const infoProfile = this.props.navigation.getParam("infoProfile", {
      first_name: "Roberto",
      last_name: "Filippi",
      avatar: 1
    });

    if (match.season_match) {
      end_match = match.season_match.end_match;

      this.timerTournament(end_match);
      this.timer = setInterval(() => this.timerTournament(end_match), 60000);


      match_id = match.season_match.season_match_id


      if (match_id) {
        this.props.dispatch(getWeeklySingleMatch({ match_id, start_match: match.season_match.start_match, saveData: this.saveMatch,
          currentMatch: false }));
      }

    }

    this.setState({
      match,
      infoProfile,
      height
    });
  }

  moveHomeStandings = () => {
    if (this.state.match.season_match.city_home.id === this.state.infoProfile.city.id) {
      this.props.navigation.navigate("TeamTournamentBlur", {infoProfile: this.state.infoProfile});
    } else {
      this.props.navigation.navigate("TeamTournamentBlur", { city_id: this.state.match.season_match.city_home.id});
    }
    
  };

  moveAwayStandings = () => {
    if (this.state.match.season_match.city_away.id === this.state.infoProfile.city.id) {
      this.props.navigation.navigate("TeamTournamentBlur", {infoProfile: this.state.infoProfile});
    } else {
      this.props.navigation.navigate("TeamTournamentBlur", { city_id: this.state.match.season_match.city_away.id});
    }
  };

  headerGame = () => {
    const array = [
      { game: 1, status: 2 },
      { game: 2, status: 2 },
      { game: 3, status: 1 },
      { game: 4, status: 0 },
      { game: 5, status: 0 },
      { game: 7, status: 0 },
      { game: 8, status: 0 }
    ];

    return array.map(elem => (
      <TouchableOpacity
        key={elem.game}
        disabled={!elem.status}
        style={{
          height: 30,
          width: Dimensions.get("window").width / 7,

          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center"
        }}
        onPress={() => this.changePage(elem.game)}
      >
        <View
          style={{
            height: 30,
            width: Dimensions.get("window").width / 7,

            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center"
          }}
        >
          <View
            style={{
              height: 3,
              width: Dimensions.get("window").width / 8,
              flexDirection: "column"
            }}
          />
          <View
            style={{
              height: 22,
              width: Dimensions.get("window").width / 8,
              flexDirection: "row",
              justifyContent: "flex-start",
              left: -5,
              opacity: elem.status ? 1 : 0.2
            }}
          >
            <Svg height={22} width={22} viewBox="0 0 100 100">
              <Circle
                cx="50"
                cy="50"
                r="12"
                //stroke="white"
                fill={elem.status === 2 ? "#3363AD" : "#F7F8F9"}
              />
            </Svg>

            <View
              style={{
                height: 22,
                width: Dimensions.get("window").width / 8 - 22,
                flexDirection: "row",
                justifyContent: "center",
                left: -5
              }}
            >
              <Text style={styles.gameNumber}>{elem.game}</Text>
            </View>
          </View>
          <View
            style={{
              height: 5,
              backgroundColor:
                this.state.index === elem.game - 1 ? "#E83475" : "#9D9B9C",
              width: Dimensions.get("window").width / 8,
              flexDirection: "column",
              opacity: elem.status ? 1 : 0.2
            }}
          />
        </View>
      </TouchableOpacity>
    ));
  };



  handleScrollHeader(event) {
    // console.log(event.nativeEvent)
    const x = event.nativeEvent.contentOffset.x;
    // console.log(x);
    const deviceWidth = Dimensions.get("window").width;
    // console.log(deviceWidth)
    // const offset = x % deviceWidth;
    // console.log(offset);
    // let newIndex = parseInt(x / deviceWidth) * deviceWidth;
    // let newX = newIndex / 3;
    // console.log(newX);
    // if (offset >= deviceWidth / 2) {
    //   newX += deviceWidth / 3;
    // }
    // console.log(newX);
    // console.log(this.header.getScrollResponder());

    let index = parseInt((x + deviceWidth / 1.8) / deviceWidth);

    // this.header.scrollToIndex({ index: index });
    this.game.scrollToIndex({ index: index });
    this.setState({
      index
    });
  }

  NoUser = (color) => (
    <View
      style={{
        width: Dimensions.get("window").width * 0.5,
        height: this.state.height,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: color,
        borderRightWidth: 0.5,
        borderRightColor: "#ECEBEC"
      }}
    />
  );

  goToCity = (id, city, cityId) => {
    this.props.navigation.navigate("CityDetailScreenBlurFromGlobal", {
      city: id,
      cityName: city,
      cityId: cityId
    });
  };

  singlePage = (idHome, idAway) => {
    return (
      <Aux>
        <ImageBackground
          source={this.state.endTimer ? require("./../../assets/images/wave/live_match_gray.png") : require("./../../assets/images/wave/live_match_gradient.png")}
          style={styles.backgroundImage}
        />
        <View
          style={{
            width: Dimensions.get("window").width,
            height: 10
            // backgroundColor: "blue"
          }}
        />
        <View
          style={{
            width: Dimensions.get("window").width,
            height: 170,
            // backgroundColor: "red",
            justifyContent: "center",
            flexDirection: "row"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width / 3,
              height: 170,
              alignItems: "center",
              justifyContent: "space-around",
              flexDirection: "column"
              
            }}
          >
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Text style={[styles.nameWhiteText, this.state.endTimer ? {color: "#3D3D3D"}: {}]}>
                {this.state.match.season_match.city_home.city_name.toUpperCase()}
              </Text>
              <Text style={[styles.levelWhiteText, this.state.endTimer ? {color: "#3D3D3D"}: {}]}>
                {citiesDescription(
                  this.state.match.season_match.city_home.city_name
                )}
              </Text>
            </View>
            <TouchableOpacity
            //   idHome = citiesImage(this.props.match.season_match.city_home.city_name);
  // }
  // if (this.props.match.season_match.city_away.city_name) {
  //   idAway = citiesImage(this.props.match.season_match.city_away.city_name);
                onPress={() => this.goToCity(idHome, this.state.match.season_match.city_home.city_name, this.state.match.season_match.city_home.id)}
                // disabled={true}
              >
            <View
              style={{
                width: 80,
                height: 80,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Image
                source={require("../../assets/images/cities/team_live_bg_sx.png")}
                style={{
                  width: 80,
                  height: 80,
                  position: "absolute"
                }}
              />
              <Image
                source={imagesCity[idHome]}
                style={{
                  width: 50,
                  height: 50
                }}
              />
            </View>
            </TouchableOpacity>
            <Text style={[styles.PointsText, this.state.endTimer ? {color: "#3D3D3D"}: {}]}>
              {pointsDecimal(this.state.match.total_point_home)}
            </Text>
          </View>
          {this.state.endTimer ? <View
            style={{
              width: Dimensions.get("window").width / 3,
              height: 170,
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: "column"
            }}
          >
              <Image
                source={require("../../assets/images/cities/sct_logo.png")}
                style={{
                  width: 50,
                  height: 50
                }}
              />
             <View   
                style={{
                  width: 10,
                  height: 10
                }}
              />

            <ArrowGame
              width={50}
              right={this.state.match.total_point_home < this.state.match.total_point_away}
              color={'#3D3D3D'}
              height={80}
             
            />

          </View> : 
          <View
            style={{
              width: Dimensions.get("window").width / 3,
              height: 170,
              alignItems: "center",
              justifyContent: "space-around",
              flexDirection: "column"
            }}
          >
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <OwnIcon name="timer_icn" size={35} color={"#FFFFFF"} />
              <Text style={styles.timerText}>{this.state.day}d {this.state.hour}h {this.state.minutes}min </Text>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <ArrowGif total_point_home={this.state.match.total_point_home} total_point_away={this.state.match.total_point_away}></ArrowGif>
                  

                  
              </View>
          </View>}
          <View
            style={{
              width: Dimensions.get("window").width / 3,
              height: 170,
              alignItems: "center",
              justifyContent: "space-around",
              flexDirection: "column"
            }}
          >
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Text style={[styles.nameWhiteText, this.state.endTimer ? {color: "#3D3D3D"}: {}]}>
                {this.state.match.season_match.city_away.city_name.toUpperCase()}
              </Text>
              <Text style={[styles.levelWhiteText, this.state.endTimer ? {color: "#3D3D3D"}: {}]}>
                {citiesDescription(
                  this.state.match.season_match.city_away.city_name
                )}
              </Text>
            </View>
            <TouchableOpacity
            //   idHome = citiesImage(this.props.match.season_match.city_home.city_name);
  // }
  // if (this.props.match.season_match.city_away.city_name) {
  //   idAway = citiesImage(this.props.match.season_match.city_away.city_name);
                onPress={() => this.goToCity(idAway, this.state.match.season_match.city_away.city_name, this.state.match.season_match.city_away.id)}
                // disabled={true}
              >
            <View
              style={{
                width: 80,
                height: 80,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Image
                source={require("../../assets/images/cities/team_live_bg_dx.png")}
                style={{
                  width: 80,
                  height: 80,
                  position: "absolute"
                }}
              />
              <Image
                source={imagesCity[idAway]}
                style={{
                  width: 46,
                  height: 46
                }}
              />
            </View>
            </TouchableOpacity>
            <Text style={[styles.PointsText, this.state.endTimer ? {color: "#3D3D3D"}: {}]}>
              {pointsDecimal(this.state.match.total_point_away)}
            </Text>
          </View>
        </View>
        {this.state.loadMatch ? 
        <Aux>
          <View
          style={{
            width: Dimensions.get("window").width,
            height: 40
            // backgroundColor: "blue"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.5,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",

              borderRightWidth: 0.5,
              borderRightColor: "#ECEBEC"
            }}
          />
        </View>
          <View
            style={{
              width: Dimensions.get("window").width,
              flexDirection: "row",
              justifyContent: "flex-start"
            }}
          >
            {this.state.match.weekly_user_standing_home ? (
              this.state.match.weekly_user_standing_home.first_pos ? (
                <GameUserItem
                  color={"#FFFFFF"}
                  avatar={1}
                  user={this.state.match.weekly_user_standing_home.first_pos}
                  points={this.state.match.weekly_user_standing_home.first_points}
                  height={this.state.height}
                  navigation={this.props.navigation}
                  idUser={this.state.infoProfile.user_id}
                  sponsorName={this.getUserSponsorFromUserId(
                      this.state.match.weekly_user_standing_home.first_pos
                        .user_id.user_id
                    )}
                />
              ) : (
                  this.NoUser("#FFFFFF")
                )
            ) : (
                this.NoUser("#FFFFFF")
              )}
            {this.state.match.weekly_user_standing_away ? (
              this.state.match.weekly_user_standing_away.first_pos ? (
                <GameReverseUserItem
                  color={"#FFFFFF"}
                  avatar={2}
                  user={this.state.match.weekly_user_standing_away.first_pos}
                  points={this.state.match.weekly_user_standing_away.first_points}
                  height={this.state.height}
                  navigation={this.props.navigation}
                  idUser={this.state.infoProfile.user_id}
                  sponsorName={this.getUserSponsorFromUserId(
                      this.state.match.weekly_user_standing_away.first_pos
                        .user_id.user_id
                    )}
                />
              ) : (
                  this.NoUser("#FFFFFF")
                )
            ) : (
                this.NoUser("#FFFFFF")
              )}
            <View
              style={{
                width: 25,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              height:  this.state.height,
              position: "absolute",
              right: Dimensions.get("window").width / 2 - 12
              }}
            >
              <Image
                style={styles.userMedalImage}
                source={medalSmallGlobalView[1]}
              />
            </View>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width,
              flexDirection: "row",
              justifyContent: "flex-start"
            }}
          >

            {this.state.match.weekly_user_standing_home ? (
              this.state.match.weekly_user_standing_home.second_pos ? (
                <GameUserItem
                  color={"#F7F8F9"}
                  avatar={1}
                  user={this.state.match.weekly_user_standing_home.second_pos}
                  points={
                    this.state.match.weekly_user_standing_home.second_points
                  }
                  height={this.state.height}
                  navigation={this.props.navigation}
                  idUser={this.state.infoProfile.user_id}
                  sponsorName={this.getUserSponsorFromUserId(
                      this.state.match.weekly_user_standing_home.second_pos
                        .user_id.user_id
                    )}
                />
              ) : (
                  this.NoUser("#F7F8F9")
                )
            ) : (
                this.NoUser("#F7F8F9")
              )}
            {this.state.match.weekly_user_standing_away ? (
              this.state.match.weekly_user_standing_away.second_pos ? (
                <GameReverseUserItem
                  color={"#F7F8F9"}
                  avatar={2}
                  user={this.state.match.weekly_user_standing_away.second_pos}
                  points={
                    this.state.match.weekly_user_standing_away.second_points
                  }
                  height={this.state.height}
                  navigation={this.props.navigation}
                  idUser={this.state.infoProfile.user_id}
                  sponsorName={this.getUserSponsorFromUserId(
                      this.state.match.weekly_user_standing_away.second_pos
                        .user_id.user_id
                    )}
                />
              ) : (
                  this.NoUser("#F7F8F9")
                )
            ) : (
                this.NoUser("#F7F8F9")
              )}
            <View
              style={{
                width: 25,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              height:  this.state.height,
              position: "absolute",
              right: Dimensions.get("window").width / 2 - 12
              }}
            >
              <Image
                style={styles.userMedalImage}
                source={medalSmallGlobalView[2]}
              />
            </View>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width,
              flexDirection: "row",
              justifyContent: "flex-start"
            }}
          >
            {this.state.match.weekly_user_standing_home ? (
              this.state.match.weekly_user_standing_home.third_pos ? (
                <GameUserItem
                  color={"#FFFFFF"}
                  avatar={1}
                  user={this.state.match.weekly_user_standing_home.third_pos}
                  points={this.state.match.weekly_user_standing_home.third_points}
                  height={this.state.height}
                  navigation={this.props.navigation}
                  idUser={this.state.infoProfile.user_id}
                  sponsorName={this.getUserSponsorFromUserId(
                      this.state.match.weekly_user_standing_home.third_pos
                        .user_id.user_id
                    )}
                />
              ) : (
                  this.NoUser("#FFFFFF")
                )
            ) : (
                this.NoUser("#FFFFFF")
              )}
            {this.state.match.weekly_user_standing_away ? (
              this.state.match.weekly_user_standing_away.third_pos ? (
                <GameReverseUserItem
                  color={"#FFFFFF"}
                  avatar={2}
                  user={this.state.match.weekly_user_standing_away.third_pos}
                  points={this.state.match.weekly_user_standing_away.third_points}
                  height={this.state.height}
                  navigation={this.props.navigation}
                  idUser={this.state.infoProfile.user_id}
                  sponsorName={this.getUserSponsorFromUserId(
                      this.state.match.weekly_user_standing_away.third_pos
                        .user_id.user_id
                    )}
                />
              ) : (
                  this.NoUser("#FFFFFF")
                )
            ) : (
                this.NoUser("#FFFFFF")
              )}
            <View
              style={{
                width: 25,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              height:  this.state.height,
              position: "absolute",
              right: Dimensions.get("window").width / 2 - 12
            }}
            >
              <Image
                style={styles.userMedalImage}
                source={medalSmallGlobalView[3]}
              />
            </View>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width,
              flexDirection: "row",
              justifyContent: "flex-start"
            }}
          >
            <GameUserItem
              color={"#F7F8F9"}
              avatar={7}
              average={true}
              navigation={this.moveHomeStandings}
              points={
                this.state.match.weekly_user_standing_home
                  ? this.state.match.weekly_user_standing_home.avg_pos
                  : 0
              }
              height={this.state.height}
            />
            <GameReverseUserItem
              color={"#F7F8F9"}
              avatar={8}
              average={true}
              navigation={this.moveAwayStandings}
              points={
                this.state.match.weekly_user_standing_away
                  ? this.state.match.weekly_user_standing_away.avg_pos
                  : 0
              }
              height={this.state.height}
            />
          </View>
        </Aux> : 
        <View>
        <View
          style={{
            width: Dimensions.get("window").width,
            height: 40
            // backgroundColor: "blue"
          }}
        />
        <View style={{
          width: Dimensions.get("window").width,
          flexDirection: "row",
          justifyContent: "center",
          alignContent: 'center',
          height: 80
        }}>
              <ActivityIndicator
                style={{
                  alignContent: "center",
                  flex: 1,

                  alignItems: "center",
                  alignSelf: "center"
                }}
                size="large"
                color="#000000"
              />
            </View>
            </View>}
        <View
          style={{
            height: 200,
            flexDirection: "row"
          }}
        />
      </Aux>
    );
  };

  render() {
    let idHome = 1;
    let idAway = 1;
    if (this.state.match.season_match.city_home.city_name) {
      // vedo se è tra le città pilota
      idHome = citiesImage(this.state.match.season_match.city_home.city_name);
    }
    if (this.state.match.season_match.city_away.city_name) {
      idAway = citiesImage(this.state.match.season_match.city_away.city_name);
    }


    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "#ffffff"
        }}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            backgroundColor: "#ffffff"
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
          {this.singlePage(idHome, idAway)}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userAvatarImage: {
    width: 55,
    height: 55
  },
  userAvatarMiniImage: {
    width: 40,
    height: 40
  },
  userMedalImage: {
    width: 25,
    height: 25
  },
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: 260,
    position: "absolute",
    top: 0
  },
  gameNumber: {
    color: "#9D9B9C",
    fontSize: 16,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "Montserrat-ExtraBold",
    textAlign: "center",
    textAlignVertical: "center"
  },
  pointsText: {
    color: "#ffffff",
    fontSize: 24,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
    textAlignVertical: "center"
  },
  points14Text: {
    color: "#ffffff",
    fontSize: 14,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
    textAlignVertical: "center"
  },
  points10Text: {
    color: "#3D3D3D",
    fontSize: 10,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
    textAlignVertical: "center"
  },
  points10TextRegular: {
    color: "#3D3D3D",
    fontSize: 10,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
    textAlignVertical: "center"
  },
  points6Text: {
    color: "#3D3D3D",
    fontSize: 6,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
    textAlignVertical: "center"
  },

  Map: {
    fontFamily: "OpenSans-Bold",
    fontSize: 10,
    textAlign: "center",
    color: "#3D3D3D"
  },
  button: {
    width: Dimensions.get("window").width * 0.17,
    height: 30,
    borderRadius: 5,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1
  },
  value: {
    color: "#3D3D3D",
    fontSize: 30,

    // fontWeight: "600",
    fontFamily: "Montserrat-ExtraBold"
  },
  nameText: {
    color: "#3D3D3D",
    fontSize: 14,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "Montserrat-ExtraBold"
  },
  nameWhiteText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "Montserrat-ExtraBold"
  },
  levelText: {
    color: "#3D3D3D",
    fontSize: 14,
    textAlign: "left",

    fontFamily: "OpenSans-Regular"
  },
  timerText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",

    fontFamily: "OpenSans-Regular"
  },
  levelWhiteText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "left",

    fontFamily: "OpenSans-Regular"
  },
  PointsText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "left",

    fontFamily: "OpenSans-Bold"
  },
  name10Text: {
    color: "#3D3D3D",
    fontSize: 14,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "Montserrat-ExtraBold"
  },
  level10Text: {
    color: "#3D3D3D",
    fontSize: 10,
    textAlign: "left",

    fontFamily: "OpenSans-Regular"
  },
  name12Text: {
    color: "#3D3D3D",
    fontSize: 12,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "OpenSans-Bold"
  },

  vs: {
    color: "#9D9B9C",
    opacity: 0.3,
    fontSize: 30,

    fontFamily: "Montserrat-ExtraBold"
  },
  position: {
    color: "#3D3D3D",
    fontSize: 16,
    paddingTop: 4,

    fontFamily: "OpenSans-Regular"
  },
  positionNumber: {
    color: "#3D3D3D",
    fontSize: 20,

    fontWeight: "600",
    fontFamily: "OpenSans-Regular"
  },
  positionWhite: {
    color: "#FFFFFF",
    fontSize: 16,
    paddingTop: 4,

    fontFamily: "OpenSans-Regular"
  },
  positionWhiteNumber: {
    color: "#FFFFFF",
    fontSize: 20,

    fontWeight: "600",
    fontFamily: "OpenSans-Regular"
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  Value: {
    color: "#FFFFFF",
    fontSize: 30,
    textAlign: "center",
    fontFamily: "OpenSans-ExtraBold"
  },
  ValueDescr: {
    color: "#9D9B9C",
    fontSize: 10,
    textAlign: "center",
    fontWeight: "600",
    fontFamily: "OpenSans-Bold"
  },
  cardContainer: {
    width: Dimensions.get("window").width * 0.9,
    // + 45 cosi i punti sono piu sotto e ha piu spazio per fare il giro della card
    height: Dimensions.get("window").height * 0.55 + 25
  },
  card: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.55,
    backgroundColor: "#FE474C",
    borderRadius: 5,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  card1: {
    backgroundColor: "#FE474C"
  },
  card2: {
    backgroundColor: "#FEB12C"
  },
  label: {
    lineHeight: 470,
    textAlign: "center",
    fontSize: 55,
    fontFamily: "System",
    color: "#ffffff",
    backgroundColor: "transparent"
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.55,
    borderRadius: 4
  },
  content: {
    marginTop: 14,
    width: Dimensions.get("window").width * 0.83,
    // height: Dimensions.get("window").height * 0.4,
    height: Dimensions.get("window").height * 0.45
    // backgroundColor: "#3d3d3d"
  },

  ImageContent: {
    width: Dimensions.get("window").width * 0.83,
    // height: Dimensions.get("window").height * 0.4,
    height: Dimensions.get("window").height * 0.45
    // backgroundColor: "#3d3d3d"
  },
  avatarImage: {
    // flex: 1,
    // position: "absolute",
    width: 150,
    height: 150,
    alignSelf: "center",
    opacity: 1
  },
  cityImage: {
    flex: 1,
    // position: "absolute",

    width: 214,
    height: 350,
    alignSelf: "center",
    justifyContent: "center",
    flexDirection: "row",
    opacity: 1
  },
  cityCircle: {
    // position: "absolute",
    borderRadius: 100,

    width: 200,
    height: 200,
    alignSelf: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.5)"
  }
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    avatarImage: {
      flex: 1,
      // position: "absolute",
      width: 102,
      height: 168,
      alignSelf: "center"
    },
    cardContainer: {
      width: Dimensions.get("window").width * 0.8,
      height: Dimensions.get("window").height * 0.45
    },
    card: {
      width: Dimensions.get("window").width * 0.8,
      height: Dimensions.get("window").height * 0.45,
      backgroundColor: "#FE474C",
      borderRadius: 5,
      shadowColor: "rgba(0,0,0,0.5)",
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.5,
      justifyContent: "center",
      alignItems: "center"
    },
    contentContainer: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: "flex-start",
      alignItems: "center",
      width: Dimensions.get("window").width * 0.8,
      height: Dimensions.get("window").height * 0.45,
      borderRadius: 4
    },
    content: {
      marginTop: 14,
      width: Dimensions.get("window").width * 0.73,
      height: Dimensions.get("window").height * 0.35,
      backgroundColor: "#3d3d3d"
    },
    nameText: {
      color: "#fff",
      fontSize: 18,
      textAlign: "center",
      fontFamily: "Montserrat-ExtraBold"
    },
    levelText: {
      color: "#E83475",
      fontSize: 16,
      textAlign: "center",
      fontFamily: "Montserrat-ExtraBold"
    }
  });
}

const getStanding = state =>
  state.standings.cityStanding ? state.standings.standing : [];

const getStandingsState = createSelector(
  [getStanding],
  standing => standing
);

const withData = connect(state => {
  // prendo le info del match corrente
  return {
    standingsState: getStandingsState(state)
  };
});

export default withData(GameWeekCityTournamentScreen);
