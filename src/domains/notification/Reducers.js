import { UPDATE_LAST_TRIP_TIME } from "./ActionTypes";
import DefaultState from "./DefaultState";

export default function notificationReducer(state = DefaultState, action) {
  switch (action.type) {
    case UPDATE_LAST_TRIP_TIME:
      return { ...state, last_trip_time: action.payload.value };

    default:
      return state;
  }
}
