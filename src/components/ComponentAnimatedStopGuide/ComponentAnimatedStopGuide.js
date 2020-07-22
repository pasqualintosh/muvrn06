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
  Text
} from "react-native";
import OwnIcon from "../OwnIcon/OwnIcon";
import LinearGradient from "react-native-linear-gradient";

import { connect } from "react-redux";
import { stop, changeActivity } from "./../../domains/tracking/ActionCreators";
import { changeStatusButton } from "./../../domains/login/ActionCreators";
// import { Analytics, Hits as GAHits } from "react-native-google-analytics";
import Settings from "./../../config/Settings";
// import { BoxShadow } from "react-native-shadow";
import InteractionManager from "../../helpers/loadingComponent";
import Aux from "../../helpers/Aux";

import {
  getPlayState,
  getPlayPreviousState
} from "./../../domains/tracking/Selectors";

// componente per avere le icone circolari per selezionare stop o pausa

// props
// selectTrasport metodi per sapere quando deve cambiare i pulsanti usando un altro compoennte tipo
// da play con mezzi a pausa con stop o play o viceversa
// si deve usare quando clicco in uno dei pulsanti relativi ai mezzi o a play o pausa che spuntano dal menu centrale

class ComponentAnimatedStopGuide extends React.Component {
  // setto i valori inziali di posizione x e y e opacita che avranno le icone e che cambieranno nel tempo
  // animated per sapere se devo fare l'animazione
  state = {
    animated: false,
    name: "pause_icn",
    type: this.props.type,
    coef: this.props.coef,
    animatedPublic: false,
    events: {}
  };

  positionX = new Animated.Value(0); // Initial value for opacity: 0

  onClickAnimatedPublic = () => {
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

  // click relativo all'avvio dell'animazione
  onClickAnimated = () => {
    this.setState(prevState => {
      return { name: "stop-icn" };
    });
    //  quando clicco sul tasto play utile per fare il blur,

    // unisco tre animazioni relative a
    // x , y e opacita
    // in 300 ms il valore corrente nello stato deve diventare 100 nel corso del tempo
    // Animated.timing();

    // poi setto che ho fatto l'animazione di apertura nello stato, utile per poi fare quella di chiusura
    this.setState(prevState => {
      return { animated: true };
    });
    this.props.changeGuide({animated3: true})
    Animated.spring(this.positionX, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
      isInteraction: true
    }).start();
  };

  // relativa all'animazione di chiusura
  onClickAnimatedClose = (callback, type, coef, threshold) => {
    this.setState(prevState => {
      return { animated: false, name: "pause_icn", animatedPublic: false };
    });
    // riporto i valori a 0
    Animated.spring(this.positionX, {
      toValue: 0,
      duration: this.state.animatedPublic ? 500 : 250,
      useNativeDriver: true,
      isInteraction: true
    }).start(
      InteractionManager.runAfterInteractions(() => {
        this.props.selectTrasport();
      })
    );
    // cambia il valore dì animated dello stato per dire che ho chiuso il menu con l'animazione di chiusura
  };

  sendEventStop = () => {

  };

  // metodo usato nelle icone che spuntano
  // quindi l'cona centrale ha soltanto l'animazione di chiusura
  // mentre le altre hanno specificato questo metodo che gestisce il cambio icone e l'azione da mandare
  // specificate in onPress delle icone in TouchableHighlight
  // specificando l'azione o il tipo di payload
  handleAction = (type, coef, threshold) => {
    // chiudo l'animazione
    this.onClickAnimatedClose(this.stopOrChange, type, coef, threshold);
    // non ci deve essere piu stop ma cambia mezzo se l'utente ha cliccato su un mezzo
    // lo stop e solo nel tasto centrale

    // quindi dipende se specifico il mezzo

    //
  };

  stopOrChange = (type, coef, threshold) => {
    if (type) {
      this.props.selectTrasport();
      // this.props.dispatch(changeActivity(type, coef, threshold));
    } else {
      this.props.selectTrasport();
      // this.props.dispatch(stop());
    }
    // this.sendEventStop();
  };

