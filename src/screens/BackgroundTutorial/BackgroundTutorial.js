import React from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
  ImageBackground,
  Animated,
  AsyncStorage,
  NativeModules,
  Alert,
  StatusBar,
  Image
} from "react-native";
import { StackedAreaChart } from "react-native-svg-charts";
import { connect } from "react-redux";
import * as shape from "d3-shape";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import { sumRoute } from "../../domains/tracking/ActionCreators";
import WaveAnimation from "../../components/WaveAnimation/WaveAnimation";
import IntermittentPointer from "../../components/IntermittentPointer/IntermittentPointer";
import haversine from "./../../helpers/haversine";
import pointsDecimal from "./../../helpers/pointsDecimal";
import { calcolatePoints } from "../../domains/tracking/Reducers";
import { completeTutorial } from "../../domains/login/ActionCreators.js";
import AnimateNumber from "react-native-animate-number";
import { BoxShadow } from "react-native-shadow";
import { createSelector } from "reselect";

import DescriptionIcon from "../../components/DescriptionIcon/DescriptionIcon";


import Svg, { Circle } from "react-native-svg";

import InteractionManager from "../../helpers/loadingComponent";
import LinearGradient from "react-native-linear-gradient";
import { thisExpression } from "@babel/types";
import Aux from "../../helpers/Aux";

import BlurOverlay, {
  closeOverlay,
  openOverlay
} from "react-native-blur-overlay";
import TrackGuide from "../../components/TrackGuide/TrackGuide";
import ButtonPlayOrStopGuide from "../../components/ButtonPlayOrStopGuide/ButtonPlayOrStopGuide";
import ButtonStopGuide from "../../components/ButtonStopGuide/ButtonStopGuide";

class BackgroundTutorial extends React.Component {
  constructor(props) {
    super(props);

    this.setAnim = this.setAnim.bind(this);

    this.state = {

      clickDebug: 0,
      modalActive: false,
      iconChoose: null,
      load: false,
      firstCurveData: [
        {
          value: 1
        },
        {
          value: 2
        },
        {
          value: 3
        },
        {
          value: 2
        },
        {
          value: 1
        },
        {
          value: 1
        }
      ],
      firstCurveDataAnimated: [
        {
          value: 1.2
        },
        {
          value: 2.15
        },
        {
          value: 3
        },
        {
          value: 2.2
        },
        {
          value: 1.1
        },
        {
          value: 0.85
        }
      ],
      secondCurveData: [
        {
          value: 0
        },
        {
          value: 1
        },
        {
          value: 1.2
        },
        {
          value: 1.8
        },
        {
          value: 2.5
        },
        {
          value: 3
        }
      ],
      animationLoop: 5,
      curvyWidth: Dimensions.get("window").width * 2 * 5,
      curvyLeft: -Dimensions.get("window").width * 0.75 * 5,
      time: 0,
      interval: 0,
      start: null,
      progress: new Animated.Value(0),
      opacity: 1,
      NumSegment: 0,
      data: [
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
          apples: 640,
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
      ],
      keys1: ["dates"],
      keys: ["bananas", "cherries"],
      totDistanceAlsoNotValid: 0,
      totPointsRoute: 0,
      totPointsAlsoNotValid: 0,
      totPointsSegment: 0,
      totDistanceSegment: 0,
      totPointsSegmentValid: 0,
      hoursTraffic: false,
      pointsLive: 0
    };
  }

  clickBack = () => {
    this.props.navigation.goBack();
  };

  _storeData = async time => {
    try {
      const start = Date.parse(time);
      // console.log(start);
      await AsyncStorage.setItem("time", time.toString());
      let hour = new Date(start).toTimeString();
      hour = hour.substring(0, 5);
      // ottengo 11:30
      console.log(hour);
      let hoursTraffic = false;
      if (hour >= "07:30" && hour <= "09:00") {
        hoursTraffic = true;
      } else if (hour >= "17:00" && hour <= "18:30") {
        hoursTraffic = true;
      }

      this.setState({
        start,
        hoursTraffic: hoursTraffic
      });
    } catch (error) {
      // Error saving data
    }
  };

  setAnim(anim) {
    this.anim = anim;
    this.setState({ anim: anim });
    //if (this.anim) this.anim.play();
  }

  // calcolo i minuti che sono passati nell'attivita
  // prendo la prima coordinata catturata e da li la data iniziale
  // poi calcolo la data corrente e poi la differenza con la prima data
  // converto in minuti e ritorno il valore ottenuto
  // potrebbe sbagliare di qualche secondo ma Ã¨ accettabile

