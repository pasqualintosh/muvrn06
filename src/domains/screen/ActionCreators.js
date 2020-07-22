import {
  UPDATE_STATUS_SCREEN,
  GET_INFO_SCREEN,
  LOG_OUT,
  UPDATE_TOURNAMENT,
  UPDATE_PLAYOFF,
  UPDATE_PLAYOFF_SCREEN
} from "./ActionTypes";
import { requestBackend, RefreshToken } from "../login/ActionCreators"; // da far puntare agli helper!!!

// metodi per recuperare dati relativi a varie schermate tipo le sessioni, eventuali premi ecc che l'app deve caricare ma non deve rimanere quando si chiude l'app

// ritorna tutti i dettagli di tutti gli eventi e sessioni relative a un livello
export function getLevelEvents(dataUser = {}) {
  return async function(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // preparo la richiesta legata al login con username e password
    let { access_token, date } = getState().login;
    // se ho appena effettuato il login, uso il token nuovo che ho inserito
    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }
    // prendo la session-id dell'ultima sessione attiva
    let { level_number } = getState().trainings;
    // se passo il livello usa quello, utile per prendere i dati dei livelli inferiori che sono gia stati completati
    if (dataUser.level_number) {
      level_number = dataUser.level_number;
    }

    console.log("eventi del livello");
    console.log(level_number);

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken({ ...dataUser, callback: getLevelEvents, access_token })
      );
    } else if (level_number >= 0) {
      // ho la sessione
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      console.log("mando richiesta");
      dispatch({
        type: UPDATE_STATUS_SCREEN,
        payload: {
          status: "load"
        }
      });
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/sessions_by_level?level_number=" + level_number,
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          let allEvents = response.data;

          /* 
          // tolgo i quiz e i survey dagli eventi poiche non li visualizzo
          for (i = 0; i < allEvents.length; i++) {
            allEvents[i].events = allEvents[i].events.filter(
              event => !event.quiz && !event.survey
            );
          }
          console.log(allEvents); */

          if (level_number === 1) {
            dispatch({
              type: GET_INFO_SCREEN,
              payload: {
                sessions: allEvents.sort((a, b) => {
                  return a.order - b.order;
                })
              }
            });
          } else {
            // in questo caso secondo livello
            dispatch({
              type: GET_INFO_SCREEN,
              payload: {
                sessions2: allEvents.sort((a, b) => {
                  return a.order - b.order;
                })
              }
            });
          }

          /* if (level_number > 1) {
            // cosi prendo le info dei livelli precedenti
            dispatch(getLevelEvents({ level_number: level_number - 1 }));
          } */
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: "error 400"
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta

          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: "Error"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_SCREEN,
          payload: {
            status: "Error catch"
          }
        });
      }
    }
  };
}

export function getSchedule(dataUser = {}, callback = null) {
  return async function(dispatch, getState) {
    let { access_token, date } = getState().login;

    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken({ ...dataUser, callback: getSchedule, access_token })
      );
    } else {
      dispatch({
        type: UPDATE_STATUS_SCREEN,
        payload: {
          status: "load schedule"
        }
      });

      const season = "2019";
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/schedule_calendar?season=" + season,
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          let schedule = response.data;

          if (callback) {
            callback(schedule);
          }

          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: ""
            }
          });
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: "error schedule 400"
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta

          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: "Error schedule"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_SCREEN,
          payload: {
            status: "Error catch schedule"
          }
        });
      }
    }
  };
}

export function getSeasonRanking(dataUser = {}, callback = null) {
  return async function(dispatch, getState) {
    let { access_token, date } = getState().login;

    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken({ ...dataUser, callback: getSeasonRanking, access_token })
      );
    } else {
      dispatch({
        type: UPDATE_STATUS_SCREEN,
        payload: {
          status: "load Season Ranking"
        }
      });

      const season = "2019";
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/season_ranking?season=" + season,
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          let schedule = response.data;

          if (callback) {
            callback(schedule);
          }

          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: ""
            }
          });
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: "error Season Ranking 400"
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta

          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: "Error Season Ranking"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_SCREEN,
          payload: {
            status: "Error catch Season Ranking"
          }
        });
      }
    }
  };
}

