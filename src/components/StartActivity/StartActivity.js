// genera la lista dei recap delle attivita che puoi fare tipo trainings e muv

import React from "react";
import {
  View,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
  Text
} from "react-native";

import RecapTraining from "../RecapTraining/RecapTraining";

class StartActivity extends React.Component {
  moveProfile = () => {
    this.props.navigation.navigate("Profile");
  };

  // map degli eventi completati dell'ultima sessione attiva
  listStartEvents = () => {
    const DateNow = new Date();

    return (
      <View>
        <View>
          <RecapTraining modal_type="Muv" />
        </View>
        <View>
          <RecapTraining modal_type="Trainings" />
        </View>
      </View>
    );
  };

  render() {
    return (
      <View>
        {this.listStartEvents()}

        <View style={{ paddingBottom: Dimensions.get("window").height / 10 }} />
        {
          // aggiungo delo spazio in meno dato che il padding lo aggiunto prima su android e quindi qua non lo aggiungo
        }
        <View style={{ paddingTop: Dimensions.get("window").height * 0.23 }} />
      </View>
    );
  }
}

const styles = {
  Container: {
    height: Dimensions.get("window").height * 0.23,
    width: Dimensions.get("window").width,

    flexDirection: "column",
    justifyContent: "space-around"
  },
  centerContainer: {
    alignItems: "center",
    height: Dimensions.get("window").height * 0.1,
    justifyContent: "center"
  },
  ThreeContainer: {
    flex: 3,
    height: Dimensions.get("window").height * 0.13,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  circle: {
    width: 16,
    height: 16,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 15
  },
  leftContainer: {
    width: Dimensions.get("window").width * 0.35,
    height: Dimensions.get("window").height * 0.23,
    backgroundColor: "transparent",
    position: "absolute",
    left: Dimensions.get("window").width * 0.65,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  line: {
    width: "100%",
    height: 2,
    backgroundColor: "#fff",
    marginTop: 45
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  button: {
    backgroundColor: "#a1a1a1"
  },
  listItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
    padding: 20
  },
  list: {
    marginBottom: 20
  },
  listTrainings: {
    marginBottom: 20
  }
};

export default StartActivity;
