/**
 * InfoUserHome è il componente per visualizzare info sull'utente nella home
 * tra cui immagine profilo, punti, posizione e nome
 * @push
 */

import React from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
  Platform
} from "react-native";
import pointsDecimal from "../../helpers/pointsDecimal";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { limitAvatar } from "./../UserItem/UserItem";
import WavyArea from "./../../components/WavyArea/WavyArea";
import LinearGradient from "react-native-linear-gradient";
import { getGlobalInfoState, getCityInfoState, getFriendInfoState, getCommunityInfoState, getSelectedLeaderboardState} from  "../../domains/standings/Selectors";

class InfoUserHome extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.createRef(this.view);
  }

  render() {
    let userAvatar = limitAvatar(this.props.avatarId);

    const name = this.props.infoProfile.first_name
      ? this.props.infoProfile.first_name.toUpperCase() +
        " " +
        this.props.infoProfile.last_name.charAt(0).toUpperCase() +
        "."
      : "";

    let ranking = "-/-";

    let typeLeaderboard = "City";
    let points = this.props.points;

    if (this.props.selectedLeaderboard == "community") {
      points = this.props.infoUserCommunityClassification.points;

      typeLeaderboard = this.props.infoProfile.community
        ? this.props.infoProfile.community.name
        : "Community";

      ranking =
        (this.props.infoUserCommunityClassification.index !== "-"
          ? this.props.infoUserCommunityClassification.index + 1
          : "-") +
        "/" +
        (this.props.infoUserCommunityClassification.number !== "-"
          ? this.props.infoUserCommunityClassification.number
          : "-");
    } else if (this.props.selectedLeaderboard == "city") {
      points = this.props.infoUserCityClassification.points;

      typeLeaderboard = this.props.infoProfile.city
        ? this.props.infoProfile.city.city_name
          ? this.props.infoProfile.city.city_name
          : "City"
        : "City";
      typeLeaderboard =
        typeLeaderboard.charAt(0).toUpperCase() + typeLeaderboard.slice(1);
      ranking =
        (this.props.infoUserCityClassification.index !== "-"
          ? this.props.infoUserCityClassification.index + 1
          : "-") +
        "/" +
        (this.props.infoUserCityClassification.number !== "-"
          ? this.props.infoUserCityClassification.number
          : "-");
    } else if (
      this.props.selectedLeaderboard == "friend" &&
      this.props.infoUserFriendsClassification
    ) {
      points = this.props.infoUserFriendsClassification.points;
      typeLeaderboard = "Friends";
      ranking =
        (this.props.infoUserFriendsClassification.index !== "-"
          ? this.props.infoUserFriendsClassification.index + 1
          : "-") +
        "/" +
        (this.props.infoUserFriendsClassification.numFriend
          ? this.props.infoUserFriendsClassification.numFriend
          : "-");
    } else {
      points = this.props.infoUserGlobalClassification.points;
      typeLeaderboard = "World";
      ranking =
        (this.props.infoUserGlobalClassification.index !== "-"
          ? this.props.infoUserGlobalClassification.index + 1
          : "-") +
        "/" +
        (this.props.infoUserGlobalClassification.number !== "-"
          ? this.props.infoUserGlobalClassification.number
          : "-");
    }

    return (
      <View
        style={{
          zIndex: -2,
          position: "absolute",
          top: 0,
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "white"
        }}
        ref={view => {
          this.view = view;
        }}
      >
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1 }}
          locations={[0, 1.0]}
          colors={["#E82F73", "#F49658"]}
          style={styles.gradientContainer}
        >
          <View style={styles.gradientContainerCurve}>
            <WavyArea
              newData={[
                {
                  value: 2
                },
                {
                  value: 8
                },
                {
                  value: 6
                },
                {
                  value: 1
                },
                {
                  value: 9
                },
                {
                  value: 1
                }
              ]}
              // animate={this.state.animate}
              data={[
                {
                  value: 10
                },
                {
                  value: 5
                },
                {
                  value: 2
                },
                {
                  value: 6
                },
                {
                  value: 8
                },
                {
                  value: 1
                }
              ]}
              style={{
                height:
                  Platform.OS === "ios"
                    ? 86
                    : Dimensions.get("window").height * 0.1 + 5
              }}
            />
          </View>
        </LinearGradient>

        <View style={styles.Container}>
          <View style={styles.centerContainer}>
            <Text
              style={{
                fontFamily: "Montserrat-ExtraBold",
                textAlign: "center",
                fontSize: 22,
                color: "#fff"
              }}
            >
              {name !== " ." ? name : ""}
            </Text>
          </View>
          <View style={styles.ThreeContainer}>
            <View>
              <Text
                style={{
                  fontFamily: "OpenSans-Regular",
                  textAlign: "center",
                  fontSize: 14,
                  color: "white",
                  fontWeight: "bold"
                }}
              >
                {ranking}
              </Text>
              <Text
                style={{
                  fontFamily: "OpenSans-Regular",
                  textAlign: "center",
                  fontSize: 12,
                  color: "white",
                  fontWeight: "bold"
                }}
              >
                {typeLeaderboard}
              </Text>
            </View>
            {/* 
          <Text
            style={{
              fontFamily: "OpenSans-Regular",
              textAlign: "center",
              fontSize: 14,
              color: "white",
              fontWeight: "bold"
            }}
          >
            Imm
          </Text> 
          */}
            <Image
              style={{
                width: 80,
                height: 80,
                position: "absolute",
                right: Dimensions.get("window").width / 2 - 40
              }}
              source={images[userAvatar]}
            />

            <View />

            <View>
              <Text
                style={{
                  fontFamily: "OpenSans-Regular",
                  textAlign: "center",
                  fontSize: 22,
                  color: "white",
                  fontWeight: "bold"
                }}
              >
                {/* {pointsDecimal(this.props.points)} */}
                {pointsDecimal(points)}
              </Text>
              <Text
                style={{
                  fontFamily: "OpenSans-Regular",
                  textAlign: "center",
                  fontSize: 12,
                  color: "white",
                  fontWeight: "bold"
                }}
              >
                Weekly Points
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}


