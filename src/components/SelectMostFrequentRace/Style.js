import { StyleSheet, Dimensions, NativeModules } from "react-native";

export const styles = StyleSheet.create({
  selectContainer: {
    // backgroundColor: "#E8327480",
    width: Dimensions.get("window").width * 0.8,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start"
  },
  selectBox: {
    // backgroundColor: "#7D5C0F80",
    width: Dimensions.get("window").width * 0.3,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  selectBoxTextContainer: {
    backgroundColor: "#3D3D3D",
    width: Dimensions.get("window").width * 0.15,
    height: 30,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center"
  },
  selectBoxText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 11
  },
  pointerContainer: {
    backgroundColor: "#9D9B9C",
    width: 30,
    height: 30,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center"
  },
  pointerText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 20
  },
  frequencyContainer: {
    // backgroundColor: "#DEECD380",
    width: Dimensions.get("window").width * 0.4,
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  frquencyText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 12,
    marginVertical: 5,
    marginHorizontal: 5
  },
  frequencyInput: {
    backgroundColor: "#fff",
    height: 30,
    width: 60,
    borderBottomColor: "#3d3d3d",
    borderBottomWidth: 1
  },
  frequencySlash: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 12,
    marginVertical: 5,
    marginHorizontal: 5
  },
  headerText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 14,
    alignSelf: "center"
  },
  chooseMfrContainer: {
    width: Dimensions.get("window").width * 0.4,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0.1, height: 0.1 },
    shadowRadius: 0.1,
    shadowOpacity: 0.8,
    borderRadius: 3,
    marginBottom: 8
  }
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    headerText: {
      fontSize: 10
    },
    chooseMfrContainer: {
      height: 30,
      marginBottom: 1
    }
  });
}
