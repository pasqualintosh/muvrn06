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
  ADD_DAILY_ROUTINE,
  UPDATE_PREVIOUS_ROUTE,
  CHANGE_ACTIVITY,
  RESET_PREVIOUS_ROUTE,
  ADD_WEATHER,
  STILL_NOTIFICATION_LOG,
  ADD_REFER_PUBLIC_ROUTE
} from "./ActionTypes";
import { DELETE_ROUTE, LOG_OUT } from "./../login/ActionTypes";
import DefaultState from "./DefaultState";
import haversine from "./../../helpers/haversine";
import { Platform, Alert } from "react-native";

import { getCalories, getIdModalType, getDefaultSpeed } from "./Support";
import PushNotification from "react-native-push-notification";

// soglia per considerare valida un posizione gps rispetto a un altra
// 0.1 troppo poco, 0.005 troppo
// oppure fare una soglia dinamica a seconda il mezzo utilizzato
// facendo delle stile la variazione massima puo essere 0.03 - 0.04
/* const threshold_gps = 0.025;
// soglia anche inferiore per non avere posizioni troppo vicine o uguale, 0.0001 sembra poco, 0.0005, da testare 0.00005
const threshold_gps_min = 0.00005; */

// soglie in kilometri
const threshold_gps = 0.05;

const threshold_gps_min = 0.001;

