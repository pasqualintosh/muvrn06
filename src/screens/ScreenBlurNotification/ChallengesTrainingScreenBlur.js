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
import ChallengesTrainingScreen from "../ChallengesTrainingScreen/ChallengesTrainingScreen";
import Settings from "./../../config/Settings";

// import { Analytics, Hits as GAHits } from "react-native-google-analytics";
import { strings } from "../../config/i18n";
import IconMenuDrawer from "./../../components/IconMenuDrawer/IconMenuDrawer";

class ChallengesTrainingScreenBlur extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  componentDidMount() {
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
          {strings("id_3_01")}
        </Text>
      ),
      headerRight: <IconMenuDrawer navigation={navigation} />
    };
  };

  render() {
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />

        <ChallengesTrainingScreen
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

export default ChallengesTrainingScreenBlur;
