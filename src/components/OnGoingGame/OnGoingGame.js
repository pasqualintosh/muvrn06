import React from "react";
import { View, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import GradientButton from "./../GradientButton/GradientButton";
import { styles } from "./Style";

class OnGoingGame extends React.Component {
  render() {
    return (
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.0, y: 1.0 }}
        locations={[0, 1.0]}
        colors={["#F49658", "#E82F73"]}
        style={this.props.stylesOnGoingContainer}
      >
        <View style={styles.homeTeam}>
          <Text style={styles.onGoingTitle}>Remaining time</Text>
          <Text style={styles.onGoingDesc}>{this.props.remainingTime}</Text>
        </View>
        <View style={styles.billboard}>
          <Text style={styles.onGoingTitle}>Points</Text>
          <Text style={styles.onGoingDesc}>{this.props.points}</Text>
        </View>
        <View style={styles.awayTeam}>
          <GradientButton
            buttonStyle={{ width: 70, alignSelf: "flex-end" }}
            buttonText={"Live"}
          />
        </View>
      </LinearGradient>
    );
  }
}

export default OnGoingGame;
