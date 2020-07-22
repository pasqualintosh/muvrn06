import React from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  RefreshControl,
  ImageBackground
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import { strings } from "../../config/i18n";
import {
  getSpecialTrainingSessions,
  getSpecialTrainingSessionSubscribed
} from "./../../domains/trainings/ActionCreators";
import { getSponsor } from "./../../helpers/specialTrainingSponsors";
import { translateSpecialEvent } from "../../helpers/translateSpecialEvent";
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
import { createSelector } from "reselect";
import {
  getChallenges,
  getChallengesRewards,
  getChallengesRewardsByUser,
  getChallengeRankingByUser,
  getRewardsCategory
} from "./../../domains/challenges/ActionCreators";

// const rewards = [
//   {
//     id: 1,
//     challenge: {
//       id: 1,
//       name: "Pedala e poi si vede"
//     },
//     reward: {
//       position: 1,
//       name: "Primo premio"
//     },
//     w_date: new Date("2020-02-10 08:00:00"),
//     e_date: new Date("2020-02-16 08:00:00"),
//     sponsor: {
//       name: "Pepsi"
//     }
//   },
//   {
//     id: 2,
//     challenge: {
//       id: 2,
//       name: "Cammina e poi si vede"
//     },
//     reward: {
//       position: 3,
//       name: "Terzo premio"
//     },
//     w_date: new Date("2020-02-10 08:00:00"),
//     e_date: new Date("2020-02-22 08:00:00"),
//     sponsor: {
//       name: "Red bull"
//     }
//   },
//   {
//     id: 3,
//     challenge: {
//       id: 3,
//       name: "Vai in autobus e poi si vede"
//     },
//     reward: {
//       position: 3,
//       name: "Terzo premio"
//     },
//     w_date: new Date("2020-02-10 08:00:00"),
//     e_date: new Date("2020-02-22 08:00:00"),
//     sponsor: {
//       name: "Coca cola"
//     }
//   },
//   {
//     id: 4,
//     challenge: {
//       id: 4,
//       name: "Vai in metro e poi si vede"
//     },
//     reward: {
//       position: 3,
//       name: "Terzo premio"
//     },
//     w_date: new Date("2020-02-10 08:00:00"),
//     e_date: new Date("2020-02-22 08:00:00"),
//     sponsor: {
//       name: "Codeina"
//     }
//   }
// ];

class RewardsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      score: [],
      available_challenges: [],
      active_challenges: [],
      rewards: [],
      rewards_map: [],
      reward_categories: []
    };
  }

  // onRefresh() {
  //   this.setState({ refreshing: true });
  //   this.props.dispatch(getSpecialTrainingSessionSubscribed());
  //   const loading = setInterval(() => {
  //     this.setState({ refreshing: false });
  //     clearTimeout(loading);
  //   }, 3000);
  // }

  compare = (a, b) => {
    if (a.id < b.id) {
      return -1;
    }
    if (a.id == b.id) {
      return 0;
    }
    return 1;
  };

  createRewardsArray() {
    console.log(this.state);
    if (this.state.rewards_map.length > 0) {
      let won_challenges_score = this.state.score.filter(e => {
          return e.status == 3;
        }),
        won_challenges_array = [],
        rewards = [],
        { available_challenges } = this.state;

      available_challenges.sort((a, b) => {
        return b.id - a.id;
      });

      this.state.available_challenges.forEach(e => {
        // if (e.rewards.includes)
        for (let index = 0; index < this.state.rewards_map.length; index++) {
          const element = this.state.rewards_map[index];

          if (e.rewards.includes(element.id)) {
            won_challenges_array.push({ challenge: { ...e }, reward: element });
          }
        }
      });

      console.log(won_challenges_array);

      // won_challenges_score.forEach(e => {
      //   won_challenges_array.push(e.challenge);
      // });
      // this.state.available.filter((e, i) => {
      //   if (won_challenges_array.includes(e.id)) {
      //     let rewardObj = this.state.rewards_map.filter(el => {
      //       return el.id == e.rewards[0];
      //     })[0];
      //     rewards.push({
      //       id: e.rewards[0],
      //       challenge: { ...e },
      //       reward: { ...rewardObj }
      //     });
      //   }
      // });
      this.setState({ rewards: won_challenges_array });
    }
  }

  onRefresh() {
    this.props.dispatch(getChallenges());
    this.props.dispatch(getChallengesRewards());
    this.props.dispatch(getChallengesRewardsByUser());
    this.props.dispatch(getChallengeRankingByUser());
    this.props.dispatch(getRewardsCategory());
    this.setState(
      {
        refreshing: true,
        available_challenges: [...this.props.availableChallengesState],
        active_challenges: [...this.props.activeChallengesState],
        score: [...this.props.scoreState],
        rewards_map: [...this.props.availableRewardsState],
        reward_categories: [...this.props.categoriesState]
      },
      () => {
        // console.log(this.state);
        this.createRewardsArray();
      }
    );

    const loading = setInterval(() => {
      {
        this.setState({ refreshing: false });
        clearTimeout(loading);
      }
    }, 1000);
  }

  componentDidMount() {
    Tracker.trackScreenView("RewardsScreen.js");
    trackScreenView("RewardsScreen.js");
  }

  componentWillMount() {
    this.props.dispatch(getChallenges());
    this.props.dispatch(getChallengesRewards());
    this.props.dispatch(getChallengeRankingByUser());
    this.props.dispatch(getRewardsCategory());

    this.setState(
      {
        available_challenges: [...this.props.availableChallengesState],
        active_challenges: [...this.props.activeChallengesState],
        score: [...this.props.scoreState],
        rewards_map: [...this.props.availableRewardsState],
        reward_categories: [...this.props.categoriesState]
      },
      () => {
        this.createRewardsArray();
      }
    );
  }

  renderEmptyRewards() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "#fff",
          flex: 1
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-around",
            height: Dimensions.get("window").height * 0.64,
            position: "relative",
            alignSelf: "center",
            width: Dimensions.get("window").width * 0.8
          }}
        >
          <View
            style={[
              styles.headerContainer,
              { height: 75, alignSelf: "center" }
            ]}
          >
            <Text style={styles.headerText}>{strings("id_10_02")}</Text>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.6,
              height: Dimensions.get("window").width * 0.6,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignSelf: "center"
            }}
          >
            <Image
              source={require("./../../assets/images/rewards_empty.png")}
              style={{
                width: Dimensions.get("window").width * 0.6,
                height: Dimensions.get("window").width * 0.6
              }}
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  getItemBg(e) {
    let n = new Date();
    console.log(new Date(e.challenge.end_time) > n);
    if (new Date(e.challenge.end_time) > n) {
      return require("../../assets/images/rewards_item_bg.png");
    } else {
      return require("../../assets/images/rewards_item_bg_bn.png");
    }
  }

  getItemStar(e) {
    let n = new Date();
    if (new Date(e.challenge.end_time) > n) {
      return require("../../assets/images/star_yellow.png");
    } else {
      return require("../../assets/images/star_gray.png");
    }
  }

  getItemImage(e) {
    let n = new Date(),
      category = this.state.reward_categories.filter(el => {
        return el.id == e.reward.category;
      })[0];

    // console.log(category.name);
    // console.log(getRewardImg(category.name));

    if (new Date(e.challenge.end_time) > n) {
      return getRewardImg(category.name);
    } else {
      return getRewardImgBn(category.name);
    }
  }

  renderRewardItems(row = []) {
    let n = new Date();
    console.log(row);

    return row.map(e => (
      <TouchableWithoutFeedback
        key={e.challenge.id}
        style={new_layout_styles.rewardItemContainer}
        onPress={() => {
          this.props.navigation.navigate("RewardDetailScreen", {
            reward: e
          });
        }}
      >
        <View
          key={e.challenge.id}
          style={new_layout_styles.rewardItemContainer}
        >
          <View style={new_layout_styles.rewardSponsorContainer}>
            <Image
              source={this.getItemStar(e)}
              style={{
                width: 15,
                height: 15
              }}
              resizeMethod={"auto"}
            />
            <Text>
              <Text style={new_layout_styles.byText}>
                {strings("id_10_03")}{" "}
              </Text>
              <Text style={new_layout_styles.sponsorNameText}>
                {e.challenge.sponsor}
              </Text>
            </Text>
          </View>

          <ImageBackground
            style={new_layout_styles.cityCircle}
            source={this.getItemBg(e)}
          >
            <Image
              source={this.getItemImage(e)}
              style={new_layout_styles.imageReward}
              resizeMethod={"auto"}
            />
          </ImageBackground>

          <View style={new_layout_styles.challengeNameContainer}>
            <Text
              style={[
                new_layout_styles.challengeNameText,
                {
                  color:
                    new Date(e.challenge.end_time) > n ? "#3d3d3d" : "#3d3d3d60"
                }
              ]}
            >
              {e.challenge.description.substr(0, 60) + "..."}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    ));
  }

  renderNoBlock() {
    return (
      <View style={new_layout_styles.rewardItemContainer}>
        <View style={new_layout_styles.cityCircle}></View>
      </View>
    );
  }

  render() {
    if (this.state.rewards.length > 0) {
      const rewardsView = this.state.rewards;
      var rewardsRow = [];
      var set = [];
      var setCounter = 0;

      for (var i = 0; i < rewardsView.length; i++) {
        set.push(rewardsView[i]);
        if ((i + 1) % 3 == 0 || i + 1 >= rewardsView.length) {
          setCounter++;
          rewardsRow.push(set);
          set = [];
        }
      }

      return (
        <View style={new_layout_styles.mainContainer}>
          <ImageBackground
            style={new_layout_styles.curveContainer}
            source={require("./../../assets/images/purple_waves_bg.png")}
          ></ImageBackground>

          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
            contentContainerStyle={new_layout_styles.scrollViewContainer}
          >
            <View style={new_layout_styles.headerContainer}>
              <Text style={new_layout_styles.headerText}>
                {strings("id_10_01")
                  .charAt(0)
                  .toUpperCase() + strings("id_10_01").slice(1)}
              </Text>
            </View>
            {rewardsRow.map((row, i) => {
              if (row.length == 1) {
                return (
                  <View key={i} style={new_layout_styles.rewardsRowContainer}>
                    {this.renderRewardItems(row)}
                    {this.renderNoBlock()}
                    {this.renderNoBlock()}
                  </View>
                );
              } else {
                return (
                  <View key={i} style={new_layout_styles.rewardsRowContainer}>
                    {this.renderRewardItems(row)}
                  </View>
                );
              }
            })}
          </ScrollView>
        </View>
      );
    } else return this.renderEmptyRewards();
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    width: Dimensions.get("window").width * 0.8,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  headerText: {
    fontFamily: "OpenSans-Regular",
    color: "#3F3F3F",
    fontSize: 12,
    textAlignVertical: "center"
  },
  itemContainer: {
    flex: 1,
    // minHeight: 100,
    flexDirection: "row",
    // borderTopColor: "#9D9B9C",
    // borderTopWidth: 0.3,
    borderBottomColor: "#9D9B9C",
    borderBottomWidth: 0.3,
    backgroundColor: "#fff"
  },
  rewardTxt: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D",
    textAlign: "left"
  },
  rewardDescription: {
    fontSize: 10,
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D",
    textAlign: "left"
  },
  rewardPoweredBy: {
    fontSize: 9,
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D",
    textAlign: "left",
    marginTop: 7
  },
  item: {
    flexDirection: "row"
    // height: Dimensions.get("window").height * 0.1
  },
  leftContainer: {
    width: Dimensions.get("window").width * 0.3,
    // height: 100,
    justifyContent: "center",
    alignItems: "center"
  },
  centerContainer: {
    width: Dimensions.get("window").width * 0.5,
    // height: 100,
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 10
  },
  rightContainer: {
    width: Dimensions.get("window").width * 0.2,
    // height: 100,
    justifyContent: "center",
    alignItems: "center"
  }
});

