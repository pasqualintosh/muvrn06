import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
  cityColumn: {
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center"
  },
  cityColumnPosition: {
    flex: 0.5
  },
  cityColumnName: {
    flex: 2.5
  },
  cityColumnWon: {
    flex: 0.5
  },
  cityColumnLost: {
    flex: 0.5
  },
  cityColumnPercentage: {
    flex: 0.5
  },
  parameter: {
    fontFamily: "OpenSans-Regular",
    
    color: "#3D3D3D",
    fontSize: 10
  },
  cityName: {
    fontFamily: "OpenSans-ExtraBold",
    
    color: "#3D3D3D",
    fontSize: 13,
    fontWeight: "bold"
  },
  mainContainer: {
    backgroundColor: "#fff",
    flex: 1
  },
  header: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.12,
    flexDirection: "row"
  },
  overlayWave: {
    width: Dimensions.get("window").width,
    height: 20,
    position: "absolute",
    top: Dimensions.get("window").height * 0.2
  },
  cityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    height: 40
  },
  cityColumn: {
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center"
  },
  
  cityColumnWon: {
    flex: 0.5
  },
  cityColumnLost: {
    flex: 0.5
  },
  cityColumnPercentage: {
    flex: 0.5
  },
  parameter: {
    fontFamily: "OpenSans-Regular",
    
    color: "#3D3D3D",
    fontSize: 10
  },
  cityColumn: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    height: 80,
   
    
  },
  teamColumn: {
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center"
  },
  cityColumnPosition: {
    width: 30
  },
  cityColumnName: {
    flex: Dimensions.get("window").width - 240
  },
  cityColumnWon: {
    width: 50,
    borderColor: "#ffffff"
  },
  cityColumnLost: {
    width: 50
  },
  cityColumnPercentage: {
    width: 100
  },
  tableHeader: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
    // position: "absolute",
    // top: 0,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    height: 65,
    backgroundColor: "#C8DBAE"
  },
  headerText: {
    fontFamily: "OpenSans-ExtraBold",
    fontWeight: "700",
    color: "#3D3D3D",
    fontSize: 11
  }
});

