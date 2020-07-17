import { UPDATE_STATUS_SCREEN, GET_INFO_SCREEN, UPDATE_TOURNAMENT, UPDATE_PLAYOFF } from "./ActionTypes";
import DefaultState from "./DefaultState";
import { LOG_OUT } from "../login/ActionTypes";

export default (state = DefaultState, action) => {
  switch (action.type) {
    case UPDATE_STATUS_SCREEN:
      {
        return { ...state, status: action.payload.status };
      }
      break;

    case GET_INFO_SCREEN:
      {
        return {
          ...state,
          ...action.payload,
          status: ""
        };
      }
      break;
      case UPDATE_TOURNAMENT:
      {
        return {
          ...state,
          tournament: action.payload,
          status: ""
        };
      }
      break;
      case UPDATE_PLAYOFF:
      {
        const index = action.season_playoff ? action.season_playoff : 1
        const playoffNew = action.payload.playoff ? action.payload.playoff : {
          "id": 3,
          "start_time": "2019-09-23T04:30:00Z",
          "end_time": null,
          "team_count": 16,
          "phases": 4,
          "current_phase": 1
      }
      let playoff = state.playoff ? state.playoff : [[], [], [], [], []]

      // controllo se se la fase corrente è uguale a quella che ho chiesto
      if (index == playoffNew.current_phase ) {

        
        
        // calcolo il match corrente per la città che sta giocando

        // prendo le partite catturate
        const match = action.payload.tree ? action.payload.tree : {}
        // converto l'oggetto in un array
        let matchArray = []
        // aggiorno il match corrente 
        let tournament = null
        // uso city_id passato come payload
        for (var key in match) {
          if (match.hasOwnProperty(key)) {
            const newMatch = match[key].map( elem => {
              if(!tournament && (action.city_id == elem.season_match.season_match.city_home.id ||  action.city_id == elem.season_match.season_match.city_away.id))  {
                tournament = { ...elem.season_match, key}
              }
              return({ ...elem.season_match})
            })
            // accodo tutti i match
            console.log(matchArray)
            console.log(newMatch)
            matchArray = [...matchArray, ...newMatch]
            console.log(matchArray)
          }
        }
        console.log(tournament)

        // season_playoff se è 4 e il torneo è concluso, aggiorno il vincitore
        if (index == 4 && matchArray.length) {
         
          const Now = new Date().getTime()
          const endPlayoff = matchArray[0].season_match.end_match
          console.log(endPlayoff)
          console.log(matchArray[0])
          const playoffEnd = Now >= new Date(endPlayoff).getTime()
          if (playoffEnd) {
            let winner = {}
          //   "city_home": {
          //     "id": 547,
          //     "lat": 41.894802,
          //     "lon": 12.4853384,
          //     "city_name": "Roma",
          //     "city_name_eng": "Rome",
          //     "country_name": null
          // },
            // se è finito 
            // prendo la prima squadra che ha vinto il primo match e il mio match
            if (match.hasOwnProperty("8")) {
              firstMatch = match["8"][0]
              winHome = firstMatch.season_match.total_point_home >= firstMatch.season_match.total_point_away
              if (winHome) {
                winner.firstCity = firstMatch.season_match.season_match.city_home
              } else {
                winner.firstCity = firstMatch.season_match.season_match.city_away
              }
          }
          console.log(match)
          if (match.hasOwnProperty(tournament.key)) {
            ownMatch = match[tournament.key][0]
            // la mia città
            if(action.city_id == ownMatch.season_match.season_match.city_home.id )  {
              winner.ownCity = ownMatch.season_match.season_match.city_home
            } else {
              winner.ownCity = ownMatch.season_match.season_match.city_away
            }
            // calcolo la mia posizione 
            winHome = ownMatch.season_match.total_point_home >= ownMatch.season_match.total_point_away

            if (winHome) {
              winner.ownPosition = ((tournament.key - 7) * 2) - 1
            } else {
              winner.ownPosition = ((tournament.key - 7) * 2) 
            }

        }
        // un array con un solo oggetto, ovvero vincitore, propria squadra e posizione 
        // nell'ultima posizione metto questa informazione 
        // firstCity, ownCity, ownPosition
        playoff[4] = [winner]

        }
      }

        playoff[index - 1] = matchArray
        


      //   "match": {
      //     "season_match_id": 639,
      //     "start_match": "2019-09-23T04:30:00Z",
      //     "end_match": "2019-09-29T17:00:00Z",
      //     "week_name_match": "Playoff 8",
      //     "season": "2019",
      //     "group": null,
      //     "city_home": {
      //         "id": 1122,
      //         "lat": 38.1112268,
      //         "lon": 13.3524434,
      //         "city_name": "Palermo",
      //         "city_name_eng": null,
      //         "country_name": "Italy"
      //     },
      //     "city_away": {
      //         "id": 1169,
      //         "lat": 19.6449706,
      //         "lon": 44.768663,
      //         "city_name": "Šabac",
      //         "city_name_eng": "Šabac",
      //         "country_name": null
      //     }
      // },
      // "result": {
      //     "weekly_user_standing_home": null,
      //     "weekly_user_standing_away": null,
      //     "total_point_home": 0,
      //     "total_point_away": 0
      // }

//         me: 0
// season_match: {season_match_id: 529, start_match: "2019-10-14T04:30:00Z", end_match: "2019-10-20T17:00:00Z", week_name_match: "Week 4", season: "2019", …}
// total_point_away: 0
// total_point_home: 0
// weekly_user_standing_away: {first_pos: null, second_pos: null, third_pos: null, first_points: 0, second_points: 0, …}
// weekly_user_standing_home: {first_pos: null, second_pos: null, third_pos: null, first_points: 0, second_points: 0, …}

        return {
          ...state,
          tournament,
          playoff,
          status: ""
        };
      } else {
        
        
        // calcolo il match corrente per la città che sta giocando

        // prendo le partite catturate
        const match = action.payload.tree ? action.payload.tree : {}
        // converto l'oggetto in un array
        let matchArray = []
        // aggiorno il match corrente 
        
        // uso city_id passato come payload
        for (var key in match) {
          if (match.hasOwnProperty(key)) {
            const newMatch = match[key].map( elem => {
              
              return({ ...elem.season_match})
            })
            // accodo tutti i match
            console.log(matchArray)
            console.log(newMatch)
            matchArray = [...matchArray, ...newMatch]
            console.log(matchArray)
          }
        }
        

        playoff[index - 1] = matchArray
        
         
        return {
          ...state,
          playoff,
          status: ""
        };
      }

        
      }
      break;
      

    case LOG_OUT:
      {
        // cancello tutto
        return DefaultState;
      }
      break;

    default:
      return state;
  }
};
