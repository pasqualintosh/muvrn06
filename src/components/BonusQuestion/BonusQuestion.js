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

import AppIntroSlider from "../AppIntroSlider/AppIntroSlider";
import SingleQuestion from "../SingleQuestion/SingleQuestion";

import Svg, { Circle, Line } from "react-native-svg";
import { putQuiz, putSurvey } from "../../domains/trainings/ActionCreators";
import { images } from "../../screens/SurveyScreens/EndScreen.js";
import { strings } from "../../config/i18n";
// import Modal from "react-native-modalbox";
import { limitAvatar } from "./../UserItem/UserItem";

// per ogni testo prendo la variabile corrispondente per le traduzione
export function traslateTextQuiz(text) {
  switch (text) {
    case "How do you rate public transport in your city?": {
      return strings("_257_how_do_you_rate");
    }

    case "What do you think about it?": {
      return strings("what_do_you_thi");
    }

    case "<3 it!": {
      return strings("_3_it_");
    }

    case "It should be better.": {
      return strings("it_should_be_be");
    }

    case "To be honest, I don't like it so much.": {
      return strings("to_be_honest__i");
    }

    case "Nevermind...": {
      return strings("nevermind___");
    }

    case "How should the service be improved?": {
      return strings("how_should_the_");
    }

    case "More lines and more vehicles.": {
      return strings("more_lines_and_");
    }

    case "Better integration with other mobility systems.": {
      return strings("better_integrat");
    }

    case "Additional services (e-ticket, travel plan app, infomobility. etc.).": {
      return strings("additional_serv");
    }

    case "More comfortable seats and stops.": {
      return strings("more_comfortabl");
    }

    case "What do you think about the MUV app so far?": {
      return strings("_268_what_do_you_thi");
    }

    case "What do you like the most?": {
      return strings("what_do_you_lik");
    }

    case "Avatars!": {
      return strings("avatars_");
    }

    case "Training sessions.": {
      return strings("_271_training_sessio");
    }

    case "Global and local rankings.": {
      return strings("global_and_loca");
    }

    case "Nothing in particular.": {
      return strings("nothing_in_part");
    }

    case "What do you want to see in the future?": {
      return strings("what_do_you_wan");
    }

    case "Team tournaments.": {
      return strings("team_tournament");
    }

    case "Challenges designed on the local area.": {
      return strings("challenges_desi");
    }

    case "MUV international city league.": {
      return strings("muv_internation");
    }

    case "Sponsorships.": {
      return strings("sponsorships_");
    }

    case "Are you a carpooling lover?": {
      return strings("are_you_a_carpo");
    }

    case "Yay! I share my car whenever I can.": {
      return strings("yay__i_share_my");
    }

    case "Sure, but I'm usually a passenger.": {
      return strings("sure__but_i_m_u");
    }

    case "I've never heard that word in my entire life.": {
      return strings("i_ve_never_hear");
    }

    case " Which of these sentences represents you most?": {
      return strings("which_of_these_");
    }

    case "I really like walking with friends.": {
      return strings("i_really_like_w");
    }

    case "When I can, I go to work sharing the route with a colleague.": {
      return strings("when_i_can__i_g");
    }

    case "I usually take kids to school.": {
      return strings("i_usually_take_");
    }

    case "I prefer to move alone all the time.": {
      return strings("i_prefer_to_mov");
    }

    case "What stresses you most while you're driving?": {
      return strings("what_stresses_y");
    }

    case "Parking.": {
      return strings("parking_");
    }

    case "Traffic jams.": {
      return strings("traffic_jams_");
    }

    case "Air and noise pollution.": {
      return strings("air_and_noise_p");
    }

    case "Cycling lanes and pedestrians.": {
      return strings("cycling_lanes_a");
    }

    case "How do you usually move when you're not using MUV?": {
      return strings("how_do_you_usua");
    }

    case "MUV stands for...?": {
      return strings("muv_stands_for_");
    }

    case "Mobility Urban Values": {
      return strings("mobility_urban_");
    }

    case "Mobility Ultra Variability": {
      return strings("mobility_ultra_");
    }

    case "Mobility Ugly Vicissitudes": {
      return strings("mobility_ugly_v");
    }

    case "Which of the following Avatars does not exist (yet)?": {
      return strings("which_of_the_fo");
    }

    case "An amateur wrestler": {
      return strings("an_amateur_wres");
    }

    case "A character inspired by 'Pulp Fiction'": {
      return strings("a_character_ins");
    }

    case "An acrobatic barman": {
      return strings("an_acrobatic_ba");
    }

    case "A UFO": {
      return strings("a_ufo");
    }

    case "What is the icon used in the MUV feed for multiple trips?": {
      return strings("what_is_the_ico");
    }

    case "A (yellow) submarine": {
      return strings("a__yellow__subm");
    }

    case "A time machine": {
      return strings("a_time_machine");
    }

    case "According to the Tomtom Traffic Index 2017, which city is most congested by traffic?": {
      return strings("according_to_th");
    }

    case "Palermo": {
      return strings("palermo");
    }

    case "Bucharest": {
      return strings("bucharest");
    }

    case "Marseille": {
      return strings("marseille");
    }

    case "Experts suggest taking 10.000 steps a day for health benefits. But how much do they exactly correspond to?": {
      return strings("experts_suggest");
    }

    case "A little more than 2 km": {
      return strings("a_little_more_t");
    }

    case "Between 5 and 5,5 km": {
      return strings("between_5_and_5");
    }

    case "About 7 km": {
      return strings("about_7_km");
    }

    case "How much of the world's oil is used for transport?": {
      return strings("how_much_of_the");
    }

    case "Who inspired the master who guides you through the training sessions?": {
      return strings("who_inspired_th");
    }

    case "Mr. Miyagi from Karate Kid": {
      return strings("mr__miyagi_from");
    }

    case "The legendary Pai Mei from Kill Bill II": {
      return strings("the_legendary_p");
    }

    case "The oldest of Akira Kurosawa's Seven Samurai": {
      return strings("the_oldest_of_a");
    }

    case "Which of these cities isn't an MUV Pilot City?": {
      return strings("_389_which_of_these_");
    }

    case "Ghent": {
      return strings("ghent");
    }

    case "Fundao": {
      return strings("fundao");
    }

    case "Thessaloniki": {
      return strings("thessaloniki");
    }

    case "What is the name of the research project from which MUV was born?": {
      return strings("what_is_the_nam");
    }

    case "TrafficO2": {
      return strings("traffico2");
    }

    case "City Free": {
      return strings("city_free");
    }

    case "Muovity": {
      return strings("muovity");
    }

    case "How much of the world's CO2 emissions are due to urban vehicles?": {
      return strings("_397_how_much_of_the");
    }

    case "Which of these factors does not affect the calculation of calories burned by cycling for a certain period of time?": {
      return strings("_401_which_of_these_");
    }

    case "Age, sex and weight": {
      return strings("age__sex_and_we");
    }

    case "Speed and road steepness": {
      return strings("speed_and_road_");
    }

    case "Road width and presence of cycle paths": {
      return strings("road_width_and_");
    }

    case "Which of these cities has the longest cycle path system, covering a total of more than 560 km?": {
      return strings("_405_which_of_these_");
    }

    // fare associazione di tutte le domande e risposte del pro

    default: {
      return text;
    }
  }
}
class BonusQuestion extends React.Component {
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
      singleIdQuiz: 0,
      correctCurrent: false,

