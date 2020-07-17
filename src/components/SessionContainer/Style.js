import { StyleSheet, Dimensions, NativeModules } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    width: Dimensions.get("window").width * 0.9,
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "flex-start"
  },
  sessionContainer: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "column",
    backgroundColor: "#F7F8F9",
    borderRadius: 5
  },
  sessionIcon: {
    width: Dimensions.get("window").width * 0.2,
    height: Dimensions.get("window").height * 0.1,
    // backgroundColor: "#ee333370",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  },
  sessionEvent: {
    width: Dimensions.get("window").width * 0.2,
    // backgroundColor: "#ee333370",

    justifyContent: "center",
    alignItems: "center"
  },
  sessionIconEvent: {
    width: Dimensions.get("window").width * 0.1 + 10,
    height: 30,
    borderRadius: 4,

    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center"
  },
  sessionText: {
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").height * 0.1,
    // backgroundColor: "#33ee3370",
    justifyContent: "center"
  },
  sessionDescription: {
    flex: 1,
    height: Dimensions.get("window").height * 0.2,

    // backgroundColor: "#33ee3370",
    alignItems: "flex-end",
    justifyContent: "space-around",
    flex: 1
  },
  sessionCompleted: {
    width: Dimensions.get("window").width * 0.2,
    height: Dimensions.get("window").height * 0.1,
    // backgroundColor: "#3333ee70",
    justifyContent: "center",
    alignItems: "center"
  },
  headerBox: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  descriptionBox: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.2,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "transparent"
    // backgroundColor: "#00000080"
  },
  icon: {
    width: 37.5,
    height: 47.5
    // backgroundColor: "#00000050"
  },
  titleSession: {
    color: "#3D3D3D",
    // fontSize: 15,
    textAlign: "left",
    fontWeight: "bold",
    fontFamily: "OpenSans-Regular"
    // alignSelf: "flex-end",
    // marginRight: 25
  },
  coinSession: {
    color: "#3D3D3D",
    // fontSize: 15,
    // backgroundColor: "#00000050",
    // fontWeight: "bold",
    textAlign: "right",

    fontFamily: "Montserrat-ExtraBold"
  },
  coinView: {
    width: Dimensions.get("window").width * 0.85,
    flex: 1,
    flexDirection: "row",

    justifyContent: "center",

    alignSelf: "center",
    alignContent: "center",
    alignItems: "center"
  },
  trainingSession: {
    color: "#9D9B9C",
    fontSize: 11,
    textAlign: "left",
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    marginVertical: 3
  },
  completedStats: {
    color: "#9D9B9C",
    fontSize: 12,
    textAlign: "left",
    fontWeight: "400",
    fontFamily: "OpenSans-Regular"
  }
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    trainingSession: {
      color: "#9D9B9C",
      fontSize: 8,
      textAlign: "left",
      fontWeight: "400",
      fontFamily: "OpenSans-Regular",
      marginVertical: 3
    }
  });
}
