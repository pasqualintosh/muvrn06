import {
  UPDATE_STATUS_TRAINING,
  LEVEL_UP,
  GET_TRAINING_SESSIONS,
  GET_EVENTS,
  PUT_EVENTS,
  PUT_SESSION,
  GET_USER_LEVEL,
  SAVE_OFFLINE_EVENTS,
  FETCHING_TRAININGS_DATA,
  GET_LEVEL_EVENTS,
  GET_QUIZ,
  COMPLETE_QUIZ,
  CHANGE_SCREEN_PROFILE,
  UPDATE_COUNTER_EVENT,
  GET_SPECIAL_TRAINING_SESSIONS,
  GET_COMPLETE_QUIZ,
  SUBSCRIBE_SPECIAL_TRAINING_SESSIONS,
  GET_SPECIAL_TRAINING_SESSIONS_SUBSCRIBED,
  SAVE_ST_OFFLINE,
  REMOVE_ST_OFFLINE,
  SET_NEW_ST_PIVOTS,
  SET_COMPLETED_ST_PIVOTS,
  ADD_REDEEMED_REWARD,
  TOGGLE_ST_TEATRO,
  TOGGLE_ST_BALLARAK,
  TOGGLE_ST_MUVTOGET,
  TOGGLE_ST_KALSA
} from "./ActionTypes";
import {
  requestBackend,
  RefreshToken,
  requestCallback,
  GetListRouteForCheckSeries,
  getProfile,
  getProfilePublic,
  addCompletePeriodicFeed
} from "../login/ActionCreators"; // da far puntare agli helper!!!

import {
  getWeeklyLeaderboard,
  getMonthlyLeaderboard
} from "../standings/ActionCreators"; // da far puntare agli helper!!!

import { checkFrequentTrip } from "./../tracking/ActionCreators"; // controllo routine

import { Alert, AsyncStorage, Platform } from "react-native";
import haversine from "./../../helpers/haversine";

import { Client } from "bugsnag-react-native";
const bugsnag = new Client("58b3b39beb78eba9efdc2d08aeb15d84");

import { emailPresentTypeformUserList } from "./../../config/Tester";

import { SpecialTrainings } from "./../../helpers/SpecialTrainings";

export function changeScreenProfile(screen) {
  return async function(dispatch, getState) {
    dispatch({
      type: CHANGE_SCREEN_PROFILE,
      payload: screen
    });
  };
}

// ritorna tutti i quiz e i survey completati dall'utente
export function getCompleteQuizAndSurvey(dataUser = {}, callback) {
  return async function(dispatch, getState) {
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
      dispatch(
        RefreshToken({
          ...dataUser,
          callback: getCompleteQuizAndSurvey,
          access_token
        })
      );
    } else {
      // chiudo i survey completati
      console.log("mando richiesta getComplete");

      try {
        const response = await requestBackend(
          "get",
          "/api/v1/user_survey?type=quiz",
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          const allComplete = response.data;

          dispatch({
            type: GET_COMPLETE_QUIZ,
            payload: allComplete
          });

          requestCallback(dataUser, dispatch);
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "error 400"
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "Error"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_TRAINING,
          payload: {
            status: "Error catch"
          }
        });
      }
    }
  };
}

export function getUserLevel(dataUser = {}) {
  return async function(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // dico che mi sto prendnendo cosi spunta il caricamento
    dispatch({
      type: UPDATE_STATUS_TRAINING,
      payload: {
        status: "Get Level"
      }
    });

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
      dispatch(RefreshToken({ ...dataUser, callback: getUserLevel }));
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/level",
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 201 || response.status === 200) {
          // 201 quando si crea il livello per la prima volta
          const level = response.data;

          dispatch({
            type: GET_USER_LEVEL,
            payload: {
              level
            }
          });
          // se ho raggiunto il livello massimo ovvero 4 mi salvo la data

          if (level.level_number && level.level_number === 4) {
            dispatch(addCompletePeriodicFeed(4));
          }

          dispatch(getTrainingSessions());
          requestCallback(dataUser, dispatch);
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "400"
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta
          requestCallback({ afterCallback: getUserLevel }, dispatch);
          requestCallback(dataUser, dispatch);
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "Error"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_TRAINING,
          payload: {
            status: "Error catch"
          }
        });
      }
    }
  };
}

export function getEvents(dataUser = {}) {
  return async function(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // dico che mi sto prendnendo cosi spunta il caricamento
    dispatch({
      type: UPDATE_STATUS_TRAINING,
      payload: {
        status: "Get Events"
      }
    });

    // preparo la richiesta legata al login con username e password
    let { access_token, date } = getState().login;
    // se ho appena effettuato il login, uso il token nuovo che ho inserito
    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }
    // prendo la session-id dell'ultima sessione attiva
    let { training_sessions } = getState().trainings;

    let session_id = -1;
    if (dataUser.session_id) {
      session_id = dataUser.session_id;
    } else {
      for (i = 0; i < training_sessions.length; i++) {
        // prendo quella attiva ovvero status 2
        if (training_sessions[i].status === 2) {
          session_id = training_sessions[i].id;
        }
      }
    }
    console.log("eventi della sessione");
    console.log(session_id);

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken({ ...dataUser, callback: getEvents, access_token })
      );
    } else if (session_id >= 0) {
      // ho la sessione
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      console.log("mando richiesta");
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/events?session_id=" + session_id,
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          const events = response.data;

          // salvo solo gli eventi non completati, ovvero status 0, salvo le condizioni
          // altrimenti non le conservo

          // vedo se qualcuno è se un quiz o un survey
          let quiz = 0;
          let survey = 0;

          // eventi completati
          let eventsCompleted = [];

          const infoEvents = events.map(elem => {
            // vedo se ho un quiz o survey
            // se l'ho trovato non aggiorno
            // posso avere solanto uno dei due o nessuno
            if (!quiz && !survey) {
              quiz = elem.event.quiz ? elem.id : 0;
              survey = elem.event.survey ? elem.id : 0;
            }
            // se completato
            if (elem.status) {
              eventsCompleted = [...eventsCompleted, elem.event.id];
              return {
                id: elem.id,
                status: elem.status,
                updated_at: elem.updated_at,
                event: {
                  id: elem.event.id,
                  text_description: elem.event.quiz
                    ? "Answer a quick quiz"
                    : elem.event.survey
                    ? "Answer a quick survey about your mobility habits"
                    : elem.event.text_description
                }
              };
            } else {
              return {
                id: elem.id,
                status: elem.status,
                updated_at: elem.updated_at,
                event: elem.event
              };
            }
          });

          dispatch({
            type: GET_EVENTS,
            payload: {
              infoEvents
            }
          });

          // eventuali eventi doppi
          console.log("controllo eventi doppi");
          events.map(elem => {
            const positionId = eventsCompleted.indexOf(elem.event.id);
            console.log(positionId);
            // se è non completato vedo se ho un altro evento con lo stesso id
            if (positionId !== -1 && !elem.status) {
              if (elem.event.quiz) {
                dispatch(
                  putQuiz({
                    event_id: elem.id,
                    new_status: 1,
                    answer_chosen_id: [],
                    obtainable_coins: 0
                  })
                );
              } else if (elem.event.survey) {
                dispatch(
                  putSurvey({
                    event_id: elem.id,
                    new_status: 1,
                    answer_chosen_id: [],
                    obtainable_coins: 0
                  })
                );
              } else {
                const newLevelComplete = {
                  event_id: elem.id,
                  new_status_events: 1
                };
                console.log(newLevelComplete);
                dispatch(putEvent(newLevelComplete));
              }
            }
          });

          // quiz
          console.log("quiz trovato");
          console.log(quiz);

          // prendo l'id salvato, se è lo stesso di quello preso allora non aggiorno
          const idQuizSave = getState().trainings.idQuiz;
          console.log(idQuizSave);
          // uguali non aggiorno
          // ovviamente devo avere un valore diverso da 0

          if (
            idQuizSave !== 0 &&
            (idQuizSave === quiz || idQuizSave === survey)
          ) {
            // non chiedo nulla
          } else {
            // prendo i quiz o il survey

            if (quiz) {
              dispatch(getQuiz({ id: quiz }));
            } else if (survey) {
              dispatch(getSurvey({ id: survey }));
            } else {
              // se nessuno dei due è presente significa che ancora deve essere aggiunto come evento
              console.log("non ho ancora ne quiz ne survey");
              // metto id 0 dato che ancora non l'ho

              dispatch(getQuiz({ id: 0, withoutId: true }));
              dispatch(getSurvey({ id: 0, withoutId: true }));
            }
          }

          // controllo se tutti gli eventi della sessione sono completati
          setTimeout(
            () => {
              dispatch(checkSession());
            },
            Platform.OS === "android" ? 1000 : 500
          );

          requestCallback(dataUser, dispatch);
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "error 400"
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta
          requestCallback({ afterCallback: getEvents }, dispatch);
          requestCallback(dataUser, dispatch);
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "Error"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_TRAINING,
          payload: {
            status: "Error catch"
          }
        });
      }
    }
  };
}

// ritorna tutti i dettagli di tutti gli eventi e sessioni relative a un livello
export function getLevelEvents(dataUser = {}, callback) {
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
        type: FETCHING_TRAININGS_DATA,
        payload: {
          fetchingData: true
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
          const allEvents = response.data;

          dispatch({
            type: GET_LEVEL_EVENTS,
            payload: {}
          });
          if (callback) {
            callback(allEvents);
          }

          /* if (level_number > 1) {
            // cosi prendo le info dei livelli precedenti
            dispatch(getLevelEvents({ level_number: level_number - 1 }));
          } */
          requestCallback(dataUser, dispatch);
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "error 400"
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta
          requestCallback({ afterCallback: getLevelEvents }, dispatch);
          requestCallback(dataUser, dispatch);
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "Error"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_TRAINING,
          payload: {
            status: "Error catch"
          }
        });
      }
    }
  };
}

// ritorna il survey relativo alla sessione attiva
export function getSurvey(dataUser = {}, callback) {
  return async function(dispatch, getState) {
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
      dispatch(
        RefreshToken({ ...dataUser, callback: getSurvey, access_token })
      );
    } else if (dataUser.id || dataUser.withoutId) {
      // se ho l'id specificato
      const id = dataUser.id;
      const type = "survey";
      console.log("prendo i survey");
      dispatch({
        type: FETCHING_TRAININGS_DATA,
        payload: {
          fetchingData: true
        }
      });
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/survey/",
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        // 200 if it is present and 201 if it’s associated now

        if (response.status === 201 || response.status === 200) {
          const survey = separeSurvey(response.data.sort(compareQuiz));
          console.log(survey);

          dispatch({
            type: GET_QUIZ,
            payload: { quiz: survey, id, type }
          });
          if (callback) {
            callback(survey);
          }

          requestCallback(dataUser, dispatch);
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "error 400"
            }
          });
        } else if (response.status === 404) {
          // {"description": "Active training session not found"} o {"description": "There are no quiz"}
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: ""
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta
          requestCallback({ afterCallback: getSurvey }, dispatch);
          requestCallback(dataUser, dispatch);
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: ""
            }
          });
        } else if (response.status === 500) {
          // {"description": "Unable to save event"}
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "Error"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_TRAINING,
          payload: {
            status: "Error catch"
          }
        });
      }
    }
  };
}

// rispondo al survey relativo alla sessione attiva
export function putSurvey(dataUser = {}, callback) {
  return async function(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // preparo la richiesta legata al login con username e password
    let { access_token, date } = getState().login;
    // se ho appena effettuato il login, uso il token nuovo che ho inserito
    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    // dati da mandare
    let event_id;
    let new_status;
    let answer_chosen_id;
    let obtainable_coins;
    /*     
    "answer_chosen_id": [55, 54, 49] //array of answer id chosen by user
    “obtainable_coins”: int ( ) 
    */

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken({ ...dataUser, callback: putSurvey, access_token })
      );
    } else {
      console.log("rispondo ai quiz");
      // se ho l'evento e il nuovo stato, allora mando la richiesta
      // devo avere anche le risposte
      // "answer_chosen_id": [55, 54, 49] //array of answer id chosen by user
      if (dataUser.event_id) {
        event_id = dataUser.event_id;
        new_status = dataUser.new_status;
        answer_chosen_id = dataUser.answer_chosen_id;
        obtainable_coins = dataUser.obtainable_coins;

        // siccome ci possono essere dei quiz dupplicati controllo
        // prendo l'id dell'evento corrispodente
        const { training_events } = getState().trainings;
        let EventId = null;
        for (
          indexEvents = 0;
          indexEvents < training_events.length;
          indexEvents++
        ) {
          if (training_events[indexEvents].id === event_id) {
            EventId = training_events[indexEvents].event.id;
          }
        }
        // trovato l'id dell'evento
        if (EventId) {
          // prendo i quiz con lo stesso id dell'evento
          let otherId = training_events.filter(
            eventSingle => eventSingle.event.id === EventId
          );
          // per ogni id differente mando l'aggiornamento
          for (singleId = 0; singleId < otherId.length; singleId++) {
            event_id = otherId[singleId].id;

            console.log(event_id);
            console.log(new_status);

            console.log({
              event_id,
              new_status,
              answer_chosen_id,
              obtainable_coins
            });
            // salvo l'evento offline e se lo salvo lo cancello
            dispatch({
              type: SAVE_OFFLINE_EVENTS,
              payload: {
                status: "Put Event and save offline",
                offline_training_event: {
                  event_id,
                  new_status,
                  answer_chosen_id,
                  obtainable_coins
                }
              }
            });

            try {
              // nei survey nn mando obtainable_coins
              const response = await requestBackend(
                "put",
                "/api/v1/survey/",
                access_token,
                {
                  id: event_id,
                  status: new_status,
                  answer_chosen_id: answer_chosen_id
                },
                "application/json",
                "Bearer"
              );
              console.log(response);
              // 200 if it is present and 201 if it’s associated now

              if (response.status === 201) {
                const event = response.data;

                // salvo solo gli eventi non completati, ovvero status 0, salvo le condizioni
                // altrimenti non le conservo

                // non prendo le info su event dato che l'evento è stato completatato

                // metto come descrizione che ho completato un survey

                const infoEvent = {
                  id: event.id,
                  status: event.status,
                  updated_at: event.updated_at,
                  event: {
                    id: event.event.id,
                    text_description:
                      "Answer a quick survey about your mobility habits"
                  }
                };

                dispatch({
                  type: PUT_EVENTS,
                  payload: {
                    infoEvent
                  }
                });

                // mi salvo che l'ho completato
                dispatch({
                  type: COMPLETE_QUIZ,
                  payload: {
                    updated_at: new Date(),
                    id: event_id,
                    obtainable_coins,
                    answer_chosen_id,
                    type: "survey"
                  }
                });

                if (callback) {
                  callback(quiz);
                }

                // se è l'ultimo evento, attivo una nuova sessione e in caso la sessione attiva il livello
                // dopo un secondo controllo
                setTimeout(
                  () => {
                    dispatch(checkSession());
                  },
                  Platform.OS === "android" ? 1000 : 500
                );

                requestCallback(dataUser, dispatch);
              } else if (response.status === 404) {
                // {"description": "event not present"}
                dispatch({
                  type: UPDATE_STATUS_TRAINING,
                  payload: {
                    status: ""
                  }
                });
              } else if (response.status === 403) {
                // riprovo a fare la richiesta
                requestCallback({ afterCallback: putSurvey }, dispatch);
                requestCallback(dataUser, dispatch);
                dispatch({
                  type: UPDATE_STATUS_TRAINING,
                  payload: {
                    status: ""
                  }
                });
              } else if (response.status === 400) {
                /* {"description": "Json in body is not valid"}
          {"description": "answers_chosen is not a list"}
          {"description": "Status not valid"} */

                dispatch({
                  type: UPDATE_STATUS_TRAINING,
                  payload: {
                    status: ""
                  }
                });
              } else {
                dispatch({
                  type: UPDATE_STATUS_TRAINING,
                  payload: {
                    status: "Error"
                  }
                });
              }
            } catch (error) {
              console.log(error);
              dispatch({
                type: UPDATE_STATUS_TRAINING,
                payload: {
                  status: "Error catch"
                }
              });
            }
          }
        }
      }
    }
  };
}

// ritorna il quiz relativo alla sessione attiva
export function getQuiz(dataUser = {}, callback) {
  return async function(dispatch, getState) {
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
      dispatch(RefreshToken({ ...dataUser, callback: getQuiz, access_token }));
    } else if (dataUser.id || dataUser.withoutId) {
      // nel caso in cui devo aggiungere per la prima volta il quiz agli eventi e quindi non ho ancora un id

      // se ho l'id specificato
      const id = dataUser.id;
      const type = "quiz";

      console.log("prendo i quiz");
      dispatch({
        type: FETCHING_TRAININGS_DATA,
        payload: {
          fetchingData: true
        }
      });
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/quiz/",
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        // 200 if it is present and 201 if it’s associated now

        if (response.status === 201 || response.status === 200) {
          const quiz = separeQuiz(response.data.sort(compareQuiz));
          console.log(quiz);

          dispatch({
            type: GET_QUIZ,
            payload: { quiz: quiz, id, type }
          });
          if (callback) {
            callback(quiz);
          }

          requestCallback(dataUser, dispatch);
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "error 400"
            }
          });
        } else if (response.status === 404) {
          // {"description": "Active training session not found"} o {"description": "There are no quiz"}
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: ""
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta
          requestCallback({ afterCallback: getQuiz }, dispatch);
          requestCallback(dataUser, dispatch);
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: ""
            }
          });
        } else if (response.status === 500) {
          // {"description": "Unable to save event"}
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "Error"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_TRAINING,
          payload: {
            status: "Error catch"
          }
        });
      }
    }
  };
}

// rispondo al quiz relativo alla sessione attiva
export function putQuiz(dataUser = {}, callback) {
  return async function(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // preparo la richiesta legata al login con username e password
    let { access_token, date } = getState().login;
    // se ho appena effettuato il login, uso il token nuovo che ho inserito
    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    // dati da mandare
    let event_id;
    let new_status;
    let answer_chosen_id;
    let obtainable_coins;
    /*     
    "answer_chosen_id": [55, 54, 49] //array of answer id chosen by user
    “obtainable_coins”: int (between 0 and 3, depends on correct answer) 
    */

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(RefreshToken({ ...dataUser, callback: putQuiz, access_token }));
    } else {
      console.log("rispondo ai quiz");
      // se ho l'evento e il nuovo stato, allora mando la richiesta
      // devo avere anche le risposte
      // "answer_chosen_id": [55, 54, 49] //array of answer id chosen by user
      if (dataUser.event_id) {
        event_id = dataUser.event_id;
        new_status = dataUser.new_status;
        answer_chosen_id = dataUser.answer_chosen_id;
        obtainable_coins = dataUser.obtainable_coins;

        // siccome ci possono essere dei quiz dupplicati controllo
        // prendo l'id dell'evento corrispodente
        const { training_events } = getState().trainings;
        let EventId = null;
        for (
          indexEvents = 0;
          indexEvents < training_events.length;
          indexEvents++
        ) {
          if (training_events[indexEvents].id === event_id) {
            EventId = training_events[indexEvents].event.id;
          }
        }
        console.log("id del quiz");
        console.log(EventId);
        // trovato l'id dell'evento
        if (EventId) {
          // prendo i quiz con lo stesso id dell'evento
          let otherId = training_events.filter(
            eventSingle => eventSingle.event.id === EventId
          );
          console.log(otherId);
          // per ogni id differente mando l'aggiornamento
          for (singleId = 0; singleId < otherId.length; singleId++) {
            event_id = otherId[singleId].id;

            console.log(event_id);
            console.log(new_status);

            console.log({
              event_id,
              new_status,
              answer_chosen_id,
              obtainable_coins
            });
            // salvo l'evento offline e se lo salvo lo cancello
            dispatch({
              type: SAVE_OFFLINE_EVENTS,
              payload: {
                status: "Put Event and save offline",
                offline_training_event: {
                  event_id,
                  new_status,
                  answer_chosen_id,
                  obtainable_coins
                }
              }
            });

            try {
              const response = await requestBackend(
                "put",
                "/api/v1/quiz/",
                access_token,
                {
                  id: event_id,
                  status: new_status,
                  answer_chosen_id: answer_chosen_id,
                  obtainable_coins
                },
                "application/json",
                "Bearer"
              );
              console.log(response);
              // 200 if it is present and 201 if it’s associated now

              if (response.status === 201) {
                const event = response.data;

                // salvo solo gli eventi non completati, ovvero status 0, salvo le condizioni
                // altrimenti non le conservo

                // non prendo le info su event dato che l'evento è stato completatato

                // come descrizione metto che ho completato un quiz

                const infoEvent = {
                  id: event.id,
                  status: event.status,
                  updated_at: event.updated_at,
                  event: {
                    id: event.event.id,
                    text_description: "Answer a quick quiz"
                  }
                };

                dispatch({
                  type: PUT_EVENTS,
                  payload: {
                    infoEvent
                  }
                });

                // mi salvo che l'ho completato
                dispatch({
                  type: COMPLETE_QUIZ,
                  payload: {
                    updated_at: new Date(),
                    id: event_id,
                    obtainable_coins,
                    type: "quiz",
                    answer_chosen_id
                  }
                });

                if (callback) {
                  callback(quiz);
                }

                // se è l'ultimo evento, attivo una nuova sessione e in caso la sessione attiva il livello
                // dopo un secondo controllo
                setTimeout(
                  () => {
                    dispatch(checkSession());
                  },
                  Platform.OS === "android" ? 1000 : 500
                );

                requestCallback(dataUser, dispatch);
              } else if (response.status === 404) {
                // {"description": "event not present"}
                dispatch({
                  type: UPDATE_STATUS_TRAINING,
                  payload: {
                    status: ""
                  }
                });
              } else if (response.status === 403) {
                // riprovo a fare la richiesta
                requestCallback({ afterCallback: putQuiz }, dispatch);
                requestCallback(dataUser, dispatch);
                dispatch({
                  type: UPDATE_STATUS_TRAINING,
                  payload: {
                    status: ""
                  }
                });
              } else if (response.status === 400) {
                /* {"description": "Json in body is not valid"}
          {"description": "answers_chosen is not a list"}
          {"description": "Status not valid"} */

                dispatch({
                  type: UPDATE_STATUS_TRAINING,
                  payload: {
                    status: ""
                  }
                });
              } else {
                dispatch({
                  type: UPDATE_STATUS_TRAINING,
                  payload: {
                    status: "Error"
                  }
                });
              }
            } catch (error) {
              console.log(error);
              dispatch({
                type: UPDATE_STATUS_TRAINING,
                payload: {
                  status: "Error catch"
                }
              });
            }
          }
        }
      }
    }
  };
}

/**
 * ?
 * @param {Array} quiz
 */
