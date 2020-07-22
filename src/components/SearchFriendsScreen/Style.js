import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
  input: {
    width: Dimensions.get("window").width * 0.85,
    height: 44,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    // backgroundColor: "transparent",
    // opacity: 0.15,
    // borderRadius: 4
    borderColor: "#B9B9B9",
    borderWidth: 1,
    borderRadius: 10

    // marginVertical: 4
  },
  inputText: {
    // textDecorationColor: '#FFFFFF',
    color: "#707070",
    flex: 1,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    textAlign: "left",
    fontSize: 16,
    marginLeft: 10
  },
  backgroundImageAbsolute: {  height: 140,
    width: Dimensions.get("window").width,
    position: "absolute",
    top: 0},
  mainContainer: {
    flex: 1,
    backgroundColor: "#F7F8F9"
  },
  selectableHeader: {
    height: Dimensions.get("window").height * 0.06,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around"
  },
  notSelectable: {
    flex: 1,
    marginHorizontal: 6
  },
  selectable: {
    marginHorizontal: 6,
    borderBottomColor: "#9D9B9C",
    borderBottomWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: 35,
    width: Dimensions.get("window").width * 0.25
  },
  selectableTouchable: {
    justifyContent: "center",
    alignItems: "center"
  },
  selectableContainer: {
    height: 35,
    width: Dimensions.get("window").width * 0.2,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    width: Dimensions.get("window").width * 0.17,
    height: 30,
    borderRadius: 5,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1
  },
  selectableLabel: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3D3D3D",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center"
  },
  overlayWave: {
    height: 30,
    width: Dimensions.get("window").width,
    position: "absolute",
    top: 100
  },
  backgroundImage: {
    height: 130,
    width: Dimensions.get("window").width,
    position: "absolute",
    top: 40
  },
  backgroundView: {
    height: 130,
    width: Dimensions.get("window").width,

    top: 40
  },
  containerList: {},
  userContainer: {
    width: Dimensions.get("window").width,
    height: 100,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  firstUser: {
    position: "absolute"
    // top: Dimensions.get("window").height * 0.04 + 10
  },
  challengesList: {
    top: Dimensions.get("window").height * 0.04 + 85 - 30,
    height: Dimensions.get("window").height - 230 + 60
  },
  challengesListFollowers: {
    top: 0,
    height: Dimensions.get("window").height + 60
  }
});

export const negativeData = [
  {
    value: 2000
  },
  {
    value: 400
  },
  {
    value: 300
  },
  {
    value: 1500
  },
  {
    value: 700
  },
  {
    value: 1800
  }
];

export const positiveData = [
  {
    value: 1000
  },
  {
    value: 1200
  },
  {
    value: 1000
  },
  {
    value: 1000
  },
  {
    value: 1200
  }
];
