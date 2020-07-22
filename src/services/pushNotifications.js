import {
  DeviceEventEmitter,
  PushNotificationIOS,
  Platform,
} from "react-native";
import PushNotification from "react-native-push-notification";
import NotificationActions from "react-native-ios-notification-actions";
import axios from "axios";

import { dispatchNotification } from "./../domains/standings/ActionCreators";

import { store } from "./../store";

import { strings } from "../config/i18n";

const EndGMTTournament = 17;

const configure = () => {
  PushNotification.configure({
    onRegister: function (token) {
      console.log("device token: " + token);
    },

    onError: function () {
      console.log("onError");
    },

    onRemoteFetch: function () {
      console.log("onRemoteFetch");
    },

    popInitialNotification: true,

    onNotification: function (notification) {
      console.log(notification);

      if (notification.message == strings("id_17_15")) {
        // get the weather
        // uso la posizione corrente per calcolare il meteo
        // navigator.geolocation.getCurrentPosition(
        //   geo_success =>
        //     fetchWeather(
        //       geo_success.coords.latitude,
        //       geo_success.coords.longitude
        //     ),
        //   error => console.log(error.message),
        //   {
        //     enableHighAccuracy: true,
        //     timeout: 20000,
        //     maximumAge: 1000
        //   }
        // );
        console.log("notifica settata dall'utente arrivata");
      } else if (notification.message == strings("id_17_18")) {
        // aggiorno la classifica e blocco la classifica
        console.log("notifica arrivata");

        store.dispatch(dispatchNotification());
      } else if (notification.message == "prova") {
      }

      if (notification.action == "Walk") {
        alert("Walk");
      } else if (notification.action == "Bike") {
        alert("Bike");
      } else if (notification.action == "Tpl") {
        alert("Tpl");
      }

      if (notification) {
        // process the notification
        // required on iOS only
        if (Platform.OS == "ios" && notification.finish)
          notification.finish(PushNotificationIOS.FetchResult.NoData);
      }
    },

    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    popInitialNotification: true,
    requestPermissions: true,
  });
};

const configureRemoteNotif = (onRegister, onNotification, gcm = "") => {
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: onRegister, //this._onRegister.bind(this),

    // (required) Called when a remote or local notification is opened or received
    onNotification: onNotification, //this._onNotification,

    // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
    senderID: gcm,

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     */
    requestPermissions: true,
  });
};

const deleteUserIsStandingsNotification = () => {
  PushNotification.cancelLocalNotifications({ id: "010202" });
};

const activitiesMinutesNotification = (minActivities) => {
  // su android preparo la notifica
  // su ios la faccio scatare nel momento corretto
  PushNotification.localNotification({
    autoCancel: true,
    largeIcon: "ic_launcher",
    smallIcon: "ic_notification",
    icon: "ic_notification",
    subText: "Attività effettuata",
    vibrate: true,
    vibration: 300,
    title: "Attività effettuata",
    message: "Attività effettuata con " + minActivities + " minuti",
    playSound: true,
    soundName: "default",
    // bigText: "My big text that will be shown when notification is expanded",
    // color: "green",
    // actions: '["Walk", "Bike", "Tpl"]',
    date: new Date(Date.now()),
    id: "010202",
    userInfo: { id: "010202" },
    // alertAction: () => {}
  });
};

const userIsStillNotification = (date) => {
  // su android preparo la notifica
  // su ios la faccio scatare nel momento corretto
  PushNotification.localNotification({
    autoCancel: true,
    largeIcon: "ic_launcher",
    smallIcon: "ic_notification",
    icon: "ic_notification",
    subText: "Hey, you've been still too long",
    vibrate: true,
    vibration: 300,
    title: strings("id_17_16"),
    message: strings("id_17_17"),
    playSound: true,
    soundName: "default",
    // bigText: "My big text that will be shown when notification is expanded",
    // color: "green",
    // actions: '["Walk", "Bike", "Tpl"]',
    date: new Date(Date.now()),
    id: "010202",
    userInfo: { id: "010202" },
    // alertAction: () => {}
  });
};

