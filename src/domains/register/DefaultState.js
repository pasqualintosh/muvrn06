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
  car: null,
  moto: null,
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
  }
};

export default state;