import React from "react";
import { Text, Platform, findNodeHandle } from "react-native";

import Aux from "../../helpers/Aux";

import Blur from "../../components/Blur/Blur";

import NotificationPoint from "./../../components/NotificationPoint/NotificationPoint";

import Icon from "react-native-vector-icons/Ionicons";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

import InviteScreen from "../InviteScreen/InviteScreen";

import Settings from "./../../config/Settings";

// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

class InviteScreenBlur extends React.Component {
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
          Friends
        </Text>
      )
    };
  };

  render() {
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />

        <InviteScreen
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

export default InviteScreenBlur;
