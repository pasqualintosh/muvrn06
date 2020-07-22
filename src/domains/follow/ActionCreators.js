import {
  FETCHING_DATA_FOLLOW,
  FETCHING_DATA_FOLLOW_COMPLETE,
  GET_FOLLOWING,
  SET_SELECTION_FOLLOW,
  UPDATE_SPECIFIC_DATA,
} from "./ActionTypes";
import axios from "axios";
import qs from "qs";
import {
  requestBackend,
  RefreshToken,
  requestCallback,
  requestNewBackend,
  forceRefreshTokenWithCallback,
} from "./../login/ActionCreators"; // da far puntare agli helper!!!
import WebService from "./../../config/WebService";
import { GET_FOLLOWER } from "../standings/ActionTypes";

import {
  clearBranchTempData,
  clearReferralFromRegistration,
} from "./../../domains/register/ActionCreators";
import { store } from "../../store";
import { Client } from "bugsnag-react-native";
const bugsnag = new Client(WebService.BugsnagAppId);

export function setFriendSelected(selected) {
  return async function (dispatch) {
    dispatch({
      type: SET_SELECTION_FOLLOW,
      payload: selected,
    });
  };
}

export function UpdateSpecificData(info) {
  // per aggiornare una specifica proprieta

  return {
    type: UPDATE_SPECIFIC_DATA,
    info,
  };
}

// prendo chi sono i miei amici
export function getListFriend(info) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    console.log("getListFriend");
    console.log(info);
    let { access_token } = getState().login;

    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/account/friendship/list_friend/",
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 200) {
        dispatch(UpdateSpecificData({ listFriend: response.data }));
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(forceRefreshTokenWithCallback(getListFriend(info)));
      } else {
        const msg = new Error("getListFriend fail");
        bugsnag.notify(msg, function (report) {
          report.metadata = { problem: response };
        });
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log(error.message);
      }
      console.log(error.config);
    }
  };
}

// prendo chi mi ha inviato una richiesta di amicizia
export function getListRequestFriend(info) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    console.log("getListRequestFriend");
    console.log(info);
    let { access_token } = getState().login;

    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/account/friendship/list_request/",
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 200) {
        dispatch(UpdateSpecificData({ listRequestFriend: response.data }));
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(forceRefreshTokenWithCallback(getListRequestFriend(info)));
      } else {
        const msg = new Error("getListRequestFriend fail");
        bugsnag.notify(msg, function (report) {
          report.metadata = { problem: response };
        });
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log(error.message);
      }
      console.log(error.config);
    }
  };
}

// prendo chi ho inviato una richiesta di amicizia
export function getListSendRequestFriend(info, callback = () => {}) {
  return async function backendRequest(dispatch, getState) {
    // richiesta di accesso mandando i dati con axios
    console.log("getListSendRequestFriend");
    console.log(info);
    let { access_token } = getState().login;

    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/account/friendship/list_sent_request/",
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 200) {
        dispatch(UpdateSpecificData({ listSendRequestFriend: response.data }));
        callback;
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(
          forceRefreshTokenWithCallback(
            getListSendRequestFriend(info, callback)
          )
        );
      } else {
        const msg = new Error("getListSendRequestFriend fail");
        bugsnag.notify(msg, function (report) {
          report.metadata = { problem: response };
        });
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log(error.message);
      }
      console.log(error.config);
    }
  };
}

