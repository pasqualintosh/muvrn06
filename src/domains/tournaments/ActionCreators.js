import {
  GET_TOURNAMENT,
  GET_ALLOWED_TOURNAMENTS_QUALIFICATION,
  GET_TEAMS_BY_TOURNAMENT,
  PATCH_TOURNAMENT_QUALFICATION,
  GET_TOURNAMENT_QUALIFICATION,
  SET_TEAM_SCREEN_UNVISIBLE,
  GET_ALLOWED_TOURNAMENTS_DIRECT,
  GET_ALLOWED_TOURNAMENTS_ROUND,
  GET_TOURNAMENT_DIRECT,
  GET_TOURNAMENT_ROUND
} from "./ActionTypes";
import {
  requestBackend,
  RefreshToken,
  requestCallback,
  getProfile,
  RefreshTokenObligatory,
  requestNewBackend,
  forceRefreshTokenWithCallback
} from "./../login/ActionCreators"; // da far puntare agli helper!!!
import WebService from "./../../config/WebService";
import { store } from "../../store";

export function getTournaments(
  callback = first_tournament_id => {},
  dataUser = {}
) {
  return async function backendRequest(dispatch, getState) {
    console.log("getTournaments");
    let { access_token } = getState().login;
    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/gaming/tournament_by_user/",
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log("getTournaments");
      console.log(response);

      if (response.status === 200) {
        getTournamentScoreQualificationDirectRoundAllowedByUser(
          response.data,
          dispatch,
          getState,
          access_token,
          () => {
            dispatch(forceRefreshTokenWithCallback(getTournaments(dataUser)));
          }
        );
        getQualificationDirectRoundByTournament(
          response.data,
          dispatch,
          getState,
          access_token,
          () => {
            dispatch(forceRefreshTokenWithCallback(getTournaments(dataUser)));
          }
        );
        dispatch({
          type: GET_TOURNAMENT,
          payload: { allowed_tournaments: [...response.data] }
        });
        if (response.data.length > 0) {
          callback();
        }
      } else if (response.status == 401) {
        dispatch(forceRefreshTokenWithCallback(getTournaments(dataUser)));
      }
    } catch (error) {
      console.log("getTournaments");
      console.log(error);
    }
  };
}

/**
 *
 * uso la callback per aggiornare la lista delle universita'
 * @param {id del torneo delle universita'} callback
 * @param {*} dataUser
 */
export function getTournamentsQualification(
  callback = () => {},
  dataUser = {}
) {
  return async function backendRequest(dispatch, getState) {
    console.log("getTournamentsQualification");
    let { access_token } = getState().login;
    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/gaming/tournament_qualification_allowed_by_user/",
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log("getTournamentsQualification");
      console.log(response);

      if (response.status === 200) {
        dispatch({
          type: GET_ALLOWED_TOURNAMENTS_QUALIFICATION,
          payload: { tournament_qualification_scores: [...response.data] }
        });
        if (response.data.length > 0) {
          // callback(response.data[0].tournament);
          callback();
        }
      } else if (response.status == 401) {
        dispatch(
          forceRefreshTokenWithCallback(getTournamentsQualification(dataUser))
        );
      }
    } catch (error) {
      console.log("getTournamentsQualification");
      console.log(error);
    }
  };
}

export function getTournamentsQualificationById(
  id,
  callback = () => {},
  dataUser = {}
) {
  return async function backendRequest(dispatch, getState) {
    console.log("getTournamentsQualificationById");
    let { access_token } = getState().login;
    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/gaming/tournament_qualification_by_tournament/" + id,
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log("getTournamentsQualificationById");
      console.log(response);

      if (response.status === 200) {
        callback(response.data);
        // dispatch({
        //   type: GET_TOURNAMENT_QUALIFICATION,
        //   payload: { tournament_qualification: response.data }
        // });
      } else if (response.status == 401) {
        dispatch(
          forceRefreshTokenWithCallback(
            getTournamentsQualificationById(dataUser)
          )
        );
      }
    } catch (error) {
      console.log("getTournamentsQualificationById");
      console.log(error);
    }
  };
}

