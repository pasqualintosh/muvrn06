/**
 * componente demo per i test sul plugin monitoraggio attività
 * @push
 */

import React from "react";
import { Text, View } from "react-native";

import { styles } from "./Style";

import ActivityRecognition from "react-native-activity-recognition";

export default class Activity extends React.Component {
  constructor() {
    super();
    // dentro lo stato vado a salvare un array di attività
    this.state = {
      serviceAvailable: true,
      activity: [
        {
          log: "start",
          time: new Date().toString(),
          key: +new Date()
        }
      ]
    };
  }
  componentWillMount() {
    // sottoscrizione al servizio
    this.unsubscribe = ActivityRecognition.subscribe(detectedActivities => {
      const mostProbableActivity = detectedActivities.sorted[0];
      const item = {
        log: mostProbableActivity.type,
        time: new Date().toString(),
        key: +new Date()
      };
      this.setState({
        activity: [...this.state.activity, item]
      });
    });
    // attivo il servizio
    const detectionIntervalMillis = 1000;
    ActivityRecognition.start(detectionIntervalMillis)
      .then(d => {
        // il servizio è disponibile
        // non c'e' bisogno di fare alcuna operazione
      })
      .catch(e => {
        // il servizio non è disponibile
        this.setState({
          serviceAvailable: false
        });
      });
  }
  componentWillUnmount() {
    // stoppo il servizio
    ActivityRecognition.stop();
    this.unsubscribe();
  }
  renderAlertMessage = () => {
    if (!this.state.serviceAvailable) {
      alert("Warning: activity recognition unavailable.");
    }
  };
  render() {
    const list = this.state.activity.map(item => (
      <Text key={item.key}>
        {item.log} - {item.time}
      </Text>
    ));
    this.renderAlertMessage();
    return <View style={styles.container}>{list}</View>;
  }
}
