import {
  Alert,
  Platform,
  InteractionManager,
  AsyncStorage
} from "react-native";
import {
  ADD_TRACKING,
  SAVE_TRACKING_SUCCESS,
  SAVE_TRACKING_ERROR,
  RESET_TRACKING,
  ADD_ACTIVITY,
  CONTROL_ACTIVITY,
  UPDATE_LOCATION,
  START_LOCATION,
  STOP_LOCATION,
  UPDATE_STATUS,
  COMPLETE_ROUTE,
  ADD_DAILY_ROUTINE,
  UPDATE_PREVIOUS_ROUTE,
  CHANGE_ACTIVITY,
  RESET_PREVIOUS_ROUTE,
  ADD_WEATHER,
  STILL_NOTIFICATION_LOG,
  ADD_REFER_PUBLIC_ROUTE
} from "./ActionTypes";
import { SET_SERIES } from "../login/ActionTypes";

import haversine from "./../../helpers/haversine";
import axios from "axios";
import BackgroundGeolocation from "./../../helpers/geolocation";
import ActivityRecognition from "react-native-activity-recognition";
import { pointActivityAnalyzed, calcolatePoints } from "./Reducers";
import {
  saveRouteBackend,
  GetListRoute,
  getMostFrequentRoute,
  GetListRouteForCheckSeries,
  forgetPassword,
  setNotificationTime
} from "../login/ActionCreators";
import { strings } from "../../config/i18n";

import {
  checkEvent,
  checkEventRedux,
  checkSpecialTrainingEvent
} from "../trainings/ActionCreators";
import { pushNotifications } from "./../../services";
import { convertWeather } from "./../../screens/Track/Track";
import { getCalories, getIdModalType, getDefaultSpeed, getIdWeatherType } from "./Support";

import BackgroundFetch from "react-native-background-fetch";

// conversione in linestring
var parse = require("wellknown");
// da osmdata a linestring
var osmtogeojson = require("osmtogeojson");

import { lineString } from "@turf/helpers";
import lineIntersect from "@turf/line-intersect";
import buffer from "@turf/buffer";


import { Client } from "bugsnag-react-native";
const bugsnag = new Client("58b3b39beb78eba9efdc2d08aeb15d84");


const LIMIT_TO_START_COUNTER_ACTIVITIES_STILL = 3;
const LIMIT_TO_CHECK_COUNTER_ACTIVITIES_STILL = 3;
const MINUTES_TO_NOTIFY_ACTIVITIES_STILL = 1000 * 60 * 5; // 1000 ms * 60 (1 minuto) * 5 (5 minuti) ?
let is_user_still_timer = null;
let getWeather = false;

export function addTracking(item, lastPos) {
  const newItem = generateItem(item, lastPos);

  return {
    type: ADD_TRACKING,
    item: newItem
  };
}

export function addActivity(itemActivity) {
  // aggiungo la data cosi posso suddividere le attivita in un certo intervallo di tempo in analogia di un intervallo di coordinate

  return {
    type: ADD_ACTIVITY,
    itemActivity
  };
}

export function resetTracking() {
  return {
    type: RESET_TRACKING
  };
}

export function checkStateToValidateAndSave() {
  return function (dispatch, getState) {
    // prendo tutte le tratte precedenti e vedo se sono state tutte inviate e validate

    let check = 0;
    // a seconda del valore di check capisco in che condizione è il mio programma

    const {
      PreviousRoute,
      route,
      routeAnalyzed,
      routeNotvalid
    } = getState().tracking;

    if (route.length || routeAnalyzed.length || routeNotvalid.length) {
      // se ho un tracking in corso, non faccio partire nessuna ruotine di controllo
      return 0;
    } else {
      const length = PreviousRoute.length;

      for (index = 1; index <= PreviousRoute.length; index++) {
        const NumRoute = PreviousRoute[index - 1];

        // se delle tratta ancora non salvate nel db

        if (NumRoute.status === "validation") {
          check = 1;
          break;
        } else if (!NumRoute.modal_type || !NumRoute.Saved) {
          console.log("non ancora validate o mandate al db ");
          check = 2;
          dispatch(resumeRoute());
          break;
        } else {
          check = 3;
          continue;
        }
      }
      return check;
    }
  };
}

// funzione per aggiornare le posizioni correnti catturate, utile poi per chiamare il controllo attivita
// @location {*} locazioni da controllare, prese da redux
// con index specifico quale route aggiornare

export function updateCordinate(index) {
  // con index indico quale tratta sto elaborando
  // con 0 indico la tratta corrente, mentre > 0 indico le tratte passate
  // utile se una tratta passata non e stata validata tipo se manca internet

  // prendo le coordinate ancora non validate, le mando a router.project-osrm, sui dati openstreet
  // che mi dice quale è la coordinata di una strada piu vicina alla cooordinata passata

  // a seconda del tipo di attivita da riconoscere, faccio validazioni della tratta differenti

  // passando getState mi permette di avere lo stato corrente relativo a redux
  return function (dispatch, getState) {
    // prendo i dati necessari da validare come tratta e tipo tratta
    // prendo le tratte corrispodente alla tratta analizzata

    // controllo lo stato della linea prima di fare la validazione
    // tratta corrente o passata

    let type = getState().tracking.activityChoice.type;
    let coef = getState().tracking.activityChoice.coef;

    if (index !== 0) {
      type = getState().tracking.PreviousRoute[index - 1].activityChoice.type;
      coef = getState().tracking.PreviousRoute[index - 1].activityChoice.coef;
    }
    const { isConnected } = getState().connection;
    // se ho connessione
    if (isConnected || type !== "Public") {
      // dico che sto validando alla stato
      dispatch(UpdateStatus("validation", index));

      // tratta corrente o passata
      let location = getState().tracking.route;

      if (index !== 0) {
        location = getState().tracking.PreviousRoute[index - 1].route;
      }

      // prendo anche le info dell'utente utili per l'altezza ecc
      const infoProfile = {
        ...getState().login.infoProfile,
        ...getState().login.infoProfileNotSave
      };

      // prima di fare i controlli devo avere qualcosa da controllare
      if (location.length > 0) {
        console.log(location);

        if (type === "Biking" || type === "Walking" || type !== "Public") {
          // se le posizioni trovate sono maggiori di 15, ne analizzo solo 15 prendendo solo quelle che mi interessano
          // vedere qual'e il numero piu adatto tipo 10
          // 20 alla fine non è tanto importante controllare pochi punti alla volta
          if (location.length > 4) {
            location = location.slice(0, 4);
          }

          dispatch({
            type: UPDATE_LOCATION,
            ValidRoute: location,
            NumRouteValid: 0,
            refTrasportRoute: [],
            infoProfile,
            index
          });
        }

        if (type === "Public") {
          // usare server differenti se la risposta non arriva essendo che possono gestire un tot di richeste al minuto
          // questo è il server migliore

          if (location.length > 4) {
            location = location.slice(0, 4);
          }

          // prendo le route di riferimento degli autobus o dei mezzi
          // prendo l'attivita
          let activity = getState().tracking.activity;

          let refTrasportRoute = getState().tracking.refTrasportRoute;

          let numValidRoute = getState().tracking.numValidRoute;

          if (index !== 0) {
            refTrasportRoute = getState().tracking.PreviousRoute[index - 1]
              .refTrasportRoute;
            activity = getState().tracking.PreviousRoute[index - 1].activity;
            numValidRoute = getState().tracking.PreviousRoute[index - 1]
              .numValidRoute;
          }

          let locationNum = location.length;

          // prendo la data dell'ultima posizione analizzata
          const keyDateLocation = location[locationNum - 1].key;
          console.log(keyDateLocation);
          console.log(activity);
          // metro
          if (coef === 1200) {
            //  metro

            // mi interessa avere per il primo segmento un database di linee
            if (refTrasportRoute.length > 0) {
              dispatch({
                type: UPDATE_LOCATION,
                ValidRoute: location,
                NumRouteValid: 0,
                infoProfile,
                index
              });
            } else {
              // se non ho route di riferimenti, le richiedo e vedo
              dispatch(
                requestTrasportRouteDedicatedStart(
                  location,
                  index,
                  infoProfile,
                  coef
                )
              );
            }
          }
          if (coef === 400) {
            // train
            let activityAuto = false;
            for (
              indexActivity = 1;
              indexActivity <= activity.length;
              indexActivity++
            ) {
              const elem = activity[indexActivity - 1];
              if (elem.key <= keyDateLocation) {
                // se sono in auto
                if (
                  elem.activity[0].type === "IN_VEHICLE" ||
                  elem.activity[0].type === "AUTOMOTIVE"
                ) {
                  activityAuto = true;
                  break;
                } else if (
                  elem.activity.length > 1 &&
                  (elem.activity[1].type === "IN_VEHICLE" ||
                    elem.activity[1].type === "AUTOMOTIVE")
                ) {
                  activityAuto = true;
                  break;
                }
              } else {
                break;
              }
            }

            console.log(activityAuto);

            // controllo se c'e l'auto
            // se non ho riferimenti li prendo
            // se non è auto e non ho gia le tratte, non faccio nulla
            if (
              !activityAuto &&
              (refTrasportRoute.length < 1 || refTrasportRoute === undefined)
            ) {
              dispatch({
                type: UPDATE_LOCATION,
                ValidRoute: location,
                NumRouteValid: 0,
                infoProfile,
                index
              });
            } else if (
              refTrasportRoute.length < 3 &&
              (activityAuto || refTrasportRoute.length > 0)
            ) {
              // se non ho route di riferimenti, le richiedo e vedo

              // dopo che ho fatto la richiesta per una linea, chiedo per altre due volte le linee per i segmenti successivi anche se non è auto
              dispatch(
                requestTrasportRouteDedicated(
                  location,
                  index,
                  infoProfile,
                  coef
                )
              );
            } else if (!activityAuto) {
              dispatch({
                type: UPDATE_LOCATION,
                ValidRoute: location,
                NumRouteValid: 0,
                infoProfile,
                index
              });
            } else {
              // se li ho faccio un confronto
              let linestringNew;
              // caso classico con quattro punti

              if (locationNum === 4) {
                linestringNew = lineString(
                  location.map(elem => [elem.longitude, elem.latitude]),
                  { name: "line 1" }
                );
                console.log(linestringNew);
              } else {
                // se ho meno punti
                // prendo i punti precedenti
                // sicuramente li ho dati che ho almeno analizzato tre volte per l'addestramento

                // numero di altri punti che servono
                locationNum = 4 - locationNum;

                // numero di punti gps analizzati
                // prendo la fine
                let numAnalyzedRoute = 4;

                if (index !== 0) {
                  numAnalyzedRoute = getState().tracking.PreviousRoute[
                    index - 1
                  ].routeAnalyzed.length;
                } else {
                  numAnalyzedRoute = getState().tracking.routeAnalyzed.length;
                }

                // costituisce la fine piu il tratto corrente
                let backLocation = [...location];

                if (index !== 0) {
                  // aggiungo partendo dalla fine dei punti analizzati e aggiungo per ogni punti gps che serve d'avanti
                  for (j = 1; j <= locationNum; j++) {
                    backLocation = [
                      getState().tracking.PreviousRoute[index - 1]
                        .routeAnalyzed[numAnalyzedRoute - j],
                      ...backLocation
                    ];
                  }
                } else {
                  for (j = 1; j <= locationNum; j++) {
                    backLocation = [
                      getState().tracking.routeAnalyzed[numAnalyzedRoute - j],
                      ...backLocation
                    ];
                  }
                }

                console.log(backLocation);

                linestringNew = lineString(
                  backLocation.map(elem => [elem.longitude, elem.latitude]),
                  { name: "line 1" }
                );
                console.log(linestringNew);
              }

              const PolygonNew = buffer(linestringNew, 0.01, {
                units: "kilometers"
              });

              // const bboxNew = bbox(linestringNew);
              // const bboxPolygonNew = bboxPolygon(bboxNew);

              console.log(PolygonNew);
              // confronto di questa tratta con la tratta dei mezzi pubblici

              const AllReferPublicRoute = [
                ...refTrasportRoute[0],
                ...refTrasportRoute[1],
                ...refTrasportRoute[2]
              ];

              const refTrasportRouteLength = AllReferPublicRoute.length
                ? refTrasportRoute.length
                : 0;
              try {
                if (refTrasportRouteLength && PolygonNew) {
                  // tolgo le linee dei mezzi pubblici in piu e unendo quelle trovate, nei primi 3 segment
                  AllReferPublicRouteReduce = AllReferPublicRoute.reduce(
                    (total, linea, index, array) => {
                      if (!total.filter(elem => elem.id === linea.id).length) {
                        return [...total, linea];
                      }
                      return total;
                    },
                    []
                  );
                  console.log(AllReferPublicRouteReduce);
                  // mi salvo tutte le possibili intersezioni
                  let NumRouteValid = [];
                  for (i = 0; i < AllReferPublicRouteReduce.length; i++) {
                    const intersects = lineIntersect(
                      PolygonNew,
                      AllReferPublicRouteReduce[i]
                    );

                    if (intersects.features.length) {
                      console.log("trovata intersezione");
                      NumRouteValid = [...NumRouteValid, i];
                    }
                  }
                  if (NumRouteValid.length) {
                    dispatch({
                      type: UPDATE_LOCATION,
                      ValidRoute: location,
                      NumRouteValid,
                      infoProfile,
                      index
                    });
                  } else {
                    dispatch({
                      type: UPDATE_LOCATION,
                      ValidRoute: location,
                      NumRouteValid: [-1],
                      infoProfile,
                      index
                    });
                  }
                } else {
                  dispatch({
                    type: UPDATE_LOCATION,
                    ValidRoute: location,
                    NumRouteValid: [-1],
                    infoProfile,
                    index
                  });
                }
              } catch (error) {
                if (typeof error !== "Error") {
                  console.log(error);
                  msg = new Error(error);
                  bugsnag.notify(msg);
                } else {
                  bugsnag.notify(error);
                }
                dispatch({
                  type: UPDATE_LOCATION,
                  ValidRoute: location,
                  NumRouteValid: [-1],
                  infoProfile,
                  index
                });
              }
            }
          } else if (coef === 800) {
            // bus
            let activityAuto = false;
            for (
              indexActivity = 1;
              indexActivity <= activity.length;
              indexActivity++
            ) {
              const elem = activity[indexActivity - 1];
              if (elem.key <= keyDateLocation) {
                // se è una attivita valida la considero
                // se ancora devo fare l'addestramento o ancora devo fare il primo match
                // allora considero auto e anche che non stai camminando

                activityAuto = true;
                if (
                  elem.activity[0].type === "ON_FOOT" ||
                  elem.activity[0].type === "RUNNING" ||
                  elem.activity[0].type === "WALKING"
                ) {
                  activityAuto = false;
                  break;
                }
              } else {
                break;
              }
            }

            console.log(activityAuto);
            // controllo se c'e l'auto
            // se non ho riferimenti li prendo
            // se non è auto e non ho gia le tratte, non faccio nulla
            if (
              !activityAuto &&
              (refTrasportRoute.length < 3 || refTrasportRoute === undefined)
            ) {
              dispatch({
                type: UPDATE_LOCATION,
                ValidRoute: location,
                NumRouteValid: 0,
                infoProfile,
                index
              });
            } else if (
              activityAuto &&
              (refTrasportRoute.length < 3 || refTrasportRoute === undefined)
            ) {
              // se non ho route di riferimenti, le richiedo e vedo
              dispatch(
                requestTrasportRouteDedicated(
                  location,
                  index,
                  infoProfile,
                  coef
                )
              );
            } else if (!activityAuto) {
              dispatch({
                type: UPDATE_LOCATION,
                ValidRoute: location,
                NumRouteValid: 0,
                infoProfile,
                index
              });
            } else {
              // se li ho faccio un confronto
              let linestringNew;
              // caso classico con quattro punti

              if (locationNum === 4) {
                linestringNew = lineString(
                  location.map(elem => [elem.longitude, elem.latitude]),
                  { name: "line 1" }
                );
                console.log(linestringNew);
              } else {
                // se ho meno punti
                // prendo i punti precedenti
                // sicuramente li ho dati che ho almeno analizzato tre volte per l'addestramento

                // numero di altri punti che servono
                locationNum = 4 - locationNum;

                // numero di punti gps analizzati
                // prendo la fine
                let numAnalyzedRoute = 4;

                if (index !== 0) {
                  numAnalyzedRoute = getState().tracking.PreviousRoute[
                    index - 1
                  ].routeAnalyzed.length;
                } else {
                  numAnalyzedRoute = getState().tracking.routeAnalyzed.length;
                }

                // costituisce la fine piu il tratto corrente
                let backLocation = [...location];

                if (index !== 0) {
                  // aggiungo partendo dalla fine dei punti analizzati e aggiungo per ogni punti gps che serve d'avanti
                  for (j = 1; j <= locationNum; j++) {
                    backLocation = [
                      getState().tracking.PreviousRoute[index - 1]
                        .routeAnalyzed[numAnalyzedRoute - j],
                      ...backLocation
                    ];
                  }
                } else {
                  for (j = 1; j <= locationNum; j++) {
                    backLocation = [
                      getState().tracking.routeAnalyzed[numAnalyzedRoute - j],
                      ...backLocation
                    ];
                  }
                }

                console.log(backLocation);

                linestringNew = lineString(
                  backLocation.map(elem => [elem.longitude, elem.latitude]),
                  { name: "line 1" }
                );
                console.log(linestringNew);
              }

              const PolygonNew = buffer(linestringNew, 0.01, {
                units: "kilometers"
              });

              // const bboxNew = bbox(linestringNew);
              // const bboxPolygonNew = bboxPolygon(bboxNew);

              console.log(PolygonNew);
              // confronto di questa tratta con la tratta dei mezzi pubblici

              const AllReferPublicRoute = [
                ...refTrasportRoute[0],
                ...refTrasportRoute[1],
                ...refTrasportRoute[2]
              ];

              const refTrasportRouteLength = AllReferPublicRoute.length
                ? refTrasportRoute.length
                : 0;
              try {
                if (refTrasportRouteLength && PolygonNew) {
                  // tolgo le linee dei mezzi pubblici in piu e unendo quelle trovate, nei primi 3 segment
                  AllReferPublicRouteReduce = AllReferPublicRoute.reduce(
                    (total, linea, index, array) => {
                      if (!total.filter(elem => elem.id === linea.id).length) {
                        return [...total, linea];
                      }
                      return total;
                    },
                    []
                  );
                  console.log(AllReferPublicRouteReduce);
                  // mi salvo tutte le possibili intersezioni
                  let NumRouteValid = [];
                  for (i = 0; i < AllReferPublicRouteReduce.length; i++) {
                    const intersects = lineIntersect(
                      PolygonNew,
                      AllReferPublicRouteReduce[i]
                    );

                    if (intersects.features.length) {
                      console.log("trovata intersezione");
                      NumRouteValid = [...NumRouteValid, i];
                    }
                  }
                  if (NumRouteValid.length) {
                    dispatch({
                      type: UPDATE_LOCATION,
                      ValidRoute: location,
                      NumRouteValid,
                      infoProfile,
                      index
                    });
                  } else {
                    dispatch({
                      type: UPDATE_LOCATION,
                      ValidRoute: location,
                      NumRouteValid: [-1],
                      infoProfile,
                      index
                    });
                  }
                } else {
                  dispatch({
                    type: UPDATE_LOCATION,
                    ValidRoute: location,
                    NumRouteValid: [-1],
                    infoProfile,
                    index
                  });
                }
              } catch (error) {
                if (typeof error !== "Error") {
                  console.log(error);
                  msg = new Error(error);
                  bugsnag.notify(msg);
                } else {
                  bugsnag.notify(error);
                }
                dispatch({
                  type: UPDATE_LOCATION,
                  ValidRoute: location,
                  NumRouteValid: [-1],
                  infoProfile,
                  index
                });
              }
            }
          }

          /*       
          axios({
            method: "get",
            url: urlTrasport
          })
          .then(function(response) {}); 
          */
        }
      }
    }
    // se non ho connessione allora non effettuo nessuna validazione
  };
}