export const listName = {
  1: "Samantha",
  2: "Cynthia",
  3: "Moise",
  4: "Jeff",
  5: "Nitita",
  6: "Renato",
  7: "Jules",
  8: "Julia",
  9: "Valerie",
  10: "Sustainabot",
  11: "Gino",
  12: "Kiran",
  13: "El brujo turquesa",
  14: "Stanley",
  15: "Kitana",
  16: "Sid",
  17: "Bud",
  18: "Amira",
  19: "Blink",
  20: "Patrick",
  21: "Margot",
  22: "Every",
  23: "Paul",
  24: "Sigfried",
  25: "Big George",
  26: "Mr. Magic",
  27: "Keya",
  28: "Billie",
  29: "Alex",
  30: "Zelda",
  31: "Rosemary",
  32: "Erika",
  33: "Frederick II",
  34: "Nino",
  35: "Rosalia",
  36: "Totò",
  37: "Alessia",
  38: "Asma",
  39: "Caterina",
  40: "Dario S.",
  41: "Jim",
  42: "Jack",
  43: "Harry",
  44: "Kermit",
  45: "",
  46: "",
  47: "",
  48: "",
  49: "",
  50: "",
  51: "",
  52: "",
  53: "",
  54: "",
  55: "",
  56: "",
  57: "",
  58: "",
  59: "",
  60: "",
  61: "",
  62: "",
  63: "",
  64: "",
  65: "",
  66: "",
  67: "",
  68: "",
  69: "",
  70: "",
  71: "",
  72: "",
  73: ""
};

