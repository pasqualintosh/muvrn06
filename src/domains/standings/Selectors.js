import { createSelector } from 'reselect'

const getStandings = state => state.standings;


export const getGlobalInfoState = createSelector(
  [getStandings],
  standings => standings.infoUserGlobalClassification
);

export const getCityInfoState = createSelector(
  [getStandings],
  standings => standings.infoUserCityClassification
);

export const getFriendInfoState = createSelector(
  [getStandings],
  standings => standings.infoUserFriendsClassification
);

export const getCommunityInfoState = createSelector(
  [getStandings],
  standings => standings.infoUserCommunityClassification
);

export const getSelectedLeaderboardState = createSelector(
  [getStandings],
  standings =>
    standings.selectedLeaderboard ? standings.selectedLeaderboard : "city"
);

export const getStandingsState = createSelector(
  [getStandings],
  StandingsState => StandingsState
);

