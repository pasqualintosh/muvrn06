import { StyleSheet, Dimensions } from "react-native";
export const styles = StyleSheet.create({
  mainContainer: {
    width: Dimensions.get("window").width,
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  leftContainer: {
    // width: Dimensions.get("window").width * 0.5,
    width: Dimensions.get("window").width * 0.33,
    height: 40,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  rightContainer: {
    // width: Dimensions.get("window").width * 0.5,
    width: Dimensions.get("window").width * 0.33,
    height: 40,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  centerContainer: {
    // width: Dimensions.get("window").width * 0.5,
    width: Dimensions.get("window").width * 0.33,
    height: 40,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  sideContainer: {
    width: Dimensions.get("window").width * 0.33,
    height: 40,
    // backgroundColor: "#6397CB",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  underline: {
    width: Dimensions.get("window").width * 0.25,
    height: 6,
    backgroundColor: "#3d3d3d"
  },
  text: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#fff",
    fontSize: 10,
    marginVertical: 10
  },
  endFlex: {
    width: Dimensions.get("window").width,
    height: 40,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center"
  }
});
