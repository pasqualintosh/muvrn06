import React from "react";
import { View, Text } from "react-native";

import { styles } from "./Style";

class OnGoingMatch extends React.Component {
  render() {
    return (
      <View style={this.props.stylesResultContainer}>
        <View style={styles.homeTeam}>
          <Text style={styles.resultContainerTeam}>
            {this.props.homeTeamName}
          </Text>
          <Text style={styles.resultContainerTeamDesc}>
            {this.props.homeTeamDescription}
          </Text>
          <Text style={styles.resultContainerPoints}>
            {this.props.homeTeamScore}
          </Text>
        </View>
        <View style={styles.billboard}>
          <Text style={styles.versusText}>VS</Text>
        </View>
        <View style={styles.awayTeam}>
          <Text style={styles.resultContainerTeam}>
            {this.props.awayTeamName}
          </Text>
          <Text style={styles.resultContainerTeamDesc}>
            {this.props.awayTeamDescription}
          </Text>
          <Text style={styles.resultContainerPoints}>
            {this.props.awayTeamScore}
          </Text>
        </View>
      </View>
    );
  }
}

export default OnGoingMatch;
