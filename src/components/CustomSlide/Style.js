import { StyleSheet, Dimensions } from "react-native";

// elevation: 2 per avere l'ombra su android con versione 5 in su
export const styles = StyleSheet.create({
  containerComponent: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.6,
    position: "absolute",
    top: Dimensions.get("window").height * 0.15
  },
  linearGradient: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.4,
    overflow: "hidden",
    position: "absolute",
    top: Dimensions.get("window").height * 0.6
  },
  image: {
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").height * 0.2
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around"
  },
  containerSurveySelect: {
    marginTop: 18,
    marginHorizontal: 6
  },
  containerSurvey: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.6,
    backgroundColor: "transparent"
    // position: "absolute",
    // top: 0
  },
  containerSurveyTitle: {
    paddingHorizontal: 16,
    marginTop: 30
  },
  surveyTitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#3F3F3F",
    fontWeight: "bold",
    textAlign: "center"
  },
  containerSurveyDescription: {
    paddingHorizontal: 12
  },
  surveyDescription: {
    fontSize: 14,
    color: "#3D3D3D"
  },
  overlayWave: {
    width: Dimensions.get("window").width,
    height: 100
  },
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  slideTitle: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3D3D3D",
    fontSize: 13,
    fontWeight: "bold"
  },
  slideDescription: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3D3D3D",
    fontSize: 10
  }
});

export const negativeData = [
  {
    value: -6000
  },
  {
    value: 0
  },
  {
    value: -6000
  },
  {
    value: -12000
  },
  {
    value: -6000
  },
  {
    value: -3000
  },
  {
    value: -6000
  }
];
