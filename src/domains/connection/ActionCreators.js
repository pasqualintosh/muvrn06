import { CHANGE_STATUS } from "./ActionTypes";

import { View, Text, NetInfo, Alert, Platform, Dimensions } from "react-native";

/* export function changeConnectionStatus(status) {
  return function(dispatch) {
    dispatch({
      type: CHANGE_STATUS,
      status
    });
  };
} */

export function changeConnectionStatus(status) {
  return function(dispatch) {
    dispatch({
      type: CHANGE_STATUS,
      connectiontype: status.type,
      effectiveType: status.effectiveType,
      isConnected: status.isConnected
    });
  };
}
