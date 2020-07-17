import React from "react";
import { View, Text } from "react-native";

import { styles } from "./Style";

class CityItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let backgroundColor = "transparent";
    if (this.props.rowID)
      backgroundColor = this.props.rowID % 2 === 0 ? "#FFFFFF" : "#F7F8F9";
    return (
      <View
        style={[
          this.props.stylesCityItem,
          {
            backgroundColor
          }
        ]}
      >
        <View style={[styles.cityColumn, styles.cityColumnPosition]}>
          <Text style={styles.parameter}>{this.props.city.position}</Text>
        </View>
        <View style={[styles.cityColumn, styles.cityColumnName]}>
          <Text style={styles.cityName}>{this.props.city.name}</Text>
        </View>
        <View style={[styles.cityColumn, styles.cityColumnWon]}>
          <Text style={styles.parameter}>{this.props.city.won}</Text>
        </View>
        <View style={[styles.cityColumn, styles.cityColumnLost]}>
          <Text style={styles.parameter}>{this.props.city.lost}</Text>
        </View>
        <View style={[styles.cityColumn, styles.cityColumnPercentage]}>
          <Text style={styles.parameter}>
            .{this.props.city.won_percentage}
          </Text>
        </View>
      </View>
    );
  }
}

export default CityItem;