  renderWavyArea() {
    // aggiungo l'onda se android
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

  // quando premo un icona deve fare delle azioni differenti a seconda il contesto, ovvero andare verso l'alto oppure verso il basso attivando l'azione per il tracciamento
  handleButtonTrasport = (type, coef, threshold) => {
    if (this.state.animated) {
      if (type === this.state.type) {
        if (type === "Public" && coef != this.state.coef) {
          // stessa tipologia ma diverso mezzo
          this.handleAction(type, coef, threshold);
          this.setState({ type, coef });
        } else {
          // ovvero ha scelto lo stesso mezzo
          // quindi devo solo chiudere il popup
          this.onClickAnimatedClose();
        }
      } else {
        // qui dovrei implementare il cambio mezzi
        this.handleAction(type, coef, threshold);
        this.setState({ type, coef });
      }

      // manda l'azione
    } else {
      this.onClickAnimated();
    }
  };

  handleActionStop = () => {
    // chiudo l'animazione
    this.onClickAnimatedClose(this.props.selectTrasport);
    // this.props.dispatch(stop());
    // ora posso cambiare il set di pulsante chiamando la props passata
    // ma dopo che ha terminato l'animazione ovvero 300
    // questa funzione deve essere chiamata nel metodo relativo alle icone dei mezzi o stop e pausa
    // che chimano sia il termina animazione sia il timer cosi quando conclude l'animazione cambia

    // manda l'azione
  };

  threeButtons = (
    animated,
    positionX2,
    positionX,
    IsPublic,
    name,
    publicButton
  ) => {
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
            <BoxShadow
              setting={{
                height: 60,
                width: 60,
                color: "#111",
                border: 0,
                radius: 30,
                opacity: 0.15,
                x: 0,
                y: 0,
                overflow: "hidden",
                style: {
                  marginVertical: 0.5,
                  position: "absolute",
                  top: 0,
                  right: 0,
                  overflow: "hidden"
                }
              }}
            />
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
              onPress={animated ? this.handleActionStop : this.onClickAnimated}
            >
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1.0 }}
                locations={[0, 1.0]}
                colors={["#7d4d99", "#6497cc"]}
                style={styles.buttonIcon}
              >
                <OwnIcon name={name} size={48} color="#FFFFFF" />
              </LinearGradient>
            </TouchableHighlight>
          </View>
        </Animated.View>
        {publicButton}
        <Animated.View
          style={{
            opacity: this.positionX, // Bind opacity to animated value
            position: "absolute",
            top: 10,
            left: 0,
            transform: [{ translateX: positionX2 }, { translateY: positionX }],
            height: 70,
            width: 60
          }}
        >
          {/* {Platform.OS == "android" ? (
            <BoxShadow
              setting={{
                height: 60,
                width: 60,
                color: "#111",
                border: 0,
                radius: 30,
                opacity: 0.15,
                x: 0,
                y: 0,
                overflow: "hidden",
                style: {
                  marginVertical: 0.5,
                  position: "absolute",
                  top: 0,
                  right: 0,
                  overflow: "hidden"
                }
              }}
            />
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
                <OwnIcon
                  style={
                    IsPublic
                      ? {
                          marginLeft: 4,
                          marginTop: 2
                        }
                      : {}
                  }
                  name={IsPublic ? "play-icn" : "bus_notbeta_icn"}
                  size={48}
                  color="#FFFFFF"
                />
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
            transform: [{ translateX: positionX }, { translateY: positionX }],
            height: 70,
            width: 60
          }}
        >
          {/* {Platform.OS == "android" ? (
            <BoxShadow
              setting={{
                height: 60,
                width: 60,
                color: "#111",
                border: 0,
                radius: 30,
                opacity: 0.15,
                x: 0,
                y: 0,
                overflow: "hidden",
                style: {
                  marginVertical: 0.5,
                  position: "absolute",
                  top: 0,
                  right: 0,
                  overflow: "hidden"
                }
              }}
            />
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
              onPress={() => this.handleButtonTrasport("Walking", 1200, 5)}
            >
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1.0 }}
                locations={[0, 1.0]}
                colors={["#6CBA7E", "#6CBA7E"]}
                style={styles.buttonIcon}
              >
                <OwnIcon
                  style={
                    "Walking" === this.state.type
                      ? {
                          marginLeft: 4,
                          marginTop: 2
                        }
                      : {}
                  }
                  name={"Walking" === this.state.type ? "play-icn" : "walk-icn"}
                  size={48}
                  color="#FFFFFF"
                />
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
            transform: [{ translateY: positionX }],
            height: 70,
            width: 60
          }}
        >
          {/* {Platform.OS == "android" ? (
            <BoxShadow
              setting={{
                height: 60,
                width: 60,
                color: "#111",
                border: 0,
                radius: 30,
                opacity: 0.15,
                x: 0,
                y: 0,
                overflow: "hidden",
                style: {
                  marginVertical: 0.5,
                  position: "absolute",
                  top: 0,
                  right: 0,
                  overflow: "hidden"
                }
              }}
            />
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
              onPress={() => this.handleButtonTrasport("Biking", 800, 10)}
            >
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1.0 }}
                locations={[0, 1.0]}
                colors={["#E83475", "#E83475"]}
                style={styles.buttonIcon}
              >
                <OwnIcon
                  style={
                    "Biking" === this.state.type
                      ? {
                          marginLeft: 4,
                          marginTop: 2
                        }
                      : {}
                  }
                  name={"Biking" === this.state.type ? "play-icn" : "bike-icn"}
                  size={48}
                  color="#FFFFFF"
                />
              </LinearGradient>
            </TouchableHighlight>
          </View>
        </Animated.View>
      </View>
    );
  };

  renderButtons() {
    // prendo dallo stato l'occorrente
    let { animated, play, name, coef } = this.state;
    const positionX = this.positionX.interpolate({
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

    const IsPublic = "Public" === this.state.type;
    // a seconda di quale coef ho, devo disabilitare la modalità corrente e cambiare le animazioni
    if (IsPublic) {
      if (coef === 1200) {
        // metro quindi non ci deve essere
        const positionY2 = this.positionX.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [0, -100, -250]
        });
        const positionY3 = this.positionX.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [0, -100, -325]
        });
        const positionX2 = this.positionX.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [0, 100, 100]
        });
        const publicButton = (
          <Aux>
            <Animated.View
              style={{
                opacity: OpacityPublic, // Bind opacity to animated value
                position: "absolute",
                top: 10,
                left: 0,
                transform: [
                  { translateX: positionX2 },
                  { translateY: positionY1 }
                ],
                height: 70,
                width: 60
              }}
            >
              {/* {Platform.OS == "android" ? (
            <BoxShadow
              setting={{
                height: 60,
                width: 60,
                color: "#111",
                border: 0,
                radius: 30,
                opacity: 0.15,
                x: 0,
                y: 0,
                overflow: "hidden",
                style: {
                  marginVertical: 0.5,
                  position: "absolute",
                  top: 0,
                  right: 0,
                  overflow: "hidden"
                }
              }}
            />
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
                transform: [
                  { translateX: positionX2 },
                  { translateY: positionY2 }
                ],
                height: 70,
                width: 60
              }}
            >
              {/* {Platform.OS == "android" ? (
            <BoxShadow
              setting={{
                height: 60,
                width: 60,
                color: "#111",
                border: 0,
                radius: 30,
                opacity: 0.15,
                x: 0,
                y: 0,
                overflow: "hidden",
                style: {
                  marginVertical: 0.5,
                  position: "absolute",
                  top: 0,
                  right: 0,
                  overflow: "hidden"
                }
              }}
            />
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
          </Aux>
        );

        return this.threeButtons(
          animated,
          positionX2,
          positionX,
          IsPublic,
          name,
          publicButton
        );
      } else if (coef === 800) {
        // autobus quindi non ci deve essere
        const positionY2 = this.positionX.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [0, -100, -250]
        });
        const positionX2 = this.positionX.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [0, 100, 100]
        });
        const publicButton = (
          <Aux>
            <Animated.View
              style={{
                opacity: OpacityPublic, // Bind opacity to animated value
                position: "absolute",
                top: 10,
                left: 0,

                transform: [
                  { translateX: positionX2 },
                  { translateY: positionY1 }
                ],
                height: 70,
                width: 60
              }}
            >
              {/* {Platform.OS == "android" ? (
            <BoxShadow
              setting={{
                height: 60,
                width: 60,
                color: "#111",
                border: 0,
                radius: 30,
                opacity: 0.15,
                x: 0,
                y: 0,
                overflow: "hidden",
                style: {
                  marginVertical: 0.5,
                  position: "absolute",
                  top: 0,
                  right: 0,
                  overflow: "hidden"
                }
              }}
            />
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
                transform: [
                  { translateX: positionX2 },
                  { translateY: positionY2 }
                ],
                height: 70,
                width: 60
              }}
            >
              {/* {Platform.OS == "android" ? (
            <BoxShadow
              setting={{
                height: 60,
                width: 60,
                color: "#111",
                border: 0,
                radius: 30,
                opacity: 0.15,
                x: 0,
                y: 0,
                overflow: "hidden",
                style: {
                  marginVertical: 0.5,
                  position: "absolute",
                  top: 0,
                  right: 0,
                  overflow: "hidden"
                }
              }}
            />
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
          </Aux>
        );

        return this.threeButtons(
          animated,
          positionX2,
          positionX,
          IsPublic,
          name,
          publicButton
        );
      } else {
        const positionY2 = this.positionX.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [0, -100, -250]
        });

        const positionX2 = this.positionX.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [0, 100, 100]
        });
        const publicButton = (
          <Aux>
            <Animated.View
              style={{
                opacity: OpacityPublic, // Bind opacity to animated value
                position: "absolute",
                top: 10,
                left: 0,
                transform: [
                  { translateX: positionX2 },
                  { translateY: positionY1 }
                ],
                height: 70,
                width: 60
              }}
            >
              {/* {Platform.OS == "android" ? (
            <BoxShadow
              setting={{
                height: 60,
                width: 60,
                color: "#111",
                border: 0,
                radius: 30,
                opacity: 0.15,
                x: 0,
                y: 0,
                overflow: "hidden",
                style: {
                  marginVertical: 0.5,
                  position: "absolute",
                  top: 0,
                  right: 0,
                  overflow: "hidden"
                }
              }}
            />
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
                transform: [
                  { translateX: positionX2 },
                  { translateY: positionY2 }
                ],
                height: 70,
                width: 60
              }}
            >
              {/* {Platform.OS == "android" ? (
            <BoxShadow
              setting={{
                height: 60,
                width: 60,
                color: "#111",
                border: 0,
                radius: 30,
                opacity: 0.15,
                x: 0,
                y: 0,
                overflow: "hidden",
                style: {
                  marginVertical: 0.5,
                  position: "absolute",
                  top: 0,
                  right: 0,
                  overflow: "hidden"
                }
              }}
            />
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
          </Aux>
        );

        return this.threeButtons(
          animated,
          positionX2,
          positionX,
          IsPublic,
          name,
          publicButton
        );
      }
    } else {
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
      const positionX2 = this.positionX.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 100, 100]
      });
      const publicButton = (
        <Aux>
          <Animated.View
            style={{
              opacity: OpacityPublic, // Bind opacity to animated value
              position: "absolute",
              top: 10,
              left: 0,
              transform: [
                { translateX: positionX2 },
                { translateY: positionY1 }
              ],
              height: 70,
              width: 60
            }}
          >
            {/* {Platform.OS == "android" ? (
        <BoxShadow
          setting={{
            height: 60,
            width: 60,
            color: "#111",
            border: 0,
            radius: 30,
            opacity: 0.15,
            x: 0,
            y: 0,
            overflow: "hidden",
            style: {
              marginVertical: 0.5,
              position: "absolute",
              top: 0,
              right: 0,
              overflow: "hidden"
            }
          }}
        />
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
              transform: [
                { translateX: positionX2 },
                { translateY: positionY2 }
              ],
              height: 70,
              width: 60
            }}
          >
            {/* {Platform.OS == "android" ? (
        <BoxShadow
          setting={{
            height: 60,
            width: 60,
            color: "#111",
            border: 0,
            radius: 30,
            opacity: 0.15,
            x: 0,
            y: 0,
            overflow: "hidden",
            style: {
              marginVertical: 0.5,
              position: "absolute",
              top: 0,
              right: 0,
              overflow: "hidden"
            }
          }}
        />
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
              transform: [
                { translateX: positionX2 },
                { translateY: positionY3 }
              ],
              height: 70,
              width: 60
            }}
          >
            {/* {Platform.OS == "android" ? (
        <BoxShadow
          setting={{
            height: 60,
            width: 60,
            color: "#111",
            border: 0,
            radius: 30,
            opacity: 0.15,
            x: 0,
            y: 0,
            overflow: "hidden",
            style: {
              marginVertical: 0.5,
              position: "absolute",
              top: 0,
              right: 0,
              overflow: "hidden"
            }
          }}
        />
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
        </Aux>
      );

      return this.threeButtons(
        animated,
        positionX2,
        positionX,
        IsPublic,
        name,
        publicButton
      );
    }

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
    //     border: 8,
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

    // <TouchableWithoutFeedback disabled={!animated} ovvero una view per avere una view tutto schermo e cosi se clicco
    // fuori la grigia si chiude l'animazione dei pulsanti
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
  }
};

const withTracking = connect(state => {
  // se l'attivita è stata settata allra deve spuntare il tasto stop e non il play

  return {
    play: getPlayState(state),
    playPrevious: getPlayPreviousState(state)
  };
});

export default withTracking(ComponentAnimatedStopGuide);
