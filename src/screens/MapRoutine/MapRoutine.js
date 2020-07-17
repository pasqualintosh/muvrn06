/**
 * scena per il riassunto della tratta
 * lo zoom si adatta a seconda le coordinate settate in fitToCoordinates
 * con il comppnente MapView.Polyline creiamo un tratto che unisce le coordinate utile per sapere il percorso effettuato
 * MapView.Marker componente per mettere dei punti nella mappa utili per sapere dove è inziato il tracciamento e dove è finito
 * @author push
 */

import React from "react";
import { Text, Platform, BackHandler } from "react-native";

import DailyRoutineMap from "../../components/DailyRoutineMap/DailyRoutineMap";

class MapRoutine extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Text
        style={{
          left: Platform.OS == "android" ? 20 : 0
        }}
      >
        {typeof navigation.state.params === "undefined" ||
        typeof navigation.state.params.title === "undefined"
          ? "Select start of routine"
          : navigation.state.params.title}
      </Text>
    )
  });

  render() {
    const changeRoutesPivot = this.props.navigation.getParam(
      "changeRoutesPivot"
    );

    return (
      <DailyRoutineMap
        navigation={this.props.navigation}
        changeRoutesPivot={changeRoutesPivot}
      />
    );
  }
}

export default MapRoutine;
