import React from "react";
import { View, Text, Platform, Dimensions } from "react-native";
import MapView from "react-native-maps";

class SponsorMapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.mapRef = null;
  }

  static navigationOptions = {
    headerTitle: (
      <Text
        style={{
          left: Platform.OS == "android" ? 20 : 0
        }}
      >
        Map
      </Text>
    )
  };

  render() {
    return (
      <MapView
        ref={ref => {
          this.mapRef = ref;
        }}
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height
        }}
        onMapReady={() => {
          this.mapRef.fitToCoordinates(
            [
              {
                latitude: this.props.navigation.state.params.latitude - 0.0005,
                longitude:
                  this.props.navigation.state.params.longitude - 0.0005,
                title: "Min",
                key: 1
              },
              {
                latitude: this.props.navigation.state.params.latitude + 0.0005,
                longitude:
                  this.props.navigation.state.params.longitude + 0.0005,
                title: "Max",
                key: 2
              }
            ],
            {
              edgePadding: { top: 40, right: 20, bottom: 120, left: 20 },
              animated: false
            }
          );
        }}
        initialRegion={{
          latitude: this.props.navigation.state.params.latitude,
          longitude: this.props.navigation.state.params.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
        }}
        loadingEnabled
      >
        <MapView.Marker
          coordinate={{
            latitude: this.props.navigation.state.params.latitude,
            longitude: this.props.navigation.state.params.longitude
          }}
          image={require("./../../assets/images/Map_pin_1.png")}
        />
      </MapView>
    );
  }
}

export default SponsorMapScreen;
