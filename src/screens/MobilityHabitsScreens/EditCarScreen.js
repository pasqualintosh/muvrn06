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
import PickerAndroid from "./../../components/PickerAndroid/PickerAndroid";

import {
  getMobilityCarValues,
  setCarSegment
} from "./../../domains/register/ActionCreators";

import {
  setCarProperties,
  UpdateProfile
} from "./../../domains/login/ActionCreators";

let Picker = Platform.OS === "ios" ? PickerIos : PickerAndroid;
let PickerItem = Picker.Item;

import { strings } from "../../config/i18n";
import Aux from "../../helpers/Aux";

class EditCarScreen extends React.Component {
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
      modal_visible: false,
      tapped: false
    };
  }

  static navigationOptions = {
    header: null
  };

  componentWillMount() {
    this.props.dispatch(getMobilityCarValues());
  }

  // componentWillReceiveProps(props) {
  //   if (
  //     this.props.registerState.get_mobility_car_values !=
  //     props.registerState.get_mobility_car_values
  //   ) {
  //     let car_year_possibilities = [];

  //     props.registerState.get_mobility_car_values.forEach((item, index) => {
  //       if (item.year != null)
  //         if (car_year_possibilities.length > 0) {
  //           if (!car_year_possibilities.includes(item.year))
  //             car_year_possibilities.push(item.year);
  //         } else {
  //           car_year_possibilities.push(item.year);
  //         }
  //     });

  //     this.setState({ car_year_possibilities });

  //     if (
  //       props.registerState.get_mobility_car_values.length > 0 &&
  //       (props.loginState.infoProfile.car != {} ||
  //         props.loginState.infoProfile.car != null)
  //     ) {
  //       try {
  //         this.setState(
  //           {
  //             car_owning_answer: props.loginState.infoProfile.car_owning_answer,
  //             car_fuel: props.loginState.infoProfile.car.fuel,
  //             car_year: props.loginState.infoProfile.car.year,
  //             car_segment_answer:
  //               props.loginState.infoProfile.car.segment != null
  //                 ? props.loginState.infoProfile.car.segment
  //                 : props.registerState.car_segment
  //           },
  //           () => {
  //             const filtered_car_m_v = this.props.registerState.get_mobility_car_values.filter(
  //               e => {
  //                 return (
  //                   e.year == this.state.car_year &&
  //                   (e.segment == this.state.car_segment_answer ||
  //                     e.segment == null)
  //                 );
  //               }
  //             );

  //             let car_fuel_possibilities = [];

  //             filtered_car_m_v.forEach((item, index) => {
  //               // if (item.segment != null)
  //               if (car_fuel_possibilities.length > 0) {
  //                 if (!car_fuel_possibilities.includes(item.fuel))
  //                   car_fuel_possibilities.push(item.fuel);
  //               } else {
  //                 car_fuel_possibilities.push(item.fuel);
  //               }
  //             });

  //             this.setState({ car_fuel_possibilities });
  //           }
  //         );
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   }
  // }

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

      // console.log(props.registerState.get_mobility_car_values);
      // console.log(this.props.registerState.car_fuel);
      console.log(car_possibilities);
      console.log(car_year_possibilities);

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

          console.log(car_segment_possibilities);

          this.setState({ car_segment_possibilities }, () => {
            if (car_possibilities.length == 1) {
              this.props.dispatch(
                UpdateProfile({
                  data: {
                    public_profile: {
                      car: car_possibilities ? car_possibilities[0].id : null,
                      car_owning_answer: this.props.registerState
                        .car_owning_answer
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
        }
      });
    }

    if (
      props.registerState.get_mobility_car_values.length > 0 &&
      (props.loginState.infoProfile.car != {} ||
        props.loginState.infoProfile.car != null)
    ) {
      try {
        this.setState(
          {
            car_owning_answer: props.loginState.infoProfile.car_owning_answer,
            car_fuel: props.loginState.infoProfile.car.fuel,
            tapped: true
          },
          () => {}
        );
      } catch (error) {
        console.log(error);
      }
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
      this.props.dispatch(
        UpdateProfile({
          data: {
            public_profile: { car: null, car_owning_answer: 0 }
          }
        })
      );
      this.props.dispatch(setCarProperties(null));
      this.props.navigation.goBack(null);
    }
  };

  renderCarOwning() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center"
        }}
      >
        {this.renderCarOwningCheckbox(0, strings("id_0_54"))}
        {this.renderCarOwningCheckbox(1, strings("id_0_55"))}
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
              {strings("id_0_68").toLocaleUpperCase()}
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
              {strings("id_0_12").toLocaleUpperCase()}
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

  renderCarYear() {
    return (
      <View style={{ alignSelf: "center" }}>
        {this.renderModal()}
        <TouchableWithoutFeedback
          onPress={() => {
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
              elevation: 6
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
              <Text style={styles.checkboxesText}>{strings(element)}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    });
  }

  // handleCarSegmentChange = val => {
  //   if (this.state.car_year != "choose") {
  //     this.setState({
  //       car_segment_answer: val
  //     });

  //     const filtered_car_m_v = this.props.registerState.get_mobility_car_values.filter(
  //       e => {
  //         return (
  //           e.year == this.state.car_year &&
  //           (e.segment == val || e.segment == null)
  //         );
  //       }
  //     );

  //     let car_fuel_possibilities = [];

  //     filtered_car_m_v.forEach((item, index) => {
  //       // if (item.segment != null)
  //       if (car_fuel_possibilities.length > 0) {
  //         if (!car_fuel_possibilities.includes(item.fuel))
  //           car_fuel_possibilities.push(item.fuel);
  //       } else {
  //         car_fuel_possibilities.push(item.fuel);
  //       }
  //     });

  //     console.log(car_fuel_possibilities);

  //     this.setState({ car_fuel_possibilities }, () => {});
  //   }
  // };

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

  handleContinueTap = () => {
    if (this.state.tapped) {
      // this.props
      // .dispatch(
      this.props.dispatch(
        setCarProperties({
          car_owning_answer: this.state.car_owning_answer,
          car_year: this.state.car_year,
          car_segment_answer: this.state.car_segment_answer,
          car_fuel_possibilities: this.state.car_fuel_possibilities
        })
      );
      if (this.props.navigation.state.params)
        this.props.navigation.navigate("EditMotoSegmentScreen", {
          slides: true
        });
      else
        this.props.navigation.navigate("PersonalMobilityDataScreen", {
          car: this.state
        });
    } else Alert.alert("Oops", strings("seems_like_you_"));
  };

  renderCheckbox(index, label, func, bool) {
    return (
      <View style={styles.answerBoxes}>
        <TouchableWithoutFeedback
          onPress={() => this.handleBikeTap(index, func)}
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
                    opacity: bool ? 1 : 0
                  }
                ]}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View
          style={{
            width: Dimensions.get("window").width * 0.2,
            height: Dimensions.get("window").height * 0.1,
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <Text style={styles.checkboxesText}>{label}</Text>
        </View>
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
            <Text style={styles.textSection}>{strings("do_you_have_a_c")}</Text>
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
                height:
                  Dimensions.get("window").height -
                  (Platform.OS === "ios" ? 170 : 200),
                width: Dimensions.get("window").width,
                backgroundColor: "transparent",
                justifyContent: "space-around",
                alignItems: "center"
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
              <View>
                <Text style={[styles.textSection, { color: "#3d3d3d" }]}>
                  {strings("year_of_vehicle")}:
                </Text>
              </View>
              {this.renderCarYear()}
              {this.state.car_year != strings("choose") ? (
                <Aux>
                  <Text style={[styles.textSection, { color: "#3d3d3d" }]}>
                    {strings("car_segment")}:
                  </Text>
                  <View
                    style={{
                      height: 80,
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center"
                    }}
                  >
                    {this.renderCarSegment()}
                  </View>
                </Aux>
              ) : (
                <Aux>
                  <Text
                    style={[
                      styles.textSection,
                      { color: "#3d3d3d", opacity: 0 }
                    ]}
                  >
                    {strings("car_segment")}:
                  </Text>
                  <View
                    style={{
                      height: 80,
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center"
                    }}
                  />
                </Aux>
              )}

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
            right: Dimensions.get("window").width * 0.0125,
            top: 30,
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
    backgroundColor: "#fff",
    height: Dimensions.get("window").height
  },
  headerContainer: {
    backgroundColor: "#3363AD",
    width: Dimensions.get("window").width,
    height: 100,
    justifyContent: "center",
    alignItems: "center"
  },
  bodyContainer: {
    width: Dimensions.get("window").width,
    height:
      Dimensions.get("window").height - (Platform.OS === "ios" ? 170 : 200),
    flexDirection: "column",
    justifyContent: "space-between",
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
    // marginVertical: 5,
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
    height:
      Dimensions.get("window").height - (Platform.OS === "ios" ? 170 : 200),
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

export default withData(EditCarScreen);