export default function trackingReducer(state = DefaultState, action) {
  switch (action.type) {
    case ADD_TRACKING:
      {
        // pulizia coordinate gps
        // devo avere almeno due coordinate gps, e poi la prima è con gli start come valori

        // tratte valide
        const tracks = state.route.length;
        // tratte ancora non validate
        const tracks_not_valid = state.routeNotvalid.length;
        // tratte gia analizzate
        const tracksAnalyzed = state.routeAnalyzed.length;

        let threshold_gps = 0.2;

        let new_distance_live = 0.1;
        let distance_ref = 0.1;
        let distance_ref2 = 0.1;
        let distance_ref3 = 0.1;
        let route_not_valid_distance = 0.1;

        // distanza utilizzata per sapere se sono dentro un range e la nuova posizione non deve essere considerata
        const distance_still = 0.099;

        const threshold_gps_min = 0.00001;
        // modalita scelta
        const type = state.activityChoice.type;
        console.log(type);
        switch (type) {
          case "Walking":
            // cento metri
            threshold_gps = 0.2;
            break;
          case "Biking":
            threshold_gps = 0.35;
            break;
          case "Public":
            threshold_gps = 1.0;
            break;
        }
        console.log("threshold_gps");
        console.log(threshold_gps);

        if (tracks > 0) {
          // se la coordinata è la stessa allora non la considero
          // oppure troppo vicina, quindi il range deve essere un intervallo
          // basta che log o lat sia maggiore della soglia minima
          // se uguali non la conserva

          new_distance_live = parseFloat(
            haversine(
              state.route[tracks - 1].latitude,
              state.route[tracks - 1].longitude,
              action.item.latitude,
              action.item.longitude
            )
          );

          console.log(new_distance_live);

          if (new_distance_live === 0) {
            // sono uguali, non la conservo
            return state;
          } else if (tracks > 2) {
            distance_ref = parseFloat(
              haversine(
                state.route[tracks - 3].latitude,
                state.route[tracks - 3].longitude,
                state.route[tracks - 2].latitude,
                state.route[tracks - 2].longitude
              )
            );
            distance_ref2 = parseFloat(
              haversine(
                state.route[tracks - 3].latitude,
                state.route[tracks - 3].longitude,
                state.route[tracks - 1].latitude,
                state.route[tracks - 1].longitude
              )
            );
            distance_ref3 = parseFloat(
              haversine(
                state.route[tracks - 3].latitude,
                state.route[tracks - 3].longitude,
                action.item.latitude,
                action.item.longitude
              )
            );
            console.log(distance_ref);
            console.log(distance_ref2);
            console.log(distance_ref3);

            if (
              distance_ref < distance_still &&
              distance_ref2 < distance_still &&
              distance_ref3 < distance_still
            ) {
              if (distance_ref3 === 0) {
                return state;
              } else {
                return {
                  ...state,
                  speed: action.item.speed
                    ? action.item.speed > 0
                      ? action.item.speed
                      : 0
                    : 0,
                  routeNotvalid: [...state.routeNotvalid, action.item]
                };
              }
            }
          } else if (tracks > 1 && tracksAnalyzed > 0) {
            distance_ref = parseFloat(
              haversine(
                state.routeAnalyzed[tracksAnalyzed - 1].latitude,
                state.routeAnalyzed[tracksAnalyzed - 1].longitude,
                state.route[tracks - 2].latitude,
                state.route[tracks - 2].longitude
              )
            );
            distance_ref2 = parseFloat(
              haversine(
                state.routeAnalyzed[tracksAnalyzed - 1].latitude,
                state.routeAnalyzed[tracksAnalyzed - 1].longitude,
                state.route[tracks - 1].latitude,
                state.route[tracks - 1].longitude
              )
            );
            distance_ref3 = parseFloat(
              haversine(
                state.routeAnalyzed[tracksAnalyzed - 1].latitude,
                state.routeAnalyzed[tracksAnalyzed - 1].longitude,
                action.item.latitude,
                action.item.longitude
              )
            );
            console.log(distance_ref);
            console.log(distance_ref2);
            console.log(distance_ref3);
            if (
              distance_ref < distance_still &&
              distance_ref2 < distance_still &&
              distance_ref3 < distance_still
            ) {
              if (distance_ref3 === 0) {
                return state;
              } else {
                return {
                  ...state,
                  speed: action.item.speed
                    ? action.item.speed > 0
                      ? action.item.speed
                      : 0
                    : 0,
                  routeNotvalid: [...state.routeNotvalid, action.item]
                };
              }
            }
          } else if (tracksAnalyzed > 1) {
            distance_ref = parseFloat(
              haversine(
                state.routeAnalyzed[tracksAnalyzed - 2].latitude,
                state.routeAnalyzed[tracksAnalyzed - 2].longitude,
                state.routeAnalyzed[tracksAnalyzed - 1].latitude,
                state.routeAnalyzed[tracksAnalyzed - 1].longitude
              )
            );
            distance_ref2 = parseFloat(
              haversine(
                state.routeAnalyzed[tracksAnalyzed - 2].latitude,
                state.routeAnalyzed[tracksAnalyzed - 2].longitude,
                state.route[tracks - 1].latitude,
                state.route[tracks - 1].longitude
              )
            );
            distance_ref3 = parseFloat(
              haversine(
                state.routeAnalyzed[tracksAnalyzed - 2].latitude,
                state.routeAnalyzed[tracksAnalyzed - 2].longitude,
                action.item.latitude,
                action.item.longitude
              )
            );
            console.log(distance_ref);
            console.log(distance_ref2);
            console.log(distance_ref3);
            if (
              distance_ref < distance_still &&
              distance_ref2 < distance_still &&
              distance_ref3 < distance_still
            ) {
              if (distance_ref3 === 0) {
                return state;
              } else {
                return {
                  ...state,
                  speed: action.item.speed
                    ? action.item.speed > 0
                      ? action.item.speed
                      : 0
                    : 0,
                  routeNotvalid: [...state.routeNotvalid, action.item]
                };
              }
            }
          }
          console.log("Punto sicuramente non troppo vicino a dove sono");
          if (new_distance_live <= threshold_gps) {
            return {
              ...state,
              distanceLive: state.distanceLive + new_distance_live,
              route: [...state.route, action.item],
              routeNotvalid: [],
              speed: action.item.speed
                ? action.item.speed > 0
                  ? action.item.speed
                  : 0
                : 0
            };
          }
        }
        // se ancora non ho tratte pulite oppure quella nuova non è valida
        if (tracks_not_valid > 1) {
          // se non lo è allora controllo le coordinate non valide
          // se ho almeno 2 coordinate non valide, quella nuova la confronto con due precedenti non valide
          // se è vicina a quella non valida precedente, e questa con quella precedente, le conservo come valide altrimenti la conserva come non valida

          new_distance_live = parseFloat(
            haversine(
              state.routeNotvalid[tracks_not_valid - 2].latitude,
              state.routeNotvalid[tracks_not_valid - 2].longitude,
              state.routeNotvalid[tracks_not_valid - 1].latitude,
              state.routeNotvalid[tracks_not_valid - 1].longitude
            )
          );

          route_not_valid_distance = parseFloat(
            haversine(
              state.routeNotvalid[tracks_not_valid - 1].latitude,
              state.routeNotvalid[tracks_not_valid - 1].longitude,
              action.item.latitude,
              action.item.longitude
            )
          );

          console.log(new_distance_live);
          console.log(route_not_valid_distance);

          // se uguali non la conserva
          if (route_not_valid_distance === 0) {
            return state;
          } else if (
            new_distance_live <= threshold_gps &&
            route_not_valid_distance <= threshold_gps
          ) {
            // valide tra di loro se è dentro un range di soglia min e max accettabile tra due posizioni
            // se concorde con quelle precedente non valida, allora sono valide e cancello tutte quelle non valide

            // essendo tre nuovi punti d'aggiungere devo calcolare tre distanze ovvero l'ultima valida con la prima adesso valida aggiunta
            // se esiste una valida precedente

            let new_distance_live_valid_tovalid = 0;
            if (tracks) {
              // l'ultima posizione valida si trova sempre in route  quindi uso questa come punto di riferimento per riprendere le tratte valide
              new_distance_live_valid_tovalid = parseFloat(
                haversine(
                  state.routeNotvalid[tracks_not_valid - 2].latitude,
                  state.routeNotvalid[tracks_not_valid - 2].longitude,
                  state.route[tracks - 1].latitude,
                  state.route[tracks - 1].longitude
                )
              );
            }

            return {
              ...state,
              route: [
                ...state.route,
                state.routeNotvalid[tracks_not_valid - 2],
                state.routeNotvalid[tracks_not_valid - 1],
                action.item
              ],
              routeNotvalid: [],
              distanceLive:
                state.distanceLive +
                new_distance_live +
                route_not_valid_distance +
                new_distance_live_valid_tovalid,
              speed: action.item.speed
                ? action.item.speed > 0
                  ? action.item.speed
                  : 0
                : 0
            };
          }

          // se ancora non è valida, l'accodo
          return {
            ...state,
            routeNotvalid: [...state.routeNotvalid, action.item],
            speed: action.item.speed
              ? action.item.speed > 0
                ? action.item.speed
                : 0
              : 0
          };
        }
        if (tracks_not_valid === 1) {
          new_distance_live = parseFloat(
            haversine(
              state.routeNotvalid[tracks_not_valid - 1].latitude,
              state.routeNotvalid[tracks_not_valid - 1].longitude,
              action.item.latitude,
              action.item.longitude
            )
          );
          console.log(new_distance_live);
          if (new_distance_live === 0) {
            // sono uguali, non la conservo
            return state;
          } else {
            // se è diversa l'aggiungo
            return {
              ...state,
              routeNotvalid: [...state.routeNotvalid, action.item],
              speed: action.item.speed
                ? action.item.speed > 0
                  ? action.item.speed
                  : 0
                : 0
            };
          }
        }
        // la conservo come non valida, poiche non ho posizioni ne valide ne non valide al momento
        return {
          ...state,
          routeNotvalid: [...state.routeNotvalid, action.item],
          speed: action.item.speed
            ? action.item.speed > 0
              ? action.item.speed
              : 0
            : 0
        };
      }
      break;

    case STILL_NOTIFICATION_LOG:
      {
        return {
          ...state,
          still_notification_log:
            state.still_notification_log + " " + action.payload
        };
      }
      break;

    case RESET_TRACKING:
      // conviene risettare lo stato default direttamente
      {
        return DefaultState;
      }
      break;

    case SAVE_TRACKING_SUCCESS:
      {
        return {
          ...state,
          routeDataSaved: true
        };
      }
      break;

    case SAVE_TRACKING_ERROR:
      {
        return {
          ...state,
          routeDataSaved: false
        };
      }
      break;

    case ADD_ACTIVITY:
      {
        return {
          ...state,
          activity: [...state.activity, action.itemActivity]
        };
      }
      break;

    case RESET_PREVIOUS_ROUTE:
      {
        return {
          ...state,
          PreviousRoute: []
        };
      }
      break;

    case "prova":
      {
        return {
          ...state,
          route: [],
          routeAnalyzed: [...state.routeAnalyzed, ...action.ValidRoute]
        };
      }
      break;

    case ADD_REFER_PUBLIC_ROUTE:
      {
        let refTrasportRoute = action.refTrasportRoute
          ? action.refTrasportRoute
          : [];
        // let newRefTrasportRoute = [];
        if (action.index === 0) {
          // if (refTrasportRoute) {
          //   console.log("salvataggio nuove tratte");

          //   newRefTrasportRoute = refTrasportRoute.reduce(
          //     (total, linea, index, array) => {
          //       const lineaUsefull = linea.geometry
          //         ? linea.geometry.type === "MultiLineString" ||
          //         linea.geometry.type === "LineString"
          //         : false;
          //       if (lineaUsefull) {
          //         // se è utile l'aggiungo

          //         return [...total, linea];
          //       } else {
          //         return total;
          //       }
          //     },
          //     []
          //   );
          //   console.log(newRefTrasportRoute);
          // }

          return {
            ...state,

            refTrasportRoute: [...state.refTrasportRoute, refTrasportRoute]
          };
        } else {
          const newState = { ...state };

          // controllo se le nuove linee trovate non sono comprese in quelle di prima prima di salvare
          // if (refTrasportRoute) {
          //   newRefTrasportRoute = refTrasportRoute.reduce(
          //     (total, linea, index, array) => {
          //       const lineaUsefull = linea.geometry
          //         ? linea.geometry.type === "MultiLineString" ||
          //         linea.geometry.type === "LineString"
          //         : false;
          //       if (lineaUsefull) {
          //         // se è utile l'aggiungo

          //         return [...total, linea];
          //       } else {
          //         return total;
          //       }
          //     },
          //     []
          //   );
          // }

          // aggiorno la stato di una delle tratte precedenti
          newState.PreviousRoute[action.index - 1] = {
            ...newState.PreviousRoute[action.index - 1],
            refTrasportRoute: [
              ...newState.PreviousRoute[action.index - 1].refTrasportRoute,
              refTrasportRoute
            ]
          };
          return newState;
        }
      }
      break;

    case UPDATE_LOCATION:
      {
        // questo serve per avere la nuova distanza percorsa,  punti totali , punti ottenuti adesso in relazione alla distanza delle nuove posizioni
        // questa azione si chiama tipo quando si sono trovate almeno 5 posizioni
        const tracks = action.ValidRoute.length;
        const NewTrace = action.ValidRoute;

        // siccome lo stato corrente puo essere stato spostato in Previousroute
        // vedo se sto ancora lavorando sullo stesso stato, vedendo se la route analizzata è coerente con la route presente
        // allora analizzo altrimenti lo stato rimane lo stesso
        let key = 0;
        if (action.index !== 0) {
          key = state.PreviousRoute[action.index - 1].route[0].key
            ? state.PreviousRoute[action.index - 1].route[0].key
            : 0;
        } else {
          // puo succedere che il dato non c'e quindi metto 0 cosi il confronto sara nullo
          key = state.route[0].key ? state.route[0].key : 0;
        }

        if (NewTrace[0].key === key) {
          let distance = 0;

          // nuova distanza

          // ho la prima posizione con start come coordinate la dovrei togliere nello stato di default
          for (i = 0; i < tracks - 1; i++) {
            // haversine restituisce kilometri
            distance += parseFloat(
              haversine(
                NewTrace[i].latitude,
                NewTrace[i].longitude,
                NewTrace[i + 1].latitude,
                NewTrace[i + 1].longitude
              )
            );
          }

          console.log(distance);

          // ho analizzate solo una parte delle posizioni, poi questa validazioni puo essere fatta successivamente
          // e quindi sono state trovate nuove posizioni e attivita
          // allora devo prendere soltanto le attivita relative a queste posizioni mediante la data

          // prendo le informazioni che mi servono a seconda il contesto

          let activity = [...state.activity];
          let totDistance = state.totDistance;
          let activityChoice = state.activityChoice;
          let RouteRemained = [...state.route];
          let RouteAnalyzedLength = state.routeAnalyzed.length;
          let PrecDistanceSameMode = state.PrecDistanceSameMode;
          if (action.index !== 0) {
            activity = [...state.PreviousRoute[action.index - 1].activity];
            totDistance = state.PreviousRoute[action.index - 1].totDistance;
            activityChoice =
              state.PreviousRoute[action.index - 1].activityChoice;
            RouteRemained = [...state.PreviousRoute[action.index - 1].route];
            RouteAnalyzedLength =
              state.PreviousRoute[action.index - 1].routeAnalyzed.length;
            PrecDistanceSameMode =
              state.PreviousRoute[action.index - 1].PrecDistanceSameMode;
          }
          // faccio una copia essendo che poi devo separare l'attivita
          let ActivityRemained = [...activity];

          console.log("analizzo un pezzo del attivita");
          // prendo la data dell'ultima posizione analizzata
          const keyDateLocation = NewTrace[tracks - 1].key;
          activity = activity.filter(elem => elem.key <= keyDateLocation);
          console.log(activity);

          // separo attivita
          const AnalyzedActivityLength = activity.length;
          // l'ultima attivita la salvo per sapere come sto iniziando
          ActivityRemained.splice(
            0,
            AnalyzedActivityLength ? AnalyzedActivityLength - 1 : 0
          );
          // se non c'e allora metto [] cosi refTrasportRoute.length da 0
          let refTrasportRoute = action.refTrasportRoute
            ? action.refTrasportRoute
            : false;
          let NumRouteValid = action.NumRouteValid;

          // controllo per vedere se sono ancora nella stessa linea dopo che ho raccolto un po di linee con due validazioni
          // prendo le linne precedenti dei mezzi

          // controllo attivita fatta in questo intervallo e ritorna dei punti
          // e il coefficiente del mezzo usato

          // se ho almeno due tracce valideho una distanza, necessaria per i punti, altrimenti 0
          // nel caso dei mezzi devo controllare se un pezzo della tratta almeno è valida confrontanto il numero di tratte corrispodenti a quelli finali
          // se sono sempre nello stesso mezzo di trasporto do i punti, controllo SameRefTrasportRoute
          let points = 0;
          if (tracks > 1 && activityChoice.type !== "Public") {
            console.log(activityChoice.type);
            // totDistance è in kilometri
            points = pointActivityAnalyzed(
              activity,
              totDistance,
              distance,
              activityChoice,
              PrecDistanceSameMode,
              null,
              NewTrace
            );
            // se ho trovato delle linee calcolo i punti per quel tratto
          } else if (
            tracks > 1 && refTrasportRoute ? refTrasportRoute.length : false
          ) {
            // totDistance è in kilometri

            const basePoint = calcolatePoints(
              totDistance,
              PrecDistanceSameMode,
              activityChoice.type
            );
            const newPoint = calcolatePoints(
              totDistance + distance,
              PrecDistanceSameMode,
              activityChoice.type
            );
            points = newPoint - basePoint;

            console.log(points);
          }
          // consuma l'attivita trovata e la conserva in activityAnalyzed, utile alla fine
          // questa aggiorna i punti e da una visualizzazione del popup con i punti ottenuti
          // e l'attivita scelta, ovviamente se ci sono i punti allora l'attivita e la distanza l'attivita è stata correttamente validata

          /* 
          Alert.alert(
            "Punti " +
            points.toFixed(0) +
            " Distanza " +
            distance.toFixed(3) +
            " Kilometri" +
            " Attivita: " +
            activityChoice.type
          ); 
          */

          // siccome ho preso i dati da redux quindi non so se nel mentre le posizione gps si sono aggiornate
          // tolgo dallo stato soltanto quelle prese
          // questo perche l'azione viene inviata un po dopo data la richiesta axios, e i dati da validare prima

          // in realta l'ultimo punto mi serve per continuare la tratta successiva quindi lo metto in in route
          // cosi d'avere un riferimento per continuazione della tratta
          const ValidRouteLength = NewTrace.length;
          RouteRemained.splice(0, ValidRouteLength - 1);

          // della tratta validata salvo tutto tranne l'ultimo punto
          let ValidRouteWithoutLast = [...NewTrace];

          // tempo della tratta in millisecondi
          const time_travelled =
            ValidRouteWithoutLast[ValidRouteWithoutLast.length - 1].time -
            ValidRouteWithoutLast[0].time;

          // // prendo la velocita media
          // // sommo le velocita
          // let speed = ValidRouteWithoutLast.reduce(
          //   (total, elem, index, array) => {
          //     if (elem.speed === -1) {
          //       // considero una velocità media dell'attività scelta
          //       // activityChoice.type
          //       const speed = getDefaultSpeed(activityChoice.type);
          //       return total + speed;
          //     } else {
          //       return total + elem.speed;
          //     }
          //   },
          //   0
          // );

          // // medio
          // speed = speed / ValidRouteWithoutLast.length;

          ValidRouteWithoutLast.pop();

          // peso e altezza default come quelli uomo
          let weight = 74;
          let height = 1.75;

          try {
            const infoProfile = action.infoProfile;

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

          // aggiungo per dati necessati poi per il backend come calories e modality
          // calcolo calorie mediante peso, altezza, tipo attivita e distanza

          const duration = Math.round(
            ((time_travelled % 86400000) % 3600000) / 60000
          ); // conversione in minuti

          // le calorie dipendono dall'attivita scelta, se coerente allora è l'attivita scelta altrimenti è quella di quando sono fermo tipo Public che è il valore piu piccolo possibile
          // speed e height non li uso piu

          const calories = getCalories(
            weight,
            duration,
            points === 0 ? "Public" : activityChoice.type
          );
          // preparo qualche info per il db come il tipo di attivita riconosciuta
          // nel caso di walking e biking bastano i punti
          // nel caso di public controllo se è stato trovato una linea di un autobus oppure c'e un match ovvero non c'e -1

          //  let coef = activityChoice.coef;
          ValidRouteWithoutLast = ValidRouteWithoutLast.map(elem => {
            return {
              ...elem,
              calories,
              modality:
                activityChoice.type !== "Public"
                  ? points === 0
                    ? null
                    : activityChoice.type
                  : refTrasportRoute
                    ? refTrasportRoute.length
                      ? "Public"
                      : "Auto"
                    : NumRouteValid
                      ? NumRouteValid.indexOf(-1) === -1
                        ? "Public"
                        : "Auto"
                      : null
            };
          });

          // oltre ad aggiornare punti e distanza, aggiorno il numero di tratte corrisposte alle tratte dei mezzi, utili nella validazione finale

          if (action.index === 0) {
            let newRefTrasportRoute = [];
            // controllo se le nuove linee trovate non sono comprese in quelle di prima prima di salvare
            if (refTrasportRoute) {
              if (activityChoice.coef === 1200) {
                // per la metro non c'e bisogno di pulite le tratte dei mezzi dato che mi conservo solo se la stazione o 
                newRefTrasportRoute = refTrasportRoute
              } else {
              console.log("salvataggio nuove tratte");

              const previousRef = state.refTrasportRoute.reduce(
                (total, linee, index, array) => {
                  //unisco tutte le linee trovate
                  return [...total, ...linee];
                },
                []
              );
              console.log(previousRef);
              newRefTrasportRoute = refTrasportRoute.reduce(
                (total, linea, index, array) => {
                  const lineaUsefull = linea.geometry
                    ? linea.geometry.type === "MultiLineString" ||
                    linea.geometry.type === "LineString"
                    : false;
                  if (lineaUsefull) {
                    // se è utile l'aggiungo
                    if (
                      !previousRef.filter(elem => elem.id === linea.id).length
                    ) {
                      return [...total, linea];
                    } else {
                      // se si ripete mi salvo solo id
                      return [...total, { id: linea.id }];
                    }
                  } else {
                    return total;
                  }
                },
                []
              );
              console.log(newRefTrasportRoute);
            }
          }

            return {
              ...state,
              route: RouteRemained,
              routeAnalyzed: [...state.routeAnalyzed, ...ValidRouteWithoutLast],
              activity: ActivityRemained,
              activityAnalyzed: [...state.activityAnalyzed, ...activity],
              points,
              totPoints: state.totPoints + points,
              distance,
              totDistance: state.totDistance + distance,
              status: DefaultState.status,
              numValidRoute: NumRouteValid
                ? [...state.numValidRoute, NumRouteValid]
                : state.numValidRoute,
              refTrasportRoute: refTrasportRoute
                ? [...state.refTrasportRoute, newRefTrasportRoute]
                : state.refTrasportRoute
            };
          } else {
            const newState = { ...state };

            // controllo se le nuove linee trovate non sono comprese in quelle di prima prima di salvare
            if (refTrasportRoute) {
              if (activityChoice.coef === 1200) {
                 // per la metro non c'e bisogno di pulite le tratte dei mezzi dato che mi conservo solo se la stazione o 
                newRefTrasportRoute = refTrasportRoute
              } else {
              const previousRef = newState.PreviousRoute[
                action.index - 1
              ].refTrasportRoute.reduce((total, linee, index, array) => {
                //unisco tutte le linee trovate
                return [...total, linee];
              }, []);
              newRefTrasportRoute = refTrasportRoute.reduce(
                (total, linea, index, array) => {
                  if (
                    !previousRef.filter(elem => elem.id === linea.id).length
                  ) {
                    return [...total, linea];
                  } else {
                    // se si ripete mi salvo solo id
                    return [...total, { id: elem.id }];
                  }
                },
                []
              );
            }
          }

            // aggiorno la stato di una delle tratte precedenti
            newState.PreviousRoute[action.index - 1] = {
              ...newState.PreviousRoute[action.index - 1],
              route: RouteRemained,
              routeAnalyzed: [
                ...newState.PreviousRoute[action.index - 1].routeAnalyzed,
                ...ValidRouteWithoutLast
              ],
              activity: ActivityRemained,
              activityAnalyzed: [
                ...newState.PreviousRoute[action.index - 1].activityAnalyzed,
                ...activity
              ],
              points,
              totPoints:
                newState.PreviousRoute[action.index - 1].totPoints + points,
              distance,
              totDistance:
                newState.PreviousRoute[action.index - 1].totDistance + distance,
              status: DefaultState.status,
              numValidRoute: NumRouteValid
                ? [
                  ...newState.PreviousRoute[action.index - 1].numValidRoute,
                  NumRouteValid
                ]
                : newState.PreviousRoute[action.index - 1].numValidRoute,
              refTrasportRoute: refTrasportRoute
                ? [
                  ...newState.PreviousRoute[action.index - 1]
                    .refTrasportRoute,
                  newRefTrasportRoute
                ]
                : newState.PreviousRoute[action.index - 1].refTrasportRoute
            };
            return newState;
          }
        }
        // altrimenti questa tratta è stata spostata, quindi la validazione deve essere effettuata su un previous route mediante lo stop
        return state;
      }
      break;

    case START_LOCATION:
      {
        // cancello eventuali dati precedenti
        // calcolo PrecDistanceSameMode per sapere la distanza che ho compiuto negli ultimi 45 min con lo stesso mezzo
        // prendo le tratte precedenti e quelle salvate nel db
        const PrecDistanceSameMode = PrecDistanceSameModeCalcolate(
          state.PreviousRoute,
          action.routeSaved,
          action.activityChoice
        );

        // se ne inizio una nuova sicuramente quella di prima era l'ultimo segmento, per sicurezza aggiorno lo stato se necessario
        let previousRouteWithoutLastSegment = [];
        // controllo se prima c'e qualche route precedente prima di modificarla
        if (state.PreviousRoute.length > 0) {
          previousRouteWithoutLastSegment = [...state.PreviousRoute];
          // cosi lo stop finale non è un segmento sicuro
          previousRouteWithoutLastSegment[
            previousRouteWithoutLastSegment.length - 1
          ].isSegment = false;
        }

        return {
          ...DefaultState,
          still_notification_log: state.still_notification_log,
          activityChoice: action.activityChoice,
          DailyRoutine: state.DailyRoutine,
          PreviousRoute: previousRouteWithoutLastSegment,
          PrecDistanceSameMode: PrecDistanceSameMode,
          previousType: action.activityChoice.type
        };
      }
      break;

    case LOG_OUT:
      {
        // cancello tutto
        return DefaultState;
      }
      break;

    case ADD_WEATHER:
      {
        // aggiungo il tipo di meteo
        return {
          ...state,
          typeWeather: action.typeWeather
        };
      }
      break;

    case STOP_LOCATION:
      {
        // se ho della tratta fatta la salvo in PreviousRoute

        // tolgo l'eventuale ultimo segmento se composto solo da un punto
        // ovvero quando l'utente cambia attivita ma poi preme subito stop
        // ovvero quando route è 1 quindi metto > 1

        if (state.route.length > 1 || state.routeAnalyzed.length > 0) {
          // tempo della tratta  in millisecondi

          const timeStart = state.routeAnalyzed.length
            ? state.routeAnalyzed[0].time
            : state.route[0].time;

          const time_travelled = new Date().getTime() - timeStart;

          NewPreviousRoute = {
            route: state.route,
            routeAnalyzed: state.routeAnalyzed,
            activity: state.activity,
            activityAnalyzed: state.activityAnalyzed,
            points: state.points,
            totPoints: state.totPoints,
            distance: state.distance,
            totDistance: state.totDistance,
            status: state.status,
            numValidRoute: state.numValidRoute,
            activityChoice: state.activityChoice,
            refTrasportRoute: state.refTrasportRoute,
            typeWeather: state.typeWeather,
            PrecDistanceSameMode: state.PrecDistanceSameMode,
            speed: state.speed,
            time_travelled: time_travelled,
            distanceLive: state.distanceLive
          };

          let multiRouteId = undefined;
          if (state.PreviousRoute.length > 0) {
            if (
              state.PreviousRoute[state.PreviousRoute.length - 1]
                .multiRouteId &&
              state.PreviousRoute[state.PreviousRoute.length - 1].isSegment ==
              true
            ) {
              multiRouteId =
                state.PreviousRoute[state.PreviousRoute.length - 1]
                  .multiRouteId;

              NewPreviousRoute.multiRouteId = multiRouteId;
            }
          }

          return {
            ...DefaultState,
            previousType: state.previousType,
            DailyRoutine: state.DailyRoutine,
            PreviousRoute: [...state.PreviousRoute, NewPreviousRoute]
          };
        } else {
          // mentre se non ho una tratta fatta non la salvo
          // ma cancello che l'ultima è un segmento cosi sono sicuro che la invio
          let previousRouteWithoutLastSegment = [];
          // controllo se prima c'e qualche route precedente prima di modificarla
          if (state.PreviousRoute.length > 0) {
            previousRouteWithoutLastSegment = [...state.PreviousRoute];
            // cosi lo stop finale non è un segmento sicuro
            previousRouteWithoutLastSegment[
              previousRouteWithoutLastSegment.length - 1
            ].isSegment = false;
          }
          return {
            ...DefaultState,
            previousType: state.previousType,
            DailyRoutine: state.DailyRoutine,
            PreviousRoute: previousRouteWithoutLastSegment
          };
        }
      }
      break;

    case UPDATE_STATUS:
      {
        // aggiorno lo stato dell'attivita di riconoscimento tipo validazione in corso
        // se 0 allora aggiorno la stato della tratta in corso
        if (action.index === 0) {
          return {
            ...state,
            status: action.status
          };
        }
        // controllo se quello stato è presente
        if (state.PreviousRoute.length >= action.index) {
          const newState = { ...state };
          // aggiorno la stato di una delle tratte precedenti
          newState.PreviousRoute[action.index - 1].status = action.status;
          return newState;
        } else {
          return state;
        }
      }
      break;

    case ADD_DAILY_ROUTINE:
      {
        // aggiungo la nuova routine
        return {
          ...state,
          DailyRoutine: [...state.DailyRoutine, action.route]
        };
      }
      break;

    case UPDATE_PREVIOUS_ROUTE:
      {
        const newState = { ...state };

        // aggiorno la stato di una delle tratte precedenti, modificando solo i dati che ricevo da info
        newState.PreviousRoute[action.index - 1] = {
          ...newState.PreviousRoute[action.index - 1],
          ...action.info
        };
        return newState;
      }
      break;

    case DELETE_ROUTE:
      {
        const newState = { ...state };

        // tolgo le prime route precedenti
        // cancellando solo le info non piu utili ma mantendo l'elemento nell'array
        // essendo che uso un indice per spaere quale elemento devo aggiornare
        // // conservo l'ultimo punto di route e il primo di routeAnalyzed, utile per unire i segment e per calcolare anche le route precedenti con lo stesso mezzo
        // ripulisco anche lo status
        // console.log(action.payload);
        for (
          position = action.payload.start - 1;
          position < action.payload.start + action.payload.size;
          position++
        ) {
          newState.PreviousRoute[position].route = [
            newState.PreviousRoute[position].route[
            newState.PreviousRoute[position].route.length - 1
            ]
          ];
          newState.PreviousRoute[position].routeAnalyzed = [
            newState.PreviousRoute[position].routeAnalyzed[0]
          ];
          newState.PreviousRoute[position].activity = [];
          newState.PreviousRoute[position].activityAnalyzed = [];
          newState.PreviousRoute[position].refTrasportRoute = [];
          newState.PreviousRoute[position].Saved = true;
          newState.PreviousRoute[position].status = "";
        }

        return newState;
      }
      break;

    case CHANGE_ACTIVITY:
      {
        console.log(state);
        // cambio il tipo di attivita scelta,
        // ricevo activityChoice che lo uso per aggiornare quella corrente
        const lengthRoute = state.route.length;
        const lengthRouteAnalyzed = state.routeAnalyzed.length;
        if (lengthRoute > 1 || lengthRouteAnalyzed > 1) {
          // prendo le ultime posizioni salvate, usate come base per la nuova sotto route

          BaseRoute = state.route[lengthRoute - 1];

          const PrecDistanceSameMode = PrecDistanceSameModeCalcolate(
            state.PreviousRoute,
            action.routeSaved,
            action.activityChoice
          );

          let multiRouteId = +new Date();
          if (state.PreviousRoute.length > 0) {
            if (
              state.PreviousRoute[state.PreviousRoute.length - 1]
                .multiRouteId &&
              state.PreviousRoute[state.PreviousRoute.length - 1].multiRouteId
                .isSegment == true
            ) {
              multiRouteId =
                state.PreviousRoute[state.PreviousRoute.length - 1]
                  .multiRouteId;
            }
          }
          // aggiungo una variabile aggiuntiva che mi faccia capire che la ruote fatta è un segment
          // quindi solo l'ultimo segment non avra questo valore

          const timeStart = state.routeAnalyzed.length
            ? state.routeAnalyzed[0].time
            : state.route[0].time;

          const time_travelled = new Date().getTime() - timeStart;

          return {
            ...DefaultState,
            route: [BaseRoute],
            activityChoice: action.activityChoice,
            DailyRoutine: state.DailyRoutine,
            previousType: action.activityChoice.type,

            PrecDistanceSameMode,
            speed: BaseRoute.speed,
            PreviousRoute: [
              ...state.PreviousRoute,
              {
                route: state.route,
                routeAnalyzed: state.routeAnalyzed,
                activity: state.activity,
                activityAnalyzed: state.activityAnalyzed,
                points: state.points,
                totPoints: state.totPoints,
                distance: state.distance,
                totDistance: state.totDistance,
                status: state.status,
                numValidRoute: state.numValidRoute,
                activityChoice: state.activityChoice,
                refTrasportRoute: state.refTrasportRoute,
                PrecDistanceSameMode: state.PrecDistanceSameMode,
                typeWeather: state.typeWeather,
                isSegment: true,
                speed: state.speed,
                multiRouteId,
                time_travelled: time_travelled,
                distanceLive: state.distanceLive
              }
            ]
          };
        } else {
          // mentre se non ho una tratta fatta precedente non la salvo
          // come se non fosse successo niente
          // cambia solo l'attivita se l'inizio
          // poiche ho 0-1 route e quindi non cambia nulla per il tipo di attivita successiva
          const PrecDistanceSameMode = PrecDistanceSameModeCalcolate(
            state.PreviousRoute,
            action.routeSaved,
            action.activityChoice
          );
          return {
            ...state,
            PrecDistanceSameMode,
            previousType: action.activityChoice.type,
            activityChoice: action.activityChoice
          };
        }
      }
      break;

    default:
      {
        return state;
      }
      break;
  }
}

// controllo attivita fatta in questo intervallo e ritorna dei punti
// avendo la distanza totale gia percorsa e la nuova distanza fatta in questo momento
// passo anche il coefficiente per calcolare i nuovi punti
// l'attivita passata
// distanza effettuate nelle route precedenti di 45 min massimo
// ThresholdActivitySet, soglia per dare i punti, se non c'e è quella standard

export function pointActivityAnalyzed(
  activity,
  baseDistance,
  distance,
  activityChoice,
  PrecDistanceSameMode,
  ThresholdActivitySet,
  Trace = []
) {
  console.log(Trace)
  // ho 0 punti
  let points = 0;
  // tolgo i dati delle attivita trascurabili come UNKNOWN o STILL, considerando sia ios che android
  // tolgo questo valore e metto come valore piu probabile il secondo tipo walking 40
  // ovviamente il secondo potrebbe essere anche still quindi lo tolgo anche
  // doppio controllo, prima di controllare il secondo valore controllo se c'e

  // tolgo i valori se sono fermo cosi ho soltanto le attivita che mi interessano
  console.log(activity);

  // se sono in bici tolgo l'auto come attività dato che se vado veloce sembra un auto
  // CleanActivity[i][0].type === "IN_VEHICLE" ||
  //           CleanActivity[i][0].type === "AUTOMOTIVE"

  let CleanActivity = []
  switch (activityChoice.type) {
    case "Biking":
      {

        CleanActivity = activity.map(value =>
          value.activity[0].type !== "UNKNOWN" &&
            value.activity[0].type !== "TILTING" &&
            value.activity[0].type !== "UNIDENTIFIABLE" && 
            value.activity[0].type !== "IN_VEHICLE"
            ? value.activity[0].type !== "STATIONARY" &&
              value.activity[0].type !== "STILL" && 
              value.activity[0].type !== "AUTOMOTIVE" 
              ? value.activity
              : null
            : value.activity[1]
              ? value.activity[1].type !== "UNKNOWN" &&
                value.activity[1].type !== "TILTING" &&
                value.activity[1].type !== "UNIDENTIFIABLE"
                ? value.activity[1].type !== "STATIONARY" &&
                  value.activity[1].type !== "STILL"
                  ? value.activity.splice(0, 1)
                  : null
                : value.activity[2]
                  ? value.activity[2].type !== "UNKNOWN" &&
                    value.activity[2].type !== "TILTING" &&
                    value.activity[2].type !== "UNIDENTIFIABLE"
                    ? value.activity[2].type !== "STATIONARY" &&
                      value.activity[2].type !== "STILL"
                      ? value.activity.splice(0, 2)
                      : null
                    : value.activity[3]
                      ? value.activity[3].type !== "UNKNOWN" &&
                        value.activity[3].type !== "TILTING" &&
                        value.activity[3].type !== "UNIDENTIFIABLE"
                        ? value.activity[3].type !== "STATIONARY" &&
                          value.activity[3].type !== "STILL"
                          ? value.activity.splice(0, 3)
                          : null
                        : null
                      : null
                  : null
              : null
        );
        break;
      }
    default:
      {
        CleanActivity = activity.map(value =>
          value.activity[0].type !== "UNKNOWN" &&
            value.activity[0].type !== "TILTING" &&
            value.activity[0].type !== "UNIDENTIFIABLE"
            ? value.activity[0].type !== "STATIONARY" &&
              value.activity[0].type !== "STILL"
              ? value.activity
              : null
            : value.activity[1]
              ? value.activity[1].type !== "UNKNOWN" &&
                value.activity[1].type !== "TILTING" &&
                value.activity[1].type !== "UNIDENTIFIABLE"
                ? value.activity[1].type !== "STATIONARY" &&
                  value.activity[1].type !== "STILL"
                  ? value.activity.splice(0, 1)
                  : null
                : value.activity[2]
                  ? value.activity[2].type !== "UNKNOWN" &&
                    value.activity[2].type !== "TILTING" &&
                    value.activity[2].type !== "UNIDENTIFIABLE"
                    ? value.activity[2].type !== "STATIONARY" &&
                      value.activity[2].type !== "STILL"
                      ? value.activity.splice(0, 2)
                      : null
                    : value.activity[3]
                      ? value.activity[3].type !== "UNKNOWN" &&
                        value.activity[3].type !== "TILTING" &&
                        value.activity[3].type !== "UNIDENTIFIABLE"
                        ? value.activity[3].type !== "STATIONARY" &&
                          value.activity[3].type !== "STILL"
                          ? value.activity.splice(0, 3)
                          : null
                        : null
                      : null
                  : null
              : null
        );
      }
      break;
    }

      console.log(CleanActivity);

      CleanActivity = CleanActivity.filter(elem => elem);
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

              // se sei in bici ma ti muovi a piedi, va bene lo stesso per i punti poiche alla fine ti diamo meno punti
              for (i = 0; i < lengthActivity; i++) {
                console.log(CleanActivity[i][0]);

                CleanActivity[i][0].type === "ON_BICYCLE" ||
                  CleanActivity[i][0].type === "CYCLING" ||
                  CleanActivity[i][0].type === "ON_FOOT" ||
                  CleanActivity[i][0].type === "RUNNING" ||
                  CleanActivity[i][0].type === "WALKING"
                  ? ++myActivity
                  : myActivity;
              }
            }
            break;
          case "Walking":
            {
              // la confronto con l'attivita scelta
              for (i = 0; i < lengthActivity; i++) {
                console.log(CleanActivity[i][0]);

                CleanActivity[i][0].type === "ON_FOOT" ||
                  CleanActivity[i][0].type === "RUNNING" ||
                  CleanActivity[i][0].type === "WALKING"
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
                console.log(CleanActivity[i][0]);

                CleanActivity[i][0].type === "IN_VEHICLE" ||
                  CleanActivity[i][0].type === "AUTOMOTIVE"
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
        let ThresholdActivity;
        // se passo la soglia, usa quella passata
        if (ThresholdActivitySet) {
          ThresholdActivity = ThresholdActivitySet;
        } else {
          // altrimenti uso quella standard
          // soglia differente per altri mezzi tipo tipo bus
          switch (activityChoice.type) {
            case "Public":
              {
                ThresholdActivity = 0.0;
              }
              break;
            default:
              {
                ThresholdActivity = Platform.OS == "android" ? 0.3 : 0.15;
              }
              break;
          }
        }

        console.log(ThresholdActivity);

        if (myActivity / lengthActivity >= ThresholdActivity) {
          // calcolo i punti di base nella funzione, partendo dalla distanza gia percorsa utile per calcolare la variazione del valore nella funzione con
          // la nuova distanza
          // la distanza è in kilometri

          const basePoint = calcolatePoints(
            baseDistance,
            PrecDistanceSameMode,
            activityChoice.type
          );
          const newPoint = calcolatePoints(
            baseDistance + distance,
            PrecDistanceSameMode,
            activityChoice.type
          );
          points = newPoint - basePoint;
          // per i test
          // points = 1;
          console.log(points);
        }
      } else if (Trace.length && activityChoice.type !== 'Public') {
        // non per l'interà tratta dato che non passo il segmento 
        // nel caso del segmento e quindi analizzo 4 punti vedo se mi puo servire la velocità

        // nel caso ios sopprattutto 
        // Trace
        // controllo la velocità se non ho l'attività
        const speed = Trace.map(elem => elem.speed);
        console.log(speed)
        const max = Math.max.apply(null, speed);
        console.log(max)
        // se max allora non ho una velocità utile 
        if (max == 0) {
          points = 0
        } else  if (max < 10.0) {
          // se la velocita è inferiore a 10 allora sono in bici o a piedi 
          const basePoint = calcolatePoints(
            baseDistance,
            PrecDistanceSameMode,
            activityChoice.type
          );
          const newPoint = calcolatePoints(
            baseDistance + distance,
            PrecDistanceSameMode,
            activityChoice.type
          );
          points = newPoint - basePoint;
        }

      } else if (activityChoice.type === 'Public') {
        const basePoint = calcolatePoints(
          baseDistance,
          PrecDistanceSameMode,
          activityChoice.type
        );
        const newPoint = calcolatePoints(
          baseDistance + distance,
          PrecDistanceSameMode,
          activityChoice.type
        );
        points = newPoint - basePoint;
      }

      return points;
  }

  // tiene conto anche di un eventuale distanza precedente gia effettuata
  export function exponent(x, beforeX, c, threshold) {
    // calcolo i punti ricordando che sto passando kilometri
    /*  console.log(x);
    console.log(beforeX);
    console.log(c);
    console.log(threshold); */
    const dayDistance = x + beforeX;
    let y = 0;
    if (dayDistance <= threshold) {
      y = ((Math.sqrt(threshold / 3) * c) / threshold) * x;
    } else {
      y = Math.sqrt(dayDistance / 3) * c;
      console.log(y);
      if (beforeX > threshold) {
        y -= Math.sqrt(beforeX / 3) * c;
      } else {
        y -= ((Math.sqrt(threshold / 3) * c) / threshold) * beforeX;
      }
    }
    console.log(y);
    // formula vecchia
    // y = (Math.sqrt((x + beforeX) / 3) - Math.sqrt(beforeX / 3)) * c;
    //console.log(y);
    return y;
  }

  // ritorna il coefficiente relativo all'attivita scelta
  export function coefActivity(type) {
    //coefficienti per il calcolo della distanza equivalente per i diversi mezzi di trasporto
    //   walk	1
    // bike	0,5
    // pt	0,2
    // cp_a	0,1
    // cp_p	0,1

    // caso locale con i nomi
    // online con i numeri

    let coef = 1;
    switch (type) {
      case "Biking":
      case 2:
        {
          coef = 0.5;
        }
        break;
      case "Walking":
      case 1:
        {
          ccoef = 1;
        }
        break;
      case "Public":
      case 3:
        {
          coef = 0.2;
        }
        break;
      default:
        {
          coef = 1;
        }
        break;
    }
    return coef;
  }

  // tiene conto anche di un eventuale distanza precedente gia effettuata
  // k è la vecchia c che adesso è uguale per tutti i mezzi
  // c è il coefficiente dello specifico mezzo di trasporto
  export function calcolatePoints(x, beforeX, type) {
    // calcolo i punti ricordando che sto passando kilometri
    // coef del tipo di attivita
    // coef della curva
    console.log("tipologia");
    console.log(type);
    const c = coefActivity(type);
    const k = 1200;
    const threshold = 5;
    const dayDistance = x * c + beforeX;
    let y = 0;
    if (dayDistance <= threshold) {
      y = ((Math.sqrt(threshold / 3) * k) / threshold) * x * c;
    } else {
      y = Math.sqrt(dayDistance / 3) * k;
      console.log(y);
      if (beforeX > threshold) {
        y -= Math.sqrt(beforeX / 3) * k;
      } else {
        y -= ((Math.sqrt(threshold / 3) * k) / threshold) * beforeX;
      }
    }
    console.log(y);

    //bisogna sovrascrivere il valore finale di beforeX

    return y;
  }

  // calcolo km delle tratte precedenti di tutti i tipi
  // PreviousRoute, route da controllare
  // SavedRoute, route prese dal db
  // activityChoice, tipo di attivita da cercare
  function PrecDistanceSameModeCalcolate(
    PreviousRoute,
    SavedRoute,
    activityChoice
  ) {
    /* 
    console.log(PreviousRoute);
    console.log(SavedRoute);
    console.log(activityChoice); 
    */
    // setto PrecDistanceSameMode per sapere la distanza che ho compiuto negli ultimi 45 min con lo stesso mezzo
    // prendo le tratte precedenti
    let PrecDistanceSameMode = 0;
    // intervallo da considerare

    // ora si fa il calcolo considerando le route effettuare a partire dalle 4:30 dello stesso giorno
    const hourStart = 16200000; // 4:30
    const Routes = PreviousRoute.length;
    const Now = new Date();
    const dayNow = Now.toDateString();
    console.log("controllo tratte dello stesso tipo");
    console.log(dayNow);
    console.log(new Date(dayNow).getTime());
    const checkStart = new Date(dayNow).getTime() + hourStart; // oggi alle 4:30
    console.log(checkStart);
    console.log(new Date(checkStart).toString());

    // prima calcolo sulle route precedenti
    for (routeId = 1; routeId <= Routes; routeId++) {
      const Segment = PreviousRoute[routeId - 1]
        ? PreviousRoute[routeId - 1]
        : null;
      // se il segmento esiste
      if (Segment) {
        const NumRoute = Segment.route.length;
        // prendo la data dell'ultima posizione presa, che è presente su route
        const end = Segment.route[NumRoute - 1].time;
        // se è di oggi ( ovvero dopo le 4:30 ) la considero per la distanza finale con il relativo coef.
        // se è stata salvata nel db, non deve essere considerata poiche la considero poi nella route del db
        if (!Segment.Saved && end >= checkStart) {
          console.log(
            "c'e una Distanza precedente con mezzi differenti offline  "
          );

          console.log("coef");
          console.log(Segment.activityChoice.type);
          const c = coefActivity(Segment.activityChoice.type);
          console.log(c);
          // incremento la distanza precedente
          // se ho gia analizzato tutta la route precedente allora totDistance è quella totale
          if (Segment.route.length === 1) {
            PrecDistanceSameMode += Segment.totDistance * c;
          } else {
            // se totDistance non è quella totale, calcolo il rimanente
            PrecDistanceSameMode += Segment.totDistance * c;
            // aggiunge quelle non calcolate di route non analizzate

            const { route } = Segment;
            for (i = 0; i < route.length - 1; i++) {
              // haversine restituisce kilometri
              PrecDistanceSameMode +=
                parseFloat(
                  haversine(
                    route[i].latitude,
                    route[i].longitude,
                    route[i + 1].latitude,
                    route[i + 1].longitude
                  )
                ) * c;
            }
          }
        }
      }
    }
    // poi sulle route del db
    for (routeIdSave = 1; routeIdSave <= SavedRoute.length; routeIdSave++) {
      // prendo la data dalle info del db
      // se esiste
      if (SavedRoute[routeIdSave - 1]) {
        const end = new Date(SavedRoute[routeIdSave - 1].end_time).getTime();
        //console.log(Now);
        //console.log(end);
        // se è di oggi ( ovvero dopo le 4:30 ) la considero per la distanza finale con il relativo coef.
        // aggiungere in if appena si ha il dato di quando è conclusa la tratta
        // && parseFloat(parseFloat(Now - end) / 60000) <= min
        if (end >= checkStart) {
          // vedo se è una tratta multipla. se si allora considero i simgoli pezzi

          // tratta singola e vedo se è valida
          if (
            !SavedRoute[routeIdSave - 1].distanceRoute &&
            SavedRoute[routeIdSave - 1].validated
          ) {
            console.log("coef");
            console.log(SavedRoute[routeIdSave - 1].modal_type);
            const c = coefActivity(SavedRoute[routeIdSave - 1].modal_type);
            console.log(c);
            console.log(
              "c'e una Distanza precedente con mezzi differenti online "
            );
            // incremento la distanza precedente relativa ai 45 min

            PrecDistanceSameMode +=
              SavedRoute[routeIdSave - 1].distance_travelled * c;
          } else if (SavedRoute[routeIdSave - 1].distanceRoute) {
            // se multipla
            const numRoute = SavedRoute[routeIdSave - 1].distanceRoute.length;
            for (singleRoute = 0; singleRoute < numRoute; singleRoute++) {
              if (SavedRoute[routeIdSave - 1].validatedRoute[singleRoute]) {
                const c = coefActivity(
                  SavedRoute[routeIdSave - 1].modal_type[singleRoute]
                );
                PrecDistanceSameMode +=
                  SavedRoute[routeIdSave - 1].distanceRoute[singleRoute] * c;
              }
            }
          }
        }
      }
    }
    return PrecDistanceSameMode;
  }
