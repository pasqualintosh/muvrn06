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

import CommunityDetailScreen from "../CommunityDetailScreen/CommunityDetailScreen";

import Settings from "./../../config/Settings";

// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

class CommunityDetailScreenBlur extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {navigation.getParam("communutyName", "Eni")}
        </Text>
      )
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

        <CommunityDetailScreen
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

export default CommunityDetailScreenBlur;