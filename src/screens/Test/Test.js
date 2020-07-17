import React from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  Button,
  TouchableHighlight,
  ImageBackground,
  Platform,
  ScrollView
} from "react-native";
import { connect } from "react-redux";

import LinearGradient from "react-native-linear-gradient";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

import SvgPolygon from "../../components/SvgPolygon/SvgPolygon";

import Icon from "react-native-vector-icons/Ionicons";

import { StackNavigator } from "react-navigation";

class Test extends React.Component {
  // metodo se clicco mi rimanda alla scene con etichetta Home, specificata dentro StackNavigation
  ClickSurvey = () => {
    console.log("mappa");

    this.props.navigation.navigate("MappaCompleta");
  };

  ClickPreviousRoute = () => {
    this.props.navigation.navigate("PreviousRoute");
  };

  clickBack = () => {
    console.log("indietro");
    this.props.navigation.goBack();
  };

  constructor() {
    super();
  }

  // calcolo i minuti che sono passati nell'attivita
  // prendo la prima coordinata catturata e da li la data iniziale
  // poi calcolo la data corrente e poi la differenza con la prima data
  // converto in minuti e ritorno il valore ottenuto
  // potrebbe sbagliare di qualche secondo ma è accettabile
  getMinutes = () => {
    let t = 0;
    if (this.props.all.routeAnalyzed.length > 0) {
      t = Date.parse(new Date()) - this.props.all.routeAnalyzed[0].key;
    } else if (this.props.all.route.length > 0) {
      t = Date.parse(new Date()) - this.props.all.route[0].key;
    } else if (this.props.all.routeNotvalid.length > 0) {
      t = Date.parse(new Date()) - this.props.all.routeNotvalid[0].key;
    }

    let min = Math.round((t / 1000 / 60) % 60);
    return min;
  };

  static navigationOptions = {
    headerTitle: (
      <Text
        style={{
          left: Platform.OS == "android" ? 20 : 0
        }}
      >
        {" "}
        Track{" "}
      </Text>
    ),
    headerRight: (
      <Icon
        name="md-notifications"
        size={27}
        color="#9D9B9C"
        style={{ paddingLeft: 15, marginRight: 15 }}
      />
    )
  };

  render() {
    const list0 = this.props.all.routeNotvalid.map(item => (
      <View key={item.key}>
        <Text key={item.key} style={styles.listItem}>
          {item.latitude} :: {item.longitude} :: {item.time}{" "}
        </Text>
      </View>
    ));
    const list = this.props.all.route.map(item => (
      <View key={item.key}>
        <Text key={item.key} style={styles.listItem}>
          {item.latitude} :: {item.longitude} :: {item.time}{" "}
        </Text>
      </View>
    ));
    const list2 = this.props.all.routeAnalyzed.map(item => (
      <View key={item.key}>
        <Text key={item.key} style={styles.listItem}>
          {item.latitude} :: {item.longitude} :: {item.time}{" "}
        </Text>
      </View>
    ));
    const list3 = this.props.all.activity.map(item => (
      <View key={item.key}>
        <Text key={item.key} style={styles.listItem}>
          {item.activity[0].type}{" "}
        </Text>
      </View>
    ));
    const list4 = this.props.all.activityAnalyzed.map(item => (
      <View key={item.key}>
        <Text key={item.key} style={styles.listItem}>
          {item.activity[0].type}{" "}
        </Text>
      </View>
    ));
    return (
      <ScrollView>
        <SvgPolygon />
        <TouchableHighlight onPress={this.ClickSurvey}>
          <Text style={{ color: "#3363AD" }}>Mappa</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.ClickPreviousRoute}>
          <Text style={{ color: "#3363AD" }}>Tratte precedenti</Text>
        </TouchableHighlight>

        <Text style={{ color: "#3363AD" }}>
          Tratte {this.props.allLogin.routesCompleted}
        </Text>
        <Text style={{ color: "#3363AD" }}>
          Punti totali {this.props.allLogin.points}
        </Text>
        <Text style={{ color: "#3363AD" }}>
          Distanza totale Km {this.props.allLogin.kmTravelled.toFixed(0)}
        </Text>

        <Text style={{ color: "#3363AD" }}>Minuti {this.getMinutes()}</Text>
        <Text style={{ color: "#3363AD" }}>Punti {this.props.all.points}</Text>
        <Text style={{ color: "#3363AD" }}>
          totPoints {this.props.all.totPoints}
        </Text>
        <Text style={{ color: "#3363AD" }}>
          Coordinate valide {this.props.all.numValidRoute}
        </Text>
        <Text style={{ color: "#3363AD" }}>status {this.props.all.status}</Text>
        <Text style={{ color: "#3363AD" }}>
          distanza {this.props.all.distance}
        </Text>
        <Text style={{ color: "#3363AD" }}>
          totDistance {this.props.all.totDistance}
        </Text>
        <Text style={{ color: "#3363AD" }}>Coordinate non valide </Text>
        {list0}
        <Text style={{ color: "#3363AD" }}>Coordinate</Text>
        {list}
        <Text style={{ color: "#3363AD" }}>Coordinate analizzate</Text>
        {list2}
        <Text style={{ color: "#3363AD" }}>Attivita</Text>
        {list3}
        <Text style={{ color: "#3363AD" }}>Attivita analizzate</Text>
        {list4}
      </ScrollView>
    );
  }
}

const styles = {
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
  }
};

const Point = connect(state => {
  return {
    totPoints: state.tracking.totPoints,
    type: state.tracking.activityChoice.type,
    all: state.tracking,
    allLogin: state.login
  };
});

export default Point(Test);
