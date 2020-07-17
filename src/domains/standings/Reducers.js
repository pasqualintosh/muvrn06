import {
  GET_LEADBOARD,
  GET_LEADBOARD_BY_CITY,
  GET_LEADBOARD_FAILED,
  SET_LEADERBOARD_SELECTED,
  SET_LEADERBOARD_TIMING,
  FETCHING_DATA,
  FETCHING_DATA_COMPLETE,
  GET_TROPHIES,
  GET_LEADBOARD_BY_COMMUNITY,
  GET_LEADBOARD_FRIEND,
  GET_POSITION
} from "./ActionTypes";
import DefaultState from "./DefaultState";
import { LOG_OUT } from "../login/ActionTypes";

export default (state = DefaultState, action) => {
  switch (action.type) {
    case GET_LEADBOARD:
      {
        let infoUserGlobalClassification = { index: "-", points: 0, number: "-" };

        for (index = 0; index < action.payload.length; index++) {
          const condition =
            action.payload[index].referred_route__user_id === action.user
              ? true
              : false;
          if (condition) {
            infoUserGlobalClassification = {
              ...action.payload[index],
              index,
              number: action.payload.length
            };
            break;
          }
        }
        console.log(infoUserGlobalClassification);
        return {
          ...state,
          standing: [...action.payload],
          infoUserGlobalClassification,
          error: false,
          fetchingData: false
        };
      }
      break;
    case GET_LEADBOARD_BY_CITY:
      {
        let infoUserCityClassification = { index: "-", points: 0,  number: "-"  };

        for (index = 0; index < action.payload.length; index++) {
          const condition =
            action.payload[index].referred_route__user_id === action.user
              ? true
              : false;
          if (condition) {
            infoUserCityClassification = {
              ...action.payload[index],
              index,
              
              number: action.payload.length
            };
            break;
          }
        }
        console.log(infoUserCityClassification);
        return {
          ...state,
          cityStanding: [...action.payload],
          infoUserCityClassification,
          error: false,
          fetchingData: false
        };
      }
      break;
      case GET_POSITION:
        {
          
          let Classification = { index: "-", points: 0,  number: "-"  };
  
          try {
            Classification = { index: action.payload.user_rank != '-' ? (action.payload.user_rank - 1) : action.payload.user_rank, points: action.payload.user_points,  number: action.payload.total_users  };
          } catch {
            Classification = { index: "-", points: 0,  number: "-"  };
          }

          const typePosition = action.typePosition ? action.typePosition  : 'infoUserCityClassification'


            
            
            
          
         
          return {
            ...state,
            [typePosition]: Classification,
            error: false,
            fetchingData: false
          };
        }
      break;
      
    case GET_LEADBOARD_BY_COMMUNITY:
      {
        let infoUserCommunityClassification = { index: "-", points: 0,  number: "-"  };

        for (index = 0; index < action.payload.length; index++) {
          const condition =
            action.payload[index].referred_route__user_id === action.user
              ? true
              : false;
          if (condition) {
            infoUserCommunityClassification = {
              ...action.payload[index],
              index, number: action.payload.length
            };
            break;
          }
        }
        console.log(infoUserCommunityClassification);
        return {
          ...state,
          communityStanding: [...action.payload],
          infoUserCommunityClassification,
          error: false,
          fetchingData: false
        };
      }
      break;
      case GET_LEADBOARD_FRIEND:
      {
        // let infoUserFriendsClassification = { index: "-", points: 0 };

        // for (index = 0; index < action.payload.length; index++) {
        //   const condition =
        //     action.payload[index].referred_route__user_id === action.user
        //       ? true
        //       : false;
        //   if (condition) {
        //     infoUserFriendsClassification = {
        //       ...action.payload[index],
        //       index
        //     };
        //     break;
        //   }
        // }

        // [...action.payload]
        // console.log(infoUserFriendsClassification);
        // return {
        //   ...state,
        //   standing: [...action.payload],
        //   infoUserFriendsClassification,
        //   error: false,
        //   fetchingData: false
        // };

        

        
       
        return {
          ...state,
          infoUserFriendsClassification: action.payload,
          standing: action.standing,
          error: false,
          fetchingData: false
        };
      }
      break;

    case SET_LEADERBOARD_SELECTED:
      {
        return {
          ...state,
          selectedLeaderboard: action.payload
        };
      }
      break;

    case GET_TROPHIES:
      {
        return {
          ...state,
          trophies: action.payload
        };
      }
      break;

    case SET_LEADERBOARD_TIMING:
      {
        return {
          ...state,
          selectedTiming: action.payload.timing,
          indexTiming: action.payload.index
        };
      }
      break;
    case GET_LEADBOARD_FAILED:
      {
        return { ...state, error: true };
      }
      break;
    case FETCHING_DATA:
      {
        return { ...state, fetchingData: true };
      }
      break;
    case FETCHING_DATA_COMPLETE:
      {
        return { ...state, fetchingData: false };
      }
      break;

    // case GET_FOLLOWING:
    //   {
    //     return { ...state, followed: action.payload, fetchingData: false };
    //   }
    //   break;

    // case GET_FOLLOWER:
    //   {
    //     return { ...state, follow: action.payload, fetchingData: false };
    //   }
    //   break;

    case LOG_OUT:
      {
        // cancello tutto
        // date lo conservo cosi lo uso per sapere se l'utente è stato mai registrato o no
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
