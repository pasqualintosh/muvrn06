import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F7F8F9"
  },
  selectableHeader: {
    height: Dimensions.get("window").height * 0.06,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around"
  },
  notSelectable: {
    flex: 1,
    marginHorizontal: 6
  },
  selectable: {
    marginHorizontal: 6,
    borderBottomColor: "#9D9B9C",
    borderBottomWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: 35,
    width: Dimensions.get("window").width * 0.25
  },
  selectableTouchable: {
    justifyContent: "center",
    alignItems: "center"
  },
  selectableContainer: {
    height: 35,
    width: Dimensions.get("window").width * 0.2,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    width: Dimensions.get("window").width * 0.17,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1
  },
  selectableLabel: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3D3D3D",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center"
  },
  overlayWave: {
    height: 30,
    width: Dimensions.get("window").width,
    position: "absolute",
    top: 100
  },
  backgroundImageClassic: {
    height: 130,
    width: Dimensions.get("window").width,
    // position: "absolute"
    top: -130
  },
  backgroundImage: {
    height: 130,
    width: Dimensions.get("window").width,
    
    
  },
   backgroundImageAbsolute: {  height: 130,
    width: Dimensions.get("window").width,
    position: "absolute",
    top: 40},
  userContainerStatic: {
    width: Dimensions.get("window").width,
    height: 170,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  backgroundImageStatic: {
    height: 200,
    width: Dimensions.get("window").width,
    
    //top: 40
  },
  backgroundImageStaticAbsolute: {
    height: 200,
    width: Dimensions.get("window").width,
    position: "absolute",
    //top: 40
  },
  backgroundView: {
    height: 130,
    width: Dimensions.get("window").width,

    top: 40
  },
  containerList: {},
  userContainer: {
    width: Dimensions.get("window").width,
    height: 100,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  firstUser: {
    position: "absolute"
    // top: Dimensions.get("window").height * 0.04 + 10
  },
  challengesList: {
    top: Dimensions.get("window").height * 0.04 + 85 - 30,
    height: Dimensions.get("window").height - 230 + 60
  },
  challengesListFollowers: {
    top: 0,
    height: Dimensions.get("window").height + 60
  }
});

export const negativeData = [
  {
    value: 2000
  },
  {
    value: 400
  },
  {
    value: 300
  },
  {
    value: 1500
  },
  {
    value: 700
  },
  {
    value: 1800
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
  }
];
