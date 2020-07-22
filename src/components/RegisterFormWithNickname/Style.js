import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
  input: {
    width: Dimensions.get("window").width * 0.85,
    height: 44,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    // backgroundColor: "transparent",
    // opacity: 0.15,
    // borderRadius: 4
    borderColor: "#FFFFFF",
    borderWidth: 1,
    
    // marginVertical: 4
  },
  inputText: {
    // textDecorationColor: '#FFFFFF',
    color: "#ffffff",
    flex: 1,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    textAlign: 'left',
    fontSize: 16,

    

  },
  buttonsContainer: {
    width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height * 0.4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15
  },
  containerFBLogin: {
    // marginHorizontal: 8,
    // height: 30,
    // width: 170,
    // marginHorizontal: 15,
    // borderRadius: 6,
    // flexDirection: "column",
    // alignContent: "center",
    // justifyContent: "center",
    // alignItems: "center"
  },
  tips: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#E6332A",
    fontSize: 11,
    marginTop: 11
  },
  modalContainer: {
    flex: 1,
    // marginTop: 22,
    backgroundColor: "#F7F8F9",
    justifyContent: "flex-start",
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  checkboxesContainer: {
    width: Dimensions.get("window").width,
    height: 500,
    // backgroundColor: "transparent",
    // position: "absolute",
    // top: Dimensions.get("window").height * 0.75,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#3e3",
    marginTop: 30
  },
  checkboxContainer: {
    width: Dimensions.get("window").width * 0.7,
    // height: 100,
    marginVertical: 5
  },
  nativeButtonsContainer: {
    // top: 75,
    height: 50,
    width: 280,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  nativeButtonContainer: {
    marginHorizontal: 9
    // height: 50
  },
  textButton: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 12,
    color: "#51AEC9"
  }
});
