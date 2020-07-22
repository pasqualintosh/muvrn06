const state = {
  id: 0, // id della trip complessiva
  sub_trip: null, // id della sotto tratta ,
  numSubTrip: 0, // per capire quale sub trip è, 0 prima , 1 seconda, cosi non ho id e subid capisco sempre l'ordine 
  numTrip: 0, // per capire quale trip è, 1 ecc, ogni trip ha un codice univoco che mi permette di unire le varie sub trip
  route: [],
  routeAnalyzed: [],
  routeNotvalid: [],
  groupPooling: [],
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
  tempWeatherInC: null,
  NumDaysRoute: 0,
  PreviousRoute: [],
  speed: 0,
  distanceLive: 0,
  still_notification_log: "",
  previousType: "Walking",
  play_from_notification: false,
  cityRoute: null, // info della città in cui si trova l'utente quando avvia una tratta  (prima prendo la città)
  infoIdCity: null, // info sugli id ottenuti dal backend per identificare la città corrente (poi la città la salvo sul db per identificarla e uso questo id per associarla alla tratta)
  
};

export default state;



/* info punto gps 
key(pin):1591967597439
speed(pin):3.75
time(pin):"2020-06-12T15:13:16+02:00"
longitude(pin):-122.03072774
latitude(pin):37.33142585
altitude(pin):0

*/

/* live 
previousType(pin):"Walking" , modalità precedente 
sendStartTime(pin):1591967638620, quando ho mandato il create 

*/

/* per previous route  
id(pin):431 // id della tratta, si conserva pe ogni subtrip
sub_trip: {
id(pin):462 // dettagli sulla singola subtrip, cambia 
distance(pin):0
start_time(pin):"2020-06-12T15:13:15+02:00"
end_time(pin):null
duration(pin):"00:00:00"
points(pin):0
calories(pin):0
co2(pin):0
validation(pin):null
linestring(pin):null
trip(pin):431
typology(pin):1
motivation(pin):null
car_pool(pin):null
}
numSubTrip(pin):0 // numero della subtrip 0 la prima ecc 
numTrip(pin):"2020-06-12T15:13:15+02:00" // identifica il trip, quindi è uguale per ogni subtrip 
route(pin): 
routeAnalyzed(pin):
groupPooling(pin): // gruppo del pooling, utile per il live
activity(pin):
activityAnalyzed(pin):
points(pin):0
totPoints(pin):0
distance(pin):0
totDistance(pin):0
status(pin):""
numValidRoute(pin): 
activityChoise: {
type(pin):"Walking" // dettagli sulla modalità
coef(pin):1200
threshold(pin):5
}
refTrasportRoute(pin):
typeWeather(pin):"Clouds" // tipologia di meteo, uguale per ogni trip
tempWeatherInC(pin):13.890000000000043 // temperatura in celsus, uguale per ogni trip
PrecDistanceSameMode(pin):0
speed(pin):4.05 // ultima velocità istantanea 
time_travelled(pin):null
distanceLive(pin):0.22899999999999998
end_time_subTrip(pin):"2020-06-12T15:14:54+02:00"  // quando inizia e finisce il subtrip 
start_time_subTrip(pin):"2020-06-12T15:13:15+02:00" // tempo d'inizio del singolo subtrip
cityRoute: { // info sulla città in cui si sta facendo il trip
administrative_area_level_3_city_name(pin):""
administrative_area_level_2_city_name(pin):"Contea di Santa Clara"
administrative_area_level_1_city_name(pin):"California"
country_city_name(pin):"Stati Uniti"
}
infoIdCity(pin):1 // id della citta in cui si sta facendo il trip
Saved(pin):true  // la tratta è stata salvato nel db 
*/