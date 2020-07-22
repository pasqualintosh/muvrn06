import React from "react";
import {
  Text,
  Button,
  View,
  Dimensions,
  Platform,
  findNodeHandle,
  Alert,
  TouchableWithoutFeedback,
  DeviceEventEmitter,
  AppState
} from "react-native";

import Aux from "../../helpers/Aux";

import Blur from "../../components/Blur/Blur";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

import NotificationPoint from "./../../components/NotificationPoint/NotificationPoint";

import HomeScreen from "../HomeScreen/HomeScreen";

import Settings from "./../../config/Settings";

// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

import {
  startApp
} from "./../../domains/login/ActionCreators";

import { connect } from "react-redux";

import { pushNotifications } from "./../../services";
import IconMenuDrawer from "./../../components/IconMenuDrawer/IconMenuDrawer";

import axios from "axios";

import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from "react-native-google-analytics-bridge";

import WebService from "../../config/WebService";

let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);
import OneSignal from "react-native-onesignal";

import analytics from "@react-native-firebase/analytics";
async function trackScreenView(screen) {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
}

import PushNotificationAndroid from "react-native-push-notification";
import NotificationActions from "react-native-ios-notification-actions";
import { start, stop } from "./../../domains/tracking/ActionCreators";
import { store } from "../../store";
import { strings } from "../../config/i18n";

