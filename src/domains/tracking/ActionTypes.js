export const ADD_TRACKING = "ADD_TRACKING";
export const RESET_TRACKING = "RESET_TRACKING";
export const SAVE_TRACKING_SUCCESS = "SAVE_TRACKING_SUCCESS";
export const SAVE_TRACKING_ERROR = "SAVE_TRACKING_ERROR";
export const ADD_ACTIVITY = "ADD_ACTIVITY";
export const CONTROL_ACTIVITY = "CONTROL_ACTIVITY";
export const UPDATE_LOCATION = "UPDATE_LOCATION";
export const START_LOCATION = "START_LOCATION";
export const STOP_LOCATION = "STOP_LOCATION";
export const UPDATE_STATUS = "UPDATE_STATUS";
export const COMPLETE_ROUTE = "COMPLETE_ROUTE";
export const CHANGE_ACTIVITY = "CHANGE_ACTIVITY";

export const ADD_DAILY_ROUTINE = "ADD_DAILY_ROUTINE";
export const DELETE_DAILY_ROUTINE = "ADD_DAILY_ROUTINE";
export const UPDATE_PREVIOUS_ROUTE = "UPDATE_PREVIOUS_ROUTE";
export const RESET_PREVIOUS_ROUTE = "RESET_PREVIOUS_ROUTE";

export const ADD_WEATHER = "ADD_WEATHER";

export const STILL_NOTIFICATION_LOG = "STILL_NOTIFICATION_LOG";
export const ADD_REFER_PUBLIC_ROUTE = "ADD_REFER_PUBLIC_ROUTE";


// per aggiungere una proprieta alla route prima di considerarla analizzata
// posso aggiungere se è stata cercata la stazioni o le linee, utile per sapere a che punto sono  
export const ADD_STATUS_ROUTE = "ADD_STATUS_ROUTE";
export const FIX_ROUTE_START = "FIX_ROUTE_START";


export const PLAY_FROM_NOTIFICATION = "PLAY_FROM_NOTIFICATION";

// cancello i punti gps inviati con la socket 
export const DELETE_TRACKING = "DELETE_TRACKING";
// cancello piu punti gps
export const DELETE_MULTI_TRACKING = "DELETE_MULTI_TRACKING";
// cancello l'attivita
export const DELETE_ACTIVITY = "DELETE_ACTIVITY";
// cancello piu Attivita
export const DELETE_MULTI_ACTIVITY = "DELETE_MULTI_ACTIVITY";

// aggiornare le info di una subtrip specifica
export const UPDATE_SUB_TRIP_DATA = "UPDATE_SUB_TRIP_DATA";
// aggiorno le info di tutte le tratte con specifico id
export const UPDATE_TRIP_DATA = "UPDATE_TRIP_DATA";


// per dire che ho completato una tratta con un specifico id 
export const DELETE_TRIP = "DELETE_TRIP";

export const UPDATE_SAMEID_PREVIOUS_ROUTE = "UPDATE_SAMEID_PREVIOUS_ROUTE";

export const UPDATE_TRIP_DATA_START_TIME_SUBTRIP = "UPDATE_TRIP_DATA_START_TIME_SUBTRIP";

// creo un gruppo di utenti, creando un nuovo sub trip in app, come lo swith 
export const CREATE_GROUP_POOLING = "CREATE_GROUP_POOLING";

// è uscito un utente
export const EXIT_USER_GROUP_POOLING = "EXIT_USER_GROUP_POOLING";

// aggiungere una città alla tratta corrente
export const ADD_CITY = "ADD_CITY";






