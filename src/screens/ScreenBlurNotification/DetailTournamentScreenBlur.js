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

import DetailTournamentScreen from "../DetailTournamentScreen/DetailTournamentScreen";

import Settings from "./../../config/Settings";

// import { Analytics, Hits as GAHits } from "react-native-google-analytics";
import IconMenuDrawer from "./../../components/IconMenuDrawer/IconMenuDrawer";

import { strings } from "../../config/i18n";

class DetailTournamentScreenBlur extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  static navigationOptions = (props, navigation) => {
    let title = "";
    try {
      title = navigation.state.params.tournament.name;
    } catch (error) {
      console.log(error);
    }
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {(title = "" ? strings("id_2_01") : title)}
        </Text>
      ),

      headerRight: <IconMenuDrawer navigation={props.navigation} />
    };
  };

  componentWillMount() {

  }

  componentDidMount() {
    // quando ho caricato il componente, posso dire a blur che è possibile fare il blur usando questa variabile
    this.setState({ viewRef: findNodeHandle(this.view) });
  }

  render() {
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />

        <DetailTournamentScreen
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

export default DetailTournamentScreenBlur;
