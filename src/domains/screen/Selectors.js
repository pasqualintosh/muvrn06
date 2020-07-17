import { createSelector } from 'reselect'


const getCurrentMatch = state => state.screen.tournament;

const getPlayoffMatch = state => state.screen.playoff;






// prendo il match corrente 
export const getCurrentMatchState = createSelector(
  [getCurrentMatch],
  match => (match ? match : null)
);

// prendo i playoff
export const getPlayoffMatchState = createSelector(
  [getPlayoffMatch],
  playoff => (playoff ? playoff : [[], [], [], [], []])
);

