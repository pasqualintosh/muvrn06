import React from "react";
import {
  Platform,
  Dimensions,
  View,
  Animated,
  TouchableHighlight,
  Image,
  TouchableWithoutFeedback,
  Easing,
  NativeModules,
  Text
} from "react-native";
import OwnIcon from "../OwnIcon/OwnIcon";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import { changeStatusButton } from "./../../domains/login/ActionCreators";
// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

import Settings from "./../../config/Settings";
// import { BoxShadow } from "react-native-shadow";
import InteractionManager from "../../helpers/loadingComponent";
import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from "react-native-google-analytics-bridge";

let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);

import analytics from "@react-native-firebase/analytics";
async function trackEvent(event, data) {
  await analytics().logEvent(event, { data });
}

// componente per avere le icone circolari per selezionare i mezzi

// props
// selectTrasport metodi per sapere quando deve cambiare i pulsanti usando un altro compoennte tipo
// da play con mezzi a pausa con stop o play o viceversa

const { UIManager } = NativeModules;

class ComponentAnimatedPlayWithAuto extends React.PureComponent {
  // setto i valori inziali di posizione x e y e opacita che avranno le icone e che cambieranno nel tempo
  // animated per sapere se devo fare l'animazione
  state = {
    animated: false,
    animatedPublic: false,
    events: {}
  };

  positionX = new Animated.Value(0); // Initial value for opacity: 0

