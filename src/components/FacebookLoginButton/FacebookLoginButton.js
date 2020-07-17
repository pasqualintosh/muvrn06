import React from "react";
import { View, Text } from "react-native";
import { styles } from "./Style";

class FacebookLoginButton extends React.Component {
  render() {
    return (
      <View style={styles.containerButton}>
        <Text style={styles.text}>
          {this.props.text ? this.props.text : "Log in with Facebook"}
        </Text>
      </View>
    );
  }
}

export default FacebookLoginButton;
