import React from "react";
import { View, Text } from "react-native";

import { styles } from "./Style";

class TeamAvatar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.cityName}>Palermo</Text>
        <Text style={styles.cityDescription}>Centro storico</Text>
        <View style={[styles.containerCityLogo, this.props.style]} />
        <Text style={styles.cityPoints}>12.345</Text>
      </View>
    );
  }
}

export default TeamAvatar;