export function separeQuiz(quiz) {
  const lengthQuiz = quiz.length;
  let Quiz = [];
  let questiontoanswer__is_correct = "null";
  let responseQuiz = "null";
  for (i = 0; i < lengthQuiz; i++) {
    let QuizSingle = {
      id: quiz[i].id,
      text_question: quiz[i].text_question,
      questiontoanswer__text_answer: [],
      questiontoanswer__is_correct
    };
    responseQuiz = quiz[i].questiontoanswer__text_answer;
    let questiontoanswer__text_answer = [
      { responseQuiz, questiontoanswer__id: quiz[i].questiontoanswer__id }
    ];
    questiontoanswer__is_correct = quiz[i].questiontoanswer__is_correct
      ? responseQuiz
      : questiontoanswer__is_correct;
    for (j = i; j < lengthQuiz - 1; j++) {
      if (quiz[j].id === quiz[j + 1].id) {
        responseQuiz = quiz[j + 1].questiontoanswer__text_answer;
        questiontoanswer__text_answer = [
          ...questiontoanswer__text_answer,
          {
            responseQuiz,
            questiontoanswer__id: quiz[j + 1].questiontoanswer__id
          }
        ];
        questiontoanswer__is_correct = quiz[j + 1].questiontoanswer__is_correct
          ? responseQuiz
          : questiontoanswer__is_correct;
        i++;
      } else {
        break;
      }
    }
    QuizSingle.questiontoanswer__text_answer = questiontoanswer__text_answer;
    QuizSingle.questiontoanswer__is_correct = questiontoanswer__is_correct;
    Quiz = [...Quiz, QuizSingle];
  }
  return Quiz;
}

/**
 * separo i survey, ovviamente non esiste la risposta corretta
 * @param {Array} quiz
 */

// separo i survey, ovviamente non esiste la risposta corretta
export function separeSurvey(quiz) {
  const lengthQuiz = quiz.length;
  let Quiz = [];

  let responseQuiz = "null";
  for (i = 0; i < lengthQuiz; i++) {
    let QuizSingle = {
      id: quiz[i].id,
      text_question: quiz[i].text_question,
      questiontoanswer__text_answer: [],
      survey__obtainable_coins: quiz[i].survey__obtainable_coins
    };
    responseQuiz = quiz[i].surveyquestiontoanswer__text_answer;
    let questiontoanswer__text_answer = [
      {
        responseQuiz,
        questiontoanswer__id: quiz[i].surveyquestiontoanswer__id
      }
    ];
    for (j = i; j < lengthQuiz - 1; j++) {
      if (quiz[j].id === quiz[j + 1].id) {
        responseQuiz = quiz[j + 1].surveyquestiontoanswer__text_answer;
        questiontoanswer__text_answer = [
          ...questiontoanswer__text_answer,
          {
            responseQuiz,
            questiontoanswer__id: quiz[j + 1].surveyquestiontoanswer__id
          }
        ];

        i++;
      } else {
        break;
      }
    }
    QuizSingle.questiontoanswer__text_answer = questiontoanswer__text_answer;

    Quiz = [...Quiz, QuizSingle];
  }
  return Quiz;
}

export function getCountCompletedEventOfTrainingSessions() {}

export function getCountEventOfTrainingSessions() {}

// per sapere se devo aggiornare con la nuova sessione
export function checkSession() {
  return async function(dispatch, getState) {
    console.log("controllo tutti gli eventi");
    let { training_events } = getState().trainings;
    // se sono tutti con lo status 1 allora sono tutti completati
    let check = false;
    for (i = 0; i < training_events.length; i++) {
      console.log(training_events[i].status);
      if (training_events[i].status) {
        check = true;
      } else {
        check = false;
        break;
      }
    }
    console.log(check);
    // se sono tutti 1 allora è true
    if (check) {
      let { training_sessions } = getState().trainings;
      // per sapere quale ho completato
      let trainingSessionId = -1;
      // se c'e qualcuno con 0 e 1 allora ancora non ho finito il livello
      let checkLevel = 1;

      for (i = 0; i < training_sessions.length; i++) {
        // se una è attiva
        console.log(training_sessions[i].status);
        if (training_sessions[i].status === 2) {
          trainingSessionId = training_sessions[i].id;
          checkLevel = 0;
          break;
        } else if (
          training_sessions[i].status === 1 ||
          training_sessions[i].status === 0
        ) {
          // se gia uno ha valore 0 e 1 sicuramente non sono tutti completati quindi non controllo per il livello
          checkLevel = 0;
        }
      }
      console.log(trainingSessionId);
      if (trainingSessionId >= 0) {
        // adesso la sessione è completata
        console.log("check session dagli events");
        dispatch(
          putSession({ sessionIdToActive: trainingSessionId, new_status: 3 })
        );
      } else if (checkLevel) {
        // se la prima sessione ha valore 3 allora vedo anche le altre, quando le riordine, metto l'ultima completata alla fine quindi la prima e ultima
        // salvo di livello
        dispatch(checkLevel());
      }
    }
  };
}

export function checkLevel() {
  return async function(dispatch, getState) {
    let { training_sessions } = getState().trainings;
    // se sono tutti con lo status 3 allora sono tutti completati
    let check = false;
    for (i = 0; i < training_sessions.length; i++) {
      if (training_sessions[i].status === 3) {
        check = true;
      } else {
        check = false;
        break;
      }
    }
    // se sono tutti 1 allora è true
    if (check) {
      {
        dispatch(levelUp());
      }
    } else {
      // prendo la nuova sessione
      dispatch(getTrainingSessions());
    }
  };
}

export function putEvent(dataUser = {}) {
  return async function(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // dico che mi sto prendnendo cosi spunta il caricamento
    let event_id;
    let new_status;
    let typeCheckCompleted = false;
    console.log(dataUser);

    // se ho l'evento e il nuovo stato, allora mando la richiesta
    if (dataUser.event_id) {
      event_id = dataUser.event_id;
      new_status = dataUser.new_status_events;
      typeCheckCompleted = dataUser.typeCheckCompleted;
      console.log(event_id);
      console.log(new_status);
      // salvo l'evento offline e se lo salvo lo cancello
      dispatch({
        type: SAVE_OFFLINE_EVENTS,
        payload: {
          status: "Put Event and save offline",
          offline_training_event: { event_id, new_status },
          typeCheckCompleted
        }
      });

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
        dispatch(RefreshToken({ ...dataUser, callback: putEvent }));
      } else {
        // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
        try {
          const response = await requestBackend(
            "put",
            "/api/v1/events",
            access_token,
            { id: event_id, status: new_status },
            "application/json",
            "Bearer"
          );

          console.log(response);
          if (response.status === 201) {
            const event = response.data;

            // salvo solo gli eventi non completati, ovvero status 0, salvo le condizioni
            // altrimenti non le conservo

            // non prendo le info su event dato che l'evento è stato completatato

            const infoEvent = {
              id: event.id,
              status: event.status,
              updated_at: event.updated_at,
              event: {
                id: event.event.id,
                text_description: event.event.text_description
              }
            };

            dispatch({
              type: PUT_EVENTS,
              payload: {
                infoEvent
              }
            });

            // se è l'ultimo evento, attivo una nuova sessione e in caso la sessione attiva il livello
            // dopo un secondo controllo
            setTimeout(
              () => {
                dispatch(checkSession());
              },
              Platform.OS === "android" ? 1000 : 500
            );
            requestCallback(dataUser, dispatch);
          } else if (response.status === 400) {
            dispatch({
              type: UPDATE_STATUS_TRAINING,
              payload: {
                status: "400"
              }
            });
          } else if (response.status === 403) {
            // riprovo a fare la richiesta
            requestCallback({ afterCallback: putEvent }, dispatch);
            requestCallback(dataUser, dispatch);
            dispatch({
              type: UPDATE_STATUS_TRAINING,
              payload: {
                status: ""
              }
            });
          } else {
            dispatch({
              type: UPDATE_STATUS_TRAINING,
              payload: {
                status: "Error"
              }
            });
          }
        } catch (error) {
          console.log(error);
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "Error catch"
            }
          });
        }
      }
    }
  };
}

// itero per ogni evento salvato offline per mandarlo al db
export function putEventOfflineFor() {
  return async function(dispatch, getState) {
    const offlineEvents = getState().trainings.offline_training_event;

    let event_id;
    let new_status_events;

    for (i = 0; i < offlineEvents.length; i++) {
      if (offlineEvents[i].event_id) {
        event_id = offlineEvents[i].event_id;
        new_status_events = offlineEvents[i].new_status;
        dispatch(
          putEventOffline({
            event_id,
            new_status_events
          })
        );
      }
    }
  };
}

// salvo il singolo evento offline
export function putEventOffline(dataUser = {}) {
  return async function(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // dico che mi sto prendnendo cosi spunta il caricamento
    let event_id;
    let new_status;

    // se ho l'evento e il nuovo stato, allora mando la richiesta
    if (dataUser.event_id) {
      event_id = dataUser.event_id;
      new_status = dataUser.new_status_events;
      console.log(event_id);
      console.log(new_status);

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
        dispatch(RefreshToken({ ...dataUser, callback: putEventOffline }));
      } else {
        // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
        try {
          const response = await requestBackend(
            "put",
            "/api/v1/events",
            access_token,
            { id: event_id, status: new_status },
            "application/json",
            "Bearer"
          );

          console.log(response);
          if (response.status === 201) {
            const event = response.data;

            // salvo solo gli eventi non completati, ovvero status 0, salvo le condizioni
            // altrimenti non le conservo

            // non prendo le info su event dato che l'evento è stato completatato

            const infoEvent = {
              id: event.id,
              status: event.status,
              updated_at: event.updated_at,
              event: {
                id: event.event.id,
                text_description: event.event.text_description
              }
            };

            dispatch({
              type: PUT_EVENTS,
              payload: {
                infoEvent
              }
            });

            // se è l'ultimo evento, attivo una nuova sessione e in caso la sessione attiva il livello
            // dopo un secondo controllo
            setTimeout(
              () => {
                dispatch(checkSession());
              },
              Platform.OS === "android" ? 1000 : 500
            );
            requestCallback(dataUser, dispatch);
          } else if (response.status === 400) {
            dispatch({
              type: UPDATE_STATUS_TRAINING,
              payload: {
                status: "400"
              }
            });
          } else if (response.status === 403) {
            // riprovo a fare la richiesta
            requestCallback({ afterCallback: putEventOffline }, dispatch);
            requestCallback(dataUser, dispatch);
            dispatch({
              type: UPDATE_STATUS_TRAINING,
              payload: {
                status: ""
              }
            });
          } else {
            dispatch({
              type: UPDATE_STATUS_TRAINING,
              payload: {
                status: "Error"
              }
            });
          }
        } catch (error) {
          console.log(error);
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "Error catch"
            }
          });
        }
      }
    }
  };
}

export function putSession(dataUser = {}) {
  return async function(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    console.log("dati della put session");
    console.log(dataUser);

    // dico che mi sto prendnendo cosi spunta il caricamento
    dispatch({
      type: UPDATE_STATUS_TRAINING,
      payload: {
        status: "Put session"
      }
    });

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
      dispatch(RefreshToken({ ...dataUser, callback: putSession }));
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        let sessionIdToActive;
        let new_status;

        if (dataUser.sessionIdToActive) {
          sessionIdToActive = dataUser.sessionIdToActive;
          new_status = dataUser.new_status;
        }

        console.log({ id: sessionIdToActive, status: new_status });

        const response = await requestBackend(
          "put",
          "/api/v1/training_session",
          access_token,
          { id: sessionIdToActive, status: new_status },
          "application/json",
          "Bearer"
        );
        console.log(response);
        if (response.status === 201) {
          const session = response.data;
          // prendo solo i dati necessari
          const newSession = {
            id: session.id,
            status: session.status,
            updated_at: session.updated_at,
            trainingSessionId: session.training_session.id,
            text_description: session.training_session.name
          };

          dispatch({
            type: PUT_SESSION,
            payload: {
              newSession
            }
          });

          // se ho attivato una nuovo sessione prendo gli eventi collegati
          if (session.status === 2) {
            dispatch(getEvents({ session_id: session.training_session.id }));
          } else if (session.status === 3 || new_status === 3) {
            // se una sessione è completata vedo se anche gli altri sono completati per salire di livello
            // dispatch(checkSession());
            // prendo la nuova sessione
            dispatch(getTrainingSessions());

            // prendo anche le info dell'utente dato che posso avere nuove monete
            setTimeout(
              () => {
                dispatch(getProfile());
                // dispatch(getProfilePublic());
              },
              Platform.OS === "android" ? 1000 : 500
            );
          } else if (session.status === 1) {
            // se la sblocco pagando ovvero passo il parametro con unlock a true, aggiorno il profilo, dato che ho consumato delle monete
            if (dataUser.unlock) {
              setTimeout(
                () => {
                  dispatch(getProfile());
                   // dispatch(getProfilePublic());
                },
                Platform.OS === "android" ? 1000 : 500
              );
            }
            // se ho disponibile una nuova sessione allora riprendo la tratta oppure faccio il putSession
            // dispatch(getTrainingSessions());
            // controllo se servono punti o coins ma questo l'ho fatto quando sono passato da 0 a 1
            /* if (
              session.training_session.cost_in_coins === 0 &&
              session.training_session.cost_in_points === 0
            )  */ {
              dispatch(
                putSession({
                  sessionIdToActive: session.id,
                  new_status: 2
                })
              );
            }
          }

          requestCallback(dataUser, dispatch);
        } else if (response.status === 404) {
          // training session is not present in sessions related to user
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: response.data.description
            }
          });
        } else if (response.status === 400) {
          // status not valid or Json in body is not valid
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: response.data.description
            }
          });
        } else if (response.status === 200) {
          // errore generico per l'utente tipo non ha coins disponibili
          // points are not enough
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: response.data.description
            }
          });
          // Alert.alert(response.data.description);
        } else if (response.status === 403) {
          // riprovo a fare la richiesta
          requestCallback({ afterCallback: putSession }, dispatch);
          requestCallback(dataUser, dispatch);
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "Error"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_TRAINING,
          payload: {
            status: "Error catch"
          }
        });
      }
    }
  };
}

// ordino le sessioni per il parametro order
function compare(a, b) {
  if (a.training_session.order < b.training_session.order) return -1;
  if (a.training_session.order > b.training_session.order) return 1;
  return 0;
}

// ordino quiz
function compareQuiz(a, b) {
  if (a.id < b.id) return -1;
  if (a.id > b.id) return 1;
  return 0;
}

export function getTrainingSessions(dataUser = {}) {
  return async function(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // dico che mi sto prendnendo cosi spunta il caricamento
    dispatch({
      type: UPDATE_STATUS_TRAINING,
      payload: {
        status: "Get Sessions"
      }
    });

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
      dispatch(RefreshToken({ ...dataUser, callback: getTrainingSessions }));
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/training_session",
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log("risposta getTrainings");
        console.log(response);
        if (response.status === 200) {
          const session = response.data;

          let sessionIdToActiveElem;
          let eventsToGet = -1;
          let sessionIdTocheck = [];

          const infoSession = session.map(elem => {
            // vedo se qualcuna disponibile deve essere abiliata
            // o eventualmente nuovi eventi da prendere
            sessionIdToActiveElem =
              elem.status === 1 ? elem : sessionIdToActiveElem;
            eventsToGet =
              elem.status === 2 ? elem.training_session.id : eventsToGet;

            return {
              id: elem.id,
              status: elem.status,
              updated_at: elem.updated_at,
              trainingSessionId: elem.training_session.id,
              text_description: elem.training_session.name
              /* cost_in_coins: elem.training_session.cost_in_coins,
              cost_in_points: elem.training_session.cost_in_points */
            };
          });

          dispatch({
            type: GET_TRAINING_SESSIONS,
            payload: {
              infoSession
            }
          });
          console.log("sessione da elaborare");
          console.log(eventsToGet);
          // se qualcuna è da abilitare ovvero è gia sbloccata, abilito

          // ovviamente il costo delle monete e coins deve essere nullo
          if (sessionIdToActiveElem && sessionIdToActiveElem.id >= 0) {
            dispatch(
              putSession({
                sessionIdToActive: sessionIdToActiveElem.id,
                new_status: 2
              })
            );
          } else if (eventsToGet >= 0) {
            // se è gia abilitata prendo gli eventi
            dispatch(getEvents({ session_id: eventsToGet }));
          } else {
            // se non ho ne 2 ne 1 allora ho soltanto 0 e 3 quindi ne devo attivare qualcuna
            // prendo solo quelle 0
            sessionIdTocheck = session.filter(elem => elem.status === 0);

            // se ho almeno un segmento d'attivare
            if (sessionIdTocheck.length) {
              // ordino
              sessionIdTocheck.sort(compare);
              console.log(sessionIdTocheck);
              if (
                sessionIdTocheck[0].training_session.cost_in_coins === 0 &&
                sessionIdTocheck[0].training_session.cost_in_points === 0
              ) {
                dispatch(
                  putSession({
                    sessionIdToActive: sessionIdTocheck[0].id,
                    new_status: 1
                  })
                );
              }
            } else {
              // sono tutti 3 quindi aumento di livello
              dispatch(checkLevel());
            }
          }

          requestCallback(dataUser, dispatch);
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "error 400"
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta
          requestCallback({ afterCallback: getTrainingSessions }, dispatch);
          requestCallback(dataUser, dispatch);
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "Error"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_TRAINING,
          payload: {
            status: "Error catch"
          }
        });
      }
    }
  };
}

export function getSpecialTrainingSessions(dataUser = {}) {
  return async function(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // dico che mi sto prendnendo cosi spunta il caricamento
    dispatch({
      type: UPDATE_STATUS_TRAINING,
      payload: {
        status: "Get ST Sessions"
      }
    });

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
      dispatch(RefreshToken({ ...dataUser, callback: getTrainingSessions }));
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/special_training_session?filter=all",
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log("risposta getTrainings");
        console.log(response);
        if (response.status === 200) {
          console.log("GET_SPECIAL_TRAINING_SESSIONS");

          // "start_date": "2019-03-26T15:52:16.874Z",
          // "end_date": "2019-03-27T15:52:16.874Z",
          // "status": 0,
          // "city_id": 1122,
          // "community_id": null,
          // "sponsor_id": 1,
          // "max_users": 10,
          // "subscriber_user": 1,

          console.log(response);

          const session = response.data;

          const infoSession = session.map(elem => {
            return {
              ...elem,
              status: elem.status,
              updated_at: elem.updated_at,
              text_description: elem.title,
              special_training: elem.special_training,
              max_users: elem.max_users,
              subscriber_user: elem.subscriber_user,
              community_id: elem.community_id,
              description_st_session: elem.description_st_session
            };
          });

          dispatch({
            type: GET_SPECIAL_TRAINING_SESSIONS,
            payload: {
              infoSession
            }
          });

          requestCallback(dataUser, dispatch);
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "error 400"
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta
          requestCallback(
            { afterCallback: getSpecialTrainingSessions },
            dispatch
          );
          requestCallback(dataUser, dispatch);
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "Error"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_TRAINING,
          payload: {
            status: "Error catch"
          }
        });
      }
    }
  };
}

export function getSpecialTrainingSessionSubscribed(dataUser = {}) {
  return async function(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // dico che mi sto prendnendo cosi spunta il caricamento
    dispatch({
      type: UPDATE_STATUS_TRAINING,
      payload: {
        status: "Get ST Sessions"
      }
    });

    // preparo la richiesta legata al login con username e password
    let { access_token, date } = getState().login;
    let { special_training_sessions } = getState().trainings;

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
        RefreshToken({
          ...dataUser,
          callback: getSpecialTrainingSessionSubscribed
        })
      );
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/special_training_subscribe?filter=all",
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log("risposta getTrainings");
        console.log(response);
        if (response.status === 200) {
          console.log("GET_SPECIAL_TRAINING_SESSIONS");

          const session = response.data;
          let available_st_event = []; // special training event disponibili (su cui posso fare redeem)

          const infoSession = session.map(elem => {
            return {
              status: elem.status,
              reward_id: elem.reward_id,
              expired_date: elem.expired_date,
              completed_date: elem.completed_date,
              reward: elem.reward,
              training_title: elem.training_title,
              training_description: elem.training_description,
              sponsor_id: elem.sponsor_id,
              community_id: elem.community_id,
              city_id: elem.city_id
            };
          });

          special_training_sessions.forEach((el, index) => {
            let st_event = infoSession.filter(e => {
              return e.training_title == el.text_description;
            });
            if (st_event.length > 0)
              available_st_event.push({ ...el, st_event });
          });

          dispatch({
            type: GET_SPECIAL_TRAINING_SESSIONS_SUBSCRIBED,
            payload: {
              infoSession,
              available_st_event
            }
          });

          requestCallback(dataUser, dispatch);
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "error 400"
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta
          requestCallback(
            { afterCallback: getSpecialTrainingSessions },
            dispatch
          );
          requestCallback(dataUser, dispatch);
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "Error"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_TRAINING,
          payload: {
            status: "Error catch"
          }
        });
      }
    }
  };
}

export function checkSpecialTrainingEvent(route, weather, s_point, e_point) {
  const fake_weather = "Rain";
  const fake_route = {
    validated: true,
    distance_travelled: 0.105,
    calories: 3,
    coins: 0,
    points: 400,
    time_travelled: 50,
    referred_most_freq_route: 11,
    segment: [
      {
        modal_type: 2,
        validated: true,
        distance_travelled: 0.105,
        calories: 3,
        coins: 0,
        points: 400,
        time_travelled: 50,
        route:
          "LINESTRING (-122.02998145 37.3306482 0, -122.03052857 37.33081444 0, -122.03066271 37.33127588 0)",
        route_positions_info: [
          {
            pos_index: 0,
            time: 1542259015,
            modality: "Biking",
            speed: 3.61,
            calories: 3
          },
          {
            pos_index: 1,
            time: 1542206772,
            modality: "Biking",
            speed: 3.43,
            calories: 3
          },
          {
            pos_index: 1,
            time: 1542206787,
            modality: "Biking",
            speed: 3.26,
            calories: 3
          }
        ],
        end_time: "2019-04-01T06:50:27.092Z"
      }
    ]
  };
  return async function(dispatch, getState) {
    const events_status = getState().trainings.statusCheckEvents
      ? getState().trainings.statusCheckEvents
      : {};

    let log = "";
    let typeCheckCompleted = false;

    // if (fake_route.validated && fake_route.segment.length) {
      if (route.validated && route.segment.length) {
      let { available_st_event } = getState().trainings;
      available_st_event = available_st_event ? available_st_event : [];

      // if (true) {
      if (
        available_st_event.filter(e => {
          let expiration_date = +new Date(
            e.special_training.end_special_training
          );
          let now = +new Date();
          return e.status == 0 && now < expiration_date;
        }).length > 0
      ) {
        let specialTrainings = new SpecialTrainings(
          available_st_event,
          route,
          events_status,
          (param, value) => {
            dispatch(updateStatusCheckEvents(param, value));
          },
          s_point,
          e_point,
          dispatch
        );

        let completed_special_training = specialTrainings.completedST();

        let bool = completed_special_training.length > 0 ? true : false;

        if (bool) {
          // if (false) {
          let { access_token, date } = getState().login;

          // log += "\n" + "chiamata http";
          // alert(log);

          let dateExpires = +new Date();
          if (dateExpires >= date || !access_token) {
            dispatch(
              RefreshToken({
                ...{},
                callback: () => {
                  checkSpecialTrainingEvent(route, weather, s_point, e_point);
                }
              })
            );
          } else {
            let { offline_st_reward } = getState().trainings;

            // removeOfflineSTReward(offline_st_reward, 300, dispatch);
            // removeOfflineSTReward(
            //   offline_st_reward,
            //   completed_special_training.reward_id,
            //   dispatch
            // );

            try {
              const start = async () => {
                await asyncForEach(completed_special_training, async e => {
                  const put = await putSpecialTrainingReward(
                    access_token,
                    {
                      // reward_id: 300,
                      // status: 1
                      reward_id: e.reward_id,
                      status: e.status,
                      text_description: e.text_description
                    },
                    route,
                    weather,
                    dispatch
                  );

                  // alert(put);
                  console.log(put);
                });
                console.log("Done");
              };
              start();
            } catch (error) {
              console.log(error);
              // log += "\nerrore " + JSON.stringify(error);
            }
          }
        } else {
          // console.log(log);
        }
      }
    }
    // alert(log);
  };
}

