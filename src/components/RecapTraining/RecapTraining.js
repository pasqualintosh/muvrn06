// componente che riassume le info sulla tratta precedente effettuata come punti, tipo se è stata validata , tempo,  testo

import React from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Platform,
  ImageBackground,
  Linking,
  TouchableOpacity,
} from "react-native";

import { withNavigation } from "react-navigation";
import { BoxShadow } from "react-native-shadow";

import { images } from "../../components/InfoUserHome/InfoUserHome";
import { data } from "./../../assets/ListCities";
import { getDevice } from "../../helpers/deviceInfo";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

import { checkTypeformFeed } from "../../domains/login/ActionCreators";

import {
  addOpenPeriodicFeed,
  addCompletePeriodicFeed,
} from "../../domains/login/ActionCreators";

import { strings, switchLanguage, getLanguageI18n } from "../../config/i18n";

import { limitAvatar } from "./../UserItem/UserItem";
import { translateEvent } from "./../../helpers/translateEvent";
import { translateSpecialEvent } from "./../../helpers/translateSpecialEvent";
import { getUniversityImg } from "./../../screens/ChooseTeamScreen/ChooseTeamScreen";

import Settings from "./../../config/Settings";
import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings,
} from "react-native-google-analytics-bridge";
import WebService from "./../../config/WebService";

let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);
// componente per visualizzare i punti che ho guadagnato in questo preciso momento

// props
// title titolo della notifica
// descr descrizione della notifica
// point punti ottenuti
// color colore della view
// click azione collegata all'icona della notifica

// color lo passa allo stile inline di view

class RecapTraining extends React.PureComponent {
  constructor() {
    super();

    // let languagesList = [indexLanguage];
    // for (i = 0; i < 8; i++) {
    //   if (indexLanguage !== i) {
    //     languagesList = [...languagesList, i];
    //   }
    // }

    state = {
      color: "#3d3d3d",
    };
  }

  componentWillMount() {
    if (this.props.modal_type == "typeform") {
      this.props.dispatch(checkTypeformFeed());
    }
  }

  getImagePath = (label) => {
    let userAvatar = 1;
    switch (label) {
      case "Event":
        return (
          <Image
            source={require("../../assets/images/trainings/training_feed_icn.png")}
            style={{ width: 50, height: 50 }}
          />
        );
      case "Session":
        return (
          <Image
            source={require("../../assets/images/trainings/training_feed_icn.png")}
            style={{ width: 50, height: 50 }}
          />
        );
      case "BonusActivities":
        if (this.props.bonusType == 1) {
          return (
            <Image
              source={require("../../assets/images/feedActivity/healt_feed_green_flame_icn.png")}
              style={{ width: 50, height: 50 }}
            />
          );
        } else if (this.props.activity_minutes == 2) {
          return (
            <Image
              source={require("../../assets/images/feedActivity/healt_feed_blue_flame_icn.png")}
              style={{ width: 50, height: 50 }}
            />
          );
        } else {
          // 3
          return (
            <Image
              source={require("../../assets/images/feedActivity/healt_feed_red_flame_icn.png")}
              style={{ width: 50, height: 50 }}
            />
          );
        }
      case "DailyActivities":
        if (this.props.activity_minutes >= 10000) {
          return (
            <Image
              source={require("../../assets/images/feedActivity/healt_feed_300_icn.png")}
              style={{ width: 50, height: 50 }}
            />
          );
        } else if (this.props.activity_minutes >= 5000) {
          return (
            <Image
              source={require("../../assets/images/feedActivity/healt_feed_200_icn.png")}
              style={{ width: 50, height: 50 }}
            />
          );
        } else {
          return (
            <Image
              source={require("../../assets/images/feedActivity/healt_feed_100_icn.png")}
              style={{ width: 50, height: 50 }}
            />
          );
        }
      case "inviteFriend":
      case "MultipleFollowed":
        return (
          <Image
            source={require("../../assets/images/friends_banner_icn.png")}
            style={{ width: 50, height: 50 }}
          />
        );

      case "Friend":
      case "Followed":
      case "InviteAccepted":
      case "InviteConfirmed":
        userAvatar = limitAvatar(this.props.avatar);

        return (
          <Image
            source={images[userAvatar]}
            style={{ width: 60, height: 60 }}
          />
        );
      case "Trophies":
        return (
          <Image
            source={{ uri: WebService.url + this.props.trophy.img }}
            style={{ width: 50, height: 50 }}
          />
        );
      /* switch (this.props.typeTrophie) {
          case "FirstGlobalTrophy":
            return (
              <Image
                source={require("../../assets/images/trophies/trophy_global_first_small.png")}
                style={{ width: 50, height: 50 }}
              />
            );
          case "SecondGlobalTrophy":
            return (
              <Image
                source={require("../../assets/images/trophies/trophy_global_second_small.png")}
                style={{ width: 50, height: 50 }}
              />
            );
          case "ThirdGlobalTrophy":
            return (
              <Image
                source={require("../../assets/images/trophies/trophy_global_third_small.png")}
                style={{ width: 50, height: 50 }}
              />
            );
          case "FirstLocalTrophy":
            return (
              <Image
                source={require("../../assets/images/trophies/trophy_city_first_small.png")}
                style={{ width: 50, height: 50 }}
              />
            );
          case "SecondLocalTrophy":
            return (
              <Image
                source={require("../../assets/images/trophies/trophy_city_second_small.png")}
                style={{ width: 50, height: 50 }}
              />
            );
          case "ThirdLocalTrophy":
            return (
              <Image
                source={require("../../assets/images/trophies/trophy_city_third_small.png")}
                style={{ width: 50, height: 50 }}
              />
            );
        } */
      case "quiz":
        return (
          <Image
            source={require("../../assets/images/quiz_header_super.png")}
            style={{ width: 50, height: 50 }}
          />
        );
      case "QuizComplete":
        if (this.props.obtainable_coins) {
          return (
            <Image
              source={require("../../assets/images/trainings/bonus_win_feed_icn.png")}
              style={{ width: 50, height: 50 }}
            />
          );
        } else {
          return (
            <Image
              source={require("../../assets/images/trainings/bonus_lose_feed_icn.png")}
              style={{ width: 50, height: 50 }}
            />
          );
        }
      case "survey":
        return (
          <Image
            source={require("../../assets/images/quiz_header_super.png")}
            style={{ width: 50, height: 50 }}
          />
        );
      case "SurveyComplete":
        return (
          <Image
            source={require("../../assets/images/trainings/bonus_win_feed_icn.png")}
            style={{ width: 50, height: 50 }}
          />
        );

      case "Trainings":
      case "rememberLevel":
        return (
          <Image
            source={require("../../assets/images/trainings/training_feed_icn.png")}
            style={{ width: 50, height: 50 }}
          />
        );
      case "Level":
        userAvatar = limitAvatar(this.props.avatar);

        return (
          <Image
            source={images[userAvatar]}
            style={{ width: 60, height: 60 }}
          />
        );

      case "Muv":
      case "feedback":
        return (
          <Image
            source={require("../../assets/images/trainings/muv_feed_icn.png")}
            style={{ width: 50, height: 50 }}
          />
        );
      case "facebookLike":
        return (
          <Image
            source={require("../../assets/images/trainings/facebook_icn_round.png")}
            style={{ width: 50, height: 50 }}
          />
        );
      case "instagramLike":
        return (
          <Image
            source={require("../../assets/images/trainings/instagram_icn_round.png")}
            style={{ width: 50, height: 50 }}
          />
        );

      case "WeeklyChallenge":
        return (
          <Image
            source={require("../../assets/images/trophies/trophies_feed_icn.png")}
            style={{ width: 50, height: 50 }}
          />
        );
      case "mobilityHabits":
        return (
          <Image
            source={require("../../assets/images/trainings/mobility_habit_icn_feed.png")}
            style={{ width: 60, height: 60 }}
          />
        );
      case "updateProfile":
      case "addFrequentTrips":
      case "firstFrequentTrip":
        userAvatar = limitAvatar(this.props.avatar);

        return (
          <Image
            source={images[userAvatar]}
            style={{ width: 60, height: 60 }}
          />
        );
      case "typeform":
        return (
          <Image
            source={require("../../assets/images/survey_scientist_feed_icn.png")}
            style={{ width: 60, height: 60 }}
          />
        );
      case "typeform_2":
        return (
          <Image
            source={require("../../assets/images/survey_scientist_feed_icn.png")}
            style={{ width: 60, height: 60 }}
          />
        );
      case "newST":
        return (
          <Image
            source={require("../../assets/images/specia_training_master_feed_icn.png")}
            style={{ width: 60, height: 60 }}
          />
        );
      case "completedST":
        return (
          <Image
            source={require("../../assets/images/specia_training_master_feed_icn.png")}
            style={{ width: 60, height: 60 }}
          />
        );
      case "enrolledTournament":
        return (
          <Image
            source={getUniversityImg(this.props.team_logo)}
            style={{ width: 60, height: 60 }}
          />
        );
      default: {
        userAvatar = limitAvatar(this.props.avatar);

        return (
          <Image
            source={images[userAvatar]}
            style={{ width: 60, height: 60 }}
          />
        );
      }
    }
  };

