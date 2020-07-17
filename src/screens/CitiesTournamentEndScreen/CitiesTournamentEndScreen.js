import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  Image,
  ImageBackground,
  NativeModules,
  ScrollView,
  TouchableHighlight,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity
} from "react-native";

import { connect } from "react-redux";
import Svg, { Circle, Polygon, Line } from "react-native-svg";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

import LinearGradient from "react-native-linear-gradient";

import { imagesCity } from "./../../components/FriendItem/FriendItem";
import { citiesDescription } from "./../CityScreenCards/CityScreenCards";

import ArrowGame from "./../../components/ArrowGame/ArrowGame";
import { strings } from "../../config/i18n";
import {
  getScheduleWeek,
  getWeeklySingleMatch,
  getSeasonRanking
} from "./../../domains/screen/ActionCreators";
import Aux from "../../helpers/Aux";
import pointsDecimal from "../../helpers/pointsDecimal";
import { getCurrentMatchState } from "./../../domains/screen/Selectors";
import { data, currentMatch } from "../../helpers/tournament";



class CitiesTournamentEndScreen extends React.Component {
  constructor(props) {
    super(props);

    let startTournament = new Date(
      "Mon Sep 23 2019 06:31:00 GMT+0200"
    ).getTime();
    console.log(startTournament);

    let today = new Date();

    let e_msec = startTournament - today;
    console.log(e_msec);
    let e_mins = Math.floor(e_msec / 60000);
    let e_hrs = Math.floor(e_mins / 60);
    let e_days = Math.floor(e_hrs / 24);
    

    

    // calcolo la settimana corrente

    const Match = currentMatch(data);

    this.state = {
      day: e_days < 0 ? 0 : e_days,
      hour: 0,
      minutes: 0,
      hourStartMatch: 0,
      minutesStartMatch: 0,

      weekNum: Match.weekCurrent,
      week: [],
      recapMatch: { total_point_away: 0, total_point_home: 0 },
      match: null,
      match_id: 0,
      refreshing: false,
      start_match: Match.start_match,
      positionCity: "-",
      typePosition: "th",
      citiesStandings: [],
      endTimer: false
    };
  }

  render() {
    //  cityInTournament={cityInTournament}
    // id={id}
    // wave_#6985C0.png

    

    return (
      <ScrollView
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "#F7F8F9"
        }}
        showsVerticalScrollIndicator={false}
      >
        <View />
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#7D4D99", "#6985C0"]}
          style={styles.imageView}
        >

          <View style={styles.textView}>
          <View
             style={{ paddingTop: 20}}
            >
            <Text
              style={{
                fontFamily: "OpenSans-Regular",
                fontWeight: "400",
                color: "#FFFFFF",
                fontSize: 12,
                textAlign: "center"
              }}
            >
              {strings("the_first_city_")}
            </Text>
            <Text
              style={{
                fontFamily: "OpenSans-Regular",
                fontWeight: "400",
                color: "#FFFFFF",
                fontSize: 12,
                textAlign: "center"
              }}
            >
              {strings("and_we_got_an_a")}
            </Text>
            </View>
          </View>
          <Image
            source={require("../../assets/images/podium.png")}
            style={styles.image}
          />
          <View style={styles.textView}>
            <Text
              style={{
                fontFamily: "OpenSans-Regular",
                fontWeight: "400",
                color: "#FFFFFF",
                fontSize: 12,
                textAlign: "center"
              }}
            >
               {strings("for_playing_wit")}
            </Text>
            <Text
              style={{
                fontFamily: "OpenSans-Regular",
                fontWeight: "400",
                color: "#FFFFFF",
                fontSize: 12,
                textAlign: "center"
              }}
            >
               {strings("keep_calm_and_t")}
            </Text>
            
