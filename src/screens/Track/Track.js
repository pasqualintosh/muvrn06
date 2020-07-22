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
import {
  calcolatePoints,
  calcolatePointsFake
} from "../../domains/tracking/Reducers";
import AnimateNumber from "react-native-animate-number";
import { BoxShadow } from "react-native-shadow";
import { createSelector } from "reselect";

import { getTutorialMetroState } from "../../domains/login/Selectors";
import { completeTutorial } from "../../domains/login/ActionCreators.js";

import DescriptionIcon from "../../components/DescriptionIcon/DescriptionIcon";



import Svg, { Circle } from "react-native-svg";

import InteractionManager from "../../helpers/loadingComponent";
import LinearGradient from "react-native-linear-gradient";
import { thisExpression } from "@babel/types";
import Aux from "../../helpers/Aux";

import Settings from "./../../config/Settings";

import {
  getsubTripState,
  getDistanceLiveState,
  getActivityState,
  getNumSubTripState
} from "./../../domains/tracking/Selectors";

import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from "react-native-google-analytics-bridge";

import { strings } from "../../config/i18n";
import { getDevice } from "../../helpers/deviceInfo"

import analytics from "@react-native-firebase/analytics";
import { store } from "../../store";
async function trackScreenView(screen) {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
}

let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.clickBack = this.clickBack.bind(this);
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
      totPointsBackend: 0,
      hoursTraffic: false,
      pointsLive: 0
    };
  }

  alertMetro = () => {
    Alert.alert(strings("id_1_16"), strings("id_1_17"), [
      {
        text: strings("id_1_19"),
        onPress: () => this.props.dispatch(completeTutorial("tutorialMetro"))
      },
      {
        text: strings("id_1_18"),
        // onPress: () => alert(strings('muv_may_not_wor')),
        style: "cancel"
      }
    ]);
  };

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

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {" "}
          Track{" "}
        </Text>
      )
    };
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("time", null);
      if (value !== null) {
        // We have data!!
        //console.log(value);
      }
      return value;
    } catch (error) {
      return null;
      // Error retrieving data
    }
  };

  componentWillMount() {
    Tracker.trackScreenView("Track.js");
    trackScreenView("Track.js");

    this._retrieveData().then(time => {
      //console.log("tempo iniziale");
      //console.log(time);
      if (!time) this._storeData(new Date());
      else {
        const start = Date.parse(new Date(time));
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
          start: start,
          hoursTraffic: hoursTraffic
        });
      }
    });
    // aggiorno i punti
    const pointsLive = calcolatePointsFake(
      this.props.distanceLive,
      0,
      this.props.activityChoice.type,
      this.props.activityChoice.coef
    );
    this.setState({
      pointsLive
    });
    // tempo iniziale
    console.log('montato')
    if (store.getState().tracking.PreviousRoute ? store.getState().tracking.PreviousRoute.length : 0) {
      console.log('tratte precedenti')
      this.updateInfoTrack(this.props);
    }

    this.updateColorSegment(this.props);

    // se c'e qualche route
  }

  componentDidMount() {
    //this.animation.play();
    //console.log(this.animation);

    InteractionManager.runAfterInteractions(() => {
      this.setState({
        load: true
      });
    });
    // entro 10 secondi

    setTimeout(() => {
      if (
        !this.props.tutorialMetro &&
        this.state.time < 10000 &&
        this.props.activityChoice.type === "Public" &&
        this.props.activityChoice.coef === 1200
      ) {
        this.alertMetro();
      }
    }, 2200);
  }

  componentWillReceiveProps(props) {
    const { activityChoice, distanceLive } = props;

    if (activityChoice && props.activityChoice.type === "") {
      if (this.state.anim) {
        this.state.anim.reset();
      }

      props.navigation.goBack();
    } else {
      if (
        activityChoice &&
        this.props.activityChoice.type != activityChoice.type &&
        activityChoice.type !== ""
      ) {
        // this.animation.play();
        // this.props.navigation.goBack();

        // se cambio mezzo, ricalcolo tutte le informazioni
        this.updateColorSegment(props);
        this.updateInfoTrack(props);
      }
      if (this.props.distanceLive != distanceLive) {
        // aggiorno i punti
        console.log("aggiornamento");
        console.log(props);
        const pointsLive = calcolatePointsFake(
          props.distanceLive,
          0,
          props.activityChoice.type,
          props.activityChoice.coef
        );
        this.setState({
          pointsLive
        });
      }
    }
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
    totPointsAlsoNotValid = calcolatePointsFake(
      totDistanceAlsoNotValid,
      0,
      activityChoice.type,
      activityChoice.coef
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

    

    let NumSegment = 0;

    NumSegment = props.numSubTrip// this.getNumSubTripsFromTrips(props);
    // console.log("sumsegment calcolato " + NumSegment);

    console.log(NumSegment);
    const lengthPreviousRoute = store.getState().tracking.PreviousRoute.length;
    let totPointsSegment = 0;
    let totDistanceSegment = 0
    let totPointsBackend= 0;

    for (
      index = lengthPreviousRoute;
      index > lengthPreviousRoute - NumSegment;
      index--
    ) {
      const {
        distanceLive,
        activityChoice,
        sub_trip
      } = store.getState().tracking.PreviousRoute[index - 1];

      totPointsSegment += calcolatePointsFake(
        distanceLive,
        0,
        activityChoice.type,
        activityChoice.coef
      );

      totPointsBackend += sub_trip ? sub_trip.points ? sub_trip.points : 0 : 0
      
      totDistanceSegment += distanceLive;
      console.log(totPointsSegment)
      console.log(totPointsBackend)
      console.log(totDistanceSegment)
    }

    this.setState({
      totDistanceSegment,
      totPointsSegment,
      totPointsBackend,
      NumSegment
    });
  };

  moveWave = () => {
    this.box.moveX(20, { duration: 3000 }).start();
  };

  // variabile per il timer
  Timer = null;

  componentWillUnmount() {
    if (this.state.anim) this.state.anim.reset();
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

  renderJoystick(time) {
    return (
      <View
        style={{
          marginTop: 20,
          alignContent: "center",
          justifyContent: "center",
          flexDirection: "column",
          width: Dimensions.get("window").width,
          alignItems: "center"
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width,
            height: 80,
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {/* <View
            style={{
              width: 80,
              height: 80,
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => this.DescriptionIconModalTracking()}
              style={{
                backgroundColor: "white"
              }}
            >
              <View
                style={{
                  shadowRadius: 5,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 0.5,
                  backgroundColor: "transparent",
                  elevation: 2,
                  borderRadius: 20,
                  height: 40,
                  width: 40,
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white"
                }}
              >
                <OwnIcon
                  name="info_icn"
                  size={35}
                  color={"rgba(61, 61, 61, 1)"}
                />
              </View>
            </TouchableWithoutFeedback>
          </View> */}
          <View
            style={{
              width: Dimensions.get("window").width - 80,
              height: 80,
              alignContent: "center",
              justifyContent: "center"
            }}
          >
            <Text styles={styles.textBasket}>{strings("id_1_15")}</Text>
          </View>
        </View>

        <Image
          style={styles.Joystick}
          source={require("./../../assets/images/joystick.png")}
          resizeMode={"contain"}
        ></Image>
        <View
          style={{
            height: 30,
            width: 30,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center"
          }}
        />
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.0 }}
          locations={[0, 1.0]}
          colors={["#FAB21E", "#FA941E"]}
          style={{
            width: Dimensions.get("window").width * 0.25,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            shadowRadius: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            elevation: 1
          }}
        >
          <TouchableOpacity
            onPress={this.playGame}
            style={{
              width: Dimensions.get("window").width * 0.17,
              height: 40,
              borderRadius: 20,
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
              <Text
                style={{
                  // margin: 10,
                  color: "#FFFFFF",
                  fontFamily: "OpenSans-Extrabold",
                  fontWeight: "bold",

                  fontSize: 14
                }}
              >
                {strings("id_1_14")}
              </Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }
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
                <Text style={styles.ptText}>{strings("id_1_13")}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  sendReport = async () => {
    const device = await getDevice()

    const position = this.props.route.length
      ? this.props.route[this.props.route.length - 1]
      : { latitude: 0, longitude: 0 };
    const referred_route_id =
      "LAT " + position.latitude + " LON " + position.longitude;

    this.props.navigation.navigate("FeedbackWebView", {
      referred_route_id,
      device,
      modalType: this.props.activityChoice.type,
      report: true
    });
  };

  DescriptionIconModal = typeIcon => {
    // Alert.alert("weather");
    this.setState({
      modalActive: true,
      iconChoose: typeIcon
    });
  };

  DescriptionIconModalTracking = () => {
    let type = "info_public";
    if (this.props.activityChoice.type === "Public") {
      type = "info_public";
    } else if (this.props.activityChoice.type === "Walking") {
      type = "info_walk";
    } else {
      type = "info_bike";
    }
    this.DescriptionIconModal(type);
  };

  DeleteDescriptionIconModal = () => {
    // Alert.alert("weather");
    this.setState({
      modalActive: false
    });
  };

  imageMove = () => {

    return(<View>
      
        <Image
          style={styles.waveView}
          source={require("./../../assets/images/wave/blue_live_wave_2.png")}
          resizeMode={"contain"}
        />
        <Image
          style={styles.waveView}
          source={require("./../../assets/images/wave/blue_live_wave.png")}
          resizeMode={"contain"}
        />
    </View>)
  }

  livePointer = (time, distanceWithComma, typeWeather, kmTrovati) => {
    let pointsFake = calcolatePointsFake(
      this.props.distanceLive,
      0,
      this.props.activityChoice.type,
      this.props.activityChoice.coef
    );
    pointsFake += this.state.totPointsSegment
    const pointsBackend = this.props.subTrip.points + this.state.totPointsBackend
    return (
      <Aux>
        {this.renderModalSplitImage(
          this.state.modalSplitIndex,
          pointsFake > pointsBackend
            ? pointsFake
            : pointsBackend,
          `rgba(${this.state.r}, ${this.state.g}, ${this.state.b}, 1)`
        )}
        <View
          style={{
            flex: 2,
            flexDirection: "column",
            alignContent: "space-around",
            marginTop: 20,
            marginBottom: 20
          }}
        >
          <View
            style={{
              flex: 3,
              flexDirection: "row"
            }}
          >
            <View style={{ alignContent: "center", flex: 1 }}>
              <Text style={styles.routeParametersLabel}>
                {strings("id_1_03")}
              </Text>
              <Text
                style={[
                  { textAlign: "center", paddingTop: 5 },
                  styles.routeParametersValue
                ]}
              >
                {time}
              </Text>
            </View>
            <View
              style={{
                alignContent: "center",
                flex: 1,
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <View>
                <Text style={styles.routeParametersLabel}>
                  {strings("id_1_04")}
                </Text>
              </View>
              {distanceWithComma == 0 ? (
                <View
                  style={{
                    paddingTop: 15
                  }}
                >
                  <Image
                    source={require("../../assets/images/puntini.gif")}
                    style={{
                      height: 12,
                      width: 20
                    }}
                  />
                </View>
              ) : (
                <Text
                  style={[
                    { textAlign: "center", paddingTop: 5 },
                    styles.routeParametersValue
                  ]}
                >
                  {distanceWithComma} {kmTrovati ? "Km" : "m"}
                </Text>
              )}
            </View>
            <View
              style={{
                alignContent: "center",
                flex: 1,
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({
                    clickDebug: this.state.clickDebug + 1
                  });
                  if (this.state.clickDebug > 4) {
                    this.setState({
                      clickDebug: 0
                    });
                    this.props.navigation.navigate("Debug");
                  }
                }}
              >
                <View>
                  <Text style={styles.routeParametersLabel}>
                    {strings("id_1_05")}
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              {this.props.speed == 0 ? (
                <View
                  style={{
                    paddingTop: 15
                  }}
                >
                  <Image
                    source={require("../../assets/images/puntini.gif")}
                    style={{
                      height: 12,
                      width: 20
                    }}
                  />
                </View>
              ) : (
                <View>
                  <Text
                    style={[
                      { textAlign: "center", paddingTop: 5 },
                      styles.routeParametersValue
                    ]}
                  >
                    {(this.props.speed * 3.6).toFixed(0) + " km/h"}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View
            style={{
              flex: 3,
              flexDirection: "row",

              marginTop: 0
            }}
          >
            <View style={{ alignContent: "center", flex: 1 }}>
              <View
                style={{
                  alignContent: "center",
                  alignSelf: "center",
                  alignItems: "center"
                }}
              >
                <OwnIcon
                  name="weather_icn"
                  click={() => this.DescriptionIconModal("weather_icn")}
                  size={40}
                  color={
                    typeWeather
                      ? "rgba(61, 61, 61, 1)"
                      : "rgba(61, 61, 61, 0.3)"
                  }
                />
              </View>
              <Text
                style={[
                  { textAlign: "center", paddingTop: 5 },
                  styles.routeParametersValueWithPercantuale
                ]}
              >
                {typeWeather ? "+ " + typeWeather * 5 + "%" : ""}
              </Text>
            </View>
            <View style={{ alignContent: "center", flex: 1 }}>
              <View
                style={{
                  alignContent: "center",
                  alignSelf: "center",
                  alignItems: "center"
                }}
              >
                <OwnIcon
                  click={() => this.DescriptionIconModal("rush_hour_icn")}
                  name="rush_hour_icn"
                  size={40}
                  color={
                    this.state.hoursTraffic
                      ? "rgba(61, 61, 61, 1)"
                      : "rgba(61, 61, 61, 0.3)"
                  }
                />
              </View>
              <Text
                style={[
                  { textAlign: "center", paddingTop: 5 },
                  styles.routeParametersValueWithPercantuale
                ]}
              >
                {this.state.hoursTraffic
                  ? "+ " + this.state.hoursTraffic * 10 + "%"
                  : ""}
              </Text>
            </View>

            <View style={{ alignContent: "center", flex: 1 }}>
              <View
                style={{
                  alignContent: "center",
                  alignSelf: "center",
                  alignItems: "center"
                }}
              >
                <OwnIcon
                  name="series_icn"
                  click={() => this.DescriptionIconModal("series_icn")}
                  size={40}
                  color={
                    this.props.series
                      ? "rgba(61, 61, 61, 1)"
                      : "rgba(61, 61, 61, 0.3)"
                  }
                />
              </View>

              <Text
                style={[
                  { textAlign: "center", paddingTop: 5 },
                  styles.routeParametersValueWithPercantuale
                ]}
              >
                {this.props.series ? "+ " + this.props.series * 5 + "%" : ""}
              </Text>
            </View>
          </View>
        </View>
        <TouchableWithoutFeedback
          onPress={() => this.props.navigation.navigate("Mappa")}
          style={{
            backgroundColor: "white"
          }}
        >
          <View
            style={{
              position: "absolute",
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              backgroundColor: "transparent",
              elevation: 2,
              borderRadius: 20,
              height: 40,
              width: 40,
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              top: 40,
              right: 40
            }}
          >
            <OwnIcon name="map_icn" size={35} color={"rgba(61, 61, 61, 1)"} />
          </View>
        </TouchableWithoutFeedback>
        {/* <TouchableWithoutFeedback
          // onPress={() => this.DescriptionIconModalTracking()}
          onPress={() => this.sendReport()}
          style={{
            backgroundColor: this.state.colors[0]
          }}
        >
          <View
            style={{
              position: "absolute",
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              backgroundColor: this.state.colors[0],

              top: 40,
              left: 40,
              elevation: 2,
              borderRadius: 20,
              height: 40,
              width: 40,
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <OwnIcon
              name="feedback_icn"
              size={35}
              color={"rgba(255, 255, 255, 1)"}
            />
          </View>
        </TouchableWithoutFeedback> */}
      </Aux>
    );
  };

  metro = (time, distanceWithComma, typeWeather) => {
    return (
      <Aux>
        <IntermittentPointer
          styles={[
            styles.livePointerOpacity,
            { backgroundColor: "red", opacity: 0 }
          ]}
          updateCurrentTimeAnimation={() => this.updateCurrentTimeAnimation()}
        />
        {this.renderJoystick(time)}
        <View
          style={{
            flex: 2,
            flexDirection: "column",
            alignContent: "space-around"
          }}
        >
          <View
            style={{
              // height: 140,
              width: Dimensions.get("window").width,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center"
            }}
          >
            <View>
              <Image
                source={require("../../assets/images/metro_icn.png")}
                style={{ width: 100, height: 100 }}
              />
            </View>
            <View
              style={{
                height: 150,
                width: 30,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center"
              }}
            />
            <View>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({
                    clickDebug: this.state.clickDebug + 1
                  });
                  if (this.state.clickDebug > 4) {
                    this.setState({
                      clickDebug: 0
                    });
                    this.props.navigation.navigate("Debug");
                  }
                }}
              >
                <Text style={styles.routeParametersLabel}>
                  {strings("id_1_03")}
                </Text>
              </TouchableWithoutFeedback>
              <Text
                style={[
                  { textAlign: "center", paddingTop: 5 },
                  styles.routeParametersValue
                ]}
              >
                {time}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 3,
              flexDirection: "row",

              marginTop: 0
            }}
          >
            <View style={{ alignContent: "center", flex: 1 }}>
              <View
                style={{
                  alignContent: "center",
                  alignSelf: "center",
                  alignItems: "center"
                }}
              >
                <OwnIcon
                  name="weather_icn"
                  click={() => this.DescriptionIconModal("weather_icn")}
                  size={40}
                  color={
                    typeWeather
                      ? "rgba(61, 61, 61, 1)"
                      : "rgba(61, 61, 61, 0.3)"
                  }
                />
              </View>
              <Text
                style={[
                  { textAlign: "center", paddingTop: 5 },
                  styles.routeParametersValueWithPercantuale
                ]}
              >
                {typeWeather ? "+ " + typeWeather * 5 + "%" : ""}
              </Text>
            </View>
            <View style={{ alignContent: "center", flex: 1 }}>
              <View
                style={{
                  alignContent: "center",
                  alignSelf: "center",
                  alignItems: "center"
                }}
              >
                <OwnIcon
                  click={() => this.DescriptionIconModal("rush_hour_icn")}
                  name="rush_hour_icn"
                  size={40}
                  color={
                    this.state.hoursTraffic
                      ? "rgba(61, 61, 61, 1)"
                      : "rgba(61, 61, 61, 0.3)"
                  }
                />
              </View>

              <Text
                style={[
                  { textAlign: "center", paddingTop: 5 },
                  styles.routeParametersValueWithPercantuale
                ]}
              >
                {this.state.hoursTraffic
                  ? "+ " + this.state.hoursTraffic * 10 + "%"
                  : ""}
              </Text>
            </View>

            <View style={{ alignContent: "center", flex: 1 }}>
              <View
                style={{
                  alignContent: "center",
                  alignSelf: "center",
                  alignItems: "center"
                }}
              >
                <OwnIcon
                  name="series_icn"
                  click={() => this.DescriptionIconModal("series_icn")}
                  size={40}
                  color={
                    this.props.series
                      ? "rgba(61, 61, 61, 1)"
                      : "rgba(61, 61, 61, 0.3)"
                  }
                />
              </View>

              <Text
                style={[
                  { textAlign: "center", paddingTop: 5 },
                  styles.routeParametersValueWithPercantuale
                ]}
              >
                {this.props.series ? "+ " + this.props.series * 5 + "%" : ""}
              </Text>
            </View>
          </View>
        </View>
      </Aux>
    );
  };

  getNumSubTripsFromTrips = props => {
    const lengthPreviousRoute = store.getState().tracking.PreviousRoute.length;
    console.log(lengthPreviousRoute)
    let numSubTrips = 0;
    for (i = lengthPreviousRoute - 1; i >= 0; i--) {
      const numSubTripNext = store.getState().tracking.PreviousRoute[i].numSubTrip;
      console.log(numSubTripNext)
      if (numSubTripNext) {
        numSubTrips = numSubTrips + 1;
      } else {
        break;
      }
    }
  };

  render() {
    // vedo se ha superato un giorno e cosi in caso taglio le info sui giorni
    let time = 0;
    if (this.state.time > 3600000) {
      // tolgo le ore se non ci sono
      time = new Date(this.state.time).toISOString().slice(11, 19);
    } else {
      time = new Date(this.state.time).toISOString().slice(14, 19);
    }

    const totDistance = this.props.distanceLive + this.state.totDistanceSegment;
    const kmTrovati = totDistance > 1.0;
    // console.log(totDistance);
    let distanceWithComma = totDistance;
    if (kmTrovati) {
      distanceWithComma = pointsDecimal(totDistance, ",");
      distanceWithComma = distanceWithComma.substr(
        0,
        distanceWithComma.length - 1
      );
    } else {
      distanceWithComma = parseInt(totDistance * 1000);
    }

    // orario di punta
    /* const hour = new Date(this.state.start).getHours();
    const minute = new Date(this.state.start).getMinutes();
    //console.log("ora");
    //console.log(hour);
    let hoursTraffic = false;
if (hour >= 7 && hour < 9) {
      hoursTraffic = true;
    } else if (hour >= 13 && hour < 15) {
      hoursTraffic = true;
    } */

    const typeWeather = convertWeather(this.props.typeWeather);

    // se si fa click su boxshadow l'app crash quindi ho messo una view piu grande di sopra in modo tale che non è cliccabile

    if (this.state.load) {
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

          <DescriptionIcon
            active={this.state.modalActive}
            icon={this.state.iconChoose}
            DeleteDescriptionIconModal={this.DeleteDescriptionIconModal}
          />
          <StackedAreaChart
            style={{
              height: 200,
              width: Dimensions.get("window").width,
              position: "absolute",
              top: -150
            }}
            data={this.state.data}
            keys={this.state.keys1}
            colors={this.state.colors}
            curve={shape.curveNatural}
            showGrid={false}
          />
          {Platform.OS !== "android" ? (
            <WaveAnimation
              type={this.props.activityChoice.type}
              StatusButton={this.props.StatusButton}
            />
          ) : (
            <StackedAreaChart
              style={{
                height: 200,
                width: Dimensions.get("window").width,
                position: "absolute",
                top: Dimensions.get("window").height - 300
              }}
              data={this.state.data}
              keys={this.state.keys}
              colors={this.state.colors}
              curve={shape.curveNatural}
              showGrid={false}
            />
          )}
          {this.props.activityChoice.type === "Public" &&
          this.props.activityChoice.coef === 1200
            ? this.metro(time, distanceWithComma, typeWeather, kmTrovati)
            : this.livePointer(time, distanceWithComma, typeWeather, kmTrovati)}
        </View>
      );
    } else {
      return <View />;
    }
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  waveView: {
    position: "absolute",
          top:
            Dimensions.get("window").height -
            (Platform.OS === "ios" &&
            ((Dimensions.get("window").height === 812 ||
              Dimensions.get("window").width === 812) || (Dimensions.get("window").height === 896 ||
              Dimensions.get("window").width === 896) )
              ? 400
              : 300),
              height: 300,
            width: Dimensions.get("window").width
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

export const modalSplitImage = {
  0: require("./../../assets/images/live_walk.png"),
  1: require("./../../assets/images/live_bike.png"),
  2: require("./../../assets/images/live_bus.png"),
  3: require("./../../assets/images/live_train.png"),
  4: require("./../../assets/images/live_metro.png")
};

// quali dati prendere

const getStatusButton = state => state.login.StatusButton;

const getRoute = state => state.tracking.route;
const getRouteAnalyzed = state => state.tracking.routeAnalyzed;


const getRouteNotvalid = state => state.tracking.routeNotvalid;

const getPrecDistanceSameMode = state => state.tracking.PrecDistanceSameMode;

const getStatusButtonState = createSelector(
  [getStatusButton],
  StatusButton => StatusButton
);

const getRouteAnalyzedState = createSelector(
  [getRouteAnalyzed],
  routeAnalyzed => routeAnalyzed
);

const getRouteState = createSelector([getRoute], route => route);



const getRouteNotvalidState = createSelector(
  [getRouteNotvalid],
  routeNotvalid => routeNotvalid
);

const getPrecDistanceSameModeState = createSelector(
  [getPrecDistanceSameMode],
  PrecDistanceSameMode => PrecDistanceSameMode
);

const getWeather = state => state.tracking.typeWeather;

const getWeatherState = createSelector(
  [getWeather],
  typeWeather => typeWeather
);
const getSpeed = state => state.tracking.speed;

const getSpeedState = createSelector([getSpeed], speed => speed);
const getSeries = state => state.login.NumDaysRoute.numDay;

const getSeriesState = createSelector([getSeries], series => series);

const withActivity = connect((state, props) => {
  // se la pagina e attiva carica i nuovi dati

  return {
    StatusButton: getStatusButtonState(state),
    activityChoice: getActivityState(state),
    route: getRouteState(state),
    routeAnalyzed: getRouteAnalyzedState(state),
    routeNotvalid: getRouteNotvalidState(state),
    distanceLive: getDistanceLiveState(state),
    subTrip: getsubTripState(state),
    numSubTrip: getNumSubTripState(state),
    PrecDistanceSameMode: getPrecDistanceSameModeState(state),
    typeWeather: getWeatherState(state),
    series: getSeriesState(state),
    speed: getSpeedState(state),
    tutorialMetro: getTutorialMetroState(state)
  };
});

export default withActivity(Track);

export function convertWeather(weather) {
  //console.log(weather);

  let typeWeather = 0;

  switch (weather) {
    case "Clear":
    case "Clouds":
      typeWeather = 0;
      break;
    case "Drizzle":
    case "Haze":
    case "Mist":
      typeWeather = 1;
      break;
    case "Rain":
    case "Snow":
    case "Thunderstorm":
      typeWeather = 2;
      break;
    default:
      typeWeather = 0;
  }

  return typeWeather;
}