export function getWeeklySingleMatch(dataUser = {}) {
  return async function(dispatch, getState) {
    let { access_token, date } = getState().login;
    const match_id = dataUser.match_id;
    // da dove devo iniziare a calcolare la settimana della sfida
    const start_match = dataUser.start_match;

    // se devo ritornate i dati con una callback
    const saveData = dataUser.saveData ? dataUser.saveData : null;
    // se devo salvare nello store
    const currentMatch = dataUser.currentMatch ? dataUser.currentMatch : false;

    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken({
          ...dataUser,
          callback: getWeeklySingleMatch,
          access_token
        })
      );
    } else {
      dispatch({
        type: UPDATE_STATUS_SCREEN,
        payload: {
          status: "load getWeeklySingleMatch"
        }
      });

      try {
        // + "&now=2019-02-01T15:01:00"
        // + "&now=" + start_match
        const response = await requestBackend(
          "get",
          "/api/v1/weekly_standings?match_id=" + match_id,
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          let schedule = response.data;

          if (saveData) {
            saveData(schedule);
          }
          if (currentMatch) {
            dispatch({
              type: UPDATE_TOURNAMENT,
              payload: schedule
            });
          }
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: "error getWeeklySingleMatch 400"
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta

          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: "Error getWeeklySingleMatch"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_SCREEN,
          payload: {
            status: "Error catch getWeeklySingleMatch"
          }
        });
      }
    }
  };
}

export function getPlayoffMatch(dataUser = {}, callbackAfterLoad = null) {
  return async function(dispatch, getState) {
    let { access_token, date, infoProfile } = getState().login;
    // il range va da 1 a 4, se metto 5 ovvero la pagina vincitore, in realta mi serve la 4 settimana e calcolo il vincitore
    const season_playoff = dataUser.season_playoff
      ? dataUser.season_playoff > 4
        ? 4
        : dataUser.season_playoff
      : 1;

    const city_id = infoProfile.city
      ? infoProfile.city.id
        ? infoProfile.city.id
        : 1122
      : 1122;
    console.log(season_playoff);
    // da dove devo iniziare a calcolare la settimana della sfida

    // se devo ritornate i dati con una callback
    const saveData = dataUser.saveData ? dataUser.saveData : null;

    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken({ ...dataUser, callback: getPlayoffMatch, access_token })
      );
    } else {
      dispatch({
        type: UPDATE_STATUS_SCREEN,
        payload: {
          status: "load getPlayoffMatch"
        }
      });

      try {
        // id=1&
        const response = await requestBackend(
          "get",
          "/api/v2/playoff?phase=" + season_playoff,
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          let playoff = response.data;

          if (saveData) {
            saveData(schedule);
          }
          if (callbackAfterLoad) {
            callbackAfterLoad(schedule);
          }

          dispatch({
            type: UPDATE_PLAYOFF,
            payload: playoff,
            season_playoff: season_playoff,
            city_id
          });
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: "error getPlayoffMatch 400"
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta

          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: "Error getPlayoffMatch"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_SCREEN,
          payload: {
            status: "Error catch getPlayoffMatch"
          }
        });
      }
    }
  };
}

// GET SCHEDULE WEEK
export function getScheduleWeek(dataUser = {}, callback = null) {
  return async function(dispatch, getState) {
    let { access_token, date } = getState().login;
    const week = dataUser.week;

    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken({ ...dataUser, callback: getScheduleWeek, access_token })
      );
    } else {
      dispatch({
        type: UPDATE_STATUS_SCREEN,
        payload: {
          status: "load getScheduleWeek"
        }
      });

      const season = "2019";
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/weekly_match?week=" + "Week " + week,
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          let schedule = response.data;

          if (callback) {
            callback(schedule, week);
          }

          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: ""
            }
          });
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: "error getScheduleWeek 400"
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta

          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: "Error getScheduleWeek"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_SCREEN,
          payload: {
            status: "Error catch getScheduleWeek"
          }
        });
      }
    }
  };
}

