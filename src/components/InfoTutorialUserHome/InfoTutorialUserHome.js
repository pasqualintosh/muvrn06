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
  TouchableOpacity,
  Platform
} from "react-native";
import pointsDecimal from "../../helpers/pointsDecimal";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { limitAvatar } from "./../UserItem/UserItem";
import WavyArea from "./../../components/WavyArea/WavyArea";
import LinearGradient from "react-native-linear-gradient";
import {
  getGlobalInfoState,
  getCityInfoState,
  getFriendInfoState,
  getCommunityInfoState,
  getSelectedLeaderboardState
} from "../../domains/standings/Selectors";
import {
  TournamentCities,
  citiesImage,
  imagesCity
} from "./../../components/FriendItem/FriendItem";
import { images } from "./../../components/InfoUserHome/InfoUserHome";

import OwnIcon from "../../components/OwnIcon/OwnIcon";
import ArrowImageMatch from "../../components/ArrowImageMatch/ArrowImageMatch";
import { strings } from "../../config/i18n";

class InfoTutorialUserHome extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  goToLive = () => {
    this.props.navigation.navigate("CityTournament");

    // if (this.props.match.season_match) {
    //   // se ho i dati vado nel live
    //   this.props.navigation.navigate("GameWeekTournamentBlur", {
    //     match: this.props.match,
    //     infoProfile: this.props.infoProfile
    //   });
    // } else {
    //   // altrimenti ricarico i dati
    //   if (this.props.match_id) {
    //     this.props.dispatch(
    //       getWeeklySingleMatch({
    //         match_id: this.props.match_id,
    //         saveData: this.saveMatch,
    //         start_match: this.state.start_match,
    //         currentMatch: true
    //       })
    //     );
    //   }
    // }
  };

  render() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          justifyContent: "center",
          flexDirection: "row",
          alignContent: "center"
        }}
      >
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1 }}
          locations={[0, 1.0]}
          colors={["#EA486C", "#EE6A63"]}
          style={styles.gradientContainer}
        >
          <View style={styles.Container}>
            <View style={styles.centerContainer}>
              <Text
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  textAlign: "center",
                  fontSize: 18,
                  color: "#fff"
                }}
              >
                Roberto
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <OwnIcon
                  name="user_level_icn"
                  // click={() => this.DescriptionIconModal("infoTrophies")}
                  size={20}
                  color="#FFFFFF"
                />
                <View
                  style={{
                    width: 10,
                    height: 10
                  }}
                />
                <Text
                  style={{
                    fontFamily: "OpenSans-Regular",
                    textAlign: "center",
                    fontSize: 10,
                    color: "white",

                    textAlignVertical: "center"
                  }}
                >
                  Newbie
                </Text>
              </View>
            </View>
            <View style={styles.ThreeContainer}>
              <Image
                style={{
                  width: 80,
                  height: 80
                }}
                source={images[3]}
              />
              <View
                style={{
                  width: Dimensions.get("window").width - 170,
                  height: 80,
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center"
                  // alignSelf: 'flex-start'
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center"
                    // alignSelf: 'flex-start'
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",

                      justifyContent: "center",
                      alignContent: "flex-start",
                      alignItems: "flex-start"
                      // alignSelf: 'flex-start'
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignContent: "center"
                      }}
                    >
                      <Text>
                        <Text
                          style={{
                            fontFamily: "OpenSans-Regular",
                            textAlign: "center",
                            fontSize: 22,
                            color: "white",
                            fontWeight: "bold"
                          }}
                        >
                          56
                        </Text>
                        <Text
                          style={{
                            fontFamily: "OpenSans-Regular",
                            textAlign: "center",
                            fontSize: 14,
                            //marginVertical: 8,

                            color: "white",
                            fontWeight: "bold"
                          }}
                        >
                          /338
                        </Text>
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: "OpenSans-Regular",
                        textAlign: "center",
                        fontSize: 12,
                        color: "white",
                        // fontWeight: "bold",
                        textAlignVertical: "center"
                      }}
                    >
                      World
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "column",

                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center"
                    // alignSelf: 'flex-start'
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",

                      justifyContent: "center",
                      alignContent: "flex-start",
                      alignItems: "flex-start"
                      // alignSelf: 'flex-start'
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignContent: "center"
                      }}
                    >
                      <Text>
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
                          {pointsDecimal(3458)}
                        </Text>
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontFamily: "OpenSans-Regular",
                        textAlign: "center",
                        fontSize: 12,
                        color: "white",
                        // fontWeight: "bold",
                        textAlignVertical: "center"
                      }}
                    >
                      {strings("id_1_01")}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  width: 90,
                  height: 80,

                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {/* <ArrowImageMatch city={city} /> */}

                <View
                  style={{
                    width: 90,
                    height: 80,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {/* 
                  <Image
                    source={require("../../assets/images/cities/team_live_bg_sx.png")}
                    style={{
                      width: 70,
                      height: 70,
                      position: "absolute"
                    }}
                  />
                  <Image
                    source={require("../../assets/images/Eni_logo.png")}
                    style={{
                      width: 45,
                      height: 45
                    }}
                  /> 
                  */}
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }
}

export default InfoTutorialUserHome;

export const styles = StyleSheet.create({
  Container: {
    height: 140,
    width: Dimensions.get("window").width * 0.9,
    backgroundColor: "transparent",

    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  gradientContainer: {
    width: Dimensions.get("window").width * 0.95,
    height: 140,
    borderRadius: 20,
    justifyContent: "center",
    flexDirection: "row"
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
    paddingTop: 10,
    height: 40,
    width: Dimensions.get("window").width * 0.9,
    justifyContent: "space-between",
    flexDirection: "row"
  },
  ThreeContainer: {
    width: Dimensions.get("window").width * 0.9,
    height: 90,
    flexDirection: "row",
    justifyContent: "space-between",
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