/**
 * genero un nuono POJO sulla base dell'elemento da inserire,
 * le precedenti posizioni e il timestamp di quando l'attivita'
 * ha avuto inizio
 * @param {*} item elemento da isnerire
 * @param {*} lastPos elemento con ultima posizione e timestamp di inizio attivita'
 */
function generateItem(item, lastPos) {
  if (lastPos != null) {
    // differenza fra due date in millisecondi
    const diffMs = new Date(item.time) - new Date(lastPos.time);

    const distance = haversine(
      item.latitude,
      item.longitude,
      lastPos.latitude,
      lastPos.longitude
    );
    const points = distance * 0.6;
    const experience = distance * 0.2;
    const duration = Math.round(((diffMs % 86400000) % 3600000) / 60000); // conversione in minuti
    return { ...item, distance, points, experience, duration };
  } else {
    const distance = 0;
    const points = 0;
    const experience = 0;
    const duration = 0;
    return { ...item, distance, points, experience, duration };
  }
}

/**
 * quando inizio il tracciamento con la scelta del mezzo
 * @param {*} type tipo del mezzo
 * @param {*} coef coef per calcolare i punti associati al mezzo scelto
 */
export function starton(type, coef, threshold) {
  // avvio la registrazione
  // mando anche le route del db cosi le uso per sapere una distanza precedente fatta con lo stesso mezzo
  return function (dispatch, getState) {
    // avvio
    dispatch({
      type: START_LOCATION,
      activityChoice: { type, coef, threshold },
      routeSaved: getState().login.Route
    });

    const Now = new Date();
    // se è un nuovo giorno rispetto all'ultimo che si e settata la serie
    // ricalcolo
    const dateDaySeries = getState().login.NumDaysRoute
      ? getState().login.NumDaysRoute.day
      : "Mon Sep 03 2018";
    const diffDay = Now.toDateString() !== dateDaySeries;
    if (diffDay) {
      const numDay = getState().login.NumDaysRoute
        ? getState().login.NumDaysRoute.numDay
        : 0;
      const NumDaysRoute = NumDaysRouteCalcolate(
        getState,
        Now,
        dateDaySeries,
        numDay,
        [],
        dispatch
      );
      dispatch({
        type: SET_SERIES,
        NumDaysRoute: NumDaysRoute
      });
    }
    // cancello route salvate precedentemente nel db
    dispatch(ResetPreviousRoute());
  };
}

// getState, per prendere i dati dell'utente come tratte del db e salvate
// Now, date corrente
// dateDaySeries, la data del'ultimo controllo
// numDay, valore della serie precedente
// NewRoute, nuove route del db, nel caso la serie si espande anche dopo l'ultima route salvate
function NumDaysRouteCalcolate(
  getState,
  Now,
  dateDaySeries,
  numDay,
  NewRoute,
  dispatch
) {
  const PreviousRoute = getState().tracking.PreviousRoute;
  const SavedRoute = NewRoute.length ? NewRoute : getState().login.Route;
  const newInterval = new Date(dateDaySeries).getTime();
  // dove avevo gia controllato per la serie
  console.log("calcolo serie ");
  console.log(NewRoute);
  console.log(getState().login.Route);
  console.log(newInterval);

  //numDay: NumDaysRoute, day: DayNowFromMon.getDay()
  console.log(PreviousRoute);
  console.log(SavedRoute);
  // controllo il tempo di ogni route effettuata

  // intervallo da considerare
  const Routes = PreviousRoute.length;

  const millisecond = Now.getTime();
  // vedo che giorno è oggi
  // Sunday is 0, Monday is 1, and so on.
  // tolgo un giorno cosi quando è lunedi da 0 e domenica da 6
  const millisecondMon = millisecond - 86400000;
  console.log(millisecondMon);
  console.log(Now.toDateString());

  // calcolo il tempo iniziale della settimana
  const DayNowFromMon = new Date(millisecondMon).getDay();

  const hoursNow = Now.getHours();

  const minutesNow = Now.getMinutes();
  const secondNow = Now.getSeconds();

  const startWeek =
    millisecond -
    (DayNowFromMon * 86400000 +
      hoursNow * 3600000 +
      minutesNow * 60000 +
      secondNow * 1000);

  const Now3 = new Date(startWeek);
  console.log(Now3.toDateString());
  console.log(Now3.toTimeString());

  // se sono ancora nella settimana corrente allora posso usare il valore precedente per il nuovo
  // giorno nella settimana per calcolare l'eventuale incremento
  // altrimenti parto da 0 con la nuova settimana
  let NumDaysRoute = newInterval > startWeek ? numDay : 0;
  let sogliaMinima = newInterval > startWeek ? newInterval : startWeek;
  // se non ho info precedenti o è una nuova settimana considero solo il giorno corrente per calcolare la serie
  // altrimenti aggiungo il giorno in cui è stata effettuato l'ultimo calcolo cosi ho un riferimento da cui calcolare la serie
  // ma aggiungo il giorno precedente cosi controllo anche il giorno in cui avevo fatto una tratta
  let dayInTheWeek =
    newInterval > startWeek
      ? [new Date(newInterval - 86400000 * 2).getDay()]
      : [DayNowFromMon];

  // SE è SABATO, DOMENICA o lunedi LA SERIE è 0
  if (DayNowFromMon === 5 || DayNowFromMon === 6 || DayNowFromMon === 0) {
    return { numDay: 0, day: Now.toDateString() };
  } else {
    // devo ottenere il tempo per avere l'inizio settimana
    // prima calcolo sulle route precedenti
    for (route = 1; route <= Routes; route++) {
      const Segment = PreviousRoute[route - 1]
        ? PreviousRoute[route - 1]
        : null;
      // se il segmento esiste
      if (Segment) {
        const NumRoute = Segment.route.length;
        // prendo la data dell'ultima posizione presa, che è presente su route
        const end = Segment.route[NumRoute - 1].time;
        // se è successo in questa settimana
        if (end >= sogliaMinima) {
          const day = new Date(end - 86400000).getDay();
          dayInTheWeek = [...dayInTheWeek, day];
        }
      }
    }
    // poi sulle route del db

    // ContinueSerch mi dice se dopo che controllo devo andare avanti oppure no
    // se trovo quelle di lunedi ho finito oppure una supera la settimana non cerco piu
    // se finisco che ancora ne mancano e per ogni giorno c'e una tratta significa che mi servono le altre tratte dal db
    let ContinueSerch = true;
    for (route = 1; route <= SavedRoute.length; route++) {
      // prendo la data dalle info del db
      // se esiste
      if (SavedRoute[route - 1]) {
        const end = new Date(SavedRoute[route - 1].end_time).getTime();
        if (end >= sogliaMinima) {
          const day = new Date(end - 86400000).getDay();

          dayInTheWeek = [...dayInTheWeek, day];
          // se trovo 0 ho finito di cercare
          if (day) {
            ContinueSerch = true;
          } else {
            ContinueSerch = false;
          }
        } else {
          ContinueSerch = false;
        }
        if (!ContinueSerch) {
          route = SavedRoute.length;
        }
      }
    }
    // ordino in ordine crescente
    dayInTheWeek = dayInTheWeek.sort();
    for (i = 0; i < dayInTheWeek.length - 1; i++) {
      // calcolo la differenza due alla volta
      const dif = dayInTheWeek[i + 1] - dayInTheWeek[i];
      if (dif === 1) {
        console.log("giorno passato");
        // se cambia di uno allora è passato un giorno
        NumDaysRoute += 1;
      } else if (dif > 1) {
        // se sono passati piu di un giorno la serie di interrompe
        // e non devo fare altri ricerche
        i = dayInTheWeek.length - 1;
        ContinueSerch = false;
      }
    }

    // si dovrebbe fare che se ContinueSerch è ancora vero allora devo richiedere altre route dal db
    console.log("giorni trovati");
    console.log(dayInTheWeek);
    console.log(NumDaysRoute);
    console.log(ContinueSerch);
    // se vengo da una ricerca gia fatta all'interno di questa settimana non c'e bisogno di cercare indietro
    ContinueSerch = newInterval > startWeek ? false : ContinueSerch;
    if (ContinueSerch) {
      // faccio un altra request per avere altre route dal db se esistono
      // che aggiornano a sua volta numDay
      dispatch(
        GetListRouteForCheckSeries({
          callbackToSeries,
          oldRoute: NewRoute,
          getState
        })
      );

      return { numDay: NumDaysRoute, day: Now.toDateString() };
    } else {
      return { numDay: NumDaysRoute, day: Now.toDateString() };
    }
  }
}

function callbackToSeries(route, getState, dispatch) {
  console.log("ricalcolo la serie");

  const NumDaysRoute = NumDaysRouteCalcolate(
    getState,
    new Date(),
    "1/1/2018",
    0,
    route,
    dispatch
  );
  dispatch({
    type: SET_SERIES,
    NumDaysRoute: NumDaysRoute
  });
}

const writeStillNotifcationLog = dispatch => {
  return function (log) {
    dispatch({
      type: STILL_NOTIFICATION_LOG,
      payload: log
    });
  };
};