export function removeOfflineSTReward(offline_st_reward, reward_id, dispatch) {
  let reward_is_in_localstorage =
    offline_st_reward.filter(e => {
      return e.reward_id == reward_id;
    }).length > 0;

  if (reward_is_in_localstorage) {
    dispatch({
      type: REMOVE_ST_OFFLINE,
      payload: reward_id
    });
  }
}

export function emptyOfflineSTReward() {
  return async function(dispatch, getState) {
    let { access_token, date } = getState().login;
    let dateExpires = +new Date();
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken({
          ...{},
          callback: () => emptyOfflineSTReward()
        })
      );
    } else {
      let { offline_st_reward } = getState().trainings;
      offline_st_reward.forEach(e => {
        removeOfflineSTReward(offline_st_reward, e.reward_id, dispatch);
        let res = putSpecialTrainingReward(
          access_token,
          { reward_id: e.reward_id, status: 1 },
          [],
          "",
          dispatch
        );
      });
    }
  };
}

export async function putSpecialTrainingReward(
  access_token,
  completed_special_training,
  route,
  weather,
  dispatch
) {
  try {
    const response = await requestBackend(
      "put",
      "/api/v1/special_training_reward",
      access_token,
      {
        reward_id: completed_special_training.reward_id,
        status: completed_special_training.status
      },
      "application/json",
      "Bearer"
    );
    console.log("risposta special_training_reward");
    console.log(response);
    if (response.status === 200) {
      // dispatch({
      //   type: SUBSCRIBE_SPECIAL_TRAINING_SESSIONS,
      //   payload: {}
      // });
      // alert(JSON.stringify(response));

      setCompletedStPivots(completed_special_training, dispatch);
      requestCallback({}, dispatch);
      return "success " + response.status;
    } else if (response.status === 400) {
      dispatch({
        type: SAVE_ST_OFFLINE,
        payload: {
          reward_id: completed_special_training.reward_id,
          status: completed_special_training.status
        }
      });
      dispatch({
        type: UPDATE_STATUS_TRAINING,
        payload: {
          status: "error 400"
        }
      });
      return "error " + response.status;
    } else if (response.status === 403) {
      // riprovo a fare la richiesta
      requestCallback(
        {
          afterCallback: () =>
            putSpecialTrainingReward(
              access_token,
              completed_special_training,
              route,
              weather,
              dispatch
            )
        },
        dispatch
      );

      return "error " + response.status;
    } else {
      dispatch({
        type: UPDATE_STATUS_TRAINING,
        payload: {
          status: "Error"
        }
      });
    }
  } catch (error) {
    console.log(error);
    dispatch({
      type: UPDATE_STATUS_TRAINING,
      payload: {
        status: "Error catch"
      }
    });
    return "error trycatch";
  }
}

export function redeemSpecialTrainingSessions(
  dataUser = {},
  reward_id,
  callback
) {
  return async function(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // dico che mi sto prendnendo cosi spunta il caricamento
    dispatch({
      type: UPDATE_STATUS_TRAINING,
      payload: {
        status: "Get Sessions"
      }
    });

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
      dispatch(RefreshToken({ ...dataUser, callback: getTrainingSessions }));
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "post",
          "/api/v1/special_training_reward",
          access_token,
          {
            reward_id
          },
          "application/json",
          "Bearer"
        );
        console.log("risposta subscribe special training");
        console.log(response);
        if (response.status === 200) {
          console.log(
            "redeemSpecialTrainingSessions SUBSCRIBE_SPECIAL_TRAINING_SESSIONS"
          );
          const res = response.data;
          dispatch({
            type: ADD_REDEEMED_REWARD,
            payload: reward_id
          });

          callback();
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "error 400"
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta
          requestCallback(
            { afterCallback: redeemSpecialTrainingSessions },
            dispatch
          );
          // requestCallback(dataUser, dispatch);
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "Error"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_TRAINING,
          payload: {
            status: "Error catch"
          }
        });
      }
    }
  };
}

export function subscribeSpecialTrainingSessions(
  dataUser = {},
  special_training_id,
  callback
) {
  return async function(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // dico che mi sto prendnendo cosi spunta il caricamento
    dispatch({
      type: UPDATE_STATUS_TRAINING,
      payload: {
        status: "Get Sessions"
      }
    });

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
      dispatch(RefreshToken({ ...dataUser, callback: getTrainingSessions }));
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "post",
          "/api/v1/special_training_subscribe",
          access_token,
          {
            special_training: special_training_id
          },
          "application/json",
          "Bearer"
        );
        console.log("risposta subscribe special training");
        console.log(response);
        if (response.status === 200) {
          console.log(
            "subscribeSpecialTrainingSessions SUBSCRIBE_SPECIAL_TRAINING_SESSIONS"
          );

          const res = response.data;

          // const infoSession = session.map(elem => {
          //   return {
          //     status: elem.status,
          //     updated_at: elem.updated_at,
          //     text_description: elem.title,
          //     special_training: elem.special_training
          //   };
          // });

          callback();

          dispatch({
            type: SUBSCRIBE_SPECIAL_TRAINING_SESSIONS,
            payload: {}
          });

          // requestCallback(dataUser, dispatch);
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "error 400"
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta
          requestCallback(
            { afterCallback: subscribeSpecialTrainingSessions },
            dispatch
          );
          requestCallback(dataUser, dispatch);
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "Error"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_TRAINING,
          payload: {
            status: "Error catch"
          }
        });
      }
    }
  };
}

export function levelUp(dataUser = {}) {
  return async function(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // dico che mi sto prendnendo cosi spunta il caricamento
    dispatch({
      type: UPDATE_STATUS_TRAINING,
      payload: {
        status: "Update Level"
      }
    });

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
      dispatch(RefreshToken({ ...dataUser, callback: levelUp }));
    } else {
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      try {
        const response = await requestBackend(
          "put",
          "/api/v1/level",
          access_token,
          null,
          "application/json",
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          const level = response.data;

          dispatch({
            type: LEVEL_UP,
            payload: {
              level
            }
          });

          // prendo la nuova sessione del nuovo livello
          dispatch(getTrainingSessions());

          requestCallback(dataUser, dispatch);
        } else if (response.status === 400) {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "400"
            }
          });
        } else if (response.status === 403) {
          // riprovo a fare la richiesta
          requestCallback({ afterCallback: levelUp }, dispatch);
          requestCallback(dataUser, dispatch);
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: ""
            }
          });
        } else {
          dispatch({
            type: UPDATE_STATUS_TRAINING,
            payload: {
              status: "Error"
            }
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: UPDATE_STATUS_TRAINING,
          payload: {
            status: "Error catch"
          }
        });
      }
    }
  };
}

// converrte meteo in un valore coerente con quelle della sfida
export function convertWeatherCondition(weather) {
  //console.log(weather);

  let typeWeather = 0;

  switch (weather) {
    case "Clear":
      typeWeather = 3;
      break;

    case "Clouds":
    case "Drizzle":
    case "Haze":
    case "Mist":
      // typeWeather = 2;
      // considerò il 5% anche come brutto meteo per gli eventi
      typeWeather = 1;
      break;
    case "Rain":
    case "Snow":
    case "Thunderstorm":
      typeWeather = 1;
      break;
    default:
      typeWeather = 0;
  }

  return typeWeather;
}

export function checkRepeatRoutine(response, anotherData) {
  console.log("controllo se è una routine");
  let route = response.map(elem => elem.route);
  const firstLat = route[0].coordinates[0][1];
  const firstLon = route[0].coordinates[0][0];
  const lastLat =
    route[route.length - 1].coordinates[
      route[route.length - 1].coordinates.length - 1
    ][1];
  const lastLon =
    route[route.length - 1].coordinates[
      route[route.length - 1].coordinates.length
    ][0];

  const getState = anotherData.getState;

  const IdRoutine = checkFrequentTrip(
    getState,
    { latitude: firstLat, longitude: firstLon },
    { latitude: lastLat, longitude: lastLon }
  );

  console.log("IdRoutine");
  console.log(IdRoutine);

  let inDayRouteID = anotherData.another;
  let counterSeries = anotherData.counterSeries;
  const frequency = anotherData.frequency;

  if (IdRoutine) {
    counterSeries++;
    console.log("routine trovata");
    console.log(IdRoutine);
  }
  if (counterSeries >= frequency) {
    check = true;
    console.log("condizione verificata");
    // putevents
  } else {
    // prendo solo il primo
    if (inDayRouteID.length > 0) {
      const first = inDayRouteID.slice(0, 1);
      const referred_route_id = first[0];
      // prendo il resto
      const rest = inDayRouteID.splice(0, 1);
      // mi porto dietro dati utili
      const another = {
        rest,
        counterSeries,
        frequency,
        getState
      };

      dispatch(
        GetDetailRoute({ referred_route_id }, checkRepeatRoutine, another)
      );
    }
  }
}

export async function retrieveData(type) {
  try {
    const value = await AsyncStorage.getItem(type, null);
    if (value !== null) {
      // We have data!!
      //console.log(value);
    }
    console.log("valore preso ");
    console.log(value);
    return value;
  } catch (error) {
    return null;
    // Error retrieving data
  }
}

// utile per salvare qualcosa in memoria che puo servire per gli eventi
export async function storeData(type, value) {
  try {
    // await AsyncStorage.setItem("time", time.toString());
    await AsyncStorage.setItem(type, value.toString());
    console.log("valore salvato ");
    console.log(value.toString());
  } catch (error) {
    // Error saving data
  }
}

// getState, per prendere i dati dell'utente come tratte del db e salvate
// Now, date corrente

