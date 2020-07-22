import React from "react";
import { Text, Platform, findNodeHandle } from "react-native";
import Aux from "../../helpers/Aux";
import Blur from "../../components/Blur/Blur";
import NotificationPoint from "./../../components/NotificationPoint/NotificationPoint";
import TeamScreen from "../TeamScreen/TeamScreen";
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

class TeamScreenBlur extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  componentWillMount() {
    Tracker.trackScreenView("TeamScreenBlur.js");
    trackScreenView("TeamScreenBlur.js");
  }

  componentDidMount() {
    this.setState({ viewRef: findNodeHandle(this.view) });
  }

  getTitleName = () => {
    try {
      this.university = this.props.navigation.state.params.university;
      this.university = this.props.university;
    } catch (error) {
      console.log(error);
      return "";
    }
    return this.university.name;
  };

  static navigationOptions = ({ navigation }) => {
    let title = "";
    try {
      title = navigation.state.params.university.name;
    } catch (error) {
      console.log(error);
    }
    return {
      headerLeft: null,
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

        <TeamScreen
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

export default TeamScreenBlur;
