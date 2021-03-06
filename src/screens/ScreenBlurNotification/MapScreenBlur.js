import React from "react";
import {
  Text,
  Button,
  View,
  Dimensions,
  Platform,
  findNodeHandle
} from "react-native";

import Aux from "../../helpers/Aux";

import Blur from "../../components/Blur/Blur";
import Icon from "react-native-vector-icons/Ionicons";

import MapScreen from "../MapScreen/MapScreen";

import Settings from "./../../config/Settings";

// import { Analytics, Hits as GAHits } from "react-native-google-analytics";
import TripCompleted from "./../../components/TripCompleted/TripCompleted";
import { strings } from "../../config/i18n";

class MapScreenBlur extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  componentWillMount() {

  }

  componentDidMount() {
    // quando ho caricato il componente, posso dire a blur che è possibile fare il blur usando questa variabile
    this.setState({ viewRef: findNodeHandle(this.view) });
  }

  static navigationOptions = {
    headerTitle: (
      <Text
        style={{
          left: Platform.OS == "android" ? 20 : 0
        }}
      >
        {strings("id_1_06")}
      </Text>
    )
  };

  render() {
    return (
      <Aux>
        <MapScreen
          ref={view => {
            this.view = view;
          }}
          navigation={this.props.navigation}
        />

        <Blur viewRef={this.state.viewRef} />
      </Aux>
    );
  }
}

export default MapScreenBlur;
