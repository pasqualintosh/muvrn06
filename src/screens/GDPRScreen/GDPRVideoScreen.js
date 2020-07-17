import React from "react";
import { View, Dimensions, WebView, Platform } from "react-native";

import OwnIcon from "../../components/OwnIcon/OwnIcon";
// import { Analytics, Hits as GAHits } from "react-native-google-analytics";
import Settings from "./../../config/Settings";
import DeviceInfo from "react-native-device-info";
import { SafeAreaView } from "react-navigation";

class GDPRVideoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeGDPRVideo: "1LKbmP6ZJZA"
    };
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

  componentWillMount() {
    const typeGDPR = this.props.navigation.getParam("typeGDPR", "GDPRScreen");
    let typeGDPRVideo = "1LKbmP6ZJZA";
    if (typeGDPR == "GDPRScreen") {
      typeGDPRVideo = "1LKbmP6ZJZA";
    } else if (typeGDPR == "CommerciallyScreen") {
      typeGDPRVideo = "trosJU2Vqr4";
    } else if (typeGDPR == "CustomizedContentScreen") {
      typeGDPRVideo = "CoISAxPVxws";
    } else if (typeGDPR == "MailingListScreen") {
      typeGDPRVideo = "QAEtfKsyeNA";
    } else if (typeGDPR == "SponsorshipScreen") {
      typeGDPRVideo = "VSPgjPpFWa0";
    }
    //     https://youtu.be/trosJU2Vqr4
    // https://youtu.be/VSPgjPpFWa0
    // https://youtu.be/QAEtfKsyeNA
    // https://youtu.be/9wEyTQI_YLk
    this.setState({
      typeGDPRVideo
    });
  }

  componentDidMount() {
    this.sendEventYoutube();
  }

  sendEventYoutube = () => {
    // const ga = new Analytics(
    //   Settings.analyticsCode,
    //   DeviceInfo.getUniqueID(),
    //   1,
    //   DeviceInfo.getUserAgent()
    // );
    // let event = "open GDPRVideoScreen";
    // let gaEvent = new GAHits.Event(
    //   "user interaction", // category
    //   "click MUV feed", // action
    //   "click MUV feed", // label
    //   event // value
    // );
    // ga.send(gaEvent);
  };

  /* video verticale  */
  // typeGDPR: 'CommerciallyScreen'
  // CustomizedContentScreen
  // GDPRScreen
  // MailingListScreen
  // SponsorshipScreen

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{
            uri:
              "https://www.youtube.com/embed/" +
              this.state.typeGDPRVideo +
              "?autoplay=1&rel=0&loop=1"
          }}
          mediaPlaybackRequiresUserAction={false}
        />
      </SafeAreaView>
    );
  }
}

export default GDPRVideoScreen;