export function start(type, coef, threshold, navigation) {
  // uso getState cosi ho variabili per sapere quante coordinate gps e attivita sono state catturate
  return function (dispatch, getState) {
    BackgroundGeolocation.configure({
      desiredAccuracy: 10,
      stationaryRadius: 50,
      distanceFilter: 50,
      debug: false,
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: true, // test per berto
      startForeground: true,
      notificationIconColor: "#e33",
      notificationIconLarge: "ic_launcher",
      notificationIconSmall: "ic_stat_muv_logo",
      notificationTitle: "Muv",
      notificationText: "Background tracking",
      saveBatteryOnBackground: false,
      activityType: type === "Public" ? "AutomotiveNavigation" : "Fitness"
      // syncThreshold: 1
    });

    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15 // <-- minutes (15 is minimum allowed) disabilitato perche' parte troppo presto (?)
      },
      () => {
        dispatch({
          type: STILL_NOTIFICATION_LOG,
          payload: "[js] Received background-fetch event"
        });
        BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
      },
      error => {
        console.log("[js] RNBackgroundFetch failed to start");
        dispatch({
          type: STILL_NOTIFICATION_LOG,
          payload:
            "[js] RNBackgroundFetch failed to start " + JSON.stringify(error)
        });
      }
    );

    // utile per cambiare la notifica e in modo che la modifica non instauri una ricorsione del processo
    let counter = 0;



    // per gestire la notifica se se fermo per un po di tempo
    let durationStill = 0;
    let lastStill = 0;
    const show_still_notification = getState().login.notification_still
      ? getState().login.notification_still
      : false;


    // sottoscrizione al servizio di riconoscimento attività
    this.unsubscribe = ActivityRecognition.subscribe(detected_activities => {

      // salvo la nuova attivita trovata

      const key = +new Date();
      const itemActivity = { key, activity: detected_activities.sorted };
      dispatch(addActivity(itemActivity));

      // controllo per notifica still 

      // controllo se è still o stationary
      if (show_still_notification) {
        const most_probable_activity = detected_activities.sorted[0];
        most_probable_ativity_type = most_probable_activity.type;
        if (most_probable_ativity_type == "UNKNOWN" || most_probable_ativity_type == "STATIONARY" || most_probable_ativity_type == "STILL" || most_probable_ativity_type == "TILTING") {
          // se è still aggiorno
          // incremento il tempo che sono fermo
          durationStill = lastStill ? durationStill + (key - lastStill) : 0;
          lastStill = key;
          console.log(durationStill)
          console.log(lastStill)
          if (durationStill > 360000) {
            // se fermo piu di 6 min notifica
            // notifica

            // ricomincio a contare
            durationStill = 0;
            lastStill = 0;
            // Alert.alert('fermo')
            pushNotifications.configure();
            pushNotifications.userIsStillNotification();
          }
        } else {
          // non è fermo ricomincio da zero
          durationStill = 0;
          lastStill = 0;
        }
      }




    });

    // attivo il servizio quando avvio l'attivita
    const detection_interval_millis = 600;
    ActivityRecognition.start(detection_interval_millis)
      .then(d => {
        console.log(d);
      })
      .catch(e => {
        if (typeof e !== "Error") {
          console.log(e);
          msg = new Error(e);
          bugsnag.notify(msg);
        } else {
          bugsnag.notify(e);
        }

        ActivityRecognition.start(detection_interval_millis)
          .then(d => { })
          .catch(e => {
            if (typeof e !== "Error") {
              console.log(e);
              msg = new Error(e);
              bugsnag.notify(msg);
            } else {
              bugsnag.notify(e);
            }
          });
      });

    /* 
    BackgroundGeolocation.on("stationary", stationaryLocation => {
      // handle stationary locations here
    }); 
    */

    // on location è la callback dove intercetti l'aggiornamento eventuale
    // della posizione del `gps`
    BackgroundGeolocation.on("location", location => {
      BackgroundGeolocation.startTask(taskKey => {
        if (Platform.OS === "ios") {
          this.handleLocationChanging(location, dispatch);

          // vedo se il meteo è stato settato
          const typeWeather = getState().tracking.typeWeather
            ? getState().tracking.typeWeather.length
            : 0;

          // se ancora non ho settato il meteo
          if (!typeWeather) {
            // getWeather = true;
            dispatch(fetchWeatherAsync(location.latitude, location.longitude));
          }

          // se ci sono almeno tot attivita e coordinate avvia la validazione
          const num_cordinates = getState().tracking.route.length;
          const num_activity = getState().tracking.activity.length;

          // controllo se gia sto validando cosi non controllo
          const validation = getState().tracking.status;

          // se non sto gia validando e ho almeno un po di attivita,  valido
          if (
            validation !== "validation" &&
            num_activity >= 1 &&
            num_cordinates >= 4
          ) {
            // aggiorno le coordinate trovate mediante la validazione
            console.log("validazione in corso");

            dispatch(updateCordinate(0));
          }
        } else {
          // per android per evitare che il processo sia chiuso
          // ogni volta che prendo una posizione, vedo di configurare la notifica
          // il cambio della notifica riavvia il processo quindi devo evitare ricorsioni
          // solo quando l'evento è dispari, considero per la posizione e per aggiornare la notifica
          // questo genera un nuovo evento pari da non considerare
          counter++;
          console.log(counter);

          if (counter % 2 == 1) {
            const distance = getState().tracking.distanceLive;
            const points = calcolatePoints(
              distance,
              getState().tracking.PrecDistanceSameMode,
              getState().tracking.activityChoice.type
            );
            BackgroundGeolocation.configure({
              notificationTitle:
                "You've earned " + points.toFixed(0) + " Points",
              notificationText:
                "You've travelled " + distance.toFixed(2) + " Km"
            });

            console.log("notification BackgroundGeolocation");

            this.handleLocationChanging(location, dispatch);

            // vedo se il meteo è stato settato
            const typeWeather = getState().tracking.typeWeather
              ? getState().tracking.typeWeather.length
              : 0;

            // se ancora non ho settato il meteo
            if (!typeWeather) {
              // getWeather = true;
              dispatch(
                fetchWeatherAsync(location.latitude, location.longitude)
              );
            }

            // se ci sono almeno tot attivita e coordinate avvia la validazione
            const num_cordinates = getState().tracking.route.length;
            const num_activity = getState().tracking.activity.length;

            // controllo se gia sto validando cosi non controllo
            const validation = getState().tracking.status;

            // se non sto gia validando e ho almeno un po di attivita,  valido
            if (
              validation !== "validation" &&
              num_activity >= 1 &&
              num_cordinates >= 4
            ) {
              // aggiorno le coordinate trovate mediante la validazione
              console.log("validazione in corso");

              dispatch(updateCordinate(0));
            }
          }
        }

        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on("authorization", status => {
      console.log("auth");
      console.log(status);

      // controllo se c'e l'autorizzazione gps
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        dispatch(stop());
        Alert.alert(
          "Location services are disabled",
          "Would you like to open location settings?",
          [
            {
              text: strings("yes"),
              onPress: () =>
                Platform.OS !== "ios"
                  ? Platform.Version < 23
                    ? BackgroundGeolocation.showLocationSettings()
                    : BackgroundGeolocation.showAppSettings()
                  : BackgroundGeolocation.showAppSettings()
            },
            {
              text: strings("no"),
              onPress: () => alert("App requires gps to work"),
              style: "cancel"
            }
          ]
        );
      } else if (Platform.OS !== "ios") {
        // controllo se il gps è attivo
        BackgroundGeolocation.checkStatus(status => {
          console.log("auth gps");
          console.log(status);
          if (!status.locationServicesEnabled) {
            dispatch(stop());
            Alert.alert(
              "Location services are disabled",
              "Would you like to open location settings?",
              [
                {
                  text: strings("yes"),
                  onPress: () =>
                    Platform.OS !== "ios"
                      ? Platform.Version < 23
                        ? BackgroundGeolocation.showLocationSettings()
                        : BackgroundGeolocation.showLocationSettings()
                      : BackgroundGeolocation.showAppSettings()
                },
                {
                  text: strings("no"),
                  onPress: () => alert("App requires gps to work"),
                  style: "cancel"
                }
              ]
            );
          }
        });
      }
    });

    BackgroundGeolocation.on("background", () => {
      console.log("[INFO] App is in background");
    });

    BackgroundGeolocation.on("foreground", () => {
      console.log("[INFO] App is in foreground");
    });

    BackgroundGeolocation.on("start", () => {
      console.log("[INFO] BackgroundGeolocation service has been started");
      dispatch(starton(type, coef, threshold));

      if (navigation !== null) {
        navigation.navigate("Track");
      }
    });

    BackgroundGeolocation.on("stop", () => {
      console.log("[INFO] BackgroundGeolocation service has been stopped");
      // BackgroundGeolocation.removeAllListeners();
      dispatch(stop());
    });

    BackgroundGeolocation.on("error", error => {
      // se ho qualche problema mi arriva una segnalazione
      console.log("[ERROR] BackgroundGeolocation error:", error);
      if (typeof error !== "Error") {
        console.log(error);
        msg = new Error(error);
        bugsnag.notify(msg);
      } else {
        bugsnag.notify(error);
      }
    });

    BackgroundGeolocation.checkStatus(status => {
      console.log("stato gps");
      console.log(status);
      // per android devo vedere se il gps è attivo
      if (Platform.OS !== "ios" && !status.locationServicesEnabled) {
        dispatch(stop());
        Alert.alert(
          "Location services are disabled",
          "Would you like to open location settings?",
          [
            {
              text: strings("yes"),
              onPress: () =>
                Platform.OS !== "ios"
                  ? Platform.Version < 23
                    ? BackgroundGeolocation.showLocationSettings()
                    : BackgroundGeolocation.showLocationSettings()
                  : BackgroundGeolocation.showAppSettings()
            },
            {
              text: strings("no"),
              onPress: () => alert("App requires gps to work"),
              style: "cancel"
            }
          ]
        );
      } else if (!status.isRunning) {
        // controllo se c'e il gps attivo
        BackgroundGeolocation.start(); //triggers start on start event
      } else {
        // se è gia attivo ma premo play allora devo stopparlo e farlo ripartire
        BackgroundGeolocation.stop(); //triggers start on start event
        // richiamo l'intera funzione di nuovo
        dispatch(start(type, coef, threshold, navigation));
      }
    });

    // stillNotification.init();
  };
}

/**
 * gestione del cambio di coordinate da parte del gps
 * e dispatch per aggiungere l'elemento coordinata all'array coordinate
 */
handleLocationChanging = (location, dispatch) => {
  const key = +new Date();
  const { speed, time, longitude, latitude, altitude } = location;

  // Alert.alert(longitude.toString(),latitude.toString());

  dispatch({
    type: ADD_TRACKING,
    item: { key, speed, time, longitude, latitude, altitude }
  });
};

export function changeActivity(type, coef, threshold) {
  // faccio uno stop particolare ma cambio type
  return function (dispatch) {
    console.log("cambio");
    console.log({ type, coef, threshold });

    dispatch(stop(1, { type, coef, threshold }));
  };
}

// con typestop indico il tipo di stop, se specificato tipo 2 allora non è un vero stop ma piu un cambio quindi deve fare le stesse cose
// ma non deve fermare il gps ne activity e deve mettere l'ultima posizione trovata in route cosi so che inizio e fine sono identiche quindi è un unica tratta

// data eventuali dati passata dallo stop
export function stop(typeStop = 0, data) {
  return function (dispatch, getState) {
    // clearInterval(stillNotification.clear());

    // prima stoppo il servizio di geolocalizzazione
    if (!typeStop) {
      is_user_still_timer = null;

      BackgroundGeolocation.checkStatus(({ isRunning, authorization }) => {
        if (isRunning) {
          console.log("stop");
          BackgroundGeolocation.stop();

          // stop
          console.log("controllo stop activity");
          console.log(this.unsubscribe);
          if (this.unsubscribe) {
            console.log("stop activity");
            this.unsubscribe();
            ActivityRecognition.stop();
          }

          // forse non conviene togliere i listeners
          BackgroundGeolocation.events.forEach(event => {
            BackgroundGeolocation.removeAllListeners(event);
          });

          // oppure BackgroundGeolocation.removeAllListeners();
        }
      });

      BackgroundFetch.stop(
        () => { },
        error => {
          dispatch({
            type: STILL_NOTIFICATION_LOG,
            payload:
              "[js] RNBackgroundFetch failed to stop " + JSON.stringify(error)
          });
        }
      );
    }

    // cancella tutti i dati sulla tratta analizzata e le salvo in PreviousRoute cosi posso avviare un nuova tratta
    // nuova tratta separata senza typeStop
    // altrimenti un change
    if (!typeStop) {
      // dispatch({
      //   type: STOP_LOCATION
      // });

      deleteTimeStartData();
      console.log("cancello time");

      // dopo aver spostato i dati li eloboro con resumeRoute
      Promise.all([
        dispatch({
          type: STOP_LOCATION
        })
      ]).then(() => {
        console.log("finito di spostare");
        dispatch(resumeRoute());
      });
      console.log("ancora devo spostare");

      // faccio l'analisi un po dopo, cosi ho i dati sicuramente pronti e l'app non si blocca quando premo stop
      // su android do un po piu di tempo
      // setTimeout(
      //   () => {
      //     dispatch(resumeRoute());
      //   },
      //   Platform.OS == "android" ? 500 : 0
      // );
    } else {
      dispatch({
        type: CHANGE_ACTIVITY,
        activityChoice: data,
        routeSaved: getState().login.Route
      });
    }

    // in caso devo richiedere il meteo se rinizio o faccio switch
    getWeather = false;
    // tolgo il valore di inizio della tratta dalla memoria
  };
}

async function deleteTimeStartData() {
  try {
    await AsyncStorage.setItem("time", "");
  } catch (error) {
    // Error saving data
  }
}

// ritorna il numero di volte in cui un elemento è presente nell'array
function counterNumberValue(arr) {
  var a = [],
    b = [],
    prev;

  arr.sort();
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== prev) {
      a.push(arr[i]);
      b.push(1);
    } else {
      b[b.length - 1]++;
    }
    prev = arr[i];
  }

  return [a, b];
}

// completa la validazione dell'intera tratta
// LastRoute, indice della tratta completata
// typeStop, per dire se completo l'attivita e sto facendo un altra quindi non devo inviare se è 1
// paramCallback, parametri da chiamare insieme alla callback
// callback, funzione da chiamare dopo l'invio della tratta o validazione

