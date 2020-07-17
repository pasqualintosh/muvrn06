import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  containerComponent: {
    flexDirection: "row",
    height: 95,
    backgroundColor: "#fff",
    borderRadius: 4,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 2
  },
  containerIcon: {
    flex: 0.25,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: 60,
    height: 70
  },
  containerContent: {
    flex: 0.5,
    alignContent: "center",
    justifyContent: "center"
  },
  title: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },
  subTitle: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },
  content: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },
  containerTitle: {
    flexDirection: "row"
  },
  containerIncrement: {
    flex: 0.25,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  separator: {
    width: 1,
    height: 75,
    backgroundColor: "#9D9B9C",
    marginVertical: 10
  },
  number: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 23,
    color: "#3D3D3D"
  },
  value: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },
  colored: {
    backgroundColor: "#3D3D3D",
    width: 5,
    height: 5,
    alignSelf: "flex-start",
    position: "absolute",
    top: 15,
    right: 5,
    borderRadius: 15
  }
});
