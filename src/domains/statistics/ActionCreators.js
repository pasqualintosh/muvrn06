import {
  GET_STATS,
  GET_STATS_FAILED,
  NO_STATS,
  CHANGE_SCREEN_STATISTICS,
  GET_WEEK_ACTIVITIES,
  STATUS_PERM_ACTIVITIES,
  UPDATE_STATUS_ACTIVITY,
} from "./ActionTypes";
import axios from "axios";
import qs from "qs";
import {
  requestBackend,
  RefreshToken,
  requestCallback,
  requestNewBackend,
  forceRefreshTokenWithCallback,
} from "./../login/ActionCreators"; // da far puntare agli helper!!!

import {
  getPreviousMonday,
  getNextSunday,
  EndGMTTournament,
  getSpecificPositionNew
} from "./../standings/ActionCreators";

import { Platform, Alert } from "react-native";

import AppleHealthKit from "rn-apple-healthkit";
import GoogleFit, { Scopes } from "react-native-google-fit";
import moment from "moment-timezone";
import { getDevice } from "../../helpers/deviceInfo";
import { pushNotifications } from "./../../services";

export function getStats(dataUser = {}) {
  return async function (dispatch, getState) {
    const { access_token, date } = getState().login;
    let now = +new Date();

    // token ancora valido
    if (now < date) {
      try {
        const y = new Date().getFullYear();
        const response = await requestBackend(
          "get",
          "/api/v1/stats/", // "/api/v1/stats/?year=" + new Date().getFullYear() + "&month=" + (new Date().getMonth() + 1) ,
          access_token,
          null, // { year: new Date().getFullYear() },
          null,
          "Bearer"
        );
        if (response.status === 200) {
          console.log("api/v1/stats returns 200");
          console.log(response);
          dispatch({
            type: GET_STATS,
            payload: response.data,
          });
        } else if (response.status === 403) {
          // accesso negato, rifaccio login e poi richiamo le statistiche
          dispatch(RefreshToken({ ...dataUser, callback: getStats }));
        } else {
          console.log("api/v1/stats returns error");
          console.log(response);
          if (
            response.data &&
            response.data.error &&
            response.data.error == "routes not found"
          ) {
            dispatch({
              type: NO_STATS,
            });
          } else {
            dispatch({
              type: GET_STATS_FAILED,
            });
          }
        }
      } catch (exception) {
        console.log("Exception from api/v1/stats");
        console.log(exception);
        dispatch({
          type: GET_STATS_FAILED,
        });
      }
    } else {
      // richiedi un nuovo token
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(RefreshToken({ ...dataUser, callback: getStats }));
    }
  };
}

export function getStatsNew(dataUser = {}) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // preparo la richiesta legata al login con username e password

    let { access_token } = getState().login;

    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/tracking/user_stats/",
        // "/api/v1/tracking/trip_type/",
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log(response);
      // Alert.alert(response.status.toString())

      if (response.status === 200) {
        // total_biking: 0
        // total_bus: 0
        // total_calories: 548
        // total_carpooling: 0
        // total_co2: 0.47373280620630637
        // total_distance: 9.964294024319111
        // total_duration: 2.7999999999999994
        // total_metro: 0
        // total_train: 0
        // total_walking: 16

        console.log("api/v1/stats returns 200");
        console.log(response);
        dispatch({
          type: GET_STATS,
          payload: response.data,
        });
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(forceRefreshTokenWithCallback(getStatsNew(dataUser)));
      }
    } catch (error) {
      dispatch({
        type: GET_STATS_FAILED,
      });
    }
  };
}