// numDay, valore della serie precedente
// NewRoute, nuove route del db, nel caso la serie si espande anche dopo l'ultima route salvate
// dayBefore, quanti giorni indietro devo controllare
function NumSeriesRouteCalcolate(
  getState,
  Now,
  NewRoute,
  dispatch,
  dayBefore,
  evento
) {
  const PreviousRoute = getState().tracking.PreviousRoute;
  const SavedRoute = NewRoute.length ? NewRoute : getState().login.Route;

  // dove avevo gia controllato per la serie
  console.log("calcolo serie ");
  console.log(NewRoute);
  console.log(getState().login.Route);

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

  const hoursNow = Now.getHours();

  const minutesNow = Now.getMinutes();
  const secondNow = Now.getSeconds();

  const startWeek =
    millisecond -
    (dayBefore * 86400000 +
      hoursNow * 3600000 +
      minutesNow * 60000 +
      secondNow * 1000);

  const Now3 = new Date(startWeek);
  console.log(Now3.toDateString());
  console.log(Now3.toTimeString());

  // se sono ancora nella settimana corrente allora posso usare il valore precedente per il nuovo
  // giorno nella settimana per calcolare l'eventuale incremento
  // altrimenti parto da 0 con la nuova settimana
  let NumDaysRoute = 0;
  let sogliaMinima = startWeek;
  // se non ho info precedenti o è una nuova settimana considero solo il giorno corrente per calcolare la serie
  // altrimenti aggiungo il giorno in cui è stata effettuato l'ultimo calcolo cosi ho un riferimento da cui calcolare la serie
  // ma aggiungo il giorno precedente cosi controllo anche il giorno in cui avevo fatto una tratta
  let dayInTheWeek = [Now.toDateString()];

  {
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
          const day = new Date(end).toDateString();
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
          const day = new Date(end).toDateString();

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
      const dif =
        new Date(dayInTheWeek[i + 1]).getTime() -
        new Date(dayInTheWeek[i]).getTime();
      console.log(dif);
      if (dif >= 86400000 && dif < 172800000) {
        console.log("giorno passato");
        // se cambia di uno allora è passato un giorno
        NumDaysRoute += 1;
      } else if (dif >= 172800000) {
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

    if (ContinueSerch) {
      // faccio un altra request per avere altre route dal db se esistono
      // che aggiornano a sua volta numDay
      dispatch(
        GetListRouteForCheckSeries({
          callbackToSeries,
          oldRoute: NewRoute,
          getState,
          dayBefore,
          evento
        })
      );

      return NumDaysRoute;
    } else {
      return NumDaysRoute;
    }
  }
}

function checkEventPointsWeek(pointsUser, pointsTot, points, evento, dispatch) {
  console.log(pointsTot);
  console.log(pointsUser);
  if (pointsUser + pointsTot >= points) {
    console.log("verificata " + evento.event.text_description);

    const newLevelComplete = {
      event_id: evento.id,
      new_status_events: 1
    };
    console.log(newLevelComplete);
    dispatch(putEvent(newLevelComplete));
  }
}

function callbackToSeries(route, getState, dispatch, dayBefore, evento) {
  console.log("ricalcolo la serie");
  const dateNow = new Date();

  let NumDaysRoute = NumSeriesRouteCalcolate(
    getState,
    dateNow,
    route,
    dispatch,
    dayBefore,
    evento
  );
  NumDaysRoute = parseInt(NumDaysRoute);

  if (NumDaysRoute >= dayBefore) {
    try {
      AsyncStorage.removeItem("series");
    } catch (error) {
      // Error saving data
    }

    console.log("verificata " + evento.event.text_description);

    const newLevelComplete = {
      event_id: evento.id,
      new_status_events: 1
    };
    console.log(newLevelComplete);
    dispatch(putEvent(newLevelComplete));
  } else {
    storeData("series", NumDaysRoute + "+" + dateNow.toDateString());
  }
}

function callbackToSeriesForTimeSlot(
  routeNew,
  getState,
  dispatch,
  infoCurrent,
  evento
) {
  // punti da raggiungere
  const points = evento.event.points;

  // punti tratta corrente
  let pointsTot = infoCurrent.pointRoute;

  // se devo cercare in altre route prendendo dal db
  let checkAnotherRoute = true;

  const PreviousRoute = getState().tracking.PreviousRoute;

  // prima calcolo sulle route precedenti
  for (route = 1; route <= PreviousRoute.length; route++) {
    // controllo se ho gia fatto piu route, se si interrompo
    if (pointsTot >= points) {
      check = true;
      break;
    }
    const Segment = PreviousRoute[route - 1] ? PreviousRoute[route - 1] : null;
    // se il segmento esiste e ancora non è stato completato e senza segment
    if (Segment && !Segment.modal_type && !Segment.isSegment) {
      const NumRoute = Segment.route.length;
      // prendo la data dell'ultima posizione presa, che è presente su route
      const end = Segment.route[NumRoute - 1].time;
      // se è successo in questa settimana
      if (end >= infoCurrent.last) {
        pointsTot += Segment.route[NumRoute - 1].totPoints;
      }
    }
  }
  // se ancora non ho soddisfato
  console.log(pointsTot);
  console.log(
    "controllo le route precedenti per vedere se soddisfa la condizione "
  );
  if (pointsTot < points) {
    const SavedRoute = routeNew;
    for (route = 1; route <= SavedRoute.length; route++) {
      if (pointsTot >= points) {
        check = true;
        break;
      }
      // prendo la data dalle info del db
      // se esiste
      if (SavedRoute[route - 1]) {
        const end = new Date(SavedRoute[route - 1].end_time).getTime();
        if (end >= infoCurrent.last) {
          pointsTot += SavedRoute[route - 1].points;
        } else {
          // se l'orario è inferiore allora non devo cercare ancora
          checkAnotherRoute = false;
        }
      }
    }
  }
  console.log(pointsTot);
  if (pointsTot >= points) {
    const newLevelComplete = {
      event_id: evento.id,
      new_status_events: 1
    };
    console.log(newLevelComplete);
    dispatch(putEvent(newLevelComplete));
  } else {
    if (checkAnotherRoute) {
      // prendo quelle precedenti per vedere se soddisfanno la serie
      dispatch(
        GetListRouteForCheckSeries({
          callbackToSeries: callbackToSeriesForTimeSlot,
          oldRoute: routeNew,
          getState,
          dayBefore: {
            last: last,
            pointRoute: pointsTot
          },
          evento
        })
      );
    }
  }
}
export function checkPublic(valueType) {
  let value = valueType;
  // se ho la nuova suddivisione dei mezzi in bus, tram e metro ovvero 5 6 7
  // lo faccio diventare 3 per il check con i training
  if (value > 4 && value < 8) {
    value = 3;
  }
  return value;
}
// metodi singoli che controllano i vari tipi di eventi
export function checkModalTypeDispatch(route, evento) {
  const condition = evento.event.modal_type;
  let check = false;
  // se c'e lo stesso tipo
  // divido le tipologie possibili
  let type = condition.split("-");
  console.log(type);
  // converto da stringa a numero
  type = type.map(elem => parseInt(elem));
  console.log(type);

  const typeRoute = route.segment;

  for (j = 0; j < type.length; j++) {
    for (k = 0; k < typeRoute.length; k++) {
      if (type[j] === checkPublic(typeRoute[k].modal_type)) {
        check = true;
        break;
      }
    }
    if (check) {
      break;
    }
  }
  return check;
}

function checkCounterRoutinaryDifferentInDayEvent(
  objectSave,
  start,
  routineId
) {
  console.log("routine id in un giorno ");
  // contiene tutte gli altr in array
  const { date, counter, array } = objectSave;

  const Now = new Date(start);
  const millisecond = Now.getTime();
  if (date === millisecond) {
    // questa tratta è stata gia considerata quindi non incremento
    return { date, counter, array };
  }

  const dateNow = new Date(millisecond).toDateString();
  const dateSave = new Date(date).toDateString();
  console.log(dateNow);
  console.log(dateSave);

  if (!counter) {
    return {
      date: millisecond,
      counter: 1,
      array: [{ date: millisecond, counter: routineId }]
    };
  } else {
    // primo valore il counter
    // il secondo la data

    // controllo se ha superato il valore interessato altrimenti salvo il nuovo valore

    if (dateNow === dateSave) {
      // se il giorno è lo stesso giorno, posso direttamente incrementare di uno
      // ma prima devo vedere se l'id è diverso da quelli precedenti sempre dello stesso giorno

      // arrayRoute = [...array, { date: millisecond, counter: points }];

      let arrayRoute = array.filter(
        route => new Date(route.date).toDateString() === dateNow
      );

      console.log(arrayRoute);
      if (arrayRoute.length) {
        const idRoutine = arrayRoute.reduce(
          (total, elem) => [...total, elem.counter],
          []
        );

        console.log(idRoutine);

        if (idRoutine.indexOf(routineId) === -1) {
          const counterNew = arrayRoute.length + 1;
          console.log(counterNew);
          return {
            date: millisecond,
            counter: counterNew,
            array: [...arrayRoute, { date: millisecond, counter: routineId }]
          };
        } else {
          const counterNew = arrayRoute.length;
          console.log(counterNew);
          return { date: millisecond, counter: counterNew, array: arrayRoute };
        }
      } else {
        // è un altro giorno
        return {
          date: millisecond,
          counter: 1,
          array: [{ date: millisecond, counter: routineId }]
        };
      }
    } else {
      // rinizio a contare da 1
      return {
        date: millisecond,
        counter: 1,
        array: [{ date: millisecond, counter: routineId }]
      };
    }
  }
}

function checkCounterPointsInMonthEvent(objectSave, start, points) {
  console.log("punti in un mese");

  const { date, counter } = objectSave;

  const Now = new Date(start);
  const millisecond = Now.getTime();
  if (date === millisecond) {
    // questa tratta è stata gia considerata quindi non incremento
    return { date, counter };
  }

  // calcolo l'inizio

  // calcolo i due mesi
  const dateNow = new Date(millisecond).getMonth();
  const dateSave = new Date(date).getMonth();
  console.log(dateNow);
  console.log(dateSave);
  console.log(counter);
  if (!counter) {
    return {
      date: millisecond,
      counter: points
    };
  } else {
    // vedo se è il mese corrente
    if (dateNow === dateSave) {
      const counterNew = counter + points;
      console.log(counterNew);

      return { date: millisecond, counter: counterNew };
    } else {
      return {
        date: millisecond,
        counter: points
      };
    }
  }
}

function checkCounterPointsIn48Event(objectSave, start, points) {
  console.log("punti in un 48 ore ");
  // contiene tutte gli altri punti in array
  const { date, counter, array } = objectSave;

  const Now = new Date(start);
  const millisecond = Now.getTime();
  if (date === millisecond) {
    // questa tratta è stata gia considerata quindi non incremento
    return { date, counter, array };
  }

  // calcolo l'inizio

  const dateNow = new Date(millisecond).toDateString();
  const dateSave = new Date(date).toDateString();
  console.log(dateNow);
  console.log(dateSave);
  console.log(counter);

  if (!counter) {
    return {
      date: millisecond,
      counter: points,
      array: [{ date: millisecond, counter: points }]
    };
  } else {
    // setto il limite inferiore
    const limit = millisecond - 86400000 * 2;
    let arrayRoute = [...array, { date: millisecond, counter: points }];
    arrayRoute = arrayRoute.filter(route => route.date >= limit);
    console.log(arrayRoute);

    const counterNew = arrayRoute.reduce(
      (total, elem) => total + elem.counter,
      0
    );
    console.log(counterNew);

    return { date: millisecond, counter: counterNew, array: arrayRoute };
  }
}

function checkCounterPointsInDayEvent(objectSave, start, points) {
  console.log("punti in un giorno");

  const { date, counter } = objectSave;

  const Now = new Date(start);
  const millisecond = Now.getTime();
  if (date === millisecond) {
    // questa tratta è stata gia considerata quindi non incremento
    return { date, counter };
  }

  // calcolo l'inizio

  const dateNow = new Date(millisecond).toDateString();
  const dateSave = new Date(date).toDateString();
  console.log(dateNow);
  console.log(dateSave);

  if (!counter) {
    return { date: millisecond, counter: points };
  } else {
    // primo valore il counter
    // il secondo la data

    // controllo se ha superato il valore interessato altrimenti salvo il nuovo valore

    if (dateNow === dateSave) {
      // se il giorno è lo stesso giorno, posso direttamente incrementare di uno
      const counterNew = counter + points;
      return { date: millisecond, counter: counterNew };
    } else {
      // rinizio a contare da 1
      return { date: millisecond, counter: points };
    }
  }
}

function checkCounterRouteInDayEvent(objectSave, start) {
  console.log("serie in un giorno");

  const { date, counter } = objectSave;

  const Now = new Date(start);
  const millisecond = Now.getTime();
  if (date === millisecond) {
    // questa tratta è stata gia considerata quindi non incremento
    return { date, counter };
  }

  // calcolo l'inizio

  const dateNow = new Date(millisecond).toDateString();
  const dateSave = new Date(date).toDateString();
  console.log(dateNow);
  console.log(dateSave);

  if (!counter) {
    return { date: millisecond, counter: 1 };
  } else {
    // primo valore il counter
    // il secondo la data

    // controllo se ha superato il valore interessato altrimenti salvo il nuovo valore

    if (dateNow === dateSave) {
      // se il giorno è lo stesso giorno, posso direttamente incrementare di uno
      const counterNew = counter + 1;
      return { date: millisecond, counter: counterNew };
    } else {
      // rinizio a contare da 1
      return { date: millisecond, counter: 1 };
    }
  }
}

function checkCounterRouteInSeriesEvent(objectSave, start) {
  console.log("serie in fila");

  const { date, counter } = objectSave;

  const Now = new Date(start);
  const millisecond = Now.getTime();
  if (date === millisecond) {
    // questa tratta è stata gia considerata quindi non incremento
    return { date, counter };
  }

  // calcolo l'inizio

  const dateNow = new Date(millisecond).toDateString();
  const dateSave = new Date(date).toDateString();
  console.log(dateNow);
  console.log(dateSave);

  if (!counter) {
    return { date: millisecond, counter: 1 };
  } else {
    // primo valore il counter
    // il secondo la data

    // controllo se ha superato il valore interessato altrimenti salvo il nuovo valore

    if (dateNow === dateSave) {
      // se il giorno è lo stesso giorno
      return { date, counter };
    } else if (
      dateNow === new Date(new Date(date).getTime() + 86400000).toDateString()
    ) {
      const counterNew = counter + 1;
      return { date: millisecond, counter: counterNew };
    } else {
      // rinizio a contare da 1
      return { date: millisecond, counter: 1 };
    }
  }
}

function checkCounterRouteForDayInWeekInSeriesEvent(
  objectSave,
  start,
  limitDay
) {
  console.log("tratte per piu giorni per piu settimane di fila ");

  const { date, counter, counterWeeks } = objectSave;

  const Now = new Date(start);
  const millisecond = Now.getTime();
  if (date === millisecond) {
    // questa tratta è stata gia considerata quindi non incremento
    return { date, counter, counterWeeks };
  }

  // calcolo l'inizio

  const dateNow = new Date(millisecond).toDateString();
  const dateSave = new Date(date).toDateString();
  console.log(dateNow);
  console.log(dateSave);

  if (!counter) {
    return { date: millisecond, counter: 1, counterWeeks };
  } else {
    // se è lo stesso giorno, sicuramente ho fatto gia una tratta

    if (dateNow === dateSave) {
      return { date, counter: 1, counterWeeks };
    }

    let DayNowFromMon = new Date(date).getDay();

    DayNowFromMon = DayNowFromMon ? DayNowFromMon - 1 : 6;

    // inizio settimana
    const startWeek = date - DayNowFromMon * 86400000;
    // fine settimana
    const endWeek = startWeek + 6 * 86400000;
    // inizio prossima settimana
    const nextStartWeek = endWeek + 86400000;
    // fine prossima settimana
    const nextEndWeek = nextStartWeek + 6 * 86400000;

    const startWeekString = new Date(startWeek).toDateString();
    const endWeekString = new Date(endWeek).toDateString();
    const nextStartWeekString = new Date(nextStartWeek).toDateString();
    const nextEndWeekString = new Date(nextEndWeek).toDateString();

    // stessa settimana ma giorno diverso per la nuova tratta rispetto a quella precedentemente salvata

    if (dateNow >= startWeekString && dateNow <= endWeekString) {
      const counterNew = counter + 1;
      if (counterNew == limitDay) {
        // ho raggiunto il limite di oggi
        const counterWeeksNew = counterWeeks + 1;
        return {
          date: millisecond,
          counter: counterNew,
          counterWeeks: counterWeeksNew
        };
      } else {
        return { date: millisecond, counter: counterNew, counterWeeks };
      }
    } else if (dateNow >= nextStartWeekString && dateNow <= nextEndWeekString) {
      // se ho fatto una tratta la settimana dopo, vedo se la settimana precedente avevo soddisfato la condizione
      // se si vado avanti con uno, altrimenti ricomincio
      if (counter >= limitDay) {
        // se avevo soddisfato nella settimana precedente la quantita minima
        return { date: millisecond, counter: 1, counterWeeks };
      } else {
        // ricomincio da zero dato che la settimana prima non ho soddisfa la sfida
        return { date: millisecond, counter: 1, counterWeeks: 0 };
      }
    } else {
      // dopo due settimane
      // rinizio a contare da 1
      return { date: millisecond, counter: 1, counterWeeks: 0 };
    }
  }
}

// devo fare una tratta nel fine settimana per piu settimane di fila
function checkCounterRouteInWeekendSeriesEvent(objectSave, start) {
  console.log("serie in fila per vari weekend");

  const { date, counter } = objectSave;

  const Now = new Date(start);
  const millisecond = Now.getTime();
  if (date === millisecond) {
    // questa tratta è stata gia considerata quindi non incremento
    return { date, counter };
  }

  // calcolo l'inizio

  const dateNow = new Date(millisecond).toDateString();
  const dateSave = new Date(date).toDateString();
  console.log(dateNow);
  console.log(dateSave);

  if (!counter) {
    return { date: millisecond, counter: 1 };
  } else {
    // primo valore il counter
    // il secondo la data

    // controllo se ha superato il valore interessato altrimenti salvo il nuovo valore

    const dayNow = new Date(new Date(start).getTime() - 86400000).getDay();
    console.log(dayNow);
    // ovvero siamo nella domenica e nel sabato
    if (dayNow === 5) {
      // sabato

      if (
        dateNow ===
          new Date(new Date(date).getTime() + 86400000).toDateString() ||
        dateNow === new Date(new Date(date).getTime()).toDateString()
      ) {
        // se è la domenica o sabato dopo rimane cosi comè

        return { date, counter };
      } else if (
        dateNow ===
          new Date(new Date(date).getTime() + 86400000 * 7).toDateString() ||
        dateNow ===
          new Date(new Date(date).getTime() + 86400000 * 8).toDateString()
      ) {
        // prossimo sabato o prossimo domenica
        const counterNew = counter + 1;
        return { date: millisecond, counter: counterNew };
      } else {
        return { date: millisecond, counter: 1 };
      }
    } else if (dayNow === 6) {
      // domenica
      if (dateNow === new Date(new Date(date).getTime()).toDateString()) {
        // se è la stessa adomenica

        return { date, counter };
      } else if (
        dateNow ===
          new Date(new Date(date).getTime() + 86400000 * 6).toDateString() ||
        dateNow ===
          new Date(new Date(date).getTime() + 86400000 * 7).toDateString()
      ) {
        // prossimo sabato o prossimo domenica
        const counterNew = counter + 1;
        return { date: millisecond, counter: counterNew };
      } else {
        return { date: millisecond, counter: 1 };
      }

      return { date, counter };
    }
    return { date: millisecond, counter: 1 };
  }
}

function checkCounterPointsInWeekEvent(objectSave, start, points) {
  console.log("serie in una settimana");

  const { date, counter } = objectSave;

  const Now = new Date(start);
  const millisecond = Now.getTime();
  if (date === millisecond) {
    // questa tratta è stata gia considerata quindi non incremento
    return { date, counter };
  }

  // calcolo l'inizio

  let DayNowFromMon = new Date(millisecond).getDay();

  DayNowFromMon = DayNowFromMon ? DayNowFromMon - 1 : 6;

  const startWeek = millisecond - DayNowFromMon * 86400000;
  // inizio settimana
  const dateNow = new Date(startWeek).toDateString();

  const Save = new Date(date);
  const millisecondSave = Save.getTime();
  console.log(millisecondSave);

  let DaySaveFromMon = new Date(millisecondSave).getDay();
  console.log(DaySaveFromMon);
  DaySaveFromMon = DaySaveFromMon ? DaySaveFromMon - 1 : 6;
  const hoursSave = Now.getHours();

  const minutesSave = Now.getMinutes();
  const secondSave = Now.getSeconds();

  const startWeekSave = millisecondSave - DaySaveFromMon * 86400000;
  // inizio settimana
  const dateSave = new Date(startWeekSave).toDateString();
  console.log(dateSave);
  console.log(dateNow);

  if (!counter) {
    return { date: millisecond, counter: points };
  } else {
    // primo valore il counter
    // il secondo la data

    // controllo se ha superato il valore interessato altrimenti salvo il nuovo valore

    if (dateNow === dateSave) {
      // se il giorno è lo stesso giorno, posso direttamente incrementare di uno
      const counterNew = counter + points;
      return { date: millisecond, counter: counterNew };
    } else {
      // rinizio a contare da 1
      return { date: millisecond, counter: points };
    }
  }
}

function checkCounterPointsInWeekForSeriesEvent(
  objectSave,
  start,
  points,
  limitWeek
) {
  console.log("tratte per piu giorni per piu settimane di fila ");

  const { date, counter, counterWeeks } = objectSave;

  const Now = new Date(start);
  const millisecond = Now.getTime();
  if (date === millisecond) {
    // questa tratta è stata gia considerata quindi non incremento
    return { date, counter, counterWeeks };
  }

  // calcolo l'inizio

  const dateNow = new Date(millisecond).toDateString();
  const dateSave = new Date(date).toDateString();
  console.log(dateNow);
  console.log(dateSave);

  if (!counter) {
    if (points >= limitWeek) {
      return { date: millisecond, counter: points, counterWeeks: 1 };
    } else {
      return { date: millisecond, counter: points, counterWeeks };
    }
  } else {
    let DayNowFromMon = new Date(date).getDay();

    DayNowFromMon = DayNowFromMon ? DayNowFromMon - 1 : 6;

    // inizio settimana
    const startWeek = date - DayNowFromMon * 86400000;
    // fine settimana
    const endWeek = startWeek + 6 * 86400000;
    // inizio prossima settimana
    const nextStartWeek = endWeek + 86400000;
    // fine prossima settimana
    const nextEndWeek = nextStartWeek + 6 * 86400000;

    const startWeekString = new Date(startWeek).toDateString();
    const endWeekString = new Date(endWeek).toDateString();
    const nextStartWeekString = new Date(nextStartWeek).toDateString();
    const nextEndWeekString = new Date(nextEndWeek).toDateString();

    // stessa settimana ma giorno diverso per la nuova tratta rispetto a quella precedentemente salvata

    if (dateNow >= startWeekString && dateNow <= endWeekString) {
      const counterNew = counter + points;
      if (counterNew >= limitWeek && counter < limitWeek) {
        // ho raggiunto il limite di oggi per la prima volta
        const counterWeeksNew = counterWeeks + 1;
        return {
          date: millisecond,
          counter: counterNew,
          counterWeeks: counterWeeksNew
        };
      } else {
        return { date: millisecond, counter: counterNew, counterWeeks };
      }
    } else if (dateNow >= nextStartWeekString && dateNow <= nextEndWeekString) {
      // se ho fatto una tratta la settimana dopo, vedo se la settimana precedente avevo soddisfato la condizione
      // se si vado avanti con uno, altrimenti ricomincio
      if (counter >= limitWeek) {
        // se avevo soddisfato nella settimana precedente la quantita minima

        if (points >= limitWeek) {
          return {
            date: millisecond,
            counter: points,
            counterWeeks: counterWeeks + 1
          };
        } else {
          return { date: millisecond, counter: points, counterWeeks };
        }
      } else {
        // ricomincio da zero dato che la settimana prima non ho soddisfa la sfida
        if (points >= limitWeek) {
          return { date: millisecond, counter: points, counterWeeks: 1 };
        } else {
          return { date: millisecond, counter: points, counterWeeks };
        }
      }
    } else {
      // dopo due settimane
      // rinizio a contare
      if (points >= limitWeek) {
        return { date: millisecond, counter: points, counterWeeks: 1 };
      } else {
        return { date: millisecond, counter: points, counterWeeks: 0 };
      }
    }
  }
}

function checkCounterPointsInSTEvent(
  objectSave,
  start,
  points,
  st_expired_date
) {
  const { date, counter } = objectSave;

  const Now = new Date(start);
  const millisecond = Now.getTime();
  // solo nel caso in cui lo ST non fosse scaduto
  if (+new Date() <= st_expired_date) {
    // if (date === millisecond) {
    //   // questa tratta è stata gia considerata quindi non incremento
    //   return { date, counter };
    // }

    const counterNew = counter + points;
    // alert(JSON.stringify(counterNew));

    return { date: millisecond, counter: counterNew };
  } else {
    return { date, counter };
  }
}

function checkCounterEvent(objectSave, start) {
  console.log("counter generico");

  const { date, counter } = objectSave;

  const Now = new Date(start);
  const millisecond = Now.getTime();
  if (date === millisecond) {
    // questa tratta è stata gia considerata quindi non incremento
    return { date, counter };
  } else {
    const counterNew = counter + 1;
    return { date: millisecond, counter: counterNew };
  }
}

function checkCounterRouteInWeekEvent(objectSave, start) {
  console.log("serie in una settimana");

  const { date, counter } = objectSave;

  const Now = new Date(start);
  const millisecond = Now.getTime();
  if (date === millisecond) {
    // questa tratta è stata gia considerata quindi non incremento
    return { date, counter };
  }

  // calcolo l'inizio

  let DayNowFromMon = new Date(millisecond).getDay();

  DayNowFromMon = DayNowFromMon ? DayNowFromMon - 1 : 6;

  const startWeek = millisecond - DayNowFromMon * 86400000;
  // inizio settimana
  const dateNow = new Date(startWeek).toDateString();

  const Save = new Date(date);
  const millisecondSave = Save.getTime();
  console.log(millisecondSave);

  let DaySaveFromMon = new Date(millisecondSave).getDay();
  console.log(DaySaveFromMon);
  DaySaveFromMon = DaySaveFromMon ? DaySaveFromMon - 1 : 6;
  const hoursSave = Now.getHours();

  const minutesSave = Now.getMinutes();
  const secondSave = Now.getSeconds();

  const startWeekSave = millisecondSave - DaySaveFromMon * 86400000;
  // inizio settimana
  const dateSave = new Date(startWeekSave).toDateString();
  console.log(dateSave);
  console.log(dateNow);

  if (!counter) {
    return { date: millisecond, counter: 1 };
  } else {
    // primo valore il counter
    // il secondo la data

    // controllo se ha superato il valore interessato altrimenti salvo il nuovo valore

    if (dateNow === dateSave) {
      // se il giorno è lo stesso giorno, posso direttamente incrementare di uno
      const counterNew = counter + 1;
      return { date: millisecond, counter: counterNew };
    } else {
      // rinizio a contare da 1
      return { date: millisecond, counter: 1 };
    }
  }
}

export function checkPointsDispatch(route, evento) {
  const condition = evento.event.points;
  // calcolo i punti totali dei vari segment
  // period deve essere diverso da zero perche altrimenti è un calcolo relativo a un periodo e non una singola route
  const totPoints = route.segment.reduce(
    (total, elem) => total + elem.points,
    0
  );

  if (totPoints >= condition) {
    return true;
  } else {
    return false;
  }
}

export function checkWeekendEvent(route, evento) {
  // ovvero weekend
  const dayNow = new Date(
    new Date(route.segment[0].end_time).getTime() - 86400000
  ).getDay();
  console.log(dayNow);
  // ovvero siamo nella domenica e nel sabato
  if (dayNow === 5 || dayNow === 6) {
    return true;
  } else {
    return false;
  }
}

export function checkFrequentTripEvent(route) {
  if (route.referred_most_freq_route) {
    return true;
  } else {
    return false;
  }
}

export function checkDay(route, condition) {
  // in uno specifico giorno
  if (
    new Date(
      new Date(route.segment[0].end_time).getTime() - 86400000
    ).getDay() === condition
  ) {
    return true;
  } else {
    return false;
  }
}

export function checkWeather(weather, condition) {
  // meteo
  if (convertWeatherCondition(weather) === condition) {
    return true;
  } else {
    return false;
  }
}

export function checkTimeSlot(route, condition) {
  // se è nel formato 22-05
  // In un intervallo preciso
  // divido l'orario

  let check = false;

  let hours = condition.split("-");
  console.log(hours);

  // prendo il primo orario e l'ultimo

  const last = new Date(
    route.segment[route.segment.length - 1].end_time
  ).getTime();
  const first = route.segment[0].route_positions_info[0].time * 1000;
  console.log("primo e ultimo tempo");
  console.log(first);
  console.log(last);
  let hourStart = new Date(first).toTimeString();
  hourStart = hourStart.substring(0, 5);
  let hourEnd = new Date(last).toTimeString();
  hourEnd = hourEnd.substring(0, 5);
  // ottengo 11:30
  // confronto con l'inizio e con la fine
  console.log(hourStart);
  console.log(hourEnd);

  // se la fine supera la mezzanotte devo fare un controllo differente
  if (hours[0] < hours[1]) {
    // se ho tipo 22:00-23:00
    // l'inizio o la fine deve essere in questo range
    if (hourStart >= hours[0] && hourStart <= hours[1]) {
      check = true;
    } else if (hourEnd >= hours[0] && hourEnd <= hours[1]) {
      check = true;
    }
  } else {
    // se ho tipo 22:00 5:00
    // prima vedo se l'orario di fine corrente ha superato la mezzanotte
    // if (hourEnd <= "12:00") {
    //   if (hourStart >= hours[0] && hourEnd <= hours[1]) {
    //     check = true;
    //   }
    // } else {
    //   // sono nelle 22 - 23
    //   if (hourStart >= hours[0] && hourEnd >= hours[1]) {
    //     check = true;
    //   }
    // }

    // se ho tipo 22:00 5:00

    // caso 22 - 23 o 5 - 6
    if (hourStart <= hourEnd) {
      // 22 >= 22 e 23 >= 22
      if (hourStart >= hours[0] && hourEnd >= hours[0]) {
        check = true;
      } else if (hourStart <= hours[1] && hourEnd <= hours[1]) {
        // 4 <= 5 e 5 <= 5
        check = true;
      }
    } else {
      // caso 22 - 5
      // 22 >= 22 e 1 <= 5
      if (hourStart >= hours[0] && hourEnd <= hours[0]) {
        check = true;
      } else if (hourStart >= hours[1] && hourEnd <= hours[1]) {
        // 22 >= 5 e 3 <= 5
        check = true;
      }
    }
  }
  return check;
}

export function checkTimeSlot48(route, condition, evento, getState, dispatch) {
  let check = false;
  // se è un intervallo precedente tipo 48H

  let hours = condition.slice(0, 2); // 48
  const type = condition.slice(2, 3); // H
  hours = parseInt(hours);
  let millisecondi = 0;
  if (type === "H") {
    millisecondi = hours * 3600000;
  }
  console.log(
    "controllo le route precedenti per vedere se soddisfa la condizione in 48h "
  );

  // prendo il primo orario
  const first = route.segment[0].route_positions_info[0].time * 1000;

  // prendo il limite minimo
  const last = first - millisecondi;

  // punti da raggiungere
  const points = evento.event.points;

  // punti tratta corrente
  let pointsTot = route.segment.reduce((total, elem) => total + elem.points, 0);

  // se devo cercare in altre route prendendo dal db
  let checkAnotherRoute = true;

  const PreviousRoute = getState().tracking.PreviousRoute;
  const SavedRoute = getState().login.Route;

  // prima calcolo sulle route precedenti
  for (routeNum = 1; routeNum <= PreviousRoute.length; routeNum++) {
    // controllo se ho gia fatto piu route, se si interrompo
    if (pointsTot >= points) {
      check = true;
      break;
    }
    const Segment = PreviousRoute[routeNum - 1]
      ? PreviousRoute[routeNum - 1]
      : null;
    // se il segmento esiste e ancora non è stato completato e senza segment
    if (Segment && !Segment.modal_type && !Segment.isSegment) {
      const NumRoute = Segment.route.length;
      // prendo la data dell'ultima posizione presa, che è presente su route
      const end = Segment.route[NumRoute - 1].time;
      // se è successo in questa settimana
      if (end >= last) {
        pointsTot += Segment.route[NumRoute - 1].totPoints;
      }
    }
  }
  // se ancora non ho soddisfato
  console.log(pointsTot);
  console.log(
    "controllo le route precedenti per vedere se soddisfa la condizione "
  );
  if (pointsTot < points) {
    for (routeNum = 1; routeNum <= SavedRoute.length; routeNum++) {
      if (pointsTot >= points) {
        check = true;
        break;
      }
      // prendo la data dalle info del db
      // se esiste
      if (SavedRoute[routeNum - 1]) {
        const end = new Date(SavedRoute[routeNum - 1].end_time).getTime();
        if (end >= last) {
          pointsTot += SavedRoute[routeNum - 1].points;
        } else {
          // se l'orario è inferiore allora non devo cercare ancora
          checkAnotherRoute = false;
        }
      }
    }
  }
  console.log(pointsTot);
  if (pointsTot >= points) {
    check = true;
    const newLevelComplete = {
      event_id: evento.id,
      new_status_events: 1
    };
    console.log(newLevelComplete);
    dispatch(putEvent(newLevelComplete));
  } else {
    if (checkAnotherRoute) {
      // prendo quelle precedenti per vedere se soddisfanno la serie
      console.log(
        "prendo le route precedenti per vedere se soddisfa il time-slot dato che nessuna ha superato il tempo minimo "
      );
      dispatch(
        GetListRouteForCheckSeries({
          callbackToSeries: callbackToSeriesForTimeSlot,
          oldRoute: SavedRoute,
          getState,
          dayBefore: {
            last: last,
            pointRoute: route.segment.reduce(
              (total, elem) => total + elem.points,
              0
            )
          },
          evento
        })
      );
    }
  }

  return check;

  // calcolo i  punti fatti adesso
}

export function checkPointsDay(route, points, getState) {
  let check = false;
  // ovvero in un giorno
  console.log(
    "calcolo delle route in un giorno per il calcolo totale dei punti"
  );

  // inizio route.segment[0].end_time
  // parto da uno dato che ho gia fatto una tratta valida
  let pointsTot = route.segment.reduce((total, elem) => total + elem.points, 0);

  const PreviousRoute = getState().tracking.PreviousRoute;

  // calcolo l'inizio del giorno
  console.log(route.segment[0].end_time);
  const Now = new Date(route.segment[0].end_time);
  const hoursNow = Now.getHours();
  console.log(Now);

  const minutesNow = Now.getMinutes();
  const secondNow = Now.getSeconds();

  const startDay =
    Now.getTime() -
    (hoursNow * 3600000 + minutesNow * 60000 + secondNow * 1000);
  console.log(startDay);

  // prima calcolo sulle route precedenti
  for (route = 1; route <= PreviousRoute.length; route++) {
    // controllo se ho gia fatto piu route, se si interrompo
    if (pointsTot >= points) {
      check = true;
      break;
    }
    const Segment = PreviousRoute[route - 1] ? PreviousRoute[route - 1] : null;
    // se il segmento esiste e ancora non è stato completato e senza segment
    if (Segment && !Segment.modal_type && !Segment.isSegment) {
      const NumRoute = Segment.route.length;
      // prendo la data dell'ultima posizione presa, che è presente su route
      const end = Segment.route[NumRoute - 1].time;
      // se è successo in questa settimana
      if (end >= startDay) {
        pointsTot += Segment.route[NumRoute - 1].totPoints;
      }
    }
  }
  // se ancora non ho soddisfato
  console.log(pointsTot);
  console.log(
    "controllo le route precedenti per vedere se soddisfa la condizione "
  );
  if (pointsTot < points) {
    const SavedRoute = getState().login.Route;
    for (route = 1; route <= SavedRoute.length; route++) {
      if (pointsTot >= points) {
        check = true;
        break;
      }
      // prendo la data dalle info del db
      // se esiste
      if (SavedRoute[route - 1]) {
        const end = new Date(SavedRoute[route - 1].end_time).getTime();
        if (end >= startDay) {
          pointsTot += SavedRoute[route - 1].points;
        }
      }
    }
  }
  console.log(pointsTot);
  if (pointsTot >= points) {
    check = true;
  }
  return check;
}

export function checkPointsWeek(route, points, evento, getState, dispatch) {
  let check = false;

  // ovvero in una settimana
  console.log(
    "calcolo delle route in una settimana per il calcolo totale dei punti"
  );
  const standings = getState().standings;
  if (standings.selectedTiming === "weekly") {
    // se ho la classifica settimana, prendo il punteggio cosi so quanti punti hai fatto
    // e ci sommo quelli nuovi
    let pointWeek = standings.infoUserGlobalClassification.points
      ? standings.infoUserGlobalClassification.points
      : standings.infoUserCityClassification.points
      ? standings.infoUserCityClassification.points
      : 0;
    console.log(pointWeek);

    // controllo se ho gia fatto piu route, se si interrompo
    if (pointWeek >= points) {
      check = true;
    }

    if (!check) {
      // prima calcolo sulle route precedenti
      // parto da uno dato che ho gia fatto una tratta valida
      let pointsTot = route.segment.reduce(
        (total, elem) => total + elem.points,
        0
      );

      pointWeek += pointsTot;
      if (pointWeek >= points) {
        check = true;
      }
    }
    // se soddisfa allora ho completato l'evento
    if (check) {
      console.log("verificata " + evento.event.text_description);

      const newLevelComplete = {
        event_id: evento.id,
        new_status_events: 1
      };
      console.log(newLevelComplete);
      dispatch(putEvent(newLevelComplete));
    }
  } else {
    // ricarico la classifica corrispodente, aggiungo i punti e in caso controllo se soddisfa
    let pointsTot = route.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );
    dispatch(
      getWeeklyLeaderboard(
        null,
        pointsTot,
        points,
        evento,
        checkEventPointsWeek
      )
    );
  }
  return check;
}

