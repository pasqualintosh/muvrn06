/**
 * componente che salva la posizione e registra il tipo di attivita
 * che riceve dal dispositivo. legge dal dispositivo e salva i dati nel db
 * @author Push
 */

import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback
} from "react-native";
import { Alert } from "react-native";

import { styles } from "./Style";

import BackgroundGeolocation from "./../../helpers/geolocation";
import ActivityRecognition from "react-native-activity-recognition";
import { strings } from "../../config/i18n";

import { connect } from "react-redux";
import {
  addTracking,
  resetTracking,
  addActivity,
  updateCordinate,
  start
} from "./../../domains/tracking/ActionCreators";
import { addReport } from "./../../domains/report/ActionCreators";

class ActivityTracking extends React.Component {
  constructor() {
    super();

    this.state = {
      activity: {
        log: "START",
        time: new Date().toString()
      },
      isRunningBackgroundGeolocation: false,
      activityServiceAvailable: true
    };
  }
  componentWillMount() {}

  componentDidMount() {
    BackgroundGeolocation.configure({
      desiredAccuracy: 10,
      stationaryRadius: 50,
      distanceFilter: 50,
      notificationTitle: "Background tracking",
      notificationText: "enabled",
      debug: false,
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
      url: "http://192.168.81.15:3000/location",
      httpHeaders: {
        "X-FOO": "bar"
      },
      // customize post properties
      postTemplate: {
        lat: "@latitude",
        lon: "@longitude",
        foo: "bar" // you can also add your own properties
      },
      notificationTitle: "MUV",
      notificationText: "Tracciamento Attività"
    });

    // on location è la callback dove intercetti l'aggiornamento eventuale
    // della posizione del `gps`
    BackgroundGeolocation.on("location", location => {
      BackgroundGeolocation.startTask(taskKey => {
        this._handleLocationChanging(location);
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on("authorization", status => {
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        Alert.alert(
          "Location services are disabled",
          "Would you like to open location settings?",
          [
            {
              text: strings("yes"),
              onPress: () => BackgroundGeolocation.showLocationSettings()
            },
            {
              text: strings("no"),
              onPress: () => alert("No Pressed"),
              style: "cancel"
            }
          ]
        );
      }
    });
  }
  componentWillUnmount() {
    this.unsubscribe();

    BackgroundGeolocation.events.forEach(event =>
      BackgroundGeolocation.removeAllListeners(event)
    );
  }
  /**
   * costruisce l'oggetto con le statistiche della tratta
   */
  _getResume = () => {
    let distance = 0,
      duration = 0,
      experience = 0,
      points = 0;

    this.props.trackingState.route.forEach(item => {
      distance += parseFloat(item.distance);
      duration += item.duration;
      experience += item.experience;
      points += item.points;
    });

    return {
      distance,
      duration,
      experience,
      points
    };
  };
  /**
   * gestione del cambio di coordinate da parte del gps
   * e dispatch per aggiungere l'elemento coordinata all'array coordinate
   */
  _handleLocationChanging = location => {
    let { activity } = this.state;
    if (!this.state.activityServiceAvailable) {
      activity = {
        activity: "DISABLED",
        time: new Date().toString()
      };
    }

    const key = +new Date();
    const item = { key, ...location, ...activity };
    let lastPosition = {};
    if (this.props.trackingState.route.length > 1) {
      lastPosition = {
        latitude: this.props.trackingState.route[
          this.props.trackingState.route.length - 1
        ].latitude,
        longitude: this.props.trackingState.route[
          this.props.trackingState.route.length - 1
        ].longitude,
        time: this.props.trackingState.route[1].time
      };
    } else {
      lastPosition = null;
    }

    this.props.dispatch(addTracking(item, lastPosition));
  };
  /**
   * gestione dello `stop` di una tratta e salvataggio nel db
   */
  _handleStopTracking = () => {
    Alert.alert(
      "Route Saved",
      "Your route has been saved",
      [
        {
          text: "Ok",
          onPress: () => {
            return false;
          }
        }
      ],
      { cancelable: false }
    );

    const resume = this._getResume();
    const start = this.props.trackingState.route[1];
    const end = this.props.trackingState.route[
      this.props.trackingState.route.length - 1
    ];

    this.props.dispatch(addReport(start, end, resume));
  };
  _handleButtonReset = () => {
    this.props.dispatch(resetTracking());
  };
  _handleButtonToggleTracking = () => {
    BackgroundGeolocation.checkStatus(({ isRunning, authorization }) => {
      if (isRunning) {
        BackgroundGeolocation.stop();

        this.setState({ isRunningBackgroundGeolocation: false });
        // stoppo il servizio
        ActivityRecognition.stop();
        this.unsubscribe();

        this._handleStopTracking();
        return false;
      }
      if (authorization == BackgroundGeolocation.auth.AUTHORIZED) {
        BackgroundGeolocation.start();
        this.setState({ isRunningBackgroundGeolocation: true });

        // sottoscrizione al servizio di riconoscimento attività
        this.unsubscribe = ActivityRecognition.subscribe(detectedActivities => {
          const mostProbableActivity = detectedActivities.sorted[0];
          const item = {
            log: mostProbableActivity.type,
            time: new Date().toString()
          };

          // salvo la nuova attivita trovata
          this.props.dispatch(addActivity(detectedActivities.sorted));

          this.setState({
            activity: item
          });
        });

        // attivo il servizio quando avvio l'attivita
        // in realta il servizio dovrebbe partire con start
        const detectionIntervalMillis = 600;
        ActivityRecognition.start(detectionIntervalMillis)
          .then(d => {
            // il servizio è disponibile
            // non c'e' bisogno di fare alcuna operazione
          })
          .catch(e => {
            // il servizio non è disponibile
            this.setState({
              activityServiceAvailable: false
            });
            alert("Warning: activity recognition unavailable.");
          });

        // dico  a redux che inizio la riconoscimento e gps
        this.props.dispatch(start("foot", 800));
      } else {
        // dialog nativa, ti permette eventualmente di aprire le impostazioni
        // per attivare il gps (android)
        Alert.alert(
          "Location services disabled",
          "Would you like to open location settings?",
          [
            {
              text: strings("yes"),
              onPress: () => BackgroundGeolocation.showLocationSettings()
            },
            {
              text: strings("no"),
              onPress: () => {},
              style: "cancel"
            }
          ]
        );
      }
    });
  };
  render() {
    const list = this.props.trackingState.route.map(item => (
      <View key={item.key}>
        <Text key={item.key} style={styles.listItem}>
          {item.latitude} :: {item.longitude} :: {item.time} :: {item.activity}{" "}
        </Text>
      </View>
    ));
    return (
      <ScrollView>
        <View style={styles.container}>
          <TouchableWithoutFeedback
            style={styles.button}
            onPress={this._handleButtonToggleTracking}
          >
            <View>
              <Text style={styles.welcome}>
                {this.state.isRunningBackgroundGeolocation == true
                  ? "Stop"
                  : "Start"}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            style={styles.button}
            onPress={this._handleButtonReset}
          >
            <View>
              <Text style={styles.welcome}>Reset</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            style={styles.button}
            onPress={() =>
              this.props.dispatch(
                updateCordinate(this.props.trackingState.route)
              )
            }
          >
            <View>
              <Text style={styles.welcome}>Control</Text>
            </View>
          </TouchableWithoutFeedback>
          <Text style={styles.welcome}>locations :</Text>
          <View>{list}</View>
        </View>
      </ScrollView>
    );
  }
}

const withTracking = connect(state => {
  return {
    trackingState: state.tracking,
    reportState: state.report
  };
});

export default withTracking(ActivityTracking);
