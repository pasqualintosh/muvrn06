// DetailTrainingScreen
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Alert,
  ImageBackground,
  Animated,
  ScrollView,
  PanResponder,
  StatusBar
} from "react-native";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import Svg, { Circle, Line } from "react-native-svg";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";

import { UpdateProfile } from "./../../domains/login/ActionCreators";

import { strings } from "../../config/i18n";
import { translateEvent } from "./../../helpers/translateEvent";
import { infoEvents } from "./../../helpers/dataEvents";
import { Client } from "bugsnag-react-native";
const bugsnag = new Client("58b3b39beb78eba9efdc2d08aeb15d84");

class DetailTrainingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bike: 0,
      tapped: false,
      scroll: new Animated.Value(0),
      active: false
    };
  }

  static navigationOptions = {
    header: null
  };

  checkImage(eventId, eventsCompleted, eventsNumber) {
    if (eventsCompleted == eventsNumber) {
      return true;
    } else {
      let flag = false;
      this.props.trainingsState.training_events.forEach(e => {
        if (e.event.id == eventId && e.status == 1) flag = true;
      });
      if (flag) return true;
      else {
        return false;
      }
    }
  }

  renderSessionDescription(descriptionSession) {
    if (descriptionSession.length) {
      return (
        <View>
          <View
            style={{
              height: 10
            }}
          />
          <Text style={styles.textDescriptionSession}>
            {descriptionSession}
          </Text>
          <View
            style={{
              height: 50
            }}
          />
        </View>
      );
    } else {
      return <View />;
    }
  }

  counterValid = (numberCounter, dataRedux, checkTime) => {
    let dateNow = 0;
    let dateCounter = 0;
    let dateSave = 0;
    switch (checkTime) {
      case "day":
        dateCounter = dataRedux ? dataRedux.date : 0;
        dateNow = new Date().toDateString();

        dateSave = new Date(dateCounter).toDateString();

        if (dateNow === dateSave) {
          return numberCounter;
        } else {
          return 0;
        }
        break;
      case "row":
        dateCounter = dataRedux ? dataRedux.date : 0;
        dateNow = new Date(new Date().toDateString()).getTime();
        console.log(dateNow);

        dateSave = new Date(
          new Date(1561531227180 + 86400000).toDateString()
        ).getTime();
        console.log(dateSave);

        // se supera di due giorni allora la serie non è piu valida
        if (dateNow > dateSave) {
          return 0;
        } else {
          return numberCounter;
        }

        break;
      case "week":
        dateCounter = dataRedux ? dataRedux.date : 0;
        // dateSave = new Date(dateCounter).toDateString();
        const millisecond = new Date().getTime();
        let DayNowFromMon = new Date(millisecond).getDay();

        DayNowFromMon = DayNowFromMon ? DayNowFromMon - 1 : 6;

        const startWeek = millisecond - DayNowFromMon * 86400000;
        // inizio settimana
        dateNow = new Date(startWeek).toDateString();

        const Save = new Date(dateCounter);
        const millisecondSave = Save.getTime();
        console.log(millisecondSave);

        let DaySaveFromMon = new Date(millisecondSave).getDay();
        console.log(DaySaveFromMon);
        DaySaveFromMon = DaySaveFromMon ? DaySaveFromMon - 1 : 6;

        const startWeekSave = millisecondSave - DaySaveFromMon * 86400000;
        // inizio settimana
        dateSave = new Date(startWeekSave).toDateString();
        console.log(dateSave);
        console.log(dateNow);
        if (dateNow === dateSave) {
          return numberCounter;
        } else {
          return 0;
        }

      case "month":
        dateNow = new Date().getMonth();
        dateCounter = dataRedux ? dataRedux.date : 0;
        dateSave = new Date(dateCounter).getMonth();
        if (dateNow === dateSave) {
          return numberCounter;
        } else {
          return 0;
        }

      case "weekend":
        dateNow = new Date(new Date().getTime() - 86400000).getDay();
        if (dateNow === 5 || dateNow === 6) {
          return numberCounter;
        } else {
          return 0;
        }

        break;
      case "48H":
        dateNow = new Date().getTime();
        const limit = dateNow - 86400000 * 2;
        let array48 = dataRedux ? dataRedux.array : [];
        array48 = array48.filter(route => route.date >= limit);
        const counterNew = array48.reduce(
          (total, elem) => total + elem.counter,
          0
        );

        return counterNew;
        break;
      default:
        return numberCounter;
        break;
    }
  };

  renderEventsDescription(events, eventsCompleted, eventsNumber, color) {
    if (events)
      return events.map(e => {
        const completed = this.checkImage(e.id, eventsCompleted, eventsNumber);
        const shadow = completed
          ? {}
          : {
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,

              elevation: 2
            };

        let numberCounter = 0;
        let completedCounter = 0;

        // se non è completato vedo se ha un contatore da visualizzare
        if (!completed) {
          let eventsData = infoEvents(e.text_description);
          console.log(eventsData);

          if (eventsData.counter.length) {
            const statusCheckEvents = this.props.trainingsState
              .statusCheckEvents
              ? this.props.trainingsState.statusCheckEvents
              : {};
            console.log(statusCheckEvents);
            const dataSave = statusCheckEvents[eventsData.counter]
              ? statusCheckEvents[eventsData.counter]
              : 0;
            console.log(dataSave);
            numberCounter = dataSave ? dataSave.counter : 0;

            completedCounter = eventsData.completedCounter;
            // faccio un check per vedere il counter salvato è ancora valido
            // oppure è scaduto tipo se oggi è scaduta la possibilita di continuare la serie
            const checkTime = eventsData ? eventsData.type : "";
            // vedo se è valido
            console.log(checkTime);
            try {
              numberCounter = this.counterValid(
                numberCounter,
                dataSave,
                checkTime
              );
              console.log(numberCounter);
            } catch (error) {
              // Error saving data
              bugsnag.notify(error);
            }
          }
        }
        console.log(numberCounter);

        return (
          <View key={e.id}>
            <View
              style={{
                height: 52,
                backgroundColor: completed ? color : "#FFFFFF",
                width: Dimensions.get("window").width * 0.9,

                alignContent: "flex-start",
                justifyContent: "flex-start",
                flexDirection: "column",
                alignItems: "flex-start",
                borderRadius: 4,
                ...shadow
              }}
            >
              <View
                style={{
                  height: 50,

                  width: Dimensions.get("window").width * 0.9,

                  alignContent: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => this.showDescriptionIconModal()}
                >
                  <View
                    style={{
                      height: 50,
                      //  backgroundColor: "#5FC4E2",
                      width: Dimensions.get("window").width * 0.8,

                      alignContent: "center",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <View
                      style={{
                        height: 50,

                        width: Dimensions.get("window").width * 0.8 - 80,
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "OpenSans-Bold",

                          color: completed ? "#FFFFFF" : "#3D3D3D",
                          fontSize: 12
                          // textDecorationLine: this.checkImage(
                          //   e.id,
                          //   eventsCompleted,
                          //   eventsNumber
                          // )
                          //   ? "line-through"
                          //   : "none"
                        }}
                      >
                        {e.quiz
                          ? strings("_228_answer_a_quick_")
                          : e.survey
                          ? strings("answer_a_quick_")
                          : translateEvent(e.text_description)}
                        {/* : e.text_description} */}
                      </Text>
                    </View>
                    <View
                      style={{
                        height: 10
                      }}
                    />

                    {this.viewIcon(e, completed)}
                  </View>
                </TouchableWithoutFeedback>
              </View>
              {!completed ? (
                <View
                  style={{
                    height: 2,
                    backgroundColor: color,
                    width:
                      completedCounter != 0
                        ? (Dimensions.get("window").width *
                            0.9 *
                            numberCounter) /
                          completedCounter
                        : 0,

                    alignContent: "flex-start",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    borderRadius: 20
                  }}
                />
              ) : (
                <View />
              )}
            </View>

            <View
              style={{
                height: 50
              }}
            />
          </View>
        );
      });
  }

  renderObtainableCoins(obtainableCoins) {
    return (
      <View
        style={{
          justifyContent: "flex-end",
          flexDirection: "row",
          width: Dimensions.get("window").width * 0.9
        }}
      >
        <Image
          source={require("../../assets/images/coins_shadow_icn.png")}
          style={{
            width: 20,
            height: 20,
            marginTop: Platform.OS === "android" ? 6 : 0
          }}
        />
        <View style={{ width: 7, height: 7 }} />
        <Text style={[styles.coinSession, { fontSize: 20 }]}>
          {obtainableCoins}
        </Text>
      </View>
    );
  }

  back = () => {
    this.props.navigation.goBack();
  };

  viewIcon = (e, completed) => {
    // ? "#FFFFFF" : "#3D3D3D"
    const color = "#3D3D3D";
    let iconChoose = [];
    if (completed) {
      return (
        <View
          style={{
            height: 50,

            width: 70,
            flexDirection: "row",
            alignItems: "center",
            // justifyContent: "space-between"
            justifyContent: "flex-end"
          }}
        >
          <OwnIcon
            name="check_special_training_completed_icn"
            size={28}
            color={"#FFFFFF"}
          />
        </View>
      );
    } else if (e.quiz || e.survey) {
      return (
        <View
          style={{
            height: 50,

            width: 70,
            flexDirection: "row",
            alignItems: "center",
            // justifyContent: "space-between"
            justifyContent: "flex-end"
          }}
        >
          <OwnIcon name="quiz_training_icn" size={35} color={color} />
        </View>
      );
    } else {
      // e.typology = ROT+FQY
      // console.log(e.typology);
      let type = "";
      if (e.typology) type = e.typology.split("+");
      console.log(type);

      for (indexType = 0; indexType < type.length; indexType++) {
        const foundType = type[indexType];

        if (foundType === "MOD") {
          iconChoose = [...iconChoose, "transit_mode_training_icn"];
        } else if (foundType == "PTS") {
          iconChoose = [...iconChoose, "points_training_icn"];
        } else if (foundType == "STS") {
          iconChoose = [...iconChoose, "specific_time_span_training_icn"];
        } else if (foundType == "MOB") {
          iconChoose = [...iconChoose, "quiz_training_icn"];
        } else if (foundType == "ROT") {
          iconChoose = [...iconChoose, "routinary_trip_training_icn"];
        } else if (foundType == "FQY") {
          iconChoose = [...iconChoose, "trip_frequency_training_icn"];
        } else if (foundType == "QUZ") {
          iconChoose = [...iconChoose, "quiz_training_icn"];
        } else if (foundType == "WEA") {
          iconChoose = [...iconChoose, "weather_conditions_training_icn"];
        }
      }

      if (iconChoose.length === 1) {
        return (
          <View
            style={{
              height: 50,

              width: 70,
              flexDirection: "row",
              alignItems: "center",
              // justifyContent: "space-between"
              justifyContent: "flex-end"
            }}
          >
            <OwnIcon name={iconChoose[0]} size={35} color={color} />
          </View>
        );
      } else if (iconChoose.length === 2) {
        return (
          <View
            style={{
              height: 50,

              width: 70,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
              // justifyContent: "flex-end"
            }}
          >
            <OwnIcon name={iconChoose[0]} size={35} color={color} />

            <OwnIcon name={iconChoose[1]} size={35} color={color} />
          </View>
        );
      }
    }
  };

  _renderModalContent = () => {
    return (
      <View
        style={[
          styles.modalContent,
          {
            flexDirection: "column",
            alignContent: "space-between",
            alignItems: "center",
            justifyContent: "space-around"
          }
        ]}
      >
        <Image
          source={require("../../assets/images/trainings/training_feed_icn.png")}
          style={{ width: 75, height: 75 }}
        />
        <View
          style={{
            width: Dimensions.get("window").width * 0.9,
            paddingTop: 10
          }}
        >
          <Text style={styles.title}>Training Legend</Text>
        </View>
        <View style={{ paddingTop: 20, paddingBottom: 20 }}>
          <Text style={styles.text}>
            {
              "Each Training Event offers you a challenge to overcome.\nThese challenges are created by picking one or more of the following categories:"
            }
          </Text>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width * 0.8,
            flexDirection: "row"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon
              name="transit_mode_training_icn"
              size={30}
              color={"#3D3D3D"}
            />

            <Text style={styles.typeIcon}>Transit mode</Text>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon name="check_in_training_icn" size={30} color={"#3D3D3D"} />

            <Text style={styles.typeIcon}>Check-in</Text>
          </View>
        </View>

        <View
          style={{
            width: Dimensions.get("window").width * 0.8,
            flexDirection: "row"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon
              name="trip_frequency_training_icn"
              size={30}
              color={"#3D3D3D"}
            />

            <Text style={styles.typeIcon}>Frequency trip</Text>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon name="trivia_training_icn" size={30} color={"#3D3D3D"} />

            <Text style={styles.typeIcon}>Trivia</Text>
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width * 0.8,
            flexDirection: "row"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon
              name="routinary_trip_training_icn"
              size={30}
              color={"#3D3D3D"}
            />

            <Text style={styles.typeIcon}>Routinary trip</Text>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon
              name="shared_trip_training_icn"
              size={30}
              color={"#3D3D3D"}
            />

            <Text style={styles.typeIcon}>Shared trip</Text>
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width * 0.8,
            flexDirection: "row"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon
              name="mobility_habits_training_icn"
              size={30}
              color={"#3D3D3D"}
            />

            <Text style={styles.typeIcon}>Mobility habits</Text>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon name="points_training_icn" size={30} color={"#3D3D3D"} />

            <Text style={styles.typeIcon}>Points</Text>
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width * 0.8,
            flexDirection: "row"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon name="quiz_training_icn" size={30} color={"#3D3D3D"} />

            <Text style={styles.typeIcon}>Quiz</Text>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon
              name="weather_conditions_training_icn"
              size={30}
              color={"#3D3D3D"}
            />

            <Text style={styles.typeIcon}>Weather conditions</Text>
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width * 0.8,
            flexDirection: "row"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon name="sponsors_training_icn" size={30} color={"#3D3D3D"} />

            <Text style={styles.typeIcon}>Sponsors</Text>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon
              name="specific_time_span_training_icn"
              size={30}
              color={"#3D3D3D"}
            />

            <Text style={styles.typeIcon}>Specific time span</Text>
          </View>
        </View>
      </View>
    );
  };

  DeleteDescriptionIconModal = () => {
    // Alert.alert("weather");
    this.setState({
      active: false
    });
  };

  showDescriptionIconModal = () => {
    // Alert.alert("weather");
    this.setState({
      active: true
    });
  };

  onScroll = event => {
    //console.log(event.nativeEvent.contentOffset.y);
    const offsetY = event.nativeEvent.contentOffset.y;

    console.log(offsetY);
    this.setState({
      scroll: offsetY
    });
  };

  render() {
    const color = this.props.navigation.getParam("color", "#5FC4E2");

    const indexSession = this.props.navigation.getParam("indexSession", 0);

    const sessionName = this.props.navigation.getParam(
      "sessionName",
      "Title Session"
    );
    const eventsNumber = this.props.navigation.getParam("eventsNumber", "1");
    const eventsCompleted = this.props.navigation.getParam(
      "eventsCompleted",
      "1"
    );

    const events = this.props.navigation.getParam("events", []);
    console.log(events);
    const completed = this.props.navigation.getParam("completed", false);
    const levelCorrent = this.props.navigation.getParam("levelCorrent", 1);
    const id = this.props.navigation.getParam("id", 1);
    const obtainableCoins = this.props.navigation.getParam(
      "obtainableCoins",
      0
    );
    const index = this.props.navigation.getParam("index", 1);
    const level = this.props.navigation.getParam("level", 1);
    const descriptionSession = this.props.navigation.getParam(
      "descriptionSession",
      ""
    );
    const color1 = level ? color : "#FA941E";

    let headerHeight = this.state.scroll.interpolate({
      inputRange: [0, 300],
      outputRange: [0, Platform.OS === "android" ? -90 : -130],
      extrapolate: "clamp"
    });
    let headerHeightWave = this.state.scroll.interpolate({
      inputRange: [0, 300],
      outputRange: [
        Platform.OS === "android"
          ? -(Dimensions.get("window").height + 150 / 2) + 120
          : -(Dimensions.get("window").height + 150 / 2) + 170,
        Platform.OS === "android"
          ? -(Dimensions.get("window").height + 150 / 2) + 30
          : -(Dimensions.get("window").height + 150 / 2) + 40
      ],
      extrapolate: "clamp"
    });
    // -(Dimensions.get("window").height / 2 - 180)
    // Platform.OS === "android" ? -380 - 180 : -420 - 150,
    //     Platform.OS === "android" ? -520 - 130 : -560 - 150
    console.log(Dimensions.get("window").height);
    const imageTranslate = this.state.scroll.interpolate({
      inputRange: [0, 300],
      outputRange: [0, 100],
      extrapolate: "clamp"
    });
    let opacity = this.state.scroll.interpolate({
      inputRange: [0, 200],
      outputRange: [1, 0],
      extrapolate: "clamp"
    });
    // let headerHeightBack = this.state.scroll.interpolate({
    //   inputRange: [0, 300],
    //   outputRange: [0, 120],
    //   extrapolate: "clamp"
    // });
    let leftText = this.state.scroll.interpolate({
      inputRange: [0, 300],
      outputRange: [0, 30],
      extrapolate: "clamp"
    });

    // enum('default', 'light-content', 'dark-content')

    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height + 150,
          backgroundColor: "#F7F8F9"
        }}
      >
        <StatusBar backgroundColor={color} barStyle="light-content" />
        <Modal
          isVisible={this.state.active}
          onBackdropPress={() => this.DeleteDescriptionIconModal()}
          onBackButtonPress={() => this.DeleteDescriptionIconModal()}
        >
          {this._renderModalContent()}
        </Modal>
        <Animated.ScrollView
          contentContainerStyle={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height + 400
          }}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scroll } } }
          ])}
          scrollEventThrottle={16}
        >
          <View
            style={{
              backgroundColor: "#F7F8F9",
              marginTop: Platform.OS === "android" ? 150 : 200,
              // marginBottom: -200,
              width: Dimensions.get("window").width,

              alignContent: "center",
              justifyContent: "space-around",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <View
              style={{
                height: 50
              }}
            />
            {this.renderSessionDescription(descriptionSession)}
            {this.renderEventsDescription(
              events,
              eventsCompleted,
              eventsNumber,
              color
            )}
            {this.renderObtainableCoins(obtainableCoins)}
          </View>
        </Animated.ScrollView>

        <Animated.View
          style={{
            // height: headerHeight,
            backgroundColor: color,
            width: Dimensions.get("window").width,
            alignContent: "center",
            justifyContent: "flex-end",
            flexDirection: "column",
            alignItems: "center",
            overflow: "hidden",
            position: "absolute",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            width: null,
            // backgroundColor: color,
            overflow: "hidden",
            height: Platform.OS === "android" ? 150 : 200,
            transform: [{ translateY: headerHeight }]
          }}
        >
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 0.0, y: 1.0 }}
            locations={[0, 1.0]}
            colors={[color, color1]}
            style={{
              width: Dimensions.get("window").width,

              overflow: "hidden",
              height: Platform.OS === "android" ? 150 : 200
            }}
          >
            <Animated.View
              style={{
                // height: headerHeight,
                // backgroundColor: color,
                width: Dimensions.get("window").width,
                alignContent: "center",
                justifyContent: "flex-end",
                flexDirection: "column",
                alignItems: "center",

                height: Platform.OS === "android" ? 90 : 140
              }}
            >
              <Animated.Image
                style={{
                  width: Platform.OS === "android" ? 60 * 2.4 : 80 * 2.4,
                  height: Platform.OS === "android" ? 60 + 20 : 80 + 20,
                  opacity: opacity,
                  transform: [{ translateY: imageTranslate }]
                }}
                source={master[level]}
              />
            </Animated.View>

            <View
              style={{
                height: 60,
                // backgroundColor: color,
                width: Dimensions.get("window").width,

                alignContent: "center",
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  height: 60,

                  width: Dimensions.get("window").width,

                  alignContent: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <Animated.View
                  style={{
                    transform: [{ translateX: leftText }],
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center"
                  }}
                >
                  <View style={{ width: 20, height: 60 }}></View>
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontWeight: "600",
                      fontStyle: "normal",
                      color: "#FFFFFF",
                      fontSize: 15,
                      textAlign: "center"
                    }}
                  >
                    {sessionName}
                  </Text>
                </Animated.View>
                <Animated.View
                  style={{
                    backgroundColor: "white",
                    width: 30,
                    height: 20,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    alignContent: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    opacity: opacity
                  }}
                >
                  <Text style={[styles.numberSession, { color: color }]}>
                    {indexSession + 1}
                  </Text>
                </Animated.View>
                {/* <Animated.Text
                  style={{
                    fontFamily: "OpenSans-Regular",

                    color: "#FFFFFF",
                    fontSize: 12,
                    opacity: opacity,
                    marginBottom: -3
                  }}
                >
                  {eventsCompleted + "/" + eventsNumber}
                </Animated.Text> */}
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.Image
          style={{
            width: Dimensions.get("window").width,
            height: 50,
            top: 0,
            left: 0,
            right: 0,

            overflow: "hidden",

            transform: [{ translateY: headerHeightWave }]
          }}
          source={images[level]}
        />
        <View
          style={{
            height: 30,
            position: "absolute",
            width: Dimensions.get("window").width,
            alignContent: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            top: Platform.OS == "ios" ? 27.5 : 15,

            right: -10
          }}
        >
          <TouchableWithoutFeedback onPress={() => this.back()}>
            <View
              style={{
                height: 30,
                width: 30,
                paddingLeft: 10
                // backgroundColor: "red"
              }}
            >
              {/* <OwnIcon name="scroll_animation_icn" size={25} color="#FFFFFF" /> */}
              <Icon
                name="ios-arrow-back"
                style={{ marginTop: Platform.OS == "ios" ? 2 : 0 }}
                size={25}
                color="#FFFFFF"
                onPress={() => this.back()}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const images = {
  1: require("../../assets/images/wawe_mobility_habits_light_blue.png"),
  4: require("../../assets/images/wave_trainings_pink.png"),
  2: require("../../assets/images/wawe_mobility_habits_pink.png"),
  3: require("../../assets/images/wawe_mobility_habits_green.png"),
  0: require("../../assets/images/wave_trainings_yellow.png")
};