export const images = {
  1: require("../../assets/images/avatars/faces/1_xhdpi.png"),
  2: require("../../assets/images/avatars/faces/2_xhdpi.png"),
  3: require("../../assets/images/avatars/faces/3_xhdpi.png"),
  4: require("../../assets/images/avatars/faces/4_xhdpi.png"),
  5: require("../../assets/images/avatars/faces/5_xhdpi.png"),
  6: require("../../assets/images/avatars/faces/6_xhdpi.png"),
  7: require("../../assets/images/avatars/faces/7_xhdpi.png"),
  8: require("../../assets/images/avatars/faces/8_xhdpi.png"),
  9: require("../../assets/images/avatars/faces/9_xhdpi.png"),
  10: require("../../assets/images/avatars/faces/10_xhdpi.png"),
  11: require("../../assets/images/avatars/faces/11_xhdpi.png"),
  12: require("../../assets/images/avatars/faces/12_xhdpi.png"),
  13: require("../../assets/images/avatars/faces/13_xhdpi.png"),
  14: require("../../assets/images/avatars/faces/14_xhdpi.png"),
  15: require("../../assets/images/avatars/faces/15_xhdpi.png"),
  16: require("../../assets/images/avatars/faces/16_xhdpi.png"),
  17: require("../../assets/images/avatars/faces/17_xhdpi.png"),
  18: require("../../assets/images/avatars/faces/18_xhdpi.png"),
  19: require("../../assets/images/avatars/faces/19_xhdpi.png"),
  20: require("../../assets/images/avatars/faces/20_xhdpi.png"),
  21: require("../../assets/images/avatars/faces/21_xhdpi.png"),
  22: require("../../assets/images/avatars/faces/22_xhdpi.png"),
  23: require("../../assets/images/avatars/faces/23_xhdpi.png"),
  24: require("../../assets/images/avatars/faces/24_xhdpi.png"),
  25: require("../../assets/images/avatars/faces/25_xhdpi.png"),
  26: require("../../assets/images/avatars/faces/26_xhdpi.png"),
  27: require("../../assets/images/avatars/faces/27_xhdpi.png"),
  28: require("../../assets/images/avatars/faces/28_xhdpi.png"),
  29: require("../../assets/images/avatars/faces/29_xhdpi.png"),
  30: require("../../assets/images/avatars/faces/30_xhdpi.png"),
  31: require("../../assets/images/avatars/faces/31_xhdpi.png"),
  32: require("../../assets/images/avatars/faces/32_xhdpi.png"),
  33: require("../../assets/images/avatars/faces/33_xhdpi.png"),
  34: require("../../assets/images/avatars/faces/34_xhdpi.png"),
  35: require("../../assets/images/avatars/faces/35_xhdpi.png"),
  36: require("../../assets/images/avatars/faces/36_xhdpi.png"),
  37: require("../../assets/images/avatars/faces/37_xhdpi.png"),
  38: require("../../assets/images/avatars/faces/38_xhdpi.png"),
  39: require("../../assets/images/avatars/faces/39_xhdpi.png"),
  40: require("../../assets/images/avatars/faces/40_xhdpi.png"),
  41: require("../../assets/images/avatars/faces/41_xhdpi.png"),
  42: require("../../assets/images/avatars/faces/42_xhdpi.png"),
  43: require("../../assets/images/avatars/faces/43_xhdpi.png"),
  44: require("../../assets/images/avatars/faces/44_xhdpi.png"),
  45: require("../../assets/images/avatars/faces/45_xhdpi.png"),
  46: require("../../assets/images/avatars/faces/46_xhdpi.png"),
  47: require("../../assets/images/avatars/faces/47_xhdpi.png"),
  48: require("../../assets/images/avatars/faces/48_xhdpi.png"),
  49: require("../../assets/images/avatars/faces/49_xhdpi.png"),
  50: require("../../assets/images/avatars/faces/50_xhdpi.png"),
  51: require("../../assets/images/avatars/faces/51_xhdpi.png"),
  52: require("../../assets/images/avatars/faces/52_xhdpi.png"),
  53: require("../../assets/images/avatars/faces/53_xhdpi.png"),
  54: require("../../assets/images/avatars/faces/54_xhdpi.png"),
  55: require("../../assets/images/avatars/faces/55_xhdpi.png"),
  56: require("../../assets/images/avatars/faces/56_xhdpi.png"),
  57: require("../../assets/images/avatars/faces/57_xhdpi.png"),
  58: require("../../assets/images/avatars/faces/58_xhdpi.png"),
  59: require("../../assets/images/avatars/faces/59_xhdpi.png"),
  60: require("../../assets/images/avatars/faces/60_xhdpi.png"),
  61: require("../../assets/images/avatars/faces/61_xhdpi.png"),
  62: require("../../assets/images/avatars/faces/62_xhdpi.png"),
  63: require("../../assets/images/avatars/faces/63_xhdpi.png"),
  64: require("../../assets/images/avatars/faces/64_xhdpi.png"),
  65: require("../../assets/images/avatars/faces/65_xhdpi.png"),
  66: require("../../assets/images/avatars/faces/66_xhdpi.png"),
  67: require("../../assets/images/avatars/faces/67_xhdpi.png"),
  68: require("../../assets/images/avatars/faces/68_xhdpi.png"),
  69: require("../../assets/images/avatars/faces/69_xhdpi.png"),
  70: require("../../assets/images/avatars/faces/70_xhdpi.png"),
  71: require("../../assets/images/avatars/faces/71_xhdpi.png"),
  72: require("../../assets/images/avatars/faces/72_xhdpi.png"),
  73: require("../../assets/images/avatars/faces/73_xhdpi.png"),
};