const userIsStillNotificationToStop = (date) => {
  // su android preparo la notifica
  // su ios la faccio scatare nel momento corretto
  PushNotification.localNotification({
    autoCancel: true,
    largeIcon: "ic_launcher",
    smallIcon: "ic_notification",
    icon: "ic_notification",
    subText: "Hey, you've been still too long",
    vibrate: true,
    vibration: 300,
    title: "Trip si closed",
    message: "You've been stationary for too long.",
    playSound: true,
    soundName: "default",
    // bigText: "My big text that will be shown when notification is expanded",
    // color: "green",
    // actions: '["Walk", "Bike", "Tpl"]',
    date: new Date(Date.now()),
    id: "010203",
    userInfo: { id: "010203" },
    // alertAction: () => {}
  });
};

const localNotificationSchedule = (time, weekDaysState) => {
  let today = new Date();
  const h = getNotificationHour(time);
  const m = getNotificationMinute(time);
  let ids = [];

  if (h < today.getHours()) {
    today.setDate(today.getDate() + 1); // decido di partire dal giorno dopo
  }

  today.setHours(h);
  today.setMinutes(m);

  console.log(today);

  const daysInYear = getScheduledDaysInYear(
    today.getFullYear(),
    today.getMonth(),
    today.getUTCDate(),
    h,
    m,
    weekDaysState
  );

  const daysInNextYear = getDaysInNextYear(
    today.getFullYear(),
    today.getMonth(),
    today.getUTCDate(),
    h,
    m,
    weekDaysState
  );

  // console.log(daysInYear);
  // console.log(daysInNextYear);

  daysInYear.forEach((element) => {
    try {
      let rand_id = getRandomArbitrary(0, 1000000);

      ids.push(rand_id);
      PushNotification.localNotificationSchedule({
        message: strings("id_17_15"), // (required)
        date: new Date(element),
        largeIcon: "ic_launcher",
        smallIcon: "ic_notification",
        icon: "ic_notification",
        click_action: "OPEN_MAIN_ACTIVITY",
        id: rand_id.toString(),
        userInfo: { id: rand_id.toString() },
      });
    } catch (error) {
      console.log(error);
      alert(JSON.stringify(error));
    }
  });

  daysInNextYear.forEach((element) => {
    let rand_id = getRandomArbitrary(0, 1000000);
    ids.push(rand_id);
    try {
      PushNotification.localNotificationSchedule({
        message: strings("id_17_15"), // (required)
        largeIcon: "ic_launcher",
        smallIcon: "ic_notification",
        icon: "ic_notification",
        date: new Date(element),
        click_action: "OPEN_MAIN_ACTIVITY",
        id: rand_id.toString(),
        userInfo: { id: rand_id.toString() },
      });
    } catch (error) {
      console.log(error);
      alert(JSON.stringify(error));
    }
  });

  return ids;
};

const deleteNotificationByIds = (ids) => {
  if (ids != undefined)
    ids.forEach((e) => {
      PushNotification.cancelLocalNotifications({ id: e.toString() });
    });
};

const deleteAllNotification = () => {
  PushNotification.cancelAllLocalNotifications();
};

const localWeeklyNotificationSchedule = () => {
  let first_groups_ids = localWeeklyNotificationSundayEveningAndroid();
  let second_groups_ids = localWeeklyNotificationMondayMorningAndroid();

  console.log([...first_groups_ids, ...second_groups_ids]);

  return [...first_groups_ids, ...second_groups_ids];
};

