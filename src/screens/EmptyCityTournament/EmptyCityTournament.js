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
  TouchableHighlight
} from "react-native";

import { connect } from "react-redux";
import Svg, { Circle, Polygon, Line } from "react-native-svg";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

import LinearGradient from "react-native-linear-gradient";

import {
  citiesImage,
  imagesCity,
  TournamentCities
} from "./../../components/FriendItem/FriendItem";
import { citiesDescription } from "./../CityScreenCards/CityScreenCards";
import IconMenuDrawer from "./../../components/IconMenuDrawer/IconMenuDrawer";
import InviteFriendsWave from "./../../components/InviteFriendsWave/InviteFriendsWave";
import { strings } from "../../config/i18n";
import { data, currentMatch } from "../../helpers/tournament";
import CitiesTournamentScreen from "../CitiesTournamentScreen/CitiesTournamentScreen";

class EmptyCityTournament extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     day: 0,
  //     hour: 0,
  //     minutes: 0
  //   };
  // }

  constructor(props) {
    super(props);

    // calcolo la settimana corrente

    const Match = currentMatch(data);

    this.state = {
      day: 0,
      hour: 0,
      minutes: 0,
      weekNum: Match.weekCurrent,
      week: [],
      endTimer: false,
      start_match: Match.start_match
    };
  }

  updateWeek = () => {
    const Match = currentMatch(data);

    this.setState({
      weekNum: Match.weekCurrent,
      start_match: Match.start_match
    });

    this.props.startOpenTournament();
  };

  static navigationOptions = props => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {"Sustainable City Tournament"}
        </Text>
      ),

      headerRight: <IconMenuDrawer navigation={props.navigation} />
    };
  };

  componentWillMount() {
    this.timerTournament();
    this.timer = setInterval(() => this.timerTournament(), 60000);
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }

  timerTournament = () => {
    // (year, month, day, hours, minutes, seconds, milliseconds)
    // Mon Jun 03 2019 06:31:00 GMT+0200

    // 2019-09-16T04:00:00Z
    

    let startTournament = new Date(
      "2019-09-23T04:30:00Z"
    ).getTime();
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
      // ricalcolo la settimana corrente del torrente

      if (this.timer) clearTimeout(this.timer);
      this.updateWeek();
    } else if (e_days > 0 || e_hrs > 0 || e_a_mins > 0) {
      this.setState({
        day: e_days,
        hour: e_a_hrs,
        minutes: e_a_mins
      });
    } else {
      this.setState({
        endTimer: true
      });

      if (this.timer) clearTimeout(this.timer);
      this.updateWeek();
    }
  };

  renderWaveFollowing = () => {
    return (
      <View>
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
      </View>
    );
  };

  renderEmptyCityTournament(cityInTournament) {
    return (
      <ScrollView
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "#ffffff"
        }}
      >
        <View
          style={{
            height: 50
          }}
        />
        <View
          style={{
            flexDirection: "column",

            position: "relative",
            alignSelf: "center",
            width: Dimensions.get("window").width * 0.8,
            backgroundColor: "#ffffff"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.6,
              height: Dimensions.get("window").width * 0.6,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignSelf: "center"
            }}
          >
            <Image
              source={require("./../../assets/images/cities/sct_big.png")}
              style={{
                width: Dimensions.get("window").width * 0.6,
                height: Dimensions.get("window").width * 0.6
              }}
            />
          </View>

          {!this.state.endTimer ? (
            <View
              style={{
                flexDirection: "row",
                height: 50,
                justifyContent: "center",
                position: "relative",
                alignSelf: "center",
                alignContent: "center",
                alignItems: "center",
                width: Dimensions.get("window").width * 0.8,
                backgroundColor: "#ffffff"
              }}
            >
              <Text style={styles.positionBlackNumber}>{this.state.day}</Text>
              <Text style={styles.positionBlack}>d </Text>
              <Text style={styles.positionBlackNumber}>{this.state.hour}</Text>
              <Text style={styles.positionBlack}>h </Text>
              <Text style={styles.positionBlackNumber}>
                {this.state.minutes}
              </Text>
              <Text style={styles.positionBlack}>m</Text>
            </View>
          ) : (
            <View />
          )}
        </View>
        <View
          style={{
            height: 50
          }}
        />
        {this.state.endTimer ? (
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
          </View>
        ) : (
          <View />
        )}
        <View
          style={{
            height: 50
          }}
        />
        <InviteFriendsWave
          navigation={this.props.navigation}
          typeInvite={"CityTournament"}
          cityInTournament={cityInTournament}
        />
        <View
          style={{
            height: 200,

            flexDirection: "row"
          }}
        />
      </ScrollView>
    );
  }

  render() {
    let city = this.props.infoProfile.city
      ? this.props.infoProfile.city.city_name
        ? this.props.infoProfile.city.city_name
        : ""
      : "";
    let id = 1;

    if (city.length) {
      // vedo se è tra le città pilota
      id = citiesImage(city);
    }
    const cityInTournament = TournamentCities(city);
    const width = Dimensions.get("window").width * 0.3;
    if (this.props.cityInTournament && this.state.endTimer) {
      return (
        <CitiesTournamentScreen
          navigation={this.props.navigation}
          infoProfile={this.props.infoProfile}
          cityInTournament={this.props.cityInTournament}
          id={this.props.id}
          city={this.props.city}
        />
      );
    } else {
      return this.renderEmptyCityTournament(cityInTournament);
    }
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: 320,
    position: "absolute",
    top: 100
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
    color: "#3D3D3D",
    fontSize: 20,
    paddingTop: 15,

    fontFamily: "OpenSans-Regular"
  },
  positionBlackNumber: {
    color: "#3D3D3D",
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

EmptyCityTournament.defaultProps = {
  startOpenTournament: () => {}
};

export default EmptyCityTournament;
