import React from "react";
import { Text, Platform, findNodeHandle } from "react-native";
import Aux from "../../helpers/Aux";
import Blur from "../../components/Blur/Blur";
import NotificationPoint from "./../../components/NotificationPoint/NotificationPoint";
import FriendDetailScreen from "./../FriendDetailScreen/FriendDetailScreen";

class FriendDetailScreenBlur extends React.Component {
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
        Profile
      </Text>
    )
  };

  componentDidMount() {
    // quando ho caricato il componente, posso dire a blur che è possibile fare il blur usando questa variabile
    this.setState({ viewRef: findNodeHandle(this.view) });
    // console.log(this.props.navigation.state.params.friendData);
  }

  render() {
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />

        <FriendDetailScreen
          ref={view => {
            this.view = view;
          }}
          navigation={this.props.navigation}
          friendData={this.props.navigation.state.params.friendData}
          can_follow={this.props.navigation.state.params.can_follow}
        />
        <Blur viewRef={this.state.viewRef} />
      </Aux>
    );
  }
}

export default FriendDetailScreenBlur;
