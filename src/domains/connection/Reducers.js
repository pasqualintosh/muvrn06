import { CHANGE_STATUS, WS_CONNECTED, FIND_USERS_POOLING, INVITE_USER_POOLING, RECEIVE_INVITE_USER_POOLING } from "./ActionTypes";
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
          isConnected: action.isConnected,
        };
      }
      break;

    case WS_CONNECTED:
      return { ...state, ws: action.host };
    case FIND_USERS_POOLING:
      return { ...state, usersPoolingFind: action.payload, myUserPoolingFind: action.myUserPoolingFind };
    case INVITE_USER_POOLING:
      return { ...state, invitePooling: action.payload };
      case RECEIVE_INVITE_USER_POOLING:
      return { ...state, receiveInvitePooling: action.payload };

    default:
      {
        return state;
      }
      break;
  }
};
