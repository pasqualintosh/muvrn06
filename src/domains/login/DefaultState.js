// status utile per dare eventiuali errori di login tipo email sbagliata o password

const state = {
  username: "",
  password: "",
  first_name: "",
  last_name: "",
  email: "",
  access_token: 0,
  refresh_token: 0,
  refreshTokenPromise: null, // promise per sapere lo stato del rinnovo del token
  date: 0,
  status: "",
  coins: 0,
  points: 0,
  routesCompleted: 0,
  kmTravelled: 0,
  StatusButton: false,
  mfr_modal_split_NotSave: [],
  SavedRoute: [],
  Route: [],
  mostFrequentRoute: [],
  infoProfile: {
    user_id: 0,
    id: 0, // per il nuovo muv
    username: "", // per il nuovo muv
    first_name: "",
    customisation_gdpr: false,
    sponsorships_gdpr: false,
    avatar: 1
  },
  infoProfileNotSave: {},
  NumDaysRoute: { day: -1, numDay: 0 },
  notification_still: true,
  role: { roleUser: 0, indexRole: [] },
  addFrequentTrips: [],
  remote_notification_configured: false,
  remote_notification_sender_id: "123456789",
  first_configuration_v5: false,
  remote_notification_token: "",
  periodicFeed: {
    0: { open: "", completed: "" },
    1: { open: "", completed: "" },
    2: { open: "", completed: "" },
    3: { open: "", completed: "" },
    4: { open: "", completed: "" },
    5: { open: "", completed: "" },
    6: { open: "", completed: "" },
    7: { open: "", completed: "" },
    8: { open: "", completed: "" }
  },
  language: "",
  typeform_user: true,
  right_menu: false,
  bestScore: 0, // punteggio effettuato nel gioco del basket
  // quali tutorial sono stati completati
  tutorial: {
    tutorialStart: true,
    tutorialLive: false,
    tutorialMetro: false,
    tutorialCarPooling: false
  },
  sessionToken: null, // { token: "abc123blabla", expired_date: timestamp },
  typeform_soddfrust_2: 0, // 0 non da fare || 1 da fare || 2 fatto
  typeform_soddfrust_3: 0, // 0 non da fare || 1 da fare || 2 fatto
  multipliers: null, // oggetto con la descrizione dei moltiplicatori
  // listAvatar: [], // lista con le info dei vari avatar, link con le immagini ecc 
};

export default state;
