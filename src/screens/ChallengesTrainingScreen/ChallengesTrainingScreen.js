import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from "react-native";
import ChallengeTrainingContainer from "./../../components/ChallengeTrainingContainer/ChallengeTrainingContainer";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { strings } from "../../config/i18n";
import LinearGradient from "react-native-linear-gradient";
import {
  getChallenges,
  getChallengesRewards,
  getChallengesRewardsByUser,
  getChallengeRankingByUser,
  getChallengesAllowed,
} from "./../../domains/challenges/ActionCreators";

class ChallengesTrainingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      available_challenges: [],
      active_challenges: [],
      refreshing: false,
      content: {},
      show_loading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        available_challenges: [...nextProps.availableChallengesState],
        active_challenges: [...nextProps.activeChallengesState],
      },
      () => {}
    );
  }

  componentWillMount() {
    this.props.dispatch(getChallenges());
    this.props.dispatch(getChallengesRewards());
    this.props.dispatch(getChallengesRewardsByUser());
    this.props.dispatch(getChallengeRankingByUser());
    this.props.dispatch(getChallengesAllowed());
    this.setState(
      {
        available_challenges: [...this.props.availableChallengesState],
        active_challenges: [...this.props.activeChallengesState],
      },
      () => {}
    );
  }

  onRefresh() {
    this.props.dispatch(getChallenges());
    this.props.dispatch(getChallengesRewards());
    this.props.dispatch(getChallengeRankingByUser());
    this.props.dispatch(getChallengesAllowed());
    this.setState(
      {
        refreshing: true,
        available_challenges: [...this.props.availableChallengesState],
        active_challenges: [...this.props.activeChallengesState],
      },
      () => {
        // console.log(this.state);
      }
    );

    const loading = setInterval(() => {
      {
        this.setState({ refreshing: false });
        clearTimeout(loading);
      }
    }, 1000);
  }

  renderChallengeItem = (e) => {
    if (e.item.header_c_active)
      return (
        <View style={[styles.topTextContainer, styles.marginContainer]}>
          <Text style={styles.topText}>{strings("id_3_02").toUpperCase()}</Text>
        </View>
      );
    else if (e.item.header_c_ava)
      return (
        <View style={[styles.topTextContainer, styles.marginContainer]}>
          <Text style={styles.topText}>{strings("id_3_03").toUpperCase()}</Text>
        </View>
      );
    else
      return (
        <View key={e.item.id} style={styles.availableChallengesContainer}>
          <View style={styles.marginContainer} />
          <ChallengeTrainingContainer
            navigation={this.props.navigation}
            active={false}
            name={e.item.title}
            challenge={e.item}
            active={e.item.active}
          />
        </View>
      );
  };

  renderChallenge() {
    let challenge_list = [],
      active_challenge_array_with_flag = [],
      available_challenge_array_with_flag = [];
    //
    //
    this.state.active_challenges.forEach((e) => {
      active_challenge_array_with_flag.push({ ...e, active: true });
    });
    this.state.available_challenges.forEach((e) => {
      available_challenge_array_with_flag.push({ ...e, active: false });
    });

    if (this.state.active_challenges.length > 0) {
      challenge_list = [
        { header_c_active: true },
        ...active_challenge_array_with_flag,
      ];

      if (this.state.available_challenges.length > 0) {
        challenge_list = [
          ...challenge_list,
          {
            header_c_ava: true,
          },
          ...available_challenge_array_with_flag,
        ];
      }
    } else
      challenge_list = [
        { header_c_ava: true },
        ...available_challenge_array_with_flag,
      ];

    return (
      <View>
        <FlatList
          style={{
            margin: 10,
          }}
          data={challenge_list}
          renderItem={this.renderChallengeItem}
        />
        <View style={{ height: 200 }} />
      </View>
    );
  }

  render() {
    if (
      this.state.active_challenges.length > 0 ||
      this.state.available_challenges.length > 0
    )
      return (
        <View
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            backgroundColor: "#fff",
          }}
        >
          <ScrollView
            contentContainerStyle={[styles.mainContainer, { flex: 1 }]}
            showsHorizontalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
          >
            <View style={styles.marginContainer} />
            <View
              style={{
                height: Dimensions.get("window").height,
              }}
            >
              {this.renderChallenge()}
            </View>
          </ScrollView>
        </View>
      );
    else
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          contentContainerStyle={styles.allView}
        >
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 0.0, y: 1.0 }}
            locations={[0, 1.0]}
            colors={["#E82F73", "#F49658"]}
            style={styles.allView}
          >
            <ImageBackground
              source={require("./../../assets/images/cities/city_page_bg.png")}
              style={styles.allView}
            >
              <View style={styles.space}></View>
              <Image
                source={require("./../../assets/images/challenge_empty.png")}
                style={styles.imageLogo}
              />
              {/* <View style={styles.space}></View> */}
              <View style={styles.subView}>
                <Text style={styles.textTournament}>{strings("id_3_15")}</Text>
              </View>
            </ImageBackground>
          </LinearGradient>
        </ScrollView>
      );
  }
}

