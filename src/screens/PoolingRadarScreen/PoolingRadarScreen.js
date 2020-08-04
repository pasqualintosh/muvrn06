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
  Image,
  Easing,
  RefreshControl,
  ScrollView
} from "react-native";
import { StackedAreaChart } from "react-native-svg-charts";
import { connect } from "react-redux";
import * as shape from "d3-shape";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

import WaveAnimation from "../../components/WaveAnimation/WaveAnimation";

import { createSelector } from "reselect";



import { getDevice } from "../../helpers/deviceInfo";

import InteractionManager from "../../helpers/loadingComponent";

import { d as nearUsers } from "./../../helpers/radarData";
import { images } from "./../../components/InfoUserHome/InfoUserHome";
import RadarBackgroundSvg from "./../../components/RadarBackgroundSvg/RadarBackgroundSvg";
import AlertCarPooling from "../../components/AlertCarPooling/AlertCarPooling";
import WaveBottomLive from "../../components/WaveBottomLive/WaveBottomLive";


import {getUsersPoolingFindState, getReceiveInvitePoolingState, getInvitePoolingState} from "../../domains/connection/Selectors"
import { searchUsersPoolingWithLastPoint, searchUsersPoolingWithCurrentPoint } from "../../domains/tracking/ActionCreators"
import { getGroupPoolingState } from "../../domains/tracking/Selectors"

import { InvitePooling, acceptInvitePooling, declineInvitePooling, deleteDataReceiveInvite, deleteDataSendInvite, deleteSearchData } from "../../domains/connection/ActionCreators"
import WaveTopLive from "../../components/WaveTopLive/WaveTopLive";

class PoolingRadarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.clickBack = this.clickBack.bind(this);
    this.setAnim = this.setAnim.bind(this);

    this.research = null;
    this.animate = null;
    
    this.state = {
      AlertCarPooling: false,
      userInvite: null,
      clickDebug: 0,
      modalActive: false,
      iconChoose: null,
      load: false,
      animated: false,
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
          dates: 1200 - 1200
        },
        {
          month: new Date(2015, 1, 1),
          apples: 1600,
          bananas: 2400,
          cherries: 960,
          dates: -960 - 1200
        },
        {
          month: new Date(2015, 2, 1),
          apples: 640,
          bananas: 3500,
          cherries: 3640,
          dates: -3640 - 1200
        },
        {
          month: new Date(2015, 3, 1),
          apples: 3320,
          bananas: 480,
          cherries: 640,
          dates: -640 - 1200
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
      pointsLive: 0,
      refreshing: false
    };
  }

  _onRefresh() {
    if (!this.state.refreshing) {
      this.setState({ refreshing: true });
      searchUsersPoolingWithCurrentPoint()
      setTimeout(() => {
        // console.log("check");

        this.setState({ refreshing: false });
      }, 5000);
    }
  }

  opacity = new Animated.Value(1); // Initial value for opacity: 0

  closeAlertCarPooling = () => {
    this.setState({
      AlertCarPooling: false
    });
  };

  // mostro il pupup con le info dell'utente che sto invitando 
  showAlertCarPooling = (userInvite) => {
    this.setState({
      AlertCarPooling: true,
      userInvite
    });
  };

  inviteDo = (userInvite) => {
    InvitePooling(userInvite)
  }

  clickBack = () => {
    this.props.navigation.goBack();
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

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          Radar
        </Text>
      )
    };
  };

  componentWillMount() {
    this.updateColorSegment(this.props);

    // cancello eventuali risultati precedente 
    this.props.dispatch(deleteSearchData())

  }

  animateOpacity = () => {
    if (this.state.animated) {
      Animated.spring(this.opacity, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
        isInteraction: true
      }).start(
        this.setState({
          animated: false 
        })
      );
    } else {
      Animated.spring(this.opacity, {
        toValue: 0.5,
        duration: 6000,
        useNativeDriver: true,
        isInteraction: true
      }).start(
        this.setState({
          animated: true
        })
      );
    }
  }


  componentDidMount() {
    //this.animation.play();
    //console.log(this.animation);

    InteractionManager.runAfterInteractions(() => {
      this.setState({
        load: true
      });
    });
    Animated.spring(this.opacity, {
      toValue: 0.5,
      duration: 1000,
      useNativeDriver: true,
      isInteraction: true
    }).start(
      this.setState({
        animated: true
      })
    );
    searchUsersPoolingWithCurrentPoint()
    // avvio un timer per avviare una ricerca ogni dieci secondi
    this.research = setInterval(function(){ searchUsersPoolingWithCurrentPoint() }, 10000);

    this.animate = setInterval(() => { this.animateOpacity() }, 1100);
  }




  

  componentWillReceiveProps(props) {
    const { activityChoice, groupPooling } = props;

    if (activityChoice && props.activityChoice.type === "") {

      // testare
      props.navigation.goBack();
    } else if (
      activityChoice &&
      this.props.activityChoice.type != activityChoice.type &&
      activityChoice.type !== ""
    ) {
      // this.animation.play();
      // this.props.navigation.goBack();

      // se cambio mezzo, ricalcolo tutte le informazioni
      this.updateColorSegment(props);
    } else if (
      
      this.props.groupPooling.length != groupPooling.length
    ) {
      // è cambiato il gruppo, quindi ho gia accettato l'invito o è stato accettato 
      // ritorno al live
      
      this.props.navigation.goBack();

      
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
        case "Carpooling":
        {
          r = 51;
          g = 99;
          b = 173;
          modalSplitIndex = 5;
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

  // variabile per il timer
  Timer = null;

  componentWillUnmount() {
   // cancello il timer per la ricerca per il pooling
    if (this.research) clearTimeout(this.research);
    if (this.animate) clearTimeout(this.animate);
    

    // cancello eventuali inviti inviati o ricevuti 
    deleteDataReceiveInvite()
    deleteDataSendInvite()
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

  sendReport = async () => {
    const device = await getDevice();

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

  polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  renderNearUsers() {
    const centerX = Dimensions.get("window").width / 2;
    const centerY = (centerX + Dimensions.get("window").height / 2) / 2;
    // centro centerX - 35, centerY - 225 + 70
    // mi devo spostare di 75 ogni volta
    // let leftPositions = [centerX - 35, centerX - 35, centerX - 35];
    // let topPositions = [
    //   centerY - 300 + 70,
    //   centerY - 150 + 70,
    //   centerY - 75 + 70
    // ];

    // const third = this.polarToCartesian(centerX, centerY, 105, 360);

    let leftPositions = [centerX + 55, centerX + 25, centerX - 65];
    let topPositions = [
      centerY - 300 + 15,
      centerY - 150 + 45,
      centerY - 75 + 60
    ];

    // sending: false,
    //  accepted: false,
    if (this.props.userPooling.length) {
      return this.props.userPooling.map((e, i) => {
        // controllo se sto gia inviando un invito
        const sending = this.props.invite ? e.id == this.props.invite.id : false
        // vedo chi ha gia accettato
        const accepted =  this.props.groupPooling ? this.props.groupPooling.filter(user => user.user.username == e.user.username).length ? true : false : false
        const opacity = sending || accepted ? 0.6 : 1;
        return (
          <View
            key={i}
            style={{
              // backgroundColor: "#e33",
              position: "absolute",
              // top: 0,
              left: leftPositions[i],
              top: topPositions[i],
              
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.inviteDo(e)
              }}
              disabled={sending || accepted}
            >
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Image
                  style={{
                    width: 70,
                    height: 70,
                    opacity
                  }}
                  source={images[e.user.avatar]}
                />
                <Text style={[styles.userNameTxt, { opacity }]}>{e.user.username}</Text>
                {accepted ? (
                  <Image
                    source={require("../../assets/images/check_green_icn.png")}
                    style={{
                      height: 15,
                      width: 15
                    }}
                  />
                ) : sending ? (
                  <Image
                    source={require("../../assets/images/puntini_big.gif")}
                    style={{
                      height: 10,
                      width: 16
                    }}
                  />
                ) : (
                  <View />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        );
      });
    } else {
      return(
        <View style={{
          // backgroundColor: "#e33",
          position: "absolute",
          // top: 0,
          width: Dimensions.get("window").width * 0.6,
          left: centerX - Dimensions.get("window").width * 0.3,
          top: centerX - 150,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}><Text style={styles.userNoTxt}>In questa schermata vedrai gli altri muover vicini a te.</Text></View>
      )
    }
   
  }

  moveMap = () => {
    return (
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
    );
  };

  

  render() {
    if (this.state.load) {
      return (
        <ScrollView
        contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "space-around",
            flexDirection: "column"
          }}
          refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        >
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <AlertCarPooling
            isModalVisible={this.props.receiveInvite ? true : false}
            closeModal={declineInvitePooling}
            confermModal={acceptInvitePooling}
            type={"Invite"}
            infoAlert={this.props.receiveInvite ? this.props.receiveInvite : { user: { username: 'mario', avatar: 1}}}
            infoSend={this.props.receiveInvite}
          />
         
          <RadarBackgroundSvg child={<View />} colors={this.state.colors} opacity={this.opacity}/>
         
          {/* <StackedAreaChart
            style={{
              height: 50,
              width: Dimensions.get("window").width,
              position: "absolute",
              top: 0
            }}
            data={this.state.data}
            keys={this.state.keys1}
            colors={this.state.colors}
            curve={shape.curveNatural}
            showGrid={false}
          /> */}
          <WaveTopLive
           
           width='100%'
           height="50"
           colors={this.state.colors}
           style={{
              height: 50,
              width: Dimensions.get("window").width,
              position: "absolute",
              top: 0
            }}
           // scale={width/24}
         />
          <View style={{
                  height: 200,
                  width: Dimensions.get("window").width,
                  position: "absolute",
                  top: Dimensions.get("window").height - 300
                }}>
            <WaveBottomLive
           
            width='100%'
            height="200"
            preserveAspectRatio="xMinYMin slice"
            colors={this.state.colors}
           
            // scale={width/24}
           
          />
          </View>

          {this.moveMap()}
          <View
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height * 0.5,
              justifyContent: "flex-start",
              alignItems: "flex-start"
              // backgroundColor: "#3e3"
            }}
          >
            {this.renderNearUsers()}
          </View>
        </ScrollView>
      );
    } else {
      return <View />;
    }
  }
}

const styles = {
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
  userNameTxt: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3D3D3D",
    fontSize: 12
  },
  userNoTxt: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3D3D3D",
    textAlign: 'center',
    fontSize: 16
  },
  routeParametersLabel: {
    fontFamily: "OpenSans-ExtraBold",
    fontWeight: "bold",
    color: "#3D3D3D",
    fontSize: 14,
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

export const modalSplitBackground = {
  0: require("./../../assets/images/pooling_circles_walk.png"),
  1: require("./../../assets/images/pooling_circles_bike.png"),
  2: require("./../../assets/images/pooling_circles_walk.png"),
  3: require("./../../assets/images/pooling_circles_walk.png"),
  4: require("./../../assets/images/pooling_circles_walk.png"),
  5: require("./../../assets/images/pooling_circles_car.png")
};

// quali dati prendere

const getStatusButton = state => state.login.StatusButton;
const getActivity = state => state.tracking.activityChoice;




const getStatusButtonState = createSelector(
  [getStatusButton],
  StatusButton => StatusButton
);

const getActivityState = createSelector(
  [getActivity],
  activityChoice => activityChoice
);







const withActivity = connect((state, props) => {
  return {
    StatusButton: getStatusButtonState(state),
    activityChoice: getActivityState(state),
    userPooling: getUsersPoolingFindState(state),
    receiveInvite: getReceiveInvitePoolingState(state),
    invite: getInvitePoolingState(state),
    groupPooling: getGroupPoolingState(state)
  };
});

export default withActivity(PoolingRadarScreen);
