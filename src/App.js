/**
 * App.js è il componente di ingresso dell'app
 * in futuro dovrà essere collegato al sistema di navigazione
 * @push
 */

import React from "react";
import { Platform, StatusBar, YellowBox } from "react-native";
import { Provider } from "react-redux";
import { store, persistor } from "./store";

import Menu from "./screens/TabNavigator/TabNavigator";
// import Menu from "./screens/TabNavigator/TabNavigatorV3";
import {
  createAppContainer
} from "react-navigation";
const AppContainer = createAppContainer(Menu);
// import Menu from "./screens/BottomTab/BottomTab";
// import TabNavigator from "./screens/TabNavigator/TabNavigator";
import { PersistGate } from "redux-persist/integration/react";

// cosi lo SplashScreen viene tolto quando l'app ha completamente caricato
import SplashScreen from "react-native-splash-screen";
import Welcome from "./screens/Welcome/Welcome";
import ButtonPlayOrStop from "./components/ButtonPlayOrStop/ButtonPlayOrStop";

import Settings from "./config/Settings";
import WebService from "./config/WebService";
// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

import { Client } from "bugsnag-react-native";
const bugsnag = new Client(WebService.BugsnagAppId);

import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings,
} from "react-native-google-analytics-bridge";

let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() { }

  componentWillMount() {
    console.disableYellowBox = true;
  }

  componentDidMount() {
    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen

    SplashScreen.hide();
  }

  renderAndroidAnimatedTabButton() {
    if (Platform.OS == "android") {
      return (
        <ButtonPlayOrStop
          style={{
            bottom: 6,
            left: 154,
          }}
        />
      );
    }
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <AppContainer />
        </PersistGate>
      </Provider>
    );
  }
}