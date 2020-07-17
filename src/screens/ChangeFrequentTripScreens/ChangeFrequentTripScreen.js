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
import DateTimePicker from "react-native-modal-datetime-picker";
import OnboardingWeekDay from "./../../components/WeekDayNotificationPicker/OnboardingWeekDay";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";

let Picker = Platform.OS === "ios" ? PickerIos : PickerAndroid;
let PickerItem = Picker.Item;

import { strings } from "../../config/i18n";

class ChangeFrequentTripScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frequecy_values: [1, 2, 3, 4, 5, 6, 7],
      frequency_selected: 5,
      modal_visible: false,
      frequent_type: [
        strings("other").toLocaleUpperCase(),
        strings("home").toLocaleUpperCase(),
        strings("work").toLocaleUpperCase(),
        strings("gym").toLocaleUpperCase(),
        strings("school_universi").toLocaleUpperCase(),
        strings("work__2").toLocaleUpperCase(),
        strings("mom_dad").toLocaleUpperCase(),
        strings("grandma_grandpa").toLocaleUpperCase(),
        strings("girlfriend_boyf").toLocaleUpperCase(),
        strings("kids__school").toLocaleUpperCase(),
        strings("friend_s_place").toLocaleUpperCase(),
        strings("supermarket").toLocaleUpperCase(),
        strings("bar_restaurant").toLocaleUpperCase(),
        strings("cinema_theater").toLocaleUpperCase()
      ],
      start_point: null,
      end_point: null,
      frequent_trip_type_start: 1,
      frequent_trip_type_end: 2,
      modal_end_types_visible: false,
      modal_start_types_visible: false,
      start_datetime_picker_visible: false,
      end_datetime_picker_visible: false,
      choosed_week_days: {
        0: false,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: false
      },
      frequent_trip_start_time: "9:00",
      frequent_trip_end_time: "",
      end_time_tapped: false
    };
  }

  // static navigationOptions = {
  //   header: null
  // };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("insert_your_mos")}
        </Text>
      )
    };
  };

  componentDidMount() {
    console.log(this.props.navigation.state.params);
  }

  componentWillReceiveProps(props) {
    // if (this.props != props) {
    //   console.log(this.props.navigation.state.params.start_point);
    //   console.log(this.props.navigation.state.params.end_point);
    // }

    console.log(this.props.navigation.state.params);

    setTimeout(() => {
      if (this.props.navigation.state.params) {
        if (this.props.navigation.state.params.start_point)
          this.setState({
            start_point: this.props.navigation.state.params.start_point
          });
        if (this.props.navigation.state.params.end_point)
          this.setState({
            end_point: this.props.navigation.state.params.end_point
          });
      }

      // if (this.props.navigation.state.params.frequent_trip_type_start)
      //   this.setState({
      //     frequent_trip_type_start: this.props.navigation.state.params
      //       .frequent_trip_type_start
      //   });
      // if (this.props.navigation.state.params.frequent_trip_type_end)
      //   this.setState({
      //     frequent_trip_type_end: this.props.navigation.state.params
      //       .frequent_trip_type_end
      //   });
    }, 800);
  }

  checkChoosedWeekdays() {
    let flag = false;
    for (let index = 0; index < 7; index++) {
      if (this.state.choosed_week_days[index]) flag = true;
    }
    return flag;
  }

  validateFrequentTripPoints() {
    let result = false;

    if (this.state.start_point)
      if (this.state.start_point.latitude != 0) result = true;
    if (this.state.start_point)
      if (this.state.start_point.longitude != 0) result = true;

    if (this.state.end_point)
      if (this.state.end_point.latitude != 0) result = true;

    if (this.state.end_point)
      if (this.state.end_point.longitude != 0) result = true;

    // if (!result) alert("frequent trip non valida");

    return result;
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
    this.setState({ frequent_trip_start_time: h + ":" + m });
  };

  _showEndDateTimePicker = () => {
    this.setState({ end_datetime_picker_visible: true });
  };

  _hideEndDateTimePicker = () =>
    this.setState({ end_datetime_picker_visible: false });

  _handleEndDatePicked = date => {
    this._hideEndDateTimePicker();
    let h = date.getHours();
    let m = date.getMinutes();

    console.log(h);
    console.log(m);
    this.setState({
      frequent_trip_end_time: h + ":" + m,
      end_time_tapped: true
    });
  };

  setDayWeek = index => {
    let days = this.state.choosed_week_days;
    days[index] = !days[index];

    this.setState({
      choosed_week_days: days
    });
  };

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
      case this.state.frequent_type[3]:
        return 3;
        break;
      case this.state.frequent_type[4]:
        return 4;
        break;
      case this.state.frequent_type[5]:
        return 5;
        break;

      case this.state.frequent_type[6]:
        return 6;
        break;
      case this.state.frequent_type[7]:
        return 7;
        break;
      case this.state.frequent_type[8]:
        return 8;
        break;
      case this.state.frequent_type[9]:
        return 9;
        break;
      case this.state.frequent_type[10]:
        return 10;
        break;
      case this.state.frequent_type[11]:
        return 11;
        break;
      case this.state.frequent_type[12]:
        return 12;
        break;
      case this.state.frequent_type[13]:
        return 13;
        break;

      default:
        return 0;
    }
  }

  // renderBoxA() {
  //   let shadowOpt;
  //   if (Platform.OS == "ios") {
  //     shadowOpt = {
  //       width: Dimensions.get("window").width * 0.9,
  //       height: Dimensions.get("window").height * 0.09,
  //       color: "#111",
  //       border: 4,
  //       radius: 5,
  //       opacity: 0.25,
  //       x: 0,
  //       y: 1,
  //       style: {
  //         position: "absolute"
  //         // top: Dimensions.get("window").height * 0.04,
  //         // left: Dimensions.get("window").width * 0.28
  //       }
  //     };
  //   } else
  //     shadowOpt = {
  //       width: Dimensions.get("window").width * 0.9,
  //       height: Dimensions.get("window").height * 0.09,
  //       color: "#444",
  //       border: 6,
  //       radius: 5,
  //       opacity: 0.35,
  //       x: 0,
  //       y: 1,
  //       style: {
  //         position: "absolute"
  //         // top: Dimensions.get("window").height * 0.04,
  //         // left: Dimensions.get("window").width * 0.28
  //       }
  //     };
  //   return (
  //     <View style={styles.tripPointersContainer}>
  //       <BoxShadow setting={shadowOpt} />
  //       <TouchableWithoutFeedback
  //         onPress={() => {
  //           this.props.navigation.navigate("ChangeFrequentTripMapScreen", {
  //             start_point: true,
  //             end_point: false,
  //             frequent_trip_start: this.props.navigation.state.params
  //               .start_point
  //           });
  //         }}
  //       >
  //         <View style={styles.tripPointContainer}>
  //           <Text style={styles.textTrip}>
  //             {this.state.start_point != null
  //               ? this.state.start_point.street
  //               : strings("insert_the_addr")}
  //           </Text>
  //         </View>
  //       </TouchableWithoutFeedback>
  //       <View
  //         style={{
  //           height: 25,
  //           width: Dimensions.get("window").width * 0.9,
  //           justifyContent: "center",
  //           alignItems: "flex-start"
  //         }}
  //       >
  //         <Text style={styles.tripLeftText}>
  //           {
  //             this.state.frequent_type[
  //               this.props.navigation.state.params.frequent_trip_type_start
  //             ]
  //           }
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // }

  renderBoxA() {
    let shadowOpt;
    if (Platform.OS == "ios") {
      shadowOpt = {
        width: Dimensions.get("window").width * 0.9,
        height: Dimensions.get("window").height * 0.09,
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
        height: Dimensions.get("window").height * 0.09,
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
        {this.renderStartTypesModal()}
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
                this.setState({ modal_start_types_visible: true });
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
                  <Text style={[styles.tripLeftText, { color: "#3d3d3d" }]}>
                    {/* {strings("home").toLocaleUpperCase()} */}
                    {this.state.frequent_type[
                      this.state.frequent_trip_type_start
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
              this.props.navigation.navigate("ChangeFrequentTripMapScreen", {
                start_point: true,
                end_point: false,
                frequent_trip_start: this.state.start_point
              });
            }}
          >
            <View style={styles.tripSecondPointContainer}>
              <Text style={styles.textTrip}>
                {this.state.start_point != null
                  ? this.state.start_point.street
                  : strings("insert_the_addr")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  renderButtonsModalEndTypes() {
    return (
      <View style={styles.buttonsContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ modal_end_types_visible: false });
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
            this.setState({ modal_end_types_visible: false }, () => {});
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

  renderEndTypesModal() {
    const values = this.state.frequent_type.map((element, index) => (
      <PickerItem key={index} label={"" + element} value={"" + element} />
    ));
    return (
      <Modal
        isVisible={this.state.modal_end_types_visible}
        onBackdropPress={() =>
          this.setState({ modal_end_types_visible: false })
        }
        onBackButtonPress={() =>
          this.setState({ modal_end_types_visible: false })
        }
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
                  // modal_end_types_visible: false,
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
          {this.renderButtonsModalEndTypes()}
        </View>
      </Modal>
    );
  }

  renderButtonsModalStartTypes() {
    return (
      <View style={styles.buttonsContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ modal_start_types_visible: false });
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
            this.setState({ modal_start_types_visible: false }, () => {});
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

  renderStartTypesModal() {
    const values = this.state.frequent_type.map((element, index) => (
      <PickerItem key={index} label={"" + element} value={"" + element} />
    ));
    return (
      <Modal
        isVisible={this.state.modal_start_types_visible}
        onBackdropPress={() =>
          this.setState({ modal_start_types_visible: false })
        }
        onBackButtonPress={() =>
          this.setState({ modal_start_types_visible: false })
        }
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
              "" + this.state.frequent_type[this.state.frequent_trip_type_start]
            }
            onValueChange={(itemValue, itemIndex) => {
              console.log(itemValue);
              this.setState(
                {
                  // modal_end_types_visible: false,
                  // frequent_trip_type_end: itemValue
                  frequent_trip_type_start: this.convertionModalType(itemValue)
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
          {this.renderButtonsModalStartTypes()}
        </View>
      </Modal>
    );
  }

  // renderBoxB() {
  //   let shadowOpt;
  //   if (Platform.OS == "ios") {
  //     shadowOpt = {
  //       width: Dimensions.get("window").width * 0.9,
  //       height: Dimensions.get("window").height * 0.09,
  //       color: "#111",
  //       border: 4,
  //       radius: 5,
  //       opacity: 0.25,
  //       x: 0,
  //       y: 1,
  //       style: {
  //         position: "absolute"
  //         // top: Dimensions.get("window").height * 0.04,
  //         // left: Dimensions.get("window").width * 0.28
  //       }
  //     };
  //   } else
  //     shadowOpt = {
  //       width: Dimensions.get("window").width * 0.9,
  //       height: Dimensions.get("window").height * 0.09,
  //       color: "#444",
  //       border: 6,
  //       radius: 5,
  //       opacity: 0.35,
  //       x: 0,
  //       y: 1,
  //       style: {
  //         position: "absolute"
  //         // top: Dimensions.get("window").height * 0.04,
  //         // left: Dimensions.get("window").width * 0.28
  //       }
  //     };
  //   return (
  //     <View style={styles.tripPointersContainer}>
  //       <BoxShadow setting={shadowOpt} />
  //       <TouchableWithoutFeedback
  //         onPress={() => {
  //           this.props.navigation.navigate("ChangeFrequentTripMapScreen", {
  //             start_point: false,
  //             end_point: true,
  //             frequent_trip_end: this.props.navigation.state.params.end_point
  //           });
  //         }}
  //       >
  //         <View style={styles.tripPointContainer}>
  //           <Text style={styles.textTrip}>
  //             {this.state.end_point != null
  //               ? this.state.end_point.street
  //               : strings("insert_the_addr")}
  //           </Text>
  //         </View>
  //       </TouchableWithoutFeedback>
  //       <View
  //         style={{
  //           height: 25,
  //           width: Dimensions.get("window").width * 0.9,
  //           justifyContent: "center",
  //           alignItems: "flex-start"
  //         }}
  //       >
  //         <Text style={styles.tripLeftText}>
  //           {
  //             this.state.frequent_type[
  //               this.props.navigation.state.params.frequent_trip_type_end
  //             ]
  //           }
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // }

  renderBoxB() {
    let shadowOpt;
    if (Platform.OS == "ios") {
      shadowOpt = {
        width: Dimensions.get("window").width * 0.9,
        height: Dimensions.get("window").height * 0.09,
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
        height: Dimensions.get("window").height * 0.09,
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
        {this.renderEndTypesModal()}
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
                this.setState({ modal_end_types_visible: true });
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
              this.props.navigation.navigate("ChangeFrequentTripMapScreen", {
                start_point: false,
                end_point: true,
                frequent_trip_end: this.state.end_point
              });
            }}
          >
            <View style={styles.tripSecondPointContainer}>
              <Text style={styles.textTrip}>
                {this.state.end_point != null
                  ? this.state.end_point.street
                  : strings("insert_the_addr")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  renderWeekdays() {
    return (
      <View style={styles.weekDayContainer}>
        <OnboardingWeekDay
          index={1}
          dayName={strings("mon").toLocaleUpperCase()}
          selected={this.state.choosed_week_days[1]}
          onPress={this.setDayWeek}
          detailScreen={true}
        />
        <OnboardingWeekDay
          index={2}
          dayName={strings("tue").toLocaleUpperCase()}
          selected={this.state.choosed_week_days[2]}
          onPress={this.setDayWeek}
          detailScreen={true}
        />
        <OnboardingWeekDay
          index={3}
          dayName={strings("wed").toLocaleUpperCase()}
          selected={this.state.choosed_week_days[3]}
          onPress={this.setDayWeek}
          detailScreen={true}
        />
        <OnboardingWeekDay
          index={4}
          dayName={strings("thu").toLocaleUpperCase()}
          selected={this.state.choosed_week_days[4]}
          onPress={this.setDayWeek}
          detailScreen={true}
        />
        <OnboardingWeekDay
          index={5}
          dayName={strings("fri").toLocaleUpperCase()}
          selected={this.state.choosed_week_days[5]}
          onPress={this.setDayWeek}
          detailScreen={true}
        />
        <OnboardingWeekDay
          index={6}
          dayName={strings("sat").toLocaleUpperCase()}
          selected={this.state.choosed_week_days[6]}
          onPress={this.setDayWeek}
          detailScreen={true}
        />
        <OnboardingWeekDay
          index={0}
          dayName={strings("sun").toLocaleUpperCase()}
          selected={this.state.choosed_week_days[0]}
          onPress={this.setDayWeek}
          detailScreen={true}
        />
      </View>
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
            backgroundColor: this.state.end_time_tapped ? "#fff" : "#B2B2B2",
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
                {this.state.frequency_selected}
                &nbsp;
              </Text>
              <Icon
                name="ios-arrow-down"
                size={18}
                color="#3d3d3d"
                // style={{ alignSelf: "center", marginRight: 17 }}
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
            height: 250,
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
            selectedValue={"" + this.state.frequency_selected}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({
                frequency_selected: itemValue,
                modal_visible: false
              });
            }}
          >
            {values}
          </Picker>
          {/* {this.renderButtonsModal()} */}
        </View>
      </Modal>
    );
  }

  renderBody() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.9,
          alignSelf: "center"
        }}
      >
        <View
          style={{
            height: Dimensions.get("window").height * 0.125
          }}
        >
          <Image
            // source={require("../../assets/images/trip_a_b.png")}
            source={require("../../assets/images/trip_a_b_recap.png")}
            style={{
              height: Dimensions.get("window").height * 0.125,
              width: "auto"
            }}
          />
        </View>

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
    // console.log(this.props.navigation.state.params.start_point);
    // console.log(this.props.navigation.state.params.end_point);

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
          top: 0
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
            top: 0
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
          top: 0
        }
      };
    return (
      <ImageBackground
        // source={require("./../../assets/images/purple_bg.png")}
        source={require("./../../assets/images/bg-login.png")}
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
        {/* <View
          style={{
            height:
              Platform.OS == "ios"
                ? Dimensions.get("window").height * 0.2
                : Dimensions.get("window").height * 0.16,
            backgroundColor: "transparent"
          }}
        >
          {/* <WavyArea
            data={negativeData}
            color={"#fff"}
            style={styles.topOverlayWave}
          /> 
          <View style={styles.textHeaderContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.navigation.goBack(null);
              }}
            >
              <View style={{ width: 30, height: 30 }}>
                <Icon
                  name="ios-arrow-back"
                  style={{ marginTop: 4 }}
                  size={18}
                  color="#3d3d3d"
                />
              </View>
            </TouchableWithoutFeedback>
            <Text style={styles.textHeader}>{strings("insert_your_mos")}</Text>
          </View>
        </View> */}
        <View
          style={{
            height:
              Platform.OS == "ios"
                ? Dimensions.get("window").height * 0.6
                : Dimensions.get("window").height * 0.565,
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
          {/* <WavyArea
            data={positiveData}
            color={"#fff"}
            style={styles.topOverlayWave}
          /> */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              top: 50
            }}
          >
            {/* <View style={styles.textFooterContainer}>
              <Text style={styles.textFooter}>
                {strings("please_enter_th")}
              </Text>
            </View> */}

            <View style={[styles.buttonContainer]}>
              {/* <BoxShadow setting={shadowOpt} /> */}
              <TouchableWithoutFeedback
                onPress={() => {
                  console.log(this.state);
                  let k = 0;
                  for (let index = 0; index < 7; index++) {
                    if (this.state.choosed_week_days[index]) {
                      k++;
                    }
                  }

                  if (
                    this.state.start_point != null &&
                    this.state.end_point != null &&
                    this.state.frequency_selected != 0 &&
                    this.validateFrequentTripPoints() &&
                    this.checkChoosedWeekdays()
                  ) {
                    this.props.dispatch(
                      updateState({
                        mostFrequentRaceFrequency: k,
                        mostFrequentRaceFrequencyPosition: {
                          start_point: this.state.start_point,
                          end_point: this.state.end_point,
                          start_type: this.state.frequent_trip_type_start,
                          end_type: this.state.frequent_trip_type_end
                        },
                        frequent_trip_start_time: this.state
                          .frequent_trip_start_time,
                        frequent_trip_end_time: this.state
                          .frequent_trip_end_time,
                        frequent_trip_choosed_weekdays: this.state
                          .choosed_week_days
                      })
                    );
                    setTimeout(() => {
                      this.props.navigation.navigate(
                        "ChangeFrequentTripModalSplitScreen"
                      );
                    }, 500);
                  } else {
                    Alert.alert("Oops", strings("seems_like_you_"));
                  }
                }}
                disabled={this.props.status === "In register" ? true : false}
              >
                <View style={[styles.buttonBox]}>
                  {this.props.status !== "In register" ? (
                    <Text style={styles.buttonGoOnText}>
                      {this.props.text ? this.props.text : strings("save")}
                    </Text>
                  ) : (
                    <ActivityIndicator size="small" color="#6497CC" />
                  )}
                </View>
              </TouchableWithoutFeedback>
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
  bottomOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    top: Dimensions.get("window").height * 0.8
  },
  textHeaderContainer: {
    marginTop: Platform.OS == "ios" ? 30 : 15,
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
    padding: 5,
    width: Dimensions.get("window").width * 0.7,
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    marginBottom: Platform.OS == "ios" ? 20 : 30
  },
  textFooter: {
    fontFamily: "OpenSans-Regular",
    color: "#fff",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "left"
  },
  buttonContainer: {
    width: Dimensions.get("window").width * 0.2,
    height: 60,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
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
    width: Dimensions.get("window").width * 0.7,
    backgroundColor: "#fff",
    height: Dimensions.get("window").height * 0.09,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center"
  },
  tripPointersContainer: {
    height: Dimensions.get("window").height * 0.175,
    // flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  tripSecondPointContainer: {
    backgroundColor: "#fff",
    height: Dimensions.get("window").height * 0.09,
    width: Dimensions.get("window").width * 0.7 - 25,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  textTrip: {
    fontFamily: "OpenSans-Regular",
    color: "#3d3d3d",
    fontSize: 12,
    fontWeight: "400",
    marginLeft: 6
  },
  tripLeftText: {
    color: "#3d3d3d",
    fontFamily: "Montserrat-ExtraBold",
    fontSize: 12
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
    marginBottom: Platform.OS == "ios" ? 0 : 10
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

export default withData(ChangeFrequentTripScreen);