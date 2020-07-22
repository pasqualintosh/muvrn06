import { createSelector } from "reselect";

const getWeekActivities = state => state.statistics.weekActivities;

const getPermActivities = state => state.statistics.permActivities;

const getStatistics = state => state.statistics;

const getStatusActivity = state => state.statistics.statusActivity;

// prendo le attività settimane effettuate dal cell con i servizi Health e fit
export const getWeekActivitiesState = createSelector(
  [getWeekActivities],
  weekActivities => (weekActivities ? weekActivities : [])
);

export const getStatisticsState = createSelector([getStatistics], statistics =>
  statistics ? statistics : []
);

export const getPermActivitiesState = createSelector(
  [getPermActivities],
  perm => (perm ? perm : false)
);

export const getStatusActivityState = createSelector(
  [getStatusActivity],
  statusActivity => (statusActivity ? statusActivity : {
    minActivity: 0, // minuti di oggi 
    points: 0, // punti per le varie soglie 
    dateActivity: "",  // quando è stata calcolata l'attività
    bonusType: 0, // tipo di bonus ottenuto 0, 1 30 per tre giorni, 2: 60 , 3: 90
    dateBonus: "", // quando è stato aggiornato il bonus 
  })
);