export function CompleteActivity(
  LastRoute,
  typeStop = 0,
  paramCallback,
  callback
) {
  return function (dispatch, getState) {
    // validazione finale
    const {
      totPoints,
      activity,
      activityAnalyzed,
      activityChoice,
      numValidRoute,
      PrecDistanceSameMode,
      routeAnalyzed,
      route,
      Saved,
      typeWeather,
      time_travelled,
      modal_type
    } = getState().tracking.PreviousRoute[LastRoute - 1];
    // la distanza potrebbe essere modificata, sopratutto nel caso della metro
    let { totDistance } = getState().tracking.PreviousRoute[LastRoute - 1];
    const { numDay } = getState().login.NumDaysRoute;

    // prendo anche le info dell'utente utili per l'altezza ecc
    const infoProfile = {
      ...getState().login.infoProfile,
      ...getState().login.infoProfileNotSave
    };
    

    // avvio la validazione dopo un po
    if (!Saved && !modal_type) {
      // copio i punti cosi li posso modificare in futuro
      let totPointsValid = totPoints;

      // in caso diversi controlli a seconda il mezzo
      const NumRoute = routeAnalyzed.length;

      // variabile per dire se la tratta è valida o no con l'attivita scelta
      let validated = false;

      let counterMatch = 0;
      // controllo se è valido il trasporto

      // c'e se ci sono match e l'ultimo match ha match con una linea degli mezzi trovata prima
      // indexOf(-1) da -1 se non non c'e -1 ovvero nessuno match
      if (activityChoice.type === "Public") {
        // vedo se è in treno, bus o metro
        let coef = activityChoice.coef;

        // se è fundao do i punti in automatico
        let city = 0
        try {
          city = infoProfile.city.id
        } catch {
          city = 0
        }
        console.log(city)

        


        // bus e train lavora nella parte conclusiva alla stessa maniera
        // analizzo nel caso della metro
        // per la città di fundao considero tutte le tratte valide 
        // 1165
        if (city == 1165) {
          const totPointsNew = pointActivityAnalyzed(
            [...activity, ...activityAnalyzed],
            0,
            totDistance,
            activityChoice,
            PrecDistanceSameMode,
            0
          );
          // se non valida ovvero totPointsNew = 0, totPointsValid non lo aggiorno
          if (totPointsNew !== 0) {
            totPointsValid = totPointsNew;
            validated = true;
          }
        } else if (coef === 1200) {
          // se ho solo un riferimento per le linee allora ancora devo fare
          const { refTrasportRoute } = getState().tracking.PreviousRoute[
            LastRoute - 1
          ];

          if (refTrasportRoute.length === 1) {
            // prendo gli ultimi 4 punti e vedo se c'e una linea dell'autobus
            const lastRouteEnd = [...routeAnalyzed, ...route].slice(0, 4);
            dispatch(
              requestTrasportRouteDedicatedFinal(
                lastRouteEnd,
                LastRoute,
                infoProfile,
                coef,
                typeStop,
                paramCallback,
                callback
              )
            );
            return true;
            console.log("bravo");
          } else {
            if (
              refTrasportRoute.length > 1
                ? refTrasportRoute[refTrasportRoute.length - 1].length &&
                refTrasportRoute[refTrasportRoute.length - 2].length
                : refTrasportRoute[refTrasportRoute.length - 1].length
            ) {
              // per la metro calcolo la distanza tra il primo e l'ultimo punto
              const routeComplete = [...routeAnalyzed, ...route];
              const firstPoint = routeComplete[0];
              const lastPoint = routeComplete[routeComplete.length - 1];
              totDistance = parseFloat(
                haversine(
                  firstPoint.latitude,
                  firstPoint.longitude,
                  lastPoint.latitude,
                  lastPoint.longitude
                )
              );
              const totPointsNew = pointActivityAnalyzed(
                [...activity, ...activityAnalyzed],
                0,
                totDistance,
                activityChoice,
                PrecDistanceSameMode,
                0
              );
              // se non valida ovvero totPointsNew = 0, totPointsValid non lo aggiorno
              if (totPointsNew !== 0) {
                totPointsValid = totPointsNew;
                validated = true;
              }
            }
          }
        } else {
          // se ho match uso i match per validare
          if (numValidRoute.length > 0) {
            // check suglu ultimi due segmenti per dire che ti sei fermato in una linea
            // se ho un solo match, uso soltanto questo
            if (
              numValidRoute.length > 1
                ? numValidRoute[numValidRoute.length - 1].indexOf(-1) === -1 ||
                numValidRoute[numValidRoute.length - 2].indexOf(-1) === -1
                : numValidRoute[numValidRoute.length - 1].indexOf(-1) === -1
            ) {
              // unisce tutte le linee mezzo che hanno fatto match
              MatchLinea = numValidRoute.reduce((total, linea) => {
                return [...total, ...linea];
              }, []);

              console.log(MatchLinea);
              console.log(MatchLinea.sort());
              counterMatch = counterNumberValue(MatchLinea);
              console.log(counterMatch);
              let unmatch = 0;
              let maxMatch = 0;
              // controllo se il primo nella lista è -1
              if (counterMatch[0][0] === -1) {
                unmatch = counterMatch[1][0];
                // tolgo il primo elemento perche è -1
                // prenda la massima occorenza per gli altri valori
                let match = counterMatch[1].slice(1);
                match.sort();
                maxMatch = match[match.length - 1];
              } else {
                // - 1 non c'e quindi prendo direttamente
                let match = counterMatch[1];
                match.sort();
                maxMatch = match[match.length - 1];
              }
              console.log(unmatch);
              console.log(maxMatch);

              if (maxMatch >= unmatch) {
                // calcolare i nuovi punti considerando l'intera tratta valida
                // usare in caso un altra metrica con un altra funzione simile
                const totPointsNew = pointActivityAnalyzed(
                  [...activity, ...activityAnalyzed],
                  0,
                  totDistance,
                  activityChoice,
                  PrecDistanceSameMode,
                  0
                );
                // se non valida ovvero totPointsNew = 0, totPointsValid non lo aggiorno
                if (totPointsNew !== 0) {
                  totPointsValid = totPointsNew;
                  validated = true;
                }
              }

              /* Alert.alert(
        "Punti totali " +
          totPointsValid.toFixed(0) +
          " Distanza totale " +
          totDistance.toFixed(3) +
          " Kilometri" +
          " Attivita: " +
          activityChoice.type
          ); */
            }
          } else if (totPoints) {
            // anche se non ho avuto match, almeno ho delle linee di riferimento iniziali, quindi do quei pochi punti relativi alla fase iniziale
            // valido
            validated = true;
          }
        }
      }

      // confronto tra il numero di tratte totali e quelle valide trovate per i mezzi
      // 0.4 diviso 4 perche numValidRoute da 1 o 0 ogni 4 punti
      // && numValidRoute / NumRoute >= 0.4 / 4)
      else if (activityChoice.type !== "Public") {
        // calcolare i nuovi punti considerando l'intera tratta valida
        // usare in caso un altra metrica con un altra funzione simile
        const totPointsNew = pointActivityAnalyzed(
          [...activity, ...activityAnalyzed],
          0,
          totDistance,
          activityChoice,
          PrecDistanceSameMode,
          Platform.OS == "android" ? 0.5 : 0.35,
          routeAnalyzed
        );
        // se non valida ovvero totPointsNew = 0, totPointsValid non lo aggiorno
        if (totPointsNew !== 0) {
          // totPointsValid = totPointsNew; la soglia finale la uso solo per dire se l'intera tratta è valida o no
          validated = true;
        }

        /* 
        Alert.alert(
        "Punti totali " +
          totPointsValid.toFixed(0) +
          " Distanza totale " +
          totDistance.toFixed(3) +
          " Kilometri" +
          " Attivita: " +
          activityChoice.type
        ); 
        */
      }

      const timeStart = routeAnalyzed[0].time;
      // calcolo calorie mediante peso, altezza, tipo attivita e distanza
      const duration = Math.round(
        ((time_travelled % 86400000) % 3600000) / 60000
      ); // conversione in minuti

      // prendo la velocita media
      // sommo le velocita
      // let speed = [...routeAnalyzed, ...route].reduce(
      //   (total, elem, index, array) => {
      //     return total + elem.speed;
      //   },
      //   0
      // );

      // // medio
      // speed = speed / [...routeAnalyzed, ...route].length;

      // peso e altezza default
      let weight = 74;
      let height = 1.7;
      try {
        // se è donna
        if (infoProfile.gender === 2) {
          weight = 59;
          height = 1.63;
        }
        weight = infoProfile.weight ? infoProfile.weight : weight;
        // divido per 100 per convertire da centimetri in metri
        height = infoProfile.height ? infoProfile.height / 100 : height;
      } catch (error) {
        console.log("dati non presenti in infoProfile");
      }

      // non sono più speed e height
      let calories = getCalories(weight, duration, activityChoice.type);

      // eventuali bonus da dare alle tratte per le serie
      let bonus = 1.0;
      // parametri bonus per il backend
      let weather_type = 0
      let weather_points = 0
      let peak_hours_points = 0
      let day_series = 0
      let day_series_points = 0

      // prendo il meteo
      const typeWeatherBonus = convertWeather(typeWeather);
      // 5% per il meteo
      bonus += 0.05 * typeWeatherBonus;
      weather_type = getIdWeatherType(typeWeather);
      weather_points = parseInt(0.05 * typeWeatherBonus * totPointsValid)
      // per la serie
      if (numDay) {
        bonus += 0.05 * numDay;
        day_series = numDay
        day_series_points = parseInt(0.05 * numDay * totPointsValid)
      }

      // orario di punta

      const start = Date.parse(new Date(timeStart));
      let hour = new Date(start).toTimeString();
      hour = hour.substring(0, 5);
      console.log("ora");
      console.log(hour);
      // ottengo 11:30

      let hoursTraffic = false;
      if (hour >= "07:30" && hour <= "09:00") {
        hoursTraffic = true;

      } else if (hour >= "17:00" && hour <= "18:30") {
        hoursTraffic = true;
      }

      bonus += 0.1 * hoursTraffic;
      peak_hours_points = parseInt(0.1 * hoursTraffic * totPointsValid)
      console.log("bonus aggiuntivo");
      console.log(bonus);

      // qui aggiungo eventuali nuovi bonus ottenuti con lo special trainining 
      // controllo se uno dei special trainings completati o/e riscattati ha un id specifico

      // ogni id interessato ha anche un parametro bonus per sapere quanto devo assegnare 
      // virtualReward = checkVirtualReward(special_training_sessions_completed)
      // if (virtualReward.bonus) {
      // bonus += virtualReward.bonus;
      // }


      // aggiorno le informazioni sulla tratta precedente

      // anche la distanza perche sono ricalcolarla per la metro
      const info = {
        totPoints: totPointsValid * bonus,
        modal_type: activityChoice.type,
        validated,
        calories,
        totDistance,
        weather_type,
        weather_points,
        peak_hours_points,
        day_series,
        day_series_points
      };
      // salvo queste modifiche alla tratta cosi è anche pronta per essere salvata nel database
      dispatch(UpdatePreviousRoute(info, LastRoute));

      setTimeout(
        () => {
          let {
            PreviousRoute,
            route: routeNow,
            routeAnalyzed: routeAnalyzedNow
          } = getState().tracking;
          console.log([
            ...PreviousRoute,
            {
              route: routeNow,
              routeAnalyzed: routeAnalyzedNow
            }
          ]);
          console.log(LastRoute);

          // vedo se è l'ultimo segment della tratta
          // se route e routeAnalyzedNow non esistono allora metto niente
          let NumSegment = 0;
          if (routeNow.length || routeAnalyzedNow.length) {
            console.log("c'e route");
            NumSegment = sumRoute(
              [
                ...PreviousRoute,
                {
                  route: routeNow,
                  routeAnalyzed: routeAnalyzedNow
                }
              ],
              LastRoute,
              true,
              true
            );
          } else {
            console.log("non c'e route ");
            NumSegment = sumRoute(PreviousRoute, LastRoute, true, true);
          }
          console.log(
            "quante segment ci sono da controllate prima di mandare "
          );
          console.log(NumSegment);
          console.log("Tipo di stop" + typeStop);

          // se non ci sono segment successivi allora è l'ultimo segment e la route è conclusa quindi posso mandare
          // vedo anche se ho fatto stop oppure cambio
          if (!NumSegment && typeStop === 0) {
            console.log("ultimo segment");
            dispatch(sendRoute(LastRoute, paramCallback, callback));
          } else {
            // salvata o no nel db, continuo con le validazioni successive con la callback
            if (callback && typeof callback === "function") {
              console.log("callback di resume ");
              dispatch(callback(paramCallback));
            }
          }

          /* // salva le info generiche della tratta nel profilo utente
          dispatch({
            type: COMPLETE_ROUTE,
            totPointsValid,
            totDistance
          }); */
        },
        Platform.OS === "android" ? 300 : 0
      );
    }
  };
}

