import { createSelector } from 'reselect'

const getFollow = state => state.follow.follow;

const getFollowed = state => state.follow.followed;

const getStatus = state => state.follow.fetchingData;

const getTab = state => state.follow.selectedFriend;




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

