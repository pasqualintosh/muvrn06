import React from 'react';
import {
  View,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import {styles, negativeData} from './Style';
import ChooseItem from './../../components/ChooseItem/ChooseItem';
import Aux from './../../helpers/Aux';
import {strings} from '../../config/i18n';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {
  getTournamentsQualification,
  getTeamsByTournament,
  getTournaments,
  getTournamentsQualificationById,
} from './../../domains/tournaments/ActionCreators';
import WebService from './../../config/WebService';
import ListView from 'deprecated-react-native-listview';

class ChooseTeamScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      allowed_tournament: {}, // SINGOLARE
      // allowed_tournaments: [], // PLURALE
      teams_by_tournament: [],
      tournament_qualification: {},
    };

    this.tournament = {};
  }

  componentWillReceiveProps(nextProps) {
    let teams_by_tournament = [],
      tournament_qualification = {};
    if (nextProps.teamsByTournamentState.length > 0) {
      nextProps.teamsByTournamentState.forEach((team) => {
        if (team.tournament == this.tournament.id)
          teams_by_tournament.push(team);
      });
    }

    if (nextProps.qualificationsState.length > 0) {
      nextProps.qualificationsState.forEach((qualification) => {
        if (qualification.tournament == this.tournament.id)
          tournament_qualification = qualification;
      });
    }

    this.setState(
      {
        allowed_tournament: nextProps.allowedTournamentState,
        teams_by_tournament,
        tournament_qualification,
      },
      () => {
        try {
        } catch (error) {
          console.log(error);
        }
      },
    );
  }

  componentWillMount() {
    try {
      this.tournament = this.props.navigation.state.params.tournament;

      this.props.dispatch(getTournaments(this.getTeamTournamentFromComponent));
      // this.props.dispatch(
      //   getTournamentsQualification(this.getTournamentQualificationFromId)
      // );
    } catch (error) {
      this.tournament = this.props.tournament;

      this.props.dispatch(getTournaments(this.getTeamTournamentFromComponent));
      // this.props.dispatch(
      //   getTournamentsQualification(this.getTournamentQualificationFromId)
      // );
    }
  }

  getTournamentQualificationFromId = (id) => {
    this.props.dispatch(getTournamentsQualificationById(this.tournament.id));
    // this.props.dispatch(getTournamentsQualificationById(id));
  };

  getTeamTournamentFromComponent = (id) => {
    this.props.dispatch(getTeamsByTournament(this.tournament.id));
  };

  onRefresh() {
    this.setState({refreshing: true});

    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1500);
  }

  renderPage() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    const dataListTrophies = ds.cloneWithRows(this.state.teams_by_tournament);

    return (
      <View>
        <ListView
          removeClippedSubviews={false}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          style={styles.challengesList}
          dataSource={dataListTrophies}
          renderRow={(item, sectionID, rowID) => {
            const row = parseInt(rowID) + 1;
            if (this.state.teams_by_tournament.length == row) {
              return (
                <Aux key={item.id}>
                  <ChooseItem
                    navigation={this.props.navigation}
                    name={item.name}
                    country={item.description}
                    logo={getUniversityImg(item.logo)}
                    id={item.id}
                    rowID={rowID}
                    university={item}
                    tournament={this.tournament}
                  />

                  <View
                    style={{
                      paddingTop: Dimensions.get('window').height * 0.23 + 180,
                    }}
                  />
                </Aux>
              );
            } else {
              return (
                <ChooseItem
                  navigation={this.props.navigation}
                  name={item.name}
                  country={item.description}
                  logo={getUniversityImg(item.logo)}
                  id={item.id}
                  rowID={rowID}
                  university={item}
                  tournament={this.tournament}
                />
              );
            }
          }}
        />
      </View>
    );
  }
  renderBody() {
    if (!this.props.universities.length) {
      return (
        <View style={{top: 150}}>
          <ActivityIndicator size="large" color="#3D3D3D" />
          <View style={styles.challengesList} />
        </View>
      );
    } else {
      return this.renderPage();
    }
  }

  render() {
    return (
      <View
        // style={styles.mainContainer}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }>
        {this.renderBody()}
      </View>
    );
  }
}

ChooseTeamScreen.defaultProps = {
  universities: [
    {
      id: 0,
      name: 'Alma Mater',
      country: 'Italy',
      logo: require('../../assets/images/university/logo-universita_di_bologna_alma_mater.png'),
    },
    {
      id: 1,
      name: 'Universidad Rey Juan Carlos Spain',
      country: 'Spain',
      logo: require('../../assets/images/university/logo-universidad_rey_juan_carlos.png'),
    },
    {
      id: 2,
      name: 'Universidad Complutense de Madrid Spain',
      country: 'Spain',
      logo: require('../../assets/images/university/logo-universidad_complutense_de_madrid-.png'),
    },
    {
      id: 3,
      name: 'Universidad Miguel Hernández Spain',
      country: 'Spain',
      logo: require('../../assets/images/university/logo-univesidad_miguel_herdandez.png'),
    },
  ],
};

