import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

import Emoji from "@ardentlabs/react-native-emoji";

class ChartsSustainability extends React.Component {
  render() {
    return (
      <View>
        <Text style={styles.title}>SUSTAINABILITY</Text>
        <Text style={styles.firstParagraph}>
          You’re doing great, buddy! Your carbon footprint is way way smaller
          than before
        </Text>
        <View style={styles.boxContainer}>
          <View style={[styles.textContainer, { flexDirection: "row" }]}>
            <Text style={styles.sideText}>CO</Text>
            <Text
              style={{
                fontFamily: "Montserrat-ExtraBold",
                color: "#3F3F3F",
                fontSize: 8,
                marginTop: 12
              }}
            >
              2
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.centerText}>74</Text>
            <Text
              style={{
                fontFamily: "OpenSans-Regular",
                fontWeight: "400",
                color: "#9D9B9C",
                fontSize: 7
              }}
            >
              kg/km
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.sideText}>
              <Emoji
                style={{
                  fontSize: 16
                }}
                name={"fire"}
              />
            </Text>
          </View>
        </View>
        <Text style={styles.lastParagraph}>
          Your sustainability is calculated only through the routinary trip. Add
          them as much as you can in order to evaluate more precisely your
          impact.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 20,
    marginVertical: 1,
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.8,
    textAlign: "center"
  },

  firstParagraph: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3D3D3D",
    fontSize: 12,
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.8,
    textAlign: "left",
    marginTop: 7
  },

  boxContainer: {
    width: Dimensions.get("window").width * 0.8,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F8F9",
    borderRadius: 4,
    alignSelf: "center",
    marginTop: 7
  },

  textContainer: {
    width: Dimensions.get("window").width * 0.26,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },

  sideText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 20,
    marginVertical: 1
  },
  centerText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 34,
    marginVertical: 1
  },
  lastParagraph: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3D3D3D",
    fontSize: 12,
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.8,
    textAlign: "left",
    marginTop: 7
  }
});

export default ChartsSustainability;
