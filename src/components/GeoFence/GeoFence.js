import React from "react";
import { View, Text } from "react-native";

import GeoFencing from "react-native-geo-fencing";

class GeoFence extends React.Component {
  componentDidMount() {
    const polygon = [
      { lat: 3.1336599385978805, lng: 101.31866455078125 },
      { lat: 3.3091633559540123, lng: 101.66198730468757 },
      { lat: 3.091150714460597, lng: 101.92977905273438 },
      { lat: 3.1336599385978805, lng: 101.31866455078125 } // last point has to be same as first point
    ];

    // questo è un punto interno
    let point = {
      lat: 3.2,
      lng: 101.664111328125
    };

    GeoFencing.containsLocation(point, polygon)
      .then(() => alert("point is within polygon"))
      .catch(() => alert("point is NOT within polygon"));
  }
  render() {
    return (
      <View>
        <Text>GeoFencing</Text>
      </View>
    );
  }
}

export default GeoFence;
