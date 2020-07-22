import React from "react";
import { View, Text, Platform, Dimensions } from "react-native";
import { styles } from "./Style";
import { BoxShadow } from "react-native-shadow";

import { strings } from "../../config/i18n";

class ChartsStats extends React.Component {
  render() {
    let shadowOpt;
    if (Platform.OS == "ios")
      shadowOpt = {
        width: Dimensions.get("window").width * 0.8,
        height: 50,
        color: "#888",
        border: 4,
        radius: 5,
        opacity: 0.25,
        x: 0,
        y: 1
      };
    else
      shadowOpt = {
        width: Dimensions.get("window").width * 0.8,
        height: 50,
        color: "#444",
        border: 3,
        radius: 5,
        opacity: 0.35,
        x: 0,
        y: 1
      };
    return (
      <BoxShadow setting={shadowOpt}>
        <View style={styles.mainContainer}>
          <View style={styles.routesContainer}>
            <Text style={styles.quantity}>{this.props.routes}</Text>
            <Text style={styles.param}>
              {strings("id_5_04").toLocaleUpperCase()}
            </Text>
          </View>
          <View style={styles.kilometersContainer}>
            <Text style={styles.quantity}>{this.props.calories}</Text>
            <Text style={styles.param}>
              {strings("id_5_14").toLocaleUpperCase()}
            </Text>
          </View>
          <View style={styles.minutesContainer}>
            <Text style={styles.quantity}>{this.props.time}</Text>
            <Text style={styles.param}>
              {strings("id_4_06").toLocaleUpperCase()}
            </Text>
          </View>
        </View>
      </BoxShadow>
    );
  }
}

export default ChartsStats;
