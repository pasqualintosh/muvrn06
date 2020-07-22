import React from "react";
import { Text, Platform, findNodeHandle } from "react-native";

import Aux from "../../helpers/Aux";

import Blur from "../../components/Blur/Blur";

import PoolingUsersScreen from "../PoolingUsersScreen/PoolingUsersScreen";

class PoolingUsersScreenBlur extends React.Component {
  // questa struttura si deve ripete per ogni tab della tabBar altrimenti il blur e la notifica non sono presenti
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
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
          Passeggeri
        </Text>
      )
    };
  };

  render() {
    return (
      <Aux>
        <PoolingUsersScreen
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

export default PoolingUsersScreenBlur;
