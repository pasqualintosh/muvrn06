import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator
} from "react-native";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";
import { strings } from "../../config/i18n";
import { WebView } from "react-native-webview";

class TournamentsRulesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     uri: strings('id_19_04')
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {"Rules"}
        </Text>
      )
    };
  };

  componentWillMount() {
    try {
      if (this.props.navigation.state.params.uri) {
        this.setState({ uri: this.props.navigation.state.params.uri });
      }
      
    } catch (error) {
      // this.setState({ uri: this.props.uri });
    }
  }
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
            renderLoading={() => (
              <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <ActivityIndicator size="large" color="#3d3d3d60" />
              </View>
            )}
            source={{
              uri: this.state.uri
            }}
            mediaPlaybackRequiresUserAction={false}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height + 150,
    backgroundColor: "#F7F8F9"
  },
  headerContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.3,
    backgroundColor: "#aabb3380"
  },
  verticalText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3d3d3d",
    fontSize: 12
  },
  textDescriptionSession: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3D3D3D",
    fontSize: 12,
    alignContent: "center",
    marginVertical: 3
  },
  textDescriptionNameSponsor: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3D3D3D",
    fontSize: 12,
    alignContent: "center"
  },
  rewardText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#fff",
    fontSize: 13
  },
  rewardInfoText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 15,
    marginHorizontal: 7
  },
  rules: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 14
  },
  texWhatSession: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3D3D3D",
    fontSize: 12,
    alignContent: "center"
  },
  whenRegularText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 10
  },
  infoBoldText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3d3d3d",
    fontSize: 10
  },
  infoRegularText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 12
  },
  subscriberRewardBottomText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 12,
    textAlign: "center"
  },
  startCounterText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#fff",
    fontSize: 10
  },
  subscriberRewardText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3d3d3d",
    fontSize: 12
  },
  completionText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3d3d3d",
    fontSize: 14
  }
});

export default TournamentsRulesScreen;
