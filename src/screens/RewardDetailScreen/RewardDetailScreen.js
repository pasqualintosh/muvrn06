import React from "react";
import {
  Dimensions,
  View,
  Text,
  Platform,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Linking,
  NativeModules,
  ScrollView,
  Alert
} from "react-native";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";
import {
  SlideButton,
  SlideDirection
} from "./../../components/SlideButton/SlideButton";
const SCREEN_WIDTH = Dimensions.get("window").width;
import { strings } from "../../config/i18n";
import { getSponsor } from "./../../helpers/specialTrainingSponsors";
import { redeemSpecialTrainingSessions } from "./../../domains/trainings/ActionCreators";
import { images } from "./../../components/InfoUserHome/InfoUserHome";
import { translateSpecialEvent } from "../../helpers/translateSpecialEvent";
let locale = undefined;
if (Platform.OS == "ios") {
  locale = NativeModules.SettingsManager.settings.AppleLocale;
  if (locale === undefined) {
    // iOS 13 workaround, take first of AppleLanguages array  ["en", "en-NZ"]
    locale = NativeModules.SettingsManager.settings.AppleLanguages[0];
    if (locale == undefined) {
      locale = "en"; // default language
    }
  }
} else locale = NativeModules.I18nManager.localeIdentifier;
locale = locale.substr(0, 2);
const localeDateOpt = {
  //weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
};
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
async function trackEvent(event, data) {
  await analytics().logEvent(event, { data });
}
import {
  rewardImage,
  rewardImageBn,
  getRewardImg,
  getRewardImgBn
} from "./../RewardsScreen/RewardsScreen";
import { createSelector } from "reselect";
import {
  getChallenges,
  getChallengesRewards,
  getChallengesRewardsByUser,
  getChallengeRankingByUser,
  getRewardsCategory,
  patchReward
} from "./../../domains/challenges/ActionCreators";

class RewardDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      days_until_start_date: false,
      hour_until_start_date: false,
      minute_until_start_date: false,
      swiped: false,
      leftSwiped: false,
      rightSwiped: false,
      reward_description: "",
      reward_is_redeemed: false,
      reward: null,
      reward_categories: [],
      are_you_sure_btn: false
    };

    this.loaded = false;
    this.reward_component = null;
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("id_10_01")
            .charAt(0)
            .toUpperCase() + strings("id_10_01").slice(1)}
        </Text>
      )
    };
  };

  componentWillMount() {
    console.log(this.props);
    this.props.dispatch(getRewardsCategory());

    this.setState({
      reward: this.props.navigation.state.params.reward,
      reward_categories: [...this.props.categoriesState]
    });
  }

  getItemImage(e) {
    let n = new Date(),
      category = this.state.reward_categories.filter(el => {
        return el.id == e.reward.category;
      })[0];

    if (new Date(e.challenge.end_time) > n) {
      return getRewardImg(category.name);
    } else {
      return getRewardImgBn(category.name);
    }
  }

  checkIfIsRedeemed = () => {
    if (this.props.trainingsState.redeemed_rewards)
      return (
        this.props.trainingsState.redeemed_rewards.filter(e => {
          return e == this.props.navigation.state.params.id;
        }).length > 0
      );
    else return false;
  };

  sendFeedBack = () => {
    const url =
      "mailto:developers@wepush.org?subject=Hello, I’ve a request for this reward 🎁 🙏&body=Hey,\nthis is [your name],\nI would like to ask you something about this reward:\n[please write you request here]\nThanks in advance for the availability and for being so fabulous!\nSee you soon!\n[your name]";

    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error("An error occurred", err));
  };

  getImage() {
    switch (
      this.special_training_session.special_training
        ? this.special_training_session.special_training.id
        : this.special_training_session.training_title
    ) {
      default:
        return (
          <Image
            source={require("../../assets/images/rewards/subscriptions.png")}
            style={{ width: 150, height: 150 }}
            resizeMethod={"auto"}
          />
        );
        break;
    }
  }

  renderGradient() {
    return (
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.0, y: 1.0 }}
        locations={[0, 1.0]}
        colors={["#7D4D99", "#6497CC"]}
        style={styles.gradientContainer}
      >
        <View
          style={{
            position: "absolute",
            top: 150 - 12.5,
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
            top: 150 - 12.5,
            left: Dimensions.get("window").width * 0.8 - 12.5,
            backgroundColor: "#F7F8F9",
            height: 25,
            width: 25,
            borderRadius: 25
          }}
        />

        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            width: Dimensions.get("window").width * 0.55
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image
              source={this.getItemImage(this.state.reward)}
              style={{ width: 150, height: 150 }}
              resizeMethod={"auto"}
            />
          </View>
          <Text style={styles.poweredByText}>
            {strings("id_3_04") + " "}
            <Text style={[styles.poweredByText, { fontWeight: "bold" }]}>
              {this.state.reward.challenge.sponsor}
            </Text>
          </Text>

          {/* {this.getLinkContentFromInfo(this.state.reward.reward.name)} */}
          <Text style={[styles.txtSTInfo, { color: "#fff" }]}>
            {this.state.reward.reward.name}
          </Text>
        </View>
      </LinearGradient>
    );
  }

  getCountdownTxt = (days_txt, hours_txt, min_txt, checkDay) => {
    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.8,
          height: 60,
          borderRadius: 15,
          borderWidth: 2,
          borderColor: "#F2875B",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          flexDirection: "row",
          marginBottom: 10
        }}
      >
        <OwnIcon
          name="timer_icn"
          size={20}
          color={checkDay ? "#FC6754" : "#FAB21E"}
        />
        <View style={{ width: 5, height: 5 }} />
        {checkDay ? (
          <Text style={styles.countdownTxt}>
            <Text style={styles.countdownBoldTxt}>
              {Number.parseInt(this.state.days_until_end_date)}
              {" " + days_txt}
            </Text>

            {/* {" " + strings("id_4_08")} */}
            {" " + strings("id_3_23")}
          </Text>
        ) : (
          <View
            style={{
              flexDirection: "row"
            }}
          >
            <View
              style={{
                flexDirection: "row"
              }}
            >
              <Text style={styles.countdownTxt}>
                {strings("id_3_22") + " "}
                <Text style={styles.countdownBoldTxtWhite}>
                  {this.state.hour_until_end_date
                    ? this.state.hour_until_end_date +
                      " " +
                      hours_txt +
                      " " +
                      strings("id_4_09") +
                      " "
                    : ""}
                  {this.state.minute_until_end_date}
                  {" " + min_txt}
                </Text>
              </Text>
              <View
                style={{
                  borderBottomColor: "#FAB21E",
                  borderBottomWidth: 1
                }}
              />
            </View>
            <Text style={styles.countdownTxt}>
              {/* {" " + strings("id_4_08")} */}
              {" " + strings("id_3_23")}
            </Text>
          </View>
        )}
      </View>
    );
  };

  redeemedState = () => {
    this.setState(
      {
        reward_is_redeemed: true
      },
      () => {
        Alert.alert("", strings("id_10_10"));
      }
    );
  };

  renderSlideBtn() {
    const SureButtonView = (
      <View style={slide_btn_styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            let { reward } = this.state.reward;
            this.props.dispatch(patchReward(reward.id, this.redeemedState));

            setTimeout(() => {
              this.setState({ are_you_sure_btn: false });
            }, 600);
          }}
        >
          <LinearGradient
            start={{ x: 1.0, y: 0.0 }}
            end={{ x: 1.0, y: 0.0 }}
            locations={[0, 1.0]}
            colors={["#E83475", "#E83475"]}
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
              <Text style={slide_btn_styles.button}>{strings("id_10_04")}</Text>
            </View>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </View>
    );

    const SlideButtonView = (
      <View style={slide_btn_styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ are_you_sure_btn: true });
          }}
        >
          <LinearGradient
            start={{ x: 1.0, y: 0.0 }}
            end={{ x: 1.0, y: 0.0 }}
            locations={[0, 1.0]}
            colors={["#7D4D99", "#6497CC"]}
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
              {/* <Text style={slide_btn_styles.button}>{strings("id_3_10")}</Text> */}
              <Text style={slide_btn_styles.button}>{strings("id_10_05")}</Text>
            </View>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </View>
    );

    const RedemeedButtonView = (
      <View style={slide_btn_styles.container}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View
            style={{
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 35,
              backgroundColor: "#6BBA7E"
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
              <Text style={slide_btn_styles.button}>{strings("id_10_06")}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );

    let t = new Date(),
      end_time = new Date(this.state.reward.challenge.end_time);

    let e_msec = end_time - t;
    let e_mins = Math.floor(e_msec / 60000);
    let e_hrs = Math.floor(e_mins / 60);
    let e_days = Math.floor(e_hrs / 24);
    let e_a_hrs = e_hrs - e_days * 24;
    let e_a_mins = Math.floor(e_msec / 60000) - e_hrs * 60;

    if (this.state.are_you_sure_btn) return SureButtonView;
    else if (
      end_time > t &&
      !this.state.reward_is_redeemed &&
      this.state.reward.reward.status != 2
    ) {
      let days_txt = e_days > 1 ? strings("id_4_03") : strings("id_4_02"),
        hours_txt = e_hrs > 1 ? strings("id_4_05") : strings("id_4_04"),
        min_txt = e_mins > 1 ? strings("id_4_07") : strings("id_4_06"),
        checkDay = e_days > 0;

      // return this.getCountdownTxt(days_txt, hours_txt, min_txt, checkDay);
      // return <View />;
      return SlideButtonView;
    } else if (this.state.reward.reward.status == 2) {
      return RedemeedButtonView;
    } else {
      return <View />;
    }
  }

  renderRewardDescription() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.9,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center"
        }}
      >
        <Text style={styles.txtRewardInfo}>
          {this.state.reward.reward.description}
        </Text>
      </View>
    );
  }

  render() {
    console.log(this.state);
    return (
      <ScrollView
        style={{
          height: Dimensions.get("window").height
        }}
      >
        <ImageBackground
          style={{
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width
          }}
          source={require("./../../assets/images/bg-login.png")}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 20
            }}
          >
            {this.renderGradient()}
            {this.renderRewardDescription()}
            {this.renderSlideBtn()}
          </View>
        </ImageBackground>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  gradientContainer: {
    width: Dimensions.get("window").width * 0.8,
    height: 250,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 13
  },
  rewardInfoText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 12,
    marginHorizontal: 7
  },
  poweredByText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 9
  },
  partnerInfoBox: {
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").height * 0.075,
    alignSelf: "center",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row"
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#F7F8F9",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    justifyContent: "center",
    alignItems: "center"
  },
  txtSTInfo: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3d3d3d",
    fontSize: 11
  },
  txtRewardInfo: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3d3d3d",
    fontSize: 15
  },
  endCounterContainer: {
    width: Dimensions.get("window").width * 0.8,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  endCounerTxt: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3d3d3d",
    fontSize: 22
  },
  rewardTxt: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 7
  },
  userAvatarImage: {
    width: 65,
    height: 65
  },
  countdownTxt: {
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
    color: "#3D3D3D",
    fontSize: 10
  },
  countdownBoldTxt: {
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
    fontWeight: "bold",
    color: "#FC6754",
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
    color: "#fff",
    fontWeight: "bold",
    alignContent: "center"
  }
});

const getRewardsCategories = state =>
  state.challenges.reward_categories ? state.challenges.reward_categories : [];
const getRewardsCategoriesState = createSelector(
  [getRewardsCategories],
  categories => {
    return [...categories];
  }
);

const withData = connect(state => {
  return {
    trainingsState: state.trainings,
    loginState: state.login,
    categoriesState: getRewardsCategoriesState(state)
  };
});

export default withData(RewardDetailScreen);
