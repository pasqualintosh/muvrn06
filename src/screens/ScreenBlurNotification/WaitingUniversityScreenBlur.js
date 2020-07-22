import React from "react";
import { Text, Platform, findNodeHandle } from "react-native";
import Aux from "../../helpers/Aux";
import Blur from "../../components/Blur/Blur";
import NotificationPoint from "./../../components/NotificationPoint/NotificationPoint";
import WaitingUniversityScreen from "../WaitingUniversityScreen/WaitingUniversityScreen";
import IconMenuDrawer from "./../../components/IconMenuDrawer/IconMenuDrawer";
import { strings } from "../../config/i18n";
import Settings from "./../../config/Settings";
import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings,
} from "react-native-google-analytics-bridge";
let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);
import analytics from "@react-native-firebase/analytics";
import EmptyTournament from "../EmptyTournament/EmptyTournament";
async function trackScreenView(screen) {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
}

class WaitingUniversityScreenBlur extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  componentWillMount() {
    Tracker.trackScreenView("WaitingUniversityScreenBlur.js");
    trackScreenView("WaitingUniversityScreenBlur.js");
  }

  componentDidMount() {
    this.setState({ viewRef: findNodeHandle(this.view) });
  }

  static navigationOptions = ({ navigation }) => {
    let title = "";
    try {
      title = navigation.state.params.university.name;
    } catch (error) {
      console.log(error);
    }

    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0,
          }}
        >
          {title == "" ? strings("id_2_01") : title}
        </Text>
      ),
      headerRight: <IconMenuDrawer navigation={navigation} />,
    };
  };

  render() {
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />

        <WaitingUniversityScreen
          ref={(view) => {
            this.view = view;
          }}
          navigation={this.props.navigation}
        />
        <Blur viewRef={this.state.viewRef} />
      </Aux>
    );
  }
}

export default WaitingUniversityScreenBlur;
