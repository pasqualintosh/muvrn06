import {
  GET_STATS,
  GET_STATS_FAILED,
  NO_STATS,
  CHANGE_SCREEN_STATISTICS,
  GET_WEEK_ACTIVITIES,
  STATUS_PERM_ACTIVITIES
} from "./ActionTypes";
import axios from "axios";
import qs from "qs";
import {
  requestBackend,
  RefreshToken,
  requestCallback
} from "./../login/ActionCreators"; // da far puntare agli helper!!!

import {
  getPreviousMonday,
  getNextSunday,
  EndGMTTournament
} from "./../standings/ActionCreators";

import { Platform, Alert } from "react-native";

import AppleHealthKit from "rn-apple-healthkit";
import GoogleFit, { Scopes } from "react-native-google-fit";
import moment from "moment";

export function getStats(dataUser = {}) {
  return async function(dispatch, getState) {
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
            payload: response.data
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
              type: NO_STATS
            });
          } else {
            dispatch({
              type: GET_STATS_FAILED
            });
          }
        }
      } catch (exception) {
        console.log("Exception from api/v1/stats");
        console.log(exception);
        dispatch({
          type: GET_STATS_FAILED
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

export function changeScreenStatistics(screen) {
  return async function(dispatch, getState) {
    dispatch({
      type: CHANGE_SCREEN_STATISTICS,
      payload: screen
    });
  };
}

export function nothingUpdate() {
  return async function(dispatch, getState) {
    dispatch({
      type: "null",
      payload: 0
    });
  };
}

export function changeStatusPerm(value) {
  return async function(dispatch, getState) {
    dispatch({
      type: STATUS_PERM_ACTIVITIES,
      payload: value
    });
  };
}

export function putDailyActivities(dataUser = {}) {
  return async function(dispatch, getState) {
    const { access_token, date } = getState().login;
    let now = +new Date();

    const {
      activities_minutes,
      points,
      support_device,
      activities_day
    } = dataUser;

    // dati che mando
    const dataDailyActivities = {
      activity_minutes: activities_minutes,
      points,
      support_device,
      activity_day: activities_day
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
  return async function(dispatch, getState) {
    let options = {
      startDate: new Date(new Date().toDateString()).toISOString(), // required
      endDate: new Date().toISOString() // optional; default now
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
        newResult = results.filter(elem => elem.device == checkWatch);
      }

      let timeActivity = 0.0;
      console.log(newResult);
      // se hai l'orologio, devi muoverlo almeno un minuto per considerlo
      const threesold = checkWatch.length ? 60000 : 30000;
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

      dispatch(sendDailyActivities(finalActivities, checkWatch, results));
    });
  };
}

function sendDailyActivities(finalActivities, checkWatch, results) {
  return async function(dispatch, getState) {
    console.log(finalActivities);
    // ho trovato il valore massimo lo mando al db se è nuovo e se è maggiore di 29
    if (finalActivities > 29) {
      let points = 100;
      if (finalActivities > 59) {
        points = 200;
      }
      if (finalActivities > 89) {
        points = 400;
      }
      // mando
      const activities_day = new Date().toISOString().split(".")[0];
      const dailyActivities = {
        activities_minutes: finalActivities,
        points,
        // watch o iphone
        support_device: checkWatch
          ? checkWatch
          : results.length
          ? results[0].device
          : "",
        activities_day
      };

      console.log(dailyActivities);
      dispatch(putDailyActivities(dailyActivities));
    } else {
      dispatch(nothingUpdate());
    }
  };
}

export function updateActivities(dataUser = {}) {
  return async function(dispatch, getState) {
    if (Platform.OS == "ios") {
      let perm = {
        permissions: {
          read: [
            "AppleExerciseTime",
            "ActiveEnergyBurned",
            "DistanceCycling",
            "DistanceWalkingRunning",
            "StepCount"
          ]
        },
        observers: [{ type: "StepCount" }]
      };
      let options = {
        startDate: new Date(new Date().toDateString()).toISOString(), // required
        endDate: new Date().toISOString() // optional; default now
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

        AppleHealthKit.getAppleExerciseTime(options, (err, results) => {
          if (err) {
            console.log("errore");
            console.log(err);
            // non ha il watch, quindi calcolo l'attività dalle singole attività
            dispatch(calcolateActivitiesApple(0));
          }
          let resultsMin = 0;

          if (results.length) {
            resultsMin = results.length ? results[0].value : 0;

            resultsMin = resultsMin / 60;
          }
          // non ha il watch, quindi calcolo l'attività dalle singole attività
          dispatch(calcolateActivitiesApple(resultsMin));
        });
      });
    } else {
      // The list of available scopes inside of src/scopes.js file
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          Scopes.FITNESS_ACTIVITY_READ_WRITE,
          Scopes.FITNESS_BODY_READ,
          Scopes.FITNESS_BODY_READ_WRITE,
          Scopes.FITNESS_NUTRITION_READ,
          Scopes.FITNESS_LOCATION_READ_WRITE
        ]
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
        .then(res => {
          if (res.success) {
            // ho ottenuto il permesso, lo salvo

            let optDay = {
              startDate: new Date(new Date().toDateString()).getTime(),
              endDate: new Date().getTime()
            };

            GoogleFit.getActivitySamples(optDay, (err, res) => {
              const resFilter = res.filter(
                elem =>
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

              dispatch(sendDailyActivities(timeActivity, "Android", []));
            });
          } else {
            Alert.alert("Enable to extra points");
          }
        })
        .catch(err => {
          console.log("err >>> ", err);
        });
    }
  };
}

export function getWeeklyActivities(dataUser = {}) {
  return async function(dispatch, getState) {
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
              payload: response.data
            });
          } else {
            dispatch({
              type: GET_WEEK_ACTIVITIES,
              payload: []
            });
          }
        } else if (response.status === 403) {
          // se il token è scaduto
          // lo rinnovo e poi ricarico le richieste dall'app
          console.log("token scaduto");

          dispatch(
            RefreshTokenObligatory({
              ...dataLogin,
              callback: getWeeklyActivities
            })
          );
        } else {
          console.log("api/v1/leaderboard by city returns error");
          console.log(response);
          dispatch({
            type: GET_STATS_FAILED
            // payload: { error_description: response.data.error }
          });
        }
      } catch (exception) {
        console.log("Exception from api/v1/leaderboard by getWeeklyActivities");
        console.log(exception);
        dispatch({
          type: GET_STATS_FAILED
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
