import { createSelector } from 'reselect'



const getCars = state => state.register.get_mobility_car_values;


const getall = state => state;


// opzioni di auto
export const getallState = createSelector(
  [getall],
  cars =>  {
    console.log(cars)
    return(cars ? cars : [])
  }
  
);

// opzioni di auto
export const getCarsState = createSelector(
  [getCars],
  cars =>  {
    console.log(cars)
    return(cars ? cars : [])
  }
  
);
