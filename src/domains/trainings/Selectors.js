import { createSelector } from 'reselect'



const getLevel = state => state.trainings.name;



export const getLevelState = createSelector(
  [getLevel],
  level => (level ? level : "Newbie")
);