  sendFeedBack = async () => {
    /* 
    try {
        Linking.openURL(
          "mailto:support@domain.com?subject=Hey buddies, I’ve a feedback about MUV 🤓 📬&body=Ciao,\nit’s [your name]\nand since I don’t have much time, here is my very brief feedback about MUV:\n- 🤬 this didn’t work --> ...\n- 🤯 I didn’t get this --> ...\n- 🤔 you should work better on this --> ...\n- 🤩 this is pretty neat! --> ...\n\nI'm sure you'll apreciate this and I hope my feedback will improve my beloved app.\nLove you all,\n[your name] 💞"
        );
      } catch (error) {
        console.log(error);
        alert(JSON.stringify(error));
        try {
          Linking.openURL(
            "googlegmail://?subject=Hey buddies, I’ve a feedback about MUV 🤓 📬&body=Ciao,\nit’s [your name]\nand since I don’t have much time, here is my very brief feedback about MUV:\n- 🤬 this didn’t work --> ...\n- 🤯 I didn’t get this --> ...\n- 🤔 you should work better on this --> ...\n- 🤩 this is pretty neat! --> ...\n\nI'm sure you'll apreciate this and I hope my feedback will improve my beloved app.\nLove you all,\n[your name] 💞"
          );
        } catch (error) {
          console.log(error);
          alert(JSON.stringify(error));
        }
      } 
    */

    const device = await getDevice();

    const url =
      "mailto:developers@wepush.org?subject=Hey buddies, I’ve a feedback about MUV 🤓 📬&body=Ciao,\nit’s [your name]\nand since I don’t have much time, here is my very brief feedback about MUV:\n- 🤬 this didn’t work --> ...\n- 🤯 I didn’t get this --> ...\n- 🤔 you should work better on this --> ...\n- 🤩 this is pretty neat! --> ...\n\nI'm sure you'll apreciate this and I hope my feedback will improve my beloved app.\nLove you all,\n[your name] 💞\n" +
      device;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  getEndImagePath = (label) => {
    switch (label) {
      case "Event":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/trainings/training_event_done_icn.png")}
          />
        );

      case "Friend":
      case "Followed":
      case "MultipleFollowed":
        return (
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "center",
              width: "200%",
              height: "100%",
              alignSelf: "center",
              alignItems: "center",
              // top: -2,
            }}
          >
            <OwnIcon
              name="follower_icn_bottom"
              size={28}
              style={{ position: "relative", left: 14 }}
              color="#3D3D3D"
            />
            <OwnIcon
              name="follower_icn_top"
              size={28}
              style={{ position: "relative", left: -14 }}
              color="#FAB21E"
            />
          </View>
        );

