import { Dimensions, StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    height: 140,
    width: Dimensions.get("window").width * 0.8,
    alignSelf: "center",
    marginTop: 30
  },
  headerContainer: {
    height: 20,
    width: Dimensions.get("window").width * 0.8,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  mainContainer: {
    height: 120,
    width: Dimensions.get("window").width * 0.8,
    alignSelf: "center",
    flexDirection: "row"
  },
  answerContainer: {
    height: 120,
    width: Dimensions.get("window").width * 0.5,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center"
  },
  yearContainer: {
    height: 120,
    width: Dimensions.get("window").width * 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  answerBoxes: {
    height: 40,
    width: Dimensions.get("window").width * 0.3,
    // marginVertical: 5,
    marginHorizontal: 5
  },
  checkboxes: {
    height: 20,
    width: 20,
    backgroundColor: "#fff"
  },
  checkboxesText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 11,
    marginLeft: 6
  },
  checkboxesContainer: {
    height: 30,
    width: Dimensions.get("window").width * 0.3,
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
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  yearText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 13
  },
  headerText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3d3d3d",
    fontSize: 14
  }
});
