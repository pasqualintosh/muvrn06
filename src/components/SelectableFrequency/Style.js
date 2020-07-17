import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  containerComponent: {
    marginTop: 4
  },
  containerItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    height: 16
  },
  containerPin: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    height: 16
  },
  containerSelectable: {
    marginHorizontal: 2,
    flex: 0.2,
    height: 2.77,
    backgroundColor: "#9D9B9C"
  },
  containerSelected: {
    marginHorizontal: 2,
    flex: 0.2,
    height: 2.77,
    backgroundColor: "#60368C"
  },
  containerSeletableLabel: {
    marginHorizontal: 2,
    flex: 0.2,
    height: 16.75
  },
  containerSeletableLabelText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },
  pin: {
    flex: 0.2,
    marginHorizontal: 2
  },
  pinItemVisbile: {
    width: 16,
    height: 16,
    backgroundColor: "#60368C",
    marginLeft: 32
  },
  pinItemHidden: {
    width: 16,
    height: 16,
    marginLeft: 32
  }
});
