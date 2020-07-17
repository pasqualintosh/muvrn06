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
  Alert,
  Image,
  Picker as PickerIos
} from "react-native";
import WavyArea from "./../../components/WavyArea/WavyArea";
import LinearGradient from "react-native-linear-gradient";
import Modal from "react-native-modal";
import PickerAndroid from "./../../components/PickerAndroid/PickerAndroid";
import Icon from "react-native-vector-icons/Ionicons";
import Emoji from "@ardentlabs/react-native-emoji";
import { BoxShadow } from "react-native-shadow";
import { connect } from "react-redux";
import { updateState } from "./../../domains/register/ActionCreators";
import DateTimePicker from "react-native-modal-datetime-picker";
import OnboardingWeekDay from "./../../components/WeekDayNotificationPicker/OnboardingWeekDay";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";

let Picker = Platform.OS === "ios" ? PickerIos : PickerAndroid;
let PickerItem = Picker.Item;

import { strings } from "../../config/i18n";

class ChangeFrequentTripTypeFromRecapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      type_possibilities: [
        {
          label: strings("home") + " - " + strings("school_universi"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 4
          }
        },
        {
          label: strings("home") + " - " + strings("work"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 3
          }
        },
        {
          label: strings("home") + " - " + strings("mom_dad"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 6
          }
        },
        {
          label: strings("home") + " - " + strings("grandma_grandpa"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 7
          }
        },
        {
          label: strings("home") + " - " + strings("girlfriend_boyf"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 8
          }
        },
        {
          label: strings("home") + " - " + strings("kids__school"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 9
          }
        },
        {
          label: strings("home") + " - " + strings("supermarket"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 11
          }
        },
        {
          label: strings("home") + " - " + strings("gym"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 3
          }
        },
        {
          label: strings("work") + " - " + strings("gym"),
          to_save: {
            frequent_trip_type_start: 2,
            frequent_trip_type_end: 3
          }
        },

        {
          label: strings("home") + " - " + strings("work__2"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 5
          }
        },

        {
          label: strings("home") + " - " + strings("friend_s_place"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 10
          }
        },

        {
          label: strings("home") + " - " + strings("bar_restaurant"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 12
          }
        },
        {
          label: strings("home") + " - " + strings("cinema_theater"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 13
          }
        },
        {
          label: strings("home") + " - " + strings("other"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 0
          }
        }
      ],
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
      frequecy_values: [1, 2, 3, 4, 5, 6, 7],
      frequency_selected: 5,
      type_selected: 0,
      modal_visible: false,
      selected_index: 0,
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
      frequent_trip_end_time: "17:00"
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
          Frequent Trip
        </Text>
      )
    };
  };

  componentDidMount() {
    let start_date = new Date(this.props.navigation.state.params.date);
    let end_date = new Date(this.props.navigation.state.params.date);
    end_date.setSeconds(0 + this.props.navigation.state.params.time_travelled);

    this.setState({
      frequent_trip_start_time:
        start_date.getHours().toString() +
        ":" +
        start_date.getMinutes().toString(),
      frequent_trip_end_time:
        end_date.getHours().toString() + ":" + end_date.getMinutes().toString()
    });
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

  _showEndDateTimePicker = () =>
    this.setState({ end_datetime_picker_visible: true });

  _hideEndDateTimePicker = () =>
    this.setState({ end_datetime_picker_visible: false });

  _handleEndDatePicked = date => {
    this._hideEndDateTimePicker();
    let h = date.getHours();
    let m = date.getMinutes();

    console.log(h);
    console.log(m);
    this.setState({ frequent_trip_end_time: h + ":" + m });
  };

  setDayWeek = index => {
    let days = this.state.choosed_week_days;
    days[index] = !days[index];

    this.setState({
      choosed_week_days: days
    });
  };

  renderBody() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.9,
          alignSelf: "center"
        }}
      >
        {this.renderEndTypesModal()}
        {this.renderStartTypesModal()}
        <View
          style={{
            height: Dimensions.get("window").height * 0.125
          }}
        >
          <Image
            source={require("../../assets/images/trip_a_b_recap.png")}
            style={{
              height: Dimensions.get("window").height * 0.125,
              width: "auto"
            }}
          />
        </View>

        <View
          style={{
            height: Dimensions.get("window").height * 0.475,
            justifyContent: "space-around",
            alignItems: "center"
          }}
        >
          <View
            style={{
              height: Dimensions.get("window").height * 0.1,
              width: Dimensions.get("window").width * 0.6
            }}
          >
            <View>
              <Text style={styles.textFrequency}>
                {strings("to_include_this")}
              </Text>
            </View>
          </View>
          <View
            style={{
              height: Dimensions.get("window").height * 0.05,
              width: Dimensions.get("window").width * 0.6
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState(
                  {
                    modal_start_types_visible: true
                    // selected: true
                    // selected_index: 3,
                    // frequent_trip_type_start: 1,
                    // frequent_trip_type_end: 6
                  },
                  () => {}
                );
              }}
            >
              <View
                style={[
                  styles.buttonTypeBox,
                  {
                    backgroundColor:
                      this.state.selected_index == 3 ? "#3d3d3d20" : "#fff",
                    padding: 10
                  }
                ]}
              >
                <Text style={styles.buttonTypeText}>
                  {/* 
                  {this.state.type_possibilities[
                    this.state.type_selected
                  ].label.toUpperCase()}
                  &nbsp;&nbsp;&nbsp;&nbsp; 
                  */}
                  {
                    this.state.frequent_type[
                      this.state.frequent_trip_type_start
                    ]
                  }
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
                <Icon name="md-arrow-forward" size={18} color="#3d3d3d" />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View
            style={{
              height: Dimensions.get("window").height * 0.05,
              width: Dimensions.get("window").width * 0.6
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState(
                  {
                    modal_end_types_visible: true
                    // selected_index: 3,
                    // selected: true,
                    // frequent_trip_type_start: 1,
                    // frequent_trip_type_end: 6
                  },
                  () => {}
                );
              }}
            >
              <View
                style={[
                  styles.buttonTypeBox,
                  {
                    backgroundColor:
                      this.state.selected_index == 3 ? "#3d3d3d20" : "#fff",
                    padding: 10
                  }
                ]}
              >
                <Text style={styles.buttonTypeText}>
                  {/* 
                  {this.state.type_possibilities[
                    this.state.type_selected
                  ].label.toUpperCase()}
                  &nbsp;&nbsp;&nbsp;&nbsp; 
                  */}
                  {this.state.frequent_type[this.state.frequent_trip_type_end]}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
                <Icon name="md-arrow-forward" size={18} color="#3d3d3d" />
              </View>
            </TouchableWithoutFeedback>
          </View>
          {/* {this.renderFrequencyBox()} */}
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
            {/* {this.renderTimeBox()} */}
            {this.renderWeekdays()}
          </View>
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
          <OwnIcon name={"onboarding-time_icn"} size={20} color={"#5FC4E2"} />
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
            <View>
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
          // height:
          //   Platform.OS == "ios"
          //     ? Dimensions.get("window").height * 0.125
          //     : Dimensions.get("window").height * 0.1,
          // width: Dimensions.get("window").width * 0.85,
          height: Dimensions.get("window").height * 0.1,
          width: Dimensions.get("window").width * 0.6,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        {this.renderModalFrequency()}

        <View style={{ flex: 0.6 }}>
          <Text style={styles.textFrequency}>{strings("how_many_days_a")}</Text>
        </View>

        <View style={{ flex: 0.2 }}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({ modal_frequency_visible: true });
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

  renderModalFrequency() {
    const values = this.state.frequecy_values.map((element, index) => (
      <PickerItem key={index} label={"" + element} value={"" + element} />
    ));
    return (
      <Modal
        isVisible={this.state.modal_frequency_visible}
        onBackdropPress={() =>
          this.setState({ modal_frequency_visible: false })
        }
        onBackButtonPress={() =>
          this.setState({ modal_frequency_visible: false })
        }
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
                modal_frequency_visible: false
              });
            }}
          >
            {values}
          </Picker>
        </View>
      </Modal>
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
    const values = this.state.type_possibilities.map((element, index) => (
      <PickerItem
        key={index}
        label={"" + element.label.replace(/_/g, " ")}
        value={index}
      />
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
            selectedValue={this.state.type_selected}
            onValueChange={(itemValue, itemIndex) => {
              this.setState(
                {
                  selected: true,
                  type_selected: itemValue,
                  ...this.state.type_possibilities[itemValue].to_save,
                  modal_visible: false,
                  frequent_trip_type_start: this.state.type_possibilities[
                    itemValue
                  ].to_save.frequent_trip_type_start,
                  frequent_trip_type_end: this.state.type_possibilities[
                    itemValue
                  ].to_save.frequent_trip_type_end
                },
                () => {}
              );
            }}
            itemStyle={{ fontSize: 12 }}
          >
            {values}
          </Picker>
          {/* {this.renderButtonsModal()} */}
        </View>
      </Modal>
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

  render() {
    // console.log(this.props.navigation.state.params.start_point);
    // console.log(this.props.navigation.state.params.end_point);

    let shadowOpt;
    if (Platform.OS == "ios") {
      shadowOpt = {
        width: Dimensions.get("window").width * 0.4,
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
          width: Dimensions.get("window").width * 0.4,
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
        width: Dimensions.get("window").width * 0.4,
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
        <View
          style={{
            marginTop: 50,
            height: Dimensions.get("window").height * 0.6,
            backgroundColor: "transparent"
          }}
        >
          {/* {this.renderModal()} */}
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
            {/* 
            <View style={styles.textFooterContainer}>
              <Text style={styles.textFooter}>
                This information is crucial to discover your MUV potential.
              </Text>
            </View> 
            */}

            <View style={[styles.buttonContainer]}>
              <BoxShadow setting={shadowOpt} />
              <TouchableWithoutFeedback
                onPress={() => {
                  if (this.state.frequency_selected != 0) {
                    let k = 0;
                    for (let index = 0; index < 7; index++) {
                      if (this.state.choosed_week_days[index]) {
                        k++;
                      }
                    }

                    this.props.dispatch(
                      updateState({
                        mostFrequentRaceFrequency: k,
                        mostFrequentRaceFrequencyPosition: {
                          start_point: this.props.navigation.state.params
                            .start_point,
                          end_point: this.props.navigation.state.params
                            .end_point,
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
                    this.props.navigation.navigate(
                      "ChangeFrequentTripModalSplitFromRecapScreen"
                    );
                  } else Alert.alert("Oops", strings("seems_like_you_"));
                }}
              >
                <View style={[styles.buttonBox]}>
                  <Text style={styles.buttonGoOnText}>{strings("ok")}</Text>
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
    width: Dimensions.get("window").width * 0.4,
    height: 60,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center"
  },
  buttonBox: {
    width: Dimensions.get("window").width * 0.4,
    height: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3
  },
  buttonGoOnText: {
    color: "#3363AD",
    fontFamily: "OpenSans-Regular",
    fontSize: 14
  },
  buttonTypeBox: {
    height: Dimensions.get("window").height * 0.05,
    width: Dimensions.get("window").width * 0.6,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    flexDirection: "row"
  },
  buttonTypeText: {
    color: "#3D3D3D",
    fontFamily: "OpenSans-Regular",
    fontSize: 12
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
  textFrequency: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3d3d3d",
    fontSize: 12,
    fontWeight: "400"
  },
  textFrequencyValue: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3d3d3d",
    fontSize: 12,
    fontWeight: "400"
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

export default withData(ChangeFrequentTripTypeFromRecapScreen);
