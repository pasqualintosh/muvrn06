import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import trackingReducer from "./domains/tracking/Reducers";
import reportReducer from "./domains/report/Reducers";
import connectionReducer from "./domains/connection/Reducers";
import loginReducer from "./domains/login/Reducers";
import registerReducer from "./domains/register/Reducers";
import standingsReducer from "./domains/standings/Reducers";
import userReducer from "./domains/user/Reducers";
import statisticsReducer from "./domains/statistics/Reducers";
import trainingsReducer from "./domains/trainings/Reducers";
import screensReducer from "./domains/screen/Reducers";
import followReducer from "./domains/follow/Reducers";
import challengesReducer from "./domains/challenges/Reducers";
import tournamentsReducer from "./domains/tournaments/Reducers";
import notificationReducer from "./domains/notification/Reducers";

import authMiddleware from "./domains/login/ActionCreators";

import thunk from "redux-thunk";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import {
  createMigrate,
  persistStore,
  persistCombineReducers,
  REHYDRATE,
  PURGE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import hardSet from "redux-persist/lib/stateReconciler/hardSet";

// whitelist: ["login"] in caso d'aggiungere se si vuole resettare tutto e salvare solo il login tipo
// whitelist: [] cancello tutto

/* 
const persistConfig = {
  key: "root",
  storage: x
};

const defaultPersistConfig = {
  key: "root"
}; 
*/

// con stateReconciler: hardSet i dati vengono completamente sovrascriti da quelli salvati prima e non avviene il merge
const persistConfig = {
  version: 1,
  key: "root",
  storage: AsyncStorage,
  timeout: null,
  whitelist: [
    "tracking",
    "login",
    "standings",
    "statistics",
    "trainings",
    "follow",
    "screen",
    "challenges",
    "notification",
    "tournaments",
  ],
  stateReconciler: hardSet,
};

const persistedReducer = persistCombineReducers(persistConfig, {
  tracking: trackingReducer,
  connection: connectionReducer,
  login: loginReducer,
  register: registerReducer,
  standings: standingsReducer,
  statistics: statisticsReducer,
  trainings: trainingsReducer,
  screen: screensReducer,
  follow: followReducer,
  challenges: challengesReducer,
  notification: notificationReducer,
  tournaments: tournamentsReducer,
});
const middlewares = [authMiddleware, thunk];
// const middlewares = [ thunk];

const store = createStore(
  persistedReducer,
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  compose(applyMiddleware(...middlewares))
);
const persistor = persistStore(store, null, () => {
  store.getState();
});

const dev_mode = false; // ATTENZIONE DA DISATTIVARE!!!

export { store, persistor, dev_mode };
