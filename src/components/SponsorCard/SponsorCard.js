import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  Image,
  ImageBackground,
  NativeModules,
  Share,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import DetailSponsorModal from "../DetailSponsorModal/DetailSponsorModal";
import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from "react-native-google-analytics-bridge";
import Settings from "./../../config/Settings";
let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);
import { rewardImage } from "../../screens/RewardsScreen/RewardsScreen";
import { strings } from "../../config/i18n";
import analytics from "@react-native-firebase/analytics";
async function trackScreenView(screen) {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
}

class SponsorCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSponsor: false
    };
  }

  DeleteDescriptionIconModalSponsor = () => {
    // Alert.alert("weather");
    this.setState({
      activeSponsor: false
    });
  };

  showDescriptionIconModalSponsor = () => {
    Tracker.trackScreenView(
      "Modal " + this.props.screenRefer + " " + this.props.sponsor.name
    );
    trackScreenView(
      "Modal " + this.props.screenRefer + " " + this.props.sponsor.name
    );
    // Alert.alert("weather");
    this.setState({
      activeSponsor: true
    });
  };

  render() {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",

          // marginTop: 10,
          marginBottom: 10
        }}
      >
        <TouchableOpacity
          style={{
            width: Dimensions.get("window").width * 0.9,
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            borderRadius: 4,
            backgroundColor: "#007DC5",
            borderColor: "#0178C0",
            borderWidth: 2
          }}
          onPress={this.showDescriptionIconModalSponsor}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <View
              style={{
                width: Dimensions.get("window").width * 0.9,
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 13,
                  margin: 5,
                  marginLeft: 10,

                  textAlignVertical: "center",

                  fontFamily: "Montserrat-ExtraBold"
                }}
              >
                BEST PLAYER SPONSORSHIP
              </Text>
            </View>

            <View
              style={{
                width: Dimensions.get("window").width * 0.9 - 4,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4,
                backgroundColor: "#FFFFFF",
                borderColor: "#0178C0",
                borderWidth: 2
              }}
            >
              <Image
                source={rewardImage[this.props.sponsor.rewardsType]}
                style={{
                  width: Dimensions.get("window").width * 0.2,
                  height: Dimensions.get("window").width * 0.2,
                  marginTop: 10,
                  marginBottom: 10
                }}
              />
              <View
                style={{
                  width: 10
                }}
              ></View>

              <View
                style={{
                  width: Dimensions.get("window").width * 0.6 - 10
                }}
              >
                <Text
                  style={{
                    color: "#3D3D3D",
                    fontSize: 12,

                    textAlignVertical: "center",
                    margin: 5,
                    fontFamily: "OpenSans-Bold"
                  }}
                >
                  {this.props.sponsor.name}
                </Text>

                <Text
                  style={{
                    color: "#3D3D3D",
                    fontSize: 12,
                    margin: 5,

                    textAlignVertical: "center",

                    fontFamily: "OpenSans-Regular"
                  }}
                >
                  {this.props.sponsor.rewards
                    ? strings(this.props.sponsor.rewards)
                    : ""}
                </Text>
              </View>
            </View>
          </View>
          <Image
            source={require("./../../assets/images/little_big_star.png")}
            style={{
              width: 35,
              height: 35,
              position: "absolute",
              top: 5,
              right: 17
            }}
          />
        </TouchableOpacity>
        <DetailSponsorModal
          activeSponsor={this.state.activeSponsor}
          DeleteDescriptionIconModalSponsor={
            this.DeleteDescriptionIconModalSponsor
          }
          sponsor={this.props.sponsor}
        ></DetailSponsorModal>
      </View>
    );
  }
}

export default SponsorCard;
