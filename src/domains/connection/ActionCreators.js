import {
  CHANGE_STATUS,
  WS_CONNECTED,
  FIND_USERS_POOLING,
  RECEIVE_INVITE_USER_POOLING,
  INVITE_USER_POOLING,
} from "./ActionTypes";
import {
  DELETE_TRACKING,
  DELETE_ACTIVITY,
  DELETE_MULTI_TRACKING,
  DELETE_MULTI_ACTIVITY,
  UPDATE_SUB_TRIP_DATA,
  DELETE_TRIP,
  UPDATE_TRIP_DATA,
  CREATE_GROUP_POOLING,
  EXIT_USER_GROUP_POOLING,
} from "../tracking/ActionTypes";

import { View, Text, NetInfo, Alert, Platform, Dimensions } from "react-native";
import { Client } from "bugsnag-react-native";
import WebService from "../../config/WebService";
const bugsnag = new Client(WebService.BugsnagAppId);

import { getAllTrip } from "./../../domains/login/ActionCreators";
import { getSpecificPositionNew } from "./../../domains/standings/ActionCreators";

import { UpdateStatus, sendSocket } from "./../tracking/ActionCreators";
import { store } from "./../../store";
import moment from "moment";

/* export function changeConnectionStatus(status) {
  return function(dispatch) {
    dispatch({
      type: CHANGE_STATUS,
      status
    });
  };
} */

export function changeConnectionStatus(status) {
  return {
    type: CHANGE_STATUS,
    connectiontype: status.type,
    effectiveType: status.effectiveType,
    isConnected: status.isConnected,
  };
}

export function deleteSearchData() {
  return {
    type: FIND_USERS_POOLING,
    payload: [],
    myUserPoolingFind: [],
  };
}




// cancello qualcuno dal gruppo o me stesso
export function sendDeleteUserInGroupPooling(
  ws,
  dispatch,
  getState,
  objectParam = {}
) {
  console.log(objectParam);
  // {"type":"reject_pooling_user","time":"2020-04-15T14:55:49.331Z","reject":2}

  const deleteUserPackage = JSON.stringify({
    type: "reject_pooling_user",
    reject: objectParam.deleteUser,
    time: moment().format(),
  });
  console.log(deleteUserPackage);
  // ed è attivo mando
  ws.send(deleteUserPackage); // send a message
}

export function DeleteUserInGroupPooling(deleteUser) {
  console.log(deleteUser);
  console.log("esco dal gruppo");
  // invio la cancellazione
  store.dispatch(
    sendSocket(sendDeleteUserInGroupPooling, {
      deleteUser,
    })
  );
}

// cancello i dati dell'invito ricevuto
export function deleteDataReceiveInvite() {
  store.dispatch({
    type: RECEIVE_INVITE_USER_POOLING,
    payload: null,
  });
}

// cancello i dati dell'invito inviato
export function deleteDataSendInvite() {
  store.dispatch({
    type: INVITE_USER_POOLING,
    payload: null,
  });
}

export function sendInvitePooling(ws, dispatch, getState, objectParam = {}) {
  console.log(objectParam);
  // {"type":"invite_pooling_user","time":"2020-04-06T12:42:58.661Z","inviting":1,"invited":2}
  const { id } = objectParam.inviteUser;
  const invitePackage = JSON.stringify({
    type: "invite_pooling_user",
    inviting: objectParam.invitedUser.id,
    invited: id,
    time: moment().format(),
  });
  console.log(invitePackage);
  // ed è attivo mando
  ws.send(invitePackage); // send a message
}

export function InvitePooling(inviteUser) {
  const { myUserPoolingFind } = store.getState().connection;
  // se ho le info per fare la richiesta, ovvero ho le relazione del mio utente e quelle del mio invitato
  if (myUserPoolingFind && myUserPoolingFind.length) {
    // mi salvo chi sto invitando e quando
    store.dispatch({
      type: INVITE_USER_POOLING,
      payload: { ...inviteUser, timeInvite: moment().format() },
    });
    // invio l'invito
    store.dispatch(
      sendSocket(sendInvitePooling, {
        inviteUser,
        invitedUser: myUserPoolingFind[0],
      })
    );
  }
}

