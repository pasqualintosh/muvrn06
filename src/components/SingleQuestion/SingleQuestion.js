import React from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  TouchableHighlight
} from "react-native";
import SelectableFrequency from "./../SelectableFrequency/SelectableFrequency";
import ProgressSurveyQuery from "./../ProgressSurveyQuery/ProgressSurveyQuery";
import EndWelcomeSlide from "./../EndWelcomeSlide/EndWelcomeSlide";
import Welcome from "./../../screens/Welcome/Welcome";

import Svg, { Circle, Line } from "react-native-svg";
import { putQuiz, putSurvey } from "../../domains/trainings/ActionCreators";

import { BoxShadow } from "react-native-shadow";
import { traslateTextQuiz } from "../BonusQuestion/BonusQuestion";

import Emoji from "@ardentlabs/react-native-emoji";

import round from "round";

class SingleQuestion extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);

    this.state = {
      correct: 0,
      idQuiz: 0,
      progress: [
        {
          label: "walk",
          value: 0.2,
          color: "#6CBA7E"
        },
        {
          label: "bicycle",
          value: 0.2,
          color: "#E83475"
        },
        {
          label: "bus",
          value: 0.03,
          color: "#FAB21E"
        },
        {
          label: "car",
          value: 0.03,
          color: "#60368C"
        },
        {
          label: "motorbike",
          value: 0.03,
          color: "#5FC4E2"
        },
        {
          label: "carpooling",
          value: 0.03,
          color: "#3363AD"
        }
      ],
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
  _handleProgressTap = (positionX, width, index) => {
    const progress = round((100 / width) * positionX, 10, "up");

    let progressState = this.state.progress;
    progressState[index].value = progress / 100;

    this.setState({ progress: [...progressState] });
  };
  // metodo se clicco mi rimanda alla scene con etichetta Home, specificata dentro StackNavigation
  ClickSurvey = () => {
    this.props.navigation.navigate("Home");
  };
  renderSelectable() {
    if (this.props.selectable)
      return (
        <View>
          <SelectableFrequency
            startLabel={this.props.startLabel}
            endLabel={this.props.endLabel}
            selectableItems={this.props.selectableItems}
          />
        </View>
      );
  }
  renderImage() {
    if (this.props.image) {
      return (
        <View>
          <Image source={this.props.imageSource} />
        </View>
      );
    }
  }
  renderProgressQuery(index) {
    return (
      <ProgressSurveyQuery
        key={index}
        progress={this.state.progress[index].value}
        height={25}
        fillColor="#fff"
        barColor={this.state.progress[index].color}
        // borderColor="#DDD"
        // borderRadius={5}
        width={Dimensions.get("window").width * 0.6}
        handleClick={evt =>
          this._handleProgressTap(
            evt.nativeEvent.locationX,
            Dimensions.get("window").width * 0.6,
            index
          )
        }
      />
    );
  }
  renderSurveySlide() {
    return (
      <View style={{}}>
        {this.state.progress.map((item, index) =>
          this.renderProgressQuery(index)
        )}
      </View>
    );
  }
  renderEndWelcomeSlide() {
    return <EndWelcomeSlide {...this.props} />;
  }

  dividetext = str => {
    // const str = "How are you doing today U+2B50 U+2B50?";
    const res = str.split(" ");
    // const res = str.split(/ U/);
    console.log(res);
    return res;
  };

  stringWithEmoji = res => {
    console.log(res);
    return res.map((elem, key) => {
      if (elem.charAt(0) === "U" && elem.charAt(1) === "+") {
        return (
          <Text
            key={key}
            style={{
              margin: 10,
              color: "#3D3D3D",
              textAlign: "center",
              fontSize: 35,
              fontFamily: "OpenSans-Regular"
            }}
          >
            {elem === "U+1F9E1" ? (
              "🧡"
            ) : (
              <Emoji name={this.ConvertEmoji(elem)} style={{ fontSize: 35 }} />
            )}{" "}
          </Text>
        );
      } else {
        return (
          <Text
            key={key}
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
      this.props.indexQuiz
    ].questiontoanswer__text_answer.map(elem => (
      <TouchableHighlight
        key={elem.questiontoanswer__id}
        onPress={() => {
          this.props.changeQuiz(
            elem.questiontoanswer__id,
            this.props.indexQuiz,
            elem.responseQuiz
          );
        }}
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
              ? traslateTextQuiz(elem.responseQuiz)
              : this.stringWithEmoji(
                  this.dividetext(traslateTextQuiz(elem.responseQuiz))
                )}
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

  quizBox = () => {
    const numAnswer = this.props.questiontoanswer__text_answer.length;
    if (numAnswer === 4) {
      let allQuiz = [...this.props.questiontoanswer__text_answer];
      let slicedQuiz = allQuiz.slice(0, 2);
      let slicedQuiz2 = allQuiz.slice(2, 4);
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-around",

            height: Dimensions.get("window").height * 0.5
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
              width: Dimensions.get("window").width * 0.9
            }}
          >
            {slicedQuiz.map(elem => {
              return (
                <TouchableHighlight
                  key={elem.questiontoanswer__id}
                  onPress={() => {
                    this.props.changeQuiz(
                      elem.questiontoanswer__id,
                      this.props.indexQuiz,
                      elem.responseQuiz
                    );
                    if (this.props.typeQuiz === "quiz") {
                      const correctResponse = this.props.questiontoanswer__is_correct
                        ?  this.props.questiontoanswer__is_correct
                        : "";
                      this.setState({
                        correct: correctResponse ==  elem.responseQuiz ? 1 : 2,
                        idQuiz: elem.questiontoanswer__id,
                      });
                    }
                  }}
                  style={{
                    backgroundColor:
                      this.props.typeQuiz == "quiz"
                        ? this.state.correct && this.state.idQuiz == elem.questiontoanswer__id
                          ? this.state.correct == 1
                            ? "#87D99A"
                            : "#FC6754"
                          : "#ffffff"
                        : "#ffffff",
                    width: Dimensions.get("window").width * 0.4,
                    height: Dimensions.get("window").height * 0.18,
                    shadowRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.5,
                    elevation: 2
                  }}
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
                        ? traslateTextQuiz(elem.responseQuiz)
                        : this.stringWithEmoji(
                            this.dividetext(traslateTextQuiz(elem.responseQuiz))
                          )}
                    </Text>
                  </View>
                </TouchableHighlight>
              );
            })}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
              width: Dimensions.get("window").width * 0.9
            }}
          >
            {slicedQuiz2.map(elem => {
              return (
                <TouchableHighlight
                  key={elem.questiontoanswer__id}
                  onPress={() => {
                    this.props.changeQuiz(
                      elem.questiontoanswer__id,
                      this.props.indexQuiz,
                      elem.responseQuiz
                    );
                    if (this.props.typeQuiz === "quiz") {
                      const correctResponse = this.props.questiontoanswer__is_correct
                        ?  this.props.questiontoanswer__is_correct
                        : "";
                      this.setState({
                        correct: correctResponse ==  elem.responseQuiz ? 1 : 2,
                        idQuiz: elem.questiontoanswer__id,
                      });
                    }
                  }}
                  style={{
                    backgroundColor:
                      this.props.typeQuiz == "quiz"
                        ? this.state.correct && this.state.idQuiz == elem.questiontoanswer__id
                          ? this.state.correct == 1
                            ? "#87D99A"
                            : "#FC6754"
                          : "#ffffff"
                        : "#ffffff",
                    width: Dimensions.get("window").width * 0.4,
                    height: Dimensions.get("window").height * 0.18,
                    shadowRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.5,
                    elevation: 2
                  }}
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
                        ? traslateTextQuiz(elem.responseQuiz)
                        : this.stringWithEmoji(
                            this.dividetext(traslateTextQuiz(elem.responseQuiz))
                          )}
                    </Text>
                  </View>
                </TouchableHighlight>
              );
            })}
          </View>
        </View>
      );
    } else {
      let allQuiz = [...this.props.questiontoanswer__text_answer];
      let slicedQuiz = allQuiz.slice(0, 2);
      const elem = allQuiz[2];
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-around",

            height: Dimensions.get("window").height * 0.5
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
              width: Dimensions.get("window").width * 0.9
            }}
          >
            {slicedQuiz.map(elem => {
              return (
                <TouchableHighlight
                  key={elem.questiontoanswer__id}
                  onPress={() => {
                    this.props.changeQuiz(
                      elem.questiontoanswer__id,
                      this.props.indexQuiz,
                      elem.responseQuiz
                    );
                    if (this.props.typeQuiz === "quiz") {
                      const correctResponse = this.props.questiontoanswer__is_correct
                        ?  this.props.questiontoanswer__is_correct
                        : "";
                      this.setState({
                        correct: correctResponse ==  elem.responseQuiz ? 1 : 2,
                        idQuiz: elem.questiontoanswer__id,
                      });
                    }
                  }}
                  style={{
                    backgroundColor:
                      this.props.typeQuiz == "quiz"
                        ? this.state.correct && this.state.idQuiz == elem.questiontoanswer__id
                          ? this.state.correct == 1
                            ? "#87D99A"
                            : "#FC6754"
                          : "#ffffff"
                        : "#ffffff",
                    width: Dimensions.get("window").width * 0.4,
                    height: Dimensions.get("window").height * 0.18,
                    shadowRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.5,
                    elevation: 2
                  }}
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
                        ? traslateTextQuiz(elem.responseQuiz)
                        : this.stringWithEmoji(
                            this.dividetext(traslateTextQuiz(elem.responseQuiz))
                          )}
                    </Text>
                  </View>
                </TouchableHighlight>
              );
            })}
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
              width: Dimensions.get("window").width * 0.9
            }}
          >
            <TouchableHighlight
              key={elem.questiontoanswer__id}
              onPress={() => {
                    this.props.changeQuiz(
                      elem.questiontoanswer__id,
                      this.props.indexQuiz,
                      elem.responseQuiz
                    );
                    if (this.props.typeQuiz === "quiz") {
                      const correctResponse = this.props.questiontoanswer__is_correct
                        ?  this.props.questiontoanswer__is_correct
                        : "";
                      this.setState({
                        correct: correctResponse ==  elem.responseQuiz ? 1 : 2,
                        idQuiz: elem.questiontoanswer__id,
                      });
                    }
                  }}
                  style={{
                    backgroundColor:
                      this.props.typeQuiz == "quiz"
                        ? this.state.correct && this.state.idQuiz == elem.questiontoanswer__id
                          ? this.state.correct == 1
                            ? "#87D99A"
                            : "#FC6754"
                          : "#ffffff"
                        : "#ffffff",
                width: Dimensions.get("window").width * 0.4,
                height: Dimensions.get("window").height * 0.18,
                shadowRadius: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.5,
                elevation: 2
              }}
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
                    ? traslateTextQuiz(elem.responseQuiz)
                    : this.stringWithEmoji(
                        this.dividetext(traslateTextQuiz(elem.responseQuiz))
                      )}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      );
    }
  };

  render() {
    console.log(this.props);
    return (
      <View>
        <ImageBackground
          source={require("../../assets/images/survey_bg_new.png")}
          style={styles.sfondo3}
        >
          {Platform.OS == "android" ? (
            <BoxShadow
              setting={{
                height: 40,
                width: 40,
                color: "#111",
                border: 5,
                radius: 20,
                opacity: 0.35,
                x: 0,
                y: 3,
                overflow: "hidden",
                style: {
                  marginVertical: 0,
                  position: "absolute",
                  top: 35 + this.state.dimExtra,
                  right: 15,
                  overflow: "hidden"
                }
              }}
            />
          ) : (
            <View />
          )}
          <View
            style={{
              // top: -40,
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-around",
              alignSelf: "center",
              alignItems: "center",

              width: Dimensions.get("window").width * 0.9,
              height: Dimensions.get("window").height
            }}
          >
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-around",
                alignSelf: "center",
                alignItems: "center",
                height: Dimensions.get("window").height * 0.38
              }}
            >
              <Image
                style={{
                  width: Dimensions.get("window").height * 0.15,
                  height: Dimensions.get("window").height * 0.15,
                  borderRadius: 10
                }}
                source={require("../../assets/images/quiz_header_super.png")}
              />
              <Text
                style={{
                  color: "#FAB21E",
                  textAlign: "center",
                  fontSize: 24,
                  fontFamily: "Montserrat-ExtraBold"
                }}
              >
                BONUS QUESTION!
                {/* this.stringWithEmoji(this.dividetext()) */}
              </Text>
              <Text
                style={{
                  color: "#F7F8F9",
                  textAlign: "center",
                  fontSize: 16,
                  fontFamily: "OpenSans-Regular"
                  //fontWeight: "bold"
                }}
              >
                - {this.props.typeQuiz.toUpperCase()} -
                {/* this.stringWithEmoji(this.dividetext()) */}
              </Text>
              <Text
                style={{
                  color: "#FFFFFF",
                  textAlign: "center",
                  fontSize: 16,
                  fontFamily: "OpenSans-Bold"
                }}
              >
                {traslateTextQuiz(this.props.text_question)}
                {/* this.stringWithEmoji(this.dividetext()) */}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-around",
                alignSelf: "center",
                alignItems: "center",
                height: Dimensions.get("window").height * 0.05
              }}
            />
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-around",
                alignSelf: "center",
                alignItems: "center",
                height: Dimensions.get("window").height * 0.5
              }}
            >
              {this.quizBox()}
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-around",
                alignSelf: "center",
                alignItems: "center",
                height: Dimensions.get("window").height * 0.07
              }}
            />
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

            top: 35 + this.state.dimExtra,
            right: 15
          }}
        >
          <View>
            <TouchableHighlight
              style={{
                backgroundColor: "#E6332A",
                height: 40,
                width: 40,
                borderRadius: 40,
                alignItems: "center",
                shadowRadius: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.5,
                elevation: 2
              }}
              onPress={() => this.props.closeEndModal()}
            >
              <Svg height="40" width="40" viewBox="0 0 100 100" fill="white">
                <Line
                  x1="40"
                  y1="40"
                  x2="60"
                  y2="60"
                  stroke="white"
                  strokeWidth="2"
                />
                <Line
                  x1="60"
                  y1="40"
                  x2="40"
                  y2="60"
                  stroke="white"
                  strokeWidth="2"
                />
              </Svg>
            </TouchableHighlight>
          </View>
        </View>
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
    height: Dimensions.get("screen").height
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

export default SingleQuestion;