export function getTeamsByTournament(id = 0, dataUser = {}) {
  return async function backendRequest(dispatch, getState) {
    console.log("getTeamsByTournament");
    let { access_token } = getState().login;
    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/gaming/team_by_tournament/" + id,
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log("getTeamsByTournament");
      console.log(response);

      if (response.status === 200) {
        dispatch({
          type: GET_TEAMS_BY_TOURNAMENT,
          payload: { teams_by_tournament: [...response.data] }
        });
      } else if (response.status == 401) {
        dispatch(forceRefreshTokenWithCallback(getTeamsByTournament(dataUser)));
      }
    } catch (error) {
      console.log("getTeamsByTournament");
      console.log(error);
    }
  };
}

export function getTeams(dataUser = {}) {
  return async function backendRequest(dispatch, getState) {
    console.log("getTeams");
    let { access_token } = getState().login;
    let { allow } = getState().tournaments;

    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/gaming/team/",
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log("getTeams");
      console.log(response);

      if (response.status === 200) {
        dispatch({
          type: GET_TEAMS_BY_TOURNAMENT,
          payload: { teams_by_tournament: [...response.data] }
        });
      } else if (response.status == 401) {
        dispatch(forceRefreshTokenWithCallback(getTeams(dataUser)));
      }
    } catch (error) {
      console.log("getTeams");
      console.log(error);
    }
  };
}

/**
 *
 * chiamata per fare l'enroll ad un team
 * @param {*} id torneo
 * @param {*} updateState
 * @param {*} dataUser
 */
export function patchTournamentQualification(
  tournament_id = 0,
  team_id = 0,
  user_email = "",
  updateState = () => {},
  dataUser = { limit: 100, offset: 0 }
) {
  return async function backendRequest(dispatch, getState) {
    console.log("patchTournamentQualification");
    let { access_token, infoProfile } = getState().login;
    const { limit, offset } = dataUser;
    let {
        tournament_qualification_scores,
        tournament_qualification
      } = getState().tournaments,
      tournament_qualification_scores_id = 0;

    let tournament_qualification_id = 0;
    tournament_qualification.forEach(qualification => {
      if (qualification.tournament == tournament_id)
        tournament_qualification_id = qualification.id;
    });

    tournament_qualification_scores.forEach(score => {
      if (score.tournament == tournament_qualification_id)
        tournament_qualification_scores_id = score.id;
    });

    try {
      const response = await requestNewBackend(
        "patch",
        "/api/v1/gaming/tournament_qualification_score/" +
          tournament_qualification_scores_id,
        access_token,
        {
          team: team_id,
          email: user_email,
          user: infoProfile.id,
          status: 2
        },
        "application/json",
        "Bearer"
      );
      console.log("patchTournamentQualification");
      console.log(response);

      if (response.status === 200) {
        updateState();
        dispatch({
          type: PATCH_TOURNAMENT_QUALFICATION,
          payload: {
            team_qualification_enrolled: { ...response.data }
          }
        });
      } else if (response.status == 404) {
        // not in time o non so cos'altro
        // alert(response.data);
      } else if (response.status == 400) {
        // not in time o non so cos'altro
        // alert(response.data);
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app
        dispatch(
          forceRefreshTokenWithCallback(patchTournamentQualification(id))
        );
      }
    } catch (error) {
      console.log("patchTournamentQualification");
      console.log(error);
    }
  };
}

export function setTeamScreenUvisible(dataUser = {}) {
  return function(dispatch, getState) {
    dispatch({
      type: SET_TEAM_SCREEN_UNVISIBLE,
      payload: {
        first_team_screen_visible: false
      }
    });
  };
}

function getTournamentScoreQualificationDirectRoundAllowedByUser(
  tournaments = [],
  dispatch = null,
  getState = {},
  access_token,
  errorCallback = () => {}
) {
  try {
    const start = async () => {
      await asyncForEach(tournaments, async tournament => {
        let uri = "/api/v1/gaming/tournament_qualification_allowed_by_user/",
          toDispatch = () => {};
        if (tournament.qualification == true) {
          uri = "/api/v1/gaming/tournament_qualification_allowed_by_user/";
          toDispatch = () => {
            console.log("GET_ALLOWED_TOURNAMENTS_QUALIFICATION");
            dispatch({
              type: GET_ALLOWED_TOURNAMENTS_QUALIFICATION,
              payload: { tournament_qualification_scores: [...response.data] }
            });
          };
        }
        // if (tournament.direct == true) {
        //   uri = "/api/v1/gaming/tournament_direct_allowed_by_user/";
        //   toDispatch = () => {
        //     console.log("GET_ALLOWED_TOURNAMENTS_DIRECT");
        //     dispatch({
        //       type: GET_ALLOWED_TOURNAMENTS_DIRECT,
        //       payload: { tournament_direct_scores: [...response.data] }
        //     });
        //   };
        // }
        // if (tournament.round == true) {
        //   uri = "/api/v1/gaming/tournament_round_allowed_by_user/";
        //   toDispatch = () => {
        //     console.log("GET_ALLOWED_TOURNAMENTS_ROUND");
        //     dispatch({
        //       type: GET_ALLOWED_TOURNAMENTS_ROUND,
        //       payload: { tournament_round_scores: [...response.data] }
        //     });
        //   };
        // }

        const response = await requestNewBackend(
          "get",
          uri,
          access_token,
          null,
          "application/json",
          "Bearer"
        );
        console.log("getTournamentScoreQualificationDirectRoundAllowedByUser");
        console.log(response);

        if (response.status === 200) {
          toDispatch();
        } else if (response.status == 401) {
          errorCallback();
        }
      });
    };
    start();
  } catch (error) {
    console.log("getTournamentScoreQualificationDirectRoundAllowedByUser");
    console.log(error);
  }
}

