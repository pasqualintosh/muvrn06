import {
  GET_CHALLENGES,
  SUBSCRIBE_CHALLENGE,
  DELETE_LOCAL_CHALLENGE,
  GET_SCORE,
  GET_REWARDS_LIST,
  GET_ACTIVE_CHALLENGES_LIST,
  GET_REWARDS_CATEGORY,
  GET_REWARDS_LIST_BY_USER,
  PATCH_REWARD,
  GET_CHALLENGES_ALLOWED
} from "./ActionTypes";
import {
  requestBackend,
  RefreshToken,
  requestCallback,
  getProfile,
  RefreshTokenObligatory,
  requestNewBackend,
  forceRefreshTokenWithCallback
} from "./../login/ActionCreators"; // da far puntare agli helper!!!
import WebService from "./../../config/WebService";
import { store } from "../../store";

export function getChallenges(dataUser = {}) {
  return async function backendRequest(dispatch, getState) {
    console.log("getChallenges");
    let { access_token } = getState().login;

    // dispatch({
    //   type: FETCHING_DATA
    // });
    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail

    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/gaming/sponsored_challenge/",
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log("getChallenges");
      console.log(response);

      if (response.status === 200) {
        dispatch({
          type: GET_CHALLENGES,
          payload: { available_challenges: [...response.data] }
        });
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app
        dispatch(forceRefreshTokenWithCallback(getChallenges(dataUser)));
      }
    } catch (error) {
      console.log("getChallenges");
      console.log(error);
      // dispatch({
      //   type: FETCHING_DATA_COMPLETE
      // });
    }
  };
}

export function postSubscribeChallenge(
  id = 0,
  updateState = () => {},
  dataUser = { limit: 100, offset: 0 }
) {
  return async function backendRequest(dispatch, getState) {
    console.log("postSubscribeChallenge");
    let { access_token } = getState().login;
    const { limit, offset } = dataUser;

    // dispatch({
    //   type: FETCHING_DATA
    // });
    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail

    try {
      const response = await requestNewBackend(
        "post",
        "/api/v1/gaming/sponsored_challenge_submit/" + id,
        access_token,
        { challenge_id: id },
        "application/json",
        "Bearer"
      );
      console.log("postSubscribeChallenge");
      console.log(id);
      console.log(response);

      if (response.status === 201) {
        updateState();
        dispatch({
          type: SUBSCRIBE_CHALLENGE,
          payload: {
            subscribed_challenges_data: {
              subscribed_challenges_data: [...response.data]
            }
          }
        });
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app
        dispatch(forceRefreshTokenWithCallback(postSubscribeChallenge(id)));
      } else {
        alert(response.data);
      }
      // else if (response.status == 404) {
      //   // not in time o non so cos'altro
      //   alert(response.data);
      // } else if (response.status == 400) {
      //   // not in time o non so cos'altro
      //   alert(response.data);
      // } else if (response.status == 401) {
      //   // se il token è scaduto
      //   // lo rinnovo e poi ricarico le richieste dall'app
      //   dispatch(forceRefreshTokenWithCallback(postSubscribeChallenge(id)));
      // }
    } catch (error) {
      console.log("postSubscribeChallenge");
      console.log(error);
      // dispatch({
      //   type: FETCHING_DATA_COMPLETE
      // });
    }
  };
}

export function getChallengesRewards(dataUser = {}) {
  return async function backendRequest(dispatch, getState) {
    console.log("getChallengesRewards");
    let { access_token } = getState().login;

    // dispatch({
    //   type: FETCHING_DATA
    // });
    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail

    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/gaming/sponsored_challenge_rewards/",
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log("getChallengesRewards");
      console.log(response);

      if (response.status === 200) {
        dispatch({
          type: GET_REWARDS_LIST,
          payload: { rewards_list: [...response.data] }
        });
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app
        dispatch(forceRefreshTokenWithCallback(getChallengesRewards(dataUser)));
      }
    } catch (error) {
      console.log("getChallengesRewards");
      console.log(error);
      // dispatch({
      //   type: FETCHING_DATA_COMPLETE
      // });
    }
  };
}

