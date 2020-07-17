import { StyleSheet, Dimensions, Platform } from "react-native";

export const styles = StyleSheet.create({
  headerContainer: {
    width: Dimensions.get("window").width * 0.8,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerContainerActivities: {
    width: Dimensions.get("window").width * 0.8,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: 'center'
  },
  
  headerText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 20,
    textAlign: "left",
    textAlignVertical: "center"
  },
  headerTextActivities: {
    fontFamily: Platform.OS === "ios" ? "MoonFlowerBold" : "MoonFlower-Bold",
    color: "#3F3F3F",
    fontSize: 31,
    textAlign: "center",
    textAlignVertical: "center"
  }
  ,
  centerTextContainer: {
    position: "absolute",
    top: 120
  },
  centerCircleValue: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#ffffff",
    fontSize: 49,
    textAlign: "center",
    textAlignVertical: "center"
  },
  centerCircleContainer: {
    position: "absolute",
    top: 140
  },
  centerTextCircleParam: {
    fontFamily: "Montserrat-ExtraBold",
    textAlign: "center",
    
    color: "#ffffff",
    fontSize: 11,
    
  },
  centerValue: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 37,
    textAlign: "center",
    textAlignVertical: "center"
  },
  centerTextParam: {
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
    fontWeight: "400",
    color: "#9D9B9C",
    fontSize: 9,
    fontWeight: "bold"
  },
  iconText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 10,
    textAlignVertical: "center"
  },
  mfrText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3D3D3D",
    fontSize: 13,
    marginRight: 0
  },
  deleteContainer: {
    width: 18,
    height: 18
  },
  mainContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.06,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  sideContainer: {
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").height * 0.06,
    // backgroundColor: "#6397CB",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#fff",
    fontSize: 10,
    marginVertical: 1
  },
  underline: {
    width: Dimensions.get("window").width * 0.25,
    height: 6,
    backgroundColor: "#FFFFFF",
    marginVertical: 4
  }
});
