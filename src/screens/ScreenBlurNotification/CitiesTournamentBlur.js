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

import CitiesTournamentScreen from "../CitiesTournamentScreen/CitiesTournamentScreen";
import EmptyCityTournament from "../EmptyCityTournament/EmptyCityTournament";
import CitiesTournamentEndScreen from "../CitiesTournamentEndScreen/CitiesTournamentEndScreen";

import DeviceInfo from "react-native-device-info";
// import { Analytics, Hits as GAHits } from "react-native-google-analytics";
import IconMenuDrawer from "./../../components/IconMenuDrawer/IconMenuDrawer";
import { connect } from "react-redux";

import {
  citiesImage,
  imagesCity,
  TournamentCities
} from "./../../components/FriendItem/FriendItem";
import { getProfile } from "./../../domains/login/Selectors";

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

class CitiesTournamentBlur extends React.Component {
  constructor(props) {
    super(props);

    // data d'inizio secondo torneo
    // 2019-09-23T04:30:00Z
    // 2019-09-16T04:00:00Z
    let startTournament = new Date("2019-09-23T04:30:00Z").getTime();
    console.log(startTournament);

    let today = new Date();

    let e_msec = startTournament - today;
    console.log(e_msec);
    let e_mins = Math.floor(e_msec / 60000);
    let e_hrs = Math.floor(e_mins / 60);
    let e_days = Math.floor(e_hrs / 24);
    let e_a_hrs = e_hrs - e_days * 24;
    let e_a_mins = Math.floor(e_msec / 60000) - e_hrs * 60;
    console.log(e_a_mins);

    if (e_days < 0) {
      this.state = { viewRef: null, startTournament: true };
    } else {
      this.state = { viewRef: null, startTournament: false };
    }
  }

  static navigationOptions = props => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {"Sustainable City Tournament"}
        </Text>
      ),

      headerRight: <IconMenuDrawer navigation={props.navigation} />
    };
  };

  startOpenTournament = () => {
    this.setState({
      startTournament: true
    });
  };

  componentWillMount() {
    Tracker.trackScreenView("CitiesTournamentBlur.js");
    trackScreenView("CitiesTournamentBlur.js");
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

  render() {
    let city = this.props.infoProfile.city
      ? this.props.infoProfile.city.city_name
        ? this.props.infoProfile.city.city_name
        : ""
      : "";
    let id = 1;

    if (city.length) {
      // vedo se è tra le città pilota
      id = citiesImage(city);
    }
    const cityInTournament = TournamentCities(city);

    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />
        {cityInTournament ? (
          this.state.startTournament ? (
            <CitiesTournamentScreen
              ref={view => {
                this.view = view;
              }}
              navigation={this.props.navigation}
              infoProfile={this.props.infoProfile}
              cityInTournament={cityInTournament}
              id={id}
              city={city}
            />
          ) : (
            <EmptyCityTournament
              ref={view => {
                this.view = view;
              }}
              navigation={this.props.navigation}
              infoProfile={this.props.infoProfile}
              cityInTournament={cityInTournament}
              id={id}
              city={city}
              // startOpenTournament={this.startOpenTournament()}
            />
          )
        ) : (
          <EmptyCityTournament
            ref={view => {
              this.view = view;
            }}
            navigation={this.props.navigation}
            infoProfile={this.props.infoProfile}
            cityInTournament={cityInTournament}
            id={id}
            city={city}
          />
        )}

        {/* <CitiesTournamentEndScreen
          ref={view => {
            this.view = view;
          }}
          navigation={this.props.navigation}
          infoProfile={this.props.infoProfile}
          cityInTournament={cityInTournament}
          id={id}
          city={city}
        /> */}

        <Blur viewRef={this.state.viewRef} />
      </Aux>
    );
  }
}

const withData = connect(state => {
  // prendo il profilo
  return {
    infoProfile: getProfile(state)
  };
});

export default withData(CitiesTournamentBlur);
