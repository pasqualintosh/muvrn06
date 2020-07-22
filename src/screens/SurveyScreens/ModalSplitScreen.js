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

import { strings } from "../../config/i18n";

class ModalSplitSceen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [
        {
          label: "walk",
          value: 50
        },
        {
          label: "bike",
          value: 50
        },
        {
          label: "bus",
          value: 50
        },
        {
          label: "car",
          value: 50
        },
        {
          label: "motorbike",
          value: 50
        },
        {
          label: "car_pooling",
          value: 50
        }
      ],
      touched: false
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
              What are your mobility habits? <Emoji name="bike" />{" "}
              <Emoji name="car" /> <Emoji name="bus" />
            </Text>
          </View>
        </View>
        <View
          style={{
            height: Dimensions.get("window").height * 0.6,
            width: Dimensions.get("window").width * 0.9,
            alignSelf: "center"
          }}
        >
          {this.renderSlider()}
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
              top: 50
            }}
          >
            <View style={styles.textFooterContainer}>
              <Text style={styles.textFooter}>
                This information is important to identify your mobility skills.
              </Text>
            </View>

            <View style={[styles.buttonContainer]}>
              {/* <BoxShadow setting={shadowOpt} /> */}
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.dispatch(
                    updateState({ generalModalSplit: this.state.values })
                  );
                  if (this.state.touched)
                    this.props.navigation.navigate("SurveyFrequentTripType");
                  else {
                    Alert.alert(strings("id_0_10"), strings("id_0_46"));
                  }
                }}
              >
                <View style={[styles.buttonBox]}>
                  <Text style={styles.buttonGoOnText}>{strings("id_0_15")}</Text>
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

export default withData(ModalSplitSceen);
