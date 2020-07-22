import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    width: Dimensions.get("window").width * 0.8,
    height: 120,
    justifyContent: "center",
    alignItems: "center"
    // backgroundColor: "#F7F8F9"
    // borderRadius: 4,
    // shadowRadius: 2,
    // shadowColor: "#B2B2B2",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.6,
    // elevation: 0.9
  },
  textContainer: {
    width: Dimensions.get("window").width * 0.8,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  boxContainer: {
    width: Dimensions.get("window").width * 0.8,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F8F9",
    borderRadius: 4,
    shadowRadius: 2,
    shadowColor: "#B2B2B2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    elevation: 0.9
  },
  routesContainer: {
    width: Dimensions.get("window").width * 0.52,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  kilometersContainer: {
    width: Dimensions.get("window").width * 0.26,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderLeftColor: "#9D9B9C",
    borderRightColor: "#9D9B9C",
    borderLeftWidth: 1,
    borderRightWidth: 1
  },
  eniLogoContainer: {
    width: Dimensions.get("window").width * 0.26,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  quantity: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 20,
    marginVertical: 1
  },
  param: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#9D9B9C",
    fontSize: 7
  },
  co2Text: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 10
  }
});
