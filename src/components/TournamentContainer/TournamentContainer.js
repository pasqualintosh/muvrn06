import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  ImageBackground
} from "react-native";
import RedFlagChallenges from "./../RedFlagChallenges/RedFlagChallenges";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import {
  setTeamScreenUvisible,
  getTournamentsQualificationById
} from "./../../domains/tournaments/ActionCreators";

class TournamentContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      allowed_tournament: {}, // SINGOLARE
      // allowed_tournaments: [], // PLURALE
      teams_by_tournament: [],
      tournament_qualification: {},
      tournament_score: {}
    };

    this.tournament = {};
  }

  componentWillReceiveProps(nextProps) {
    try {
      this.tournament = this.props.navigation.state.params.tournament;
    } catch (error) {
      this.tournament = this.props.elem;
    }

    let teams_by_tournament = [],
      tournament_qualification = {},
      tournament_score = {};
    if (nextProps.teamsByTournamentState.length > 0) {
      nextProps.teamsByTournamentState.forEach(team => {
        if (team.tournament == this.tournament.id)
          teams_by_tournament.push(team);
      });
    }

    // // if (nextProps.qualificationsState.length > 0) {
    // //   nextProps.qualificationsState.forEach(qualification => {
    // //     if (qualification.tournament == this.tournament.id)
    // //       tournament_qualification = qualification;
    // //   });
    // // }

    if (nextProps.tournamentsScoreState.length > 0) {
      nextProps.tournamentsScoreState.forEach(score => {
        if (score.tournament == this.state.tournament_qualification.id)
          tournament_score = score;
      });
    }

    this.setState({
      allowed_tournament: nextProps.allowedTournamentState,
      teams_by_tournament,
      // tournament_qualification,
      tournament_score
    });
  }

  saveTournamentQualificationInState = data => {
    this.setState({ tournament_qualification: data[0] });
  };

  componentWillMount() {
    try {
      this.tournament = this.props.navigation.state.params.tournament;
    } catch (error) {
      this.tournament = this.props.elem;
    }
    this.props.dispatch(
      getTournamentsQualificationById(
        this.tournament.id,
        this.saveTournamentQualificationInState
      )
    );
    let teams_by_tournament = [],
      tournament_qualification = {},
      tournament_score = {};
    if (this.props.teamsByTournamentState.length > 0) {
      this.props.teamsByTournamentState.forEach(team => {
        if (team.tournament == this.tournament.id)
          teams_by_tournament.push(team);
      });
    }
    // if (this.props.qualificationsState.length > 0) {
    //   this.props.qualificationsState.forEach(qualification => {
    //     if (qualification.tournament == this.tournament.id)
    //       tournament_qualification = qualification;
    //   });
    // }
    if (this.props.tournamentsScoreState.length > 0) {
      this.props.tournamentsScoreState.forEach(score => {
        if (score.tournament == this.state.tournament_qualification.id)
          tournament_score = score;
      });
    }
    this.setState({
      allowed_tournament: this.props.allowedTournamentState,
      teams_by_tournament,
      // tournament_qualification,
      tournament_score
    });
  }

  goToTeam = () => {
    let team = this.state.teams_by_tournament.filter(team => {
      return team.id == this.state.tournament_score.team;
    });

    if (this.props.firstTeamScreenState) {
      if (team.length > 0) {
        this.props.dispatch(setTeamScreenUvisible());
        this.props.navigation.navigate("TeamScreen", {
          university: team[0],
          tournament_qualification_id: this.state.tournament_qualification.id,
          tournament_qualification: this.state.tournament_qualification,
          tournament: this.tournament
        });
      }
    } else {
      if (team.length > 0) {
        this.props.navigation.navigate("WaitingUniversityScreen", {
          university: team[0],
          tournament_qualification_id: this.state.tournament_qualification.id,
          tournament_qualification: this.state.tournament_qualification,
          tournament: this.tournament
        });
      }
    }
  };

  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.dispatch(
            getTournamentsQualificationById(
              this.tournament.id,
              this.saveTournamentQualificationInState
            )
          );

          if (this.state.tournament_score.team) {
            this.goToTeam();
          } else {
            this.props.navigation.navigate("DetailTournamentScreen", {
              tournament: this.props.elem
            });
            // this.props.navigation.navigate("ChooseTeamScreen", {
            //   tournament: this.props.elem
            // });
          }
        }}
      >
        <View
          style={[
            styles.mainContainer,
            {
              borderColor: this.props.active ? "#3363AD" : "#000",
              borderWidth: 1
            }
          ]}
        >
          <View style={[styles.topContainer, {}]}>
            <ImageBackground
              source={require("../../assets/images/torneo-universita-wave.png")}
              style={{
                width: Dimensions.get("window").width * 0.9 - 2,
                height:
                  Dimensions.get("window").height * 0.24 * 0.65 -
                  0.05 +
                  (Dimensions.get("window").width * 0.89) / 16
              }}
              imageStyle={{ borderRadius: 6 }}
            />
            <RedFlagChallenges
              width={36}
              height={25}
              color={"#FFFFFF"}
              colorStart={"#7D4D99"}
              colorEnd={"#6497CC"}
              icon={"sct_icn_active"}
            />
          </View>
          <View style={styles.bottomImgContainer}>
            <Text style={styles.bottomText}>{this.props.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.24,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#F7F8F9",
    shadowRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    elevation: 2,
    marginVertical: 5
  },
  topContainer: {
    width: Dimensions.get("window").width * 0.9 - 2,
    height:
      Dimensions.get("window").height * 0.24 * 0.65 -
      0.05 +
      (Dimensions.get("window").width * 0.89) / 16,
    backgroundColor: "#F7F8F9",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    justifyContent: "center",
    alignItems: "center"
  },
  topImgContainer: {
    width: Dimensions.get("window").width * 0.89,
    height: Dimensions.get("window").height * 0.24 * 0.3 - 0.05,
    // backgroundColor: "#F7F8F9",
    // borderTopLeftRadius: 6,
    // borderTopRightRadius: 6,
    justifyContent: "center",
    alignItems: "center"
  },
  waveContainer: {
    width: Dimensions.get("window").width * 0.89,
    height: (Dimensions.get("window").width * 0.89) / 16
    // height: Dimensions.get("window").height * 0.24 * 0.34 - 0.05
    // backgroundColor: "#3e3",
    // borderTopLeftRadius: 6,
    // borderTopRightRadius: 6,
  },
  bottomImgContainer: {
    width: Dimensions.get("window").width * 0.89,
    height:
      Dimensions.get("window").height * 0.24 * 0.34 -
      0.05 -
      (Dimensions.get("window").width * 0.89) / 16,
    backgroundColor: "#F7F8F9",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6
  },
  bottomText: {
    color: "#3d3d3d",
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 14
  }
});

