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
    // flex: 0.5,
    width: 35,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  userAvatarContainer: {
    // flex: 1.5,
    flexDirection: 'row',
    width: 85,
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center"
  },
  userLabel: {
    fontFamily: "OpenSans-Regular",
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  ViewLabel: {
    // flex: 2,
    width: (Dimensions.get("window").width - 130 - 90 - 35),
    flexDirection: 'column',
    justifyContent: 'center'
  },
  userPoints: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#FFFFFF",
    fontSize: 11
  },
  userPosition: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#FFFFFF",
    fontSize: 11
  },
  userAvatar: {
    backgroundColor: "#518A9C",
    width: 65,
    height: 65,
    borderRadius: 100
  },
  userAvatarImage: {
    width: 60,
    height: 60
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
    color: "#FFFFFF",
    fontSize: 11,
    textAlign: "center"
  }
});
