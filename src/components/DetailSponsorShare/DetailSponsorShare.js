// DetailSponsorModal
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Alert,
  ImageBackground,
  Animated,
  ScrollView,
  PanResponder,
  StatusBar,
  NativeModules,
  Linking
} from "react-native";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import Svg, { Circle, Line } from "react-native-svg";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import Icon from "react-native-vector-icons/Ionicons";

import { UpdateProfile } from "./../../domains/login/ActionCreators";
import {
  subscribeSpecialTrainingSessions,
  checkSpecialTrainingEvent,
  getSpecialTrainingSessionSubscribed
} from "./../../domains/trainings/ActionCreators";

import { strings } from "../../config/i18n";
import { translateEvent } from "./../../helpers/translateEvent";
import { translateSpecialEvent } from "./../../helpers/translateSpecialEvent";
import { infoEvents } from "./../../helpers/dataEvents";

import {
  SlideButton,
  SlideDirection
} from "./../../components/SlideButton/SlideButton";

import { getSponsor } from "./../../helpers/specialTrainingSponsors";
import moment from "moment";
import { getLanguageI18n } from "../../config/i18n";

import Settings from "./../../config/Settings";
import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from "react-native-google-analytics-bridge";

let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);

const SCREEN_WIDTH = Dimensions.get("window").width;

import analytics from "@react-native-firebase/analytics";
async function trackScreenView(screen) {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
}

class DetailSponsorShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sponsor: {}
    };
  }

  addTrackerGA() {
    Tracker.trackScreenView("DetailSponsorShare.js - Sponsor Air Lite");
    trackScreenView("DetailSponsorShare.js - Sponsor Air Lite");
  }

  componentWillMount() {
    this.setState({
      sponsor: this.props.sponsor
    });

    this.addTrackerGA();
  }

  moveWeb = sponsor => {
    Linking.canOpenURL(sponsor.website).then(supported => {
      if (supported) {
        Linking.openURL(sponsor.website);
      } else {
        console.log("Don't know how to open URI: " + sponsor.website);
      }
    });
  };

  moveInstagram = sponsor => {
    Linking.canOpenURL("instagram://user?username=" + sponsor.instagram).then(
      supported => {
        if (supported) {
          Linking.openURL("instagram://user?username=" + sponsor.instagram);
        } else {
          console.log(
            "Don't know how to open URI: " +
              "instagram://user?username=" +
              sponsor.instagram
          );
        }
      }
    );
  };

  moveFacebook = sponsor => {
    // Platform.OS === 'ios' ? 'fb://profile/139996222323553360774' : 'fb://page/139996232323232553360774/
    // const FANPAGE_URL_FOR_APP = `fb://page/${FANPAGE_ID}`
    Linking.canOpenURL(
      Platform.OS !== "android"
        ? "fb://profile/" + sponsor.facebook
        : "fb://page/" + sponsor.facebook
    ).then(supported => {
      if (supported) {
        Linking.openURL(
          Platform.OS !== "android"
            ? "fb://profile/" + sponsor.facebook
            : "fb://page/" + sponsor.facebook
        );
      } else {
        Linking.openURL("https://www.facebook.com/n/?" + sponsor.facebook);
      }
    });
  };

  moveTwitter = sponsor => {
    Linking.canOpenURL("twitter://user?screen_name=" + sponsor.twitter).then(
      supported => {
        if (supported) {
          Linking.openURL("twitter://user?screen_name=" + sponsor.twitter);
        } else {
          console.log(
            "Don't know how to open URI: " +
              "twitter://user?screen_name=" +
              sponsor.twitter
          );
        }
      }
    );
  };

  moveMap = sponsor => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q="
    });
    const latLng = `${sponsor.lat},${sponsor.lng}`;
    const label = sponsor.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + "mappe");
      }
    });
  };

  _renderSponsorContent = sponsor => {
    return (
      <View
        style={[
          styles.modalContent,
          {
            flexDirection: "column",
            alignContent: "space-between",
            alignItems: "center",
            justifyContent: "space-around"
          }
        ]}
      >
        <View
          style={{
            width: Dimensions.get("window").width * 0.9,
            flexDirection: "row",
            justifyContent: "space-around",
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center"
          }}
        >
          {sponsor.lat ? (
            <View
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => this.moveMap(sponsor)}
                style={
                  {
                    // backgroundColor: "white"
                  }
                }
              >
                <View
                  style={{
                    shadowRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.5,
                    backgroundColor: "transparent",
                    elevation: 2,
                    borderRadius: 20,
                    height: 40,
                    width: 40,
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white"
                  }}
                >
                  {Platform.OS !== "android" ? (
                    <Svg height="40" width="40">
                      <Circle cx="20" cy="20" r="15" fill="white" />
                      <OwnIcon
                        style={{
                          position: "relative",
                          backgroundColor: "transparent",

                          top: 5,
                          left: 5
                        }}
                        name="map_icn"
                        size={30}
                        color={"rgba(61, 61, 61, 1)"}
                      />
                    </Svg>
                  ) : (
                    <OwnIcon
                      style={{
                        position: "relative",
                        backgroundColor: "transparent",

                        top: 0,
                        left: 0
                      }}
                      name="map_icn"
                      size={30}
                      color={"rgba(61, 61, 61, 1)"}
                    />
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          ) : (
            <View style={{ position: "absolute" }} />
          )}
          {sponsor.website ? (
            <View
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => this.moveWeb(sponsor)}
                style={
                  {
                    // backgroundColor: "white"
                  }
                }
              >
                <View
                  style={{
                    shadowRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.5,
                    backgroundColor: "transparent",
                    elevation: 2,
                    borderRadius: 20,
                    height: 40,
                    width: 40,
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white"
                  }}
                >
                  {Platform.OS !== "android" ? (
                    <Svg height="40" width="40">
                      <Circle cx="20" cy="20" r="15" fill="white" />
                      <OwnIcon
                        style={{
                          position: "relative",
                          backgroundColor: "transparent",

                          top: 5,
                          left: 5
                        }}
                        name="website_icn"
                        size={30}
                        color={"rgba(61, 61, 61, 1)"}
                      />
                    </Svg>
                  ) : (
                    <OwnIcon
                      style={{
                        position: "relative",
                        backgroundColor: "transparent",

                        top: 0,
                        left: 0
                      }}
                      name="website_icn"
                      size={30}
                      color={"rgba(61, 61, 61, 1)"}
                    />
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          ) : (
            <View style={{ position: "absolute" }} />
          )}
          {sponsor.facebook ? (
            <View
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => this.moveFacebook(sponsor)}
                style={
                  {
                    // backgroundColor: "white"
                  }
                }
              >
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 0.0, y: 1.0 }}
                  locations={[0, 1.0]}
                  colors={["#3C5A99", "#2B1E99"]}
                  style={{
                    shadowRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.5,
                    backgroundColor: "transparent",
                    elevation: 2,
                    borderRadius: 20,
                    height: 40,
                    width: 40,
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white"
                  }}
                >
                  {Platform.OS !== "android" ? (
                    <View style={{ height: 40, width: 40 }}>
                      <OwnIcon
                        style={{
                          position: "relative",
                          backgroundColor: "transparent",

                          top: 5,
                          left: 5
                        }}
                        name="facebook_icn"
                        size={30}
                        color={"#ffffff"}
                      />
                    </View>
                  ) : (
                    <OwnIcon
                      style={{
                        position: "relative",
                        backgroundColor: "transparent",

                        top: 0,
                        left: 0
                      }}
                      name="facebook_icn"
                      size={30}
                      color={"#ffffff"}
                    />
                  )}
                </LinearGradient>
              </TouchableWithoutFeedback>
            </View>
          ) : (
            <View style={{ position: "absolute" }} />
          )}
          {sponsor.instagram ? (
            <View
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => this.moveInstagram(sponsor)}
                style={
                  {
                    // backgroundColor: "white"
                  }
                }
              >
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 1.0, y: 1.0 }}
                  locations={[0, 0.21, 0.37, 0.52, 0.74, 1.0]}
                  colors={[
                    "#5B4FE9",
                    "#8F39CE",
                    "#D53692",
                    "#F75274",
                    "#FCBB45",
                    "#FBE18A"
                  ]}
                  style={{
                    shadowRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.5,
                    backgroundColor: "transparent",
                    elevation: 2,
                    borderRadius: 20,
                    height: 40,
                    width: 40,
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white"
                  }}
                >
                  {Platform.OS !== "android" ? (
                    <View style={{ height: 40, width: 40 }}>
                      <OwnIcon
                        style={{
                          position: "relative",
                          backgroundColor: "transparent",

                          top: 5,
                          left: 5
                        }}
                        name="instagram_icn"
                        size={30}
                        color={"#ffffff"}
                      />
                    </View>
                  ) : (
                    <OwnIcon
                      style={{
                        position: "relative",
                        backgroundColor: "transparent",

                        top: 0,
                        left: 0
                      }}
                      name="instagram_icn"
                      size={30}
                      color={"#ffffff"}
                    />
                  )}
                </LinearGradient>
              </TouchableWithoutFeedback>
            </View>
          ) : (
            <View style={{ position: "absolute" }} />
          )}
          {sponsor.twitter ? (
            <View
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => this.moveTwitter(sponsor)}
                style={
                  {
                    // backgroundColor: "white"
                  }
                }
              >
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 0.0, y: 1.0 }}
                  locations={[0, 1.0]}
                  colors={["#33CCFF", "#337FFF"]}
                  style={{
                    shadowRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.5,
                    backgroundColor: "transparent",
                    elevation: 2,
                    borderRadius: 20,
                    height: 40,
                    width: 40,
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white"
                  }}
                >
                  {Platform.OS !== "android" ? (
                    <View style={{ height: 40, width: 40 }}>
                      <OwnIcon
                        style={{
                          position: "relative",
                          backgroundColor: "transparent",

                          top: 5,
                          left: 5
                        }}
                        name="twitter_icn"
                        size={30}
                        color={"#ffffff"}
                      />
                    </View>
                  ) : (
                    <OwnIcon
                      style={{
                        position: "relative",
                        backgroundColor: "transparent",

                        top: 0,
                        left: 0
                      }}
                      name="twitter_icn"
                      size={30}
                      color={"#ffffff"}
                    />
                  )}
                </LinearGradient>
              </TouchableWithoutFeedback>
            </View>
          ) : (
            <View style={{ position: "absolute" }} />
          )}
        </View>
      </View>
    );
  };

  render() {
    return <View>{this._renderSponsorContent(this.state.sponsor)}</View>;
  }
}