export function checkPointsMonth(route, points, evento, getState, dispatch) {
  let check = false;

  // ovvero in una mese
  console.log("calcolo delle route in un mese per il calcolo totale dei punti");
  const standings = getState().standings;
  if (standings.selectedTiming === "monthly") {
    // se ho la classifica mensile, prendo il punteggio cosi so quanti punti hai fatto
    // e ci sommo quelli nuovi
    let pointWeek = standings.infoUserGlobalClassification.points
      ? standings.infoUserGlobalClassification.points
      : standings.infoUserCityClassification.points
      ? standings.infoUserCityClassification.points
      : 0;

    // controllo se ho gia fatto piu route, se si interrompo
    if (pointWeek >= points) {
      check = true;
    }

    if (!check) {
      // prima calcolo sulle route precedenti
      // parto da uno dato che ho gia fatto una tratta valida
      let pointsTot = route.segment.reduce(
        (total, elem) => total + elem.points,
        0
      );

      pointWeek += pointsTot;
      if (pointWeek >= points) {
        check = true;
      }
    }
    if (check) {
      console.log("verificata " + evento.event.text_description);

      const newLevelComplete = {
        event_id: evento.id,
        new_status_events: 1
      };
      console.log(newLevelComplete);
      dispatch(putEvent(newLevelComplete));
    }
  } else {
    // ricarico la classifica corrispodente, aggiungo i punti e in caso controllo se soddisfa
    let pointsTot = route.segment.reduce(
      (total, elem) => total + elem.points,
      0
    );
    dispatch(
      getMonthlyLeaderboard(
        null,
        pointsTot,
        points,
        evento,
        checkEventPointsMonth
      )
    );
  }
  return check;
}

function checkCounterMoreRouteInDayInSeriesEvent(objectSave, start, limitDay) {
  console.log("serie in fila");

  const { date, counter, counterDays } = objectSave;

  const Now = new Date(start);
  const millisecond = Now.getTime();
  if (date === millisecond) {
    // questa tratta è stata gia considerata quindi non incremento
    return { date, counter, counterDays };
  }

  // calcolo l'inizio

  const dateNow = new Date(millisecond).toDateString();
  const dateSave = new Date(date).toDateString();
  console.log(dateNow);
  console.log(dateSave);

  if (!counter) {
    return { date: millisecond, counter: 1, counterDays };
  } else {
    // primo valore il counter
    // il secondo la data

    // controllo se ha superato il valore interessato altrimenti salvo il nuovo valore

    if (dateNow === new Date(new Date(date).getTime()).toDateString()) {
      // se il giorno è lo stesso giorno,
      const counterNew = counter + 1;
      if (counterNew == limitDay) {
        // ho raggiunto il limite di oggi
        const counterDaysNew = counterDays + 1;
        return {
          date: millisecond,
          counter: counterNew,
          counterDays: counterDaysNew
        };
      } else {
        return { date: millisecond, counter: counterNew, counterDays };
      }
    } else if (
      dateNow === new Date(new Date(date).getTime() + 86400000).toDateString()
    ) {
      if (counter >= limitDay) {
        // se avevo soddisfato il giorno precedente la quantita minima
        return { date: millisecond, counter: 1, counterDays };
      } else {
        // ricomincio da zero dato che il giorno prima non ho soddisfa la sfida
        return { date: millisecond, counter: 1, counterDays: 0 };
      }
    } else {
      // rinizio a contare da 1
      return { date: millisecond, counter: 1, counterDays: 0 };
    }
  }
}

// check per sapere se prendendo i dati dal db, ovvero i punti mensili, se l'evento è completato
function checkEventPointsMonth(
  pointsUser,
  pointsTot,
  points,
  evento,
  dispatch
) {
  console.log("arrivati nuovi dati");
  if (pointsUser + pointsTot >= points) {
    console.log("verificata " + evento.event.text_description);

    const newLevelComplete = {
      event_id: evento.id,
      new_status_events: 1
    };
    console.log(newLevelComplete);
    dispatch(putEvent(newLevelComplete));
  } else {
    dispatch({ type: "nothing" });
  }
}

export function checkFrequentTripPeriod(
  route,
  condition,
  evento,
  getState,
  dispatch
) {
  // se è una most routinary trip
  // allora faccio un ragionamento differente
  // ovviamente quella corrente deve essere una frequent trip
  let checkData = false;
  // quante volte devo effettuare una tratta
  const frequency = evento.event.frequency ? evento.event.frequency : 0;

  if (condition === 1) {
    // ovvero in un giorno
    console.log("calcolo delle route con mfr in un giorno");

    // quante volte devo effettuare una tratta

    console.log("calcolo delle routinary trip in un giorno");

    if (
      evento.event.text_description ===
      "Do two different routinary trips in a single day"
    ) {
      // questo è un caso particolare
      // perche devono essere routine differenti

      // prendo il valore precedente di mfr che mi è utile per capire quante routine ho fatto oggi
      retrieveData("mfrDifferent").then(value => {
        console.log("mfrDifferent");
        console.log(value);
        console.log(route.segment[0].end_time);

        const mostFrequentRoute = getState().login.mostFrequentRoute;
        const Now = new Date(route.segment[0].end_time);
        const dateNow = Now.toDateString();

        const lengthRoutine = mostFrequentRoute.length;
        // accodo il valore e la data di quando è stato salvato
        if (!value) {
          let stringNewMatch = "";
          for (i = 0; i < lengthRoutine; i++) {
            // se ho trovato una delle routine salvate metto 1
            if (route.referred_most_freq_route === mostFrequentRoute[i].id) {
              stringNewMatch += "1/" + mostFrequentRoute[i].id;
            } else {
              stringNewMatch += "0/" + mostFrequentRoute[i].id;
            }
            if (i < lengthRoutine - 1) {
              // penultimo aggiungo +
              stringNewMatch += "-";
            }
          }
          storeData("mfrDifferent", stringNewMatch + "+" + dateNow);
        } else {
          // riprendo il valore in intero
          const count = value.split("+");

          // se è la stessa giornata, allora aggiorno i dati
          if (count[1] === dateNow) {
            const id = count[0].split("-");
            console.log(id);
            let matchRoutine = 0;

            let stringNewMatch = "";
            for (i = 0; i < lengthRoutine; i++) {
              // se ho trovato una delle routine salvate incremento
              let ValueCounterInt = 0;

              id.forEach(value => {
                const routine = value.split("/");
                // confronto gli id
                if (routine[1] === mostFrequentRoute[i].id) {
                  ValueCounterInt = parseInt(routine[0]);
                }
              });

              if (route.referred_most_freq_route === mostFrequentRoute[i].id) {
                // se è coerente con quella trovata aumento di uno
                ValueCounterInt += 1;
              }

              // controllo se il valore è maggiore di zero per sapere c'e c'e stato il match
              // due match allora condizione verificata
              if (ValueCounterInt) {
                matchRoutine++;
              }

              stringNewMatch += ValueCounterInt + "/" + mostFrequentRoute[i].id;

              if (i < lengthRoutine - 1) {
                // penultimo aggiungo +
                stringNewMatch += "-";
              }
            }
            storeData("mfrDifferent", stringNewMatch + "+" + dateNow);
            if (matchRoutine => frequency) {
              console.log("verificata " + evento.event.text_description);
              // e poi invio
              const newLevelComplete = {
                event_id: evento.id,
                new_status_events: 1
              };
              console.log(newLevelComplete);
              dispatch(putEvent(newLevelComplete));
              try {
                AsyncStorage.removeItem("mfrDifferent");
              } catch (error) {
                // Error saving data
              }
            }
          } else {
            // se il giorno è diverso riparto dall'inizio
            let stringNewMatch = "";
            for (i = 0; i < lengthRoutine; i++) {
              // se ho trovato una delle routine salvate metto 1
              if (route.referred_most_freq_route === mostFrequentRoute[i].id) {
                stringNewMatch += "1/" + mostFrequentRoute[i].id;
              } else {
                stringNewMatch += "0/" + mostFrequentRoute[i].id;
              }
              if (i < lengthRoutine - 1) {
                // penultimo aggiungo +
                stringNewMatch += "-";
              }
            }
            storeData("mfrDifferent", stringNewMatch + "+" + dateNow);
          }
        }
      });
    } else {
      retrieveData("mfr1").then(value => {
        let checkData = updateValueSeriesDay(
          "mfr1",
          value,
          route.segment[0].end_time,
          frequency
        );
        if (checkData) {
          console.log("verificata " + evento.event.text_description);
          // e poi invio
          const newLevelComplete = {
            event_id: evento.id,
            new_status_events: 1
          };
          console.log(newLevelComplete);
          dispatch(putEvent(newLevelComplete));
        }
      });
    }
  } else if (condition === 4) {
    // ovvero route in fila
    // per quanti giorni
    console.log(
      "controllo le route precedenti per vedere se sono mfr in serie"
    );

    retrieveData("mfrSeries").then(value => {
      let checkData = updateValueSeriesRow(
        "mfrSeries",
        value,
        route.segment[0].end_time,
        frequency
      );
      if (checkData) {
        console.log("verificata " + evento.event.text_description);
        // e poi invio
        const newLevelComplete = {
          event_id: evento.id,
          new_status_events: 1
        };
        console.log(newLevelComplete);
        dispatch(putEvent(newLevelComplete));
      }
    });
  } else if (condition === 2) {
    // ovvero route con quella modalita in una settimana

    console.log("calcolo delle route con mfr in una settimana");
    retrieveData("mfrWeek").then(value => {
      checkData = updateValueSeriesWeekend(
        "mfrWeek",
        value,
        route.segment[0].end_time,
        frequency
      );
      if (checkData) {
        console.log("verificata " + evento.event.text_description);
        // e poi invio
        const newLevelComplete = {
          event_id: evento.id,
          new_status_events: 1
        };
        console.log(newLevelComplete);
        dispatch(putEvent(newLevelComplete));
      }
    });
  }

  if (condition === 1) {
    // ovvero in un giorno
    console.log("calcolo delle routinary trip in un giorno");

    if (
      evento.event.text_description ===
      "Do two different routinary trips in a single day"
    ) {
      // questo è un caso particolare
      // perche devono essere routine differenti

      // prendo il valore precedente di mfr che mi è utile per capire quante routine ho fatto oggi
      retrieveData("mfrDifferent").then(value => {
        console.log("mfrDifferent");
        console.log(value);
        console.log(route.segment[0].end_time);

        const mostFrequentRoute = getState().login.mostFrequentRoute;
        const Now = new Date(route.segment[0].end_time);
        const dateNow = Now.toDateString();

        const lengthRoutine = mostFrequentRoute.length;
        // accodo il valore e la data di quando è stato salvato
        if (!value) {
          let stringNewMatch = "";
          for (i = 0; i < lengthRoutine; i++) {
            // se ho trovato una delle routine salvate metto 1
            if (route.referred_most_freq_route === mostFrequentRoute[i].id) {
              stringNewMatch += "1/" + mostFrequentRoute[i].id;
            } else {
              stringNewMatch += "0/" + mostFrequentRoute[i].id;
            }
            if (i < lengthRoutine - 1) {
              // penultimo aggiungo +
              stringNewMatch += "-";
            }
          }
          storeData("mfrDifferent", stringNewMatch + "+" + dateNow);
        } else {
          // riprendo il valore in intero
          const count = value.split("+");

          // se è la stessa giornata, allora aggiorno i dati
          if (count[1] === dateNow) {
            const id = count[0].split("-");
            console.log(id);
            let matchRoutine = 0;

            let stringNewMatch = "";
            for (i = 0; i < lengthRoutine; i++) {
              // se ho trovato una delle routine salvate incremento
              let ValueCounterInt = 0;

              id.forEach(value => {
                const routine = value.split("/");
                // confronto gli id
                if (routine[1] === mostFrequentRoute[i].id) {
                  ValueCounterInt = parseInt(routine[0]);
                }
              });

              if (route.referred_most_freq_route === mostFrequentRoute[i].id) {
                // se è coerente con quella trovata aumento di uno
                ValueCounterInt += 1;
              }

              // controllo se il valore è maggiore di zero per sapere c'e c'e stato il match
              // due match allora condizione verificata
              if (ValueCounterInt) {
                matchRoutine++;
              }

              stringNewMatch += ValueCounterInt + "/" + mostFrequentRoute[i].id;

              if (i < lengthRoutine - 1) {
                // penultimo aggiungo +
                stringNewMatch += "-";
              }
            }
            storeData("mfrDifferent", stringNewMatch + "+" + dateNow);
            if (matchRoutine => frequency) {
              console.log("verificata " + evento.event.text_description);
              // e poi invio
              const newLevelComplete = {
                event_id: evento.id,
                new_status_events: 1
              };
              console.log(newLevelComplete);
              dispatch(putEvent(newLevelComplete));
              try {
                AsyncStorage.removeItem("mfrDifferent");
              } catch (error) {
                // Error saving data
              }
            }
          } else {
            // se il giorno è diverso riparto dall'inizio
            let stringNewMatch = "";
            for (i = 0; i < lengthRoutine; i++) {
              // se ho trovato una delle routine salvate metto 1
              if (route.referred_most_freq_route === mostFrequentRoute[i].id) {
                stringNewMatch += "1/" + mostFrequentRoute[i].id;
              } else {
                stringNewMatch += "0/" + mostFrequentRoute[i].id;
              }
              if (i < lengthRoutine - 1) {
                // penultimo aggiungo +
                stringNewMatch += "-";
              }
            }
            storeData("mfrDifferent", stringNewMatch + "+" + dateNow);
          }
        }
      });
    } else {
      // un tot di frequent trip da effettuare

      // prendo il valore precedente di mfr che mi è utile per capire quante routine ho fatto oggi
      retrieveData("mfr1").then(value => {
        // valore delle frequent trip precedenti
        let ValueCounterInt = 0;

        console.log("mfr1");
        console.log(value);
        console.log(route.segment[0].end_time);
        const Now = new Date(route.segment[0].end_time);
        const dateNow = Now.toDateString();

        // accodo il valore e la data di quando è stato salvato
        if (!value) {
          storeData("mfr1", "1+" + dateNow);
          checkData = false;
        } else {
          // riprendo il valore in intero
          const count = value.split("+");
          // primo valore il counter
          // il secondo la data
          ValueCounterInt = parseInt(count[0]);
          // controllo se ha superato il valore interessato altrimenti salvo il nuovo valore
          // - 1 poi la tratta corrente è gia una routine dato che è entrata nel if precedente
          if (ValueCounterInt >= frequency - 1 && dateNow === count[1]) {
            checkData = true;
          } else if (dateNow === count[1]) {
            // ha fallito
            ValueCounterInt = ValueCounterInt + 1;
            console.log(ValueCounterInt);
            storeData("mfr1", ValueCounterInt + "+" + count[1]);
            checkData = false;
          } else {
            // se neanche il giorno è lo stesso allora cancello il dato precedente
            try {
              AsyncStorage.removeItem("mfr1");
            } catch (error) {
              // Error saving data
            }
            checkData = false;
          }
          if (checkData) {
            console.log("verificata " + evento.event.text_description);
            // e poi invio
            const newLevelComplete = {
              event_id: evento.id,
              new_status_events: 1
            };
            console.log(newLevelComplete);
            dispatch(putEvent(newLevelComplete));
            try {
              AsyncStorage.removeItem("mfr1");
            } catch (error) {
              // Error saving data
            }
          }
        }
      });
    }
  } else if (condition === 4) {
    // ovvero frequent trips in fila

    console.log("calcolo delle routinary trip in fila");

    // valore delle frequent trip precedenti
    let ValueCounterInt = 0;
    // prendo il valore precedente di mfr che mi è utile per capire quante routine ho fatto oggi
    retrieveData("mfr4").then(value => {
      console.log("mfr4");
      console.log(value);
      console.log(route.segment[0].end_time);
      const Now = new Date(route.segment[0].end_time);
      const dateNow = Now.toDateString();

      // accodo il valore e la data di quando è stato salvato
      if (!value) {
        storeData("mfr4", "1+" + dateNow);
        checkData = false;
      } else {
        // riprendo il valore in intero
        const count = value.split("+");
        // primo valore il counter
        // il secondo la data
        ValueCounterInt = parseInt(count[0]);
        // controllo se ha superato il valore interessato altrimenti salvo il nuovo valore
        // - 1 poi la tratta corrente è gia una routine dato che è entrata nel if precedente

        if (ValueCounterInt >= frequency - 1) {
          // se ho raggiunto il valore allora è stato completato l'evento
          checkData = true;
          try {
            AsyncStorage.removeItem("mfr4");
          } catch (error) {
            // Error saving data
          }
        } else if (dateNow === count[1]) {
          // se la data è di nuovo la stessa a quella salvata non cambia nulla e non devo salvare nessuna nuova informazione
        } else if (
          dateNow ===
          new Date(new Date(count[1]).getTime() + 86400000).toDateString()
        ) {
          // è un altro giorno, se è il successivo incremento di uno,
          ValueCounterInt = ValueCounterInt + 1;
          console.log(ValueCounterInt);
          // salvo il nuovo valore e il nuovo giorno
          storeData("mfr4", ValueCounterInt + "+" + dateNow);
          checkData = false;
        } else {
          // se il giorno è molto piu avanti risalvo il valore come al principio ovvero uno dato che questa è un frequent trip
          storeData("mfr4", "1+" + dateNow);
          checkData = false;
        }

        if (checkData) {
          console.log("verificata " + evento.event.text_description);
          // e poi invio
          const newLevelComplete = {
            event_id: evento.id,
            new_status_events: 1
          };
          console.log(newLevelComplete);
          dispatch(putEvent(newLevelComplete));
        }
      }
    });
  } else if (condition === 2) {
    // ovvero frequent trips in una settimana

    console.log("calcolo delle routinary trip in una settimana");
    retrieveData("mfrWeek").then(value => {
      checkData = updateValueSeriesWeekend(
        "mfrWeek",
        value,
        route.segment[0].end_time,
        frequency
      );
      if (checkData) {
        console.log("verificata " + evento.event.text_description);
        // e poi invio
        const newLevelComplete = {
          event_id: evento.id,
          new_status_events: 1
        };
        console.log(newLevelComplete);
        dispatch(putEvent(newLevelComplete));
      }
    });
  }
  return checkData;
}

export function checkWeatherPeriod(
  route,
  condition,
  evento,
  getState,
  dispatch
) {
  // quante volte devo effettuare una tratta
  const frequency = evento.event.frequency ? evento.event.frequency : 0;

  if (condition === 1) {
    // ovvero in un giorno
    console.log("calcolo delle route in un giorno per vedere il meteo ");

    // quante volte devo effettuare una tratta

    retrieveData("weatherInDay").then(value => {
      let checkData = updateValueSeriesDay(
        "weatherInDay",
        value,
        route.segment[0].end_time,
        frequency
      );
      if (checkData) {
        console.log("verificata " + evento.event.text_description);
        // e poi invio
        const newLevelComplete = {
          event_id: evento.id,
          new_status_events: 1
        };
        console.log(newLevelComplete);
        dispatch(putEvent(newLevelComplete));
      }
    });
  } else if (condition === 4) {
    // ovvero route in fila
    // per quanti giorni
    console.log("controllo le route precedenti per vedere il meteo in serie");

    retrieveData("weatherInSeries").then(value => {
      let checkData = updateValueSeriesRow(
        "weatherInSeries",
        value,
        route.segment[0].end_time,
        frequency
      );
      if (checkData) {
        console.log("verificata " + evento.event.text_description);
        // e poi invio
        const newLevelComplete = {
          event_id: evento.id,
          new_status_events: 1
        };
        console.log(newLevelComplete);
        dispatch(putEvent(newLevelComplete));
      }
    });
  } else if (condition === 2) {
    // ovvero route con quel meteo in una settimana

    console.log("calcolo delle route con brutto meteo in una settimana");
    retrieveData("weatherInWeek").then(value => {
      checkData = updateValueSeriesWeekend(
        "weatherInWeek",
        value,
        route.segment[0].end_time,
        frequency
      );
      if (checkData) {
        console.log("verificata " + evento.event.text_description);
        // e poi invio
        const newLevelComplete = {
          event_id: evento.id,
          new_status_events: 1
        };
        console.log(newLevelComplete);
        dispatch(putEvent(newLevelComplete));
      }
    });
  } else if (condition === 3) {
    // ovvero route con quel meteo in generale

    console.log("calcolo delle route con brutto meteo in generale");
    retrieveData("weatherInGeneral").then(value => {
      checkData = updateValueSeriesCounter(
        "weatherInGeneral",
        value,
        route.segment[0].end_time,
        frequency
      );
      if (checkData) {
        console.log("verificata " + evento.event.text_description);
        // e poi invio
        const newLevelComplete = {
          event_id: evento.id,
          new_status_events: 1
        };
        console.log(newLevelComplete);
        dispatch(putEvent(newLevelComplete));
      }
    });
  }
  return false;
}

