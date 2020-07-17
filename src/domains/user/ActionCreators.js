import {
  GET_PROFILE,
  FAILED_GET_PROFILE,
  LOGIN,
  FAILED_LOGIN,
  COMPLETE_ROUTE,
  FAIL_REFRESH_TOKEN,
  ADD_FREQUENT_ROUTE,
  DELETE_FREQUENT_ROUTE_NOT_SAVE
} from "./ActionTypes";
import { requestBackend } from "./../../helpers/requestBackend";

import axios from "axios";
import qs from "qs";

const base64js = require("base64-js");
const utf8 = require("utf8");
const binaryToBase64 = require("binaryToBase64");

const client_id = "Sur79dKVA2MLqDPPER6bDFbh2uczoCdkJflejAQl";
const client_secret =
  "HT5s5EOkbr0ZfykJ674SWJgOjsJFlaPAwpwdsDrHMxlR3fvPnkHp5QqwKYcniZ6qWML7H5Xdf746ij0ihxJeUmb6zstDmFfbHuou3Rd0s13zlUYUNZhD3ruKkn16LB9F";
const bytes = utf8.encode(`${client_id}:${client_secret}`);
const encoded = binaryToBase64(bytes);

export function getProfile() {
  return async function(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    // preparo la richiesta legata al login con username e password
    let { access_token, date, username, password } = getState().user;
    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(login(username, password));
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/profile?full=true",
          access_token,
          null,
          null,
          "Bearer"
        );
        dispatch({
          type: GET_PROFILE,
          payload: {
            profile: response.data
          }
        });
      } catch (error) {
        dispatch({
          type: FAILED_GET_PROFILE,
          payload: { error_description: "error" }
        });
      }
    }
  };
}

export function login(username, password) {
  console.log("username");
  return async function(dispatch) {
    // richiesta di accesso mandando i dati con axios
    // preparo la richiesta legata al login con username e password
    const data = {
      grant_type: "password",
      username,
      password
    };
    // data per sapere poi quando scade il token
    let date = +new Date();
    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
    try {
      const response = await requestBackend(
        "post",
        "/o/token/",
        encoded,
        data,
        null,
        "Basic"
      );
      if (response.status === 200) {
        // è stato trovato l'utente
        const { access_token, refresh_token, expires_in } = response.data;
        // per 1000 perche expires_in è in secondi
        date = date + 1000 * expires_in;
        dispatch({
          type: LOGIN,
          payload: {
            username,
            password,
            access_token,
            refresh_token,
            date
          }
        });
      } else if (response.status === 401) {
        // errore dati inseriti
        dispatch({
          type: FAILED_LOGIN,
          payload: { error_description: response.data.error }
        });
      }
      // in caso di errore, mando anche l'errore utile per sapere cosa sbaglio tipo email
    } catch (error) {
      console.log(error);
      dispatch({
        type: FAILED_LOGIN,
        payload: { error_description: "error" }
      });
    }
  };
}

export function forgotPassword(email) {
  return function(dispatch) {
    // richiesta di recupero con la mia email
    // in caso fare domanda di sicurezza sia nella registrazione sia adesso
    // poi rifare registrazione
  };
}

export function loginWithFacebook() {
  return function(dispatch) {
    // richiesta di accesso con popup o apertura app facebook
    // se da autorizzazione avviare il login, salvando alcuni dati
    dispatch({
      type: START_LOGIN
    });
    // in caso di errore , mando anche l'errore utile per sapere
    // cosa sbaglio tipo ho negato autorizzazione
    dispatch({
      type: FAIL_LOGIN
    });
  };
}

export function loginWithGoogle() {
  return function(dispatch) {
    // richiesta di accesso con popup o apertura app google
    // se da autorizzazione avviare il login, salvando alcuni dati
    dispatch({
      type: START_LOGIN
    });
    // in caso di errore , mando anche l'errore utile per sapere
    // cosa sbaglio tipo ho negato autorizzazione
    dispatch({
      type: FAIL_LOGIN
    });
  };
}

