import {
  GET_LEADBOARD,
  GET_LEADBOARD_BY_CITY,
  GET_LEADBOARD_FAILED,
  SET_LEADERBOARD_SELECTED,
  SET_LEADERBOARD_TIMING,
  FETCHING_DATA,
  FETCHING_DATA_COMPLETE,
  GET_TROPHIES,
  GET_LEADBOARD_BY_COMMUNITY,
  GET_LEADBOARD_FRIEND,
  GET_POSITION
} from "./ActionTypes";
import axios from "axios";
import qs from "qs";
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

export const EndGMTTournament = 17;

export function getLeaderboard(dataUser = {}, callback = null) {
  return async function(dispatch, getState) {
    const {
      access_token,
      refresh_token,
      date,
      username,
      password
    } = getState().login;
    let now = +new Date();

    // token ancora valido
    if (now < date) {
      dispatch({
        type: FETCHING_DATA
      });
      try {
        const y = new Date().getFullYear() + 1;
        const response = await requestBackend(
          "get",
          "/api/v1/leaderboard/?to_year=" + y,
          access_token,
          null, // { year: new Date().getFullYear() },
          null,
          "Bearer"
        );
        if (response.status === 200) {
          console.log("api/v1/leaderboard returns 200");
          // console.log(response);
          if (callback) {
            const { user_id } = getState().login.infoProfile;
            callback(response.data, user_id);
          } else {
            dispatch({
              type: GET_LEADBOARD,
              payload: response.data
            });
          }
        } else {
          console.log("api/v1/leaderboard returns error");
          // console.log(response);
          dispatch({
            type: GET_LEADBOARD_FAILED
            // payload: { error_description: response.data.error }
          });
        }
      } catch (exception) {
        console.log("Exception from api/v1/leaderboard");
        console.log(exception);
        dispatch({
          type: GET_LEADBOARD_FAILED
        });
      }
    } else {
      // richiedi un nuovo token
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(RefreshToken({ ...dataUser, callback: getMonthlyLeaderboard }));
    }
  };
}

export function dispatchNotification() {
  return async function(dispatch) {
    // mando un dispatch cosi cambio lo stato e di conseguenza la classifica controlla la nuova data dato che è cambiato lo stato
    // utile per freezare la classifica aprendo la classifica
    console.log("dispatch notification");
    dispatch({
      type: FETCHING_DATA
    });
    dispatch({
      type: FETCHING_DATA_COMPLETE
    });
  };
}

export function getMonthlyLeaderboard(
  dataUser = {},
  pointsTot,
  points,
  evento,
  checkEventPointsMonth = null
) {
  return async function(dispatch, getState) {
    const {
      access_token,
      refresh_token,
      date,
      username,
      password,
      infoProfile
    } = getState().login;
    let now = +new Date();
    // controllo prima se il dato dell'utente e in particolare la città c'e
    // altrimenti la chiedo con getprofile
    if (now < date) {
      const { user_id } = infoProfile;
      // token ancora valido
      dispatch({
        type: FETCHING_DATA
      });
      try {
        const today = new Date();
        const firstDayMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );
        const lastDayMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );

        const y = new Date().getFullYear();
        const to_y = y;

        const m = firstDayMonth.getMonth() + 1;
        const to_m = m;

        const d = firstDayMonth.getDate();
        const to_d = lastDayMonth.getDate();

        const queryString = `/api/v1/leaderboard/?year=${y}&month=${m}&day=${d}&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}`;

        const response = await requestBackend(
          "get",
          queryString,
          access_token,
          null, // { year: new Date().getFullYear(), city_id: infoProfile.city.id },
          null,
          "Bearer"
        );
        if (response.status === 200) {
          console.log("api/v1/leaderboard by city returns 200");
          console.log(response);
          if (checkEventPointsMonth) {
            console.log("controllo punti mensili ");
            let pointsUser = 0;
            for (index = 0; index < response.data.length; index++) {
              const condition =
                response.data[index].referred_route__user_id === user_id
                  ? true
                  : false;
              if (condition) {
                pointsUser = response.data[index].points;
                break;
              }
            }
            console.log("uso i punti mensili ");
            dispatch(
              checkEventPointsMonth(
                pointsUser,
                pointsTot,
                points,
                evento,
                dispatch
              )
            );
          } else {
            dispatch({
              type: GET_LEADBOARD,
              payload: response.data,
              user: user_id
            });
          }
        } else {
          console.log("api/v1/leaderboard by city returns error");
          console.log(response);
          dispatch({
            type: GET_LEADBOARD_FAILED
            // payload: { error_description: response.data.error }
          });
        }
      } catch (exception) {
        console.log(
          "Exception from api/v1/leaderboard by getMonthlyLeaderboard"
        );
        console.log(exception);
        dispatch({
          type: GET_LEADBOARD_FAILED
        });
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(RefreshToken({ ...dataUser, callback: getMonthlyLeaderboard }));
    }
  };
}

