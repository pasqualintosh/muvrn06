import React from "react";
import { View, Text, Platform, findNodeHandle } from "react-native";
import { createStackNavigator } from "react-navigation";

import MapScreen from "../../MapScreen/MapScreen";
import ChallengesScreen from "../../ChallengesScreen/ChallengesScreen";

import Icon from "react-native-vector-icons/Ionicons";
import Aux from "../../../helpers/Aux";
import NotificationPoint from "./../../../components/NotificationPoint/NotificationPoint";

import DailyRoutineMap from "../../../components/DailyRoutineMap/DailyRoutineMap";

import Blur from "../../../components/Blur/Blur";

import { strings } from "../../config/i18n";

const Challenge = createStackNavigator(
  {
    MappaCompleta: {
      screen: DailyRoutineMap
    },
    Info: {
      screen: ChallengesScreen
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("challenges")}
        </Text>
      ),
      headerLeft: null
    })
  }
);

class Challenges extends React.Component {
  // questa struttura si deve ripete per ogni tab della tabBar altrimenti il blur e la notifica non sono presenti
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  componentDidMount() {
    // quando ho caricato il componente, posso dire a blur che è possibile fare il blur usando questa variabile
    this.setState({ viewRef: findNodeHandle(this.view) });
  }

  render() {
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />
        <Challenge
          ref={view => {
            this.view = view;
          }}
        />
        <Blur viewRef={this.state.viewRef} />
      </Aux>
    );
  }
}

export default Challenges;