export function sendAcceptInvitePooling(
  ws,
  dispatch,
  getState,
  objectParam = {}
) {
  console.log(objectParam);
  // {"type":"accept_pooling_user","time":"2020-04-06T12:43:03.304Z","inviting":1,"invited":2}
  // inviting e invited gli stessi dell'invitante, quindi nell'invitato sono opposti
  const { id } = objectParam.inviteUser;
  const acceptInvitePackage = JSON.stringify({
    type: "accept_pooling_user",
    inviting: id,
    invited: objectParam.invitedUser.id,
    time: moment().format(),
  });
  console.log(acceptInvitePackage);
  // ed è attivo mando
  ws.send(acceptInvitePackage); // send a message
}

export function acceptInvitePooling(inviteUser) {
  const { myUserPoolingFind } = store.getState().connection;
  // se ho le info per accettare, ovvero ho le relazione del mio utente e quelle del mio invitato
  if (myUserPoolingFind && myUserPoolingFind.length) {
    store.dispatch({
      type: RECEIVE_INVITE_USER_POOLING,
      payload: null,
    });

    store.dispatch(
      sendSocket(sendAcceptInvitePooling, {
        inviteUser,
        invitedUser: myUserPoolingFind[0],
      })
    );
  }
}

export function sendDeclineInvitePooling(
  ws,
  dispatch,
  getState,
  objectParam = {}
) {
  console.log(objectParam);
  // {"type":"accept_pooling_user","time":"2020-04-06T12:43:03.304Z","inviting":1,"invited":2}
  // inviting e invited gli stessi dell'invitante, quindi nell'invitato sono opposti
  const { id } = objectParam.inviteUser;
  const declineInvitePackage = JSON.stringify({
    type: "decline_pooling_user",
    inviting: id,
    invited: objectParam.invitedUser.id,
    time: moment().format(),
  });
  console.log(declineInvitePackage);
  // ed è attivo mando
  ws.send(declineInvitePackage); // send a message
}

export function declineInvitePooling(inviteUser) {
  const { myUserPoolingFind } = store.getState().connection;
  // se ho le info per accettare, ovvero ho le relazione del mio utente e quelle del mio invitato
  if (myUserPoolingFind && myUserPoolingFind.length) {
    store.dispatch(
      sendSocket(sendDeclineInvitePooling, {
        inviteUser,
        invitedUser: myUserPoolingFind[0],
      })
    );
  }
}

const onOpen = (store) => (event) => {
  console.log("websocket open", event.target.url);
  store.dispatch(actions.wsConnected(event.target.url));
};

const onClose = (store) => () => {
  store.dispatch(actions.wsDisconnected());
};

const onMessage = (store) => (event) => {
  const payload = JSON.parse(event.data);
  console.log("receiving server message");

  switch (payload.type) {
    case "update_game_players":
      store.dispatch(updateGame(payload.game, payload.current_player));
      break;
    default:
      break;
  }
};

// timer prima della riconnessione
timer = 0;

function findUserInPooling(infoUser, username) {
  return infoUser.user.username === username;
}