export function RefreshToken() {
  return async function(dispatch, getState) {
    let { username, password, refresh_token, date } = getState().user;
    let dateExpires = +new Date();
    // se non è scaduto mando la richiesta di rinnovo altrimenti di nuovo i dati dell'utente
    if (dateExpires >= date) {
      dispatch(login(username, password));
    } else {
      // se il token è ancora valido rinnovo usando il refresh token
      const data = {
        grant_type: "refresh_token",
        refresh_token
      };
      try {
        const response = await requestBackend(
          "post",
          "/o/token/",
          encoded,
          data,
          null,
          "Basic"
        );
        if (response.status === 200) {
          // è stato trovato l'utente
          const { access_token, refresh_token, expires_in } = response.data;
          // per 1000 perche expires_in è in secondi
          dateExpires = dateExpires + 1000 * expires_in;
          dispatch({
            type: LOGIN,
            payload: {
              username,
              password,
              access_token,
              refresh_token,
              date: dateExpires
            }
          });
        }
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          dispatch({
            type: FAIL_REFRESH_TOKEN,
            payload: { error_description: "Error" }
          });
        } else if (error.request) {
          console.log(error.request);
          dispatch({
            type: FAIL_REFRESH_TOKEN,
            payload: { error_description: "Error" }
          });
        } else {
          console.log("Error", error.message);
          dispatch({
            type: FAIL_REFRESH_TOKEN,
            payload: { error_description: "Error" }
          });
        }
        console.log(error.config);
      }
    }
  };
}

/**
 * @description prende le frequent route dell'utente cosi si posso visualizzare
 * @description o usare per sapere se una route è un frequent route
 */
export function getMostFrequentRoute() {
  console.log("object");
  return async function(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    // preparo la richiesta legata al login con username e password
    let { access_token, date } = getState().user;
    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(login(username, password));
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/most_frequent_route/",
          access_token,
          null,
          null,
          "Bearer"
        );
        if (response.status === 200) {
          // salvo le frequent route in login
          // ricevo i dati come un oggetto con un id e lo converto in un array per usare poi un map
          dispatch({
            type: LOGIN,
            payload: {
              mostFrequentRoute: Object.keys(response.data).map(function(key) {
                return response.data[key];
              })
            }
          });
        }
      } catch (error) {
        dispatch({
          type: FAILED_LOGIN,
          payload: { error_description: "error" }
        });
      }
    }
  };
}

// caricare una frequent route dell'utente non caricata ancora nel server
export function postMostFrequentRouteNotSave() {
  return async function(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    // preparo la richiesta
    let {
      access_token,
      date,
      mfr_modal_split_NotSave,
      mostFrequentRoute
    } = getState().user;

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(login(username, password));
    } else if (!mostFrequentRoute) {
      // almeno una mostFrequentRoute ci se deve essere
      // cosi confronto quelle gia salvate nel db con quelle ancora da salvare
      dispatch(getMostFrequentRoute());
    } else {
      // tolgo eventuali routine gia salvate anche se sono salvate come salvate
      const mfr_modal_split_DoSave = mfr_modal_split_NotSave.filter(elem => {
        for (routine = 0; routine < mostFrequentRoute.length; routine++) {
          const {
            walk,
            bike,
            bus,
            car,
            motorbike,
            car_pooling,
            frequency,
            end_type,
            start_type,
            start_point,
            end_point
          } = elem;
          console.log(elem);
          console.log(mostFrequentRoute[routine]);
          // se una è uguale allora non la devo salvare nel backend e di conseguenza la scarto con
          // filter ritornando falso per quella che corrisponde
          if (
            start_point ===
              mostFrequentRoute[routine].start_point.coordinates &&
            end_point === mostFrequentRoute[routine].end_point.coordinates &&
            end_type === mostFrequentRoute[routine].end_type &&
            start_type === mostFrequentRoute[routine].start_type &&
            walk === mostFrequentRoute[routine].walk &&
            bike === mostFrequentRoute[routine].bike &&
            bus === mostFrequentRoute[routine].bus &&
            car === mostFrequentRoute[routine].car &&
            motorbike === mostFrequentRoute[routine].motorbike &&
            car_pooling === mostFrequentRoute[routine].car_pooling &&
            frequency === mostFrequentRoute[routine].frequency
          ) {
            return false;
          }
        }
        return true;
      });
      console.log(mfr_modal_split_DoSave);

      for (routine = 0; routine < mfr_modal_split_DoSave.length; routine++) {
        console.log("analisi routine non salvate");
        // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
        try {
          const response = await requestBackend(
            "post",
            "/api/v1/most_frequent_route",
            access_token,
            mfr_modal_split_DoSave[routine],
            "application/json",
            "Bearer"
          );
          console.log(response);
          // se la tratta è stata salvata ovvero 201,
          if (response.status === 201) {
            // salvo le frequent route in login
            dispatch({
              type: ADD_FREQUENT_ROUTE,
              payload: response.data
            });
            // cancello i dati della routine appena caricata da quelle salvate
            // ovviamente devo cancellare la stessa routine della memoria
            dispatch({
              type: DELETE_FREQUENT_ROUTE_NOT_SAVE,
              payload: mfr_modal_split_DoSave[routine]
            });
          } else {
            dispatch({
              type: FAILED_LOGIN,
              payload: {
                error_description: "error"
              }
            });
          }
        } catch (error) {
          dispatch({
            type: FAILED_LOGIN,
            payload: {
              error_description: "error"
            }
          });
        }
      }
    }
  };
}

