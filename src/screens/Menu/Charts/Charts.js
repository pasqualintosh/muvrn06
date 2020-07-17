import React from "react";
import { View, Text, Platform } from "react-native";
import { createStackNavigator } from "react-navigation";

import ChartsScreen from "../../ChartsScreen/ChartsScreen";

import Icon from "react-native-vector-icons/Ionicons";
import Aux from "../../../helpers/Aux";

import { strings } from "../../config/i18n";

const Chart = createStackNavigator(
  {
    Info: {
      screen: ChartsScreen
    },
    initialRouteName: "Track"
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("activities")}
        </Text>
      ),
      headerLeft: null
    })
  }
);

class Charts extends React.Component {
  render() {
    return (
      <Aux>
        <Chart />
      </Aux>
    );
  }
}

export default Charts;