// metodo per prendere i dati della classifica settimanale ma consideriamo gli amici per calcolare  la classifica
export function getWeeklyFriendLeaderboard(
  dataUser = {},
  pointsTot,
  points,
  evento,
  checkEventPointsWeek = null
) {
  return async function(dispatch, getState) {
    const { access_token, date, infoProfile } = getState().login;
    let now = +new Date();
    // controllo prima se il dato dell'utente e in particolare la città c'e
    // altrimenti la chiedo con getprofile
    if (now < date) {
      const { user_id } = infoProfile;
      // token ancora valido
      dispatch({
        type: FETCHING_DATA
      });
      try {
        const previousMonday = new Date(getPreviousMonday());
        const nextSunday = new Date(getNextSunday());

        const y = previousMonday.getFullYear();
        const to_y = nextSunday.getFullYear();

        const m = previousMonday.getMonth() + 1;
        const to_m = nextSunday.getMonth() + 1;

        const d = previousMonday.getDate();
        const to_d = nextSunday.getDate();

        const DifferenceMinutesUTC = new Date().getTimezoneOffset() / 60; // in italia da -60
        console.log(DifferenceMinutesUTC);
        const to_hour = EndGMTTournament - DifferenceMinutesUTC; // come se fosse un altra ore indietro avevo fatto punti alle 16 e qualcosa e qualcaso ma con 15 non mi dava nulla invece 14 si
        const hour = 3 - DifferenceMinutesUTC;

        // const queryString = `/api/v1/leaderboard/?year=2018&month=10&day=08&to_year=2018&to_month=10&to_day=14`;
        // const queryString = `/api/v1/leaderboard/?year=${y}&month=${m}&day=${d}&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}`;
        const queryString = `/api/v1/leaderboard/?year=${y}&month=${m}&day=${d}&hour=${hour}&minute=0&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}&to_hour=${to_hour}&to_minute=0`;

        console.log(queryString);

        const response = await requestBackend(
          "get",
          queryString,
          access_token,
          null, // { year: new Date().getFullYear(), city_id: infoProfile.city.id },
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          const { followed } = getState().follow;
          console.log("api/v1/getWeeklyFriendLeaderboard by city returns 200");
          console.log(response);

          // response.data
          const userFollowed = followed.length
            ? followed.map(friend => friend.user_followed.user_id)
            : [];
          console.log(userFollowed);

          let infoUserFriendsClassification = {
            index: "-",
            points: 0,
            numFriend: "-"
          };

          if (userFollowed.length) {
            const friendStandings = response.data.filter(
              user =>
                userFollowed.indexOf(user.referred_route__user_id) !== -1 ||
                user.referred_route__user_id === user_id
            );
            console.log(friendStandings);

            for (index = 0; index < friendStandings.length; index++) {
              const condition =
                friendStandings[index].referred_route__user_id === user_id
                  ? true
                  : false;
              if (condition) {
                infoUserFriendsClassification = {
                  points: friendStandings[index].points,
                  index,
                  numFriend: friendStandings.length
                };
                break;
              }
            }
          } else {
            for (index = 0; index < response.data.length; index++) {
              const condition =
                response.data[index].referred_route__user_id === user_id
                  ? true
                  : false;
              if (condition) {
                infoUserFriendsClassification.points =
                  response.data[index].points;

                break;
              }
            }
          }

          dispatch({
            type: GET_LEADBOARD_FRIEND,
            payload: infoUserFriendsClassification,
            standing: response.data
          });
        } else if (
          response.data &&
          response.data.error == "players not found"
        ) {
          // se non ci sono giocatori setto i punti a 0
          let infoUserFriendsClassification = {
            index: "-",
            points: 0,
            numFriend: "-"
          };
          dispatch({
            type: GET_LEADBOARD_FRIEND,
            payload: infoUserFriendsClassification,
            standing: []
          });
        } else if (response.status === 403) {
          // se il token è scaduto
          // lo rinnovo e poi ricarico le richieste dall'app
          console.log("token scaduto");

          dispatch(
            RefreshTokenObligatory({
              ...dataLogin,
              callback: getWeeklyFriendLeaderboard
            })
          );
        } else {
          console.log("api/v1/leaderboard by city returns error");
          console.log(response);
          dispatch({
            type: GET_LEADBOARD_FAILED
            // payload: { error_description: response.data.error }
          });
        }
      } catch (exception) {
        console.log(
          "Exception from api/v1/leaderboard by getWeeklyLeaderboard"
        );
        console.log(exception);
        dispatch({
          type: GET_LEADBOARD_FAILED
        });
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(
        RefreshToken({ ...dataUser, callback: getWeeklyFriendLeaderboard })
      );
    }
  };
}
// metodo per prendere i dati della classifica settimanale e iin caso chimare la funzione checkEventPointsWeek utile per controllare l'evento per i punti totali
export function getWeeklyLeaderboard(
  dataUser = {},
  pointsTot,
  points,
  evento,
  checkEventPointsWeek = null
) {
  return async function(dispatch, getState) {
    const { access_token, date, infoProfile } = getState().login;
    let now = +new Date();
    // controllo prima se il dato dell'utente e in particolare la città c'e
    // altrimenti la chiedo con getprofile
    if (now < date) {
      const { user_id } = infoProfile;
      // token ancora valido
      dispatch({
        type: FETCHING_DATA
      });
      try {
        const previousMonday = new Date(getPreviousMonday());
        const nextSunday = new Date(getNextSunday());

        const y = previousMonday.getFullYear();
        const to_y = nextSunday.getFullYear();

        const m = previousMonday.getMonth() + 1;
        const to_m = nextSunday.getMonth() + 1;

        const d = previousMonday.getDate();
        const to_d = nextSunday.getDate();

        const DifferenceMinutesUTC = new Date().getTimezoneOffset() / 60; // in italia da -60
        console.log(DifferenceMinutesUTC);
        const to_hour = EndGMTTournament - DifferenceMinutesUTC; // come se fosse un altra ore indietro avevo fatto punti alle 16 e qualcosa e qualcaso ma con 15 non mi dava nulla invece 14 si
        const hour = 3 - DifferenceMinutesUTC;

        // const queryString = `/api/v1/leaderboard/?year=2018&month=10&day=08&to_year=2018&to_month=10&to_day=14`;
        // const queryString = `/api/v1/leaderboard/?year=${y}&month=${m}&day=${d}&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}`;
        const queryString = `/api/v1/leaderboard/?year=${y}&month=${m}&day=${d}&hour=${hour}&minute=0&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}&to_hour=${to_hour}&to_minute=0`;

        console.log(queryString);

        const response = await requestBackend(
          "get",
          queryString,
          access_token,
          null, // { year: new Date().getFullYear(), city_id: infoProfile.city.id },
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          console.log("api/v1/leaderboard by city returns 200");
          console.log(response);

          // se è per il controllo del'evento, vedo i punti dell'utente

          if (checkEventPointsWeek) {
            let pointsUser = 0;
            for (index = 0; index < response.data.length; index++) {
              const condition =
                response.data[index].referred_route__user_id === user_id
                  ? true
                  : false;
              if (condition) {
                pointsUser = response.data[index].points;
                break;
              }
            }

            checkEventPointsWeek(
              pointsUser,
              pointsTot,
              points,
              evento,
              dispatch
            );
            dispatch({
              type: "niente",
              payload: {}
            });
          } else {
            dispatch({
              type: GET_LEADBOARD,
              payload: response.data,
              user: user_id
            });
          }
        } else if (
          response.data &&
          response.data.error == "players not found"
        ) {
          dispatch({
            type: GET_LEADBOARD,
            payload: [],
            user: user_id
          });
        } else if (response.status === 403) {
          // se il token è scaduto
          // lo rinnovo e poi ricarico le richieste dall'app
          console.log("token scaduto");

          dispatch(
            RefreshTokenObligatory({
              ...dataLogin,
              callback: getWeeklyLeaderboard
            })
          );
        } else {
          console.log("api/v1/leaderboard by city returns error");
          console.log(response);
          dispatch({
            type: GET_LEADBOARD_FAILED
            // payload: { error_description: response.data.error }
          });
        }
      } catch (exception) {
        console.log(
          "Exception from api/v1/leaderboard by getWeeklyLeaderboard"
        );
        console.log(exception);
        dispatch({
          type: GET_LEADBOARD_FAILED
        });
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(RefreshToken({ ...dataUser, callback: getWeeklyLeaderboard }));
    }
  };
}

export function getLeaderboardByCity(dataUser = {}) {
  return async function(dispatch, getState) {
    const { access_token, date, infoProfile } = getState().login;
    let now = +new Date();
    // controllo prima se il dato dell'utente e in particolare la città c'e
    // altrimenti la chiedo con getprofile
    const { city } = infoProfile;
    if (city ? false : true) {
      dispatch(
        getProfile({ ...dataUser, afterCallback: getLeaderboardByCity })
      );
    } else if (now < date) {
      const { user_id } = infoProfile;
      // token ancora valido
      dispatch({
        type: FETCHING_DATA
      });
      try {
        const y = new Date().getFullYear() + 1;
        const city = infoProfile.city.id;
        const response = await requestBackend(
          "get",
          "/api/v1/leaderboard/?to_year=" + y + "&city_id=" + city,
          access_token,
          null, // { year: new Date().getFullYear(), city_id: infoProfile.city.id },
          null,
          "Bearer"
        );
        if (response.status === 200) {
          console.log("api/v1/leaderboard by city returns 200");
          // console.log(response);
          dispatch({
            type: GET_LEADBOARD_BY_CITY,
            payload: response.data,
            user: user_id
          });
        } else {
          console.log("api/v1/leaderboard by city returns error");
          console.log(response);
          dispatch({
            type: GET_LEADBOARD_FAILED
            // payload: { error_description: response.data.error }
          });
        }
      } catch (exception) {
        console.log(
          "Exception from api/v1/leaderboard by getLeaderboardByCity"
        );
        console.log(exception);
        dispatch({
          type: GET_LEADBOARD_FAILED
        });
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(RefreshToken({ ...dataUser, callback: getLeaderboardByCity }));
    }
  };
}

export function getMonthlyLeaderboardByCity(dataUser = {}) {
  return async function(dispatch, getState) {
    const { access_token, date, infoProfile } = getState().login;
    let now = +new Date();
    // controllo prima se il dato dell'utente e in particolare la città c'e
    // altrimenti la chiedo con getprofile
    const { city } = infoProfile;
    if (city ? false : true) {
      dispatch(
        getProfile({ ...dataUser, afterCallback: getMonthlyLeaderboardByCity })
      );
    } else if (now < date) {
      const { user_id } = infoProfile;
      // token ancora valido
      dispatch({
        type: FETCHING_DATA
      });
      try {
        const today = new Date();
        const firstDayMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );
        const lastDayMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );

        const y = new Date().getFullYear();
        const to_y = y;

        const m = firstDayMonth.getMonth() + 1;
        const to_m = m;

        const d = firstDayMonth.getDate();
        const to_d = lastDayMonth.getDate();

        const city = infoProfile.city.id;

        const queryString = `/api/v1/leaderboard/?city_id=${city}&year=${y}&month=${m}&day=${d}&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}`;

        const response = await requestBackend(
          "get",
          queryString,
          access_token,
          null, // { year: new Date().getFullYear(), city_id: infoProfile.city.id },
          null,
          "Bearer"
        );
        if (response.status === 200) {
          console.log("api/v1/leaderboard by city returns 200");
          console.log(response);
          dispatch({
            type: GET_LEADBOARD_BY_CITY,
            payload: response.data,
            user: user_id
          });
        } else {
          console.log("api/v1/leaderboard by city returns error");
          console.log(response);
          dispatch({
            type: GET_LEADBOARD_FAILED
            // payload: { error_description: response.data.error }
          });
        }
      } catch (exception) {
        console.log(
          "Exception from api/v1/leaderboard by getMonthlyLeaderboardByCity"
        );
        console.log(exception);
        dispatch({
          type: GET_LEADBOARD_FAILED
        });
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(
        RefreshToken({ ...dataUser, callback: getMonthlyLeaderboardByCity })
      );
    }
  };
}

export function getWeeklyLeaderboardByCommunity(dataUser = {}) {
  return async function(dispatch, getState) {
    const { access_token, date, infoProfile } = getState().login;
    let now = +new Date();
    // controllo prima se il dato dell'utente e in particolare la città c'e
    // altrimenti la chiedo con getprofile
    const { community } = infoProfile;
    if (community ? false : true) {
      // se non ho la comunity
      // niente richiesta
    } else if (now < date) {
      const { user_id } = infoProfile;
      // token ancora valido
      dispatch({
        type: FETCHING_DATA
      });
      try {
        const previousMonday = new Date(getPreviousMonday());
        const nextSunday = new Date(getNextSunday());

        const y = previousMonday.getFullYear();
        const to_y = nextSunday.getFullYear();

        const m = previousMonday.getMonth() + 1;
        const to_m = nextSunday.getMonth() + 1;

        const d = previousMonday.getDate();
        const to_d = nextSunday.getDate();

        const communityId = community.id;

        const DifferenceMinutesUTC = new Date().getTimezoneOffset() / 60; // in italia da -60
        const to_hour = EndGMTTournament - DifferenceMinutesUTC; // come se fosse un altra ore indietro avevo fatto punti alle 16 e qualcosa e qualcaso ma con 15 non mi dava nulla invece 14 si
        const hour = 3 - DifferenceMinutesUTC;

        // const queryString = `/api/v1/leaderboard/?city_id=${city}&year=${y}&month=${m}&day=${d}&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}`;
        const queryString = `/api/v1/leaderboard/?community_id=${communityId}&year=${y}&month=${m}&day=${d}&hour=${hour}&minute=0&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}&to_hour=${to_hour}&to_minute=0`;

        console.log(queryString);

        const response = await requestBackend(
          "get",
          queryString,
          access_token,
          null, // { year: new Date().getFullYear(), city_id: infoProfile.city.id },
          null,
          "Bearer"
        );
        if (response.status === 200) {
          console.log("api/v1/leaderboard by city returns 200");
          dispatch({
            type: GET_LEADBOARD_BY_COMMUNITY,
            payload: response.data,
            user: user_id
          });
        } else if (
          response.data &&
          response.data.error == "players not found"
        ) {
          console.log("object");
          dispatch({
            type: GET_LEADBOARD_BY_COMMUNITY,
            payload: [],
            user: user_id
          });
        } else if (response.status === 403) {
          // se il token è scaduto
          // lo rinnovo e poi ricarico le richieste dall'app
          console.log("token scaduto");

          dispatch(
            RefreshTokenObligatory({
              ...dataLogin,
              callback: getWeeklyLeaderboardByCommunity
            })
          );
        } else {
          console.log("api/v1/leaderboard by city returns error");
          console.log(response);
          dispatch({
            type: GET_LEADBOARD_FAILED
            // payload: { error_description: response.data.error }
          });
        }
      } catch (exception) {
        console.log(
          "Exception from api/v1/leaderboard by getWeeklyLeaderboardByCommunity"
        );
        console.log(exception);
        dispatch({
          type: GET_LEADBOARD_FAILED
        });
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(
        RefreshToken({ ...dataUser, callback: getWeeklyLeaderboardByCommunity })
      );
    }
  };
}

export function getWeeklyPositionByCommunity(dataUser = {}) {
  return async function(dispatch, getState) {
    const { access_token, date, infoProfile } = getState().login;
    let now = +new Date();
    // controllo prima se il dato dell'utente e in particolare la città c'e
    // altrimenti la chiedo con getprofile
    const { community } = infoProfile;
    if (community ? false : true) {
      // se non ho la comunity
      // niente richiesta
    } else if (now < date) {
      // token ancora valido

      try {
        const previousMonday = new Date(getPreviousMonday());
        const nextSunday = new Date(getNextSunday());

        const y = previousMonday.getFullYear();
        const to_y = nextSunday.getFullYear();

        const m = previousMonday.getMonth() + 1;
        const to_m = nextSunday.getMonth() + 1;

        const d = previousMonday.getDate();
        const to_d = nextSunday.getDate();

        const communityId = community.id;

        const DifferenceMinutesUTC = new Date().getTimezoneOffset() / 60; // in italia da -60
        const to_hour = EndGMTTournament - DifferenceMinutesUTC; // come se fosse un altra ore indietro avevo fatto punti alle 16 e qualcosa e qualcaso ma con 15 non mi dava nulla invece 14 si
        const hour = 3 - DifferenceMinutesUTC;

        // const queryString = `/api/v1/leaderboard/?city_id=${city}&year=${y}&month=${m}&day=${d}&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}`;
        const queryString = `/api/v1/user_rank/?community_id=${communityId}&year=${y}&month=${m}&day=${d}&hour=${hour}&minute=0&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}&to_hour=${to_hour}&to_minute=0`;

        console.log(queryString);

        const response = await requestBackend(
          "get",
          queryString,
          access_token,
          null, // { year: new Date().getFullYear(), city_id: infoProfile.city.id },
          null,
          "Bearer"
        );
        if (response.status === 200) {
          console.log("api/v1/leaderboard by city returns 200");
          dispatch({
            type: GET_POSITION,
            payload: response.data,
            typePosition: "infoUserCommunityClassification"
          });
        } else if (
          response.data &&
          response.data.error == "players not found"
        ) {
          console.log("object");
          dispatch({
            type: GET_POSITION,
            payload: { user_rank: "-", user_points: 0, total_users: "-" },
            typePosition: "infoUserCommunityClassification"
          });
        } else if (response.status === 403) {
          // se il token è scaduto
          // lo rinnovo e poi ricarico le richieste dall'app
          console.log("token scaduto");

          dispatch(
            RefreshTokenObligatory({
              ...dataLogin,
              callback: getWeeklyPositionByCommunity
            })
          );
        } else {
          console.log("api/v1/leaderboard by city returns error");
          console.log(response);
          dispatch({
            type: GET_LEADBOARD_FAILED
            // payload: { error_description: response.data.error }
          });
        }
      } catch (exception) {
        console.log(
          "Exception from api/v1/leaderboard by getWeeklyPositionByCommunity"
        );
        console.log(exception);
        dispatch({
          type: GET_LEADBOARD_FAILED
        });
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(
        RefreshToken({ ...dataUser, callback: getWeeklyPositionByCommunity })
      );
    }
  };
}

// metodo per prendere i dati della classifica settimanale e iin caso chimare la funzione checkEventPointsWeek utile per controllare l'evento per i punti totali
export function getWeeklyPosition(
  dataUser = {},
  pointsTot,
  points,
  evento,
  checkEventPointsWeek = null
) {
  return async function(dispatch, getState) {
    const { access_token, date, infoProfile } = getState().login;
    let now = +new Date();
    // controllo prima se il dato dell'utente e in particolare la città c'e
    // altrimenti la chiedo con getprofile
    if (now < date) {
      // token ancora valido

      try {
        const previousMonday = new Date(getPreviousMonday());
        const nextSunday = new Date(getNextSunday());

        const y = previousMonday.getFullYear();
        const to_y = nextSunday.getFullYear();

        const m = previousMonday.getMonth() + 1;
        const to_m = nextSunday.getMonth() + 1;

        const d = previousMonday.getDate();
        const to_d = nextSunday.getDate();

        const DifferenceMinutesUTC = new Date().getTimezoneOffset() / 60; // in italia da -60
        console.log(DifferenceMinutesUTC);
        const to_hour = EndGMTTournament - DifferenceMinutesUTC; // come se fosse un altra ore indietro avevo fatto punti alle 16 e qualcosa e qualcaso ma con 15 non mi dava nulla invece 14 si
        const hour = 3 - DifferenceMinutesUTC;

        // const queryString = `/api/v1/leaderboard/?year=2018&month=10&day=08&to_year=2018&to_month=10&to_day=14`;
        // const queryString = `/api/v1/leaderboard/?year=${y}&month=${m}&day=${d}&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}`;
        const queryString = `/api/v1/user_rank/?year=${y}&month=${m}&day=${d}&hour=${hour}&minute=0&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}&to_hour=${to_hour}&to_minute=0`;

        console.log(queryString);

        const response = await requestBackend(
          "get",
          queryString,
          access_token,
          null, // { year: new Date().getFullYear(), city_id: infoProfile.city.id },
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          console.log("api/v1/leaderboard by city returns 200");
          console.log(response);

          // se è per il controllo del'evento, vedo i punti dell'utente

          if (checkEventPointsWeek) {
            let pointsUser = 0;
            for (index = 0; index < response.data.length; index++) {
              const condition =
                response.data[index].referred_route__user_id === user_id
                  ? true
                  : false;
              if (condition) {
                pointsUser = response.data[index].points;
                break;
              }
            }

            checkEventPointsWeek(
              pointsUser,
              pointsTot,
              points,
              evento,
              dispatch
            );
            dispatch({
              type: "niente",
              payload: {}
            });
          } else {
            dispatch({
              type: GET_POSITION,
              payload: response.data,
              typePosition: "infoUserGlobalClassification"
            });
          }
        } else if (
          response.data &&
          response.data.error == "players not found"
        ) {
          dispatch({
            type: GET_POSITION,
            payload: { user_rank: "-", user_points: 0, total_users: "-" },
            typePosition: "infoUserGlobalClassification"
          });
        } else if (response.status === 403) {
          // se il token è scaduto
          // lo rinnovo e poi ricarico le richieste dall'app
          console.log("token scaduto");

          dispatch(
            RefreshTokenObligatory({
              ...dataLogin,
              callback: getWeeklyPosition
            })
          );
        } else {
          console.log("api/v1/leaderboard by city returns error");
          console.log(response);
          dispatch({
            type: GET_LEADBOARD_FAILED
            // payload: { error_description: response.data.error }
          });
        }
      } catch (exception) {
        console.log("Exception from api/v1/leaderboard by getWeeklyPosition");
        console.log(exception);
        dispatch({
          type: GET_LEADBOARD_FAILED
        });
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(RefreshToken({ ...dataUser, callback: getWeeklyPosition }));
    }
  };
}

export function getWeeklyPositionByCity(dataUser = {}) {
  return async function(dispatch, getState) {
    const { access_token, date, infoProfile } = getState().login;
    let now = +new Date();
    // controllo prima se il dato dell'utente e in particolare la città c'e
    // altrimenti la chiedo con getprofile
    const { city } = infoProfile;
    if (city ? false : true) {
      dispatch(
        getProfile({ ...dataUser, afterCallback: getWeeklyPositionByCity })
      );
    } else if (now < date) {
      // token ancora valido

      try {
        const previousMonday = new Date(getPreviousMonday());
        const nextSunday = new Date(getNextSunday());

        const y = previousMonday.getFullYear();
        const to_y = nextSunday.getFullYear();

        const m = previousMonday.getMonth() + 1;
        const to_m = nextSunday.getMonth() + 1;

        const d = previousMonday.getDate();
        const to_d = nextSunday.getDate();

        const city = infoProfile.city.id;

        const DifferenceMinutesUTC = new Date().getTimezoneOffset() / 60; // in italia da -60
        const to_hour = EndGMTTournament - DifferenceMinutesUTC; // come se fosse un altra ore indietro avevo fatto punti alle 16 e qualcosa e qualcaso ma con 15 non mi dava nulla invece 14 si
        const hour = 3 - DifferenceMinutesUTC;

        // const queryString = `/api/v1/leaderboard/?city_id=${city}&year=${y}&month=${m}&day=${d}&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}`;
        const queryString = `/api/v1/user_rank/?city_id=${city}&year=${y}&month=${m}&day=${d}&hour=${hour}&minute=0&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}&to_hour=${to_hour}&to_minute=0`;

        console.log(queryString);

        const response = await requestBackend(
          "get",
          queryString,
          access_token,
          null, // { year: new Date().getFullYear(), city_id: infoProfile.city.id },
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          console.log("api/v1/leaderboard by city returns 200");
          dispatch({
            type: GET_POSITION,
            payload: response.data,
            typePosition: "infoUserCityClassification"
          });
        } else if (
          response.data &&
          response.data.error == "players not found"
        ) {
          dispatch({
            type: GET_POSITION,
            payload: { user_rank: "-", user_points: 0, total_users: "-" },
            typePosition: "infoUserCityClassification"
          });
        } else if (response.status === 403) {
          // se il token è scaduto
          // lo rinnovo e poi ricarico le richieste dall'app
          console.log("token scaduto");

          dispatch(
            RefreshTokenObligatory({
              ...dataLogin,
              callback: getWeeklyPositionByCity
            })
          );
        } else {
          console.log("api/v1/leaderboard by city returns error");
          console.log(response);
          dispatch({
            type: GET_LEADBOARD_FAILED
            // payload: { error_description: response.data.error }
          });
        }
      } catch (exception) {
        console.log(
          "Exception from api/v1/leaderboard by getWeeklyPositionByCity"
        );
        console.log(exception);
        dispatch({
          type: GET_LEADBOARD_FAILED
        });
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(
        RefreshToken({ ...dataUser, callback: getWeeklyPositionByCity })
      );
    }
  };
}

export function getSpecificLederboard(dataUser = {}) {
  return async function(dispatch, getState) {
    const activeSelectable = getState().standings.selectedLeaderboard;
    if (activeSelectable == "community") {
      dispatch(getWeeklyLeaderboardByCommunity());
    } else if (activeSelectable == "global") {
      dispatch(getWeeklyLeaderboard());
    } else if (activeSelectable == "city") {
      dispatch(getWeeklyLeaderboardByCity());
    } else {
      dispatch(getWeeklyFriendLeaderboard());
    }
  };
}

export function getSpecificPosition(dataUser = {}) {
  return async function(dispatch, getState) {
    const activeSelectable = getState().standings.selectedLeaderboard;
    if (activeSelectable == "community") {
      dispatch(getWeeklyPositionByCommunity());
    } else if (activeSelectable == "global") {
      dispatch(getWeeklyPosition());
    } else if (activeSelectable == "city") {
      dispatch(getWeeklyPositionByCity());
    } else {
      dispatch(getWeeklyFriendLeaderboard());
    }
  };
}

export function getSpecificPositionNew() {
  const activeSelectable = store.getState().standings.selectedLeaderboard;
  console.log(activeSelectable);
  if (activeSelectable == "community") {
    store.dispatch(getWeeklyPositionByCommunity());
  } else if (activeSelectable == "global") {
    store.dispatch(getWeeklyPositionNew());
  } else if (activeSelectable == "city") {
    store.dispatch(getWeeklyPositionByCity());
  } else {
    store.dispatch(getWeeklyFriendLeaderboard());
  }
}

// recupero le info dell'utente per la settimana corrente
export function getWeeklyPositionNew() {
  return async function backendRequest(dispatch, getState) {
    console.log("getWeeklyPositionNew");
    // richiesta di accesso mandando i dati con axios
    let { access_token } = getState().login;

    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/gaming/ranking_by_user/",
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 200) {
        dispatch({
          type: GET_POSITION,
          payload: {
            user_rank: response.data.position,
            user_points: response.data.points,
            total_users: response.data.count
          },
          typePosition: "infoUserGlobalClassification"
        });

        // dispatch({
        //   type: GET_POSITION,
        //   payload: { user_rank: '-', user_points: 0,  total_users: '-'  },
        //   typePosition: 'infoUserCommunityClassification',
        // });
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(forceRefreshTokenWithCallback(getWeeklyPositionNew(dataUser)));
      } else {
        dispatch({
          type: GET_LEADBOARD_FAILED
        });
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);

        // if (error.response.status === 403) {
      } else if (error.request) {
        console.log(error.request);
        dispatch({
          type: GET_LEADBOARD_FAILED
        });
      } else {
        console.log(error.message);
      }
      dispatch({
        type: GET_LEADBOARD_FAILED
      });
      console.log(error.config);
    }
  };
}

export function getWeeklyLeaderboardByCity(dataUser = {}) {
  return async function(dispatch, getState) {
    const { access_token, date, infoProfile } = getState().login;
    let now = +new Date();
    // controllo prima se il dato dell'utente e in particolare la città c'e
    // altrimenti la chiedo con getprofile
    const { city } = infoProfile;
    if (city ? false : true) {
      dispatch(
        getProfile({ ...dataUser, afterCallback: getWeeklyLeaderboardByCity })
      );
    } else if (now < date) {
      const { user_id } = infoProfile;
      // token ancora valido
      dispatch({
        type: FETCHING_DATA
      });
      try {
        const previousMonday = new Date(getPreviousMonday());
        const nextSunday = new Date(getNextSunday());

        const y = previousMonday.getFullYear();
        const to_y = nextSunday.getFullYear();

        const m = previousMonday.getMonth() + 1;
        const to_m = nextSunday.getMonth() + 1;

        const d = previousMonday.getDate();
        const to_d = nextSunday.getDate();

        const city = infoProfile.city.id;

        const DifferenceMinutesUTC = new Date().getTimezoneOffset() / 60; // in italia da -60
        const to_hour = EndGMTTournament - DifferenceMinutesUTC; // come se fosse un altra ore indietro avevo fatto punti alle 16 e qualcosa e qualcaso ma con 15 non mi dava nulla invece 14 si
        const hour = 3 - DifferenceMinutesUTC;

        // const queryString = `/api/v1/leaderboard/?city_id=${city}&year=${y}&month=${m}&day=${d}&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}`;
        const queryString = `/api/v1/leaderboard/?city_id=${city}&year=${y}&month=${m}&day=${d}&hour=${hour}&minute=0&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}&to_hour=${to_hour}&to_minute=0`;

        console.log(queryString);

        const response = await requestBackend(
          "get",
          queryString,
          access_token,
          null, // { year: new Date().getFullYear(), city_id: infoProfile.city.id },
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          console.log("api/v1/leaderboard by city returns 200");
          dispatch({
            type: GET_LEADBOARD_BY_CITY,
            payload: response.data,
            user: user_id
          });
        } else if (
          response.data &&
          response.data.error == "players not found"
        ) {
          console.log("object");
          dispatch({
            type: GET_LEADBOARD_BY_CITY,
            payload: [],
            user: user_id
          });
        } else if (response.status === 403) {
          // se il token è scaduto
          // lo rinnovo e poi ricarico le richieste dall'app
          console.log("token scaduto");

          dispatch(
            RefreshTokenObligatory({
              ...dataLogin,
              callback: getWeeklyLeaderboardByCity
            })
          );
        } else {
          console.log("api/v1/leaderboard by city returns error");
          console.log(response);
          dispatch({
            type: GET_LEADBOARD_FAILED
            // payload: { error_description: response.data.error }
          });
        }
      } catch (exception) {
        console.log(
          "Exception from api/v1/leaderboard by getWeeklyLeaderboardByCity"
        );
        console.log(exception);
        dispatch({
          type: GET_LEADBOARD_FAILED
        });
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(
        RefreshToken({ ...dataUser, callback: getWeeklyLeaderboardByCity })
      );
    }
  };
}

// prendo le info sulla classifica settimana
export function getWeeklyLeaderboardNew(
  dataUser = { limit: 100, offset: 0, afterRequest: () => {} }
) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // preparo la richiesta legata al login con username e password
    console.log("classifica new");
    let { access_token } = getState().login;

    const { limit, offset } = dataUser;

    dispatch({
      type: FETCHING_DATA
    });

    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/gaming/ranking/?limit=" + limit + "&offset=" + offset,
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log(response);
      // Alert.alert(response.status.toString())

      if (response.status === 200) {
        dispatch({
          type: GET_LEADBOARD,
          payload: response.data.results,
          offset,
          limit,
          user: 0
        });
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(
          forceRefreshTokenWithCallback(getWeeklyLeaderboardNew(dataUser))
        );
      }
      dataUser.afterRequest();
    } catch (error) {
      dispatch({
        type: FETCHING_DATA_COMPLETE
      });
    }
  };
}

// prendo le info sui miei trofei
export function getTrophiesNew(dataUser = {}) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    console.log("trophies new");
    let { access_token } = getState().login;

    dispatch({
      type: FETCHING_DATA
    });

    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/gaming/weekly_ranking_by_user/",
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log(response);
      // Alert.alert(response.status.toString())

      if (response.status === 200) {
        dispatch({
          type: GET_TROPHIES,
          payload: response.data.reverse()
        });
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(forceRefreshTokenWithCallback(getTrophiesNew(dataUser)));
      }
    } catch (error) {
      console.log("Exception from trophies new");
      console.log(error);
      dispatch({
        type: FETCHING_DATA_COMPLETE
      });
    }
  };
}

