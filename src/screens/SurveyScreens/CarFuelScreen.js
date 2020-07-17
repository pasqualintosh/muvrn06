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
  Alert
} from "react-native";
import { BoxShadow } from "react-native-shadow";
import { connect } from "react-redux";
import WavyArea from "./../../components/WavyArea/WavyArea";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";
import LinearGradient from "react-native-linear-gradient";
import { updateState } from "./../../domains/register/ActionCreators";
import Emoji from "@ardentlabs/react-native-emoji";
import Icon from "react-native-vector-icons/Ionicons";

import { strings } from "../../config/i18n";

class CarFuelScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      car_fuel: "", // 0 ... 5
      car_fuel_possibilities: [
        "petrol",
        "diesel",
        "petrol_hybrids",
        "LPG",
        "CNG",
        "electric"
      ],
      ordered_car_fuel_possibilities: [
        "petrol",
        "diesel",
        "petrol_hybrids",
        "LPG",
        "CNG",
        "electric"
      ],
      car_owning_answer: 0 // 0 || 1 || 2
    };
  }

  static navigationOptions = {
    header: null
  };

  arr_diff = (a1, a2) => {
    var a = [],
      diff = [];

    for (var i = 0; i < a1.length; i++) {
      a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
      if (a[a2[i]]) {
        delete a[a2[i]];
      } else {
        a[a2[i]] = true;
      }
    }

    for (var k in a) {
      diff.push(k);
    }

    return diff;
  };

  componentWillMount() {
    // const filtered_car_m_v = this.props.registerState.get_mobility_car_values.filter(
    //   e => {
    //     return (
    //       e.year == this.props.registerState.car_year &&
    //       (e.segment == this.props.registerState.car_segment_answer ||
    //         e.segment == null)
    //     );
    //   }
    // );
    // let car_fuel_possibilities = [];
    // filtered_car_m_v.forEach((item, index) => {
    //   // if (item.segment != null)
    //   if (car_fuel_possibilities.length > 0) {
    //     if (!car_fuel_possibilities.includes(item.fuel))
    //       car_fuel_possibilities.push(item.fuel);
    //   } else {
    //     car_fuel_possibilities.push(item.fuel);
    //   }
    // });
    // // console.log(car_fuel_possibilities);
    // let not_selectable_fuel = this.arr_diff(
    //   this.state.car_fuel_possibilities,
    //   car_fuel_possibilities
    // );
    // this.setState({
    //   car_fuel_possibilities,
    //   car_fuel: "",
    //   ordered_car_fuel_possibilities: [
    //     ...car_fuel_possibilities,
    //     ...not_selectable_fuel
    //   ]
    // });
  }

  handleCarFuelChange = val => {
    // if (this.props.registerState.car_segment_answer != "") {
    //   const filtered_car_m_v = this.props.registerState.get_mobility_car_values.filter(
    //     e => {
    //       return (
    //         e.year == this.props.registerState.car_year &&
    //         (e.segment == this.props.registerState.car_segment_answer ||
    //           e.segment == null) &&
    //         e.fuel == val
    //       );
    //     }
    //   );

    //   console.log(filtered_car_m_v[0].id);

    //   if (this.props.registerState.car_segment_answer != "")
    //     this.setState(
    //       {
    //         car_fuel: val,
    //         car_id: filtered_car_m_v.length > 0 ? filtered_car_m_v[0].id : null
    //       },
    //       () => {
    //         this.props.dispatch(updateState({ car: this.state.car_id }));
    //       }
    //     );
    // }
    this.setState(
      {
        car_fuel: val
      },
      () => {
        this.props.dispatch(updateState({ car_fuel: val }));
      }
    );
  };

  handleCarOwningAnswer = val => {
    this.setState({
      car_owning_answer: val
    });
    if (val == 0)
      this.setState({
        car_fuel: ""
      });
  };

  renderCarOwning() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: Dimensions.get("window").width * 0.85
        }}
      >
        {this.renderCarOwningCheckbox(0, strings("no"))}
        {this.renderCarOwningCheckbox(1, strings("yes"))}
        {this.renderCarOwningCheckbox(2, strings("yes__it_is_at_m"))}
      </View>
    );
  }

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

  renderFuelSelectBox(val) {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (this.state.car_fuel_possibilities.includes(val))
            this.handleCarFuelChange(val);
        }}
      >
        <View
          style={[
            styles.fuelContainer,
            {
              // backgroundColor:
              //   this.props.carFuelAnswer == val
              //     ? "#3d3d3d"
              //     : this.props.checkboxColor
            }
          ]}
        >
          {this.renderTarget(val)}
          <OwnIcon
            name={`${
              val.toLowerCase() == "petrol_hybrids"
                ? "hybrid"
                : val.toLowerCase()
            }_icn`}
            size={62}
            color={this.state.car_owning_answer != 0 ? "#fff" : "#3d3d3d50"}
            // color={
            //   this.state.car_fuel_possibilities.includes(val)
            //     ? "#fff"
            //     : "#3d3d3d50"
            // }
          />
          <Text
            style={{
              color: this.state.car_owning_answer != 0 ? "#fff" : "#3d3d3d50",
              // color: this.state.car_fuel_possibilities.includes(val)
              //   ? "#fff"
              //   : "#3d3d3d50",
              fontFamily: "OpenSans-Regular",
              fontSize: 12,
              marginRight: 7
            }}
          >
            {val.toLowerCase() == "petrol_hybrids"
              ? strings("petrol_hybrids")
              : strings(val.toLocaleLowerCase())}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderTarget = val => {
    if (this.state.car_fuel === val && this.state.car_owning_answer != 0) {
      return (
        <View>
          <View
            style={{
              width: 10,
              height: 10,
              position: "absolute",
              top: -10,
              left: -35,
              borderLeftColor: "#fff",
              borderTopColor: "#fff",
              borderLeftWidth: 1,
              borderTopWidth: 1
            }}
          />
          <View
            style={{
              width: 10,
              height: 10,
              position: "absolute",
              top: -10,
              right: -30,
              borderRightColor: "#fff",
              borderTopColor: "#fff",
              borderRightWidth: 1,
              borderTopWidth: 1
            }}
          />
          <View
            style={{
              width: 10,
              height: 10,
              position: "absolute",
              top: 70,
              left: -35,
              borderLeftColor: "#fff",
              borderBottomColor: "#fff",
              borderLeftWidth: 1,
              borderBottomWidth: 1
            }}
          />
          <View
            style={{
              width: 10,
              height: 10,
              position: "absolute",
              top: 70,
              right: -30,
              borderRightColor: "#fff",
              borderBottomColor: "#fff",
              borderRightWidth: 1,
              borderBottomWidth: 1
            }}
          />
        </View>
      );
    }
  };

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
                {/* Select your car fuel. <Emoji name="car" /> */}
                {strings("do_you_have_a_c")}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: Dimensions.get("window").height - 230,
            backgroundColor: "transparent",
            // justifyContent: "center",
            justifyContent: "space-around",
            alignItems: "center"
          }}
        >
          <View
            style={{
              height: Dimensions.get("window").height * 0.2,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {this.renderCarOwning()}
          </View>
          <View
            style={{
              height: Dimensions.get("window").height * 0.15,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={[
                styles.textSection,
                {
                  color:
                    this.state.car_owning_answer != 0 ? "#fff" : "#3d3d3d50"
                }
              ]}
            >
              {strings("fuel")}
            </Text>
          </View>
          <View
            style={{
              height: Dimensions.get("window").height * 0.25,
              width: Dimensions.get("window").width * 0.8,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center"
            }}
          >
            {this.renderFuelSelectBox(
              this.state.ordered_car_fuel_possibilities[0]
            )}
            {this.renderFuelSelectBox(
              this.state.ordered_car_fuel_possibilities[1]
            )}
            {this.renderFuelSelectBox(
              this.state.ordered_car_fuel_possibilities[2]
            )}
          </View>
          <View
            style={{
              height: Dimensions.get("window").height * 0.25,
              width: Dimensions.get("window").width * 0.8,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center"
            }}
          >
            {this.renderFuelSelectBox(
              this.state.ordered_car_fuel_possibilities[3]
            )}
            {this.renderFuelSelectBox(
              this.state.ordered_car_fuel_possibilities[4]
            )}
            {this.renderFuelSelectBox(
              this.state.ordered_car_fuel_possibilities[5]
            )}
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
                  // if (
                  //   this.props.registerState.car != undefined &&
                  //   this.props.registerState.car != null
                  // )
                  //   if (this.props.registerState.motorbike != undefined)
                  //     this.props.navigation.navigate("SurveyMoto");
                  //   else this.props.navigation.navigate("SurveyUserData");
                  // else Alert.alert("Oops", strings("seems_like_you_"));

                  if (
                    this.props.registerState.car_fuel != undefined &&
                    this.props.registerState.car_fuel != null &&
                    this.state.car_owning_answer != 0
                  ) {
                    if (this.state.car_fuel != "") {
                      this.props.navigation.navigate("SurveyCar");
                      return;
                    } else {
                      Alert.alert("Oops", strings("seems_like_you_"));
                      return;
                    }
                  }

                  if (
                    this.props.registerState[
                      strings("motorbike").toLocaleLowerCase()
                    ] != undefined &&
                    this.props.registerState[
                      strings("motorbike").toLocaleLowerCase()
                    ] == true
                  ) {
                    this.props.navigation.navigate("SurveyMotoSegment");
                    return;
                  }

                  this.props.navigation.navigate("SurveyUserData");
                  return;

                  // if (
                  //   this.props.registerState.car_fuel == undefined ||
                  //   this.props.registerState.car_fuel == null
                  // )
                  //   Alert.alert("Oops", strings("seems_like_you_"));
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
  fuelContainer: {
    height: Dimensions.get("window").height * 0.2,
    width: 70,
    // marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  fuelText: {
    // marginHorizontal: 10,
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3d3d3d",
    fontSize: 13
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

export default withData(CarFuelScreen);