class HomeBlur extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { viewRef: null, componentDidMount: false,  appState: AppState.currentState, };
  }

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

  componentWillMount() {
    // per chiedere all'utente la prima volta l'accesso alle notifiche su ios
    pushNotifications.configure();
    // if (Platform.OS == "android") {
    //   PushNotificationAndroid.registerNotificationActions([
    //     "Walk",
    //     "Bike",
    //     "Tpl"
    //   ]);
    //   DeviceEventEmitter.addListener("notificationActionReceived", function(
    //     action
    //   ) {
    //     console.log("Notification action received: " + JSON.stringify(action));
    //     const info = JSON.parse(action.dataJSON);
    //     if (info.action == "Walk") {
    //       alert("Walk");
    //     } else if (info.action == "Bike") {
    //       alert("Bike");
    //     } else if (info.action == "Tpl") {
    //       alert("Tpl");
    //     }
    //   });
    // } else {
    //   this.setIosActions();
    // }

    // pushNotifications.inStandingsNotification();

    Tracker.trackScreenView("HomeBlur.js");
    trackScreenView("HomeBlur.js");

  }

  sendNotification = () => {
    // 4622, 2650, 4456, 4607, 4606, 4604, 4600, 4597, 4594, 4566, 4564, 4550, 4546, 4544, 4543, 4535, 4530, 4497, 4490, 4495, 4493, 4492, 4491, 4489, 4488, 4487, 4486, 4485, 4460, 4465, 4463, 4462, 4458, 4461, 4457, 4454, 4452, 4449, 4450, 4445, 4448, 4447, 4446, 4419, 4417, 4410, 4406, 4400,4401, 4399, 4398, 4396, 4395, 4394, 4392, 4389, 4387, 4386, 4385, 4384, 4379, 4372, 4370, 3706, 3930, 3825, 3806, 3858, 3831, 3830, 3827, 3821, 3819, 3817, 3813, 3779, 3764, 3717, 3618, 3616, 3461, 2601, 429, 354, 2242, 426, 2074, 1747, 1911
    const id = [380];

    const relation = id.reduce((accumulator, elem, id) => {
      if (id) {
        return [
          ...accumulator,
          { operator: "OR" },
          { field: "tag", key: "userID", relation: "=", value: elem }
        ];
      } else {
        return [
          ...accumulator,
          { field: "tag", key: "userID", relation: "=", value: elem }
        ];
      }
    }, []);

    console.log(relation);

    var data = {
      app_id: WebService.OneSignalAppId,
      contents: {
        en:
          "Actualiza a tua MUV app e entra no novo Special Training para ganhares prémios!"
      },
      headings: { en: "Olá MUVer!" },
      // included_segments: ["All"],
      // filters: [
      //   { field: "tag", key: "userID", relation: "=", value: "380" }
      //   // {"operator": "OR"}, {"field": "amount_spent", "relation": ">", "value": "0"}
      // ]
      filters: relation
    };
    var headers = {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: "Basic " + WebService.OneSignalRestAPIKey
    };

    var options = {
      baseURL: "https://onesignal.com",
      port: 443,
      url: "/api/v1/notifications",
      method: "POST",
      headers: headers,
      data
    };

    axios({
      // method,
      // url: WebService.url + api,
      // headers,
      ...options
      // url: 'http://onesignal.com/api/v1/notifications:443'
    }).then(resp => console.log(resp));

    // var req = https.request(options, function(res) {
    //   res.on('data', function(data) {
    //     console.log("Response:");
    //     console.log(JSON.parse(data));
    //   });
    // });

    // req.on('error', function(e) {
    //   console.log("ERROR:");
    //   console.log(e);
    // });

    // req.write(JSON.stringify(data));
    // req.end();
  };

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log("Message: ", openResult.notification.payload.body);
    console.log("Data: ", openResult.notification.payload.additionalData);
    console.log("isActive: ", openResult.notification.isAppInFocus);
    console.log("openResult: ", openResult);
    if (
      openResult.notification.payload.additionalData &&
      openResult.notification.payload.additionalData.screen
    ) {
      // se la notifica ha il parametro screen impostato, vado nella pagina interessata
      setTimeout(() => {
        this.props.navigation.navigate(
          openResult.notification.payload.additionalData.screen
        );
      }, 1500);
    }
  }

  onIds(device) {
    console.log("Device info: ", device);
  }

  _handleAppStateChange = (nextAppState) => {
    console.log(nextAppState)
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      this.props.dispatch(startApp())
      // ho riaperto l'app, avvio l'aggiornamento dei dati 

    }
    this.setState({appState: nextAppState});
  };

  componentDidMount() {
    // quando ho caricato il componente, posso dire a blur che è possibile fare il blur usando questa variabile
    if (!this.state.viewRef) {
      this.setState({
        viewRef: findNodeHandle(this.view),
        componentDidMount: true
      });
    }
    OneSignal.addEventListener("received", this.onReceived);
    OneSignal.addEventListener("opened", this.onOpened.bind(this));

    OneSignal.addEventListener("ids", this.onIds);

    AppState.addEventListener('change', this._handleAppStateChange);

    console.log("test");

    if (this.props.activityChoice.type) {
      // se apro l'app, è trovo il live interroto, chiedo se si vuole riattivare

      // se sono passi meno di 10 min, allora do la possibilità di riprendere la tratta 
      // prendo l'ultimo punti in corso 

      // time(pin):"2020-06-12T15:13:16+02:00"
      let timeLast = ""
      const lengthRoute = store.getState().tracking.route.length
      const lengthRouteAnalyzed = store.getState().tracking.routeAnalyzed.length
      if (lengthRoute) {
        timeLast = store.getState().tracking.route[lengthRoute- 1].time
      } else if (lengthRouteAnalyzed) {
        timeLast = store.getState().tracking.routeAnalyzed[lengthRouteAnalyzed- 1].time
      }
      console.log(timeLast)
      console.log(new Date().getTime() - new Date(timeLast).getTime())
      if (timeLast.length && new Date().getTime() - new Date(timeLast).getTime() < 600000) {
        // se sono passati meno di 10 min allora puoi riprendere la tratta 
        Alert.alert(
          "Trip closed",
          "Are you want to resume ?",
          [
            {
              text: strings("id_14_03"),
              onPress: () => {
                start(
                  this.props.activityChoice.type,
                  this.props.activityChoice.cef,
                  10,
                  null,
                  true
                );
              }
            },
            {
              text: strings("id_14_04"),
              onPress: () => {
                stop();
              },
              style: "cancel"
            }
          ],
          { cancelable: false }
        );
      } else {
        stop();
      }

      
      
    }
    // console.log(this.props)

    // this.sendNotification();

    // riprendo un eventuale attivita non analizzata
    // this.props.dispatch(resumeRoute());
    // test di prova per creare la struttura dati prima di invio a backend
    // il valore è partendo da 1
    // sendRoute riunisce eventuali sottotrace prima di inviarle
    // this.props.dispatch(LoginStart());
    // this.props.dispatch(RefreshToken());
    // //this.props.dispatch(sendRoute(1));
    // setTimeout(() => {
    //   this.props.navigation.openDrawer();
    // }, 500);
  }

  componentWillUnmount() {
    console.log("test 2");
    // console.log(this.props)
    if (this.state.viewRef) {
      this.setState({ viewRef: null });
    }
    OneSignal.removeEventListener("received", this.onReceived);
    OneSignal.removeEventListener("opened", this.onOpened);
    OneSignal.removeEventListener("ids", this.onIds);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  static navigationOptions = props => ({
    headerTitle: (
      <View
        style={{
          left:
            Platform.OS == "android"
              ? Dimensions.get("window").width / 2 - 20
              : 0
        }}
      >
        <OwnIcon name="MUV_logo" size={40} color="black" />
      </View>
    ),
    headerLeft: null,
    headerRight: <IconMenuDrawer navigation={props.navigation} />
  });

  render() {
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />
        <HomeScreen
          ref={view => {
            this.view = view;
          }}
          navigation={this.props.navigation}
        />
        <Blur viewRef={this.state.viewRef} />
      </Aux>
    );
  }
}

const connection = connect(state => {
  return {
    activityChoice: state.tracking.activityChoice
  };
});

export default connection(HomeBlur);
