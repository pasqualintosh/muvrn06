import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
  challengesList: {
    // position: "absolute",
    // top: 40,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height // - 40
  },
  mainContainer: {
    backgroundColor: "#fff",
    flex: 1
  },
  header: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.12,
    flexDirection: "row"
  },
  overlayWave: {
    width: Dimensions.get("window").width,
    height: 20,
    position: "absolute",
    top: Dimensions.get("window").height * 0.2
  },
  cityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    height: 80
  },
  cityColumn: {
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center"
  },

  cityColumnWon: {
    flex: 0.5
  },
  cityColumnLost: {
    flex: 0.5
  },
  cityColumnPercentage: {
    flex: 0.5,
  },
  parameter: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3D3D3D",
    fontSize: 13
  },
  cityColumn: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    height: 65,
    borderLeftColor: "#ffffff",
    borderLeftWidth: 2
  },
  teamColumn: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center"
  },
  cityColumnPosition: {
    width: 40
  },
  cityColumnName: {
    flex: Dimensions.get("window").width - 240
  },
  cityColumnWon: {
    width: 50,
    borderColor: "#ffffff"
  },
  cityColumnLost: {
    width: 50
  },
  cityColumnPercentage: {
    width: 100
  },
  tableHeader: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
    position: "absolute",
    top: 0,
    // position: "absolute",
    // top: 0,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    height: 65
    // backgroundColor: "#C8DBAE"
  },
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: 65,
    position: "absolute",
    top: 0
  },
  secondStandingImage:{
    width: Dimensions.get("window").width,
    height: 65,
  },
  headerText: {
    fontFamily: "OpenSans-ExtraBold",
    fontWeight: "700",
    color: "#FFFFFF",
    fontSize: 11
  },
  subImage: {
    width: Dimensions.get("window").width,

    position: "absolute",
    top: 40
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
  },
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

export const cities = [
  {
    position: 1,
    name: "San Francisco",
    won: 51,
    lost: 24,
    won_percentage: 88
  },
  {
    position: 2,
    name: "Alberta",
    won: 44,
    lost: 24,
    won_percentage: 69
  },
  {
    position: 3,
    name: "Palermo",
    won: 42,
    lost: 24,
    won_percentage: 58
  },
  {
    position: 4,
    name: "Mosca",
    won: 22,
    lost: 24,
    won_percentage: 52
  },
  {
    position: 5,
    name: "Barcellona",
    won: 44,
    lost: 24,
    won_percentage: 43
  },
  {
    position: 6,
    name: "Amsterdam",
    won: 44,
    lost: 24,
    won_percentage: 32
  },
  {
    position: 7,
    name: "Liegi",
    won: 51,
    lost: 24,
    won_percentage: 54
  },
  {
    position: 8,
    name: "Oporto",
    won: 11,
    lost: 24,
    won_percentage: 12
  },
  {
    position: 9,
    name: "Roma",
    won: 2,
    lost: 24,
    won_percentage: 58
  },
  {
    position: 10,
    name: "Londra",
    won: 1,
    lost: 24,
    won_percentage: 36
  },
  {
    position: 11,
    name: "Milano",
    won: 11,
    lost: 24,
    won_percentage: 12
  },
  {
    position: 12,
    name: "Bangkok",
    won: 2,
    lost: 24,
    won_percentage: 58
  },
  {
    position: 13,
    name: "Assen",
    won: 1,
    lost: 24,
    won_percentage: 36
  }
];