export function checkRouteWeekend(route) {
  // ovvero weekend
  const dayNow = new Date(
    new Date(route.segment[0].end_time).getTime() - 86400000
  ).getDay();
  console.log(dayNow);
  // ovvero siamo nella domenica e nel sabato
  if (dayNow === 5 || dayNow === 6) {
    return true;
  } else {
    return false;
  }
}

export function checkRouteRepeatWeekend(
  route,
  condition,
  evento,
  getState,
  dispatch
) {
  const frequency = evento.event.frequency;
  // false poiche devo fare un altro controllo
  let check = false;
  if (frequency === 2) {
    // se sabato salvo che ho fatto una tratta sabato
    const Now = new Date(route.segment[0].end_time);
    const date = Now.toDateString();
    const dayNow = new Date(
      new Date(route.segment[0].end_time).getTime() - 86400000
    ).getDay();
    if (dayNow === 5) {
      storeData("weekend", "1" + "+" + date);
    } else if (dayNow === 6) {
      // se domenica controllo se sabato ho fatto una tratta
      retrieveData("weekend").then(value => {
        console.log("weekend");
        console.log(value);

        if (!value) {
          // non faccio nulla
        } else {
          // riprendo il valore in intero
          const count = value.split("+");
          let NumDaysRoute = count[0];
          NumDaysRoute = parseInt(NumDaysRoute);
          // primo valore il counter
          // il secondo la data

          // se il valore è uno e la data è il giorno dopo allora ho fatto la domenica dopo aver fatto il sabato

          if (
            NumDaysRoute &&
            date ===
              new Date(new Date(count[1]).getTime() + 86400000).toDateString()
          ) {
            // evento completato
            console.log("verificata " + evento.event.text_description);
            // e poi invio
            const newLevelComplete = {
              event_id: evento.id,
              new_status_events: 1
            };
            console.log(newLevelComplete);
            dispatch(putEvent(newLevelComplete));
            // cancello il dato
            try {
              AsyncStorage.removeItem("weekend");
            } catch (error) {
              // Error saving data
            }
          } else {
            // se non è il giorno dopo cancello il dato
            try {
              AsyncStorage.removeItem("weekend");
            } catch (error) {
              // Error saving data
            }
          }
        }
      });
    }
  }
}

export function checkRouteDay(route, frequency, getState) {
  let check = false;
  // ovvero in un giorno
  console.log("calcolo delle route in un giorno");

  // inizio route.segment[0].end_time
  // parto da uno dato che ho gia fatto una tratta valida
  let counterSeries = 1;

  const PreviousRoute = getState().tracking.PreviousRoute;

  // calcolo l'inizio del giorno
  console.log(route.segment[route.segment.length - 1].end_time);
  const Now = new Date(route.segment[route.segment.length - 1].end_time);
  const hoursNow = Now.getHours();
  console.log(Now);

  const minutesNow = Now.getMinutes();
  const secondNow = Now.getSeconds();

  const startDay =
    Now.getTime() -
    (hoursNow * 3600000 + minutesNow * 60000 + secondNow * 1000);
  console.log(startDay);

  // prima calcolo sulle route precedenti
  for (route = 1; route <= PreviousRoute.length; route++) {
    // controllo se ho gia fatto piu route, se si interrompo
    if (counterSeries >= frequency) {
      check = true;
      break;
    }
    const Segment = PreviousRoute[route - 1] ? PreviousRoute[route - 1] : null;
    // se il segmento esiste e ancora non è stato completato e senza segment
    if (Segment && !Segment.modal_type && !Segment.isSegment) {
      const NumRoute = Segment.route.length;
      // prendo la data dell'ultima posizione presa, che è presente su route
      const end = Segment.route[NumRoute - 1].time;
      // se è successo in questa settimana
      if (end >= startDay) {
        counterSeries++;
      }
    }
  }
  // se ancora non ho soddisfato
  console.log(counterSeries);
  console.log(
    "controllo le route precedenti per vedere se soddisfa la condizione "
  );
  if (counterSeries < frequency) {
    const SavedRoute = getState().login.Route;
    for (route = 1; route <= SavedRoute.length; route++) {
      if (counterSeries >= frequency) {
        check = true;
        break;
      }
      // prendo la data dalle info del db
      // se esiste
      if (SavedRoute[route - 1]) {
        const end = new Date(SavedRoute[route - 1].end_time).getTime();
        if (end >= startDay) {
          counterSeries++;
        }
      }
    }
  }
  console.log(counterSeries);
  if (counterSeries >= frequency) {
    check = true;
  }
  return check;
}

// calcolare la serie relative alle tratte fatte con un modal type specifico
export function checkRouteSeriesModalType(
  route,
  condition,
  evento,
  getState,
  dispatch
) {
  // quante volte devo effettuare una tratta
  const frequency = evento.event.frequency ? evento.event.frequency : 0;

  if (condition === 1) {
    // ovvero in un giorno
    console.log("calcolo delle route con quella tipologia in un giorno");

    // quante volte devo effettuare una tratta

    retrieveData("modalTypeSeriesDay").then(value => {
      let checkData = updateValueSeriesDay(
        "modalTypeSeriesDay",
        value,
        route.segment[0].end_time,
        frequency
      );
      if (checkData) {
        console.log("verificata " + evento.event.text_description);
        // e poi invio
        const newLevelComplete = {
          event_id: evento.id,
          new_status_events: 1
        };
        console.log(newLevelComplete);
        dispatch(putEvent(newLevelComplete));
      }
    });
  } else if (condition === 4) {
    // ovvero route in fila
    // per quanti giorni
    console.log(
      "controllo le route precedenti per vedere la tipologia in serie"
    );

    retrieveData("modalTypeSeries").then(value => {
      let checkData = updateValueSeriesRow(
        "modalTypeSeries",
        value,
        route.segment[0].end_time,
        frequency
      );
      if (checkData) {
        console.log("verificata " + evento.event.text_description);
        // e poi invio
        const newLevelComplete = {
          event_id: evento.id,
          new_status_events: 1
        };
        console.log(newLevelComplete);
        dispatch(putEvent(newLevelComplete));
      }
    });
  } else if (condition === 2) {
    // ovvero route con quella modalita in una settimana

    console.log("calcolo delle route con quella modalita in una settimana");
    retrieveData("modalTypeSeriesWeek").then(value => {
      checkData = updateValueSeriesWeekend(
        "modalTypeSeriesWeek",
        value,
        route.segment[0].end_time,
        frequency
      );
      if (checkData) {
        console.log("verificata " + evento.event.text_description);
        // e poi invio
        const newLevelComplete = {
          event_id: evento.id,
          new_status_events: 1
        };
        console.log(newLevelComplete);
        dispatch(putEvent(newLevelComplete));
      }
    });
  }
  return false;
}

export function checkPeakHours(route) {
  const timeStart = route.segment[0].route_positions_info[0].time * 1000;

  const end = route.segment[route.segment.length - 1].end_time;

  const start = Date.parse(new Date(timeStart));
  let hour = new Date(start).toTimeString();
  hour = hour.substring(0, 5);
  console.log("inizio per il controllo delle ore di punta");
  console.log(hour);
  // ottengo 11:30

  const last = Date.parse(new Date(end));
  let hourLast = new Date(last).toTimeString();
  hourLast = hourLast.substring(0, 5);
  console.log("fine per il controllo delle ore di punta");
  console.log(hourLast);

  if (hour >= "07:30" && hour <= "09:00") {
    return true;
  } else if (hour >= "17:00" && hour <= "18:30") {
    return true;
  } else if (hourLast >= "07:30" && hourLast <= "09:00") {
    return true;
  } else if (hourLast >= "17:00" && hourLast <= "18:30") {
    return true;
  } else {
    return false;
  }
}

export function checkTripsCounter(route, condition, counter) {
  let check = false;

  // -1 dato la tratta corrente
  if (counter >= condition - 1) {
    return true;
  } else {
    return check;
  }
}

// calcolare la serie relative alle tratte generiche
export function checkRouteSeriesMUV(
  route,
  condition,
  evento,
  getState,
  dispatch
) {
  // quante volte devo effettuare una tratta
  const frequency = evento.event.frequency ? evento.event.frequency : 0;

  if (condition === 1) {
    // ovvero in un giorno
    console.log("calcolo delle route genetiche");

    // quante volte devo effettuare una tratta

    retrieveData("SeriesDayMuv").then(value => {
      let checkData = updateValueSeriesDay(
        "SeriesDayMuv",
        value,
        route.segment[0].end_time,
        frequency
      );
      if (checkData) {
        console.log("verificata " + evento.event.text_description);
        // e poi invio
        const newLevelComplete = {
          event_id: evento.id,
          new_status_events: 1
        };
        console.log(newLevelComplete);
        dispatch(putEvent(newLevelComplete));
      }
    });
  } else if (condition === 2) {
    // ovvero route con quella modalita in una settimana

    console.log("calcolo delle route generiche in una settimana");
    retrieveData("SeriesWeekMUV").then(value => {
      checkData = updateValueSeriesWeekend(
        "SeriesWeekMUV",
        value,
        route.segment[0].end_time,
        frequency
      );
      if (checkData) {
        console.log("verificata " + evento.event.text_description);
        // e poi invio
        const newLevelComplete = {
          event_id: evento.id,
          new_status_events: 1
        };
        console.log(newLevelComplete);
        dispatch(putEvent(newLevelComplete));
      }
    });
  } else if (condition === 4) {
    retrieveData("seriesRowMUV").then(value => {
      let checkData = updateValueSeriesRow(
        "seriesRowMUV",
        value,
        route.segment[0].end_time,
        frequency
      );
      if (checkData) {
        console.log("verificata " + evento.event.text_description);
        // e poi invio
        const newLevelComplete = {
          event_id: evento.id,
          new_status_events: 1
        };
        console.log(newLevelComplete);
        dispatch(putEvent(newLevelComplete));
      }
    });
  }
}

export function checkEvent(
  route,
  weather,
  paramCallback,
  callback,
  saveRouteBackend,
  first,
  interval
) {
  return async function(dispatch, getState) {
    // se valida controllo le condizione
    console.log(route);

    // const weather = "Rain";
    /* const route = {
      validated: true,
      distance_travelled: 0.105,
      calories: 3,
      coins: 0,
      points: 980,
      time_travelled: 50,
      referred_most_freq_route: 10,
      segment: [
        {
          modal_type: 3,
          validated: true,
          distance_travelled: 0.105,
          calories: 3,
          coins: 0,
          points: 980,
          time_travelled: 50,
          route:
            "LINESTRING (-122.02998145 37.3306482 0, -122.03052857 37.33081444 0, -122.03066271 37.33127588 0)",
          route_positions_info: [
            {
              pos_index: 0,
              time: 1542230000,
              modality: "Walking",
              speed: 3.61,
              calories: 3
            },
            {
              pos_index: 1,
              time: 1542206772,
              modality: "Walking",
              speed: 3.43,
              calories: 3
            },
            {
              pos_index: 1,
              time: 1542206787,
              modality: "Walking",
              speed: 3.26,
              calories: 3
            }
          ],
          end_time: "2018-11-18T22:46:27.092Z"
        }
      ]
    }; */

    // valido e ci deve essere almeno un segmento

    console.log("controllo gli eventi");
    if (route.validated && route.segment.length) {
      // prendo gli eventi disponibili e vedo se soddisfano le varie condizione
      let { training_events } = getState().trainings;
      // per ogni evento
      for (i = 0; i < training_events.length; i++) {
        let condition = 0;
        const evento = training_events[i];
        console.log("tratta da inviare");
        console.log(JSON.stringify(route));

        // const quiz = evento.event.quiz ? true : false; && !quiz
        // se non è stato completato
        // se non è un quiz o un survey
        try {
          if (
            evento.status === 0 &&
            !evento.event.quiz &&
            !evento.event.survey
          ) {
            // devono essere tutti true per essere vero altrimenti per alcuni parametri salvo alcune informazioni ed è null
            let check = false;

            console.log("controllo evento");
            console.log(evento);
            if ((condition = evento.event.modal_type)) {
              check = checkModalType(route, condition);
              // se è la stessa tipologia allora va avanti altrimenti
              // considera un altro evento
              if (check) {
              } else {
                // considero il nuovo evento
                continue;
              }
            }
            if ((condition = evento.event.is_mfr)) {
              // mfr, se c'e allora è una most frequest trip

              check = checkFrequentTripEvent(route);
              if (check) {
              } else {
                // considero il nuovo evento
                continue;
              }
            }
            // ci sono i punti ovvero una singola tratta e non in un periodo specifico quindi non ci deve essere period e timeslot
            if (
              (condition = evento.event.points) &&
              !evento.event.period &&
              !evento.event.time_slot
            ) {
              check = checkPoints(route, condition);
              if (check) {
              } else {
                // considero il nuovo evento
                continue;
              }
            }
            // se in un giorno particolare, con 7 è qualsiasi giorno
            if ((condition = evento.event.day) !== 7) {
              check = checkDay(route, condition);
              if (check) {
              } else {
                // considero il nuovo evento
                continue;
              }
            }
            if ((condition = evento.event.weather)) {
              // meteo
              check = checkWeather(weather, condition);
              if (check) {
              } else {
                // considero il nuovo evento
                continue;
              }
            }
            if ((condition = evento.event.time_slot)) {
              if (condition === "48H") {
                check = false;
                dispatch(
                  checkTimeSlot48(route, condition, evento, getState, dispatch)
                );
              } else if (condition === "peak") {
                check = checkPeakHours(route);
                if (check) {
                } else {
                  // considero il nuovo evento
                  continue;
                }
              } else {
                check = checkTimeSlot(route, condition);
                if (check) {
                } else {
                  // considero il nuovo evento
                  continue;
                }
              }
            }

            console.log("controllo se ho ripetizioni da fare ");

            // non ha periodo ma ha la frequenza ovvero li posso soddisfare in qualsiasi periodo
            if (!evento.event.period && (condition = evento.event.frequency)) {
              console.log("ho ripetizioni ");
              check = false;
              if (evento.event.weather) {
                // sequenza di tratte con meteo
                // se sono gia qui il meteo è soddisfa
                let checkData = false;
                console.log(
                  "calcolo delle route con brutto tempo in un periodo qualsiasi "
                );
                retrieveData("weatherCounter").then(value => {
                  checkData = updateValueSeriesCounter(
                    "weatherCounter",
                    value,
                    route.segment[0].end_time,
                    condition
                  );
                  if (checkData) {
                    console.log("verificata " + evento.event.text_description);
                    // e poi invio
                    const newLevelComplete = {
                      event_id: evento.id,
                      new_status_events: 1
                    };
                    console.log(newLevelComplete);
                    dispatch(putEvent(newLevelComplete));
                  }
                });
              } else if (evento.event.modal_type) {
                // sequenza di tratte con un modal type specifico

                let checkData = false;
                console.log(
                  "calcolo delle route con un particolare modal type in un periodo qualsiasi "
                );
                retrieveData("typeCounter").then(value => {
                  checkData = updateValueSeriesCounter(
                    "typeCounter",
                    value,
                    route.segment[0].end_time,
                    condition
                  );
                  if (checkData) {
                    console.log("verificata " + evento.event.text_description);
                    // e poi invio
                    const newLevelComplete = {
                      event_id: evento.id,
                      new_status_events: 1
                    };
                    console.log(newLevelComplete);
                    dispatch(putEvent(newLevelComplete));
                  }
                });
              } else if (evento.event.time_slot === "peak") {
                // sequenza di tratte con orario di punta
                // se sono gia qui l'orario è soddisfato
                let checkData = false;
                console.log(
                  "calcolo delle route con orario di punta in un periodo qualsiasi "
                );
                retrieveData("peakCounter").then(value => {
                  checkData = updateValueSeriesCounter(
                    "peakCounter",
                    value,
                    route.segment[0].end_time,
                    condition
                  );
                  if (checkData) {
                    console.log("verificata " + evento.event.text_description);
                    // e poi invio
                    const newLevelComplete = {
                      event_id: evento.id,
                      new_status_events: 1
                    };
                    console.log(newLevelComplete);
                    dispatch(putEvent(newLevelComplete));
                  }
                });
              } else {
                // ovvero un numero di tratte effettuate in qualsiasi periodo
                check = checkTripsCounter(route, condition, getState);
                if (check) {
                  console.log("verificata " + evento.event.text_description);
                  // e poi invio
                  const newLevelComplete = {
                    event_id: evento.id,
                    new_status_events: 1
                  };
                  console.log(newLevelComplete);
                  dispatch(putEvent(newLevelComplete));
                } else {
                  // considero il nuovo evento
                  continue;
                }
                check = false;
              }
            }

            // ulteriore controllo sul periodo e frequency, time_slot
            if ((condition = evento.event.period)) {
              // c'e questa condizione quindi controllo
              check = false;
              if (evento.event.is_mfr) {
                dispatch(
                  checkFrequentTripPeriod(
                    route,
                    condition,
                    evento,
                    getState,
                    dispatch
                  )
                );
              } else if (evento.event.points) {
                // quanti punti devo raggiungere
                const points = evento.event.points;

                // sedevo fare dei punti in un certo intervallo tipo una settimana
                if (condition === 1) {
                  // in un giorno

                  check = checkPointsDay(route, points, getState);
                } else if (condition === 2) {
                  // in una settimana
                  dispatch(
                    checkPointsWeek(route, points, evento, getState, dispatch)
                  );
                } else if (condition === 5) {
                  // in un mese
                  dispatch(
                    checkPointsMonth(route, points, evento, getState, dispatch)
                  );
                }
              } else if (evento.event.weather) {
                dispatch(
                  checkWeatherPeriod(
                    route,
                    condition,
                    evento,
                    getState,
                    dispatch
                  )
                );
              } else if (evento.event.modal_type) {
                // sequenza di tratte fatte con una tipologia precisa
                // se sono gia qui il la condizione è soddisfa

                dispatch(
                  checkRouteSeriesModalType(
                    route,
                    condition,
                    evento,
                    getState,
                    dispatch
                  )
                );
              } else {
                // serie senza condizioni che deve soddisfare nel periodo
                if (condition === 3) {
                  check = checkRouteWeekend(route);
                  if (check) {
                    // controllo se deve essere effettuata in entrambi i giorni ovvero una sabato e una domenica
                    let frequency = false;
                    if ((frequency = evento.event.frequency)) {
                      check = false;
                      dispatch(
                        checkRouteRepeatWeekend(
                          route,
                          condition,
                          evento,
                          getState,
                          dispatch
                        )
                      );
                    }
                  } else {
                    // considero il nuovo evento
                    continue;
                  }
                } else {
                  console.log(
                    "controllo le route precedenti per vedere se c'e una serie di fila"
                  );

                  dispatch(
                    checkRouteSeriesMUV(
                      route,
                      condition,
                      evento,
                      getState,
                      dispatch
                    )
                  );

                  check = false;
                }
              }
            }

            console.log("primo controllo");
            console.log(check);
            if (check) {
              console.log("verificata " + evento.event.text_description);
              // e poi invio
              const newLevelComplete = {
                event_id: evento.id,
                new_status_events: 1
              };
              console.log(newLevelComplete);
              dispatch(putEvent(newLevelComplete));
            }
          }
        } catch (error) {
          // console.log(error);

          bugsnag.notify(error);
        }
      }
    }

    // dopo che ha controllato gli eventi la manda al db

    setTimeout(
      () =>
        dispatch(
          saveRouteBackend({
            data: route,
            start: first,
            numsegment: interval,
            paramCallback,
            callback
          })
        ),
      Platform.OS === "android" ? 300 : 0
    );
  };
}

export function setNewStPivots(pivots) {
  return async function(dispatch) {
    dispatch({
      type: SET_NEW_ST_PIVOTS,
      payload: pivots
    });
  };
}

export async function startCompletedStPivots() {
  return async function(dispatch) {
    dispatch({
      type: SET_COMPLETED_ST_PIVOTS,
      payload: {}
    });
  };
}

export async function setCompletedStPivots(pivots, dispatch) {
  dispatch({
    type: SET_COMPLETED_ST_PIVOTS,
    payload: {
      text_description: pivots.text_description,
      updated_at: new Date()
    }
  });
}

export function updateStatusCheckEvents(typeEvent, valueEvent) {
  return async function(dispatch) {
    dispatch({
      type: UPDATE_COUNTER_EVENT,
      typeEvent,
      valueEvent
    });
  };
}

export function updateStatusSTCheckEvents(typeEvent, valueEvent) {
  return async function(dispatch) {
    dispatch({
      type: UPDATE_COUNTER_EVENT,
      typeEvent,
      valueEvent
    });
  };
}

