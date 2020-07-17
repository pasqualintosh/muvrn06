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
import { TournamentCities } from "./../../components/FriendItem/FriendItem";

import OwnIcon from "../../components/OwnIcon/OwnIcon";

class InfoCityTournamentHomePadding extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  goToLive = () => {
    // quando è attivo il torneo 
    this.props.navigation.navigate("GameWeekTournamentBlur", { infoProfile: this.props.infoProfile});
    // quando è disattivato il torneo 
    // this.props.navigation.navigate("Tournament", { infoProfile: this.props.infoProfile});

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

  moveProfile = () => {
    // this.props.dispatch(changeScreenProfile("myself"));
    // this.props.navigation.navigate("Profile");

    this.props.navigation.navigate("ChangeAvatarScreen", {
      avatar: this.props.infoProfile.avatar
    });
  };

  moveTrainings = () => {
    // this.props.dispatch(changeScreenProfile("myself"));
    // this.props.navigation.navigate("Profile");

    this.props.navigation.navigate("Trainings");
  };

  moveRanking = () => {
    // const TypeRanking = "global";
    
    this.props.navigation.navigate("StandingsScreen");
  };

  moveSettings = () => {
    this.props.navigation.navigate("PersonalDataScreenBlur");
  };

  render() {
    let city = this.props.infoProfile.city
      ? this.props.infoProfile.city.city_name
        ? this.props.infoProfile.city.city_name
        : ""
      : "";

    const cityInTournament = TournamentCities(city);

    const name = this.props.infoProfile.first_name
    ? this.props.infoProfile.first_name.toUpperCase() +
      " " +
      this.props.infoProfile.last_name.charAt(0).toUpperCase() +
      "."
    : "";

    return (
      <View style={styles.Container}>
        <View style={styles.centerContainer}>
        <TouchableOpacity
            disabled={this.props.ValueBlur ? true : false}
            style={{
              opacity: 0,
              height: 40,
            }}
            onPress={this.moveSettings}
          >
            <View  style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                 
                  height: 40,
                }}>
          <Text
            style={{
              fontFamily: "Montserrat-ExtraBold",
              textAlign: "center",
              fontSize: 18,
              color: "#fff",
              
            }}
          >
             {name !== " ." ? name : ""}
          </Text>
          </View>
          </TouchableOpacity>
          {cityInTournament ? (
            <TouchableOpacity disabled={this.props.ValueBlur ? true : false}  onPress={this.moveTrainings}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: 0
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
                  NewBie
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
        <View style={styles.ThreeContainer}>
          <TouchableOpacity
          onPress={this.moveProfile}
         
          
            disabled={this.props.ValueBlur ? true : false}
            style={{
              width: 80,
              height: 80
            }}
          >
            <View
              style={{
                width: 80,
                height: 80
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
           onPress={this.moveRanking}
            disabled={this.props.ValueBlur ? true : false}
            
          >
            <View
              style={{
              flexDirection: "column",
              width: Dimensions.get("window").width - 170,
              flex: 1,
                flexDirection: "row",
              height: 80,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              
              
              // alignSelf: 'flex-start'
            }}
            />
          </TouchableOpacity>
          
          {!cityInTournament ? (
            <TouchableOpacity disabled={this.props.ValueBlur ? true : false}  onPress={this.moveTrainings}>
             
            <View
              style={{
                width: 90,
                height: 80,
                paddingTop: 8,

                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                opacity: 0
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
                Newbie
              </Text>
            </View>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                width: 90,
                height: 80,
                paddingTop: 8,

                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
            <TouchableOpacity
                disabled={this.props.ValueBlur ? true : false}
                onPress={() => this.goToLive()}
                style={{
                  width: 90,
                height: 80,
                paddingTop: 8,
                
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
                }}
              ></TouchableOpacity>
              {/* <TouchableOpacity
                disabled={this.props.ValueBlur ? true : false}
                onPress={() => this.goToLive()}
                style={{
                  width: 50,
                  height: 30,
                  borderRadius: 5,
                  alignItems: "center",
                  opacity: 0
                }}
              >
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text
                    style={{
                      // margin: 10,
                      color: "#FFFFFF",
                      fontFamily: "OpenSans-Regular",

                      fontSize: 14
                    }}
                  >
                    Live
                  </Text>
                </View>
              </TouchableOpacity> */}
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default InfoCityTournamentHomePadding;

export const styles = StyleSheet.create({
  Container: {
    height: 140,
    width: Dimensions.get("window").width,
    backgroundColor: "transparent",
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
