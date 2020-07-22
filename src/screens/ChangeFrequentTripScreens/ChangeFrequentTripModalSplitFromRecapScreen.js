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
import { postMostFrequentRoute } from "./../../domains/login/ActionCreators";
import Emoji from "@ardentlabs/react-native-emoji";
import Icon from "react-native-vector-icons/Ionicons";

import { strings } from "../../config/i18n";

class ChangeFrequentTripModalSplitFromRecapScreen extends React.Component {
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
        // {
        //   label: "car_pooling",
        //   value: 0
        // }
      ],
      selected: false
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          Frequent Trip
        </Text>
      )
    };
  };

  componentDidMount() {}

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
      case "train":
        return strings("train");
      default:
        return "walking";
    }
  };

  renderSlider() {
    return this.state.values.map((item, index) => (
      <View key={index} style={{ flexDirection: "row" }}>
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

              if (tot_value > 300) {
                let v = this.state.values;
                let diff_value = 10 / k;

                for (ind = 0; ind < 6; ind++) {
                  if (ind == index) v[ind].value = value;
                  else if (v[ind].value > 0) v[ind].value -= diff_value;
                }

                this.setState({ values: v, selected: true });
              } else {
                let v = this.state.values;
                v[index].value = value;
                this.setState({ values: v, selected: true });
              }

              tot_value = 0;
              this.state.values.forEach(el => (tot_value += el.value));
            }}
            trackStyle={{ backgroundColor: "#3d3d3d", height: 2.5 }}
            // thumbImage={this.getImagePath(this.state.values[index].label)}
            style={{ height: 40 }}
            thumbStyle={{ height: 20, width: 20, borderRadius: 15 }}
            thumbTintColor={"#3d3d3d"}
            minimumTrackTintColor={"#3d3d3d"}
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
              color: "#3d3d3d",
              fontFamily: "Montserrat-ExtraBold",
              fontSize: 8
            }}
          >
            {this.getLabel(this.state.values[index].label).toLocaleUpperCase()}
          </Text>
          <Text style={styles.sliderSubText}>{strings("always")}</Text>
        </View> 
        */}
      </View>
    ));
  }

  render() {
    let shadowOpt;
    if (Platform.OS == "ios") {
      shadowOpt = {
        width: Dimensions.get("window").width * 0.4,
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
          width: Dimensions.get("window").width * 0.4,
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
        width: Dimensions.get("window").width * 0.4,
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
        source={require("./../../assets/images/bg-login.png")}
        style={styles.backgroundImage}
      >
        <View
          style={{
            height: Platform.OS == "ios" ? 80 : 80,
            backgroundColor: "transparent"
          }}
        >
          <View style={styles.textHeaderContainer}>
            <Text style={styles.textHeader}>{strings("finally__please")}</Text>
          </View>
        </View>
        <View
          style={{
            height:
              Platform.OS == "ios"
                ? Dimensions.get("window").height * 0.8 - 80
                : Dimensions.get("window").height * 0.8 - 120,
            width: Dimensions.get("window").width * 0.9,
            alignSelf: "center",
            justifyContent: "space-around"
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
              marginTop: Platform.OS == "ios" ? 15 : 15
            }}
          >
            {/* 
            <View style={styles.textFooterContainer}>
              <Text style={styles.textFooter}>
                This information is crucial to discover your MUV potential.
              </Text>
            </View> 
            */}

            <View style={[styles.buttonContainer]}>
              <BoxShadow setting={shadowOpt} />
              <TouchableWithoutFeedback
                onPress={() => {
                  if (this.state.selected) {
                    this.props.dispatch(
                      updateState({
                        mostFrequentRaceModalSplit: this.state.values
                      })
                    );

                    setTimeout(() => {
                      // this.props.dispatch(postMostFrequentRoute({}, true));

                      this.props.navigation.navigate("FeedRecapScreen");
                    }, 800);
                  } else Alert.alert("Oops", strings("id_0_46"));
                }}
              >
                <View style={[styles.buttonBox]}>
                  <Text style={styles.buttonGoOnText}>{strings("id_0_12")}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

// onPress={() => {
//   if (this.state.selected) {
//     this.props.dispatch(
//       updateState({
//         mostFrequentRaceModalSplit: this.state.values
//       })
//     );

//     setTimeout(() => {
//       this.props.dispatch(postMostFrequentRoute());
//       this.props.navigation.navigate("PersonalDataScreen");
//     }, 800);
//   } else
//     Alert.alert(
//       "Oops",
//       "Seems like you forgot something, complete it"
//     );
// }}

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
    marginTop: Platform.OS == "ios" ? 15 : 15,
    flexDirection: "row",
    width: Dimensions.get("window").width * 0.85,
    alignItems: "center",
    alignSelf: "center"
  },
  textHeader: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3d3d3d",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center"
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
    color: "#3d3d3d",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "left"
  },
  buttonContainer: {
    width: Dimensions.get("window").width * 0.4,
    height: 60,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center"
  },
  buttonBox: {
    width: Dimensions.get("window").width * 0.4,
    height: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3
  },
  buttonGoOnText: {
    color: "#3363AD",
    fontFamily: "OpenSans-Regular",
    fontSize: 14
  },
  sliderSubText: {
    color: "#3d3d3d",
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

export default withData(ChangeFrequentTripModalSplitFromRecapScreen);
