import React from "react";
import { View, Text, findNodeHandle } from "react-native";
import { createStackNavigator } from "react-navigation";
import Welcome from "../Welcome/Welcome";
import MapScreen from "../MapScreen/MapScreen";
import Test from "../Test/Test";
import Icon from "react-native-vector-icons/Ionicons";
import NotificationPoint from "./../../../components/NotificationPoint/NotificationPoint";

const Activity = createStackNavigator({
  MappaCompleta: {
    screen: Test
  },
  Info: {
    screen: MapScreen
  }
});

class Activities extends React.Component {
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

        <Activity
          ref={view => {
            this.view = view;
          }}
        />
        <Blur viewRef={this.state.viewRef} />
      </Aux>
    );
  }
}

export default Activities;
