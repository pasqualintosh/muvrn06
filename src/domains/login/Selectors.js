import { createSelector } from "reselect";

const getInfoProfile = state => state.login.infoProfile;

const getInfoProfileNotSave = state => state.login.infoProfileNotSave;

const getRole = state => state.login.role;

const getTutorial = state => state.login.tutorial;

const frequentTrips = state => state.login.mostFrequentRoute;

const frequentTripsNotSave = state => state.login.mfr_modal_split_NotSave;

export const frequentTripsState = createSelector(
  [frequentTrips],
  mostFrequentRoute => (mostFrequentRoute ? mostFrequentRoute : [])
);

export const frequentTripsNotSaveState = createSelector(
  [frequentTripsNotSave],
  mfr_modal_split_NotSave =>
    mfr_modal_split_NotSave ? mfr_modal_split_NotSave : []
);

// se ho meno di 3 frequent trips ti dico di aggiungerne una
export const frequentTripsMin = createSelector([frequentTrips], route =>
  route ? (route.length < 3 ? 1 : 0) : 0
);

// controllo se ho una frequent trips casa lavoro
export const frequentTripsHomeWork = createSelector(
  [frequentTripsState],
  mostFrequentRoute => {
    let HomeWork = false;
    for (
      indexRoutine = 0;
      indexRoutine < mostFrequentRoute.length;
      indexRoutine++
    ) {
      const elem = mostFrequentRoute[indexRoutine];
      // casa lavoro o viceversa
      if (
        (elem.end_type == 1 && elem.start_type == 2) ||
        (elem.end_type == 2 && elem.start_type == 1)
      ) {
        HomeWork = true;
        break;
      }
    }
    return HomeWork;
  }
);

// prendo chi sono
export const getProfile = createSelector(
  [getInfoProfile, getInfoProfileNotSave],
  (infoProfile, InfoProfileNotSave) => {
    return { ...infoProfile, ...InfoProfileNotSave };
  }
);

export const getRoleState = createSelector([getRole], role =>
  role.roleUser ? (role.roleUser ? role.roleUser : 0) : 0
);

export const getTutorialStartState = createSelector([getTutorial], tutorial =>
  tutorial ? tutorial.tutorialStart : true
);

export const getTutorialLiveState = createSelector([getTutorial], tutorial =>
  tutorial
    ? tutorial.hasOwnProperty("tutorialLive")
      ? tutorial.tutorialLive
      : false
    : false
);

export const getTutorialCarPoolingState = createSelector([getTutorial], tutorial =>
  tutorial
    ? tutorial.hasOwnProperty("tutorialCarPooling")
      ? tutorial.tutorialCarPooling
      : false
    : false
);

export const getTutorialMetroState = createSelector([getTutorial], tutorial =>
  tutorial
    ? tutorial.hasOwnProperty("tutorialMetro")
      ? tutorial.tutorialMetro
      : false
    : false
);

const getUser = state => state.login;

// prendo l'utente
export const getUserState = createSelector([getUser], login =>
  login ? (login.username ? login.username.length : false) : false
);

// prendo l'email
export const getEmailState = createSelector([getUser], login =>
  login ? (login.email ? login.email.length : false) : false
);

// prendo user agent
export const getUserAgentState = createSelector([getUser], login =>
  login
    ? login.infoProfile
      ? login.infoProfile.user_agent
        ? login.infoProfile.user_agent.length
        : 0
      : 0
    : 0
);

// prendo id utente
export const getUserIdState = createSelector([getUser], login =>
  login
    ? login.infoProfile
      ? login.infoProfile.id
        ? login.infoProfile.id
        : 0
      : 0
    : 0
);


// prendo id utente del vecchio muv
export const getUserIdOldState = createSelector([getUser], login =>
  login
    ? login.infoProfile
      ? login.infoProfile.user_id
        ? login.infoProfile.user_id
        : 0
      : 0
    : 0
);


export const getUserObjectState = createSelector(
  [getUserState, getUserIdState],
  (username, user_id) => (username, user_id)
);

const getDate = state => state.login.date;

// prendo l'utente
export const getDateState = createSelector([getDate], date =>
  date ? true : false
);

const getLanguage = state => state.login.language;

// prendo la lingua
export const getLanguageState = createSelector([getLanguage], language =>
  language ? language : ""
);