export function wsConnect() {
  return function backendRequest(dispatch, getState) {
    console.log("timer socket");
    console.log(timer);
    setTimeout(() => {
      const { access_token } = getState().login;
      const wsOld = getState().connection ? getState().connection.ws : null;
      if (access_token && (!wsOld || wsOld.readystate == 3)) {
        ws = new WebSocket(
          "wss://" +
            WebService.socket +
            "/ws/tracking/point/?token=" +
            access_token
        );
        timer = timer + 3000;

        ws.onopen = () => {
          // mi sono connesso quindi risetto il timer = 0
          timer = 0;
          // connection opened
          console.log("connection opened");
          // ws.send('something'); // send a message
        };

        ws.onmessage = (e) => {
          // a message was received
          if (e.data) {
            console.log(e.data);
            const data = JSON.parse(e.data);
            msg = new Error("risposta socket");
            bugsnag.notify(msg, function (report) {
              report.metadata.other = { data };
            });
            console.log(data);
            if (data.status == 200) {
              if (data.type == "gpspoint") {
                const time = data.body.time;
                const sub_trip = data.body.subtrip;
                dispatch({
                  type: DELETE_TRACKING,
                  payload: {
                    time,
                    sub_trip,
                  },
                });
              } else if (data.type == "gpspoint_multi") {
                console.log(data);
                /* risposta con punti gia presenti 
                 {"status": "200", "type": "gpspoint_multi", "sub_trip": 605, 
                "body": {"duplicated": {"time": "2020-07-08T15:52:58+02:00", "subtrip": 605}}, "time": "2020-07-08T15:52:58+02:00", "start_time": "2020-07-08T15:53:52+02:00", 
                "end_time": "2020-07-08T15:52:58+02:00"} */
                const start_time = data.start_time;
                const end_time = data.end_time;
                const sub_trip = data.sub_trip;
                dispatch({
                  type: DELETE_MULTI_TRACKING,
                  payload: {
                    start_time,
                    end_time,
                    sub_trip,
                  },
                });
              } else if (data.type == "activity") {
                console.log(data);
                const time = data.time;
                const sub_trip = data.sub_trip;
                dispatch({
                  type: DELETE_ACTIVITY,
                  payload: {
                    time,
                    sub_trip,
                  },
                });
              } else if (data.type == "activity_multi") {
                console.log(data);
                const start_time = data.start_time;
                const end_time = data.end_time;
                const sub_trip = data.sub_trip;
                dispatch({
                  type: DELETE_MULTI_ACTIVITY,
                  payload: {
                    start_time,
                    end_time,
                    sub_trip,
                  },
                });
              } else if (data.type == "sub_trip_recap") {
                console.log(data);
                // const time = data.time;
                const sub_trip = data.body.id;
                dispatch({
                  type: UPDATE_SUB_TRIP_DATA,
                  sub_trip,
                  payload: data.body,
                });
              } else if (data.type == "close_trip") {
                console.log(data);
                // const time = data.time;
                const trip = data.trip_id;
                // ricevo Pending Validation
                // quindi ho mandato tutto

                dispatch({
                  type: DELETE_TRIP,
                  trip,
                });
              } else if (data.type == "trip_validation_recap") {
                console.log(data);
                // ha finito di validare

                const trip = data.body.id;

                dispatch({
                  type: UPDATE_TRIP_DATA,
                  trip,
                  payload: data.body,
                });
                // una tratta ha completato, ora carico quelle nuove
                dispatch(getAllTrip());

                // aggiorno il mio punteggio corrente
                getSpecificPositionNew();
              } else if (data.type == "pooling_users") {
                console.log(data);
                // utenti nuovi trovati
                let usersFind = data.body;
                let myUserPoolingFind = [];
                console.log(data.body);
                // devo trovare il mio account cosi lo tolgo
                const myUsername = store.getState().login.infoProfile.username;
                const lengthUsers = data.body.length;
                for (i = 0; i < lengthUsers; i++) {
                  if (usersFind[i].user.username == myUsername) {
                    myUserPoolingFind = usersFind.splice(i, 1);
                    console.log(usersFind);
                    console.log(myUserPoolingFind);
                    break;
                  }
                }
                dispatch({
                  type: FIND_USERS_POOLING,
                  payload: usersFind,
                  myUserPoolingFind,
                });
              } else if (data.type == "invite_from") {
                console.log(data);
                // invito ricevuto

                // vedo chi mi ha mandato l'invito
                const { invited_from } = data;
                let invite = null;

                const { usersPoolingFind } = store.getState().connection;
                const lengthUsers = usersPoolingFind.length;
                for (i = 0; i < lengthUsers; i++) {
                  if (usersPoolingFind[i].id == invited_from) {
                    invite = {
                      ...usersPoolingFind[i],
                      time: moment().format(),
                    };

                    break;
                  }
                }
                if (invite !== null) {
                  // se l'invito è consistente
                  dispatch({
                    type: RECEIVE_INVITE_USER_POOLING,
                    payload: invite,
                  });
                } else {
                  dispatch({
                    type: RECEIVE_INVITE_USER_POOLING,
                    payload: null,
                  });
                }
              } else if (data.type == "invite_pool") {
                // {"status": "200", "type": "invite_pool", "invited": "2"}
                // invito arrivato
                let { invitePooling } = store.getState().connection;
                // controllo se è per l'ultimo invito ricevuto
                if (invitePooling.id == data.invited) {
                  dispatch({
                    type: INVITE_USER_POOLING,
                    payload: { ...invitePooling, received: true },
                  });
                } else {
                  // altrimenti cancello l'invito
                  dispatch({
                    type: INVITE_USER_POOLING,
                    payload: null,
                  });
                }
              } else if (data.type == "decline_pooling_users") {
                // chi declina riceve: {"status": "200", "type": "decline_pooling_users", "declined_from": "1"}
                // chi viene rifiutato riceve:  {"status": "200", "type": "decline_pooling_users", "declined": 2}
                // chi ha invitato
                if (data.declined) {
                  let { invitePooling } = store.getState().connection;
                  // cancello l'invito rifiutato
                  if (invitePooling.id == data.declined) {
                    dispatch({
                      type: INVITE_USER_POOLING,
                      payload: null,
                    });
                  } else {
                    // l'invito rimane ancora attivo
                    dispatch({
                      type: INVITE_USER_POOLING,
                      payload: invitePooling,
                    });
                  }
                } else {
                  // rifiuto l'invito ricevuto
                  let { receiveInvitePooling } = store.getState().connection;
                  if (receiveInvitePooling.id == data.declined_from) {
                    dispatch({
                      type: RECEIVE_INVITE_USER_POOLING,
                      payload: null,
                    });
                  } else {
                    // l'invito ricevuto è ancora attivo
                    store.dispatch({
                      type: RECEIVE_INVITE_USER_POOLING,
                      payload: receiveInvitePooling,
                    });
                  }
                }
              } else if (data.type == "accept_invite") {
                /* {"status": "200", "type": "accept_invite", 
                "body": [{"id": 1, "user": {"username": "newuser", "avatar": 1}, "master": true, "pool": 5}, 
                {"id": 2, "user": {"username": "853", "avatar": 62}, "master": null, "pool": 5}]
              } */

                /* {"status": "200", 
              "type": "accept_invite", 
              "body": 
              [{"id": 26, "user": {"username": "angy", "avatar": {"avatar_image": "/media/avatar_images/Samantha/1_xhdpi.png"}}, 
              "master": true, "pool": 10, "end_time": null, "match_time": "2020-07-07T15:57:27+02:00", "reject_time": null}, 
              {"id": 27, "user": {"username": "angynew", "avatar": {"avatar_image": null}}, 
              "master": null, "pool": 10, "end_time": null, "match_time": "2020-07-07T15:57:27+02:00", "reject_time": null}
            ], 
              "master_recap": [{"id": 26, "user": {"username": "angy", "avatar": {"avatar_image": "/media/avatar_images/Samantha/1_xhdpi.png"}}, 
              "master": true, "pool": 10, "end_time": null, "match_time": "2020-07-07T15:57:27+02:00", "reject_time": null}]
            } */

                // gruppo creato dopo l'accettazione dell'invito
                // cancello l'invito fatto
                dispatch({
                  type: INVITE_USER_POOLING,
                  payload: null,
                });
                // dispatch({
                //   type: CREATE_GROUP_POOLING,
                //   groupPooling: data.body,
                // });

                // prendo anche l'username per sapere in quali pooling sono presente
                const username = store.getState().login.infoProfile.username;

                let orderPooling = data.master_recap.sort( (a, b) => {
                  return b[0].pool - a[0].pool
                })
                console.log(orderPooling)

                let lastPoolingHistory = orderPooling;
                // l'inizio ha sempre due pooling e anche la fine
                // i pooling piu nuovi sono all'inizio dell'array
                for (
                  let iPooling = 0;
                  iPooling < lastPoolingHistory.length;
                  iPooling++
                ) {
                  if (lastPoolingHistory[iPooling].length == 2 && !lastPoolingHistory[iPooling][0].reject_time ) {
                    // controllo se quella precedente ha match time e end time diversi, se si allora è l'inizio
                    
                    
                    if (iPooling < lastPoolingHistory.length - 1) {
                      match_time = lastPoolingHistory[iPooling].filter( elem => elem.match_time)
                      reject_time = lastPoolingHistory[iPooling + 1].filter( elem => elem.reject_time)
                      console.log(match_time)
                      console.log(reject_time)
                      if (reject_time.length && match_time.length && reject_time[0] == match_time[0]) {
                        // sicuramente devo andare avanti, non è l'inizio
                        continue;
                      } else {
                        lastPoolingHistory = orderPooling.slice(0,iPooling + 1);
                      }
                      
                    } else {
                      // non ho altri pooling, quindi è la fine
                      lastPoolingHistory = orderPooling.slice(0,iPooling + 1);
                    }
                    break;
                  }
                }
                console.log(lastPoolingHistory);

                const phasePooling = lastPoolingHistory.reduce(
                  (total, pooling, index, array) => {
                    // cerco i pooling legati all'utente corrente
                    const users = pooling.map((elem) => elem.user.username);

                    /*   var inventario = [
                      {name: 'mele', quantity: 2},
                      {name: 'banane', quantity: 0},
                      {name: 'ciliegie', quantity: 5}
                  ];
                  
                  function findCherries(fruit) { 
                      return fruit.name === 'ciliegie';
                  }
                  
                  console.log(inventario.find(findCherries));  */
                    // { name: 'ciliegie', quantity: 5 }
                    // prendo gli utenti del singolo pooling
                    if (users.indexOf(username) != -1) {
                      return [...total, pooling];
                    } else {
                      return total;
                    }
                  },
                  []
                );
                console.log(phasePooling);

                dispatch({
                  type: EXIT_USER_GROUP_POOLING,
                  groupPooling: data.body,
                  phasePooling,
                });
              } else if (data.type == "reject_pooling_users") {
                // il master ha eliminato qualcuno dal gruppo o qualcuno si è auto eliminato
                // {"status": "200", "type": "reject_pooling_users", "rejected": [{"id": 2,
                //  "user": {"username": "853", "avatar": 62}, "master": null, "pool": 6, "end_time": null, "match_time": null,
                //   "reject_time": "2020-04-15T17:28:25.921000+02:00"}, {"id": 1, "user": {"username": "newuser", "avatar": 1},
                //    "master": true, "pool": 6, "end_time": null, "match_time": null, "reject_time": null}]}

                /*  {"status": "200", "type": "reject_pooling_users", 
                "rejected": [
                  {"id": 24, "user": {"username": "angy", "avatar": {"avatar_image": "/media/avatar_images/Samantha/1_xhdpi.png"}}, "master": null, "pool": 9, "end_time": null, "match_time": "2020-07-07T15:40:43+02:00", "reject_time": "2020-07-07T15:41:27+02:00"}, 
                {"id": 25, "user": {"username": "angynew", "avatar": {"avatar_image": null}}, "master": true, "pool": 9, "end_time": null, "match_time": "2020-07-07T15:40:43+02:00", "reject_time": null}], 
                "master_recap": 
                [{"id": 21, "user": {"username": "angynew", "avatar": {"avatar_image": null}}, "master": null, "pool": 7, "end_time": "2020-07-07T15:25:23+02:00", "match_time": "2020-07-07T15:23:46+02:00", "reject_time": null}, 
                {"id": 22, "user": {"username": "angynew", "avatar": {"avatar_image": null}}, "master": null, "pool": 8, "end_time": "2020-07-07T15:37:08+02:00", "match_time": "2020-07-07T15:36:39+02:00", "reject_time": null}, 
                {"id": 19, "user": {"username": "angynew", "avatar": {"avatar_image": null}}, "master": null, "pool": null, "end_time": null, "match_time": null, "reject_time": null}, 
                {"id": 25, "user": {"username": "angynew", "avatar": {"avatar_image": null}}, "master": true, "pool": 9, "end_time": null, "match_time": "2020-07-07T15:40:43+02:00", "reject_time": null}]}
                 */

                /* // salvo gli utenti che sono rimasti ancora nel pooling, ovvero non hanno reject_time
                // mi servono i time per comprendere come suddividere i sub trip

                let pool_array_end = data.rejected.filter(
                  (user) => user.reject_time && user.match_time
                );
                // se passo da 2 a 1 ho il secondo con reject_time e match_time

                // prendo anche l'username per sapere in quali pooling sono presente
                const username = store.getState().login.infoProfile.username;

                dispatch({
                  type: EXIT_USER_GROUP_POOLING,
                  groupPooling: data.rejected.filter(
                    (user) => !user.reject_time
                  ),
                  phasePooling: pool_array_end,
                  username,
                  myGroupPooling: data.master_recap,
                }); */
                 // prendo anche l'username per sapere in quali pooling sono presente
                 const username = store.getState().login.infoProfile.username;

                 let orderPooling = data.master_recap.sort( (a, b) => {
                   return b[0].pool - a[0].pool
                 })
                 console.log(orderPooling)
 
                 let lastPoolingHistory = orderPooling;
                 // l'inizio ha sempre due pooling e anche la fine
                 // i pooling piu nuovi sono all'inizio dell'array
                 for (
                   let iPooling = 0;
                   iPooling < lastPoolingHistory.length;
                   iPooling++
                 ) {
                   if (lastPoolingHistory[iPooling].length == 2 ) {
                     // controllo se quella precedente ha match time e end time diversi, se si allora è l'inizio
                     
                     
                     if (iPooling < lastPoolingHistory.length - 1) {
                       match_time = lastPoolingHistory[iPooling].filter( elem => elem.match_time)
                       reject_time = lastPoolingHistory[iPooling + 1].filter( elem => elem.reject_time)
                       console.log(match_time)
                       console.log(reject_time)
                       if (reject_time.length && match_time.length && reject_time[0] == match_time[0]) {
                         // sicuramente devo andare avanti, non è l'inizio
                         continue;
                       } else {
                         lastPoolingHistory = orderPooling.slice(0,iPooling + 1);
                       }
                       
                     } else {
                       // non ho altri pooling, quindi è la fine
                       lastPoolingHistory = orderPooling.slice(0,iPooling + 1);
                     }
                     break;
                   }
                 }
                 console.log(lastPoolingHistory);
 
                 const phasePooling = lastPoolingHistory.reduce(
                   (total, pooling, index, array) => {
                     // cerco i pooling legati all'utente corrente
                     const users = pooling.map((elem) => elem.user.username);
 
                     /*   var inventario = [
                       {name: 'mele', quantity: 2},
                       {name: 'banane', quantity: 0},
                       {name: 'ciliegie', quantity: 5}
                   ];
                   
                   function findCherries(fruit) { 
                       return fruit.name === 'ciliegie';
                   }
                   
                   console.log(inventario.find(findCherries));  */
                     // { name: 'ciliegie', quantity: 5 }
                     // prendo gli utenti del singolo pooling
                     if (users.indexOf(username) != -1) {
                       return [...total, pooling];
                     } else {
                       return total;
                     }
                   },
                   []
                 );
                 console.log(phasePooling);
 
                 dispatch({
                   type: EXIT_USER_GROUP_POOLING,
                   groupPooling: data.rejected,
                   phasePooling,
                 });
              } else {
                dispatch(UpdateStatus(data.type, 0));
                msg = new Error("status 200 ma non gestito");
                bugsnag.notify(msg, function (report) {
                  report.metadata = { error: data };
                });
              }
            } else if (data.status == 400) {
              console.log(data);
              if (data.type == "invite_pooling_users") {
                // {"status": "400", "type": "invite_pooling_users", "body": f"{invited_user} already engaged in {user.pool}"}
                // utente gia occupato in un altro trip

                // cancello l'invito
                dispatch({
                  type: INVITE_USER_POOLING,
                  payload: null,
                });
              } else {
                dispatch(UpdateStatus("status 400", 0));
                msg = new Error("status 400");
                bugsnag.notify(msg, function (report) {
                  report.metadata = { error: data };
                });
                // riprova tra 10 secondi e cancella la socket corrente
                timer = 10000;
                dispatch({
                  type: WS_CONNECTED,
                  host: null,
                });
              }
            } else {
              dispatch(UpdateStatus("errore", 0));
              msg = new Error("status diverso da 400");
              bugsnag.notify(msg, function (report) {
                report.metadata = { error: data };
              });
            }
          } else {
            console.log(e);
            dispatch(UpdateStatus("non ricevo data", 0));
            msg = new Error("non ricevo data");
            bugsnag.notify(msg, function (report) {
              report.metadata = { error: e };
            });
          }
        };

        ws.onerror = (e) => {
          timer = timer + 3000;
          // an error occurred
          console.log(e.message);
          console.log(e.code, e.reason);
          dispatch({
            type: WS_CONNECTED,
            host: null,
          });
          msg = new Error("on error socket");
          bugsnag.notify(msg, function (report) {
            report.metadata = { error: e };
          });
          // dispatch(wsConnect())
        };

        ws.onclose = (e) => {
          // connection closed
          console.log(e.code, e.reason);
          dispatch({
            type: WS_CONNECTED,
            host: null,
          });
          // dispatch(wsConnect())
        };

        dispatch({
          type: WS_CONNECTED,
          host: ws,
        });
      }
    }, timer);
    return {};
  };
}