const localWeeklyNotificationSundayEveningAndroid = () => {
  let weekDaysState = {
    0: true,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  };

  let today = new Date();
  let ids = [];
  // su android tengo conto del fuso new Date().getTimezoneOffset() / 60; // in italia da -60
  let h = EndGMTTournament - today.getTimezoneOffset() / 60;
  h = h > 23 ? h - 24 : h;
  const m = 0;

  today.setUTCHours(h);
  today.setMinutes(m);

  const daysInYear = getDaysInYear(
    today.getFullYear(),
    today.getMonth(),
    today.getUTCDate(),
    h,
    m,
    weekDaysState
  );

  // const daysInNextYear = getDaysInNextYear(
  //   today.getFullYear(),
  //   today.getMonth(),
  //   today.getUTCDate(),
  //   h,
  //   m,
  //   weekDaysState
  // );

  console.log(daysInYear);
  // console.log(daysInNextYear);

  daysInYear.forEach((element) => {
    let rand_id = getRandomArbitrary(0, 1000000);
    ids.push(rand_id);

    try {
      if (new Date(element) > new Date())
        PushNotification.localNotificationSchedule({
          message: strings("id_17_18"), // (required)
          largeIcon: "ic_launcher",
          smallIcon: "ic_notification",
          icon: "ic_notification",
          date: new Date(element),
          id: rand_id.toString(),
          userInfo: { id: rand_id.toString() },
        });
    } catch (error) {
      console.log(error);
      alert(JSON.stringify(error));
    }
  });

  return ids;

  // daysInNextYear.forEach(element => {
  //   try {
  //     PushNotification.localNotificationSchedule({
  //       message: "The city leaderboard is going to blablabla", // (required)
  //       date: new Date(element),
  //       id: "000352",
  //       userInfo: { id: "000352" }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     alert(JSON.stringify(error));
  //   }
  // });
};

const localWeeklyNotificationMondayMorningAndroid = () => {
  let weekDaysState = {
    0: false,
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  };

  let today = new Date();
  let ids = [];
  const h = 7;
  const m = 0;

  today.setUTCHours(h);
  today.setMinutes(m);

  const daysInYear = getDaysInYear(
    today.getFullYear(),
    today.getMonth(),
    today.getUTCDate(),
    h,
    m,
    weekDaysState
  );

  // const daysInNextYear = getDaysInNextYear(
  //   today.getFullYear(),
  //   today.getMonth(),
  //   today.getUTCDate(),
  //   h,
  //   m,
  //   weekDaysState
  // );

  console.log(daysInYear);
  // console.log(daysInNextYear);

  daysInYear.forEach((element) => {
    let rand_id = getRandomArbitrary(0, 1000000);
    ids.push(rand_id);

    try {
      if (new Date(element) > new Date())
        PushNotification.localNotificationSchedule({
          message: strings("this_isn_t_just"), // (required)
          largeIcon: "ic_launcher",
          smallIcon: "ic_notification",
          icon: "ic_notification",
          date: new Date(element),
          id: rand_id.toString(),
          userInfo: { id: rand_id.toString() },
        });
    } catch (error) {
      console.log(error);
      alert(JSON.stringify(error));
    }
  });

  return ids;

  // daysInNextYear.forEach(element => {
  //   try {
  //     PushNotification.localNotificationSchedule({
  //       message: "The city leaderboard is going to blablabla", // (required)
  //       date: new Date(element),
  //       id: "000352",
  //       userInfo: { id: "000352" }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     alert(JSON.stringify(error));
  //   }
  // });
};

const localWeekNotification = () => {
  let first_groups_ids = localWeekNotificationSundayEvening();
  let second_groups_ids = localWeekNotificationMondayMorning();
  return [...first_groups_ids, ...second_groups_ids];
};

