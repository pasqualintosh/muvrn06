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
  SET_CAR_SEGMENT,
} from "./ActionTypes";
import axios from "axios";
import {
  requestBackend,
  requestNewBackend,
  startLogin,
  startLoginNew,
  getProfile,
  saveIcloud,
} from "../login/ActionCreators";
import { Alert } from "react-native";
import WebService from "./../../config/WebService";
import Settings from "./../../config/Settings";
import { getDevice } from "../../helpers/deviceInfo";
import DeviceInfo from "react-native-device-info";

// import { Analytics, Hits as GAHits } from "react-native-google-analytics";
import { strings } from "../../config/i18n";
import { Client } from "bugsnag-react-native";
const bugsnag = new Client(WebService.BugsnagAppId);
import haversine from "./../../helpers/haversine";

export function updateState(userState) {
  console.log(userState);
  return {
    type: UPDATE_STATE,
    payload: userState,
  };
}

export function getCity(position) {
  return (dispatch) => {
    axios
      .get(WebService.url + "/api/v1/tools/cities/", {
        params: {},
      })
      .then((res) => {
        let locations = res.data.map((v) => {
          return v.location;
        });
        let distances = locations.map((v) => {
          return haversine(
            position.latitude,
            position.longitude,
            v.latitude,
            v.longitude
          );
        });

        let index_of_min_value = distances.reduce(
          (iMin, x, i, arr) => (x < arr[iMin] ? i : iMin),
          0
        );

        // cityId è l'id per il database
        // nearestCity il nome
        dispatch({
          type: UPDATE_STATE,
          payload: {
            cityId: res.data[index_of_min_value].id,
            nearestCity: res.data[index_of_min_value],
          },
        });
      })
      .catch((err) => {
        console.log(err);
        Alert.alert(
          "Oops",
          "Seems like there is an error during the capture of the nearest city. Check your internet connection :("
        );
      });
  };
}

