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
  Picker as PickerIos,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import Svg, { Circle, Line } from "react-native-svg";

import { addCompletePeriodicFeed } from "../../domains/login/ActionCreators";

import {
  updateState,
  getMobilityCarValues,
  getMobilityMotoValues
} from "../../domains/register/ActionCreators";
import {
  setMotoProperties,
  UpdateProfile
} from "../../domains/login/ActionCreators";
import PickerAndroid from "../../components/PickerAndroid/PickerAndroid";
import Modal from "react-native-modal";
import Emoji from "@ardentlabs/react-native-emoji";
import Icon from "react-native-vector-icons/Ionicons";

let Picker = Platform.OS === "ios" ? PickerIos : PickerAndroid;
let PickerItem = Picker.Item;

import { BoxShadow } from "react-native-shadow";
import Slider from "../../components/Slider/Slider";
import round from "round";

import OwnIcon from "./../../components/OwnIcon/OwnIcon";

import { strings } from "../../config/i18n";

class EditMotoSegmentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moto_owning_answer: 0, // 0 || 1 || 2
      moto_id: null,
      moto_cc_answer: "", // 0 || 1 || 2 || 3
      moto_cc_possibilities: [
        "less_50cm3",
        "51_250cm3",
        "251_750cm3",
        "more_751cm3",
        "more_51cm3"
      ],
      all_moto_cc_possibilities: [
        "less_50cm3",
        "51_250cm3",
        "251_750cm3",
        "more_751cm3",
        "more_51cm3"
      ],
      value: 0.0,
      tapped: false,
      moto_engine: "",
      moto_engine_possibilities: ["2_stroke", "4_stroke"],
      moto_year_possibilities: ["-"],
      moto_year: ""
    };
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.props.dispatch(getMobilityMotoValues());
  }

  componentWillMount() {
    this.props.dispatch(getMobilityMotoValues());
    this.setState({ bike: this.props.loginState.infoProfile.bike });
  }

  componentWillReceiveProps(props) {
    if (
      this.props.registerState.get_mobility_moto_values !=
      props.registerState.get_mobility_moto_values
    ) {
      let moto_year_possibilities = [];

      props.registerState.get_mobility_moto_values.forEach((item, index) => {
        if (item.year != null)
          if (moto_year_possibilities.length > 0) {
            if (!moto_year_possibilities.includes(item.year))
              moto_year_possibilities.push(item.year);
          } else {
            moto_year_possibilities.push(item.year);
          }
      });

      this.setState({ moto_year_possibilities });

      if (
        props.registerState.get_mobility_moto_values.length > 0 &&
        (props.loginState.infoProfile.moto != {} &&
          props.loginState.infoProfile.moto != null)
      ) {
        try {
          this.setState(
            {
              moto_owning_answer:
                props.loginState.infoProfile.moto_owning_answer,
              moto_cc_answer: props.loginState.infoProfile.moto.type,
              moto_year: props.loginState.infoProfile.moto.year,
              moto_engine_answer: props.loginState.infoProfile.moto.engine
              // tapped: true
            },
            () => {}
          );
        } catch (error) {
          console.log(error);
        }
      } else if (this.props.navigation.getParam("slides", false)) {
        this.setState({
          // tapped: true
        });
      }
    }
  }

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

  buildCcFromValue = val => {
    let array = [
      ...this.state.moto_cc_possibilities,
      ...this.arr_diff(
        this.state.all_moto_cc_possibilities,
        this.state.moto_cc_possibilities
      )
    ].filter(e => {
      return e != "clone";
    });

    if (val === 0) return array[0];
    if (val > 0 && val < 0.3) return array[1];
    if (val > 0.3 && val < 0.6) return array[2];
    if (val > 0.6 && val < 0.8) return array[3];
    if (val > 0.8 && val <= 1) return array[4];
  };

  showAlert = () => {
    Alert.alert("Oops", strings("seems_like_you_"));
  };

  handleContinueTap = () => {
    if (this.state.tapped) {
      // this.props.dispatch(
      //   UpdateProfile({
      //     data: {
      //       moto: this.state.moto_id,
      //       moto_owning_answer: this.props.loginState.moto_properties
      //         .moto_owning_answer
      //     }
      //   })
      // );
      // salvo che hai completato il mobility habits tra i feed
      if (this.props.navigation.state.params) {
        this.props.navigation.navigate("EndMobilityScreen", {
          slides: true
        });
      }
      this.props.navigation.goBack(null);
    } else if (!this.state.moto_owning_answer) {
      this.props.navigation.goBack(null);
    } else Alert.alert("Oops", strings("seems_like_you_"));
  };

  handleMotoOwningAnswer = val => {
    if (val != 0) {
      this.setState(
        {
          moto_owning_answer: val,
          tapped: false
        },
        () => {
          this.props.dispatch(updateState({ moto_owning_answer: val }));
        }
      );
    } else {
      this.setState({
        moto_owning_answer: 0,
        // tapped: true,
        moto_engine_answer: ""
      });
      // this.setState({
      //   moto_owning_answer: val,
      //   moto_year: "choose",
      //   moto_engine_answer: "",
      //   moto_cc_answer: 0
      // });
      this.props.dispatch(
        UpdateProfile({
          data: {
            public_profile: { moto: null, moto_owning_answer: 0 }
          }
        })
      );
      this.props.dispatch(setMotoProperties(null));
      if (this.props.navigation.getParam("slides", false)) {
      } else {
        this.props.navigation.goBack(null);
      }
    }
  };

  renderMotoOwningCheckbox(index, label) {
    return (
      <View style={styles.answerBoxes}>
        <TouchableWithoutFeedback
          onPress={() => this.handleMotoOwningAnswer(index)}
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
                    opacity: this.state.moto_owning_answer == index ? 1 : 0
                  }
                ]}
              />
            </View>
            <Text style={styles.checkboxesText}>{label}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderMotoOwning() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center"
        }}
      >
        {this.renderMotoOwningCheckbox(0, strings("no"))}
        {this.renderMotoOwningCheckbox(1, strings("yes"))}
        {this.renderMotoOwningCheckbox(2, strings("yes__it_is_at_m"))}
      </View>
    );
  }

  handleMotoStrokesChange = val => {
    this.setState({
      moto_engine_answer: val
      // tapped: true
    });

    let moto_cc_possibilities = [];
    let moto_possibilities = [];

    moto_possibilities = this.props.registerState.get_mobility_moto_values.filter(
      element => {
        return element.engine == val;
      }
    );

    moto_possibilities.forEach((item, index) => {
      if (item.type != null)
        if (moto_cc_possibilities.length > 0) {
          if (!moto_cc_possibilities.includes(item.type))
            moto_cc_possibilities.push(item.type);
        } else {
          moto_cc_possibilities.push(item.type);
        }
    });

    this.setState({ moto_engine: val, moto_cc_possibilities }, () => {
      this.props.dispatch(
        updateState({
          moto_engine: val,
          moto_owning_answer: this.state.moto_owning_answer
        })
      );
    });
  };

  renderTarget = val => {
    if (this.state.moto_engine_answer === val) {
      return (
        <View>
          <View
            style={{
              width: 10,
              height: 10,
              position: "absolute",
              top: 0,
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
              top: 0,
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

  renderMotoEngine() {
    return this.state.moto_engine_possibilities.map((element, index) => {
      return (
        <View key={index} style={styles.answerBoxes}>
          <TouchableWithoutFeedback
            onPress={() => {
              if (this.state.moto_owning_answer != 0)
                this.handleMotoStrokesChange(element);
            }}
          >
            <View style={styles.checkboxesContainer}>
              {this.renderTarget(element)}
              <OwnIcon
                name={"onboarding-stroke_icn"}
                size={60}
                color={
                  this.state.moto_engine_answer == element
                    ? "#3d3d3d"
                    : "#3d3d3d40"
                }
                style={{ marginVertical: 7 }}
              />
              <View style={{ height: 25 }} />
              <View
                style={{ justifyContent: "center", alignContent: "center" }}
              >
                <Text style={styles.checkboxesText}>
                  {element == "2_stroke"
                    ? strings("_2_stroke")
                    : strings("_4_stroke")}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    });
  }

  handleMotoCcChange = val => {
    if (this.state.moto_engine != "") {
      const filtered_moto_m_v = this.props.registerState.get_mobility_moto_values.filter(
        e => {
          return (
            e.type == val && e.engine == this.props.registerState.moto_engine
          );
        }
      );

      let moto_year_possibilities = [];

      filtered_moto_m_v.forEach((item, index) => {
        if (moto_year_possibilities.length > 0) {
          if (!moto_year_possibilities.includes(item.year))
            moto_year_possibilities.push(item.year);
        } else {
          moto_year_possibilities.push(item.year);
        }
      });

      console.log(moto_year_possibilities);
      console.log(filtered_moto_m_v);

      this.setState({ moto_year_possibilities, moto_cc_answer: val });
    }
  };

  renderMotoCc() {
    return this.state.moto_cc_possibilities.sort().map((element, index) => {
      return (
        <View key={index} style={styles.answerBoxes}>
          <TouchableWithoutFeedback
            onPress={() => {
              // console.log(element);
              this.handleMotoCcChange(element);
            }}
          >
            <View style={styles.checkboxesContainer}>
              <View
                style={[
                  styles.checkboxes,
                  {
                    // backgroundColor: this.props.checkboxColor
                    backgroundColor: "#F7F8F9"
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
                      opacity: this.state.moto_cc_answer == element ? 1 : 0
                    }
                  ]}
                />
              </View>
              <View style={{ height: 25 }} />
              <View
                style={{ justifyContent: "center", alignContent: "center" }}
              >
                <Text style={styles.checkboxesText}>
                  {element
                    .replace(/_/g, "-")
                    .replace("more", "≥")
                    .replace("less", "≤") == "≥-751cm3"
                    ? "≥751cm3"
                    : element
                        .replace(/_/g, "-")
                        .replace("more", "≥")
                        .replace("less", "≤")}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    });
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

  handleMotoYearChange = val => {
    // if (val == "2013-2019") val = "2007-2019"; // errore boella ?

    this.setState({
      moto_year: val
    });

    const filtered_moto_m_v = this.props.registerState.get_mobility_moto_values.filter(
      e => {
        return (
          e.year == val &&
          e.engine == this.props.registerState.moto_engine &&
          e.type == this.state.moto_cc_answer
        );
      }
    );

    console.log(filtered_moto_m_v);
    if (filtered_moto_m_v.length > 0)
      this.setState({ tapped: true }, () => {
        this.props.dispatch(
          UpdateProfile({
            data: {
              public_profile: {
                moto: filtered_moto_m_v[0].id,
                moto_owning_answer: this.state.moto_owning_answer
              }
            }
          })
        );
      });
    else
      this.props.dispatch(
        UpdateProfile({
          data: {
            public_profile: { moto: null, moto_owning_answer: 0 }
          }
        })
      );
  };

  renderModal() {
    const values = this.state.moto_year_possibilities.map((element, index) => (
      <PickerItem
        key={index}
        label={
          "" +
          element
            .replace("2007-2019", "2007-2012")
            .replace("2013-2019", strings("from_2013_onwar"))
            .replace("up_to_1999", strings("up_to_1999"))
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
            selectedValue={"" + this.state.moto_year}
            onValueChange={(itemValue, itemIndex) => {
              this.handleMotoYearChange(itemValue);
            }}
          >
            {values}
          </Picker>
          {this.renderButtonsModal()}
        </View>
      </Modal>
    );
  }

  renderMotoYear() {
    return (
      <View style={{ alignSelf: "center" }}>
        {this.renderModal()}
        <TouchableWithoutFeedback
          onPress={() => {
            console.log(this.state);
            if (
              this.state.moto_cc_answer != "" &&
              this.state.moto_cc_answer != undefined
            )
              this.setState({
                modal_visible: true,
                moto_year: this.state.moto_year_possibilities[0]
              });
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 4,
              width: 220,
              height: 50,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
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
              {this.state.moto_year
                ? this.state.moto_year
                    .replace("2007-2019", "2007-2012")
                    .replace("2013-2019", strings("from_2013_onwar"))
                    .replace("up_to_1999", strings("up_to_1999"))
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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.textSection}>{strings("do_you_have_a_m")}</Text>
        </View>
        <Image
          source={require("../../assets/images/wawe_mobility_habits_light_blue.png")}
          style={{
            height: 50,
            width: Dimensions.get("window").width
            // marginLeft: 50,
            // alignContent: "center"
          }}
          resizeMethod={"auto"}
        />
        <ScrollView contentContainerStyle={styles.bodyContainer}>
          {/* {this.renderSlider()} */}
          <View
            style={{
              // height: Dimensions.get("window").height * 0.6,
              backgroundColor: "transparent",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {/* {this.renderSlider()} */}
            <View
              style={{
                width: Dimensions.get("window").width * 0.9,
                height: Dimensions.get("window").height * 0.15
              }}
            >
              {this.renderMotoOwning()}
            </View>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.8,
              height: Dimensions.get("window").height * 0.1,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "flex-start",
              marginBottom: 10
            }}
          >
            <Text style={[styles.textSection, { color: "#3d3d3d" }]}>
              {strings("engine")}
            </Text>
          </View>
          <View
            style={{
              height: Dimensions.get("window").height * 0.15,
              width: Dimensions.get("window").width * 0.9,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center"
            }}
          >
            {this.renderMotoEngine()}
          </View>

          {this.state.moto_cc_possibilities.length > 0 ? (
            <View
              style={{
                width: Dimensions.get("window").width * 0.8,
                height: Dimensions.get("window").height * 0.2,
                justifyContent: "center",
                alignItems: "flex-start"
              }}
            >
              <Text style={[styles.textSection, { color: "#3d3d3d" }]}>
                {strings("cubic_capacity")}
              </Text>
            </View>
          ) : (
            <View />
          )}

          {this.state.moto_cc_possibilities.length > 0 ? (
            <View
              style={{
                height: Dimensions.get("window").height * 0.15,
                width: Dimensions.get("window").width * 0.7,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center"
              }}
            >
              {this.renderMotoCc()}
            </View>
          ) : (
            <View />
          )}

          {this.state.moto_year_possibilities[0] != "-" ? (
            <View
              style={{
                width: Dimensions.get("window").width * 0.8,
                height: Dimensions.get("window").height * 0.2,
                justifyContent: "center",
                alignItems: "flex-start"
              }}
            >
              <Text style={[styles.textSection, { color: "#3d3d3d" }]}>
                {strings("year_of_vehicle")}
              </Text>
              {this.renderMotoYear()}
            </View>
          ) : (
            <View />
          )}

          <View style={[styles.boxesContainer, { marginTop: 20 }]}>
            <View>
              <TouchableWithoutFeedback onPress={this.handleContinueTap}>
                <View style={styles.btnContainer}>
                  <Text style={styles.btnText}>{strings("save")}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </ScrollView>

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
          source={require("../../assets/images/moto_icn.png")}
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
    backgroundColor: "#5FC4E2",
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
    justifyContent: "flex-end",
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
    width: Dimensions.get("window").width * 0.2,
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
    backgroundColor: "#5FC4E2",
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
  notSelectableText: {
    fontFamily: "OpenSans-Regular",
    color: "#3d3d3d60",
    fontSize: 10,
    fontWeight: "400"
  },
  selectableText: {
    fontFamily: "OpenSans-Regular",
    color: "#3d3d3d",
    fontSize: 10,
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
  }
});

const withData = connect(state => {
  return {
    registerState: state.register,
    loginState: state.login
  };
});

export default withData(EditMotoSegmentScreen);
