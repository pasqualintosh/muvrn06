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

import InfoActivityUserHome from "../../components/InfoActivityUserHome/InfoActivityUserHome";


import { strings } from "../../config/i18n";
import { getMyTeamsState } from "./../../domains/tournaments/Selectors";
import { getUniversityImg } from "./../../screens/ChooseTeamScreen/ChooseTeamScreen";

class InfoCityTournamentUserHome extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.createRef(this.view);
  }

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
   
    let userAvatar = limitAvatar(this.props.infoProfile.avatar);
    let city = this.props.infoProfile.city
      ? this.props.infoProfile.city.city_name
        ? this.props.infoProfile.city.city_name
        : ""
      : "";

    const name = this.props.infoProfile.username
      ? this.props.infoProfile.username.toUpperCase()
      : "";

    let ranking = "-";
    let numPlayer = "-";

    let typeLeaderboard = "City";
    let points = this.props.points;

    if (this.props.selectedLeaderboard == "community") {
      points = this.props.infoUserCommunityClassification.points;

      typeLeaderboard = this.props.infoProfile.community
        ? this.props.infoProfile.community.name
        : "Community";

      ranking =
        this.props.infoUserCommunityClassification.index !== "-"
          ? this.props.infoUserCommunityClassification.index + 1
          : "-";

      numPlayer =
        this.props.infoUserCommunityClassification.number !== "-"
          ? this.props.infoUserCommunityClassification.number
          : "-";
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
        this.props.infoUserCityClassification.index !== "-"
          ? this.props.infoUserCityClassification.index + 1
          : "-";

      numPlayer =
        this.props.infoUserCityClassification.number !== "-"
          ? this.props.infoUserCityClassification.number
          : "-";
    } else if (
      this.props.selectedLeaderboard == "friend" &&
      this.props.infoUserFriendsClassification
    ) {
      points = this.props.infoUserFriendsClassification.points;
      typeLeaderboard = "Friends";
      ranking =
        this.props.infoUserFriendsClassification.index !== "-"
          ? this.props.infoUserFriendsClassification.index + 1
          : "-";

      numPlayer = this.props.infoUserFriendsClassification.numFriend
        ? this.props.infoUserFriendsClassification.numFriend
        : "-";
    } else {
      points = this.props.infoUserGlobalClassification.points;
      typeLeaderboard = "World";
      ranking =
        this.props.infoUserGlobalClassification.index !== "-"
          ? this.props.infoUserGlobalClassification.index + 1
          : "-";

      numPlayer =
        this.props.infoUserGlobalClassification.number !== "-"
          ? this.props.infoUserGlobalClassification.number
          : "-";
    }

    // const myTeam = this.props.myteam.name;
    const myTeam = false;

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
                fontSize: 18,
                color: "#fff"
              }}
            >
              {name !== " ." ? name : ""}
            </Text>
            {myTeam ? (
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
                  {this.props.level.toUpperCase()}
                </Text>
              </View>
            ) : (
              <InfoActivityUserHome />
            )}
          </View>
          <View style={styles.ThreeContainer}>
            <Image
              style={{
                width: 80,
                height: 80
              }}
              source={images[userAvatar]}
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
                        {ranking}
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
                        /{numPlayer}
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
                    {typeLeaderboard}
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
                        {pointsDecimal(points)}
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

            {!myTeam ? (
              <View
                style={{
                  width: 90,
                  height: 80,

                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <OwnIcon
                  name="user_level_icn"
                  // click={() => this.DescriptionIconModal("infoTrophies")}
                  size={35}
                  color="#FFFFFF"
                />
                <Text
                  style={{
                    fontFamily: "OpenSans-Regular",
                    textAlign: "center",
                    fontSize: 12,
                    color: "white",

                    textAlignVertical: "center"
                  }}
                >
                  {this.props.level.toUpperCase()}
                </Text>
              </View>
            ) : (
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
               
                {/*
                <View
                  style={{
                    width: 90,
                    height: 80,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Image
                    source={require("../../assets/images/cities/team_live_bg_sx.png")}
                    style={{
                      width: 70,
                      height: 70,
                      position: "absolute"
                    }}
                  />
                  <Image
                    source={getUniversityImg(this.props.myteam.logo)}
                    style={{
                      width: 45,
                      height: 45
                    }}
                  /> 
                </View>
                */}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

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
    infoProfile: getProfileState(state),
    level: state.trainings.name,
    myteam: getMyTeamsState(state)
  };
});

export default withData(InfoCityTournamentUserHome);

export const styles = StyleSheet.create({
  Container: {
    height: 140,
    width: Dimensions.get("window").width,
    backgroundColor: "transparent",
    position: "absolute",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center"
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
    paddingTop: 10,
    height: 40,
    width: Dimensions.get("window").width * 0.9,
    justifyContent: "space-between",
    flexDirection: "row"
  },
  ThreeContainer: {
    width: Dimensions.get("window").width,
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
