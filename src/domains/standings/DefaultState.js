const state = {
  standing: [],
  cityStanding: [],
  communityStanding: [],
  error: false,
  infoUserGlobalClassification: { index: "-", points: 0, number: "-" },
  infoUserCityClassification: { index: "-", points: 0, number: "-" },
  infoUserCommunityClassification: { index: "-", points: 0, number: "-" },
  infoUserFriendsClassification: { index: "-", points: 0, numFriend: "-" },
  selectedLeaderboard: "global",
  selectedTiming: "weekly",
  indexTiming: "0",
  fetchingData: false,
  trophies: [],
  follow: [],
  followed: []
};

export default state;