      dimExtra:
        Platform.OS === "ios" &&
        (Dimensions.get("window").height === 812 ||
          Dimensions.get("window").width === 812 ||
          Dimensions.get("window").height === 896 ||
            Dimensions.get("window").width === 896)
          ? 20
          : 0
    };
  }

  // chiudo quando non ho ancora concluso
  closeEndModal = () => {
    console.log("chiudi modale e non ho risposto");
    this.closeQuizWithX();

    this.setState({ isVisible: false });
    setTimeout(() => {
      this.props.deleteModal();
    }, 1000);
  };

  shadowClose = () => {
    if (Platform.OS == "android") {
      return (
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
      );
    } else {
      return <View />;
    }
  };

  // chiudo la modale alla fine
  closeFinalModal = () => {
    this.setState({ isVisible: false });

    setTimeout(() => {
      this.props.deleteModal();
    }, 1000);
  };

  changeQuiz = (questiontoanswer__id, indexQuiz, responseQuiz) => {
    // se c'e la risposta corretta uso questa altrimenti uso quella inserita dall'utente
    indexQuiz = this.state.indexQuiz;
    console.log(indexQuiz);

    const correctResponse = this.props.quiz[indexQuiz]
      .questiontoanswer__is_correct
      ? this.props.quiz[indexQuiz].questiontoanswer__is_correct
      : "";

    // se è un survey vedo il numero di monete che ottengo completandolo
    // se presente lo salvo in corrent, se non c'e uso il valore precedente

    if (indexQuiz + 1 < this.props.quiz.length) {
      this.setState(prevState => {
        return {
          questiontoanswer__id: [
            ...prevState.questiontoanswer__id,
            questiontoanswer__id
          ],
          indexQuiz: indexQuiz + 1,
          singleIdQuiz: questiontoanswer__id,

          correctCurrent:
            this.props.typeQuiz === "survey"
              ? this.props.quiz[indexQuiz].survey__obtainable_coins
                ? this.props.quiz[indexQuiz].survey__obtainable_coins
                : false
              : correctResponse === responseQuiz
              ? true
              : false,

          correct:
            this.props.typeQuiz === "survey"
              ? this.props.quiz[indexQuiz].survey__obtainable_coins
                ? this.props.quiz[indexQuiz].survey__obtainable_coins
                : prevState.correct
              : correctResponse === responseQuiz
              ? prevState.correct + 1
              : prevState.correct
        };
      });
      setTimeout(() => this.child._onNextPress(), 200);
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

      setTimeout(() => this.setState({ isVisible: false }), 200);
      setTimeout(() => {
        this.setState({
          isVisible: true,

          indexQuiz: indexQuiz + 1
        });
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
    console.log({
      event_id: this.props.idQuiz,
      new_status: 1,
      answer_chosen_id: [],
      obtainable_coins: 0
    });
    if (this.props.typeQuiz === "quiz") {
      this.props.dispatch(
        putQuiz({
          event_id: this.props.idQuiz,
          new_status: 1,
          answer_chosen_id: [],
          obtainable_coins: 0
        })
      );
    } else if (this.props.typeQuiz === "survey") {
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

  quizBox = () => {
    const numAnswer = this.props.quiz[this.state.indexQuiz]
      .questiontoanswer__text_answer.length;
    if (numAnswer === 4) {
      let allQuiz = [
        ...this.props.quiz[this.state.indexQuiz].questiontoanswer__text_answer
      ];
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
                  onPress={() =>
                    this.changeQuiz(
                      elem.questiontoanswer__id,
                      this.state.indexQuiz,
                      elem.responseQuiz
                    )
                  }
                  style={{
                    backgroundColor: "#ffffff",
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
                        ? elem.responseQuiz
                        : this.stringWithEmoji(
                            this.dividetext(elem.responseQuiz)
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
                  onPress={() =>
                    this.changeQuiz(
                      elem.questiontoanswer__id,
                      this.state.indexQuiz,
                      elem.responseQuiz
                    )
                  }
                  style={{
                    backgroundColor: "#ffffff",
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
                        ? elem.responseQuiz
                        : this.stringWithEmoji(
                            this.dividetext(elem.responseQuiz)
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
      let allQuiz = [
        ...this.props.quiz[this.state.indexQuiz].questiontoanswer__text_answer
      ];
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
                  onPress={() =>
                    this.changeQuiz(
                      elem.questiontoanswer__id,
                      this.state.indexQuiz,
                      elem.responseQuiz
                    )
                  }
                  style={{
                    backgroundColor: "#ffffff",
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
              onPress={() =>
                this.changeQuiz(
                  elem.questiontoanswer__id,
                  this.state.indexQuiz,
                  elem.responseQuiz
                )
              }
              style={{
                backgroundColor: "#FFFFFF",
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

  modalQuizFullAndroid = () => {
    return (
      <Modal
        isVisible={this.state.isVisible}
        onSwipe={() => {
          this.closeEndModal();
        }}
        animationIn={this.state.animationIn}
        animationOut={this.state.animationOut}
        swipeDirection="down"
        style={{
          alignItems: "center",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-around",
          position: "absolute",
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
          top:
            Platform.OS === "ios" ? 0 : -Dimensions.get("screen").height * 0.05,
          left:
            Platform.OS === "ios" ? 0 : -Dimensions.get("screen").width * 0.05
        }}
        backdropOpacity={0.7}
      >
        <View style={styles.sfondo3}>
          <AppIntroSlider
            ref={ref => (this.child = ref)}
            notSwipe={true}
            activeDotColor={"#3363AD"}
            slides={this.props.quiz}
            renderItem={this._renderItem}
            nextLabel={"Next"}
            paginationContainer={{
              position: "absolute",
              bottom:
                Platform.OS === "ios" &&
                (Dimensions.get("window").height === 812 ||
                  Dimensions.get("window").width === 812 ||
                  Dimensions.get("window").height === 896 ||
                    Dimensions.get("window").width === 896)
                  ? 35
                  : 0,
              height: 40
            }}
            bottomButton={true}
          />
        </View>
      </Modal>
    );
  };

  _renderItem = props => (
    <SingleQuestion
      {...props}
      {...this.props}
      changeQuiz={this.changeQuiz}
      indexQuiz={this.state.indexQuiz}
      closeEndModal={this.closeEndModal}
      singleIdQuiz={this.state.singleIdQuiz}
      correct={this.state.correctCurrent}
    />
  );

  modalQuizFullIos = () => {
    return (
      <Modal
        isVisible={this.state.isVisible}
        onSwipe={() => {
          this.closeEndModal();
        }}
        animationIn={this.state.animationIn}
        animationOut={this.state.animationOut}
        animationInTiming={500}
        animationOutTiming={500}
        swipeDirection="down"
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
          <AppIntroSlider
            ref={ref => (this.child = ref)}
            notSwipe={true}
            activeDotColor={"#3363AD"}
            slides={this.props.quiz}
            renderItem={this._renderItem}
            nextLabel={"Next"}
            paginationContainer={{
              position: "absolute",
              bottom:
                Platform.OS === "ios" &&
                (Dimensions.get("window").height === 812 ||
                  Dimensions.get("window").width === 812 ||
                  Dimensions.get("window").height === 896 ||
                    Dimensions.get("window").width === 896)
                  ? 35
                  : 0,
              height: 40
            }}
            bottomButton={true}
          />
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
            ? this.modalQuizFullIos()
            : this.modalQuizFullAndroid()
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

  modalWinAndroid = avatarId => {
    return (
      <Modal
        isVisible={this.state.isVisible}
        onSwipe={() => {
          this.closeFinalModal();
        }}
        animationIn={this.state.animationIn}
        animationOut={this.state.animationOut}
        swipeDirection="down"
        style={{
          alignItems: "center",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-around",
          position: "absolute",
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
          top:
            Platform.OS === "ios" ? 0 : -Dimensions.get("screen").height * 0.05,
          left:
            Platform.OS === "ios" ? 0 : -Dimensions.get("screen").width * 0.05
        }}
        backdropOpacity={0.7}
      >
        <View style={styles.sfondo3}>
          <ImageBackground
            source={require("../../assets/images/quiz_win_page_bg.png")}
            style={styles.sfondo3}
          >
            {this.shadowClose()}
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
          {this.closeBotton()}
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
        swipeDirection="down"
        style={{
          alignItems: "center",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-around",
          position: "absolute",
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
          top:
            Platform.OS === "ios" ? 0 : -Dimensions.get("screen").height * 0.05,
          left:
            Platform.OS === "ios" ? 0 : -Dimensions.get("screen").width * 0.05
        }}
        backdropOpacity={0.7}
      >
        <View style={styles.sfondo3}>
          <ImageBackground
            source={require("../../assets/images/quiz_win_page_bg.png")}
            style={styles.sfondo3}
          >
            {this.shadowClose()}
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
                  Oh s##t!!{" "}
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
                  Sometimes we don't have the right questions. Or the right
                  answers. Keep on training my friend, after all tomorrow is
                  another day!
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
          {this.closeBotton()}
        </View>
      </Modal>
    );
  };

  modalWinIos = avatarId => {
    console.log(avatarId);
    return (
      <Modal
        isVisible={this.state.isVisible}
        onSwipe={() => {
          this.closeFinalModal();
        }}
        animationIn={this.state.animationIn}
        animationOut={this.state.animationOut}
        swipeDirection="down"
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
            {this.shadowClose()}
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
          {this.closeBotton()}
        </View>
      </Modal>
    );
  };

  closeBotton = () => {
    return (
      <View
        style={{
          position: "absolute",
          shadowRadius: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.5,
          backgroundColor: "transparent",

          top: 35 + this.state.dimExtra,
          right: 15,
          elevation: 2
        }}
      >
        <View>
          <TouchableHighlight
            style={{
              backgroundColor: "white",
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
            onPress={() => this.closeFinalModal()}
          >
            <Svg height="40" width="40" viewBox="0 0 100 100" fill="white">
              <Line
                x1="40"
                y1="40"
                x2="60"
                y2="60"
                stroke="black"
                strokeWidth="2"
              />
              <Line
                x1="60"
                y1="40"
                x2="40"
                y2="60"
                stroke="black"
                strokeWidth="2"
              />
            </Svg>
          </TouchableHighlight>
        </View>
      </View>
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
        swipeDirection="down"
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
            {this.shadowClose()}
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
                  Oh s##t!!{" "}
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
                  Sometimes we don't have the right questions. Or the right
                  answers. Keep on training my friend, after all tomorrow is
                  another day!
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
          {this.closeBotton()}
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

const Quiz = connect(state => {
  return {
    avatar: state.login.infoProfileNotSave.avatar
      ? state.login.infoProfileNotSave.avatar
      : state.login.infoProfile.avatar
      ? state.login.infoProfile.avatar
      : 0
  };
});

BonusQuestion.defaultProps = {
  typeQuiz: "quiz",
  quiz: [],
  idQuiz: 0,
  deleteModal: () => {}
};

export default Quiz(BonusQuestion);
