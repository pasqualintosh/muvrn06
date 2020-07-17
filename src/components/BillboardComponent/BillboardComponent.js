import React from "react";
import { View, Text, Dimensions } from "react-native";

import TeamAvatar from "./../TeamAvatar/TeamAvatar";
import GradientButton from "./../GradientButton/GradientButton";

import { styles } from "./Style";

class BillboardComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <View style={styles.rightContainer}>
          <TeamAvatar />
        </View>
        <View style={styles.centerContainer}>
          <View style={styles.circle} />
          <View style={styles.line} />
          <GradientButton
            containerStyle={{ marginTop: 18 }}
            buttonText={"Live"}
          />
        </View>
        <View style={styles.leftContainer}>
          <TeamAvatar />
        </View>
      </View>
    );
  }
}

export default BillboardComponent;
