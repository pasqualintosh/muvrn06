import React, { Component } from "react";
import ComponentAnimatedPlay from "../ComponentAnimatedPlay/ComponentAnimatedPlay";
import ComponentAnimatedPlayWithAuto from "../ComponentAnimatedPlayWithAuto/ComponentAnimatedPlayWithAuto";
import ComponentAnimatedStop from "../ComponentAnimatedStop/ComponentAnimatedStop";
import ComponentAnimatedStopWithAuto from "../ComponentAnimatedStopWithAuto/ComponentAnimatedStopWithAuto";
import BackgroundGeolocation from "./../../helpers/geolocation";
import { connect } from "react-redux";

import { start, stop } from "./../../domains/tracking/ActionCreators";
import {
  getPlayState,
  getPlayPreviousState
} from "./../../domains/tracking/Selectors";

// import { html } from "../../helpers/BackgroundTaskRunner";
import Aux from "../../helpers/Aux";
import { createSelector } from "reselect";

class ButtonPlayOrStop extends React.Component {
  // play: per sapere se sono in modalita di play con il tipo di mezzo o di pausa con stop e riprendi
  constructor() {
    super();
    this.state = {
      play: false,
      type: "",
      coef: 0,
      Button: null
    };
  }

  // cosi sincronizzo la grafica se il processo è in corso
  componentWillMount() {
    BackgroundGeolocation.checkStatus(status => {
      this.setState(prevState => {
        return { play: status.isRunning };
      });
    });
    this.changeStatusButton(this.props.play);
  }

  // relativo al cambio di pulsante con play o stop
  // controllo se il gps è attivo, altrimenti il cambio dell'icona con stop non deve cambiare
  // ovviamente se è gia attivo non c'e bisogno che controllo lo status ma controllo il play ovvero è gia stato attivato una volta
  handleChangeButton = (type, coef, threshold, navigation) => {
    if (!this.props.play) {
      start(type, coef, threshold, navigation);
      this.setState(prevState => {
        return { type, coef };
      });
    } else {
      stop();
      this.setState(prevState => {
        return { type, coef };
      });
    }
  };

  // aggiorno il tasto quando cambia play
  componentWillReceiveProps(props) {
    if (this.props.play !== props.play) {
      this.changeStatusButton(props.play);
    }
  }

  //   MODAL_SPLIT_CHOICES
  // (0, ''),
  // (1, 'Walking')
  // (2, 'Biking')
  // (3, 'Public')
  // (4, 'Pooling')
  // (5, 'Car')
  // (6, 'Motorbike')
  // (7, ‘Train’)
  // (8, ‘Metro’)
  // (9, ‘Bus_Tram’)

  changeStatusButton = play => {
    Pulsante = (
      <ComponentAnimatedPlayWithAuto
        style={{
          ...this.props.style
        }}
        selectTrasport={this.handleChangeButton}
        styleView={this.props.styleView}
        navigation={this.props.navigation}
        playPrevious={this.props.playPrevious}
      />
    );
    if (play) {
      Pulsante = (
        <ComponentAnimatedStopWithAuto
          style={{
            ...this.props.style
          }}
          selectTrasport={this.handleChangeButton}
          type={this.state.type}
          coef={this.state.coef}
          styleView={this.props.styleView}
        />
      );
    }
    this.setState({ Pulsante: Pulsante });
  };

  render() {
    return <Aux>{this.state.Pulsante}</Aux>;
  }
}

const startAndStop = connect(state => {
  // se l'attivita è stata settata allra deve spuntare il tasto stop e non il play

  return {
    play: getPlayState(state),
    playPrevious: getPlayPreviousState(state)
  };
});

export default startAndStop(ButtonPlayOrStop);
