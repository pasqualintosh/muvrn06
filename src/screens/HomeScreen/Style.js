import { StyleSheet, Dimensions, Platform, NativeModules } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: { backgroundColor: "#fff", flex: 1 },
  gradientContainer: {
    zIndex: -2,
    position: "absolute",
    top: 0,
    width: Dimensions.get("window").width,
    height:
      Platform.OS === "ios"
        ? Dimensions.get("window").height * 0.25 + 86
        : Dimensions.get("window").height * 0.25 +
          Dimensions.get("window").height * 0.1
  },
  gradientContainerResult: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.25,
    backgroundColor: "transparent",
    top: 0
  },
  gradientContainerCurve: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.1,
    backgroundColor: "transparent",
    top: Dimensions.get("window").height * 0.25
  },
  gradientContainerImageSun: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.1,
    backgroundColor: "#fff",
    top:
      Platform.OS === "ios"
        ? Dimensions.get("window").height * 0.25 + 86
        : Dimensions.get("window").height * 0.25 +
          Dimensions.get("window").height * 0.1
  },
  gradientContainerImageBicycle: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    backgroundColor: "#fff",
    top: Dimensions.get("window").height * 0.45
  },
  gradientContainerListActivity: {
    position: "absolute",
    zIndex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    top: Dimensions.get("window").height * 0.3
  },
  gradientContainerTextContainer: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.25,
    backgroundColor: "#fff",
    top: Dimensions.get("window").height * 0.65
  },
  sunContainer: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "transparent"
  },
  sunImage: {
    width: 40,
    height: 40,
    alignSelf: "center"
  },
  bicycleImage: {
    flex: 1,
    position: "absolute",
    // top: 250,
    width: 130,
    height: 130,
    alignSelf: "center"
  },
  textTitle: {
    marginTop: 0,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    textAlign: "center",
    fontSize: 15,
    color: "#9D9B9C"
  },
  textSubTitle: {
    marginTop: 0,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    textAlign: "center",
    fontSize: 10,
    color: "#9D9B9C",
    marginHorizontal: 18
  }
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    gradientContainerImageSun: {
      position: "absolute",
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height * 0.1,
      backgroundColor: "#fff",
      top:
        Platform.OS === "ios"
          ? Dimensions.get("window").height * 0.25 + 76
          : Dimensions.get("window").height * 0.25 +
            Dimensions.get("window").height * 0.1
    },
    sunImage: {
      width: 25,
      height: 25,
      alignSelf: "center"
    },
    bicycleImage: {
      flex: 1,
      position: "absolute",
      // top: 250,
      width: 80,
      height: 80,
      alignSelf: "center"
    },
    gradientContainerTextContainer: {
      position: "absolute",
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height * 0.25,
      backgroundColor: "#fff",
      top: Dimensions.get("window").height * 0.6
    },
    textTitle: {
      marginTop: 0,
      fontFamily: "OpenSans-Regular",
      fontWeight: "400",
      textAlign: "center",
      fontSize: 12,
      color: "#9D9B9C"
    },
    textSubTitle: {
      marginTop: 0,
      fontFamily: "OpenSans-Regular",
      fontWeight: "400",
      textAlign: "center",
      fontSize: 8,
      color: "#9D9B9C",
      marginHorizontal: 8
    }
  });
}
