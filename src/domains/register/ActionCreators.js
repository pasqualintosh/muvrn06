import {
  CREATE_USER,
  UPDATE_STATE,
  FAIL_LOGIN,
  START_LOGIN,
  CHECK_EMAIL,
  GET_MOBILITY_CAR_VALUES,
  GET_MOBILITY_MOTO_VALUES,
  SAVE_BRANCH_TEMP_DATA,
  CLEAR_BRANCH_TEMP_DATA,
  SET_REFERRAL_FROM_REGISTRATION,
  CLEAR_REFERRAL_FROM_REGISTRATION,
  SET_CAR_SEGMENT
} from "./ActionTypes";
import axios from "axios";
import {
  requestBackend,
  startLogin,
  getProfile,
  saveIcloud
} from "../login/ActionCreators";
import { Alert } from "react-native";
import WebService from "./../../config/WebService";
import Settings from "./../../config/Settings";
import DeviceInfo from "react-native-device-info";

// import { Analytics, Hits as GAHits } from "react-native-google-analytics";
import { strings } from "../../config/i18n";
import { Client } from "bugsnag-react-native";
const bugsnag = new Client("58b3b39beb78eba9efdc2d08aeb15d84");

export function updateState(userState) {
  console.log(userState);
  return {
    type: UPDATE_STATE,
    payload: userState
  };
}

export function getCity(position) {
  return dispatch => {
    axios
      .get(WebService.url + "/api/v1/city", {
        params: {
          latitude: position.latitude,
          longitude: position.longitude,
          limit: 1,
          language: "en_US"
        }
      })
      .then(res => {
        console.log(res);
        // cityId è l'id per il database
        // nearestCity il nome
        dispatch({
          type: UPDATE_STATE,
          payload: {
            cityId: res.data[0][0],
            nearestCity: res.data[0][1]
          }
        });
      })
      .catch(err => {
        console.log(err);
        Alert.alert(
          "Oops",
          "Seems like there is an error during the capture of the nearest city. Check your internet connection :("
        );
      });
  };
}

export function getMobilityCarValues() {
  return dispatch => {
    axios
      .get(WebService.url + "/api/v1/car", {
        params: {}
      })
      .then(res => {
        dataOrderedByFromYear = res.data.sort((a, b) => {
          return a.from_year - b.from_year;
        });

        dispatch({
          type: GET_MOBILITY_CAR_VALUES,
          payload: {
            get_mobility_car_values: dataOrderedByFromYear
          }
        });
      })
      .catch(err => {
        console.log(err);
        Alert.alert(
          "Oops",
          "Seems like there is an error during the capture of data used to manipulate your car's mobility habits"
        );
      });
  };
}

export function getMobilityMotoValues() {
  return dispatch => {
    axios
      .get(WebService.url + "/api/v1/moto", {
        params: {}
      })
      .then(res => {
        dataOrderedByFromYear = res.data.sort((a, b) => {
          return a.from_year - b.from_year;
        });

        dispatch({
          type: GET_MOBILITY_MOTO_VALUES,
          payload: {
            get_mobility_moto_values: dataOrderedByFromYear
          }
        });
      })
      .catch(err => {
        console.log(err);
        Alert.alert(
          "Oops",
          "Seems like there is an error during the capture of data used to manipulate your moto's mobility habits"
        );
      });
  };
}

