import React from "react";
import { View, Text } from "react-native";

import { styles } from "./Style";

class ChallengesCityRecap extends React.Component {
  render() {
    return (
      <View style={[{}, this.props.style]}>
        <Text style={styles.cityName}>{this.props.cityName.toUpperCase()}</Text>
        <Text style={styles.cityDescription}>{this.props.cityDescription}</Text>
        <Text style={styles.cityStats}>{this.props.cityStats}</Text>
      </View>
    );
  }
}

export default ChallengesCityRecap;
