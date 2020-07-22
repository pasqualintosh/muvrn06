import React from "react";
import {
  Text,
  Button,
  View,
  Dimensions,
  Platform,
  findNodeHandle,
} from "react-native";
import Aux from "../../helpers/Aux";
import Blur from "../../components/Blur/Blur";
import NotificationPoint from "./../../components/NotificationPoint/NotificationPoint";
import StandingsUniversityScreen from "../StandingsUniversityScreen/StandingsUniversityScreen";
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

class StandingsUniversityScreenBlur extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
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
    };
  };

  componentWillMount() {
    Tracker.trackScreenView("StandingsUniversityScreenBlur.js");
    trackScreenView("StandingsUniversityScreenBlur.js");
  }

  componentDidMount() {
    // quando ho caricato il componente, posso dire a blur che è possibile fare il blur usando questa variabile
    this.setState({ viewRef: findNodeHandle(this.view) });
  }

  render() {
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />

        <StandingsUniversityScreen
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

export default StandingsUniversityScreenBlur;