const localWeekNotificationSundayEvening = () => {
  const h = EndGMTTournament;
  const m = 0;

  let weekDaysState = {
    0: true,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  };

  let weekDays = [];
  let today = new Date();

  let ids = [];

  today.setUTCHours(h);
  today.setMinutes(m);

  if (weekDaysState[today.getDay()])
    weekDays.push({ date: today, index: today.getDay() });

  for (let index = 1; index < 7; index++) {
    let nextDay = new Date(today);
    nextDay.setDate(today.getDate() + index);
    if (weekDaysState[nextDay.getDay()])
      weekDays.push({ date: nextDay, index: nextDay.getDay() });
  }

  console.log(weekDays);

  weekDays.forEach((element) => {
    let rand_id = getRandomArbitrary(0, 1000000);
    if (weekDaysArrayState.includes(element.index)) {
      ids.push(rand_id);
      try {
        PushNotification.localNotificationSchedule({
          message: strings("id_17_18"), // (required)
          largeIcon: "ic_launcher",
          smallIcon: "ic_notification",
          icon: "ic_notification",
          date: new Date(element.date),
          id: rand_id.toString(),
          userInfo: { id: rand_id.toString() },
          repeatType: "week",
        });
      } catch (error) {
        console.log(error);
      }
    }
  });

  return ids;
};

const localWeekNotificationMondayMorning = () => {
  const h = 7;
  const m = 0;

  let weekDaysState = {
    0: false,
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  };

  let weekDays = [];
  let today = new Date();

  let ids = [];

  today.setUTCHours(h);
  today.setMinutes(m);

  if (weekDaysState[today.getDay()])
    weekDays.push({ date: today, index: today.getDay() });

  for (let index = 1; index < 7; index++) {
    let nextDay = new Date(today);
    nextDay.setDate(today.getDate() + index);
    if (weekDaysState[nextDay.getDay()])
      weekDays.push({ date: nextDay, index: nextDay.getDay() });
  }

  console.log(weekDays);

  weekDays.forEach((element) => {
    let rand_id = getRandomArbitrary(0, 1000000);
    if (weekDaysArrayState.includes(element.index)) {
      ids.push(rand_id);
      try {
        PushNotification.localNotificationSchedule({
          message: strings("this_isn_t_just"), // (required)
          largeIcon: "ic_launcher",
          smallIcon: "ic_notification",
          icon: "ic_notification",
          date: new Date(element.date),
          id: rand_id.toString(),
          userInfo: { id: rand_id.toString() },
          repeatType: "week",
        });
      } catch (error) {
        console.log(error);
      }
    }
  });

  return ids;
};

const localDailyNotificationSchedule = (time, weekDaysState) => {
  console.log(getCETorCESTDate());

  const h = getNotificationHour(time);
  const m = getNotificationMinute(time);

  let weekDays = [];
  let today = new Date();

  let ids = [];

  today.setHours(h);
  today.setMinutes(m);

  if (weekDaysState[today.getDay()])
    weekDays.push({ date: today, index: today.getDay() });

  for (let index = 1; index < 7; index++) {
    let nextDay = new Date(today);
    nextDay.setDate(today.getDate() + index);
    if (weekDaysState[nextDay.getDay()])
      weekDays.push({ date: nextDay, index: nextDay.getDay() });
  }

  console.log(time);
  console.log(h);
  console.log(m);
  console.log(weekDays);

  weekDays.forEach((element) => {
    let rand_id = getRandomArbitrary(0, 1000000);
    if (weekDaysArrayState.includes(element.index)) {
      ids.push(rand_id);
      try {
        PushNotification.localNotificationSchedule({
          message: strings("id_17_15"), // (required)
          largeIcon: "ic_launcher",
          smallIcon: "ic_notification",
          icon: "ic_notification",
          date: new Date(element.date),
          id: rand_id.toString(),
          userInfo: { id: rand_id.toString() },
          repeatType: "week",
        });
      } catch (error) {
        console.log(error);
      }
    }
  });

  return ids;
};

const cancelAllLocalNotifications = () => {
  try {
    PushNotification.cancelAllLocalNotifications();
  } catch (error) {
    console.log(error);
  }
};