// caricare una nuova frequent route dell'utente
// se questa non viene salvata nel db o il server non risponde, la conservo in login come non salvata cosi
// poi la riprendo per salvarla successivamente
export function postMostFrequentRoute() {
  return async function(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    // preparo la richiesta legata al login con username e password
    let { access_token, date, mfr_modal_split_NotSave } = getState().user;

    let {
      mostFrequentRaceFrequency,
      mostFrequentRaceModalSplit,
      mostFrequentRaceFrequencyPosition
    } = getState().register;

    let mfr_modal_split = mostFrequentRaceModalSplit.reduce(
      (total, elem, index, array) => {
        label = elem.label;
        return { ...total, [label]: parseInt((elem.value * 100).toFixed(0)) };
      },
      {}
    );

    const {
      end_type,
      start_type,
      end_point,
      start_point
    } = mostFrequentRaceFrequencyPosition;

    mfr_modal_split = {
      ...mfr_modal_split,
      frequency: parseInt(mostFrequentRaceFrequency),
      end_type,
      start_type,
      end_point: [end_point.latitude, end_point.longitude],
      start_point: [start_point.latitude, start_point.longitude]
    };
    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(login(username, password));
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "post",
          "/api/v1/most_frequent_route",
          access_token,
          mfr_modal_split,
          "application/json",
          "Bearer"
        );
        console.log(response);
        // se la tratta è stata salvata ovvero 201,
        if (response.status === 201) {
          // salvo le frequent route in login
          dispatch({
            type: ADD_FREQUENT_ROUTE,
            payload: response.data
          });
          // cancello i dati della routine appena creata
          dispatch({
            type: UPDATE_STATE,
            payload: {
              mostFrequentRaceFrequency: null,
              mostFrequentRaceModalSplit: null,
              mostFrequentRaceFrequencyPosition: null
            }
          });
        } else {
          dispatch({
            type: FAILED_LOGIN,
            payload: {
              error_description: "error",
              mfr_modal_split_NotSave: [
                ...mfr_modal_split_NotSave,
                mfr_modal_split
              ]
            }
          });
          // cancello i dati della routine appena creata
          dispatch({
            type: UPDATE_STATE,
            payload: {
              mostFrequentRaceFrequency: null,
              mostFrequentRaceModalSplit: null,
              mostFrequentRaceFrequencyPosition: null
            }
          });
        }
      } catch (error) {
        dispatch({
          type: FAIL_LOGIN,
          payload: {
            error_description: "error",
            mfr_modal_split_NotSave: [
              ...mfr_modal_split_NotSave,
              mfr_modal_split
            ]
          }
        });
        // cancello i dati della routine appena creata
        dispatch({
          type: UPDATE_STATE,
          payload: {
            mostFrequentRaceFrequency: null,
            mostFrequentRaceModalSplit: null,
            mostFrequentRaceFrequencyPosition: null
          }
        });
      }
    }
  };
}