const new_layout_styles = StyleSheet.create({
  mainContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "#fff"
  },
  headerContainer: {
    width: Dimensions.get("window").width,
    padding: 10,
    marginTop: 5
  },
  scrollViewContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.95,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10
  },
  curveContainer: {
    width: Dimensions.get("window").width,
    height: 320,
    position: "absolute",
    top: 0,
    left: 0
  },
  rewardItemContainer: {
    width: (Dimensions.get("window").width * 0.9) / 3 - 15,
    height: 160
  },
  rewardsRowContainer: {
    width: Dimensions.get("window").width * 0.9,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    alignSelf: "center",
    marginBottom: 10
  },
  rewardSponsorContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  rewardImageContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  challengeNameContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  cityCircle: {
    borderRadius: 100,
    width: 160 * 0.7,
    height: 160 * 0.7,
    alignSelf: "center",
    justifyContent: "center"
  },
  imageReward: {
    width: 160 * 0.5,
    height: 160 * 0.5,
    alignSelf: "center"
  },
  byText: {
    fontSize: 8,
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D"
  },
  sponsorNameText: {
    color: "#3d3d3d",
    fontFamily: "Montserrat-ExtraBold",
    fontSize: 8
  },
  challengeNameText: {
    color: "#3d3d3d",
    fontFamily: "Montserrat-ExtraBold",
    fontSize: 10
  },
  headerText: {
    color: "#3d3d3d",
    fontFamily: "Montserrat-ExtraBold",
    fontSize: 16
  }
});