export function getWeeklyActivitiesNew(dataUser = {}, callback = null) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    console.log("prendo le attività");
    // preparo la richiesta legata al login con username e password

    // prendo i giorni precedenti
    let { access_token } = getState().login;
    const now = moment().format("YYYY-MM-DD");
    const end_date = now;
    console.log(end_date);
    // const previousMonday = new Date(getPreviousMonday());
    const start_date = moment().subtract(10, "days").format("YYYY-MM-DD");
    // const start_date = moment().subtract(7, 'days').format("YYYY-MM-DD");

    console.log(start_date);
    // {start_date}/{end_date}

    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
    try {
      const response = await requestNewBackend(
        "get",
        `/api/v1/tracking/daily_activites/${start_date}/${end_date}`,
        // "/api/v1/tracking/trip_type/",
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log(response);
      // Alert.alert(response.status.toString())

      if (response.status == 200) {
        console.log(response);

        // se è per il controllo del'evento, vedo i punti dell'utente
        if (Array.isArray(response.data)) {
          dispatch({
            type: GET_WEEK_ACTIVITIES,
            payload: response.data,
          });
          const daysConsidered = 3;
          const lastDayConsidered = moment()
            .subtract(daysConsidered + 1, "days")
            .format("YYYY-MM-DD");
          const ActivitiesConsidered = response.data.filter(
            (elem) =>
              elem.activities_day > lastDayConsidered &&
              elem.activities_day < now
          );
          // devo avere tre giorni per essere valida
          console.log(ActivitiesConsidered);

          let bonusType = 0;
          if (ActivitiesConsidered.length == daysConsidered) {
            // calcolo il bonus

            const MinutesConsidered = ActivitiesConsidered.map(
              (elem) => elem.activities_minutes
            );
            console.log(MinutesConsidered);
            const minActivities = Math.min.apply(null, MinutesConsidered);
            // const minActivities = Math.min(MinutesConsidered);
            console.log(minActivities);
            // se supero tutti i giorni una soglia ho il 10% in piu
            if (minActivities > 1999) {
              bonusType = 1;
            }
            if (minActivities > 4999) {
              bonusType = 2;
            }
            if (minActivities > 9999) {
              bonusType = 3;
            }
          }
          dispatch({
            type: UPDATE_STATUS_ACTIVITY,
            payload: {
              bonusType, // tipo di bonus ottenuto 0, 1 30 per tre giorni, 2: 60 , 3: 90
              dateBonus: now,
            },
          });
          if (callback) {
            dispatch(callback);
          }
        } else {
          dispatch({
            type: GET_WEEK_ACTIVITIES,
            payload: [],
          });
          dispatch({
            type: UPDATE_STATUS_ACTIVITY,
            payload: {
              bonusType: 0,
              dateBonus: now,
            },
          });
          if (callback) {
            dispatch(callback);
          }
        }
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(
          forceRefreshTokenWithCallback(getWeeklyActivitiesNew(dataUser, callback ))
        );
      } else {
        dispatch({
          type: GET_STATS_FAILED,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_STATS_FAILED,
      });
    }
  };
}

export function postDailyActivities(dataUser = {}, otherData = { notification: false}) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // preparo la richiesta legata al login con username e password

    let { access_token } = getState().login;

    const {
      activities_minutes,
      points,
      support_device,
      activities_day,
    } = dataUser;

    const dataDailyActivities = {
      activities_minutes,
      points,
      support_device,
      activities_day,
    };

    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
    try {
      const response = await requestNewBackend(
        "post",
        `/api/v1/tracking/daily_activites/`,
        access_token,
        dataDailyActivities,
        "application/json",
        "Bearer"
      );
      console.log(response);
      // Alert.alert(response.status.toString())

      if (response.status == 201) {
        if (otherData.notification) {
          pushNotifications.configure();
          pushNotifications.activitiesMinutesNotification(activities_minutes);
        }
        
        dispatch(getWeeklyActivitiesNew());
        getSpecificPositionNew();
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(forceRefreshTokenWithCallback(postDailyActivities(dataUser, otherData)));
      } else {
        dispatch({
          type: GET_STATS_FAILED,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_STATS_FAILED,
      });
    }
  };
}