export function checkEventRedux(
  route,
  weather,
  paramCallback,
  callback,
  saveRouteBackend,
  first,
  interval
) {
  return async function(dispatch, getState) {
    /* const weather = "Rain";
    const route = {
      validated: true,
      distance_travelled: 0.105,
      calories: 3,
      coins: 0,
      points: 100,
      time_travelled: 50,
      referred_most_freq_route: 11,
      segment: [
        {
          modal_type: 1,
          validated: true,
          distance_travelled: 0.105,
          calories: 3,
          coins: 0,
          points: 510,
          time_travelled: 50,
          route:
            "LINESTRING (-122.02998145 37.3306482 0, -122.03052857 37.33081444 0, -122.03066271 37.33127588 0)",
          route_positions_info: [
            {
              pos_index: 0,
              time: 1542259015,
              modality: "Walking",
              speed: 3.61,
              calories: 3
            },
            {
              pos_index: 1,
              time: 1542206772,
              modality: "Walking",
              speed: 3.43,
              calories: 3
            },
            {
              pos_index: 1,
              time: 1542206787,
              modality: "Walking",
              speed: 3.26,
              calories: 3
            }
          ],
          end_time: "2019-06-30T11:50:27.092Z"
        }
      ]
    }; */
    if (route.validated && route.segment.length) {
      // prendo gli eventi disponibili e vedo se soddisfano le varie condizione
      let { training_events } = getState().trainings;
      // per ogni evento
      console.log(training_events);
      try {
        training_events.forEach(function(evento) {
          console.log(evento);

          if (
            evento.status === 0 &&
            !evento.event.quiz &&
            !evento.event.survey
          ) {
            const nameEvent = evento.event.text_description;
            // per attivare l'evento
            let check = false;
            // se c'e qualche dato nel checkevents da cancellare
            let typeCheckCompleted = false;
            let condition = 0;
            const statusCheckEvents = getState().trainings.statusCheckEvents
              ? getState().trainings.statusCheckEvents
              : {};

            switch (nameEvent) {
              case "Move once by walking or biking":
                check = checkModalTypeDispatch(route, evento);
                break;
              case "Do a trip of at least 400 points":
                check = checkPointsDispatch(route, evento);
                break;
              case "Do a trip during the weekend (Saturday or Sunday)":
                check = checkWeekendEvent(route, evento);
                break;
              case "Do a routinary trip":
                check = checkFrequentTripEvent(route);
                break;
              case "Do at least two trips in a single day":
                const RoutesInDay = statusCheckEvents.RoutesInDay
                  ? statusCheckEvents.RoutesInDay
                  : { date: 0, counter: 0 };
                const newRoutesInDay = checkCounterRouteInDayEvent(
                  RoutesInDay,
                  route.segment[0].end_time
                );
                dispatch(
                  updateStatusCheckEvents("RoutesInDay", newRoutesInDay)
                );
                condition = evento.event.frequency ? evento.event.frequency : 0;
                if (newRoutesInDay.counter >= condition) {
                  check = true;
                  typeCheckCompleted = "RoutesInDay";
                }
                break;

              case "MUV three days in a row":
                const RoutesSeries = statusCheckEvents.RoutesSeries
                  ? statusCheckEvents.RoutesSeries
                  : { date: 0, counter: 0 };
                const newRoutesSeries = checkCounterRouteInSeriesEvent(
                  RoutesSeries,
                  route.segment[0].end_time
                );
                dispatch(
                  updateStatusCheckEvents("RoutesSeries", newRoutesSeries)
                );
                condition = evento.event.frequency ? evento.event.frequency : 0;
                if (newRoutesSeries.counter >= condition) {
                  check = true;
                  typeCheckCompleted = "RoutesSeries";
                }
                break;

              case "Do a trip by night (after 21:00)":
                // check = checkFrequentTripEvent(route, evento);
                check = checkTimeSlot(route, evento.event.time_slot);
                break;
              case "Score at least 1.000 points in a single day":
                // PointsInDay
                const PointsInDay = statusCheckEvents.PointsInDay
                  ? statusCheckEvents.PointsInDay
                  : { date: 0, counter: 0 };

                // calcolo i punti totali dei vari segment
                // period deve essere diverso da zero perche altrimenti è un calcolo relativo a un periodo e non una singola route
                const totPoints = route.segment.reduce(
                  (total, elem) => total + elem.points,
                  0
                );
                const newPointsInDay = checkCounterPointsInDayEvent(
                  PointsInDay,
                  route.segment[0].end_time,
                  totPoints
                );

                dispatch(
                  updateStatusCheckEvents("PointsInDay", newPointsInDay)
                );
                condition = evento.event.points ? evento.event.points : 0;
                if (newPointsInDay.counter >= condition) {
                  check = true;
                  typeCheckCompleted = "PointsInDay";
                }
                break;

              case "Do a routinary trip three days in a row":
                check = checkFrequentTripEvent(route);
                if (check) {
                  check = false;
                  const RoutinarySeries = statusCheckEvents.RoutinarySeries
                    ? statusCheckEvents.RoutinarySeries
                    : { date: 0, counter: 0 };
                  const newRoutinarySeries = checkCounterRouteInSeriesEvent(
                    RoutinarySeries,
                    route.segment[0].end_time
                  );
                  dispatch(
                    updateStatusCheckEvents(
                      "RoutinarySeries",
                      newRoutinarySeries
                    )
                  );
                  condition = evento.event.frequency
                    ? evento.event.frequency
                    : 0;
                  if (newRoutinarySeries.counter >= condition) {
                    check = true;
                    typeCheckCompleted = "RoutinarySeries";
                  }
                }
                break;

              case "Score at least 4.000 points per week":
                // PointsInDay
                const PointsInWeek = statusCheckEvents.PointsInWeek
                  ? statusCheckEvents.PointsInWeek
                  : { date: 0, counter: 0 };

                // calcolo i punti totali dei vari segment
                // period deve essere diverso da zero perche altrimenti è un calcolo relativo a un periodo e non una singola route
                const totPoint = route.segment.reduce(
                  (total, elem) => total + elem.points,
                  0
                );
                const newPointsInWeek = checkCounterPointsInWeekEvent(
                  PointsInWeek,
                  route.segment[0].end_time,
                  totPoint
                );

                dispatch(
                  updateStatusCheckEvents("PointsInWeek", newPointsInWeek)
                );
                condition = evento.event.points ? evento.event.points : 0;
                if (newPointsInWeek.counter >= condition) {
                  check = true;
                  typeCheckCompleted = "PointsInWeek";
                }
                break;

              case "Do a trip in bad weather conditions":
                condition = evento.event.weather;
                check = checkWeather(weather, condition);
                break;

              case "MUV five days in a row":
                const RoutesWeekSeries = statusCheckEvents.RoutesSeries
                  ? statusCheckEvents.RoutesSeries
                  : { date: 0, counter: 0 };
                const newRoutesWeekSeries = checkCounterRouteInSeriesEvent(
                  RoutesWeekSeries,
                  route.segment[0].end_time
                );
                dispatch(
                  updateStatusCheckEvents("RoutesSeries", newRoutesWeekSeries)
                );
                condition = evento.event.frequency ? evento.event.frequency : 0;
                if (newRoutesWeekSeries.counter >= condition) {
                  check = true;
                  typeCheckCompleted = "RoutesSeries";
                }
                break;

              case "Move once by public transport or carpooling":
                check = checkModalTypeDispatch(route, evento);
                break;

              case "Score at least 2000 points in a 48-hour timeframe":
                // punti nelle ultime 48 ore
                const PointsIn48 = statusCheckEvents.PointsIn48
                  ? statusCheckEvents.PointsIn48
                  : { date: 0, counter: 0, array: [] };

                // calcolo i punti totali dei vari segment
                // period deve essere diverso da zero perche altrimenti è un calcolo relativo a un periodo e non una singola route
                const PointsNow = route.segment.reduce(
                  (total, elem) => total + elem.points,
                  0
                );
                const newPointsIn48 = checkCounterPointsIn48Event(
                  PointsIn48,
                  route.segment[0].end_time,
                  PointsNow
                );

                dispatch(updateStatusCheckEvents("PointsIn48", newPointsIn48));
                condition = evento.event.points ? evento.event.points : 0;
                if (newPointsIn48.counter >= condition) {
                  check = true;
                  typeCheckCompleted = "PointsIn48";
                }
                break;

              case "Do two trips during the weekend (one on Saturday and one on Sunday)":
                check = checkWeekendEvent(route, evento);
                if (check) {
                  check = false;
                  const checkDoubleWeekend = statusCheckEvents.checkDoubleWeekend
                    ? statusCheckEvents.checkDoubleWeekend
                    : { date: 0, counter: 0 };
                  const newcheckDoubleWeekend = checkCounterRouteInSeriesEvent(
                    checkDoubleWeekend,
                    route.segment[0].end_time
                  );
                  dispatch(
                    updateStatusCheckEvents(
                      "checkDoubleWeekend",
                      newcheckDoubleWeekend
                    )
                  );
                  // ovvero serie di sabato e domenica
                  condition = 2;
                  if (newcheckDoubleWeekend.counter >= condition) {
                    check = true;
                    typeCheckCompleted = "checkDoubleWeekend";
                  }
                }
                break;

              case "Do a routinary trip five days in a row":
                check = checkFrequentTripEvent(route);
                if (check) {
                  check = false;
                  const RoutinarySeries5 = statusCheckEvents.RoutinarySeries
                    ? statusCheckEvents.RoutinarySeries
                    : { date: 0, counter: 0 };
                  const newRoutinarySeries5 = checkCounterRouteInSeriesEvent(
                    RoutinarySeries5,
                    route.segment[0].end_time
                  );
                  dispatch(
                    updateStatusCheckEvents(
                      "RoutinarySeries",
                      newRoutinarySeries5
                    )
                  );
                  condition = evento.event.frequency
                    ? evento.event.frequency
                    : 0;
                  if (newRoutinarySeries5.counter >= condition) {
                    check = true;
                    typeCheckCompleted = "RoutinarySeries";
                  }
                }
                break;

              case "Do at least one routinary trip a day for three days in a row":
                check = checkFrequentTripEvent(route);
                if (check) {
                  check = false;
                  const RoutinarySeries3 = statusCheckEvents.RoutinarySeries
                    ? statusCheckEvents.RoutinarySeries
                    : { date: 0, counter: 0 };
                  const newRoutinarySeries3 = checkCounterRouteInSeriesEvent(
                    RoutinarySeries3,
                    route.segment[0].end_time
                  );
                  dispatch(
                    updateStatusCheckEvents(
                      "RoutinarySeries",
                      newRoutinarySeries3
                    )
                  );
                  condition = evento.event.frequency
                    ? evento.event.frequency
                    : 0;
                  if (newRoutinarySeries3.counter >= condition) {
                    check = true;
                    typeCheckCompleted = "RoutinarySeries";
                  }
                }
                break;

              case "Do two different routinary trips in a single day":
                check = checkFrequentTripEvent(route);
                if (check) {
                  check = false;
                  const RoutinaryDifferentInDay = statusCheckEvents.RoutinaryDifferentInDay
                    ? statusCheckEvents.RoutinaryDifferentInDay
                    : { date: 0, counter: 0, array: [] };
                  const newRoutinaryDifferentInDay = checkCounterRoutinaryDifferentInDayEvent(
                    RoutinaryDifferentInDay,
                    route.segment[0].end_time,
                    route.referred_most_freq_route
                  );
                  dispatch(
                    updateStatusCheckEvents(
                      "RoutinaryDifferentInDay",
                      newRoutinaryDifferentInDay
                    )
                  );
                  condition = evento.event.frequency
                    ? evento.event.frequency
                    : 0;
                  if (newRoutinaryDifferentInDay.counter >= condition) {
                    check = true;
                    typeCheckCompleted = "RoutinaryDifferentInDay";
                  }
                }
                break;

              case "Do at least ten trips in a week":
                const TenRoutesInWeek = statusCheckEvents.RoutesInWeek
                  ? statusCheckEvents.RoutesInWeek
                  : { date: 0, counter: 0 };
                const newTenRoutesInWeek = checkCounterRouteInWeekEvent(
                  TenRoutesInWeek,
                  route.segment[0].end_time
                );
                dispatch(
                  updateStatusCheckEvents("RoutesInWeek", newTenRoutesInWeek)
                );
                condition = evento.event.frequency ? evento.event.frequency : 0;
                if (newTenRoutesInWeek.counter >= condition) {
                  check = true;
                  typeCheckCompleted = "RoutesInWeek";
                }

                break;

              case "Complete three trips in bad weather conditions":
                condition = evento.event.weather;
                check = checkWeather(weather, condition);
                if (check) {
                  check = false;
                  const WeatherCounter = statusCheckEvents.WeatherCounter
                    ? statusCheckEvents.WeatherCounter
                    : { date: 0, counter: 0 };
                  const newWeatherCounter = checkCounterEvent(
                    WeatherCounter,
                    route.segment[0].end_time
                  );
                  dispatch(
                    updateStatusCheckEvents("WeatherCounter", newWeatherCounter)
                  );
                  condition = evento.event.frequency
                    ? evento.event.frequency
                    : 0;
                  if (newWeatherCounter.counter >= condition) {
                    check = true;
                    typeCheckCompleted = "WeatherCounter";
                  }
                }
                break;

              case "MUV seven days in a row":
                const RoutesSeries7 = statusCheckEvents.RoutesSeries
                  ? statusCheckEvents.RoutesSeries
                  : { date: 0, counter: 0 };
                const newRoutesSeries7 = checkCounterRouteInSeriesEvent(
                  RoutesSeries7,
                  route.segment[0].end_time
                );
                dispatch(
                  updateStatusCheckEvents("RoutesSeries", newRoutesSeries7)
                );
                condition = evento.event.frequency ? evento.event.frequency : 0;
                if (newRoutesSeries7.counter >= condition) {
                  check = true;
                  typeCheckCompleted = "RoutesSeries";
                }
                break;

              case "Do a trip in the early morning (from 06:00 to 07:30)":
                check = checkTimeSlot(route, evento.event.time_slot);
                break;

              case "Do two trips during peak hours":
                check = checkPeakHours(route);
                if (check) {
                  check = false;
                  const PeakHoursCounter = statusCheckEvents.PeakHoursCounter
                    ? statusCheckEvents.PeakHoursCounter
                    : { date: 0, counter: 0 };
                  const newPeakHoursCounter = checkCounterEvent(
                    PeakHoursCounter,
                    route.segment[0].end_time
                  );
                  dispatch(
                    updateStatusCheckEvents(
                      "PeakHoursCounter",
                      newPeakHoursCounter
                    )
                  );
                  condition = evento.event.frequency
                    ? evento.event.frequency
                    : 0;
                  if (newPeakHoursCounter.counter >= condition) {
                    check = true;
                    typeCheckCompleted = "PeakHoursCounter";
                  }
                }
                break;

              case "Do at least 10 walking trips in one week":
                check = checkModalTypeDispatch(route, evento);
                if (check) {
                  check = false;
                  const WalkingTenRoutesInWeek = statusCheckEvents.WalkingTenRoutesInWeek
                    ? statusCheckEvents.WalkingTenRoutesInWeek
                    : { date: 0, counter: 0 };
                  const newWalkingTenRoutesInWeek = checkCounterRouteInWeekEvent(
                    WalkingTenRoutesInWeek,
                    route.segment[0].end_time
                  );
                  dispatch(
                    updateStatusCheckEvents(
                      "WalkingTenRoutesInWeek",
                      newWalkingTenRoutesInWeek
                    )
                  );
                  condition = evento.event.frequency
                    ? evento.event.frequency
                    : 0;
                  if (newWalkingTenRoutesInWeek.counter >= condition) {
                    check = true;
                    typeCheckCompleted = "WalkingTenRoutesInWeek";
                  }
                }
                break;

              case "Score at least 12.000 points in one month":
                // punti nel mese corrente
                const PointsInMonth = statusCheckEvents.PointsInMonth
                  ? statusCheckEvents.PointsInMonth
                  : { date: 0, counter: 0 };

                // calcolo i punti totali dei vari segment
                // period deve essere diverso da zero perche altrimenti è un calcolo relativo a un periodo e non una singola route
                const PointsRoute = route.segment.reduce(
                  (total, elem) => total + elem.points,
                  0
                );
                const newPointsInMonth = checkCounterPointsInMonthEvent(
                  PointsInMonth,
                  route.segment[0].end_time,
                  PointsRoute
                );

                dispatch(
                  updateStatusCheckEvents("PointsInMonth", newPointsInMonth)
                );
                condition = evento.event.points ? evento.event.points : 0;
                if (newPointsInMonth.counter >= condition) {
                  check = true;
                  typeCheckCompleted = "PointsInMonth";
                }

                break;

              case "Do 100 trips":
                // prendo dalla memoria e dal db il numero di tratte effettuate in totale
                const counter = getState().statistics.n_routes
                  ? getState().statistics.n_routes
                  : 0;
                console.log(counter);

                const Now = new Date(route.segment[0].end_time);
                const millisecond = Now.getTime();
                const counterNew = { date: millisecond, counter: counter };
                dispatch(updateStatusCheckEvents("RoutesCounter", counterNew));
                condition = evento.event.frequency ? evento.event.frequency : 0;
                if (counter >= condition - 1) {
                  check = true;
                  typeCheckCompleted = "RoutesCounter";
                }
                break;

              case "MUV ten days in a row":
                const RoutesSeries10 = statusCheckEvents.RoutesSeries
                  ? statusCheckEvents.RoutesSeries
                  : { date: 0, counter: 0 };
                const newRoutesSeries10 = checkCounterRouteInSeriesEvent(
                  RoutesSeries10,
                  route.segment[0].end_time
                );
                dispatch(
                  updateStatusCheckEvents("RoutesSeries", newRoutesSeries10)
                );
                condition = evento.event.frequency ? evento.event.frequency : 0;
                if (newRoutesSeries10.counter >= condition) {
                  check = true;
                  typeCheckCompleted = "RoutesSeries";
                }
                break;

              case "Do at least three trips in a week":
                const threeRoutesInWeek = statusCheckEvents.RoutesInWeek
                  ? statusCheckEvents.RoutesInWeek
                  : { date: 0, counter: 0 };
                const newThreeRoutesInWeek = checkCounterRouteInWeekEvent(
                  threeRoutesInWeek,
                  route.segment[0].end_time
                );
                dispatch(
                  updateStatusCheckEvents("RoutesInWeek", newThreeRoutesInWeek)
                );
                let condition = evento.event.frequency
                  ? evento.event.frequency
                  : 0;
                if (newThreeRoutesInWeek.counter >= condition) {
                  check = true;
                  typeCheckCompleted = "RoutesInWeek";
                }
                break;

              case "Do a routinary trip twice in a day":
                check = checkFrequentTripEvent(route);
                if (check) {
                  check = false;
                  const routinaryInDay = statusCheckEvents.RoutinaryInDay
                    ? statusCheckEvents.RoutinaryInDay
                    : { date: 0, counter: 0 };
                  const newRoutinaryInDay = checkCounterRouteInDayEvent(
                    routinaryInDay,
                    route.segment[0].end_time
                  );
                  dispatch(
                    updateStatusCheckEvents("RoutinaryInDay", newRoutinaryInDay)
                  );
                  condition = evento.event.frequency
                    ? evento.event.frequency
                    : 0;
                  if (newRoutinaryInDay.counter >= condition) {
                    check = true;
                    typeCheckCompleted = "RoutinaryInDay";
                  }
                }
                break;

              case "Move once by public transport or carpooling":
                check = checkModalTypeDispatch(route, evento);
                break;
              case "Do at least two routinary trips each day for five days in a row":
                // livello pro

                check = checkFrequentTripEvent(route);
                if (check) {
                  check = false;
                  const MoreRoutinaryInRow = statusCheckEvents.MoreRoutinaryInRow
                    ? statusCheckEvents.MoreRoutinaryInRow
                    : { date: 0, counter: 0, counterDays: 0 };
                  const limitDay = 2;
                  const newMoreRoutinaryInRow = checkCounterMoreRouteInDayInSeriesEvent(
                    MoreRoutinaryInRow,
                    route.segment[0].end_time,
                    limitDay
                  );

                  dispatch(
                    updateStatusCheckEvents(
                      "MoreRoutinaryInRow",
                      newMoreRoutinaryInRow
                    )
                  );
                  const condition = 5;
                  if (newMoreRoutinaryInRow.counterDays >= condition) {
                    check = true;
                    typeCheckCompleted = "MoreRoutinaryInRow";
                  }
                }
                break;
              case "Score at least 5000 points in a week ":
                const Points5000InWeek = statusCheckEvents.PointsInWeek
                  ? statusCheckEvents.PointsInWeek
                  : { date: 0, counter: 0 };

                // calcolo i punti totali dei vari segment
                // period deve essere diverso da zero perche altrimenti è un calcolo relativo a un periodo e non una singola route
                const tot5000Point = route.segment.reduce(
                  (total, elem) => total + elem.points,
                  0
                );
                const newPoints5000InWeek = checkCounterPointsInWeekEvent(
                  Points5000InWeek,
                  route.segment[0].end_time,
                  tot5000Point
                );

                dispatch(
                  updateStatusCheckEvents("PointsInWeek", newPoints5000InWeek)
                );

                if (newPoints5000InWeek.counter >= 5000) {
                  check = true;
                  typeCheckCompleted = "PointsInWeek";
                }
                break;

              case "Do at least one trip during the weekend for four weeks in a row":
                check = checkWeekendEvent(route);
                if (check) {
                  check = false;
                  const CounterRouteInWeekendSeries = statusCheckEvents.CounterRouteInWeekendSeries
                    ? statusCheckEvents.CounterRouteInWeekendSeries
                    : { date: 0, counter: 0 };
                  const newCounterRouteInWeekendSeries = checkCounterRouteInWeekendSeriesEvent(
                    CounterRouteInWeekendSeries,
                    route.segment[0].end_time
                  );
                  dispatch(
                    updateStatusCheckEvents(
                      "CounterRouteInWeekendSeries",
                      newCounterRouteInWeekendSeries
                    )
                  );
                  // ovvero serie di sabato e domenica
                  if (newCounterRouteInWeekendSeries.counter >= 4) {
                    check = true;
                    typeCheckCompleted = "CounterRouteInWeekendSeries";
                  }
                }
                break;
              case "Do twenty routinary trip by walking or biking":
                check = checkModalTypeDispatch(route, evento);
                if (check) {
                  check = false;
                  const RoutesCounter = statusCheckEvents.RoutesCounter
                    ? statusCheckEvents.RoutesCounter
                    : { date: 0, counter: 0 };
                  const newRoutesCounter = checkCounterEvent(
                    RoutesCounter,
                    route.segment[0].end_time
                  );
                  dispatch(
                    updateStatusCheckEvents("RoutesCounter", newRoutesCounter)
                  );
                  if (newRoutesCounter.counter >= 20) {
                    check = true;
                    typeCheckCompleted = "RoutesCounter";
                  }
                }
                break;
              case "MUV at least two days a week for four weeks in row":
                const RouteForDayInWeekInSeries = statusCheckEvents.RouteForDayInWeekInSeries
                  ? statusCheckEvents.RouteForDayInWeekInSeries
                  : { date: 0, counter: 0, counterWeeks: 0 };
                const limitDay = 2;
                const newRouteForDayInWeekInSeries = checkCounterRouteForDayInWeekInSeriesEvent(
                  RouteForDayInWeekInSeries,
                  route.segment[0].end_time,
                  limitDay
                );

                dispatch(
                  updateStatusCheckEvents(
                    "RouteForDayInWeekInSeries",
                    newRouteForDayInWeekInSeries
                  )
                );
                if (newRouteForDayInWeekInSeries.counterWeeks >= 4) {
                  check = true;
                  typeCheckCompleted = "RouteForDayInWeekInSeries";
                }

                break;
              case "Do 300 trips":
                // prendo dalla memoria e dal db il numero di tratte effettuate in totale
                const counter300 = getState().statistics.n_routes
                  ? getState().statistics.n_routes
                  : 0;
                console.log(counter300);

                const Now3000 = new Date(route.segment[0].end_time);
                const millisecond3000 = Now3000.getTime();
                const counterNew3000 = {
                  date: millisecond3000,
                  counter: counter3000
                };
                dispatch(
                  updateStatusCheckEvents("RoutesCounter", counterNew3000)
                );
                condition = 300 - 1;
                if (counter300 >= condition) {
                  check = true;
                  typeCheckCompleted = "RoutesCounter";
                }
                break;
              case "Complete twenty trips during peak hours":
                check = checkPeakHours(route);
                if (check) {
                  check = false;
                  const PeakHoursCounter20 = statusCheckEvents.PeakHoursCounter
                    ? statusCheckEvents.PeakHoursCounter
                    : { date: 0, counter: 0 };
                  const newPeakHoursCounter20 = checkCounterEvent(
                    PeakHoursCounter20,
                    route.segment[0].end_time
                  );
                  dispatch(
                    updateStatusCheckEvents(
                      "PeakHoursCounter",
                      newPeakHoursCounter20
                    )
                  );
                  condition = 20;
                  if (newPeakHoursCounter.counter >= condition) {
                    check = true;
                    typeCheckCompleted = "PeakHoursCounter";
                  }
                }
                break;
              case "Do ten trips during the weekend":
                check = checkWeekendEvent(route);
                if (check) {
                  check = false;
                  const RouteInWeekCounter10 = statusCheckEvents.RouteInWeekCounter
                    ? statusCheckEvents.RouteInWeekCounter
                    : { date: 0, counter: 0 };
                  const newRouteInWeekCounter10 = checkCounterEvent(
                    RouteInWeekCounter10,
                    route.segment[0].end_time
                  );
                  dispatch(
                    updateStatusCheckEvents(
                      "RouteInWeekCounter",
                      newRouteInWeekCounter10
                    )
                  );
                  condition = 10;
                  if (newRouteInWeekCounter10.counter >= condition) {
                    check = true;
                    typeCheckCompleted = "RouteInWeekCounter";
                  }
                }
                break;
              case "Do twenty trips by public transport":
                // counter classico
                check = checkModalTypeDispatch(route, evento);
                if (check) {
                  check = false;
                  const PublicRouteCounter20 = statusCheckEvents.PublicRouteCounter
                    ? statusCheckEvents.PublicRouteCounter
                    : { date: 0, counter: 0 };
                  const newPublicRouteCounter20 = checkCounterEvent(
                    PublicRouteCounter20,
                    route.segment[0].end_time
                  );
                  dispatch(
                    updateStatusCheckEvents(
                      "PublicRouteCounter",
                      newPublicRouteCounter20
                    )
                  );
                  condition = 20;
                  if (newPublicRouteCounter20.counter >= condition) {
                    check = true;
                    typeCheckCompleted = "PublicRouteCounter";
                  }
                }
                break;

              /*
              // se conto le tratte complessive, ma Manuel non mi ritorna le tratte fatte in una specifica modalità 
              // prendo dalla memoria e dal db il numero di tratte effettuate in totale
              check = checkModalTypeDispatch(route, evento);
              if (check) {
                check = false;
                const statistics = getState().statistics.statistics
                  ? getState().statistics.statistics
                  : []
                
                let publicCounter = 0;
                if (statistics.length > 0) {
                  statistics.forEach((element, index) => {
                    // con checkPublic considero anche le tratte in metro/ bus e treno come public generico 
                    switch (checkPublic(element.modal_type)) {
                      case 3:
                          publicCounter = statistics[index]
                          ? statistics[index]
    
                          : 0;
                        break;
                    }
                  }


                    const Now3000 = new Date(route.segment[0].end_time);
                    const millisecond3000 = Now3000.getTime();
                    const counterNew3000 = { date: millisecond3000, counter: counter3000 };
                    dispatch(updateStatusCheckEvents("RoutesCounter", counterNew3000));
                    condition = 300 - 1;
                    if (counter300 >= condition) {
                      check = true;
                      typeCheckCompleted = "RoutesCounter";
                    }
                  }
              break;             
              */
              case "Score at least 4000 points for three weeks in a row":
                const PointsInWeekInSeries4000 = statusCheckEvents.PointsInWeekInSeries
                  ? statusCheckEvents.PointsInWeekInSeries
                  : { date: 0, counter: 0, counterWeeks: 0 };

                // calcolo i punti totali dei vari segment
                // period deve essere diverso da zero perche altrimenti è un calcolo relativo a un periodo e non una singola route
                const tot4000Point = route.segment.reduce(
                  (total, elem) => total + elem.points,
                  0
                );
                const NewPointsInWeekInSeries4000 = checkCounterPointsInWeekForSeriesEvent(
                  PointsInWeekInSeries4000,
                  route.segment[0].end_time,
                  tot4000Point,
                  4000
                );

                dispatch(
                  updateStatusCheckEvents(
                    "PointsInWeekInSeries",
                    NewPointsInWeekInSeries4000
                  )
                );

                if (NewPointsInWeekInSeries4000.counterWeeks >= 3) {
                  check = true;
                  typeCheckCompleted = "PointsInWeekInSeries";
                }
                break;
              case "Do at least twenty walking trips in one week":
                check = checkModalTypeDispatch(route, evento);
                if (check) {
                  check = false;
                  const Walking20RoutesInWeek = statusCheckEvents.WalkingTenRoutesInWeek
                    ? statusCheckEvents.WalkingTenRoutesInWeek
                    : { date: 0, counter: 0 };
                  const newWalking20RoutesInWeek = checkCounterRouteInWeekEvent(
                    Walking20RoutesInWeek,
                    route.segment[0].end_time
                  );
                  dispatch(
                    updateStatusCheckEvents(
                      "WalkingTenRoutesInWeek",
                      newWalking20RoutesInWeek
                    )
                  );
                  if (newWalking20RoutesInWeek.counter >= 20) {
                    check = true;
                    typeCheckCompleted = "WalkingTenRoutesInWeek";
                  }
                }
                break;
              case "Score at least 25000 points in one month":
                // punti nel mese corrente
                const Points25000InMonth = statusCheckEvents.PointsInMonth
                  ? statusCheckEvents.PointsInMonth
                  : { date: 0, counter: 0 };

                // calcolo i punti totali dei vari segment
                // period deve essere diverso da zero perche altrimenti è un calcolo relativo a un periodo e non una singola route
                const Points25000Route = route.segment.reduce(
                  (total, elem) => total + elem.points,
                  0
                );
                const newPoints25000InMonth = checkCounterPointsInMonthEvent(
                  Points25000InMonth,
                  route.segment[0].end_time,
                  Points25000Route
                );

                dispatch(
                  updateStatusCheckEvents(
                    "PointsInMonth",
                    newPoints25000InMonth
                  )
                );

                if (newPoints25000InMonth.counter >= 25000) {
                  check = true;
                  typeCheckCompleted = "PointsInMonth";
                }

                break;
              case "Do 500 trips":
                // prendo dalla memoria e dal db il numero di tratte effettuate in totale
                const counter500 = getState().statistics.n_routes
                  ? getState().statistics.n_routes
                  : 0;
                console.log(counter500);

                const Now5000 = new Date(route.segment[0].end_time);
                const millisecond5000 = Now5000.getTime();
                const counterNew5000 = {
                  date: millisecond5000,
                  counter: counter500
                };
                dispatch(
                  updateStatusCheckEvents("RoutesCounter", counterNew5000)
                );
                condition = 500 - 1;
                if (counter500 >= condition) {
                  check = true;
                  typeCheckCompleted = "RoutesCounter";
                }
                break;
              case "MUV thirty days in a row":
                const RoutesSeries30 = statusCheckEvents.RoutesSeries
                  ? statusCheckEvents.RoutesSeries
                  : { date: 0, counter: 0 };
                const newRoutesSeries30 = checkCounterRouteInSeriesEvent(
                  RoutesSeries30,
                  route.segment[0].end_time
                );
                dispatch(
                  updateStatusCheckEvents("RoutesSeries", newRoutesSeries30)
                );
                condition = 30;
                if (newRoutesSeries30.counter >= condition) {
                  check = true;
                  typeCheckCompleted = "RoutesSeries";
                }
                break;

              default:
                check = false;
            }
            if (check) {
              console.log("verificata " + evento.event.text_description);
              // e poi invio
              const newLevelComplete = {
                event_id: evento.id,
                new_status_events: 1,
                typeCheckCompleted
              };
              console.log(newLevelComplete);
              dispatch(putEvent(newLevelComplete));
            }
          }
        });
      } catch (error) {
        // console.log(error);

        bugsnag.notify(error);
      }
    }

    // dopo che ha controllato gli eventi la manda al db
    // console.log("prima di mandare");
    setTimeout(
      () =>
        dispatch(
          saveRouteBackend({
            data: route,
            start: first,
            numsegment: interval,
            paramCallback,
            callback
          })
        ),
      Platform.OS === "android" ? 300 : 100
    );
  };
}

