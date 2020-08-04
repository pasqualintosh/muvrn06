import { Alert, Platform, Geolocation } from "react-native";
import {
  START_LOGIN,
  FAIL_LOGIN,
  FAIL_REFRESH,
  CHANGE_STATUS_BUTTON,
  ADD_FREQUENT_ROUTE,
  DELETE_FREQUENT_ROUTE_NOT_SAVE,
  DELETE_ROUTE,
  LOG_OUT,
  UPDATE_LOGIN,
  SET_NOTIFICATION_TIME,
  SET_CHOOSED_WEEKDAYS,
  DELETE_MFR,
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
  EDIT_MFR,
} from "./ActionTypes";
import { UPDATE_TRIP_DATA } from "./../tracking/ActionTypes";
import { UPDATE_STATE } from "./../register/ActionTypes";

import {
  UpdateStatus,
  ResetPreviousRoute,
  resumeRoute,
  UpdatePreviousRoute,
  UpdateIdSameRoute,
} from "./../tracking/ActionCreators";
import {
  getStats,
  getWeeklyActivities,
  updateActivities,
  getWeeklyActivitiesNew,
  updateActivitiesStep,
} from "./../statistics/ActionCreators";

import axios from "axios";

import {
  getWeeklyLeaderboard,
  getWeeklyLeaderboardByCity,
  getWeeklyFriendLeaderboard,
  getTrophies,
  getWeeklyLeaderboardByCommunity,
  getSpecificPosition,
  getSpecificPositionNew,
  getTrophiesNew,
} from "./../../domains/standings/ActionCreators";

import {
  getUserLevel,
  getQuiz,
  getCompleteQuizAndSurvey,
  putEvent,
  putEventOfflineFor,
  getSpecialTrainingSessions,
  getSpecialTrainingSessionSubscribed,
} from "./../../domains/trainings/ActionCreators";

import {
  postRegisterFollower,
  getFollowersUser,
  getListFriend,
  getListRequestFriend,
} from "./../../domains/follow/ActionCreators";
import { getWeeklySingleMatch } from "./../../domains/screen/ActionCreators";
import {
  getChallenges,
  getChallengesRewards,
  getChallengesRewardsByUser,
  getChallengeRankingByUser,
  getRewardsCategory,
  getChallengesAllowed,
} from "./../../domains/challenges/ActionCreators";

import {
  getTournamentsQualification,
  getTeamsByTournament,
  getTournaments,
  getTeams,
} from "./../tournaments/ActionCreators";

import qs from "qs";

import { pushNotifications } from "./../../services";
import WebService from "./../../config/WebService";
import { LOGIN } from "../user/ActionTypes";
import { emailPresentTypeformUserList } from "./../../config/Tester";
import * as Keychain from "react-native-keychain";

import { strings } from "../../config/i18n";

import { Client } from "bugsnag-react-native";
const bugsnag = new Client(WebService.BugsnagAppId);

import DeviceInfo from "react-native-device-info";
import { getDevice } from "../../helpers/deviceInfo";
import moment from "moment";

import { getIdModalTypeNew } from "../tracking/Support";
import { store } from "./../../store";

import BackgroundGeolocation from "./../../helpers/geolocation";

// cambio status al tasto play
export function changeStatusButton(StatusButton) {
  return {
    type: CHANGE_STATUS_BUTTON,
    StatusButton,
  };
}

// salvo sul db la versione dell'app usata
export function saveAppVersionUsage() {
  const versionNow = DeviceInfo.getVersion();
  if (store.getState().login.infoProfile.app_version != versionNow) {
    store.dispatch(updateProfileNew({ data: { app_version: versionNow } }));
  }
}

export function setBackgroundGeolocation() {
  try {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      store.dispatch(
        getCityInfoForUser({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      );
    });
  } catch (error) {
    console.log(error);
  }
}

// posizione dell'utente (città se non è stata ancora settata)
export function savePositionUsage() {
  if (!store.getState().login.infoProfile.gmaps_location) {
    setBackgroundGeolocation();
  }
}