export const getRewardImg = name => {
  switch (name) {
    case "Wine":
      return rewardImage[0];
      break;
    case "Accessory":
      return rewardImage[1];
      break;
    case "Art":
      return rewardImage[2];
      break;
    case "Bar":
      return rewardImage[3];
      break;
    case "Clothing":
      return rewardImage[4];
      break;
    case "Communication Service":
      return rewardImage[5];
      break;
    case "Consulting Service":
      return rewardImage[6];
      break;
    case "Domestic Appliance":
      return rewardImage[7];
      break;
    case "Domotic":
      return rewardImage[8];
      break;
    case "Food":
      return rewardImage[9];
      break;
    case "Furniture":
      return rewardImage[10];
      break;
    case "Game":
      return rewardImage[11];
      break;
    case "Gift":
      return rewardImage[12];
      break;
    case "Graphic Design":
      return rewardImage[13];
      break;
    case "Hardware":
      return rewardImage[14];
      break;
    case "ICT Service":
      return rewardImage[15];
      break;
    case "Maintenance Repair Service":
      return rewardImage[16];
      break;
    case "Music":
      return rewardImage[17];
      break;
    case "Plant":
      return rewardImage[18];
      break;
    case "Print Service":
      return rewardImage[19];
      break;
    case "Restaurant":
      return rewardImage[20];
      break;
    case "Shoe":
      return rewardImage[21];
      break;
    case "Software":
      return rewardImage[22];
      break;
    case "Sport":
      return rewardImage[23];
      break;
    case "Subscription":
      return rewardImage[24];
      break;
    case "Training Course":
      return rewardImage[25];
      break;
    case "Travel":
      return rewardImage[26];
      break;
    case "Utility":
      return rewardImage[27];
      break;
    case "Weleness":
      return rewardImage[28];
      break;
    case "Book":
      return rewardImage[29];
      break;

    default:
      return rewardImage[0];
      break;
  }
};
export const getRewardImgBn = name => {
  switch (name) {
    case "Wine":
      return rewardImageBn[0];
      break;
    case "Accessory":
      return rewardImageBn[1];
      break;
    case "Art":
      return rewardImageBn[2];
      break;
    case "Bar":
      return rewardImageBn[3];
      break;
    case "Clothing":
      return rewardImageBn[4];
      break;
    case "Communication Service":
      return rewardImageBn[5];
      break;
    case "Consulting Service":
      return rewardImageBn[6];
      break;
    case "Domestic Appliance":
      return rewardImageBn[7];
      break;
    case "Domotic":
      return rewardImageBn[8];
      break;
    case "Food":
      return rewardImageBn[9];
      break;
    case "Furniture":
      return rewardImageBn[10];
      break;
    case "Game":
      return rewardImageBn[11];
      break;
    case "Gift":
      return rewardImageBn[12];
      break;
    case "Graphic Design":
      return rewardImageBn[13];
      break;
    case "Hardware":
      return rewardImageBn[14];
      break;
    case "ICT Service":
      return rewardImageBn[15];
      break;
    case "Maintenance Repair Service":
      return rewardImageBn[16];
      break;
    case "Music":
      return rewardImageBn[17];
      break;
    case "Plant":
      return rewardImageBn[18];
      break;
    case "Print Service":
      return rewardImageBn[19];
      break;
    case "Restaurant":
      return rewardImageBn[20];
      break;
    case "Shoe":
      return rewardImageBn[21];
      break;
    case "Software":
      return rewardImageBn[22];
      break;
    case "Sport":
      return rewardImageBn[23];
      break;
    case "Subscription":
      return rewardImageBn[24];
      break;
    case "Training Course":
      return rewardImageBn[25];
      break;
    case "Travel":
      return rewardImageBn[26];
      break;
    case "Utility":
      return rewardImageBn[27];
      break;
    case "Weleness":
      return rewardImageBn[28];
      break;
    case "Book":
      return rewardImageBn[29];
      break;

    default:
      rewardImageBn[0];
      break;
  }
};

