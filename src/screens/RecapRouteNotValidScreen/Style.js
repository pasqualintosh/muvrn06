import { StyleSheet, Dimensions, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    backgroundColor: "#fff"
  },
  header: {
    width: Dimensions.get("window").width,

    justifyContent: "flex-start",
    alignItems: "center",
    height: 210,
    backgroundColor: "#fff"
  },
  end: {
    width: Dimensions.get("window").width,
    flexDirection: "row",

    justifyContent: "space-around",
    alignItems: "center",
    height: 150
  },
  headerRow: {
    width: Dimensions.get("window").width * 1,
    height: 210,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute"
    // top: 35
    // backgroundColor: "#3e3"
  },
  rowContainer: {
    width: Dimensions.get("window").width,
    borderBottomColor: "#9D9B9C",
    borderBottomWidth: 0.3,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  backgroundImageLigth: {
    width: Dimensions.get("window").width,
    height: 25
    // top: -30
  },
  backgroundImageBanner: {
    width: Dimensions.get("window").width,
    height: 150
    // top: -60
  },
  backgroundImageTopBanner: {
    width: Dimensions.get("window").width,
    height: 35
    // top: -60
  },
  backgroundTopBanner: {
    width: Dimensions.get("window").width,
    height: 35,
    backgroundColor: "#F7F8F9"
    // top: -60
  },
  iconBanner: {
    width: Dimensions.get("window").width,
    height: 220,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: '#FFFFFF'
    // top: -60
  },

  backgroundImageBannerCenter: {
    width: Dimensions.get("window").width,
    height: 150,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  },

  backgroundImageBannerCenterRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },

  Ligth: {
    width: Dimensions.get("window").width * 0.9,
    height: 75,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  LigthEnd: {
    width: Dimensions.get("window").width * 0.9 - 60,
    height: 75,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  LigthUp: {
    width: Dimensions.get("window").width * 0.9,
    paddingTop: 40,
    paddingBottom: 20,
   
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center"
    // top: -20
  },
  LigthOpen: {
    width: Dimensions.get("window").width * 0.9,
    height: 65,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  LigthDetail: {
    width: Dimensions.get("window").width * 0.8,
    height: 60,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#9D9B9C",
    borderBottomWidth: 0.3
  },
  buttonConfermClick: {
    // width: 60,
    height: 30,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 2,

    borderRadius: 5,
    alignItems: "center"
  },
  buttonConfermClickTouch: {
    // width: 60,
    height: 30
  },
  LigthDetailUp: {
    width: Dimensions.get("window").width * 0.8,
    height: 60,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#9D9B9C",
    borderBottomWidth: 0.3
    // top: -30
  },
  IconDetailUp: {
    width: Dimensions.get("window").width * 0.8,
    height: 80,
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center"

    // top: -20
  },
  SingleIconDetail: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: 80
  },
  Rest: {
    width: Dimensions.get("window").width,
    justifyContent: "flex-start",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#6BBA7E"
    //  top: -40
  },
  row: {
    height: Dimensions.get("window").height * 0.08,
    width: Dimensions.get("window").width * 0.8,
    flexDirection: "row",
    backgroundColor: "transparent"
  },

  trip: {
    textAlign: "center",
    fontSize: 19,

    fontFamily: "Montserrat-ExtraBold",
    color: "#FFFFFF"
  },
  pointsBonus: {
    fontFamily: "OpenSans-Regular",

    fontSize: 10,
    color: "#3D3D3D"
  },
  tripDetail: {
    fontFamily: "OpenSans-Regular",

    textAlign: "center",
    fontSize: 15,
    color: "#FFFFFF"
  },
  addButton: {
    fontFamily: "OpenSans-Regular",

    textAlign: "center",
    fontSize: 14,
    color: "#FFFFFF"
  },
  leftParameter: {
    alignSelf: "center",
    textAlignVertical: "center",
    flex: 1,
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
  },
  rightContainer: {
    alignSelf: "center"
  },
  frequent_trip: {
    fontWeight: "bold",
    fontFamily: "OpenSans-Bold",
    color: "#F7F8F9",
    fontSize: 15,
    textAlignVertical: "center",
    textAlign: "left"
  },
  Map: {
    fontWeight: "bold",
    fontFamily: "OpenSans-Bold",
    fontSize: 12,
    textAlign: "center",
    color: "#000000"
  },
  rightElement: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 1,
    color: "#3D3D3D"
  },
  iconText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 10,
    textAlignVertical: "center"
  },
  frequent_tripImage: {
    width: 50,
    height: 50
  },
  frequent_checkImage: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  load: {
    width: 60,
    height: 30,
    paddingLeft: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  headerModalSplit: {
    width: Dimensions.get("window").width * 0.3,
    height: Dimensions.get("window").height * 0.1,
    justifyContent: "center",
    alignItems: "center"
  },
  headerdivideTree: {
    width: Dimensions.get("window").width / 3,
    height: Dimensions.get("window").height * 0.1,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  },
  headerDateContainer: {
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").height * 0.1,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  headerText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
    // marginTop: 18
  },
  headerTexPoints: {
    textAlign: "left",
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "OpenSans-Bold",
    color: "#9D9B9C"
    // marginTop: 18
  },
  headerTextValuePoint: {
    textAlign: "center",
    fontSize: 30,

    fontFamily: "Montserrat-ExtraBold",
    color: "#3D3D3D"
    // marginTop: 18
  },
  map: {
    height: Dimensions.get("window").height * 0.44,
    width: Dimensions.get("window").width
    // backgroundColor: "#3e3"
  },
  mapTextContainer: {
    position: "absolute",
    bottom: Platform.OS == "ios" ? 0 : 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.44,
    justifyContent: "center",
    alignItems: "center"
  },
  mapText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D",
    paddingBottom: Dimensions.get("window").height * 0.22
  }
});

export const filledCurve = [
  {
    value: -1
  },
  {
    value: -2
  },
  {
    value: -0.8
  },
  {
    value: -1.2
  },
  {
    value: -1
  },
  {
    value: -2
  },
  {
    value: -0.8
  },
  {
    value: -1.2
  }
];

export const opaqueCurve = [
  {
    value: -1
  },
  {
    value: -1
  },
  {
    value: -4
  },
  {
    value: -5
  },
  {
    value: -6
  },
  {
    value: -3
  },
  {
    value: -1
  },
  {
    value: -1
  }
];
