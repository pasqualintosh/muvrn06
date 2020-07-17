import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
  homeTeam: {
    flex: 1,
    height: Dimensions.get("window").height * 0.3,
    justifyContent: "center",
    alignContent: "space-around",
    alignItems: "center"
  },
  billboard: {
    flex: 1,
    height: Dimensions.get("window").height * 0.3,
    justifyContent: "center",
    alignContent: "space-around",
    alignItems: "center"
  },
  onGoingTitle: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 12,
    fontWeight: "bold"
  },
  onGoingDesc: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 18
  },
  awayTeam: {
    flex: 1,
    height: Dimensions.get("window").height * 0.3,
    justifyContent: "center",
    alignContent: "space-around",
    alignItems: "center"
  }
});
