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

import NotificationPoint from "./../../components/NotificationPoint/NotificationPoint";

import ChartsWavesScreen from "../ChartsWavesScreen/ChartsWavesScreen";

import Settings from "./../../config/Settings";

// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

import { strings } from "../../config/i18n";
import Icon from "react-native-vector-icons/Ionicons";
import IconMenuDrawer from "./../../components/IconMenuDrawer/IconMenuDrawer";

class ChartsWavesScreenBlur extends React.Component {
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
          {strings("id_5_16")}
        </Text>
      ),
      headerRight: <IconMenuDrawer navigation={navigation} />
    };
  };

  changeHeaderTop = page => {
    console.log(page);
    let title = "Activities";
    this.props.navigation.setParams({
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {title}
        </Text>
      )
    });
  };

  render() {
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />

        <ChartsWavesScreen
          ref={view => {
            this.view = view;
          }}
          navigation={this.props.navigation}
          // changeHeaderTop={this.changeHeaderTop}
          // detailTrophies={this.detailTrophies}
        />
        <Blur viewRef={this.state.viewRef} />
      </Aux>
    );
  }
}

export default ChartsWavesScreenBlur;
