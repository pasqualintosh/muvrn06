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
  ScrollView
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
    locale = NativeModules.SettingsManager.settings.AppleLanguages[0]
    if (locale == undefined) {
          locale = "en" // default language
    }
}
}
else locale = NativeModules.I18nManager.localeIdentifier;

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
      reward_is_redeemed: false
    };

    this.special_training = null;
    this.special_training_session = null;
    this.end_st_date = null;
    this.sponsor = null;
    this.event = null;
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
          {"Rewards"}
        </Text>
      )
    };
  };

  componentDidMount() {
    try {
      this.special_training = this.props.trainingsState.subscribed_special_training.filter(
        e => {
          return e.reward_id == this.props.navigation.state.params.id;
        }
      )[0];

      this.special_training_session =
        this.props.trainingsState.special_training_sessions.length > 0
          ? this.props.trainingsState.special_training_sessions.filter(e => {
              return e.text_description == this.special_training.training_title;
            })[0]
          : this.props.trainingsState.subscribed_special_training.filter(e => {
              return e.training_title == this.special_training.training_title;
            })[0];

      const available_st_event = this.props.trainingsState.available_st_event
        ? this.props.trainingsState.available_st_event
        : [];
      this.event = available_st_event.filter(e => {
        return e.st_event[0].reward_id == this.props.navigation.state.params.id;
      });

      this.sponsor = getSponsor(
        this.props.trainingsState.special_training_sessions.length > 0
          ? this.special_training_session.text_description
          : this.special_training_session.training_title
      );

      this.end_st_date = this.special_training_session.special_training
        ? new Date(
            this.special_training_session.special_training.end_special_training
          )
        : new Date(new Date().setDate(new Date().getDate() - 1));

      this.setState({
        reward_description: this.special_training_session.special_training
          ? this.special_training_session.special_training.reward_description
          : "",
        reward_is_redeemed: this.checkIfIsRedeemed()
      });

      let start_date = this.special_training_session.special_training
        ? new Date(
            this.special_training_session.special_training.start_special_training
          )
        : new Date(new Date().setDate(new Date().getDate() - 1));
      let today = new Date();

      let e_msec = start_date - today;
      let e_mins = Math.floor(e_msec / 60000);
      let e_hrs = Math.floor(e_mins / 60);
      let e_days = Math.floor(e_hrs / 24);
      let e_a_hrs = e_hrs - e_days * 24;
      let e_a_mins = Math.floor(e_msec / 60000) - e_hrs * 60;

      if (e_days > 0 || e_hrs > 0)
        this.setState({
          days_until_start_date: e_days,
          hour_until_start_date: e_a_hrs,
          minute_until_start_date: e_a_mins
        });

      this.loaded = true;
      console.log(this.state);
      Tracker.trackScreenView(
        "RewardsDetailScreen.js - " + this.special_training_session.title
      );
      trackScreenView(
        "RewardsDetailScreen.js - " + this.special_training_session.title
      );

      this.reward_component = this.getLinkContentFromReward(
        translateSpecialEvent(this.special_training_session.text_description)
      );
    } catch (error) {
      console.log(error);
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
    Tracker.trackEvent(
      "Special training rewards",
      "Special training rewards slide to reward"
    );
    // alert("slide right!");
    var self = this;
    this.setState({ swiped: true, rightSwiped: true }, () => {
      setTimeout(
        () =>
          self.setState({
            swiped: false,
            rightSwiped: false,
            reward_is_redeemed: this.checkIfIsRedeemed()
          }),
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

  getImage() {
    switch (
      this.special_training_session.special_training
        ? this.special_training_session.special_training.id
        : this.special_training_session.training_title
    ) {
      case 12:
        return (
          <Image
            source={require("../../assets/images/rewards/bar.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case 37:
        return (
          <Image
            source={require("../../assets/images/rewards/gifts.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case "Giretto d'Italia 2019":
        return (
          <Image
            source={require("../../assets/images/rewards/gifts.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case 38:
        return (
          <Image
            source={require("../../assets/images/rewards/games.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case "Mobilità Agrodolce 2019":
        return (
          <Image
            source={require("../../assets/images/rewards/games.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case 39:
        return (
          <Image
            source={require("../../assets/images/rewards/gifts.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case "Street Parade":
        return (
          <Image
            source={require("../../assets/images/rewards/gifts.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case 40:
        return (
          <Image
            source={require("../../assets/images/rewards/art.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case "Milano Bike Week":
        return (
          <Image
            source={require("../../assets/images/rewards/art.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case 41:
        return (
          <Image
            source={require("../../assets/images/rewards/games.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case "Passeio Ciclístico CAIS-PM-PI":
        return (
          <Image
            source={require("../../assets/images/rewards/games.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case 42:
        return (
          <Image
            source={require("../../assets/images/rewards/bar.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case "Movimento a ritmo africano":
        return (
          <Image
            source={require("../../assets/images/rewards/bar.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case 43:
        return (
          <Image
            source={require("../../assets/images/rewards/furniture.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case "Al mercato per una mattonella (che non si mangia)!":
        return (
          <Image
            source={require("../../assets/images/rewards/furniture.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case 44:
        return (
          <Image
            source={require("../../assets/images/rewards/games.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case "Take part and you will be rewarded!":
        return (
          <Image
            source={require("../../assets/images/rewards/games.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case 45:
        return (
          <Image
            source={require("../../assets/images/rewards/gifts.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case "Stunning Sant Andreu":
        return (
          <Image
            source={require("../../assets/images/rewards/gifts.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case 25:
        return (
          <Image
            source={require("../../assets/images/rewards/bar.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

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
            {/* 
            <Image
              source={require("../../assets/images/rewards/subscriptions.png")}
              style={{ width: 150, height: 150 }}
              resizeMethod={"auto"}
            /> 
            */}
            {this.special_training_session ? this.getImage() : <View />}
          </View>
          <Text style={styles.poweredByText}>
            {strings("powered_by") + " "}
            <Text style={[styles.poweredByText, { fontWeight: "bold" }]}>
              {this.sponsor ? this.sponsor.name : ""}
            </Text>
          </Text>
          {/* <Text style={styles.rewardInfoText}>
            {this.state.reward_description}
          </Text> */}

          {this.getLinkContentFromInfo(this.state.reward_description)}
        </View>
      </LinearGradient>
    );
  }

  renderPartnerInfoBox() {
    return (
      <View style={styles.partnerInfoBox}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.sendFeedBack();
          }}
        >
          <View style={styles.iconContainer}>
            <OwnIcon name="report_icn" size={40} color={"#3d3d3d"} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            if (this.sponsor)
              this.props.navigation.navigate("SponsorMapScreen", {
                latitude: this.sponsor.position.lat,
                longitude: this.sponsor.position.lon
              });
          }}
        >
          <View style={styles.iconContainer}>
            <OwnIcon name="map_icn" size={40} color={"#3d3d3d"} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
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

  getLinkContentFromReward = strReward => {
    // lo converto in una stringa
    var str = strReward + "";

    // var str = "Hellofewfweesf  wweffewfewfew https://palermo.muv2020.eu/muv-open-day/ %sito% ciaowedsffewf";
    var first_perc = str.indexOf("https");

    if (first_perc == -1) {
      console.log(translateSpecialEvent(str));
      return <Text style={styles.txtSTInfo}>{translateSpecialEvent(str)}</Text>;
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
          <Text style={styles.txtSTInfo}>
            {introduction}
            <Text
              style={[styles.txtSTInfo, { textDecorationLine: "underline" }]}
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

  getLinkContentFromInfo = strReward => {
    // lo converto in una stringa
    var str = strReward + "";

    // var str = "Hellofewfweesf  wweffewfewfew https://palermo.muv2020.eu/muv-open-day/ %sito% ciaowedsffewf";
    var first_perc = str.indexOf("https");

    if (first_perc == -1) {
      return (
        <Text style={styles.rewardInfoText}>{translateSpecialEvent(str)}</Text>
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

  renderSTInfo() {
    // console.log(this.special_training_session.special_training.id);
    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.8,
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 13
        }}
      >
        {/* {this.getLinkContentFromReward(
          translateSpecialEvent(
            this.special_training_session
              ? this.special_training_session.special_training
                ? this.special_training_session.special_training.id
                : this.special_training_session.training_description
              : ""
          )
        )} */}

        {this.reward_component ? this.reward_component : <View />}
      </View>
    );
  }

  renderEndCounter() {
    if (
      this.state.days_until_start_date != false ||
      this.state.hour_until_start_date != false
    )
      return (
        <View style={styles.endCounterContainer}>
          <OwnIcon name="timer_icn" size={26} color="#3d3d3d" />
          <Text style={styles.endCounerTxt}>
            - {this.state.days_until_start_date}
            {" " + strings("days") + " " + strings("and") + " "}
            {this.state.hour_until_start_date}
            {" " + strings("hours")}
          </Text>
        </View>
      );
    else return this.renderSlideBtn();
  }

  renderTxt() {
    if (
      this.state.days_until_start_date != false ||
      this.state.hour_until_start_date != false
    )
      return (
        <View
          style={[styles.endCounterContainer, { justifyContent: "flex-end" }]}
        >
          <Text style={styles.rewardTxt}>{strings("to_redeem_your_")}</Text>
        </View>
      );
    else return <View />;
  }

  renderSlideBtn() {
    const SlideButtonView = (
      <View style={slide_btn_styles.container}>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.8, y: 0.8 }}
          locations={[0, 1.0]}
          colors={["#E82F73", "#F49658"]}
          style={{
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 60
          }}
        >
          <SlideButton
            onSlideSuccess={() => this.onRightSlide()}
            slideDirection={SlideDirection.RIGHT}
            width={SCREEN_WIDTH - 40}
            height={65}
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
                {strings("slide_to_redeem")}
              </Text>
            </View>
          </SlideButton>
        </LinearGradient>
        <View
          style={{
            height: 50,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={[
              slide_btn_styles.button,
              { fontSize: 13, color: "#3d3d3d" }
            ]}
          >
            {strings("redeemable_unti") + " "}
            {new Date(this.end_st_date)
              .toLocaleDateString(locale, localeDateOpt)
              .replace("-", "/")}
          </Text>
        </View>
        <View
          style={{
            height: 150
          }}
        />
      </View>
    );

    const OkButtonView = (
      <View style={slide_btn_styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            Tracker.trackEvent(
              "Special training rewards",
              "Special training rewards redeem"
            );
            this.props.dispatch(
              redeemSpecialTrainingSessions(
                {},
                this.props.navigation.state.params.id,
                () => {}
              )
            );
          }}
        >
          <View
            style={{
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 35,
              backgroundColor: "#E82F73"
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
                {strings("ok").toLocaleUpperCase()}
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

    const UAreInButtonView = (
      <View style={slide_btn_styles.container}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View
            style={{
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 35,
              backgroundColor: "#6CBA7E",
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

    if (new Date() < this.end_st_date)
      if (this.state.reward_is_redeemed) return UAreInButtonView;
      else {
        if (!this.state.rightSwiped) return SlideButtonView;
        else return OkButtonView;
      }
    else
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Image
            style={styles.userAvatarImage}
            // source={
            //   images[this.loaded ? this.props.loginState.infoProfile.avatar : 1]
            // }
            source={require("../../assets/images/expired_award.png")}
          />
          <Text style={[styles.txtSTInfo, { fontSize: 14 }]}>
            {strings("sorry__reward_s")}
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
            {this.renderPartnerInfoBox()}
            {this.renderSTInfo()}
            {this.renderEndCounter()}
            {this.renderTxt()}
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

const withData = connect(state => {
  return {
    trainingsState: state.trainings,
    loginState: state.login
  };
});

export default withData(RewardDetailScreen);