// se avvia l'app la prima volta e si hanno delle coordinate dalla attivita precedente
// limitMax, dice quante route precedenti devo validare al massimo, utile per non validare tratte nuove che sto facendo in questo momento
export function resumeRoute(limitMax, typeStop = 0) {
  console.log("rianalisi");

  return function (dispatch, getState) {
    // prendo tutte le tratte precedenti e provo a validare quelle non validate
    const PreviousRoute = getState().tracking.PreviousRoute;
    let Routes = PreviousRoute.length;

    if (limitMax) {
      // cosi non controllo di piu, e non supero l'array
      Routes = limitMax < Routes ? limitMax : Routes;
    }

    console.log("previous route : " + Routes);
    // analizzo le tratte in un verso e nell'altro in modo random in modo tale che se una route si blocca per qualche motivo, analizzo l'ultima effettuata e non la prima
    // const directionValidationRoute = getRandomIntInclusive(0, 1);
    // if (directionValidationRoute) {

    // mi conviene analizzare le tratte da quella piu antica cosi so che l'ultima tratta è quella senza segmento ed devo ancora completarla quindi la posso usare
    // come riferimento per creare le tratte multiple
    if (1) {
      for (routeId = 1; routeId <= Routes; routeId++) {
        console.log("tratta analizzata " + routeId);
        const NumRoute = PreviousRoute[routeId - 1].route.length;

        // vedo se è gia stata salvata cosi la salto
        const Saved = PreviousRoute[routeId - 1].Saved;

        // se delle tratta ancora non validate o se è stata salvata

        if (NumRoute > 1 && !Saved) {
          console.log("validazione finale in corso");

          // elabora ultima tratta salvata, che era quella la tratta corrente prima
          dispatch(updateCordinate(routeId));
          console.log(routeId);
          // copio cosi anche se routeId aumenta, index è il valore precedente
          const index = routeId;

          // eventuale parametro per non bloccare la validazione in validation
          let indexResetValidation = 0;

          // prima di riniziare a validare tolgo l'eventuale validazione precedente
          dispatch(UpdateStatus("", index));

          // vedo il tipo d'attivita che sto validando cosi imposto il timer in modo differente essendo che public fa chiamata http

          // 300 ms vanno bene per l'analisi non dei mezzi
          // in public per le richieste https per le tratte aspetto 2 sec prima di riprovare
          // se ho le linee o ho gia provato allora scendo a 500 millisec il tempo, sufficiente per le intersezioni
          const timer =
            PreviousRoute[routeId - 1].activityChoice.type === "Public"
              ? getState().tracking.PreviousRoute[routeId - 1].refTrasportRoute
                .length < 3
                ? 4000
                : 1000
              : 500;

          // imposto un timer che si ripete se ci sono piu coordinate, ovvero se ci sono 20 coordinate
          // vengono valutate 10 alla volta quindi si ripete per due volte

          LastValidResume = setInterval(() => {
            const PreviousRoute = getState().tracking.PreviousRoute;
            // valido eventuale tratta ancora non analizzata prima di fare una validazione complessiva
            console.log(index);
            // se l'utente fa il logout e il dato viene cancellato, cancello il timeout
            if (PreviousRoute.length ? false : true) {
              clearTimeout(LastValidResume);
            } else {
              const currentRoute = PreviousRoute[index - 1]
                ? PreviousRoute[index - 1]
                : false;
              if (currentRoute) {
                console.log(currentRoute);
                const locationLength = currentRoute.route.length;
                // controllo se gia sto validando cosi non controllo
                const validation = currentRoute.status;

                const typeActivity = currentRoute.activityChoice.type;
                // dal modal type capisco se è stata completata
                const modal_type = currentRoute.activityChoice.modal_type;

                // controllo lo stato della linea prima di fare la validazione ogni volta con il timeout
                const { isConnected } = getState().connection;
                // se ho connessione
                if (isConnected || typeActivity !== "Public") {
                  // se ho almeno due posizioni deve validare
                  if (validation !== "validation" && locationLength > 1) {
                    // aggiorno le coordinate trovate mediante la validazione
                    console.log(
                      "validazione perche mancano ancora punti da validare"
                    );

                    dispatch(updateCordinate(index));
                  } else if (validation === "validation") {
                    // aspetto dato che sta ancora validando
                    // eventuale parametro per non bloccare la validazione in validation

                    console.log(indexResetValidation);
                    indexResetValidation = indexResetValidation + 1;
                    if (indexResetValidation > 10) {
                      dispatch(UpdateStatus("", index));
                      indexResetValidation = 0;
                    }
                  } else if (!modal_type) {
                    // non ci sono piu locazioni d'analizzare
                    // devo ancora validare
                    // validazione finale

                    dispatch(
                      CompleteActivity(index, typeStop, Routes, resumeRoute)
                    );
                    clearTimeout(LastValidResume);
                  } else {
                    // è gia stata validata completamente devo solo inviarla
                    clearTimeout(LastValidResume);
                    dispatch(resumeRoute(Routes, typeStop));
                  }
                } else {
                  // se non ho connesione cancello il Timeout e riprendero successivamente quando avro internet
                  clearTimeout(LastValidResume);
                }
              } else {
                clearTimeout(LastValidResume);
              }
            }
          }, timer);
          // stoppo la validazione di future tratte successive perche prima deve finire questa
          // fermando il for
          break;
        } else if (!Saved) {
          console.log("non ce validazione ");
          // non fare niente poiche è stata gia validata
          // vedo se e stato completamente validata o no
          if (!getState().tracking.PreviousRoute[routeId - 1].modal_type) {
            console.log("validazione completa ");

            dispatch(CompleteActivity(routeId, typeStop, Routes, resumeRoute));
            // stoppo la validazione di future tratte successive perche prima deve finire questa
            // fermando il for
            break;
          } else if (
            !getState().tracking.PreviousRoute[routeId - 1].Saved &&
            !getState().tracking.PreviousRoute[routeId - 1].isSegment
          ) {
            console.log("invio ");

            // e ovviamente deve essere salvata nel db se non è salvata
            // prima di rimandare, tolgo l'eventuale send se in caso non è stata inviata
            // l'aggiornamneto dello status lo faccic nella send se ancora non ho inviato dopo 2000 ms
            // dispatch(UpdateStatus("", routeId));
            dispatch(sendRoute(routeId, Routes, resumeRoute));
            break;
          }
          // altrimenti è gia stata completamente validata e salvata quindi non bisogna fare qualcosa
        }
        // controllo la successiva
      }
    } else {
      for (routeId = Routes; routeId > 0; routeId--) {
        console.log("tratta analizzata " + routeId);
        const NumRoute = PreviousRoute[routeId - 1].route.length;

        // vedo se è gia stata salvata cosi la salto
        const Saved = PreviousRoute[routeId - 1].Saved;

        // se delle tratta ancora non validate o se è stata salvata

        if (NumRoute > 1 && !Saved) {
          console.log("validazione finale in corso");

          // elabora ultima tratta salvata, che era quella la tratta corrente prima
          dispatch(updateCordinate(routeId));
          console.log(routeId);
          // copio cosi anche se routeId aumenta, index è il valore precedente
          const index = routeId;

          // eventuale parametro per non bloccare la validazione in validation
          let indexResetValidation = 0;

          // prima di riniziare a validare tolgo l'eventuale validazione precedente
          dispatch(UpdateStatus("", index));

          // vedo il tipo d'attivita che sto validando cosi imposto il timer in modo differente essendo che public fa chiamata http

          // 300 ms vanno bene per l'analisi non dei mezzi
          // in public per le richieste https per le tratte aspetto 2 sec prima di riprovare
          // se ho le linee o ho gia provato allora scendo a 500 millisec il tempo, sufficiente per le intersezioni
          const timer =
            PreviousRoute[routeId - 1].activityChoice.type === "Public"
              ? getState().tracking.PreviousRoute[routeId - 1].refTrasportRoute
                .length < 3
                ? 4000
                : 1000
              : 500;

          // imposto un timer che si ripete se ci sono piu coordinate, ovvero se ci sono 20 coordinate
          // vengono valutate 10 alla volta quindi si ripete per due volte

          LastValidResume = setInterval(() => {
            const PreviousRoute = getState().tracking.PreviousRoute;
            // valido eventuale tratta ancora non analizzata prima di fare una validazione complessiva
            console.log(index);
            // se l'utente fa il logout e il dato viene cancellato, cancello il timeout
            if (PreviousRoute.length ? false : true) {
              clearTimeout(LastValidResume);
            } else {
              const currentRoute = PreviousRoute[index - 1]
                ? PreviousRoute[index - 1]
                : false;
              if (currentRoute) {
                console.log(currentRoute);
                const locationLength = currentRoute.route.length;
                // controllo se gia sto validando cosi non controllo
                const validation = currentRoute.status;

                const typeActivity = currentRoute.activityChoice.type;
                // dal modal type capisco se è stata completata
                const modal_type = currentRoute.activityChoice.modal_type;

                // controllo lo stato della linea prima di fare la validazione ogni volta con il timeout
                const { isConnected } = getState().connection;
                // se ho connessione
                if (isConnected || typeActivity !== "Public") {
                  // se ho almeno due posizioni deve validare
                  if (validation !== "validation" && locationLength > 1) {
                    // aggiorno le coordinate trovate mediante la validazione
                    console.log(
                      "validazione perche mancano ancora punti da validare"
                    );

                    dispatch(updateCordinate(index));
                  } else if (validation === "validation") {
                    // aspetto dato che sta ancora validando
                    // eventuale parametro per non bloccare la validazione in validation

                    console.log(indexResetValidation);
                    indexResetValidation = indexResetValidation + 1;
                    if (indexResetValidation > 10) {
                      dispatch(UpdateStatus("", index));
                      indexResetValidation = 0;
                    }
                  } else if (!modal_type) {
                    // non ci sono piu locazioni d'analizzare
                    // devo ancora validare
                    // validazione finale

                    dispatch(
                      CompleteActivity(index, typeStop, Routes, resumeRoute)
                    );
                    clearTimeout(LastValidResume);
                  } else {
                    // è gia stata validata completamente devo solo inviarla
                    clearTimeout(LastValidResume);
                    dispatch(resumeRoute(Routes, typeStop));
                  }
                } else {
                  // se non ho connesione cancello il Timeout e riprendero successivamente quando avro internet
                  clearTimeout(LastValidResume);
                }
              } else {
                clearTimeout(LastValidResume);
              }
            }
          }, timer);
          // stoppo la validazione di future tratte successive perche prima deve finire questa
          // fermando il for
          break;
        } else if (!Saved) {
          console.log("non ce validazione ");
          // non fare niente poiche è stata gia validata
          // vedo se e stato completamente validata o no
          if (!getState().tracking.PreviousRoute[routeId - 1].modal_type) {
            console.log("validazione completa ");

            dispatch(CompleteActivity(routeId, typeStop, Routes, resumeRoute));
            // stoppo la validazione di future tratte successive perche prima deve finire questa
            // fermando il for
            break;
          } else if (
            !getState().tracking.PreviousRoute[routeId - 1].Saved &&
            !getState().tracking.PreviousRoute[routeId - 1].isSegment
          ) {
            console.log("invio ");

            // e ovviamente deve essere salvata nel db se non è salvata
            // prima di rimandare, tolgo l'eventuale send se in caso non è stata inviata
            // l'aggiornamneto dello status lo faccic nella send se ancora non ho inviato dopo 2000 ms
            // dispatch(UpdateStatus("", routeId));
            dispatch(sendRoute(routeId, Routes, resumeRoute));
            break;
          }
          // altrimenti è gia stata completamente validata e salvata quindi non bisogna fare qualcosa
        }
        // controllo la successiva
      }
    }
    // se ho controllato tutto cancello
    dispatch(ResetPreviousRoute());
  };
}

export function UpdatePreviousRoute(info, index) {
  // per aggiornare una tratta precedente e assegnare eventuali nuovi punti
  // se è valida con l'attivita scelta
  // se è coerente con qualche routine
  return {
    type: UPDATE_PREVIOUS_ROUTE,
    info,
    index
  };
}

export function UpdateStatus(status, index) {
  // per aggiornare lo status tipo dire sto validando
  // con index posso specificare se cambiare lo stato di una tratta precedente
  // cosi se avvio la validazione, non posso fare altre validazione nel mentre
  return {
    type: UPDATE_STATUS,
    status,
    index
  };
}

export function addDailyRoutine(route) {
  return {
    type: ADD_DAILY_ROUTINE,
    route
  };
}

// funzione per generare valori random tra min e max
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Il max è incluso e il min è incluso
}

// funzione che ritorna se l'attivita è coerente con l'attivita scelta
function FinalValidateAnalyzed(activity, activityChoice) {
  // ho 0 punti
  let points = 0;
  // tolgo i dati delle attivita trascurabili come UNKNOWN o STILL, considerando sia ios che android
  // tolgo questo valore e metto come valore piu probabile il secondo tipo walking 40
  // ovviamente il secondo potrebbe essere anche still quindi lo tolgo anche
  // doppio controllo, prima di controllare il secondo valore controllo se c'e

  const CleanActivity = activity.filter(value =>
    value.activity[0].type !== "UNKNOWN" &&
      value.activity[0].type !== "STATIONARY" &&
      value.activity[0].type !== "STILL" &&
      value.activity[0].type !== "TILTING"
      ? value
      : value.activity[1]
        ? value.activity[1].type !== "UNKNOWN" &&
          value.activity[1].type !== "STATIONARY" &&
          value.activity[1].type !== "STILL" &&
          value.activity[1].type !== "TILTING"
          ? value.activity.splice(0, 1)
          : value.activity.splice(0, 2)
        : null
  );
  const lengthActivity = CleanActivity.length;
  console.log(CleanActivity);
  // se c'e attivita non sconosciuta
  if (lengthActivity > 0) {
    console.log("attivita");
    // vedo quanti di questi sono d'accordo con la mia attivita
    let myActivity = 0;
    switch (activityChoice.type) {
      case "Biking":
        {
          // la confronto con l'attivita scelta
          for (i = 0; i < lengthActivity; i++) {
            console.log(CleanActivity[i].activity[0]);

            CleanActivity[i].activity[0].type === "ON_BICYCLE" ||
              CleanActivity[i].activity[0].type === "CYCLING"
              ? ++myActivity
              : myActivity;
          }
        }
        break;
      case "Walking":
        {
          // la confronto con l'attivita scelta
          for (i = 0; i < lengthActivity; i++) {
            console.log(CleanActivity[i].activity[0]);

            CleanActivity[i].activity[0].type === "ON_FOOT" ||
              CleanActivity[i].activity[0].type === "RUNNING" ||
              CleanActivity[i].activity[0].type === "WALKING"
              ? ++myActivity
              : myActivity;
          }
        }
        break;
      // anche nel caso del tram, treno o autobus, vedere se c'e stata attivita come l'auto
      case "auto":
      case "Public":
        {
          // la confronto con l'attivita scelta
          for (i = 0; i < lengthActivity; i++) {
            console.log(CleanActivity[i].activity[0]);

            CleanActivity[i].activity[0].type === "IN_VEHICLE" ||
              CleanActivity[i].activity[0].type === "AUTOMOTIVE"
              ? ++myActivity
              : myActivity;
          }
        }
        break;
      default:
        {
          return points;
        }
        break;
    }
    console.log(myActivity);
    // se la mia attivita copre il 70% del totale allora accredito i punti
    // soglia per le attivita quali a piedi, auto, bici
    let ThresholdActivity = 0.3;

    // soglia differente per altri mezzi tipo tipo bus
    switch (activityChoice.type) {
      case "Public":
        {
          ThresholdActivity = 0.3;
        }
        break;
    }

    if (myActivity / lengthActivity >= ThresholdActivity) {
      // allora è valida l'attivita

      return true;
    }
    return false;
  }

  return false;
}



// calcolo delle calorie che tiene anche della velocità e altezza
/* export function getCalories(pounds, minutes, exercise, speed, height) {
  // parametro se stai guardando la tv
  let level = 0.008;

  // devo fare un check sulla velocita dato che puo avere il valore -1 ovvero non è disponibile

  if (exercise == "Biking") {
    level = 0.048;
  } else if (exercise == "Walking") {
    level = 0.035;
  } else if (exercise == "Public") {
    // se cammina molto lentamente
    level = 0.026;
    // oppure uso un valore intermedio tra guardare la tv e camminare lentamente
  }

  // se non abbiamo altre info la calcoliamo cosi

  let aux_calories = pounds * 2.2 * minutes * level;
  // formula piu dettagliata
  //  (0.035 * body weight in kg) + ((Velocity in m/s ^ 2) / Height in m)) * (0.029) * (body weight in kg)
  // se ho l'altezza e velocita media

  // speed  Number  Speed if it is available, in meters/second over ground.
  aux_calories =
    (level * pounds + ((speed ^ 2) / height) * 0.029 * pounds) * minutes;

  // Women: BMR = 655 + (9.6 x weight in kg) + (1.8 x height in cm) - (4.7 x age in years)

  // Men: BMR = 66 + (13.7 x weight in kg) + (5 x height in cm) - (6.8 x age in years)

  aux_calories = Math.round(aux_calories * 10) / 10;

  if (aux_calories < 0) {
    // se negativo lo faccio diventare positivo
    aux_calories = Math.abs(aux_calories);
  }

  return aux_calories;
} */



export function ResetPreviousRoute() {
  console.log("cancello tutto");

  return function (dispatch, getState) {
    // prendo tutte le tratte precedenti e vedo se sono state tutte inviate e validate

    const PreviousRoute = getState().tracking.PreviousRoute;
    const numLengthRoute = PreviousRoute.length ? PreviousRoute.length : 0;

    for (route = 1; route <= numLengthRoute; route++) {
      const NumRoute = PreviousRoute[route - 1];

      // se delle tratta ancora non salvate nel db,

      if (!NumRoute.Saved) {
        break;
      } else if (route === numLengthRoute && NumRoute.Saved) {
        // tutte sono state mandate al server, posso cancellare tutte le previuos route
        console.log("tutte salvate");
        dispatch({
          type: RESET_PREVIOUS_ROUTE
        });
      }
    }
  };
}

