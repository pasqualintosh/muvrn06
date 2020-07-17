import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
  homeTeam: {
    flex: 1,
    height: Dimensions.get("window").height * 0.3,
    justifyContent: "center",
    alignContent: "space-around",
    alignItems: "center"
  },
  resultContainerTeam: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 12,
    fontWeight: "bold"
  },
  resultContainerTeamDesc: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 10
  },
  resultContainerPoints: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 18,
    fontWeight: "bold"
  },
  billboard: {
    flex: 1,
    height: Dimensions.get("window").height * 0.3,
    justifyContent: "center",
    alignContent: "space-around",
    alignItems: "center"
  },
  awayTeam: {
    flex: 1,
    height: Dimensions.get("window").height * 0.3,
    justifyContent: "center",
    alignContent: "space-around",
    alignItems: "center"
  },
  versusText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#9D9B9C",
    fontSize: 25,
    fontWeight: "bold"
  }
});
