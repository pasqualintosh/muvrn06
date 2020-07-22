import { createSelector } from "reselect";

const getPlay = state => state.tracking.activityChoice.type;
const getPlayPrevious = state => state.tracking.previousType;

const getGroupPooling = state => state.tracking.groupPooling;


export const getPlayState = createSelector([getPlay], type => type.length);

export const getPlayPreviousState = createSelector([getPlayPrevious], type =>
  type ? type : "Walking"
);

export const getsubTrip = state => state.tracking.sub_trip;

export const getsubTripState = createSelector([getsubTrip], subtrip =>
  subtrip ? subtrip : { points: 0, distance: 0 }
);


const getActivity = state => state.tracking.activityChoice;

export const getActivityState = createSelector(
  [getActivity],
  activityChoice => activityChoice
);

const getDistanceLive = state => state.tracking.distanceLive;

export const getDistanceLiveState = createSelector(
  [getDistanceLive],
  distance => distance
);

const getNumSubTrip = state => state.tracking.numSubTrip;

export const getNumSubTripState = createSelector(
  [getNumSubTrip],
  numSubTrip => numSubTrip
);

// prendo il gruppo corrente per il pooling
export const getGroupPoolingState = createSelector(
  [getGroupPooling],
  group => group ? group : []
);

// prendo il numero di utenti nel gruppo
export const getGroupPoolingLenghtState = createSelector(
  [getGroupPoolingState],
  group => group.length
);