// per mandare una specifica route al backend
export function sendRoute(LastRoute, paramCallback, callback) {
  return function (dispatch, getState) {
    // se non ci sono tracce da mandare
    // se ci sono vado avanti

    // prendo le freuqent route per poi confrontarle con la trip effettuata
    // dispatch(getMostFrequentRoute());
    // dopo tre secondi manda la route
    setTimeout(
      () => {
        console.log("provo a mandare");
        console.log(LastRoute);
        console.log(paramCallback);
        console.log(callback);

        const { PreviousRoute } = getState().tracking;

        if (PreviousRoute.length > 0) {
          // controllo eventuali sotto tracce valide in una route
          console.log("prima");
          let NumSegment = sumRoute(PreviousRoute, LastRoute, false, false);
          console.log("dopo");
          // se 1 gia ho due sottotrace
          console.log("sottotrace : " + (NumSegment + 1));

          // vedo anche quelle ancora non validate completamente
          console.log("prima 2");
          let NumSegmentNotValid = sumRoute(
            PreviousRoute,
            LastRoute,
            true,
            false
          );
          console.log("dopo 2");

          // se 1 gia ho due sottotrace
          console.log(
            "sottotrace anche non valide : " + (NumSegmentNotValid + 1)
          );

          // se il numero di quelle valide e uguale a quelle non valide allora tutte le sottotracce sono state validate
          // posso mandare
          // altrimenti dovrei validare i segment precedenti
          if (NumSegmentNotValid === NumSegment) {
            // invio al server
            // riunisco per ogni sottotraccia

            // postData dati che comprendono tutte le sottotrace
            let postData = [];
            // salvo i punti iniziale e finale cosi poi li uso per calcolare la routine
            let start_point_now = {};
            let end_point_now = {};

            let typeWeatherStart = "";

            // bonus da mandare
            let weather_type_final = 0
            let weather_points_final = 0
            let peak_hours_points_final = 0
            let day_series_final = 0
            let day_series_points_final = 0

            for (i = LastRoute - NumSegmentNotValid; i <= LastRoute; i++) {
              const {
                totPoints,
                totDistance,
                activityChoice,
                numValidRoute,
                PrecDistanceSameMode,
                routeAnalyzed,
                route,
                modal_type,
                validated,
                calories,
                time_travelled,
                typeWeather,
                weather_type,
                weather_points,
                peak_hours_points,
                day_series,
                day_series_points,
              } = PreviousRoute[i - 1];

              // prendo i dati di una tratta
              const Segment = [...routeAnalyzed, ...route];

              // prendo il punto iniziale e finale a seconda se è la prima o ultima sottotraccia
              if (i === LastRoute - NumSegmentNotValid) {
                start_point_now = Segment[0];
                typeWeatherStart = typeWeather;
              }
              if (i === LastRoute) {
                end_point_now = Segment[Segment.length - 1];
              }

              // creo la linestring da log, lat, alt
              // da routeAnalyzed e route

              const triple = Segment.map(elem => [
                elem.longitude,
                elem.latitude,
                elem.altitude ? elem.altitude : 0
              ]);

              const geojson = {
                coordinates: triple,
                type: "LineString"
              };
              const linestring = parse.stringify(geojson);
              console.log(linestring);

              // l'id di routine iniziale di riferimento è null
              req_route_Id = null;

              // creo le info puntuali

              let route_positions_info = routeAnalyzed.map((elem, index) => {
                return {
                  pos_index: index,
                  time: parseInt(elem.key / 1000),
                  modality: elem.modality,
                  speed: elem.speed,
                  calories: parseInt(elem.calories)
                };
              });
              // aggiungo le info dell'ultimo punto
              // data dell'ultima posizione utile sapere quando il segmnet è concluso
              // da mettere in data
              end_time = new Date(route[0].key).toISOString();
              console.log("Segment concluso " + end_time);

              route_positions_info = [
                ...route_positions_info,
                {
                  modality:
                    route_positions_info[route_positions_info.length - 1]
                      .modality,
                  pos_index:
                    route_positions_info[route_positions_info.length - 1]
                      .pos_index + 1,
                  calories:
                    route_positions_info[route_positions_info.length - 1]
                      .calories,
                  time: parseInt(route[0].key / 1000),
                  speed: route[0].speed
                }
              ];

              // creo il pacchetto data
              // tronco alcuni dati
              // al momento non ci sono monete

              // time_travelled / 1000 per avere in secondi

              const data = {
                modal_type: getIdModalType(modal_type, activityChoice.coef),
                validated,
                distance_travelled: totDistance,
                calories: parseInt(calories),
                coins: 0,
                points: parseInt(totPoints.toFixed(0), 10),
                time_travelled: parseInt(time_travelled / 1000),
                route: linestring,
                route_positions_info,
                end_time
              };

              weather_type_final = weather_type ? weather_type > weather_type_final ? weather_type : weather_type_final : weather_type_final,
                weather_points_final += weather_points ? weather_points : 0
              peak_hours_points_final += peak_hours_points ? peak_hours_points : 0
              day_series_final = day_series ? day_series : 0
              day_series_points_final += day_series_points ? day_series_points : 0





              console.log(data);
              postData = [...postData, data];
            }

            // controllo se è stata una routine

            // se ci sono routine allora
            // prendo le routine cosi le uso per il controllo routine
            const IdRoutine = checkFrequentTrip(
              getState,
              start_point_now,
              end_point_now
            );


            // calcolo i dati di recap dati dalle sottotrace
            // se una sottotrace è valida, l'intera route è valida
            const recap = postData.reduce(
              (total, info, index, array) => {
                return {
                  validated: total.validated || info.validated,
                  distance_travelled:
                    total.distance_travelled + info.distance_travelled,
                  calories: total.calories + info.calories,
                  coins: total.coins + info.coins,
                  points: total.points + info.points,
                  time_travelled: total.time_travelled + info.time_travelled,
                };
              },
              {
                validated: false,
                distance_travelled: 0.0,
                calories: 0,
                coins: 0,
                points: 0,
                time_travelled: 0,
              }
            );


            // in recap manca il referred_most_freq_route_Id, che sara preso dall'ultima sottotrace oppure viene salvata in tutte le sottotrace

            postData = {
              ...recap, segment: postData, referred_most_freq_route: IdRoutine,
              weather_type: weather_type_final,
              weather_points: weather_points_final,
              peak_hours_points: peak_hours_points_final,
              day_series: day_series_final,
              day_series_points: day_series_points_final,
            };
            console.log(postData);
            console.log(JSON.stringify(postData));
            // dopo un secondo mando, ma prima controllo se soddisfa qualche condizione

            setTimeout(
              () => {
                dispatch(
                  checkSpecialTrainingEvent(
                    postData,
                    typeWeatherStart,
                    start_point_now,
                    end_point_now
                  )
                );

                // alert("check sui training");

                dispatch(
                  checkEventRedux(
                    postData,
                    typeWeatherStart,
                    paramCallback,
                    callback,
                    saveRouteBackend,
                    LastRoute - NumSegmentNotValid,
                    NumSegmentNotValid
                  )
                );
              },
              Platform.OS === "android" ? 300 : 0
            );
          } else {
            // validazione dei segmenti precedenti e poi di nuovo send poiche resumeroute poi chiama complete

            // salvata o no nel db, continuo con le validazioni successivve con la callback
            if (callback && typeof callback === "function") {
              console.log("callback di resume ");
              dispatch(callback(paramCallback));
            }
            if (NumSegmentNotValid > NumSegment) {
              dispatch(resumeRoute());
            }
          }
        }
      },
      Platform.OS === "android" ? 500 : 0
    );
  };
}

export function checkFrequentTrip(getState, start_point_now, end_point_now) {
  // se ci sono routine allora
  // prendo le routine cosi le uso per il controllo routine
  const { mostFrequentRoute } = getState().login;

  // soglia massima per considerarlo nella zona inziale e finale
  // in kilometri
  const ThresholdGPS = 0.25;
  // circa 150 metri
  console.log("Analizza routine");
  console.log(start_point_now);
  console.log(end_point_now);
  // variabile per dire il tipo di routine trovata e poi salvata nel recap
  let IdRoutine = null;

  // se ho analizzato qualcosa, ovvero la tratta non è stata breve, faccio la verifica
  // se ci sono anche delle routine

  // ma solo quando la tratta è veramente conclusa
  // quindi devo riunire i segment che compongono una route e poi fare il controllo
  // forse meglio in reducers

  if (mostFrequentRoute.length > 0) {
    for (routine = 0; routine < mostFrequentRoute.length; routine++) {
      console.log(mostFrequentRoute[routine]);
      // considero l'inizio e la fine, confrontandoli con il primo e l'ultimo e in caso scambio i punti
      const { start_point, end_point, id } = mostFrequentRoute[routine];
      const distanceStart = haversine(
        start_point_now.latitude,
        start_point_now.longitude,
        start_point.coordinates[1],
        start_point.coordinates[0]
      );
      const distanceEnd = haversine(
        end_point_now.latitude,
        end_point_now.longitude,
        end_point.coordinates[1],
        end_point.coordinates[0]
      );
      if (distanceStart <= ThresholdGPS && distanceEnd <= ThresholdGPS) {
        console.log("Routine trovata");
        // Alert.alert("found routine " + id);
        IdRoutine = id;
      } else {
        // controllo l'inizio con la fine e viceversa per i due punti
        const distanceStart2 = haversine(
          start_point_now.latitude,
          start_point_now.longitude,
          end_point.coordinates[1],
          end_point.coordinates[0]
        );
        const distanceEnd2 = haversine(
          end_point_now.latitude,
          end_point_now.longitude,
          start_point.coordinates[1],
          start_point.coordinates[0]
        );

        if (distanceStart2 <= ThresholdGPS && distanceEnd2 <= ThresholdGPS) {
          console.log("Routine trovata");
          // Alert.alert("found routine " + id);
          IdRoutine = id;
        }
      }
    }
  }
  return IdRoutine;
}

// ritorna il numero di sottotrace compongono una traccia, 0 una sola sottotraccia, 1 due sottotrace ecc
// route sono le sottotrace da controllare
// Position posizione da iniziare a controllare delle route passate, inizia da 1
// oppure la posizione da cui iniziare per controllare in avanti
// WithOutValidation, se false allora le sotto trace devono essere validate
// TimeCrescent, se il confronto se essere fatto partendo dal piu vecchio al piu giovane utile quando si sa la partenza
// con true indice la partenza , false la fine con posizione
export function sumRoute(route, Position, WithOutValidation, TimeCrescent) {
  // controllo eventuali sotto tracce in una route
  console.log(route);
  console.log(Position);

  let NumSegment = 0;

  if (!TimeCrescent) {
    // -1 perche considero anche quella successiva nell'analisi
    for (i = Position - 1; i >= 1; i--) {
      console.log(NumSegment);
      // devono essere validate prima di inviare quindi controllo se c'e modal_type in entrambe

      if (
        WithOutValidation ||
        (route[i - 1].modal_type && route[i].modal_type)
      ) {
        // l'ultima posizione di route1 si trova in route
        // la prima posizione di route2 si potrebbe trovare anche in route, oltre routeAnalyzed
        const route1 = route[i - 1].route[route[i - 1].route.length - 1];
        const route2 = route[i].route[0];
        const routeAnalyzed2 = route[i].routeAnalyzed[0];

        // se esiste l'inizio in route2 ed è stato analizzata
        // allora il primo punto si trova li
        /* console.log(route1);
        console.log(route2);
        console.log(routeAnalyzed2); */
        if (routeAnalyzed2) {
          // se non corrisponde allora è finita la route
          /* console.log(route1);
          console.log(routeAnalyzed2.key); */
          if (route1.key === routeAnalyzed2.key) {
            NumSegment = NumSegment + 1;
          } else {
            // concludo perche questa route non ha altre sotto route
            i = 0;
          }
        } else {
          if (route1.key === route2.key) {
            NumSegment = NumSegment + 1;
          } else {
            // concludo perche questa route non ha altre sotto route
            i = 0;
          }
        }
      } else {
        // concludo poiche ancora non è stata validata
        i = 0;
      }
    }
    return NumSegment;
  } else {
    const NumPreviousRoute = route.length;
    for (i = Position; i < NumPreviousRoute; i++) {
      // devono essere validate prima di inviare quindi controllo se c'e modal_type in entrambe

      if (
        WithOutValidation ||
        (route[i - 1].modal_type && route[i].modal_type)
      ) {
        // l'ultima posizione di route1 si trova in route
        // la prima posizione di route2 si potrebbe trovare anche in route, oltre routeAnalyzed
        const route1 = route[i - 1].route[route[i - 1].route.length - 1];
        const route2 = route[i].route[0];
        const routeAnalyzed2 = route[i].routeAnalyzed[0];

        // se esiste l'inizio in route2 ed è stato analizzata
        // allora il primo punto si trova li

        if (routeAnalyzed2) {
          // se non corrisponde allora è finita la route
          /* console.log(route1);
          console.log(routeAnalyzed2.key); */
          if (route1.key === routeAnalyzed2.key) {
            NumSegment = NumSegment + 1;
          } else {
            // concludo perche questa route non ha altre sotto route
            i = NumPreviousRoute;
          }
        } else {
          if (route1.key === route2.key) {
            NumSegment = NumSegment + 1;
          } else {
            // concludo perche questa route non ha altre sotto route
            i = NumPreviousRoute;
          }
        }
      } else {
        // concludo poiche ancora non è stata validata
        i = NumPreviousRoute;
      }
    }
    return NumSegment;
  }
  /* console.log(route); */
}



