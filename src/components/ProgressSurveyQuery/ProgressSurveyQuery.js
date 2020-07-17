import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  NativeModules,
  Dimensions
} from "react-native";
import AnimatedBar from "./../AnimatedBar/AnimatedBar";
import { BoxShadow } from "react-native-shadow";

class ProgressSurveyQuery extends React.Component {
  getImagePath = label => {
    switch (label) {
      case "walk":
        return (
          <Image
            source={require("../../assets/images/walk_ion_slider_cn.png")}
            style={{ width: 60, height: 60 }}
          />
        );
      case "bike":
        return (
          <Image
            source={require("../../assets/images/bike_icn.png")}
            style={{ width: 60, height: 60 }}
          />
        );
      case "bus":
        return (
          <Image
            source={require("../../assets/images/bus_icn.png")}
            style={{ width: 60, height: 60 }}
          />
        );
      case "car":
        return (
          <Image
            source={require("../../assets/images/car_icn.png")}
            style={{ width: 60, height: 60 }}
          />
        );
      case "motorbike":
        return (
          <Image
            source={require("../../assets/images/moto_icn.png")}
            style={{ width: 60, height: 60 }}
          />
        );
      case "carpooling":
        return (
          <Image
            source={require("../../assets/images/carpooling_icn.png")}
            style={{ width: 60, height: 60 }}
          />
        );
      default:
        return (
          <Image
            source={require("../../assets/images/walk_ion_slider_cn.png")}
            style={{ width: 60, height: 60 }}
          />
        );
    }
  };
  render() {
    const shadowOpt = {
      width: Dimensions.get("window").width * 0.6,
      height: 25,
      position: "absolute",
      bottom: 0,
      color: "#333",
      border: 3,
      radius: 1,
      opacity: 0.15,
      x: 0,
      y: 1,
      style: {
        marginBottom: 10
      }
    };
    return (
      <View style={[styles.mainContainer]}>
        <TouchableWithoutFeedback onPress={() => this.props.handleIconClick()}>
          <View style={styles.iconContainer}>
            {this.getImagePath(this.props.label)}
          </View>
        </TouchableWithoutFeedback>
        <View style={[styles.queryContainer]}>
          <BoxShadow setting={shadowOpt} />
          <AnimatedBar {...this.props} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: { flexDirection: "row", height: 35, marginVertical: 7 },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 0.2,
    height: 35
  },
  queryContainer: {
    flex: 0.8,
    height: 35,
    alignItems: "center",
    justifyContent: "center"
  }
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    mainContainer: { flexDirection: "row", height: 20, marginVertical: 7 },
    iconContainer: {
      alignItems: "center",
      justifyContent: "center",
      flex: 0.2,
      height: 20
    },
    queryContainer: {
      flex: 0.8,
      height: 20,
      alignItems: "center",
      justifyContent: "center"
    }
  });
}

export default ProgressSurveyQuery;
