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
import { UpdateProfile } from "./../../domains/login/ActionCreators";
import Emoji from "@ardentlabs/react-native-emoji";
import Icon from "react-native-vector-icons/Ionicons";

class PersonalCarFuelScreen extends React.Component {
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
      ordered_car_fuel_possibilities: []
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
    const filtered_car_m_v = this.props.registerState.get_mobility_car_values.filter(
      e => {
        return (
          e.year == this.props.loginState.car_year &&
          (e.segment == this.props.loginState.car_segment_answer ||
            e.segment == null)
        );
      }
    );

    let car_fuel_possibilities = this.props.loginState.car_properties
      .car_fuel_possibilities;

    console.log(car_fuel_possibilities);

    let not_selectable_fuel = this.arr_diff(
      this.state.car_fuel_possibilities,
      car_fuel_possibilities
    );

    this.setState({
      car_fuel_possibilities,
      car_fuel: "",
      ordered_car_fuel_possibilities: [
        ...car_fuel_possibilities,
        ...not_selectable_fuel
      ]
    });
  }

  handleCarFuelChange = val => {
    if (this.props.loginState.car_properties.car_segment_answer != "") {
      const filtered_car_m_v = this.props.registerState.get_mobility_car_values.filter(
        e => {
          return (
            e.year == this.props.loginState.car_properties.car_year &&
            (e.segment ==
              this.props.loginState.car_properties.car_segment_answer ||
              e.segment == null) &&
            e.fuel == val
          );
        }
      );

      console.log(filtered_car_m_v[0].id);

      if (this.props.loginState.car_properties.car_segment_answer != "")
        this.setState(
          {
            car_fuel: val,
            car_id: filtered_car_m_v.length > 0 ? filtered_car_m_v[0].id : null
          },
          () => {
            this.props.dispatch(
              UpdateProfile({
                data: {
                  public_profile: {
                    car: this.state.car_id,
                    car_owning_answer: this.props.loginState.car_properties
                      .car_owning_answer
                  }
                }
              })
            );
          }
        );
    }
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
              this.state.car_fuel_possibilities.includes(val)
                ? "#fff"
                : "#3d3d3d50"
            }
          />
          <Text
            style={{
              color: this.state.car_fuel_possibilities.includes(val)
                ? "#fff"
                : "#3d3d3d50",
              fontFamily: "OpenSans-Regular",
              fontSize: 12,
              marginRight: 7
            }}
          >
            {val.toLowerCase() == "petrol_hybrids"
              ? "Hybrid"
              : val.charAt(0).toUpperCase() + val.slice(1)}
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
        source={require("./../../assets/images/purple_bg.png")}
        style={styles.backgroundImage}
      >
        <View
          style={{
            height:
              Platform.OS == "ios"
                ? Dimensions.get("window").height * 0.2
                : Dimensions.get("window").height * 0.16,
            backgroundColor: "transparent"
          }}
        >
          <WavyArea
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
            <Text style={styles.textHeader}>
              Select your car fuel. <Emoji name="car" />
            </Text>
          </View>
        </View>
        <View
          style={{
            height: Dimensions.get("window").height * 0.6,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center"
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
              top: 60
            }}
          >
            <View style={styles.textFooterContainer}>
              <Text style={styles.textFooter}>
                We need this information to estimate your CO2 emissions.
              </Text>
            </View>

            <View style={[styles.buttonContainer]}>
              {/* <BoxShadow setting={shadowOpt} /> */}
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.navigation.navigate("PersonalMobilityDataScreen");
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
    registerState: state.register,
    loginState: state.login
  };
});

export default withData(PersonalCarFuelScreen);
