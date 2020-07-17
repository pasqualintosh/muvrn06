import { createSelector } from 'reselect'

const getPlay = state => state.tracking.activityChoice.type;
const getPlayPrevious = state => state.tracking.previousType;

export const getPlayState = createSelector(
  [getPlay],
  type => type.length
);

export const getPlayPreviousState = createSelector(
  [getPlayPrevious],
  type => (type ? type : "Walking")
);

