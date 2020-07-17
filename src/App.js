/**
 * App.js è il componente di ingresso dell'app
 * in futuro dovrà essere collegato al sistema di navigazione
 * @push
 */

import React from "react";
import { Platform, StatusBar } from "react-native";
import { Provider } from "react-redux";
import { store, persistor } from "./store";

import Menu from "./screens/TabNavigator/TabNavigator";
import TabNavigator from "./screens/TabNavigator/TabNavigator";
import { PersistGate } from "redux-persist/integration/react";

// cosi lo SplashScreen viene tolto quando l'app ha completamente caricato
import SplashScreen from "react-native-splash-screen";
import Welcome from "./screens/Welcome/Welcome";
import ButtonPlayOrStop from "./components/ButtonPlayOrStop/ButtonPlayOrStop";

import Settings from "./config/Settings";
import DeviceInfo from "react-native-device-info";
// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

import { Client } from "bugsnag-react-native";
const bugsnag = new Client("58b3b39beb78eba9efdc2d08aeb15d84");

import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from "react-native-google-analytics-bridge";

let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {}

  componentWillMount() {
    // Tracker.trackScreenView("App.js");
    // const ga = new Analytics(
    //   Settings.analyticsCode,
    //   DeviceInfo.getUniqueID(),
    //   1,
    //   DeviceInfo.getUserAgent()
    // );
    // const screenView = new GAHits.ScreenView(
    //   Settings.analyticsAppName,
    //   this.constructor.name,
    //   DeviceInfo.getReadableVersion(),
    //   DeviceInfo.getBundleId()
    // );
    // ga.send(screenView);
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
            left: 154
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
          <Menu />
        </PersistGate>
      </Provider>
    );
  }
}
