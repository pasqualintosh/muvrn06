import React, { Component } from "react";

import ComponentAnimatedPlayGuide from "../ComponentAnimatedPlayGuide/ComponentAnimatedPlayGuide";

import {
  Text,
  View,
  Dimensions,
  PixelRatio,
  Platform,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Image
} from "react-native";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

import Aux from "../../helpers/Aux";
import RecapActivityLoading from "../../components/RecapActivityLoading/RecapActivityLoading";

import TrackGuide from "../../components/TrackGuide/TrackGuide";
import ComponentAnimatedStopGuide from "../../components/ComponentAnimatedStopGuide/ComponentAnimatedStopGuide";
import { strings } from "../../config/i18n";
import WavyArea from "../../components/WavyArea/WavyArea";
import UserItem from "../../components/UserItem/UserItem";
import ChallengeTrainingContainer from "./../../components/ChallengeTrainingContainer/ChallengeTrainingContainer";
import InfoTutorialUserHome from "./../../components/InfoTutorialUserHome/InfoTutorialUserHome";

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
      (height === 812 || width === 812 || height === 896 || width === 896)
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
      end: false,
      tab: false,
      standing: false,
      challenges: false,
      challengesActive: false,
      tournament: false,
      recapUser: false
    };
  }

  componentDidMount() {
    this.props.updateModal();
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

  nextTutorialTab = () => {
    this.setState({
      tab: true
    });
  };

  nextTutorialTab = () => {
    this.setState({
      tab: true
    });
  };

  nextTutorialStanding = () => {
    this.setState({
      standing: true
    });
  };

  nextTutorialChallenges = () => {
    this.setState({
      challenges: true
    });
  };

  nextTutorialChallengesActive = () => {
    this.setState({
      challengesActive: true
    });
  };

  nextTutorialTournament = () => {
    this.setState({
      tournament: true
    });
  };

  nextTutorialRecapUser = () => {
    this.setState({
      recapUser: true
    });
  };

  getCountdownTxt = (days_txt, hours_txt, min_txt, checkDay) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <OwnIcon name="timer_icn" size={20} color={"#FC6754"} />
        <View style={{ width: 5, height: 5 }} />
        <Text style={styles.countdownTxt}>
          <Text style={styles.countdownBoldTxt}>{"3 " + days_txt}</Text>
          {" " + strings("id_4_08")}
        </Text>
      </View>
    );
  };

  renderCountdown() {
    let days_txt = strings("id_4_02");

    return (
      <View
        style={[
          styles.selectableHeaderBlock,
          {
            backgroundColor: "#fff"
          }
        ]}
      >
        <View style={{ height: 5 }} />
        <View style={styles.HeaderTimer}>
          {this.getCountdownTxt(days_txt, 0, 0, 0)}
        </View>
        <View style={{ height: 5 }} />
      </View>
    );
  }

  render() {
    return (
      <Aux>
        {this.state.recapUser ? (
          <Aux>
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
                  height:
                    Dimensions.get("window").height -
                    (20 + this.state.extra + 55 + 70),
                  justifyContent: "flex-start",
                  flexDirection: "column"
                }}
              >
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.95,
                    // height: Dimensions.get("window").height - 100,
                    justifyContent: "center",
                    flexDirection: "column",
                    alignContent: "center",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      width: Dimensions.get("window").width * 0.95,
                      // height: Dimensions.get("window").height - 100,
                      justifyContent: "center",
                      flexDirection: "column",
                      alignContent: "center",
                      alignItems: "center",
                      marginTop: 5
                    }}
                  >
                    <View
                      style={{
                        // height: Dimensions.get("window").height - 100,
                        justifyContent: "center",
                        flexDirection: "column",
                        alignContent: "center",
                        alignItems: "center",
                        marginTop: 10
                      }}
                    >
                      <InfoTutorialUserHome />

                      <Text
                        style={{
                          fontFamily:
                            Platform.OS === "ios"
                              ? "MoonFlowerBold"
                              : "MoonFlower-Bold",
                          textAlign: "center",
                          color: "white",
                          // fontWeight: "bold",

                          fontSize: 32,
                          marginTop: 20,
                          alignSelf: "center"
                        }}
                      >
                        {strings("id_16_14")}
                      </Text>
                    </View>
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
                      justifyContent: "center"
                    }}
                    // onPress={this.props.closeTutorial}
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
          </Aux>
        ) : this.state.tournament ? (
          <Aux>
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
                  height:
                    Dimensions.get("window").height -
                    (20 + this.state.extra + 55 + 70),
                  justifyContent: "flex-start",
                  flexDirection: "column"
                }}
              >
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.95,
                    // height: Dimensions.get("window").height - 100,
                    justifyContent: "center",
                    flexDirection: "column",
                    alignContent: "center",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      width: Dimensions.get("window").width * 0.95,
                      // height: Dimensions.get("window").height - 100,
                      justifyContent: "center",
                      flexDirection: "column",
                      alignContent: "center",
                      alignItems: "center",
                      marginTop: 5
                    }}
                  >
                    <View
                      style={{
                        // height: Dimensions.get("window").height - 100,
                        justifyContent: "center",
                        flexDirection: "column",
                        alignContent: "center",
                        alignItems: "center",
                        marginTop: 10
                      }}
                    >
                    <View  style={{
                          width: Dimensions.get("window").width * 0.6,
                          height: Dimensions.get("window").width * 0.6,
                          backgroundColor: '#7562A7',
                          borderRadius: Dimensions.get("window").width * 0.3,
                          alignContent: 'center',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingBottom: 20
                        }}>
                      <Image
                        source={require("./../../assets/images/tournament_empty.png")}
                        style={{
                          width: Dimensions.get("window").width * 0.5,
                          height: Dimensions.get("window").width * 0.5
                        }}
                      />
                      </View>
                      <Text
                        style={{
                          fontFamily:
                            Platform.OS === "ios"
                              ? "MoonFlowerBold"
                              : "MoonFlower-Bold",
                          textAlign: "center",
                          color: "white",
                          // fontWeight: "bold",

                          fontSize: 32,
                          marginTop: 10,
                          alignSelf: "center"
                        }}
                      >
                        {strings("id_16_13")}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: Dimensions.get("window").width * 0.95,
                        // height: Dimensions.get("window").height - 100,
                        justifyContent: "center",
                        flexDirection: "row",
                        alignContent: "center"
                      }}
                    >
                      <View
                        style={{
                          // height: Dimensions.get("window").height - 100,
                          justifyContent: "center",
                          flexDirection: "row",
                          alignContent: "center",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "row",
                          alignContent: "center",
                          alignItems: "center",
                          backgroundColor: "#ffffff",
                          marginTop: 15,
                          height: 40,
                          width: 40,
                          borderRadius: 20
                        }}
                      >
                        <OwnIcon
                          name="sct_icn_active"
                          size={22}
                          color={"#ED6B6F"}
                        />
                      </View>
                    </View>
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
                      justifyContent: "center"
                    }}
                    // onPress={this.props.closeTutorial}
                    onPress={this.nextTutorialRecapUser}
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
        ) : this.state.challengesActive ? (
          <Aux>
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
                  height:
                    Dimensions.get("window").height -
                    (20 + this.state.extra + 55 + 70),
                  justifyContent: "flex-start",
                  flexDirection: "column"
                }}
              >
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.95,
                    // height: Dimensions.get("window").height - 100,
                    justifyContent: "flex-start",
                    flexDirection: "column",
                    alignContent: "center"
                  }}
                >
                  <View
                    style={{
                      width: Dimensions.get("window").width * 0.95,
                      // height: Dimensions.get("window").height - 100,
                      justifyContent: "flex-start",
                      flexDirection: "column",
                      alignContent: "center",

                      marginTop: 5
                    }}
                  >
                    <View
                      style={{
                        // height: Dimensions.get("window").height - 100,
                        justifyContent: "flex-start",
                        flexDirection: "column",
                        alignContent: "center",
                        marginTop: 10
                      }}
                    >
                      <View
                        style={{
                          width: Dimensions.get("window").width * 0.95,
                          // height: Dimensions.get("window").height - 100,
                          justifyContent: "center",
                          flexDirection: "column",
                          alignContent: "center",
                          alignItems: "center",
                          backgroundColor: "#ffffff",
                          marginTop: 10,
                          borderRadius: 20,
                          paddingBottom: 5
                        }}
                      >
                        <View
                          style={[
                            styles.topTextContainer,
                            styles.marginContainer
                          ]}
                        >
                          <Text style={styles.topText}>
                            {strings("id_3_02").toUpperCase()}
                          </Text>
                        </View>

                        <View style={styles.marginContainer} />
                        <ChallengeTrainingContainer
                          navigation={null}
                          active={true}
                          name={"Schiaccia il pedale... "}
                          challenge={null}
                        />
                      </View>
                      <Text
                        style={{
                          fontFamily:
                            Platform.OS === "ios"
                              ? "MoonFlowerBold"
                              : "MoonFlower-Bold",
                          textAlign: "center",
                          color: "white",
                          // fontWeight: "bold",

                          fontSize: 32,
                          marginTop: 10,
                          alignSelf: "center"
                        }}
                      >
                        {strings("id_16_12")}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: Dimensions.get("window").width * 0.95,
                        // height: Dimensions.get("window").height - 100,
                        justifyContent: "center",
                        flexDirection: "row",
                        alignContent: "center"
                      }}
                    >
                      <View
                        style={{
                          // height: Dimensions.get("window").height - 100,
                          justifyContent: "center",
                          flexDirection: "row",
                          alignContent: "center",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "row",
                          alignContent: "center",
                          alignItems: "center",
                          backgroundColor: "#ffffff",
                          marginTop: 15,
                          height: 40,
                          width: 40,
                          borderRadius: 20
                        }}
                      >
                        <OwnIcon
                          name="challenges_icn_active"
                          size={22}
                          color={"#ED6B6F"}
                        />
                      </View>
                    </View>
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
                      justifyContent: "center"
                    }}
                    // onPress={this.props.closeTutorial}
                    onPress={this.nextTutorialTournament}
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
        ) : this.state.challenges ? (
          <Aux>
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
                  height:
                    Dimensions.get("window").height -
                    (20 + this.state.extra + 55 + 70),
                  justifyContent: "flex-start",
                  flexDirection: "column"
                }}
              >
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.95,
                    // height: Dimensions.get("window").height - 100,
                    justifyContent: "flex-start",
                    flexDirection: "column",
                    alignContent: "center"
                  }}
                >
                  <View
                    style={{
                      width: Dimensions.get("window").width * 0.95,
                      // height: Dimensions.get("window").height - 100,
                      justifyContent: "flex-start",
                      flexDirection: "column",
                      alignContent: "center",

                      marginTop: 5
                    }}
                  >
                    <View
                      style={{
                        // height: Dimensions.get("window").height - 100,
                        justifyContent: "flex-start",
                        flexDirection: "column",
                        alignContent: "center",
                        marginTop: 10
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

                          fontSize: 32,

                          alignSelf: "center"
                        }}
                      >
                        {strings("id_16_11")}
                      </Text>
                      <View
                        style={{
                          width: Dimensions.get("window").width * 0.95,
                          // height: Dimensions.get("window").height - 100,
                          justifyContent: "center",
                          flexDirection: "column",
                          alignContent: "center",
                          alignItems: "center",
                          backgroundColor: "#ffffff",
                          marginTop: 10,
                          borderRadius: 20,
                          paddingBottom: 5
                        }}
                      >
                        <View
                          style={[
                            styles.topTextContainer,
                            styles.marginContainer
                          ]}
                        >
                          <Text style={styles.topText}>
                            {strings("id_3_03").toUpperCase()}
                          </Text>
                        </View>

                        <View style={styles.marginContainer} />
                        <ChallengeTrainingContainer
                          navigation={null}
                          active={false}
                          name={"Schiaccia il pedale... "}
                          challenge={null}
                        />
                      </View>
                      <View
                        style={{
                          width: Dimensions.get("window").width * 0.95,
                          // height: Dimensions.get("window").height - 100,
                          justifyContent: "center",
                          flexDirection: "row",
                          alignContent: "center"
                        }}
                      >
                        <View
                          style={{
                            // height: Dimensions.get("window").height - 100,
                            justifyContent: "center",
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "center",
                            backgroundColor: "#ffffff",
                            marginTop: 15,
                            height: 40,
                            width: 40,
                            borderRadius: 20
                          }}
                        >
                          <OwnIcon
                            name="challenges_icn_active"
                            size={22}
                            color={"#ED6B6F"}
                          />
                        </View>
                      </View>
                    </View>
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
                      justifyContent: "center"
                    }}
                    onPress={this.nextTutorialChallengesActive}
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
        ) : this.state.standing ? (
          <Aux>
            <View
              style={{
                position: "absolute",
                width: Dimensions.get("window").width,
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",

                top: 20 + this.state.extra + 55 + 40
              }}
            >
              <View
                style={{
                  height:
                    Dimensions.get("window").height -
                    (20 + this.state.extra + 55 + 70),
                  justifyContent: "center",
                  flexDirection: "column"
                }}
              >
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.95,
                    // height: Dimensions.get("window").height - 100,
                    justifyContent: "center",
                    flexDirection: "column",
                    alignContent: "center",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      width: Dimensions.get("window").width * 0.95,
                      // height: Dimensions.get("window").height - 100,
                      justifyContent: "center",
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      marginTop: 5
                    }}
                  >
                    <View
                      style={{
                        // height: Dimensions.get("window").height - 100,
                        justifyContent: "center",
                        flexDirection: "column",
                        alignContent: "center",
                        alignItems: "center"
                      }}
                    >
                      {this.renderCountdown()}
                      <WavyArea
                        data={[
                          {
                            value: -1000
                          },
                          {
                            value: -1200
                          },
                          {
                            value: -1000
                          },
                          {
                            value: -1000
                          },
                          {
                            value: -1200
                          },
                          {
                            value: -1000
                          }
                        ]}
                        color={"#ffffff"}
                        style={styles.overlayWave2}
                      />
                      <WavyArea
                        data={[
                          {
                            value: -1000
                          },
                          {
                            value: -1200
                          },
                          {
                            value: -1000
                          },
                          {
                            value: -1000
                          },
                          {
                            value: -1200
                          },
                          {
                            value: -1000
                          }
                        ]}
                        color={"#3D3D3D"}
                        style={styles.overlayWave}
                      />

                      <View style={styles.userContainer}>
                        <View
                          style={{
                            flexDirection: "column",
                            alignContent: "center",
                            justifyContent: "center"
                          }}
                        >
                          {/* {this.selectTypeNew(community, checkSponsor)} */}
                          <View>
                            <UserItem
                              myProfile={() => {}}
                              navigation={null}
                              currentUser={true}
                              user={{
                                username: "Roberto",

                                avatar: 4,
                                id: 1,

                                points: 1100,
                                position: 7,
                                referred_route__user__city_id: 0
                              }}
                              // lo faccio piu piccolo dato che sopra metto il selettore per il periodo

                              level={"Newbie"}
                              fontColor={"#fff"}
                              modalType={1}
                              blockRanking={false}
                              activeSelectable={"Global"}
                              community={null}
                              city={""}
                              colorStar={"#fab21e"}
                              style={{
                                width: Dimensions.get("window").width * 0.9,
                                height: 85
                              }}
                            />
                          </View>
                        </View>
                      </View>
                      <View style={styles.textContainer}>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === "ios"
                                ? "MoonFlowerBold"
                                : "MoonFlower-Bold",
                            textAlign: "center",
                            color: "white",
                            // fontWeight: "bold",
                            marginTop: 15,
                            fontSize: 32,

                            alignSelf: "center"
                          }}
                        >
                          {strings("id_16_10")}
                        </Text>
                        <View
                          style={{
                            // height: Dimensions.get("window").height - 100,
                            justifyContent: "center",
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "center",
                            backgroundColor: "#ffffff",
                            marginTop: 15,
                            height: 40,
                            width: 40,
                            borderRadius: 20
                          }}
                        >
                          <OwnIcon
                            name="weekly_icn_active"
                            size={22}
                            color={"#ED6B6F"}
                          />
                        </View>
                      </View>
                    </View>
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
                      justifyContent: "center"
                    }}
                    onPress={this.nextTutorialChallenges}
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
        ) : this.state.tab ? (
          <Aux>
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
                  height:
                    Dimensions.get("window").height -
                    (20 + this.state.extra + 55 + 70),
                  justifyContent: "center",
                  flexDirection: "column"
                }}
              >
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.8,
                    // height: Dimensions.get("window").height - 100,
                    justifyContent: "center",
                    flexDirection: "column",
                    alignContent: "center",
                    alignItems: "center"
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
                      marginTop: 5,
                      fontSize: 32,

                      alignSelf: "center"
                    }}
                  >
                    {strings("id_16_09")}
                  </Text>
                  <View
                    style={{
                      width: Dimensions.get("window").width * 0.8,
                      // height: Dimensions.get("window").height - 100,
                      justifyContent: "flex-start",
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      marginTop: 15
                    }}
                  >
                    <View
                      style={{
                        // height: Dimensions.get("window").height - 100,
                        justifyContent: "center",
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        backgroundColor: "#ffffff",
                        height: 40,
                        width: 40,
                        borderRadius: 20
                      }}
                    >
                      <OwnIcon
                        name="weekly_icn_active"
                        size={22}
                        color={"#ED6B6F"}
                      />
                    </View>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === "ios"
                            ? "MoonFlowerBold"
                            : "MoonFlower-Bold",
                        textAlign: "center",
                        color: "white",
                        // fontWeight: "bold",
                        marginLeft: 10,
                        fontSize: 32,

                        alignSelf: "center"
                      }}
                    >
                      {strings("id_16_16")}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: Dimensions.get("window").width * 0.8,
                      // height: Dimensions.get("window").height - 100,
                      justifyContent: "flex-start",
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      marginTop: 5
                    }}
                  >
                    <View
                      style={{
                        // height: Dimensions.get("window").height - 100,
                        justifyContent: "center",
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        backgroundColor: "#ffffff",
                        height: 40,
                        width: 40,
                        borderRadius: 20
                      }}
                    >
                      <OwnIcon
                        name="challenges_icn_active"
                        size={22}
                        color={"#ED6B6F"}
                      />
                    </View>

                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === "ios"
                            ? "MoonFlowerBold"
                            : "MoonFlower-Bold",
                        textAlign: "center",
                        color: "white",
                        // fontWeight: "bold",
                        marginLeft: 10,
                        fontSize: 32,

                        alignSelf: "center"
                      }}
                    >
                      {strings("id_16_15")}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: Dimensions.get("window").width * 0.8,
                      // height: Dimensions.get("window").height - 100,
                      justifyContent: "flex-start",
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      marginTop: 5
                    }}
                  >
                    <View
                      style={{
                        // height: Dimensions.get("window").height - 100,
                        justifyContent: "center",
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        backgroundColor: "#ffffff",
                        height: 40,
                        width: 40,
                        borderRadius: 20
                      }}
                    >
                      {/* <OwnIcon name="sct_icn" size={25} color={"#ffffff"} /> */}
                      <OwnIcon
                        name="sct_icn_active"
                        size={22}
                        color={"#ED6B6F"}
                      />
                    </View>
                    <View
                      style={{
                        // height: Dimensions.get("window").height - 100,
                        justifyContent: "center",
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center"
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
                          marginLeft: 10,
                          fontSize: 32,

                          alignSelf: "center"
                        }}
                      >
                        {strings("id_16_17")}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === "ios"
                          ? "MoonFlowerBold"
                          : "MoonFlower-Bold",
                      textAlign: "center",
                      color: "white",
                      // fontWeight: "bold",
                      marginTop: 15,
                      fontSize: 32,

                      alignSelf: "center"
                    }}
                  >
                    {strings("id_16_18")}
                  </Text>
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
                      justifyContent: "center"
                    }}
                    onPress={this.nextTutorialStanding}
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
        ) : this.state.end ? (
          <Aux>
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
                  height:
                    Dimensions.get("window").height -
                    (20 + this.state.extra + 55 + 40),
                  justifyContent: "center",
                  flexDirection: "column"
                }}
              >
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.8,
                    // height: Dimensions.get("window").height - 100,
                    justifyContent: "center",
                    flexDirection: "column",
                    alignContent: "center",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      height: 100,
                      justifyContent: "center",
                      flexDirection: "column",
                      alignContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <RecapActivityLoading
                      modal_type={{ type: "Walking", coef: 1200, threshold: 5 }}
                      validated={false}
                      DataNow={new Date()}
                      Data={new Date()}
                    />
                  </View>
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
                      fontSize: 32,

                      alignSelf: "center"
                    }}
                  >
                    {strings("id_16_08")}
                  </Text>
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
                      justifyContent: "center"
                    }}
                    onPress={this.nextTutorialTab}
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
        ) : this.state.stop ? (
          <Aux>
            <View
              style={{
                position: "absolute",
                width: Dimensions.get("window").width,
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: Dimensions.get("window").height
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
                    width: Dimensions.get("window").width * 0.8,
                    alignSelf: "center",
                    marginBottom: 5,
                    fontSize: 32
                  }}
                >
                  {this.state.animated3
                    ? strings("id_16_07")
                    : strings("id_16_06")}
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
                this.nextTutorial3();
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
                height: Dimensions.get("window").height

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
                    width: Dimensions.get("window").width * 0.8,
                    marginBottom: 5,
                    alignSelf: "center",
                    fontSize: 32
                  }}
                >
                  {this.state.animated
                    ? strings("id_16_02")
                    : strings("id_16_01")}
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