export function patchDailyActivities(dataUser = {},otherData = { notification: false, newPoints: false}) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // preparo la richiesta legata al login con username e password

    let { access_token } = getState().login;

    const { activities_minutes, points, id } = dataUser;

    const dataDailyActivities = {
      activities_minutes,
      points,
    };

    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
    try {
      const response = await requestNewBackend(
        "patch",
        `/api/v1/tracking/daily_activites/` + id,
        access_token,
        dataDailyActivities,
        "application/json",
        "Bearer"
      );
      console.log(response);
      // Alert.alert(response.status.toString())

      if (response.status == 200) {
        if (otherData.notification) {
          pushNotifications.configure();
          pushNotifications.activitiesMinutesNotification(activities_minutes);
        }
        dispatch(getWeeklyActivitiesNew());
        if(otherData.newPoints) {
          getSpecificPositionNew();
        }
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(forceRefreshTokenWithCallback(patchDailyActivities(dataUser, otherData)));
      } else {
        dispatch({
          type: GET_STATS_FAILED,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_STATS_FAILED,
      });
    }
  };
}

export function changeScreenStatistics(screen) {
  return async function (dispatch, getState) {
    dispatch({
      type: CHANGE_SCREEN_STATISTICS,
      payload: screen,
    });
  };
}

export function nothingUpdate() {
  return async function (dispatch, getState) {
    dispatch({
      type: "null",
      payload: 0,
    });
  };
}

export function changeStatusPerm(value) {
  return async function (dispatch, getState) {
    dispatch({
      type: STATUS_PERM_ACTIVITIES,
      payload: value,
    });
  };
}

