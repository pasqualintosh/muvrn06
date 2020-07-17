import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Platform,
  NativeModules,
  TouchableWithoutFeedback,
  Image,
  Picker as PickerIos,
  Alert
} from "react-native";
import WavyArea from "./../../components/WavyArea/WavyArea";
import LinearGradient from "react-native-linear-gradient";
import { BoxShadow } from "react-native-shadow";
import Modal from "react-native-modal";
import PickerAndroid from "./../../components/PickerAndroid/PickerAndroid";
import { connect } from "react-redux";
import { updateState } from "./../../domains/register/ActionCreators";
import Emoji from "@ardentlabs/react-native-emoji";
import Icon from "react-native-vector-icons/Ionicons";
import OnboardingWeekDay from "./../../components/WeekDayNotificationPicker/OnboardingWeekDay";
import DateTimePicker from "react-native-modal-datetime-picker";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";

let Picker = Platform.OS === "ios" ? PickerIos : PickerAndroid;
let PickerItem = Picker.Item;

import { strings } from "../../config/i18n";

class FrequentTripScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frequecy_values: [1, 2, 3, 4, 5, 6, 7],
      frequecy_selected: 0,
      modal_visible: false,
      modal_types_visible: false,
      // frequent_type: [
      // "OTHER",
      // "HOME",
      // "WORK",
      // "GYM",
      // "SCHOOL"
      // "WORK#2",
      // "MOM/DAD",
      // "GRANDMA/GRANDPA",
      // "GIRLFRIEND/BOYFRIEND",
      // "KIDS' SCHOOL",
      // "FRIEND'S PLACE",
      // "SUPERMARKET",
      // "BAR/RESTAURANT",
      // "CINEMA/THEATER"
      // ],
      frequent_type: [
        strings("other").toLocaleUpperCase(),
        strings("work").toLocaleUpperCase(), // +1
        strings("school_universi").toLocaleUpperCase() // +2
      ],
      choosed_week_days: {
        0: false,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: false
      },
      start_datetime_picker_visible: false,
      end_datetime_picker_visible: false,
      frequent_trip_start_time: "9:00",
      frequent_trip_end_time: "17:00",
      frequent_trip_type_start: 1,
      frequent_trip_type_end: 1
    };
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    if (this.props.registerState.mostFrequentRaceFrequency)
      this.setState({
        frequecy_selected: this.props.registerState.mostFrequentRaceFrequency
      });
  }

  checkChoosedWeekdays() {
    let flag = false;
    for (let index = 0; index < 7; index++) {
      if (this.state.choosed_week_days[index]) flag = true;
    }
    return flag;
  }

  _showStartDateTimePicker = () =>
    this.setState({ start_datetime_picker_visible: true });

  _hideStartDateTimePicker = () =>
    this.setState({ start_datetime_picker_visible: false });

  _handleStartDatePicked = date => {
    this._hideStartDateTimePicker();
    let h = date.getHours();
    let m = date.getMinutes();

    console.log(h);
    console.log(m);
    if (m == 0) {
      m = "00";
    }
    this.setState({ frequent_trip_start_time: h + ":" + m });

    this.props.dispatch(updateState({ frequent_trip_start_time: h + ":" + m }));
  };

  _showEndDateTimePicker = () =>
    this.setState({ end_datetime_picker_visible: true });

  _hideEndDateTimePicker = () =>
    this.setState({ end_datetime_picker_visible: false });

  _handleEndDatePicked = date => {
    this._hideEndDateTimePicker();
    let h = date.getHours();
    let m = date.getMinutes();
    if (m == 0) {
      m = "00";
    }

    console.log(h);
    console.log(m);
    this.setState({ frequent_trip_end_time: h + ":" + m });
  };

  validateFrequentTripPoints() {
    // this.props.registerState.frequent_trip_start
    // this.props.registerState.frequent_trip_end

    let result = false;

    if (this.props.registerState.frequent_trip_start)
      if (this.props.registerState.frequent_trip_start.latitude != 0)
        result = true;
    if (this.props.registerState.frequent_trip_start)
      if (this.props.registerState.frequent_trip_start.longitude != 0)
        result = true;

    if (this.props.registerState.frequent_trip_end)
      if (this.props.registerState.frequent_trip_end.latitude != 0)
        result = true;

    if (this.props.registerState.frequent_trip_end)
      if (this.props.registerState.frequent_trip_end.longitude != 0)
        result = true;

    // if (!result) alert("frequent trip non valida");

    return result;
  }

  convertionModalType(value) {
    switch (value) {
      case this.state.frequent_type[0]:
        return 0;
        break;
      case this.state.frequent_type[1]:
        return 1;
        break;
      case this.state.frequent_type[2]:
        return 2;
        break;

      default:
        return 0;
    }
  }

  setDayWeek = index => {
    let days = this.state.choosed_week_days;
    days[index] = !days[index];

    this.setState({
      choosed_week_days: days
    });
  };

  renderWeekdays() {
    return (
      <View style={styles.weekDayContainer}>
        <OnboardingWeekDay
          index={1}
          dayName={strings("mon").toLocaleUpperCase()}
          selected={this.state.choosed_week_days[1]}
          onPress={this.setDayWeek}
        />
        <OnboardingWeekDay
          index={2}
          dayName={strings("tue").toLocaleUpperCase()}
          selected={this.state.choosed_week_days[2]}
          onPress={this.setDayWeek}
        />
        <OnboardingWeekDay
          index={3}
          dayName={strings("wed").toLocaleUpperCase()}
          selected={this.state.choosed_week_days[3]}
          onPress={this.setDayWeek}
        />
        <OnboardingWeekDay
          index={4}
          dayName={strings("thu").toLocaleUpperCase()}
          selected={this.state.choosed_week_days[4]}
          onPress={this.setDayWeek}
        />
        <OnboardingWeekDay
          index={5}
          dayName={strings("fri").toLocaleUpperCase()}
          selected={this.state.choosed_week_days[5]}
          onPress={this.setDayWeek}
        />
        <OnboardingWeekDay
          index={6}
          dayName={strings("sat").toLocaleUpperCase()}
          selected={this.state.choosed_week_days[6]}
          onPress={this.setDayWeek}
        />
        <OnboardingWeekDay
          index={0}
          dayName={strings("sun").toLocaleUpperCase()}
          selected={this.state.choosed_week_days[0]}
          onPress={this.setDayWeek}
        />
      </View>
    );
  }

  renderBoxA() {
    let shadowOpt;
    if (Platform.OS == "ios") {
      shadowOpt = {
        width: Dimensions.get("window").width * 0.9,
        height: Dimensions.get("window").height * 0.06,
        color: "#111",
        border: 4,
        radius: 5,
        opacity: 0.25,
        x: 0,
        y: 1,
        style: {
          position: "absolute"
          // top: Dimensions.get("window").height * 0.04,
          // left: Dimensions.get("window").width * 0.28
        }
      };
    } else
      shadowOpt = {
        width: Dimensions.get("window").width * 0.9,
        height: Dimensions.get("window").height * 0.06,
        color: "#444",
        border: 6,
        radius: 5,
        opacity: 0.35,
        x: 0,
        y: 1,
        style: {
          position: "absolute"
          // top: Dimensions.get("window").height * 0.04,
          // left: Dimensions.get("window").width * 0.28
        }
      };
    return (
      <View style={styles.tripPointersContainer}>
        <BoxShadow setting={shadowOpt} />
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 4,
            flexDirection: "row"
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              height: Dimensions.get("window").height * 0.09,
              width: Dimensions.get("window").width * 0.2 + 5,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              borderRadius: 4
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: "#F7F8F9",
                  height: Dimensions.get("window").height * 0.09 - 10,
                  width: Dimensions.get("window").width * 0.2 - 5,
                  borderRadius: 4,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center"
                }}
              >
                <Text style={styles.tripLeftText}>
                  {strings("home").toLocaleUpperCase()}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View
            style={{
              backgroundColor: "#F7F8F9",
              height: Dimensions.get("window").height * 0.09 - 10,
              width: 1,

              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center"
            }}
          />
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate("SurveyFrequentTripMap", {
                start_point: true,
                end_point: false
              });
            }}
          >
            <View style={styles.tripPointContainer}>
              <Text style={styles.textTrip}>
                {this.props.registerState.frequent_trip_start != null
                  ? this.props.registerState.frequent_trip_start.street
                  : strings("insert_the_addr")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  renderBoxB() {
    let shadowOpt;
    if (Platform.OS == "ios") {
      shadowOpt = {
        width: Dimensions.get("window").width * 0.9,
        height: Dimensions.get("window").height * 0.06,
        color: "#111",
        border: 4,
        radius: 5,
        opacity: 0.25,
        x: 0,
        y: 1,
        style: {
          position: "absolute"
          // top: Dimensions.get("window").height * 0.04,
          // left: Dimensions.get("window").width * 0.28
        }
      };
    } else
      shadowOpt = {
        width: Dimensions.get("window").width * 0.9,
        height: Dimensions.get("window").height * 0.06,
        color: "#444",
        border: 6,
        radius: 5,
        opacity: 0.35,
        x: 0,
        y: 1,
        style: {
          position: "absolute"
          // top: Dimensions.get("window").height * 0.04,
          // left: Dimensions.get("window").width * 0.28
        }
      };
    return (
      <View style={styles.tripPointersContainer}>
        {this.renderTypesModal()}
        <BoxShadow setting={shadowOpt} />
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 4,
            flexDirection: "row"
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              height: Dimensions.get("window").height * 0.09,
              width: Dimensions.get("window").width * 0.2 + 25,
              borderRadius: 4,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center"
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ modal_types_visible: true });
              }}
            >
              <View
                style={{
                  height: Dimensions.get("window").height * 0.09 - 10,
                  width: Dimensions.get("window").width * 0.2 + 15,
                  borderRadius: 4,
                  flexDirection: "row",
                  backgroundColor: "#F7F8F9"
                }}
              >
                <View
                  style={{
                    height: Dimensions.get("window").height * 0.09 - 10,
                    width: Dimensions.get("window").width * 0.2 - 5,

                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center"
                  }}
                >
                  <Text style={styles.tripLeftText}>
                    {this.state.frequent_type[
                      this.state.frequent_trip_type_end
                    ].substring(0, 6)}
                    ...
                  </Text>
                </View>
                <View
                  style={{
                    height: Dimensions.get("window").height * 0.09 - 10,
                    width: 20,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    alignSelf: "center"
                  }}
                >
                  <Icon
                    name="ios-arrow-down"
                    size={15}
                    color="#3d3d3d"
                    style={{ alignSelf: "center" }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View
            style={{
              backgroundColor: "#F7F8F9",
              height: Dimensions.get("window").height * 0.09 - 10,
              width: 1,

              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center"
            }}
          />
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate("SurveyFrequentTripMap", {
                start_point: false,
                end_point: true
              });
            }}
          >
            <View style={styles.tripSecondPointContainer}>
              <Text style={styles.textTrip}>
                {this.props.registerState.frequent_trip_end != null
                  ? this.props.registerState.frequent_trip_end.street
                  : strings("insert_the_addr")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  renderFrequencyBox() {
    return (
      <View
        style={{
          height:
            Platform.OS == "ios"
              ? Dimensions.get("window").height * 0.125
              : Dimensions.get("window").height * 0.1,
          width: Dimensions.get("window").width * 0.85,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        {this.renderModal()}

        <View style={{ flex: 0.6 }}>
          <Text style={styles.textFrequency}>{strings("how_many_days_a")}</Text>
        </View>

        <View style={{ flex: 0.2 }}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({ modal_visible: true });
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 4,
                height: Dimensions.get("window").height * 0.09,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                bottom: 4
              }}
            >
              <Text>
                {this.state.frequecy_selected}
                &nbsp;
              </Text>
              <Icon
                name="ios-arrow-down"
                size={18}
                color="#3d3d3d"
                // style={{ alignSelf: "center" }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  renderButtonsModal() {
    return (
      <View style={styles.buttonsContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ modal_visible: false });
          }}
        >
          <View style={styles.buttonModalContainer}>
            <Text style={styles.textButton}>
              {strings("undo").toLocaleUpperCase()}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ modal_visible: false }, () => {});
          }}
        >
          <View style={styles.buttonModalContainer}>
            <Text style={styles.textButton}>
              {strings("ok").toLocaleUpperCase()}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderButtonsModalTypes() {
    return (
      <View style={styles.buttonsContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ modal_types_visible: false });
          }}
        >
          <View style={styles.buttonModalContainer}>
            <Text style={styles.textButton}>
              {strings("undo").toLocaleUpperCase()}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ modal_types_visible: false }, () => {});
          }}
        >
          <View style={styles.buttonModalContainer}>
            <Text style={styles.textButton}>
              {strings("ok").toLocaleUpperCase()}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderModal() {
    const values = this.state.frequecy_values.map((element, index) => (
      <PickerItem key={index} label={"" + element} value={"" + element} />
    ));
    return (
      <Modal
        isVisible={this.state.modal_visible}
        onBackdropPress={() => this.setState({ modal_visible: false })}
        onBackButtonPress={() => this.setState({ modal_visible: false })}
      >
        <View
          style={{
            height: 400,
            backgroundColor: "white",
            borderRadius: 4,
            borderColor: "rgba(0, 0, 0, 0.1)",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Picker
            style={{
              width: 250,
              height: 250
            }}
            selectedValue={"" + this.state.frequecy_selected}
            onValueChange={(itemValue, itemIndex) => {
              this.setState(
                {
                  frequecy_selected: itemValue
                  // modal_visible: false
                },
                () => {
                  this.props.dispatch(
                    updateState({ mostFrequentRaceFrequency: itemValue })
                  );
                }
              );
            }}
          >
            {values}
          </Picker>
          {this.renderButtonsModal()}
        </View>
      </Modal>
    );
  }

  renderTypesModal() {
    const values = this.state.frequent_type.map((element, index) => (
      <PickerItem key={index} label={"" + element} value={"" + element} />
    ));
    return (
      <Modal
        isVisible={this.state.modal_types_visible}
        onBackdropPress={() => this.setState({ modal_types_visible: false })}
        onBackButtonPress={() => this.setState({ modal_types_visible: false })}
      >
        <View
          style={{
            height: 400,
            backgroundColor: "white",
            borderRadius: 4,
            borderColor: "rgba(0, 0, 0, 0.1)",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Picker
            style={{
              width: 250,
              height: 250
            }}
            selectedValue={
              "" + this.state.frequent_type[this.state.frequent_trip_type_end]
            }
            onValueChange={(itemValue, itemIndex) => {
              console.log(itemValue);
              this.setState(
                {
                  // modal_types_visible: false,
                  // frequent_trip_type_end: itemValue
                  frequent_trip_type_end: this.convertionModalType(itemValue)
                },
                () => {
                  // this.props.dispatch(
                  //   updateState({
                  //     frequent_trip_type_start: 1,
                  //     frequent_trip_type_end: itemIndex
                  //   })
                  // );
                }
              );
            }}
          >
            {values}
          </Picker>
          {this.renderButtonsModalTypes()}
        </View>
      </Modal>
    );
  }

  renderTimeBox() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.4,
          height: 30,
          alignSelf: "center",
          justifyContent: "center",
          // backgroundColor: "#fff",
          flexDirection: "row"
        }}
      >
        <View
          style={{
            flex: 0.3,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 2
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              this._showStartDateTimePicker();
            }}
          >
            <View>
              <Text style={styles.textTime}>
                {this.state.frequent_trip_start_time}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            flex: 0.3,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <OwnIcon name={"onboarding-time_icn"} size={20} color={"#fff"} />
        </View>
        <View
          style={{
            flex: 0.3,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 2
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              this._showEndDateTimePicker();
            }}
          >
            <View style={{ minWidth: 15, minHeight: 15 }}>
              <Text style={styles.textTime}>
                {this.state.frequent_trip_end_time}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  renderBody() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.9,
          alignSelf: "center",
          justifyContent: "center"
        }}
      >
        <Image
          source={require("../../assets/images/trip_a_b.png")}
          style={{
            height: 50,
            width: 200,
            alignSelf: "center"
          }}
          resizeMode={"contain"}
        />

        <View
          style={{
            height: Dimensions.get("window").height * 0.35
          }}
        >
          {this.renderBoxA()}
          {this.renderBoxB()}
        </View>

        <View
          style={{
            width: Dimensions.get("window").width * 0.9,
            height:
              Platform.OS == "ios"
                ? Dimensions.get("window").height * 0.125
                : Dimensions.get("window").height * 0.1,
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {/* {this.renderFrequencyBox()} */}
          {this.renderTimeBox()}
          {this.renderWeekdays()}
        </View>
      </View>
    );
  }

  render() {
    let shadowOpt;
    if (Platform.OS == "ios") {
      shadowOpt = {
        width: Dimensions.get("window").width * 0.2,
        height: 40,
        color: "#111",
        border: 4,
        radius: 5,
        opacity: 0.25,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: 10
        }
      };
      if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
        shadowOpt = {
          width: Dimensions.get("window").width * 0.2,
          height: 28,
          color: "#111",
          border: 4,
          radius: 5,
          opacity: 0.25,
          x: 0,
          y: 1,
          style: {
            position: "absolute",
            top: 10
          }
        };
      }
    } else
      shadowOpt = {
        width: Dimensions.get("window").width * 0.2,
        height: 40,
        color: "#444",
        border: 6,
        radius: 5,
        opacity: 0.35,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: 10
        }
      };
    return (
      <ImageBackground
        source={require("./../../assets/images/purple_bg.png")}
        style={styles.backgroundImage}
      >
        <DateTimePicker
          isVisible={this.state.start_datetime_picker_visible}
          onConfirm={this._handleStartDatePicked}
          onCancel={this._hideStartDateTimePicker}
          datePickerModeAndroid={"default"}
          mode={"time"}
          is24Hour={true}
        />
        <DateTimePicker
          isVisible={this.state.end_datetime_picker_visible}
          onConfirm={this._handleEndDatePicked}
          onCancel={this._hideEndDateTimePicker}
          datePickerModeAndroid={"default"}
          mode={"time"}
          is24Hour={true}
        />
        <View
          style={{
            height: 100,
            backgroundColor: "transparent"
          }}
        >
          <ImageBackground
            source={require("../../assets/images/white_wave_onbording_top.png")}
            style={styles.backgroundImageWave}
          />
          <View
            style={{
              height: 100,
              backgroundColor: "transparent",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <View style={styles.textHeaderContainer}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.navigation.goBack(null);
                }}
              >
                <View style={{ width: 30, height: 30 }}>
                  <Icon
                    name="ios-arrow-back"
                    style={{ marginTop: Platform.OS == "ios" ? 4 : 2 }}
                    size={18}
                    color="#3d3d3d"
                  />
                </View>
              </TouchableWithoutFeedback>
              <Text style={styles.textHeader}>
                {strings("insert_your_mos")}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: Dimensions.get("window").height - 230,
            alignSelf: "center",
            justifyContent: "center",
            backgroundColor: "transparent"
          }}
        >
          {this.renderBody()}
        </View>
        <View
          style={{
            height: Dimensions.get("window").height * 0.2,
            backgroundColor: "transparent"
          }}
        >
          <View
            style={{
              height: 130,
              backgroundColor: "transparent",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View style={styles.textFooterContainer}>
                <Text style={styles.textFooter}>
                  {strings("please_enter_th")}
                </Text>
                {/* {strings("you_can_always_} */}
              </View>

              <View style={[styles.buttonContainer]}>
                {/* <BoxShadow setting={shadowOpt} /> */}
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (
                      this.props.registerState.frequent_trip_start != null &&
                      this.props.registerState.frequent_trip_end != null &&
                      this.checkChoosedWeekdays() &&
                      // this.props.registerState.mostFrequentRaceFrequency != undefined &&
                      this.validateFrequentTripPoints()
                    ) {
                      // incremento di 1 se this.state.frequent_trip_type_end == 1
                      // incremento di 2 se this.state.frequent_trip_type_end == 2
                      // per sincronizzarmi con l'enum del DATABASE
                      let frequent_trip_end =
                        this.state.frequent_trip_type_end == 1
                          ? this.state.frequent_trip_type_end + 1
                          : this.state.frequent_trip_type_end == 2
                          ? this.state.frequent_trip_type_end + 2
                          : this.state.frequent_trip_type_end;

                      this.props.dispatch(
                        updateState({
                          frequent_trip_type_start: this.state
                            .frequent_trip_type_start,
                          frequent_trip_type_end: frequent_trip_end,
                          frequent_trip_start_time: this.state
                            .frequent_trip_start_time,
                          frequent_trip_end_time: this.state
                            .frequent_trip_end_time,
                          frequent_trip_choosed_weekdays: this.state
                            .choosed_week_days
                        })
                      );
                      this.props.navigation.navigate(
                        "SurveyFrequentTripModalSplit"
                      );
                    } else {
                      Alert.alert("Oops", strings("seems_like_you_"));
                    }
                  }}
                  disabled={this.props.status === "In register" ? true : false}
                >
                  <View style={[styles.buttonBox]}>
                    {this.props.status !== "In register" ? (
                      <Text style={styles.buttonGoOnText}>
                        {this.props.text ? this.props.text : strings("go_on")}
                      </Text>
                    ) : (
                      <ActivityIndicator size="small" color="#6497CC" />
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  topOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    top: Platform.OS == "ios" ? 0 : -30
  },
  backgroundImageWave: {
    height: 100,
    width: Dimensions.get("window").width,
    position: "absolute"
    // top: Dimensions.get("window").height * 0.04 + 14
  },
  bottomOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    top: Dimensions.get("window").height * 0.8
  },
  textHeaderContainer: {
    marginLeft: 20,
    flexDirection: "row",
    width: Dimensions.get("window").width * 0.85
  },
  textHeader: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3d3d3d",
    fontSize: 15,
    fontWeight: "bold"
  },
  textFooterContainer: {
    width: Dimensions.get("window").width * 0.6,
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center"
  },
  textFooter: {
    fontFamily: "OpenSans-Regular",
    color: "#fff",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "left"
  },
  buttonContainer: {
    width: Dimensions.get("window").width * 0.3,
    height: 60,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  buttonBox: {
    width: Dimensions.get("window").width * 0.2,
    height: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1
  },
  buttonGoOnText: {
    color: "#3363AD",
    fontFamily: "OpenSans-Regular",
    fontSize: 14
  },
  tripPointContainer: {
    backgroundColor: "#fff",
    height: Dimensions.get("window").height * 0.09,
    width: Dimensions.get("window").width * 0.7 - 5,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  tripSecondPointContainer: {
    backgroundColor: "#fff",
    height: Dimensions.get("window").height * 0.09,
    width: Dimensions.get("window").width * 0.7 - 25,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  tripPointersContainer: {
    height: Dimensions.get("window").height * 0.15,
    // flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 4
  },
  textTrip: {
    fontFamily: "OpenSans-Regular",
    color: "#3d3d3d",
    fontSize: 12,
    fontWeight: "400",
    marginLeft: 6,
    textAlign: "left"
  },
  tripLeftText: {
    color: "#3D3D3D",
    fontFamily: "OpenSans-ExtraBold",
    fontSize: 11,
    textAlign: "left"
  },
  textFrequency: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#fff",
    fontSize: 12,
    fontWeight: "400"
  },
  textFrequencyValue: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3d3d3d",
    fontSize: 12,
    fontWeight: "400"
  },
  buttonsContainer: {
    // height: 50,
    width: 280,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: Platform.OS == "ios" ? 10 : 10
  },
  buttonModalContainer: {
    width: Dimensions.get("window").width * 0.2,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  textButton: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 12,
    color: "#51AEC9"
  },
  weekDayContainer: {
    // marginTop: 120,
    height: 40,
    width: 280,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  textTime: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 12,
    color: "#3D3D3D"
  }
});

export const positiveData = [
  {
    value: 60
  },
  {
    value: 40
  },
  {
    value: 50
  },
  {
    value: 40
  },
  {
    value: 50
  }
];

export const negativeData = [
  {
    value: -60
  },
  {
    value: -40
  },
  {
    value: -50
  },
  {
    value: -40
  },
  {
    value: -50
  }
];

const withData = connect(state => {
  return {
    registerState: state.register
  };
});

export default withData(FrequentTripScreen);