// GET SCHEDULE PLAYOFF
export function getSchedulePlayoff(dataUser = {}, callback = null) {
  return async function(dispatch, getState) {
    let { access_token, date, infoProfile } = getState().login;
    let season_playoff = dataUser.season_playoff;
    const city_id = infoProfile.city
      ? infoProfile.city.id
        ? infoProfile.city.id
        : 1122
      : 1122;

    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken({
          ...dataUser,
          callback: getSchedulePlayoff,
          access_token
        })
      );
    } else {
      dispatch({
        type: UPDATE_STATUS_SCREEN,
        payload: {
          status: "load getSchedulePlayoff"
        }
      });

      const season = "2019";
      try {
        // http://23.97.216.36:8000/api/v1/weekly_match?week=Playoff 8
        // i valori sono 8 / 4/ 2 / 1
        let playoffIndex = 8;
        if (season_playoff == 2) {
          playoffIndex = 4;
        } else if (season_playoff == 3) {
          playoffIndex = 2;
        } else if (season_playoff == 4) {
          playoffIndex = 1;
        } else if (season_playoff > 4) {
          playoffIndex = 1;
          season_playoff = 4;
        }
        const response = await requestBackend(
          "get",
          "/api/v1/weekly_match?week=" + "Playoff " + playoffIndex,
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          let schedule = response.data;

          if (callback) {
            callback(schedule, season_playoff);
          }

          dispatch({
            type: UPDATE_PLAYOFF_SCREEN,

            payload: schedule,
            season_playoff: season_playoff,
            city_id
          });
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: "error getSchedulePlayoff 400"
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta

          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: "Error getSchedulePlayoff"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_SCREEN,
          payload: {
            status: "Error catch getSchedulePlayoff"
          }
        });
      }
    }
  };
}

export function getBestPlayer(dataUser = {}) {
  return async function(dispatch, getState) {
    let { access_token, date } = getState().login;
    const city_id = dataUser.city_id ? dataUser.city_id : 1122;

    // se devo ritornate i dati con una callback
    const saveData = dataUser.saveData ? dataUser.saveData : null;

    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken({ ...dataUser, callback: getBestPlayer, access_token })
      );
    } else {
      dispatch({
        type: UPDATE_STATUS_SCREEN,
        payload: {
          status: "load getBestPlayer"
        }
      });
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/best_players?season=2019&city_id=" + city_id,
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          let player = response.data;

          if (saveData) {
            saveData(player);
          }
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: "error getBestPlayer 400"
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta

          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: ""
            }
          });
        } else if (response.status === 500) {
          // non ci sono best player
          if (saveData) {
            saveData([]);
          }
        } else {
          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: "Error getBestPlayer"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_SCREEN,
          payload: {
            status: "Error catch getBestPlayer"
          }
        });
      }
    }
  };
}

export function getWeeklyStandingsComplete(dataUser = {}) {
  return async function(dispatch, getState) {
    let { access_token, date } = getState().login;
    const city_id = dataUser.city_id ? dataUser.city_id : 1122;

    // se devo ritornate i dati con una callback
    const saveData = dataUser.saveData ? dataUser.saveData : null;

    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken({
          ...dataUser,
          callback: getWeeklyStandingsComplete,
          access_token
        })
      );
    } else {
      dispatch({
        type: UPDATE_STATUS_SCREEN,
        payload: {
          status: "load getWeeklyStandingsComplete"
        }
      });
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/weekly_standing_details?city_id=" + city_id,
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          let player = response.data;

          if (saveData) {
            saveData(player);
          }
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: "error getWeeklyStandingsComplete 400"
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta

          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_SCREEN,
            payload: {
              status: "Error getWeeklyStandingsComplete"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_SCREEN,
          payload: {
            status: "Error catch getWeeklyStandingsComplete"
          }
        });
      }
    }
  };
}
