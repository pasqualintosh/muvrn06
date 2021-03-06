/**
 * scena per il riassunto dei dati dell'utente
 * @author push
 */

import React from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  RefreshControl,
  Image,
} from "react-native";
import { connect } from "react-redux";
import { Tester } from "./../../config/Tester";
import {
  postMostFrequentRouteNotSave,
  UpdateProfile,
  deleteMostFrequentRoute,
  getMostFrequentRoute,
} from "./../../domains/login/ActionCreators";

import Icon from "react-native-vector-icons/Ionicons";
import Svg, {
  Circle,
  LinearGradient,
  Line,
  Defs,
  Stop,
} from "react-native-svg";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";
import {
  frequentTripsState,
  frequentTripsNotSaveState,
} from "./../../domains/login/Selectors.js";
import { strings } from "../../config/i18n";
import EmptyTournament from "../EmptyTournament/EmptyTournament";
import TournamentContainer from "./../../components/TournamentContainer/TournamentContainer";
import DetailTournamentScreen from "../DetailTournamentScreen/DetailTournamentScreen";
import ChooseTeamScreen from "../ChooseTeamScreen/ChooseTeamScreen";

import { getAllowedTournamentsState } from "../../domains/tournaments/Selectors";
import { getTournaments } from "../../domains/tournaments/ActionCreators";

const type = [
  strings("other"),
  strings("home"),
  strings("work"),
  strings("school_universi"),
  // strings("gym"),
  // strings("work__2"),
  // strings("mom_dad"),
  // strings("grandma_grandpa"),
  // strings("girlfriend_boyf"),
  // strings("kids__school"),
  // strings("friend_s_place"),
  // strings("supermarket"),
  // strings("bar_restaurant"),
  // strings("cinema_theater")
];

import analytics from "@react-native-firebase/analytics";
async function trackEvent(event, data) {
  await analytics().logEvent(event, { data });
}

class TournamentsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      isModalVisible: false,
      isModalVisibleWeight: false,
      load: true,
      data: {},
    };
  }

  componentWillMount() {
    // setTimeout(() => {
    //   if (this.props.routine.length == 0) {
    //     this.props.navigation.navigate("ChangeFrequentTripScreen");
    //     return 1;
    //   }
    // }, 1000);
  }

  componentDidMount() {
    this.props.dispatch(getTournaments());
  }

  componentWillUnmount() {
    console.log("aggiornamento dati ");
  }

  // metodo per cambiare il parametro specificato in type con il valore value nello stato
  // salvo anche i dati da inviare cosi so che sono nuovi
  // callback, metodo per adattare il formato adatto al db
  changeState = (value, type, callback) => {
    console.log(value);
    console.log(callback);
    callback && typeof callback === "function"
      ? console.log(callback(value))
      : console.log(value);
    this.setState((prevState) => {
      return {
        [type]: value,
        data: {
          ...prevState.data,
          [type]:
            callback && typeof callback === "function"
              ? callback(value)
              : value,
        },
      };
    });
  };

  goToDetailFrequentRoutine = (elem) => {
    this.props.navigation.navigate("FrequentRoutineMapDetail", {
      routine: elem,
    });
  };

  addFrequent() {
    trackEvent("add_frequent_trip", "User interactions");
    return (
      <View style={styles.centerView}>
        <View style={styles.Addspace}></View>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("ChangeFrequentTripScreen", {
              routine: null,
            });
          }}
        >
          <Image
            source={require("./../../assets/images/add_blue_icn.png")}
            style={styles.buttonImageStyle}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderDeleteBtn(index, id) {
    const numFrequentTrips = this.props.routine.length;
    // al momento il tasto x non c'e
    if (numFrequentTrips > 1)
      return (
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 15,
          }}
        >
          <TouchableHighlight
            style={{
              backgroundColor: "#fff",
              height: 18,
              width: 18,
              borderRadius: 15,
              alignItems: "center",
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              elevation: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              Alert.alert(
                strings("frequent_trip"),
                strings("delete_this_fre"),
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: strings("id_0_12").toLocaleUpperCase(),
                    onPress: () =>
                      this.props.dispatch(deleteMostFrequentRoute({}, id)),
                  },
                ],
                { cancelable: false }
              );
            }}
          >
            <OwnIcon name="delete_icn" size={18} color="#FC6754" />
            {/* <Svg height="18" width="18" viewBox="0 0 100 100" fill="white">
              <Line
                x1="30"
                y1="30"
                x2="70"
                y2="70"
                stroke="white"
                strokeWidth="2"
              />
              <Line
                x1="70"
                y1="30"
                x2="30"
                y2="70"
                stroke="white"
                strokeWidth="2"
              />
            </Svg> */}
          </TouchableHighlight>
        </View>
      );
    else
      return (
        <View
          style={{
            width: 18,
            height: 18,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
            right: -5,
            borderRadius: 1,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0.01 },
            shadowOpacity: 0.2,
          }}
        />
      );
  }

  onRefresh = () => {
    this.props.dispatch(getTournaments());
  };

  visualizeTournament = () => {
    const tournaments = this.props.tournaments;
    return (
      <View
        style={{
          backgroundColor: "#fff",
        }}
      >
        <ScrollView
          style={{
            backgroundColor: "#fff",
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width,
          }}
        >
          <View style={styles.subView}>
            <Text style={styles.textLeftTitle}>AVAILABLE TOURNAMENTS</Text>
          </View>

          {this.state.load ? (
            <View>
              {tournaments.map((elem, index) => (
                <View key={elem.id} style={styles.availableChallengesContainer}>
                  <View style={styles.marginContainer} />
                  <TournamentContainer
                    navigation={this.props.navigation}
                    active={true}
                    // name={type[elem.start_type] + "<>" + type[elem.end_type]}
                    name={elem.name}
                    challenge={elem.item}
                    elem={elem}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View />
          )}

          <View style={{ height: 300 }} />
        </ScrollView>
      </View>
    );
  };
  render() {
    const tournaments = this.props.tournaments;

    // return <EmptyTournament />
    // ho frequent trips
    if (tournaments.length) {
      return this.visualizeTournament();
    } else {
      return <EmptyTournament />;
    }
  }
}

const withData = connect((state) => {
  // prendo solo le routine
  return {
    tournaments: getAllowedTournamentsState(state),
  };
});

export default withData(TournamentsScreen);

const styles = StyleSheet.create({
  marginContainer: { marginTop: 20 },
  availableChallengesContainer: {
    width: Dimensions.get("window").width,
    alignSelf: "center",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  textLeftTitle: {
    fontFamily: "Montserrat-ExtraBold",
    fontSize: 16,
    textAlign: "left",
    color: "#3D3D3D",
  },
  textTitle: {
    fontFamily: "Montserrat-ExtraBold",
    fontSize: 30,
    textAlign: "center",
    color: "#3D3D3D",
  },
  textSubTitle: {
    paddingTop: 10,
    fontFamily: "OpenSans-Regular",
    fontSize: 15,
    textAlign: "center",
    color: "#3D3D3D",
  },
  imageLogo: {
    width: Dimensions.get("window").width * 0.6,
    height: Dimensions.get("window").width * 0.6,
  },
  buttonImageStyle: {
    width: 50,
    height: 50,
  },
  centerView: {
    width: Dimensions.get("window").width,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  space: {
    height: Dimensions.get("window").width * 0.15,
  },
  Addspace: {
    height: Dimensions.get("window").width * 0.1,
  },

  subView: {
    width: Dimensions.get("window").width * 0.9,
    paddingTop: 15,
    alignSelf: "center",
  },
  allView: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  first: {
    flex: 1,
    height:
      Dimensions.get("window").height * 0.1 > 100
        ? Dimensions.get("window").height * 0.1
        : 100,
    flexDirection: "row",
    borderTopColor: "#5F5F5F",
    borderTopWidth: 0.3,
    backgroundColor: "#fff",
  },
  other: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderTopColor: "#5F5F5F",
    borderTopWidth: 0.3,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center",
  },
  last: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderTopColor: "#5F5F5F",
    borderTopWidth: 0.3,
  },
  LeftFrequentRoute: {
    fontSize: 15,
    fontWeight: "bold",
  },
  Left: {
    alignSelf: "center",
    textAlignVertical: "center",
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
    left: 20,
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D",
  },
  Right: {
    marginHorizontal: 7,
    fontSize: 13,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D",
  },
  RightAndroid: {
    alignSelf: "center",
    right: 10,
  },
  RightText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D",
  },
  centerTextContainer: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.1 + 190,
  },
  centerValue: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 37,
    textAlign: "center",
    textAlignVertical: "center",
  },
  centerTextParam: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#9D9B9C",
    fontSize: 9,
    fontWeight: "bold",
  },
  iconText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 10,
    textAlignVertical: "center",
  },
  mfrText: {
    fontFamily: "OpenSans-Bold",
    marginRight: 0,
    fontWeight: "bold",
    color: "#3D3D3D",
    fontSize: 12,
    textAlign: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,

    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  modalContentAndroid: {
    width: 120,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
});
