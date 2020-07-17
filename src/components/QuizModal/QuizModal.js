import React from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  TouchableHighlight,
  Button,
  Modal as Modal2,
  Animated
} from "react-native";
import Modal from "react-native-modal";
import OwnIcon from "../OwnIcon/OwnIcon";
import { connect } from "react-redux";
import { sumRoute } from "../../domains/tracking/ActionCreators";
import haversine from "./../../helpers/haversine";
import pointsDecimal from "./../../helpers/pointsDecimal";
import Aux from "./../../helpers/Aux";
import { BoxShadow } from "react-native-shadow";
import LinearGradient from "react-native-linear-gradient";
import Emoji from "@ardentlabs/react-native-emoji";

import Svg, { Circle, Line } from "react-native-svg";
import { putQuiz, putSurvey } from "../../domains/trainings/ActionCreators";

import { images } from "../../screens/SurveyScreens/EndScreen.js";
import { strings } from "../../config/i18n";
import { limitAvatar } from "./../UserItem/UserItem";
// import Modal from "react-native-modalbox";
class QuizModal extends React.Component {
  constructor() {
    // dimExtra ovvero allontano il pallino per chiudere un po di piu essendoci la tacca ovvero aumento il valore usato poi in top
    super();
    this.state = {
      isVisible: true,
      indexQuiz: 0,
      questiontoanswer__id: [],
      time: 0,
      interval: 0,
      start: null,
      opacity: 1,
      NumSegment: 0,
      totDistanceSegment: 0,
      animationIn: "slideInUp",
      correct: 0,

      animationOut: "slideOutDown",

      dimExtra:
        Platform.OS === "ios" &&
        (Dimensions.get("window").height === 812 ||
          Dimensions.get("window").width === 812 ||
          (Dimensions.get("window").height === 896 ||
            Dimensions.get("window").width === 896))
          ? 20
          : 0
    };
  }

  
  // chiudo quando non ho ancora concluso
  closeEndModal = () => {
    this.closeQuizWithX();

    this.setState({ isVisible: false });
    setTimeout(() => {
      this.props.deleteModal();
    }, 1000);
  };

  // chiudo la modale alla fine
  closeFinalModal = () => {
    this.setState({ isVisible: false });

    setTimeout(() => {
      this.props.deleteModal();
    }, 1000);
  };

  viewQuiz = () => {
    if (this.props.quiz.length) {
      console.log(this.props.quiz[this.state.indexQuiz].text_question);
      return (
        <View
          style={{
            alignContent: "center",
            flexDirection: "column",
            alignSelf: "center",
            justifyContent: "space-around",
            alignItems: "center",
            top: -Dimensions.get("window").width * 0.125,

            width: Dimensions.get("window").width / 1.5,
            height:
              Dimensions.get("window").height * 0.7 -
              Dimensions.get("window").width * 0.25
          }}
        >
          <Text
            style={{
              color: "#3363AD",
              textAlign: "center",
              fontSize: 16,
              fontFamily: "Montserrat-ExtraBold"
              //fontWeight: "bold"
            }}
          >
            {this.props.typeQuiz.toUpperCase()}!
            {/*  {this.props.typeQuiz.charAt(0).toUpperCase() +
              this.props.typeQuiz.slice(1)}{" "} */}
            {/* this.stringWithEmoji(this.dividetext()) */}
          </Text>
          <Text
            style={{
              color: "#3D3D3D",
              textAlign: "center",
              fontSize: 12,
              fontFamily: "OpenSans-Regular"
            }}
          >
            {this.props.quiz[this.state.indexQuiz].text_question}
            {/* this.stringWithEmoji(this.dividetext()) */}
          </Text>

          {this.answerquiz()}

          <View
            style={{
              position: "absolute",
              bottom: -Dimensions.get("window").width * 0.1
            }}
          >
            {/* <Text
              style={{
                margin: 10,
                color: "white",
                textAlign: "center",
                fontSize: 12,
                fontFamily: "OpenSans-Regular"
              }}
            >
              {this.state.indexQuiz + 1 + "/" + this.props.quiz.length}
            </Text> */}
            <View style={{ flexDirection: "row" }}>
              {this.props.quiz.map((elem, index) => (
                <Svg key={index} height={30} width={30} viewBox="0 0 100 100">
                  <Circle
                    cx="50"
                    cy="50"
                    r="12"
                    //stroke="white"
                    fill={
                      index === this.state.indexQuiz ? "#3363AD" : "#9D9B9C"
                    }
                  />
                </Svg>
              ))}
            </View>
          </View>
        </View>
      );
    } else {
      return <View />;
    }
  };