function getQualificationDirectRoundByTournament(
  tournaments = [],
  dispatch = null,
  getState = {},
  access_token,
  errorCallback = () => {}
) {
  try {
    const start = async () => {
      await asyncForEach(tournaments, async tournament => {
        let uri =
            "/api/v1/gaming/tournament_qualification_by_tournament/" +
            tournament.id,
          toDispatch = () => {};
        if (tournament.qualification == true) {
          uri =
            "/api/v1/gaming/tournament_qualification_by_tournament/" +
            tournament.id;
          toDispatch = () => {
            console.log("GET_TOURNAMENT_QUALIFICATION");
            dispatch({
              type: GET_TOURNAMENT_QUALIFICATION,
              payload: { tournament_qualification: response.data }
            });
          };
        }
        // if (tournament.direct == true) {
        //   uri =
        //     "/api/v1/gaming/tournament_direct_by_tournament/" + tournament.id;
        //   toDispatch = () => {
        //     console.log("GET_TOURNAMENT_DIRECT");
        //     dispatch({
        //       type: GET_TOURNAMENT_DIRECT,
        //       payload: { tournament_direct: response.data }
        //     });
        //   };
        // }
        // if (tournament.round == true) {
        //   uri =
        //     "/api/v1/gaming/tournament_round_by_tournament/" + tournament.id;
        //   toDispatch = () => {
        //     console.log("GET_TOURNAMENT_ROUND");
        //     dispatch({
        //       type: GET_TOURNAMENT_ROUND,
        //       payload: { tournament_round: response.data }
        //     });
        //   };
        // }

        const response = await requestNewBackend(
          "get",
          uri,
          access_token,
          null,
          "application/json",
          "Bearer"
        );
        console.log("getQualificationDirectRoundByTournament");
        console.log(response);

        if (response.status === 200) {
          toDispatch();
        } else if (response.status == 401) {
          errorCallback();
        }
      });
    };
    start();
  } catch (error) {
    console.log("getQualificationDirectRoundByTournament");
    console.log(error);
  }
}

export function getQualificationRankingByQualification(
  qualification_id,
  callback = () => {},
  dataUser = {}
) {
  return async function backendRequest(dispatch, getState) {
    console.log("getQualificationRankingByQualification");
    let { access_token } = getState().login;
    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/gaming/tournament_qualification_ranking/" + qualification_id,
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log("getQualificationRankingByQualification");
      console.log(response);

      if (response.status === 200) {
        callback(response.data);
      } else if (response.status == 401) {
        dispatch(
          forceRefreshTokenWithCallback(
            getQualificationRankingByQualification(dataUser)
          )
        );
      }
    } catch (error) {
      console.log("getQualificationRankingByQualification");
      console.log(error);
    }
  };
}

export function getBestPlayersByTournament(
  tournament_id,
  callback = () => {},
  dataUser = {}
) {
  return async function backendRequest(dispatch, getState) {
    console.log("getBestPlayersByTournament");
    let { access_token } = getState().login;
    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/gaming/tournament_best_players/" + tournament_id,
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log("getBestPlayersByTournament");
      console.log(response);

      if (response.status === 200) {
        callback(response.data);
      } else if (response.status == 401) {
        dispatch(
          forceRefreshTokenWithCallback(getBestPlayersByTournament(dataUser))
        );
      }
    } catch (error) {
      console.log("getBestPlayersByTournament");
      console.log(error);
    }
  };
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
