import React from "react";
import { Text, Platform, findNodeHandle } from "react-native";

import Aux from "../../helpers/Aux";

import Blur from "../../components/Blur/Blur";

import NotificationPoint from "./../../components/NotificationPoint/NotificationPoint";
import ProfileScreen from "../ProfileScreen/ProfileScreen";
import IconMenuDrawer from "./../../components/IconMenuDrawer/IconMenuDrawer";

import { strings } from "../../config/i18n";

class ProfileScreenBlur extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  // componentWillMount() {
  //   const ga = new Analytics(
  //     Settings.analyticsCode,
  //     DeviceInfo.getUniqueID(),
  //     1,
  //     DeviceInfo.getUserAgent()
  //   );
  //   const screenView = new GAHits.ScreenView(
  //     Settings.analyticsAppName,
  //     this.constructor.name,
  //     DeviceInfo.getReadableVersion(),
  //     DeviceInfo.getBundleId()
  //   );
  //   ga.send(screenView);
  // }

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
          {strings("profile")}
        </Text>
      ),
      headerRight: <IconMenuDrawer navigation={navigation} />
    };
  };

  render() {
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />

        <ProfileScreen
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

export default ProfileScreenBlur;
