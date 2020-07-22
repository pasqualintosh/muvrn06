import React from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  ImageBackground,
  Platform
} from "react-native";
import Modal from "react-native-modal";
import OwnIcon from "../OwnIcon/OwnIcon";
import { connect } from "react-redux";
import { sumRoute } from "../../domains/tracking/ActionCreators";
import haversine from "./../../helpers/haversine";
import pointsDecimal from "./../../helpers/pointsDecimal";
import Aux from "./../../helpers/Aux";
import { BoxShadow } from "react-native-shadow";
import { calcolatePoints } from "../../domains/tracking/Reducers";

import { images } from "../../screens/SurveyScreens/EndScreen.js";

import Svg, { Circle, Line } from "react-native-svg";

import {
  getProfile
} from "./../../domains/login/Selectors";
class TripCompleted extends React.Component {
  constructor() {
    // dimExtra ovvero allontano il pallino per chiudere un po di piu essendoci la tacca ovvero aumento il valore usato poi in top
    super();
    this.state = {
      isVisible: false,
      time: 0,
      interval: 0,
      start: null,
      opacity: 1,
      NumSegment: 0,
      totDistanceSegment: 0,
      dimExtra:
        Platform.OS === "ios" &&
        ((Dimensions.get("window").height === 812 ||
              Dimensions.get("window").width === 812) || (Dimensions.get("window").height === 896 ||
              Dimensions.get("window").width === 896) )
          ? 20
          : 0
    };
  }

  getTime = (routeAnalyzed, route, routeNotvalid) => {
    let start = Date.parse(new Date());

    if (routeAnalyzed.length > 0) {
      start = routeAnalyzed[0].key;
    } else if (route.length > 0) {
      start = route[0].key;
    } else if (routeNotvalid.length > 0) {
      start = routeNotvalid[0].key;
    }
    //console.log(start);
    this.setState({
      start
    });

    let now = Date.parse(new Date());
    let t = now - start;

    this.setState({
      time: t
    });
  };

  componentWillReceiveProps(props) {
    if (
      this.props.all.activityChoice.type !== "" &&
      props.all.activityChoice.type === "" &&
      this.props.all.route.length > 0
    ) {
      // se sono in track aspetto la transizione prima di far apparire il popup
      setTimeout(
        () =>
          this.setState({
            isVisible: true
          }),
        500
      );

      this.updateInfoTrack(this.props);
    }
  }

