import React from "react";
import {
  Text,
  Button,
  View,
  Dimensions,
  Platform,
  findNodeHandle,
  TouchableWithoutFeedback
} from "react-native";

import Aux from "../../helpers/Aux";

import Blur from "../../components/Blur/Blur";

import NotificationPoint from "./../../components/NotificationPoint/NotificationPoint";

import TrophiesScreen from "../TrophiesScreen/TrophiesScreen";

import Settings from "./../../config/Settings";
import DeviceInfo from "react-native-device-info";
// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

import { strings } from "../../config/i18n";
import Icon from "react-native-vector-icons/Ionicons";
import IconMenuDrawer from "./../../components/IconMenuDrawer/IconMenuDrawer";

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

class TrophiesScreenBlur extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  componentWillMount() {
    Tracker.trackScreenView("TrophiesScreenBlur.js");
    trackScreenView("TrophiesScreenBlur.js");

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
    // quando ho caricato il componente, posso dire a blur che è possibile fare il blur usando questa variabile
    this.setState({ viewRef: findNodeHandle(this.view) });
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("trophies")}
        </Text>
      ),
      headerRight: <IconMenuDrawer navigation={navigation} />
    };
  };

  changeHeaderTop = page => {
    console.log(page);

    title = "Badges";

    this.props.navigation.setParams({
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {title}
        </Text>
      )
    });
  };

  detailTrophies = trophy => {
    this.props.navigation.navigate("RankingTrophies", { trophy });
  };

  render() {
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />

        <TrophiesScreen
          ref={view => {
            this.view = view;
          }}
          navigation={this.props.navigation}
          changeHeaderTop={this.changeHeaderTop}
          detailTrophies={this.detailTrophies}
        />
        <Blur viewRef={this.state.viewRef} />
      </Aux>
    );
  }
}

export default TrophiesScreenBlur;
