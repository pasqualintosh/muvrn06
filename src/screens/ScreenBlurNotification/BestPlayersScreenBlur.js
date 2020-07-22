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

import BestPlayersScreen from "../BestPlayersScreen/BestPlayersScreen";
import NoBestPlayerScreen from "../NoBestPlayerScreen/NoBestPlayerScreen";

import Settings from "./../../config/Settings";

// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

import { strings } from "../../config/i18n";

class BestPlayersScreenBlur extends React.Component {
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

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {"Best Players"}
        </Text>
      )
    };
  };

  render() {
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />

        <BestPlayersScreen
          ref={view => {
            this.view = view;
          }}
          navigation={this.props.navigation}
          props={{ ...this.props }}
        />
        {/* <NoBestPlayerScreen /> */}

        <Blur viewRef={this.state.viewRef} />
      </Aux>
    );
  }
}

export default BestPlayersScreenBlur;