export function createAccount(account, callback) {
  return async function(dispatch, getState) {
    // sto provando a creare l'utente
    dispatch({
      type: START_LOGIN,
      payload: {
        status: "In register"
      }
    });
    // provo a prendere i dati della registrazione, se qualcuno manca, aggiorno lo stato a '' cosi scompare il caricamneto
    // e potrei anche mandare un avviso

    try {
      // test di creazione account
      let {
        username,
        password,
        status,
        avatar,
        mostFrequentRaceFrequency,
        cityId,
        name,
        surname,
        email,
        phone,
        generalModalSplit,
        mostFrequentRaceModalSplit,
        mostFrequentRaceFrequencyPosition,
        car_owning_answer,
        car,
        moto_owning_answer,
        moto,
        customisation_gdpr,
        sponsorships_gdpr,
        commercialisation_gdpr,
        mailinglist_gdpr
      } = getState().register;

      const overall_modal_split = generalModalSplit.reduce(
        (total, elem, index, array) => {
          label = elem.label;
          return { ...total, [label]: parseInt((elem.value * 100).toFixed(0)) };
        },
        {}
      );

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
        end_point: [end_point.longitude, end_point.latitude],
        start_point: [start_point.longitude, start_point.latitude]
      };
      const data = {
        username,
        password,
        email,
        status,
        avatar,
        city: parseInt(cityId),
        first_name: name,
        last_name: surname,
        overall_modal_split,
        mfr_modal_split,
        phone: phone,
        car_owning_answer,
        car,
        moto_owning_answer,
        moto,
        customisation_gdpr,
        sponsorships_gdpr,
        commercialisation_gdpr,
        mailinglist_gdpr
      };
      console.log(data);
      console.log(JSON.stringify(data));

      const json = JSON.stringify(data);

      try {
        const response = await requestBackend(
          "post",
          "/accounts/create/",
          null,
          json,
          "application/json",
          "Bearer"
        );
        console.log(response);
        if (response.status === 201) {
          // utente creato
          const { email, id } = response.data;
          dispatch({
            type: START_LOGIN,
            payload: {
              username: email,
              id,
              password,
              email
            }
          });

          // avvia il login con token
          // con il secondo parametro a true, carico anche i dati iniziali dell'app come la classifica
          dispatch(startLogin({ username: email, password }, true));

          // mi sposto alla home che carica tutte le altre informazioni
        } else if (response.status === 400) {
          console.log(response);
          Alert.alert("Oops", strings("something_went_"));

          // errore dati inseriti
          dispatch({
            type: START_LOGIN,
            payload: { status: response.data.error }
          });
        } else {
          // tolgo l'errore cosi so che ho ricevuto risposte e il caricamneto del crea utente ha concluso
          dispatch({
            type: FAIL_LOGIN,
            payload: { error_description: "error" }
          });
        }
      } catch (error) {
        console.log(error);
        Alert.alert("Oops", strings("something_went_"));
        // dispatch({
        //   type: FAIL_LOGIN,
        //   payload: { error_description: "error" }
        // });
      }
    } catch (error) {
      // avviso mancano dei dati
      console.log(error);
      Alert.alert("Oops", strings("something_went_"));
      // dispatch({
      //   type: START_LOGIN,
      //   payload: {
      //     status: ""
      //   }
      // });
    }
  };
}

