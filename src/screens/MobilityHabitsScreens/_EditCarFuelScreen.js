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
  NativeModules,
  Picker as PickerIos
} from "react-native";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import Svg, { Circle, Line } from "react-native-svg";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";

import {
  getMobilityCarValues,
  updateState
} from "./../../domains/register/ActionCreators";

import {
  setCarProperties,
  UpdateProfile
} from "./../../domains/login/ActionCreators";

import PickerAndroid from "./../../components/PickerAndroid/PickerAndroid";

let Picker = Platform.OS === "ios" ? PickerIos : PickerAndroid;
let PickerItem = Picker.Item;

import { strings } from "../../config/i18n";

class EditCarFuelScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      car_id: null,
      car_owning_answer: 1, // 0 || 1 || 2
      car_year: strings("choose"), // -> number
      car_segment_answer: "", // "medium" || "large" || "mini" || "small"
      car_fuel: "", // 0 ... 5
      car_year_possibilities: ["-"],
      car_segment_possibilities: [
        strings("medium"),
        strings("large"),
        strings("mini"),
        strings("small")
      ],
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
      modal_visible: false,
      tapped: false
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

  componentDidMount() {
    this.props.dispatch(getMobilityCarValues());
  }

  componentWillMount() {
    // const filtered_car_m_v = this.props.registerState.get_mobility_car_values.filter(
    //   e => {
    //     return (
    //       e.year == this.props.loginState.car_year &&
    //       (e.segment == this.props.loginState.car_segment_answer ||
    //         e.segment == null)
    //     );
    //   }
    // );
    // let car_fuel_possibilities = this.props.loginState.car_properties
    //   .car_fuel_possibilities;
    // console.log(car_fuel_possibilities);
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
    // if (this.props.loginState.car_properties.car_segment_answer != "") {
    //   const filtered_car_m_v = this.props.registerState.get_mobility_car_values.filter(
    //     e => {
    //       return (
    //         e.year == this.props.loginState.car_properties.car_year &&
    //         (e.segment ==
    //           this.props.loginState.car_properties.car_segment_answer ||
    //           e.segment == null) &&
    //         e.fuel == val
    //       );
    //     }
    //   );

    //   console.log(filtered_car_m_v[0].id);

    //   if (this.props.loginState.car_properties.car_segment_answer != "")
    //     this.setState(
    //       {
    //         car_fuel: val,
    //         car_id: filtered_car_m_v.length > 0 ? filtered_car_m_v[0].id : null,
    //         tapped: true
    //       },
    //       () => {
    //         this.props.dispatch(
    //           UpdateProfile({
    //             data: {
    //               car: this.state.car_id,
    //               car_owning_answer: this.props.loginState.car_properties
    //                 .car_owning_answer
    //             }
    //           })
    //         );
    //       }
    //     );
    // }

    const filtered_car_m_v = this.props.registerState.get_mobility_car_values.filter(
      e => {
        return e.fuel == val;
      }
    );

    let car_possibilities = [...filtered_car_m_v];

    console.log(car_possibilities);

    this.setState({ car_possibilities, car_fuel: val, tapped: true }, () => {
      this.props.dispatch(
        updateState({
          car_fuel_answer: val,
          car_possibilities
        })
      );
    });
  };

  handleContinueTap = () => {
    if (this.state.tapped) {
      // this.props.dispatch(
      //   UpdateProfile({
      //     data: {
      //       car: this.state.car_id,
      //       car_owning_answer: this.props.loginState.car_properties
      //         .car_owning_answer
      //     }
      //   })
      // );
      if (this.props.navigation.state.params) {
        if (this.props.navigation.state.params.slides)
          this.props.navigation.navigate("EditCarScreen", { slides: true });
      }
      // else this.props.navigation.navigate("PersonalMobilityDataScreen");
      else this.props.navigation.navigate("EditCarScreen");
    } else Alert.alert("Oops", strings("seems_like_you_"));
  };

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
            name={`${val.toLowerCase()}_icn`}
            size={62}
            color={
              this.state.car_fuel == val
                ? "#3363AD"
                : this.state.car_fuel_possibilities.includes(val)
                ? "#3d3d3d70"
                : "#3d3d3d20"
            }
          />
          <Text
            style={{
              color: this.state.car_fuel_possibilities.includes(val)
                ? "#3d3d3d70"
                : "#3d3d3d20",
              fontFamily: "OpenSans-Regular",
              fontSize: 12,
              marginRight: 7
            }}
          >
            {val.charAt(0).toUpperCase() + val.slice(1)}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderTarget = val => {
    if (this.state.car_fuel === val) {
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
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View
            style={{
              width: Dimensions.get("window").width * 0.7,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={styles.textSection}>{strings("select_your_car")}</Text>
          </View>
        </View>
        <Image
          source={require("../../assets/images/wawe_mobility_habits_blue.png")}
          style={{
            height: 50,
            width: Dimensions.get("window").width
          }}
          resizeMethod={"auto"}
        />
        <View style={styles.bodyContainer}>
          <View style={[styles.boxesContainer, { marginTop: 20 }]}>
            <View
              style={{
                height: Dimensions.get("window").height * 0.6,
                backgroundColor: "transparent",
                justifyContent: "space-around"
              }}
            >
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
              <View
                style={{
                  alignSelf: "center",
                  marginTop: 15
                }}
              >
                <TouchableWithoutFeedback onPress={this.handleContinueTap}>
                  <View style={styles.btnContainer}>
                    <Text style={styles.btnText}>{strings("continue")}</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </View>

        <Image
          style={{
            width: 60,
            height: 60,
            position: "absolute",
            left: Dimensions.get("window").width * 0.0125,
            top: 125
          }}
          source={require("../../assets/images/coins_icn_friends_banner.png")}
        />
        <Image
          style={{
            width: 100,
            height: 100,
            position: "absolute",
            right: Dimensions.get("window").width * 0.0125,
            top: 110
          }}
          source={require("../../assets/images/carpooling_icn.png")}
        />
        <View
          style={{
            position: "absolute",
            right: Dimensions.get("window").width * 0.0125,
            top: Dimensions.get("window").height * 0.08,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 3
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            elevation: 6
          }}
        >
          <Svg height={60} width={60} viewBox="0 0 100 100">
            <Circle
              cx="50"
              cy="50"
              r="25"
              // stroke="#3D3D3D"
              strokeWidth="1"
              fill="#E6332A"
              // onPress={() => this.props.navigation.goBack()}
              onPress={() => {
                if (this.props.navigation.state.params)
                  this.props.navigation.navigate("HomeTab");
                else this.props.navigation.goBack();
              }}
            />
            <Line
              x1="45"
              y1="45"
              x2="55"
              y2="55"
              stroke="white"
              strokeWidth="2"
              // onPress={() => this.props.navigation.goBack()}
              onPress={() => {
                if (this.props.navigation.state.params)
                  this.props.navigation.navigate("HomeTab");
                else this.props.navigation.goBack();
              }}
            />
            <Line
              x1="55"
              y1="45"
              x2="45"
              y2="55"
              stroke="white"
              strokeWidth="2"
              // onPress={() => this.props.navigation.goBack()}
              onPress={() => {
                if (this.props.navigation.state.params)
                  this.props.navigation.navigate("HomeTab");
                else this.props.navigation.goBack();
              }}
            />
          </Svg>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  headerContainer: {
    backgroundColor: "#3363AD",
    width: Dimensions.get("window").width,
    height: 125,
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
    marginTop: 20,
    textAlign: "center"
  },
  answerBoxes: {
    height: 80,
    marginVertical: 5,
    justifyContent: "space-between",
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
    marginLeft: 6,
    textAlign: "center"
  },
  checkboxesContainer: {
    width: Dimensions.get("window").width * 0.3,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "column",
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
  labelContainer: {
    width: Dimensions.get("window").width * 0.95,
    height: 80,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center"
    // backgroundColor: "#e33"
  },
  btnContainer: {
    backgroundColor: "#3363AD",
    width: Dimensions.get("window").width * 0.4,
    height: 40,
    borderRadius: 4,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  btnText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 15
  },
  label: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3d3d3d",
    fontSize: 15,
    textAlign: "left"
  }
});

const withData = connect(state => {
  return {
    registerState: state.register,
    loginState: state.login
  };
});

export default withData(EditCarFuelScreen);
