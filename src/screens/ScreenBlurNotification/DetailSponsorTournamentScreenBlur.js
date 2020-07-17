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

import DetailSponsorTournamentScreen from "../DetailSponsorTournamentScreen/DetailSponsorTournamentScreen";

import Settings from "./../../config/Settings";
import DeviceInfo from "react-native-device-info";
// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

import { strings } from "../../config/i18n";

class DetailSponsorTournamentScreenBlur extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  componentWillMount() {
    // const ga = new Analytics(
    //   Settings.analyticsCode,
    //   DeviceInfo.getUniqueID(),
    //   1,
    //   DeviceInfo.getUserAgent()
    // );
    // const screenView = new GAHits.ScreenView(
    //   Settings.analyticsAppName,
    //   this.constructor.name,
    //   DeviceInfo.getReadableVersion(),
    //   DeviceInfo.getBundleId()
    // );
    // ga.send(screenView);
  }

  componentDidMount() {
    // quando ho caricato il componente, posso dire a blur che è possibile fare il blur usando questa variabile
    this.setState({ viewRef: findNodeHandle(this.view) });
  }

  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />

        <DetailSponsorTournamentScreen
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

export default DetailSponsorTournamentScreenBlur;