  updateInfoTrack = props => {
    // se cambia l'attivita allora cambio il colore
    // vedo il tipo di attivita scelta e metto il colore corrispodente alle onde e al cerchio
    // uso tre variabili per i tre colori cosi poi aggiungo l'opacita alla seconda onda
    let r;
    let g;
    let b;

    let modalSplitIndex = 0;

    switch (props.all.activityChoice.type) {
      case "Walking":
        {
          r = 108;
          g = 186;
          b = 126;
          modalSplitIndex = 0;
        }
        break;
      case "Biking":
        {
          r = 232;
          g = 52;
          b = 117;
          modalSplitIndex = 1;
        }
        break;
      case "Public":
        {
          r = 250;
          g = 178;
          b = 30;
          modalSplitIndex = 2;
        }
        break;
      default:
        {
          r = 108;
          g = 186;
          b = 126;
          modalSplitIndex = 0;
        }
        break;
    }
    const colors = [`rgba(${r}, ${g}, ${b}, 1)`, `rgba(${r}, ${g}, ${b}, 0.4)`];
    const {
      route,
      routeAnalyzed,
      routeNotvalid,
      PreviousRoute,
      totDistance
    } = props.all;

    // vedo quante sono le sottoroute, senza fare controlli di validita quindi metto true
    // cambio l'ordine dato che le ultime route sono quelle che devo controllare
    let NumSegment = this.state.NumSegment;
    console.log(NumSegment);
    if (route.length) {
      // console.log("sumsegment ");
      const routeControl = [...PreviousRoute, { route, routeAnalyzed }];
      NumSegment = sumRoute(routeControl, routeControl.length, true, false);
      // console.log("sumsegment calcolato " + NumSegment);
    }
    console.log(NumSegment);
    // vedo punti e distanza di tutte le sottotrace
    let Lastroute = route;
    let LastrouteAnalyzed = routeAnalyzed;
    let LastrouteNotvalid = routeNotvalid;
    const lengthPreviousRoute = PreviousRoute.length;
    let totPointsSegment = 0;
    let totDistanceSegment = 0;
    let totPointsSegmentValid = 0;
    console.log(lengthPreviousRoute);
    console.log(lengthPreviousRoute - NumSegment);
    for (
      index = lengthPreviousRoute;
      index > lengthPreviousRoute - NumSegment;
      index--
    ) {
      // console.log(PreviousRoute[i - 1]);
      console.log(index);
      const {
        totPoints,
        totDistance,
        route,
        routeAnalyzed,
        activityChoice,
        PrecDistanceSameMode
      } = PreviousRoute[index - 1];

      totPointsSegmentValid += totPoints ? totPoints : 0;

      let distanceSingleRoute = totDistance ? totDistance : 0;
      // calcolo la distanza che manca
      for (i = 0; i < route.length - 1; i++) {
        // haversine restituisce kilometri
        distanceSingleRoute += parseFloat(
          haversine(
            route[i].latitude,
            route[i].longitude,
            route[i + 1].latitude,
            route[i + 1].longitude
          )
        );
      }

      totPointsSegment += calcolatePoints(
        distanceSingleRoute,
        PrecDistanceSameMode,
        activityChoice.type,
        activityChoice.coef
      );
      totDistanceSegment += distanceSingleRoute;
      // console.log(totPointsRoute);
      //totDistanceRoute += totDistance;
      if (index === lengthPreviousRoute - NumSegment + 1) {
        // prendo il primo punto utile per il tempo
        Lastroute = route;
        LastrouteAnalyzed = routeAnalyzed;
      }
    }

    this.getTime(LastrouteAnalyzed, Lastroute, LastrouteNotvalid);

    // console.log("punti ");
    let totDistanceAlsoNotValid = totDistance ? totDistance : 0;
    // calcolo la distanza che manca
    for (i = 0; i < route.length - 1; i++) {
      // haversine restituisce kilometri
      totDistanceAlsoNotValid += parseFloat(
        haversine(
          route[i].latitude,
          route[i].longitude,
          route[i + 1].latitude,
          route[i + 1].longitude
        )
      );
    }

    totDistanceSegment += totDistanceAlsoNotValid;

    this.setState({
      r,
      g,
      b,
      modalSplitIndex,
      colors,
      modalSplitIndex,
      colors,
      totDistanceSegment,
      totPointsSegment,
      totPointsSegmentValid,
      NumSegment
    });
  };

