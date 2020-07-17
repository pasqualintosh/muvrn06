import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
  NativeModules
} from "react-native";
import { BoxShadow } from "react-native-shadow";

import { strings } from "../../config/i18n";

class GoOnButton extends React.Component {
  render() {
    let shadowOpt;
    if (Platform.OS == "ios") {
      shadowOpt = {
        width: Dimensions.get("window").width * 0.68,
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
          width: Dimensions.get("window").width * 0.68,
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
        width: Dimensions.get("window").width * 0.68,
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
      <View style={[styles.buttonContainer, this.props.topPosition]}>
        {/* <BoxShadow setting={shadowOpt} /> */}
        <TouchableWithoutFeedback
          onPress={() => this.props.handleNextTap()}
          disabled={this.props.status === "In register" ? true : false}
        >
          <View style={styles.buttonBox}>
            {this.props.status !== "In register" ? (
              <Text style={styles.buttonGoOnText}>
                {this.props.text ? this.props.text : strings("go_on")}
              </Text>
            ) : (
                <ActivityIndicator size="small" color="blue" />
              )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: Dimensions.get("window").width,
    height: 60,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    top:
      Platform.OS == "ios"
        ? Dimensions.get("window").height * 0.7
        : Dimensions.get("window").height * 0.65
    // shadowRadius: 2,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5
  },
  buttonBox: {
    width: Dimensions.get("window").width * 0.68,
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
    // shadowColor: "#000",
    // shadowOffset: { width: 3, height: 3 }
  },
  buttonGoOnText: {
    color: "#3363AD",
    fontFamily: "OpenSans-Regular",
    fontSize: 14
  }
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    buttonContainer: {
      width: Dimensions.get("window").width,
      height: 42,
      backgroundColor: "transparent",
      justifyContent: "flex-start",
      alignItems: "center",
      alignSelf: "center",
      position: "absolute",
      top:
        Platform.OS == "ios"
          ? Dimensions.get("window").height * 0.75
          : Dimensions.get("window").height * 0.65
      // shadowRadius: 2,
      // shadowColor: "#000",
      // shadowOffset: { width: 0, height: 2 },
      // shadowOpacity: 0.5
    },
    buttonBox: {
      width: Dimensions.get("window").width * 0.68,
      height: 28,
      backgroundColor: "#ffffff",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 14,
      shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1,
      // shadowColor: "#000",
      // shadowOffset: { width: 3, height: 3 }
    },
    buttonGoOnText: {
      color: "#3363AD",
      fontFamily: "OpenSans-Regular",
      fontSize: 14
    }
  });
}

export default GoOnButton;