export function putDailyActivities(dataUser = {}) {
  return async function (dispatch, getState) {
    const { access_token, date } = getState().login;
    let now = +new Date();

    const {
      activities_minutes,
      points,
      support_device,
      activities_day,
    } = dataUser;

    // dati che mando
    const dataDailyActivities = {
      activities_minutes,
      points,
      support_device,
      activities_day,
    };

    // se l'utente è specificato mando la richiesta
    if (now < date) {
      // token ancora valido

      let queryPost = `/api/v1/daily_activity`;

      try {
        const response = await requestBackend(
          "put",
          queryPost,
          access_token,
          dataDailyActivities,
          "application/json",
          "Bearer"
        );
        if (response.status === 200) {
          // potrei aggiornare tutte le attività di questa settimana
          // o l'aggiungo alle attività gia presenti
          dispatch(getWeeklyActivities());
        } else {
          console.log(response);
        }
      } catch (exception) {
        console.log("Exception post from /api/v1/dailyactivities/");
        console.log(exception);
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(RefreshToken({ ...dataUser, callback: putDailyActivities }));
    }
  };
}

function calcolateActivitiesApple(resultsMin) {
  return async function (dispatch, getState) {
    let options = {
      startDate: new Date(new Date().toDateString()).toISOString(), // required
      endDate: new Date().toISOString(), // optional; default now
      // ascending: false, // optional; default false
      // limit: 10, // optional; default no limit,
      // type: 'Walking',
    };

    AppleHealthKit.getSamples(options, (err, results) => {
      if (err) {
        console.log("errore");
        console.log(err);
      }
      console.log("results");
      console.log(results);

      // controllo se hai il watch
      let checkWatch = "";
      for (i = 0; i < results.length; i++) {
        if (results[i].device.search("Watch") >= 0) {
          console.log(results[i].device);
          checkWatch = results[i].device;
          break;
        }
      }

      let newResult = results;
      if (checkWatch.length) {
        newResult = results.filter((elem) => elem.device == checkWatch);
      }

      let timeActivity = 0.0;
      console.log(newResult);

      // se hai l'orologio, devi muoverlo almeno due minuto per considerlo
      // altrimenti un minuto con il telefono
      const threesold = checkWatch.length ? 120000 : 60000;
      newResult.forEach((elem, index) => {
        if (elem.end && elem.start) {
          const end = moment(elem.end);
          const start = moment(elem.start);
          const activities = end - start;
          console.log(activities);
          if (activities > threesold) {
            timeActivity = activities + timeActivity;
          }
        }
      });
      console.log(timeActivity);
      timeActivity = Math.round(timeActivity / 60000);

      let finalActivities = 0;
      if (resultsMin < timeActivity) {
        finalActivities = timeActivity;
      }

      // se ho l'orologio, lo salvo altrimenti salvo il modello di device
      dispatch(sendDailyActivities(finalActivities, checkWatch, results));
    });
  };
}

function sendDailyActivities(finalActivities, checkWatch, results) {
  return async function (dispatch, getState) {
    console.log(finalActivities);
    // pushNotifications.configure();
    // pushNotifications.activitiesMinutesNotification(finalActivities);
    // finalActivities = 31
    // ho trovato il valore massimo lo mando al db se è nuovo e se è maggiore di 29

    const now = moment();
    const activities_day = now.format("YYYY-MM-DD");
    const local = moment().tz("Europe/Rome");
    const dayOfWeek = local.day(); // 0 to 6, the resulting date will be within the current (Sunday-to-Saturday)
    const hourLocal = local.hours(); // 0 to 23
    const utcOffset = local.utcOffset();
    console.log(local);
    console.log(dayOfWeek);
    console.log(hourLocal);
    console.log(utcOffset);
    const limitRankingSunday = 17;
    const limitRankingMonday = 5;
    if (finalActivities > 0) {
      // devo controllare se ho gia questa info presente nel db, se si allora aggiorno con patch
      // altrimenti faccio una post

      const weekActivities = getState().statistics.weekActivities
        ? getState().statistics.weekActivities
        : [];
      // controllo oggi quanta attività ho fatto se esiste
      const ActivitiesDay = weekActivities.filter(
        (elem) => elem.activities_day == activities_day
      );
      // vedo quanti min ho gia fatto, se 0 allora non ne ho fatto
      const ActivitiesMin = ActivitiesDay.length
        ? ActivitiesDay[0].activities_minutes
        : 0;
      console.log(ActivitiesDay);
      console.log(ActivitiesMin);
      // calcolo eventuale bonus
      let bonus = 1.0;
      // vedo cosa ho fatto negli ultimi 3 giorni
      // e cerco l'attività con il minor numero di minuti di attivita

      const dateBonus =
        getState().statistics.statusActivity &&
        getState().statistics.statusActivity.dateBonus
          ? getState().statistics.statusActivity.dateBonus
          : "";

      console.log(dateBonus);
      console.log(activities_day);

      if (dateBonus == activities_day) {
        // se ho il bonus di oggi allora lo uso, altrimenti lo calcolo
        // const bonusType = getState().statistics.statusActivity.bonusType;
        // bonus = bonus + bonusType * 0.1;
        if (ActivitiesMin) {
          // se sto facendo piu minuti d'attività di prima
          if (finalActivities > ActivitiesMin) {
            // aggiornamento quindi faccio patch

            // quale attività devo aggiornare
            const id = ActivitiesDay[0].id;
            let points = 0;
            if (
              (dayOfWeek == 0 && hourLocal > limitRankingSunday) ||
              (dayOfWeek == 1 && hourLocal < limitRankingMonday)
            ) {
              points = ActivitiesDay[0].points;
            } else {
              if (finalActivities > 29) {
                points = 100;
              }
              if (finalActivities > 59) {
                points = 200;
              }
              if (finalActivities > 89) {
                points = 300;
              }
            }
            // aggiungo il bonus
            points = points * bonus;
            const dailyActivities = {
              activities_minutes: finalActivities,
              points,
              // watch o iphone
              support_device: checkWatch ? checkWatch : await getDevice(),
              activities_day,
              id,
            };

            console.log(dailyActivities);
            dispatch({
              type: UPDATE_STATUS_ACTIVITY,
              payload: {
                minActivity: finalActivities,
                points,
                dateActivity: activities_day,
              },
            });

            dispatch(patchDailyActivities(dailyActivities));
          }
        } else {
          // se è domenica sera o lunedi mattina presto niente punti

          // faccio una post
          let points = 0;
          if (
            (dayOfWeek == 0 && hourLocal > limitRankingSunday) ||
            (dayOfWeek == 6 && hourLocal < limitRankingMonday)
          ) {
            points = 0;
          } else {
            if (finalActivities > 29) {
              points = 100;
            }
            if (finalActivities > 59) {
              points = 200;
            }
            if (finalActivities > 89) {
              points = 300;
            }
          }

          // aggiungo il bonus
          points = points * bonus;
          // mando

          const dailyActivities = {
            activities_minutes: finalActivities,
            points,
            // watch o iphone
            support_device: checkWatch ? checkWatch : await getDevice(),
            activities_day,
          };

          console.log(dailyActivities);
          dispatch({
            type: UPDATE_STATUS_ACTIVITY,
            payload: {
              minActivity: finalActivities,
              points,
              dateActivity: activities_day,
            },
          });
          dispatch(postDailyActivities(dailyActivities));
        }
      } else {
        console.log("mi mancano i bonus che calcolo");
        // se diverso allora lo calcolo e calcolo i nuovi punti
        dispatch(
          getWeeklyActivitiesNew(
            {},
            sendDailyActivities(finalActivities, checkWatch, results)
          )
        );
      }
    } else {
      dispatch({
        type: UPDATE_STATUS_ACTIVITY,
        payload: {
          minActivity: finalActivities,
          points: 0,
          dateActivity: activities_day,
        },
      });
    }
  };
}

function sendDailyStep(finalActivities, checkWatch = null, dataUser = {}) {
  return async function (dispatch, getState) {
    console.log(finalActivities);
    // pushNotifications.configure();
    // pushNotifications.activitiesMinutesNotification(finalActivities);
    // finalActivities = 31
    // ho trovato il valore massimo lo mando al db se è nuovo e se è maggiore di 29

    const now = moment();
    const activities_day = now.format("YYYY-MM-DD");
    const local = moment().tz("Europe/Rome");
    const dayOfWeek = local.day(); // 0 to 6, the resulting date will be within the current (Sunday-to-Saturday)
    const hourLocal = local.hours(); // 0 to 23
    const utcOffset = local.utcOffset();
    console.log(local);
    console.log(dayOfWeek);
    console.log(hourLocal);
    console.log(utcOffset);
    const limitRankingSunday = 17;
    const limitRankingMonday = 5;
    if (finalActivities > 0) {
      // devo controllare se ho gia questa info presente nel db, se si allora aggiorno con patch
      // altrimenti faccio una post

      const weekActivities = getState().statistics.weekActivities
        ? getState().statistics.weekActivities
        : [];
      // controllo oggi quanta attività ho fatto se esiste
      const ActivitiesDay = weekActivities.filter(
        (elem) => elem.activities_day == activities_day
      );
      // vedo quanti min ho gia fatto, se 0 allora non ne ho fatto
      const ActivitiesMin = ActivitiesDay.length
        ? ActivitiesDay[0].activities_minutes
        : 0;
      console.log(ActivitiesDay);
      console.log(ActivitiesMin);
      // calcolo eventuale bonus
      let bonus = 1.0;
      // vedo cosa ho fatto negli ultimi 3 giorni
      // e cerco l'attività con il minor numero di minuti di attivita

      const dateBonus =
        getState().statistics.statusActivity &&
        getState().statistics.statusActivity.dateBonus
          ? getState().statistics.statusActivity.dateBonus
          : "";

      console.log(dateBonus);
      console.log(activities_day);

      if (dateBonus == activities_day) {
        // se ho il bonus di oggi allora lo uso, altrimenti lo calcolo
        // const bonusType = getState().statistics.statusActivity.bonusType;
        // bonus = bonus + bonusType * 0.1;
        if (ActivitiesMin) {
          // se sto facendo piu minuti d'attività di prima
          if (finalActivities > ActivitiesMin) {
            // aggiornamento quindi faccio patch

            // quale attività devo aggiornare
            const id = ActivitiesDay[0].id;
            const pointsOld = ActivitiesDay[0].points;
            let points = 0;
            if (
              (dayOfWeek == 0 && hourLocal > limitRankingSunday) ||
              (dayOfWeek == 1 && hourLocal < limitRankingMonday)
            ) {
              points = pointsOld;
            } else {
              if (finalActivities > 1999) {
                points = 100;
              }
              if (finalActivities > 4999) {
                points = 200;
              }
              if (finalActivities > 9999) {
                points = 300;
              }
            }
            // aggiungo il bonus
            points = points * bonus;
            const dailyActivities = {
              activities_minutes: finalActivities,
              points,
              // watch o iphone
              support_device: checkWatch ? checkWatch : await getDevice(),
              activities_day,
              id,
            };

            console.log(dailyActivities);
            dispatch({
              type: UPDATE_STATUS_ACTIVITY,
              payload: {
                minActivity: finalActivities,
                points,
                dateActivity: activities_day,
              },
            });

            dispatch(patchDailyActivities(dailyActivities, {...dataUser, newPoints: points > pointsOld}));
          }
        } else {
          // se è domenica sera o lunedi mattina presto niente punti

          // faccio una post
          let points = 0;
          if (
            (dayOfWeek == 0 && hourLocal > limitRankingSunday) ||
            (dayOfWeek == 6 && hourLocal < limitRankingMonday)
          ) {
            points = 0;
          } else {
            if (finalActivities > 1999) {
              points = 100;
            }
            if (finalActivities > 4999) {
              points = 200;
            }
            if (finalActivities > 9999) {
              points = 300;
            }
          }

          // aggiungo il bonus
          // points = points * bonus;
          // mando

          const dailyActivities = {
            activities_minutes: finalActivities,
            points,
            // watch o iphone
            support_device: checkWatch ? checkWatch : await getDevice(),
            activities_day,
          };

          console.log(dailyActivities);
          dispatch({
            type: UPDATE_STATUS_ACTIVITY,
            payload: {
              minActivity: finalActivities,
              points,
              dateActivity: activities_day,
            },
          });
          dispatch(postDailyActivities(dailyActivities, dataUser));
        }
      } else {
        console.log("mi mancano i bonus che calcolo");
        // se diverso allora lo calcolo e calcolo i nuovi punti
        dispatch(
          getWeeklyActivitiesNew(
            {},
            sendDailyStep(finalActivities, checkWatch, dataUser)
          )
        );
      }
    } else {
      dispatch({
        type: UPDATE_STATUS_ACTIVITY,
        payload: {
          minActivity: finalActivities,
          points: 0,
          dateActivity: activities_day,
        },
      });
    }
  };
}

// aggiorno i dati per health del giorno a seconda del sistema
export function updateActivities(dataUser = {}) {
  return async function (dispatch, getState) {
    console.log(Platform.OS);
    if (Platform.OS == "ios") {
      let perm = {
        permissions: {
          read: [
            "AppleExerciseTime",
            "ActiveEnergyBurned",
            "DistanceCycling",
            "DistanceWalkingRunning",
            "StepCount",
          ],
        },
        observers: [{ type: "StepCount" }],
      };
      let options = {
        startDate: new Date(new Date().toDateString()).toISOString(), // required
        endDate: new Date().toISOString(), // optional; default now
        // ascending: false, // optional; default false
        // limit: 10, // optional; default no limit,
        // type: 'Walking',
      };
      AppleHealthKit.initHealthKit(perm, (err, results) => {
        if (err) {
          err;
          console.log("error initializing Healthkit: ", err);
        }
        // ho gia il permesso, vado avanti

        // AppleHealthKit.getAppleExerciseTime(options, (err, results) => {
        //   if (err) {
        //     console.log("errore");
        //     console.log(err);
        //     // non ha il watch, quindi calcolo l'attività dalle singole attività
        //     dispatch(calcolateActivitiesApple(0));
        //   }
        //   let resultsMin = 0;

        //   if (results.length) {
        //     resultsMin = results.length ? results[0].value : 0;

        //     resultsMin = resultsMin / 60;
        //   }
        //   // non ha il watch, quindi calcolo l'attività dalle singole attività
        //   dispatch(calcolateActivitiesApple(resultsMin));
        // });
      });
    } else {
      // The list of available scopes inside of src/scopes.js file
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
        ],
      };

      // controllo se google fit è installato
      //       Linking.canOpenURL('googlefit')
      // .then((supported) => {
      //   if (!supported) {
      //     // dico all'utente di installare google fit se vuole partecipare
      //         // com.google.android.apps.fitness
      //         Alert.alert(
      //           "Google fit not exist",
      //           "Do you want download?",
      //           [
      //             {
      //               text: "Yes",
      //               onPress: () => Linking.openURL("market://details?id=com.google.android.apps.fitness")
      //             },
      //             {
      //               text: "No",
      //               onPress: () => {},
      //               style: "cancel"
      //             }
      //           ]
      //         );
      //   } else {
      GoogleFit.authorize(options)
        .then((res) => {
          if (res.success) {
            // ho ottenuto il permesso, lo salvo

            let optDay = {
              startDate: new Date(new Date().toDateString()).getTime(),
              endDate: new Date().getTime(),
            };

            GoogleFit.getActivitySamples(optDay, (err, res) => {
              const resFilter = res.filter(
                (elem) =>
                  elem.activityName != "still" && elem.activityName != "unknown"
              );
              let timeActivity = resFilter.reduce(
                (total, elem, index, array) => {
                  if (elem.end && elem.start) {
                    const time = elem.end - elem.start;
                    return total + time;
                  } else {
                    return total;
                  }
                },
                0
              );

              timeActivity = Math.round(timeActivity / 60000);

              dispatch(sendDailyActivities(timeActivity, "", []));
            });
          } else {
            Alert.alert("Enable to extra points");
          }
        })
        .catch((err) => {
          console.log("err >>> ", err);
        });
    }
  };
}

