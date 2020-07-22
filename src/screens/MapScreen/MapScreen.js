/**
 * scena per il riassunto della tratta
 * lo zoom si adatta a seconda le coordinate settate in fitToCoordinates
 * con il comppnente MapView.Polyline creiamo un tratto che unisce le coordinate utile per sapere il percorso effettuato
 * MapView.Marker componente per mettere dei punti nella mappa utili per sapere dove è inziato il tracciamento e dove è finito
 * @author push
 */

import React from "react";
import { View, Text, Alert, Platform, Dimensions } from "react-native";
import { NetInfo } from "@react-native-community/netinfo";

import { connect } from "react-redux";
import ResumeMap from "./../../components/ResumeMap/ResumeMap";
import IncreasedParameter from "./../../components/IncreasedParameter/IncreasedParameter";
import GeoFence from "./../../components/GeoFence/GeoFence";
import { styles } from "./Style";

import Icon from "react-native-vector-icons/Ionicons";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import Aux from "../../helpers/Aux";

import {

  getNumSubTripState
} from "./../../domains/tracking/Selectors";

// metodo per sapere quante sotto trace compongono la route corrente
import { sumRoute } from "./../../domains/tracking/ActionCreators";
import { strings } from "../../config/i18n";

class MapScreen extends React.Component {
  constructor(props) {
    super(props);

    this.mapRef = null;
    this.state = {
      NumSegment: 0
    };
  }

  static navigationOptions = {
    headerTitle: (
      <Text
        style={{
          left: Platform.OS == "android" ? 20 : 0
        }}
      >
        {strings("id_1_06")}
      </Text>
    )
  };

  componentDidUpdate() {
    // se ho premuto stop e quindi non c'e nessuno tipo di attivita scelta ritorno alla schermata precedente
    // e non il live
    if (this.props.trackingState.activityChoice.type === "") {
      this.props.navigation.goBack();
    }
  }

  componentWillReceiveProps(props) {
    const { activityChoice } = props.trackingState;
    if (props.trackingState.activityChoice.type === "") {
      props.navigation.goBack();
    } else if (
      activityChoice.type &&
      this.props.trackingState.activityChoice.type != activityChoice.type &&
      activityChoice.type !== ""
    ) {
      // this.animation.play();
      // this.props.navigation.goBack();

      // se cambio mezzo, ricalcolo tutte le informazioni
      this.sumPreviousRoute(props);
    }
  }

  sumPreviousRoute = props => {
    const { route, routeAnalyzed, PreviousRoute } = props.trackingState;

    // vedo quante sono le sottoroute, senza fare controlli di validita quindi metto true
    // cambio l'ordine dato che le ultime route sono quelle che devo controllare
    let NumSegment = this.state.NumSegment;
    console.log(NumSegment);
    if (route.length) {
      // console.log("sumsegment ");
      const routeControl = [...PreviousRoute, { route, routeAnalyzed }];
      NumSegment = props.numSubTrip
      // console.log("sumsegment calcolato " + NumSegment);
    }
    // se ci sono segmenti recupera questi dati
    if (NumSegment) {
      let Lastroute;
      let LastrouteAnalyzed;
      let activity;
      const lengthPreviousRoute = PreviousRoute.length;

      for (i = lengthPreviousRoute; i > lengthPreviousRoute - NumSegment; i--) {
        console.log("prendo dati ");
        // Parto dalla fine e aggiungo le tracce precedenti
        console.log(PreviousRoute[i - 1]);
        const { route, routeAnalyzed, activityChoice } = PreviousRoute[i - 1];

        if (i === lengthPreviousRoute) {
          Lastroute = [{ route }];
          LastrouteAnalyzed = [{ route: routeAnalyzed }];
          activity = [{ activityChoice: activityChoice.type }];
        } else {
          // quella all'inizio è la piu vecchia ovvero l'inizio della route
          Lastroute = [{ route }, ...Lastroute];
          LastrouteAnalyzed = [{ route: routeAnalyzed }, ...LastrouteAnalyzed];
          activity = [{ activityChoice: activityChoice.type }, ...activity];
        }
        console.log("route aggiornata ");
      }
      this.setState({
        Lastroute,
        LastrouteAnalyzed,
        activity,
        NumSegment
      });
    }
  };

  componentDidMount() {
    if (!this.props.connectionState.isConnected) {
      Alert.alert(
        "There seems to be no internet connection.\nMUV will continue to work in offline mode"
      );
    }
    this.sumPreviousRoute(this.props);
  }
  renderMapView() {
    // prendo i dati per fare il recap
    const {
      routeAnalyzed,
      route,
      routeNotvalid,
      activityChoice
    } = this.props.trackingState;
    // vedo quante sono le sottoroute, senza fare controlli di validita quindi metto true
    // cambio l'ordine dato che le ultime route sono quelle che devo controllare
    // unisco le route dei segment precedenti se esistono
    // con proprieta route

    console.log("unisco i segment ");
    let Lastroute = [{ route }];
    let LastrouteAnalyzed = [{ route: routeAnalyzed }];
    let activity = [{ activityChoice: activityChoice.type }];
    if (this.state.NumSegment) {
      // Parto dalla fine e aggiungo le tracce precedenti

      // quella all'inizio è la piu vecchia ovvero l'inizio della route
      Lastroute = [...this.state.Lastroute, ...Lastroute];
      LastrouteAnalyzed = [
        ...this.state.LastrouteAnalyzed,
        ...LastrouteAnalyzed
      ];
      activity = [...this.state.activity, ...activity];
      console.log("route aggiornata ");
    }

    // se ho trace precedenti o almeno trace
    if (LastrouteAnalyzed[0].route.length > 1 || this.state.NumSegment > 0) {
      // mappa che comprende sia la tratta analizzata che la tratta in corso non analizzata
      return (
        <ResumeMap
          trackingState={[
            ...this.props.trackingState.routeAnalyzed,
            ...this.props.trackingState.route
          ]}
          Lastroute={Lastroute}
          LastrouteAnalyzed={LastrouteAnalyzed}
          NumSegment={this.state.NumSegment}
          activity={activity}
        />
      );
    } else if (Lastroute[0].route.length > 1) {
      return (
        <ResumeMap
          Lastroute={Lastroute}
          LastrouteAnalyzed={LastrouteAnalyzed}
          NumSegment={this.state.NumSegment}
          activity={activity}
        />
      );
    } else if (routeNotvalid.length > 0) {
      return (
        <ResumeMap
          Lastroute={[{ route: routeNotvalid }]}
          LastrouteAnalyzed={LastrouteAnalyzed}
          NumSegment={this.state.NumSegment}
          activity={activity}
        />
      );
    } else {
      return <Text>No activity running</Text>;
    }
  }
  render() {
    console.log(this.props);
    return (
      <View style={[styles.container, { backgroundColor: "transparent" }]}>
        {/* 
        <IncreasedParameter
          title={"title"}
          subTitle={"subTitle"}
          content={"description"}
          number={"+45"}
          value={"pt"}
          imageSource={require("../../assets/images/bike-icon.png")}
        />
         */}
        {/* <GeoFence />  */}
        {this.renderMapView()}
      </View>
    );
  }
}

const withTracking = connect(state => {
  return {
    trackingState: state.tracking,
    connectionState: state.connection,
    numSubTrip: getNumSubTripState(state),
  };
});

export default withTracking(MapScreen);