export const master = {
  0: require("../../assets/images/trainings/training_master_special.png"),
  1: require("../../assets/images/trainings/training_master_newbie.png"),
  2: require("../../assets/images/trainings/training_master_rookie.png"),
  3: require("../../assets/images/trainings/training_master_pro.png"),
  4: require("../../assets/images/trainings/training_master_star.png")
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7F8F9"
  },
  numberSession: {
    color: "#3d3d3d",
    fontSize: 15,
    textAlign: "left",
    fontFamily: "Montserrat-ExtraBold"
  },
  typeIcon: {
    textAlign: "center",
    color: "#3D3D3D",
    fontFamily: "OpenSans-Regular",

    fontSize: 8
  },
  coinSession: {
    color: "#3D3D3D",
    // fontSize: 15,
    // backgroundColor: "#00000050",
    // fontWeight: "bold",
    textAlign: "right",
    fontFamily: "Montserrat-ExtraBold"
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#3D3D3D",
    fontFamily: "OpenSans-Regular",
    fontSize: 14
  },
  text: {
    textAlign: "left",
    color: "#3D3D3D",
    fontFamily: "OpenSans-Regular",
    fontSize: 10
  },
  headerContainer: {
    backgroundColor: "#E83475",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.25 - 50,
    justifyContent: "center",
    alignItems: "center"
  },
  bodyContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.75,
    // flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  textSection: {
    fontFamily: "OpenSans-Regular",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20
  },
  answerBoxes: {
    height: 80,
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  checkboxes: {
    height: 35,
    width: 35,
    borderRadius: 20,
    backgroundColor: "#F7F8F9",
    justifyContent: "center",
    alignItems: "center"
  },
  checkboxesGradient: {
    height: 18,
    width: 18,
    borderRadius: 10,
    backgroundColor: "#F7F8F9"
  },
  checkboxesText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 11,
    marginLeft: 6
  },
  checkboxesContainer: {
    width: Dimensions.get("window").width * 0.25,
    height: Dimensions.get("window").height * 0.1,
    // flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  boxesContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.15,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start"
    // backgroundColor: "#e33"
  },
  btnContainer: {
    backgroundColor: "#60368C",
    width: Dimensions.get("window").width * 0.4,
    height: 40,
    borderRadius: 4,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  textDescriptionSession: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3D3D3D",
    fontSize: 12,
    alignContent: "center"
  },
  btnText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 15
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,

    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  }
});

const withData = connect(state => {
  return {
    trainingsState: state.trainings
  };
});

export default withData(DetailTrainingScreen);
