import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    width: Dimensions.get("window").width * 0.7,
    height: 200,
    top: Dimensions.get("window").height * 0.45,
    alignSelf: "center",
    // backgroundColor: "#abb",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  text: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 14,
    textAlign: "center"
  },
  strong: {
    fontFamily: "OpenSans-Extrabold",
    fontWeight: "bold",
    color: "#3d3d3d",
    fontSize: 14,
    textAlign: "center"
  }
});