const styles = StyleSheet.create({
  Map: {
    fontWeight: "bold",
    fontFamily: "OpenSans-Bold",
    fontSize: 12,
    textAlign: "center",
    color: "#3D3D3D"
  },
  container: {
    backgroundColor: "#F7F8F9"
  },
  typeIcon: {
    textAlign: "center",
    color: "#3D3D3D",
    fontFamily: "OpenSans-Regular",

    fontSize: 8
  },
  coinSession: {
    color: "#3D3D3D",
    // fontSize: 15,
    // backgroundColor: "#00000050",
    // fontWeight: "bold",
    textAlign: "right",
    fontFamily: "Montserrat-ExtraBold"
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#3D3D3D",
    fontFamily: "OpenSans-Regular",
    fontSize: 14
  },
  titleSponsor: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#3D3D3D",
    fontFamily: "OpenSans-Regular",
    fontSize: 18
  },
  text: {
    textAlign: "left",
    color: "#3D3D3D",
    fontFamily: "OpenSans-Regular",
    fontSize: 12
  },
  headerContainer: {
    backgroundColor: "#E83475",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.25 - 50,
    justifyContent: "center",
    alignItems: "center"
  },
  bodyContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.75,
    // flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  textSection: {
    fontFamily: "OpenSans-Regular",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20
  },
  answerBoxes: {
    height: 80,
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  checkboxes: {
    height: 35,
    width: 35,
    borderRadius: 20,
    backgroundColor: "#F7F8F9",
    justifyContent: "center",
    alignItems: "center"
  },
  checkboxesGradient: {
    height: 18,
    width: 18,
    borderRadius: 10,
    backgroundColor: "#F7F8F9"
  },
  checkboxesText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 11,
    marginLeft: 6
  },
  checkboxesContainer: {
    width: Dimensions.get("window").width * 0.25,
    height: Dimensions.get("window").height * 0.1,
    // flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  boxesContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.15,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start"
    // backgroundColor: "#e33"
  },
  btnContainer: {
    backgroundColor: "#60368C",
    width: Dimensions.get("window").width * 0.4,
    height: 40,
    borderRadius: 4,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center"
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
  btnText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 15
  },
  btnText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 15
  },
  modalContent: {
    backgroundColor: "#F7F8F9",
    padding: 22
  },
  verticalText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#60368C",
    fontSize: 11
    // textAlignVertical: 'center',
    // // position: "relative",
    // // left: 0,
    // // top: 0,
    // // justifyContent: "center",
    // // alignItems: "flex-end",
    // transform: [{ rotate: "-90deg" }]
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
  whenRegularText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 10
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
    fontSize: 12,
    marginHorizontal: 7
  },
  startCounterText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#fff",
    fontSize: 10
  }
});

const slide_btn_styles = StyleSheet.create({
  container: {
    marginVertical: 15
  },
  buttonOuter: {
    marginTop: 20
  },
  buttonInner: {
    width: SCREEN_WIDTH - 40,
    height: 65,
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row"
  },
  button: {
    fontSize: 15,
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D",
    fontWeight: "bold",
    alignContent: "center"
  }
});

export default DetailSponsorShare;
