import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Platform,
  NativeModules,
  Alert,
  TouchableWithoutFeedback
} from "react-native";
import WavyArea from "./../../components/WavyArea/WavyArea";
import LinearGradient from "react-native-linear-gradient";
import { BoxShadow } from "react-native-shadow";
import Slider from "./../../components/Slider/Slider";
import { connect } from "react-redux";
import { updateState } from "./../../domains/register/ActionCreators";
import round from "round";
import Icon from "react-native-vector-icons/Ionicons";

import { strings } from "../../config/i18n";

class MotoCcScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      value: 0.0
    };
  }

  static navigationOptions = {
    header: null
  };

  componentWillMount() {
    const filtered_moto_m_v = this.props.registerState.get_mobility_moto_values.filter(
      e => {
        return (
          e.year == this.props.registerState.moto_year &&
          e.engine == this.props.registerState.moto_engine_answer
        );
      }
    );
    let moto_cc_possibilities = [];
    filtered_moto_m_v.forEach((item, index) => {
      if (moto_cc_possibilities.length > 0) {
        if (!moto_cc_possibilities.includes(item.type))
          moto_cc_possibilities.push(item.type);
      } else {
        moto_cc_possibilities.push(item.type);
      }
    });
    this.setState({ moto_cc_possibilities, moto_cc_answer: "" });
    if (moto_cc_possibilities.length == 1) {
      this.handleMotoCCChange(moto_cc_possibilities[0]);
      this.props.navigation.navigate("SurveyUserData");
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

  handleMotoCCChange = val => {
    if (this.props.registerState.moto_engine_answer != 0) {
      const filtered_moto_m_v = this.props.registerState.get_mobility_moto_values.filter(
        e => {
          return (
            e.year == this.props.registerState.moto_year &&
            e.engine == this.props.registerState.moto_engine_answer &&
            e.type == val
          );
        }
      );

      // console.log(filtered_moto_m_v);

      if (this.props.registerState.moto_engine_answer != "") {
        this.setState(
          {
            moto_id:
              filtered_moto_m_v.length > 0 ? filtered_moto_m_v[0].id : null,
            moto_cc_answer: val
          },
          () => {
            this.props.dispatch(updateState({ moto: this.state.moto_id }));
          }
        );
      }
    }
  };

  showAlert = () => {
    Alert.alert("Oops", strings("seems_like_you_"));
  };

  renderNotSelectableMotoCc() {
    let notSelectableCc = this.arr_diff(
      this.state.all_moto_cc_possibilities,
      this.state.moto_cc_possibilities
    );

    return notSelectableCc
      .filter(e => {
        return e != "clone";
      })
      .map(e => (
        <Text key={e} style={styles.notSelectableText}>
          {e.replace(/_/g, " ")}
        </Text>
      ));
  }

  renderSelectableMotoCc() {
    return this.state.moto_cc_possibilities.map(e => (
      <Text key={e} style={styles.selectableText}>
        {e.replace(/_/g, " ")}
      </Text>
    ));
  }

  renderSlider() {
    return (
      <View
        style={{
          // backgroundColor: "#ee333370",
          height: Dimensions.get("window").height * 0.6,
          width: Dimensions.get("window").width * 0.8,
          alignSelf: "center"
        }}
      >
        <View
          style={{
            marginTop: Platform.OS == "ios" ? 0 : 10,
            height: Dimensions.get("window").height * 0.5,
            width: Dimensions.get("window").width * 0.2,
            // backgroundColor: "#3333ee70",
            justifyContent: "space-between",
            alignSelf: "flex-end"
          }}
        >
          {this.renderSelectableMotoCc()}
          {this.renderNotSelectableMotoCc()}
        </View>

        <View
          style={{
            marginTop:
              Platform.OS == "ios"
                ? -Dimensions.get("window").width * 0.545
                : -Dimensions.get("window").width * 0.5,
            marginLeft: Platform.OS == "ios" ? 0 : -20,
            transform: [{ rotate: "90deg" }],
            width: Dimensions.get("window").height * 0.5,
            height: Dimensions.get("window").width * 0.2,
            // backgroundColor: "#33ee3370",
            justifyContent: "center",
            alignSelf: "center"
          }}
        >
          <Slider
            value={this.state.value}
            onValueChange={value => {
              this.setState({ value });
            }}
            onSlidingComplete={value => {
              if (
                !this.state.moto_cc_possibilities.includes(
                  this.buildCcFromValue(value)
                )
              ) {
                this.setState({
                  value:
                    0.25 *
                    (this.state.moto_cc_possibilities.length > 0
                      ? this.state.moto_cc_possibilities.length - 1
                      : this.state.moto_cc_possibilities.length)
                });
              } else {
                this.handleMotoCCChange(this.buildCcFromValue(value));
              }
            }}
            style={{}}
            trackStyle={{ backgroundColor: "#fff", height: 5 }}
            thumbImage={require("../../assets/images/moto_icn.png")}
            style={{ height: 50 }}
            thumbStyle={{
              height: 40,
              width: 40,
              borderRadius: 25,
              transform: [{ rotate: "90deg" }]
            }}
            thumbTintColor={"#fff"}
            minimumTrackTintColor={"#fff"}
            orientation={"vertical"}
          />
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
                What's the cubic capacity of your moto?
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: Dimensions.get("window").height - 230,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          {this.renderSlider()}
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
                We need this information to estimate your CO2 emissions. You can
                always change it in the Profile section.
              </Text>
            </View>

            <View style={[styles.buttonContainer]}>
              {/* <BoxShadow setting={shadowOpt} /> */}
              <TouchableWithoutFeedback
                onPress={() => {
                  if (
                    this.props.registerState.moto != undefined &&
                    this.props.registerState.moto != null
                  )
                    this.props.navigation.navigate("SurveyUserData");
                  else Alert.alert("Oops", strings("seems_like_you_"));
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
  notSelectableText: {
    fontFamily: "OpenSans-Regular",
    color: "#9D9B9C",
    fontSize: 10,
    fontWeight: "400"
  },
  selectableText: {
    fontFamily: "OpenSans-Regular",
    color: "#fff",
    fontSize: 10,
    fontWeight: "400"
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

export default withData(MotoCcScreen);