export const images_bn = {
  1: require("../../assets/images/avatars/faces/1_xhdpi_bn.png"),
  2: require("../../assets/images/avatars/faces/2_xhdpi_bn.png"),
  3: require("../../assets/images/avatars/faces/3_xhdpi_bn.png"),
  4: require("../../assets/images/avatars/faces/4_xhdpi_bn.png"),
  5: require("../../assets/images/avatars/faces/5_xhdpi_bn.png"),
  6: require("../../assets/images/avatars/faces/6_xhdpi_bn.png"),
  7: require("../../assets/images/avatars/faces/7_xhdpi_bn.png"),
  8: require("../../assets/images/avatars/faces/8_xhdpi_bn.png"),
  9: require("../../assets/images/avatars/faces/9_xhdpi_bn.png"),
  10: require("../../assets/images/avatars/faces/10_xhdpi_bn.png"),
  11: require("../../assets/images/avatars/faces/11_xhdpi_bn.png"),
  12: require("../../assets/images/avatars/faces/12_xhdpi_bn.png"),
  13: require("../../assets/images/avatars/faces/13_xhdpi_bn.png"),
  14: require("../../assets/images/avatars/faces/14_xhdpi_bn.png"),
  15: require("../../assets/images/avatars/faces/15_xhdpi_bn.png"),
  16: require("../../assets/images/avatars/faces/16_xhdpi_bn.png"),
  17: require("../../assets/images/avatars/faces/17_xhdpi_bn.png"),
  18: require("../../assets/images/avatars/faces/18_xhdpi_bn.png"),
  19: require("../../assets/images/avatars/faces/19_xhdpi_bn.png"),
  20: require("../../assets/images/avatars/faces/20_xhdpi_bn.png"),
  21: require("../../assets/images/avatars/faces/21_xhdpi_bn.png"),
  22: require("../../assets/images/avatars/faces/22_xhdpi_bn.png"),
  23: require("../../assets/images/avatars/faces/23_xhdpi_bn.png"),
  24: require("../../assets/images/avatars/faces/24_xhdpi_bn.png"),
  25: require("../../assets/images/avatars/faces/25_xhdpi_bn.png"),
  26: require("../../assets/images/avatars/faces/26_xhdpi_bn.png"),
  27: require("../../assets/images/avatars/faces/27_xhdpi_bn.png"),
  28: require("../../assets/images/avatars/faces/28_xhdpi_bn.png"),
  29: require("../../assets/images/avatars/faces/29_xhdpi_bn.png"),
  30: require("../../assets/images/avatars/faces/30_xhdpi_bn.png"),
  31: require("../../assets/images/avatars/faces/31_xhdpi_bn.png"),
  32: require("../../assets/images/avatars/faces/32_xhdpi_bn.png"),
  33: require("../../assets/images/avatars/faces/33_xhdpi_bn.png"),
  34: require("../../assets/images/avatars/faces/34_xhdpi_bn.png"),
  35: require("../../assets/images/avatars/faces/35_xhdpi_bn.png"),
  36: require("../../assets/images/avatars/faces/36_xhdpi_bn.png"),
  37: require("../../assets/images/avatars/faces/37_xhdpi_bn.png"),
  38: require("../../assets/images/avatars/faces/38_xhdpi_bn.png"),
  39: require("../../assets/images/avatars/faces/39_xhdpi_bn.png"),
  40: require("../../assets/images/avatars/faces/40_xhdpi_bn.png"),
  41: require("../../assets/images/avatars/faces/41_xhdpi_bn.png"),
  42: require("../../assets/images/avatars/faces/42_xhdpi_bn.png"),
  43: require("../../assets/images/avatars/faces/43_xhdpi_bn.png"),
  44: require("../../assets/images/avatars/faces/44_xhdpi_bn.png"),
  45: require("../../assets/images/avatars/faces/45_xhdpi_bn.png"),
  46: require("../../assets/images/avatars/faces/46_xhdpi_bn.png"),
  47: require("../../assets/images/avatars/faces/47_xhdpi_bn.png"),
  48: require("../../assets/images/avatars/faces/48_xhdpi_bn.png"),
  49: require("../../assets/images/avatars/faces/49_xhdpi_bn.png"),
  50: require("../../assets/images/avatars/faces/50_xhdpi_bn.png"),
  51: require("../../assets/images/avatars/faces/51_xhdpi_bn.png"),
  52: require("../../assets/images/avatars/faces/52_xhdpi_bn.png"),
  53: require("../../assets/images/avatars/faces/53_xhdpi_bn.png"),
  54: require("../../assets/images/avatars/faces/54_xhdpi_bn.png"),
  55: require("../../assets/images/avatars/faces/55_xhdpi_bn.png"),
  56: require("../../assets/images/avatars/faces/56_xhdpi_bn.png"),
  57: require("../../assets/images/avatars/faces/57_xhdpi_bn.png"),
  58: require("../../assets/images/avatars/faces/58_xhdpi_bn.png"),
  59: require("../../assets/images/avatars/faces/59_xhdpi_bn.png"),
  60: require("../../assets/images/avatars/faces/60_xhdpi_bn.png"),
  61: require("../../assets/images/avatars/faces/61_xhdpi_bn.png"),
  62: require("../../assets/images/avatars/faces/62_xhdpi_bn.png"),
  63: require("../../assets/images/avatars/faces/63_xhdpi_bn.png"),
  64: require("../../assets/images/avatars/faces/64_xhdpi_bn.png"),
  65: require("../../assets/images/avatars/faces/65_xhdpi_bn.png"),
  66: require("../../assets/images/avatars/faces/66_xhdpi_bn.png"),
  67: require("../../assets/images/avatars/faces/67_xhdpi_bn.png"),
  68: require("../../assets/images/avatars/faces/68_xhdpi_bn.png"),
  69: require("../../assets/images/avatars/faces/69_xhdpi_bn.png"),
  70: require("../../assets/images/avatars/faces/70_xhdpi_bn.png"),
  71: require("../../assets/images/avatars/faces/71_xhdpi_bn.png"),
  72: require("../../assets/images/avatars/faces/72_xhdpi_bn.png"),
  73: require("../../assets/images/avatars/faces/73_xhdpi_bn.png"),
};

