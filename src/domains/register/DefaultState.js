// status utile per dare eventiuali errori di login tipo email sbagliata o password

const state = {
  username: "",
  password: "",
  access_token: 0,
  refresh_token: 0,
  date: 0,
  status: true,
  coins: 0,
  points: 0,
  routesCompleted: 0,
  kmTravelled: 0,
  email_is_present: false,
  get_mobility_car_values: [],
  get_mobility_moto_values: [],
  car_owning_answer: 0,
  car_year: "aaaa",
  car_segment_answer: "",
  car_fuel: "",
  car: 0, 
  moto: 0,
  bike: 0,
  moto_owning_answer: 0,
  moto_year: "aaaa",
  moto_engine_answer: "",
  moto_cc_answer: "",
  frequent_trip_start: null,
  frequent_trip_end: null,
  name: "",
  surname: "",
  phone: "",
  password: "",
  email: "",
  social_backend: null, // identifica il tipo di registrazione che sto svolgendo tipo null, google-oauth2, facebook
  access_token_social: null, // accessToken ottenuto dal social 
  location:{
    "latitude": 0, //  posizione salvata in fase di registrazione  
    "longitude": 0
},
  followed_user_id: null,
  referral_url: null,
  link_status: null,
  referral_from_registration: null,
  car_segment: null,
  nearestCity: "",
  frequent_trip_type_start: 1,
  frequent_trip_type_end: 2,
  prefix: null,
  autocompleteCityName: "",
  frequent_trip_start_time: null,
  frequent_trip_choosed_weekdays: {
    0: false,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: false
  },
  // dati relativi agli slider per il proprio stile di mobilità, utile per calcolare la co2
  // distance: 0, al momento viene calcolata da una stima con duration e dai vari slider
   duration : 0,
   walk_slider : 0,
   bike_slider : 0,
   bus_slider : 0,
   train_slider : 0,
   car_slider : 0,
   motorbike_slider : 0,
};

export default state;
