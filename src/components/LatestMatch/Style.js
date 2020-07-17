import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
  latestMatchTitleContainer: {
    flex: 1
  },
  latestMatchBodyContainer: {
    flex: 1,
    flexDirection: "row"
  },
  latestHomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  latestVersusContainer: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center"
  },
  latestMatchTitle: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginLeft: 15
  },
  latestAwayContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    height: 120
  },
  latestTeamName: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#9D9B9C",
    fontSize: 16
  },
  latestTeamPoints: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3F3F3F",
    fontSize: 25,
    fontWeight: "bold"
  }
});
