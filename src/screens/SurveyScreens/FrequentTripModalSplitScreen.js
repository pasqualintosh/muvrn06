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
  Image
} from "react-native";
import WavyArea from "./../../components/WavyArea/WavyArea";
import LinearGradient from "react-native-linear-gradient";
import { BoxShadow } from "react-native-shadow";
import Slider from "./../../components/Slider/Slider";
import { connect } from "react-redux";
import { updateState } from "./../../domains/register/ActionCreators";
import Emoji from "@ardentlabs/react-native-emoji";
import Icon from "react-native-vector-icons/Ionicons";
import round from "round";

import { strings } from "../../config/i18n";

class FrequentTripModalSplitScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [
        {
          label: "walk",
          value: 0
        },
        {
          label: "bike",
          value: 0
        },
        {
          label: "bus",
          value: 0
        },
        {
          label: "car",
          value: 0
        },
        {
          label: "motorbike",
          value: 0
        },
        {
          label: "train",
          value: 0
        }
      ],
      selected: false
    };
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    // console.log(
    //   this.props.registerState[
    //     strings("walking
    //       .toLocaleUpperCase()
    //       .toLocaleLowerCase()
    //       .replace(" (uber, etc…)", "")
    //       .replace(/\s/g, "_")
    //   ]
    // );
  }

  getImagePath = label => {
    switch (label) {
      case "walk":
        return require("../../assets/images/onboarding-walk.png");
      case "bike":
        return require("../../assets/images/onboarding-bike.png");
      case "bus":
        return require("../../assets/images/onboarding-bus.png");
      case "car":
        return require("../../assets/images/onboarding-car.png");
      case "motorbike":
        return require("../../assets/images/onboarding-moto.png");
      case "train":
        return require("../../assets/images/onboarding-train.png");
      case "car_pooling": // car_pooling dal 15/02/2019 diventa train
        return require("../../assets/images/carpooling_icn.png");
      default:
        return require("../../assets/images/onboarding-walk.png");
    }
  };

  getLabel = label => {
    switch (label) {
      case "walk":
        return strings("walking");
      case "bike":
        return strings("biking");
      case "bus":
        return strings("public_transpor");
      case "car":
        return strings("car");
      case "motorbike":
        return strings("motorbike");
      case "car_pooling":
        return strings("car_pooling");
      default:
        return strings("walking");
    }
  };

  getRenderLabel = label => {
    switch (label) {
      case "walk":
        return strings("walking");
      case "bike":
        return strings("bicycle");
      case "bus":
        return strings("local_public_tr");
      case "car":
        return strings("car");
      case "motorbike":
        return strings("motorbike");
      case "car_pooling":
        return strings("car_pooling");
      default:
        return strings("walking");
    }
  };

  checkLabelToRender(label) {
    // console.log(label);

    switch (label) {
      case "walk":
        if (
          this.props.registerState[
            strings("walking")
              .toLocaleUpperCase()
              .toLocaleLowerCase()
              .replace(" (uber, etc…)", "")
              .replace(/\s/g, "_")
          ] == true
        )
          return true;
        break;

      case "bike":
        if (
          this.props.registerState[
            strings("bicycle")
              .toLocaleUpperCase()
              .toLocaleLowerCase()
              .replace(" (uber, etc…)", "")
              .replace(/\s/g, "_")
          ] == true
        )
          return true;
        break;

      case "bus":
        if (
          this.props.registerState[
            strings("_320_local_public_tr")
              .toLocaleUpperCase()
              .toLocaleLowerCase()
              .replace(" (uber, etc…)", "")
              .replace(/\s/g, "_")
          ] == true
        )
          return true;
        break;

      case "car":
        if (
          this.props.registerState[
            strings("car")
              .toLocaleUpperCase()
              .toLocaleLowerCase()
              .replace(" (uber, etc…)", "")
              .replace(/\s/g, "_")
          ] == true ||
          this.props.registerState[
            strings("car_sharing")
              .toLocaleUpperCase()
              .toLocaleLowerCase()
              .replace(" (uber, etc…)", "")
              .replace(/\s/g, "_")
          ] == true ||
          this.props.registerState[
            strings("ride_sharing__u")
              .toLocaleUpperCase()
              .toLocaleLowerCase()
              .replace(" (uber, etc…)", "")
              .replace(/\s/g, "_")
          ] == true
        )
          return true;
        break;

      case "motorbike":
        if (
          this.props.registerState[
            strings("motorbike")
              .toLocaleUpperCase()
              .toLocaleLowerCase()
              .replace(" (uber, etc…)", "")
              .replace(/\s/g, "_")
          ] == true ||
          this.props.registerState[
            strings("motopooling")
              .toLocaleUpperCase()
              .toLocaleLowerCase()
              .replace(" (uber, etc…)", "")
              .replace(/\s/g, "_")
          ] == true
        )
          return true;
        break;

      case "car_pooling": // car_pooling dal 15/02/2019 diventa train
        if (
          this.props.registerState[
            strings("car_pooling")
              .toLocaleUpperCase()
              .toLocaleLowerCase()
              .replace(" (uber, etc…)", "")
              .replace(/\s/g, "_")
          ] == true
        )
          return true;
        break;

      case "train":
        if (
          this.props.registerState[
            strings("_321_train")
              .toLocaleUpperCase()
              .toLocaleLowerCase()
              .replace(" (uber, etc…)", "")
              .replace(/\s/g, "_")
          ] == true
        )
          return true;
        break;

      default:
        return false;
        break;
    }
  }

  renderSlider() {
    return this.state.values.map((item, index) => {
      // console.log(this.checkLabelToRender(this.state.values[index].label));
      // if (
      //   this.props.registerState[
      //     this.getRenderLabel(this.state.values[index].label)
      //       .toLocaleUpperCase()
      //       .toLocaleLowerCase()
      //       .replace(" (uber, etc…)", "")
      //       .replace(/\s/g, "_")
      //   ] == true
      // )
      if (this.checkLabelToRender(this.state.values[index].label))
        return (
          <View key={index} style={{ marginVertical: 8, flexDirection: "row" }}>
            <View style={{ flex: 0.3 }}>
              <Image
                style={{
                  width: 60,
                  height: 60
                }}
                source={this.getImagePath(this.state.values[index].label)}
              />
            </View>
            <View style={{ flex: 0.7, marginTop: 10 }}>
              <Slider
                value={this.state.values[index].value}
                onValueChange={value => {
                  let tot_value = 0;
                  this.state.values.forEach(el => (tot_value += el.value));

                  let k = 0;
                  for (let ind = 0; ind < 6; ind++) {
                    // non sempre devo decrementare tutto
                    if (ind != index && this.state.values[ind].value > 0) k++;
                  }

                  if (tot_value > 250) {
                    let v = this.state.values;
                    let diff_value = 10 / k;

                    for (ind = 0; ind < 6; ind++) {
                      if (ind == index) v[ind].value = Number.parseInt(value);
                      else if (v[ind].value > 0)
                        v[ind].value -= Number.parseInt(diff_value);
                    }

                    this.setState({ values: v, selected: true });
                  } else {
                    let v = this.state.values;
                    v[index].value = Number.parseInt(value);
                    this.setState({ values: v, selected: true });
                  }

                  tot_value = 0;
                  this.state.values.forEach(el => (tot_value += el.value));
                }}
                trackStyle={{ backgroundColor: "#fff", height: 2.5 }}
                // thumbImage={this.getImagePath(this.state.values[index].label)}
                style={{ height: 50 }}
                thumbStyle={{ height: 20, width: 20, borderRadius: 15 }}
                thumbTintColor={"#fff"}
                minimumTrackTintColor={"#fff"}
                minimumValue={0}
                maximumValue={100}
                step={10}
              />
            </View>
            {/* 
            <View
              style={{
                height: 10,
                width: Dimensions.get("window").width * 0.9,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Text style={styles.sliderSubText}>{strings("never")}</Text>
              <Text
                style={{
                  color: "#ffffff90",
                  fontFamily: "Montserrat-ExtraBold",
                  fontSize: 8
                }}
              >
                {this.getLabel(
                  this.state.values[index].label
                ).toLocaleUpperCase()}
              </Text>
              <Text style={styles.sliderSubText}>{strings("always")}</Text>
            </View> 
            */}
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
                {strings("_410_how_do_you_usua")}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: Dimensions.get("window").height - 230,
            width: Dimensions.get("window").width * 0.9,
            alignSelf: "center",
            justifyContent: "center"
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
                {strings("you_can_always_")}
              </Text>
            </View>

            <View style={[styles.buttonContainer]}>
              {/* <BoxShadow setting={shadowOpt} /> */}
              <TouchableWithoutFeedback
                onPress={() => {
                  this.state.values.forEach(e => {
                    console.log("val " + e.value);

                    let progress = 0;
                    if (e.value < 25) {
                      progress = 0;
                    } else {
                      progress = round(e.value, 25, "up");
                    }

                    console.log("prog " + progress);
                  });

                  this.props.dispatch(
                    updateState({
                      mostFrequentRaceModalSplit: this.state.values
                    })
                  );
                  if (this.state.selected)
                    if (
                      this.props.registerState[
                        strings("car").toLocaleLowerCase()
                      ] != undefined &&
                      this.props.registerState[
                        strings("car").toLocaleLowerCase()
                      ] == true
                    )
                      this.props.navigation.navigate("SurveyCarFuel");
                    else if (
                      this.props.registerState[
                        strings("motorbike").toLocaleLowerCase()
                      ] != undefined &&
                      this.props.registerState[
                        strings("motorbike").toLocaleLowerCase()
                      ] == true
                    )
                      this.props.navigation.navigate("SurveyMotoSegment");
                    else this.props.navigation.navigate("SurveyUserData");
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
  bottomOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    top: Dimensions.get("window").height * 0.8
  },
  backgroundImageWave: {
    height: 100,
    width: Dimensions.get("window").width,
    position: "absolute"
    // top: Dimensions.get("window").height * 0.04 + 14
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
  sliderSubText: {
    color: "#fff",
    fontFamily: "OpenSans-Regular",
    fontSize: 8
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

export default withData(FrequentTripModalSplitScreen);