  // click relativo all'avvio dell'animazione
  onClickAnimated = () => {
    this.props.dispatch(changeStatusButton(true));

    // unisco tre animazioni relative a
    // x , y e opacita
    // in 350 ms il valore corrente nello stato deve diventare 100 nel corso del tempo

    Animated.spring(this.positionX, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
      isInteraction: true
    }).start();
    // poi setto che ho fatto l'animazione di apertura nello stato, utile per poi fare quella di chiusura
    this.setState(prevState => {
      return { animated: true };
    });
  };

  // relativa all'animazione di chiusura
  // metodo dopo l'animazionez
  onClickAnimatedClose = callback => {
    // riporto i valori a 0

    this.props.dispatch(changeStatusButton(false));

    Animated.spring(this.positionX, {
      toValue: 0,
      duration: this.state.animatedPublic ? 500 : 250,
      useNativeDriver: true,
      isInteraction: true
    }).start(
      InteractionManager.runAfterInteractions(() => {
        callback && typeof callback === "function" ? callback() : null;
      })
    );
    // cambia il valore dì animated dello stato per dire che ho chiuso il menu con l'animazione di chiusura
    this.setState(prevState => {
      return { animated: false, animatedPublic: false };
    });
  };

  onClickAnimatedPublic = () => {
    // this.props.dispatch(changeStatusButton(true));

    // unisco tre animazioni relative a
    // x , y e opacita
    // in 350 ms il valore corrente nello stato deve diventare 100 nel corso del tempo

    Animated.spring(this.positionX, {
      toValue: 2,
      duration: 250,
      useNativeDriver: true,
      isInteraction: true
    }).start();
    // poi setto che ho fatto l'animazione di apertura nello stato, utile per poi fare quella di chiusura
    this.setState(prevState => {
      return { animatedPublic: true };
    });
  };

  // relativa all'animazione di chiusura
  // metodo dopo l'animazionez
  onClickAnimatedClosePublic = callback => {
    // riporto i valori a 0

    // this.props.dispatch(changeStatusButton(false));

    Animated.spring(this.positionX, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
      isInteraction: true
    }).start(
      InteractionManager.runAfterInteractions(() => {
        callback && typeof callback === "function" ? callback() : null;
      })
    );
    // cambia il valore dì animated dello stato per dire che ho chiuso il menu con l'animazione di chiusura
    this.setState(prevState => {
      return { animatedPublic: false };
    });
  };

  sendEventPlay = () => {

    Tracker.trackEvent("User Interactions", "Play");
    trackEvent("play", "User Interactions");
  };

  // metodo usato nelle icone che spuntano
  // quindi l'cona centrale ha soltanto l'animazione di chiusura
  // mentre le altre hanno specificato questo metodo che gestisce il cambio icone e l'azione da mandare
  // specificate in onPress delle icone in TouchableHighlight
  // specificando l'azione o il tipo di payload
  handleAction = (type, coef, threshold, navigation) => {
    this.sendEventPlay();

    // chiudo l'animazione
    this.onClickAnimatedClose(() =>
      this.props.selectTrasport(type, coef, threshold, navigation)
    );

    console.log(navigation);
    // avvio gps e attivita specificando il tipo usato poi nella validazione della tratta e il coefficiente
    //this.props.dispatch(start(type, coef));

    // ora posso cambiare il set di pulsante chiamando la props passata
    // ma dopo che ha terminato l'animazione ovvero 300
    // questa funzione deve essere chiamata nel metodo relativo alle icone dei mezzi o stop e pausa
    // che chimano sia il termina animazione sia il timer cosi quando conclude l'animazione cambia

    // manda l'azione
  };

  // quando premo un icona deve fare delle azioni differenti a seconda il contesto, ovvero andare verso l'alto oppure verso il basso attivando l'azione per il tracciamento
  handleButtonTrasport = (type, coef, threshold) => {
    if (this.state.animated) {
      this.handleAction(type, coef, threshold, this.props.navigation);
    } else {
      this.onClickAnimated();
    }
  };

  renderWavyArea() {
    if (Platform.OS === "android")
      return (
        <View>
          {/* 
          <Image
            style={{
              width: Dimensions.get("window").width,
              height: 58,
              position: "absolute",
              bottom: 36.5
            }}
            source={require("./../../assets/images/tab/drawable-xxhdpi/tab-bar.png")}
          /> 
          */}
          <Image
            style={{
              width: Dimensions.get("window").width * 0.377,
              height: 33,
              position: "absolute",
              bottom: 36.5
            }}
            source={require("./../../assets/images/tab-bar_left.png")}
          />
          <Image
            style={{
              width: Dimensions.get("window").width * 0.2458,
              marginLeft: Dimensions.get("window").width * 0.377,
              height: 57.4,
              position: "absolute",
              bottom: 36.5,
              resizeMode: "cover"
            }}
            source={require("./../../assets/images/tab-bar_center.png")}
          />
          <Image
            style={{
              width: Dimensions.get("window").width * 0.377,
              marginLeft: Dimensions.get("window").width * 0.6228,
              height: 33,
              position: "absolute",
              bottom: 36.5
            }}
            source={require("./../../assets/images/tab-bar_right.png")}
          />
        </View>
      );
  }

  onClickAnimatedCloseWithPlay = () => {
    if (this.props.playPrevious === "Walking") {
      this.handleButtonTrasport("Walking", 1200, 5);
    } else if (this.props.playPrevious === "Biking") {
      this.handleButtonTrasport("Biking", 800, 10);
    } else if (this.props.playPrevious === "Public") {
      this.handleButtonTrasport("Public", 800, 15);
    } else if (this.props.playPrevious === "Carpooling") {
      this.handleButtonTrasport("Carpooling", 1200, 5);
    }
  };

  renderButtons() {
    // prendo dallo stato l'occorrente
    let { animated, play } = this.state;

    let colorStart = "#6CBA7E";
    let colorEnd = "#379b4e";
    if (this.props.playPrevious === "Walking") {
      colorStart = "#6CBA7E";
      colorEnd = "#379b4e";
    } else if (this.props.playPrevious === "Biking") {
      colorStart = "#E83475";
      colorEnd = "#cf185a";
    } else if (this.props.playPrevious === "Public") {
      colorStart = "#FAB21E";
      colorEnd = "#fa941e";
    } else if (this.props.playPrevious === "Carpooling") {
      colorStart = "#3363AD";
      colorEnd = "#3363AD";
    }

    // walk
    const positionX = this.positionX.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, -135, -135]
    });

    const positionY = this.positionX.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, -100, -100]
    });

    const OpacityPublic = this.positionX.interpolate({
      inputRange: [1, 2],
      outputRange: [0, 1]
    });

    const positionY1 = this.positionX.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, -100, -175]
    });
    const positionY2 = this.positionX.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, -100, -250]
    });
    const positionY3 = this.positionX.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, -100, -325]
    });
    /* const positionY = this.positionX.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -100]
    }); */

    // bike
    const positionX2 = this.positionX.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, -45, -45]
    });

    // tpl
    const positionX3 = this.positionX.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 45, 45]
    });

    // car
    const positionX4 = this.positionX.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 135, 135]
    });

    // let shadowOpt;
    // if (Platform.OS == "ios")
    //   shadowOpt = {
    //     // borderRadius: 30,
    //     height: 50,
    //     width: 50,
    //     color: "#888",
    //     border: 6,
    //     radius: 20,
    //     opacity: 0.25,
    //     x: 0,
    //     y: 3,
    //     style: { marginVertical: 0, position: "absolute", top: 5, left: 5 }
    //   };
    // else
    //   shadowOpt = {
    //     // borderRadius: 30,
    //     height: 50,
    //     width: 50,
    //     color: "#111",
    //     border: 6,
    //     radius: 20,
    //     opacity: 0.35,
    //     x: 0,
    //     y: 3,
    //     style: { marginVertical: 0, position: "absolute", top: 5, left: 5 }
    //   };

    // creo una view generica dove metto tutti le icone che devo muovere
    // ogni Animated.View per ogni icona, insieme alla view e Animated.View che li raccoglie tutti insieme
    // animated ? this.onClickAnimatedClose : this.onClickAnimated
    // per sapere quale animazione devo fare

    // le altre Animated.View oltre la prima per la prima icona sono position: "absolute", poiche sono una sopra l'altra

    return (
      <View
        style={{
          position: "absolute",
          ...this.props.style
        }}
      >
        {animated ? (
          <TouchableWithoutFeedback
            onPress={
              animated ? this.onClickAnimatedClose : this.onClickAnimated
            }
            style={this.props.styleView}
          >
            <View style={this.props.styleView} />
          </TouchableWithoutFeedback>
        ) : (
          <View />
        )}
        <Animated.View
          style={{
            position: "relative",
            height: 70,
            width: 60,
            top: 10
          }}
        >
          {/* {Platform.OS == "android" ? (
            <BoxShadow setting={shadowOpt} />
          ) : (
            <View />
          )} */}
          <View
            style={{
              position: "relative"
            }}
          >
            <TouchableHighlight
              style={styles.button}
              onPress={
                animated
                  ? this.onClickAnimatedCloseWithPlay
                  : this.onClickAnimated
              }
            >
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1.0 }}
                locations={[0, 1.0]}
                colors={[colorStart, colorEnd]}
                style={styles.buttonIcon}
              >
                {/* style={styles.Icon} per avere l'icona play piu centrale, mediante un margine destro  */}
                <OwnIcon
                  style={styles.Icon}
                  name="play-icn"
                  size={48}
                  color="#FFFFFF"
                />
              </LinearGradient>
            </TouchableHighlight>
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: OpacityPublic, // Bind opacity to animated value
            position: "absolute",
            top: 10,
            left: 0,
            transform: [{ translateX: positionX3 }, { translateY: positionY1 }],

            height: 70,
            width: 60
          }}
        >
          {/* {Platform.OS == "android" ? (
            <BoxShadow setting={shadowOpt} />
          ) : (
            <View />
          )} */}
          <View
            style={{
              position: "relative"
            }}
          >
            <TouchableHighlight
              style={styles.button}
              onPress={() => this.handleButtonTrasport("Public", 800, 15)}
            >
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1.0 }}
                locations={[0, 1.0]}
                colors={["#FAB21E", "#FAB21E"]}
                style={styles.buttonIcon}
              >
                <OwnIcon name="bus_btn_icn" size={48} color="#FFFFFF" />
              </LinearGradient>
            </TouchableHighlight>
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: OpacityPublic, // Bind opacity to animated value
            position: "absolute",
            top: 10,
            left: 0,
            transform: [{ translateX: positionX3 }, { translateY: positionY2 }],

            height: 70,
            width: 60
          }}
        >
          <View
            style={{
              position: "relative"
            }}
          >
            <TouchableHighlight
              style={styles.button}
              onPress={() => this.handleButtonTrasport("Public", 400, 15)}
            >
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1.0 }}
                locations={[0, 1.0]}
                colors={["#FAB21E", "#FAB21E"]}
                style={styles.buttonIcon}
              >
                <OwnIcon name="train_btn_icn" size={48} color="#FFFFFF" />
              </LinearGradient>
            </TouchableHighlight>
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: OpacityPublic, // Bind opacity to animated value
            position: "absolute",
            top: 10,
            left: 0,
            transform: [{ translateX: positionX3 }, { translateY: positionY3 }],

            height: 70,
            width: 60
          }}
        >
          <View
            style={{
              position: "relative"
            }}
          >
            <TouchableHighlight
              style={styles.button}
              onPress={() => this.handleButtonTrasport("Public", 1200, 15)}
            >
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1.0 }}
                locations={[0, 1.0]}
                colors={["#FAB21E", "#FAB21E"]}
                style={styles.buttonIcon}
              >
                <OwnIcon name="metro_btn_icn" size={48} color="#FFFFFF" />
              </LinearGradient>
            </TouchableHighlight>
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: this.positionX, // Bind opacity to animated value
            position: "absolute",
            top: 10,
            left: 0,
            transform: [{ translateX: positionX3 }, { translateY: positionY }],

            height: 70,
            width: 60
          }}
        >
          <View
            style={{
              position: "relative"
            }}
          >
            <TouchableHighlight
              style={styles.button}
              onPress={() =>
                this.state.animatedPublic
                  ? this.onClickAnimatedClosePublic()
                  : this.onClickAnimatedPublic()
              }
            >
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1.0 }}
                locations={[0, 1.0]}
                colors={["#FAB21E", "#FAB21E"]}
                style={styles.buttonIcon}
              >
                <OwnIcon name="bus_notbeta_icn" size={48} color="#FFFFFF" />
              </LinearGradient>
            </TouchableHighlight>
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: this.positionX, // Bind opacity to animated value
            position: "absolute",
            top: 10,
            left: 0,
            transform: [{ translateX: positionX }, { translateY: positionY }],

            height: 70,
            width: 60
          }}
        >
          <View
            style={{
              position: "relative"
            }}
          >
            <TouchableHighlight
              style={styles.button}
              onPress={() => this.handleButtonTrasport("Walking", 1200, 5)}
            >
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1.0 }}
                locations={[0, 1.0]}
                colors={["#6CBA7E", "#6CBA7E"]}
                style={styles.buttonIcon}
              >
                <OwnIcon name="walk-icn" size={48} color="#FFFFFF" />
              </LinearGradient>
            </TouchableHighlight>
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: this.positionX, // Bind opacity to animated value
            position: "absolute",
            top: 10,
            left: 0,
            // transform: [{ translateY: positionX }],
            transform: [{ translateX: positionX2 }, { translateY: positionY }],

            height: 70,
            width: 60
          }}
        >
          <View
            style={{
              position: "relative"
            }}
          >
            <TouchableHighlight
              style={styles.button}
              onPress={() => this.handleButtonTrasport("Biking", 800, 10)}
            >
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1.0 }}
                locations={[0, 1.0]}
                colors={["#E83475", "#E83475"]}
                style={styles.buttonIcon}
              >
                <OwnIcon name="bike-icn" size={48} color="#FFFFFF" />
              </LinearGradient>
            </TouchableHighlight>
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: this.positionX, // Bind opacity to animated value
            position: "absolute",
            top: 10,
            left: 0,
            transform: [{ translateX: positionX4 }, { translateY: positionY }],

            height: 70,
            width: 60
          }}
        >
          <View
            style={{
              position: "relative"
            }}
          >
            <TouchableHighlight
              style={styles.button}
              onPress={() => this.handleButtonTrasport("Carpooling", 1200, 5)}
            >
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1.0 }}
                locations={[0, 1.0]}
                colors={["#3363AD", "#3363AD"]}
                style={styles.buttonIcon}
              >
                <OwnIcon name="car_icn" size={48} color="#FFFFFF" />
              </LinearGradient>
            </TouchableHighlight>
          </View>
        </Animated.View>
      </View>
    );
  }

  render() {
    return this.renderButtons();
  }
}

const styles = {
  ballStyle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 25
  },
  overlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: 100
  },
  viewButton: {
    height: 70,
    width: 70,
    backgroundColor: "transparent",
    padding: 5,

    borderBottomWidth: 0
  },
  button: {
    borderRadius: 30,
    height: 60,
    width: 60,

    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",

    flexDirection: "column",
    justifyContent: "center",

    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 3
  },
  buttonIcon: {
    borderRadius: 30,
    height: 60,
    width: 60,
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  },
  buttonIcon2: {
    borderRadius: 100,
    height: 100,
    width: 10,
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  },
  Icon: {
    marginLeft: 4,
    marginTop: 2
  }
};

const withTracking = connect();

export default withTracking(ComponentAnimatedPlayWithAuto);