// prendo le info sui trofei di un un specifico giorno
export function getTrophiesDetailNew(
  dataUser = { week_date: "2020-03-15" },
  callbackSetState
) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    console.log("trophies detail new");
    let { access_token } = getState().login;
    const { week_date } = dataUser;
    dispatch({
      type: FETCHING_DATA
    });

    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/gaming/weekly_ranking_by_date/" + week_date,
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log(response);
      // Alert.alert(response.status.toString())

      if (response.status === 200) {
        callbackSetState(response.data);
        dispatch({ type: "nulla" });
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(forceRefreshTokenWithCallback(getTrophiesDetailNew(dataUser)));
      }
    } catch (error) {
      console.log("Exception from trophies detail new");
      console.log(error);
      dispatch({
        type: FETCHING_DATA_COMPLETE
      });
    }
  };
}

export function getTrophies(dataUser = {}) {
  return async function(dispatch, getState) {
    const { access_token, date } = getState().login;
    let now = +new Date();

    if (now < date) {
      // token ancora valido
      dispatch({
        type: FETCHING_DATA
      });
      try {
        const previousMonday = new Date(getPreviousMonday());

        const y = previousMonday.getFullYear();

        const m = previousMonday.getMonth() + 1;

        const d = previousMonday.getDate();

        const queryString = `/api/v1/trophies/`;

        console.log(queryString);

        const response = await requestBackend(
          "get",
          queryString,
          access_token,
          null, // { year: new Date().getFullYear(), city_id: infoProfile.city.id },
          null,
          "Bearer"
        );
        if (response.status === 200) {
          console.log("/api/v1/trophies/ returns 200");
          dispatch({
            type: GET_TROPHIES,
            payload: response.data
          });
        } else if (response.status === 400) {
          // {"description": "Trophies not found"}
          dispatch({
            type: FETCHING_DATA_COMPLETE
          });
        } else if (response.status === 404) {
          // {"description": "Trophies not found"}
          dispatch({
            type: FETCHING_DATA_COMPLETE
          });
        } else {
        }
        dispatch({
          type: FETCHING_DATA_COMPLETE
        });
      } catch (exception) {
        console.log("Exception from /api/v1/trophies/");
        console.log(exception);
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(RefreshToken({ ...dataUser, callback: getTrophies }));
    }
  };
}

export function getTrophiesDetail(dataUser = {}, callbackSetState) {
  return async function(dispatch, getState) {
    const { access_token, date, infoProfile } = getState().login;
    let now = +new Date();
    // controllo prima se il dato dell'utente e in particolare la città c'e
    // altrimenti la chiedo con getprofile
    if (now < date) {
      // token ancora valido
      dispatch({
        type: FETCHING_DATA
      });
      try {
        const city = dataUser.city;
        const date = dataUser.updated_at;
        console.log(city);

        const y = date.slice(0, 4);

        const m = date.slice(5, 7);

        const d = date.slice(8, 10);

        let queryString = `/api/v1/trophies/?year=${y}&month=${m}&day=${d}`;
        if (city) {
          queryString = `/api/v1/trophies/?city=${city}&year=${y}&month=${m}&day=${d}`;
        }

        console.log(queryString);

        const response = await requestBackend(
          "get",
          queryString,
          access_token,
          null, // { year: new Date().getFullYear(), city_id: infoProfile.city.id },
          null,
          "Bearer"
        );
        if (response.status === 200) {
          console.log("/api/v1/trophies/ returns 200");
          callbackSetState(response.data);
          dispatch({ type: "nulla" });
        } else if (response.status === 400) {
          // {"description": "Trophies not found"}
        } else {
        }
      } catch (exception) {
        console.log("Exception from /api/v1/trophies/");
        console.log(exception);
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(RefreshToken({ ...dataUser, callback: getTrophiesDetail }));
    }
  };
}

// // prendo chi seguo
// export function getFollowingUser(dataUser = {}, callbackSetState) {
//   return async function(dispatch, getState) {
//     const { access_token, date } = getState().login;
//     let now = +new Date();
//     // controllo prima se il dato dell'utente e in particolare la città c'e
//     // altrimenti la chiedo con getprofile
//     if (now < date) {
//       // token ancora valido
//       dispatch({
//         type: FETCHING_DATA
//       });
//       try {
//         const response = await requestBackend(
//           "get",
//           "/api/v1/follow/?follower=true",
//           access_token,
//           null,
//           null,
//           "Bearer"
//         );
//         if (response.status === 200) {
//           console.log("risposta followed");
//           dispatch({ type: GET_FOLLOWING, payload: response.data });
//         } else if (response.status === 400) {
//           dispatch({
//             type: FETCHING_DATA_COMPLETE
//           });
//           // {"description": "An error has occurred"}
//           console.log(response);
//         } else if (response.status === 404) {
//           // description:"No friends find"
//           console.log(response);
//           dispatch({ type: GET_FOLLOWING, payload: [] });
//         } else {
//           dispatch({
//             type: FETCHING_DATA_COMPLETE
//           });
//         }
//       } catch (exception) {
//         console.log("Exception from /api/v1/follow/");
//         console.log(exception);
//         dispatch({
//           type: FETCHING_DATA_COMPLETE
//         });
//       }
//     } else {
//       console.log(
//         "chiamata non possibile, richiamo login e poi questa richiesta"
//       );
//       dispatch(RefreshToken({ ...dataUser, callback: getFollowingUser }));
//     }
//   };
// }

// aggiungo qualcuno che voglio seguire
export function postFollowUser(dataUser = {}, callbackSetState) {
  return async function(dispatch, getState) {
    const { access_token, date } = getState().login;
    let now = +new Date();
    // followed_user_id obbligatorio
    const followed_user_id = dataUser.followed_user_id
      ? dataUser.followed_user_id
      : 0;

    const coin_followed_earned = dataUser.coin_followed_earned
      ? dataUser.coin_followed_earned
      : 3;
    const coin_follower_earned = dataUser.coin_follower_earned
      ? dataUser.coin_follower_earned
      : 3;

    const referral_url = dataUser.referral_url ? dataUser.referral_url : null;
    const link_status = dataUser.link_status ? dataUser.link_status : 0;

    // se l'utente è specificato mando la richiesta
    if (now < date && followed_user_id) {
      // token ancora valido

      let queryPost = `/api/v1/follow/`;
      // if (referral_url.length) {
      //   // se ho il link referral ricevuto
      //   queryPost = `/api/v1/follow/?followed_user_id=${followed_user_id}&coin_followed_earned=${coin_followed_earned}&coin_follower_earned=${coin_follower_earned}&referral_url=${referral_url}&link_status=${link_status}`;
      // }

      try {
        const response = await requestBackend(
          "post",
          queryPost,
          access_token,
          {
            followed_user_id,
            coin_followed_earned,
            coin_follower_earned,
            referral_url,
            link_status
          },
          "application/json",
          "Bearer"
        );
        if (response.status === 200) {
          // utente che seguo
          // { "description" : "Now you follow user Pippo P." }

          console.log("risposta del post followed ");
          // riprendo gli utenti che seguo
          dispatch(getFollowingUser(dataUser));
        } else if (response.status === 400) {
          // {"description": "An error has occurred"}
          console.log(response);
        } else {
          console.log(response);
        }
      } catch (exception) {
        console.log("Exception post from /api/v1/follow/");
        console.log(exception);
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(RefreshToken({ ...dataUser, callback: deleteFollowedUser }));
    }
  };
}

export function getWeeklyLeaderboardByCityToEighteen(dataUser = {}) {
  return async function(dispatch, getState) {
    const { access_token, date, infoProfile } = getState().login;
    let now = +new Date();
    // controllo prima se il dato dell'utente e in particolare la città c'e
    // altrimenti la chiedo con getprofile
    const { city } = infoProfile;
    if (city ? false : true) {
      dispatch(
        getProfile({
          ...dataUser,
          afterCallback: getWeeklyLeaderboardByCityToEighteen
        })
      );
    } else if (now < date) {
      // token ancora valido
      dispatch({
        type: FETCHING_DATA
      });
      try {
        const { user_id } = infoProfile;
        const city = infoProfile.city.id;

        // vedo se oggi è domenica
        const now = new Date();
        // 0 è domenica oppure se è lunedi fino alle 6

        const monday = now.getDay() === 1;

        let queryString;

        // la richiesta avviene con utc settato a 0 qundi devo normalizzare
        // calcolo il utc in piu , calcolo minuti e poi divido per 60 per ottenere le ore

        const DifferenceMinutesUTC = now.getTimezoneOffset() / 60; // in italia da -60
        console.log(DifferenceMinutesUTC);

        const to_hour = EndGMTTournament - DifferenceMinutesUTC; // come se fosse un altra ore indietro avevo fatto punti alle 16 e qualcosa e qualcaso ma con 15 non mi dava nulla invece 14 si
        const hour = 6 - DifferenceMinutesUTC;

        if (monday && now.getHours() < 6) {
          // se è lunedi e ancora non sono le 6 allora considero la settimana precedente
          // prendo la domenica precedente e il lunedi precedente
          const start = new Date();
          const end = new Date();
          const previousMonday = new Date(start.setDate(start.getDate() - 7));
          const nextSunday = new Date(end.setDate(end.getDate() - 1));
          console.log(previousMonday);
          console.log(nextSunday);

          const y = previousMonday.getFullYear();
          const to_y = nextSunday.getFullYear();

          const m = previousMonday.getMonth() + 1;
          const to_m = nextSunday.getMonth() + 1;

          const d = previousMonday.getDate();
          const to_d = nextSunday.getDate();

          queryString = `/api/v1/leaderboard/?city_id=${city}&year=${y}&month=${m}&day=${d}&hour=${hour}&minute=0&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}&to_hour=${to_hour}&to_minute=0`;
        } else {
          const previousMonday = new Date(getPreviousMonday());
          const nextSunday = new Date(getNextSunday());

          const y = previousMonday.getFullYear();
          const to_y = nextSunday.getFullYear();

          const m = previousMonday.getMonth() + 1;
          const to_m = nextSunday.getMonth() + 1;

          const d = previousMonday.getDate();
          const to_d = nextSunday.getDate();
          queryString = `/api/v1/leaderboard/?city_id=${city}&year=${y}&month=${m}&day=${d}&hour=${hour}&minute=0&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}&to_hour=${to_hour}&to_minute=0`;
        }

        // const queryString = `/api/v1/leaderboard/?city_id=${city}&year=${y}&month=${m}&day=${d}&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}`;

        console.log(queryString);

        const response = await requestBackend(
          "get",
          queryString,
          access_token,
          null, // { year: new Date().getFullYear(), city_id: infoProfile.city.id },
          null,
          "Bearer"
        );
        if (response.status === 200) {
          console.log("api/v1/leaderboard by city returns 200");
          dispatch({
            type: GET_LEADBOARD_BY_CITY,
            payload: response.data,
            user: user_id
          });
        } else if (
          response.data &&
          response.data.error == "players not found"
        ) {
          console.log("object");
          dispatch({
            type: GET_LEADBOARD_BY_CITY,
            payload: [],
            user: user_id
          });
        } else {
          console.log("api/v1/leaderboard by city returns error");
          console.log(response);
          dispatch({
            type: GET_LEADBOARD_FAILED
            // payload: { error_description: response.data.error }
          });
        }
      } catch (exception) {
        console.log(
          "Exception from api/v1/leaderboard by getWeeklyLeaderboardByCityToEighteen"
        );
        console.log(exception);
        dispatch({
          type: GET_LEADBOARD_FAILED
        });
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(
        RefreshToken({
          ...dataUser,
          callback: getWeeklyLeaderboardByCityToEighteen
        })
      );
    }
  };
}

export function getLeaderboardByCityWithParams(
  dataUser = {},
  year,
  month,
  day
) {
  return async function(dispatch, getState) {
    const { access_token, date, infoProfile } = getState().login;
    let now = +new Date();
    // controllo prima se il dato dell'utente e in particolare la città c'e
    // altrimenti la chiedo con getprofile
    const { city } = infoProfile;
    if (city ? false : true) {
      dispatch(
        getProfile({
          ...dataUser,
          afterCallback: getLeaderboardByCityWithParams
        })
      );
    } else if (now < date) {
      const { user_id } = infoProfile;
      // token ancora valido
      dispatch({
        type: FETCHING_DATA
      });
      try {
        const y = new Date().getFullYear() + 1;
        const city = infoProfile.city.id;
        const response = await requestBackend(
          "get",
          "/api/v1/leaderboard/?to_year=" + y + "&city_id=" + city,
          access_token,
          null, // { year: new Date().getFullYear(), city_id: infoProfile.city.id },
          null,
          "Bearer"
        );
        if (response.status === 200) {
          console.log("api/v1/leaderboard by city returns 200");
          // console.log(response);
          dispatch({
            type: GET_LEADBOARD_BY_CITY,
            payload: response.data,
            user: user_id
          });
        } else {
          console.log("api/v1/leaderboard by city returns error");
          console.log(response);
          dispatch({
            type: GET_LEADBOARD_FAILED
            // payload: { error_description: response.data.error }
          });
        }
      } catch (exception) {
        console.log(
          "Exception from api/v1/leaderboard by getLeaderboardByCityWithParams"
        );
        console.log(exception);
        dispatch({
          type: GET_LEADBOARD_FAILED
        });
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(
        RefreshToken({ ...dataUser, callback: getLeaderboardByCityWithParams })
      );
    }
  };
}

export function setLeaderboardSelected(selected) {
  return async function(dispatch) {
    dispatch({
      type: SET_LEADERBOARD_SELECTED,
      payload: selected
    });
  };
}

export function setLeaderboardTiming(timing, index) {
  return async function(dispatch) {
    dispatch({
      type: SET_LEADERBOARD_TIMING,
      payload: {
        timing,
        index
      }
    });
  };
}

export function getPreviousMonday() {
  let date = new Date();

  let day = date.getDay();
  let prevMonday;

  if (day == 1) {
    prevMonday = date;
  } else if (day == 0) {
    prevMonday = date.setDate(date.getDate() - 6);
  } else {
    daysFromMonday = 1 - day;
    prevMonday = date.setDate(date.getDate() + daysFromMonday);
  }

  return prevMonday;
}

export function getNextSunday() {
  let date = new Date();

  let day = date.getDay();
  let nextSunday;

  if (day == 0) {
    nextSunday = new Date(date);
  } else {
    daysToSunday = 7 - day;
    nextSunday = date.setDate(date.getDate() + daysToSunday);
  }

  return nextSunday;
}