  getMinutes = (routeAnalyzed, route, routeNotvalid) => {
    let t = 0;
    let now = Date.parse(new Date());
    if (routeAnalyzed.length > 0) {
      t = now - routeAnalyzed[0].key;
    } else if (route.length > 0) {
      t = now - route[0].key;
    } else if (routeNotvalid.length > 0) {
      t = now - routeNotvalid[0].key;
    }

    // let min = Math.round((t / 1000 / 60) % 60);
    // let sec = Math.round(t / 1000 / 60);

    return new Date(t);
  };

  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     headerTitle: (
  //       <Text
  //         style={{
  //           left: Platform.OS == "android" ? 20 : 0
  //         }}
  //       >
  //         {" "}
  //         Track{" "}
  //       </Text>
  //     )
  //   };
  // };

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    
    setTimeout(() => {
      openOverlay();
    }, 400);


    // setTimeout(() => {
    //   // controllo se è spuntata il testo altrimenti vado avanti nella home 
    //   if (!this.state.modalActive) {
    //     // se la modale non funziona vai alla home
    //     closeOverlay();
    // this.props.dispatch(completeTutorial("tutorialStart"));

    //   }
    // }, 5000);
  }

  updateModal = () => {
    this.setState({
      modalActive: true
    })
  }


  updateColorSegment = props => {
    let r;
    let g;
    let b;

    let modalSplitIndex = 0;

    switch (props.activityChoice.type) {
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
        if (props.activityChoice.coef === 800) {
          r = 250;
          g = 178;
          b = 30;
          modalSplitIndex = 2;
        } else if (props.activityChoice.coef === 1200) {
          r = 250;
          g = 178;
          b = 30;
          modalSplitIndex = 4;
        } else {
          r = 250;
          g = 178;
          b = 30;
          modalSplitIndex = 3;
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
    this.setState({
      r,
      g,
      b,
      modalSplitIndex,
      colors
    });
  };

  updateLiveCorrentSegment = props => {
    let r;
    let g;
    let b;

    let modalSplitIndex = 0;

    switch (props.activityChoice.type) {
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
        if (props.activityChoice.coef === 800) {
          r = 250;
          g = 178;
          b = 30;
          modalSplitIndex = 2;
        } else if (props.activityChoice.coef === 1200) {
          r = 250;
          g = 178;
          b = 30;
          modalSplitIndex = 4;
        } else {
          r = 250;
          g = 178;
          b = 30;
          modalSplitIndex = 3;
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

    // console.log(Dimensions.get("window").width / 2 + 30); -> 235.71428571428572

    // dati per le onde

    // mettere alla fine bottom: 0 in StackedAreaChart
    // i colori li passo come props

    // prendo i dati per fare il recap
    const {
      totPoints,
      totDistance,
      route,
      PrecDistanceSameMode,
      activityChoice,
      routeNotvalid,
      routeAnalyzed
    } = props;

    // console.log("punti ");
    let totDistanceAlsoNotValid = totDistance ? totDistance : 0.0;
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
    let totPointsAlsoNotValid = 0;
    totPointsAlsoNotValid = calcolatePoints(
      totDistanceAlsoNotValid,
      PrecDistanceSameMode,
      activityChoice.type, activityChoice.coef
    );

    let totPointsRoute = totPoints ? totPoints : 0;

    //let totDistanceRoute = totDistance;

    // * 3.6 per convertire da m/s a km/h
    /* const speed =
      route.length > 0 && route[route.length - 1].speed
        ? route[route.length - 1].speed * 3.6
        : routeNotvalid.length > 0 &&
          routeNotvalid[routeNotvalid.length - 1].speed
          ? routeNotvalid[routeNotvalid.length - 1].speed * 3.6
          : 0.0; */

    this.setState({
      r,
      g,
      b,
      modalSplitIndex,
      colors,
      totDistanceAlsoNotValid,
      totPointsRoute,
      totPointsAlsoNotValid
    });
  };

  updateInfoTrack = props => {
    // se cambia l'attivita allora cambio il colore
    // vedo il tipo di attivita scelta e metto il colore corrispodente alle onde e al cerchio
    // uso tre variabili per i tre colori cosi poi aggiungo l'opacita alla seconda onda

    const { route, routeAnalyzed, PreviousRoute } = props;

    let NumSegment = this.state.NumSegment;

    if (route.length) {
      // console.log("sumsegment ");
      const routeControl = [...PreviousRoute, { route, routeAnalyzed }];
      NumSegment = sumRoute(routeControl, routeControl.length, true, false);
      // console.log("sumsegment calcolato " + NumSegment);
    }
    console.log(NumSegment);
    const lengthPreviousRoute = PreviousRoute.length;
    let totPointsSegment = 0;
    let totDistanceSegment = 0;

    for (
      index = lengthPreviousRoute;
      index > lengthPreviousRoute - NumSegment;
      index--
    ) {
      const {
        distanceLive,
        PrecDistanceSameMode,
        activityChoice
      } = PreviousRoute[index - 1];

      totPointsSegment += calcolatePoints(
        distanceLive,
        PrecDistanceSameMode,
        activityChoice.type, activityChoice.coef
      );
      totDistanceSegment += distanceLive;
    }

    this.setState({
      totDistanceSegment,
      totPointsSegment,
      NumSegment
    });
  };

  moveWave = () => {
    this.box.moveX(20, { duration: 3000 }).start();
  };

  // variabile per il timer
  Timer = null;

  componentWillUnmount() {
   
    if (this.timeoutId) clearTimeout(this.timeoutId);
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
    /*  this.setState({
      start
    });
 */
    /* let now = Date.parse(new Date());
    let t = now - start;

    this.setState({
      time: t
    });
 */
    // this.updateCurrentTime(start);
  };

  updateCurrentTime(start) {
    const now = new Date();
    const t = now - start;

    this.setState({ time: t });
    this.timeoutId = setTimeout(this.updateCurrentTime.bind(this, start), 1000);
  }

  updateCurrentTimeAnimation() {
    const now = Date.parse(new Date());
    const t = now - this.state.start;

    this.setState({ time: t });
  }

  onLottieLoad = () => {
    //console.log("play lottie");
    this.animation.play();
  };

  playGame = () => {
    this.props.navigation.navigate("BasketBallScreen");
  };

  renderModalSplitImage(index, points, bg) {
    return (
      <View style={{ marginTop: 50 }}>
        <ImageBackground
          style={styles.circle6}
          source={modalSplitImage[index]}
          resizeMode={"contain"}
        >
          <View style={styles.liveTextView}>
            <Text style={styles.liveText}>LIVE</Text>
            {/* 
            <View
              style={[
                styles.livePointer,
                { backgroundColor: bg, opacity: this.state.opacity }
              ]}
            /> 
            */}
            <IntermittentPointer
              styles={[
                styles.livePointer,
                { backgroundColor: bg, opacity: this.state.opacity }
              ]}
              updateCurrentTimeAnimation={() =>
                this.updateCurrentTimeAnimation()
              }
            />
          </View>
          <View style={styles.pointsTextView}>
            <View
              style={{
                flexDirection: "row",
                alignContent: "flex-start",
                justifyContent: "center"
              }}
            >
              <View
                style={{
                  height: 50,
                  width: 30,
                  flexDirection: "column",
                  alignContent: "center",
                  justifyContent: "flex-start"
                }}
              />
              {points ? (
                <Text style={styles.point}>
                  <AnimateNumber
                    interval={60}
                    steps={100}
                    value={points ? points.toFixed(0) : 0}
                    countBy={1}
                    timing="linear"
                  />
                </Text>
              ) : (
                <View
                  style={{
                    height: 50,
                    width: 40,
                    flexDirection: "column",
                    alignContent: "center",
                    justifyContent: "center"
                  }}
                >
                  <Image
                    source={require("../../assets/images/puntini_big.gif")}
                    style={{
                      height: 25,
                      width: 40
                    }}
                  />
                </View>
              )}
              {/* <Text style={styles.point}>{points.toFixed(0)}</Text> */}
              <View
                style={{
                  height: 50,
                  width: 30,
                  flexDirection: "column",
                  alignContent: "center",
                  justifyContent: "flex-start"
                }}
              >
                <Text style={styles.ptText}>pt</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  renderBlurChildsPlay() {
    return <ButtonPlayOrStopGuide closeTutorial={this.closeTutorial} updateModal={this.updateModal} />;
  }

  renderBlurChildsLive() {
    return <TrackGuide closeTutorial={this.closeTutorial} />;
  }

  renderBlurChildsStop() {
    return <ButtonStopGuide closeTutorial={this.closeTutorial} />;
  }

  closeTutorial = () => {
    closeOverlay();
    this.props.dispatch(completeTutorial("tutorialStart"));
  };

  render() {
    // se si fa click su boxshadow l'app crash quindi ho messo una view piu grande di sopra in modo tale che non è cliccabile

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "space-around",
          flexDirection: "column",
          backgroundColor: "#F7F8F9"
        }}
      >
        <StatusBar backgroundColor="white" barStyle="dark-content" />

        <StackedAreaChart
          style={{
            height: 200,
            width: Dimensions.get("window").width,
            position: "absolute",
            top: -50
          }}
          data={this.state.data}
          keys={this.state.keys1}
          colors={[`rgba(118,97,167, 1)`, `rgba(118,97,167, 0.4)`]}
          curve={shape.curveNatural}
          showGrid={false}
        />

        <StackedAreaChart
          style={{
            height: 200,
            width: Dimensions.get("window").width,
            position: "absolute",
            top: Dimensions.get("window").height - 200
          }}
          data={this.state.data}
          keys={this.state.keys}
          colors={[`rgba(118,97,167, 1)`, `rgba(118,97,167, 0.4)`]}
          curve={shape.curveNatural}
          showGrid={false}
        />
        <BlurOverlay
          radius={14}
          downsampling={2}
          brightness={-150}
          // customStyles={{alignItems: 'center', justifyContent: 'center'}}
          blurStyle="dark"
          children={this.renderBlurChildsPlay()}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },

  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  button: {
    backgroundColor: "#a1a1a1"
  },
  listItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
    padding: 20
  },
  circle6: {
    width: Dimensions.get("window").width / 2 + 60,
    height: Dimensions.get("window").width / 2 + 60,
    borderRadius: Dimensions.get("window").width / 2,
    justifyContent: "center",
    alignSelf: "center"
    // backgroundColor: "#33e"
  },
  Joystick: {
    width: Dimensions.get("window").width * 0.35,
    height: Dimensions.get("window").width * 0.35,

    justifyContent: "center",
    alignSelf: "center"
  },
  circle: {
    width: Dimensions.get("window").width / 2 + 30,
    height: Dimensions.get("window").width / 2 + 30,
    borderRadius: Dimensions.get("window").width / 2 + 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 5,
    backgroundColor: "transparent"
  },
  liveTextView: {
    flex: 0.25,
    justifyContent: "flex-end",
    alignItems: "center"
    // backgroundColor: "#3e3"
    // height: 30
  },
  pointsTextView: {
    flex: 0.5,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
    // backgroundColor: "#e33"
    // alignSelf: "center",
    // height: 60
  },
  textBasket: {
    fontFamily: "OpenSans-Extrabold",
    fontWeight: "bold",
    fontSize: 12,
    color: "#3d3d3d",
    alignSelf: "center",
    textAlign: "left"
  },
  point: {
    fontFamily: "OpenSans-Regular",
    fontSize: 43,
    color: "#3d3d3d",
    alignSelf: "center",
    textAlign: "center"
  },
  ptText: {
    fontFamily: "OpenSans-Extrabold",
    fontWeight: "bold",
    fontSize: 17,
    color: "#3d3d3d",
    alignSelf: "center",
    textAlign: "center"
    // marginTop: 12
    // paddingBottom: 21
  },
  liveText: {
    fontFamily: "Montserrat-ExtraBold",

    fontSize: 14,
    color: "#3d3d3d",
    textAlign: "center",
    textAlignVertical: "center"
    // marginBottom: 40
  },
  livePointer: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: "#3d3d3d",
    position: "relative",
    bottom: 18,
    left: 21
  },
  livePointerOpacity: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: "#3d3d3d",
    position: "absolute",
    // bottom: 18,
    // left: 21
    top: -20
  },
  routeParametersLabel: {
    fontFamily: "OpenSans-ExtraBold",
    fontWeight: "bold",
    color: "#3D3D3D",
    fontSize: 14,
    textAlign: "center"
  },
  routeParametersValue: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "600",
    color: "#3D3D3D",
    fontSize: 20,
    textAlign: "center"
  },
  routeParametersValueWithPercantuale: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3D3D3D",
    fontSize: 15,
    textAlign: "center"
  }
};

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    circle6: {
      width: Dimensions.get("window").width / 4 + 60,
      height: Dimensions.get("window").width / 4 + 60,
      borderRadius: Dimensions.get("window").width / 4,
      justifyContent: "center",
      alignSelf: "center"
      // backgroundColor: "#33e"
    }
  });
}

const tutorial = connect();

export default tutorial(BackgroundTutorial);
