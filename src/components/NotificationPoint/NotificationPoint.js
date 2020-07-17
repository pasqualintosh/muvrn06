/**
 * NotificationPoint è il componente che permette la visualizzazione dei punti
 * ottenuti nel corso dell'attivita, con posizione assoluta e
 * permette di andare nel dettaglio info attivita
 * si usa nelle varie schermate in cui si vuole la notifica
 * si passa navigation per permettere il passaggio ad altri screen
 * <NotificationPoint navigation={this.props.navigation} />
 * @push
 */

import React from "react";
import { Platform, View, Dimensions, TouchableHighlight } from "react-native";
import { connect } from "react-redux";
import { createSelector } from "reselect";

// importo la notifica
import ViewActivityPoint from "../ViewActivityPoint/ViewActivityPoint";
// importo il pacchetto di icone Ionicons
import Icon from "react-native-vector-icons/Ionicons";
import Aux from "../../helpers/Aux";
import { calcolatePoints } from "../../domains/tracking/Reducers";

// la dovrei importare in ogni schermata di un componnente dove potrebbe apparire e poi con redux
// settare una variabile per farla apparire
// oppure usare zIndex e elevation insieme per farla apparire in qualsiasi schermata ma poi devo gestire anche questi parametri per il pulsante centrale

// variabile che all'inizio ha valore 0 ma poi se cambiare solo se i nuovi punti di validazione sono diversi da 0
points = 0;

class NotificationPoint extends React.Component {
  // se clicco nella freccia della notifica punti mi porta alle statistiche complete
  clickPoints = () => {
    console.log("dettaglio punti");
    console.log(this.props);
    this.props.navigation.setParams({
      keyBack: this.props.navigation.state.key,
      routeNameBack: this.props.navigation.state.routeName
    });
    this.props.navigation.navigate("Track", {
      keyBack: this.props.navigation.state.key,
      routeNameBack: this.props.navigation.state.routeName
    });
  };

  constructor() {
    super();
  }

  //  notifica
  // se cambiano i punti validati in redux ovvero sono diversi da 0, per l'attivita compiuta tipo negli ultimi minuti
  // visualizza una notifica con punti e in caso il tipo di attivita svolta

  // punti da visualizzare se ci sono

  notificationPoints = () => {
    if (this.props.activityChoice.type) {
      const newPoint = calcolatePoints(
        this.props.distanceLive,
        this.props.PrecDistanceSameMode,
        this.props.activityChoice.type
      );

      // vedo il tipo di attivita scelta e metto il colore corrispodente alla notifica
      // due colori per fare il gradient
      let color;
      let color1;
      let isMetro = false
      switch (this.props.activityChoice.type) {
        case "Biking":
          {
            color = "#E83475";
            color1 = "#FC6EA1";
          }
          break;
        case "Walking":
          {
            color = "#6CBA7E";
            color1 = "#43C160";
          }
          break;
        case "Public":
          {
            if (this.props.activityChoice.coef === 1200)  {
              isMetro = true
            }
            color = "#FAB21E";
            color1 = "#FFCC00";
          }
          break;
        default:
          {
            color = "rgba(108, 186, 126, 1)";
            color1 = "rgba(108, 186, 126, 1)";
          }
          break;
      }

      return (
        <TouchableHighlight
          style={{
            position: "absolute",
            bottom: 0,
            elevation: 1,
            zIndex: 1
          }}
          onPress={this.clickPoints}
        >
          <ViewActivityPoint
            point={newPoint}
            click={this.clickPoints}
            color={color}
            color1={color1}
            isMetro={isMetro}
          />
        </TouchableHighlight>
      );
    } else {
      return <View />;
    }
  };

  render() {
    return <Aux>{this.notificationPoints()}</Aux>;
  }
}

const Point = connect(state => {
  return {
    distanceLive: state.tracking.distanceLive,
    PrecDistanceSameMode: state.tracking.PrecDistanceSameMode,
    activityChoice: state.tracking.activityChoice
  };
});

export default Point(NotificationPoint);
