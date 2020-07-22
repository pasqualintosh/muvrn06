const state = {
  statistics: {
    total_duration: 0,
    total_calories: 0,
    total_co2: 0,
    total_distance: 0,
    total_walking: 0,
    total_biking: 0,
    total_bus: 0,
    total_metro: 0,
    total_train: 0,
    total_carpooling: 0
  },
  n_routes: 0,
  error: "false",
  selectedScreen: "trophies",
  weekActivities: [],
  permActivities: false,
  statusActivity: {
    minActivity: 0, // minuti di oggi 
    points: 0, // punti per le varie soglie 
    dateActivity: "",  // quando è stata calcolata l'attività
    bonusType: 0, // tipo di bonus ottenuto 0, 1 30 per tre giorni, 2: 60 , 3: 90
    dateBonus: "", // quando è stato aggiornato il bonus 
  }
};

export default state;
