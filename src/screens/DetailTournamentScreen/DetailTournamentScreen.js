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
  RefreshControl,
  TouchableOpacity
} from "react-native";

import { connect } from "react-redux";
import Svg, { Circle, Polygon, Line } from "react-native-svg";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import LinearGradient from "react-native-linear-gradient";
import { StackedAreaChart } from "react-native-svg-charts";
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
import * as shape from "d3-shape";

class DetailTournamentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };

    this.tournament = {};
  }

  componentWillMount() {
    try {
      this.tournament = this.props.navigation.state.params.tournament;
    } catch (error) {
      this.tournament = this.props.tournament;
    }
  }

  // static navigationOptions = props => {
  //   return {
  //     headerTitle: (
  //       <Text
  //         style={{
  //           left: Platform.OS == "android" ? 20 : 0
  //         }}
  //       >
  //         {strings("id_2_01")}
  //       </Text>
  //     ),

  //     headerRight: <IconMenuDrawer navigation={props.navigation} />
  //   };
  // };

  onRefresh() {}

  getUnderlinedSubStr(str, style, onPresses) {
    let result = str.split("%");

    return result.map((e, i) => {
      if (i % 2 == 0)
        return (
          <Text key={i} style={style}>
            {e}
          </Text>
        );
      else
        return (
          <Text
            key={i}
            style={[style, { textDecorationLine: "underline" }]}
            onPress={onPresses[i]}
          >
            {e}
          </Text>
        );
    });
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={styles.allScrollView}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
      >
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#7D4D99", "#6497CC"]}
          style={styles.allView}
        >
          <ImageBackground
            source={require("./../../assets/images/cities/city_page_bg.png")}
            style={styles.allView}
          >
            <Image
              source={require("./../../assets/images/tournament_university.png")}
              style={styles.imageLogo}
            />
          </ImageBackground>
        </LinearGradient>
        <StackedAreaChart
          style={{
            height: 30,
            width: Dimensions.get("window").width,
            position: "absolute",
            top: Dimensions.get("window").height * 0.4 - 30
          }}
          data={[
            {
              month: new Date(2015, 0, 1),
              apples: 3840,
              bananas: 1400,
              cherries: 1200,
              dates: 1200
            },
            {
              month: new Date(2015, 1, 1),
              apples: 1600,
              bananas: 2400,
              cherries: 960,
              dates: -960
            },
            {
              month: new Date(2015, 2, 1),
              apples: 2500,
              bananas: 3500,
              cherries: 3640,
              dates: -3640
            },
            {
              month: new Date(2015, 2, 1),
              apples: 1300,
              bananas: 3500,
              cherries: 3640,
              dates: -3640
            },
            {
              month: new Date(2015, 3, 1),
              apples: 3320,
              bananas: 480,
              cherries: 640,
              dates: -640
            }
          ]}
          keys={["apples"]}
          colors={["#FFFFFF"]}
          curve={shape.curveNatural}
          showGrid={false}
        />
        <View style={styles.center}>
          <Text style={styles.textTitle}>{this.tournament.name}</Text>
          <Text style={styles.textSubTitle}>{this.tournament.description}</Text>
          <TouchableOpacity
            onPress={() => {
              // this.props.navigation.navigate("LeaderboardChallengeScreen", {
              //   challenge: this.challenge,
              //   score: this.state.score
              // });
              this.props.navigation.navigate("ChooseTeamScreen", {
                tournament: this.tournament
              });
            }}
            style={{
              paddingTop: 40
            }}
          >
            <LinearGradient
              start={{ x: 0.2, y: 1.0 }}
              end={{ x: 0.8, y: 0.0 }}
              locations={[0, 1.0]}
              colors={["#7D4D99", "#6497CC"]}
              style={{
                padding: 15,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 35,
                width: Dimensions.get("window").width * 0.5,
                // height: 65,
                alignItems: "center",
                alignSelf: "center",
                flexDirection: "row"
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "OpenSans-Regular",
                  color: "#fff",
                  fontWeight: "bold",
                  alignContent: "center"
                }}
              >
                {strings("id_3_10")}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <View
            style={{
              width: Dimensions.get("window").width * 0.8,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 5
            }}
          >
            <Text>
              {this.getUnderlinedSubStr(
                "By clicking Join, you confirm to accept the %Tournament Rules%.",
                styles.rules,
                {
                  // posizione testo clickabile
                  "1": () => {
                    this.props.navigation.navigate("TournamentsRulesScreen", {
                      uri: this.tournament.link
                    });
                  }
                }
              )}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  rules: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 12,
    textAlign: "center"
  },
  textTitle: {
    paddingTop: 20,
    fontFamily: "Montserrat-ExtraBold",
    fontSize: 20,
    textAlign: "left",
    color: "#391B57"
  },
  textSubTitle: {
    paddingTop: 20,
    fontFamily: "OpenSans-Regular",
    fontSize: 15,
    textAlign: "left",
    color: "#3D3D3D"
  },
  center: {
    width: Dimensions.get("window").width * 0.9,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center"
  },
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: 320,
    position: "absolute",
    top: 100
  },
  imageLogo: {
    width: Dimensions.get("window").height * 0.4 - 60,
    height: Dimensions.get("window").height * 0.4 - 60
  },
  space: {
    height: Dimensions.get("window").width * 0.15
  },
  subView: {
    width: Dimensions.get("window").width * 0.9,
    paddingTop: 15,
    alignSelf: "center"
  },
  allView: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.4,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  allScrollView: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#ffffff"
  },
  textTournament: {
    fontFamily: "OpenSans-Bold",
    fontSize: 16,
    textAlign: "center",
    color: "#FFFFFF"
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

export default DetailTournamentScreen;
