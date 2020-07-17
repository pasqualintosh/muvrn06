import React from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  Platform,
  ScrollView
} from "react-native";

import { connect } from "react-redux";

class DebugTrackScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: {}
    };
  }

  static navigationOptions = ({ navigation }) => {
    // const { BackTrack } = navigation.state.params;

    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {" "}
          Debug Live tracking{" "}
        </Text>
      )
    };
  };

  componentWillMount() {
    // this.checkStatus();
  }

  // async checkStatus() {
  //   const status = await BackgroundTask.statusAsync();

  //   console.log(status);
  //   this.setState({ status });

  //   if (status.available) {
  //     // Everything's fine
  //     return;
  //   }

  //   const reason = status.unavailableReason;
  //   if (reason === BackgroundTask.UNAVAILABLE_DENIED) {
  //     Alert.alert(
  //       "Denied",
  //       'Please enable background "Background App Refresh" for this app'
  //     );
  //   } else if (reason === BackgroundTask.UNAVAILABLE_RESTRICTED) {
  //     Alert.alert(
  //       "Restricted",
  //       "Background tasks are restricted on your device"
  //     );
  //   }
  // }

  render() {
    // const hour = new Date().getHours();
    console.log(this.props.livetracking.still_notification_log);
    let events = [];
    for (let [key, value] of Object.entries(this.props.events)) {
      console.log(key, value);
      events = [...events, { key, value }];
    }
    console.log(events);
    return (
      <View>
        <ScrollView
          style={{
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text>Kilometri precedenti: </Text>
          <Text>{this.props.livetracking.PrecDistanceSameMode}</Text>
          <Text>Eventi: </Text>
          {events.map((elem, index) => {
            if (elem.value)
              return <Text key={index}>{JSON.stringify(elem)}</Text>;
            // return (
            //   <Text key={index}>
            //     {elem.key} : {elem.value.counter} -{" "}
            //     {new Date(elem.value.date).toDateString()}
            //   </Text>
            // );
            else return <View key={index} />;
          })}
          <Text>Kilometri attuali: </Text>
          <Text>{this.props.livetracking.totDistance}</Text>
          <Text>Punti attuali: </Text>
          <Text>{this.props.livetracking.totPoints}</Text>
          <Text> Route :</Text>
          {this.props.livetracking.route.map(elem => (
            <Text key={elem.key}>
              long: {elem.longitude} lat: {elem.latitude} altitude:{" "}
              {elem.latitude} speed: {elem.speed}
            </Text>
          ))}
          <Text> Route Analyzed :</Text>
          {this.props.livetracking.routeAnalyzed.map(elem => (
            <Text key={elem.key}>
              long: {elem.longitude} lat: {elem.latitude} altitude:{" "}
              {elem.latitude} speed: {elem.speed}
            </Text>
          ))}
          <Text> Route not valid :</Text>
          {this.props.livetracking.routeNotvalid.map(elem => (
            <Text key={elem.key}>
              long: {elem.longitude} lat: {elem.latitude} altitude:{" "}
              {elem.latitude} speed: {elem.speed}
            </Text>
          ))}
          <Text> Activity :</Text>
          {this.props.livetracking.activity.map((elem, posit) =>
            elem.activity.map((activity, index) => (
              <Text key={index}>
                {posit} {activity.type}{" "}
                {activity.confidence ? activity.confidence : ""}
              </Text>
            ))
          )}
          <Text> Activity Analyzed:</Text>
          {this.props.livetracking.activityAnalyzed.map((elem, posit) =>
            elem.activity.map((activity, index) => (
              <Text key={index}>
                {posit} {activity.type}{" "}
                {activity.confidence ? activity.confidence : ""}
              </Text>
            ))
          )}
          <Text> Public Trasport Linea :</Text>
          {this.props.livetracking.refTrasportRoute.map((elem, index) =>
            elem.length ? (
              elem.map(elem => {
                const description = elem.properties ? (
                  <Text key={index}>
                    Name {elem.properties.name}, from {elem.properties.from}, to{" "}
                    {elem.properties.to}, ref {elem.properties.ref}
                  </Text>
                ) : elem.id ? (
                  <Text key={index}>id {elem.id}</Text>
                ) : (
                  <Text key={index}>{elem}</Text>
                );
                return description;
              })
            ) : (
              <Text key={index}> No public linea</Text>
            )
          )}
          <Text> Match Linea :</Text>

          {this.props.livetracking.numValidRoute.map((elem, index) =>
            elem !== [] ? (
              elem.map((data, index2) => (
                <Text key={index2 + 2}>Match {data}</Text>
              ))
            ) : (
              <Text key={index}> No public linea</Text>
            )
          )}

          <Text>BackgroundTask Status: </Text>
          <Text>{JSON.stringify(this.state.status)}</Text>
          <Text>Notification log: </Text>
          <Text>{this.props.livetracking.still_notification_log}</Text>
          <View
            style={{
              height: Dimensions.get("window").height,
              width: Dimensions.get("window").width / 5
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

const Recap = connect(state => {
  return {
    livetracking: state.tracking,
    events: state.trainings.statusCheckEvents
      ? state.trainings.statusCheckEvents
      : {}
  };
});

export default Recap(DebugTrackScreen);