  render() {
    const distanceWithComma = pointsDecimal(
      parseFloat(this.state.totDistanceSegment).toFixed(2),
      ","
    );

    let time = this.state.time / 60000; // minuti

    time = parseInt(time);

    const width = Dimensions.get("window").width;
    let avatarId = 1;
    if (
      this.props.infoProfile.avatar <= 48 &&
      this.props.infoProfile.avatar > 0
    )
      avatarId = this.props.infoProfile.avatar;
    return (
      <View>
        <Modal
          isVisible={this.state.isVisible}
          onSwipe={() => this.setState({ isVisible: false })}
          swipeDirection="left"
          style={{
            padding: 0,
            margin: 0,
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height
          }}
          backdropOpacity={1}
        >
          <ImageBackground
            source={require("../../assets/images/profile_card_bg.png")}
            style={styles.sfondo}
          >
            {Platform.OS == "android" ? (
              <BoxShadow
                setting={{
                  height: 40,
                  width: 40,
                  color: "#111",
                  border: 8,
                  radius: 20,
                  opacity: 0.35,
                  x: 0,
                  y: 3,
                  style: {
                    marginVertical: 0,
                    position: "absolute",
                    top: 30,
                    right: 30
                  }
                }}
              />
            ) : (
              <View />
            )}
            <View
              style={{
                position: "absolute",
                shadowRadius: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.5,
                backgroundColor: "transparent",

                top: 30 + this.state.dimExtra,
                right: 30
              }}
            >
              <Svg height="40" width="40">
                <Circle
                  cx="20"
                  cy="20"
                  r="20"
                  fill="white"
                  onPress={() => this.setState({ isVisible: false })}
                />
                {Platform.OS !== "android" ? (
                  <OwnIcon
                    style={{
                      alignContent: "center",
                      alignSelf: "center",
                      alignItems: "center",
                      position: "relative",
                      flexDirection: "column",
                      paddingTop: 5
                    }}
                    name="modal_close_icn"
                    size={30}
                    color="#3D3D3D"
                    click={() => this.setState({ isVisible: false })}
                  />
                ) : (
                  <View />
                )}
              </Svg>
            </View>

            {Platform.OS == "android" ? (
              <Aux>
                <OwnIcon
                  style={{
                    position: "absolute",
                    backgroundColor: "transparent",

                    top: 35,
                    right: 35
                  }}
                  name="modal_close_icn"
                  size={30}
                  color="#3D3D3D"
                  click={() => this.setState({ isVisible: false })}
                />
              </Aux>
            ) : (
              <View />
            )}
            <View
              style={{
                top: 80,
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-around",
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height - 80
              }}
            >
              <Text
                style={{
                  alignSelf: "center",

                  textAlign: "center",
                  color: "#FFFFFF",
                  fontFamily: "Montserrat-ExtraBold",
                  fontSize: 25
                }}
              >
                {" "}
                TRIP COMPLETED!{" "}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignSelf: "center",
                  alignItems: "center"
                }}
              >
                <OwnIcon
                  style={{
                    position: "relative",
                    top: 50,
                    right: -30
                  }}
                  name="ole_left"
                  size={120}
                  color="#E6332A"
                />
                <Image
                  style={{
                    width: 214,
                    height: 350,
                    alignSelf: "center"
                  }}
                  // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
                  source={images[avatarId]}
                />
                <OwnIcon
                  style={{
                    position: "relative",
                    top: -50,
                    right: 30
                  }}
                  name="ole_right"
                  size={100}
                  color="#F39200"
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width: Dimensions.get("window").width,
                  height: Dimensions.get("window").height / 12,
                  marginTop: -10
                }}
              >
                <View
                  style={{
                    flex: 1,
                    height: Dimensions.get("window").height / 12
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",

                      fontFamily: "OpenSans-ExtraBold",
                      color: "#fff",
                      fontSize: 18,
                      marginVertical: 1,
                      fontWeight: "bold"
                    }}
                  >
                    TIME
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",

                      fontFamily: "OpenSans-Regular",
                      fontWeight: "400",
                      color: "#fff",
                      fontSize: 14,
                      marginVertical: 1
                    }}
                  >
                    {time} min
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    height: Dimensions.get("window").height / 12
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",

                      fontFamily: "OpenSans-ExtraBold",
                      color: "#fff",
                      fontSize: 18,
                      marginVertical: 1,
                      fontWeight: "bold"
                    }}
                  >
                    DISTANCE
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",

                      fontFamily: "OpenSans-Regular",
                      fontWeight: "400",
                      color: "#fff",
                      fontSize: 14,
                      marginVertical: 1
                    }}
                  >
                    {distanceWithComma.substr(0, distanceWithComma.length - 2)}{" "}
                    Km
                  </Text>
                </View>
              </View>
              <Svg height="100" width={width}>
                <Line
                  x1="25"
                  y1="0"
                  x2={width - 25}
                  y2="0"
                  stroke="#9D9B9C"
                  strokeWidth="2"
                />
              </Svg>
            </View>
          </ImageBackground>
        </Modal>
      </View>
    );
  }
}

const styles = {
  view: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 10
  },
  sfondo: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "#3D3D3D"
  }
};

// se non specificato
TripCompleted.defaultProps = {
  time: "21",
  distance: "2,4"
};



const RecapUser = connect(state => {
  return {
    all: state.tracking,
    infoProfile: getProfile(state)
  };
});

export default RecapUser(TripCompleted);
