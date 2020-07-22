import React from "react";
import { View, Dimensions, Platform, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

import OwnIcon from "../../components/OwnIcon/OwnIcon";
import { strings } from "../../config/i18n";

class TemsAndConditionsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <View
          style={{
            left:
              Platform.OS == "android"
                ? Dimensions.get("window").width / 2 - 70
                : 0
          }}
        >
          <OwnIcon name="MUV_logo" size={40} color="black" />
        </View>
      )
    };
  };

  componentWillMount() {}

  componentDidMount() {}

  render() {
    return (
      <View
        style={{
          backgroundColor: "#000000",
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          flexDirection: "column",
          justifyContent: "flex-start"
        }}
      >
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <WebView
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
              renderLoading={ () =>
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <ActivityIndicator
             
              size="large"
              color="#3d3d3d60"
            />
          </View>
        }
            source={{
              uri: strings('id_19_01')
            }}
            mediaPlaybackRequiresUserAction={false}
          />
        </View>
      </View>
    );
  }
}

export default TemsAndConditionsScreen;
