import { UPDATE_LAST_TRIP_TIME } from "./ActionTypes";
import { pushNotifications } from "./../../services";
import PushNotificationAndroid from "react-native-push-notification";
import NotificationActions from "react-native-ios-notification-actions";
import {
  playFromNotification,
  start
} from "./../../domains/tracking/ActionCreators";

const choosed_week_days = {
  0: false,
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: false
};

export function scheduleActionNotification() {
  return async function(dispatch, getState) {
    console.log("scheduleActionNotification");

    let lastTrip = getState().login.Route[0];
    let start_date = new Date(lastTrip.created_at);
    start_date.setMinutes(start_date.getMinutes() - lastTrip.time_travelled);

    // console.log(lastTrip);
    // console.log(start_date);

    if (Platform.OS == "ios") {
      ids = pushNotifications.localDailyNotificationSchedule(
        value,
        choosed_week_days
      );
      // this.props.dispatch(setScheduledNotificationIds(ids));
    } else {
      ids = pushNotifications.localNotificationSchedule(
        value,
        choosed_week_days
      );
      // this.props.dispatch(setScheduledNotificationIds(ids));
    }

    dispatch({
      type: UPDATE_LAST_TRIP_TIME,
      payload: {
        value: start_date
      }
    });
  };
}

/**
 * *** *** *** *** *** *** *** *** //
 * *** *** *** *** *** *** *** *** //
 * HELPER FUNCTIONS
 * *** *** *** *** *** *** *** *** //
 * *** *** *** *** *** *** *** *** //
 */

setIosActions = () => {
  // Create an "upvote" action that will display a button when a notification is swiped
  let upvoteButton = new NotificationActions.Action(
    {
      activationMode: "background",
      title: "Upvote",
      identifier: "UPVOTE_ACTION"
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
      identifier: "REPLY_ACTION"
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
    forContext: "minimal"
  });

  // ** important ** update the categories
  NotificationActions.updateCategories([myCategory]);
};

setAndroidActions = () => {
  PushNotificationAndroid.registerNotificationActions(["Walk", "Bike", "Tpl"]);
  DeviceEventEmitter.addListener("notificationActionReceived", function(
    action
  ) {
    console.log("Notification action received: " + JSON.stringify(action));
    const info = JSON.parse(action.dataJSON);
    if (info.action == "Walk") {
      alert("Walk");
    } else if (info.action == "Bike") {
      alert("Bike");
    } else if (info.action == "Tpl") {
      alert("Tpl");
    }
  });
};
