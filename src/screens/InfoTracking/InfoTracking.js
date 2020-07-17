import React from "react";
import { View, Text } from "react-native";
import { StackNavigator } from "react-navigation";
import Welcome from "../Welcome/Welcome";
import MapScreen from "../MapScreen/MapScreen";
import Test from "../Test/Test";
import Icon from "react-native-vector-icons/Ionicons";

const InfoStackTracking = StackNavigator(
  {
    Info: {
      screen: Test
    },
    MappaCompleta: {
      screen: MapScreen
    }
  },
  {
    initialRouteName: "Info"
  }
);

class InfoTracking extends React.Component {
  render() {
    return <InfoStackTracking />;
  }
}

export default InfoTracking;
