import {
  CREATE_USER,
  UPDATE_STATE,
  CHECK_EMAIL,
  GET_MOBILITY_CAR_VALUES,
  GET_MOBILITY_MOTO_VALUES,
  SAVE_BRANCH_TEMP_DATA,
  CLEAR_BRANCH_TEMP_DATA,
  SET_REFERRAL_FROM_REGISTRATION,
  CLEAR_REFERRAL_FROM_REGISTRATION,
  SET_CAR_SEGMENT
} from "./ActionTypes";
import DefaultState from "./DefaultState";

export default function registerReducer(state = DefaultState, action) {
  switch (action.type) {
    case CREATE_USER:
      {
        console.log(action);
        return { ...state };
      }
      break;
    case UPDATE_STATE:
      {
        console.log(action);
        return { ...state, ...action.payload };
      }
      break;
    case CHECK_EMAIL:
      {
        console.log(action);
        return { ...state, ...action.payload };
      }
      break;
    case GET_MOBILITY_CAR_VALUES:
      {
        console.log(action);
        return { ...state, ...action.payload };
      }
      break;
    case GET_MOBILITY_MOTO_VALUES:
      {
        console.log(action);
        return { ...state, ...action.payload };
      }
      break;
    case SAVE_BRANCH_TEMP_DATA:
      {
        console.log(action);
        return {
          ...state,
          ...action.payload
        };
      }
      break;
    case CLEAR_BRANCH_TEMP_DATA:
      {
        console.log(action);
        return {
          ...state,
          ...action.payload
        };
      }
      break;
    case SET_REFERRAL_FROM_REGISTRATION:
      {
        console.log(action);
        return {
          ...state,
          referral_from_registration: true
        };
      }
      break;
    case CLEAR_REFERRAL_FROM_REGISTRATION:
      {
        console.log(action);
        return {
          ...state,
          referral_from_registration: null
        };
      }
      break;
    case SET_CAR_SEGMENT:
      {
        console.log(action);
        return {
          ...state,
          ...action.payload
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