const getAllowedTournaments = state =>
  state.tournaments.allowed_tournaments
    ? state.tournaments.allowed_tournaments
    : [];

const getTeamsByTournaments = state =>
  state.tournaments.teams_by_tournament
    ? state.tournaments.teams_by_tournament
    : [];

const getQualifications = state =>
  state.tournaments.tournament_qualification
    ? state.tournaments.tournament_qualification
    : [];

const getTournamentsScore = state =>
  state.tournaments.tournament_qualification_scores
    ? state.tournaments.tournament_qualification_scores
    : [];

const getFirstTeamScreen = state => {
  if (
    state.tournaments.first_team_screen_visible == undefined ||
    state.tournaments.first_team_screen_visible == true
  ) {
    return true;
  } else {
    return false;
  }
};

const getTournamentsScoreState = createSelector(
  [getTournamentsScore],
  tournament_qualification_scores => {
    if (tournament_qualification_scores.length > 0) {
      return tournament_qualification_scores;
    } else return [];
  }
);

const getAllowedTournamentsState = createSelector(
  getAllowedTournaments,
  allowed_tournaments => {
    if (allowed_tournaments.length > 0) return allowed_tournaments;
    else return {};
  }
);

const getQualificationsState = createSelector(
  getQualifications,
  tournament_qualification => {
    if (tournament_qualification.length > 0) return tournament_qualification;
    else return {};
  }
);

const getTeamsByTournamentsState = createSelector(
  [getAllowedTournaments, getTeamsByTournaments],
  (allowed_tournaments, teams_by_tournament) => {
    if (allowed_tournaments.length > 0) {
      return teams_by_tournament;
    } else return [];
  }
);

function filterTeamsByTournament(teams = [], tournament = 1) {
  if (teams.length > 0) {
    return teams.filter(e => {
      return e.tournament == tournament;
    });
  } else return [];
}

function filterEnrolledTeamsByTournament(teams = [], tournament = 1) {
  if (teams.length > 0) {
    return teams.filter(e => {
      return e.tournament == tournament && e.team != null;
    });
  } else return [];
}

const withData = connect(state => {
  return {
    allowedTournamentState: getAllowedTournamentsState(state),
    teamsByTournamentState: getTeamsByTournamentsState(state),
    qualificationsState: getQualificationsState(state),
    tournamentsScoreState: getTournamentsScoreState(state),
    firstTeamScreenState: getFirstTeamScreen(state)
  };
});

export default withData(TournamentContainer);
