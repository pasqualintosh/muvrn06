import React, { Component } from "react";
import ComponentAnimatedPlay from "../ComponentAnimatedPlay/ComponentAnimatedPlay";
import ComponentAnimatedStop from "../ComponentAnimatedStop/ComponentAnimatedStop";
import BackgroundGeolocation from './../../helpers/geolocation';
import { connect } from "react-redux";

import { start, stop } from "./../../domains/tracking/ActionCreators";

// import { html } from "../../helpers/BackgroundTaskRunner";
import Aux from "../../helpers/Aux";
import { createSelector } from "reselect";


class ComponentPlayAndStopDriven extends React.Component {
  // play: per sapere se sono in modalita di play con il tipo di mezzo o di pausa con stop e riprendi
  constructor() {
    super();
    this.state = {
      play: false,
      type: "",
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
      if (this.props.closeOverlay) {
        this.props.closeOverlay()
        //this.props.navigation.navigate('Track')
      } else {
      this.props.dispatch(start(type, coef, threshold, navigation));
      this.setState(prevState => {
        return { type };
      });
    }
    } else {
      this.props.dispatch(stop());
      this.setState(prevState => {
        return { type };
      });
    }
  };

  // aggiorno il tasto quando cambia play
  componentWillReceiveProps(props) {
    if (this.props.play !== props.play) {
      this.changeStatusButton(props.play);
    }
  }

  changeStatusButton = play => {
    Pulsante = (
      <ComponentAnimatedPlay
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
        <ComponentAnimatedStop
          style={{
            ...this.props.style
          }}
          selectTrasport={this.handleChangeButton}
          type={this.state.type}
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

const getPlay = state => state.tracking.activityChoice.type;
const getPlayPrevious = state => state.tracking.previousType;

const getPlayState = createSelector(
  [getPlay],
  type => type.length
);

const getPlayPreviousState = createSelector(
  [getPlayPrevious],
  type => (type ? type : "Walking")
);

const startAndStop = connect(state => {
  // se l'attivita è stata settata allra deve spuntare il tasto stop e non il play

  return {
    play: getPlayState(state),
    playPrevious: getPlayPreviousState(state)
  };
});

export default startAndStop(ComponentPlayAndStopDriven);
