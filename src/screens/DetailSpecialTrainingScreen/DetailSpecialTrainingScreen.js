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
  Linking,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import Svg, { Circle, Line } from "react-native-svg";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import Aux from "./../../helpers/Aux";
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
import Settings from "./../../config/Settings";

import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from "react-native-google-analytics-bridge";

let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);

if (Platform.OS == "ios") {
  locale = NativeModules.SettingsManager.settings.AppleLocale;
  if (locale === undefined) {
    // iOS 13 workaround, take first of AppleLanguages array  ["en", "en-NZ"]
    locale = NativeModules.SettingsManager.settings.AppleLanguages[0];
    if (locale == undefined) {
      locale = "en"; // default language
    }
  }
} else
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

import analytics from "@react-native-firebase/analytics";
async function trackEvent(event, data) {
  await analytics().logEvent(event, { data });
}

async function trackScreenView(screen) {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
}

class DetailSpecialTrainingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bike: 0,
      tapped: false,
      scroll: new Animated.Value(0),
      active: false,
      activeSponsor: false,
      swiped: false,
      leftSwiped: false,
      rightSwiped: false,
      special_training_subscribed: false,
      special_training_expired: false,
      hour_until_end_date: false,
      minute_until_end_date: false,
      hour_until_start_date: false,
      days_until_start_date: false,
      progress: false,
      scrollEnabled: true
    };

    this.reward_id = null;
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.setState({
      special_training_subscribed: this.props.navigation.state.params
        .special_training_subscribed
    });

    let start_date = new Date(
      this.props.navigation.state.params.events[0].start_special_training
    );
    let end_date = new Date(
      this.props.navigation.state.params.events[0].end_special_training
    );
    let today = new Date();

    let s_msec = start_date - today;
    let s_mins = Math.floor(s_msec / 60000);
    let s_hrs = Math.floor(s_mins / 60);
    let s_days = Math.floor(s_hrs / 24);
    let s_a_hrs = s_hrs - s_days * 24;

    let e_msec = end_date - today;
    let e_mins = Math.floor(e_msec / 60000);
    let e_hrs = Math.floor(e_mins / 60);
    let e_a_mins = Math.floor(e_msec / 60000) - e_hrs * 60;
    let e_days = Math.floor(e_hrs / 24);

    if (s_hrs > 0 || s_days > 0) {
      this.setState({
        hour_until_start_date: s_a_hrs,
        days_until_start_date: s_days
      });
    }
    if (e_hrs < 24) {
      this.setState(
        {
          hour_until_end_date: e_hrs,
          minute_until_end_date: e_a_mins
        },
        () => {
          setInterval(() => {
            this.decrementEndTimer();
          }, 1000 * 60);
        }
      );
    }

    if (e_hrs < 0) {
      this.setState({ special_training_expired: true });
    }

    try {
      this.reward_id =
        this.props.trainingsState.available_st_event.filter(e => {
          return (
            e.text_description == this.props.navigation.state.params.sessionName
          );
        }).length > 0
          ? this.props.trainingsState.available_st_event.filter(e => {
              return (
                e.text_description ==
                this.props.navigation.state.params.sessionName
              );
            })[0].st_event[0].reward_id
          : [];
    } catch (error) {
      this.reward_id = null;
      console.log(error);
    }

    console.log(this.reward_id);

    this.getStatusPercentage();

    Tracker.trackScreenView(
      "DetailSpecialTrainingScreen.js - " +
        this.props.navigation.state.params.sessionName
    );
    trackScreenView(
      "DetailSpecialTrainingScreen.js - " +
        this.props.navigation.state.params.sessionName
    );
  }

  changeScrollEnabled = bool => {
    this.setState({
      scrollEnabled: bool
    });
  };

  componentWillMount() {
    const language = getLanguageI18n();
    console.log(language);
    try {
      switch (language) {
        case "en":
          break;
        case "nl":
          require("moment/locale/nl");
          break;
        case "sv":
          require("moment/locale/sv");
          break;
        case "es":
          require("moment/locale/es");
          break;
        case "it":
          require("moment/locale/it");
          break;
        case "ca":
          require("moment/locale/ca");
          break;
        case "pt":
          require("moment/locale/pt");
          break;
        case "br":
          require("moment/locale/br");
        case "rs":
          break;
        case "pl":
          require("moment/locale/pl");
          break;
        default:
          break;
      }
    } catch (error) {}
    // const data = new Date(getData).toString();
  }

  componentWillReceiveProps(props) {
    // alert(JSON.stringify(props));

    const sessionName = this.props.navigation.getParam(
      "sessionName",
      "Title Session"
    );

    // capisco quando lo special_training viene sottoscritto
    let special_training_sessions_subscribed = props.trainingsState.subscribed_special_training.map(
      item => {
        return item.training_title;
      }
    );

    // alert(special_training_sessions_subscribed.includes(sessionName));

    this.setState({
      special_training_subscribed: special_training_sessions_subscribed.includes(
        sessionName
      )
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
          if (session_name == "MUV to new opportunities") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "WalktogetInST_" + reward_id
              ].counter /
                5);
            this.setState({ progress });
          }
          if (session_name == "Take care of yourself!") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "WalktogetInST_" + reward_id
              ].counter /
                800);
            this.setState({ progress });
          }
          if (session_name == "It's Mobility Week!") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "FundaoInST_" + reward_id
              ].counter /
                3);
            this.setState({ progress });
          }
          if (session_name == "Mobilità Agrodolce 2019") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "AgrodolceInST_" + reward_id
              ].counter /
                1500);
            this.setState({ progress });
          }
          if (session_name == "Street Parade") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "StreetparadeInST_" + reward_id
              ].counter /
                3);
            this.setState({ progress });
          }
          if (session_name == "Movimento a ritmo africano") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "CiwaraInST_" + reward_id
              ].counter /
                3);
            this.setState({ progress });
          }
          if (session_name == "Il MUVimento ti fa bello!") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "MuvimentoInST_" + reward_id
              ].counter /
                5);
            this.setState({ progress });
          }
          if (session_name == "5000 pts = 1 tree for Gardunha forest") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "ForestInST_" + reward_id
              ].counter /
                5000);
            this.setState({ progress });
          }
          if (session_name == "Il movimento è cultura") {
            let progress =
              100 *
              (this.props.trainingsState.statusCheckEvents[
                "GlifoInST_" + reward_id
              ].counter /
                2000);
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
    Tracker.trackEvent("Special training", "Special training slide to accept");
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

  renderSessionWhat() {
    return (
      <View
        style={{
          paddingBottom: 10,
          paddingTop: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#FAB21E",
          borderTopWidth: 1,
          borderTopColor: "#FAB21E"
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width * 0.9,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
            // height: 60,
            // minHeight: 60,
          }}
        >
          <View
            style={{
              width: 50,
              height: 40,
              position: "absolute",
              left: 0,
              top: 15,
              // justifyContent: "center",
              alignItems: "flex-end",
              transform: [{ rotate: "-90deg" }]
            }}
          >
            <Text style={styles.verticalText}>{strings("what")}</Text>
          </View>
          <View
            style={{
              width: 40,
              height: 40,
              alignItems: "flex-end",
              transform: [{ rotate: "-90deg" }],
              opacity: 0
            }}
          >
            <Text style={styles.verticalText}>{strings("what")}</Text>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.9 - 60,
              marginLeft: 5,
              marginRight: 5,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              flexDirection: "row"
            }}
          >
            {/* {this.props.navigation.state.params.trainingDescription} */}
            {this.getLinkContentFromWhat(
              translateSpecialEvent(
                this.props.navigation.state.params.descriptionStSession
              )
            )}
          </View>
        </View>
      </View>
    );
  }

  renderSessionWhen() {
    if (!this.state.special_training_expired)
      return (
        <View
          style={{
            paddingBottom: 10,
            paddingTop: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#FAB21E"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.9,
              flexDirection: "row",
              justifyContent: "center",

              alignItems: "center"
              // height: 100,
            }}
          >
            <View
              style={{
                width: 60,
                height: 50,
                position: "absolute",
                left: 0,
                top: 15,
                // justifyContent: "center",
                alignItems: "flex-end",
                transform: [{ rotate: "-90deg" }]
              }}
            >
              <Text style={styles.verticalText}>{strings("when")}</Text>
            </View>
            <View
              style={{
                width: 40,
                height: 40,

                alignItems: "flex-end",
                transform: [{ rotate: "-90deg" }],
                opacity: 0
              }}
            >
              <Text style={styles.verticalText}>{strings("when")}</Text>
            </View>
            <View
              style={{
                width: Dimensions.get("window").width * 0.9 - 60,
                marginLeft: 5,
                marginRight: 5,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                flexDirection: "row"
              }}
            >
              <View
                style={{
                  width: Dimensions.get("window").width * 0.45 - 30,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Image
                  source={require("../../assets/images/date_start.png")}
                  style={{ width: 25, height: 25 }}
                />
                <Text style={styles.whenRegularText}>
                  {moment(
                    this.props.navigation.state.params.events[0]
                      .start_special_training
                  ).format("ll")}
                </Text>
                <Text style={styles.whenRegularText}>
                  {moment(
                    this.props.navigation.state.params.events[0]
                      .start_special_training
                  ).format("LT")}
                </Text>
              </View>
              <View
                style={{
                  width: Dimensions.get("window").width * 0.45 - 30,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Image
                  source={require("../../assets/images/date_end.png")}
                  style={{ width: 25, height: 25 }}
                />
                <Text style={styles.whenRegularText}>
                  {moment(
                    this.props.navigation.state.params.events[0]
                      .end_special_training
                  ).format("ll")}
                </Text>
                <Text style={styles.whenRegularText}>
                  {moment(
                    this.props.navigation.state.params.events[0]
                      .end_special_training
                  ).format("LT")}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    else return <View />;
  }

  renderSessionInfo(max_users, subscriber_users, completed_users = null) {
    if (!this.state.special_training_subscribed)
      return (
        <View
          style={{
            paddingBottom: 10,
            paddingTop: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#FAB21E"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.9,
              flexDirection: "row",
              justifyContent: "center",

              alignItems: "center"
              // height: 100,
            }}
          >
            <View
              style={{
                width: 50,
                height: 40,
                position: "absolute",
                left: 0,
                top: 15,
                // justifyContent: "center",
                alignItems: "flex-end",
                transform: [{ rotate: "-90deg" }]
              }}
            >
              <Text style={styles.verticalText}>{strings("info")}</Text>
            </View>
            <View
              style={{
                width: 40,
                height: 40,

                alignItems: "flex-end",
                transform: [{ rotate: "-90deg" }],
                opacity: 0
              }}
            >
              <Text style={styles.verticalText}>{strings("info")}</Text>
            </View>
            <View
              style={{
                width: Dimensions.get("window").width * 0.9 - 60,
                marginLeft: 5,
                marginRight: 5,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                flexDirection: "row"
              }}
            >
              <View
                style={{
                  width: Dimensions.get("window").width * 0.45 - 30,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.infoRegularText}>
                  {strings("available_slots")}
                </Text>
                <Text style={styles.infoBoldText}>
                  {Number.parseInt(max_users) -
                    (completed_users
                      ? Number.parseInt(completed_users)
                      : Number.parseInt(subscriber_users))}
                  {/*
                {subscriber_users != null ? subscriber_users : "nda"}
                {"/"}
                {max_users != null ? max_users : "nda"} 
                */}
                </Text>
              </View>
              <View
                style={{
                  width: Dimensions.get("window").width * 0.45 - 30,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.infoRegularText}>
                  {strings("for_whom_")}
                </Text>
                <Text style={styles.infoBoldText}>{strings("everyone")}</Text>
              </View>
            </View>
          </View>
        </View>
      );
    else return <View />;
  }

  renderSessionReward() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          console.log(this.reward_id);
          if (
            this.reward_id != null &&
            this.props.navigation.state.params.completed
          )
            this.props.navigation.navigate("RewardDetailScreen", {
              id: this.reward_id
            });
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width * 0.9,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "flex-start"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              height: 20,
              backgroundColor: "#7D4D99",
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={styles.rewardText}>{strings("reward")}</Text>
          </View>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 0.0, y: 1.0 }}
            locations={[0, 1.0]}
            colors={["#7D4D99", "#6497CC"]}
            style={{
              width: Dimensions.get("window").width * 0.9,
              height: 150,
              borderTopRightRadius: 5,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
              // flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20
            }}
          >
            <View
              style={{
                position: "absolute",
                top: 75 - 12.5,
                left: -12.5,
                backgroundColor: "#F7F8F9",
                height: 25,
                width: 25,
                borderRadius: 25
              }}
            />

            <View
              style={{
                position: "absolute",
                top: 75 - 12.5,
                left: Dimensions.get("window").width * 0.9 - 12.5,
                backgroundColor: "#F7F8F9",
                height: 25,
                width: 25,
                borderRadius: 25
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: Dimensions.get("window").width * 0.6
              }}
            >
              <View style={{ width: 50, height: 50 }}>
                <Image
                  source={require("../../assets/images/rewards/subscriptions.png")}
                  style={{ width: 50, height: 50 }}
                />
              </View>
              <View
                style={{
                  minHeight: 50,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {/* <Text style={styles.rewardInfoText}>
                  {translateSpecialEvent(
                    this.props.navigation.state.params.events[0]
                      .reward_description
                  )}
                </Text> */}
                {this.getLinkContentFromReward(
                  translateSpecialEvent(
                    this.props.navigation.state.params.events[0]
                      .reward_description
                  ),
                  true
                )}
              </View>
            </View>
          </LinearGradient>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderStartCounter() {
    if (
      (this.state.days_until_start_date || this.state.hour_until_start_date) &&
      (this.state.days_until_start_date > 0 ||
        this.state.hour_until_start_date > 0) &&
      !(this.state.hour_until_end_date || this.state.minute_until_end_date)
    ) {
      let days_string =
        Number.parseInt(this.state.days_until_start_date) == 1
          ? strings("id_4_03")
          : strings("id_4_02");
      let hours_string =
        Number.parseInt(this.state.hour_until_start_date) > 1
          ? strings("id_4_04")
          : strings("id_4_05");
      return (
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.8, y: 0.8 }}
          locations={[0, 1.0]}
          colors={["#FAB21E", "#FA941E"]}
          style={{
            width: Dimensions.get("window").width * 0.4,
            height: 30,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "flex-end",
            marginRight: 15
            // paddingHorizontal: 20,
          }}
        >
          <OwnIcon name="timer_icn" size={18} color="#FFF" />
          <Text style={styles.startCounterText}>
            - {this.state.days_until_start_date}
            {" " + days_string + " " + strings("id_4_09") + " "}
            {this.state.hour_until_start_date}
            {" " + hours_string}
          </Text>
        </LinearGradient>
      );
    }
  }

  renderEndCounter() {
    if (
      (this.state.hour_until_end_date || this.state.minute_until_end_date) &&
      this.state.hour_until_end_date > 0
    ) {
      let hours_string =
        Number.parseInt(this.state.hour_until_start_date) > 1
          ? strings("hours")
          : strings("id_4_05");

      let mins_string =
        Number.parseInt(this.state.minute_until_end_date) > 1
          ? strings("406")
          : strings("id_4_07");
      return (
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#FF0505", "#C70000"]}
          style={{
            width: Dimensions.get("window").width * 0.4,
            height: 30,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "flex-end",
            marginRight: 15
            // paddingHorizontal: 20
          }}
        >
          <OwnIcon name="timer_icn" size={18} color="#FFF" />
          <Text style={styles.startCounterText}>
            - {this.state.hour_until_end_date}
            {" " + hours_string + " " + strings("id_4_09") + " "}
            {this.state.minute_until_end_date}
            {" " + mins_string}
          </Text>
        </LinearGradient>
      );
    }
  }

  getLinkContentFromWhat = str => {
    // var str = "Hellofewfweesf  wweffewfewfew https://palermo.muv2020.eu/muv-open-day/ %sito% ciaowedsffewf";
    var first_perc = str.indexOf("https");

    if (first_perc == -1) {
      return (
        <Text
          style={[
            styles.textDescriptionSession,
            { textAlign: "center", fontWeight: "bold" }
          ]}
        >
          {str}
        </Text>
      );
    } else {
      let last_perc = str.indexOf("/ ", first_perc);

      let didascaliaStart = str.indexOf("%", last_perc);
      let didascaliaEnd = str.indexOf("%", didascaliaStart + 1);

      let introduction = str.substr(0, first_perc);

      let link = str.substr(first_perc, last_perc - first_perc + 1);
      let didascalia = str.substr(
        didascaliaStart + 1,
        didascaliaEnd - didascaliaStart - 1
      );

      let end = str.substr(didascaliaEnd + 1, str.lenght);

      // let end = str.substr(last_perc + 1, str.lenght);
      // document.getElementById("demo").innerHTML =   introduction + link + end ;

      return (
        <View>
          <Text
            style={[
              styles.textDescriptionSession,
              { textAlign: "center", fontWeight: "bold" }
            ]}
          >
            {introduction}
            <Text
              style={[
                styles.textDescriptionSession,
                {
                  textAlign: "center",
                  fontWeight: "bold",
                  textDecorationLine: "underline"
                }
              ]}
              onPress={() => this.moveWeb({ website: link })}
            >
              {didascalia}
            </Text>
            {end}
          </Text>
        </View>
      );
    }
  };

  getLinkContentFromDescription = (str, completed) => {
    // var str = "Hellofewfweesf  wweffewfewfew https://palermo.muv2020.eu/muv-open-day/ %sito% ciaowedsffewf";
    var first_perc = str.indexOf("https");

    if (first_perc == -1) {
      return (
        <Text
          style={{
            fontFamily: "OpenSans-Bold",
            color: completed ? "#FFFFFF" : "#3D3D3D",
            fontSize: 12
          }}
        >
          {str}
        </Text>
      );
    } else {
      let last_perc = str.indexOf("/ ", first_perc);

      let didascaliaStart = str.indexOf("%", last_perc);
      let didascaliaEnd = str.indexOf("%", didascaliaStart + 1);

      let introduction = str.substr(0, first_perc);

      let link = str.substr(first_perc, last_perc - first_perc + 1);
      let didascalia = str.substr(
        didascaliaStart + 1,
        didascaliaEnd - didascaliaStart - 1
      );

      let end = str.substr(didascaliaEnd + 1, str.lenght);

      // let end = str.substr(last_perc + 1, str.lenght);
      // document.getElementById("demo").innerHTML =   introduction + link + end ;

      return (
        <View>
          <Text
            style={{
              fontFamily: "OpenSans-Bold",
              color: completed ? "#FFFFFF" : "#3D3D3D",
              fontSize: 12
            }}
          >
            {introduction}
            <Text
              style={{
                fontFamily: "OpenSans-Bold",

                fontSize: 12,
                color: completed ? "#FFFFFF" : "#3D3D3D",
                textDecorationLine: "underline"
              }}
              onPress={() => this.moveWeb({ website: link })}
            >
              {didascalia}
            </Text>
            {end}
          </Text>
        </View>
      );
    }
  };

  getLinkContentFromReward = (str, completed) => {
    // var str = "Hellofewfweesf  wweffewfewfew https://palermo.muv2020.eu/muv-open-day/ %sito% ciaowedsffewf";
    var first_perc = str.indexOf("https");

    if (first_perc == -1) {
      return <Text style={styles.rewardInfoText}>{str}</Text>;
    } else {
      let last_perc = str.indexOf("/ ", first_perc);

      let didascaliaStart = str.indexOf("%", last_perc);
      let didascaliaEnd = str.indexOf("%", didascaliaStart + 1);

      let introduction = str.substr(0, first_perc);

      let link = str.substr(first_perc, last_perc - first_perc + 1);
      let didascalia = str.substr(
        didascaliaStart + 1,
        didascaliaEnd - didascaliaStart - 1
      );

      let end = str.substr(didascaliaEnd + 1, str.lenght);

      // let end = str.substr(last_perc + 1, str.lenght);
      // document.getElementById("demo").innerHTML =   introduction + link + end ;

      return (
        <View>
          <Text style={styles.rewardInfoText}>
            {introduction}
            <Text
              style={[
                styles.rewardInfoText,
                { textDecorationLine: "underline" }
              ]}
              onPress={() => this.moveWeb({ website: link })}
            >
              {didascalia}
            </Text>
            {end}
          </Text>
        </View>
      );
    }
  };

  renderEventsDescription(events, eventsCompleted, eventsNumber, color) {
    // if (
    //   events &&
    //   this.props.navigation.state.params.special_training_subscribed
    // )
    if (events)
      return events.map(e => {
        // const completed = this.checkImage(e.id, eventsCompleted, eventsNumber);
        const completed = this.props.navigation.state.params.completed;
        const shadow = completed
          ? {}
          : {
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,

              elevation: 2
            };

        let numberCounter = 0;
        let completedCounter = 0;
        // se non è completato vedo se ha un contatore da visualizzare
        if (!completed) {
          let eventsData = infoEvents(e.text_description);

          if (eventsData.counter.length) {
            const statusCheckEvents = this.props.trainingsState
              .statusCheckEvents
              ? this.props.trainingsState.statusCheckEvents
              : {};
            console.log(statusCheckEvents);
            const dataSave = statusCheckEvents[eventsData.counter]
              ? statusCheckEvents[eventsData.counter]
              : 0;
            console.log(dataSave);
            numberCounter = dataSave ? dataSave.counter : 0;
            completedCounter = eventsData.completedCounter;
          }
        }
        console.log(numberCounter);

        return (
          <View key={e.id}>
            <View
              style={{
                backgroundColor: completed ? color : "#FFFFFF",
                width: Dimensions.get("window").width * 0.9,
                alignContent: "flex-start",
                justifyContent: "flex-start",
                flexDirection: "column",
                alignItems: "flex-start",
                borderRadius: 4,
                ...shadow
              }}
            >
              <View
                style={{
                  width: Dimensions.get("window").width * 0.9,
                  alignContent: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => this.showDescriptionIconModal()}
                >
                  <View
                    style={{
                      width: Dimensions.get("window").width * 0.9,
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 15
                    }}
                  >
                    {this.getLinkContentFromDescription(
                      translateSpecialEvent(e.description),
                      completed
                    )}

                    {this.viewIcon(e, completed ? "#FFFFFF" : "#3D3D3D")}
                  </View>
                </TouchableWithoutFeedback>
              </View>
              {this.state.progress ? (
                <View
                  style={{
                    height: 2,
                    backgroundColor: color,
                    width:
                      (Dimensions.get("window").width *
                        0.9 *
                        this.state.progress) /
                      100,
                    alignContent: "flex-start",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    borderRadius: 20
                  }}
                />
              ) : (
                <View />
              )}
            </View>

            {this.renderStartCounter()}
            {this.renderEndCounter()}
            <View
              style={{
                height: 50
              }}
            />
          </View>
        );
      });
  }

  renderObtainableCoins(obtainableCoins) {
    return (
      <View
        style={{
          justifyContent: "flex-end",
          flexDirection: "row",
          width: Dimensions.get("window").width * 0.9
        }}
      >
        <Image
          source={require("../../assets/images/coins_shadow_icn.png")}
          style={{
            width: 20,
            height: 20,
            marginTop: Platform.OS === "android" ? 6 : 0
          }}
        />
        <View style={{ width: 7, height: 7 }} />
        <Text style={[styles.coinSession, { fontSize: 20 }]}>
          {obtainableCoins}
        </Text>
      </View>
    );
  }

  back = () => {
    this.props.navigation.goBack();
  };

  viewIcon = (e, color) => {
    let iconChoose = [];
    if (e.quiz || e.survey) {
      return (
        <View
          style={{
            height: 50,

            width: 70,
            flexDirection: "row",
            alignItems: "center",
            // justifyContent: "space-between"
            justifyContent: "flex-end"
          }}
        >
          <OwnIcon name="quiz_training_icn" size={35} color={color} />
        </View>
      );
    } else {
      // e.typology = ROT+FQY
      // console.log(e.typology);
      let type = "";
      if (e.typology) type = e.typology.split("+");
      console.log(type);

      for (indexType = 0; indexType < type.length; indexType++) {
        const foundType = type[indexType];

        if (foundType === "MOD") {
          iconChoose = [...iconChoose, "transit_mode_training_icn"];
        } else if (foundType == "PTS") {
          iconChoose = [...iconChoose, "points_training_icn"];
        } else if (foundType == "STS") {
          iconChoose = [...iconChoose, "specific_time_span_training_icn"];
        } else if (foundType == "MOB") {
          iconChoose = [...iconChoose, "quiz_training_icn"];
        } else if (foundType == "ROT") {
          iconChoose = [...iconChoose, "routinary_trip_training_icn"];
        } else if (foundType == "FQY") {
          iconChoose = [...iconChoose, "trip_frequency_training_icn"];
        } else if (foundType == "QUZ") {
          iconChoose = [...iconChoose, "quiz_training_icn"];
        } else if (foundType == "WEA") {
          iconChoose = [...iconChoose, "weather_conditions_training_icn"];
        }
      }

      if (iconChoose.length === 1) {
        return (
          <View
            style={{
              height: 50,

              width: 70,
              flexDirection: "row",
              alignItems: "center",
              // justifyContent: "space-between"
              justifyContent: "flex-end"
            }}
          >
            <OwnIcon name={iconChoose[0]} size={35} color={color} />
          </View>
        );
      } else if (iconChoose.length === 2) {
        return (
          <View
            style={{
              height: 50,

              width: 70,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
              // justifyContent: "flex-end"
            }}
          >
            <OwnIcon name={iconChoose[0]} size={35} color={color} />

            <OwnIcon name={iconChoose[1]} size={35} color={color} />
          </View>
        );
      }
    }
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

  _renderModalSponsorContent = () => {
    let sponsor = getSponsor(
      this.props.navigation.state.params.special_training_id
    );
    let sponsor_desc = "";
    if (
      sponsor.description.includes("Ciwara") ||
      sponsor.description.includes("Gioco Urbano") ||
      sponsor.description.includes("Pubblica Amministrazione")
    ) {
      sponsor_desc = sponsor.description;
    } else {
      sponsor_desc = sponsor.description ? sponsor.description : "";
    }
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
          <Text style={styles.text}>{sponsor_desc}</Text>
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

  _renderModalContent = () => {
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
        <Image
          source={require("../../assets/images/trainings/training_feed_icn.png")}
          style={{ width: 75, height: 75 }}
        />
        <View
          style={{
            width: Dimensions.get("window").width * 0.9,
            paddingTop: 10
          }}
        >
          <Text style={styles.title}>Training Legend</Text>
        </View>
        <View style={{ paddingTop: 20, paddingBottom: 20 }}>
          <Text style={styles.text}>
            {
              "Each Training Event offers you a challenge to overcome.\nThese challenges are created by picking one or more of the following categories:"
            }
          </Text>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width * 0.8,
            flexDirection: "row"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon
              name="transit_mode_training_icn"
              size={30}
              color={"#3D3D3D"}
            />

            <Text style={styles.typeIcon}>Transit mode</Text>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon name="check_in_training_icn" size={30} color={"#3D3D3D"} />

            <Text style={styles.typeIcon}>Check-in</Text>
          </View>
        </View>

        <View
          style={{
            width: Dimensions.get("window").width * 0.8,
            flexDirection: "row"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon
              name="trip_frequency_training_icn"
              size={30}
              color={"#3D3D3D"}
            />

            <Text style={styles.typeIcon}>Frequency trip</Text>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon name="trivia_training_icn" size={30} color={"#3D3D3D"} />

            <Text style={styles.typeIcon}>Trivia</Text>
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width * 0.8,
            flexDirection: "row"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon
              name="routinary_trip_training_icn"
              size={30}
              color={"#3D3D3D"}
            />

            <Text style={styles.typeIcon}>Routinary trip</Text>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon
              name="shared_trip_training_icn"
              size={30}
              color={"#3D3D3D"}
            />

            <Text style={styles.typeIcon}>Shared trip</Text>
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width * 0.8,
            flexDirection: "row"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon
              name="mobility_habits_training_icn"
              size={30}
              color={"#3D3D3D"}
            />

            <Text style={styles.typeIcon}>Mobility habits</Text>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon name="points_training_icn" size={30} color={"#3D3D3D"} />

            <Text style={styles.typeIcon}>Points</Text>
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width * 0.8,
            flexDirection: "row"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon name="quiz_training_icn" size={30} color={"#3D3D3D"} />

            <Text style={styles.typeIcon}>Quiz</Text>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon
              name="weather_conditions_training_icn"
              size={30}
              color={"#3D3D3D"}
            />

            <Text style={styles.typeIcon}>Weather conditions</Text>
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width * 0.8,
            flexDirection: "row"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon name="sponsors_training_icn" size={30} color={"#3D3D3D"} />

            <Text style={styles.typeIcon}>Sponsors</Text>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <OwnIcon
              name="specific_time_span_training_icn"
              size={30}
              color={"#3D3D3D"}
            />

            <Text style={styles.typeIcon}>Specific time span</Text>
          </View>
        </View>
      </View>
    );
  };

  DeleteDescriptionIconModal = () => {
    // Alert.alert("weather");
    this.setState({
      active: false
    });
  };

  DeleteDescriptionIconModalSponsor = () => {
    // Alert.alert("weather");
    this.setState({
      activeSponsor: false
    });
  };

  showDescriptionIconModal = () => {
    // Alert.alert("weather");
    this.setState({
      active: true
    });
  };

  showDescriptionIconModalSponsor = () => {
    // Alert.alert("weather");
    this.setState({
      activeSponsor: true
    });
  };

  onScroll = event => {
    //console.log(event.nativeEvent.contentOffset.y);
    const offsetY = event.nativeEvent.contentOffset.y;

    console.log(offsetY);
    this.setState({
      scroll: offsetY
    });
  };

  renderSlideBtn(
    special_training_id,
    max_users,
    subscriber_users,
    completed_users = null
  ) {
    const SlideButtonView = (
      <View style={slide_btn_styles.container}>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.8, y: 0.8 }}
          locations={[0, 1.0]}
          colors={["#FA941E", "#FAB21E"]}
          style={{
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 35
          }}
        >
          <SlideButton
            onSlideSuccess={() => this.onRightSlide()}
            slideDirection={SlideDirection.RIGHT}
            width={SCREEN_WIDTH - 40}
            height={65}
            changeScrollEnabled={this.changeScrollEnabled}
          >
            <View style={slide_btn_styles.buttonInner}>
              <View
                style={{
                  height: 55,
                  width: 55,
                  backgroundColor: "#ffffff70",
                  marginHorizontal: 7,
                  borderRadius: 100,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <OwnIcon name="arrow-slide" size={25} color="#3D3D3D" />
              </View>
              <Text style={slide_btn_styles.button}>
                {strings("slide_to_accept")}
              </Text>
            </View>
          </SlideButton>
        </LinearGradient>
        <View
          style={{
            height: 200
          }}
        />
      </View>
    );

    const OkButtonView = (
      <View style={slide_btn_styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            Tracker.trackEvent("Special training", "Special training accepted");
            trackEvent("special_training_enrolled", "Special training");
            // this.props.dispatch(
            //   subscribeSpecialTrainingSessions({}, special_training_id, () => {
            //     this.props.dispatch(getSpecialTrainingSessionSubscribed());
            //   })
            // );
            // console.log("OkButtonView");
            // console.log(this.props.navigation.state.params.sessionName);
            let session_name = this.props.navigation.state.params.sessionName;
            if (session_name == "Giretto d'Italia 2019")
              setTimeout(() => {
                this.props.navigation.navigate("ChangeFrequentTripScreen");
              }, 500);
            if (
              session_name == "Love is in the not polluted air" ||
              session_name == "MUV & MUSIC"
            ) {
              console.log(this.props.mfrState);
              let flag = false;
              for (let index = 0; index < this.props.mfrState.length; index++) {
                const element = this.props.mfrState[index];
                if (
                  element.start_type == 1 &&
                  (element.end_type == 2 || element.end_type == 4)
                )
                  flag = true;
              }

              if (!flag) {
                // this.props.dispatch(
                //   subscribeSpecialTrainingSessions(
                //     {},
                //     special_training_id,
                //     () => {
                //       this.props.dispatch(
                //         getSpecialTrainingSessionSubscribed()
                //       );
                //     }
                //   )
                // );
                this.props.navigation.navigate("ChangeFrequentTripScreen", {
                  special_training_id
                });
              } else {
                this.props.dispatch(
                  subscribeSpecialTrainingSessions(
                    {},
                    special_training_id,
                    () => {
                      this.props.dispatch(
                        getSpecialTrainingSessionSubscribed()
                      );
                    }
                  )
                );
              }
            } else {
              this.props.dispatch(
                subscribeSpecialTrainingSessions(
                  {},
                  special_training_id,
                  () => {
                    this.props.dispatch(getSpecialTrainingSessionSubscribed());
                  }
                )
              );
            }
          }}
        >
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 0.8, y: 0.8 }}
            locations={[0, 1.0]}
            colors={["#FA941E", "#FAB21E"]}
            style={{
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 35
            }}
          >
            <View
              style={[
                slide_btn_styles.buttonInner,
                {
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center"
                }
              ]}
            >
              <Text style={slide_btn_styles.button}>
                {strings("id_0_12").toLocaleUpperCase()}
              </Text>
            </View>
          </LinearGradient>
        </TouchableWithoutFeedback>
        <View
          style={{
            height: 200
          }}
        />
      </View>
    );

    const UAreInButtonView = (
      <View style={slide_btn_styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.dispatch(
              subscribeSpecialTrainingSessions({}, special_training_id)
            );
          }}
        >
          <View
            style={{
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 35,
              backgroundColor: "#FFFFFF",
              borderColor: "#95989A",
              borderWidth: 1
            }}
          >
            <View
              style={[
                slide_btn_styles.buttonInner,
                {
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center"
                }
              ]}
            >
              <Text style={slide_btn_styles.button}>
                {strings("you_re_in_")}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View
          style={{
            height: 200
          }}
        />
      </View>
    );

    if (
      !this.props.navigation.state.params.completed &&
      !(
        Number.parseInt(max_users) ==
        (completed_users
          ? Number.parseInt(completed_users)
          : Number.parseInt(subscriber_users))
      )
    )
      if (
        this.props.navigation.state.params.special_training_subscribed ||
        this.state.special_training_subscribed
      ) {
        return UAreInButtonView;
      } else {
        if (
          !this.state.rightSwiped &&
          !this.props.navigation.state.params.special_training_subscribed
        )
          return SlideButtonView;
        else return OkButtonView;
      }
    else return <View />;
  }

  render() {
    // console.log(this.props);

    const color = this.props.navigation.getParam("color", "#5FC4E2");

    const sessionName = this.props.navigation.getParam(
      "sessionName",
      "Title Session"
    );
    const eventsNumber = this.props.navigation.getParam("eventsNumber", "1");
    const eventsCompleted = this.props.navigation.getParam(
      "eventsCompleted",
      "1"
    );

    const events = this.props.navigation.getParam("events", []);
    console.log(events);
    const completed = this.props.navigation.getParam("completed", false);
    const levelCorrent = this.props.navigation.getParam("levelCorrent", 1);
    const id = this.props.navigation.getParam("id", 1);
    const obtainableCoins = this.props.navigation.getParam(
      "obtainableCoins",
      0
    );
    const index = this.props.navigation.getParam("index", 1);
    const level = this.props.navigation.getParam("level", 1);
    const descriptionSession = this.props.navigation.getParam(
      "descriptionSession",
      ""
    );
    const color1 = level ? color : "#FA941E";

    let headerHeight = this.state.scroll.interpolate({
      inputRange: [0, 300],
      outputRange: [0, Platform.OS === "android" ? -90 : -130],
      extrapolate: "clamp"
    });
    let headerHeightWave = this.state.scroll.interpolate({
      inputRange: [0, 300],
      outputRange: [
        Platform.OS === "android"
          ? -(Dimensions.get("window").height + 150 / 2) + 120
          : -(Dimensions.get("window").height + 150 / 2) + 170,
        Platform.OS === "android"
          ? -(Dimensions.get("window").height + 150 / 2) + 30
          : -(Dimensions.get("window").height + 150 / 2) + 40
      ],
      extrapolate: "clamp"
    });
    // -(Dimensions.get("window").height / 2 - 180)
    // Platform.OS === "android" ? -380 - 180 : -420 - 150,
    //     Platform.OS === "android" ? -520 - 130 : -560 - 150
    console.log(Dimensions.get("window").height);
    const imageTranslate = this.state.scroll.interpolate({
      inputRange: [0, 300],
      outputRange: [0, 100],
      extrapolate: "clamp"
    });
    let opacity = this.state.scroll.interpolate({
      inputRange: [0, 200],
      outputRange: [1, 0],
      extrapolate: "clamp"
    });
    // let headerHeightBack = this.state.scroll.interpolate({
    //   inputRange: [0, 300],
    //   outputRange: [0, 120],
    //   extrapolate: "clamp"
    // });
    let leftText = this.state.scroll.interpolate({
      inputRange: [0, 300],
      outputRange: [0, 30],
      extrapolate: "clamp"
    });

    // enum('default', 'light-content', 'dark-content')

    // console.log(this.props);
    // console.log(this.props.navigation.state.params.events[0].id);

    let special_training_id = this.props.navigation.state.params.events[0].id;

    let max_users = this.props.navigation.state.params.maxUserNumber;
    let subscriber_users = this.props.navigation.state.params.subscriberUser;
    let completed_users = this.props.navigation.state.params.completed_users;

    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height + 150,
          backgroundColor: "#F7F8F9"
        }}
      >
        <StatusBar backgroundColor={color} barStyle="light-content" />
        <Modal
          isVisible={this.state.active}
          onBackdropPress={() => this.DeleteDescriptionIconModal()}
          onBackButtonPress={() => this.DeleteDescriptionIconModal()}
        >
          {this._renderModalContent()}
        </Modal>
        <Modal
          isVisible={this.state.activeSponsor}
          onBackdropPress={() => this.DeleteDescriptionIconModalSponsor()}
          onBackButtonPress={() => this.DeleteDescriptionIconModalSponsor()}
        >
          {this._renderModalSponsorContent()}
        </Modal>
        <Animated.ScrollView
          contentContainerStyle={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height + 800
          }}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scroll } } }
          ])}
          scrollEventThrottle={16}
          scrollEnabled={this.state.scrollEnabled}
        >
          <View
            style={{
              backgroundColor: "#F7F8F9",
              marginTop: Platform.OS === "android" ? 150 : 200,
              // marginBottom: -200,
              width: Dimensions.get("window").width,
              alignContent: "center",
              // justifyContent: "space-around",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <View
              style={{
                height: 50,
                width: Dimensions.get("window").width * 0.9,
                alignSelf: "center"
              }}
            />

            {this.renderSponsor()}
            {this.renderSessionWhat()}
            {this.renderSessionWhen()}
            {this.renderSessionInfo(
              max_users,
              subscriber_users,
              completed_users
            )}
            <View
              style={{
                height: 20,
                width: Dimensions.get("window").width * 0.9,
                alignSelf: "center"
              }}
            />
            {this.renderEventsDescription(
              events,
              eventsCompleted,
              eventsNumber,
              color
            )}
            {this.renderSessionReward()}
            {this.renderSlideBtn(
              special_training_id,
              max_users,
              subscriber_users,
              completed_users
            )}
            <View
              style={{
                height: 100
              }}
            />
            {/* {this.renderObtainableCoins(obtainableCoins)} */}
          </View>
          <View
            style={{
              height: 500,
              width: Dimensions.get("window").width,
              alignSelf: "center"
            }}
          />
        </Animated.ScrollView>

        <Animated.View
          style={{
            // height: headerHeight,
            backgroundColor: color,
            width: Dimensions.get("window").width,
            alignContent: "center",
            justifyContent: "flex-end",
            flexDirection: "column",
            alignItems: "center",
            overflow: "hidden",
            position: "absolute",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            width: null,
            // backgroundColor: color,
            overflow: "hidden",
            height: Platform.OS === "android" ? 150 : 200,
            transform: [{ translateY: headerHeight }]
          }}
        >
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 0.0, y: 1.0 }}
            locations={[0, 1.0]}
            colors={[color, color1]}
            style={{
              width: Dimensions.get("window").width,
              overflow: "hidden",
              height: Platform.OS === "android" ? 150 : 200
            }}
          >
            <Animated.View
              style={{
                // height: headerHeight,
                // backgroundColor: color,
                width: Dimensions.get("window").width,
                alignContent: "center",
                justifyContent: "flex-end",
                flexDirection: "column",
                alignItems: "center",
                height: Platform.OS === "android" ? 90 : 140
              }}
            >
              <Animated.Image
                style={{
                  width: Platform.OS === "android" ? 60 * 2.4 : 80 * 2.4,
                  height: Platform.OS === "android" ? 60 + 20 : 80 + 20,
                  opacity: opacity,
                  transform: [{ translateY: imageTranslate }]
                }}
                source={master[level]}
              />
            </Animated.View>

            <View
              style={{
                height: 60,
                // backgroundColor: color,
                width: Dimensions.get("window").width,

                alignContent: "center",
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  height: 60,

                  width: Dimensions.get("window").width - 40,

                  alignContent: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <Animated.Text
                  style={{
                    fontFamily: "OpenSans-Regular",
                    fontWeight: "bold",
                    // fontStyle: "normal",
                    color: "#FFFFFF",
                    fontSize: 15,
                    transform: [{ translateX: leftText }]
                  }}
                >
                  {translateSpecialEvent(
                    this.props.navigation.state.params.sessionName
                  )}
                </Animated.Text>
                {/* 
                <Animated.Text
                  style={{
                    fontFamily: "OpenSans-Regular",

                    color: "#FFFFFF",
                    fontSize: 12,
                    opacity: opacity,
                    marginBottom: -3
                  }}
                >
                  {eventsCompleted + "/" + eventsNumber}
                </Animated.Text> 
                */}
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.Image
          style={{
            width: Dimensions.get("window").width,
            height: 50,
            top: 0,
            left: 0,
            right: 0,
            overflow: "hidden",
            transform: [{ translateY: headerHeightWave }]
          }}
          source={images[level]}
        />
        <View
          style={{
            height: 30,
            position: "absolute",
            width: Dimensions.get("window").width,
            alignContent: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            top: Platform.OS == "ios" ? 27.5 : 15,

            right: -10
          }}
        >
          <TouchableWithoutFeedback onPress={() => this.back()}>
            <View
              style={{
                height: 30,
                width: 30,
                paddingLeft: 10
                // backgroundColor: "red"
              }}
            >
              {/* <OwnIcon name="scroll_animation_icn" size={25} color="#FFFFFF" /> */}
              <Icon
                name="ios-arrow-back"
                style={{ marginTop: Platform.OS == "ios" ? 2 : 0 }}
                size={25}
                color="#FFFFFF"
                onPress={() => this.back()}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
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
    // transform: [{rotate: "-90deg" }]
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
    trainingsState: state.trainings,
    mfrState: state.login.mostFrequentRoute
  };
});

export default withData(DetailSpecialTrainingScreen);
