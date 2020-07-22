import { createSelector } from 'reselect'

const getFollow = state => state.follow.follow;

const getFollowed = state => state.follow.followed;

const getStatus = state => state.follow.fetchingData;

const getTab = state => state.follow.selectedFriend;


const getlistFriend = state => state.follow.listFriend;
const getlistRequestFriend = state => state.follow.listRequestFriend;
const getlistSendRequestFriend = state => state.follow.listSendRequestFriend;

export const getlistFriendState = createSelector(
  [getlistFriend],
  listFriend => (listFriend ? listFriend : [])
);

export const getNumFriendsState = createSelector(
  [getlistFriendState],
  listFriend => (listFriend.length)
);

export const getlistRequestFriendState = createSelector(
  [getlistRequestFriend],
  listRequestFriend => (listRequestFriend ? listRequestFriend : [])
);

export const getlistSendRequestFriendState = createSelector(
  [getlistSendRequestFriend],
  listSendRequestFriend => (listSendRequestFriend ? listSendRequestFriend : [])
);

// funzione per dividere gli array in gruppi di tre per poter fare la schermata 
Array.prototype.chunk = function(n) {
  if (!this.length) {
    return [];
  }
  return [this.slice(0, n)].concat(this.slice(n).chunk(n));
};

// lista degli amici + richieste fatte a gruppi di 3
export const getlistFriendWithSendRequestState = createSelector(
  [getlistFriendState, getlistSendRequestFriendState],
  (listFriend, listSendRequestFriend)  => {
    // potrei in caso ordinare gli array 
    const listFriendWithSendRequest = [...listSendRequestFriend, ...listFriend]
     // divido gli amici in gruppi da tre per visualizzarli
    return listFriendWithSendRequest.chunk(3)
  }
);

// lista degli amici + richieste fatte singoli
export const getSinglelistFriendWithSendRequestState = createSelector(
  [getlistFriendState, getlistSendRequestFriendState],
  (listFriend, listSendRequestFriend)  => {
    // potrei in caso ordinare gli array 
    const listFriendWithSendRequest = [...listSendRequestFriend, ...listFriend]
     // divido gli amici in gruppi da tre per visualizzarli
    return listFriendWithSendRequest
  }
);

// (lista degli amici + richieste fatte) divise per tre + richieste ricevute 
export const getAllTypeFriendState = createSelector(
  [getlistFriendWithSendRequestState, getlistRequestFriendState],
  (listFriendWithSendRequest, listRequestFriendState)  => {
   
    return [listRequestFriendState, ...listFriendWithSendRequest  ]
  }
);

// prendo chi seguo
export const getFollowedState = createSelector(
  [getFollowed],
  followed => (followed ? followed : [])
);

// prendo chi mi segue
export const getFollowState = createSelector(
  [getFollow],
  follow => (follow ? follow : [])
);

export const getStatusState = createSelector(
  [getStatus],
  status => (status ? status : false)
);

export const getTabState = createSelector(
  [getTab],
  tab => (tab ? tab : "FOLLOWING")
);

