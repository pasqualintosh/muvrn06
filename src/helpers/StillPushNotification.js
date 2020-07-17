import { store } from "../store";
import { pushNotifications } from "../services";
import haversine from "./haversine";

export class StillPushNotification {
  static instance = null;
  static pivot_minutes = 5;

  /**
   * singleton pattern
   */
  constructor() {
    console.log(this.instance);
    if (this.instance == null) {
      return this.instance;
    }

    this.instance = this;
    this.writeLog = () => {};
  }

  setWriteLog(func) {
    this.writeLog = func;
  }

  check(boot) {
    this.writeLog("chiamata a StillPushNotification.check() con " + boot);
    if (!boot) {
      console.log(store.getState().tracking.route);
      const threshold_gps = 0.03;
      const show_still_notification = store.getState().login.notification_still
        ? store.getState().login.notification_still
        : true;
      let is_still_flag = true;

      let gps_pos = [
        ...store.getState().tracking.route.map(e => ({
          latitude: e.latitude,
          longitude: e.longitude
        })),
        ...store.getState().tracking.routeAnalyzed.map(e => ({
          latitude: e.latitude,
          longitude: e.longitude
        })),
        ...store.getState().tracking.routeNotvalid.map(e => ({
          latitude: e.latitude,
          longitude: e.longitude
        }))
      ];

      this.writeLog("gps_pos " + JSON.stringify(gps_pos));
      this.writeLog("gps_pos length" + gps_pos.length);

      if (gps_pos.length <= 2) {
        // gps spento (?)
        this.writeLog("gps_pos.length == 0 || gps_pos.length < 2");
        console.log(
          "nessuna posizione gps intercettata, il gps si è spento: notifica!"
        );
        pushNotifications.configure();
        pushNotifications.userIsStillNotification();
      } else {
        console.log(gps_pos);
        let counter = gps_pos.length - 10 > 0 ? gps_pos.length - 10 : 0;
        for (counter; counter < gps_pos.length - 1; counter++) {
          // kilometri
          let distance = parseFloat(
            haversine(
              gps_pos[counter].latitude,
              gps_pos[counter].longitude,
              gps_pos[counter + 1].latitude,
              gps_pos[counter + 1].longitude
            )
          );
          console.log(distance);
          this.writeLog("distance " + counter + " " + distance);
          if (distance > threshold_gps) is_still_flag = false;
        }

        this.writeLog(
          "show_still_notification=" +
            show_still_notification +
            " is_still_flag=" +
            is_still_flag +
            " gps_pos.length=" +
            gps_pos.length +
            " "
        );
        if (show_still_notification && is_still_flag) {
          // mostro la notifica
          console.log("notifica!");
          this.writeLog("show_still_notification && is_still_flag");
          pushNotifications.configure();
          pushNotifications.userIsStillNotification();
        } else {
          this.instance = null;
        }
      }
    }
  }
}
