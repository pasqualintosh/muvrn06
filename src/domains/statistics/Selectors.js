import { createSelector } from 'reselect'


const getWeekActivities = state => state.statistics.weekActivities;

const getPermActivities = state => state.statistics.permActivities;


const getStatistics = state => state.statistics;




// prendo le attività settimane effettuate dal cell con i servizi Health e fit 
export const getWeekActivitiesState = createSelector(
  [getWeekActivities],
  weekActivities => (weekActivities ? weekActivities : [])
);

export const getStatisticsState = createSelector(
  [getStatistics],
  statistics => (statistics ? statistics : [])
);

export const getPermActivitiesState = createSelector(
  [getPermActivities],
  perm => (perm ? perm : false)
);
