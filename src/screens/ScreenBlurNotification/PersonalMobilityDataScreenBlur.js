import React from "react";
import {
  Text,
  Button,
  View,
  Dimensions,
  Platform,
  findNodeHandle
} from "react-native";

import Aux from "../../helpers/Aux";

import Blur from "../../components/Blur/Blur";

import NotificationPoint from "./../../components/NotificationPoint/NotificationPoint";

import PersonalMobilityDataScreen from "../PersonalDataScreen/PersonalMobilityDataScreen";

import Settings from "./../../config/Settings";

// import { Analytics, Hits as GAHits } from "react-native-google-analytics";
import IconMenuDrawer from "./../../components/IconMenuDrawer/IconMenuDrawer";
import { strings } from "../../config/i18n";

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

class PersonalMobilityDataScreenBlur extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("garage")}
        </Text>
      ),
      headerLeft: null,
      headerRight: <IconMenuDrawer navigation={navigation} />
    };
  };

  componentWillMount() {
    Tracker.trackScreenView("PersonalMobilityDataScreenBlur.js");
    trackScreenView("PersonalMobilityDataScreenBlur.js");

   
  }

  componentDidMount() {
    // quando ho caricato il componente, posso dire a blur che è possibile fare il blur usando questa variabile
    this.setState({ viewRef: findNodeHandle(this.view) });
  }

  render() {
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />

        <PersonalMobilityDataScreen
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

export default PersonalMobilityDataScreenBlur;