export function getMobilityCarValues() {
  return (dispatch) => {
    axios
      .get(WebService.url + "/api/v1/tools/user_car_possibilities/", {
        params: {},
      })
      .then((res) => {
        console.log(res);
        dataOrderedByFromYear = res.data.sort((a, b) => {
          return a.from_year - b.from_year;
        });

        dispatch({
          type: GET_MOBILITY_CAR_VALUES,
          payload: {
            get_mobility_car_values: dataOrderedByFromYear,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        Alert.alert(
          "Oops",
          "Seems like there is an error during the capture of data used to manipulate your car's mobility habits"
        );
      });
  };
}

export function getMobilityMotoValues() {
  return (dispatch) => {
    axios
      .get(WebService.url + "/api/v1/tools/user_moto_possibilities/", {
        params: {},
      })
      .then((res) => {
        dataOrderedByFromYear = res.data.sort((a, b) => {
          return a.from_year - b.from_year;
        });

        dispatch({
          type: GET_MOBILITY_MOTO_VALUES,
          payload: {
            get_mobility_moto_values: dataOrderedByFromYear,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        Alert.alert(
          "Oops",
          "Seems like there is an error during the capture of data used to manipulate your moto's mobility habits"
        );
      });
  };
}

export function getAllAvatars(callback = () => {}) {
  return async function (dispatch, getState) {
    try {
      const response = await requestBackend(
        "get",
        "/api/v1/account/avatar_list/",
        null,
        {},
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 200) {
        dispatch({
          type: START_LOGIN,
          payload: {
            listAvatar: response.data,
          },
        });
        callback(response.data)
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export async function getAvatars(data, callback, error = () => {}) {
  // const getParams = Object.keys(data).reduce((total, item, index) => {
  //   console.log(total)
  //   console.log( typeof data[item])
  //   if (data.hasOwnProperty(item)) {
  //     return total + "&" + item + "=" +  (typeof data[item] == "string" ?  data[item].toLowerCase() : data[item] );
  //   }
  //   return total;
  // }, "");

  // console.log(getParams);
  console.log(data);
  // axios.post(WebService.url + "/api/v1/account/avatar", data)
  //   .then((res) => {
  //     console(res);
  //     callback(res.data);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     Alert.alert(
  //       "Oops",
  //       "Seems like there is an error during the capture of data used to get Avatars"
  //     );
  //   });
  try {
    const response = await requestBackend(
      "post",
      "/api/v1/account/avatar/",
      null,
      data,
      "application/json",
      "Bearer"
    );
    console.log(response);
    if (response.status === 200) {
      callback(response.data);
    } else {
      error()
      Alert.alert(
        "Oops",
        "Seems like there is an error during the capture of data used to get Avatars"
      );
    }
  } catch (error) {
    console.log(error);
    Alert.alert(
      "Oops",
      "Seems like there is an error during the capture of data used to get Avatars"
    );
  }
}

export function createAccount(account, callback) {
  return async function (dispatch, getState) {
    // sto provando a creare l'utente
    dispatch({
      type: START_LOGIN,
      payload: {
        status: "In register",
      },
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
        mailinglist_gdpr,
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
        start_point,
      } = mostFrequentRaceFrequencyPosition;

      mfr_modal_split = {
        ...mfr_modal_split,
        frequency: parseInt(mostFrequentRaceFrequency),
        end_type,
        start_type,
        end_point: [end_point.longitude, end_point.latitude],
        start_point: [start_point.longitude, start_point.latitude],
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
        mailinglist_gdpr,
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
              email,
            },
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
            payload: { status: response.data.error },
          });
        } else {
          // tolgo l'errore cosi so che ho ricevuto risposte e il caricamneto del crea utente ha concluso
          dispatch({
            type: FAIL_LOGIN,
            payload: { error_description: "error" },
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
  return async function (dispatch, getState) {
    // sto provando a creare l'utente
    dispatch({
      type: START_LOGIN,
      payload: {
        status: "In register",
      },
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
        frequent_trip_choosed_weekdays,
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
          overall_modal_split_car: 0,
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
        car_sharing_user: account.car_sharing_user,
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
              email,
            },
          });

          // avvia il login con token
          // con il secondo parametro a true, carico anche i dati iniziali dell'app come la classifica
          dispatch(startLogin({ username: email, password }, true));

          // mi sposto alla home che carica tutte le altre informazioni
        } else if (response.status === 400) {
          console.log(response);
          Alert.alert("Oops", strings("something_went_"));
          const msg = new Error("register fail");
          bugsnag.notify(msg, function (report) {
            report.metadata = { problem: response.data, input: data };
          });

          // errore dati inseriti
          dispatch({
            type: START_LOGIN,
            payload: { status: response.data.error },
          });
        } else {
          // tolgo l'errore cosi so che ho ricevuto risposte e il caricamneto del crea utente ha concluso
          dispatch({
            type: FAIL_LOGIN,
            payload: { error_description: "error" },
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
      bugsnag.notify(error, function (report) {
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
  return async function (dispatch, getState) {
    // sto provando a creare l'utente
    dispatch({
      type: START_LOGIN,
      payload: {
        status: "In register",
      },
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
        frequent_trip_choosed_weekdays,
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
          city: parseInt(cityId),
        },
        private_profile: {
          first_name: name,
          last_name: surname,
          phone: phone,
        },
        username,
        password,
        email,

        overall_modal_split: {
          overall_modal_split_walk: 0,
          overall_modal_split_bike: 0,
          overall_modal_split_bus: 0,
          overall_modal_split_car_pooling: 0,
          overall_modal_split_car: 0,
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
              email,
            },
          });

          // avvia il login con token
          // con il secondo parametro a true, carico anche i dati iniziali dell'app come la classifica
          dispatch(startLogin({ username: email, password }, true));

          // mi sposto alla home che carica tutte le altre informazioni
        } else if (response.status === 400) {
          // se contiene due parametri specifici come nome e cognome allora utilizzo il nuovo formato gdpr
          if (
            response.data.hasOwnProperty("first_name") &&
            response.data.hasOwnProperty("last_name")
          ) {
            dispatch(createAccountNoGDPR(account, callback));
          } else {
            const msg = new Error("register fail");
            bugsnag.notify(msg, function (report) {
              report.metadata = { problem: response.data, input: data };
            });
            console.log(response);
            Alert.alert("Oops", strings("something_went_"));

            // errore dati inseriti
            dispatch({
              type: START_LOGIN,
              payload: { status: response.data.error },
            });
          }
        } else {
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
    } catch (error) {
      // avviso mancano dei dati
      console.log(error);
      bugsnag.notify(error, function (report) {
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

// registrazione con il nuovo muv
export function createAccountNew(account, callback = () => {}) {
  return async function (dispatch, getState) {
    // sto provando a creare l'utente
    dispatch({
      type: START_LOGIN,
      payload: {
        status: "In register",
      },
    });
    

    try {
      // test di creazione account
      let {
        username,
        password,
        avatar,
        name,
        surname,
        email,
        phone,
        customisation_gdpr,
        sponsorships_gdpr,
        commercialisation_gdpr,
        mailinglist_gdpr,
        frequent_trip_start_time,
        location,
        moto: motorbike_typology,
        car: car_typology,
        cityId: city,
        car_owning_answer: car_user,
        moto_owning_answer: motorbike_user,
        weight,
        date_of_birth,
        gender,
        height,
        bike_owning_answer: bike_tipology
      } = getState().register;

      console.log(account);

      phone = phone.length ? phone : "+39";

      const user_agent = await getDevice();

     

      // const scheduled_notification = frequent_trip_start_time != null && frequent_trip_start_time != undefined
      //   ? frequent_trip_start_time
      //   : "10:00";

      //

      /* const data = {
        password,
        customized_game_experience: commercialisation_gdpr,
        sponsor_and_rewards: sponsorships_gdpr,
        shared_mobility_data: customisation_gdpr,
        mailing_list: mailinglist_gdpr,
        // "city": "1",
        avatar,
        role: 1,
        email,
        username,
        first_name: name,
        last_name: surname,
        mobile_phone: phone,

        // date_of_birth: "25/12/2000",
        // "gender": "1",
        // "height": "180",
        // "weight": "90",
        coins: "0",
        points: "0",
        // "walking_index": "1",
        // "biking_index": "2",
        // "lpt_index":"33",
        // "carpooling_index": "44",
        // "global_index": "50",
        user_agent,
        scheduled_notification,
        // "employment": "1",
        // "bike_tipology": "1",
        // "lpt_user": "1",
        // "train_user": "2",
        // "car_user": "3",
        // "car_typology": "1",
        // "motorbike_user": "1",
        // "motorbike_typology": "1",
        // "car_pooler": "2",
        // "moto_pooler": "3",
        // "bike_sharing_user": "1",
        // "car_sharing_user": "1",
        // "scooter_sharing_user": "1",
        level_of_experience: "1",
        location: {
          latitude: "37.0625",
          longitude: "-95.677068"
        }
      } */

      const data = {
        client_id: WebService.client_id,
        client_secret: WebService.client_secret,
        customized_game_experience: commercialisation_gdpr,
        sponsor_and_rewards: sponsorships_gdpr,
        shared_mobility_data: customisation_gdpr,
        mailing_list: mailinglist_gdpr,
        // city: "1",
        avatar,
        // avatar: "1",
        role: "1",
        email: email.toLowerCase(),
        password,
        username: username.toLowerCase(),
        first_name: name,
        last_name: surname,
        // mobile_phone: "+39123456789",
        // date_of_birth: "25/12/2000",
        // gender: "1",
        // height: "180",
        // weight: "90",
        coins: "0",
        points: "0",
        // walking_index: "1",
        // biking_index: "2",
        // lpt_index:"33",
        // carpooling_index: "44",
        // global_index: "50",
        user_agent,
        // scheduled_notification,
        // employment: "1",
        // bike_tipology: "1",
        // lpt_user: "1",
        // train_user: "2",
        // car_user: "3",
        // car_typology: "1",
        // motorbike_user: "1",
        // motorbike_typology: "1",
        // car_pooler: "2",
        // moto_pooler: "3",
        // bike_sharing_user: "1",
        // car_sharing_user: "1",
        // scooter_sharing_user: "1",
        level_of_experience: "1",
        location,
        motorbike_typology: (motorbike_typology? motorbike_typology : undefined),
        city,
        car_typology: (car_typology? car_typology : undefined),
        car_user: (car_user? car_user : undefined),
        motorbike_user: (motorbike_user? motorbike_user : undefined),
        bike_tipology: (bike_tipology? bike_tipology : undefined),
        weight,
       
        date_of_birth: (date_of_birth? date_of_birth : undefined),
        gender: (gender? gender : undefined),
        height: (height? height : undefined),
        weight: (weight? weight : undefined),
        app_version: DeviceInfo.getVersion()
      };

      console.log(data);

      try {
        callback(); // riattivo il pulsante

        const response = await requestNewBackend(
          "post",
          "/api/v1/account/?token=" + WebService.tokenServer,
          null,
          data,
          "application/json",
          "Bearer"
        );
        console.log(response);
        if (response.status === 201) {
          // utente creato
          const { email, id } = response.data;
          // ci sono anche le info utili per il profilo
          
          dispatch({
            type: START_LOGIN,
            payload: {
              email,
              username,
              id,
              password,
              tutorial: {
                tutorialStart: false,
                tutorialLive: false,
                tutorialMetro: false,
                tutorialCarPooling: false
              },
            },
          });
          // ci sono anche le info utili per il profilo
          dispatch({
            type: START_LOGIN,
            payload: {
              infoProfile: { ...response.data, password: "" },
            },
          });

          dispatch(startLoginNew({ email, password }, true));

          // mi sposto alla home che carica tutte le altre informazioni
        } else if (response.status === 400) {
          const msg = new Error("register fail 400");
          bugsnag.notify(msg, function (report) {
            report.metadata = { problem: response.data, input: data };
          });
          // tolgo l'errore cosi so che ho ricevuto risposte e il caricamneto del crea utente ha concluso
          dispatch({
            type: FAIL_LOGIN,
            payload: { error_description: "error" },
          });
        } else {
          const msg = new Error("register fail diverso da 400");
          bugsnag.notify(msg, function (report) {
            report.metadata = { problem: response, input: data };
          });
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
    } catch (error) {
      // avviso mancano dei dati
      console.log(error);
      bugsnag.notify(error, function (report) {
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

export function checkFilterUniqueAccount(
  account,
  existParams = () => {},
  notParams = () => {},
  error = () => {}
) {
  return async function (dispatch, getState) {
    try {
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
        "/api/v1/account/check_user_badword/?token=" +
          WebService.tokenServer +
          getParams,
        null,
        null,
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 200) {
        // {
        //     “username”: true,
        //     “email”: true,
        //     “badword”: false
        // }
        if (
          !response.data.username &&
          !response.data.email &&
          !response.data.badword
        ) {
          // vado avanti, tutti i parametri soddisfano i filtri e l'unicità
          notParams();
        } else {
          existParams(response.data);
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
// {{baseUrl}}/account/check_user/?token=3a9e8cfb-bfc6-4a1f-b5c6-152b75a98688&amp;username=newuser&amp;email=user@example.com
// controllo di alcuni parametri nella registrazione/login utente che devono essere univoci tipo username e mail
export function checkUniqueAccount(
  account,
  existParams = () => {},
  notParams = () => {},
  error = () => {}
) {
  return async function (dispatch, getState) {
    try {
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
        "/api/v1/account/check_user/?token=" +
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

// registrazione con il nuovo muv con i social
export function createAccountNewSocial(account, callback = () => {}) {
  return async function (dispatch, getState) {
    // sto provando a creare l'utente
    dispatch({
      type: START_LOGIN,
      payload: {
        status: "In register",
      },
    });
    // provo a prendere i dati della registrazione, se qualcuno manca, aggiorno lo stato a '' cosi scompare il caricamneto
    // e potrei anche mandare un avviso

    try {
      // test di creazione account
      let {
        username,
        password,
        avatar,
        name,
        surname,
        email,
        phone,
        customisation_gdpr,
        sponsorships_gdpr,
        commercialisation_gdpr,
        mailinglist_gdpr,
        frequent_trip_start_time,
        social_backend,
        access_token_social,
        location,
        moto: motorbike_typology,
        car: car_typology,
        cityId: city,
        car_owning_answer: car_user,
        moto_owning_answer: motorbike_user,
        weight,
        date_of_birth,
        gender,
        height,
        bike_owning_answer: bike_tipology
      } = getState().register;

      console.log(account);

      phone = phone.length ? phone : "+39";

      const user_agent = await getDevice();

      // const scheduled_notification =
      //   frequent_trip_start_time != null &&
      //   frequent_trip_start_time != undefined
      //     ? frequent_trip_start_time
      //     : "10:00";

      const data = {
        client_id: WebService.client_id,
        client_secret: WebService.client_secret,
        grant_type: "convert_token",
        backend: social_backend,
        token: access_token_social,
        customized_game_experience: commercialisation_gdpr,
        sponsor_and_rewards: sponsorships_gdpr,
        shared_mobility_data: customisation_gdpr,
        mailing_list: mailinglist_gdpr,

        // city: "1",
        avatar: avatar,
        //  avatar: 1,
        role: "1",
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        first_name: name,
        last_name: surname,
        // mobile_phone: "+39123456789",
        // date_of_birth: "25/12/2000",
        // gender: "1",
        // height: "180",
        // weight: "90",
        coins: "0",
        points: "0",
        // walking_index: "1",
        // biking_index: "2",
        // lpt_index: "33",
        // carpooling_index: "44",
        // global_index: "50",
        user_agent,
        // scheduled_notification,
        // employment: "1",
        // bike_tipology: "1",
        // lpt_user: "1",
        // train_user: "2",
        // car_user: "3",
        // car_typology: "1",
        // motorbike_user: "1",
        // motorbike_typology: "1",
        // car_pooler: "2",
        // moto_pooler: "3",
        // bike_sharing_user: "1",
        // car_sharing_user: "1",
        // scooter_sharing_user: "1",
        level_of_experience: "1",
        location,
        motorbike_typology: (motorbike_typology? motorbike_typology : undefined),
        city,
        car_typology: (car_typology? car_typology : undefined),
        car_user: (car_user? car_user : undefined),
        motorbike_user: (motorbike_user? motorbike_user : undefined),
        bike_tipology: (bike_tipology? bike_tipology : undefined),
        weight,
       
        date_of_birth: (date_of_birth? date_of_birth : undefined),
        gender: (gender? gender : undefined),
        height: (height? height : undefined),
        weight: (weight? weight : undefined),
        
        app_version: DeviceInfo.getVersion()
      };

      console.log(data);

      try {
        callback(); // riattivo il pulsante

        const response = await requestNewBackend(
          "post",
          "/api/v1/auth/convert-token",
          null,
          data,
          "application/json",
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          // // utente creato
          // const { email, id } = response.data;
          // dispatch({
          //   type: START_LOGIN,
          //   payload: {
          //     username: email,
          //     id,
          //     password,
          //     email
          //   }
          // });

          // con la registrazione sociale mi collego direttamente senza login

          const { access_token, refresh_token, expires_in } = response.data;
          let date = +new Date().getTime();
          // per 1000 perche expires_in è in secondi
          date = date + 1000 * expires_in;
          dispatch({
            type: START_LOGIN,
            payload: {
              email,
              username,
              password,
              access_token,
              refresh_token,
              date,
              status: "",
              tutorial: {
                tutorialStart: false,
                tutorialLive: false,
                tutorialMetro: false,
                tutorialCarPooling: false
              },
            },
          });
          // dispatch(startLogin({ username: email, password }, true));

          // mi sposto alla home che carica tutte le altre informazioni
        } else if (response.status === 500) {
          // errore legato al backend
          //  dispatch(createAccountNewSocial())
        } else if (response.status === 400) {
          // se contiene due parametri specifici come nome e cognome allora utilizzo il nuovo formato gdpr
          if (
            response.data.hasOwnProperty("first_name") &&
            response.data.hasOwnProperty("last_name")
          ) {
            dispatch(createAccountNoGDPR(account, callback));
          } else {
            const msg = new Error("register fail");
            bugsnag.notify(msg, function (report) {
              report.metadata = { problem: response.data, input: data };
            });
            console.log(response);
            Alert.alert("Oops", strings("something_went_"));

            // errore dati inseriti
            dispatch({
              type: START_LOGIN,
              payload: { status: response.data.error },
            });
          }
        } else {
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
    } catch (error) {
      // avviso mancano dei dati
      console.log(error);
      bugsnag.notify(error, function (report) {
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
  return async function (dispatch) {
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
          payload: { email_is_present: response.data.result },
        });
        // chiamo la callback, che setta lo stato interno allo stato e se è valida ovvero non c'e l'email allora vado avanti
        callback(!response.data.result);
      } else if (response.status === 404) {
        console.log(response.data.result);
        dispatch({
          type: CHECK_EMAIL,
          payload: { email_is_present: response.data.result },
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
  return async function (dispatch) {
    dispatch({
      type: SAVE_BRANCH_TEMP_DATA,
      payload: { followed_user_id, referral_url, link_status },
    });
  };
}

export function clearBranchTempData() {
  return async function (dispatch) {
    dispatch({
      type: CLEAR_BRANCH_TEMP_DATA,
      payload: {
        followed_user_id: null,
        referral_url: null,
        link_status: null,
      },
    });
  };
}

export function setReferralFromRegistration() {
  return async function (dispatch) {
    dispatch({
      type: SET_REFERRAL_FROM_REGISTRATION,
      payload: {},
    });
  };
}

export function clearReferralFromRegistration() {
  return async function (dispatch) {
    dispatch({
      type: CLEAR_REFERRAL_FROM_REGISTRATION,
      payload: {},
    });
  };
}

export function setCarSegment(segment) {
  return async function (dispatch) {
    dispatch({
      type: SET_CAR_SEGMENT,
      payload: { car_segment: segment },
    });
  };
}
