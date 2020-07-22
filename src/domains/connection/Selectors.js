import { createSelector } from "reselect";
import moment from "moment";

const getUsersPoolingFind = (state) => state.connection.usersPoolingFind;

const getInvitePooling = (state) => state.connection.invitePooling;

const getReceiveInvitePooling = (state) => state.connection.receiveInvitePooling;

// prendo chi è alla ricerca di utenti per il pooling ne ultimi due min
// export const getUsersPoolingFindState = createSelector(
//   [getUsersPoolingFind],
//   usersPooling => {
//     if (usersPooling) {
//       const now = moment();
//       const filterUsersPooling = usersPooling.filter(users => {
//         var duration = moment.duration(now.diff(users.time)).asMinutes();
//         if (duration > 1) {
//           return false;
//         } else {
//           return true;
//         }
//       });
//       return filterUsersPooling;
//     } else {
//       return [];
//     }
//   }
// );

// utenti trovati nella ricerca del pooling
export const getUsersPoolingFindState = createSelector(
  [getUsersPoolingFind],
  (usersPooling) => (usersPooling ? usersPooling : [])
);

export const getInvitePoolingState = createSelector(
  [getInvitePooling],
  (invitePooling) => (invitePooling ? invitePooling : null)
);

export const getReceiveInvitePoolingState = createSelector(
  [getReceiveInvitePooling],
  (receiveInvitePooling) => (receiveInvitePooling ? receiveInvitePooling : null)
);


