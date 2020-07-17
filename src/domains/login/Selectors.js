import { createSelector } from 'reselect'

const getInfoProfile = state => state.login.infoProfile

const getInfoProfileNotSave= state => state.login.infoProfileNotSave;

const getRole = state => state.login.role;

const getTutorial = state => state.login.tutorial;



// prendo chi sono 
export const getProfile = createSelector(
  [getInfoProfile, getInfoProfileNotSave],
  (infoProfile, InfoProfileNotSave) => { return(
    {...infoProfile,
    ...InfoProfileNotSave}
  )
  }
);

export const getRoleState = createSelector(
  [getRole],
  role => (role.roleUser ? (role.roleUser ? role.roleUser : 0) : 0)
);

export const getTutorialStartState = createSelector(
  [getTutorial],
  tutorial => (tutorial ? tutorial.tutorialStart : true )
);

export const getTutorialLiveState = createSelector(
  [getTutorial],
  tutorial => (tutorial ? tutorial.hasOwnProperty("tutorialLive") ? tutorial.tutorialLive : false : false )
);

const getUser = state => state.login;

// prendo l'utente
export const getUserState = createSelector(
  [getUser],
  login => (login ? (login.username ? login.username.length : false) : false)
);



// prendo user agent
export const getUserAgentState = createSelector(
  [getUser],
  login =>
    login
      ? login.infoProfile
        ? login.infoProfile.user_agent
          ? login.infoProfile.user_agent.length
          : 0
        : 0
      : 0
);



// prendo id utente
export const getUserIdState = createSelector(
  [getUser],
  login =>
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
  (username, user_id)  => (username, user_id )
);

const getDate = state => state.login.date;

// prendo l'utente
export const getDateState = createSelector(
  [getDate],
  date => (date ? true : false)
);

const getLanguage = state => state.login.language;

// prendo la lingua
export const getLanguageState = createSelector(
  [getLanguage],
  language => (language ? language : "")
);


