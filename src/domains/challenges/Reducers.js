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
import DefaultState from "./DefaultState";
import { ClippingRectangle } from "react-native";

export default (state = DefaultState, action) => {
  switch (action.type) {
    case GET_CHALLENGES:
      return {
        ...state,
        available_challenges: action.payload.available_challenges
      };

    case SUBSCRIBE_CHALLENGE:
      return {
        ...state,
        subscribed_challenges_data: action.payload.active_challenge
      };

    case GET_REWARDS_LIST:
      return {
        ...state,
        rewards_list: action.payload.rewards_list
      };

    case GET_REWARDS_LIST_BY_USER:
      let won_challenges_array = [],
        user_rewards_response = [];

      action.payload.user_rewards.forEach(e => {
        user_rewards_response.push(e.challenge);
      });

      state.available_challenges.forEach(challenge => {
        if (user_rewards_response.includes(challenge.id)) {
          won_challenges_array.push(challenge);
        }
      });

      return {
        ...state,
        user_rewards: action.payload.user_rewards,
        won_challenges_array
      };

    case GET_ACTIVE_CHALLENGES_LIST:
      let active_challenges_array = [],
        active_challenges_response = [];

      action.payload.active_challenges.forEach(e => {
        active_challenges_response.push(e.challenge);
      });

      state.available_challenges.forEach(challenge => {
        if (active_challenges_response.includes(challenge.id)) {
          active_challenges_array.push(challenge);
        }
      });

      return {
        ...state,
        active_challenges: action.payload.active_challenges,
        active_challenges_array
      };

    case GET_REWARDS_CATEGORY:
      return {
        ...state,
        reward_categories: action.payload.reward_categories
      };

    case PATCH_REWARD:
      let user_rewards = [...state.user_rewards].filter(e => {
        return e.id != action.payload.reward.id;
      });
      user_rewards.push(action.payload.reward);

      return {
        ...state,
        user_rewards
      };

    case GET_CHALLENGES_ALLOWED:
      let allowed_challenges = [],
        allowed_challenges_response = [];

      action.payload.allowed_challenges.forEach(e => {
        allowed_challenges_response.push(e.challenge);
      });

      state.available_challenges.forEach(challenge => {
        if (allowed_challenges_response.includes(challenge.id)) {
          allowed_challenges.push(challenge);
        }
      });

      return {
        ...state,
        allowed_challenges
      };

    default:
      return state;
  }
};