/* 
modal_type stringa con i tipi di tracking da verificare tipo bici o a piedi
frequency , quante volte da soddisfare tipo 3 volte in una settimana 
period tempo a disposizione per soddisfare la condizione 
is_mfr, se frequent route
points: punti da fare 
day, in un giorno specifico 
time_slot,  ... 
weather, tipologia di meteo 
is_shared_trip, viaggio condiviso 
"lat": 45.23, da dove iniziare 
    "lon": 45.23,
    check_in, stesso discorso 

*/

// conta il numero di route in un intervallo
// startWeek, millisecondi da dove partire
// frequency, numero da soddisfare

// counterSeries, numero contato
function checkNumRouteFromStart(getState, startWeek, frequency) {
  // inizio route.segment[0].end_time
  // parto da uno dato che ho gia fatto una tratta valida
  let counterSeries = 1;

  const PreviousRoute = getState().tracking.PreviousRoute;

  // prima calcolo sulle route precedenti
  for (route = 1; route <= PreviousRoute.length; route++) {
    // controllo se ho gia fatto piu route, se si interrompo
    if (counterSeries >= frequency) {
      check = true;
      break;
    }
    const Segment = PreviousRoute[route - 1] ? PreviousRoute[route - 1] : null;
    // se il segmento esiste e ancora non è stato completato e senza segment
    if (Segment && !Segment.modal_type && !Segment.isSegment) {
      const NumRoute = Segment.route.length;
      // prendo la data dell'ultima posizione presa, che è presente su route
      const end = Segment.route[NumRoute - 1].time;
      // se è successo in questa settimana
      if (end >= startWeek) {
        counterSeries++;
      }
    }
  }
  // se ancora non ho soddisfato
  console.log(counterSeries);
  console.log(
    "controllo le route precedenti per vedere se ho tre route in una settimana"
  );
  if (counterSeries < frequency) {
    const SavedRoute = getState().login.Route;
    for (route = 1; route <= SavedRoute.length; route++) {
      if (counterSeries >= frequency) {
        check = true;
        break;
      }
      // prendo la data dalle info del db
      // se esiste
      if (SavedRoute[route - 1]) {
        const end = new Date(SavedRoute[route - 1].end_time).getTime();
        if (end >= startWeek) {
          counterSeries++;
        }
      }
    }
  }
  console.log(counterSeries);
  return counterSeries;
}

// aggiornare il valore di una specifica serie in fila quindi un giorno dopo l'altro

// nameSave, qual'è il nome della serie
// valueSave, valore salvato in memoria
// start, tempo della tratta analizzata
// frequency, soglia della serie da soddisfare

// ritorna vero se soddisfa la serie
function updateValueSeriesRow(nameSave, valueSave, start, frequency) {
  console.log("serie in fila");
  console.log(nameSave);

  // calcolo l'inizio
  console.log(start);
  const Now = new Date(start);
  const millisecond = Now.getTime();

  const dateNow = new Date(millisecond).toDateString();

  let counterSeries = 1;

  if (!valueSave) {
    if (counterSeries >= frequency) {
      check = true;
      try {
        AsyncStorage.removeItem(nameSave);
      } catch (error) {
        // Error saving data
      }
      return check;
    } else {
      // salvo il valore
      storeData(nameSave, counterSeries + "+" + dateNow);
    }
  } else {
    // riprendo il valore in intero
    const count = valueSave.split("+");
    // primo valore il counter
    // il secondo la data
    counterSeries = parseInt(count[0]);
    // controllo se ha superato il valore interessato altrimenti salvo il nuovo valore

    if (dateNow === count[1]) {
      if (counterSeries >= frequency) {
        try {
          AsyncStorage.removeItem(nameSave);
        } catch (error) {
          // Error saving data
        }
        return true;
      }
      // non aggiorno nulla
    } else if (
      dateNow ===
      new Date(new Date(count[1]).getTime() + 86400000).toDateString()
    ) {
      // se il giorno è il giorno dopo, posso direttamente incrementare di uno
      counterSeries = counterSeries + 1;

      if (counterSeries >= frequency) {
        // completata

        try {
          AsyncStorage.removeItem(nameSave);
        } catch (error) {
          // Error saving data
        }
        return true;
      } else {
        storeData(nameSave, counterSeries + "+" + dateNow);
      }
    } else {
      // salvo il valore
      storeData(nameSave, "1" + "+" + dateNow);
    }
  }
  // se non ha ritornato true allora ritorno false
  return false;
}

// counter di trip  all'interno specifico tipo punti nelle ultime 48 ore
function updateValueSeriesCounterDuration(
  nameSave,
  valueSave,
  start,
  frequency,
  duration
) {
  console.log("counter per un periodo fisso");
  console.log(nameSave);
  console.log(frequency);

  // calcolo l'inizio
  console.log(start);
  const Now = new Date(start);
  const millisecond = Now.getTime();

  const dateNow = new Date(millisecond).toDateString();

  let counterSeries = 1;

  if (!valueSave) {
    if (counterSeries >= frequency) {
      check = true;

      return check;
    } else {
      // salvo il valore
      storeData(nameSave, counterSeries + "+" + dateNow);
    }
  } else {
    // riprendo il valore in intero
    const count = valueSave.split("+");
    // primo valore il counter
    // il secondo la data
    counterSeries = parseInt(count[0]);
    // incremento sempre il contatore

    counterSeries = counterSeries + 1;

    if (counterSeries >= frequency) {
      // completata

      try {
        AsyncStorage.removeItem(nameSave);
      } catch (error) {
        // Error saving data
      }
      return true;
    } else {
      storeData(nameSave, counterSeries + "+" + dateNow);
    }
  }

  // se non ha ritornato true allora ritorno false
  return false;
}

// counter di trip generico
function updateValueSeriesCounter(nameSave, valueSave, start, frequency) {
  console.log("counter generico");
  console.log(nameSave);
  console.log(frequency);

  // calcolo l'inizio
  console.log(start);
  const Now = new Date(start);
  const millisecond = Now.getTime();

  const dateNow = new Date(millisecond).toDateString();

  let counterSeries = 1;

  if (!valueSave) {
    if (counterSeries >= frequency) {
      check = true;

      return check;
    } else {
      // salvo il valore
      storeData(nameSave, counterSeries + "+" + dateNow);
    }
  } else {
    // riprendo il valore in intero
    const count = valueSave.split("+");
    // primo valore il counter
    // il secondo la data
    counterSeries = parseInt(count[0]);
    // incremento sempre il contatore

    counterSeries = counterSeries + 1;

    if (counterSeries >= frequency) {
      // completata

      try {
        AsyncStorage.removeItem(nameSave);
      } catch (error) {
        // Error saving data
      }
      return true;
    } else {
      storeData(nameSave, counterSeries + "+" + dateNow);
    }
  }

  // se non ha ritornato true allora ritorno false
  return false;
}

// aggiornare il valore di una specifica serie in una settimana quindi aggiorno cancello se è una nuova settimana

// nameSave, qual'è il nome della serie
// valueSave, valore salvato in memoria
// start, tempo della tratta analizzata
// frequency, soglia della serie da soddisfare

// ritorna vero se soddisfa la serie
function updateValueSeriesWeekend(nameSave, valueSave, start, frequency) {
  console.log("serie in una settimana");
  console.log(nameSave);

  // calcolo l'inizio
  console.log(start);
  const Now = new Date(start);
  const millisecond = Now.getTime();

  let check = false;

  const DayNowFromMon = new Date(millisecond - 86400000).getDay();
  const hoursNow = Now.getHours();

  const minutesNow = Now.getMinutes();
  const secondNow = Now.getSeconds();

  const startWeek =
    millisecond -
    (DayNowFromMon * 86400000 +
      hoursNow * 3600000 +
      minutesNow * 60000 +
      secondNow * 1000);
  // inizio settimana
  const dateNow = new Date(startWeek).toDateString();

  let counterSeries = 1;

  if (!valueSave) {
    if (counterSeries >= frequency) {
      check = true;
      try {
        AsyncStorage.removeItem(nameSave);
      } catch (error) {
        // Error saving data
      }
      return check;
    } else {
      // salvo il valore
      storeData(nameSave, counterSeries + "+" + dateNow);
    }
  } else {
    // riprendo il valore in intero
    const count = valueSave.split("+");
    // primo valore il counter
    // il secondo la data
    counterSeries = parseInt(count[0]);
    // controllo se ha superato il valore interessato altrimenti salvo il nuovo valore

    if (counterSeries >= frequency - 1 && dateNow === count[1]) {
      try {
        AsyncStorage.removeItem(nameSave);
      } catch (error) {
        // Error saving data
      }
      return true;
    } else if (dateNow === count[1]) {
      // se è nella stessa settimana, posso direttamente incrementare di uno
      counterSeries = counterSeries + 1;

      storeData(nameSave, counterSeries + "+" + dateNow);
    } else {
      // salvo il valore con la nuova settimana a uno
      storeData(nameSave, "1" + "+" + dateNow);
    }
  }
  // se non ha ritornato true allora ritorno false
  return check;
}

// aggiornare il valore di una specifica serie in un giorno

// nameSave, qual'è il nome della serie
// valueSave, valore salvato in memoria
// start, tempo della tratta analizzata
// frequency, soglia della serie da soddisfare

// ritorna vero se soddisfa la serie
function updateValueSeriesDay(nameSave, valueSave, start, frequency) {
  console.log("serie in un giorno");
  console.log(nameSave);
  console.log(valueSave);

  // calcolo l'inizio
  console.log(start);
  const Now = new Date(start);
  const millisecond = Now.getTime();

  const dateNow = new Date(millisecond).toDateString();

  let counterSeries = 1;

  if (!valueSave) {
    if (counterSeries >= frequency) {
      check = true;
      try {
        AsyncStorage.removeItem(nameSave);
      } catch (error) {
        // Error saving data
      }
      return check;
    } else {
      // salvo il valore
      storeData(nameSave, counterSeries + "+" + dateNow);
    }
  } else {
    // riprendo il valore in intero
    const count = valueSave.split("+");
    // primo valore il counter
    // il secondo la data
    counterSeries = parseInt(count[0]);
    // controllo se ha superato il valore interessato altrimenti salvo il nuovo valore

    if (dateNow === count[1]) {
      // se il giorno è lo stesso giorno, posso direttamente incrementare di uno
      counterSeries = counterSeries + 1;

      if (counterSeries >= frequency) {
        // completata

        try {
          AsyncStorage.removeItem(nameSave);
        } catch (error) {
          // Error saving data
        }
        return true;
      } else {
        storeData(nameSave, counterSeries + "+" + dateNow);
      }
    } else {
      // salvo il valore
      storeData(nameSave, "1" + "+" + dateNow);
    }
  }
  // se non ha ritornato true allora ritorno false
  return false;
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export function toggleStTeatro(dispatch, data) {
  console.log("toggleStTeatro", data);
  dispatch({
    type: TOGGLE_ST_TEATRO,
    payload: data
  });
}

export function toggleStBallarak(dispatch, data) {
  console.log("toggleStBallarak", data);
  dispatch({
    type: TOGGLE_ST_BALLARAK,
    payload: data
  });
}

export function toggleStKalsa(dispatch, data) {
  console.log("toggleStKalsa", data);
  dispatch({
    type: TOGGLE_ST_KALSA,
    payload: data
  });
}

export function toggleStMuvtoget(dispatch, data) {
  console.log("toggleStMuvToGet", data);
  dispatch({
    type: TOGGLE_ST_MUVTOGET,
    payload: data
  });
}

/**
 * st_data
 *  id
 *  reward_id
 *  status
 *  text_description
 */
export function validateStTeatro(st_data, dataUser = {}) {
  return async function(dispatch, getState) {
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
      dispatch(
        RefreshToken({
          ...dataUser,
          callback: () => {
            validateStTeatro(st_data);
          },
          access_token
        })
      );
    } else {
      const put = await putSpecialTrainingReward(
        access_token,
        {
          // reward_id: 300,
          // status: 1
          reward_id: st_data.reward_id,
          status: (e = st_data.status),
          text_description: st_data.text_description
        },
        null,
        null,
        dispatch
      );

      // alert(put);
      console.log(put);
      toggleStTeatro(dispatch, false);
    }
  };
}

/**
 * st_data
 *  id
 *  reward_id
 *  status
 *  text_description
 */
export function validateStBallarak(st_data, dataUser = {}) {
  return async function(dispatch, getState) {
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
      dispatch(
        RefreshToken({
          ...dataUser,
          callback: () => {
            validate_ballarak(st_data);
          },
          access_token
        })
      );
    } else {
      const put = await putSpecialTrainingReward(
        access_token,
        {
          // reward_id: 300,
          // status: 1
          reward_id: st_data.reward_id,
          status: (e = st_data.status),
          text_description: st_data.text_description
        },
        null,
        null,
        dispatch
      );

      // alert(put);
      console.log(put);
      toggleStBallarak(dispatch, false);
    }
  };
}

/**
 * st_data
 *  id
 *  reward_id
 *  status
 *  text_description
 */
export function validateStMuvtoget(st_data, dataUser = {}) {
  return async function(dispatch, getState) {
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
      dispatch(
        RefreshToken({
          ...dataUser,
          callback: () => {
            validateStMuvtoget(st_data);
          },
          access_token
        })
      );
    } else {
      const put = await putSpecialTrainingReward(
        access_token,
        {
          // reward_id: 300,
          // status: 1
          reward_id: st_data.reward_id,
          status: (e = st_data.status),
          text_description: st_data.text_description
        },
        null,
        null,
        dispatch
      );

      // alert(put);
      console.log(put);
      toggleStMuvtoget(dispatch, false);
    }
  };
}

/**
 * st_data
 *  id
 *  reward_id
 *  status
 *  text_description
 */
export function validateStPhoto(st_data, dataUser = {}) {
  return async function(dispatch, getState) {
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
      dispatch(
        RefreshToken({
          ...dataUser,
          callback: () => {
            validateStPhoto(st_data);
          },
          access_token
        })
      );
    } else {
      const put = await putSpecialTrainingReward(
        access_token,
        {
          // reward_id: 300,
          // status: 1
          reward_id: st_data.reward_id,
          status: (e = st_data.status),
          text_description: st_data.text_description
        },
        null,
        null,
        dispatch
      );

      // alert(put);
      console.log(put);
      validateStPhoto(dispatch, false);
    }
  };
}