const inStandingsNotification = () => {
  // if (Platform.OS == "ios") setIosActions();
  // else setAndroidActions();

  PushNotification.localNotification({
    largeIcon: "ic_launcher",
    smallIcon: "ic_notification",
    icon: "ic_notification",
    // bigText: "My big text that will be shown when notification is expanded",
    subText: strings("id_17_17"),
    // color: "green",
    vibrate: true,
    vibration: 300,
    // date: new Date(Date.now() + 60 * 1000), // in 60 secs
    title: strings("id_17_16"),
    message: "Hey, you've been still too long, did you forget to close it?",
    playSound: true,
    soundName: "default",
    actions: '["UPVOTE_ACTION", "REPLY_ACTION"]',
    id: "0001",
    userInfo: { id: "0001" },
    foreground: true,
    category: "something_happened", // ios actions
  });
};

/**
 * @param {int} The year, not zero based, required to account for leap years
 * @return {Date[]} List with date objects for each day of the month
 */
const getDaysInNextYear = (year, month, day, h, m, weekDaysState) => {
  let days = [];
  for (let i = 0; i < 12; i++) {
    let date = new Date(year + 1, i, 1);
    // date.setUTCHours(24); // altrimenti il 01 Luglio diventa il 30 Giugno (credo)
    date.setUTCHours(h);
    date.setMinutes(m);
    if (date.getMonth() == month)
      while (date.getMonth() === i) {
        if (date.getUTCDate() < day) {
          if (weekDaysState[new Date(date).getDay()]) days.push(new Date(date));
        }
        date.setDate(date.getDate() + 1);
      }
    else if (date.getMonth() < month)
      while (date.getMonth() === i) {
        if (weekDaysState[new Date(date).getDay()]) days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
  }
  return days;
};

/**
 * @param {int} The year, not zero based, required to account for leap years
 * @return {Date[]} List with date objects for each day of the month
 */
const getDaysInYear = (year, month, day, h, m, weekDaysState) => {
  let days = [];
  for (let i = 0; i < 12; i++) {
    let date = new Date(year, i, 1);
    date.setUTCHours(24); // altrimenti il 01 Luglio diventa il 30 Giugno (credo)
    date.setHours(h);
    date.setMinutes(m);
    if (date.getMonth() == month)
      while (date.getMonth() === i) {
        if (date.getUTCDate() >= day) {
          if (weekDaysState[new Date(date).getDay()]) days.push(new Date(date));
        }
        date.setDate(date.getDate() + 1);
      }
    else if (date.getMonth() > month)
      while (date.getMonth() === i) {
        if (weekDaysState[new Date(date).getDay()]) days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
  }
  return days;
};

/**
 * NB non in CET
 * @param {int} The year, not zero based, required to account for leap years
 * @return {Date[]} List with date objects for each day of the month
 */
const getScheduledDaysInYear = (year, month, day, h, m, weekDaysState) => {
  let days = [];
  for (let i = 0; i < 12; i++) {
    let date = new Date(year, i, 1);
    date.setUTCHours(24); // altrimenti il 01 Luglio diventa il 30 Giugno (credo)
    date.setHours(h);
    date.setMinutes(m);
    if (date.getMonth() == month)
      while (date.getMonth() === i) {
        if (date.getUTCDate() >= day) {
          if (weekDaysState[new Date(date).getDay()]) days.push(new Date(date));
        }
        date.setDate(date.getDate() + 1);
      }
    else if (date.getMonth() > month)
      while (date.getMonth() === i) {
        if (weekDaysState[new Date(date).getDay()]) days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
  }
  return days;
};

/**
 * @param {int} The month number, 0 based
 * @param {int} The year, not zero based, required to account for leap years
 * @return {Date[]} List with date objects for each day of the month
 */
const getDaysInMonth = (month, year) => {
  let date = new Date(year, month, 1);
  let days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

/**
 * ottengo l'ora o il minuto da un formato hh:mm
 */
const getNotificationHour = (time) => {
  const stringH = time.split(":")[0];
  return Number.parseInt(stringH);
};

/**
 * ottengo l'ora o il minuto da un formato hh:mm
 */
const getNotificationMinute = (time) => {
  const stringM = time.split(":")[1];
  return Number.parseInt(stringM);
};

const setAndroidActions = () => {
  console.log("setAndroidActions");
  PushNotification.registerNotificationActions(["Walk", "Bike", "Tpl"]);
  DeviceEventEmitter.addListener("notificationActionReceived", function (
    action
  ) {
    console.log("Notification action received: " + JSON.stringify(action));
    const info = JSON.parse(action.dataJSON);
    if (info.action == "Walk") {
      console.log("Walk");
    } else if (info.action == "Bike") {
      console.log("Bike");
    } else if (info.action == "Tpl") {
      console.log("Tpl");
    }
  });
};

const setIosActions = () => {
  // Create an "upvote" action that will display a button when a notification is swiped
  let upvoteButton = new NotificationActions.Action(
    {
      activationMode: "background",
      title: "Upvote",
      identifier: "UPVOTE_ACTION",
    },
    (res, done) => {
      console.info("upvote button pressed with result: ", res);
      done(); //important!
    }
  );

  // Create a "comment" button that will display a text input when the button is pressed
  let commentTextButton = new NotificationActions.Action(
    {
      activationMode: "background",
      title: "Reply",
      behavior: "textInput",
      identifier: "REPLY_ACTION",
    },
    (res, done) => {
      console.info(
        "reply typed via notification from source: ",
        res.source,
        " with text: ",
        res.text
      );
      done(); //important!
    }
  );

  // Create a category containing our two actions
  let myCategory = new NotificationActions.Category({
    identifier: "something_happened",
    actions: [upvoteButton, commentTextButton],
    forContext: "minimal",
  });

  // ** important ** update the categories
  NotificationActions.updateCategories([myCategory]);
};

function fetchWeather(lat = 40, lon = 40) {
  const API_KEY = "78b7f0694ea3f485d7daa5a1d30b9370";
  console.log("meteo della notifica");
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}`
    )
    .then((res) => {
      console.log(res);
      // se risponde correttamente setto un valore da 1 a 3 per dire che il meteo è stato settato
      if (res.status === 200) {
        const weather = res.data.weather[0].main;
        /* 
        Rain: {
            color: '#005BEA',
              title: 'Raining',
                subtitle: 'Get a cup of coffee',
                  icon: 'weather-rainy'
          },
          Clear: {
            color: '#f7b733',
              title: 'So Sunny',
                subtitle: 'It is hurting my eyes',
                  icon: 'weather-sunny'
          },
          Thunderstorm: {
            color: '#616161',
              title: 'A Storm is coming',
                subtitle: 'Because Gods are angry',
                  icon: 'weather-lightning'
          },
          Clouds: {
            color: '#1F1C2C',
              title: 'Clouds',
                subtitle: 'Everywhere',
                  icon: 'weather-cloudy'
          },
  
          Snow: {
            color: '#00d2ff',
              title: 'Snow',
                subtitle: 'Get out and build a snowman for me',
                  icon: 'weather-snowy'
          },
          Drizzle: {
            color: '#076585',
              title: 'Drizzle',
                subtitle: 'Partially raining...',
                  icon: 'weather-hail'
          },
          Haze: {
            color: '#66A6FF',
              title: 'Haze',
                subtitle: 'Another name for Partial Raining',
                  icon: 'weather-hail'
          },
          Mist: {
            color: '#3CD3AD',
              title: 'Mist',
                subtitle: "Don't roam in forests!",
                  icon: 'weather-fog'
          }
        }; 
        */
        alert("the weather is " + weather);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

const checkPermission = (cbk) => {
  PushNotification.checkPermissions(cbk);
};

function fetchWeekWeather(lat = 40, lon = 40) {
  const API_KEY = "78b7f0694ea3f485d7daa5a1d30b9370";
  console.log("meteo della notifica per tutta la settiman");
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${API_KEY}`
    )
    .then((res) => {
      console.log(res);
      // se risponde correttamente setto un valore da 1 a 3 per dire che il meteo è stato settato
      if (res.status === 200) {
        // array con il meteo per i vari giorni
        const weather = res.data.list;
        // weather[0].weather[0].main;
        // dt_txt;

        /* Rain: {
            color: '#005BEA',
              title: 'Raining',
                subtitle: 'Get a cup of coffee',
                  icon: 'weather-rainy'
          },
          Clear: {
            color: '#f7b733',
              title: 'So Sunny',
                subtitle: 'It is hurting my eyes',
                  icon: 'weather-sunny'
          },
          Thunderstorm: {
            color: '#616161',
              title: 'A Storm is coming',
                subtitle: 'Because Gods are angry',
                  icon: 'weather-lightning'
          },
          Clouds: {
            color: '#1F1C2C',
              title: 'Clouds',
                subtitle: 'Everywhere',
                  icon: 'weather-cloudy'
          },
  
          Snow: {
            color: '#00d2ff',
              title: 'Snow',
                subtitle: 'Get out and build a snowman for me',
                  icon: 'weather-snowy'
          },
          Drizzle: {
            color: '#076585',
              title: 'Drizzle',
                subtitle: 'Partially raining...',
                  icon: 'weather-hail'
          },
          Haze: {
            color: '#66A6FF',
              title: 'Haze',
                subtitle: 'Another name for Partial Raining',
                  icon: 'weather-hail'
          },
          Mist: {
            color: '#3CD3AD',
              title: 'Mist',
                subtitle: "Don't roam in forests!",
                  icon: 'weather-fog'
          }
        }; */
        alert("the weather is " + weather);
      }
    })

    .catch((err) => {
      console.log(err);
    });
}

function getRandomArbitrary(min, max) {
  return Number.parseInt(Math.random() * (max - min) + min);
}

const weekDaysArrayState = [0, 1, 2, 3, 4, 5, 6];
// const weekDaysArrayState = [1, 3, 4, 5];
const weekDaysAndroidArrayState = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

function getCETorCESTDate() {
  var localDate = new Date();
  var utcOffset = localDate.getTimezoneOffset();
  var cetOffset = utcOffset + 60;
  var cestOffset = utcOffset + 120;
  var cetOffsetInMilliseconds = cetOffset * 60 * 1000;
  var cestOffsetInMilliseconds = cestOffset * 60 * 1000;

  var cestDateStart = new Date();
  var cestDateFinish = new Date();
  var localDateTime = localDate.getTime();
  var cestDateStartTime;
  var cestDateFinishTime;
  var result;

  cestDateStart.setTime(
    Date.parse("29 March " + localDate.getFullYear() + " 02:00:00 GMT+0100")
  );
  cestDateFinish.setTime(
    Date.parse("25 October " + localDate.getFullYear() + " 03:00:00 GMT+0200")
  );

  cestDateStartTime = cestDateStart.getTime();
  cestDateFinishTime = cestDateFinish.getTime();

  if (
    localDateTime >= cestDateStartTime &&
    localDateTime <= cestDateFinishTime
  ) {
    result = new Date(localDateTime + cestOffsetInMilliseconds);
  } else {
    result = new Date(localDateTime + cetOffsetInMilliseconds);
  }

  return result;
}

export {
  configure,
  userIsStillNotification,
  deleteUserIsStandingsNotification,
  localNotificationSchedule,
  cancelAllLocalNotifications,
  inStandingsNotification,
  localDailyNotificationSchedule,
  localWeeklyNotificationSchedule,
  deleteNotificationByIds,
  deleteAllNotification,
  localWeekNotification,
  configureRemoteNotif,
  checkPermission,
  userIsStillNotificationToStop,
  activitiesMinutesNotification,
};
