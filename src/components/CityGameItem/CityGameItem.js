import React from "react";
import { View, Text, Image } from "react-native";

import {
  citiesImage,
  imagesCity
} from "./../../components/FriendItem/FriendItem";
import pointsDecimal from "./../../helpers/pointsDecimal";

import { styles } from "./Style";

class CityGameItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    
    let id = 1;
    
    if (this.props.city_name) {
      // vedo se è tra le città pilota
      id = citiesImage(this.props.city_name);
      
    }
    const row = parseInt(this.props.rowID) + 1;
    
    let backgroundColor = "transparent";
    if (row)
      backgroundColor = row % 2 === 1 ? "#FFFFFF" : "#F7F8F9";
    return (
      <View
        style={[
          this.props.stylesCityItem,
          {
            backgroundColor,
            // marginTop: row - 1 ? 0 : 15,
            marginBottom: row === this.props.end ? 200 : 0
          }
        ]}
      >
        <View style={[styles.cityColumn, styles.cityColumnPosition]}>
          <Text style={styles.parameter}>{row > 8 ? row - 8 : row}</Text>
        </View>
        <View
          style={{
            width: 5,
            height: 5
          }}
        />
        <Image
          source={imagesCity[id]}
          style={{
            width: 35,
            height: 35
          }}
        />
        <View
          style={{
            width: 5,
            height: 5
          }}
        />
        <View style={[styles.teamColumn, styles.cityColumnName]}>
          <Text style={styles.cityName}>{this.props.city_name}</Text>
        </View>
        <View style={[styles.cityColumn, styles.cityColumnWon]}>
          <Text style={styles.parameter}>{this.props.won}</Text>
        </View>
        <View style={[styles.cityColumn, styles.cityColumnLost]}>
          <Text style={styles.parameter}>{this.props.lost}</Text>
        </View>
        <View style={[styles.cityColumn, styles.cityColumnPercentage]}>
          <Text style={styles.parameter}>
           {pointsDecimal(this.props.points, ".")}
          </Text>
        </View>
      </View>
    );
  }
}

CityGameItem.defaultProps = {
  city_name: "Palermo",
  season: "2019",
  won: 1,
  lost: 0,
  points: 33739
};

export default CityGameItem;
