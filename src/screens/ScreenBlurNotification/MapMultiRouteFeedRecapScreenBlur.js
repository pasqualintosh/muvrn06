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
import NotificationPoint from "./../../components/NotificationPoint/NotificationPoint";
import MapMultiRouteFeedRecapScreen from "../MapMultiRouteFeedRecapScreen/MapMultiRouteFeedRecapScreen";

class MapMultiRouteFeedRecapScreenBlur extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  static navigationOptions = {
    headerTitle: (
      <Text
        style={{
          left: Platform.OS == "android" ? 20 : 0
        }}
      >
        Map trip recap
      </Text>
    )
  };

  componentDidMount() {
    // quando ho caricato il componente, posso dire a blur che è possibile fare il blur usando questa variabile
    this.setState({ viewRef: findNodeHandle(this.view) });
  }

  render() {
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />

        <MapMultiRouteFeedRecapScreen
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

export default MapMultiRouteFeedRecapScreenBlur;