// aggiorno i dati per health del giorno a seconda del sistema
export function updateActivitiesStep(dataUser = {}) {
  return async function (dispatch, getState) {
    console.log(Platform.OS);
    if (Platform.OS == "ios") {
      let perm = {
        permissions: {
          read: [
            "StepCount",
          ],
        },
        observers: [{ type: "StepCount" }],
      };
      let options = {
        startDate: new Date(new Date().toDateString()).toISOString(), // required
        endDate: new Date().toISOString(), // optional; default now
        // ascending: false, // optional; default false
        // limit: 10, // optional; default no limit,
        // type: 'Walking',
      };
      AppleHealthKit.initHealthKit(perm, (err, results) => {
        if (err) {
          err;
          console.log("error initializing Healthkit: ", err);
        }
        // ho gia il permesso, vado avanti

        AppleHealthKit.getStepCount(
          {
            date: new Date().toISOString(),
          },
          (err, results) => {
            if (err) {
              console.log("errore");
              console.log(err);
              // non ha il watch, quindi calcolo l'attività dalle singole attività
              dispatch(sendDailyStep(0, null, dataUser));
            } else {
              // non ha il watch, quindi calcolo l'attività dalle singole attività
              dispatch(sendDailyStep(parseInt(results.value), null, dataUser));
            }
          }
        );
      });
    } else {
      // The list of available scopes inside of src/scopes.js file
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
        ],
      };

      // controllo se google fit è installato
      //       Linking.canOpenURL('googlefit')
      // .then((supported) => {
      //   if (!supported) {
      //     // dico all'utente di installare google fit se vuole partecipare
      //         // com.google.android.apps.fitness
      //         Alert.alert(
      //           "Google fit not exist",
      //           "Do you want download?",
      //           [
      //             {
      //               text: "Yes",
      //               onPress: () => Linking.openURL("market://details?id=com.google.android.apps.fitness")
      //             },
      //             {
      //               text: "No",
      //               onPress: () => {},
      //               style: "cancel"
      //             }
      //           ]
      //         );
      //   } else {
      GoogleFit.authorize(options)
        .then((res) => {
          if (res.success) {
            // ho ottenuto il permesso, lo salvo

            GoogleFit.getDailySteps()
              .then((res) => {
                console.log(res);

                //Alert.alert(JSON.stringify(res))

                // [
                //   { source: "com.google.android.gms:estimated_steps", steps: [
                //     {
                //       "date":"2019-06-29","value":2328
                //     },
                //     {
                //       "date":"2019-06-30","value":8010
                //       }
                //     ]
                //   },
                //   { source: "com.google.android.gms:merge_step_deltas", steps: [
                //     {
                //       "date":"2019-06-29","value":2328
                //     },
                //     {
                //       "date":"2019-06-30","value":8010
                //       }
                //     ]
                //   },
                //   { source: "com.xiaomi.hm.health", steps: [] }
                // ];
                let step = 0;
                // if (res.length && res[0].steps.length) {
                //   step = res[0].steps[0].value
                // }
                let stepArray = [];

                if (res.length) {
                  for (let i = 0; i < res.length; i++) {
                    if (res[i].steps.length) {
                      for (let j = 0; j < res[i].steps.length; j++) {
                        if (res[i].steps[j].value) {
                          stepArray = [...stepArray, res[i].steps[j].value];
                        }
                      }
                    }
                  }
                }
                if (stepArray.length) {
                  step = Math.max(...stepArray)
                }

                dispatch(sendDailyStep(parseInt(step), null, dataUser));
              })
              .catch((err) => {
                dispatch(sendDailyStep(0, null, dataUser));
              });
          } else {
            dispatch(sendDailyStep(0, null, dataUser));
            Alert.alert("Enable to extra points");
          }
        })
        .catch((err) => {
          console.log("err >>> ", err);
        });
    }
  };
}

