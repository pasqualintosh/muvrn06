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
import TournamentsScreen from "../TournamentsScreen/TournamentsScreen";
import ChooseTeamScreen from "../ChooseTeamScreen/ChooseTeamScreen";
import TeamScreen from "../TeamScreen/TeamScreen";

// import { Analytics, Hits as GAHits } from "react-native-google-analytics";
import IconMenuDrawer from "./../../components/IconMenuDrawer/IconMenuDrawer";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import {
  citiesImage,
  imagesCity,
  TournamentCities,
} from "./../../components/FriendItem/FriendItem";
import { getProfile } from "./../../domains/login/Selectors";
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

class CitiesTournamentBlur extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show_university_screen: false,
      university: {},
      allowed_tournament: {}, // SINGOLARE
      // allowed_tournaments: [], // PLURALE
      teams_by_tournament: [],
    };

    let startTournament = new Date("2019-09-23T04:30:00Z").getTime();
    let today = new Date();
    let e_msec = startTournament - today;
    let e_mins = Math.floor(e_msec / 60000);
    let e_hrs = Math.floor(e_mins / 60);
    let e_days = Math.floor(e_hrs / 24);
    let e_a_hrs = e_hrs - e_days * 24;
    let e_a_mins = Math.floor(e_msec / 60000) - e_hrs * 60;

    if (e_days < 0) {
      this.state = { viewRef: null, startTournament: true };
    } else {
      this.state = { viewRef: null, startTournament: false };
    }
  }

  static navigationOptions = (props) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0,
          }}
        >
          {strings("id_2_01")}
        </Text>
      ),

      headerRight: <IconMenuDrawer navigation={props.navigation} />,
    };
  };

  startOpenTournament = () => {
    this.setState({
      startTournament: true,
    });
  };

  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        allowed_tournament: nextProps.allowedTournamentState,
        teams_by_tournament: [...nextProps.teamsByTournamentState],
      },
      () => {
        try {
        } catch (error) {
          console.log(error);
        }
      }
    );
  }

  componentWillMount() {
    Tracker.trackScreenView("CitiesTournamentBlur.js");
    trackScreenView("CitiesTournamentBlur.js");
    this.setState(
      {
        allowed_tournament: this.props.allowedTournamentState,
        teams_by_tournament: [...this.props.teamsByTournamentState],
      },
      () => {
        try {
        } catch (error) {
          console.log(error);
        }
      }
    );
  }

  componentDidMount() {
    this.setState({ viewRef: findNodeHandle(this.view) });
  }

  renderUniversityListOrDetail() {
    if (this.state.show_university_screen) {
      return (
        <TeamScreen
          ref={(view) => {
            this.view = view;
          }}
          navigation={this.props.navigation}
          university={this.state.university}
        />
      );
    } else if (this.state.allowed_tournament.length > 0) {
      return (
        <ChooseTeamScreen
          ref={(view) => {
            this.view = view;
          }}
          navigation={this.props.navigation}
        />
      );
    } else
      return (
        <TournamentsScreen
          ref={(view) => {
            this.view = view;
          }}
          navigation={this.props.navigation}
        />
      );
  }

  renderAllTournamentOrMyTournament() {
    if (this.state.show_university_screen) {
      return (
        <TeamScreen
          ref={(view) => {
            this.view = view;
          }}
          navigation={this.props.navigation}
          university={this.state.university}
        />
      );
    } else {
      return (
        <TournamentsScreen
          ref={(view) => {
            this.view = view;
          }}
          navigation={this.props.navigation}
        />
      );
    }
  }

  render() {
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />
        {this.renderUniversityListOrDetail()}
        {/* <EmptyTournament /> */}

        <Blur
          viewRef={this.state.viewRef}
          ref={(view) => {
            this.view = view;
          }}
          navigation={this.props.navigation}
        />
      </Aux>
    );
  }
}

const getAllowedTournaments = (state) =>
  state.tournaments.allowed_tournaments
    ? state.tournaments.allowed_tournaments
    : [];

const getTeamsByTournaments = (state) =>
  state.tournaments.teams_by_tournament
    ? state.tournaments.teams_by_tournament
    : [];

const getTeamsEnrolled = (state) =>
  state.tournaments.tournament_qualification_scores
    ? state.tournaments.tournament_qualification_scores
    : [];

/**
 * per facilitarmi la vita per ora ritorno solo il 1mo elemento
 */
const getAllowedTournamentsState = createSelector(
  getAllowedTournaments,
  (allowed_tournaments) => {
    if (allowed_tournaments.length > 0) return allowed_tournaments[0];
    else return {};
  }
);

/**
 * per facilitarmi la vita per ora ritorno solo team del 1mo torneo
 */
const getTeamsByTournamentsState = createSelector(
  [getAllowedTournaments, getTeamsByTournaments],
  (allowed_tournaments, teams_by_tournament) => {
    if (allowed_tournaments.length > 0) {
      let first_tournament = allowed_tournaments[0].id;
      return filterTeamsByTournament(
        teams_by_tournament,
        first_tournament
      ).reverse();
    } else return [];
  }
);

/**
 * per facilitarmi la vita per ora ritorno solo team del 1mo torneo
 */
const getEnrolledTeamsState = createSelector(
  [getAllowedTournaments, getTeamsByTournaments, getTeamsEnrolled],
  (
    allowed_tournaments,
    teams_by_tournament,
    tournament_qualification_scores
  ) => {
    if (allowed_tournaments.length > 0) {
      let first_tournament = allowed_tournaments[0].id;
      return filterEnrolledTeamsByTournament(
        tournament_qualification_scores,
        first_tournament
      ).reverse();
    } else return [];
  }
);

function filterTeamsByTournament(teams = [], tournament = 1) {
  if (teams.length > 0) {
    return teams.filter((e) => {
      return e.tournament == tournament;
    });
  } else return [];
}

function filterEnrolledTeamsByTournament(teams = [], tournament = 1) {
  if (teams.length > 0) {
    return teams.filter((e) => {
      return e.tournament == tournament && e.team != null;
    });
  } else return [];
}

const withData = connect((state) => {
  // prendo il profilo
  return {
    infoProfile: getProfile(state),
    allowedTournamentState: getAllowedTournamentsState(state),
    teamsByTournamentState: getTeamsByTournamentsState(state),
    enrolledTeamsState: getEnrolledTeamsState(state),
  };
});

export default withData(CitiesTournamentBlur);