          </View>
          <View style={styles.textView}><Text style={{ textAlign: 'center'}}>
              <Text style={styles.positionBlackNumber}>-{this.state.day}</Text>
              <Text style={styles.positionBlack}>d </Text>
            </Text>
            </View>
        </LinearGradient>
        <ImageBackground
          source={require("../../assets/images/wave_end_tournament.png")}
          style={styles.backgroundImage}
        />
        <View>
          <View
            style={{
              height: 10,

              flexDirection: "row"
            }}
          />
          {this.props.cityInTournament ?
          <View
            style={{
              width: Dimensions.get("window").width,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <View
              style={{
                width: Dimensions.get("window").width / 3,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableWithoutFeedback
                onPress={() =>
                  this.props.navigation.navigate("ScheduleGameBlur", {
                    week: this.state.week,
                    weekCurrent: this.state.weekNum - 1
                  })
                }
                style={
                  {
                    // backgroundColor: "white"
                  }
                }
              >
                <View
                  style={{
                    shadowRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.5,
                    backgroundColor: "transparent",
                    elevation: 2,
                    borderRadius: 25,
                    height: 50,
                    width: 50,
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white"
                  }}
                >
                  {Platform.OS !== "android" ? (
                    <Svg height="40" width="40">
                      <Circle cx="20" cy="20" r="20" fill="white" />
                      <View
                        style={{
                          position: "absolute",
                          height: 50,
                          width: 50,
                          flexDirection: "row"
                        }}
                      >
                        <OwnIcon
                          name="schedule_icn_1"
                          size={40}
                          color={"#5FC4E2"}
                          style={{ top: -3 }}
                        />
                        <OwnIcon
                          name="schedule_icn_2"
                          size={40}
                          color={"#60368C"}
                          style={{ right: 40 }}
                        />
                        <OwnIcon
                          name="schedule_icn_3"
                          size={40}
                          color={"#3363AD"}
                          style={{ right: 80 }}
                        />
                      </View>
                    </Svg>
                  ) : (
                    <View
                      style={{
                        position: "absolute",
                        height: 50,
                        width: 50,
                        flexDirection: "row"
                      }}
                    >
                      <OwnIcon
                        style={{
                          position: "relative",
                          backgroundColor: "transparent",

                          top: 5,
                          left: 5
                        }}
                        name="schedule_icn_1"
                        size={40}
                        color={"#5FC4E2"}
                      />
                      <OwnIcon
                        name="schedule_icn_2"
                        size={40}
                        color={"#60368C"}
                        style={{ right: 35, top: 8 }}
                      />
                      <OwnIcon
                        name="schedule_icn_3"
                        size={40}
                        color={"#3363AD"}
                        style={{ right: 75, top: 9 }}
                      />
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
              <View style={{ height: 10 }} />
              <View
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.Map}>SCHEDULE</Text>
              </View>
            </View>
            <View
              style={{
                width: Dimensions.get("window").width / 3,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableWithoutFeedback
                onPress={() =>
                  this.props.navigation.navigate("CitiesStandingBlur")
                }
                style={
                  {
                    // backgroundColor: "white"
                  }
                }
              >
                <View
                  style={{
                    shadowRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.5,
                    backgroundColor: "transparent",
                    elevation: 2,
                    borderRadius: 25,
                    height: 50,
                    width: 50,
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    flexDirection: "column",
                    backgroundColor: "white"
                  }}
                >
                  {Platform.OS !== "android" ? (
                    <Svg height="40" width="40">
                      <Circle cx="20" cy="20" r="20" fill="white" />
                      <OwnIcon
                        name="rank_icn"
                        size={34}
                        color={"#6CBA7E"}
                        style={{ right: -3, top: 3 }}
                      />
                    </Svg>
                  ) : (
                    <OwnIcon
                      style={{
                        position: "relative",
                        backgroundColor: "transparent",

                        top: 0,
                        left: 0
                      }}
                      name="rank_icn"
                      size={34}
                      color={"#6CBA7E"}
                    />
                  )}
                </View>
              </TouchableWithoutFeedback>
              <View style={{ height: 10 }} />
              <View
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.Map}>RANKING</Text>
              </View>
            </View>
            {this.state.weekNum - 1 ? (
              <View
                style={{
                  width: Dimensions.get("window").width / 3,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.props.navigation.navigate("BestPlayersScreenBlur", {
                      infoProfile: this.props.infoProfile
                    })
                  }
                  style={
                    {
                      // backgroundColor: "white"
                    }
                  }
                >
                  <View
                    style={{
                      shadowRadius: 5,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 5 },
                      shadowOpacity: 0.5,
                      backgroundColor: "transparent",
                      elevation: 2,
                      borderRadius: 25,
                      height: 50,
                      width: 50,
                      alignContent: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "white"
                    }}
                  >
                    {Platform.OS !== "android" ? (
                      <Svg height="40" width="40">
                        <Circle cx="20" cy="20" r="20" fill="white" />
                        <OwnIcon
                          name="best_player_icn"
                          size={40}
                          color={"#FAB21E"}
                        />
                      </Svg>
                    ) : (
                      <OwnIcon
                        style={{
                          position: "relative",
                          backgroundColor: "transparent",

                          top: 0,
                          left: 0
                        }}
                        name="best_player_icn"
                        size={40}
                        color={"#FAB21E"}
                      />
                    )}
                  </View>
                </TouchableWithoutFeedback>
                <View style={{ height: 10 }} />
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={styles.Map}>BEST PLAYERS</Text>
                </View>
              </View>
            ) : (
              <View />
            )}
          </View> : <View
            style={{
              width: Dimensions.get("window").width,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <View
              style={{
                width: Dimensions.get("window").width / 2,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableWithoutFeedback
                onPress={() =>
                  this.props.navigation.navigate("ScheduleGameBlur", {
                    week: this.state.week,
                    weekCurrent: this.state.weekNum - 1
                  })
                }
                style={
                  {
                    // backgroundColor: "white"
                  }
                }
              >
                <View
                  style={{
                    shadowRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.5,
                    backgroundColor: "transparent",
                    elevation: 2,
                    borderRadius: 25,
                    height: 50,
                    width: 50,
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white"
                  }}
                >
                  {Platform.OS !== "android" ? (
                    <Svg height="40" width="40">
                      <Circle cx="20" cy="20" r="20" fill="white" />
                      <View
                        style={{
                          position: "absolute",
                          height: 50,
                          width: 50,
                          flexDirection: "row"
                        }}
                      >
                        <OwnIcon
                          name="schedule_icn_1"
                          size={40}
                          color={"#5FC4E2"}
                          style={{ top: -3 }}
                        />
                        <OwnIcon
                          name="schedule_icn_2"
                          size={40}
                          color={"#60368C"}
                          style={{ right: 40 }}
                        />
                        <OwnIcon
                          name="schedule_icn_3"
                          size={40}
                          color={"#3363AD"}
                          style={{ right: 80 }}
                        />
                      </View>
                    </Svg>
                  ) : (
                    <View
                      style={{
                        position: "absolute",
                        height: 50,
                        width: 50,
                        flexDirection: "row"
                      }}
                    >
                      <OwnIcon
                        style={{
                          position: "relative",
                          backgroundColor: "transparent",

                          top: 5,
                          left: 5
                        }}
                        name="schedule_icn_1"
                        size={40}
                        color={"#5FC4E2"}
                      />
                      <OwnIcon
                        name="schedule_icn_2"
                        size={40}
                        color={"#60368C"}
                        style={{ right: 35, top: 8 }}
                      />
                      <OwnIcon
                        name="schedule_icn_3"
                        size={40}
                        color={"#3363AD"}
                        style={{ right: 75, top: 9 }}
                      />
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
              <View style={{ height: 10 }} />
              <View
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.Map}>SCHEDULE</Text>
              </View>
            </View>
            <View
              style={{
                width: Dimensions.get("window").width / 2,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableWithoutFeedback
                onPress={() =>
                  this.props.navigation.navigate("CitiesStandingBlur")
                }
                style={
                  {
                    // backgroundColor: "white"
                  }
                }
              >
                <View
                  style={{
                    shadowRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.5,
                    backgroundColor: "transparent",
                    elevation: 2,
                    borderRadius: 25,
                    height: 50,
                    width: 50,
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    flexDirection: "column",
                    backgroundColor: "white"
                  }}
                >
                  {Platform.OS !== "android" ? (
                    <Svg height="40" width="40">
                      <Circle cx="20" cy="20" r="20" fill="white" />
                      <OwnIcon
                        name="rank_icn"
                        size={34}
                        color={"#6CBA7E"}
                        style={{ right: -3, top: 3 }}
                      />
                    </Svg>
                  ) : (
                    <OwnIcon
                      style={{
                        position: "relative",
                        backgroundColor: "transparent",

                        top: 0,
                        left: 0
                      }}
                      name="rank_icn"
                      size={34}
                      color={"#6CBA7E"}
                    />
                  )}
                </View>
              </TouchableWithoutFeedback>
              <View style={{ height: 10 }} />
              <View
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.Map}>RANKING</Text>
              </View>
            </View>
            
          </View>}
          <View
            style={{
              height: 100,

              flexDirection: "row"
            }}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: 50
    // position: "absolute",
    // top: 100
  },
  imageView: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width + 80,
    alignContent: "center",
    justifyContent: "space-around",
    flexDirection: "column",
    alignItems: "center"
  },
  image: {
    width: Dimensions.get("window").width * 0.6 * 1.4875,
    height: Dimensions.get("window").width * 0.6
    // position: "absolute",
    // top: 100
  },
  textView: {
    width: Dimensions.get("window").width * 0.6 * 1.4875
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
  nextMatch: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    // fontWeight: "600",
    fontFamily: "OpenSans-Bold"
  },
  levelText: {
    color: "#3D3D3D",
    fontSize: 14,
    textAlign: "left",

    fontFamily: "OpenSans-Regular"
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
  positionBlack: {
    color: "#FFFFFF",
    fontSize: 20,
    paddingTop: 15,

    fontFamily: "OpenSans-Regular"
  },
  positionBlackNumber: {
    color: "#FFFFFF",
    fontSize: 35,

    fontWeight: "600",
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

const withData = connect(state => {
  // prendo le info del match corrente
  return {
    match: getCurrentMatchState(state)
  };
});

export default withData(CitiesTournamentEndScreen);
