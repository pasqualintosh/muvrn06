import { Dimensions, StyleSheet, Platform, NativeModules } from "react-native";

export const negativeData = [
  {
    value: -6000
  },
  {
    value: 0
  },
  {
    value: -6000
  },
  {
    value: -12000
  },
  {
    value: -6000
  },
  {
    value: -3000
  },
  {
    value: -6000
  }
];

export const positiveData = [
  {
    value: 6000
  },
  {
    value: 0
  },
  {
    value: 6000
  },
  {
    value: 12000
  },
  {
    value: 6000
  },
  {
    value: 3000
  },
  {
    value: 6000
  }
];

export const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  titleContainer: {
    position: "absolute",
    top: 0,
    // top:
    //   Platform.OS === "ios"
    //     ? Dimensions.get("window").height * 0 + 18
    //     : Dimensions.get("window").height * 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.15,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  },
  titleIconContainer: {},
  textTitle: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 14,
    marginVertical: 1,
    fontWeight: "bold"
  },
  iconContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  contentContainer: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.15,
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").height * 0.8,
    backgroundColor: "transparent"
  },
  footerContainer: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.7,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.3,
    backgroundColor: "violet"
  },
  overlayWave: {
    width: Dimensions.get("window").width,
    height: 100
  },
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  buttonContainer: {
    width: Dimensions.get("window").width,
    height: 60,
    backgroundColor: "transparent",
    position: "absolute",
    bottom:
      Dimensions.get("window").height -
      Dimensions.get("window").height * 0.6 -
      180,
    justifyContent: "flex-start",
    alignItems: "center",
    shadowRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5
  },
  buttonBox: {
    width: Dimensions.get("window").width * 0.68,
    height: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 }
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
      height: 60,
      backgroundColor: "transparent",
      position: "absolute",
      bottom:
        Dimensions.get("window").height -
        Dimensions.get("window").height * 0.55 -
        180,
      justifyContent: "flex-start",
      alignItems: "center",
      shadowRadius: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5
    },
    buttonBox: {
      width: Dimensions.get("window").width * 0.68,
      height: 30,
      backgroundColor: "#ffffff",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 3,
      shadowColor: "#000",
      shadowOffset: { width: 3, height: 3 }
    },
    buttonGoOnText: {
      color: "#3363AD",
      fontFamily: "OpenSans-Regular",
      fontSize: 11
    }
  });
}