export const getUniversityImg = (name) => {
  if (name != null) {
    if (name.includes('http')) return {uri: name};
    return {uri: WebService.url + '/' + name};
  } else return require('../../assets/images/no_logo.png');

  // switch (name) {
  //   case "Università degli studi di Milano Bicocca":
  //     return require("../../assets/images/university/logo-universita_bicocca.png");

  //   case "Universidad San Jorge":
  //     return require("../../assets/images/university/logo-universidad_san_jorge.png");

  //   case "Universitat Jaume I":
  //     return require("../../assets/images/university/logo-universidad_jaume_i.png");

  //   case "Universidad Miguel Hernández":
  //     return require("../../assets/images/university/logo-univesidad_miguel_herdandez.png");

  //   case "Universidad de Salamanca":
  //     return require("../../assets/images/university/logo-universidad_de_salamanca.png");

  //   case "Universidad de Málaga":
  //     return require("../../assets/images/university/logo-universidad_de_malaga.png");

  //   case "Poznan University of Technology":
  //     return require("../../assets/images/university/logo-poznan_university_of_technology.png");

  //   case "Politecnico di Milano":
  //     return require("../../assets/images/university/logo-politecnico_di_milano.png");

  //   case "Universidade de Trás-os-Montes e Alto Douro":
  //     return require("../../assets/images/university/logo-universidade_de_tras-os-montes_e_alto_douro.png");

  //   case "Alma Mater Studiorum - Università di Bologna":
  //     return require("../../assets/images/university/logo-universita_di_bologna_alma_mater.png");

  //   case "Università di Pavia":
  //     return require("../../assets/images/university/logo-universita_di_pavia.png");

  //   case "Universidad Complutense de Madrid":
  //     return require("../../assets/images/university/logo-universidad_complutense_de_madrid.png");

  //   case "Universidad de Las Palmas de Gran Canaria":
  //     return require("../../assets/images/university/logo-universidad_de_las_palmas_de_gran_canaria.png");

  //   case "Universidad Rey Juan Carlo":
  //     return require("../../assets/images/university/logo-universidad_rey_juan_carlos.png");

  //   case "Universidad Politécnica de Madrid":
  //     return require("../../assets/images/university/logo-universidad_politecnica_de_madrid.png");

  //   case "Università di Camerino":
  //     return require("../../assets/images/university/logo-universita_di_camerino.png");

  //   case "Universidad de Cantabria":
  //     return require("../../assets/images/university/logo-universidad_de_cantabria.png");

  //   case "Link Campus University":
  //     return require("../../assets/images/university/logo-universita_link_campus.png");

  //   case "Universidad del País Vasco":
  //     return require("../../assets/images/university/logo-Universidad-del-pais-vasco.png");

  //   case "Universidad Carlos III":
  //     return require("../../assets/images/university/logo-universidad_carlos_iii_de_madrid.png");
  //   case "Università degli studi di Torino":
  //     return require("../../assets/images/university/logo-universita_di_torino.png");

  //   default:
  //     return require("../../assets/images/university/logo-universita_di_bologna_alma_mater.png");
  // }
};

const getAllowedTournaments = (state) =>
  state.tournaments.allowed_tournaments
    ? state.tournaments.allowed_tournaments
    : [];

const getTeamsByTournaments = (state) =>
  state.tournaments.teams_by_tournament
    ? state.tournaments.teams_by_tournament
    : [];

const getQualifications = (state) =>
  state.tournaments.tournament_qualification
    ? state.tournaments.tournament_qualification
    : [];

const getScores = (state) =>
  state.tournaments.tournament_qualification_scores
    ? state.tournaments.tournament_qualification_scores
    : [];

const getAllowedTournamentsState = createSelector(
  getAllowedTournaments,
  (allowed_tournaments) => {
    if (allowed_tournaments.length > 0) return allowed_tournaments;
    else return {};
  },
);

const getScoresState = createSelector(
  getScores,
  (tournament_qualification_scores) => {
    if (tournament_qualification_scores.length > 0)
      return tournament_qualification_scores;
    else return {};
  },
);

/**
 * per facilitarmi la vita per ora ritorno solo il 1mo elemento
 */
const getQualificationsState = createSelector(
  getQualifications,
  (tournament_qualification) => {
    if (tournament_qualification.length > 0) return tournament_qualification;
    else return {};
  },
);

const getTeamsByTournamentsState = createSelector(
  [getAllowedTournaments, getTeamsByTournaments],
  (allowed_tournaments, teams_by_tournament) => {
    if (allowed_tournaments.length > 0) {
      return teams_by_tournament;
    } else return [];
  },
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
  return {
    allowedTournamentState: getAllowedTournamentsState(state),
    teamsByTournamentState: getTeamsByTournamentsState(state),
    qualificationsState: getQualificationsState(state),
    scoresState: getScoresState(state),
  };
});

export default withData(ChooseTeamScreen);

// export default ChooseTeamScreen;