const getProfileInfo = state => state.login.infoProfile;
const getProfileNotSave = state => state.login.infoProfileNotSave;

const getStandings = state => state.standings;

const getProfileState = createSelector(
  [getProfileInfo, getProfileNotSave],
  (infoProfile, infoProfileNotSave) => {
    console.log(infoProfile);
    return {
      ...infoProfile,
      ...infoProfileNotSave,
      city: infoProfile.city
    };
  }
);



// const getSelectedTimingState = createSelector(
//   [getStandings],
//   standings => (standings.selectedTiming ? standings.selectedTiming : "weekly")
// );

const withData = connect(state => {
  return {
    infoUserGlobalClassification: getGlobalInfoState(state),
    infoUserCityClassification: getCityInfoState(state),
    infoUserFriendsClassification: getFriendInfoState(state),
    infoUserCommunityClassification: getCommunityInfoState(state),

    selectedLeaderboard: getSelectedLeaderboardState(state),
    // selectedTiming: getSelectedTimingState(state),
    infoProfile: getProfileState(state)
  };
});

export default withData(InfoUserHome);

export const styles = StyleSheet.create({
  Container: {
    height: Dimensions.get("window").height * 0.23,
    width: Dimensions.get("window").width,
    backgroundColor: "transparent",
    position: "absolute",
    flexDirection: "column",
    justifyContent: "space-around"
  },
  gradientContainer: {
    zIndex: -2,
    position: "absolute",
    top: 0,
    width: Dimensions.get("window").width,
    height:
      Platform.OS === "ios"
        ? Dimensions.get("window").height * 0.25 + 86
        : Dimensions.get("window").height * 0.25 +
          Dimensions.get("window").height * 0.1
  },
  gradientContainerResult: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.25,
    backgroundColor: "transparent",
    top: 0
  },
  gradientContainerCurve: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.1,
    backgroundColor: "transparent",
    top: Dimensions.get("window").height * 0.25
  },
  gradientContainerImageSun: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.1,
    backgroundColor: "#fff",
    top:
      Platform.OS === "ios"
        ? Dimensions.get("window").height * 0.25 + 86
        : Dimensions.get("window").height * 0.25 +
          Dimensions.get("window").height * 0.1
  },
  gradientContainerImageBicycle: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    backgroundColor: "#fff",
    top: Dimensions.get("window").height * 0.45
  },
  gradientContainerListActivity: {
    position: "absolute",
    zIndex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    top: Dimensions.get("window").height * 0.3
  },
  gradientContainerTextContainer: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.25,
    backgroundColor: "#fff",
    top: Dimensions.get("window").height * 0.65
  },
  sunContainer: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "transparent"
  },
  centerContainer: {
    alignItems: "center",
    height: Dimensions.get("window").height * 0.1,
    justifyContent: "center"
  },
  ThreeContainer: {
    flex: 3,
    height: Dimensions.get("window").height * 0.13,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  circle: {
    width: 16,
    height: 16,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 15
  },
  leftContainer: {
    width: Dimensions.get("window").width * 0.35,
    height: Dimensions.get("window").height * 0.23,
    backgroundColor: "transparent",
    position: "absolute",
    left: Dimensions.get("window").width * 0.65,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  line: {
    width: "100%",
    height: 2,
    backgroundColor: "#fff",
    marginTop: 45
  }
});
