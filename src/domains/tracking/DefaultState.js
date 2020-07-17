const state = {
  route: [],
  routeAnalyzed: [],
  routeNotvalid: [],
  activity: [],
  activityAnalyzed: [],
  routeDataSaved: false,
  distance: 0,
  totDistance: 0,
  points: 0,
  totPoints: 0,
  activityChoice: { type: "", coef: 0, threshold: 0 },
  status: "",
  numValidRoute: [],
  refTrasportRoute: [],
  PrecDistanceSameMode: 0,
  DailyRoutine: [],
  typeWeather: "",
  NumDaysRoute: 0,
  PreviousRoute: [],
  speed: 0,
  distanceLive: 0,
  still_notification_log: "",
  previousType: "Walking"
};

export default state;