export function createAccountNoGDPR(account, callback) {
  return async function(dispatch, getState) {
    // sto provando a creare l'utente
    dispatch({
      type: START_LOGIN,
      payload: {
        status: "In register"
      }
    });
    // provo a prendere i dati della registrazione, se qualcuno manca, aggiorno lo stato a '' cosi scompare il caricamneto
    // e potrei anche mandare un avviso

    try {
      // test di creazione account
      let {
        username,
        password,
        status,
        avatar,
        mostFrequentRaceFrequency,
        cityId,
        name,
        surname,
        email,
        phone,
        // generalModalSplit,
        mostFrequentRaceModalSplit,
        car_owning_answer,
        car,
        moto_owning_answer,
        moto,
        customisation_gdpr,
        sponsorships_gdpr,
        commercialisation_gdpr,
        mailinglist_gdpr,
        frequent_trip_end,
        frequent_trip_start,
        frequent_trip_type_start,
        frequent_trip_type_end,
        frequent_trip_start_time,
        frequent_trip_end_time,
        frequent_trip_choosed_weekdays
      } = getState().register;

      console.log(account);

      phone = phone.length ? phone : "+39";

      // adesso overall_modal_split non serve piu

      // const overall_modal_split = account.overall_modal_split.reduce(
      //   (total, elem, index, array) => {
      //     label = elem.label;
      //     return { ...total, [label]: elem.value };
      //   },
      //   {}
      // );

      // let mfr_modal_split = mostFrequentRaceModalSplit.reduce(
      //   (total, elem, index, array) => {
      //     label = elem.label;
      //     return { ...total, [label]: elem.value };
      //   },
      //   {}
      // );

      // mfr_modal_split = {
      //   car_pooling: 0,
      //   ...mfr_modal_split,
      //   frequency: 1,
      //   // frequency:
      //   //   parseInt(mostFrequentRaceFrequency) != null
      //   //     ? parseInt(mostFrequentRaceFrequency)
      //   //     : 1,
      //   start_type: frequent_trip_type_start,
      //   end_type: frequent_trip_type_end,
      //   end_point: [frequent_trip_end.longitude, frequent_trip_end.latitude],
      //   start_point: [
      //     frequent_trip_start.longitude,
      //     frequent_trip_start.latitude
      //   ]
      // };
      // check su moto e car che deve essere un valore intero e maggiore di 0
      // Number.isInteger(moto) ? (moto ? moto : null) : null,
      const data = {
        username,
        password,
        email,
        status,
        avatar,
        city: parseInt(cityId),
        first_name: name,
        last_name: surname,
        overall_modal_split: {
          overall_modal_split_walk: 0,
          overall_modal_split_bike: 0,
          overall_modal_split_bus: 0,
          overall_modal_split_car_pooling: 0,
          overall_modal_split_car: 0
        },
        // mfr_modal_split,
        // frequent_weekly_route: {
        //   monday: frequent_trip_choosed_weekdays[1],
        //   tuesday: frequent_trip_choosed_weekdays[2],
        //   wednesday: frequent_trip_choosed_weekdays[3],
        //   thursday: frequent_trip_choosed_weekdays[4],
        //   friday: frequent_trip_choosed_weekdays[5],
        //   saturday: frequent_trip_choosed_weekdays[6],
        //   sunday: frequent_trip_choosed_weekdays[0],
        //   start_time: frequent_trip_start_time,
        //   end_time: frequent_trip_end_time
        // },
        phone: phone,
        car_owning_answer,
        car: Number.isInteger(car) ? (car ? car : null) : null,
        moto_owning_answer,
        moto: Number.isInteger(moto) ? (moto ? moto : null) : null,
        customisation_gdpr,
        sponsorships_gdpr,
        commercialisation_gdpr,
        mailinglist_gdpr,
        bike: account.bike,
        public_local_transport_subscriber:
          account.public_local_transport_subscriber,
        public_train_transport_subscriber:
          account.public_train_transport_subscriber,
        pooling_pilot: account.pooling_pilot,
        pooling_passenger: account.pooling_passenger,
        bike_sharing_user: account.bike_sharing_user,
        car_sharing_user: account.car_sharing_user
      };
      console.log(data);
      console.log(JSON.stringify(data));

      const json = JSON.stringify(data);

      try {
        callback(); // riattivo il pulsante

        const response = await requestBackend(
          "post",
          "/accounts/create/",
          null,
          json,
          "application/json",
          "Bearer"
        );
        console.log(response);
        if (response.status === 201) {
          // const ga = new Analytics(
          //   Settings.analyticsCode,
          //   DeviceInfo.getUniqueID(),
          //   1,
          //   DeviceInfo.getUserAgent()
          // );
          // let gaEvent = new GAHits.Event(
          //   "pirate funell", // category
          //   "acquisition", // action
          //   "acquisition", // label
          //   "acquisition" // value
          // );
          // ga.send(gaEvent);

          // salvo la password nel portachiavi

          // try {
          //   saveIcloud(email, password)
          //   .then()
          //   .catch();
          // } catch (error) {
          //   console.log(error);
          // }

          // utente creato
          const { email, id } = response.data;
          dispatch({
            type: START_LOGIN,
            payload: {
              username: email,
              id,
              password,
              email
            }
          });

          // avvia il login con token
          // con il secondo parametro a true, carico anche i dati iniziali dell'app come la classifica
          dispatch(startLogin({ username: email, password }, true));

          // mi sposto alla home che carica tutte le altre informazioni
        } else if (response.status === 400) {
          const msg = new Error("register fail");
          bugsnag.notify(msg, function(report) {
            report.metadata = { problem: response.data, input: data };
          });
          console.log(response);
          Alert.alert("Oops", strings("something_went_"));

          // errore dati inseriti
          dispatch({
            type: START_LOGIN,
            payload: { status: response.data.error }
          });
        } else {
          // tolgo l'errore cosi so che ho ricevuto risposte e il caricamneto del crea utente ha concluso
          dispatch({
            type: FAIL_LOGIN,
            payload: { error_description: "error" }
          });
        }
      } catch (error) {
        console.log(error);
        Alert.alert("Oops", strings("something_went_"));
        // dispatch({
        //   type: FAIL_LOGIN,
        //   payload: { error_description: "error" }
        // });
      }
    } catch (error) {
      // avviso mancano dei dati
      console.log(error);
      bugsnag.notify(error, function(report) {
        report.metadata = { input: data };
      });
      Alert.alert("Oops", strings("something_went_"));
      // dispatch({
      //   type: START_LOGIN,
      //   payload: {
      //     status: ""
      //   }
      // });
    }
  };
}

