import React, { Component } from "react";

import ComponentAnimatedPlayGuide from "../ComponentAnimatedPlayGuide/ComponentAnimatedPlayGuide";

import {
  Text,
  View,
  Dimensions,
  PixelRatio,
  Platform,
  ImageBackground,
  Image,
  TouchableHighlight
} from "react-native";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

import { modalSplitImage } from "./../../screens/Track/Track";
import IntermittentPointer from "../../components/IntermittentPointer/IntermittentPointer";
import AnimateNumber from "react-native-animate-number";

import Aux from "../../helpers/Aux";
import { Header } from "react-navigation";



class TrackGuide extends React.Component {
  // play: per sapere se sono in modalita di play con il tipo di mezzo o di pausa con stop e riprendi
  constructor() {
    // Dimensions.get("window").width / 2 - 30
    // ovvero centro - 30 poiche il bottone è 60 di dimensioni
    // prendo altezza e larghezza dello schermo

    const { height, width } = Dimensions.get("window");
    // eventuale extra per sollevare l'onda sopra se si sta usando un dispositivo con tacca
    let extra = 0;
    // onda piu grande su plus o su altri device
    let heightPlus = 0;
    let style = {
      bottom: 15,
      left: width / 2 - 30
    };

    // stile per creare il layer sotto ai pulsanti cosi se si clicca fuori i pulsanti, si avvia la chiusura dei mezzi
    const LayerButton = {
      position: "absolute",
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
      left: -(width / 2) + 30,
      opacity: 0
    };
    /* if (Platform.OS === "android") {
      style = {
        bottom: 18,
        left: width / 2 - 30
      };
      extra = -20;
    } */

    // iphone plus per mettere il pulsante un po sopra, avendo l'onda piu grande
    if (Platform.OS === "ios" && PixelRatio.get() === 3) {
      style = {
        bottom: 26,
        left: width / 2 - 30
      };
    }

    // android, metto l'onda un po piu sopra
    if (Platform.OS !== "ios") {
      extra = 2;
    }

    // iphone x, x max
    if (
      Platform.OS === "ios" &&
      (height === 812 || width === 812 || (height === 896 || width === 896))
    ) {
      extra = 35;
      style = {
        bottom: 18 + extra,
        left: width / 2 - 30
      };
    }
    super();
    this.state = {
      play: false,
      type: "",
      Button: null,
      extra,
      style,
      LayerButton,
      animated: false,
      animatedPublic: false,
      modalSplitIndex: 0,
      points: 0,
      r: 0,
      b: 0,
      g: 0,
      animated2: false,
      animated: false
    };
  }

