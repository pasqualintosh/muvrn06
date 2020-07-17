import React from "react";
import { View, Text } from "react-native";

import { styles } from "./Style";

class LatestMatch extends React.Component {
  render() {
    return (
      <View style={this.props.stylesPointsContainer}>
        <View style={styles.latestMatchTitleContainer}>
          <Text style={styles.latestMatchTitle}>Latest Match</Text>
        </View>
        <View style={styles.latestMatchBodyContainer}>
          <View style={styles.latestHomeContainer}>
            <Text style={styles.latestTeamName}>{this.props.homeTeamName}</Text>
          </View>
          <View style={styles.latestVersusContainer}>
            <Text style={styles.latestTeamPoints}>
              {this.props.homeTeamScore}
            </Text>
            <Text style={styles.latestTeamPoints}>
              {this.props.awayTeamScore}
            </Text>
          </View>
          <View style={styles.latestAwayContainer}>
            <Text style={styles.latestTeamName}>{this.props.awayTeamName}</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default LatestMatch;
