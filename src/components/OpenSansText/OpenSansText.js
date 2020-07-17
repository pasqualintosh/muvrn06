import React from "react";
import { View, Text } from "react-native";

class OpenSansText extends React.Component {
  render() {
    return (
      <View>
        <Text style={styles.welcome}>Testo scritto con font OpenSans</Text>
        <Text>Testo senza font OpenSans</Text>
      </View>
    );
  }
}

// in fontFamily specifico quale font utilizzo, ovviamnete prima deve essere importato in Xcode come file e anche in info.plist
const styles = {
  welcome: {
    fontFamily: "OpenSans-Italic",
    fontWeight: "400",
    paddingTop: 40
  }
};

export default OpenSansText;
