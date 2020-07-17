import { Dimensions, StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  other: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderBottomColor: "#5F5F5F",
    borderBottomWidth: 0.3,
    backgroundColor: "#fff"
  },
  Right: {
    alignSelf: "center",
    marginHorizontal: 7,
    fontSize: 13,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D"
  },
  RightAndroid: {
    alignSelf: "center",
    right: 10
  },
  RightText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },

  modalContent: {
    height: 350,
    backgroundColor: "white",
    padding: 22,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContentAndroid: {
    width: 120,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  buttonConfermClick: {
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").height / 20,
    borderRadius: 5,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 2
  },
  buttonConfermWhite: {
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4
  },
  twoPoints: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 16,
    color: "#3D3D3D"
  },
  twoPointsContainer: {
    marginTop: Platform.OS == "ios" ? 78 : 30,
    width: 30,
    height: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  weekDayContainer: {
    height: 50,
    width: 250,
    backgroundColor: "#3e3"
  },
  pickerContainer: {
    height: 30,
    width: 250,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS == "ios" ? 40 : 40
  },
  weekDayContainer: {
    marginTop: 120,
    height: 40,
    width: 280,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonsContainer: {
    marginTop: 27,
    height: 50,
    width: 280,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  buttonContainer: {
    marginHorizontal: 9,
    height: 50
    // backgroundColor: "#ee333370"
  },
  textButton: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 12,
    color: "#459A36"
  }
});