//cerco amici a cui potrei mandare la richiesta, callback per riempire la pagina che la sta chiamando
// username, ricerca degli utenti il cui nickname inizio con questo parametro
export async function searchUsers(username = "", callback) {
  // richiesta di accesso mandando i dati con axios
  console.log("searchUsers");
  console.log(username);
  let { access_token } = store.getState().login;

  try {
    if (username.length) {
      const response = await requestNewBackend(
        "get",
        "/api/v1/account/friendship/search_user/" + username,
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log(response);
      if (response.status === 200) {
        callback(response.data);
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        store.dispatch(
          forceRefreshTokenWithCallback(searchUsers(username, callback))
        );
      } else {
        const msg = new Error("searchUsers fail");
        bugsnag.notify(msg, function (report) {
          report.metadata = { problem: response };
        });
      }
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log(error.message);
    }
    console.log(error.config);
  }
}

export async function searchContactsUsers(contacts = [], callback = () => {}) {
  // richiesta di accesso mandando i dati con axios
  console.log("searchContactsUsers");
  console.log(contacts);
  let { access_token } = store.getState().login;

  try {
    if (contacts.length) {
      const response = await requestNewBackend(
        "post",
        "/api/v1/account/friendship/contact_list/",
        access_token,
        { contacts },
        "application/json",
        "Bearer"
      );

      console.log(response);
      if (response.status === 200) {
        callback(response.data);
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        store.dispatch(
          forceRefreshTokenWithCallback(
            searchContactsUsers((contacts = []), callback)
          )
        );
      } else {
        const msg = new Error("searchContactsUsers fail");
        bugsnag.notify(msg, function (report) {
          report.metadata = { problem: response };
        });
      }
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log(error.message);
    }
    console.log(error.config);
  }
}

// mando la richiesta di amicizia a un utente specificando l'id e un messaggio da mandare
export async function sendRequestFriend(
  infoSend = {
    message: "",
    to_user: 0,
  },
  callback = () => {}
) {
  // {
  //   other_user*	integer
  //   accept*	boolean
  //   True: accept, False: decline
  //   }
  // richiesta di accesso mandando i dati con axios
  console.log("sendRequestFriend");
  console.log(infoSend);
  let { access_token } = store.getState().login;

  try {
    // se ho l'id dell'utente da invitare
    if (infoSend.to_user) {
      const response = await requestNewBackend(
        "post",
        "/api/v1/account/friendship/add_friend/" + infoSend.to_user,
        access_token,
        infoSend,
        "application/json",
        "Bearer"
      );

      console.log(response);
      if (response.status === 201) {
        store.dispatch(getListSendRequestFriend());
        callback;
      }
      if (response.status === 400) {
        // data: "Friendship already requested"
        callback(response.data);
        store.dispatch(getListSendRequestFriend());
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        store.dispatch(
          forceRefreshTokenWithCallback(sendRequestFriend(infoSend, callback))
        );
      } else {
        const msg = new Error("sendRequestFriend fail");
        bugsnag.notify(msg, function (report) {
          report.metadata = { problem: response };
        });
      }
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log(error.message);
    }
    console.log(error.config);
  }
}

// rispondo alla richiesta di amicizia di un utente specificando l'id dell'invitante e se accetto o no il messaggio
export async function responseRequestFriend(
  infoSend = {
    accept: false,
    other_user: 0,
  },
  callback = () => {}
) {
  // {
  //   message	string
  //   title: Message
  //   readOnly: true

  //   }
  // richiesta di accesso mandando i dati con axios
  console.log("responseRequestFriend");
  console.log(infoSend);
  let { access_token } = store.getState().login;

  try {
    // se ho l'id dell'utente da invitare
    if (infoSend.other_user) {
      const response = await requestNewBackend(
        "post",
        "/api/v1/account/friendship/accept_decline_request/",
        access_token,
        infoSend,
        "application/json",
        "Bearer"
      );

      console.log(response);
      if (response.status === 201) {
        // accetto la richiesta

        callback(response);
        store.dispatch(getListRequestFriend());

        // se ho accettato allora ho un nuovo amico quindi carico anche gli amico
        store.dispatch(getListFriend());
      } else if (response.status === 200) {
        // rifiuto la richiesta

        callback(response);
        store.dispatch(getListRequestFriend());
      } else if (response.status === 400) {
        // richiesta gia accetta o rifiutata

        callback(response);
        store.dispatch(getListRequestFriend());
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        store.dispatch(
          forceRefreshTokenWithCallback(
            responseRequestFriend(infoSend, callback)
          )
        );
      } else {
        const msg = new Error("responseRequestFriend fail");
        bugsnag.notify(msg, function (report) {
          report.metadata = { problem: response };
        });
      }
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log(error.message);
    }
    console.log(error.config);
  }
}

// prendo chi seguo
export function getFollowingUser(dataUser = {}, callbackSetState) {
  return async function (dispatch, getState) {
    const { access_token, date } = getState().login;
    let now = +new Date();
    // controllo prima se il dato dell'utente e in particolare la città c'e
    // altrimenti la chiedo con getprofile
    if (now < date) {
      // token ancora valido
      dispatch({
        type: FETCHING_DATA_FOLLOW,
      });
      try {
        const response = await requestBackend(
          "get",
          // "/api/v1/follow/?follower=true",
          "/api/v1/follow/",
          access_token,
          null,
          null,
          "Bearer"
        );
        if (response.status === 200) {
          console.log("risposta followed");
          console.log(response.data);
          dispatch({ type: GET_FOLLOWING, payload: response.data });
        } else if (response.status === 400) {
          dispatch({
            type: FETCHING_DATA_FOLLOW_COMPLETE,
          });
          // {"description": "An error has occurred"}
          console.log(response);
        } else if (response.status === 404) {
          // description:"No friends find"
          console.log(response);
          dispatch({ type: GET_FOLLOWING, payload: [] });
        } else {
          dispatch({
            type: FETCHING_DATA_FOLLOW_COMPLETE,
          });
        }
      } catch (exception) {
        console.log("Exception from /api/v1/follow/");
        console.log(exception);
        dispatch({
          type: FETCHING_DATA_FOLLOW_COMPLETE,
        });
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(RefreshToken({ ...dataUser, callback: getFollowingUser }));
    }
  };
}

// prendo chi mi segue
export function getFollowersUser(dataUser = {}, callbackSetState) {
  return async function (dispatch, getState) {
    const { access_token, date } = getState().login;
    let now = +new Date();
    // controllo prima se il dato dell'utente e in particolare la città c'e
    // altrimenti la chiedo con getprofile
    if (now < date) {
      // token ancora valido
      dispatch({
        type: FETCHING_DATA_FOLLOW,
      });
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/follow/?follower=true",
          access_token,
          null,
          null,
          "Bearer"
        );
        if (response.status === 200) {
          console.log("risposta followed");
          console.log(response.data);
          dispatch({ type: GET_FOLLOWER, payload: response.data });
        } else if (response.status === 400) {
          dispatch({
            type: FETCHING_DATA_FOLLOW_COMPLETE,
          });
          // {"description": "An error has occurred"}
          console.log(response);
        } else if (response.status === 404) {
          // description:"No friends find"
          console.log(response);
          dispatch({ type: GET_FOLLOWER, payload: [] });
        } else {
          dispatch({
            type: FETCHING_DATA_FOLLOW_COMPLETE,
          });
        }
      } catch (exception) {
        console.log("Exception from /api/v1/follow/");
        console.log(exception);
        dispatch({
          type: FETCHING_DATA_FOLLOW_COMPLETE,
        });
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(RefreshToken({ ...dataUser, callback: getFollowingUser }));
    }
  };
}

// utilizzare il referral url per fare friend tra di loro ma con le monete dato che si sta registrando
export function postRegisterFollower(dataUser = {}) {
  return async function (dispatch, getState) {
    const { referral_from_registration } = getState().register;
    // se ho il link
    if (referral_from_registration != null) {
      // prendo le altre info utili
      const {
        followed_user_id,
        link_status,
        referral_url,
      } = getState().register;

      console.log("chiamata per following con invito ");
      dispatch(
        postFollowUser(
          {
            followed_user_id: followed_user_id,
            referral_url: referral_url,
            link_status: link_status,
            coin_followed_earned: 2,
            coin_follower_earned: 1,
            // followed_user_id: 2,
            // referral_url: "https:muv.app.link/aa11",
            // link_status: 0
          },
          true
        )
      );
    }
  };
}

// aggiungo qualcuno che voglio seguire

// dati dell'utente da seguire
// afterFollow, se dopo il follow devo cancellare dei dati tipo i dati dell'invito salvati nella registrazione
export function postFollowUser(dataUser = {}, afterFollowInvite = false) {
  return async function (dispatch, getState) {
    const { access_token, date } = getState().login;
    let now = +new Date();
    // followed_user_id obbligatorio
    console.log(dataUser);
    const followed_user_id = dataUser.followed_user_id
      ? dataUser.followed_user_id
      : 0;

    const coin_followed_earned = dataUser.coin_followed_earned
      ? dataUser.coin_followed_earned
      : 0;
    const coin_follower_earned = dataUser.coin_follower_earned
      ? dataUser.coin_follower_earned
      : 0;

    const link_status = dataUser.link_status ? dataUser.link_status : 0;
    // dati che mando
    const dataUserFollow = dataUser.referral_url
      ? {
          followed_user_id,
          coin_followed_earned,
          coin_follower_earned,
          referral_url: dataUser.referral_url,
          link_status,
        }
      : {
          followed_user_id,
        };

    // se l'utente è specificato mando la richiesta
    if (now < date && followed_user_id) {
      // token ancora valido

      let queryPost = `/api/v1/follow/`;
      // if (referral_url.length) {
      //   // se ho il link referral ricevuto
      //   queryPost = `/api/v1/follow/?followed_user_id=${followed_user_id}&coin_followed_earned=${coin_followed_earned}&coin_follower_earned=${coin_follower_earned}&referral_url=${referral_url}&link_status=${link_status}`;
      // }

      try {
        const response = await requestBackend(
          "post",
          queryPost,
          access_token,
          dataUserFollow,
          "application/json",
          "Bearer"
        );
        if (response.status === 200) {
          // utente che seguo
          // { "description" : "Now you follow user Pippo P." }

          console.log("risposta del post followed ");
          // riprendo gli utenti che seguo
          dispatch(getFollowersUser(dataUser));
          dispatch(getFollowingUser(dataUser));

          if (afterFollowInvite) {
            // se è un invito dalla registrazione devo cancellare i dati salvati
            dispatch(clearBranchTempData());
            dispatch(clearReferralFromRegistration());
          }
        } else if (response.status === 400) {
          // {"description": "An error has occurred"}
          // description"You and the user are already friends"

          // ricarico gli amici cosi non lo invito piu
          dispatch(getFollowingUser(dataUser));

          console.log(response);
          if (afterFollowInvite) {
            // se è un invito dalla registrazione devo cancellare i dati salvati
            dispatch(clearBranchTempData());
            dispatch(clearReferralFromRegistration());
          }
        } else {
          console.log(response);
        }
      } catch (exception) {
        console.log("Exception post from /api/v1/follow/");
        console.log(exception);
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(RefreshToken({ ...dataUser, callback: postFollowUser }));
    }
  };
}

// elimino chi sto segue
export function deleteFollowedUser(dataUser = {}, callbackSetState) {
  return async function (dispatch, getState) {
    const { access_token, date } = getState().login;
    let now = +new Date();
    const id = dataUser.id ? dataUser.id : 0;
    // se l'utente è specificato mando la richiesta
    if (now < date && id) {
      // token ancora valido

      const queryDelete = `/api/v1/follow/?id=${id}`;
      try {
        const response = await requestBackend(
          "delete",
          queryDelete,
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 204 || response.status === 200) {
          // utente che seguo cancellato
          // { "description":  "User deleted" }
          // alert("risposta del delete followed ");
          // riprendo gli utenti che seguo
          dispatch(getFollowingUser(dataUser));
        } else if (response.status === 400) {
          // {"description": "An error has occurred"}
          console.log(response);
        } else {
        }
      } catch (exception) {
        console.log("Exception from /api/v1/follow/");
        console.log(exception);
      }
    } else {
      console.log(
        "chiamata non possibile, richiamo login e poi questa richiesta"
      );
      dispatch(RefreshToken({ ...dataUser, callback: deleteFollowedUser }));
    }
  };
}

// ritorna tutti i dettagli di un utente specifivo
export function getUserInfo(dataUser = {}, callback) {
  return async function (dispatch, getState) {
    // richiesta di accesso mandando i dati con axios

    // preparo la richiesta legata al login con username e password
    let { access_token, date } = getState().login;
    // se ho appena effettuato il login, uso il token nuovo che ho inserito
    if (dataUser.access_token) {
      access_token = dataUser.access_token;
      date = dataUser.date;
    }

    const id = dataUser.user_id ? dataUser.user_id : 0;

    // data per sapere poi quando scade il token
    let dateExpires = +new Date();
    // se è scaduto o l'utente non è ancora connesso, si connette
    if (dateExpires >= date || !access_token) {
      dispatch(
        RefreshToken({ ...dataUser, callback: getUserInfo, access_token })
      );
    } else if (id > 0) {
      // ho la sessione
      // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail
      console.log("mando richiesta");
      try {
        const response = await requestBackend(
          "get",
          "/api/v1/other_profile?user_id=" + id,
          access_token,
          null,
          null,
          "Bearer"
        );
        console.log(response);
        if (response.status === 200) {
          const infoUser = response.data;
          console.log(infoUser);

          const updateInfo = {
            ...infoUser.private_profile,
            ...infoUser.public_profile,
            ...infoUser,
          };

          if (callback) {
            callback(updateInfo);
          }

          requestCallback(dataUser, dispatch);
        } else if (response.status === 400) {
        } else if (response.status === 403) {
          // riprovo a fare la richiesta
          requestCallback({ afterCallback: getUserInfo }, dispatch);
          requestCallback(dataUser, dispatch);
        } else {
        }
        dispatch({
          type: "nulla",
          payload: {},
        });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "nulla",
          payload: {},
        });
      }
    }
  };
}

// ritorna tutti i dettagli di un utente specifivo con new backend
export  function getUserInfoNew(dataUser = {}, callback) {
  return async function backendRequest(dispatch, getState) {

    let { access_token } = getState().login;
    const username = dataUser.username;

    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/account/by_username/" + username,
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log(response);
      // Alert.alert(response.status.toString())

      if (response.status === 200) {
        const infoUser = response.data;
        console.log(infoUser);
        if (callback) {
          callback(infoUser);
        }
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app

        console.log("token scaduto");
        dispatch(forceRefreshTokenWithCallback(getUserInfoNew(dataUser, callback)));
      }
    } catch (error) {
      console.log(error);
    }
  }

}
