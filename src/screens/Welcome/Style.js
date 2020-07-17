import { Platform, StyleSheet, Dimensions, NativeModules } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  linearGradient: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.5,
    position: "absolute",
    top: Dimensions.get("window").height * 0.5
  },
  overlayWave: {
    width: Dimensions.get("window").width,
    height: 100
  },
  greetingsContainer: {
    // backgroundColor: "#000",
    position: "absolute",
    top: Dimensions.get("window").height * 0.7,
    width: Dimensions.get("window").width * 0.8,
    height: 230,
    alignSelf: "center",
    alignItems: "center"
  },
  greetingsTitle: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#FFFFFF",
    fontSize: 18
  },
  textDescription: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#FFFFFF",
    fontSize: Platform.OS == "ios" ? 13 : 13,
    // marginVertical: 8,
    textAlign: "center"
  },
  linkContainer: {
    // backgroundColor: "#000",
    position: "absolute",
    top: Dimensions.get("window").height * 0.85,
    width: Dimensions.get("window").width * 0.8,
    height: 20,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  imageContainer: {
    backgroundColor: "transparent",
    position: "absolute",
    top: Dimensions.get("window").height * 0.25,
    width: 200,
    height: 300,
    alignSelf: "center",
    justifyContent: "center"
  },
  logoContainer: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.1,
    width: 150,
    height: 150,
    alignSelf: "center"
  },
  imageIpad: {}
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    logoContainer: {
      position: "absolute",
      top: Dimensions.get("window").height * 0.01,
      width: 150,
      height: 150,
      alignSelf: "center"
    },
    greetingsTitle: {
      fontFamily: "OpenSans-Regular",
      fontWeight: "400",
      color: "#FFFFFF",
      fontSize: 18
    },
    textDescription: {
      fontFamily: "OpenSans-Regular",
      fontWeight: "400",
      color: "#FFFFFF",
      fontSize: 10,
      // marginVertical: 2,
      textAlign: "center"
    },
    imageIpad: {
      width: 120,
      height: 180,
      alignSelf: "center"
    }
  });
}

export const negativeData = [
  {
    value: -5
  },
  {
    value: -3
  },
  {
    value: -4
  },
  {
    value: -3
  },
  {
    value: -3
  },
  {
    value: -4
  },
  {
    value: -4
  },
  {
    value: -2.5
  }
];
