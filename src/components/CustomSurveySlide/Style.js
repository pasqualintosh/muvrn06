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
  headerText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 13,
    textAlign: "left",
    textAlignVertical: "center"
  },
  labelLevel: {
    color: "#3F3F3F",
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Montserrat-ExtraBold",
    top: 20
  },
  avatarImage: {
    // position: "absolute",
    width: 244,
    height: 350,
    alignSelf: "center"
  },
  titleContainer: {
    position: "absolute",
    top:
      Platform.OS === "ios"
        ? Dimensions.get("window").height * 0 + 18
        : Dimensions.get("window").height * 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.15,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  },
  titleIconContainer: {
    marginTop: 30
  },
  textTitle: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 17,
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
  endFlex: {
    width: Dimensions.get("window").width,
    height: 40,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  sideContainer: {
    // width: Dimensions.get("window").width * 0.33,
    width: Dimensions.get("window").width * 0.5,
    height: 40,
    // backgroundColor: "#6397CB",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  text: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#fff",
    fontSize: 10,
    marginVertical: 10
  },
  underline: {
    width: Dimensions.get("window").width * 0.25,
    height: 6,
    backgroundColor: "#FFFFFF"
    //marginVertical: 4
  },
  mainContainerHeader: {
    width: Dimensions.get("window").width,
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    titleContainer: {
      position: "absolute",
      top:
        Platform.OS === "ios"
          ? Dimensions.get("window").height * 0 + 6
          : Dimensions.get("window").height * 0,
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height * 0.15,
      backgroundColor: "transparent",
      justifyContent: "center",
      alignItems: "center"
    },
    titleIconContainer: {
      marginTop: 15
    },
    textTitle: {
      fontFamily: "OpenSans-Regular",
      fontWeight: "400",
      color: "#3d3d3d",
      fontSize: 13,
      marginVertical: 1,
      fontWeight: "bold"
    }
  });
}
