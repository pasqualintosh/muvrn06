import React from "react";
import { View, Text } from "react-native";
import { NetInfo } from "@react-native-community/netinfo";

import { createStackNavigator } from "react-navigation";
import TabWithButton from "../TabWithButton/TabWithButton";
import Welcome from "../Welcome/Welcome";
import IntroScreen from "../IntroScreen/IntroScreen";
import SurveyScreens from "../SurveyScreens/SurveyScreens";
import SelectCityScreen from "../SelectCityScreen/SelectCityScreen";
import Login from "../Login/Login";

import MapRoutine from "./../MapRoutine/MapRoutine";

import { connect } from "react-redux";
import { changeConnectionStatus } from "./../../domains/connection/ActionCreators";
import { RefreshToken, logOut } from "./../../domains/login/ActionCreators";

const Stack = createStackNavigator(
  {
    Login: {
      screen: Login
    },
    Welcome: {
      screen: IntroScreen
    },
    Survey: {
      screen: SurveyScreens
    },
    Home: {
      screen: TabWithButton
    },
    SelectCity: {
      screen: SelectCityScreen
    },
    SelectMostFrequentRoutePoint: {
      screen: MapRoutine
    }
  },
  {
    initialRouteName: "Login"
  }
);

const StackHome = createStackNavigator(
  {
    Login: {
      screen: Login
    },
    Welcome: {
      screen: IntroScreen
    },
    Survey: {
      screen: SurveyScreens
    },
    Home: {
      screen: TabWithButton
    },
    SelectCity: {
      screen: SelectCityScreen
    },
    SelectMostFrequentRoutePoint: {
      screen: MapRoutine
    }
  },
  {
    initialRouteName: "Home"
  }
);

class StackMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    // la prima volta all'avvio dell'app
    // NetInfo.getConnectionInfo().then(connectionInfo => {
    //   this.props.dispatch(changeConnectionStatus(connectionInfo));
    // });
  }

  componentDidMount() {
    // gestore eventi se cambia la connessione chiamo la funzione che manda un azione per cambiare lo stato su redux
    // NetInfo.addEventListener("connectionChange", this.handleChange);
    // // se si avvia l'app si effettua il refresh token se sono presenti username e password messe
    // // altrimenti si fa il login
    // this.props.dispatch(logOut());
    // this.props.dispatch(RefreshToken());
  }

  /* 
  componentWillUnmount() {
    NetInfo.removeEventListener("change", this.handleChange);
  } 
  */

  // aggiorno lo stato con la nuova connessione
  handleChange(isConnected) {
    this.props.dispatch(changeConnectionStatus(isConnected));
  }

  render() {
    return <Stack />;
  }
}

const connectionInfo = connect(state => {
  return {
    username: state.login.username ? state.login.username : false
  };
});

export default connectionInfo(StackMenu);
