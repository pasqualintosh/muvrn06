import {
  FETCHING_TRAININGS_DATA,
  GET_COUNT_COMPLETED_EVENT_OF_TRAINING_SESSIONS,
  GET_COUNT_EVENT_OF_TRAINING_SESSIONS,
  GET_EVENTS,
  GET_LEVEL_EVENTS,
  GET_TRAINING_SESSIONS,
  GET_USER_LEVEL,
  PUT_EVENTS,
  PUT_SESSION,
  LEVEL_UP,
  UPDATE_STATUS_TRAINING,
  SAVE_OFFLINE_EVENTS,
  GET_QUIZ,
  COMPLETE_QUIZ,
  CHANGE_SCREEN_PROFILE,
  UPDATE_COUNTER_EVENT,
  GET_SPECIAL_TRAINING_SESSIONS,
  SUBSCRIBE_SPECIAL_TRAINING_SESSIONS,
  GET_COMPLETE_QUIZ,
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
import DefaultState from "./DefaultState";
import { LOG_OUT } from "../login/ActionTypes";

Array.prototype.unique = function() {
  var a = this.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }

  return a;
};

export default (state = DefaultState, action) => {
  switch (action.type) {
    case FETCHING_TRAININGS_DATA:
      {
        return { ...state, fetchingData: true };
      }
      break;
    case SAVE_OFFLINE_EVENTS:
      {
        // salvo che ho completato l'evento ma cencello dati transitori
        if (action.payload.typeCheckCompleted) {
          const statusCheckEvents = state.statusCheckEvents
            ? state.statusCheckEvents
            : {};
          delete statusCheckEvents[action.payload.typeCheckCompleted];
          return {
            ...state,
            status: action.payload.status,
            offline_training_event: [
              ...state.offline_training_event,
              action.payload.offline_training_event
            ],
            statusCheckEvents
          };
        } else {
          return {
            ...state,
            status: action.payload.status,
            offline_training_event: [
              ...state.offline_training_event,
              action.payload.offline_training_event
            ]
          };
        }
      }
      break;
    case GET_QUIZ:
      {
        quiz = action.payload.quiz
          ? action.payload.quiz.length
            ? action.payload.quiz
            : []
          : [];
        return {
          ...state,
          quiz: quiz,
          idQuiz: action.payload.id,
          typeQuiz: action.payload.type
        };
      }
      break;
    case UPDATE_COUNTER_EVENT:
      {
        const statusCheckEvents = state.statusCheckEvents
          ? state.statusCheckEvents
          : {};
        return {
          ...state,
          statusCheckEvents: {
            ...statusCheckEvents,
            [action.typeEvent]: action.valueEvent
          }
        };
      }
      break;

    case LOG_OUT:
      {
        // cancello tutto
        return DefaultState;
      }
      break;
    case COMPLETE_QUIZ:
      {
        // ho completato un altro quiz quindi lo aggiungo
        return {
          ...state,
          quizComplete: [...state.quizComplete, action.payload]
        };
      }
      break;
    case GET_COMPLETE_QUIZ:
      {
        // ho completato un altro quiz quindi lo aggiungo
        return {
          ...state,
          quizComplete: action.payload
        };
      }
      break;
    case UPDATE_STATUS_TRAINING:
      {
        return { ...state, status: action.payload.status };
      }
      break;

    case GET_USER_LEVEL:
      {
        return {
          ...state,
          ...action.payload.level,
          status: ""
        };
      }
      break;

    case LEVEL_UP:
      {
        let newChangeLevel = state.change_level;
        // controllo se è aumentato il livello, se si mi salvo quando è successo
        if (state.level_number !== action.payload.level.level_number) {
          newChangeLevel = new Date().getTime();
        }

        return {
          ...state,
          ...action.payload.level,
          status: "",
          change_level: newChangeLevel
        };
      }
      break;

    case GET_TRAINING_SESSIONS:
      {
        return {
          ...state,
          training_sessions: action.payload.infoSession,
          status: ""
        };
      }
      break;

    case GET_SPECIAL_TRAINING_SESSIONS:
      {
        return {
          ...state,
          special_training_sessions: action.payload.infoSession,
          status: ""
        };
      }
      break;

    case GET_SPECIAL_TRAINING_SESSIONS_SUBSCRIBED:
      {
        return {
          ...state,
          subscribed_special_training: action.payload.infoSession,
          available_st_event: action.payload.available_st_event,
          status: ""
        };
      }
      break;

    case SUBSCRIBE_SPECIAL_TRAINING_SESSIONS:
      {
        return {
          ...state
        };
      }
      break;

    case SAVE_ST_OFFLINE:
      {
        return {
          ...state,
          offline_st_reward: [...state.offline_st_reward, action.payload]
        };
      }
      break;

    case REMOVE_ST_OFFLINE:
      {
        let n_offline_st_reward = state.offline_st_reward.filter(e => {
          return e.reward_id != action.payload;
        });

        return {
          ...state,
          offline_st_reward: [...n_offline_st_reward]
        };
      }
      break;

    case GET_LEVEL_EVENTS:
      {
        return {
          ...state,
          fetchingData: false
        };
      }
      break;

    case SET_NEW_ST_PIVOTS:
      {
        return {
          ...state,
          new_st_pivots: [...state.new_st_pivots, ...action.payload].unique()
        };
      }
      break;

    case SET_COMPLETED_ST_PIVOTS:
      {
        if (state.completed_st_pivots)
          return {
            ...state,
            completed_st_pivots: [
              ...state.completed_st_pivots,
              action.payload
            ].unique()
          };
        else
          return {
            ...state,
            completed_st_pivots: [action.payload].unique()
          };
      }
      break;

    case ADD_REDEEMED_REWARD:
      {
        if (state.redeemed_rewards)
          return {
            ...state,
            redeemed_rewards: [
              ...state.redeemed_rewards,
              action.payload
            ].unique()
          };
        else
          return {
            ...state,
            redeemed_rewards: [action.payload].unique()
          };
      }
      break;

    case PUT_SESSION:
      {
        const idWithStatusChange = action.payload.newSession.id;
        const new_training_sessions = state.training_sessions.map(elem => {
          if (elem.id === idWithStatusChange) {
            return action.payload.newSession;
          } else {
            return elem;
          }
        });

        return {
          ...state,
          training_sessions: new_training_sessions,
          status: ""
        };
      }
      break;
    case PUT_EVENTS:
      {
        const idWithStatusChange = action.payload.infoEvent.id;
        const new_training_events = state.training_events.map(elem => {
          if (elem.id === idWithStatusChange) {
            return action.payload.infoEvent;
          } else {
            return elem;
          }
        });
        // tolgo il dato offline
        const new_offline_training_event = state.offline_training_event.filter(
          elem => elem.event_id !== idWithStatusChange
        );

        return {
          ...state,
          training_events: new_training_events,
          status: "",
          offline_training_event: new_offline_training_event
        };
      }
      break;

    case GET_EVENTS:
      {
        return {
          ...state,
          training_events: action.payload.infoEvents,
          status: ""
        };
      }
      break;
    case CHANGE_SCREEN_PROFILE:
      {
        return { ...state, selectedScreen: action.payload };
      }
      break;

    case TOGGLE_ST_TEATRO:
      console.log("reducertraining", action);
      {
        return { ...state, st_teatro_massimo: action.payload };
      }
      break;

    case TOGGLE_ST_BALLARAK:
      console.log("reducertraining", action);
      {
        return { ...state, st_ballarak: action.payload };
      }
      break;

    case TOGGLE_ST_MUVTOGET:
      console.log("reducertraining", action);
      {
        return { ...state, st_muvtoget: action.payload };
      }
      break;

    case TOGGLE_ST_KALSA:
      console.log("reducertraining", action);
      {
        return { ...state, st_kalsa: action.payload };
      }
      break;

    case LOG_OUT:
      {
        // cancello tutto
        return DefaultState;
      }
      break;

    default:
      return state;
  }
};