const styles = {
  availableChallengesContainer: {
    width: Dimensions.get("window").width,
    alignSelf: "center",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  },
  countdownTxt: {
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
    color: "#3D3D3D",
    fontSize: 12
  },
  countdownBoldTxt: {
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
    fontWeight: "bold",
    color: "#FC6754",
    fontSize: 12
  },
  mainContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    alignSelf: "center",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  },
  topTextContainer: {
    width: Dimensions.get("window").width * 0.9,
    alignSelf: "center",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  marginContainer: { marginTop: 10 },
  topText: {
    color: "#000000",
    fontSize: 16,
    textAlignVertical: "center",
    fontFamily: "Montserrat-ExtraBold"
  },
  restartBoldTxt: {
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 12
  },
  restartTxt: {
    fontFamily: "OpenSans-Regular",
    textAlign: "center",

    color: "#FFFFFF",
    fontSize: 12
  },
  countdownTxtWhite: {
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 12
  },
  countdownBoldTxtWhite: {
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 12
  },
  selectableHeaderBlock: {
    width: Dimensions.get("window").width * 0.95,
    height: 40,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  },
  HeaderTimer: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: 30,
    flexDirection: "row",
    width: Dimensions.get("window").width,
    // left: Dimensions.get("window").width * 0.05,

    // right: Dimensions.get("window").width * 0.0125,

    // left: Dimensions.get("window").width * 0,
    // right: Dimensions.get("window").width * 0.025,
    alignSelf: "flex-start"
  },
  overlayWave2: {
    height: 150,
    width: Dimensions.get("window").width * 0.95,
    position: "relative",
    top: 0
    //  position: "absolute"
  },
  overlayWave: {
    height: 140,
    width: Dimensions.get("window").width * 0.95,
    position: "relative",
    top: -150

    // top: Dimensions.get("window").height * 0.04 + 14
  },
  userContainer: {
    position: "relative",
    top: -290,
    width: Dimensions.get("window").width * 0.95,
    height: 110,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
    // position: "absolute"
  },
  textContainer: {
    position: "relative",
    top: -250,
    justifyContent: "center",
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center"
  }
};

export default ButtonPlayOrStopGuide;