export const rewardImage = [
  require("./../../assets/images/rewards/wines.png"),
  require("./../../assets/images/rewards/accessories.png"),
  require("./../../assets/images/rewards/art.png"),
  require("./../../assets/images/rewards/bar.png"),
  require("./../../assets/images/rewards/clothing.png"),
  require("./../../assets/images/rewards/communication_services.png"),
  require("./../../assets/images/rewards/consulting_services.png"),
  require("./../../assets/images/rewards/domestic_appliances.png"),
  require("./../../assets/images/rewards/domotic.png"),
  require("./../../assets/images/rewards/food.png"),
  require("./../../assets/images/rewards/furniture.png"),
  require("./../../assets/images/rewards/games.png"),
  require("./../../assets/images/rewards/gifts.png"),
  require("./../../assets/images/rewards/graphic_design.png"),
  require("./../../assets/images/rewards/hardwares.png"),
  require("./../../assets/images/rewards/ict_services.png"),
  require("./../../assets/images/rewards/maintenance_repair_services.png"),
  require("./../../assets/images/rewards/music.png"),
  require("./../../assets/images/rewards/plants.png"),
  require("./../../assets/images/rewards/print_service.png"),
  require("./../../assets/images/rewards/restaurant.png"),
  require("./../../assets/images/rewards/shoes.png"),
  require("./../../assets/images/rewards/software.png"),
  require("./../../assets/images/rewards/sport.png"),
  require("./../../assets/images/rewards/subscriptions.png"),
  require("./../../assets/images/rewards/training_courses.png"),
  require("./../../assets/images/rewards/travel.png"),
  require("./../../assets/images/rewards/utilities.png"),
  require("./../../assets/images/rewards/wellness.png"),
  require("./../../assets/images/rewards/books.png")
];