  componentWillMount() {
    let r;
    let g;
    let b;

    let modalSplitIndex = 0;

    switch (this.props.type) {
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
        if (this.props.coef === 800) {
          r = 250;
          g = 178;
          b = 30;
          modalSplitIndex = 2;
        } else if (this.props.coef === 1200) {
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
    this.setState({ colors, modalSplitIndex, r, b, g });
    setTimeout(() => {
      this.setState({ points: 150, animated: true });
      // setTimeout(() => {
      //   this.setState({ animated2: true });
      // }, 5000);
    }, 2500);
  }

  nextTutorial = () => {
    this.setState({ animated2: true });
  };

  nextTutorial2 = () => {
    this.props.nextTutorial2()
  }

  changeGuide = state => {
    this.setState(state);
  };

  // relativo al cambio di pulsante con play o stop
  // controllo se il gps è attivo, altrimenti il cambio dell'icona con stop non deve cambiare
  // ovviamente se è gia attivo non c'e bisogno che controllo lo status ma controllo il play ovvero è gia stato attivato una volta
  handleChangeButton = (type, coef, threshold, navigation) => {};

  //   MODAL_SPLIT_CHOICES
  // (0, ''),
  // (1, 'Walking')
  // (2, 'Biking')
  // (3, 'Public')
  // (4, 'Pooling')
  // (5, 'Car')
  // (6, 'Motorbike')
  // (7, ‘Train’)
  // (8, ‘Metro’)
  // (9, ‘Bus_Tram’)

  // style={{
  //   ...this.props.style
  // }}
  // selectTrasport={this.handleChangeButton}
  // styleView={this.props.styleView}
  // navigation={this.props.navigation}
  // playPrevious={this.props.playPrevious}

  renderModalSplitImage(index, points, bg) {
    return (
      <View style={{ marginTop: 50 + Header.HEIGHT }}>
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
            {/* <IntermittentPointer
              styles={[
                styles.livePointer,
                { backgroundColor: bg, opacity: 0 }
              ]}
              updateCurrentTimeAnimation={() =>
                this.updateCurrentTimeAnimation()
              }
            /> */}
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

  render() {
    return (
      <Aux>
        {!this.state.animated2 ? (
          <Aux>
            <View
              style={{
                position: "absolute",
                width: Dimensions.get("window").width,
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",

                top: 20 + this.state.extra + 400
              }}
            >
              <View
                style={{
                  width: Dimensions.get("window").width * 0.8
                }}
              >
                <Text
                  style={{
                    fontFamily:
                      Platform.OS === "ios"
                        ? "MoonFlowerBold"
                        : "MoonFlower-Bold",
                    textAlign: "center",
                    color: "white",
                    marginBottom: 5,
                    fontSize: 32
                  }}
                >
                  {this.state.animated
                    ? "the greener it is,\nmost point you get.".toUpperCase()
                    : "NOW THE APP IS TRACKING YOUR TRIP…"}
                </Text>
              </View>
            </View>

            {this.renderModalSplitImage(
              this.state.modalSplitIndex,
              this.state.points,
              `rgba(${this.state.r}, ${this.state.g}, ${this.state.b}, 1)`
            )}
            {this.state.animated ? (
              <View
                style={{
                  position: "absolute",

                  bottom: 18 + this.state.extra,
                  left: Dimensions.get("window").width / 2 - 30
                }}
              >
                <View
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
                      style={{
                        
                        height: 60,
                        width: 60,

                        alignContent: "center",
                        alignItems: "center",
                        alignSelf: "center",

                        flexDirection: "column",
                        justifyContent: "center",

                       
                      }}
                      onPress={this.nextTutorial}
                    >
                      <OwnIcon
                        name="arrow_tutorial"
                        size={40}
                        color={"#ffffff"}
                      />
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            ) : (
              <View />
            )}
          </Aux>
        ) : (
          <Aux>
            <View
              style={{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
                alignContent: "center",
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column"

                // position: "absolute",
                // bottom: 150
              }}
            >
              <View
                style={{
                  width: Dimensions.get("window").width * 0.8,
                  paddingTop: 50,
                  paddingBottom: 50
                }}
              >
                <Text
                  style={{
                    fontFamily:
                      Platform.OS === "ios"
                        ? "MoonFlowerBold"
                        : "MoonFlower-Bold",
                    textAlign: "center",
                    color: "white",
                    marginBottom: 5,
                    fontSize: 32
                  }}
                >
                  {"but points depend also\nto weather conditions,\npeak hours and\nfrequency of playing".toUpperCase()}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  width: Dimensions.get("window").width * 0.8,

                  backgroundColor: "white",
                  borderRadius: 15,
                  margin: 30,
                  paddingTop: 10,
                  paddingBottom: 10

                  // position: "absolute",
                  // bottom: 150
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
                      size={40}
                      color={"rgba(61, 61, 61, 1)"}
                    />
                  </View>
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
                      name="rush_hour_icn"
                      size={40}
                      color={"rgba(61, 61, 61, 1)"}
                    />
                  </View>
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
                      size={40}
                      color={"rgba(61, 61, 61, 1)"}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View
                style={{
                  position: "absolute",

                  bottom: 18 + this.state.extra,
                  left: Dimensions.get("window").width / 2 - 30
                }}
              >
                <View
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
                      style={{
                       
                        height: 60,
                        width: 60,

                        alignContent: "center",
                        alignItems: "center",
                        alignSelf: "center",

                        flexDirection: "column",
                        justifyContent: "center",

                       
                      }}
                      onPress={this.nextTutorial2}
                    >
                      <OwnIcon
                        name="arrow_tutorial"
                        size={40}
                        color={"#ffffff"}
                      />
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
          </Aux>
        )}
      </Aux>
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

export default TrackGuide;
