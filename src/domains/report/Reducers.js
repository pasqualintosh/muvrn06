import { ADD_REPORT } from "./ActionTypes";
import DefaultState from "./DefaultState";

export default function reportReducer(state = DefaultState, action) {
  switch (action.type) {
    case ADD_REPORT:
      {
        const report = action.report;
        return { ...state, report };
      }
      break;

    default:
      {
        return state;
      }
      break;
  }
}
