import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F7F8F9"
  },
  userPositionContainer: {
    // flex: 0.5,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexDirection: 'row'
  },
  userPosition: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#FFFFFF",
    fontSize: 11
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
  selectableLabel: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3D3D3D",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center"
  },
  overlayWave: {
    height: 130,
    width: Dimensions.get("window").width,
    position: "absolute"
    // top: Dimensions.get("window").height * 0.04 + 14
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
    height: Dimensions.get("window").height - 230 + 90
  }
});

export const negativeData = [
  {
    value: -1000
  },
  {
    value: -1200
  },
  {
    value: -1000
  },
  {
    value: -1000
  },
  {
    value: -1200
  },
  {
    value: -1000
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
