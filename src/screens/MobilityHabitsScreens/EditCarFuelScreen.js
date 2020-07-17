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
  Picker as PickerIos,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import Svg, { Circle, Line } from "react-native-svg";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";
import Aux from "./../../helpers/Aux";

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
      car_owning_answer: 0, // 0 || 1 || 2
      car_year: strings("choose"), // -> number
      car_segment_answer: "", // "medium" || "large" || "mini" || "small"
      car_fuel: "", // 0 ... 5
      car_year_possibilities: ["-"],
      car_segment_possibilities: ["medium", "large", "mini", "small"],
      car_fuel_possibilities: [
        "petrol",
        "diesel",
        "petrol_hybrids",
        "LPG",
        "CNG",
        "electric"
      ],
      modal_visible: false,
      tapped: false,
      ordered_car_fuel_possibilities: [
        "petrol",
        "diesel",
        "petrol_hybrids",
        "LPG",
        "CNG",
        "electric"
      ]
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
    this.props.dispatch(getMobilityCarValues());

    if (
      !this.isEmpty(this.props.loginState.infoProfile.car) &&
      this.props.loginState.infoProfile.car != null
    ) {
      this.setState({
        car_owning_answer: this.props.loginState.infoProfile.car_owning_answer,
        car_fuel: this.props.loginState.infoProfile.car.fuel,
        car_year: this.props.loginState.infoProfile.car.year,
        car_segment_answer: this.props.loginState.infoProfile.car.segment
          ? this.props.loginState.infoProfile.car.segment
          : "",
        tapped: true
      });

      this.props.dispatch(
        updateState({
          car_owning_answer: this.props.loginState.infoProfile
            .car_owning_answer,
          car_fuel: this.props.loginState.infoProfile.car.fuel
        })
      );
    } else if (this.props.navigation.getParam("slides", false)) {
      this.setState({
        tapped: true
      });
    }
  }

  isEmpty(obj) {
    for (var x in obj) {
      return false;
    }
    return true;
  }

  componentWillReceiveProps(props) {}

  handleCarFuelChange = val => {
    const filtered_car_m_v = this.props.registerState.get_mobility_car_values.filter(
      e => {
        return e.fuel == val;
      }
    );

    let car_year_possibilities = [];

    filtered_car_m_v.forEach((item, index) => {
      if (item.year != null)
        if (car_year_possibilities.length > 0) {
          if (!car_year_possibilities.includes(item.year))
            car_year_possibilities.push(item.year);
        } else {
          car_year_possibilities.push(item.year);
        }
    });

    this.setState(
      {
        car_fuel: val,
        tapped: true,
        car_year_possibilities
      },
      () => {
        this.props.dispatch(
          updateState({
            car_fuel: val,
            car_owning_answer: this.state.car_owning_answer
          })
        );
        if (!car_year_possibilities.length) {
          // ovvero auto elettrica
          this.props.dispatch(
            UpdateProfile({
              data: {
                public_profile: {
                  car: 60,
                  car_owning_answer: state.car_owning_answer
                }
              }
            })
          );
        }
      }
    );
  };

  handleContinueTap = () => {
    if (this.state.tapped) {
      if (this.props.navigation.state.params) {
        // this.props.navigation.navigate("EditMotoSegmentScreen", {
        //   slides: true
        // });
        this.props.navigation.navigate("PersonalFrequentTripDataScreenBlur");
      } else this.props.navigation.goBack(null);
    } else Alert.alert("Oops", strings("seems_like_you_"));
  };

  handleCarOwningAnswer = val => {
    if (val != 0)
      this.setState(
        {
          car_owning_answer: val,
          tapped: false
        },
        () => {
          this.props.dispatch(updateState({ car_owning_answer: val }));
        }
      );
    else {
      this.setState({ car_owning_answer: val, car_fuel: "", tapped: true });
      this.props.dispatch(
        UpdateProfile({
          data: {
            public_profile: { car: null, car_owning_answer: 0 }
          }
        })
      );
      this.props.dispatch(setCarProperties(null));
      if (this.props.navigation.getParam("slides", false)) {
      } else {
        this.props.navigation.goBack(null);
      }
    }
  };

  renderCarFuel() {
    return (
      <View>
        <View
          style={{
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
            width: Dimensions.get("window").width * 0.8,
            height: Dimensions.get("window").height * 0.3,
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
    );
  }

  renderFuelSelectBox(val) {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (this.state.car_owning_answer != 0) this.handleCarFuelChange(val);
        }}
        style={{
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <View style={[styles.fuelContainer]}>
          {this.renderTarget(val)}
          <View
            style={{
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <OwnIcon
              name={`${
                val.toLowerCase() == "petrol_hybrids"
                  ? "hybrid"
                  : val.toLowerCase()
              }_icn`}
              size={62}
              color={
                this.state.car_fuel == val
                  ? "#3363AD"
                  : this.state.car_owning_answer != 0
                  ? "#3d3d3d70"
                  : "#3d3d3d20"
              }
            />
          </View>

          <View
            style={{
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                color:
                  this.state.car_owning_answer != 0 ? "#3d3d3d70" : "#3d3d3d20",
                fontFamily: "OpenSans-Regular",
                fontSize: 12,
                textAlign: "center",
                marginRight: 12
              }}
            >
              {val.toLowerCase() == "petrol_hybrids"
                ? strings("petrol_hybrids")
                : strings(val.toLocaleLowerCase())}
            </Text>
          </View>
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
              borderLeftColor: "#3d3d3d",
              borderTopColor: "#3d3d3d",
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
              borderRightColor: "#3d3d3d",
              borderTopColor: "#3d3d3d",
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
              borderLeftColor: "#3d3d3d",
              borderBottomColor: "#3d3d3d",
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
              borderRightColor: "#3d3d3d",
              borderBottomColor: "#3d3d3d",
              borderRightWidth: 1,
              borderBottomWidth: 1
            }}
          />
        </View>
      );
    }
  };

  handleCarSegmentChange = val => {
    if (this.state.car_year != "choose") {
      this.setState({
        car_segment_answer: val,
        tapped: true
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
          UpdateProfile({
            data: {
              public_profile: {
                car: filtered_car_m_v[0].id,
                car_owning_answer: this.props.registerState.car_owning_answer
              }
            }
          })
        );
      else
        this.props.dispatch(
          UpdateProfile({
            data: {
              public_profile: { car: null, car_owning_answer: 0 }
            }
          })
        );
    }
  };

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
                    backgroundColor: "#F7F8F9",
                    

                     opacity:  this.state.car_year != strings("choose") ? 1 : 0.5
                         
                        
                  }
                ]}
              >
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 0.0, y: 1 }}
                  locations={[0, 1.0]}
                  colors={["#3363AD", "#3383AD"]}
                  style={[
                    styles.checkboxesGradient,
                    {
                      opacity: this.state.car_segment_answer == element ? 1 : 0
                    }
                  ]}
                />
              </View>
              <Text style={[styles.checkboxesText, { opacity:  this.state.car_year != strings("choose") ? 1 : 0.5}]}>{strings(element)}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    });
  }

  renderCarYear() {
    return (
      <View style={{ alignSelf: "center" }}>
        {this.renderModal()}
        <TouchableWithoutFeedback
          onPress={() => {
            if (this.state.car_fuel != "")
              this.setState({
                modal_visible: true,
                car_year: this.state.car_year_possibilities[0],
                car_segment_answer: "",
                tapped: false
              });
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 3,
              width: 220,
              height: 50,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 3
              },
              shadowOpacity: 0.27,
              shadowRadius: 4.65,
              elevation: 6,
              opacity: this.state.car_fuel == "" ? 0.2 : 1
            }}
          >
            <Text>
              {this.state.car_year
                ? this.state.car_year
                    .replace("2017-2019", strings("from_2017_onwar"))
                    .replace("up_to_1992", strings("up_to_1992"))
                    .replace(/_/g, " ")
                : strings("choose")}
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

  renderCarOwning() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          marginTop: 11
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
                colors={["#3363AD", "#3383AD"]}
                style={[
                  styles.checkboxesGradient,
                  {
                    opacity: this.state.car_owning_answer == index ? 1 : 0
                  }
                ]}
              />
            </View>
            <View
              style={{
                marginTop: 5,
                height: 25,
                justifyContent: "flex-start",
                alignItems: "center"
              }}
            >
              <Text style={styles.checkboxesText}>{label}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
            selectedValue={"" + this.state.car_year}
            onValueChange={(itemValue, itemIndex) => {
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
      if (car_segment_possibilities.length == 0 && filtered_car_m_v.length) {
        this.props.dispatch(
          UpdateProfile({
            data: {
              public_profile: {
                car: filtered_car_m_v[0].id,
                car_owning_answer: this.props.registerState.car_owning_answer
              }
            }
          })
        );
        if (this.props.navigation.state.params)
          this.props.navigation.navigate("EditMotoSegmentScreen", {
            slides: true
          });
        else this.props.navigation.navigate("PersonalMobilityDataScreen");
      }
    });
  };

  renderContinueBtn() {
    return (
      <View
        style={{
          alignSelf: "center",
          marginTop: 5
        }}
      >
        <TouchableWithoutFeedback onPress={this.handleContinueTap}>
          <View style={styles.btnContainer}>
            <Text style={styles.btnText}>{strings("save")}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

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
            <Text style={[styles.textSection, { color: "#fff" }]}>
              {strings("do_you_have_a_c")}
            </Text>
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
        <ScrollView contentContainerStyle={styles.bodyContainer}>
          {this.renderCarOwning()}
          <View style={styles.textContainer}>
            <Text style={[styles.textSection, , { opacity:  this.state.car_owning_answer == 0 ? 0.5 : 1}]}>{strings("fuel")}</Text>
          </View>
          {this.renderCarFuel()}
          {this.state.car_year_possibilities.length ? 
          <Aux>
          <View style={styles.textContainer}>
            <Text style={[styles.textSection, { opacity:  this.state.car_fuel == "" ? 0.5 : 1}]}>{strings("year_of_vehicle")}</Text>
          </View>
          {this.renderCarYear()}
          <View style={styles.textContainer}>
            <Text style={[styles.textSection, { opacity:  this.state.car_year != strings("choose") ? 1 : 0.5}]}>{strings("car_segment")}</Text>
          </View>
          <View
            style={{
              height: 100,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center"
            }}
          >
            {this.renderCarSegment()}
          </View>
          </Aux>
          : <View/>}
          {this.renderContinueBtn()}
          <View style={{ height: 100 }} />
        </ScrollView>
        <Image
          style={{
            width: 60,
            height: 60,
            position: "absolute",
            left: Dimensions.get("window").width * 0.0125,
            top: 100
          }}
          source={require("../../assets/images/coins_icn_friends_banner.png")}
        />
        <Image
          style={{
            width: 100,
            height: 100,
            position: "absolute",
            right: Dimensions.get("window").width * 0.0125,
            top: 85
          }}
          source={require("../../assets/images/carpooling_icn.png")}
        />
        <View
          style={{
            position: "absolute",
            // right: Dimensions.get("window").width * 0.0125,
            left: Dimensions.get("window").width * 0.06,
            top: 50,
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
          <TouchableWithoutFeedback
            onPress={() => this.props.navigation.goBack()}
          >
            <View style={{ width: 30, height: 30 }}>
              <Icon
                name="ios-arrow-back"
                size={18}
                color="#fff"
                // style={{ alignSelf: "center", marginRight: 17 }}
              />
            </View>
          </TouchableWithoutFeedback>

          {/* <Svg height={60} width={60} viewBox="0 0 100 100">
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
          </Svg> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: Dimensions.get("window").height
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
    // height:
    //   Dimensions.get("window").height - (Platform.OS === "ios" ? 230 : 250),
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
    // backgroundColor: "#e33"
  },
  textContainer: {
    width: Dimensions.get("window").width * 0.8,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 5,
    paddingBottom: 10
  },
  textSection: {
    fontFamily: "OpenSans-Regular",
    color: "#3d3d3d",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center"
  },
  answerBoxes: {
    height: 80,
    //marginVertical: 5,
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
    height: 70,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  boxesContainer: {
    width: Dimensions.get("window").width,
    // height:
    //   Dimensions.get("window").height - (Platform.OS === "ios" ? 170 : 200),
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
  },
  fuelContainer: {
    height: 100,
    width: 70,
    // marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonsContainer: {
    // height: 50,
    width: 280,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: Platform.OS == "ios" ? 30 : 10
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
  }
});

const withData = connect(state => {
  return {
    registerState: state.register,
    loginState: state.login
  };
});

export default withData(EditCarFuelScreen);
