import React from "react";
import { View, Text, Button, Dimensions } from "react-native";
import MapView from "react-native-maps";

// componente utile per il riassunto della tratta
// Mappa statica ovvero visualizza una porzione di mappa che non puo essere spostata
// lo zoom si adatta a seconda le coordinate settate in fitToCoordinates
// con il comppnente MapView.Polyline creiamo un tratto che unisce le coordinate utile per sapere il percorso effettuato
// MapView.Marker componente per mettere dei punti nella mappa utili per sapere dove è inziato il tracciamento e dove è finito

class MapStatic extends React.Component {
  constructor() {
    super();
    this.mapRef = null;
  }

  render() {
    return (
      <View>
        <MapView
          ref={ref => {
            this.mapRef = ref;
          }}
          style={{
            width: Dimensions.get("window").width,
            height: 300
          }}
          onMapReady={() =>
            this.mapRef.fitToCoordinates(
              [
                { latitude: 37.78825, longitude: -122.4324 },
                { latitude: 37.8, longitude: -122.46 }
              ],
              {
                edgePadding: { top: 20, right: 20, bottom: 20, left: 20 },
                animated: false
              }
            )
          }
          cacheEnabled
          loadingEnabled
        >
          <MapView.Polyline
            coordinates={[
              { latitude: 37.78825, longitude: -122.4324 },
              { latitude: 37.8, longitude: -122.46 }
            ]}
            strokeColor="red"
          />
          <MapView.Marker
            coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          />
          <MapView.Marker coordinate={{ latitude: 37.8, longitude: -122.46 }} />
        </MapView>
      </View>
    );
  }
}

export default MapStatic;
