import { createSelector } from "reselect";
import { getUniversityImg } from "../../screens/ChooseTeamScreen/ChooseTeamScreen";

const getAllowedTournaments = state => state.tournaments.allowed_tournaments;

const getQualificationTournament = state =>
  state.tournaments.tournament_qualification_scores;

const getStandingTournament = state => state.tournaments.standing_tournament;

const getTeams = state => state.tournaments.teams_by_tournament;

export const getAllowedTournamentsState = createSelector(
  [getAllowedTournaments],
  AllowedTournaments => (AllowedTournaments ? AllowedTournaments : [])
);

export const getQualificationTournamentState = createSelector(
  [getQualificationTournament],
  QualificationTournament =>
    QualificationTournament ? QualificationTournament : []
);

export const getStandingTournamentState = createSelector(
  [getStandingTournament],
  StandingTournament => (StandingTournament ? StandingTournament : [])
);

export const getTeamsState = createSelector([getTeams], Teams =>
  Teams ? Teams : []
);

export const getMyTeamsState = createSelector(
  [getTeamsState, getQualificationTournamentState],
  (Teams, StandingTournaments) => {
    let myTeam = {
      name: "",
      description: "",
      logo: getUniversityImg(null),
      id: 1,
      rowID: 1,
      position: 1
    };

    if (StandingTournaments.length) {
      try {
        const firstTournament = StandingTournaments[0];
        const myteam = firstTournament.team;
        const myteamInfo = Teams.find(x => x.id == myteam);
        const position = Teams.findIndex(x => x.id == myteam) + 1;
        myTeam = {
          ...firstTournament,
          ...myteamInfo,
          position
        };
      } catch (e) {
        console.log(e);
      }
    }
    return myTeam;
  }
);
