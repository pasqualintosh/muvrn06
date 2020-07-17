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

class BgTracking extends React.Component {
  constructor() {
    super();

    this.state = {
      locations: [
        {
          key: +new Date(),
          latitude: "START",
          longitude: "START",
          speed: "START"
        }
      ],
      isRunning: false
    };
  }
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
      }
    });

    BackgroundGeolocation.on("location", location => {
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      BackgroundGeolocation.startTask(taskKey => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        const item = { ...location, key: +new Date() };
        this.setState({
          locations: [...this.state.locations, item]
        });
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on("error", error => {});

    BackgroundGeolocation.on("start", () => {
      this.setState({ isRunning: true });
    });

    BackgroundGeolocation.on("stop", () => {
      this.setState({ isRunning: false });
    });

    BackgroundGeolocation.on("authorization", status => {
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        Alert.alert(
          "Location services are disabled",
          "Would you like to open location settings?",
          [
            {
              text: "Yes",
              onPress: () => BackgroundGeolocation.showAppSettings()
            },
            {
              text: "No",
              onPress: () => alert("No Pressed"),
              style: "cancel"
            }
          ]
        );
      }
    });

    BackgroundGeolocation.on("background", () => {});

    BackgroundGeolocation.on("foreground", () => {});

    BackgroundGeolocation.checkStatus(status => {
      /**
       * status.isRunning
       * status.hasPermissions
       * status.authorization
       */

      // cosi starti il servizio all'apertura dell'app
      if (!status.isRunning) {
        BackgroundGeolocation.start();
      }
    });
  }
  componentWillUnmount() {
    BackgroundGeolocation.events.forEach(event =>
      BackgroundGeolocation.removeAllListeners(event)
    );
  }
  _handleButtonToggleTracking = () => {
    BackgroundGeolocation.checkStatus(({ isRunning, authorization }) => {
      if (isRunning) {
        BackgroundGeolocation.stop();
        return false;
      }
      if (authorization == BackgroundGeolocation.auth.AUTHORIZED) {
        // calling start will also ask user for permission if needed
        // permission error will be handled in permisision_denied event
        BackgroundGeolocation.start();
      } else {
        // Location services are disabled
        Alert.alert(
          "Location services disabled",
          "Would you like to open location settings?",
          [
            {
              text: "Yes",
              onPress: () => BackgroundGeolocation.showAppSettings()
            },
            {
              text: "No",
              onPress: () => console.log("No Pressed"),
              style: "cancel"
            }
          ]
        );
      }
    });
  };
  render() {
    const list = this.state.locations.map(item => (
      <View>
        <Text key={item.key} style={styles.listItem}>
          {item.latitude} :: {item.longitude} :: {item.speed}
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
              <Text style={styles.welcome}>toggle gps monitor</Text>
            </View>
          </TouchableWithoutFeedback>
          <Text style={styles.welcome}>locations :</Text>
          <View>{list}</View>
        </View>
      </ScrollView>
    );
  }
}

export default BgTracking;
