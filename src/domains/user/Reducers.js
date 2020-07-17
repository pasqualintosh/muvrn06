import {
  LOGIN,
  FAILED_LOGIN,
  GET_PROFILE,
  FAILED_GET_PROFILE,
  ADD_FREQUENT_ROUTE,
  DELETE_FREQUENT_ROUTE_NOT_SAVE
} from "./ActionTypes";
import DefaultState from "./DefaultState";

export default function userReducer(state = DefaultState, action) {
  switch (action.type) {
    case LOGIN:
      {
        return {
          ...state,
          ...action.payload,
          status: "Connected"
        };
      }
      break;
    case FAILED_LOGIN:
      {
        return { ...state, status: action.payload.error_description };
      }
      break;
    case GET_PROFILE:
      {
        console.log(GET_PROFILE);
        return {
          ...state,
          ...action.payload,
          status: "Connected"
        };
      }
      break;
    case FAILED_GET_PROFILE:
      {
        return { ...state, status: action.payload.error_description };
      }
      break;
    case ADD_FREQUENT_ROUTE:
      {
        // aggiungere i dati relativi al login tipo token ecc
        return {
          ...state,
          mostFrequentRoute: [...state.mostFrequentRoute, action.payload]
        };
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
    default:
      {
        // console.log(action);
        // console.log("default");
        return state;
      }
      break;
  }
}
