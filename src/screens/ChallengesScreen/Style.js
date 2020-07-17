import { StyleSheet, Platform, Dimensions } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: { backgroundColor: "#fff", flex: 1 },
  gradientContainer: {
    zIndex: -2,
    flex: 1,
    position: "absolute",
    top: 0,
    width: Dimensions.get("window").width,
    height:
      Platform.OS === "ios"
        ? Dimensions.get("window").height - 200
        : Dimensions.get("window").height + 200
  },
  yourTeamContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16
  },
  overlayWave: {
    width: Dimensions.get("window").width,
    height: 30,
    position: "absolute",
    top: Dimensions.get("window").height * 0.2
  },
  resultContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.3,
    flexDirection: "row",
    backgroundColor: "#F7F8F9"
  },
  onGoingContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.3,
    backgroundColor: "#fff",
    flexDirection: "row"
  },
  pointsContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    backgroundColor: "#fff",
    marginVertical: 50
  },
  cityLogo: {
    backgroundColor: "#ababab",
    width: 70,
    height: 70,
    borderRadius: 6
  },
  onGoingMatchTextContainer: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.2,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width
  },
  onGoingMatchText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 16,
    marginVertical: 1,
    fontWeight: "bold"
  }
});

export const negativeData = [
  {
    value: -600
  },
  {
    value: -1200
  },
  {
    value: -2000
  },
  {
    value: -800
  },
  {
    value: -900
  }
];

export const positiveData = [
  {
    value: 600
  },
  {
    value: 1200
  },
  {
    value: 2000
  },
  {
    value: 800
  },
  {
    value: 900
  }
];