  viewQuizAndroid = () => {
    if (this.props.quiz.length) {
      console.log(this.props.quiz[this.state.indexQuiz].text_question);
      return (
        <View
          style={{
            alignContent: "center",
            flexDirection: "column",
            alignSelf: "center",
            justifyContent: "space-around",
            alignItems: "center",
            // width: Dimensions.get("window").width / 1.5,
            height: Dimensions.get("window").height * 0.7
          }}
        >
          <Image
            style={{
              width: Dimensions.get("window").width * 0.25,
              height: Dimensions.get("window").width * 0.25,
              borderRadius: 10
            }}
            source={require("../../assets/images/quiz_header_super.png")}
          />

          <Text
            style={{
              color: "#3363AD",
              textAlign: "center",
              fontSize: 16,
              fontFamily: "Montserrat-ExtraBold"
              //fontWeight: "bold"
            }}
          >
            {this.props.typeQuiz.toUpperCase()}!
            {/* this.stringWithEmoji(this.dividetext()) */}
          </Text>
          <View
            style={{
              alignContent: "center",

              alignSelf: "center",

              width: Dimensions.get("window").width / 1.5
            }}
          >
            <Text
              style={{
                color: "#3D3D3D",
                textAlign: "center",
                fontSize: 12,
                fontFamily: "OpenSans-Regular"
              }}
            >
              {this.props.quiz[this.state.indexQuiz].text_question}
              {/* this.stringWithEmoji(this.dividetext()) */}
            </Text>
          </View>

          {this.answerquiz()}

          <View>
            {/* <Text
              style={{
                margin: 10,
                color: "white",
                textAlign: "center",
                fontSize: 12,
                fontFamily: "OpenSans-Regular"
              }}
            >
              {this.state.indexQuiz + 1 + "/" + this.props.quiz.length}
            </Text> */}
            <View style={{ flexDirection: "row" }}>
              {this.props.quiz.map((elem, index) => (
                <Svg key={index} height={30} width={30} viewBox="0 0 100 100">
                  <Circle
                    cx="50"
                    cy="50"
                    r="12"
                    //stroke="white"
                    fill={
                      index === this.state.indexQuiz ? "#3363AD" : "#9D9B9C"
                    }
                  />
                </Svg>
              ))}
            </View>
          </View>
        </View>
      );
    } else {
      return <View />;
    }
  };

  changeQuiz = (questiontoanswer__id, indexQuiz, responseQuiz) => {
    // se c'e la risposta corretta uso questa altrimenti uso quella inserita dall'utente
    const correctResponse = this.props.quiz[indexQuiz]
      .questiontoanswer__is_correct
      ? this.props.quiz[indexQuiz].questiontoanswer__is_correct
      : responseQuiz;
    if (indexQuiz + 1 < this.props.quiz.length) {
      setTimeout(() => this.setState({ isVisible: false }), 100);
      setTimeout(
        () =>
          this.setState(prevState => {
            return {
              questiontoanswer__id: [
                ...prevState.questiontoanswer__id,
                questiontoanswer__id
              ],
              indexQuiz: indexQuiz + 1,
              isVisible: true,
              correct:
                correctResponse === responseQuiz
                  ? prevState.correct + 1
                  : prevState.correct
            };
          }),
        700
      );
    } else {
      this.setState(prevState => {
        return {
          questiontoanswer__id: [
            ...prevState.questiontoanswer__id,
            questiontoanswer__id
          ],

          correct:
            correctResponse === responseQuiz
              ? prevState.correct + 1
              : prevState.correct
        };
      });
      // mando al db le risposte

      setTimeout(() => this.setState({ isVisible: false }), 100);
      setTimeout(() => {
        this.setState({ isVisible: true, indexQuiz: indexQuiz + 1 });
        if (this.props.typeQuiz === "quiz") {
          this.props.dispatch(
            putQuiz({
              event_id: this.props.idQuiz,
              new_status: 1,
              answer_chosen_id: this.state.questiontoanswer__id,
              obtainable_coins: this.state.correct
            })
          );
        } else {
          // survey
          this.props.dispatch(
            putSurvey({
              event_id: this.props.idQuiz,
              new_status: 1,
              answer_chosen_id: this.state.questiontoanswer__id,
              obtainable_coins: this.state.correct
            })
          );
        }
      }, 700);
    }
  };

