import {
  START_LOGIN,
  FAIL_LOGIN,
  COMPLETE_ROUTE,
  FAIL_REFRESH,
  CHANGE_STATUS_BUTTON,
  ADD_FREQUENT_ROUTE,
  DELETE_FREQUENT_ROUTE_NOT_SAVE,
  LOG_OUT,
  UPDATE_LOGIN,
  SET_NOTIFICATION_TIME,
  DELETE_MFR,
  SET_SERIES,
  SET_CHOOSED_WEEKDAYS,
  SET_NOTIFICATION_SUNDAY_IDS,
  SET_NOTIFICATION_SCHEDULED_IDS,
  DELETE_NOTIFICATION_SUNDAY_IDS,
  DELETE_NOTIFICATION_SCHEDULED_IDS,
  SET_STILL_NOTIFICATION,
  SET_CAR_PROPERTIES,
  SET_MOTO_PROPERTIES,
  ADD_FREQUENT_ROUTE_FROM_RECAP,
  SET_REMOTE_NOTIFICATION_ID,
  SET_FIRST_CONFIGURATION,
  SET_COMPLETE_UPDATE_FEED,
  UPDATE_COMPLETE_UPDATE_FEED,
  UPDATE_OPEN_UPDATE_FEED,
  SET_LANGUAGE,
  DELETE_DATA_PROFILE_OFFLINE,
  CHANGE_TYPEFORM_USER_VALUE,
  SET_RIGHT_MENU_STATE,
  NEW_BEST_SCORE,
  COMPLETE_TUTORIAL,
  RESET_TUTORIAL,
  SET_SESSION_TOKEN,
  ADD_PAGE_COUNTED,
  RESET_PAGE_COUNTED,
  SET_SODDFRUST_FLAG,
  REFRESHING_TOKEN,
  DONE_REFRESHING_TOKEN,
  SAVE_TRIPS,
  DELETE_ROUTE,
  EDIT_MFR
} from "./ActionTypes";
import DefaultState from "./DefaultState";

export function getSameReferredRouteIdFromSavedArray(id, route) {
  let sameReferredRouteId = [];
  let found = false;

  let count = 0;
  try {
    route.forEach(el => {
      if (el.referred_route_id == id) {
        found = true;
        sameReferredRouteId.push(el);
        count++;
      }
    });
  } catch (error) {
    console.error(error);
  }

  if (found && count > 1) return sameReferredRouteId;
  else return false;
}

export function getArrayRoutesMerged(route) {
  let loginRoutes = route;
  let jsonWithMultiRoutes = [];
  let idToSkip = [];
  let jsonWithMultiRoutesSpread = [];

  try {
    route.forEach(element => {
      const condition =
        getSameReferredRouteIdFromSavedArray(
          element.referred_route_id,
          route
        ) != false;

      // la seconda parte della condizione serve a non ricontrollare lo stesso
      // id della tratta papa'
      if (condition && !idToSkip.includes(element.referred_route_id)) {
        jsonWithMultiRoutes.push(
          getSameReferredRouteIdFromSavedArray(element.referred_route_id, route)
        );
        idToSkip.push(element.referred_route_id);
      }
    });
  } catch (error) {
    console.error(error);
  }

  let jsonWithSingleRoutes = loginRoutes.filter(el => {
    return !idToSkip.includes(el.referred_route_id);
  });

  try {
    jsonWithMultiRoutes.forEach(el => {
      let emptyTrip = {
        calories: 0,
        coins: 0,
        distance_travelled: 0,
        points: 0,
        time_travelled: 0,
        id: el.id,
        referred_route_id: el.referred_route_id,
        referred_route:
          typeof el.referred_route === "Object" ? el.referred_route : null,
        modal_type: [],
        validatedRoute: [],
        distanceRoute: [],
        // route: [],

        segment_index: 0,
        validated: false,
        created_at: "2018-08-02T10:40:55.670962Z",
        end_time: "2018-08-02T10:40:34.640000Z",
        updated_at: "2018-08-02T10:40:55.670973Z"
      };
      el.forEach(elem => {
        emptyTrip.calories += elem.calories;
        emptyTrip.coins += elem.coins;
        emptyTrip.distance_travelled += Number.parseFloat(
          elem.distance_travelled
        );
        emptyTrip.referred_route_id = elem.referred_route_id;
        emptyTrip.referred_route = elem.referred_route;
        emptyTrip.points += elem.points;
        emptyTrip.time_travelled += elem.time_travelled;
        emptyTrip.modal_type.push(elem.modal_type);
        // emptyTrip.route.push(elem.route);
        emptyTrip.created_at = elem.created_at;
        emptyTrip.end_time = elem.end_time;
        emptyTrip.updated_at = elem.updated_at;
        emptyTrip.validatedRoute.push(elem.validated);
        emptyTrip.distanceRoute.push(elem.distance_travelled);

        if (elem.validated) emptyTrip.validated = true;
      });

      jsonWithMultiRoutesSpread.push(emptyTrip);
    });
  } catch (error) {
    console.error(error);
  }

  let jsonSingleAndMultiRoute = [
    ...jsonWithMultiRoutesSpread,
    ...jsonWithSingleRoutes
  ];

  return jsonSingleAndMultiRoute.sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  // console.log(jsonWithMultiRoutesSpread); // json con le tratte multiple spalmate
  // console.log(jsonWithMultiRoutes.length); // json con le tratte multiple
  // console.log(jsonWithSingleRoutes); // json con le tratte singole
  // console.log(this.props.dataSaved.length); // json con tutte le tratte
}

