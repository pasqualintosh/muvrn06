import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { strings } from "../../config/i18n";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";
import Svg, { Circle, Polygon, Line } from "react-native-svg";
import LinearGradient from "react-native-linear-gradient";
import { getUniversityImg } from "./../ChooseTeamScreen/ChooseTeamScreen";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import WavyArea from "./../../components/WavyArea/WavyArea";
import {
  getTournamentsQualification,
  getTeamsByTournament,
  getTournaments,
  getQualificationRankingByQualification,
} from "./../../domains/tournaments/ActionCreators";
import pointsDecimal from "./../../helpers/pointsDecimal";

function compare(a, b) {
  if (a.total_points > b.total_points) return -1;
  if (b.total_points > a.total_points) return 1;

  return 0;
}

class WaitingUniversityScreen extends React.Component {
  constructor(props) {
    super(props);
    super(props);
    this.state = {
      scrollEnabled: true,
      university_tournament_start: new Date("2020-03-16 08:00:00"),
      standings: [],
      my_team: {},
    };
    this.university = null;
    this.tournament_qualification_id = null;
    this.tournament = null;
    this.tournament_qualification = null;
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        allowed_tournament: nextProps.allowedTournamentState,
        teams_by_tournament: [...nextProps.teamsByTournamentState],
      },
      () => {
        this.updateUniversityTournamentStart();
      }
    );
  }

  // saveRankingInState = data => {
  //   let my_team = {};

  //   data.forEach((elem, index) => {
  //     if (elem.team.name == this.university.name)
  //       my_team = {
  //         ...elem.team,
  //         position: index + 1,
  //         total_points: elem.total_points
  //       };
  //   });

  //   this.setState({ standings: data, my_team });
  // };

  saveRankingInState = (data = []) => {
    let my_team = {},
      sorted_standing = [...data.sort(compare)];

    sorted_standing.forEach((elem, index) => {
      if (elem.team.name == this.university.name)
        my_team = {
          ...elem.team,
          position: index + 1,
          total_points: elem.total_points,
        };
    });

    this.setState({ standings: sorted_standing, my_team }, () => {
      console.log(this);
    });
  };

  componentWillMount() {
    try {
      this.university = this.props.navigation.state.params.university;
      this.tournament_qualification_id = this.props.navigation.state.params.tournament_qualification_id;
      this.tournament_qualification = this.props.navigation.state.params.tournament_qualification;
      this.tournament = this.props.navigation.state.params.tournament;

      this.props.dispatch(
        getQualificationRankingByQualification(
          this.tournament_qualification_id,
          this.saveRankingInState
        )
      );
    } catch (error) {
      console.log(error);
    }

    this.setState(
      {
        allowed_tournament: this.props.allowedTournamentState,
        teams_by_tournament: this.props.teamsByTournamentState,
      },
      () => {
        // this.updateUniversityTournamentStart();
      }
    );
  }

  updateUniversityTournamentStart = () => {
    this.setState({
      university_tournament_start: new Date(
        this.state.allowed_tournament.start_time
      ),
    });
  };

  renderLogo() {
    return (
      <View style={{ marginTop: 15 }}>
        <ImageBackground
          style={{
            width: 180,
            height: 180,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
          source={require("./../../assets/images/cities/team_live_bg_sx.png")}
        >
          <Image
            style={{
              width: 120,
              height: 120,
            }}
            source={getUniversityImg(this.university.logo)}
          />
        </ImageBackground>
      </View>
    );
  }

  renderUniversityText() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.7,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            marginTop: 11,
            fontFamily: "Montserrat-ExtraBold",
            fontWeight: "bold",
            color: "#fff",
            fontSize: 18,
            textAlign: "center",
          }}
        >
          {this.university.short_name.toLocaleUpperCase()}
        </Text>
        <Text
          style={{
            marginTop: 11,
            fontFamily: "Montserrat-Regular",
            fontWeight: "400",
            color: "#fff",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {this.university.description}
        </Text>
      </View>
    );
  }

  renderHeaderLogo() {
    let backgroundColor = this.university.color;
    return (
      <ImageBackground
        source={require("./../../assets/images/cities/city_page_bg.png")}
        style={{
          width: Dimensions.get("window").width,
          height: 300,
          backgroundColor,
          justifyContent: "flex-start",
          alignItems: "center",
          padding: 7,
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width,
            height: 270,
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {this.renderLogo()}
          {this.renderUniversityText()}
        </View>
      </ImageBackground>
    );
  }

  renderEndCounter() {
    let today = new Date();
    let start_time = this.tournament
      ? new Date(this.tournament.start_time)
      : new Date(this.state.university_tournament_start);

    let e_msec = start_time - today;
    let e_mins = Math.floor(e_msec / 60000);
    let e_hrs = Math.floor(e_mins / 60);
    let e_a_mins = Math.floor(e_msec / 60000) - e_hrs * 60;
    let e_days = Math.floor(e_hrs / 24);
    let e_a_hrs = e_hrs - e_days * 24;
    console.log(today);

    if (e_msec > 0)
      return (
        <ImageBackground
          source={require("./../../assets/images/ongoing_match_wave.png")}
          style={{
            width: Dimensions.get("window").width,
            height: 300,
            // backgroundColor: "#1D1C47",
            position: "absolute",
            top: 300 - 30,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 80,
              paddingRight: 10,
              paddingLeft: 20,
              height: 300 - 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <OwnIcon name="timer_icn" size={55} color="#FAB21E" />
          </View>
          <View
            style={{
              width: Dimensions.get("window").width - 140,
              paddingLeft: 10,
              paddingRight: 20,
              height: 300 - 40,
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Text style={styles.txtEndCounter}>{strings("id_2_11")}</Text>
            {/* <Text style={styles.txtEndCounter}>
              Fusce dapibus, tellus ac cursus commodo, tortor mauris condim
              entum nibh.
            </Text> */}
            <Text style={{}}>
              <Text style={styles.txtCounter}>{e_days}</Text>
              <Text style={styles.letterCounter}>{"d "}</Text>
              <Text style={styles.txtCounter}>{e_a_hrs}</Text>
              <Text style={styles.letterCounter}>{"h "}</Text>
              <Text style={styles.txtCounter}>{e_a_mins}</Text>
              <Text style={styles.letterCounter}>{"m"}</Text>
            </Text>
          </View>
        </ImageBackground>
      );
    else return this.renderRankingPosition();
  }

  renderRankingPosition() {
    return (
      <ImageBackground
        source={require("./../../assets/images/ongoing_match_wave.png")}
        style={{
          width: Dimensions.get("window").width,
          height: 300,
          // backgroundColor: "#1D1C47",
          position: "absolute",
          top: 300 - 30,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width,
            height: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat-ExtraBold",
              fontWeight: "bold",
              color: "#3d3d3d",
              fontSize: 13,
            }}
          >
            Fase a preliminari ?
          </Text>
          <Text
            style={{
              fontFamily: "OpenSans-Regular",
              fontWeight: "400",
              color: "#3d3d3d",
              fontSize: 10,
            }}
          >
            Si classificano le prime vattele a pesca
          </Text>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width,
            height: 140,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.5,
              height: 70,
              justifyContent: "center",
              alignItems: "flex-end",
              borderRightColor: this.university.color,
              borderRightWidth: 1,
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat-ExtraBold",
                fontWeight: "bold",
                color: "#3d3d3d",
                marginRight: 10,
                fontSize: 11,
              }}
            >
              {this.university.name.toLocaleUpperCase()}
            </Text>
            <Text
              style={{
                fontFamily: "Montserrat-ExtraBold",
                fontWeight: "bold",
                color: "#3d3d3d",
                marginRight: 10,
                fontSize: 20,
              }}
            >
              {this.state.my_team.total_points
                ? pointsDecimal(this.state.my_team.total_points)
                : "0"}
              <Text
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  fontWeight: "bold",
                  color: "#3d3d3d",
                  marginRight: 10,
                  fontSize: 12,
                }}
              >
                pt
              </Text>
            </Text>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.5,
              height: 140,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {this.renderRankingLogo()}
          </View>
        </View>
      </ImageBackground>
    );
  }

  renderRankingLogo() {
    return (
      <ImageBackground
        style={{
          width: 80,
          height: 80,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
        source={require("./../../assets/images/rank_tournament_bg_green.png")}
      >
        <Text
          style={{
            fontFamily: "OpenSans-Regular",
            fontWeight: "400",
            color: "#fff",
            fontSize: 18,
          }}
        >
          {this.state.my_team.position ? this.state.my_team.position : 0}
          <Text
            style={{
              fontFamily: "OpenSans-Regular",
              fontWeight: "400",
              color: "#fff",
              fontSize: 12,
            }}
          >
            th
          </Text>
        </Text>
      </ImageBackground>
    );
  }

  renderFinalBtn() {
    let backgroundColor = this.university.color;

    return (
      <View
        style={{
          height: 80,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableWithoutFeedback
          onPress={() =>
            this.props.navigation.navigate("FinalTournamentScreen")
          }
        >
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 25,
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              elevation: 2,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Svg height="40" width="40">
                <View
                  style={{
                    position: "absolute",
                    height: 50,
                    width: 50,
                    flexDirection: "row",
                  }}
                >
                  <OwnIcon
                    name="schedule_icn_1"
                    size={40}
                    color={"#ffffff"}
                    style={{ top: -3 }}
                  />
                  <OwnIcon
                    name="schedule_icn_2"
                    size={40}
                    color={"#ffffff"}
                    style={{ right: 40 }}
                  />
                  <OwnIcon
                    name="schedule_icn_3"
                    size={40}
                    color={"#ffffff"}
                    style={{ right: 80 }}
                  />
                </View>
              </Svg>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <Text
          style={{
            fontFamily: "OpenSans-Regular",
            fontWeight: "400",
            color: "#3d3d3d",
            fontSize: 8,
          }}
        >
          {strings("id_2_15")}
        </Text>
      </View>
    );
  }

  renderScheduleBtn() {
    let backgroundColor = this.university.color;

    return (
      <View
        style={{
          height: 80,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => this.props.navigation.navigate("GroupScreen")}
        >
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 25,
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              elevation: 2,
            }}
          >
            <OwnIcon name="groups_icn" size={25} color={"#fff"} />
          </View>
        </TouchableWithoutFeedback>
        <Text
          style={{
            fontFamily: "OpenSans-Regular",
            fontWeight: "400",
            color: "#3d3d3d",
            fontSize: 8,
          }}
        >
          {strings("id_2_14")}
        </Text>
      </View>
    );
  }

  renderBPBtn() {
    let backgroundColor = this.university.color;

    return (
      <View
        style={{
          height: 40,
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute",
          top: 20,
          right: 20,
        }}
      >
        <TouchableWithoutFeedback
          onPress={() =>
            this.props.navigation.navigate("BestPlayersScreenBlur", {
              university: this.university,
              tournament_qualification_id: this.tournament_qualification_id,
              tournament_qualification: this.tournament_qualification,
            })
          }
        >
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#F7F8F9",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              elevation: 2,
            }}
          >
            <OwnIcon name="best_player_icn" size={20} color={"#FAB21E"} />
          </View>
        </TouchableWithoutFeedback>
        <Text
          style={{
            fontFamily: "OpenSans-Regular",
            fontWeight: "400",
            color: "#FFFFFF",
            fontSize: 8,
            paddingTop: 5,
          }}
        >
          {strings("id_2_12")}
        </Text>
      </View>
    );
  }

  renderRankingBtn() {
    let backgroundColor = this.university.color;

    return (
      <View
        style={{
          height: 80,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            if (this.tournament.qualification)
              this.props.navigation.navigate("StandingsUniversityScreen", {
                university: this.university,
                tournament_qualification_id: this.tournament_qualification_id,
                tournament_qualification: this.tournament_qualification,
              });
            else
              alert(
                "May I have your attention, please? Will the real Slim Shady please stand up?"
              );
          }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 25,
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              elevation: 2,
            }}
          >
            <OwnIcon name="rank_new_icn" size={25} color={"#fff"} />
          </View>
        </TouchableWithoutFeedback>
        <Text
          style={{
            fontFamily: "OpenSans-Regular",
            fontWeight: "400",
            color: "#3d3d3d",
            fontSize: 8,
          }}
        >
          {strings("id_2_13")}
        </Text>
      </View>
    );
  }

  renderMainBtns() {
    return (
      <ImageBackground
        source={require("./../../assets/images/ongoing_match_wave.png")}
        style={{
          width: Dimensions.get("window").width,
          height: 200,
          top: 300 + 300 - 100 - 20,
          // top: 300 + 200,
          // top: 300 + 200,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          position: "absolute",
        }}
      >
        {this.renderRankingBtn()}
        {this.renderScheduleBtn()}
        {this.renderFinalBtn()}
      </ImageBackground>
    );
  }

  renderSeeBtn() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.navigation.navigate("DetailSponsorTournamentScreenBlur");
        }}
      >
        <View
          style={{
            backgroundColor: "#F8B126",
            width: Dimensions.get("window").width * 0.15,
            height: 30,
            borderRadius: 16,
            borderColor: "#3d3d3d",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.seeBtnTxt}>Vedi</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderSponsor() {
    let backgroundColor = this.university.color;

    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height * 0.15,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          // backgroundColor
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height * 0.15,
            flex: 0.33,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ height: 30 }}>
            <Text style={styles.sponsorTxt}>SPONSOR</Text>
          </View>
          <Image
            style={{
              width: 60,
              height: 60,
            }}
            source={require("../../assets/images/rewards/art.png")}
          />
        </View>
        <View
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height * 0.15,
            flex: 0.33,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ height: 30 }} />
          <View style={{}}>
            <Text style={styles.sponsorTxt}>AIRLITE</Text>
            <Text style={styles.sponsorDescTxt}>
              Vogliamo donare alla città vincitrice un’opera che porti bellezza
              e aria più pulita.
            </Text>
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height * 0.15,
            flex: 0.33,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 59,
              height: 35,
              top: -75,
              // top: -40
            }}
            source={require("../../assets/images/sponsor_crown.png")}
          />
          {this.renderSeeBtn()}
        </View>
      </View>
    );
  }

  render() {
    let backgroundColor = this.university.color;

    return (
      <ScrollView
        contentContainerStyle={{
          width: Dimensions.get("window").width,
          height:
            Dimensions.get("window").height +
            Dimensions.get("window").height * 0.2 +
            80,
          backgroundColor,
        }}
        scrollEnabled={this.state.scrollEnabled}
      >
        {this.renderHeaderLogo()}
        {this.renderBPBtn()}
        {this.renderEndCounter()}
        {this.renderMainBtns()}

        <View
          style={{
            width: Dimensions.get("window").width,
            // height: 200,
            height: Dimensions.get("window").height * 0.2,
            backgroundColor,
            justifyContent: "center",
            alignItems: "center",
            top: 300 + 100,
          }}
        >
          {this.renderSponsor()}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  txtEndCounter: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 14,
  },
  txtBoldEndCounter: {
    marginTop: 11,
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3d3d3d",
    fontSize: 13,
  },
  txtCounter: {
    fontFamily: "Montserrat-ExtraBold",
    fontWeight: "bold",
    color: "#FAB21E",
    fontSize: 32,
  },
  letterCounter: {
    fontFamily: "Montserrat-Regular",
    fontWeight: "bold",
    color: "#FAB21E",
    fontSize: 8,
  },
  sponsorTxt: {
    fontFamily: "Montserrat-Regular",
    fontWeight: "bold",
    color: "#fff",
    fontSize: 12,
  },
  sponsorDescTxt: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#fff",
    fontSize: 12,
  },
  seeBtnTxt: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3d3d3d",
    fontSize: 12,
  },
});

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
 * per facilitarmi la vita per ora ritorno solo il 1mo elemento
 */
const getQualificationsState = createSelector(
  getQualifications,
  (tournament_qualification) => {
    if (tournament_qualification.length > 0) return tournament_qualification;
    else return {};
  }
);

const getTeamsByTournamentsState = createSelector(
  [getAllowedTournaments, getTeamsByTournaments],
  (allowed_tournaments, teams_by_tournament) => {
    if (allowed_tournaments.length > 0) {
      return teams_by_tournament.reverse();
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
  return {
    allowedTournamentState: getAllowedTournamentsState(state),
    teamsByTournamentState: getTeamsByTournamentsState(state),
    qualificationsState: getQualificationsState(state),
  };
});

// const withData = connect(state => {
//   return {
//     allowedTournamentState: getAllowedTournamentsState(state),
//     teamsByTournamentState: getTeamsByTournamentsState(state),
//     enrolledTeamsState: getEnrolledTeamsState(state)
//   };
// });

export default withData(WaitingUniversityScreen);

// export default WaitingUniversityScreen;

export const positiveData = [
  {
    value: 60,
  },
  {
    value: 120,
  },
  {
    value: 200,
  },
  {
    value: 80,
  },
  {
    value: 90,
  },
];
