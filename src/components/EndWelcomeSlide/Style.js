import { StyleSheet, Dimensions, NativeModules, Platform } from "react-native";

const d = Dimensions.get("window");
const isX =
  Platform.OS === "ios" && (d.height > 800 || d.width > 800) ? true : false;

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: "#3d3d3d",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  overlayWave: {
    width: Dimensions.get("window").width,
    height: 100
  },
  textHeaderContainer: {
    width: 120,
    height: 60,
    backgroundColor: "transparent",
    position: "absolute",
    top: Dimensions.get("window").height * 0.08,
    left: 16
  },
  textHeader: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#fff",
    fontSize: 30,
    // marginVertical: 1
  },
  textFooterContainer: {
    width: 120,
    height: 60,
    backgroundColor: "transparent",
    position: "absolute",
    top: Dimensions.get("window").height * 0.6,
    right: 20
  },
  textFooter: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#fff",
    fontSize: 24,
    // marginVertical: 1,
    fontWeight: "bold"
  },
  logoFooterContainer: {
    width: 280,
    height: 180,
    // backgroundColor: "#e33",
    position: "absolute",
    top: Dimensions.get("window").height * 0.3 - 150,
    left: Dimensions.get("window").width * 0.5 - 140,
    justifyContent: "center",
    alignItems: "center"
    // right: 0
  },
  checkboxesContainer: {
    width: Dimensions.get("window").width,
    height: 160,
    backgroundColor: "transparent",
    position: "absolute",
    top: Dimensions.get("window").height * 0.65 - 20,
    // top: Dimensions.get("window").height * 0.55,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  checkboxContainer: {
    width: Dimensions.get("window").width * 0.7,
    height: 28,
    backgroundColor: "transparent",
    // marginVertical: 0
  },
  buttonContainer: {
    width: Dimensions.get("window").width,
    height: 45,
    backgroundColor: "transparent",
    position: "absolute",
    top: Dimensions.get("window").height * 0.75 + 40,
    justifyContent: "flex-start",
    alignItems: "center"
    // shadowRadius: 2,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5
  },
  buttonBox: {
    width: Dimensions.get("window").width * 0.68,
    height: 40,
    backgroundColor: "#ffffff80",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    elevation: 1
    // shadowColor: "#000",
    // shadowOffset: { width: 3, height: 3 }
  },
  buttonText: {
    color: "#3363AD",
    fontFamily: "OpenSans-Regular",
    fontSize: 14
  },
  modalContainer: {
    flex: 1,
    // marginTop: 22,
    backgroundColor: "#F7F8F9",
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.5
  },
  modalTitle: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3D3D3D",
    fontSize: 18,
    // marginVertical: 1,
    fontWeight: "bold",
    textAlign: "center",
    // marginVertical: 7,
    marginHorizontal: 20
  },
  modalParagraph: {
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D",
    fontSize: 12,
    // marginVertical: 1,
    textAlign: "left",
    // marginVertical: 7,
    marginHorizontal: 20
  },
  modalBold: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3D3D3D",
    fontSize: 14,
    // marginVertical: 1,
    fontWeight: "bold",
    textAlign: "left",
    // marginVertical: 7,
    marginHorizontal: 20
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
    // top: Dimensions.get("window").height * 0.8,
    top: Dimensions.get("window").height * 0.93 - 20 ,
    width: Dimensions.get("window").width * 0.8,
    height: 20,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row"
  }
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    textFooterContainer: {
      width: 120,
      height: 60,
      backgroundColor: "transparent",
      position: "absolute",
      top: Dimensions.get("window").height * 0.6,
      right: -5
    },
    textFooter: {
      fontFamily: "OpenSans-ExtraBold",
      color: "#fff",
      fontSize: 20,
      // marginVertical: 1,
      fontWeight: "bold"
    },
    textHeaderContainer: {
      width: 120,
      height: 60,
      backgroundColor: "transparent",
      position: "absolute",
      top: Dimensions.get("window").height * 0.08,
      left: 20
    },
    textHeader: {
      fontFamily: "Montserrat-ExtraBold",
      color: "#fff",
      fontSize: 20,
      // marginVertical: 1
    }
  });
}

export const positiveData = [
  {
    value: 6000
  },
  {
    value: 1200
  },
  {
    value: 1200
  },
  {
    value: 8000
  },
  {
    value: 10000
  },
  {
    value: 8000
  },
  {
    value: 3000
  },
  {
    value: 2000
  }
];

export const negativeData = [
  {
    value: -6000
  },
  {
    value: -4000
  },
  {
    value: -5000
  },
  {
    value: -2000
  },
  {
    value: -4000
  }
];
