import {
  FETCHING_DATA_FOLLOW,
  FETCHING_DATA_FOLLOW_COMPLETE,
  GET_FOLLOWING,
  GET_FOLLOWER,
  SET_SELECTION_FOLLOW
} from "./ActionTypes";
import DefaultState from "./DefaultState";
import { LOG_OUT } from "../screen/ActionTypes";

export default (state = DefaultState, action) => {
  switch (action.type) {
    case FETCHING_DATA_FOLLOW:
      {
        return { ...state, fetchingData: true };
      }
      break;
    case FETCHING_DATA_FOLLOW_COMPLETE:
      {
        return { ...state, fetchingData: false };
      }
      break;

    case GET_FOLLOWING:
      const followed = action.payload.map(elem => {
        return {
          ...elem,
          user_followed: {
            
            ...elem.user_followed.private_profile,
            ...elem.user_followed.public_profile,
            ...elem.user_followed,
          },
          user_follower: {
            
            ...elem.user_follower.private_profile,
            ...elem.user_follower.public_profile,
            ...elem.user_follower,
          }
        };
      });
      {
        return { ...state, followed: followed, fetchingData: false };
      }
      break;

    case GET_FOLLOWER:
        const follow = action.payload.map(elem => {
          return {
            ...elem,
            user_followed: {
            
              ...elem.user_followed.private_profile,
              ...elem.user_followed.public_profile,
              ...elem.user_followed,
            },
            user_follower: {
              
              ...elem.user_follower.private_profile,
              ...elem.user_follower.public_profile,
              ...elem.user_follower,
            }
          };
        });
      {
        return { ...state, follow: follow, fetchingData: false };
      }
      break;

    case SET_SELECTION_FOLLOW:
      {
        return {
          ...state,
          selectedFriend: action.payload
        };
      }
      break;

    case LOG_OUT:
      {
        return DefaultState;
      }
      break;

    default:
      {
        return state;
      }
      break;
  }
};
