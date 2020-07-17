import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  NativeModules,
  TouchableOpacity
} from "react-native";

import { images } from "./../../components/InfoUserHome/InfoUserHome";
import { limitAvatar } from "./../../components/UserItem/UserItem";
import pointsDecimal from "../../helpers/pointsDecimal";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";
import Settings from "./../../config/Settings";

import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from "react-native-google-analytics-bridge";

let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);

import analytics from "@react-native-firebase/analytics";
async function trackScreenView(screen) {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
}

class GameReverseUserItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  componentDidMount() {
    if (this.props.sponsorName) {
      // vai allo sponsor
      Tracker.trackScreenView(
        "CityTournament.js - sponsor -" + this.props.sponsorName
      );
      trackScreenView("CityTournament.js - sponsor -" + this.props.sponsorName);
    }
  }

  goToFriend = () => {
    // se ho un id allora vado nel mio profilo
    // se uguale al mio id

    if (this.props.navigation) {
      console.log(this.props.idUser);
      console.log(this.props.user.user_id);
      if (this.props.idUser == this.props.user.user_id.user_id) {
        this.props.navigation.navigate("Info");
      } else {
        data = {
          user_id: this.props.user.user_id.user_id,
          avatar: this.props.user.avatar,
          role: this.props.user.role,
          level: this.props.user.level.level_number,
          first_name: this.props.user.user_id.first_name,
          last_name: this.props.user.user_id.last_name,
          city: null,
          community: this.props.sponsorName ? {name: this.props.sponsorName} : null
        };
        console.log(data);
        this.props.navigation.navigate("FriendDetailFromGlobal", {
          friendData: data,
          can_follow: false
        });
      }
    }
  };

  render() {
    let avatar = limitAvatar(this.props.user.avatar);
    if (this.props.average) {
      return (
        <TouchableOpacity
          onPress={() => this.props.navigation()}
          disabled={!this.props.points}
          style={{
            width: Dimensions.get("window").width * 0.5,
            height: this.props.height,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            backgroundColor: this.props.color
            //   borderRightWidth: 0.5,
            //   borderRightColor: '#3d3d3d'
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.5 - 1,
              height: this.props.height,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row"
            }}
          >
            <View
              style={{
                width: 60,
                height: this.props.height,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row"
              }}
            >
              <Text style={styles.points11TextRegular}>
                {this.props.points ? pointsDecimal(this.props.points) : ""}
              </Text>
            </View>

            {this.props.sponsorName ? (
              <View
                style={{
                  width: Dimensions.get("window").width * 0.5 - 120,
                  height: this.props.height,
                  alignItems: "flex-end",
                  justifyContent: "center",
                  flexDirection: "column"
                }}
              >
                <Text style={styles.points11Text}>
                  {this.props.average ? "Team Average" : "Marina D."}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingTop: 3
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center"
                    }}
                  >
                    <OwnIcon name="star_icn" size={12} color={"#F9B224"} />
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center"
                    }}
                  >
                    <Text style={styles.points6Text}>
                      {"by " + this.props.sponsorName}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={{
                  width: Dimensions.get("window").width * 0.5 - 120,
                  height: this.props.height,
                  alignItems: "flex-end",
                  justifyContent: "center",
                  flexDirection: "column"
                }}
              >
                <Text style={styles.points11Text}>
                  {this.props.average ? "Team Average" : "Marina D."}
                </Text>
              </View>
            )}

            <View
              style={{
                width: 60,
                height: this.props.height,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row"
              }}
            >
              <Image
                style={styles.userAvatarMiniImage}
                source={
                  this.props.average
                    ? require("../../assets/images/cities/average_icn.png")
                    : images[avatar]
                }
              />
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this.goToFriend()}
          disabled={!this.props.points}
          style={{
            width: Dimensions.get("window").width * 0.5,
            height: this.props.height,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            backgroundColor: this.props.color
            //   borderRightWidth: 0.5,
            //   borderRightColor: '#3d3d3d'
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.5 - 1,
              height: this.props.height,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row"
            }}
          >
            <View
              style={{
                width: 60,
                height: this.props.height,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row"
              }}
            >
              <Text style={styles.points11TextRegular}>
                {pointsDecimal(this.props.points)}
              </Text>
            </View>

            {this.props.sponsorName ? (
              <View
                style={{
                  width: Dimensions.get("window").width * 0.5 - 120,
                  height: this.props.height,
                  alignItems: "flex-end",
                  justifyContent: "center",
                  flexDirection: "column"
                }}
              >
                <Text style={styles.points11Text}>
                  {this.props.average
                    ? "Team Average"
                    : this.props.user.user_id.first_name
                        .charAt(0)
                        .toUpperCase() +
                      this.props.user.user_id.first_name
                        .toLowerCase()
                        .slice(1) +
                      " " +
                      this.props.user.user_id.last_name.substr(0, 1) +
                      "."}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingTop: 3
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignSelf: "center"
                    }}
                  >
                    <OwnIcon name="star_icn" size={12} color={"#F9B224"} />
                  </View>

                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignSelf: "center"
                    }}
                  >
                    <Text style={styles.points6Text}>
                      {"by " + this.props.sponsorName}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={{
                  width: Dimensions.get("window").width * 0.5 - 120,
                  height: this.props.height,
                  alignItems: "flex-end",
                  justifyContent: "center",
                  flexDirection: "column"
                }}
              >
                <Text style={styles.points11Text}>
                  {this.props.average
                    ? "Team Average"
                    : this.props.user.user_id.first_name
                        .charAt(0)
                        .toUpperCase() +
                      this.props.user.user_id.first_name
                        .toLowerCase()
                        .slice(1) +
                      " " +
                      this.props.user.user_id.last_name.substr(0, 1) +
                      "."}
                </Text>
              </View>
            )}

            <View
              style={{
                width: 60,
                height: this.props.height,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row"
              }}
            >
              <Image
                style={styles.userAvatarMiniImage}
                source={
                  this.props.average
                    ? require("../../assets/images/cities/average_icn.png")
                    : images[avatar]
                }
              />
            </View>
          </View>
        </TouchableOpacity>
      );
    }
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
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: 320,
    position: "absolute",
    top: 300
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
  points11Text: {
    color: "#3D3D3D",
    fontSize: 11,
    textAlign: "right",
    // fontWeight: "600",
    fontFamily: "OpenSans-Bold",
    textAlign: "right",
    textAlignVertical: "center"
  },
  points11TextRegular: {
    color: "#3D3D3D",
    fontSize: 11,
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

GameReverseUserItem.defaultProps = {
  color: "#FFFFFF",
  avatar: 1,
  points: "1.100",
  average: false,
  navigation: () => {},
  height: 60,
  user: {
    user_id: { user_id: 176, first_name: "Pippo", last_name: "Pluto" },
    avatar: 1,
    role: "1",
    level: {
      id: 1,
      name: "newbie",
      level_number: 1
    }
  },
  user_id: 176,
  sponsorName: null
};

export default GameReverseUserItem;