// nuova richieste con i mezzi suddivisi e considerando un area direttamente più grande data dall'unione dei tre segmenti
export function requestTrasportRouteDedicated(
  location,
  index,
  infoProfile,
  coef
) {
  return function (dispatch, getState) {
    let api = "https://overpass.kumi.systems/api/interpreter";
    // creo un valore random cosi uso un servizio differente ogni volta
    // gli do una probabilita piu bassa mettendo un intervallo piu grande ma solo alcuni corrispondono ad altri server
    const random = getRandomIntInclusive(0, 15);
    if (random === 1) {
      api = "https://lz4.overpass-api.de/api/interpreter";
    } else if (random === 2) {
      api = "https://z.overpass-api.de/api/interpreter";
    } else if (random === 3) {
      api = "https://overpass-api.de/api/interpreter";
    }

    // tipo se scelto autobus, metro , tram fai questa chiamata invece della pulizia della tratta

    // preparo le richieste da fare nell'array
    let urlArray = [];

    // controllo qual'è il piu grande di latitudine, poiche il primo parametro deve essere maggiore del secondo per la richiesta

    const allLat = location.map(position => parseFloat(position.latitude));
    const allLog = location.map(position => parseFloat(position.longitude));
    let lat1 = Math.max(...allLat) + 0.01;
    let lat2 = Math.min(...allLat) - 0.01;
    let log1 = Math.max(...allLog) + 0.01;
    let log2 = Math.min(...allLog) - 0.01;
    console.log(`${lat2}%2C${log2}%2C${lat1}%2C${log1}`);

    // chiamate differente se è bus/tram, train o metro

    // metro light_rail e railway
    let urlTrasport = `${api}?data=%5Bout%3Ajson%5D%5Btimeout%3A100%5D%3B%28relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22train%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22railway%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22light_rail%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22subway%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A`;
    if (coef === 400) {
      // train e railway
      urlTrasport = `${api}?data=%5Bout%3Ajson%5D%5Btimeout%3A100%5D%3B%28relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22train%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22railway%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A`;
    }
    if (coef === 800) {
      // bus e tram
      urlTrasport = `${api}?data=%5Bout%3Ajson%5D%5Btimeout%3A100%5D%3B%28relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22bus%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22tram%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A`;

      // tutti i mezzi
      // urlTrasport = `${api}?data=%5Bout%3Ajson%5D%5Btimeout%3A100%5D%3B%28relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22tram%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22train%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22bus%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A`;
    }
    console.log(urlTrasport);
    // test con coordinate di autobus
    // const urlTrasport =
    // ("https://overpass.kumi.systems/api/interpreter?data=%2F*%0AThis%20has%20been%20generated%20by%20the%20overpass-turbo%20wizard.%0AThe%20original%20search%20was%3A%0A“type%3Droute%20%26%20route%3Dbus”%0Atrain%20%0Atram%0A%0A*%2F%0A%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A%2F%2F%20gather%20results%0A%28%0A%20%20%2F%2F%20query%20part%20for%3A%20“type%3Droute%20and%20route%3Dbus”%0A%20%20relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22bus%22%5D%2838.11117707359793%2C13.365438133478165%2C38.11219850069204%2C13.36685299873352%29%3B%0A%29%3B%0A%2F%2F%20print%20results%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B");

    urlArray.push(urlTrasport);

    // preparo le richieste da fare

    let promiseArray = urlArray.map(url => axios.get(url));

    // creo una variabile per sapere quante volte sono sulla tratta del trasporto pubblico
    let numRouteTrasport = 0;

    // array per memorizzare dati da varie risposte

    let ReferPublicRoute = [];
    // per considerare se le tre risposte sono arrivate correttamente
    let checkResponse = true;

    // faccio le richieste
    axios
      .all(promiseArray)
      .then(function (results) {
        // prendo tutte le risposte
        let temp = results.map(response => {
          // per ogni risposta

          if (response.status === 200) {
            // la risposta se va bene contiene degli elements
            // se vuoti, significa che in quel segmento di tratta tra le coordinate gps non c'e un tratta del tram occ
            console.log(response);
            console.log(response.data);
            if (response.data.elements.length !== 0) {
              // tratte trovate

              let NewReferPublicRoute = osmtogeojson(response.data);
              console.log(NewReferPublicRoute);

              ReferPublicRoute = [
                ...ReferPublicRoute,
                ...NewReferPublicRoute.features
              ];
            }
          } else {
            // la risposta non è arrivata quindi devo rivalutare
            checkResponse = false;
          }
        });

        // presa la lista, tolgo eventuali linee ripetute

        if (checkResponse) {
          // adesso è un unica richiesta quindi non ci sono ripetizione

          // tolgo le linee dei mezzi pubblici in piu
          // ReferPublicRoute = ReferPublicRoute.reduce(
          //   (total, linea, index, array) => {
          //     if (!total.filter(elem => elem.id === linea.id).length) {
          //       return [...total, linea];
          //     }
          //     return total;
          //   },
          //   []
          // );

          console.log(ReferPublicRoute);

          // mandiamo un azione dicendo le tratte analizzate e il numero di tratte riconosciute valide di quelle analizzate
          // e quale tratta sto analizzando con index, cosi aggiorno i dati di quella route
          // anche la lista della lista degli autobus o altri mezzi

          dispatch({
            type: UPDATE_LOCATION,
            ValidRoute: location,
            NumRouteValid: 0,
            refTrasportRoute: ReferPublicRoute ? ReferPublicRoute : [],
            index,
            infoProfile
          });
        } else {
          // una delle tre delle  risposte non è arrivata quindi devo rimandare
          dispatch(UpdateStatus("", index));
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(UpdateStatus("error request validation trasport ", index));
      });
  };
}

export function requestTrasportRouteDedicatedStart(
  location,
  index,
  infoProfile,
  coef
) {
  return function (dispatch, getState) {
    let api = "https://overpass.kumi.systems/api/interpreter";
    // creo un valore random cosi uso un servizio differente ogni volta
    // gli do una probabilita piu bassa mettendo un intervallo piu grande ma solo alcuni corrispondono ad altri server
    const random = getRandomIntInclusive(0, 15);
    if (random === 1) {
      api = "https://lz4.overpass-api.de/api/interpreter";
    } else if (random === 2) {
      api = "https://z.overpass-api.de/api/interpreter";
    } else if (random === 3) {
      api = "https://overpass-api.de/api/interpreter";
    }

    // tipo se scelto autobus, metro , tram fai questa chiamata invece della pulizia della tratta

    // preparo le richieste da fare nell'array
    let urlArray = [];

    // controllo qual'è il piu grande di latitudine, poiche il primo parametro deve essere maggiore del secondo per la richiesta

    const allLat = location.map(position => parseFloat(position.latitude));
    const allLog = location.map(position => parseFloat(position.longitude));
    let lat1 = Math.max(...allLat) + 0.01;
    let lat2 = Math.min(...allLat) - 0.01;
    let log1 = Math.max(...allLog) + 0.01;
    let log2 = Math.min(...allLog) - 0.01;
    console.log(`${lat2}%2C${log2}%2C${lat1}%2C${log1}`);

    // chiamate differente se è bus/tram, train o metro

    // metro light_rail e railway
    let urlTrasport = `${api}?data=%5Bout%3Ajson%5D%5Btimeout%3A100%5D%3B%28relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22train%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22railway%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22light_rail%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22subway%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A`;
    if (coef === 400) {
      // train e railway
      urlTrasport = `${api}?data=%5Bout%3Ajson%5D%5Btimeout%3A100%5D%3B%28relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22train%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22railway%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A`;
    }
    if (coef === 800) {
      // bus e tram
      urlTrasport = `${api}?data=%5Bout%3Ajson%5D%5Btimeout%3A100%5D%3B%28relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22bus%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22tram%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A`;
      // tutti i mezzi
      // urlTrasport = `${api}?data=%5Bout%3Ajson%5D%5Btimeout%3A100%5D%3B%28relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22tram%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22train%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22bus%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A`;
    }
    console.log(urlTrasport);
    // test con coordinate di autobus
    // const urlTrasport =
    // ("https://overpass.kumi.systems/api/interpreter?data=%2F*%0AThis%20has%20been%20generated%20by%20the%20overpass-turbo%20wizard.%0AThe%20original%20search%20was%3A%0A“type%3Droute%20%26%20route%3Dbus”%0Atrain%20%0Atram%0A%0A*%2F%0A%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A%2F%2F%20gather%20results%0A%28%0A%20%20%2F%2F%20query%20part%20for%3A%20“type%3Droute%20and%20route%3Dbus”%0A%20%20relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22bus%22%5D%2838.11117707359793%2C13.365438133478165%2C38.11219850069204%2C13.36685299873352%29%3B%0A%29%3B%0A%2F%2F%20print%20results%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B");

    urlArray.push(urlTrasport);

    // preparo le richieste da fare

    let promiseArray = urlArray.map(url => axios.get(url));

    // creo una variabile per sapere quante volte sono sulla tratta del trasporto pubblico
    let numRouteTrasport = 0;

    // array per memorizzare dati da varie risposte

    let ReferPublicRoute = [];
    // per considerare se le tre risposte sono arrivate correttamente
    let checkResponse = true;

    // faccio le richieste
    axios
      .all(promiseArray)
      .then(function (results) {
        // prendo tutte le risposte
        let temp = results.map(response => {
          // per ogni risposta

          if (response.status === 200) {
            // la risposta se va bene contiene degli elements
            // se vuoti, significa che in quel segmento di tratta tra le coordinate gps non c'e un tratta del tram occ
            console.log(response);
            console.log(response.data);
            if (response.data.elements.length !== 0) {
              // tratte trovate

              // let NewReferPublicRoute = osmtogeojson(response.data);
              // console.log(NewReferPublicRoute);

              ReferPublicRoute = [
                "Trovata linea"
                // ...NewReferPublicRoute.features
              ];
            }
          } else {
            // la risposta non è arrivata quindi devo rivalutare
            checkResponse = false;
          }
        });

        // presa la lista, tolgo eventuali linee ripetute

        if (checkResponse && ReferPublicRoute.length) {
          // se dei dati vado avanti, altrimenti richiedo  i dati delle stazioni presenti
          // adesso è un unica richiesta quindi non ci sono ripetizione

          // tolgo le linee dei mezzi pubblici in piu
          // ReferPublicRoute = ReferPublicRoute.reduce(
          //   (total, linea, index, array) => {
          //     if (!total.filter(elem => elem.id === linea.id).length) {
          //       return [...total, linea];
          //     }
          //     return total;
          //   },
          //   []
          // );

          console.log(ReferPublicRoute);

          // mandiamo un azione dicendo le tratte analizzate e il numero di tratte riconosciute valide di quelle analizzate
          // e quale tratta sto analizzando con index, cosi aggiorno i dati di quella route
          // anche la lista della lista degli autobus o altri mezzi

          dispatch({
            type: UPDATE_LOCATION,
            ValidRoute: location,
            NumRouteValid: 0,
            refTrasportRoute: ReferPublicRoute ? ReferPublicRoute : [],
            index,
            infoProfile
          });
        } else if (checkResponse && !ReferPublicRoute.length) {
          // ho ricevuto risposta ma non ho le tratte, provo a cercare le stazioni
          // http://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%28node%5B%22railway%22%3D%22station%22%5D%2838%2E064040835819%2C13%2E34358215332%2C38%2E129290511881%2C13%2E434133529663%29%3Bway%5B%22railway%22%3D%22station%22%5D%2838%2E064040835819%2C13%2E34358215332%2C38%2E129290511881%2C13%2E434133529663%29%3Brelation%5B%22railway%22%3D%22station%22%5D%2838%2E064040835819%2C13%2E34358215332%2C38%2E129290511881%2C13%2E434133529663%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A
          let urlStation = `${api}?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%28node%5B%22railway%22%3D%22station%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Bway%5B%22railway%22%3D%22station%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22railway%22%3D%22station%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A`;
          urlArray = [];
          urlArray.push(urlStation);
          // preparo le richieste da fare per le stazioni
          promiseArray = urlArray.map(url => axios.get(url));
          checkResponse = true;
          axios
            .all(promiseArray)
            .then(function (results) {
              // prendo tutte le risposte
              temp = results.map(response => {
                // per ogni risposta

                if (response.status === 200) {
                  // la risposta se va bene contiene degli elements
                  // se vuoti, significa che in quel segmento di tratta tra le coordinate gps non c'e un tratta del tram occ
                  console.log(response);
                  console.log(response.data);
                  if (response.data.elements.length !== 0) {
                    // tratte trovate

                    // let NewReferPublicRoute = osmtogeojson(response.data);
                    // console.log(NewReferPublicRoute);

                    ReferPublicRoute = [
                      "Trovata stazione"
                      // ...NewReferPublicRoute.features
                    ];
                  }
                } else {
                  // la risposta non è arrivata quindi devo rivalutare
                  checkResponse = false;
                }
              });
              if (checkResponse) {
                // ho cercato anche le stazioni

                console.log(ReferPublicRoute);

                // mandiamo un azione dicendo le tratte analizzate e il numero di tratte riconosciute valide di quelle analizzate
                // e quale tratta sto analizzando con index, cosi aggiorno i dati di quella route
                // anche la lista della lista degli autobus o altri mezzi

                dispatch({
                  type: UPDATE_LOCATION,
                  ValidRoute: location,
                  NumRouteValid: 0,
                  refTrasportRoute: ReferPublicRoute ? ReferPublicRoute : [],
                  index,
                  infoProfile
                });
              } else {
                // una delle tre delle  risposte non è arrivata quindi devo rimandare
                dispatch(UpdateStatus("", index));
              }
            })
            .catch(err => {
              console.log(err);
              dispatch(UpdateStatus("error request station trasport ", index));
            });
        } else {
          // una delle tre delle  risposte non è arrivata quindi devo rimandare
          dispatch(UpdateStatus("", index));
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(UpdateStatus("error request validation trasport ", index));
      });
  };
}

// nuova richieste con i mezzi suddivisi e considerando un area direttamente più grande data dall'unione dei tre segmenti
export function requestTrasportRouteDedicatedFinal(
  location,
  index,
  infoProfile,
  coef,
  typeStop,
  paramCallback,
  callback
) {
  return function (dispatch, getState) {
    let api = "https://overpass.kumi.systems/api/interpreter";
    // creo un valore random cosi uso un servizio differente ogni volta
    // gli do una probabilita piu bassa mettendo un intervallo piu grande ma solo alcuni corrispondono ad altri server
    const random = getRandomIntInclusive(0, 15);
    if (random === 1) {
      api = "https://lz4.overpass-api.de/api/interpreter";
    } else if (random === 2) {
      api = "https://z.overpass-api.de/api/interpreter";
    } else if (random === 3) {
      api = "https://overpass-api.de/api/interpreter";
    }

    // tipo se scelto autobus, metro , tram fai questa chiamata invece della pulizia della tratta

    // preparo le richieste da fare nell'array
    let urlArray = [];

    // controllo qual'è il piu grande di latitudine, poiche il primo parametro deve essere maggiore del secondo per la richiesta

    const allLat = location.map(position => parseFloat(position.latitude));
    const allLog = location.map(position => parseFloat(position.longitude));
    let lat1 = Math.max(...allLat) + 0.01;
    let lat2 = Math.min(...allLat) - 0.01;
    let log1 = Math.max(...allLog) + 0.01;
    let log2 = Math.min(...allLog) - 0.01;
    console.log(`${lat2}%2C${log2}%2C${lat1}%2C${log1}`);

    // chiamate differente se è bus/tram, train o metro

    // metro light_rail e railway
    // subway
    let urlTrasport = `${api}?data=%5Bout%3Ajson%5D%5Btimeout%3A100%5D%3B%28relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22train%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22railway%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22light_rail%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22subway%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A`;
    if (coef === 400) {
      // train e railway
      urlTrasport = `${api}?data=%5Bout%3Ajson%5D%5Btimeout%3A100%5D%3B%28relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22train%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22railway%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A`;
    }
    if (coef === 800) {
      // bus e tram
      urlTrasport = `${api}?data=%5Bout%3Ajson%5D%5Btimeout%3A100%5D%3B%28relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22bus%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22tram%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A`;
      // tutti i mezzi
      // urlTrasport = `${api}?data=%5Bout%3Ajson%5D%5Btimeout%3A100%5D%3B%28relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22tram%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22train%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22bus%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A`;
    }
    console.log(urlTrasport);
    // test con coordinate di autobus
    // const urlTrasport =
    // ("https://overpass.kumi.systems/api/interpreter?data=%2F*%0AThis%20has%20been%20generated%20by%20the%20overpass-turbo%20wizard.%0AThe%20original%20search%20was%3A%0A“type%3Droute%20%26%20route%3Dbus”%0Atrain%20%0Atram%0A%0A*%2F%0A%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A%2F%2F%20gather%20results%0A%28%0A%20%20%2F%2F%20query%20part%20for%3A%20“type%3Droute%20and%20route%3Dbus”%0A%20%20relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22bus%22%5D%2838.11117707359793%2C13.365438133478165%2C38.11219850069204%2C13.36685299873352%29%3B%0A%29%3B%0A%2F%2F%20print%20results%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B");

    urlArray.push(urlTrasport);

    // preparo le richieste da fare

    let promiseArray = urlArray.map(url => axios.get(url));

    // creo una variabile per sapere quante volte sono sulla tratta del trasporto pubblico
    let numRouteTrasport = 0;

    // array per memorizzare dati da varie risposte

    let ReferPublicRoute = [];
    // per considerare se le tre risposte sono arrivate correttamente
    let checkResponse = true;

    // faccio le richieste
    axios
      .all(promiseArray)
      .then(function (results) {
        // prendo tutte le risposte
        let temp = results.map(response => {
          // per ogni risposta

          if (response.status === 200) {
            // la risposta se va bene contiene degli elements
            // se vuoti, significa che in quel segmento di tratta tra le coordinate gps non c'e un tratta del tram occ
            console.log(response);
            console.log(response.data);
            if (response.data.elements.length !== 0) {
              // tratte trovate

              // let NewReferPublicRoute = osmtogeojson(response.data);
              // console.log(NewReferPublicRoute);

              ReferPublicRoute = [
                "Trovata linea"
                // ...NewReferPublicRoute.features
              ];
            }
          } else {
            // la risposta non è arrivata quindi devo rivalutare
            checkResponse = false;
          }
        });

        // presa la lista, tolgo eventuali linee ripetute

        if (checkResponse && ReferPublicRoute.length) {
          // se dei dati vado avanti, altrimenti richiedo  i dati delle stazioni presenti
          // adesso è un unica richiesta quindi non ci sono ripetizione

          // tolgo le linee dei mezzi pubblici in piu
          // ReferPublicRoute = ReferPublicRoute.reduce(
          //   (total, linea, index, array) => {
          //     if (!total.filter(elem => elem.id === linea.id).length) {
          //       return [...total, linea];
          //     }
          //     return total;
          //   },
          //   []
          // );

          console.log(ReferPublicRoute);

          // mandiamo un azione dicendo le tratte analizzate e il numero di tratte riconosciute valide di quelle analizzate
          // e quale tratta sto analizzando con index, cosi aggiorno i dati di quella route
          // anche la lista della lista degli autobus o altri mezzi

          dispatch({
            type: ADD_REFER_PUBLIC_ROUTE,

            refTrasportRoute: ReferPublicRoute ? ReferPublicRoute : [],
            index
          });
          dispatch(CompleteActivity(index, typeStop, paramCallback, callback));
        } else if (checkResponse && !ReferPublicRoute.length) {
          // ho ricevuto risposta ma non ho le tratte, provo a cercare le stazioni
          // http://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%28node%5B%22railway%22%3D%22station%22%5D%2838%2E064040835819%2C13%2E34358215332%2C38%2E129290511881%2C13%2E434133529663%29%3Bway%5B%22railway%22%3D%22station%22%5D%2838%2E064040835819%2C13%2E34358215332%2C38%2E129290511881%2C13%2E434133529663%29%3Brelation%5B%22railway%22%3D%22station%22%5D%2838%2E064040835819%2C13%2E34358215332%2C38%2E129290511881%2C13%2E434133529663%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A
          let urlStation = `${api}?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%28node%5B%22railway%22%3D%22station%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Bway%5B%22railway%22%3D%22station%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22railway%22%3D%22station%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A`;
          urlArray = [];
          urlArray.push(urlStation);
          // preparo le richieste da fare per le stazioni
          promiseArray = urlArray.map(url => axios.get(url));
          checkResponse = true;
          axios
            .all(promiseArray)
            .then(function (results) {
              // prendo tutte le risposte
              temp = results.map(response => {
                // per ogni risposta

                if (response.status === 200) {
                  // la risposta se va bene contiene degli elements
                  // se vuoti, significa che in quel segmento di tratta tra le coordinate gps non c'e un tratta del tram occ
                  console.log(response);
                  console.log(response.data);
                  if (response.data.elements.length !== 0) {
                    // tratte trovate

                    // let NewReferPublicRoute = osmtogeojson(response.data);
                    // console.log(NewReferPublicRoute);

                    ReferPublicRoute = [
                      "Trovata stazione"
                      // ...NewReferPublicRoute.features
                    ];
                  }
                } else {
                  // la risposta non è arrivata quindi devo rivalutare
                  checkResponse = false;
                }
              });
              if (checkResponse) {
                // ho cercato anche le stazioni

                console.log(ReferPublicRoute);

                // mandiamo un azione dicendo le tratte analizzate e il numero di tratte riconosciute valide di quelle analizzate
                // e quale tratta sto analizzando con index, cosi aggiorno i dati di quella route
                // anche la lista della lista degli autobus o altri mezzi

                dispatch({
                  type: ADD_REFER_PUBLIC_ROUTE,

                  refTrasportRoute: ReferPublicRoute ? ReferPublicRoute : [],
                  index
                });
                dispatch(
                  CompleteActivity(index, typeStop, paramCallback, callback)
                );
              } else {
                // una delle tre delle  risposte non è arrivata quindi devo rimandare
                dispatch(UpdateStatus("", index));
              }
            })
            .catch(err => {
              console.log(err);
              dispatch(UpdateStatus("error request station trasport ", index));
            });
        } else {
          // una delle tre delle  risposte non è arrivata quindi devo rimandare
          dispatch(UpdateStatus("", index));
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(UpdateStatus("error request validation trasport ", index));
      });
  };
}

// metodo che calcolo l'attivita dall'id attivita
// e utile quando si riceve il dato dal db
export function getModalType(modal_id) {
  const modal_type = [
    "Other",
    "Walking",
    "Biking",
    "Public",
    "Pooling",
    "Bus",
    "Train",
    "Metro"
  ];
  return modal_type[modal_id];
}

export function requestTrasportRoute(location, index, infoProfile) {
  return function (dispatch, getState) {
    let api = "https://overpass.kumi.systems/api/interpreter";
    // creo un valore random cosi uso un servizio differente ogni volta
    // gli do una probabilita piu bassa mettendo un intervallo piu grande ma solo alcuni corrispondono ad altri server
    const random = getRandomIntInclusive(0, 15);
    if (random === 1) {
      api = "https://lz4.overpass-api.de/api/interpreter";
    } else if (random === 2) {
      api = "https://z.overpass-api.de/api/interpreter";
    } else if (random === 3) {
      api = "https://overpass-api.de/api/interpreter";
    }

    // tipo se scelto autobus, metro , tram fai questa chiamata invece della pulizia della tratta

    // preparo le richieste da fare nell'array
    let urlArray = [];

    // prendo le coordinate a due a due e vedo se c'e una tratta dell'autobus mandando una richiesta
    const lengthValid = location.length;

    // controllo qual'è il piu grande di latitudine, poiche il primo parametro deve essere maggiore del secondo per la richiesta
    for (i = 2; i <= lengthValid; i++) {
      let lat1 = 0;
      let lat2 = 0;
      const latFloat1 = parseFloat(location[i - 1].latitude);
      const latFloat2 = parseFloat(location[i - 2].latitude);
      const logFloat1 = parseFloat(location[i - 1].longitude);
      const logFloat2 = parseFloat(location[i - 2].longitude);
      if (latFloat1 >= latFloat2) {
        lat1 = location[i - 1].latitude;
        lat2 = location[i - 2].latitude;
      } else {
        // scambio e metto prima quello piu grande, ovvero il secondo
        lat1 = location[i - 2].latitude;
        lat2 = location[i - 1].latitude;
      }
      if (logFloat1 >= logFloat2) {
        log1 = location[i - 1].longitude;
        log2 = location[i - 2].longitude;
      } else {
        // scambio e metto prima quello piu grande, ovvero il secondo
        log1 = location[i - 2].longitude;
        log2 = location[i - 1].longitude;
      }
      console.log(`${lat2}%2C${log2}%2C${lat1}%2C${log1}`);

      // forse la seconda posizione gps deve essere piu grande sia per lat che log
      // cosi sembra funzionare, fare una ricerca sull'api

      // mezzi supportati bus train tram

      // const trasport = "train";
      // dovrei usare direttamente il type passato per fare la richiesta url, fatto

      // in questo momento tram, treno e bus
      // const urlTrasport = `${api}?data=%2F*%0AThis%20has%20been%20generated%20by%20the%20overpass-turbo%20wizard.%0AThe%20original%20search%20was%3A%0A“type%3Droute%20%26%20route%3Dbus”%0Atrain%20%0Atram%0A%0A*%2F%0A%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A%2F%2F%20gather%20results%0A%28%0A%20%20%2F%2F%20query%20part%20for%3A%20type%3Droute%20and%20route%3Dbus”%0A%20%20relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22bus%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3B%0A%29%3B%0A%2F%2F%20print%20results%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B`;
      const urlTrasport = `${api}?data=%5Bout%3Ajson%5D%5Btimeout%3A100%5D%3B%28relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22tram%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22train%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3Brelation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22bus%22%5D%28${lat2}%2C${log2}%2C${lat1}%2C${log1}%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A`;
      console.log(urlTrasport);
      // test con coordinate di autobus
      // const urlTrasport =
      // ("https://overpass.kumi.systems/api/interpreter?data=%2F*%0AThis%20has%20been%20generated%20by%20the%20overpass-turbo%20wizard.%0AThe%20original%20search%20was%3A%0A“type%3Droute%20%26%20route%3Dbus”%0Atrain%20%0Atram%0A%0A*%2F%0A%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A%2F%2F%20gather%20results%0A%28%0A%20%20%2F%2F%20query%20part%20for%3A%20“type%3Droute%20and%20route%3Dbus”%0A%20%20relation%5B%22type%22%3D%22route%22%5D%5B%22route%22%3D%22bus%22%5D%2838.11117707359793%2C13.365438133478165%2C38.11219850069204%2C13.36685299873352%29%3B%0A%29%3B%0A%2F%2F%20print%20results%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B");
      urlArray.push(urlTrasport);
    }

    // preparo le richieste da fare

    let promiseArray = urlArray.map(url => axios.get(url));

    // creo una variabile per sapere quante volte sono sulla tratta del trasporto pubblico
    let numRouteTrasport = 0;

    // array per memorizzare dati da varie risposte

    let ReferPublicRoute = [];
    // per considerare se le tre risposte sono arrivate correttamente
    let checkResponse = true;

    // faccio le richieste
    axios
      .all(promiseArray)
      .then(function (results) {
        // prendo tutte le risposte
        let temp = results.map(response => {
          // per ogni risposta

          if (response.status === 200) {
            // la risposta se va bene contiene degli elements
            // se vuoti, significa che in quel segmento di tratta tra le coordinate gps non c'e un tratta del tram occ
            console.log(response);
            console.log(response.data);
            if (response.data.elements.length !== 0) {
              // tratte trovate

              let NewReferPublicRoute = osmtogeojson(response.data);
              console.log(NewReferPublicRoute);

              ReferPublicRoute = [
                ...ReferPublicRoute,
                ...NewReferPublicRoute.features
              ];
            }
          } else {
            // la risposta non è arrivata quindi devo rivalutare
            checkResponse = false;
          }
        });

        // presa la lista, tolgo eventuali linee ripetute

        if (checkResponse) {
          // tolgo le linee dei mezzi pubblici in piu
          ReferPublicRoute = ReferPublicRoute.reduce(
            (total, linea, index, array) => {
              if (!total.filter(elem => elem.id === linea.id).length) {
                return [...total, linea];
              }
              return total;
            },
            []
          );

          console.log(ReferPublicRoute);

          // mandiamo un azione dicendo le tratte analizzate e il numero di tratte riconosciute valide di quelle analizzate
          // e quale tratta sto analizzando con index, cosi aggiorno i dati di quella route
          // anche la lista della lista degli autobus o altri mezzi

          dispatch({
            type: UPDATE_LOCATION,
            ValidRoute: location,
            NumRouteValid: 0,
            refTrasportRoute: ReferPublicRoute ? ReferPublicRoute : [],
            index,
            infoProfile
          });
        } else {
          // una delle tre delle  risposte non è arrivata quindi devo rimandare
          dispatch(UpdateStatus("", index));
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(UpdateStatus("error request validation trasport ", index));
      });
  };
}

/**
 * funzione ausiliare per notificare all'utente se è stato
 * fermo con il background tracking attivo
 *
 * @param array arrayActivities [ 'STILL', 'STILL', 'STILL', 'STILL', 'STILL', 'STILL' ]
 * @returns boolean
 */
function checkIfUserIsStill(arrayActivities, show) {
  let countStillElements = 0;

  console.log(arrayActivities);

  let stasisArray = ["UNKNOWN", "STILL", "STATIONARY"];

  arrayActivities.forEach(element => {
    if (stasisArray.includes(element)) countStillElements++;
  });

  if (countStillElements > LIMIT_TO_CHECK_COUNTER_ACTIVITIES_STILL) {
    // inizializzo il timer se uguale null
    if (is_user_still_timer == null) {
      is_user_still_timer = new Date(
        Date.now() + MINUTES_TO_NOTIFY_ACTIVITIES_STILL
      );
      console.log(is_user_still_timer);
    }
  }
  if (is_user_still_timer != null) {
    let countAllElements = 0;
    let movementArray = [
      "RUNNING",
      "WALKING",
      "AUTOMOTIVE",
      "CYCLING",
      "IN_VEHICLE",
      "ON_BICYCLE",
      "ON_FOOT"
    ];
    arrayActivities.forEach(element => {
      if (movementArray.includes(element)) countAllElements++;
    });
    if (countAllElements > 1) {
      is_user_still_timer = null;
    }
  }

  if (
    is_user_still_timer != null &&
    is_user_still_timer < new Date(Date.now())
  ) {
    // annullo il timer
    is_user_still_timer = null;

    if (show) {
      // mostro la notifica
      pushNotifications.configure();
      pushNotifications.userIsStillNotification();
    }

    return true;
  } else {
    return false;
  }
}

const API_KEY = "78b7f0694ea3f485d7daa5a1d30b9370";

export function fetchWeatherAsync(lat = 40, lon = 40) {
  return async function (dispatch) {
    // preparo la richiesta
    console.log("meteo async");
    try {
      const response = await axios({
        method: "get",
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}`
      });
      console.log(response);

      if (response.status === 200) {
        // se risponde correttamente setto un valore da 1 a 3 per dire che il meteo è stato settato

        const weather = response.data.weather[0].main;
        /* Rain: {
            color: '#005BEA',
              title: 'Raining',
                subtitle: 'Get a cup of coffee',
                  icon: 'weather-rainy'
          },
          Clear: {
            color: '#f7b733',
              title: 'So Sunny',
                subtitle: 'It is hurting my eyes',
                  icon: 'weather-sunny'
          },
          Thunderstorm: {
            color: '#616161',
              title: 'A Storm is coming',
                subtitle: 'Because Gods are angry',
                  icon: 'weather-lightning'
          },
          Clouds: {
            color: '#1F1C2C',
              title: 'Clouds',
                subtitle: 'Everywhere',
                  icon: 'weather-cloudy'
          },
  
          Snow: {
            color: '#00d2ff',
              title: 'Snow',
                subtitle: 'Get out and build a snowman for me',
                  icon: 'weather-snowy'
          },
          Drizzle: {
            color: '#076585',
              title: 'Drizzle',
                subtitle: 'Partially raining...',
                  icon: 'weather-hail'
          },
          Haze: {
            color: '#66A6FF',
              title: 'Haze',
                subtitle: 'Another name for Partial Raining',
                  icon: 'weather-hail'
          },
          Mist: {
            color: '#3CD3AD',
              title: 'Mist',
                subtitle: "Don't roam in forests!",
                  icon: 'weather-fog'
          }
        }; */

        dispatch({
          type: ADD_WEATHER,
          typeWeather: weather
        });
      } else {
        // se non risponde correttamente setto il valore a -1 per dire che non è stato aggiornato
        dispatch({
          type: ADD_WEATHER,
          typeWeather: ""
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function fetchWeather(lat = 40, lon = 40) {
  return dispatch => {
    console.log("meteo");
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}`
      )
      .then(res => {
        console.log(res);
        // se risponde correttamente setto un valore da 1 a 3 per dire che il meteo è stato settato
        if (res.status === 200) {
          const weather = res.data.weather[0].main;
          /* Rain: {
            color: '#005BEA',
              title: 'Raining',
                subtitle: 'Get a cup of coffee',
                  icon: 'weather-rainy'
          },
          Clear: {
            color: '#f7b733',
              title: 'So Sunny',
                subtitle: 'It is hurting my eyes',
                  icon: 'weather-sunny'
          },
          Thunderstorm: {
            color: '#616161',
              title: 'A Storm is coming',
                subtitle: 'Because Gods are angry',
                  icon: 'weather-lightning'
          },
          Clouds: {
            color: '#1F1C2C',
              title: 'Clouds',
                subtitle: 'Everywhere',
                  icon: 'weather-cloudy'
          },
  
          Snow: {
            color: '#00d2ff',
              title: 'Snow',
                subtitle: 'Get out and build a snowman for me',
                  icon: 'weather-snowy'
          },
          Drizzle: {
            color: '#076585',
              title: 'Drizzle',
                subtitle: 'Partially raining...',
                  icon: 'weather-hail'
          },
          Haze: {
            color: '#66A6FF',
              title: 'Haze',
                subtitle: 'Another name for Partial Raining',
                  icon: 'weather-hail'
          },
          Mist: {
            color: '#3CD3AD',
              title: 'Mist',
                subtitle: "Don't roam in forests!",
                  icon: 'weather-fog'
          }
        }; */

          dispatch({
            type: ADD_WEATHER,
            typeWeather: weather
          });
        } else {
          // se non risponde correttamente setto il valore a -1 per dire che non è stato aggiornato
          dispatch({
            type: ADD_WEATHER,
            typeWeather: ""
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
}