  // chiude prima di concludere il quiz

  // mando al db nessuna risposta
  closeQuizWithX = () => {
    if (this.props.typeQuiz === "quiz") {
      this.props.dispatch(
        putQuiz({
          event_id: this.props.idQuiz,
          new_status: 1,
          answer_chosen_id: [],
          obtainable_coins: 0
        })
      );
    } else {
      // survey
      this.props.dispatch(
        putSurvey({
          event_id: this.props.idQuiz,
          new_status: 1,
          answer_chosen_id: [],
          obtainable_coins: 0
        })
      );
    }
  };

  modalQuizIos = () => {
    return (
      <Modal
        isVisible={this.state.isVisible}
        onSwipe={() => {
          this.closeEndModal();
        }}
        animationIn={this.state.animationIn}
        animationOut={this.state.animationOut}
        swipeDirection="left"
        //useNativeDriver={true}
        style={{
          borderRadius: 10,
          alignItems: "center",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-around",
          shadowRadius: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.5,
          elevation: 0
        }}
        backdropOpacity={0.7}
      >
        <View style={styles.sfondo}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              height: Dimensions.get("window").height * 0.7
            }}
          >
            <Image
              style={{
                width: Dimensions.get("window").width * 0.25,
                height: Dimensions.get("window").width * 0.25,
                borderRadius: 10,

                top: -Dimensions.get("window").width * 0.125
              }}
              source={require("../../assets/images/quiz_header_super.png")}
            />
            <View
              style={{
                position: "absolute",
                right: -Dimensions.get("window").width * 0.075,
                top: -Dimensions.get("window").width * 0.105
              }}
            >
              <Svg
                height={Dimensions.get("window").width * 0.2}
                width={Dimensions.get("window").width * 0.2}
                viewBox="0 0 100 100"
              >
                <Circle
                  cx="50"
                  cy="50"
                  r="25"
                  stroke="#3D3D3D"
                  strokeWidth="1"
                  fill="#E6332A"
                  onPress={() => this.closeEndModal()}
                />
                <Line
                  x1="45"
                  y1="45"
                  x2="55"
                  y2="55"
                  stroke="white"
                  strokeWidth="2"
                  onPress={() => this.closeEndModal()}
                />
                <Line
                  x1="55"
                  y1="45"
                  x2="45"
                  y2="55"
                  stroke="white"
                  strokeWidth="2"
                  onPress={() => this.closeEndModal()}
                />
              </Svg>
            </View>
          </View>
          {this.viewQuiz()}
        </View>
      </Modal>
    );
  };

  modalQuizAndroid = () => {
    return (
      <Modal
        isVisible={this.state.isVisible}
        onSwipe={() => {
          this.closeEndModal();
        }}
        animationIn={this.state.animationIn}
        animationOut={this.state.animationOut}
        swipeDirection="left"
        //useNativeDriver={true}
        style={{
          borderRadius: 10,
          alignItems: "center",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-around",
          shadowRadius: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.5,
          elevation: 0
        }}
        backdropOpacity={0.7}
      >
        <View style={styles.sfondo}>
          <View
            style={{
              position: "absolute",
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              backgroundColor: "transparent",

              top: 25 + this.state.dimExtra,
              right: 15,
              elevation: 2
            }}
          >
            <Svg height="40" width="40" viewBox="0 0 100 100">
              <Circle
                cx="50"
                cy="50"
                r="40"
                strokeWidth="1"
                fill="#E6332A"
                stroke="#E8E9E9"
                onPress={() => this.closeEndModal()}
              />
              <Line
                x1="40"
                y1="40"
                x2="60"
                y2="60"
                stroke="white"
                strokeWidth="3"
                onPress={() => this.closeEndModal()}
              />
              <Line
                x1="60"
                y1="40"
                x2="40"
                y2="60"
                stroke="white"
                strokeWidth="3"
                onPress={() => this.closeEndModal()}
              />
            </Svg>
          </View>

          {this.viewQuizAndroid()}
        </View>
      </Modal>
    );
  };

  dividetext = str => {
    // const str = "How are you doing today U+2B50 U+2B50?";
    const res = str.split(" ");
    // const res = str.split(/ U/);
    console.log(res);
    return res;
  };

  stringWithEmoji = res => {
    console.log(res);
    return res.map(elem => {
      if (elem.charAt(0) === "U" && elem.charAt(1) === "+") {
        return (
          <Text
            style={{
              margin: 10,
              color: "#3D3D3D",
              textAlign: "center",
              fontSize: 12,
              fontFamily: "OpenSans-Regular"
            }}
          >
            <Emoji name={this.ConvertEmoji(elem)} />{" "}
          </Text>
        );
      } else {
        return (
          <Text
            style={{
              margin: 10,
              color: "#3D3D3D",
              textAlign: "center",
              fontSize: 12,
              fontFamily: "OpenSans-Regular"
            }}
          >
            {elem}{" "}
          </Text>
        );
      }
    });
  };

  answerquiz = () => {
    return this.props.quiz[
      this.state.indexQuiz
    ].questiontoanswer__text_answer.map(elem => (
      <TouchableHighlight
        key={elem.questiontoanswer__id}
        onPress={() =>
          this.changeQuiz(
            elem.questiontoanswer__id,
            this.state.indexQuiz,
            elem.responseQuiz
          )
        }
        style={styles.button}
        underlayColor={"#F9B224"}
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
              margin: 10,
              color: "#3D3D3D",
              textAlign: "center",
              fontSize: 12,
              fontFamily: "OpenSans-Regular"
            }}
          >
            {this.props.typeQuiz === "quiz"
              ? elem.responseQuiz
              : this.stringWithEmoji(this.dividetext(elem.responseQuiz))}
          </Text>
        </View>
      </TouchableHighlight>
    ));
  };

  ConvertEmoji = value => {
    switch (value) {
      case "U+1F60E":
        {
          return ":sunglasses:";
        }
        break;
      case "U+1F4AA":
        {
          return ":muscle:";
        }
        break;
      case "U+1F613":
        {
          return ":sweat:";
        }
        break;
      case "U+1F631":
        {
          return ":scream:";
        }
        break;

      case "U+1F49A":
        {
          return ":green_heart:";
        }
        break;
      case "U+2764":
        {
          return ":heart:";
        }
        break;
      case "U+1F499":
        {
          return ":blue_heart:";
        }
        break;
      case "U+1F9E1":
        {
          return ":orange_heart:";
        }
        break;
      case "U+270C":
        {
          return ":v:";
        }
        break;
      case "U+1F44C":
        {
          return ":ok_hand:";
        }
        break;
      case "U+1F44F":
        {
          return ":clap:";
        }
        break;
      case "U+1F4A9":
        {
          return ":hankey:";
        }
        break;
      case "U+1F480":
        {
          return ":skull:";
        }
        break;
      case "U+1F6B6":
        {
          return ":walking:";
        }
        break;
      case "U+1F3C3":
        {
          return ":runner:";
        }
        break;
      case "U+1F6B4":
        {
          return ":bicyclist:";
        }
        break;
      case "U+1F68D":
        {
          return ":oncoming_bus:";
        }
        break;
      case "U+1F68A":
        {
          return ":tram:";
        }
        break;
      case "U+1F687":
        {
          return ":metro:";
        }
        break;
      case "U+1F694":
        {
          return ":oncoming_police_car:";
        }
        break;
      case "U+1F696":
        {
          return ":oncoming_taxi:";
        }
        break;
      case "U+1F698":
        {
          return ":oncoming_automobile:";
        }
        break;
      case "U+2B50":
        {
          return ":star:";
        }
        break;

      default:
        {
          return ":sunglasses:";
        }
        break;
    }
  };

  componentDidMount() {
    // this.ref.open();
  }

  positionX = new Animated.Value(0); // Initial value for opacity: 0

  render() {
    const width = Dimensions.get("window").width;
    let avatarId = limitAvatar(this.props.avatar);
    

    const positionX2 = this.positionX.interpolate({
      inputRange: [0, 1],
      outputRange: [
        Dimensions.get("window").width * 0.125,
        Dimensions.get("window").width
      ]
    });

    return (
      <View
        style={{
          position: "absolute",
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height
        }}
      >
        {this.state.indexQuiz !== this.props.quiz.length
          ? Platform.OS === "ios"
            ? this.modalQuizIos()
            : this.modalQuizAndroid()
          : Platform.OS === "ios"
          ? this.state.correct || this.props.typeQuiz === "survey"
            ? this.modalWinIos(avatarId)
            : this.modalLoseIos(avatarId)
          : this.state.correct || this.props.typeQuiz === "survey"
          ? this.modalWinAndroid(avatarId)
          : this.modalLoseAndroid(avatarId)}
      </View>
    );
  }

  modalWinIos = avatarId => {
    return (
      <Modal
        isVisible={this.state.isVisible}
        onSwipe={() => {
          this.closeFinalModal();
        }}
        animationIn={this.state.animationIn}
        animationOut={this.state.animationOut}
        swipeDirection="left"
        style={{
          borderRadius: 10,
          alignItems: "center",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-around",
          shadowRadius: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.5,
          elevation: 2,
          borderRadius: 10
        }}
        backdropOpacity={0.7}
      >
        <View style={styles.sfondo3}>
          <ImageBackground
            source={require("../../assets/images/quiz_win_page_bg.png")}
            style={styles.sfondo3}
          >
            <ImageBackground
              source={require("../../assets/images/quiz_win_coin.png")}
              style={styles.sfondo3}
            >
              <View
                style={{
                  // top: -40,
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "space-around",
                  width: Dimensions.get("window").width,
                  height: Dimensions.get("window").height
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    alignItems: "center",
                    height: Dimensions.get("window").height / 3
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "center",

                      textAlign: "center",
                      color: "#FFFFFF",
                      fontFamily: "Montserrat-ExtraBold",
                      fontSize: 30
                    }}
                  >
                    {" "}
                    GOOD JOB!{" "}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    alignItems: "center"
                  }}
                >
                  <Image
                    style={{
                      width: 214,
                      height: 350,
                      width: Dimensions.get("window").height / 3,
                      height: (Dimensions.get("window").height / 3) * 1.6355,
                      alignSelf: "center"
                    }}
                    // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
                    source={images[avatarId]}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "column",

                    justifyContent: "center",
                    alignSelf: "center",
                    alignItems: "center",
                    height: Dimensions.get("window").height / 3
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",

                      fontFamily: "OpenSans-Regular",
                      color: "#fff",
                      fontSize: 16,
                      marginVertical: 1,
                      fontWeight: "bold"
                    }}
                  >
                    You earned
                  </Text>

                  <Text
                    style={{
                      textAlign: "center",

                      fontFamily: "Montserrat-ExtraBold",
                      fontWeight: "400",
                      color: "#FAB21E",
                      fontSize: 45,
                      marginVertical: 1
                    }}
                  >
                    {this.state.correct}
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",

                      fontFamily: "OpenSans-ExtraBold",
                      fontWeight: "700",
                      color: "#F7F8F9",
                      fontSize: 10,
                      marginVertical: 1
                    }}
                  >
                    COINS
                  </Text>
                </View>
                {/* <Svg height="100" width={width}>
                      <Line
                        x1="25"
                        y1="0"
                        x2={width - 25}
                        y2="0"
                        stroke="#9D9B9C"
                        strokeWidth="2"
                      />
                    </Svg> */}
              </View>
            </ImageBackground>
          </ImageBackground>
          <View
            style={{
              position: "absolute",
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              backgroundColor: "transparent",

              top: 25 + this.state.dimExtra,
              right: 15
            }}
          >
            <Svg height="40" width="40" viewBox="0 0 100 100">
              <Circle
                cx="50"
                cy="50"
                r="40"
                fill="white"
                onPress={() => this.closeFinalModal()}
              />
              <Line
                x1="40"
                y1="40"
                x2="60"
                y2="60"
                stroke="black"
                strokeWidth="2"
                onPress={() => this.closeFinalModal()}
              />
              <Line
                x1="60"
                y1="40"
                x2="40"
                y2="60"
                stroke="black"
                strokeWidth="2"
                onPress={() => this.closeFinalModal()}
              />
            </Svg>
          </View>
        </View>
      </Modal>
    );
  };

  modalLoseIos = avatarId => {
    return (
      <Modal
        isVisible={this.state.isVisible}
        onSwipe={() => {
          this.closeFinalModal();
        }}
        animationIn={this.state.animationIn}
        animationOut={this.state.animationOut}
        swipeDirection="left"
        style={{
          borderRadius: 10,
          alignItems: "center",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-around",
          shadowRadius: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.5,
          elevation: 2,
          borderRadius: 10
        }}
        backdropOpacity={0.7}
      >
        <View style={styles.sfondo3}>
          <ImageBackground
            source={require("../../assets/images/quiz_win_page_bg.png")}
            style={styles.sfondo3}
          >
            <View
              style={{
                // top: -40,
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-around",
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignSelf: "center",
                  alignItems: "center",
                  height: Dimensions.get("window").height / 3,
                  width: Dimensions.get("window").height / 2.5
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",

                    textAlign: "center",
                    color: "#FFFFFF",
                    fontFamily: "Montserrat-ExtraBold",
                    fontSize: 30
                  }}
                >
                  {" "}
                  DON’T WORRY BUDDY!{" "}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignSelf: "center",
                  alignItems: "center"
                }}
              >
                <Image
                  style={{
                    width: 214,
                    height: 350,
                    width: Dimensions.get("window").height / 3,
                    height: Dimensions.get("window").height / 3,
                    alignSelf: "center"
                  }}
                  // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
                  source={require("../../assets/images/dontworry.png")}
                />
              </View>
              <View
                style={{
                  flexDirection: "column",

                  justifyContent: "center",
                  alignSelf: "center",
                  alignItems: "center",
                  height: Dimensions.get("window").height / 3,
                  width: Dimensions.get("window").height / 2.5
                }}
              >
                <Text
                  style={{
                    textAlign: "center",

                    fontFamily: "OpenSans-Regular",
                    color: "#fff",
                    fontSize: 18,
                    marginVertical: 1
                    // fontWeight: "bold"
                  }}
                >
                  Maecenas faucibus mollis interdum. Integer posuere erat a ante
                  venenatis dapibus posuere velit aliquet.velit aliquet.
                </Text>
              </View>
              {/* <Svg height="100" width={width}>
                      <Line
                        x1="25"
                        y1="0"
                        x2={width - 25}
                        y2="0"
                        stroke="#9D9B9C"
                        strokeWidth="2"
                      />
                    </Svg> */}
            </View>
          </ImageBackground>
          <View
            style={{
              position: "absolute",
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              backgroundColor: "transparent",

              top: 25 + this.state.dimExtra,
              right: 15
            }}
          >
            <Svg height="40" width="40" viewBox="0 0 100 100">
              <Circle
                cx="50"
                cy="50"
                r="40"
                fill="white"
                onPress={() => this.closeFinalModal()}
              />
              <Line
                x1="40"
                y1="40"
                x2="60"
                y2="60"
                stroke="black"
                strokeWidth="2"
                onPress={() => this.closeFinalModal()}
              />
              <Line
                x1="60"
                y1="40"
                x2="40"
                y2="60"
                stroke="black"
                strokeWidth="2"
                onPress={() => this.closeFinalModal()}
              />
            </Svg>
          </View>
        </View>
      </Modal>
    );
  };

  modalLoseAndroid = avatarId => {
    return (
      <Modal
        isVisible={this.state.isVisible}
        onSwipe={() => {
          this.closeFinalModal();
        }}
        animationIn={this.state.animationIn}
        animationOut={this.state.animationOut}
        swipeDirection="left"
        style={{
          borderRadius: 10,
          alignItems: "center",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-around",
          shadowRadius: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.5,
          elevation: 0
        }}
        backdropOpacity={0.7}
      >
        <View style={[styles.sfondo4, { backgroundColor: "#3363AD" }]}>
          <ImageBackground
            source={require("../../assets/images/quiz_win_page_bg_trasparent.png")}
            style={styles.sfondo5}
          >
            <View
              style={{
                // top: -40,
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-around",
                width: Dimensions.get("window").width * 0.9,
                height: Dimensions.get("window").height * 0.7
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignSelf: "center",
                  alignItems: "center",
                  width: Dimensions.get("window").width * 0.7 - 30,
                  height: Dimensions.get("window").height * 0.2
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",

                    textAlign: "center",
                    color: "#FFFFFF",
                    fontFamily: "Montserrat-ExtraBold",
                    fontSize: 23
                  }}
                >
                  {" "}
                  DON’T WORRY BUDDY!{" "}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignSelf: "center",
                  alignItems: "center"
                }}
              >
                <Image
                  style={{
                    width: 214,
                    height: 350,
                    width: Dimensions.get("window").height * 0.3,
                    height: Dimensions.get("window").height * 0.3,
                    alignSelf: "center"
                  }}
                  // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
                  source={require("../../assets/images/dontworry.png")}
                />
              </View>
              <View
                style={{
                  flexDirection: "column",

                  justifyContent: "center",
                  alignSelf: "center",
                  alignItems: "center",
                  width: Dimensions.get("window").width * 0.7,
                  height: Dimensions.get("window").height * 0.2
                }}
              >
                <Text
                  style={{
                    textAlign: "center",

                    fontFamily: "OpenSans-Regular",
                    color: "#fff",
                    fontSize: 15,
                    marginVertical: 1
                    // fontWeight: "bold"
                  }}
                >
                  Maecenas faucibus mollis interdum. Integer posuere erat a ante
                  venenatis dapibus posuere velit aliquet.velit aliquet.
                </Text>
              </View>
              {/* <Svg height="100" width={width}>
                      <Line
                        x1="25"
                        y1="0"
                        x2={width - 25}
                        y2="0"
                        stroke="#9D9B9C"
                        strokeWidth="2"
                      />
                    </Svg> */}
            </View>
          </ImageBackground>
          <View
            style={{
              position: "absolute",
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              backgroundColor: "transparent",

              top: 25 + this.state.dimExtra,
              right: 15
            }}
          >
            <Svg height="40" width="40" viewBox="0 0 100 100">
              <Circle
                cx="50"
                cy="50"
                r="40"
                fill="white"
                onPress={() => this.closeFinalModal()}
              />
              <Line
                x1="40"
                y1="40"
                x2="60"
                y2="60"
                stroke="black"
                strokeWidth="3"
                onPress={() => this.closeFinalModal()}
              />
              <Line
                x1="60"
                y1="40"
                x2="40"
                y2="60"
                stroke="black"
                strokeWidth="3"
                onPress={() => this.closeFinalModal()}
              />
            </Svg>
          </View>
        </View>
      </Modal>
    );
  };

  modalWinAndroid = avatarId => {
    return (
      <Modal
        isVisible={this.state.isVisible}
        onSwipe={() => {
          this.closeFinalModal();
        }}
        animationIn={this.state.animationIn}
        animationOut={this.state.animationOut}
        swipeDirection="left"
        style={{
          borderRadius: 10,
          alignItems: "center",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-around",
          shadowRadius: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.5,
          elevation: 0
        }}
        backdropOpacity={0.7}
      >
        <View style={[styles.sfondo4, { backgroundColor: "#3363AD" }]}>
          <ImageBackground
            source={require("../../assets/images/quiz_win_page_bg_trasparent.png")}
            style={styles.sfondo5}
          >
            <ImageBackground
              source={require("../../assets/images/quiz_win_coin.png")}
              style={styles.sfondo5}
            >
              <View
                style={{
                  // top: -40,
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "flex-start"
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    alignItems: "center",
                    height: Dimensions.get("window").height * 0.1
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "center",

                      textAlign: "center",
                      color: "#FFFFFF",
                      fontFamily: "Montserrat-ExtraBold",
                      fontSize: 30
                    }}
                  >
                    {" "}
                    GOOD JOB!{" "}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    alignItems: "center"
                  }}
                >
                  <Image
                    style={{
                      width: 214,
                      height: 350,
                      width: Dimensions.get("window").height * 0.4 * 0.61143381,
                      height: Dimensions.get("window").height * 0.4,
                      alignSelf: "center"
                    }}
                    // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
                    source={images[avatarId]}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "column",

                    justifyContent: "center",
                    alignSelf: "center",
                    alignItems: "center",
                    height: Dimensions.get("window").height * 0.2
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",

                      fontFamily: "OpenSans-Regular",
                      color: "#fff",
                      fontSize: 16,
                      marginVertical: 1,
                      fontWeight: "bold"
                    }}
                  >
                    You earned
                  </Text>

                  <Text
                    style={{
                      textAlign: "center",

                      fontFamily: "Montserrat-ExtraBold",
                      fontWeight: "400",
                      color: "#FAB21E",
                      fontSize: 45,
                      marginVertical: 1
                    }}
                  >
                    {this.state.correct}
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",

                      fontFamily: "OpenSans-ExtraBold",
                      fontWeight: "700",
                      color: "#F7F8F9",
                      fontSize: 10,
                      marginVertical: 1
                    }}
                  >
                    COINS
                  </Text>
                </View>
                {/* <Svg height="100" width={width}>
                <Line
                  x1="25"
                  y1="0"
                  x2={width - 25}
                  y2="0"
                  stroke="#9D9B9C"
                  strokeWidth="2"
                />
              </Svg> */}
              </View>
            </ImageBackground>
          </ImageBackground>
          <View
            style={{
              position: "absolute",
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              backgroundColor: "transparent",

              top: 25 + this.state.dimExtra,
              right: 15
            }}
          >
            <Svg height="40" width="40" viewBox="0 0 100 100">
              <Circle
                cx="50"
                cy="50"
                r="40"
                fill="white"
                onPress={() => this.closeFinalModal()}
              />
              <Line
                x1="40"
                y1="40"
                x2="60"
                y2="60"
                stroke="black"
                strokeWidth="2"
                onPress={() => this.closeFinalModal()}
              />
              <Line
                x1="60"
                y1="40"
                x2="40"
                y2="60"
                stroke="black"
                strokeWidth="2"
                onPress={() => this.closeFinalModal()}
              />
            </Svg>
          </View>
        </View>
      </Modal>
    );
  };
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
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.7,

    backgroundColor: "#F7F8F9",
    borderRadius: 10,
    elevation: 2
  },
  sfondo2: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "#F7F8F9",
    borderRadius: 10
  },
  sfondo3: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,

    borderRadius: 10,
    elevation: 2
  },
  sfondo4: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.7,

    borderRadius: 10,
    elevation: 2
  },
  sfondo5: {
    width: Dimensions.get("window").width * 0.9 - 5,
    height: Dimensions.get("window").height * 0.7 - 5
  },
  sfondoAndroid: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.9,

    borderRadius: 10,
    elevation: 2
  },
  image: {
    width: Dimensions.get("window").width / 2,
    height: Dimensions.get("window").height / 3
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
    // height: Dimensions.get("window").height / 2,
    // width: Dimensions.get("window").width
  },
  button: {
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").height / 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 2
  },
  wrapper: {
    paddingTop: 50,
    flex: 1
  },

  modal: {
    justifyContent: "center",
    alignItems: "center"
  },

  modal2: {
    height: 230,
    backgroundColor: "#3B5998"
  },

  modal3: {
    height: 300,
    width: 300
  },

  modal4: {
    height: 300
  },

  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10
  },

  btnModal: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: "transparent"
  },

  text: {
    color: "black",
    fontSize: 22
  }
};

const Quiz = connect(state => {
  return {
    avatar: state.login.infoProfileNotSave.avatar
      ? state.login.infoProfileNotSave.avatar
      : state.login.infoProfile.avatar
      ? state.login.infoProfile.avatar
      : 0
  };
});

export default Quiz(QuizModal);