const styles = StyleSheet.create({
  textTournament: {
    fontFamily: "OpenSans-Bold",
    fontSize: 16,
    textAlign: "center",
    color: "#FFFFFF",
  },
  imageLogo: {
    width: Dimensions.get("window").width * 0.6,
    height: Dimensions.get("window").width * 0.6,
  },
  space: {
    height: Dimensions.get("window").width * 0.15,
  },
  subView: {
    width: Dimensions.get("window").width * 0.8,
    paddingTop: 15,
  },
  allView: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  mainContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.5,
    alignSelf: "center",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  topTextContainer: {
    width: Dimensions.get("window").width * 0.9,
    alignSelf: "center",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  marginContainer: { marginTop: 20 },
  topText: {
    color: "#3D3D3D",
    fontSize: 16,
    textAlignVertical: "center",
    fontFamily: "Montserrat-ExtraBold",
  },
  availableChallengesContainer: {
    width: Dimensions.get("window").width,
    alignSelf: "center",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  headerText: {
    fontFamily: "OpenSans-Regular",
    color: "#3F3F3F",
    fontSize: 12,
    textAlignVertical: "center",
  },
  headerContainer: {
    width: Dimensions.get("window").width * 0.8,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

const getAvailableChallenges = (state) =>
  state.challenges.available_challenges
    ? state.challenges.available_challenges
    : [];

const getActiveChallenges = (state) =>
  state.challenges.active_challenges ? state.challenges.active_challenges : [];

const getAllowedChallenges = (state) =>
  state.challenges.allowed_challenges
    ? state.challenges.allowed_challenges
    : [];

const filterChllngsByEndTime = (chllngs = []) => {
  return chllngs.filter((e) => {
    let d = new Date();
    let c = new Date(e.end_time);
    return c > d;
  });
};

const getAvailableChallengesState = createSelector(
  [getAvailableChallenges, getActiveChallenges, getAllowedChallenges],
  (available_challenges, active_challenges, allowed_challenges) => {
    return filterChllngsByEndTime(allowed_challenges);
    // if (active_challenges.length > 0) {
    //   let active_challenges_reduced = [];
    //   active_challenges.forEach(e => {
    //     if (e.status == 2) active_challenges_reduced.push(e.challenge);
    //   });

    //   ava_challenge_state = available_challenges.filter(e => {
    //     return !active_challenges_reduced.includes(e.id);
    //   });
    //   return filterChllngsByEndTime([...ava_challenge_state]);
    // } else {
    //   return filterChllngsByEndTime([...available_challenges]);
    // }
  }
);

const getActiveChallengesState = createSelector(
  [getAvailableChallenges, getActiveChallenges],
  (available_challenges, active_challenges) => {
    if (active_challenges.length > 0) {
      let active_challenges_reduced = [];
      active_challenges.forEach((e) => {
        if (e.status != 3) active_challenges_reduced.push(e.challenge);
      });

      act_challenge_state = available_challenges.filter((e) => {
        return active_challenges_reduced.includes(e.id);
      });
      return [...act_challenge_state];
    }
    return [];
  }
);

const withData = connect((state) => {
  return {
    availableChallengesState: getAvailableChallengesState(state),
    activeChallengesState: getActiveChallengesState(state),
  };
});

export default withData(ChallengesTrainingScreen);

// export default ChallengesTrainingScreen;
