import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
  userContainer: {
    width: Dimensions.get("window").width,
    height: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  userPositionContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  userAvatarContainer: {
    width: Dimensions.get("window").width * 0.25,
    justifyContent: "center",
    flexDirection: "row",

    alignItems: "center",
    alignSelf: "center"
  },
  otherContainer: {
    width: Dimensions.get("window").width * 0.75,
    height: 100,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    alignContent: "center"
  },
  userLabel: {
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "left"
  },
  userIndex: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3D3D3D",
    fontSize: 12,
    textAlign: "left"
  },
  userPoints: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3D3D3D",
    fontSize: 10,
    textAlign: "left"
  },
  userPosition: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3D3D3D",
    fontSize: 11
  },
  userAvatar: {
    backgroundColor: "#518A9C",
    width: 65,
    height: 65,
    borderRadius: 100
  },
  userAvatarImage: {
    width: 65,
    height: 65
  },
  userBadge: {
    backgroundColor: "#6CBA7E",
    width: 20,
    height: 20,
    borderRadius: 20,
    position: "absolute",
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  badgeText: {
    fontFamily: "Montserrat-ExtraBold",
    fontWeight: "bold",
    color: "#3D3D3D",
    fontSize: 11,
    textAlign: "center"
  },
  //
  modalContainer: {
    height: 250,
    width: Dimensions.get("window").width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 2,
    borderColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  modalText: {
    color: "#00000054",
    fontFamily: "OpenSans-Regular",
    fontSize: 16
  },
  modalBtnText: {
    color: "#51AEC9",
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    textAlign: 'center'
  },
  modalButtonsContainer: { flexDirection: "row", marginTop: 30 },
  buttonContainer: {
    height: 40,
    width: Dimensions.get("window").width * 0.4,
    justifyContent: "center",
    alignItems: "center"
  }
});
