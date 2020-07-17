const state = {
  fetchingData: false,
  status: "",
  id: 0,
  name: "Newbie",
  level_number: 1,
  change_level: "2018-09-11T13:51:49.358083Z",
  training_sessions: [
    {
      id: -1,
      status: 0,
      updated_at: "2018-09-10T15:50:32.177018Z",
      trainingSessionId: -1
    }
  ],
  special_training_sessions: [],
  subscribed_special_training: [],
  special_training_session_subscribed: [],
  training_events: [
    {
      id: 4,
      status: 0,
      updated_at: "2018-09-11T13:51:49.358083Z",
      event: {}
    }
  ],
  offline_training_event: [],
  quiz: [],
  quizComplete: [],
  idQuiz: 0,
  typeQuiz: "",
  selectedScreen: "myself",
  statusCheckEvents: {},
  available_st_event: [],
  offline_st_reward: [],
  new_st_pivots: [],
  completed_st_pivots: [],
  redeemed_rewards: [],
  st_teatro_massimo: false,
  st_ballarak: false,
  st_muvtoget: false,
  st_kalsa: false
};

export default state;
