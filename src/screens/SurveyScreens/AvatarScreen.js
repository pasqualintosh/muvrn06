import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Platform,
  TouchableWithoutFeedback,
  NativeModules,
  Alert,
  StatusBar
} from "react-native";
import WavyArea from "./../../components/WavyArea/WavyArea";
import SurveySelectAvatar, {
  AvatarList,
  BnAvatarsList,
  NameList
} from "./../../components/SurveySelectAvatar/SurveySelectAvatar";
import LinearGradient from "react-native-linear-gradient";
import { BoxShadow } from "react-native-shadow";
import { connect } from "react-redux";
import { updateState } from "./../../domains/register/ActionCreators";
import Emoji from "@ardentlabs/react-native-emoji";
import Icon from "react-native-vector-icons/Ionicons";

console.log(Icon);

import {
  setReferralFromRegistration,
  clearReferralFromRegistration
} from "./../../domains/register/ActionCreators";

import { strings } from "../../config/i18n";

import Settings from "./../../config/Settings";

import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from "react-native-google-analytics-bridge";

let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);

import analytics from "@react-native-firebase/analytics";
async function trackScreenView(screen) {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
}

class AvatarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: null
    };
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    Tracker.trackScreenView("Signin.js");
    trackScreenView("Signin.js");

    if (
      this.props.registerState &&
      this.props.registerState.referral_url != null
    ) {
      this.props.dispatch(setReferralFromRegistration());
    }
  }

  handleTapAvatar = id => {
    this.setState({ avatar: id });
  };

  renderAvatarsList() {
    return (
      <View style={{}}>
        <SurveySelectAvatar
          selectedAvatar={this.state.avatar}
          {...this.props}
          avatarsList={AvatarList()}
          bnAvatarsList={BnAvatarsList()}
          nameList={NameList()}
          handleTapAvatar={id => this.handleTapAvatar(id)}
          style={{ height: Dimensions.get("window").height - 140 }}
        />
      </View>
    );
  }

  render() {
    let shadowOpt;
    if (Platform.OS == "ios") {
      shadowOpt = {
        width: Dimensions.get("window").width * 0.2,
        height: 40,
        color: "#111",
        border: 4,
        radius: 5,
        opacity: 0.25,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: 10
        }
      };
      if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
        shadowOpt = {
          width: Dimensions.get("window").width * 0.2,
          height: 28,
          color: "#111",
          border: 4,
          radius: 5,
          opacity: 0.25,
          x: 0,
          y: 1,
          style: {
            position: "absolute",
            top: 10
          }
        };
      }
    } else
      shadowOpt = {
        width: Dimensions.get("window").width * 0.2,
        height: 40,
        color: "#444",
        border: 6,
        radius: 5,
        opacity: 0.35,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: 10
        }
      };
    return (
      <ImageBackground
        source={require("./../../assets/images/bg-login.png")}
        style={styles.backgroundImage}
      >
        {/* HEADER */}
        <StatusBar backgroundColor={"#736fb1"} barStyle="light-content" />
        <View
          style={{
            height: 60,
            backgroundColor: "transparent",
            justifyContent: "space-around",
            flexDirection: "row"
          }}
        />
        {/* BODY */}
        <View
          style={{
            height: Dimensions.get("window").height - 140,
            backgroundColor: "transparent"
          }}
        >
          {this.renderAvatarsList()}
        </View>
        {/* FOOTER */}
        <View
          style={{
            height: 60,
            backgroundColor: "transparent",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          {/* <WavyArea
            data={negativeData}
            color={"#F7F8F9"}
            style={styles.bottomOverlayWave}
          /> */}
        </View>
        <ImageBackground
          source={require("../../assets/images/purple_wave_onbording.png")}
          style={styles.backgroundImageWave}
        >
          <View
            style={{
              height: 100,

              backgroundColor: "transparent",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <View style={styles.textHeaderContainer}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.dispatch(clearReferralFromRegistration());
                  this.props.navigation.goBack(null);
                }}
              >
                <View style={{ width: 30, height: 30 }}>
                  <Icon
                    name="ios-arrow-back"
                    style={{ marginTop: Platform.OS == "ios" ? 4 : 2 }}
                    size={18}
                    color="#fff"
                  />
                </View>
              </TouchableWithoutFeedback>
              <Text style={styles.textHeader}>
                {strings("please_select_y")} <Emoji name="bust_in_silhouette" />
              </Text>
            </View>
          </View>
        </ImageBackground>
        <ImageBackground
          source={require("../../assets/images/white_wave_onbording.png")}
          style={styles.backgroundImageWaveDown}
        >
          <View
            style={{
              height: 130,
              backgroundColor: "transparent",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <View
              // start={{ x: 0.0, y: 0.0 }}
              // end={{ x: 0.0, y: 1.0 }}
              // locations={[0, 1.0]}
              // colors={["#6497cc", "#7d4d99"]}
              style={{
                width: Dimensions.get("window").width,
                height: 130,
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View style={styles.textFooterContainer}>
                  <Text style={styles.textFooter}>
                    {strings("you_can_always_")}
                  </Text>
                </View>

                <View style={styles.buttonContainer}>
                  {/* <BoxShadow setting={shadowOpt} /> */}
                  <TouchableWithoutFeedback
                    onPress={() => {
                      if (this.state.avatar != null) {
                        this.props.dispatch(
                          updateState({ avatar: this.state.avatar })
                        );
                        // this.props.navigation.navigate("SurveyModal");
                        this.props.navigation.navigate("SurveyUserData");
                      } else Alert.alert("Oops", strings("seems_like_you_"));
                    }}
                    disabled={
                      this.props.status === "In register" ? true : false
                    }
                  >
                    <View style={styles.buttonBox}>
                      <Text style={styles.buttonGoOnText}>
                        {strings("go_on")}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>

            {/* <WavyArea
            data={negativeData}
            color={"#F7F8F9"}
            style={styles.bottomOverlayWave}
          /> */}
          </View>
        </ImageBackground>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  backgroundImageWave: {
    height: 100,
    width: Dimensions.get("window").width,
    position: "absolute"
    // top: Dimensions.get("window").height * 0.04 + 14
  },
  backgroundImageWaveDown: {
    height: 130,
    width: Dimensions.get("window").width,
    position: "absolute",
    bottom: 0
  },
  topOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: 50,
    top:
      Platform.OS == "ios"
        ? Dimensions.get("window").height * 0.2 - 50
        : Dimensions.get("window").height * 0.16 - 50
  },
  bottomOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: 70,
    top: 0
  },
  textHeaderContainer: {
    left: 20,
    flexDirection: "row",
    width: Dimensions.get("window").width * 0.85
  },
  textHeader: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold"
  },
  textFooterContainer: {
    // width: Dimensions.get("window").width * 0.6,
    // justifyContent: "center",
    // alignItems: "center"
    width: Dimensions.get("window").width * 0.6,
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center"
    // marginBottom: Platform.OS == "ios" ? 10 : 20
  },
  textFooter: {
    fontFamily: "OpenSans-Regular",
    color: "#3d3d3d",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "left"
  },
  buttonContainer: {
    width: Dimensions.get("window").width * 0.3,
    height: 60,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  buttonBox: {
    width: Dimensions.get("window").width * 0.2,
    height: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1
  },
  buttonGoOnText: {
    color: "#3363AD",
    fontFamily: "OpenSans-Regular",
    fontSize: 14
  }
});

export const positiveData = [
  {
    value: 60
  },
  {
    value: 40
  },
  {
    value: 50
  },
  {
    value: 40
  },
  {
    value: 50
  }
];

export const negativeData = [
  {
    value: -60
  },
  {
    value: -40
  },
  {
    value: -50
  },
  {
    value: -40
  },
  {
    value: -50
  }
];

const withData = connect(state => {
  return {
    registerState: state.register
  };
});

export default withData(AvatarScreen);
