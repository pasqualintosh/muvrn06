import {
  GET_ALLOWED_TOURNAMENTS_QUALIFICATION,
  GET_TEAMS_BY_TOURNAMENT,
  GET_TOURNAMENT,
  PATCH_TOURNAMENT_QUALFICATION,
  GET_TOURNAMENT_QUALIFICATION,
  SET_TEAM_SCREEN_UNVISIBLE,
  GET_ALLOWED_TOURNAMENTS_DIRECT,
  GET_ALLOWED_TOURNAMENTS_ROUND,
  GET_TOURNAMENT_DIRECT,
  GET_TOURNAMENT_ROUND
} from "./ActionTypes";
import DefaultState from "./DefaultState";

export default (state = DefaultState, action) => {
  switch (action.type) {
    case GET_ALLOWED_TOURNAMENTS_QUALIFICATION:
      return {
        ...state,
        tournament_qualification_scores:
          action.payload.tournament_qualification_scores
      };

    case GET_ALLOWED_TOURNAMENTS_DIRECT:
      return {
        ...state,
        tournament_direct_scores: action.payload.tournament_direct_scores
      };

    case GET_ALLOWED_TOURNAMENTS_ROUND:
      return {
        ...state,
        tournament_round_scores: action.payload.tournament_round_scores
      };

    case GET_TOURNAMENT:
      return {
        ...state,
        allowed_tournaments: action.payload.allowed_tournaments
      };

    case GET_TEAMS_BY_TOURNAMENT:
      return {
        ...state,
        teams_by_tournament: action.payload.teams_by_tournament
      };

    case PATCH_TOURNAMENT_QUALFICATION:
      let tournament_qualification_scores = [
        ...state.tournament_qualification_scores
      ].filter(e => {
        return e.id != action.payload.team_qualification_enrolled.id;
      });
      tournament_qualification_scores.push(
        action.payload.team_qualification_enrolled
      );

      return {
        ...state,
        tournament_qualification_scores
      };

    case GET_TOURNAMENT_QUALIFICATION:
      return {
        ...state,
        tournament_qualification: action.payload.tournament_qualification
      };

    case GET_TOURNAMENT_DIRECT:
      return {
        ...state,
        tournament_direct: action.payload.tournament_direct
      };

    case GET_TOURNAMENT_ROUND:
      return {
        ...state,
        tournament_round: action.payload.tournament_round
      };

    case SET_TEAM_SCREEN_UNVISIBLE:
      return {
        ...state,
        first_team_screen_visible: action.payload.first_team_screen_visible
      };

    default:
      return state;
  }
};