export function getWeeklyActivities(dataUser = {}) {
  return async function (dispatch, getState) {
    const { access_token, date, infoProfile } = getState().login;
    let now = +new Date();

    if (now < date) {
      // token ancora valido

      try {
        const previousMonday = new Date(getPreviousMonday());
        const nextSunday = new Date(getNextSunday());

        const y = previousMonday.getFullYear();
        const to_y = nextSunday.getFullYear();

        const m = previousMonday.getMonth();
        const to_m = nextSunday.getMonth();

        const d = previousMonday.getDate();
        const to_d = nextSunday.getDate();

        const DifferenceMinutesUTC = new Date().getTimezoneOffset() / 60; // in italia da -60
        console.log(DifferenceMinutesUTC);
        const to_hour = EndGMTTournament - DifferenceMinutesUTC; // come se fosse un altra ore indietro avevo fatto punti alle 16 e qualcosa e qualcaso ma con 15 non mi dava nulla invece 14 si
        const hour = 3 - DifferenceMinutesUTC;
        // year=${y}&month=${m}&day=${d}&hour=${hour}&minute=0&to_year=${to_y}&to_month=${to_m}&to_day=${to_d}&to_hour=${to_hour}&to_minute=0
        // new Date(year, month, day, hours, minutes, seconds, milliseconds)
        // tolgo la parte con . nella data
        const start = new Date(y, m, d, hour, 0, 0).toISOString().split(".")[0];
        const end = new Date(to_y, to_m, to_d, to_hour, 0, 0)
          .toISOString()
          .split(".")[0];
        const queryString = `/api/v1/daily_activity?start=${start}&end=${end}`;

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
          console.log(response);

          // se è per il controllo del'evento, vedo i punti dell'utente
          if (Array.isArray(response.data)) {
            dispatch({
              type: GET_WEEK_ACTIVITIES,
              payload: response.data,
            });
          } else {
            dispatch({
              type: GET_WEEK_ACTIVITIES,
              payload: [],
            });
          }
        } else if (response.status === 403) {
          // se il token è scaduto
          // lo rinnovo e poi ricarico le richieste dall'app
          console.log("token scaduto");

          dispatch(
            RefreshTokenObligatory({
              ...dataLogin,
              callback: getWeeklyActivities,
            })
          );
        } else {
          console.log("api/v1/leaderboard by city returns error");
          console.log(response);
          dispatch({
            type: GET_STATS_FAILED,
            // payload: { error_description: response.data.error }
          });
        }
      } catch (exception) {
        console.log("Exception from api/v1/leaderboard by getWeeklyActivities");
        console.log(exception);
        dispatch({
          type: GET_STATS_FAILED,
        });
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(RefreshToken({ ...dataUser, callback: getWeeklyActivities }));
    }
  };
}
