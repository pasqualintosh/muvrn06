import React from "react";
import {
  View,
  Text,
  Alert,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Platform,
  NativeModules,
  TouchableWithoutFeedback,
  Picker as PickerIos
} from "react-native";
import WavyArea from "./../../components/WavyArea/WavyArea";
import LinearGradient from "react-native-linear-gradient";
import { BoxShadow } from "react-native-shadow";
import { connect } from "react-redux";
import {
  updateState,
  getMobilityCarValues,
  getMobilityMotoValues,
  setCarSegment
} from "./../../domains/register/ActionCreators";
import PickerAndroid from "./../../components/PickerAndroid/PickerAndroid";
import Modal from "react-native-modal";
import Emoji from "@ardentlabs/react-native-emoji";
import Icon from "react-native-vector-icons/Ionicons";

let Picker = Platform.OS === "ios" ? PickerIos : PickerAndroid;
let PickerItem = Picker.Item;

import { strings } from "../../config/i18n";

class CarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      car_id: null,
      car_owning_answer: 0, // 0 || 1 || 2
      car_year: strings("choose"), // -> number
      car_segment_answer: "", // "medium" || "large" || "mini" || "small"
      car_fuel: "", // 0 ... 5
      car_year_possibilities: ["-"],
      car_segment_possibilities: ["mini", "small", "medium", "large"],
      car_fuel_possibilities: [
        "petrol",
        "diesel",
        "petrol_hybrids",
        "LPG",
        "CNG",
        "electric"
      ],
      modal_visible: false
    };
  }

  static navigationOptions = {
    header: null
  };

  componentWillMount() {
    this.props.dispatch(getMobilityCarValues());
  }

  componentWillReceiveProps(props) {
    if (
      this.props.registerState.get_mobility_car_values !=
      props.registerState.get_mobility_car_values
    ) {
      let car_year_possibilities = [];
      let car_possibilities = [];

      car_possibilities = props.registerState.get_mobility_car_values.filter(
        item => {
          return item.fuel == this.props.registerState.car_fuel;
        }
      );

      car_possibilities.forEach((item, index) => {
        if (item.year != null)
          if (car_year_possibilities.length > 0) {
            if (!car_year_possibilities.includes(item.year))
              car_year_possibilities.push(item.year);
          } else {
            car_year_possibilities.push(item.year);
          }
      });

      this.setState({ car_year_possibilities }, () => {
        if (car_year_possibilities.length == 0) {
          let car_segment_possibilities = [];

          car_possibilities.forEach((item, index) => {
            if (item.segment != null)
              if (car_segment_possibilities.length > 0) {
                if (!car_segment_possibilities.includes(item.segment))
                  car_segment_possibilities.push(item.segment);
              } else {
                car_segment_possibilities.push(item.segment);
              }
          });

          console.log(props.registerState.get_mobility_car_values);
          console.log(car_possibilities);
          console.log(car_year_possibilities);
          console.log(car_segment_possibilities);

          this.setState({ car_segment_possibilities }, () => {
            if (car_possibilities.length > 0) {
              this.props.dispatch(
                updateState({
                  car: car_possibilities ? car_possibilities[0].id : null
                })
              );

              if (
                this.props.registerState[
                  strings("motorbike").toLocaleLowerCase()
                ] != undefined &&
                this.props.registerState[
                  strings("motorbike").toLocaleLowerCase()
                ] == true
              ) {
                this.props.navigation.navigate("SurveyMotoSegment");
              } else {
                this.props.navigation.navigate("SurveyUserData");
              }
            }
          });
        }
      });
    }
  }

  handleCarOwningAnswer = val => {
    if (val != 0) {
      this.setState({
        car_owning_answer: val
      });
    } else {
      this.setState({
        car_owning_answer: val,
        car_year: strings("choose"),
        car_segment_answer: "",
        car_fuel: 0
      });
    }
  };

  /**
   * replace(/\s/g, "_") toglie gli spazi e mette un _
   */
  handleCarYearChange = val => {
    console.log(val);
    this.setState({
      car_year: val.replace(/\s/g, "_")
    });

    const filtered_car_m_v = this.props.registerState.get_mobility_car_values.filter(
      e => {
        return (
          e.year == val.replace(/\s/g, "_") &&
          e.fuel == this.props.registerState.car_fuel
        );
      }
    );

    let car_segment_possibilities = [];

    filtered_car_m_v.forEach((item, index) => {
      if (item.segment != null)
        if (car_segment_possibilities.length > 0) {
          if (!car_segment_possibilities.includes(item.segment))
            car_segment_possibilities.push(item.segment);
        } else {
          car_segment_possibilities.push(item.segment);
        }
    });

    console.log(filtered_car_m_v);
    console.log(car_segment_possibilities);

    this.setState({ car_segment_possibilities }, () => {
      if (car_segment_possibilities.length == 0) {
        const firstCar = filtered_car_m_v.length
          ? filtered_car_m_v[0].id
          : null;
        this.props.dispatch(updateState({ car: firstCar }));
        if (
          this.props.registerState[strings("motorbike").toLocaleLowerCase()] !=
          undefined
        )
          this.props.navigation.navigate("SurveyMotoSegment");
        else this.props.navigation.navigate("SurveyUserData");
      }
    });
  };

  handleCarSegmentChange = val => {
    if (this.state.car_year != "choose") {
      this.setState({
        car_segment_answer: val
      });

      const filtered_car_m_v = this.props.registerState.get_mobility_car_values.filter(
        e => {
          return (
            e.year == this.state.car_year &&
            (e.segment == val || e.segment == null) &&
            e.fuel == this.props.registerState.car_fuel
          );
        }
      );

      console.log(val);
      console.log(filtered_car_m_v);

      if (filtered_car_m_v.length > 0)
        this.props.dispatch(
          updateState({
            car: filtered_car_m_v[0].id
          })
        );
      else
        this.props.dispatch(
          updateState({
            car: null
          })
        );

      // this.setState({ car_fuel_possibilities }, () => {
      //   this.props.dispatch(updateState({ car: filtered_car_m_v[0].id }));
      //   if (
      //     this.props.registerState[strings("motorbike").toLocaleLowerCase()] !=
      //     undefined
      //   )
      //     this.props.navigation.navigate("SurveyMotoSegmentSegment");
      //   else this.props.navigation.navigate("SurveyUserData");
      // });
    }
  };

  renderCarOwningCheckbox(index, label) {
    return (
      <View style={styles.answerBoxes}>
        <TouchableWithoutFeedback
          onPress={() => this.handleCarOwningAnswer(index)}
        >
          <View style={styles.checkboxesContainer}>
            <View style={[styles.checkboxes]}>
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1 }}
                locations={[0, 1.0]}
                colors={["#E82F73", "#F49658"]}
                style={[
                  styles.checkboxesGradient,
                  {
                    opacity: this.state.car_owning_answer == index ? 1 : 0
                  }
                ]}
              />
            </View>
            <View style={{ height: 25 }} />
            <View style={{ justifyContent: "center", alignContent: "center" }}>
              <Text style={styles.checkboxesText}>{label}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderCarOwning() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center"
        }}
      >
        {this.renderCarOwningCheckbox(0, strings("no"))}
        {this.renderCarOwningCheckbox(1, strings("yes"))}
        {this.renderCarOwningCheckbox(2, strings("yes__it_is_at_m"))}
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
    const values = this.state.car_year_possibilities.map((element, index) => (
      <PickerItem
        key={index}
        label={
          "" +
          element
            .replace("2017-2019", strings("from_2017_onwar"))
            .replace("up_to_1992", strings("up_to_1992"))
            .replace(/_/g, " ")
        }
        value={"" + element}
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
            selectedValue={"" + this.state.car_year}
            onValueChange={(itemValue, itemIndex) => {
              console.log(itemValue);
              // this.setState({ modal_visible: false });
              this.handleCarYearChange(itemValue);
            }}
          >
            {values}
          </Picker>
          {this.renderButtonsModal()}
        </View>
      </Modal>
    );
  }

  renderCarYear() {
    return (
      <View>
        {this.renderModal()}
        <TouchableWithoutFeedback
          onPress={() => {
            if (this.state.car_year_possibilities.length > 0)
              this.setState({
                modal_visible: true,
                car_year: this.state.car_year_possibilities[0]
              });
          }}
        >
          <View
            style={{
              // backgroundColor: "#fff",
              backgroundColor:
                this.state.car_year_possibilities.length == 0
                  ? "#ffffff60"
                  : "#fff",
              borderRadius: 4,
              width: 180,
              height: 80,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10
            }}
          >
            <Text>
              {this.state.car_year
                .replace("2017-2019", strings("from_2017_onwar"))
                .replace(/_/g, " ")}
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
    );
  }

  renderCarSegment() {
    return this.state.car_segment_possibilities.map((element, index) => {
      return (
        <View key={index} style={styles.answerBoxes}>
          <TouchableWithoutFeedback
            onPress={() => {
              if (this.state.car_year != strings("choose"))
                this.handleCarSegmentChange(element);
            }}
          >
            <View style={styles.checkboxesContainer}>
              <View
                style={[
                  styles.checkboxes,
                  {
                    backgroundColor:
                      this.state.car_year != strings("choose")
                        ? "#F7F8F9"
                        : "#F7F8F940"
                    // backgroundColor: this.props.checkboxColor
                    // backgroundColor:
                    //   this.state.car_owning_answer == 0
                    //     ? "#ffffff60"
                    //     : "#F7F8F9"
                  }
                ]}
              >
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 0.0, y: 1 }}
                  locations={[0, 1.0]}
                  colors={["#E82F73", "#F49658"]}
                  style={[
                    styles.checkboxesGradient,
                    {
                      opacity: this.state.car_segment_answer == element ? 1 : 0
                    }
                  ]}
                />
              </View>
              <View style={{ height: 25 }} />
              <View
                style={{ justifyContent: "center", alignContent: "center" }}
              >
                <Text style={styles.checkboxesText}>{strings(element)}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    });
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
                {/* Do you have a car? <Emoji name="car" /> <Emoji name="taxi" /> */}
                {strings("do_you_have_a_c")}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: Dimensions.get("window").height - 230,
            width: Dimensions.get("window").width * 0.9,
            alignSelf: "center",
            justifyContent: "space-around"
          }}
        >
          {/* 
          <View
            style={{
              height: Dimensions.get("window").height * 0.15
            }}
          >
            {this.renderCarOwning()}
          </View> 
          */}
          <View
            style={{
              height: Dimensions.get("window").height * 0.2,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={styles.textSection}>{strings("year_of_vehicle")}</Text>
            {this.renderCarYear()}
          </View>
          <View
            style={{
              height: Dimensions.get("window").height * 0.2,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                height: Dimensions.get("window").height * 0.05,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={styles.textSection}>{strings("car_segment")}</Text>
            </View>
            <View
              style={{
                height: Dimensions.get("window").height * 0.15,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 12
              }}
            >
              {this.renderCarSegment()}
            </View>
          </View>
        </View>
        <View
          style={{
            height: 130,
            backgroundColor: "transparent",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center"
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
              alignItems: "center"
            }}
          >
            <View style={styles.textFooterContainer}>
              <Text style={styles.textFooter}>
                {strings("we_need_this_in")}
              </Text>
            </View>

            <View style={[styles.buttonContainer]}>
              {/* <BoxShadow setting={shadowOpt} /> */}
              <TouchableWithoutFeedback
                onPress={() => {
                  // this.props.dispatch(
                  //   updateState({
                  //     car_owning_answer: this.state.car_owning_answer,
                  //     car_segment_answer: this.state.car_segment_answer,
                  //     car_year: this.state.car_year
                  //   })
                  // );

                  if (
                    this.state.car_year != "choose" &&
                    this.state.car_segment_answer != ""
                  ) {
                    if (
                      this.props.registerState[
                        strings("motorbike").toLocaleLowerCase()
                      ] != undefined &&
                      this.props.registerState[
                        strings("motorbike").toLocaleLowerCase()
                      ] == true
                    )
                      this.props.navigation.navigate("SurveyMotoSegment");
                    else this.props.navigation.navigate("SurveyUserData");
                  } else {
                    Alert.alert("Oops", strings("seems_like_you_"));
                  }
                }}
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
    elevation: 1,
  },
  buttonGoOnText: {
    color: "#3363AD",
    fontFamily: "OpenSans-Regular",
    fontSize: 14
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
    color: "#fff",
    fontSize: 11,
    textAlign: "center"
  },
  checkboxesContainer: {
    height: 90,
    width: Dimensions.get("window").width * 0.2,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
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
  textSection: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
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

export default withData(CarScreen);
