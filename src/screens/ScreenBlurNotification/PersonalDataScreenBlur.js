import React from "react";
import {
  Text,
  Button,
  View,
  Dimensions,
  Platform,
  findNodeHandle,
  Alert
} from "react-native";
import Aux from "../../helpers/Aux";
import Blur from "../../components/Blur/Blur";
import NotificationPoint from "./../../components/NotificationPoint/NotificationPoint";
import PersonalDataScreen from "../PersonalDataScreen/PersonalDataScreen";
import IconMenuDrawer from "./../../components/IconMenuDrawer/IconMenuDrawer";

import { strings } from "../../config/i18n";
import Settings from "./../../config/Settings";

import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from "react-native-google-analytics-bridge";

let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);

import analytics from "@react-native-firebase/analytics";
async function trackScreenView(screen) {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
}

class PersonalDataScreenBlur extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  componentDidMount() {
    Tracker.trackScreenView("PersonalDataScreenBlur.js");
    trackScreenView("PersonalDataScreenBlur.js");

    // quando ho caricato il componente, posso dire a blur che è possibile fare il blur usando questa variabile
    this.setState({ viewRef: findNodeHandle(this.view) });
    /* // salvo il collegamento alla funzione per mandare l'azione in logOut di navigation
    // cosi poi lo posso utilizzare in navigation of navigationOptions
    this.props.navigation.setParams({
      logOut: this.actionLogOut
    }); */
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("id_13_49")}
        </Text>
      ),
      headerRight: <IconMenuDrawer navigation={navigation} />
      // headerRight: <LogOut />
    };
  };

  render() {
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />

        <PersonalDataScreen
          ref={view => {
            this.view = view;
          }}
          navigation={this.props.navigation}
        />
        <Blur viewRef={this.state.viewRef} />
      </Aux>
    );
  }
}

export default PersonalDataScreenBlur;
