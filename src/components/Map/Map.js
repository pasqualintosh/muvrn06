/**
 * Componente che fa d'esempio per l'utilizzo della mappa
 * usato per demo
 * @push
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";

import { styles } from "./Style";

export default class Map extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.containerMapView}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
      </View>
    );
  }
}
