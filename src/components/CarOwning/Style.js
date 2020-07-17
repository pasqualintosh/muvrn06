import { Dimensions, StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    height: 100,
    width: Dimensions.get("window").width * 0.8,
    alignSelf: "center",
    flexDirection: "row"
  },
  answerContainer: {
    height: 100,
    width: Dimensions.get("window").width * 0.5,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center"
  },
  yearContainer: {
    height: 100,
    width: Dimensions.get("window").width * 0.4,
    // backgroundColor: "#0000ff70",
    justifyContent: "center",
    alignItems: "center"
  },
  answerBoxes: {
    height: 20,
    width: Dimensions.get("window").width * 0.4,
    marginVertical: 5,
    marginHorizontal: 5
  },
  checkboxes: {
    height: 20,
    width: 20,
    backgroundColor: "#F7F8F9"
  },
  checkboxesText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 11,
    marginLeft: 6
  },
  checkboxesContainer: {
    height: 20,
    width: Dimensions.get("window").width * 0.4,
    flexDirection: "row"
  },
  yearLabel: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3d3d3d",
    fontSize: 13,
    marginLeft: 6
  },
  selectYearContainer: {
    height: 25,
    width: Dimensions.get("window").width * 0.2,
    backgroundColor: "#F7F8F9",
    justifyContent: "center",
    alignItems: "center"
  },
  yearText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 13
  }
});