export function getCityInfoForUser(position = { latitude: 40, longitude: 40 }) {
  return async function (dispatch) {
    try {
      const response = await axios({
        method: "get",
        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.latitude},${position.longitude}&key=${WebService.API_KEY_Google}&language=it`,
      });
      console.log(response);

      if (response.status === 200) {
        // metto un valore di default per sapere che almeno ho cercato ma non ho trovato nulla
        let localityName = "";
        let administrativeName = "";
        let countryName = "";

        let administrative_area_level_3_city_name = "";
        let administrative_area_level_2_city_name = "";
        let administrative_area_level_1_city_name = "";
        let country_city_name = "";

        if (response.data.results) {
          // se ho dei risultati
          // prendo quelle liste che hanno come granualità piu grande la citta locale
          const cityLisy = response.data.results.filter(
            (elem) =>
              elem.address_components &&
              elem.address_components.length &&
              elem.address_components[0].types[0] == "locality"
          );
          console.log(cityLisy);

          if (cityLisy.length) {
            // prendo l'ultima città
            const cityFind = cityLisy[cityLisy.length - 1];
            for (i = 0; i < cityFind.address_components.length; i++) {
              // cerco le info che mi interessano
              const address_component = cityFind.address_components[i];
              if (address_component.types && address_component.types.length) {
                if (address_component.types[0] == "locality") {
                  localityName = address_component.long_name;
                } else if (
                  address_component.types[0] == "administrative_area_level_3"
                ) {
                  administrative_area_level_3_city_name =
                    address_component.long_name;
                } else if (
                  address_component.types[0] == "administrative_area_level_2"
                ) {
                  administrative_area_level_2_city_name =
                    address_component.long_name;
                  administrativeName = address_component.long_name;
                } else if (
                  address_component.types[0] == "administrative_area_level_1"
                ) {
                  administrative_area_level_1_city_name =
                    address_component.long_name;
                } else if (address_component.types[0] == "country") {
                  countryName = address_component.long_name;
                  country_city_name = address_component.long_name;
                }
              }
            }
          }
        }

        const cityRoute = {
          administrative_area_level_3_city_name,
          administrative_area_level_2_city_name,
          administrative_area_level_1_city_name,
          country_city_name,
        };
        dispatch(createInfoCityIdForUser(cityRoute));
      } else {
        // se non risponde correttamente setto i valore a ""

        const msg = new Error("getCityInfoForUser fail");
        bugsnag.notify(msg, function (report) {
          report.metadata = { problem: response };
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function createInfoCityIdForUser(infoCity) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    console.log("createInfoCityIdForUser");
    console.log(infoCity);
    let { access_token } = getState().login;

    try {
      const response = await requestNewBackend(
        "post",
        "/api/v1/tools/gmaps/",
        access_token,
        infoCity,
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 201 || response.status === 200) {
        // mi salvo l'id della città che devo usare poi nella post

        dispatch(updateProfileNew({ data: { gmaps_location: response.data } }));
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(
          forceRefreshTokenWithCallback(createInfoCityIdForUser(infoCity))
        );
      } else {
        const msg = new Error("createInfoCityIdForUser fail");
        bugsnag.notify(msg, function (report) {
          report.metadata = { problem: response };
        });
        // dispatch({
        //   type: FAIL_LOGIN,
        //   payload: { error_description: "error" },
        // });
      }

      // in caso di errore, mando anche l'errore utile per sapere cosa sbaglio tipo email
      /* dispatch({
          type: FAIL_LOGIN,
          payload: error.response.data
        }); */
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);

        // if (error.response.status === 403) {
      } else if (error.request) {
        console.log(error.request);
        // dispatch({
        //   type: START_LOGIN,
        //   payload: {
        //     status: "",
        //   },
        // });
      } else {
        console.log(error.message);
      }
      // dispatch({
      //   type: FAIL_LOGIN,
      //   payload: { error_description: "error catch createInfoCityIdForTrip" },
      // });
      console.log(error.config);
    }
  };
}

// Ho completato uno specifico tutorial
export function completeTutorial(tutorial) {
  return {
    type: COMPLETE_TUTORIAL,
    payload: tutorial,
  };
}

// Resetto uno specifico tutorial, cosi lo posso rivedere
export function resetTutorial(tutorial) {
  return {
    type: RESET_TUTORIAL,
    payload: tutorial,
  };
}

export function setLanguage(language) {
  return {
    type: SET_LANGUAGE,
    payload: language,
  };
}

export function addFrequentRouteFromRecap(payload) {
  return async function (dispatch) {
    dispatch({
      type: ADD_FREQUENT_ROUTE_FROM_RECAP,
      payload,
    });
  };
}

export function newBestScore(payload) {
  return {
    type: NEW_BEST_SCORE,
    payload,
  };
}

// quando devo salvare che ho completato un feed di aggiornamento che spunta random nel feed
export function addCompleteUpdateFeed(num) {
  return {
    type: SET_COMPLETE_UPDATE_FEED,
    payload: num,
  };
}

// nuova versione che salva su un oggetto e non su un array
// quando devo salvare che ho completato un feed di aggiornamento che spunta random nel feed
export function addCompletePeriodicFeed(num) {
  return async function (dispatch) {
    const Now = new Date().toDateString();
    dispatch({
      type: UPDATE_COMPLETE_UPDATE_FEED,
      payload: { Now, num },
    });
  };
}

// quando apro un feed lo salvo

export function addOpenPeriodicFeed(num) {
  return async function (dispatch) {
    const Now = new Date().toDateString();
    dispatch({
      type: UPDATE_OPEN_UPDATE_FEED,
      payload: { Now, num },
    });
  };
}

export async function saveIcloud(username, password) {
  const perm = await Keychain.getSupportedBiometryType();
  const security = await Keychain.getSecurityLevel();
  // Alert.alert("perm: " + perm , "security: " + security);

  if (perm || security == "SECURE_HARDWARE") {
    const AUTH_OPTIONS = {
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      authenticationPrompt: strings("id_0_133"),
      authenticateType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
    };
    // Store the credentials
    await Keychain.setGenericPassword(username, password, AUTH_OPTIONS);
  }
  // try {
  //   // Retreive the credentials
  //   const credentials = await Keychain.getGenericPassword();
  //   if (credentials) {
  //     console.log('Credentials successfully loaded for user ' + credentials.username);
  //   } else {
  //     console.log('No credentials stored')
  //   }
  // } catch (error) {
  //   console.log('Keychain couldn\'t be accessed!', error);
  // }
  // await Keychain.resetGenericPassword()
}

export function startLogin(dataLogin = {}, callAfterLoginOrRegister = false) {
  return async function (dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    let { username, password } = getState().login;
    // se ho appena effettuato il login, uso il token nuovo che ho inserito
    if (dataLogin.username) {
      username = dataLogin.username;
      password = dataLogin.password;
    }
    // se ho fatto il login usando il portachiave
    let keychain = false;
    if (dataLogin.keychain) {
      keychain = dataLogin.keychain;
    }

    // preparo la richiesta legata al login con username e password
    // dico che mi sto loggando cosi spunta il caricamento
    dispatch({
      type: START_LOGIN,
      payload: {
        status: "In connect",
      },
    });

    const data = {
      grant_type: "password",
      username,
      password,
      client_id: WebService.client_id,
    };
    // data per sapere poi quando scade il token
    let date = +new Date();

    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
    try {
      const response = await requestBackend(
        "post",
        "/o/token/",
        null,
        data,
        null,
        "Basic"
      );
      console.log(response);
      if (response.status === 200) {
        // è stato trovato l'utente
        const { access_token, refresh_token, expires_in } = response.data;

        // per 1000 perche expires_in è in secondi

        date = date + 1000 * expires_in;

        if (!keychain) {
          // non ho usato il portachiave, ma mi sono connesso, salvo le credenziali
          try {
            saveIcloud(username, password).then().catch();
          } catch (error) {
            if (typeof error !== "Error") {
              console.log(error);
              msg = new Error(error);

              bugsnag.notify(msg, function (report) {
                report.metadata = { error: error };
              });
            } else {
              bugsnag.notify(error, function (report) {
                report.metadata = { error: error };
              });
            }
          }
        }

        dispatch({
          type: START_LOGIN,
          payload: {
            username,
            password,
            access_token,
            refresh_token,
            date,
            status: "",
          },
        });
        /* requestCallback(
          {
            ...dataLogin,
            access_token,
            refresh_token,
            date
          },
          dispatch
        ); */
        // se è true allora devo caricare i dati iniziali dell'app
        if (callAfterLoginOrRegister) {
          dispatch(startApp());
        }
      } else if (response.status === 401 || response.status === 400) {
        // errore dati inseriti
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: response.data.error },
        });
        if (response.data.error_description) {
          Alert.alert("Oops", response.data.error_description);
        }
      } else if (response.status === 500) {
        // server non funziona bene
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: response.data.error },
        });
      } else {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error" },
        });
      }

      // in caso di errore, mando anche l'errore utile per sapere cosa sbaglio tipo email
      /* dispatch({
        type: FAIL_LOGIN,
        payload: error.response.data
      }); */
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);

        // if (error.response.status === 403) {
      } else if (error.request) {
        console.log(error.request);
        dispatch({
          type: START_LOGIN,
          payload: {
            status: "",
          },
        });
      } else {
        console.log(error.message);
      }
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch startLogin" },
      });
      console.log(error.config);
    }
  };
}

export function deleteToken() {
  return {
    type: START_LOGIN,
    payload: {
      access_token: 0,
      refresh_token: 0,
      status: "",
    },
  };
}

export function startLoginNewSocial(
  dataLogin = {},
  callAfterLoginOrRegister = true
) {
  return async function (dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    let { social_backend, access_token_social, email } = getState().register;

    // preparo la richiesta legata al login con username e password
    // dico che mi sto loggando cosi spunta il caricamento
    dispatch({
      type: START_LOGIN,
      payload: {
        status: "In connect",
      },
    });

    const data = {
      client_id: WebService.client_id,
      client_secret: WebService.client_secret,
      grant_type: "convert_token",
      backend: social_backend,
      token: access_token_social,
      email,
    };

    console.log(data);
    // data per sapere poi quando scade il token
    let date = +new Date();

    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
    try {
      const response = await requestBackend(
        "post",
        "/api/v1/auth/convert-token",
        null,
        data,
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 200) {
        // è stato trovato l'utente
        const { access_token, refresh_token, expires_in } = response.data;

        // per 1000 perche expires_in è in secondi

        date = date + 1000 * expires_in;

        dispatch({
          type: START_LOGIN,
          payload: {
            username: email,
            email,
            access_token,
            refresh_token,
            date,
            status: "",
          },
        });

        dispatch(postFrequentTrip());

        if (callAfterLoginOrRegister) {
          dispatch(startApp());
        }
      } else if (response.status === 401 || response.status === 400) {
        // errore dati inseriti
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: response.data.error },
        });
        if (response.data.error_description) {
          Alert.alert("Oops", response.data.error_description);
        }
      } else if (response.status === 500) {
        // server non funziona bene
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: response.data.error },
        });
      } else {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error" },
        });
      }

      // in caso di errore, mando anche l'errore utile per sapere cosa sbaglio tipo email
      /* dispatch({
        type: FAIL_LOGIN,
        payload: error.response.data
      }); */
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);

        // if (error.response.status === 403) {
      } else if (error.request) {
        console.log(error.request);
        dispatch({
          type: START_LOGIN,
          payload: {
            status: "",
          },
        });
      } else {
        console.log(error.message);
      }
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch startLogin" },
      });
      console.log(error.config);
    }
  };
}

export function changePasswordNew(dataLogin = {}) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    console.log("nuovi dati da inviare per il profilo");

    // richiesta di accesso mandando i dati con axios
    let { access_token, password, email } = getState().login;

    // const dataNewUser = dataLogin.data;
    const oldPassword = dataLogin.oldPassword ? dataLogin.oldPassword : "";
    const newPassword = dataLogin.newPassword ? dataLogin.newPassword : "";
    const callback = dataLogin.callback ? dataLogin.callback : () => {};

    if (oldPassword == password) {
      try {
        const response = await requestNewBackend(
          "patch",
          "/api/v1/account/" + email,
          access_token,
          { password: newPassword },
          "application/json",
          "Bearer"
        );
        console.log(response);
        // Alert.alert(response.status.toString())

        if (response.status === 200) {
          // salvo la nuova password come password nello stato
          dispatch({
            type: START_LOGIN,
            payload: {
              password: newPassword,
              infoProfile: response.data,
            },
          });
          Alert.alert("Great", "Password changed");
          try {
            saveIcloud(email, newPassword).then().catch();
          } catch (error) {}
          callback();
        } else if (response.status == 401) {
          // se il token è scaduto
          // lo rinnovo e poi ricarico le richieste dall'app

          console.log("token scaduto");
          dispatch(forceRefreshTokenWithCallback(changePasswordNew(dataUser)));
        }
      } catch (error) {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error catch changePasswordNew" },
        });
      }
    } else {
      Alert.alert("Oops", strings("id_13_58"));
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error" },
      });
    }
  };
}

export function postUserForm(dataLogin = {}, callbackResponse, callbackError) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    let { access_token } = getState().login;

    try {
      const response = await requestNewBackend(
        "post",
        "/api/v1/forms/",
        access_token,
        { dataLogin },
        "application/json",
        "Bearer"
      );
      console.log(response);

      if (response.status === 200) {
        if (callbackResponse) {
          callbackResponse();
        }
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(
          forceRefreshTokenWithCallback(
            postUserForm(dataUser, callbackResponse, callbackErro)
          )
        );
      } else {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error status postUserForm" },
        });
        if (callbackError) {
          callbackError();
        }
      }
    } catch (error) {
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch postUserForm" },
      });
    }
  };
}

export function deleteProfileNew(dataLogin = {}) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    console.log("nuovi dati da inviare per il profilo");

    // richiesta di accesso mandando i dati con axios
    let { access_token, email } = getState().login;

    try {
      const response = await requestNewBackend(
        "patch",
        "/api/v1/account/" + email,
        access_token,
        { is_active: false },
        "application/json",
        "Bearer"
      );
      console.log(response);
      // Alert.alert(response.status.toString())

      if (response.status === 200) {
        dispatch({
          type: LOG_OUT,
          payload: {},
        });
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(forceRefreshTokenWithCallback(deleteProfileNew(dataUser)));
      }
    } catch (error) {
      dispatch({
        type: FAIL_LOGIN,
        payload: {
          error_description: "error catch deleteProfileNew",
        },
      });
    }
  };
}

export function updateProfileNew(dataLogin = {}) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    console.log("nuovi dati da inviare per il profilo");

    // richiesta di accesso mandando i dati con axios
    let { access_token, email } = getState().login;

    const dataNewUser = dataLogin.data;
    // se non viene salvata nel db, almeno le salvo a parte cosi poi le rinvio

    dispatch({
      type: UPDATE_LOGIN,
      type_payload: "infoProfileNotSave",
      payload: dataNewUser,
    });
    try {
      const response = await requestNewBackend(
        "patch",
        "/api/v1/account/" + email,
        access_token,
        dataNewUser,
        "application/json",
        "Bearer"
      );
      console.log(response);
      // Alert.alert(response.status.toString())

      if (response.status === 200) {
        dispatch({
          type: START_LOGIN,
          payload: {
            infoProfile: response.data,
          },
        });
        // se ha salvato le ultime modifiche posso cancellare quelle non salvate
        dispatch({
          type: DELETE_DATA_PROFILE_OFFLINE,
        });
        // if (!dataUser.test) {
        //   dispatch(forceRefreshTokenWithCallback(getProfileNew({...dataUser, test: true})))
        // }
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(forceRefreshTokenWithCallback(updateProfileNew(dataUser)));
      }
    } catch (error) {
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch updateProfileNew" },
      });
    }
  };
}

// trasferimento dal vecchio muv al nuovo
export function transfertToMUV(dataLogin = { password: "" }) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    console.log("nuovi dati per il nuovo muv");

    let { email, username } = getState().login;
    const password = dataLogin.password;

    const user_agent = await getDevice();

    const dataNewUser = {
      username: username.toLowerCase(),
      password,
      user_agent,
      is_active: true,
    };
    console.log(dataNewUser);
    try {
      const response = await requestNewBackend(
        "patch",
        "/api/v1/account/check_old_user/" +
          email +
          "?token=" +
          WebService.tokenServer,
        null,
        dataNewUser,
        "application/json",
        "Bearer"
      );
      console.log(response);

      if (response.status == 200) {
        // cancello tutto
        dispatch({
          type: LOG_OUT,
        });
        dispatch({
          type: START_LOGIN,
          payload: {
            email,
            password,
          },
        });

        // mi loggo
        dispatch(startLoginNew({ email, password }, true));
      }
    } catch (error) {
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch updateProfileNew" },
      });
    }
  };
}

export function forceLogin() {
  return async function (dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    let { username, password, email } = getState().login;

    dispatch({
      type: START_LOGIN,
      payload: {
        status: "In connect",
      },
    });

    const data = {
      grant_type: "password",
      username: email,
      password,
      client_id: WebService.client_id,
      client_secret: WebService.client_secret,
    };

    console.log(data);
    // data per sapere poi quando scade il token
    let date = +new Date();

    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
    try {
      const response = await requestNewBackend(
        "post",
        "/api/v1/auth/token/",
        null,
        data,
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 200) {
        // è stato trovato l'utente
        const { access_token, refresh_token, expires_in } = response.data;

        // per 1000 perche expires_in è in secondi

        date = date + 1000 * expires_in;

        dispatch({
          type: START_LOGIN,
          payload: {
            username,
            email,
            password,
            access_token,
            refresh_token,
            date,
            status: "",
          },
        });
      } else if (response.status === 401 || response.status === 400) {
        // errore dati inseriti
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: response.data.error },
        });
        if (response.data.error_description) {
          // Alert.alert(strings("id_0_10"), response.data.error_description);
          Alert.alert(strings("id_0_10"), strings("id_0_11"));
        }
      } else if (response.status === 500) {
        // server non funziona bene
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: response.data.error },
        });
      } else {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error" },
        });
      }

      // in caso di errore, mando anche l'errore utile per sapere cosa sbaglio tipo email
      /* dispatch({
        type: FAIL_LOGIN,
        payload: error.response.data
      }); */
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);

        // if (error.response.status === 403) {
      } else if (error.request) {
        console.log(error.request);
        dispatch({
          type: START_LOGIN,
          payload: {
            status: "",
          },
        });
      } else {
        console.log(error.message);
      }
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch startLogin" },
      });
      console.log(error.config);
    }
  };
}

// riattivo l'account rimando l'utente nella schermata per cambio password
ReactiveAccount = (data) => {
  if (data.is_active) {
    // account attivo
  } else {
    if (data.is_not_present) {
      // non c'e nel db
      console.log("non trovato utente nel db");
    } else {
      // c'e ma è d'attivare
      console.log(" trovato utente nel db, da attivare");
      console.log(data);

      store.dispatch({
        type: START_LOGIN,
        payload: {
          status: "",
          access_token: "",
          refresh_token: "",
          date: 0,
          email: data.email,
        },
      });
      store.dispatch({
        type: START_LOGIN,
        payload: {
          infoProfile: {
            user_id: 1,
            id: 0, // per il nuovo muv
            username: "", // per il nuovo muv
            first_name: "",
            customisation_gdpr: false,
            sponsorships_gdpr: false,
          },
        },
      });
    }
  }
};

export function startLoginNew(
  dataLogin = {},
  callAfterLoginOrRegister = false
) {
  return async function (dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    let { username, password, email } = getState().login;
    // se ho appena effettuato il login, uso il token nuovo che ho inserito
    if (dataLogin.email) {
      username = dataLogin.username;
      email = dataLogin.email;
      password = dataLogin.password;
    }
    // se ho fatto il login usando il portachiave
    let keychain = false;
    if (dataLogin.keychain) {
      keychain = dataLogin.keychain;
    }

    // preparo la richiesta legata al login con username e password
    // dico che mi sto loggando cosi spunta il caricamento
    dispatch({
      type: START_LOGIN,
      payload: {
        status: "In connect",
      },
    });

    const data = {
      grant_type: "password",
      username: email,
      password,
      client_id: WebService.client_id,
      client_secret: WebService.client_secret,
    };

    console.log(data);
    // data per sapere poi quando scade il token
    let date = +new Date();

    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
    try {
      const response = await requestBackend(
        "post",
        "/api/v1/auth/token/",
        null,
        data,
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 200) {
        // è stato trovato l'utente
        const { access_token, refresh_token, expires_in } = response.data;

        // per 1000 perche expires_in è in secondi

        date = date + 1000 * expires_in;

        if (!keychain) {
          // non ho usato il portachiave, ma mi sono connesso, salvo le credenziali
          try {
            saveIcloud(email, password).then().catch();
          } catch (error) {}
        }

        dispatch({
          type: START_LOGIN,
          payload: {
            username,
            email,
            password,
            access_token,
            refresh_token,
            date,
            status: "",
          },
        });

        dispatch(postFrequentTrip());
        dispatch(postBaseTrip());

        /* requestCallback(
          {
            ...dataLogin,
            access_token,
            refresh_token,
            date
          },
          dispatch
        ); */
        // se è true allora devo caricare i dati iniziali dell'app
        if (callAfterLoginOrRegister) {
          dispatch(startApp());
        }
      } else if (response.status === 401 || response.status === 400) {
        // errore dati inseriti
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: response.data.error },
        });
        // getActiveStatusProfile(ReactiveAccount, { email });

        if (response.data.error_description) {
          // Alert.alert(strings("id_0_10"), response.data.error_description);
          Alert.alert(strings("id_0_10"), strings("id_0_11"));
        }
      } else if (response.status === 500) {
        // server non funziona bene
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: response.data.error },
        });
      } else {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error" },
        });
      }

      // in caso di errore, mando anche l'errore utile per sapere cosa sbaglio tipo email
      /* dispatch({
        type: FAIL_LOGIN,
        payload: error.response.data
      }); */
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);

        // if (error.response.status === 403) {
      } else if (error.request) {
        console.log(error.request);
        dispatch({
          type: START_LOGIN,
          payload: {
            status: "",
          },
        });
      } else {
        console.log(error.message);
      }
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch startLogin" },
      });
      console.log(error.config);
    }
  };
}

export function forgetPassword(email) {
  return function (dispatch) {
    // richiesta di recupero con la mia email
    // in caso fare domanda di sicurezza sia nella registrazione sia adesso
    // poi rifare registrazione
  };
}

export function startLoginWithFacebook() {
  return function (dispatch) {
    // richiesta di accesso con popup o apertura app facebook
    // se da autorizzazione avviare il login, salvando alcuni dati
    dispatch({
      type: START_LOGIN,
    });
    // in caso di errore , mando anche l'errore utile per sapere cosa sbaglio tipo ho negato autorizzazione
    dispatch({
      type: FAIL_LOGIN,
    });
  };
}

export function startLoginWithGoogle() {
  return function (dispatch) {
    // richiesta di accesso con popup o apertura app google

    // se da autorizzazione avviare il login, salvando alcuni dati
    dispatch({
      type: START_LOGIN,
    });
    // in caso di errore , mando anche l'errore utile per sapere cosa sbaglio tipo ho negato autorizzazione
    dispatch({
      type: FAIL_LOGIN,
    });
  };
}

export function startAppAfterRefresh(dataUser = {}) {
  return async function (dispatch, getState) {
    // prima refresh e profilo
    // chiedo i dati della home al db
    // dati per i quiz
    // test per i trofei
    // let { training_events } = getState().trainings;
    //   for (i = 0; i < training_events.length; i++) {
    //     const evento = training_events[i];
    //     console.log(evento);
    //     if (
    //       evento.status === 0 &&
    //       !evento.event.quiz &&
    //       !evento.event.survey
    //     )  {
    //     const newLevelComplete = {
    //       event_id: evento.id,
    //       new_status_events: 1,
    //       typeCheckCompleted: true
    //     };
    //     console.log(newLevelComplete);
    //     dispatch(putEvent(newLevelComplete));
    //   }}
    // setTimeout(
    //   () => {
    //     // se ho nome e cognome allora recupero soltanto i dati pubblici
    //     let { first_name } = getState().login.infoProfile;
    //     if (first_name) {
    //       dispatch(getProfilePublic(dataUser, true));
    //     } else {
    //       dispatch(getProfile(dataUser, true));
    //     }
    //   },
    //   Platform.OS === "android" ? 750 : 750
    // );
  };
}

// se la getProfile ha fallito, rinnovo il token e riprendo le info iniziali dell'app
export function startAppWithProfile(dataUser = {}) {
  return async function (dispatch, getState) {
    // prima refresh e profilo

    // chiedo i dati della home al db
    // dati per i quiz

    // test per i trofei

    setTimeout(
      () => {
        let { first_name } = getState().login.infoProfile;

        if (first_name) {
          dispatch(getProfilePublic(dataUser));
        } else {
          dispatch(getProfile(dataUser));
        }
      },
      Platform.OS === "android" ? 500 : 0
    );
    dispatch(startAppWithinProfile(dataUser));
  };
}

// richieste iniziali senza il profile dato che è gia stato richiesto
export function startAppWithinProfile(dataUser = {}) {
  return async function (dispatch, getState) {
    setTimeout(
      () => {
        dispatch(getRole());
      },
      Platform.OS === "android" ? 1000 : 0
    );

    // controllo se ho dei dati relativi a un link ricevuto e utilizzato per registrami,
    // se si lo aggiungo agli amici
    setTimeout(
      () => {
        dispatch(postRegisterFollower());
      },
      Platform.OS === "android" ? 1500 : 1500
    );

    setTimeout(
      () => {
        dispatch(putEventOfflineFor());
      },
      Platform.OS === "android" ? 1250 : 0
    );

    // prendo il livello del giocatore che ha sua volta prende le sessioni e poi gli eventi ancora da fare
    setTimeout(
      () => {
        dispatch(getUserLevel());
      },
      Platform.OS === "android" ? 1500 : 0
    );

    setTimeout(
      () => {
        dispatch(getTrophies());
      },
      Platform.OS === "android" ? 2000 : 0
    );

    AfterRefresh = setTimeout(
      () => {
        dispatch(GetListRoute());
      },
      Platform.OS === "android" ? 2500 : 0
    );
    setTimeout(
      () => {
        dispatch(resumeRoute());
      },
      Platform.OS === "android" ? 3000 : 0
    );

    // dispatch(stop());
    // poi route

    AfterRefresh = setTimeout(
      () => {
        console.log("2 secondi ");
        dispatch(getMostFrequentRoute());
      },
      Platform.OS === "android" ? 3500 : 3500
    );

    // poi classifica

    AfterRoute = setTimeout(
      () => {
        dispatch(getSpecificPosition());
      },
      Platform.OS === "android" ? 4000 : 0
    );

    // poi statistiche

    // AfterLeader = setTimeout(
    //   () => {
    //     dispatch(getStats());
    //   },
    //   Platform.OS === "android" ? 4500 : 0
    // );

    setTimeout(
      () => {
        dispatch(ResetPreviousRoute());
      },
      Platform.OS === "android" ? 5000 : 0
    );

    setTimeout(
      () => {
        dispatch(getFollowersUser());
      },
      Platform.OS === "android" ? 6000 : 1000
    );

    setTimeout(
      () => {
        dispatch(getSpecialTrainingSessions());
      },
      Platform.OS === "android" ? 6500 : 1200
    );

    setTimeout(
      () => {
        dispatch(getSpecialTrainingSessionSubscribed());
      },
      Platform.OS === "android" ? 7000 : 1700
    );

    // controllo se ha dato i permessi all'attivita health o fit

    // setTimeout(
    //   () => {
    //     const perm = getState().statistics.permActivities;
    //     if (perm) {
    //       // se ho il permesso prendo le attività passate e aggiorno quella presente
    //       dispatch(getWeeklyActivities());
    //       dispatch(updateActivities());
    //     }
    //   },
    //   Platform.OS === "android" ? 8000 : 2100
    // );

    // setTimeout(
    //   () => {
    //     dispatch(getCompleteQuizAndSurvey());
    //   },
    //   Platform.OS === "android" ? 6500 : 1500
    // );
  };
}

// info essenziali all'avvio dell'app o dopo il login o registrazione
export function startApp() {
  return async function (dispatch) {
    setTimeout(
      () => {
        dispatch(resumeRoute());
      },
      Platform.OS === "android" ? 10 : 0
    );

    //  getActiveStatusProfile();

    setTimeout(
      () => {
        dispatch(getProfileNew());
      },
      Platform.OS === "android" ? 200 : 0
    );

    setTimeout(
      () => {
        dispatch(getMultipliers());
      },
      Platform.OS === "android" ? 400 : 0
    );

    setTimeout(
      () => {
        dispatch(getAllTrip());
      },
      Platform.OS === "android" ? 600 : 400
    );

    setTimeout(
      () => {
        getSpecificPositionNew();
      },
      Platform.OS === "android" ? 800 : 0
    );

    dispatch(getMostFrequentRoute());
    dispatch(getChallenges());
    dispatch(getChallengesRewards());
    dispatch(getChallengesRewardsByUser());
    dispatch(getChallengeRankingByUser());
    dispatch(getRewardsCategory());
    dispatch(getChallengesAllowed());
    dispatch(getTournaments());
    dispatch(getTeams());

    dispatch(getListFriend());
    dispatch(getListRequestFriend());

    dispatch(getTrophiesNew());

    setTimeout(
      () => {
        const perm = store.getState().statistics.permActivities;
        if (perm) {
          // dispatch(getWeeklyActivitiesNew());
          dispatch(updateActivitiesStep());
        }
      },
      Platform.OS === "android" ? 1000 : 500
    );

    // dispatch(getTournamentsQualification());
    // dispatch(getTeamsByTournament(1));
  };
}

function isExpired(date) {
  let currentTime = new Date();
  let expires_date = new Date(date);
  // let currentTime = new Date(new Date().getTime() + 32400000 + 3480000);

  // console.log(currentTime.toString())

  // console.log(expires_date.toString())
  // console.log(test_date.toString())
  // console.log(test_date >= expires_date)
  return currentTime >= expires_date;
}

function isAsync(func) {
  const string = func.toString().trim();
  console.log(string);

  return !!(
    // native
    (
      string.match(/access_token /) ||
      // babel (this may change, but hey...)
      string.match(/return _ref[^\.]*\.apply/)
    )
    // insert your other dirty transpiler check

    // there are other more complex situations that maybe require you to check the return line for a *promise*
  );
}

export default function authMiddleware({ dispatch, getState }) {
  return (next) => (action) => {
    // console.log(action)
    // console.log(next)
    // console.log(typeof action)
    // console.log(action.name)
    // console.log(action.name == "forceRefreshToken")
    // provo a rinnovare il token soltanto devo fare un azione async che riguarda il backend (basta che il nome della funzione sia backendRequest)
    // console.log(isAsync(action))
    if (typeof action === "function") {
      let { date, refreshTokenPromise, refresh_token } = getState().login;

      // console.log("funzione");
      // console.log(date);
      if (refresh_token && isExpired(date)) {
        console.log("refresh token");
        console.log(refreshTokenPromise);
        // make sure we are not already refreshing the token
        if (!refreshTokenPromise) {
          return refreshTokenNew(dispatch, getState)
            .then(() => next(action))
            .catch(() => {
              console.log("fail refresh and login");
            });
        } else {
          try {
            return refreshTokenPromise.then((response) => {
              next(action);
            });
          } catch (error) {
            console.log(error);
            return refreshTokenNew(dispatch, getState)
              .then(() => next(action))
              .catch(() => {
                console.log("fail refresh and login");
              });
          }
        }

        //     if (action.name == "backendRequest") {
        //     let { date, refreshTokenPromise, refresh_token } = getState().login;

        //     console.log('funzione')
        //     if ( refresh_token && isExpired(date)) {
        //       // make sure we are not already refreshing the token
        //       if (!refreshTokenPromise) {

        //         return refreshTokenNew(dispatch, getState).then(() => next(action));
        //       } else {
        //         return refreshTokenPromise.then(() => next(action));
        //       }
        //     }
        //  } else if (action.name == "forceRefreshToken") {

        //   let { refreshTokenPromise } = getState().login;
        //   if (!refreshTokenPromise) {

        //     return refreshTokenNew(dispatch, getState).then(() => next(action));
        //   } else {
        //     return refreshTokenPromise.then(() => next(action));
        //   }

        //   }
      }
    }
    return next(action);
  };
}

// per ripristinare il token dell'utente usando il refresh token prima del date
// callback, funzione che viene chiamata quando refresh ha avuto successo

// afterRefresh la funzione che chiama tutte le altre funzioni che hanno bisogno del nuovo token
// @dataUser dati utili per la richiesta, eventuali chiamate dopo il refresh
// @afterRefresh, utile per il refresh dopo l'avvio dell'app
// @repeatRefresh, se sto riprovando con il refresh token prima di fare il logout

function refreshTokenNew(dispatch, getState) {
  console.log("function refresh new");
  let { refresh_token } = getState().login;

  const data = {
    grant_type: "refresh_token",
    refresh_token,
    client_id: WebService.client_id,
    client_secret: WebService.client_secret,
  };

  const refreshTokenPromise = axios({
    method: "post",
    url: WebService.url + "/api/v1/auth/token/",
    headers: {
      "content-type": "application/json",
      // "Authorization": `Bearer ${access_token}`,
      "Cache-Control": "no-cache",
    },
    data,
  })
    .then((resp) => {
      console.log(resp);

      if (resp.status == 200) {
        // è stato trovato l'utente
        const { access_token, refresh_token, expires_in } = resp.data;

        // per 1000 perche expires_in è in secondi
        let dateExpires = +new Date();
        dateExpires = dateExpires + 1000 * expires_in;

        dispatch({
          type: START_LOGIN,
          payload: {
            access_token,
            refresh_token,
            date: dateExpires,
          },
        });
        dispatch({
          type: DONE_REFRESHING_TOKEN,
        });
        return Promise.resolve(resp);
      } else {
        const msg = new Error("refresh token fail");
        bugsnag.notify(msg, function (report) {
          report.metadata = { problem: resp };
        });
        dispatch({
          type: DONE_REFRESHING_TOKEN,
        });

        return Promise.reject({
          message: "could not refresh token",
        });
      }
    })
    .catch((ex) => {
      console.log("exception refresh_token", ex);
      // Alert.alert('problemi con il token ');
      // faccio il login

      let { username, password, email } = getState().login;

      const data = {
        grant_type: "password",
        username: email,
        password,
        client_id: WebService.client_id,
        client_secret: WebService.client_secret,
      };

      const loginPromise = axios({
        method: "post",
        url: WebService.url + "/api/v1/auth/token/",
        headers: {
          "content-type": "application/json",
          // "Authorization": `Bearer ${access_token}`,
          "Cache-Control": "no-cache",
        },
        data,
      })
        .then((resp) => {
          console.log(resp);

          if (resp.status == 200) {
            // è stato trovato l'utente
            // è stato trovato l'utente
            const { access_token, refresh_token, expires_in } = resp.data;

            // per 1000 perche expires_in è in secondi
            let date = +new Date();
            date = date + 1000 * expires_in;

            dispatch({
              type: START_LOGIN,
              payload: {
                username,
                email,
                password,
                access_token,
                refresh_token,
                date,
                status: "",
              },
            });
            dispatch({
              type: DONE_REFRESHING_TOKEN,
            });
            return Promise.resolve(resp);
          } else {
            const msg = new Error("login fail");
            bugsnag.notify(msg, function (report) {
              report.metadata = { problem: resp };
            });
            dispatch({
              type: DONE_REFRESHING_TOKEN,
            });
            dispatch({
              type: LOG_OUT,
            });

            Alert.alert(strings("id_99_13"), strings("id_99_14"));

            return Promise.reject({
              message: "could not login",
            });
          }
        })
        .catch((ex) => {
          console.log("exception login", ex);
          // Alert.alert('problemi con il token ');

          if (ex.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            dispatch({
              type: DONE_REFRESHING_TOKEN,
            });
            dispatch({
              type: LOG_OUT,
            });

            Alert.alert(strings("id_99_13"), strings("id_99_14"));
            return Promise.reject({
              message: "could not login",
            });
          } else if (ex.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js

            dispatch({
              type: DONE_REFRESHING_TOKEN,
            });

            return Promise.reject({
              message: "could not login",
            });
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", ex.message);
            dispatch({
              type: DONE_REFRESHING_TOKEN,
            });
            dispatch({
              type: LOG_OUT,
            });

            Alert.alert(strings("id_99_13"), strings("id_99_14"));
            return Promise.reject({
              message: "could not login",
            });
          }
        });
      dispatch({
        type: REFRESHING_TOKEN,
        // we want to keep track of token promise in the state so that we don't     try to refresh the token again while refreshing is in process
        refreshTokenPromise: loginPromise,
      });

      return loginPromise;
    });

  dispatch({
    type: REFRESHING_TOKEN,
    // we want to keep track of token promise in the state so that we don't     try to refresh the token again while refreshing is in process
    refreshTokenPromise,
  });

  return refreshTokenPromise;
}

export function RefreshToken(
  dataUser = {},
  afterRefresh = null,
  repeatRefresh = false
) {
  return async function (dispatch, getState) {
    let { refresh_token, date } = getState().login;
    let dateExpires = +new Date();
    // se non sono connesso, ovvero non c'e il token, allora mi devo disconnettere
    // è una stringa quindi controllo la lunghezza
    /* if (!refresh_token.length) {
        Alert.alert("Session expired", " Please login ");
        dispatch(logOut());
      } */
    console.log("controllo la scadenza token, scadenza e adesso ");
    console.log(date);
    console.log(dateExpires);

    // test per rinnovare il token
    // date = 154420920000;

    // siccome per ogni chiamata che faccio rinnovo il token, controllo se è passato un po di tempo prima di rinnovarlo di nuovo
    // tipo 1 ora prima che scade, se sta per scadere o è scaduto lo rinnovo

    // se sta per scadere lo rinnovo prima
    // 10 min prima

    if (dateExpires > date - 60000) {
      // se il token è ancora valido rinnovo usando il refresh token
      const data = {
        grant_type: "refresh_token",
        refresh_token,
        client_id: WebService.client_id,
      };
      try {
        const response = await requestBackend(
          "post",
          "/o/token/",
          null,
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
            type: START_LOGIN,
            payload: {
              access_token,
              refresh_token,
              date: dateExpires,
            },
          });
          // callback di un eventuale chimata che non è andata a buon fine, dato che il token era scaduto
          requestCallback(
            { ...dataUser, access_token, date: dateExpires },
            dispatch
          );

          // se ha rinnovato il token chiamo tutte le altre funzioni

          if (afterRefresh !== null) {
            dispatch(afterRefresh());
          }
        } else if (response.status === 401) {
          // mancano i dati per fare la richiesta
          dispatch({
            type: FAIL_REFRESH,
            payload: { error_description: response.data.error },
          });
          // riprovo dopo un po a richiedere il token cosi se in quel lasso di tempo il token non si aggiornato nello stato e quindi per due volte non è andato bene
          if (repeatRefresh) {
            // faccio il logout dato che il token del login non è piu valido per due volte di fila
            Alert.alert("Session expired", " Please login again");
            dispatch(logOutNew());
            const msg = new Error("forced logout");
            bugsnag.notify(msg, function (report) {
              report.metadata = { input: getState().login, response };
            });
          } else {
            setTimeout(() => {
              dispatch(RefreshToken(dataUser, afterRefresh, true));
            }, 2000);
          }
        } else if (response.status === 400) {
          // unsupported_grant_type
          // dispatch({
          //   type: FAIL_REFRESH,
          //   payload: { error_description: response.data.error }
          // });

          dispatch(startLogin({}, true));
        }
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          dispatch({
            type: FAIL_REFRESH,
            payload: { error_description: "error catch RefreshToken" },
          });
        } else if (error.request) {
          console.log(error.request);
          dispatch({
            type: FAIL_REFRESH,
            payload: { error_description: "error catch RefreshToken" },
          });
        } else {
          console.log("Error", error.message);
          dispatch({
            type: FAIL_REFRESH,
            payload: { error_description: "error catch RefreshToken" },
          });
        }
        console.log(error.config);
      }
    } else {
      // se ancora non e scaduto
      if (afterRefresh !== null) {
        dispatch(afterRefresh());
      }
    }
  };
}

// forzo il refresh
export function RefreshTokenObligatory(
  dataUser = {},
  afterRefresh = null,
  repeatRefresh = false
) {
  return async function (dispatch, getState) {
    let dateExpires = +new Date();
    let { refresh_token } = getState().login;

    const data = {
      grant_type: "refresh_token",
      refresh_token,
      client_id: WebService.client_id,
    };
    try {
      const response = await requestBackend(
        "post",
        "/o/token/",
        null,
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
          type: START_LOGIN,
          payload: {
            access_token,
            refresh_token,
            date: dateExpires,
          },
        });
        // callback di un eventuale chimata che non è andata a buon fine, dato che il token era scaduto
        requestCallback(
          { ...dataUser, access_token, date: dateExpires },
          dispatch
        );

        // se ha rinnovato il token chiamo tutte le altre funzioni

        if (afterRefresh !== null) {
          dispatch(afterRefresh());
        }
      } else if (response.status === 401) {
        // mancano i dati per fare la richiesta
        dispatch({
          type: FAIL_REFRESH,
          payload: { error_description: response.data.error },
        });
        // riprovo dopo un po a richiedere il token cosi se in quel lasso di tempo il token non si aggiornato nello stato e quindi per due volte non è andato bene
        if (repeatRefresh) {
          // faccio il logout dato che il token del login non è piu valido per due volte di fila
          Alert.alert("Session expired", " Please login again");
          dispatch(logOutNew());
          const msg = new Error("forced logout");
          bugsnag.notify(msg, function (report) {
            report.metadata = { input: getState().login, response };
          });
        } else {
          setTimeout(() => {
            dispatch(RefreshToken(dataUser, afterRefresh, true));
          }, 2000);
        }
      } else if (response.status === 400) {
        // unsupported_grant_type
        dispatch({
          type: FAIL_REFRESH,
          payload: { error_description: response.data.error },
        });

        dispatch(startLogin({}, true));
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        dispatch({
          type: FAIL_REFRESH,
          payload: { error_description: "error catch RefreshToken" },
        });
      } else if (error.request) {
        console.log(error.request);
        dispatch({
          type: FAIL_REFRESH,
          payload: { error_description: "error catch RefreshToken" },
        });
      } else {
        console.log("Error", error.message);
        dispatch({
          type: FAIL_REFRESH,
          payload: { error_description: "error catch RefreshToken" },
        });
      }
      console.log(error.config);
    }
  };
}

export function forceRefreshTokenWithCallback(callback = () => {}) {
  return function forceRefreshToken(dispatch) {
    // setto la data di scadenza a 1 cosi forzo il forzetoken nel middleware
    dispatch({
      type: START_LOGIN,
      payload: {
        date: 1,
      },
    });
    dispatch(callback);
  };
}

export function getActiveStatusProfile2(
  account,
  existParams = () => {},
  notParams = () => {},
  error = () => {}
) {
  return async function (dispatch, getState) {
    let { email } = store.getState().login;
    try {
      const account = { email };
      console.log(account);

      // converto l'oggetto in una stringa pe la get con params &

      const getParams = Object.keys(account).reduce((total, item, index) => {
        // if (
        //   index
        // ) {
        if (account.hasOwnProperty(item)) {
          return total + "&" + item + "=" + account[item].toLowerCase();
        }
        return total;
        // } else {
        //   if (account.hasOwnProperty(item)) {
        //     return "" + item + "=" + account[item];
        //   }
        //   return "";

        // }
      }, "");

      console.log(getParams);

      const response = await requestNewBackend(
        "get",
        "/api/v1/account/check_old_user/?token=" +
          WebService.tokenServer +
          getParams,
        null,
        null,
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 200) {
        // se esiste
        if (response.data.length) {
          // trovato, vedo cosa ho trovato
          existParams(response.data);
        } else {
          // se non esiste vado avanti
          notParams();
        }
      } else {
        error();
        // tolgo l'errore cosi so che ho ricevuto risposte e il caricamneto del crea utente ha concluso
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error" },
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: START_LOGIN,
        payload: {
          status: "",
        },
      });
      Alert.alert("Oops", strings("something_went_"));
      // dispatch({
      //   type: FAIL_LOGIN,
      //   payload: { error_description: "error" }
      // });
    }
  };
}

// controllo se l'utente chiesto ha lo status attivo o no
export async function getActiveStatusProfile(
  callback = () => {},
  dataLogin = {}
) {
  // richiesta di accesso mandando i dati con axios

  // preparo la richiesta legata al login con username e password

  let { email } = store.getState().login;
  if (!email) {
    email = store.getState().login.username;
  }

  if (dataLogin.email) {
    email = dataLogin.email;
  }

  // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
  try {
    const response = await requestNewBackend(
      "get",
      "/api/v1/account/check_old_user/" +
        email +
        "?token=" +
        WebService.tokenServer,
      // "/api/v1/tracking/trip_type/",
      null,
      null,
      "application/json",
      "Bearer"
    );
    console.log(response);
    // Alert.alert(response.status.toString())

    if (response.status === 200) {
      console.log(response.data);
      if (response.data) {
        callback(response.data);
      } else {
        callback({ is_active: false, is_not_present: true });
      }
    } else {
      callback({ is_active: false, is_not_present: true });
    }
  } catch (error) {
    console.log(error);
  }
}

// prendo le info dell'utente
export function getProfileNew(dataUser = {}) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // preparo la richiesta legata al login con username e password

    let { access_token, email } = getState().login;

    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/account/" + email,
        // "/api/v1/tracking/trip_type/",
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log(response);
      // Alert.alert(response.status.toString())

      if (response.status === 200) {
        dispatch({
          type: START_LOGIN,
          payload: {
            infoProfile: response.data,
          },
        });
        // if (!dataUser.test) {
        //   dispatch(forceRefreshTokenWithCallback(getProfileNew({...dataUser, test: true})))
        // }
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(forceRefreshTokenWithCallback(getProfileNew(dataUser)));
      }
    } catch (error) {
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch" },
      });
    }
  };
}

// per prendere le informazioni sull'utente
// newAccess_token dell'utente che si è appena loggato
// newDate, scadenza di questo token

export function getProfile(dataUser = {}, checkProfileFail = false) {
  return async function (dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // preparo la richiesta legata al login con username e password

    let { access_token, username, password, date } = getState().login;
    // se ho appena effettuato il login, uso il token nuovo che ho inserito
    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date) {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );

      dispatch(RefreshToken({ ...dataUser, callback: getProfile }));
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
        console.log(response);
        console.log(checkProfileFail);

        if (response.status === 200) {
          dispatch({
            type: START_LOGIN,
            payload: {
              infoProfile: {
                ...response.data.public_profile,
                ...response.data.private_profile,
                ...response.data,
              },
            },
          });
          if (checkProfileFail) {
            // c'e il check se in caso fallisce la getProfile, se non fallisce come in questa condizione
            // chiamo il resto delle altre chiamate
            dispatch(startAppWithinProfile(dataUser));
          }
          requestCallback({ ...dataUser, access_token, date }, dispatch);
        }

        if (response.status === 403) {
          // se il token è scaduto
          // lo rinnovo e poi ricarico le richieste dall'app
          console.log("token scaduto");

          if (checkProfileFail) {
            console.log("token forzato");
            // se fallisce richiamo il refresh token e poi avvio tutte le richieste iniziali
            dispatch(RefreshTokenObligatory(dataUser, startAppWithProfile));
          } else {
            dispatch(
              RefreshTokenObligatory({
                ...dataLogin,
                callback: getProfile,
              })
            );
          }
        }
      } catch (error) {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error catch" },
        });
      }
    }
  };
}

// funzione per recuperare soltanto i dati pubblici dell'utente
export function getProfilePublic(dataUser = {}, checkProfileFail = false) {
  return async function (dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // preparo la richiesta legata al login con username e password

    let { access_token, username, password, date } = getState().login;
    // se ho appena effettuato il login, uso il token nuovo che ho inserito
    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date) {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );

      dispatch(RefreshToken({ ...dataUser, callback: getProfilePublic }));
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/profile?full=false",
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        console.log(checkProfileFail);

        if (response.status === 200) {
          // infoprofile cambia dato non ho la parte privata
          dispatch({
            type: START_LOGIN,
            payload: {
              infoProfile: {
                ...response.data.public_profile,
                ...response.data,
              },
            },
          });
          if (checkProfileFail) {
            // c'e il check se in caso fallisce la getProfile, se non fallisce come in questa condizione
            // chiamo il resto delle altre chiamate
            dispatch(startAppWithinProfile(dataUser));
          }
          requestCallback({ ...dataUser, access_token, date }, dispatch);
        }

        if (response.status === 403) {
          // se il token è scaduto
          // lo rinnovo e poi ricarico le richieste dall'app
          console.log("token scaduto");

          if (checkProfileFail) {
            console.log("token forzato");
            // se fallisce richiamo il refresh token e poi avvio tutte le richieste iniziali
            dispatch(RefreshTokenObligatory(dataUser, startAppWithProfile));
          } else {
            dispatch(
              RefreshTokenObligatory({
                ...dataLogin,
                callback: getProfilePublic,
              })
            );
          }
        }
      } catch (error) {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error catch" },
        });
      }
    }
  };
}

// per incrementare i coins
export function postIncreaseCoins(dataUser = {}) {
  return async function (dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // preparo la richiesta legata al login con username e password

    let { access_token, date } = getState().login;
    // se ho appena effettuato il login, uso il token nuovo che ho inserito
    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(RefreshToken({ ...dataUser, callback: postIncreaseCoins }));
    } else {
      // preparo il pacchetto con le monete
      const coins = dataUser.coins ? dataUser.coins : 0;

      const data = {
        coins,
      };

      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "post",
          "/api/v1/increase_coins",
          access_token,
          data,
          "application/json",
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          dispatch({
            type: START_LOGIN,
            payload: {
              status: "",
            },
          });
        }
        dispatch(getProfile());
        requestCallback({ ...dataUser, access_token, date }, dispatch);
      } catch (error) {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error catch increase coins" },
        });
      }
    }
  };
}

export function reformRole(array) {
  // prendo il ruolo
  let roleUser = 0;
  for (indexRole = 0; indexRole < array.length; indexRole++) {
    if (array[indexRole].role) {
      if (
        array[indexRole].role === "none" ||
        array[indexRole].role === "muver"
      ) {
        roleUser = 0;
      } else {
        roleUser = array[indexRole].role;
      }
    }
  }
  const role = {
    roleUser,
    indexRole: array.filter((elem) => elem.n_players),
  };
  return role;
}

// prendere il ruolo dell'utente
export function getRole(dataUser = {}) {
  return async function (dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // preparo la richiesta legata al login con username e password

    let { access_token, username, password, date } = getState().login;
    // se ho appena effettuato il login, uso il token nuovo che ho inserito
    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(RefreshToken({ ...dataUser, callback: getRole }));
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/role/",
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);

        if (response.status === 200) {
          const role = reformRole(response.data);
          dispatch({
            type: START_LOGIN,
            payload: {
              role,
            },
          });
        }
        requestCallback({ ...dataUser, access_token, date }, dispatch);
      } catch (error) {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error catch" },
        });
      }
    }
  };
}

export function getMostFrequentRoute(dataUser = {}) {
  return async function (dispatch, getState) {
    let { access_token } = getState().login;

    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/tracking/frequent_trip/",
        access_token,
        null,
        null,
        "Bearer"
      );
      console.log(response);
      if (response.status === 200) {
        dispatch({
          type: START_LOGIN,
          payload: {
            mostFrequentRoute: Object.keys(response.data).map(function (key) {
              return response.data[key];
            }),
          },
        });
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(forceRefreshTokenWithCallback(getMostFrequentRoute(dataUser)));
      }
    } catch (error) {
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch" },
      });
    }
  };
}

export function deleteMostFrequentRoute(
  dataUser = {},
  id,
  callback = () => {}
) {
  return async function (dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // preparo la richiesta legata al login con username e password
    let { access_token } = getState().login;

    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
    try {
      console.log("deleteMostFrequentRoute");
      const response = await requestNewBackend(
        "patch",
        "/api/v1/tracking/frequent_trip/" + id,
        access_token,
        { is_active: false }, // { pk: Number.parseInt(id) },
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 200 || response.status === 204) {
        dispatch({
          type: DELETE_MFR,
          payload: {
            mostFrequentRouteId: id,
          },
        });
        dispatch(getMostFrequentRoute());
        // callback di un eventuale chimata che non è andata a buon fine, dato che il token era scaduto
        callback();
      }
    } catch (error) {
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch" },
      });
    }
  };
}

export function editMostFrequentRoute(dataUser = {}, id, callback = () => {}) {
  return async function (dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // preparo la richiesta legata al login con username e password
    let { access_token } = getState().login;

    console.log("editMostFrequentRoute");
    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
    try {
      let {
        frequent_trip_start,
        frequent_trip_end,
        frequent_trip_type_start,
        frequent_trip_type_end,
        frequent_trip_start_time,
        frequent_trip_choosed_weekdays,
        frequent_trip_end_time,
        mostFrequentRaceModalSplit,
      } = getState().register;

      let frequency = 0;
      for (let i in frequent_trip_choosed_weekdays) {
        if (frequent_trip_choosed_weekdays[i]) frequency++;
      }

      let data = {
        start_point: {
          latitude: frequent_trip_start.latitude,
          longitude: frequent_trip_start.longitude,
        },
        end_point: {
          latitude: frequent_trip_end.latitude,
          longitude: frequent_trip_end.longitude,
        },
        frequency,
        start_time: frequent_trip_start_time,
        end_time: frequent_trip_end_time,
        monday: frequent_trip_choosed_weekdays[1],
        tuesday: frequent_trip_choosed_weekdays[2],
        wednesday: frequent_trip_choosed_weekdays[3],
        thursday: frequent_trip_choosed_weekdays[4],
        friday: frequent_trip_choosed_weekdays[5],
        saturday: frequent_trip_choosed_weekdays[6],
        sunday: frequent_trip_choosed_weekdays[0],
        walk_slider: mostFrequentRaceModalSplit[0].value,
        bike_slider: mostFrequentRaceModalSplit[1].value,
        bus_slider: mostFrequentRaceModalSplit[2].value,
        car_slider: mostFrequentRaceModalSplit[3].value,
        motorbike_slider: mostFrequentRaceModalSplit[4].value,
        train_slider: mostFrequentRaceModalSplit[5].value,
        // is_active,
        start_type: frequent_trip_type_start,
        end_type: frequent_trip_type_end,
      };

      console.log("editMostFrequentRoute");
      const response = await requestNewBackend(
        "patch",
        "/api/v1/tracking/frequent_trip/" + id,
        access_token,
        data, // { is_active: false }, // { pk: Number.parseInt(id) },
        "application/json",
        "Bearer"
      );
      console.log(response.data);
      if (response.status === 200) {
        dispatch({
          type: EDIT_MFR,
          payload: {
            mostFrequentRouteId: id,
            frequent_trip: { ...response.data },
          },
        });
        // callback di un eventuale chimata che non è andata a buon fine, dato che il token era scaduto

        dispatch(getMostFrequentRoute());
        callback();
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(
          forceRefreshTokenWithCallback(
            editMostFrequentRoute(dataUser, id, callback)
          )
        );
      }
    } catch (error) {
      console.log(error);
      // dispatch({
      //   type: FAIL_LOGIN,
      //   payload: { error_description: "error catch" }
      // });
    }
  };
}

// caricare una nuova frequent route dell'utente
// se questa non viene salvata nel db o il server non risponde, la conservo in login come non salvata cosi
// poi la riprendo per salvarla successivamente

// addRoutinePlus se la sto aggiungendo dal recap con il tasto +
export function postMostFrequentRoute(dataUser = {}, addRoutinePlus = false) {
  return async function (dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    // preparo la richiesta legata al login con username e password
    try {
      let {
        access_token,
        date,
        mfr_modal_split_NotSave,
        username,
        password,
      } = getState().login;

      if (dataUser.access_token) {
        access_token = dataUser.access_token;
        date = dataUser.date;
      }

      let {
        mostFrequentRaceFrequency,
        mostFrequentRaceModalSplit,
        mostFrequentRaceFrequencyPosition,
        frequent_trip_start_time,
        frequent_trip_end_time,
        frequent_trip_choosed_weekdays,
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
        start_point,
      } = mostFrequentRaceFrequencyPosition;

      mfr_modal_split = {
        ...mfr_modal_split,
        car_pooling: 0,
        frequency: parseInt(mostFrequentRaceFrequency),
        end_type,
        start_type,
        end_point: [end_point.longitude, end_point.latitude],
        start_point: [start_point.longitude, start_point.latitude],
      };

      let frequent_weekly_route = {
        monday: frequent_trip_choosed_weekdays[1],
        tuesday: frequent_trip_choosed_weekdays[2],
        wednesday: frequent_trip_choosed_weekdays[3],
        thursday: frequent_trip_choosed_weekdays[4],
        friday: frequent_trip_choosed_weekdays[5],
        saturday: frequent_trip_choosed_weekdays[6],
        sunday: frequent_trip_choosed_weekdays[0],
        start_time: frequent_trip_start_time,
        end_time: frequent_trip_end_time,
      };

      // salvo la routine anche come aggiunta dal + dal recap
      if (addRoutinePlus) {
        dispatch(
          addFrequentRouteFromRecap({
            end_point: [end_point.longitude, end_point.latitude],
            start_point: [start_point.longitude, start_point.latitude],
          })
        );
      }

      // data per sapere poi quando scade il token
      let dateExpires = +new Date();
      // se è scaduto o l'utente non è ancora connesso, si connette
      if (dateExpires >= date || !access_token) {
        dispatch(
          RefreshToken({ ...dataUser, callback: postMostFrequentRoute })
        );
      } else {
        // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail

        const response = await requestBackend(
          "post",
          "/api/v1/most_frequent_route",
          access_token,
          mfr_modal_split,
          "application/json",
          "Bearer"
        );

        // se la tratta è stata salvata ovvero 201,
        if (response.status === 201) {
          // salvo i dati sulle giornate e gli orari
          let body = {
            frequent_weekly_route: {
              ...frequent_weekly_route,
              mfr: response.data.id,
            },
          };
          console.log(body);

          dispatch(putUpdateProfileMfr(body, access_token, response));

          requestCallback(dataUser, dispatch);
        } else {
          dispatch({
            type: FAIL_LOGIN,
            payload: {
              error_description: "error",
              mfr_modal_split_NotSave: [
                ...mfr_modal_split_NotSave,
                { ...mfr_modal_split, frequent_weekly_route },
              ],
            },
          });
          // cancello i dati della routine appena creata
          dispatch({
            type: UPDATE_STATE,
            payload: {
              mostFrequentRaceFrequency: null,
              mostFrequentRaceModalSplit: null,
              mostFrequentRaceFrequencyPosition: null,
            },
          });
        }
      }
    } catch (error) {
      bugsnag.notify(error, function (report) {
        report.metadata = { input: getState().register };
      });
      // da sistemare la mostFrequentRaceFrequencyPosition con end_type
      // dispatch({
      //   type: FAIL_LOGIN,
      //   payload: {
      //     error_description: "error catch",
      //     mfr_modal_split_NotSave: [
      //       ...mfr_modal_split_NotSave,
      //       { ...mfr_modal_split, frequent_weekly_route }
      //     ]
      //   }
      // });
      // cancello i dati della routine appena creata
      dispatch({
        type: UPDATE_STATE,
        payload: {
          mostFrequentRaceFrequency: null,
          mostFrequentRaceModalSplit: null,
          mostFrequentRaceFrequencyPosition: null,
        },
      });
    }
  };
}

// se due oggetti sono uguali
function equals(obj1, obj2) {
  try {
    function _equals(obj1, obj2) {
      return (
        JSON.stringify(obj1) === JSON.stringify($.extend(true, {}, obj1, obj2))
      );
    }
    return _equals(obj1, obj2) && _equals(obj2, obj1);
  } catch (error) {
    return false;
  }
}

// nuova versione che tiene contonto degli orari e del nuovo formato delle frequent trips
// caricare una frequent route dell'utente non caricata ancora nel server
export function postMostFrequentRouteNotSave(dataUser = {}) {
  return async function (dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    // preparo la richiesta
    let {
      access_token,
      date,
      mfr_modal_split_NotSave,
      mostFrequentRoute,
      username,
      password,
    } = getState().login;

    // se ho appena effettuato il login, uso il token nuovo che ho inserito
    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken({ ...dataUser, callback: postMostFrequentRouteNotSave })
      );
    } else if (mfr_modal_split_NotSave.length) {
      // tolgo eventuali routine gia salvate anche se sono salvate come salvate
      const mfr_modal_split_DoSave = mfr_modal_split_NotSave.filter((elem) => {
        for (routine = 0; routine < mostFrequentRoute.length; routine++) {
          console.log(elem);
          console.log(mostFrequentRoute[routine]);
          // console.log(JSON.stringify({a: mostFrequentRoute[routine]}) === JSON.stringify({a: elem}))
          // se una è uguale allora non la devo salvare nel backend e di conseguenza la scarto con
          // filter ritornando falso per quella che corrisponde

          if (
            JSON.stringify({ a: mostFrequentRoute[routine] }) ===
            JSON.stringify({ a: elem })
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
          if (response.status == 201) {
            let body = {
              frequent_weekly_route: {
                ...mfr_modal_split_DoSave[routine].frequent_weekly_route,
                mfr: response.data.id,
              },
            };
            console.log(response);

            dispatch(
              putUpdateProfileMfrFromLocalStorage(
                body,
                access_token,
                response,
                mfr_modal_split_DoSave,
                routine
              )
            );

            requestCallback(dataUser, dispatch);
          } else {
            dispatch({
              type: FAIL_LOGIN,
              payload: {
                error_description: "error",
              },
            });
          }
        } catch (error) {
          console.log(error);
          dispatch({
            type: FAIL_LOGIN,
            payload: {
              payload: { error_description: "error catch" },
            },
          });
        }
      }
    }
  };
}

export function putUpdateProfileMfr(body, access_token, response) {
  return async function (dispatch) {
    try {
      const res = await requestBackend(
        "put",
        "/api/v1/profile",
        access_token,
        body,
        "application/json",
        "Bearer"
      );

      console.log(res);
      if (res.status === 200) {
        console.log("INSERITI DATI SUI GIORNI DELLA SETT E SUGLI ORARI");

        dispatch({
          type: ADD_FREQUENT_ROUTE,
          payload: response.data,
        });
        // cancello i dati della routine appena creata
        dispatch({
          type: UPDATE_STATE,
          payload: {
            mostFrequentRaceFrequency: null,
            mostFrequentRaceModalSplit: null,
            mostFrequentRaceFrequencyPosition: null,
          },
        });
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function putUpdateProfileMfrFromLocalStorage(
  body,
  access_token,
  response,
  mfr_modal_split_DoSave,
  routine
) {
  return async function (dispatch) {
    try {
      const res = await requestBackend(
        "put",
        "/api/v1/profile",
        access_token,
        body,
        "application/json",
        "Bearer"
      );

      console.log(res);
      if (res.status === 200) {
        console.log("INSERITI DATI SUI GIORNI DELLA SETT E SUGLI ORARI");

        // salvo le frequent route in login
        dispatch({
          type: ADD_FREQUENT_ROUTE,
          payload: response.data,
        });
        // cancello i dati della routine appena caricata da quelle salvate
        // ovviamente devo cancellare la stessa routine della memoria
        dispatch({
          type: DELETE_FREQUENT_ROUTE_NOT_SAVE,
          payload: mfr_modal_split_DoSave[routine],
        });
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
}

/* 
  // uscire dall'account
  export function logOut() {
    return {
      type: LOG_OUT
    };
  } 
  */

// uscire dall'account
export function logOut(dataUser = {}, callback) {
  return async function (dispatch, getState) {
    // preparo la richiesta
    let { access_token, date, username, password } = getState().login;
    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso
    if (dateExpires >= date || !access_token) {
      // non fare nulla poiche il token non è piu valido
      dispatch({
        type: LOG_OUT,
      });
    } else {
      console.log("logout");
      data = {
        client_id: WebService.client_id,
        token: access_token,
      };
      try {
        const response = await requestBackend(
          "post",
          "/o/revoke_token/",
          null,
          data,
          null,
          "Basic"
        );
        console.log(response);
        // logout effettuato
        if (response.status === 200) {
          // non c'e bisogno essendo che lo faccio comunque

          dispatch({
            type: LOG_OUT,
          });
          if (callback && typeof callback === "function") {
            callback();
          }
        }
      } catch (error) {}
      // comunque deve cancellare tutto
      dispatch({
        type: LOG_OUT,
      });
    }
  };
}

export function logOutNew(dataUser = {}, callback) {
  return {
    type: LOG_OUT,
  };
  // return async function(dispatch, getState) {
  //   // preparo la richiesta
  //   let { access_token } = getState().login;
  //   // se è scaduto o l'utente non è ancora connesso
  //   console.log("logout");
  //   data = {
  //     client_id: WebService.client_id,
  //     client_secret: WebService.client_secret,
  //     token: access_token
  //   };
  //   try {
  //     const response = await requestNewBackend(
  //       "post",
  //       "/api/v1/auth/revoke-token/",
  //       null,
  //       data,
  //       "application/json",
  //       "Bearer"
  //     );
  //     console.log(response);
  //     // logout effettuato
  //     if (response.status === 204) {
  //       // non c'e bisogno essendo che lo faccio comunque

  //       dispatch({
  //         type: LOG_OUT
  //       });
  //       if (callback && typeof callback === "function") {
  //         callback();
  //       }
  //     }
  //   } catch (error) {}
  //   // comunque deve cancellare tutto
  //   dispatch({
  //     type: LOG_OUT
  //   });
  // };
}

// dati sulla tratta che sto creando
// quale tratta sto creando, rispetto alle tratte create
export function createTrip(
  trip,
  LastRoute = 0,
  callback = () => {},
  resume = 0
) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    console.log("creotrip");
    console.log(trip);
    let { access_token } = getState().login;

    const typology = getIdModalTypeNew(trip.type, trip.coef);
    const location = trip.location;
    const car_pool = trip.car_pool;
    // car_pool, groupPooling

    const user_agent = await getDevice();

    // se è una tratta con il pooling attivo, mando anche il pooling in corso
    const data = car_pool
      ? {
          // client_id: WebService.client_id,
          // client_secret: WebService.client_secret,
          device: user_agent,
          typology,
          start_time: trip.start_time_subTrip,
          car_pool,
          location,
        }
      : {
          device: user_agent,
          typology,
          start_time: trip.start_time_subTrip,
          location,
        };

    console.log(data);

    try {
      const response = await requestNewBackend(
        "post",
        "/api/v1/tracking/trip/",
        access_token,
        data,
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 201) {
        // mi salvo l'id della tratta che devo esaminare

        dispatch(UpdateIdSameRoute(response.data, LastRoute));

        if (resume) {
          dispatch(resumeRoute(resume));
        }
        callback();
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(
          forceRefreshTokenWithCallback(
            createTrip(trip, LastRoute, callback, resume)
          )
        );
      } else {
        const msg = new Error("create trip fail");
        bugsnag.notify(msg, function (report) {
          report.metadata = { problem: response };
        });
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error" },
        });
      }

      // in caso di errore, mando anche l'errore utile per sapere cosa sbaglio tipo email
      /* dispatch({
          type: FAIL_LOGIN,
          payload: error.response.data
        }); */
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);

        // if (error.response.status === 403) {
      } else if (error.request) {
        console.log(error.request);
        dispatch({
          type: START_LOGIN,
          payload: {
            status: "",
          },
        });
      } else {
        console.log(error.message);
      }
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch CreateTrip" },
      });
      console.log(error.config);
    }
  };
}

export function createSubTrip(trip, LastRoute = 0, resume = 0) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    let { access_token } = getState().login;
    console.log(trip);

    const typology = getIdModalTypeNew(trip.type, trip.coef);
    const id = trip.id;
    const previous_sub_trip_id = trip.sub_trip.id;
    const end_time = trip.end_time_subTrip;
    const car_pool = trip.car_pool;

    const data = car_pool
      ? {
          car_pool,
          typology,
          trip: id,
          previous_sub_trip_id,
          end_time,
          start_time: end_time,
        }
      : {
          typology,
          trip: id,
          previous_sub_trip_id,
          end_time,
          start_time: end_time,
        };

    try {
      const response = await requestNewBackend(
        "post",
        "/api/v1/tracking/sub_trip/",
        access_token,
        data,
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 201) {
        // mi salvo l'id della tratta che devo esaminare
        dispatch(UpdatePreviousRoute({ sub_trip: response.data }, LastRoute));
        if (resume) {
          dispatch(resumeRoute(resume));
        }
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(
          forceRefreshTokenWithCallback(createSubTrip(trip, LastRoute, resume))
        );
      } else {
        const msg = new Error("create sub trip fail");
        bugsnag.notify(msg, function (report) {
          report.metadata = { problem: response };
        });
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error" },
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
          type: START_LOGIN,
          payload: {
            status: "",
          },
        });
      } else {
        console.log(error.message);
      }
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch createSubTrip" },
      });
      console.log(error.config);
    }
  };
}

// recupero le info su una specifica trip tipo per sapere se è stata analizzata
export function getTrip(trip) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    let { access_token } = getState().login;
    console.log(trip);

    const id = trip.id;

    // const data = {
    //   client_id: WebService.client_id,
    //   client_secret: WebService.client_secret
    // };

    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/tracking/trip/" + id,
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 200) {
        // mi salvo l'id della tratta che devo esaminare
        const trip = response.data.id
          ? response.data.id
          : response.data.trip_id
          ? response.data.trip_id
          : 0;
        if (trip) {
          dispatch({
            type: UPDATE_TRIP_DATA,
            trip,
            payload: response.data,
          });
        }
      } else {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error" },
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
          type: START_LOGIN,
          payload: {
            status: "",
          },
        });
      } else {
        console.log(error.message);
      }
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch getTrip" },
      });
      console.log(error.config);
    }
  };
}

// recupero le info su tutte le trip
export function getAllTrip(
  dataUser = { limit: 20, offset: 0, afterRequest: () => {} }
) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    let { access_token } = getState().login;
    let { id } = getState().login.infoProfile;
    console.log("getAllTrip");
    const { limit, offset } = dataUser;
    // const data = {
    //   client_id: WebService.client_id,
    //   client_secret: WebService.client_secret
    // };

    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/tracking/trip_by_user/" +
          id +
          "?limit=" +
          limit +
          "&offset=" +
          offset,
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 200) {
        // mi salvo l'id della tratta che devo esaminare

        dispatch({
          type: SAVE_TRIPS,
          payload: response.data.results,
        });
      } else {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error" },
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
          type: START_LOGIN,
          payload: {
            status: "",
          },
        });
      } else {
        console.log(error.message);
      }
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch getTrip" },
      });
      console.log(error.config);
    }
  };
}

// dati sulla tratta che sto creando
// quale tratta sto creando, rispetto alle tratte create
export function stopTrip(
  tripObject,
  LastRoute = 0,
  numsegment = 0,
  resume = 0
) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    try {
      let { access_token } = getState().login;
      let trip = 0;
      if (LastRoute) {
        const PreviousRoute = getState().tracking.PreviousRoute;
        console.log(PreviousRoute);
        if (LastRoute - 1 < PreviousRoute.length) {
          trip = PreviousRoute[LastRoute - 1].id;
        }
      } else {
        trip = getState().tracking.id;
      }
      console.log(trip);

      let { end_time_subTrip, subTripId, idTrip } = tripObject;
      console.log(end_time_subTrip);
      console.log(moment(end_time_subTrip).format());

      const data = {
        // client_id: WebService.client_id,
        // client_secret: WebService.client_secret,
        end_time: moment(end_time_subTrip).format(),
        sub_trip_id: subTripId,
      };

      const response = await requestNewBackend(
        "patch",
        "/api/v1/tracking/trip/" + idTrip,
        access_token,
        data,
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 200) {
        // mi salvo l'id della tratta che devo esaminare

        // aggiorno che ho concluso oppure cancello i dati
        // dispatch(UpdatePreviousRoute({sub_trip: response.data}, LastRoute));

        dispatch({
          type: DELETE_ROUTE,
          payload: {
            start: LastRoute,
            size: numsegment,
          },
        });

        if (resume) {
          dispatch(resumeRoute(resume));
        }
        // ha concluso di inviare e ha salvato
        Alert.alert("Ha inviato tutti i dati della tratta");
      } else {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error" },
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
          type: START_LOGIN,
          payload: {
            status: "",
          },
        });
      } else {
        console.log(error.message);
      }
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch stopTrip" },
      });
      console.log(error.config);
    }
  };
}

export function getMultipliers() {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    let { access_token } = getState().login;

    // const data = {
    //   client_id: WebService.client_id,
    //   client_secret: WebService.client_secret
    // };

    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/tracking/multipliers/",
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 200) {
        // mi salvo l'id della tratta che devo esaminare
        dispatch({
          type: START_LOGIN,
          payload: {
            multipliers: response.data,
            status: "",
          },
        });
      } else {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error" },
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
          type: START_LOGIN,
          payload: {
            status: "",
          },
        });
      } else {
        console.log(error.message);
      }
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch getMultipliers" },
      });
      console.log(error.config);
    }
  };
}

// per salvare la route con i vari segment
export function saveRouteBackend(dataLogin, test = true) {
  return async function (dispatch, getState) {
    console.log("manda");
    console.log(data);
    console.log(start);
    console.log(numsegment);
    // richiesta di accesso mandando i dati con axios
    // if (test)
    //   setTimeout(() => dispatch(saveRouteBackend(dataLogin, false)), 100);

    // preparo la richiesta
    let { access_token, date, username, password } = getState().login;

    const { data, start, numsegment, paramCallback, callback } = dataLogin;

    // test per rinnovare il token
    // date = 154420920000;

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // vedo se ho un nuovo token e in caso se è nuovo lo uso.
    if (dataLogin.access_token && dataLogin.date >= date) {
      access_token = dataLogin.access_token;
      date = dataLogin.date;
    }
    console.log("scadenza");
    console.log(date);

    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken({
          ...dataLogin,
          callback: saveRouteBackend,
        })
      );
    } else {
      console.log("manda route");

      // vedo se la tratta è ancora disponibile
      const PreviousRoute = getState().tracking.PreviousRoute;
      // se è disponibile la prendo
      if (PreviousRoute.length >= start) {
        // prendo lo status cosi vedo sto ancora mandando
        // vedo in che stato si trova
        let { status, Saved } = PreviousRoute[start - 1];
        // se non sto inviando
        // Saved, dice se è stata salvata nel db
        console.log(status);
        // status !== "send route" &&

        if (status !== "send route" && !Saved) {
          // dico che sto inviando salvando nella status del primo segmento
          // + 1 poiche 0 è lo stato del tracking corrente
          dispatch(UpdateStatus("send route", start));
          try {
            const response = await requestBackend(
              "post",
              "/api/v1/route/",
              access_token,
              data,
              "application/json",
              "Bearer"
            );
            console.log(response);
            // se la tratta è stata salvata ovvero 201,

            if (response.status === 201) {
              // cancello le route in tracking
              // parto dalla piu vecchia e cancello un tot di sottotrace
              // Alert.alert("Route caricata");
              dispatch({
                type: DELETE_ROUTE,
                payload: {
                  start: start,
                  size: numsegment,
                },
              });
              // prendo la nuova tratta caricata e le nuove statistiche
              setTimeout(
                () => {
                  dispatch(GetListRoute());

                  dispatch(getSpecificPosition());
                  // aggiorno le statistiche generiche utili per i punti totali
                  dispatch(getStats());
                  // ed il ruolo
                  dispatch(getRole());

                  // salvata  nel db, continuo con le validazioni successivve con la callback
                  if (callback && typeof callback === "function") {
                    console.log("callback di resume ");
                    dispatch(callback(paramCallback));
                  } else {
                    // cancello completamentente tutte le route se ho finito

                    dispatch(ResetPreviousRoute());
                  }
                },
                Platform.OS === "android" ? 1000 : 200
              );
              setTimeout(
                () => {
                  const tournament = getState().screen.tournament
                    ? getState().screen.tournament
                    : false;
                  // se ho il torneo
                  console.log(tournament);
                  if (tournament) {
                    dispatch(
                      getWeeklySingleMatch({
                        match_id: tournament.season_match.season_match_id,
                        start_match: tournament.season_match.start_match,
                        saveData: null,
                        currentMatch: true,
                      })
                    );
                  }
                },
                Platform.OS === "android" ? 2000 : 400
              );
            } else if (response.status === 403) {
              // se il token è scaduto
              // lo rinnovo e poi ricarico le richieste dall'app
              console.log("token scaduto");

              dispatch(
                RefreshTokenObligatory({
                  ...dataLogin,
                  callback: saveRouteBackend,
                })
              );
            } else if (response.status === 400) {
              // cancello la tratto dato che la tratta è corrotta o duplicata nel db
              // 400 Bad Request

              // e come risposta:

              //    "error": "This route is already saved"
              // cancello le route in tracking
              // parto dalla piu vecchia e cancello un tot di sottotrace

              dispatch({
                type: DELETE_ROUTE,
                payload: {
                  start: start,
                  size: numsegment,
                },
              });
              // prendo le tratte caricata e le nuove statistiche
              setTimeout(
                () => {
                  dispatch(GetListRoute());

                  dispatch(getSpecificPosition());
                  // aggiorno le statistiche generiche utili per i punti totali
                  dispatch(getStats());
                  // ed il ruolo
                  dispatch(getRole());

                  // salvata  nel db, continuo con le validazioni successivve con la callback
                  if (callback && typeof callback === "function") {
                    console.log("callback di resume ");
                    dispatch(callback(paramCallback));
                  } else {
                    // cancello completamentente tutte le route se ho finito

                    dispatch(ResetPreviousRoute());
                  }
                },
                Platform.OS === "android" ? 1000 : 200
              );
              setTimeout(
                () => {
                  const tournament = getState().screen.tournament
                    ? getState().screen.tournament
                    : false;
                  // se ho il torneo
                  console.log(tournament);
                  if (tournament) {
                    dispatch(
                      getWeeklySingleMatch({
                        match_id: tournament.season_match.season_match_id,
                        start_match: tournament.season_match.start_match,
                        saveData: null,
                        currentMatch: true,
                      })
                    );
                  }
                },
                Platform.OS === "android" ? 2000 : 400
              );
            } else {
              dispatch({
                type: FAIL_LOGIN,
                payload: {
                  error_description: "error",
                },
              });
              dispatch(UpdateStatus("", start));
            }
          } catch (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
              dispatch(UpdateStatus("", start));
              setTimeout(() => {
                dispatch(resumeRoute());
              }, 1500);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log("Error", error.message);
            }
            console.log(error.config);
          }
        } else if (Saved) {
          // se dice che è stata salvata ma non cancellata, la cancello adesso senza invarla di nuovo
          dispatch({
            type: DELETE_ROUTE,
            payload: {
              start: start,
              size: numsegment,
            },
          });
        } else if (status === "send route") {
          // se sto inviando e ancora non ho ricevuto risposta, quindi provo a rimandarla, setto un timer per provare a rimandare dopo due secondi
          setTimeout(() => {
            dispatch(UpdateStatus("", start));
            setTimeout(() => dispatch(resumeRoute()), 500);
          }, 1500);
        }
      }
    }
  };
}

// numberRoute numero di segmenti che si vuole recuperare
// callback , funzione chiamata se ha successo

export function GetRoute(dataUser = {}) {
  return async function (dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // dico che mi sto prendnendo cosi spunta il caricamento
    dispatch({
      type: START_LOGIN,
      payload: {
        status: "Get route",
      },
    });

    // preparo la richiesta legata al login con username e password
    let { access_token, date, username, password, Route } = getState().login;
    // se ho appena effettuato il login, uso il token nuovo che ho inserito
    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }
    let numberRoute = 10;

    // ne prendo dieci come minimo, ma se ne ho caricate altre scendendo la lista, carico quelle che avevo caricato come minimo o massimo di 25

    if (dataUser.numberRoute) {
      numberRoute = dataUser.numberRoute;
    }
    /*  else {
        numberRoute =
          Route.length < 10 ? 10 : Route.length > 25 ? 25 : Route.length;
      } */

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(RefreshToken({ ...dataUser, numberRoute, callback: GetRoute }));
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/route/?limit=" + numberRoute,
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          // salvo le frequent route in login
          // ricevo i dati come un oggetto con un id e lo converto in un array per usare poi un map
          const newRoute = response.data;

          /*  // se ricevo le stesse route, non le salvo
            // controlla la prima se è la stessa, e se ricevo meno route,
            // altrimenti aggiorno
  
            if (
              Route !== [] &&
              (Route[0].id === newRoute[0].id && Route.length > newRoute.length)
            )  */

          dispatch({
            type: START_LOGIN,
            payload: {
              Route: newRoute,
              status: "",
            },
          });

          requestCallback(dataUser, dispatch);
        } else if (response.status === 400 || response.status === 404) {
          dispatch({
            type: START_LOGIN,
            payload: {
              status: "",
            },
          });
          // error: “limit is not valid” or error: “routes not found”
        } else if (response.status === 403) {
          // riprovo a fare la richiesta
          requestCallback({ afterCallback: GetRoute }, dispatch);
          requestCallback(dataUser, dispatch);
          dispatch({
            type: START_LOGIN,
            payload: {
              status: "",
            },
          });
        } else {
          dispatch({
            type: FAIL_LOGIN,
            payload: { error_description: "error" },
          });
        }
      } catch (error) {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error catch" },
        });
      }
    }
  };
}

// numberRoute numero di segmenti che si vuole recuperare
// callback , funzione chiamata se ha successo
// ritorna soltanto la lista delle route e non i punti gps

export function GetListRoute(dataUser = {}) {
  return async function (dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // dico che mi sto prendnendo cosi spunta il caricamento
    dispatch({
      type: START_LOGIN,
      payload: {
        status: "Get route",
      },
    });

    // preparo la richiesta legata al login con username e password
    let { access_token, date } = getState().login;
    // se ho appena effettuato il login, uso il token nuovo che ho inserito
    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }
    let numberRoute = 10;

    // ne prendo dieci come minimo, ma se ne ho caricate altre scendendo la lista, carico quelle che avevo caricato come minimo o massimo di 25

    if (dataUser.numberRoute) {
      numberRoute = dataUser.numberRoute;
    }
    /*  else {
        numberRoute =
          Route.length < 10 ? 10 : Route.length > 25 ? 25 : Route.length;
      } */

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(RefreshToken({ ...dataUser, callback: GetListRoute }));
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "get",
          "/api/v2/route?limit=" + numberRoute,
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          // salvo le frequent route in login
          // ricevo i dati come un oggetto con un id e lo converto in un array per usare poi un map
          const newRoute = response.data;
          /*  // se ricevo le stesse route, non le salvo
            // controlla la prima se è la stessa, e se ricevo meno route,
            // altrimenti aggiorno
  
            if (
              Route !== [] &&
              (Route[0].id === newRoute[0].id && Route.length > newRoute.length)
            )  */

          dispatch({
            type: START_LOGIN,
            payload: {
              Route: newRoute,
              status: "",
            },
          });

          requestCallback(dataUser, dispatch);
        } else if (response.status === 400 || response.status === 404) {
          dispatch({
            type: START_LOGIN,
            payload: {
              status: "",
            },
          });
          // error: “limit is not valid” or error: “routes not found”
        } else if (response.status === 403) {
          // riprovo a fare la richiesta
          requestCallback({ afterCallback: GetListRoute }, dispatch);
          requestCallback(dataUser, dispatch);
          dispatch({
            type: START_LOGIN,
            payload: {
              status: "",
            },
          });
        } else {
          dispatch({
            type: FAIL_LOGIN,
            payload: { error_description: "error" },
          });
        }
        if (dataUser.afterRequest) {
          dataUser.afterRequest();
        }
      } catch (error) {
        if (dataUser.afterRequest) {
          dataUser.afterRequest();
        }
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error catch" },
        });
      }
    }
  };
}

// getList utile per sapere quante route ho fatto in seguenza che ne ho bisogno di piu

export function GetListRouteForCheckSeries(dataUser = {}) {
  return async function (dispatch, getState) {
    console.log(dataUser);
    // richiesta di accesso mandando i dati con axios

    // preparo la richiesta legata al login con username e password
    let { access_token, date, Route } = getState().login;
    // se ho appena effettuato il login, uso il token nuovo che ho inserito
    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }
    // ne prendo altre 20 cosi sono sicuro di riempire la serie
    let numberRoute = Route.length + 20;

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken({ ...dataUser, callback: GetListRouteForCheckSeries })
      );
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "get",
          "/api/v2/route?limit=" + numberRoute,
          access_token,
          null,
          null,
          "Bearer"
        );

        console.log("Prendo altre route per controllare la serie ");
        console.log(response);
        if (response.status === 200) {
          // salvo le frequent route in login
          // ricevo i dati come un oggetto con un id e lo converto in un array per usare poi un map
          const newRoute = response.data;
          // se ci sono nuove route, ricalcolo la serie
          const oldLengthRoute = dataUser.oldRoute
            ? dataUser.oldRoute.length
            : 0;
          const newLengthRoute = newRoute ? newRoute.length : 0;
          // se ne di nuove e sono di piu di quelle vecchie
          console.log("modifiche ?");
          console.log(oldLengthRoute);
          console.log(newLengthRoute);
          if (newLengthRoute && oldLengthRoute !== newLengthRoute) {
            console.log("controlla ");
            dispatch(
              dataUser.callbackToSeries(
                newRoute,
                dataUser.getState,
                dispatch,
                dataUser.dayBefore,
                dataUser.evento
              )
            );
          }
        } else if (response.status === 400 || response.status === 404) {
          // error: “limit is not valid” or error: “routes not found”
        } else if (response.status === 403) {
          // riprovo a fare la richiesta
          requestCallback(
            { afterCallback: GetListRouteForCheckSeries },
            dispatch
          );
        } else {
        }
      } catch (error) {
        console.log("lista non ottenuta per calcolare la serie");
      }
    }
  };
}

// prendo le community a seconda lo status
export function getCommunity(dataUser = {}, callback) {
  return async function (dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    dispatch({
      type: START_LOGIN,
      payload: {
        status: "Get community",
      },
    });

    // status del tipo di community che mi interessa
    const status = dataUser.status;

    // preparo la richiesta legata al login con username e password
    let { access_token, date } = getState().login;
    // se ho appena effettuato il login, uso il token nuovo che ho inserito

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken({
          ...dataUser,
          callback: getCommunity,
        })
      );
    } else {
      if (typeof status != "undefined") {
        console.log("test community");
        try {
          const response = await requestBackend(
            "get",
            "/api/v1/community?status=" + status,
            access_token,
            null,
            null,
            "Bearer"
          );
          // console.log(response);
          if (response.status === 200) {
            const community = response.data;

            dispatch({
              type: START_LOGIN,
              payload: {
                status: "",
              },
            });
            // ritorno i dettagli che salvo nello stato
            if (typeof callback == "function") callback(community);

            requestCallback(dataUser, dispatch);
          } else if (response.status === 400 || response.status === 404) {
            dispatch({
              type: START_LOGIN,
              payload: {
                status: "",
              },
            });
          } else if (response.status === 403) {
            // riprovo a fare la richiesta
            requestCallback({ afterCallback: getCommunity }, dispatch);
            requestCallback(dataUser, dispatch);
            dispatch({
              type: START_LOGIN,
              payload: {
                status: "",
              },
            });
          } else {
            dispatch({
              type: FAIL_LOGIN,
              payload: { error_description: "error" },
            });
          }
        } catch (error) {
          dispatch({
            type: FAIL_LOGIN,
            payload: { error_description: "error catch" },
          });
        }
      } else {
        try {
          const response = await requestBackend(
            "get",
            "/api/v1/community",
            access_token,
            null,
            null,
            "Bearer"
          );
          // console.log(response);
          if (response.status === 200) {
            const community = response.data;

            dispatch({
              type: START_LOGIN,
              payload: {
                status: "",
              },
            });
            // ritorno i dettagli che salvo nello stato
            if (typeof callback == "function") callback(community);

            requestCallback(dataUser, dispatch);
          } else if (response.status === 400 || response.status === 404) {
            dispatch({
              type: START_LOGIN,
              payload: {
                status: "",
              },
            });
          } else if (response.status === 403) {
            // riprovo a fare la richiesta
            requestCallback({ afterCallback: getCommunity }, dispatch);
            requestCallback(dataUser, dispatch);
            dispatch({
              type: START_LOGIN,
              payload: {
                status: "",
              },
            });
          } else {
            dispatch({
              type: FAIL_LOGIN,
              payload: { error_description: "error" },
            });
          }
        } catch (error) {
          dispatch({
            type: FAIL_LOGIN,
            payload: { error_description: "error catch" },
          });
        }
      }
    }
  };
}

export function getDetailRouteNew(dataUser = {}) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // prendo l'id per prendere la tratta di quel trip
    const { referred_route_id, callback } = dataUser;
    let { access_token } = getState().login;

    // dico che mi sto prendnendo cosi spunta il caricamento
    dispatch({
      type: START_LOGIN,
      payload: {
        status: "Get Detail route",
      },
    });

    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/tracking/sub_trip_by_trip/" + referred_route_id,
        // "/api/v1/tracking/trip_type/",
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log(response);
      // Alert.alert(response.status.toString())

      if (response.status === 200) {
        const DetailRoute = response.data;

        dispatch({
          type: START_LOGIN,
          payload: {
            status: "",
          },
        });
        if (callback) {
          // ritorno i dettagli che salvo nello stato
          callback(DetailRoute);
        }
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(forceRefreshTokenWithCallback(getDetailRouteNew(dataUser)));
      }
    } catch (error) {
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch GetDetailRouteNew" },
      });
    }
  };
}

export function getFeedbackForRoute(dataUser = {}) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    console.log(dataUser)
    // prendo l'id per prendere la tratta di quel trip
    const { trip_id, trip_type_id, language, validated, callback } = dataUser;
    let { access_token } = getState().login;

    const valid = validated ? "True" : "False";
    // /tracking/feedback/questions/{trip_id}/{trip_type_id}/{language}/{valid}

    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
    try {
      const response = await requestNewBackend(
        "get",
        // "/api/v1/tracking/feedback/questions/" + trip_id + "/1/1/False",
        "/api/v1/tracking/feedback/questions/" + trip_id + "/" + trip_type_id + "/" + language + "/" + valid,
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log(response);
      // Alert.alert(response.status.toString())

      if (response.status === 200) {
        const feedback = response.data;

        dispatch({
          type: START_LOGIN,
          payload: {
            status: "",
          },
        });
        if (feedback.length) {
          // se ho un feedback, 
          if (callback) {
            // ritorno i dettagli che salvo nello stato
            callback(feedback);
          }
        } else if (!dataUser.repeatNo) {
          // se non ho feedback, provo in inglese, altrimenti poi mi servo 
          dispatch(getFeedbackForRoute({...dataUser, language: 0, repeatNo: true}));
        }
        
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(forceRefreshTokenWithCallback(getFeedbackForRoute(dataUser)));
      }
    } catch (error) {
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch getFeedbackForRoute" },
      });
    }
  };
}

export function postFeedbackForRoute(dataUser = {}) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // prendo l'id per prendere la tratta di quel trip
    const { question, answer, trip, answer_text, file, callback } = dataUser;
    let { access_token } = getState().login;

    // {
    //   "answer_text": "string",
    //   "answer": 0,
    //   "question": 0,
    //   "trip": 0,
    //   "file":null
    // }

    try {
      const data = [{
        answer_text: answer_text ? answer_text : null,
        answer: answer ? answer : null,
        question,
        trip,
        file: file ? file : null,
      }];
      const response = await requestNewBackend(
        "post",
        "/api/v1/tracking/feedback/my_answer",
        access_token,
        data,
        "application/json",
        "Bearer"
      );
      console.log(response);
      // Alert.alert(response.status.toString())

      if (response.status === 201) {
        const feedbackResponse = response.data;

        dispatch({
          type: START_LOGIN,
          payload: {
            status: "",
          },
        });
        if (callback) {
          // ritorno i dettagli che salvo nello stato
          callback(feedbackResponse);
        }
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(forceRefreshTokenWithCallback(postFeedbackForRoute(dataUser)));
      }
    } catch (error) {
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch postFeedbackForRoute" },
      });
    }
  };
}

export function GetDetailRoute(dataUser = {}, callback, dataCallback) {
  return async function (dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // dico che mi sto prendnendo cosi spunta il caricamento
    dispatch({
      type: START_LOGIN,
      payload: {
        status: "Get Detail route",
      },
    });

    // prendo l'id per prendere la tratta di quel trip
    const referred_route_id = dataUser.referred_route_id;

    // preparo la richiesta legata al login con username e password
    let { access_token, date, username, password, Route } = getState().login;
    // se ho appena effettuato il login, uso il token nuovo che ho inserito

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken({
          ...dataUser,
          callback: GetDetailRoute,
        })
      );
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "get",
          "/api/v2/route/?referred_route_id=" + referred_route_id,
          access_token,
          null,
          null,
          "Bearer"
        );
        // console.log(response);
        if (response.status === 200) {
          const DetailRoute = response.data;

          dispatch({
            type: START_LOGIN,
            payload: {
              status: "",
            },
          });
          // ritorno i dettagli che salvo nello stato
          callback(DetailRoute, dataCallback);

          requestCallback(dataUser, dispatch);
        } else if (response.status === 400 || response.status === 404) {
          dispatch({
            type: START_LOGIN,
            payload: {
              status: "",
            },
          });
          // error: “limit is not valid” or error: “routes not found”
        } else if (response.status === 403) {
          // riprovo a fare la richiesta
          requestCallback({ afterCallback: GetDetailRoute }, dispatch);
          requestCallback(dataUser, dispatch);
          dispatch({
            type: START_LOGIN,
            payload: {
              status: "",
            },
          });
        } else {
          dispatch({
            type: FAIL_LOGIN,
            payload: { error_description: "error" },
          });
        }
      } catch (error) {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error catch" },
        });
      }
    }
  };
}

// data, dati d'aggiornare del profilo nel db come oggetto
// callback , funzione chiamata se ha successo o altro

export function UpdateProfile(dataUser = {}) {
  return async function (dispatch, getState) {
    // preparo la richiesta legata al login con username e password
    let { access_token, username, password, date } = getState().login;

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette e poi riprova la chiamata

    // se non viene salvata nel db, almeno le salvo a parte cosi poi le rinvio

    console.log(dataUser);
    // vedo se la citta è definita
    const checkCity = dataUser.data.city
      ? typeof dataUser.data.city === "undefined" || dataUser.data.city === null
        ? false
        : true
      : false;

    const dataNewUser = dataUser.data;
    if (!checkCity) {
      // tolgo la citta essendo undefined
      delete dataNewUser.city;
    }

    console.log(dataUser);

    dispatch({
      type: UPDATE_LOGIN,
      type_payload: "infoProfileNotSave",
      payload: dataNewUser,
    });
    if (dateExpires >= date || !access_token) {
      console.log("riconnetto");
      dispatch(
        RefreshToken({
          ...dataUser,
          data: dataNewUser,
          callback: UpdateProfile,
        })
      );
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "put",
          "/api/v1/profile/",
          access_token,
          dataNewUser,
          "application/json",
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          // salvo le frequent route in login
          // ricevo i dati come un oggetto con un id e lo converto in un array per usare poi un map
          dispatch({
            type: UPDATE_LOGIN,
            type_payload: "infoProfile",
            payload: {
              ...response.data.public_profile,
              ...response.data.private_profile,
              ...response.data,
            },
          });
          // se ha salvato le ultime modifiche posso cancellare quelle non salvate
          dispatch({
            type: DELETE_DATA_PROFILE_OFFLINE,
          });
          requestCallback(dataUser, dispatch);
        } else {
          dispatch({
            type: FAIL_LOGIN,
            payload: { error_description: "error" },
          });
        }
      } catch (error) {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error catch" },
        });
      }
    }
  };
}

// email, una nuova email da utilizzare, cambiando quella precedente
// callback , funzione chiamata se ha successo o altro

export function UpdateEmail(email, callback) {
  return async function (dispatch, getState) {
    // preparo la richiesta legata al login con username e password
    let { access_token, username, password, date } = getState().login;

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette e poi riprova la chiamata
    if (dateExpires >= date || !access_token) {
      dispatch(RefreshToken(username, password, UpdateEmail(email, callback)));
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "put",
          "/accounts/email/",
          access_token,
          { email },
          "application/json",
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          // salvo la nuova email come username
          dispatch({
            type: START_LOGIN,
            payload: {
              username: response.data.email,
            },
          });
        } else {
          dispatch({
            type: FAIL_LOGIN,
            payload: { error_description: "error" },
          });
        }
      } catch (error) {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error catch" },
        });
      }
    }
  };
}

// cambiare la password ma l'utente deve essere loggato
// newPassword, nuova password da utilizzare, cambiando quella precedente
// callback , funzione chiamata se ha successo o altro

export function ChangePassword(oldPassword, newPassword, callback) {
  return async function (dispatch, getState) {
    // preparo la richiesta legata al login con username e password
    let { access_token, username, password, date } = getState().login;

    dispatch({
      type: START_LOGIN,
      payload: {
        status: "Reset Password",
      },
    });
    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette e poi riprova la chiamata
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken(
          username,
          password,
          ChangePassword(oldPassword, newPassword, callback)
        )
      );
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "POST",
          "/account_ra/password/change/",
          access_token,
          {
            old_password: oldPassword,
            new_password1: newPassword,
            new_password2: newPassword,
          },
          "application/json",
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          // salvo la nuova password come password nello stato
          dispatch({
            type: START_LOGIN,
            payload: {
              password: newPassword,
            },
          });
          // ritorno indietro se c'e stato un cambio valido
          if (callback && typeof callback === "function") {
            callback();
          }
        } else if (response.status === 400) {
          Alert.alert("Oops", strings("id_13_58"));
          dispatch({
            type: FAIL_LOGIN,
            payload: { error_description: "error" },
          });
        } else {
          dispatch({
            type: FAIL_LOGIN,
            payload: { error_description: "error" },
          });
        }
      } catch (error) {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error catch" },
        });
      }
    }
  };
}

// cambiare la password mediante l'email
// email, email dove ricevere il link per rinnovare la password
// callback , funzione chiamata se ha successo o altro

export function ResetPasswordWithEmail(email, callback) {
  return async function (dispatch, getState) {
    dispatch({
      type: START_LOGIN,
      payload: {
        status: "Reset Password",
      },
    });

    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
    try {
      const response = await requestBackend(
        "POST",
        "/account_ra/password/reset/",
        null,
        {
          email,
        },
        "application/json",
        null
      );
      console.log(response);
      if (response.status === 200) {
        //email inviata
        // tipo ritornare alla home
        if (callback && typeof callback === "function") {
          callback();
        }
        dispatch({
          type: START_LOGIN,
          payload: {
            status: "",
          },
        });
      } else {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error" },
        });
      }
    } catch (error) {
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch" },
      });
    }
  };
}

// cambiare la password mediante l'email
// email, email dove ricevere il link per rinnovare la password
// callback , funzione chiamata se ha successo o altro

export function ResetPasswordWithEmailNew(email, callback) {
  return async function (dispatch, getState) {
    dispatch({
      type: START_LOGIN,
      payload: {
        status: "Reset Password",
      },
    });

    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
    try {
      const response = await requestNewBackend(
        "POST",
        "/api/v1/password_reset/",
        null,
        { email },
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 200) {
        //email inviata
        // tipo ritornare alla home
        if (callback && typeof callback === "function") {
          callback();
        }
        dispatch({
          type: START_LOGIN,
          payload: {
            status: "",
          },
        });
      } else {
        dispatch({
          type: FAIL_LOGIN,
          payload: { error_description: "error" },
        });
      }
    } catch (error) {
      dispatch({
        type: FAIL_LOGIN,
        payload: { error_description: "error catch" },
      });
    }
  };
}

// aggiorno solo se il dato non è stato precedentemente aggiornato
export function checkTypeformStateForPeriodicFeed(index) {
  return async function (dispatch, getState) {
    const feedUpdate = getState().login.periodicFeed[index]
      ? getState().login.periodicFeed[index].completed
      : "";
    if (!feedUpdate) {
      dispatch(addCompletePeriodicFeed(index));
    }
  };
}

export function checkTypeformFeed(dataUser = {}) {
  return async function (dispatch, getState) {
    // preparo la richiesta legata al login con username e password
    let { access_token, date, username } = getState().login;

    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(RefreshToken({ ...dataUser, callback: checkTypeformFeed }));
    } else {
      console.log("EMAIL");
      console.log(username);
      try {
        // const response = await emailPresentTypeformUserList(username);
        // console.log("TYPEFORM!");
        // console.log(response);

        const response = await requestBackend(
          "get",
          "/api/v1/typeform",
          access_token,
          null,
          null,
          "Bearer"
        );

        console.log(response);

        if (response.status == 200) {
          dispatch({
            type: CHANGE_TYPEFORM_USER_VALUE,
            payload: { typeform_user: true },
          });
          // il feed periodico 8 l'avevo gia completato
          dispatch(checkTypeformStateForPeriodicFeed(8));
        } else if (response.status == 404) {
          dispatch({
            type: CHANGE_TYPEFORM_USER_VALUE,
            payload: { typeform_user: false },
          });
        }

        // dispatch({
        //   type: CHANGE_TYPEFORM_USER_VALUE,
        //   payload: { typeform_user: response }
        // });
      } catch (error) {
        console.log("ERRORE!");
        console.log(error);
      }
    }
  };
}

export function postTypeform(dataUser = {}) {
  return async function (dispatch, getState) {
    // preparo la richiesta legata al login con username e password
    let { access_token, date, username } = getState().login;
    const url = dataUser.url ? dataUser.url : "";
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(RefreshToken({ ...dataUser, callback: postTypeform }));
    } else if (url.length) {
      console.log("EMAIL");
      console.log(username);
      try {
        // const response = await emailPresentTypeformUserList(username);
        // console.log("TYPEFORM!");
        // console.log(response);

        const response = await requestBackend(
          "post",
          "/api/v1/typeform",
          access_token,
          { typeform_url: url },
          "application/json",
          "Bearer"
        );

        console.log("postTypeform");
        console.log(response);

        if (response.status == 200) {
          dispatch({
            type: CHANGE_TYPEFORM_USER_VALUE,
            payload: { typeform_user: true },
          });
          // completato il feed periodico numero 8
          dispatch(checkTypeformStateForPeriodicFeed(8));
        } else if (response.status == 404) {
          dispatch({
            type: CHANGE_TYPEFORM_USER_VALUE,
            payload: { typeform_user: false },
          });
        } else {
          dispatch({
            type: CHANGE_TYPEFORM_USER_VALUE,
            payload: { typeform_user: false },
          });
        }
      } catch (error) {
        console.log("ERRORE!");
        console.log(error);
      }
    }
  };
}

export function setTypeformUser(bool) {
  return async function (dispatch, getState) {
    dispatch({
      type: CHANGE_TYPEFORM_USER_VALUE,
      payload: { typeform_user: bool },
    });
  };
}

export function deleteProfile(dataUser = {}, callback) {
  return async function (dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // preparo la richiesta legata al login con username e password

    let { access_token, username, password, date } = getState().login;
    // se ho appena effettuato il login, uso il token nuovo che ho inserito
    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(RefreshToken({ ...dataUser, callback: deleteProfile }));
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "delete",
          "/api/v1/profile/",
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 204) {
          dispatch({
            type: LOG_OUT,
            payload: {},
          });
        }

        if (callback && typeof callback === "function") {
          callback();
        }
        requestCallback({ ...dataUser, access_token, date }, dispatch);
      } catch (error) {
        console.log(error);
        // dispatch({
        //   type: FAIL_LOGIN,
        //   payload: { error_description: "error" }
        // });
      }
    }
  };
}

// funzione generica per fare una chiamata al backend
// method get o post
// api il tipo di servizio tipo profile con api/v1/
// access_token se si usa nella richiesta o valore d'autenticazione al server
// data , dati da inviare come oggetto
// ContentType tipo di dati inviati, se non specificato è il formato standard
// header tipo di header nella richiesta come Bearer o Basic

// ritorna un oggetto con status e data
export async function requestBackend(
  method,
  api,
  access_token,
  data,
  ContentType,
  header
) {
  // console.log("https://www.muvapp.eu/" + api);
  // per ogni richiesta che faccio se è passato un po di tempo faccio il rinnovo del token
  // RefreshToken();
  // altri dati che cambiano a seconda della richiesta
  // se passo dei dati allora li devo inserire altrimenti no
  let anotherData = data
    ? {
        data: ContentType ? data : qs.stringify(data),
        async: true,
        crossDomain: true,
      }
    : {
        async: true,
        crossDomain: true,
      };

  // header contiene Authorization solo quando c'e una chiamata con l'utente connesso
  const headers = access_token
    ? {
        "content-type": ContentType
          ? ContentType
          : "application/x-www-form-urlencoded",
        Authorization: `${header} ${access_token}`,
        "Cache-Control": "no-cache",
      }
    : {
        "content-type": ContentType
          ? ContentType
          : "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      };

  try {
    const response = await axios({
      method,
      url: WebService.url + api,
      headers,
      ...anotherData,
    });
    // console.log(response.request.responseURL);
    // console.log(response);
    return response;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      return error.response;

      // if (error.response.status === 403) {
    } else if (error.request) {
      console.log(error.request);
      return error.request;
    } else {
      console.log(error.message);
      return error.message;
    }
    console.log(error.config);
  }
}

// ritorna un oggetto con status e data
export async function requestNewBackend(
  method,
  api,
  access_token = null,
  data = {},
  ContentType,
  header
) {
  // header contiene Authorization solo quando c'e una chiamata con l'utente connesso

  const headers = access_token
    ? {
        "content-type": ContentType
          ? ContentType
          : "application/x-www-form-urlencoded",
        Authorization: `${header} ${access_token}`,
        "Cache-Control": "no-cache",
      }
    : {
        "content-type": ContentType
          ? ContentType
          : "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      };

  try {
    const response = await axios({
      method,
      url: WebService.url + api,
      headers,
      data,
    });
    // console.log(response.request.responseURL);
    // console.log(response);
    return response;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      //return error.response;
      return error.response;
      // if (error.response.status === 403) {
    } else if (error.request) {
      console.log(error.request);
      return error.request;
      // return error.request;
    } else {
      console.log(error.message);

      // return error.message;
    }
    return error;
    console.log(error.config);
  }
}

export function setNotificationTime(time, weekDays) {
  return function (dispatch) {
    // pushNotifications.configure();
    // pushNotifications.cancelAllLocalNotifications();
    // if (Platform.OS == "ios") {
    //   pushNotifications.localDailyNotificationSchedule(time, weekDays);
    // } else {
    //   // pushNotifications.localDailyNotificationSchedule(time, weekDays);
    //   pushNotifications.localNotificationSchedule(time, weekDays);
    // }

    dispatch({
      type: SET_NOTIFICATION_TIME,
      type_payload: "notification_schedule",
      payload: time,
    });
  };
}

export function setSundayNotificationIds(ids) {
  console.log(ids);
  return function (dispatch) {
    dispatch({
      type: SET_NOTIFICATION_SUNDAY_IDS,
      type_payload: "notification_sunday_ids",
      payload: ids,
    });
  };
}

export function deleteSundayNotificationIds() {
  return function (dispatch) {
    dispatch({
      type: DELETE_NOTIFICATION_SUNDAY_IDS,
      type_payload: "notification_sunday_ids",
      payload: false,
    });
  };
}

export function setScheduledNotificationIds(ids) {
  console.log(ids);
  return function (dispatch) {
    dispatch({
      type: SET_NOTIFICATION_SCHEDULED_IDS,
      type_payload: "notification_scheduled_ids",
      payload: ids,
    });
  };
}

export function deleteScheduledNotificationIds(ids) {
  console.log(ids);
  return function (dispatch) {
    dispatch({
      type: DELETE_NOTIFICATION_SCHEDULED_IDS,
      type_payload: "notification_scheduled_ids",
      payload: null,
    });
  };
}

export function setNotificationBoolean(bool) {
  return function (dispatch) {
    dispatch({
      type: SET_NOTIFICATION_TIME,
      type_payload: "notification_set",
      payload: bool,
    });
  };
}

export function setWeekDaysNotification(objWeek) {
  return function (dispatch) {
    dispatch({
      type: SET_CHOOSED_WEEKDAYS,
      type_payload: "choosed_week_days",
      payload: objWeek,
    });
  };
}

export function setStillNotification(bool) {
  return function (dispatch) {
    dispatch({
      type: SET_CHOOSED_WEEKDAYS,
      type_payload: "notification_still",
      payload: bool,
    });
  };
}

export function setCarProperties(data) {
  return function (dispatch) {
    dispatch({
      type: SET_CAR_PROPERTIES,
      type_payload: "car_properties",
      payload: data,
    });
  };
}

export function setMotoProperties(data) {
  return function (dispatch) {
    dispatch({
      type: SET_MOTO_PROPERTIES,
      type_payload: "moto_properties",
      payload: data,
    });
  };
}

export function setRemoteNotificationId(token) {
  return function (dispatch) {
    dispatch({
      type: SET_REMOTE_NOTIFICATION_ID,
      type_payload: "remote_notification_token",
      payload: token,
    });
  };
}

export function setFirstConfiguration() {
  return function (dispatch) {
    dispatch({
      type: SET_FIRST_CONFIGURATION,
      payload: true,
    });
  };
}

export function setRightMenuState(bool) {
  return function (dispatch) {
    dispatch({
      type: SET_RIGHT_MENU_STATE,
      payload: bool,
    });
  };
}

// requestCallback, contralla se c'e un eventuale callback da chiamare tra i dati passati e riceve questi stessi dati passati ma senza callback
// callback di un eventuale chimata che non è andata a buon fine, dato che il token era scaduto
// dataLogin, oggetto che contiene dati nuovi di login ed eventuali callback come callback e afterCallback
// dispatch, metodo per chiamare le callback e mandare le relative azioni
export function requestCallback(dataLogin, dispatch) {
  if (dataLogin.callback && typeof dataLogin.callback === "function") {
    console.log("funzione successiva dopo il login ");
    functionCall = dataLogin.callback;
    dispatch(functionCall({ ...dataLogin, callback: null }));
  } else if (
    dataLogin.afterCallback &&
    typeof dataLogin.afterCallback === "function"
  ) {
    console.log("funzione successiva dopo la callback ");
    functionCall = dataLogin.afterCallback;
    dispatch(functionCall({ ...dataLogin, afterCallback: null }));
  }
}

// ritorna tutti i dettagli di una città
export function getCityInfo(dataUser = {}, callback) {
  return async function (dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // preparo la richiesta legata al login con username e password
    let { access_token, date } = getState().login;
    // se ho appena effettuato il login, uso il token nuovo che ho inserito
    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    const city_id = dataUser.city_id;

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken({ ...dataUser, callback: getCityInfo, access_token })
      );
    } else {
      // ho la sessione
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      console.log("mando richiesta");
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/info_city_profile" +
            (city_id > 0 ? "?city_id=" + city_id : ""),
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          const infoUser = response.data;
          console.log(infoUser);

          if (callback) {
            callback(infoUser);
          }

          requestCallback(dataUser, dispatch);
        } else if (response.status === 400) {
        } else if (response.status === 403) {
          // riprovo a fare la richiesta
          requestCallback({ afterCallback: getCityInfo }, dispatch);
          requestCallback(dataUser, dispatch);
        } else {
        }
        dispatch({
          type: "nulla",
          payload: {},
        });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "nulla",
          payload: {},
        });
      }
    }
  };
}

export function setSessionToken() {
  return function (dispatch) {
    let rand = function () {
      return Math.random().toString(36).substr(2); // remove `0.`
    };

    let token = function () {
      return rand() + rand(); // to make it longer
    };

    let expired_date = new Date();
    // console.log("sessionTokenState");
    // console.log(expired_date.getTimezoneOffset() / 60);
    // console.log(expired_date.getHours());
    // // console.log(
    // //   expired_date.getTimezoneOffset() / 60 > 0
    // //     ? expired_date.getHours() + expired_date.getTimezoneOffset() / 60
    // //     : expired_date.getHours() - expired_date.getTimezoneOffset() / 60
    // // );
    expired_date.setHours(expired_date.getHours());
    expired_date.setMinutes(expired_date.getMinutes() + 5);

    dispatch({
      type: SET_SESSION_TOKEN,
      payload: {
        sessionToken: {
          token: token(),
          expired_date: +expired_date,
          pages: null,
        },
      },
    });
  };
}

export function addPageCounted(page) {
  return function (dispatch) {
    dispatch({
      type: ADD_PAGE_COUNTED,
      payload: page,
    });
  };
}

export function getMaintenance(dataUser = {}) {
  return async function (dispatch, getState) {
    try {
      // "http://23.97.216.36" + "/api/v2/extra/maintenance"
      const response = await axios.get(
        WebService.url + "/api/v2/extra/maintenance"
      );

      console.log("getMaintenance");
      console.log(response);

      if (response.status == 200) {
        if (response.data.description)
          if (new Boolean(response.data.description)) {
            alert(strings("our_lovely_app_"));
          }
      } else if (response.status == 404) {
      }
    } catch (error) {
      console.log("ERRORE!");
      console.log(error);
    }
  };
}

export function getTypeformSoddFrust(url, dataUser = {}, callback) {
  return async function (dispatch, getState) {
    let {
      access_token,
      username,
      password,
      date,
      typeform_soddfrust_3,
    } = getState().login;
    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    let dateExpires = +new Date();
    if (dateExpires >= date || !access_token) {
      dispatch(RefreshToken({ ...dataUser, callback: getTypeformSoddFrust }));
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "post",
          "/api/v1/typeform",
          access_token,
          { typeform_url: url },
          "application/json",
          "Bearer"
        );
        console.log("getTypeformSoddFrust");
        console.log(response);
        if (
          response.status == 200 &&
          response.data.description.includes("completed")
        ) {
          dispatch({
            type: SET_SODDFRUST_FLAG,
            payload: 1,
          });
        } else {
          if (typeform_soddfrust_3 != 2)
            dispatch({
              type: SET_SODDFRUST_FLAG,
              payload: 0,
            });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
}

export function setSoddfrustValue(page) {
  return function (dispatch) {
    dispatch({
      type: SET_SODDFRUST_FLAG,
      payload: 2,
    });
  };
}

// register: {
//   frequent_trip_start: {
//     latitude: 37.33233141,
//     longitude: -122.0312186,
//     street: 'Santa Clara County, California'
//   },
//   frequent_trip_end: {
//     latitude: 37.33233141,
//     longitude: -122.0312186,
//     street: 'Santa Clara County, California'
//   },
//   frequent_trip_type_start: 1,
//   frequent_trip_type_end: 2,
//   frequent_trip_start_time: '9:00',
//   frequent_trip_choosed_weekdays: {
//     '0': false,
//     '1': true,
//     '2': true,
//     '3': true,
//     '4': true,
//     '5': true,
//     '6': false
//   },
//   frequent_trip_end_time: '17:00',
// mostFrequentRaceModalSplit: [
//   {
//     label: 'walk',
//     value: 30
//   },
//   {
//     label: 'bike',
//     value: 0
//   },
//   {
//     label: 'bus',
//     value: 0
//   },
//   {
//     label: 'car',
//     value: 0
//   },
//   {
//     label: 'motorbike',
//     value: 0
//   },
//   {
//     label: 'train',
//     value: 0
//   }
// ],
// },

// https://muvprod.tk
// split modale generico dell'utente, comprende il monopattino 
export function postBaseTrip(dataUser = {}) {
  return async function (dispatch, getState) {
    console.log("postBaseTrip");

    let { access_token } = getState().login;
    let { duration, mostFrequentRaceModalSplit } = getState().register;

    try {
      if (mostFrequentRaceModalSplit && mostFrequentRaceModalSplit.length) {
        let walk_slider = 0;
        let bike_slider = 0;
        let bus_slider = 0;
        let train_slider = 0;
        let car_slider = 0;
        let motorbike_slider = 0;
        let electric_scooter_slider = 0;

        walk_slider = mostFrequentRaceModalSplit[0].value;
        bike_slider = mostFrequentRaceModalSplit[1].value;
        electric_scooter_slider = mostFrequentRaceModalSplit[2].value;
        bus_slider = mostFrequentRaceModalSplit[3].value;
        train_slider = mostFrequentRaceModalSplit[4].value;
        car_slider = mostFrequentRaceModalSplit[5].value;
        
        motorbike_slider = mostFrequentRaceModalSplit[6].value;

        const data = {
          walk_slider,
          bike_slider,
          bus_slider,
          train_slider,
          car_slider,
          motorbike_slider,
          electric_scooter_slider,
          duration,
        };

        const response = await requestNewBackend(
          "post",
          "/api/v1/tracking/base_trip/",
          access_token,
          data,
          "application/json",
          "Bearer"
        );
        console.log(response);

        if (response.status === 201) {
          // dispatch(getMostFrequentRoute());
        }
        if (response.status === 401) {
          dispatch(forceRefreshTokenWithCallback(postBaseTrip(dataUser)));
        }
      }
    } catch (error) {
      console.log(error);
      // dispatch({
      //   type: FAIL_LOGIN,
      //   payload: { error_description: "error catch" }
      // });
    }
  };
}

export function postFrequentTrip(dataUser = {}) {
  return async function (dispatch, getState) {
    console.log("postFrequentTrip");

    let { access_token } = getState().login;
    let {
      frequent_trip_start,
      frequent_trip_end,
      frequent_trip_type_start,
      frequent_trip_type_end,
      frequent_trip_start_time,
      frequent_trip_choosed_weekdays,
      frequent_trip_end_time,
      mostFrequentRaceModalSplit,
    } = getState().register;

    try {
      console.log("postFrequentTrip");

      let frequency = 0;
      for (let i in frequent_trip_choosed_weekdays) {
        if (frequent_trip_choosed_weekdays[i]) frequency++;
      }

      let data = {
        start_point: {
          latitude: frequent_trip_start.latitude,
          longitude: frequent_trip_start.longitude,
        },
        end_point: {
          latitude: frequent_trip_end.latitude,
          longitude: frequent_trip_end.longitude,
        },
        frequency,
        start_time: frequent_trip_start_time,
        end_time: frequent_trip_end_time,
        monday: frequent_trip_choosed_weekdays[1],
        tuesday: frequent_trip_choosed_weekdays[2],
        wednesday: frequent_trip_choosed_weekdays[3],
        thursday: frequent_trip_choosed_weekdays[4],
        friday: frequent_trip_choosed_weekdays[5],
        saturday: frequent_trip_choosed_weekdays[6],
        sunday: frequent_trip_choosed_weekdays[0],
        walk_slider: mostFrequentRaceModalSplit[0].value,
        bike_slider: mostFrequentRaceModalSplit[1].value,
        electric_scooter_slider: mostFrequentRaceModalSplit[2].value,
        bus_slider: mostFrequentRaceModalSplit[3].value,
        car_slider: mostFrequentRaceModalSplit[4].value,
        motorbike_slider: mostFrequentRaceModalSplit[5].value,
        train_slider: mostFrequentRaceModalSplit[6].value,
        // is_active,
        start_type: frequent_trip_type_start,
        end_type: frequent_trip_type_end,
      };

      console.log(frequent_trip_start);
      console.log(frequent_trip_end);
      console.log(data);

      const response = await requestNewBackend(
        "post",
        "/api/v1/tracking/frequent_trip/",
        access_token,
        data,
        "application/json",
        "Bearer"
      );
      console.log(response);

      if (response.status === 201) {
        dispatch(getMostFrequentRoute());
      }
      if (response.status === 403) {
        console.log("token scaduto");
      }
    } catch (error) {
      console.log(error);
      // dispatch({
      //   type: FAIL_LOGIN,
      //   payload: { error_description: "error catch" }
      // });
    }
  };
}

export function postFrequentTripFromLateralMenu(dataUser = {}) {
  return async function (dispatch, getState) {
    console.log("postFrequentTrip");

    let { access_token, date } = getState().login;
    let {
      // frequent_trip_start,
      // frequent_trip_end,
      // frequent_trip_type_start,
      // frequent_trip_type_end,
      frequent_trip_start_time,
      frequent_trip_end_time,
      mostFrequentRaceFrequencyPosition,
      frequent_trip_choosed_weekdays,
      mostFrequentRaceModalSplit,
    } = getState().register;

    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    let dateExpires = +new Date();
    if (dateExpires >= date) {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(
        refreshTokenNew({
          ...dataUser,
          callback: postFrequentTripFromLateralMenu,
        })
      );
    } else {
      console.log("postFrequentTrip");

      try {
        console.log("postFrequentTrip");

        let frequency = 0;
        for (let i in frequent_trip_choosed_weekdays) {
          if (frequent_trip_choosed_weekdays[i]) frequency++;
        }

        let data = {
          start_point: {
            latitude: mostFrequentRaceFrequencyPosition.start_point.latitude,
            longitude: mostFrequentRaceFrequencyPosition.start_point.longitude,
          },
          end_point: {
            latitude: mostFrequentRaceFrequencyPosition.end_point.latitude,
            longitude: mostFrequentRaceFrequencyPosition.end_point.longitude,
          },
          frequency,
          start_time: frequent_trip_start_time,
          end_time: frequent_trip_end_time,
          monday: frequent_trip_choosed_weekdays[1],
          tuesday: frequent_trip_choosed_weekdays[2],
          wednesday: frequent_trip_choosed_weekdays[3],
          thursday: frequent_trip_choosed_weekdays[4],
          friday: frequent_trip_choosed_weekdays[5],
          saturday: frequent_trip_choosed_weekdays[6],
          sunday: frequent_trip_choosed_weekdays[0],
          walk_slider: mostFrequentRaceModalSplit[0].value,
          bike_slider: mostFrequentRaceModalSplit[1].value,
          bus_slider: mostFrequentRaceModalSplit[2].value,
          car_slider: mostFrequentRaceModalSplit[3].value,
          motorbike_slider: mostFrequentRaceModalSplit[4].value,
          train_slider: mostFrequentRaceModalSplit[5].value,
          // is_active,
          start_type: mostFrequentRaceFrequencyPosition.start_type,
          end_type: mostFrequentRaceFrequencyPosition.end_type,
        };

        console.log(data);

        const response = await requestBackend(
          "post",
          "/api/v1/tracking/frequent_trip/",
          access_token,
          data,
          "application/json",
          "Bearer"
        );
        console.log(response);

        if (response.status === 201) {
          dispatch(getMostFrequentRoute());
        }
        if (response.status === 403) {
          console.log("token scaduto");
        }
      } catch (error) {
        console.log(error);
        // dispatch({
        //   type: FAIL_LOGIN,
        //   payload: { error_description: "error catch" }
        // });
      }
    }
  };
}
