import React from "react";
import { View, Dimensions, Platform } from "react-native";
import { WebView } from "react-native-webview";

import OwnIcon from "../../components/OwnIcon/OwnIcon";
// import { Analytics, Hits as GAHits } from "react-native-google-analytics";
import Settings from "./../../config/Settings";

class YoutubeScreen extends React.Component {
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

  componentDidMount() {
    this.sendEventYoutube();
  }

  sendEventYoutube = () => {
   
  };

  /* video verticale  */
  /* 
      <View style={{ height: Dimensions.get("window").height,  width: Dimensions.get("window").width,  }}>
          <WebView
            javaScriptEnabled={true}
            domStorageEnabled={true}
            source={{ uri: "https://www.youtube.com/embed/iErLSEiQZic?autoplay=1&rel=0&loop=1" }}
            mediaPlaybackRequiresUserAction={false}
          />
        </View> 
      </View>*/

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
        <View
          style={{
            height: Dimensions.get("window").height / 2 - 200,
            backgroundColor: "black"
          }}
        />
        <View style={{ height: 240, backgroundColor: "black" }}>
          <WebView
            javaScriptEnabled={true}
            domStorageEnabled={true}
            source={{
              uri:
                "https://www.youtube.com/embed/bqQJXnaacTQ?autoplay=1&rel=0&loop=1"
            }}
            mediaPlaybackRequiresUserAction={false}
          />
        </View>
      </View>
    );
  }
}

export default YoutubeScreen;