      case "Trophies":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/trophies/trophies_icn_feed.png")}
          />
        );
      case "WeeklyChallenge":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/trophies/trophies_icn_feed.png")}
          />
        );
      case "Muv":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/video_feed_icn.png")}
          />
        );

      case "quiz":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/trainings/coin_icn_feed.png")}
          />
        );
      case "inviteFriend":
      case "InviteAccepted":
      case "InviteConfirmed":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/trainings/coins_icn_feed.png")}
          />
        );
      case "QuizComplete":
        if (this.props.obtainable_coins) {
          return (
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              source={require("../../assets/images/trainings/coins_icn_feed.png")}
            />
          );
        } else {
          return (
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              source={require("../../assets/images/trainings/lose_icn_feed.png")}
            />
          );
        }
      case "survey":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/trainings/coin_icn_feed.png")}
          />
        );
      case "SurveyComplete":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/trainings/coins_icn_feed.png")}
          />
        );
      case "Trainings":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/trainings/road_feed_icn.png")}
          />
        );

      case "Session":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/trainings/training_session_done_icn.png")}
          />
        );

      case "BonusActivities":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/feedActivity/health_feed_icn.png")}
          />
        );
      case "DailyActivities":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/feedActivity/health_feed_icn.png")}
          />
        );
      case "Level":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/trainings/experience_level_completed_icn.png")}
          />
        );

      case "firstFrequentTrip":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/frequent_trip_feed_icn.png")}
          />
        );
      case "updateProfile":
      case "addFrequentTrips":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/trainings/update_feed_icn.png")}
          />
        );
      case "mobilityHabits":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/trainings/road_feed_icn.png")}
          />
        );
      case "feedback":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/trainings/phone_feed_icn.png")}
          />
        );
      case "facebookLike":
      case "instagramLike":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/trainings/like_feed_icn.png")}
          />
        );
      case "rememberLevel":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/trainings/training_event_green_icn.png")}
          />
        );
      case "typeform":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/survey_tubes_icn.png")}
          />
        );
      case "typeform_2":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/survey_tubes_icn.png")}
          />
        );
      case "newST":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/special_training_gift_icn.png")}
          />
        );
      case "completedST":
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/special_training_complete_icn.png")}
          />
        );
      // case "enrolledTournament":
      //   return (
      //     <ImageBackground
      //       style={{ width: "100%", height: "100%" }}
      //       source={require("../../assets/images/special_training_complete_icn.png")}
      //     />
      //   );

      case "enrolledTournament":
        return (
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "center",
              width: "200%",
              height: "100%",
              alignSelf: "center",
              alignItems: "center",
              // top: -2,
            }}
          >
            <OwnIcon name="sct_icn_active" size={28} color="#ED6B6F" />
          </View>
        );
      default:
        return (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../../assets/images/trainings/phone_feed_icn.png")}
          />
        );
    }
  };

  moveTraining = () => {
    if (
      this.props.modal_type === "QuizComplete" ||
      this.props.modal_type === "SurveyComplete"
    ) {
      // se i feed sono relativi ai quiz e ai survey completati, il click non porta a profile
    }
    if (this.props.modal_type === "Muv") {
      Tracker.trackEvent("User Interactions", "Feed Video");
      this.props.navigation.navigate("YoutubeScreen");
    } else if (this.props.modal_type === "WeeklyChallenge") {
      this.props.navigation.navigate("Challenges");
    } else if (
      this.props.modal_type === "DailyActivities" ||
      this.props.modal_type === "BonusActivities"
    ) {
      this.props.navigation.navigate("ChartsStack");
    } else if (this.props.modal_type === "Trophies") {
      this.props.navigation.navigate("Trophies");
    } else if (this.props.modal_type === "Level") {
      this.props.navigation.navigate("ProfileStack");
    } else if (this.props.modal_type === "addFrequentTrips") {
      // con addOpenPeriodicFeed dico quale feed ho aperto cosi poi lo posso togliere
      this.props.dispatch(addOpenPeriodicFeed(1));
      this.props.navigation.navigate("PersonalFrequentTripDataScreen");
    } else if (this.props.modal_type === "firstFrequentTrip") {
      Tracker.trackEvent("User Interactions", "Feed frequent trip");
      this.props.navigation.navigate("ChangeFrequentTripScreen");
    } else if (this.props.modal_type === "updateProfile") {
      // this.props.dispatch(addOpenPeriodicFeed(0));
      this.props.navigation.navigate("PersonalAnagraficDataScreen");

      //this.props.navigation.navigate("PersonalMobilityDataScreen");
    } else if (this.props.modal_type === "mobilityHabits") {
      this.props.dispatch(addOpenPeriodicFeed(2));
      this.props.navigation.navigate("PersonalMobilityDataScreen");
    } else if (this.props.modal_type === "feedback") {
      this.props.dispatch(addOpenPeriodicFeed(3));

      this.sendFeedBack();
    } else if (this.props.modal_type === "facebookLike") {
      this.props.dispatch(addOpenPeriodicFeed(6));
      this.props.dispatch(addCompletePeriodicFeed(6));
      // apri facebook
    } else if (this.props.modal_type === "instagramLike") {
      this.props.dispatch(addOpenPeriodicFeed(7));
      this.props.dispatch(addCompletePeriodicFeed(7));
      // apri instagram
    } else if (this.props.modal_type === "rememberLevel") {
      this.props.dispatch(addOpenPeriodicFeed(4));

      this.props.navigation.navigate("Trainings");
    } else if (this.props.modal_type === "inviteFriend") {
      // ho cliccato per aggiungere un amico dal feed
      this.props.dispatch(addOpenPeriodicFeed(5));

      this.props.navigation.navigate("InviteScreen");
    } else if (this.props.modal_type === "typeform") {
      this.props.navigation.navigate("SurveyWebView");
    } else if (this.props.modal_type === "typeform_2") {
      this.props.navigation.navigate("SoddFrust2WebView");
    } else if (
      this.props.modal_type === "Friend" ||
      this.props.modal_type === "Followed" ||
      this.props.modal_type === "MultipleFollowed" ||
      this.props.modal_type === "InviteAccepted" ||
      this.props.modal_type === "InviteConfirmed"
    ) {
      // this.props.dispatch(addOpenPeriodicFeed(4));
      this.props.changeScreen("friends");

      this.props.navigation.navigate("FriendStack");
    } else if (this.props.modal_type == "newST") {
      if (this.props.customisationGdpr) {
        this.props.navigation.navigate("TrainingsScreen");
      } else {
        this.props.navigation.navigate("PersonalGdprDataScreen");
      }
    } else if (this.props.modal_type == "completedST") {
      this.props.navigation.navigate("RewardsScreen");
    } else if (this.props.modal_type == "enrolledTournament") {
      if (this.props.first_team_screen_visible)
        this.props.navigation.navigate("TeamScreen", {
          university: this.props.team,
        });
      else
        this.props.navigation.navigate("WaitingUniversityScreen", {
          university: this.props.team,
        });
    } else {
      // in tutti gli altri casi vado in trainings
      this.props.navigation.navigate("Trainings");
    }
  };

  renderCircle(validated, color) {
    if (validated)
      return <View style={[styles.circle, { borderColor: color }]} />;
    else return <View style={[styles.circle, { borderColor: color }]} />;
  }

  getModalColor = () => {
    let color = "#3d3d3d";
    if (this.props.validated) {
      switch (this.props.modal_type) {
        case "Biking":
          {
            color = "#E83475";
          }
          break;
        case "Walking":
          {
            color = "#6CBA7E";
          }
          break;
        case "Public":
          {
            color = "#FAB21E";
          }
          break;
        case "Multiple":
          {
            color = "#3d3d3d";
          }
          break;
        default:
          {
            color = "#3d3d3d";
          }
          break;
      }
    }

    return color;
  };

  /*   [1° World]
You FREAKING did it!!
Nobody on planet hearth MUVed as you did this week!! If you keep on MUVing like this you're going to be a point of reference for the entire humanity!!
[2° World]
It's SILVER, killer!
Today it's "just" a second place on the top of the world... but it's more than deserved! You don't need motivations for getting to the top, you'll do it next week.
[3° World]
It's a BRONZE!!
A third place in the World Challenge: how does humanity look from that high? For next week? "Just do it!", "impossible is nothing!" and all the other motivational slogan that you know...

[1° City]
The best in town? YOU!!!
You're killing it! Your city should be proud of you!! Do you know that MUVing like this will inspire your community to save the world?
[2° City]
Second place!
You did great this week and your silver trophy is shining in your palmares. But "almost there" doesn't mean you'll never get there... See you next week for a golden celebration!
[3° City]
Third place!
It's a Bronze that looks like Gold! Your fellow citizens should follow your example. Are you thinking the same thing that we do? Yes! The Ninja Turtles should fly and you should win next week! */

  getFeedContentFromString = (str, rplc_text) => {
    let first_perc = str.indexOf("%");
    let last_perc = str.indexOf("%", first_perc + 1);
    let introduction = str.substr(0, first_perc);
    let ending = str.substr(last_perc + 1, str.lenght);

    return (
      <Text style={styles.textDescr}>
        {introduction}
        <Text style={styles.textDescrBold}>{rplc_text}</Text>
        {ending}
      </Text>
    );
  };

  descriptionFeed = () => {
    if (this.props.modal_type === "Event") {
      // return (
      //   <Text style={styles.textDescr}>
      //     {ex_strings("descrFeedEvent}
      //     <Text style={styles.textDescrBold}>"{this.props.description}"</Text>
      //     {ex_strings("descrFeedEventEnd}
      //   </Text>
      // );
      return this.getFeedContentFromString(
        strings("the_training_ev"),
        translateEvent(this.props.description)
      );
    } else if (this.props.modal_type === "Session") {
      return this.getFeedContentFromString(
        strings("whoa__you_just_"),
        this.props.description
      );
      // return (
      //   <Text style={styles.textDescr}>
      //     {ex_strings("descrFeedSession}
      //     <Text style={styles.textDescrBold}>
      //       "{this.props.description}
      //       ".
      //     </Text>
      //     {ex_strings("descrFeedSessionEnd}
      //     }
      //   </Text>
      // );
    } else if (this.props.modal_type === "BonusActivities") {
      if (this.props.bonusType == 1) {
        return <Text style={styles.textDescr}>{strings("id_18_43")}</Text>;
      } else if (this.props.activity_minutes == 2) {
        return <Text style={styles.textDescr}>{strings("id_18_50")}</Text>;
      } else {
        // 3
        return <Text style={styles.textDescr}>{strings("id_18_51")}</Text>;
      }
    } else if (this.props.modal_type === "DailyActivities") {
      if (this.props.activity_minutes >= 10000) {
        return this.getFeedContentFromString(strings("id_18_41"), "");
      } else if (this.props.activity_minutes >= 5000) {
        return this.getFeedContentFromString(strings("id_18_39"), "");
      } else {
        return this.getFeedContentFromString(strings("id_18_37"), "");
      }
    } else if (this.props.modal_type === "Trophies") {
      if (this.props.trophy) {
        if (this.props.trophy.position == 1) {
          return (
            <Text style={styles.textDescr}>
              {/* {ex_strings("descrFeedTrophiesFirstGlobalTrophy} */}
              {strings("nobody_on_plane")}
            </Text>
          );
        } else if (this.props.trophy.position == 2) {
          return (
            <Text style={styles.textDescr}>
              {/* {ex_strings("descrFeedTrophiesFirstGlobalTrophy} */}
              {strings("this_time_you_a")}
            </Text>
          );
        } else if (this.props.trophy.position == 3) {
          return (
            <Text style={styles.textDescr}>
              {/* {ex_strings("descrFeedTrophiesFirstGlobalTrophy} */}
              {strings("wow__a_third_pl")}
            </Text>
          );
        }
      }
      // caso generico
      return (
        <Text style={styles.textDescr}>
          {/* {ex_strings("descrFeedTrophiesFirstGlobalTrophy} */}
          {strings("wow__a_third_pl")}
        </Text>
      );
      // switch (this.props.typeTrophie) {
      //   case "FirstGlobalTrophy":
      //     return (
      //       <Text style={styles.textDescr}>
      //         {/* {ex_strings("descrFeedTrophiesFirstGlobalTrophy} */}
      //         {strings("nobody_on_plane")}
      //       </Text>
      //     );
      //   case "SecondGlobalTrophy":
      //     return (
      //       <Text style={styles.textDescr}>
      //         {/* {ex_strings("descrFeedTrophiesSecondGlobalTrophy} */}
      //         {strings("this_time_you_a")}
      //       </Text>
      //     );
      //   case "ThirdGlobalTrophy":
      //     return (
      //       <Text style={styles.textDescr}>
      //         {/* {ex_strings("descrFeedTrophiesThirdGlobalTrophy} */}
      //         {strings("wow__a_third_pl")}
      //       </Text>
      //     );
      //   case "FirstLocalTrophy":
      //     console.log(data);
      //     const city = data.cities[this.props.city - 1].name;
      //     return this.getFeedContentFromString(
      //       strings("you_re_killing_"),
      //       city
      //     );
      //   // return (
      //   //   <Text style={styles.textDescr}>
      //   //     {ex_strings("descrFeedTrophiesFirstLocalTrophy}
      //   //     {city} {ex_strings("descrFeedTrophiesFirstLocalTrophyEnd}
      //   //   </Text>
      //   // );
      //   case "SecondLocalTrophy":
      //     return (
      //       <Text style={styles.textDescr}>
      //         {/* {ex_strings("descrFeedTrophiesSecondLocalTrophy} */}
      //         {strings("you_did_great_a")}
      //       </Text>
      //     );
      //   case "ThirdLocalTrophy":
      //     return (
      //       <Text style={styles.textDescr}>
      //         {/* {ex_strings("descrFeedTrophiesThirdLocalTrophy} */}
      //         {strings("it_s_a_bronze_t")}
      //       </Text>
      //     );
      // }
    } else if (this.props.modal_type === "Muv") {
      return (
        <Text style={styles.textDescr}>
          {/* {
            "Discover a day-in-a-life of a real sustainable mobility champion. [Spoiler Alert - at the end a ﬁrst great teaching from your Trainer…]"
          } */}
          {strings("id_18_02")}
        </Text>
      );
    } else if (this.props.modal_type === "WeeklyChallenge") {
      return (
        <Text style={styles.textDescr}>{strings("_530_every_week_we_r")}</Text>
      );
    } else if (this.props.modal_type === "quiz") {
      return <Text style={styles.textDescr}>{strings("good_news__you_")}</Text>;
    } else if (this.props.modal_type === "QuizComplete") {
      if (this.props.obtainable_coins) {
        // return (
        //   <Text style={styles.textDescr}>
        //     {ex_strings("descrFeedQuizComplete}
        //     <Text style={styles.textDescrBold}>
        //       {this.props.obtainable_coins}
        //     </Text>
        //     {ex_strings("descrFeedQuizCompleteEnd}
        //   </Text>
        // );
        return this.getFeedContentFromString(
          strings("you_just_won__c"),
          this.props.obtainable_coins
        );
      } else {
        return (
          <Text style={styles.textDescr}>{strings("not_even_a_righ")}</Text>
        );
      }
    } else if (this.props.modal_type === "survey") {
      return <Text style={styles.textDescr}>{strings("good_news__you_")}</Text>;
    } else if (this.props.modal_type === "SurveyComplete") {
      // return (
      //   <Text style={styles.textDescr}>
      //     {ex_strings("descrFeedSurveyComplete}
      //     <Text style={styles.textDescrBold}>
      //       {this.props.obtainable_coins}
      //     </Text>
      //     {ex_strings("descrFeedSurveyCompleteEnd}
      //   </Text>
      // );
      return this.getFeedContentFromString(
        strings("thanks_a_lot_fo"),
        this.props.obtainable_coins
      );
    } else if (this.props.modal_type === "Trainings") {
      return <Text style={styles.textDescr}>{strings("the_road_to_glo")}</Text>;
    } else if (this.props.modal_type === "addFrequentTrips") {
      return <Text style={styles.textDescr}>{strings("what_about_addi")}</Text>;
    } else if (this.props.modal_type === "firstFrequentTrip") {
      return <Text style={styles.textDescr}>{strings("frequent_trips_")}</Text>;
    } else if (this.props.modal_type === "updateProfile") {
      return <Text style={styles.textDescr}>{strings("id_18_13")}</Text>;
    } else if (this.props.modal_type === "mobilityHabits") {
      const city = this.props.cityName;
      // return (
      //   <Text style={styles.textDescr}>
      //     {ex_strings("descrFeedMobilityHabits}
      //     {city}
      //     {ex_strings("descrFeedMobilityHabitsEnd}
      //   </Text>
      // );
      // return this.getFeedContentFromString('strings("let_us_know_how"), city');
      return <Text style={styles.textDescr}>{strings("detail_the_info")}</Text>;
    } else if (this.props.modal_type === "feedback") {
      return <Text style={styles.textDescr}>{strings("like_playing_mu")}</Text>;
    } else if (this.props.modal_type === "rememberLevel") {
      return <Text style={styles.textDescr}>{strings("are_you_trainin")}</Text>;
    } else if (this.props.modal_type === "inviteFriend") {
      return <Text style={styles.textDescr}>{strings("we_need_your_he")}</Text>;
    } else if (this.props.modal_type === "Friend") {
      return (
        <Text style={styles.textDescr}>
          {this.getFeedContentFromString(
            strings("id_18_49"),
            this.props.username
          )}
        </Text>
      );
    } else if (this.props.modal_type === "Followed") {
      return (
        <Text style={styles.textDescr}>
          {this.getFeedContentFromString(
            strings("_user_name__is_"),
            this.props.first_name
          )}
        </Text>
      );
    } else if (this.props.modal_type === "MultipleFollowed") {
      return (
        <Text style={styles.textDescr}>
          {this.getFeedContentFromString(
            strings("_number_of_foll"),
            this.props.numFollowed
          )}
        </Text>
      );
    } else if (this.props.modal_type === "InviteAccepted") {
      return <Text style={styles.textDescr}>{strings("your_friend_mad")}</Text>;
    } else if (this.props.modal_type === "InviteConfirmed") {
      return <Text style={styles.textDescr}>{strings("guess_who_s_you")}</Text>;
    } else if (this.props.modal_type === "typeform") {
      return <Text style={styles.textDescr}>{strings("answer_this_bri")}</Text>;
    } else if (this.props.modal_type === "typeform_2") {
      return <Text style={styles.textDescr}>{strings("answer_this_bri")}</Text>;
    } else if (this.props.modal_type === "newST") {
      if (this.props.customisationGdpr)
        return (
          <Text style={styles.textDescr}>
            {this.getFeedContentFromString(
              strings("id_18_15"),
              this.props.textTraining
            )}
            {/* {this.getFeedContentFromString(
              strings("the_new_challen"),
              translateSpecialEvent(this.props.textTraining)
            )} */}
          </Text>
        );
      else
        return (
          <Text style={styles.textDescr}>
            {/* 
            {this.getFeedContentFromString(
              strings("hey_you___spons"),
              this.props.textSponsor
            )}
            {this.getFeedContentFromString(
              strings("the_new_challen"),
              translateSpecialEvent(this.props.textTraining)
            )} 
            */}
            {strings("id_18_35")}
          </Text>
        );
    } else if (this.props.modal_type === "completedST") {
      return (
        <Text style={styles.textDescr}>
          {this.getFeedContentFromString(
            strings("id_18_17"),
            translateSpecialEvent(this.props.textTraining)
          )}
          {/* 
          {this.getFeedContentFromString(
            strings("powered_by__spo"),
            this.props.textSponsor
          )} 
          */}
        </Text>
      );
    } else if (this.props.modal_type === "enrolledTournament") {
      return (
        <Text style={styles.textDescr}>
          {this.getFeedContentFromString(
            strings("id_18_33"),
            this.props.team_name
          )}
        </Text>
      );
    } else {
      // return (
      //   <Text style={styles.textDescr}>
      //     {ex_strings("descrFeedNewLevel}
      //     <Text style={styles.textDescrBold}>{this.props.description}</Text>
      //     {ex_strings("descrFeedNewLevelEnd}
      //   </Text>
      // );

      let NameLevel = "Newbie";
      switch (this.props.level) {
        case 1:
          // code block
          NameLevel = "Newbie";
          break;
        case 2:
          // code block
          NameLevel = "Rookie";
          break;
        case 3:
          // code block
          NameLevel = "Pro";
          break;
        case 4:
          // code block
          NameLevel = "Star";
          break;
        default:
          // code block
          NameLevel = "Newbie";
      }

      return this.getFeedContentFromString(
        strings("guess_what__you"),
        NameLevel
      );
    }
  };

  descriptionTitle = () => {
    if (this.props.modal_type === "Event") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedEventTitle} */}
          {strings("training_event_")}
        </Text>
      );
    } else if (this.props.modal_type === "Session") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedSessionTitle} */}
          {strings("training_sessio")}
        </Text>
      );
    } else if (this.props.modal_type === "BonusActivities") {
      return <Text style={styles.textModalSplit}>{strings("id_18_42")}</Text>;
    } else if (this.props.modal_type === "DailyActivities") {
      if (this.props.activity_minutes >= 90) {
        return <Text style={styles.textModalSplit}>{strings("id_18_40")}</Text>;
      } else if (this.props.activity_minutes >= 60) {
        return <Text style={styles.textModalSplit}>{strings("id_18_38")}</Text>;
      } else {
        return <Text style={styles.textModalSplit}>{strings("id_18_36")}</Text>;
      }
    } else if (this.props.modal_type === "Muv") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedMUVTitle} */}
          {/* {Watch the VIDEO to become a MUV STAR!} */}
          {strings("id_18_01")}
        </Text>
      );
    } else if (this.props.modal_type === "WeeklyChallenge") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedMUVTitle} */}
          {strings("_529_who_s_the_best_")}
        </Text>
      );
    } else if (this.props.modal_type === "quiz") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedQuizTitle} */}
          {strings("bonus_question_")}
        </Text>
      );
    } else if (this.props.modal_type === "QuizComplete") {
      if (this.props.obtainable_coins) {
        return (
          <Text style={styles.textModalSplit}>
            {/* {ex_strings("descrFeedQuizCompleteTitle} */}
            {strings("you_rocked_")}
          </Text>
        );
      } else {
        return (
          <Text style={styles.textModalSplit}>
            {/* {ex_strings("descrFeedQuizFailTitle} */}
            {strings("too_bad___")}
          </Text>
        );
      }
    } else if (this.props.modal_type === "Trophies") {
      if (this.props.trophy) {
        if (this.props.trophy.position == 1) {
          return (
            <Text style={styles.textModalSplit}>
              {/* {ex_strings("descrFeedTrophiesFirstGlobalTrophyTitle} */}
              {strings("you_freaking_di")}
            </Text>
          );
        } else if (this.props.trophy.position == 2) {
          return (
            <Text style={styles.textModalSplit}>
              {/* {ex_strings("descrFeedTrophiesFirstGlobalTrophyTitle} */}
              {strings("it_s_silver__ki")}
            </Text>
          );
        } else if (this.props.trophy.position == 3) {
          return (
            <Text style={styles.textModalSplit}>
              {/* {ex_strings("descrFeedTrophiesFirstGlobalTrophyTitle} */}
              {strings("it_s_a_bronze__")}
            </Text>
          );
        }
      }
      // caso generico
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedTrophiesFirstGlobalTrophyTitle} */}
          {strings("it_s_a_bronze__")}
        </Text>
      );

      // switch (this.props.typeTrophie) {
      //   case "FirstGlobalTrophy":
      //     return (
      //       <Text style={styles.textModalSplit}>
      //         {/* {ex_strings("descrFeedTrophiesFirstGlobalTrophyTitle} */}
      //         {strings("you_freaking_di")}
      //       </Text>
      //     );
      //   case "SecondGlobalTrophy":
      //     return (
      //       <Text style={styles.textModalSplit}>
      //         {/* {ex_strings("descrFeedTrophiesSecondGlobalTrophyTitle} */}
      //         {strings("it_s_silver__ki")}
      //       </Text>
      //     );
      //   case "ThirdGlobalTrophy":
      //     return (
      //       <Text style={styles.textModalSplit}>
      //         {/* {ex_strings("descrFeedTrophiesThirdGlobalTrophyTitle} */}
      //         {strings("it_s_a_bronze__")}
      //       </Text>
      //     );
      //   case "FirstLocalTrophy":
      //     return (
      //       <Text style={styles.textModalSplit}>
      //         {/* {ex_strings("descrFeedTrophiesFirstLocalTrophyTitle} */}
      //         {strings("the_best_in_tow")}
      //       </Text>
      //     );
      //   case "SecondLocalTrophy":
      //     return (
      //       <Text style={styles.textModalSplit}>
      //         {/* {ex_strings("descrFeedTrophiesSecondLocalTrophyTitle} */}
      //         {strings("almost_a_city_c")}
      //       </Text>
      //     );
      //   case "ThirdLocalTrophy":
      //     return (
      //       <Text style={styles.textModalSplit}>
      //         {/* {ex_strings("descrFeedTrophiesThirdLocalTrophyTitle} */}
      //         {strings("third_place_")}
      //       </Text>
      //     );
      // }
    } else if (this.props.modal_type === "survey") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedSurveyUnlockTitle} */}
          {strings("surprise__")}
        </Text>
      );
    } else if (this.props.modal_type === "SurveyComplete") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedSurveyCompleteTitle} */}
          {strings("survey_complete")}
        </Text>
      );
    } else if (this.props.modal_type === "Trainings") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedTrainingsTitle} */}
          {strings("let_s_start_")}
        </Text>
      );
    } else if (this.props.modal_type === "addFrequentTrips") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedAddFrequentTripsTitle} */}
          {strings("add_a_new_trip_")}
        </Text>
      );
    } else if (this.props.modal_type === "firstFrequentTrip") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedAddFrequentTripsTitle} */}
          {strings("add_your_first_")}
        </Text>
      );
    } else if (this.props.modal_type === "updateProfile") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedUpdateProfileTitle} */}
          {strings("id_18_12")}
        </Text>
      );
    } else if (this.props.modal_type === "mobilityHabits") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedMobilityHabitsTitle} */}
          {strings("a_fair_deal_")}
        </Text>
      );
    } else if (this.props.modal_type === "feedback") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedFeedbackTitle} */}
          {strings("your_opinion_ma")}
        </Text>
      );
    } else if (this.props.modal_type === "rememberLevel") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedRememberLevelTitle} */}
          {strings("it_s_time_to_tr")}
        </Text>
      );
    } else if (this.props.modal_type === "inviteFriend") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedFeedbackTitle} */}
          {strings("spread_the_word")}
        </Text>
      );
    } else if (this.props.modal_type === "InviteAccepted") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedFeedbackTitle} */}
          {this.getFeedContentFromString(
            strings("and__user_name_"),
            this.props.first_name
          )}
        </Text>
      );
    } else if (this.props.modal_type === "InviteConfirmed") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedFeedbackTitle} */}
          {this.getFeedContentFromString(
            strings("your_friend__fr"),
            this.props.first_name
          )}
        </Text>
      );
    } else if (this.props.modal_type === "Friend") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedFeedbackTitle} */}
          {strings("id_18_48")}
        </Text>
      );
    } else if (this.props.modal_type === "Followed") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedFeedbackTitle} */}
          {strings("you_re_getting_")}
        </Text>
      );
    } else if (this.props.modal_type === "MultipleFollowed") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedFeedbackTitle} */}
          {strings("looks_like_you_")}
        </Text>
      );
    } else if (this.props.modal_type === "typeform") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedFeedbackTitle} */}
          {strings("ask_not_what_sc")}
        </Text>
      );
    } else if (this.props.modal_type === "typeform_2") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedFeedbackTitle} */}
          {strings("ask_not_what_sc")}
        </Text>
      );
    } else if (this.props.modal_type === "newST") {
      if (this.props.customisationGdpr)
        return (
          <Text style={styles.textModalSplit}>
            {/* {ex_strings("descrFeedFeedbackTitle} */}
            {strings("id_18_14")}
          </Text>
        );
      else
        return (
          <Text style={styles.textModalSplit}>
            {/* {ex_strings("descrFeedFeedbackTitle} */}
            {strings("id_18_14")}
          </Text>
        );
    } else if (this.props.modal_type === "completedST") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedFeedbackTitle} */}
          {strings("id_18_16")}
        </Text>
      );
    } else if (this.props.modal_type === "enrolledTournament") {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedFeedbackTitle} */}
          {strings("id_18_32")}
        </Text>
      );
    } else {
      return (
        <Text style={styles.textModalSplit}>
          {/* {ex_strings("descrFeedNewLevelTitle} */}
          {strings("new_level_achie")}
        </Text>
      );
    }
  };

  render() {
    // calcola la durata prendendo l'intervallo e convertendolo in ore:minuti:secondi
    /* 
    const durate = new Date(
      this.props.time_travelled
        ? this.props.time_travelled
        : this.props.time_travelled_second * 1000
    )
      .toISOString()
      .substr(11, 8); 
    */

    let shadowOpt;
    if (Platform.OS == "ios")
      shadowOpt = {
        width: Dimensions.get("window").width * 0.9,
        flex: 1,

        color: "#888",
        border: 1,
        radius: 5,
        opacity: 0.25,
        x: 0,
        y: 1,
        style: {
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          alignSelf: "center",
        },
      };
    else
      shadowOpt = {
        width: Dimensions.get("window").width * 0.9,
        flex: 1,

        color: "#888",
        border: 0.5,
        radius: 5,
        opacity: 0.15,
        x: 0,
        y: 1,
        style: {
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          alignSelf: "center",
        },
      };

    // se ho passato la data
    let label = timeAgo(this.props.DataNow, this.props.Data);

    return (
      <View>
        <TouchableOpacity
          style={styles.view}
          activeOpacity={0.7}
          onPress={this.moveTraining}
        >
          <View style={styles.viewStyle}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: Dimensions.get("window").width * 0.15,

                // backgroundColor: "#ffa"
                // borderLeftColor: "#9D9B9C80",
                // borderLeftWidth: 1.5
              }}
            >
              {this.getImagePath(this.props.modal_type)}
            </View>
            <View
              style={{
                width: Dimensions.get("window").width * 0.55,
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.textTitle}>
                {this.descriptionTitle()}
                {label}
              </Text>
              {this.descriptionFeed()}
            </View>
            <View
              style={{
                width: Dimensions.get("window").width * 0.05,
                // backgroundColor: 'red'
                // borderLeftColor: "#9D9B9C80",
                // borderLeftWidth: 1.5
              }}
            >
              {/* 
                <Text style={styles.textPoints}>
                  {this.props.totPoints.toFixed(0)}
                </Text>
                <Text style={styles.pt}>pt</Text> 
              */}
              {this.getEndImagePath(this.props.modal_type)}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export function timeAgo(DataNow, Data) {
  // console.log(DataNow);
  // console.log(Data);

  let label = "";
  if (DataNow && Data) {
    const TimeAgo = DataNow - Data;
    // ora prendo le info sulla data e vedo quale è l'info sul tempo piu grande

    // minuti
    let time = TimeAgo / 60000;
    let text = strings("id_4_06");
    let minute = true;
    let intTime = parseInt(time);

    if (intTime !== 0) {
      if (intTime === 1) {
        text = strings("id_4_07");
      }
      // ore
      let timeNew = time / 60;
      intTime = parseInt(timeNew);
      if (intTime !== 0) {
        if (intTime === 1) {
          text = strings("id_4_05");
        } else {
          text = strings("id_4_04");
        }
        time = timeNew;

        // non sono piu minuti
        minute = false;
        // giorni
        timeNew = time / 24;
        intTime = parseInt(timeNew);
        if (intTime !== 0) {
          if (intTime === 1) {
            text = strings("id_4_03");
          } else {
            text = strings("id_4_02");
          }
          time = timeNew;

          // mesi
          timeNew = time / 30;
          intTime = parseInt(timeNew);
          if (intTime !== 0) {
            if (intTime === 1) {
              text = strings("id_18_19");
            } else {
              text = strings("id_18_18");
            }
            time = timeNew;
          }
        }
      }
    }
    time = parseInt(time);

    const languageSet = getLanguageI18n();

    if (languageSet == "ct" || languageSet == "es") {
      if (time === 0 && minute) label = " | " + strings("id_1_22");
      else label = " | " + strings("id_1_21") + " " + time + " " + text;
    } else {
      if (time === 0 && minute) label = " | " + strings("id_1_22");
      else label = " | " + time + " " + text + " " + strings("id_1_21");
    }
  }
  return label;
}

const styles = {
  view: {
    width: Dimensions.get("window").width * 0.9,
    flex: 1,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#B2B2B220",
    borderRadius: 5,
    backgroundColor: "#fff",
    shadowRadius: 2,
    shadowColor: "#B2B2B2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    marginBottom: 20,
  },
  viewStyle: {
    width: Dimensions.get("window").width * 0.9,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
  },
  textTitle: {
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
    marginVertical: 6,
    marginTop: 15,
  },
  textPoints: {
    fontSize: 30,
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
  },
  textDescr: {
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
    marginVertical: 6,
    marginBottom: 15,
  },
  textDescrBold: {
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
    marginVertical: 6,
    fontWeight: "bold",
  },
  textModalSplit: {
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
    marginVertical: 6,
    fontWeight: "bold",
  },
  points: {
    fontSize: 20,
    color: "white",
    fontFamily: "OpenSans-Regular",
  },
  pt: {
    fontSize: 10,
    marginTop: 5,
    fontFamily: "OpenSans-Regular",
  },
  circle: {
    width: Dimensions.get("window").width / 50 + 10,
    height: Dimensions.get("window").width / 50 + 10,
    borderRadius: Dimensions.get("window").width / 50 + 10,
    // justifyContent: "center",
    // alignItems: "center",
    // alignSelf: "center",
    borderWidth: 5,
  },
};

export default withNavigation(RecapTraining);
