// DetailSpecialTrainingScreen
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
import Modal from "react-native-modal";

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

const SCREEN_WIDTH = Dimensions.get("window").width;

const NORMAL_COLOR = "#0FACF3";
const SUCCESS_COLOR = "#39ca74";

let locale = undefined;

if (Platform.OS == "ios") {
  locale = NativeModules.SettingsManager.settings.AppleLocale;
  if (locale === undefined) {
    // iOS 13 workaround, take first of AppleLanguages array  ["en", "en-NZ"]
    locale = NativeModules.SettingsManager.settings.AppleLanguages[0]
    if (locale == undefined) {
          locale = "en" // default language
    }
}
}
else
  locale =
    NativeModules.I18nManager.localeIdentifier == ""
      ? "it"
      : NativeModules.I18nManager.localeIdentifier;

locale = locale.substr(0, 2);
const localeDateOpt = {
  //weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
};

class DetailSponsorScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sponsor: {}
    };

    
  }

  // static navigationOptions = {
  //   header: null
  // };

 


  componentWillMount() {
    const sponsor = this.props.navigation.getParam(
      "communityInfo",
      {
        st_id: 8,
        community: 0,
        name: "Moltivolti",
        training: "BURN IT",
        position: { lat: 38.1128543, lon: 13.359352 },
        website: "http://moltivolti.org/",
        email: "info@moltivolti.org",
        lat: 38.1128543,
        lng: 13.359352,
        twitter: "moltivolti",
        instagram: "moltivolti",
        facebook: "227756564088341",
        description: "coworking___res"
      }
    );
    this.setState({
      sponsor
    });
    
  }

  isEmpty(obj) {
    for (var x in obj) {
      return false;
    }
    return true;
  }

  getStatusPercentage = () => {
    try {
      let session_name = this.props.navigation.state.params.sessionName;
      let sessions_active = this.props.trainingsState.available_st_event.map(
        e => {
          return e.text_description;
        }
      );

      if (sessions_active.includes(session_name)) {
        let reward_id =
          this.props.trainingsState.available_st_event.filter(e => {
            return e.text_description == session_name;
          }).length > 0
            ? this.props.trainingsState.available_st_event.filter(e => {
                return e.text_description == session_name;
              })[0].st_event[0].reward_id
            : 0;

        if (!this.isEmpty(this.props.trainingsState.statusCheckEvents)) {
          if (session_name == "BURN IT") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "CaloriesInST_" + reward_id
              ].counter /
                1000);
            this.setState({ progress });
          }
          if (session_name == "Walk for the May-Day concert") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "KmInST_" + reward_id
              ].counter /
                1.6);
            this.setState({ progress });
          }
          if (session_name == "From Dusk till Dawn") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "WakeupInST_" + reward_id
              ].counter /
                3);
            this.setState({ progress });
          }
          if (session_name == "Food for thoughts") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "Food4ThoughtsInST_" + reward_id
              ].counter /
                5);
            this.setState({ progress });
          }
          if (session_name == "Kick start your day!") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "KickStartInST_" + reward_id
              ].counter /
                4);
            this.setState({ progress });
          }
          if (session_name == "Una nuova idea di weekend") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "ChiavetteriInST_" + reward_id
              ].counter /
                2);
            this.setState({ progress });
          }
          if (session_name == "Explore the  Historic Center") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "InsulaInST_" + reward_id
              ].counter /
                3);
            this.setState({ progress });
          }
          if (session_name == "Sustainable nighlife, happy hour guaranteed") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "ChiavetteriInST_" + reward_id
              ].points /
                1000);
            this.setState({ progress });
          }
          if (session_name == "Enjoy the best Fitness at the CNSA") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "BarcelonaCaloriesInST_" + reward_id
              ].counter /
                4000);
            this.setState({ progress });
          }
          if (session_name == "Keep MUVing for Sant Andreu") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "SantandreuInST_" + reward_id
              ].counter /
                20);
            this.setState({ progress });
          }
          if (session_name == "MR Peças Challenge") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "MRPecasInST_" + reward_id
              ].counter /
                10000);
            this.setState({ progress });
          }
          if (session_name == "Be healthy and MUVe yourself safe!") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "InsigpolInST_" + reward_id
              ].counter /
                1200);
            this.setState({ progress });
          }
          if (session_name == "Calorias da Gota") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "GotaInST_" + reward_id
              ].counter /
                2000);
            this.setState({ progress });
          }
          if (session_name == "Tomar café eu vou, café não costuma faiá.") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "EspressoInST_" + reward_id
              ].counter /
                5000);
            this.setState({ progress });
          }
          if (session_name == "Cajuíne-se!") {
            let progress =
              100 *
              ((this.props.trainingsState.statusCheckEvents[
                "PointsInST_" + reward_id
              ].counter
                ? this.props.trainingsState.statusCheckEvents[
                    "PointsInST_" + reward_id
                  ].counter
                : 0) /
                5);
            this.setState({ progress });
          }
          if (session_name == "Só Love, só Love!") {
            let progress =
              100 *
              ((this.props.trainingsState.statusCheckEvents[
                "SoLoveInST_" + reward_id
              ].points
                ? this.props.trainingsState.statusCheckEvents[
                    "SoLoveInST_" + reward_id
                  ].points *
                  (this.props.trainingsState.statusCheckEvents[
                    "SoLoveInST_" + reward_id
                  ].counter +
                    1)
                : 0) /
                6);
            this.setState({ progress });
          }
          if (session_name == "Walk to get new opportunities") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "WalktogetInST_" + reward_id
              ].counter /
                5);
            this.setState({ progress });
          }
        }
      }
    } catch (error) {
      this.setState({ progress: 0 });
    }
  };

  decrementEndTimer() {
    let minute_until_end_date = this.state.minute_until_end_date;
    if (minute_until_end_date > 0)
      this.setState({
        minute_until_end_date: minute_until_end_date - 1
      });
    else {
      hour_until_end_date = this.state.hour_until_end_date;
      this.setState({
        hour_until_end_date: hour_until_end_date - 1,
        minute_until_end_date: 59
      });
    }
  }

  onLeftSlide() {
    alert("slide left!");
    var self = this;
    this.setState({ swiped: true, leftSwiped: true }, () => {
      setTimeout(
        () => self.setState({ swiped: false, leftSwiped: false }),
        2500
      );
    });
  }

  onRightSlide() {
    // alert("slide right!");
    var self = this;
    this.setState({ swiped: true, rightSwiped: true }, () => {
      setTimeout(
        () => self.setState({ swiped: false, rightSwiped: false }),
        4000
      );
    });
  }

  onBothSlide() {
    alert("slide both!");
    var self = this;
    this.setState({ swiped: true, bothSwiped: true }, () => {
      setTimeout(
        () => self.setState({ swiped: false, bothSwiped: false }),
        2500
      );
    });
  }

  checkImage(eventId, eventsCompleted, eventsNumber) {
    if (eventsCompleted == eventsNumber) {
      return true;
    } else {
      let flag = false;
      this.props.trainingsState.training_events.forEach(e => {
        if (e.event.id == eventId && e.status == 1) flag = true;
      });
      if (flag) return true;
      else {
        return false;
      }
    }
  }

  renderSponsor() {
    let sponsor = getSponsor(
      this.props.navigation.state.params.special_training_id
    );

    return (
      <View style={{ marginBottom: 20 }}>
        <View
          style={{
            height: 20
          }}
        />
        <View
          style={{
            width: Dimensions.get("window").width * 0.9,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => this.showDescriptionIconModalSponsor()}
          >
            <View>
              <View>
                <Text
                  style={[
                    styles.textDescriptionSession,
                    { textAlign: "center" }
                  ]}
                >
                  {strings("powered_by")}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => this.showDescriptionIconModalSponsor()}
          >
            <View>
              <View>
                <Text
                  style={[
                    styles.textDescriptionNameSponsor,
                    { textAlign: "center", fontWeight: "bold" }
                  ]}
                >
                  {sponsor.name}
                </Text>
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#3D3D3D"
                  }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }



  

  back = () => {
    this.props.navigation.goBack();
  };

  

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

  _renderModalSponsorContent = (sponsor) => {
    
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
            paddingTop: 10
          }}
        >
          <Text style={styles.titleSponsor}>{sponsor.name}</Text>
        </View>
        <View style={{ paddingTop: 20, paddingBottom: 30 }}>
          <Text style={styles.text}>
            {sponsor.description ? strings(sponsor.description) : ""}
          </Text>
        </View>
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
        </View>
      </View>
    );
  };





  render() {
    // console.log(this.props);


    
    


    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height + 150,
          backgroundColor: "#F7F8F9"
        }}
      >
        
       {this._renderModalSponsorContent(this.state.sponsor)}
        
      </View>
    );
  }
}

const images = {
  1: require("../../assets/images/wawe_mobility_habits_light_blue.png"),
  4: require("../../assets/images/wave_trainings_pink.png"),
  2: require("../../assets/images/wawe_mobility_habits_pink.png"),
  3: require("../../assets/images/wawe_mobility_habits_green.png"),
  0: require("../../assets/images/wave_trainings_yellow.png")
};

export const master = {
  0: require("../../assets/images/trainings/training_master_special.png"),
  1: require("../../assets/images/trainings/training_master_newbie.png"),
  2: require("../../assets/images/trainings/training_master_rookie.png"),
  3: require("../../assets/images/trainings/training_master_pro.png"),
  4: require("../../assets/images/trainings/training_master_star.png")
};

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
    backgroundColor: "white",
    padding: 22,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
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

const withData = connect(state => {
  return {
    trainingsState: state.trainings
  };
});

export default withData(DetailSponsorScreen);
