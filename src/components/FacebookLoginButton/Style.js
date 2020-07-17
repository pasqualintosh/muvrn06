import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
  containerButton: {
    width: Dimensions.get("window").width * 0.35,
    height: Dimensions.get("window").height / 20,
    borderRadius: 6,
    backgroundColor: "#425BB4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 3
  },
  button: {
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    // borderRadius: 6
  },
  text: {
    fontFamily: "OpenSans-Regular",
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "400"
  }
});