export function getChallengeRankingByUser(dataUser = {}) {
  return async function backendRequest(dispatch, getState) {
    console.log("getChallengeRankingByUser");
    let { access_token } = getState().login;

    // dispatch({
    //   type: FETCHING_DATA
    // });
    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail

    try {
      // "/api/v1/gaming/sponsored_challenge_ranking_by_user/",
      const response = await requestNewBackend(
        "get",
        `/api/v1/gaming/sponsored_challenge_ranking_by_user/`,
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log("getChallengeRankingByUser");
      console.log(response);

      if (response.status === 200) {
        dispatch({
          type: GET_ACTIVE_CHALLENGES_LIST,
          payload: { active_challenges: [...response.data] }
        });
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app
        dispatch(
          forceRefreshTokenWithCallback(getChallengeRankingByUser(dataUser))
        );
      }
    } catch (error) {
      console.log("getChallengeRankingByUser");
      console.log(error);
      // dispatch({
      //   type: FETCHING_DATA_COMPLETE
      // });
    }
  };
}

export function getChallengeRankingById(
  id = 1,
  saveData = () => {},
  dataUser = { limit: 100, offset: 0 }
) {
  return async function backendRequest(dispatch, getState) {
    console.log("getChallengeRankingById");
    let { access_token } = getState().login;
    const { limit, offset } = dataUser;

    // dispatch({
    //   type: FETCHING_DATA
    // });
    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail

    try {
      const response = await requestNewBackend(
        "get",
        `/api/v1/gaming/sponsored_challenge_ranking/${id}?limit=${limit}&offset=${offset}`,
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log("getChallengeRankingById");
      console.log(response);

      if (response.status === 200) {
        // dispatch({
        //   type: GET_ACTIVE_CHALLENGES_LIST,
        //   payload: { active_challenges: [...response.data] }
        // });
        saveData(response.data);
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app
        dispatch(
          forceRefreshTokenWithCallback(getChallengeRankingById(id, dataUser))
        );
      }
    } catch (error) {
      console.log("getChallengeRankingById");
      console.log(error);
      // dispatch({
      //   type: FETCHING_DATA_COMPLETE
      // });
    }
  };
}

export function getRewardsCategory(dataUser = {}) {
  return async function backendRequest(dispatch, getState) {
    console.log("getRewardsCategory");
    let { access_token } = getState().login;

    // dispatch({
    //   type: FETCHING_DATA
    // });
    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail

    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/gaming/sponsored_challenge_rewards_category/",
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log("getRewardsCategory");
      console.log(response);

      if (response.status === 200) {
        dispatch({
          type: GET_REWARDS_CATEGORY,
          payload: { reward_categories: [...response.data] }
        });
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app
        dispatch(forceRefreshTokenWithCallback(getRewardsCategory(dataUser)));
      }
    } catch (error) {
      console.log("getRewardsCategory");
      console.log(error);
      // dispatch({
      //   type: FETCHING_DATA_COMPLETE
      // });
    }
  };
}

export function getChallengesRewardsByUser(dataUser = {}) {
  return async function backendRequest(dispatch, getState) {
    console.log("getChallengesRewardsByUser");
    let { access_token } = getState().login;

    // dispatch({
    //   type: FETCHING_DATA
    // });
    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail

    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/gaming/sponsored_challenge_rewards_by_user/",
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log("getChallengesRewardsByUser");
      console.log(response);

      if (response.status === 200) {
        dispatch({
          type: GET_REWARDS_LIST_BY_USER,
          payload: { user_rewards: [...response.data] }
        });
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app
        dispatch(
          forceRefreshTokenWithCallback(getChallengesRewardsByUser(dataUser))
        );
      }
    } catch (error) {
      console.log("getChallengesRewardsByUser");
      console.log(error);
      // dispatch({
      //   type: FETCHING_DATA_COMPLETE
      // });
    }
  };
}

export function patchReward(
  id = 0,
  updateState,
  dataUser = { limit: 100, offset: 0 }
) {
  return async function backendRequest(dispatch, getState) {
    console.log("patchReward");
    let { access_token } = getState().login;
    const { limit, offset } = dataUser;

    // dispatch({
    //   type: FETCHING_DATA
    // });
    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail

    try {
      const response = await requestNewBackend(
        "patch",
        "/api/v1/gaming/sponsored_challenge_rewards/" + id,
        access_token,
        { status: 2 },
        "application/json",
        "Bearer"
      );
      console.log("patchReward");
      console.log(response);

      if (response.status === 200) {
        updateState();
        dispatch({
          type: PATCH_REWARD,
          payload: {
            reward: { ...response.data }
          }
        });
      } else if (response.status == 404) {
        // not in time o non so cos'altro
        // alert(response.data);
      } else if (response.status == 400) {
        // not in time o non so cos'altro
        // alert(response.data);
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app
        dispatch(forceRefreshTokenWithCallback(patchReward(id)));
      }
    } catch (error) {
      console.log("patchReward");
      console.log(error);
      // dispatch({
      //   type: FETCHING_DATA_COMPLETE
      // });
    }
  };
}

export function getChallengesAllowed(dataUser = {}) {
  return async function backendRequest(dispatch, getState) {
    console.log("getChallengesAllowed");
    let { access_token } = getState().login;

    // dispatch({
    //   type: FETCHING_DATA
    // });
    // se ha successo aggiorno lo stato redux, altrimenti mando un azione con fail

    try {
      const response = await requestNewBackend(
        "get",
        "/api/v1/gaming/sponsored_challenge_allowed_by_user/",
        access_token,
        null,
        "application/json",
        "Bearer"
      );
      console.log("getChallengesAllowed");
      console.log(response);

      if (response.status === 200) {
        dispatch({
          type: GET_CHALLENGES_ALLOWED,
          payload: { allowed_challenges: [...response.data] }
        });
      } else if (response.status == 401) {
        // se il token è scaduto
        // lo rinnovo e poi ricarico le richieste dall'app
        dispatch(forceRefreshTokenWithCallback(getChallengesAllowed(dataUser)));
      }
    } catch (error) {
      console.log("getChallengesAllowed");
      console.log(error);
      // dispatch({
      //   type: FETCHING_DATA_COMPLETE
      // });
    }
  };
}
