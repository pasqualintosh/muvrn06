import {
  GET_STATS,
  GET_STATS_FAILED,
  NO_STATS,
  CHANGE_SCREEN_STATISTICS,
  GET_WEEK_ACTIVITIES,
  STATUS_PERM_ACTIVITIES,
  UPDATE_STATUS_ACTIVITY
} from "./ActionTypes";
import DefaultState from "./DefaultState";
import { LOG_OUT,  } from "../login/ActionTypes";

export default (state = DefaultState, action) => {
  switch (action.type) {
    case GET_STATS:
      {
        return {
          ...state,
          statistics: action.payload,
          // n_routes: action.payload.n_routes,
          error: false
        };
      }
      break;
    case GET_STATS_FAILED:
      {
        return { ...state, error: true };
      }
      break;
    case NO_STATS:
      {
        return { ...state, error: false };
      }
      break;

      case STATUS_PERM_ACTIVITIES:
        {
          return { ...state, permActivities: action.payload };
        }
        break;
    case CHANGE_SCREEN_STATISTICS:
      {
        return { ...state, selectedScreen: action.payload };
      }
      break;
      case GET_WEEK_ACTIVITIES:
        {
          return { ...state, weekActivities: action.payload };
        }
        break;
        case UPDATE_STATUS_ACTIVITY:
        {
          return { ...state, statusActivity: {...state.statusActivity, ...action.payload} };
        }
        break;

        

        statusActivity
      

    case LOG_OUT:
      {
        // cancello tutto
        // date lo conservo cosi lo uso per sapere se l'utente è stato mai registrato o no
        return DefaultState;
      }
      break;
    default:
      {
        return { ...state, error: false };
      }
      break;
  }
};
