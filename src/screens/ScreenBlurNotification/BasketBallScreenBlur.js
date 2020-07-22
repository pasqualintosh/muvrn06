import React from "react";
import {
  Text,
  Button,
  View,
  Dimensions,
  Platform,
  findNodeHandle,
  TouchableWithoutFeedback
} from "react-native";

import Aux from "../../helpers/Aux";

import Blur from "../../components/Blur/Blur";

import BasketBallScreen from "../BasketBallScreen/BasketBallScreen";

import Settings from "./../../config/Settings";

// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

import { pushNotifications } from "./../../services";

class BasketBallScreenBlur extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { viewRef: null, componentDidMount: false };
  }

  componentWillMount() {
    // per chiedere all'utente la prima volta l'accesso alle notifiche su ios
    pushNotifications.configure();

  }

  componentDidMount() {
    // quando ho caricato il componente, posso dire a blur che è possibile fare il blur usando questa variabile
    if (!this.state.viewRef) {
      this.setState({
        viewRef: findNodeHandle(this.view),
        componentDidMount: true
      });
    }

    console.log(this.props);
  }

  componentWillUnmount() {
    if (this.state.viewRef) {
      this.setState({ viewRef: null });
    }
  }

  static navigationOptions = props => ({
    headerTitle: (
      <View
        style={{
          left:
            Platform.OS == "android"
              ? Dimensions.get("window").width / 2 - 20
              : 0
        }}
      >
        <Text>Game</Text>
      </View>
    )
  });

  render() {
    return (
      <Aux>
        <BasketBallScreen
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

export default BasketBallScreenBlur;
