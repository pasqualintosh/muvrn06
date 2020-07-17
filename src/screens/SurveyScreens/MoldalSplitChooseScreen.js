import React from "react";
import {
  View,
  Image,
  Text,
  Alert,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Platform,
  NativeModules,
  TouchableWithoutFeedback,
  StatusBar
} from "react-native";
import WavyArea from "./../../components/WavyArea/WavyArea";
import LinearGradient from "react-native-linear-gradient";
import { BoxShadow } from "react-native-shadow";
import Slider from "./../../components/Slider/Slider";
import { connect } from "react-redux";
import { updateState } from "./../../domains/register/ActionCreators";
import Emoji from "@ardentlabs/react-native-emoji";
import Icon from "react-native-vector-icons/Ionicons";
import TransportModes from "./../../components/TransportModes/TransportModes";
import OnboardingMode from "./../../components/OnboardingMode/OnboardingMode";

import { strings } from "../../config/i18n";

class ModalSplitScreenChoose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      touched: false,
      tap_counter: 0
    };
  }

  static navigationOptions = {
    header: null
  };

  getImagePath = label => {
    switch (label) {
      case "walk":
        return require("../../assets/images/walk_ion_slider_cn.png");
      case "bike":
        return require("../../assets/images/bike_icn.png");
      case "bus":
        return require("../../assets/images/bus_icn.png");
      case "car":
        return require("../../assets/images/car_icn.png");
      case "motorbike":
        return require("../../assets/images/moto_icn.png");
      case "car_pooling":
        return require("../../assets/images/carpooling_icn.png");
      default:
        return require("../../assets/images/walk_ion_slider_cn.png");
    }
  };

  getLabel = label => {
    switch (label) {
      case "walk":
        return "walking";
      case "bike":
        return "biking";
      case "bus":
        return "public transportation";
      case "car":
        return "car";
      case "motorbike":
        return "motorcycle";
      case "car_pooling":
        return "carpooling";
      default:
        return "walking";
    }
  };

  clickModes = (mode, value) => {
    let tap_counter = this.state.tap_counter;
    mode = mode
      .toLocaleLowerCase()
      .replace(" (uber, etc…)", "")
      .replace(/\s/g, "_");
    this.setState({
      [mode]: value,
      touched: true,
      tap_counter: value ? tap_counter + 1 : tap_counter - 1
    });
  };

  renderSlider() {
    return this.state.values.map((item, index) => (
      <View key={index}>
        <View>
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

              if (tot_value > 300) {
                let v = this.state.values;
                let diff_value = 10 / k;

                for (ind = 0; ind < 6; ind++) {
                  if (ind == index) v[ind].value = value;
                  else if (v[ind].value > 0) v[ind].value -= diff_value;
                }

                this.setState({ values: v, touched: true });
              } else {
                let v = this.state.values;
                v[index].value = value;
                this.setState({ values: v, touched: true });
              }

              tot_value = 0;
              this.state.values.forEach(el => (tot_value += el.value));
            }}
            trackStyle={{ backgroundColor: "#fff", height: 5 }}
            thumbImage={this.getImagePath(this.state.values[index].label)}
            style={{ height: 50 }}
            thumbStyle={{ height: 40, width: 40, borderRadius: 25 }}
            thumbTintColor={"#fff"}
            minimumTrackTintColor={"#fff"}
            minimumValue={0}
            maximumValue={100}
            step={10}
          />
        </View>
        <View
          style={{
            height: 10,
            width: Dimensions.get("window").width * 0.9,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Text style={styles.sliderSubText}>Never</Text>
          <Text
            style={{
              color: "#ffffff90",
              fontFamily: "Montserrat-ExtraBold",
              fontSize: 8
            }}
          >
            {this.getLabel(this.state.values[index].label).toLocaleUpperCase()}
          </Text>
          <Text style={styles.sliderSubText}>Always</Text>
        </View>
      </View>
    ));
  }

  modes = () => {
    return (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          height: Dimensions.get("window").height - 230
        }}
      >
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TransportModes
            title={strings("walking").toLocaleUpperCase()}
            label={strings("walking").toLocaleUpperCase()}
            img={require("../../assets/images/walk_ion_slider_cn.png")}
            clickModes={this.clickModes}
          />
          <TransportModes
            title={strings("bicycle").toLocaleUpperCase()}
            label={strings("bicycle").toLocaleUpperCase()}
            img={require("../../assets/images/bike_icn.png")}
            clickModes={this.clickModes}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TransportModes
            title={strings("local_public_tr").toLocaleUpperCase()}
            label={strings("local_public_tr").toLocaleUpperCase()}
            img={require("../../assets/images/bus_icn.png")}
            clickModes={this.clickModes}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TransportModes
            title={strings("bike_sharing").toLocaleUpperCase()}
            label={strings("bike_sharing").toLocaleUpperCase()}
            img={require("../../assets/images/bike_sharing_icn.png")}
            clickModes={this.clickModes}
          />
          <TransportModes
            title={strings("car_sharing").toLocaleUpperCase()}
            label={strings("car_sharing").toLocaleUpperCase()}
            img={require("../../assets/images/car_sharing_icn.png")}
            clickModes={this.clickModes}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TransportModes
            title={strings("train").toLocaleUpperCase()}
            label={strings("train").toLocaleUpperCase()}
            img={require("../../assets/images/train_icn.png")}
            clickModes={this.clickModes}
          />
          <TransportModes
            title={strings("ride_sharing__u").toLocaleUpperCase()}
            label={strings("ride_sharing__u").toLocaleUpperCase()}
            img={require("../../assets/images/ride_sharing_icn.png")}
            clickModes={this.clickModes}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TransportModes
            title={strings("car_pooling").toLocaleUpperCase()}
            label={strings("car_pooling").toLocaleUpperCase()}
            img={require("../../assets/images/carpooling_icn.png")}
            clickModes={this.clickModes}
          />
          <TransportModes
            title={strings("car").toLocaleUpperCase()}
            label={strings("car").toLocaleUpperCase()}
            img={require("../../assets/images/car_icn.png")}
            clickModes={this.clickModes}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TransportModes
            title={strings("motorbike").toLocaleUpperCase()}
            label={strings("motorbike").toLocaleUpperCase()}
            img={require("../../assets/images/moto_icn.png")}
            clickModes={this.clickModes}
          />
          <TransportModes
            title={strings("motopooling").toLocaleUpperCase()}
            label={strings("motopooling").toLocaleUpperCase()}
            img={require("../../assets/images/motopooling_icn.png")}
            clickModes={this.clickModes}
          />
        </View>
      </View>
    );
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
                {strings("choose_your_tra")}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: Dimensions.get("window").height - 230,
            width: Dimensions.get("window").width * 0.9,
            alignSelf: "center",
            justifyContent: "space-around",
            alignItems: "center"
          }}
        >
          <OnboardingMode
            sourceTxt={strings("walking").toLocaleUpperCase()}
            sourceImg={require("./../../assets/images/onboarding-walk.png")}
            clickModes={this.clickModes}
          />
          <OnboardingMode
            sourceTxt={strings("bicycle").toLocaleUpperCase()}
            sourceImg={require("./../../assets/images/onboarding-bike.png")}
            clickModes={this.clickModes}
          />
          <OnboardingMode
            sourceTxt={strings("_320_local_public_tr").toLocaleUpperCase()}
            sourceImg={require("./../../assets/images/onboarding-bus.png")}
            clickModes={this.clickModes}
          />
          <OnboardingMode
            sourceTxt={strings("_321_train").toLocaleUpperCase()}
            sourceImg={require("./../../assets/images/onboarding-train.png")}
            clickModes={this.clickModes}
          />
          <OnboardingMode
            sourceTxt={strings("car").toLocaleUpperCase()}
            sourceImg={require("./../../assets/images/onboarding-car.png")}
            clickModes={this.clickModes}
          />
          <OnboardingMode
            sourceTxt={strings("motorbike").toLocaleUpperCase()}
            sourceImg={require("./../../assets/images/onboarding-moto.png")}
            clickModes={this.clickModes}
          />
          {/* {this.modes()} */}
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
                {strings("select_the_mode")}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              {/* <BoxShadow setting={shadowOpt} /> */}
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.dispatch(updateState({ ...this.state }));
                  if (this.state.tap_counter > 0) {
                    // this.props.navigation.navigate("SurveyFrequentTripType");
                    // this.props.navigation.navigate("SurveyFrequentTrip");
                    // this.props.navigation.navigate("SurveyUserData");
                    this.props.navigation.navigate("SurveyAvatar");
                  } else {
                    Alert.alert("Oops", strings("seems_like_you_"));
                  }
                }}
              >
                <View style={styles.buttonBox}>
                  <Text style={styles.buttonGoOnText}>{strings("go_on")}</Text>
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
  backgroundImageWave: {
    height: 100,
    width: Dimensions.get("window").width,
    position: "absolute"
    // top: Dimensions.get("window").height * 0.04 + 14
  },
  backgroundImageWaveDown: {
    height: 130,
    width: Dimensions.get("window").width,
    position: "absolute",
    bottom: 0
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
  },
  buttonTypeText: {
    color: "#3D3D3D",
    fontFamily: "OpenSans-Regular",
    fontSize: 14
  },
  buttonsContainer: {
    top: 75,
    height: 50,
    width: 280,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
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

export default withData(ModalSplitScreenChoose);
