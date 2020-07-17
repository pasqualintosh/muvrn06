import React, { Component } from "react";

import ComponentAnimatedPlayGuide from "../ComponentAnimatedPlayGuide/ComponentAnimatedPlayGuide";

import {
  Text,
  View,
  Dimensions,
  PixelRatio,
  Platform,
  TouchableWithoutFeedback,
  TouchableHighlight
} from "react-native";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

import Aux from "../../helpers/Aux";


import TrackGuide from "../../components/TrackGuide/TrackGuide";
import ComponentAnimatedStopGuide from "../../components/ComponentAnimatedStopGuide/ComponentAnimatedStopGuide";

class ButtonPlayOrStopGuide extends React.Component {
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
      coef: 0,
      animatedStop: false,
      stop: false,
      end: false
    };
  }

  componentDidMount() {
    this.props.updateModal()
  }

  changeGuide = state => {
    this.setState(state);
  };

  // relativo al cambio di pulsante con play o stop
  // controllo se il gps è attivo, altrimenti il cambio dell'icona con stop non deve cambiare
  // ovviamente se è gia attivo non c'e bisogno che controllo lo status ma controllo il play ovvero è gia stato attivato una volta
  handleChangeButton = (type, coef, threshold, navigation) => {
    this.setState({ type, coef });
  };

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

  nextTutorial2 = () => {
    this.setState({
      stop: true
    });
  };

  nextTutorial3 = () => {
    this.setState({
      end: true
    });
  };

  render() {
    return (
      <Aux>
        {this.state.end ? <Aux>
            <View
              style={{
                position: "absolute",
                width: Dimensions.get("window").width,
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",

                top: 20 + this.state.extra + 55
                
              }}
            >
              <View
                style={{
                  width: Dimensions.get("window").width * 0.8,
                  justifyContent: "center",
                  flexDirection: "column",
                  alignContent: "center",
                  alignItems: "center",


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
                    // fontWeight: "bold",

                    marginBottom: 5,
                    fontSize: 32
                  }}
                >
                
                {"you nailed it!\nnow it’s time for you\nto train".toUpperCase()}
                </Text>
                <OwnIcon
                        name="training_icn_active"
                        size={30}
                        color={"#ffffff"}
                      />
                      <Text
                  style={{
                    fontFamily:
                      Platform.OS === "ios"
                        ? "MoonFlowerBold"
                        : "MoonFlower-Bold",
                    textAlign: "center",
                    color: "white",
                    // fontWeight: "bold",

                    marginBottom: 5,
                    fontSize: 32
                  }}
                >
                
                {"crush the weekly challenges".toUpperCase()}
                </Text>
                <OwnIcon
                        name="weekly_icn_active"
                        size={30}
                        color={"#ffffff"}
                      />
                      <Text
                  style={{
                    fontFamily:
                      Platform.OS === "ios"
                        ? "MoonFlowerBold"
                        : "MoonFlower-Bold",
                    textAlign: "center",
                    color: "white",
                    // fontWeight: "bold",

                    marginBottom: 5,
                    fontSize: 32
                  }}
                >
                
                {"and win the Tournaments".toUpperCase()}
                </Text>
                <OwnIcon
                        name="sct_icn_active"
                        size={30}
                        color={"#ffffff"}
                      />
                
               
                   
              
              
               
                
               
              
                
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
                      onPress={this.props.closeTutorial}
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
              </Aux> : this.state.stop ? (
          <Aux>
            <View
              style={{
                position: "absolute",
                width: Dimensions.get("window").width,
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: Dimensions.get("window").height,
                // top: 20 + this.state.extra + 55
                
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
                    // fontWeight: "bold",

                    marginBottom: 5,
                    fontSize: 32
                  }}
                >
               {this.state.animated3
                ? "to switch your mobility system\nor stop the trip"
                : "while recording a trip\nyou can pause it".toUpperCase()}
                </Text>
              </View>
            </View>
            <ComponentAnimatedStopGuide
              type={this.state.type}
              coef={this.state.coef}
              closeTutorial={this.props.closeTutorial}
              style={{
                ...this.state.style
              }}
              selectTrasport={() => {
                this.nextTutorial3()
                // this.props.closeTutorial();
              }}
              styleView={{
                position: "absolute",
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
                left: -(Dimensions.get("window").width / 2) + 30,
                opacity: 0,
                bottom: -18 - this.state.extra
              }}
              playPrevious={"Walking"}
              changeGuide={this.changeGuide}
            />
          </Aux>
        ) : this.state.type.length ? (
          <TrackGuide
            closeTutorial={this.props.closeTutorial}
            type={this.state.type}
            coef={this.state.coef}
            nextTutorial2={this.nextTutorial2}
          ></TrackGuide>
        ) : (
          <Aux>
            <View
              style={{
                position: "absolute",
                width: Dimensions.get("window").width,
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: Dimensions.get("window").height,

                // // top: 20 + this.state.extra + 55
                // bottom:
                //   Platform.OS === "ios"
                //     ? -18 - this.state.extra + 500
                //     : -18 + 430
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
                    // fontWeight: "bold",

                    marginBottom: 5,
                    fontSize: 32
                  }}
                >
                  {this.state.animated
                    ? "SELECT WITH WHICH MOBILITY SYSTEM YOU’RE GOING TO MOVE"
                    : "Hello muver,\nwe are glade\nto introduce you\nto your new sport\nfundamentals.\n\nPlease press\n“play”"}
                </Text>
              </View>
            </View>
            <ComponentAnimatedPlayGuide
              style={{
                ...this.state.style
              }}
              selectTrasport={this.handleChangeButton}
              // selectTrasport={() => {
              
              //   this.props.closeTutorial();

              // }}
              styleView={{
                position: "absolute",
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
                left: -(Dimensions.get("window").width / 2) + 30,
                opacity: 0,
                bottom: -18 - this.state.extra
              }}
              playPrevious={"Walking"}
              changeGuide={this.changeGuide}
            />
          </Aux>
        )}
       
        <TouchableWithoutFeedback
          onPress={() => {
           
            this.props.closeTutorial();
          }}
        >
          <View
            style={{
              position: "absolute",
              width: Dimensions.get("window").width,
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",

              top: 20 + this.state.extra,
              left: Dimensions.get("window").width - 60,
              height: 44,
              width: 44,
              borderRadius: 22,
              backgroundColor: "#FC6754"
            }}
          >
            <OwnIcon
              name="modal_close_icn"
              size={32}
              color="white"
              click={() => {
                
                this.props.closeTutorial();
              }}
              // style={{ marginTop: -40}}
            />
          </View>
        </TouchableWithoutFeedback>
      </Aux>
    );
  }
}

export default ButtonPlayOrStopGuide;