export function createAccountV2(account, callback) {
  return async function(dispatch, getState) {
    // sto provando a creare l'utente
    dispatch({
      type: START_LOGIN,
      payload: {
        status: "In register"
      }
    });
    // provo a prendere i dati della registrazione, se qualcuno manca, aggiorno lo stato a '' cosi scompare il caricamneto
    // e potrei anche mandare un avviso

    try {
      // test di creazione account
      let {
        username,
        password,
        status,
        avatar,
        mostFrequentRaceFrequency,
        cityId,
        name,
        surname,
        email,
        phone,
        // generalModalSplit,
        mostFrequentRaceModalSplit,
        car_owning_answer,
        car,
        moto_owning_answer,
        moto,
        customisation_gdpr,
        sponsorships_gdpr,
        commercialisation_gdpr,
        mailinglist_gdpr,
        frequent_trip_end,
        frequent_trip_start,
        frequent_trip_type_start,
        frequent_trip_type_end,
        frequent_trip_start_time,
        frequent_trip_end_time,
        frequent_trip_choosed_weekdays
      } = getState().register;

      console.log(account);

      phone = phone.length ? phone : "+39";

      // adesso overall_modal_split non serve piu

      // const overall_modal_split = account.overall_modal_split.reduce(
      //   (total, elem, index, array) => {
      //     label = elem.label;
      //     return { ...total, [label]: elem.value };
      //   },
      //   {}
      // );

      // let mfr_modal_split = mostFrequentRaceModalSplit.reduce(
      //   (total, elem, index, array) => {
      //     label = elem.label;
      //     return { ...total, [label]: elem.value };
      //   },
      //   {}
      // );

      // mfr_modal_split = {
      //   car_pooling: 0,
      //   ...mfr_modal_split,
      //   frequency: 1,
      //   // frequency:
      //   //   parseInt(mostFrequentRaceFrequency) != null
      //   //     ? parseInt(mostFrequentRaceFrequency)
      //   //     : 1,
      //   start_type: frequent_trip_type_start,
      //   end_type: frequent_trip_type_end,
      //   end_point: [frequent_trip_end.longitude, frequent_trip_end.latitude],
      //   start_point: [
      //     frequent_trip_start.longitude,
      //     frequent_trip_start.latitude
      //   ]
      // };
      // check su moto e car che deve essere un valore intero e maggiore di 0
      // Number.isInteger(moto) ? (moto ? moto : null) : null,
      const data = {
        public_profile: {
          car_owning_answer,
          car: Number.isInteger(car) ? (car ? car : null) : null,
          moto_owning_answer,
          moto: Number.isInteger(moto) ? (moto ? moto : null) : null,
          customisation_gdpr,
          sponsorships_gdpr,
          commercialisation_gdpr,
          mailinglist_gdpr,
          // bike: account.bike,
          // public_local_transport_subscriber:
          //   account.public_local_transport_subscriber,
          // public_train_transport_subscriber:
          //   account.public_train_transport_subscriber,
          // pooling_pilot: account.pooling_pilot,
          // pooling_passenger: account.pooling_passenger,
          // bike_sharing_user: account.bike_sharing_user,
          // car_sharing_user: account.car_sharing_user,
          status,
          avatar,
          city: parseInt(cityId)
        },
        private_profile: {
          first_name: name,
          last_name: surname,
          phone: phone
        },
        username,
        password,
        email,

        overall_modal_split: {
          overall_modal_split_walk: 0,
          overall_modal_split_bike: 0,
          overall_modal_split_bus: 0,
          overall_modal_split_car_pooling: 0,
          overall_modal_split_car: 0
        }
        // mfr_modal_split,
        // frequent_weekly_route: {
        //   monday: frequent_trip_choosed_weekdays[1],
        //   tuesday: frequent_trip_choosed_weekdays[2],
        //   wednesday: frequent_trip_choosed_weekdays[3],
        //   thursday: frequent_trip_choosed_weekdays[4],
        //   friday: frequent_trip_choosed_weekdays[5],
        //   saturday: frequent_trip_choosed_weekdays[6],
        //   sunday: frequent_trip_choosed_weekdays[0],
        //   start_time: frequent_trip_start_time,
        //   end_time: frequent_trip_end_time
        // },
      };
      console.log(data);
      console.log(JSON.stringify(data));

      const json = JSON.stringify(data);

      try {
        callback(); // riattivo il pulsante

        const response = await requestBackend(
          "post",
          "/accounts/create/",
          null,
          json,
          "application/json",
          "Bearer"
        );
        console.log(response);
        if (response.status === 201) {
          // const ga = new Analytics(
          //   Settings.analyticsCode,
          //   DeviceInfo.getUniqueID(),
          //   1,
          //   DeviceInfo.getUserAgent()
          // );
          // let gaEvent = new GAHits.Event(
          //   "pirate funell", // category
          //   "acquisition", // action
          //   "acquisition", // label
          //   "acquisition" // value
          // );
          // ga.send(gaEvent);

          // salvo la password nel portachiavi

          // try {
          //   saveIcloud(email, password)
          //   .then()
          //   .catch();
          // } catch (error) {
          //   console.log(error);
          // }

          // utente creato
          const { email, id } = response.data;
          dispatch({
            type: START_LOGIN,
            payload: {
              username: email,
              id,
              password,
              email
            }
          });

          // avvia il login con token
          // con il secondo parametro a true, carico anche i dati iniziali dell'app come la classifica
          dispatch(startLogin({ username: email, password }, true));

          // mi sposto alla home che carica tutte le altre informazioni
        } else if (response.status === 400) {
          // se contiene due parametri specifici come nome e cognome allora utilizzo il nuovo formato gdpr
          if (response.data.hasOwnProperty('first_name') && response.data.hasOwnProperty('last_name')) {
            dispatch(createAccountNoGDPR(account, callback))
          } else {
            const msg = new Error("register fail");
            bugsnag.notify(msg, function(report) {
              report.metadata = { problem: response.data, input: data };
            });
            console.log(response);
            Alert.alert("Oops", strings("something_went_"));
  
            // errore dati inseriti
            dispatch({
              type: START_LOGIN,
              payload: { status: response.data.error }
            });
          } 
          
        } else {
          // tolgo l'errore cosi so che ho ricevuto risposte e il caricamneto del crea utente ha concluso
          dispatch({
            type: FAIL_LOGIN,
            payload: { error_description: "error" }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: START_LOGIN,
          payload: {
            status: ""
          }
        });
        Alert.alert("Oops", strings("something_went_"));
        // dispatch({
        //   type: FAIL_LOGIN,
        //   payload: { error_description: "error" }
        // });
      }
    } catch (error) {
      // avviso mancano dei dati
      console.log(error);
      bugsnag.notify(error, function(report) {
        report.metadata = { input: data };
      });
      Alert.alert("Oops", strings("something_went_"));
      // dispatch({
      //   type: START_LOGIN,
      //   payload: {
      //     status: ""
      //   }
      // });
    }
  };
}

export function checkEmail(email, callback) {
  return async function(dispatch) {
    let now = +new Date();
    try {
      const response = await requestBackend(
        "get",
        "/api/v1/email?email=" + email,
        null,
        null,
        null,
        null
      );
      if (response.status === 200) {
        console.log(response.data.result);
        dispatch({
          type: CHECK_EMAIL,
          payload: { email_is_present: response.data.result }
        });
        // chiamo la callback, che setta lo stato interno allo stato e se è valida ovvero non c'e l'email allora vado avanti
        callback(!response.data.result);
      } else if (response.status === 404) {
        console.log(response.data.result);
        dispatch({
          type: CHECK_EMAIL,
          payload: { email_is_present: response.data.result }
        });
        // chiamo la callback, che setta lo stato interno allo stato e se è valida ovvero non c'e l'email allora vado avanti
        callback(!response.data.result);
      } else {
        // se non ricevo risposta la validazione è falsa
        callback(false);
      }
    } catch (exception) {
      console.log("Exception from api/v1/email");
      console.log(exception);
      // se non ricevo risposta la validazione è falsa
      callback(false);
      // dispatch({
      //   type: FAILED
      // });
    }
  };
}

export function saveBranchTempData(
  followed_user_id,
  referral_url,
  link_status
) {
  return async function(dispatch) {
    dispatch({
      type: SAVE_BRANCH_TEMP_DATA,
      payload: { followed_user_id, referral_url, link_status }
    });
  };
}

export function clearBranchTempData() {
  return async function(dispatch) {
    dispatch({
      type: CLEAR_BRANCH_TEMP_DATA,
      payload: { followed_user_id: null, referral_url: null, link_status: null }
    });
  };
}

export function setReferralFromRegistration() {
  return async function(dispatch) {
    dispatch({
      type: SET_REFERRAL_FROM_REGISTRATION,
      payload: {}
    });
  };
}

export function clearReferralFromRegistration() {
  return async function(dispatch) {
    dispatch({
      type: CLEAR_REFERRAL_FROM_REGISTRATION,
      payload: {}
    });
  };
}

export function setCarSegment(segment) {
  return async function(dispatch) {
    dispatch({
      type: SET_CAR_SEGMENT,
      payload: { car_segment: segment }
    });
  };
}
