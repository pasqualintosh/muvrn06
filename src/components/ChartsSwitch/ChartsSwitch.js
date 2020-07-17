import React from "react";
import { View, Text, StyleSheet } from "react-native";

class ChartsSwitch extends React.Component {
  render() {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.text}>last year</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    width: 65,
    height: 15,
    borderBottomColor: "#F7F8F9",
    borderBottomWidth: 2,
    marginBottom: 6
  },
  text: {
    fontFamily: "OpenSans-Regular",
    fontSize: 10,
    color: "#9D9B9C",
    textAlign: "center"
  }
});

export default ChartsSwitch;