export const rewardImageBn = [
  require("./../../assets/images/rewards/wines_bn.png"),
  require("./../../assets/images/rewards/accessories_bn.png"),
  require("./../../assets/images/rewards/art_bn.png"),
  require("./../../assets/images/rewards/bar_bn.png"),
  require("./../../assets/images/rewards/clothing_bn.png"),
  require("./../../assets/images/rewards/communication_services_bn.png"),
  require("./../../assets/images/rewards/consulting_services_bn.png"),
  require("./../../assets/images/rewards/domestic_appliances_bn.png"),
  require("./../../assets/images/rewards/domotic_bn.png"),
  require("./../../assets/images/rewards/food_bn.png"),
  require("./../../assets/images/rewards/furniture_bn.png"),
  require("./../../assets/images/rewards/games_bn.png"),
  require("./../../assets/images/rewards/gifts_bn.png"),
  require("./../../assets/images/rewards/graphic_design_bn.png"),
  require("./../../assets/images/rewards/hardwares_bn.png"),
  require("./../../assets/images/rewards/ict_services_bn.png"),
  require("./../../assets/images/rewards/maintenance_repair_services_bn.png"),
  require("./../../assets/images/rewards/music_bn.png"),
  require("./../../assets/images/rewards/plants_bn.png"),
  require("./../../assets/images/rewards/print_service_bn.png"),
  require("./../../assets/images/rewards/restaurant_bn.png"),
  require("./../../assets/images/rewards/shoes_bn.png"),
  require("./../../assets/images/rewards/software_bn.png"),
  require("./../../assets/images/rewards/sport_bn.png"),
  require("./../../assets/images/rewards/subscriptions_bn.png"),
  require("./../../assets/images/rewards/training_courses_bn.png"),
  require("./../../assets/images/rewards/travel_bn.png"),
  require("./../../assets/images/rewards/utilities_bn.png"),
  require("./../../assets/images/rewards/wellness_bn.png"),
  require("./../../assets/images/rewards/books_bn.png")
];

const getAvailableChallenges = state =>
  state.challenges.available_challenges
    ? state.challenges.available_challenges
    : [];
const getActiveChallenges = state =>
  state.challenges.active_challenges ? state.challenges.active_challenges : [];

const getChallengesScore = state =>
  state.challenges.active_challenges ? state.challenges.active_challenges : [];

const getAvailableRewars = state => state.challenges.user_rewards;

const getRewardsCategories = state =>
  state.challenges.reward_categories ? state.challenges.reward_categories : [];
const filterChllngsByEndTime = (chllngs = []) => {
  return chllngs.filter(e => {
    let d = new Date();
    let c = new Date(e.end_time);
    return c > d;
  });
};

const getChallengesScoreState = createSelector([getChallengesScore], score => {
  return [...score];
});

const getRewardsCategoriesState = createSelector(
  [getRewardsCategories],
  categories => {
    return [...categories];
  }
);

const getAvailableChallengesState = createSelector(
  [getAvailableChallenges, getActiveChallenges],
  (available_challenges, active_challenges) => {
    return [...available_challenges].reverse();
    if (active_challenges.length > 0) {
      let active_challenges_reduced = [];
      active_challenges.forEach(e => {
        active_challenges_reduced.push(e.challenge);
      });

      ava_challenge_state = available_challenges.filter(e => {
        return !active_challenges_reduced.includes(e.id);
      });
      return filterChllngsByEndTime([...ava_challenge_state]);
    } else {
      return filterChllngsByEndTime([...available_challenges]);
    }
  }
);

const getActiveChallengesState = createSelector(
  [getAvailableChallenges, getActiveChallenges],
  (available_challenges, active_challenges) => {
    if (active_challenges.length > 0) {
      let active_challenges_reduced = [];
      active_challenges.forEach(e => {
        active_challenges_reduced.push(e.challenge);
      });

      act_challenge_state = available_challenges.filter(e => {
        return active_challenges_reduced.includes(e.id);
      });
      return [...act_challenge_state];
    }
    return [];
  }
);

const getAvailableRewarsState = createSelector([getAvailableRewars], rewards =>
  rewards ? rewards : []
);

const withData = connect(state => {
  return {
    availableChallengesState: getAvailableChallengesState(state),
    activeChallengesState: getActiveChallengesState(state),
    scoreState: getChallengesScoreState(state),
    availableRewardsState: getAvailableRewarsState(state),
    categoriesState: getRewardsCategoriesState(state)
  };
});

export default withData(RewardsScreen);
