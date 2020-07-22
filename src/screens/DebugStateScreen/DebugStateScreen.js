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
import moment from "moment";

class DebugStateScreen extends React.Component {
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
          Debug State{" "}
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


    let events = [];
    let login = []
    
    for (let [key, value] of Object.entries(this.props.livetracking)) {
      console.log(key, value);
      events = [...events, { key, value }];
    }
    for (let [key, value] of Object.entries(this.props.login)) {
      console.log(key, value);
      events = [...events, { key, value }];
    }

    const socket = this.props.connect.ws ? this.props.connect.ws.readyState ? this.props.connect.ws.readyState : 0 : -1 

    const tokenDate =  moment(this.props.login.date).format()


    return (
      <View>
        <ScrollView
          style={{
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width
          }}
          showsVerticalScrollIndicator={false}
        >
         <Text>socket: {socket}</Text>
        <Text>Scadenza token: {tokenDate}</Text>
          <Text>Live tracking: </Text>
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
          <Text>Login state: </Text>
          {login.map((elem, index) => {
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
    login: state.login,
    connect: state.connection

  };
});

export default Recap(DebugStateScreen);
