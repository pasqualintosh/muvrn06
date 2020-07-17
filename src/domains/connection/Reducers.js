import { CHANGE_STATUS } from "./ActionTypes";
import DefaultState from "./DefaultState";

export default (state = DefaultState, action) => {
  switch (action.type) {
    case CHANGE_STATUS:
      {
        console.log(action);
        return {
          ...state,
          connectiontype: action.connectiontype,
          effectiveType: action.effectiveType,
          isConnected: action.isConnected
        };
      }
      break;

    default:
      {
        return state;
      }
      break;
  }
};