export default function loginReducer(state = DefaultState, action) {
  switch (action.type) {
    // case SET_COMPLETE_UPDATE_FEED:
    //   {
    //     let feedUpdateNew = state.feedUpdate
    //       ? state.feedUpdate
    //       : ["", "", "", "", ""];
    //     // specifico quale feed ho completato
    //     const Now = new Date().toDateString();
    //     feedUpdateNew[action.payload] = Now;
    //     return {
    //       ...state,
    //       feedUpdate: feedUpdateNew
    //     };
    //   }
    //   break;
    case SAVE_TRIPS:
      {
        const Route = action.payload.filter(
          trip => trip.end_time && trip.validation && trip.validation != 3
        );
        //  const Route = action.payload.filter(trip => trip.validation)

        return {
          ...state,
          status: "",
          Route
        };
      }
      break;

    case UPDATE_COMPLETE_UPDATE_FEED:
      {
        // mi salvo quando ho completato un feed
        // controllo se ho tutti i feed periodici altrimenti li aggiungo

        let feedUpdateNew = state.periodicFeed
          ? {
              0: { open: "", completed: "" },
              1: { open: "", completed: "" },
              2: { open: "", completed: "" },
              3: { open: "", completed: "" },
              4: { open: "", completed: "" },
              5: { open: "", completed: "" },
              6: { open: "", completed: "" },
              7: { open: "", completed: "" },
              8: { open: "", completed: "" },
              ...state.periodicFeed
            }
          : {
              0: { open: "", completed: "" },
              1: { open: "", completed: "" },
              2: { open: "", completed: "" },
              3: { open: "", completed: "" },
              4: { open: "", completed: "" },
              5: { open: "", completed: "" },
              6: { open: "", completed: "" },
              7: { open: "", completed: "" },
              8: { open: "", completed: "" }
            };
        // specifico quale feed ho completato

        const date = action.payload.Now;
        const num = action.payload.num;
        let newFeed = feedUpdateNew[num]
          ? feedUpdateNew[num]
          : { open: "", completed: "" };
        newFeed.completed = date;
        // indica quale feed ho completato con la data
        return {
          ...state,
          periodicFeed: { ...feedUpdateNew, [num]: newFeed }
        };
      }
      break;
    case UPDATE_OPEN_UPDATE_FEED:
      {
        // mi salvo quando ho aperto un feed
        // controllo se ho tutti i feed periodici altrimenti li aggiungo

        let feedUpdateNew = state.periodicFeed
          ? {
              0: { open: "", completed: "" },
              1: { open: "", completed: "" },
              2: { open: "", completed: "" },
              3: { open: "", completed: "" },
              4: { open: "", completed: "" },
              5: { open: "", completed: "" },
              6: { open: "", completed: "" },
              7: { open: "", completed: "" },
              8: { open: "", completed: "" },
              ...state.periodicFeed
            }
          : {
              0: { open: "", completed: "" },
              1: { open: "", completed: "" },
              2: { open: "", completed: "" },
              3: { open: "", completed: "" },
              4: { open: "", completed: "" },
              5: { open: "", completed: "" },
              6: { open: "", completed: "" },
              7: { open: "", completed: "" },
              8: { open: "", completed: "" }
            };
        // specifico quale feed ho completato aprendolo

        const date = action.payload.Now;
        const num = action.payload.num;
        let newFeed = feedUpdateNew[num]
          ? feedUpdateNew[num]
          : { open: "", completed: "" };
        newFeed.open = date;
        // indica quale feed ho completato con la data
        return {
          ...state,
          periodicFeed: { ...feedUpdateNew, [num]: newFeed }
        };
      }
      break;
    case START_LOGIN:
      {
        // aggiungere i dati relativi al login tipo token ecc

        if (action.payload.Route) {
          const newId = action.payload.Route[0]
            ? action.payload.Route[0].referred_route_id
            : 0;
          const oldId = state.Route[0] ? state.Route[0].referred_route_id : 0;

          // se ho delle route nuove oppure ho ricevuto piu route, aggiorno
          if (newId !== oldId) {
            const Route = getArrayRoutesMerged(action.payload.Route);
            return {
              ...state,
              status: "Connected",
              Route
            };
          }
          const newLastId = action.payload.Route[
            action.payload.Route.length - 1
          ]
            ? action.payload.Route[action.payload.Route.length - 1]
                .referred_route_id
            : 0;
          const oldLastId = state.Route[state.Route.length - 1]
            ? state.Route[state.Route.length - 1].referred_route_id
            : 0;
          if (newLastId !== oldLastId) {
            const Route = getArrayRoutesMerged(action.payload.Route);
            return {
              ...state,
              status: "Connected",
              Route
            };
          } else {
            return {
              ...state,
              status: "Connected"
            };
          }
        } else if (action.payload.mostFrequentRoute) {
          // prendo dallo stato se il profilo è stato aggiornato

          const feedUpdate = state.periodicFeed
            ? state.periodicFeed[1].completed
            : "";
          if (feedUpdate === "") {
            const update =
              action.payload.mostFrequentRoute.length < 3 ? false : true;
            if (update) {
              const Now = new Date().toDateString();
              let feedUpdateNew = state.periodicFeed
                ? state.periodicFeed
                : {
                    0: { open: "", completed: "" },
                    1: { open: "", completed: "" },
                    2: { open: "", completed: "" },
                    3: { open: "", completed: "" },
                    4: { open: "", completed: "" },
                    5: { open: "", completed: "" }
                  };
              // nel secondo c'e la data di quando sono state aggiornate le frequent trips metendone almeno 3

              // specifico quale feed ho completato

              feedUpdateNew[1].completed = Now;

              return {
                ...state,
                status: "Connected",
                ...action.payload,
                periodicFeed: { ...feedUpdateNew }
              };
            } else {
              return {
                ...state,
                status: "Connected",
                ...action.payload
              };
            }
          }
          return {
            ...state,
            status: "Connected",
            ...action.payload
          };
        } else if (action.payload.infoProfile) {
          // prendo dallo stato se il profilo è stato aggiornato

          const feedUpdate = state.periodicFeed
            ? state.periodicFeed[0].completed
            : "";

          if (feedUpdate === "") {
            const update = checkUpdateProfile(action.payload);
            console.log(update);
            if (!update) {
              const Now = new Date().toDateString();
              let feedUpdateNew = state.periodicFeed
                ? state.periodicFeed
                : {
                    0: { open: "", completed: "" },
                    1: { open: "", completed: "" },
                    2: { open: "", completed: "" },
                    3: { open: "", completed: "" },
                    4: { open: "", completed: "" },
                    5: { open: "", completed: "" }
                  };
              // nel primo c'e la data di quando è stato aggiornato il profilo con tutte le informazioni
              feedUpdateNew[0].completed = Now;
              console.log(feedUpdateNew);

              console.log("nuovo profilo");
              console.log(action.payload);

              return {
                ...state,
                status: "Connected",
                infoProfile: {
                  ...state.infoProfile,
                  ...action.payload.infoProfile
                },

                periodicFeed: { ...feedUpdateNew }
              };
            } else {
              return {
                ...state,
                status: "Connected",
                infoProfile: {
                  ...state.infoProfile,
                  ...action.payload.infoProfile
                }
              };
            }
          } else {
            console.log("nuovo profilo");
            console.log(action.payload);
            return {
              ...state,
              status: "Connected",
              infoProfile: {
                ...state.infoProfile,
                ...action.payload.infoProfile
              }
            };
          }
        } else {
          return {
            ...state,
            status: "Connected",
            ...action.payload
          };
        }
      }
      break;

    case SET_SERIES:
      {
        // quando inizio una nuova tratta vedo se devo aggiornare la srie
        // calcolo il numero di giorni di fila che hai fatto tratte

        // salvo numero di route della fila e in che giorno è stata completata

        // aggiorno i
        return {
          ...state,
          NumDaysRoute: action.NumDaysRoute
        };
      }
      break;

    case ADD_FREQUENT_ROUTE_FROM_RECAP:
      {
        // quando aggiungo una nuova routine cliccando sul tasto + del recap
        const baseFrequentTrips = state.addFrequentTrips
          ? state.addFrequentTrips
          : [];

        // quando aggiungo vedo se ho soddisfatto la condizione del numero di frequent trips aggiunte
        // considerando quelle che ho che piu 1

        const feedUpdate = state.periodicFeed
          ? state.periodicFeed[1].completed
          : "";
        if (feedUpdate === "") {
          const update = baseFrequentTrips.length + 1 < 3 ? false : true;
          if (update) {
            const Now = new Date().toDateString();
            let feedUpdateNew = state.periodicFeed
              ? state.periodicFeed
              : {
                  0: { open: "", completed: "" },
                  1: { open: "", completed: "" },
                  2: { open: "", completed: "" },
                  3: { open: "", completed: "" },
                  4: { open: "", completed: "" },
                  5: { open: "", completed: "" }
                };
            // nel secondo c'e la data di quando sono state aggiornate le frequent trips metendone almeno 3

            feedUpdateNew[1].completed = Now;
            return {
              ...state,
              status: "Connected",
              addFrequentTrips: [...baseFrequentTrips, action.payload],
              periodicFeed: { ...feedUpdateNew }
            };
          } else {
            return {
              ...state,
              addFrequentTrips: [...baseFrequentTrips, action.payload]
            };
          }
        }
        return {
          ...state,
          addFrequentTrips: [...baseFrequentTrips, action.payload]
        };
      }
      break;

    case UPDATE_LOGIN:
      {
        // aggiungere i dati relativi al login, aggiungendo i dati in uno specifico parametro dentro login

        if (action.type_payload === "infoProfile") {
          const Profile = {
            ...state[action.type_payload],
            ...action.payload
          };

          // prendo dallo stato se il profilo è stato aggiornato

          const feedUpdate = state.periodicFeed
            ? state.periodicFeed[0].completed
            : "";

          if (feedUpdate === "") {
            const update = checkUpdateProfile(Profile);
            if (!update) {
              const Now = new Date().toDateString();
              let feedUpdateNew = state.periodicFeed
                ? state.periodicFeed
                : {
                    0: { open: "", completed: "" },
                    1: { open: "", completed: "" },
                    2: { open: "", completed: "" },
                    3: { open: "", completed: "" },
                    4: { open: "", completed: "" },
                    5: { open: "", completed: "" }
                  };
              feedUpdateNew[0].completed = Now;
              return {
                ...state,
                status: "Connected",
                [action.type_payload]: Profile,
                periodicFeed: { ...feedUpdateNew }
              };
            } else {
              return {
                ...state,
                status: "Connected",
                [action.type_payload]: Profile
              };
            }
          } else {
            return {
              ...state,
              status: "Connected",
              [action.type_payload]: Profile
            };
          }
        } else {
          return {
            ...state,
            status: "Connected",
            [action.type_payload]: {
              ...state[action.type_payload],
              ...action.payload
            }
          };
        }
      }
      break;

    case SET_NOTIFICATION_TIME:
      {
        return {
          ...state,
          status: "Connected",
          infoProfile: {
            ...state.infoProfile,
            notification_schedule: action.payload
          }
          // [action.type_payload]: action.payload
        };
      }
      break;

    case SET_NOTIFICATION_SUNDAY_IDS:
      {
        return {
          ...state,
          [action.type_payload]: action.payload
        };
      }
      break;

    case SET_NOTIFICATION_SCHEDULED_IDS:
      {
        return {
          ...state,
          [action.type_payload]: action.payload
        };
      }
      break;

    case SET_LANGUAGE:
      {
        return {
          ...state,
          language: action.payload
        };
      }
      break;

    case DELETE_NOTIFICATION_SUNDAY_IDS:
      {
        return {
          ...state,
          [action.type_payload]: action.payload
        };
      }
      break;

    case SET_STILL_NOTIFICATION:
      {
        return {
          ...state,
          [action.type_payload]: action.payload
        };
      }
      break;

    case SET_REMOTE_NOTIFICATION_ID:
      {
        return {
          ...state,
          [action.type_payload]: action.payload,
          remote_notification_configured: true
        };
      }
      break;

    case SET_FIRST_CONFIGURATION:
      {
        return {
          ...state,
          first_configuration_v5: true
        };
      }
      break;

    case DELETE_NOTIFICATION_SCHEDULED_IDS:
      {
        return {
          ...state,
          [action.type_payload]: action.payload
        };
      }
      break;

    case SET_CAR_PROPERTIES:
      {
        return {
          ...state,
          [action.type_payload]: action.payload
        };
      }
      break;

    case SET_MOTO_PROPERTIES:
      {
        return {
          ...state,
          [action.type_payload]: action.payload
        };
      }
      break;

    case SET_CHOOSED_WEEKDAYS:
      {
        return {
          ...state,
          status: "Connected",
          [action.type_payload]: action.payload
        };
      }
      break;

    case SET_RIGHT_MENU_STATE:
      {
        return {
          ...state,
          right_menu: action.payload
        };
      }
      break;
    case NEW_BEST_SCORE:
      {
        return {
          ...state,
          bestScore: action.payload
        };
      }
      break;
    case COMPLETE_TUTORIAL:
      {
        // essendo un nuovo stato, messo da poco sul default state devo controllare se è gia presente
        const startTutorial = state.tutorial
          ? state.tutorial
          : {
              tutorialStart: false,
              tutorialLive: false
            };

        return {
          ...state,
          tutorial: { ...startTutorial, [action.payload]: true }
        };
      }
      break;
    case RESET_TUTORIAL: {
      return {
        ...state,
        tutorial: { ...state.tutorial, [action.payload]: false }
      };
    }
    case REFRESHING_TOKEN: {
      return {
        ...state,
        refreshTokenPromise: action.refreshTokenPromise
      };
    }
    case DONE_REFRESHING_TOKEN:
      {
        return {
          ...state,
          refreshTokenPromise: null
        };
      }
      break;
    case FAIL_LOGIN:
      {
        // aggiungere l'errore del login tipo password sbagliata
        // eventuali altri parametri passati
        return {
          ...state,
          status: action.payload.error_description
            ? action.payload.error_description
            : action.payload.error,
          ...action.payload
        };
      }
      break;

    case FAIL_REFRESH: {
      // quando non riesco ad aggiornare il token tipo manca internet o altro

      return {
        ...state,
        status: action.payload.error_description
      };
    }

    case COMPLETE_ROUTE:
      {
        // quando completo un'attivita aggiorno i dati dell'utente

        return {
          ...state,
          status: "",
          points: state.points + action.totPointsValid,
          routesCompleted: state.routesCompleted + 1,
          kmTravelled: state.kmTravelled + action.totDistance
        };
      }
      break;

    case CHANGE_STATUS_BUTTON:
      {
        // quando clicco sul tasto play utile per fare il blur

        return {
          ...state,
          StatusButton: action.StatusButton
        };
      }
      break;

    case ADD_FREQUENT_ROUTE:
      {
        return {
          ...state,
          mostFrequentRoute: [...state.mostFrequentRoute, action.payload]
        };
      }
      break;

    case CHANGE_TYPEFORM_USER_VALUE:
      {
        return {
          ...state,
          typeform_user: action.payload.typeform_user
        };
      }
      break;

    case DELETE_DATA_PROFILE_OFFLINE:
      {
        // cancello le informazioni del profilo offline

        return {
          ...state,
          infoProfileNotSave: {},
          status: ""
        };
      }
      break;

    case LOG_OUT:
      {
        // cancello tutto
        // date lo conservo cosi lo uso per sapere se l'utente è stato mai registrato o no
        return { ...DefaultState, date: state.date };
      }
      break;
    case DELETE_FREQUENT_ROUTE_NOT_SAVE:
      {
        // tolgo la routine gia caricata nel db e quindi non si deve piu salvare
        const mfr_modal_split_NotSave = state.mfr_modal_split_NotSave.filter(
          elem => {
            // vedo se sono uguali come oggetto usando json,
            // ovviamente gli attributi devono essere nello stesso ordine
            const equal =
              JSON.stringify(elem) === JSON.stringify(action.payload);
            console.log(equal);
            return !equal;
          }
        );
        return {
          ...state,
          mfr_modal_split_NotSave: mfr_modal_split_NotSave
        };
      }
      break;
    case DELETE_MFR:
      {
        let mfrList = state.mostFrequentRoute.filter(element => {
          return element.id != action.payload.mostFrequentRouteId;
        });

        console.log(state.mostFrequentRoute);

        console.log(mfrList);

        return {
          ...state,
          mostFrequentRoute: mfrList
        };
      }
      break;

    case SET_SESSION_TOKEN:
      {
        return {
          ...state,
          ...action.payload
        };
      }
      break;

    case ADD_PAGE_COUNTED:
      {
        let sToken = {};
        if (state.sessionToken.pages) {
          let nPages = [...state.sessionToken.pages, action.payload];
          sToken = {
            ...state.sessionToken,
            pages: nPages
          };
        } else {
          sToken = {
            ...state.sessionToken,
            pages: [action.payload]
          };
        }

        return {
          ...state,
          sessionToken: { ...sToken }
        };
      }
      break;

    case RESET_PAGE_COUNTED:
      {
        let sToken = {
          ...state.sessionToken,
          pages: null
        };

        return {
          ...state,
          ...sToken
        };
      }
      break;

    case SET_SODDFRUST_FLAG:
      {
        return {
          ...state,
          typeform_soddfrust_3: action.payload
        };
      }
      break;

    case EDIT_MFR:
      {
        let mfrList = state.mostFrequentRoute.filter(element => {
          return element.id != action.payload.frequent_trip.id;
        });

        return {
          ...state,
          mostFrequentRoute: [...mfrList, action.payload.frequent_trip]
        };
      }
      break;

    default:
      {
        return state;
      }
      break;
  }
}

function checkUpdateProfile(info) {
  console.log(info);
  if (!info.birthdate) {
    return true;
  } else if (!info.height) {
    return true;
  } else if (!info.weight) {
    return true;
  } else if (!info.gender) {
    return true;
  } else if (!info.first_name.length) {
    return true;
  } else if (!info.last_name.length) {
    return true;
  } else {
    return false;
  }
}
