import React from "react";
import {
  View,
  Dimensions,
  Text,
  Image,
  StyleSheet,
  Animated,
  Platform,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import { getWeeklyLeaderboardNew } from "./../../domains/standings/ActionCreators";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { getFollowedState } from "./../../domains/follow/Selectors";
import UserItem from "./../../components/UserItem/UserItem";
import InviteItem from "./../../components/InviteItem/InviteItem";
import Aux from "./../../helpers/Aux";
import LinearGradient from "react-native-linear-gradient";
import { strings } from "../../config/i18n";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";
import {
  postSubscribeChallenge,
  getChallengeRankingById
} from "./../../domains/challenges/ActionCreators";
export const negativeData = [
  {
    value: -1000
  },
  {
    value: -1200
  },
  {
    value: -1000
  },
  {
    value: -1000
  },
  {
    value: -1200
  },
  {
    value: -1000
  }
];

class LeaderboardChallengeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollEnabled: true,
      scroll: new Animated.Value(0),
      leaderboard: [],
      score: {
        points: 0,
        challenge: null,
        username: null,
        avatar: null,
        position: null
      },
      refresh: false
    };
    this.challenge = null;
  }

  saveData = data => {
    this.setState({
      leaderboard: [...data.results],
      refresh: false
    });
  };

  componentWillMount() {
    this.setState({
      refresh: true
    });
    this.challenge = this.props.navigation.state.params.challenge;
    this.props.dispatch(
      getChallengeRankingById(this.challenge.id, this.saveData)
    );
    this.setState({
      score: this.props.navigation.state.params.score
    });
  }

  endList = (activeSelectable, number) => {
    if (activeSelectable == "friend") {
      return (
        <Aux>
          <InviteItem
            infoProfile={this.props.infoProfile}
            navigation={this.props.navigation}
            Points={0}
          />
          <View
            style={{
              paddingTop: this.props.blockRanking
                ? Dimensions.get("window").height * 0.23 + 80
                : Dimensions.get("window").height * 0.23 + 80
            }}
          />
        </Aux>
      );
    } else if (activeSelectable == "city") {
      return (
        <Aux>
          <InviteItem
            infoProfile={this.props.infoProfile}
            navigation={this.props.navigation}
            Points={0}
            description={
              number > 3
                ? "invite_your_fri"
                : "Invite at least 3 friends to activate the Weekly Challenge"
            }
          />
          <View
            style={{
              paddingTop: this.props.blockRanking
                ? Dimensions.get("window").height * 0.23 + 80
                : Dimensions.get("window").height * 0.23 + 80
            }}
          />
        </Aux>
      );
    } else
      return (
        <View
          style={{
            height: 200,
            width: Dimensions.get("window").width * 0.8
          }}
        />
      );
  };

  renderScrollLeaderboard() {
    this.displayStandings = true;

    let dataSource = [],
      number = 0,
      position = 0,
      totPoints = 0,
      activeSelectable = this.props.standingsState.selectedLeaderboard,
      colorWave = "#3D3D3D",
      colorStar = "#fab21e",
      colorStarFirst = "#fab21e";

    dataSource = this.state.leaderboard;
    if (activeSelectable == "global") {
      // dataSource = this.props.standingsState.standing;
      position = this.props.standingsState.infoUserGlobalClassification.index;
      totPoints = this.props.standingsState.infoUserGlobalClassification.points;
      number = this.props.standingsState.standing.length;
    }

    return dataSource.map((item, rowID) => {
      const row = parseInt(rowID) + 1;
      if (row === 1) {
        return (
          <Aux key={rowID}>
            {
              // aggiungo delo spazio in piu sopra cosi sotto l'onda ho lo stesso colore del primo partecipante
              <View
                key={0}
                style={{
                  height: 15,
                  backgroundColor: "#F7F8F9"
                }}
              />
            }
            <UserItem
              navigation={this.props.navigation}
              myProfile={this.myProfile}
              user={{
                ...item,
                position: row,
                id: this.props.infoProfile.user_id
              }}
              rowID={rowID}
              level={item.referred_route__user__level__name}
              modalType={
                item.referred_route__user__role
                  ? item.referred_route__user__role === "none" ||
                    item.referred_route__user__role === "muver"
                    ? 0
                    : parseInt(item.referred_route__user__role)
                  : 0
              }
              activeSelectable={this.props.activeSelectable}
              blockRanking={number > 3 ? this.props.blockRanking : false}
              community={item.referred_route__user__community__name}
              city={
                activeSelectable != "city"
                  ? item.referred_route__user__city__city_name
                  : ""
              }
              colorStar={colorStar}
            />
            {number === row ? this.endList(activeSelectable) : <View />}
          </Aux>
        );
      } else if (number === row) {
        return (
          <Aux key={rowID}>
            <UserItem
              myProfile={this.myProfile}
              navigation={this.props.navigation}
              user={{
                ...item,
                position: row,
                id: this.props.infoProfile.user_id
              }}
              rowID={rowID}
              level={item.referred_route__user__level__name}
              modalType={
                item.referred_route__user__role
                  ? item.referred_route__user__role === "none" ||
                    item.referred_route__user__role === "muver"
                    ? 0
                    : parseInt(item.referred_route__user__role)
                  : 0
              }
              activeSelectable={this.props.activeSelectable}
              blockRanking={number > 3 ? this.props.blockRanking : false}
              community={item.referred_route__user__community__name}
              city={
                activeSelectable != "city"
                  ? item.referred_route__user__city__city_name
                  : ""
              }
              colorStar={colorStar}
            />
            {this.endList(activeSelectable, number)}
          </Aux>
        );
      } else {
        return (
          <UserItem
            myProfile={this.myProfile}
            navigation={this.props.navigation}
            user={{
              ...item,
              position: row,
              id: this.props.infoProfile.user_id
            }}
            rowID={rowID}
            level={item.referred_route__user__level__name}
            modalType={
              item.referred_route__user__role
                ? item.referred_route__user__role === "none" ||
                  item.referred_route__user__role === "muver"
                  ? 0
                  : parseInt(item.referred_route__user__role)
                : 0
            }
            activeSelectable={this.props.activeSelectable}
            blockRanking={number > 3 ? this.props.blockRanking : false}
            community={item.referred_route__user__community__name}
            city={
              activeSelectable != "city"
                ? item.referred_route__user__city__city_name
                : ""
            }
            colorStar={colorStar}
            key={rowID}
          />
        );
      }
    });
  }

  myProfile = () => {
    // this.props.dispatch(changeScreenProfile("myself"));
    this.props.navigation.navigate("Info");
  };

  renderMyself(
    totPoints = 0,
    colorStarFirst = "#fff",
    number = 0,
    activeSelectable = ""
  ) {
    return (
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.0, y: 1.0 }}
        locations={[0, 1.0]}
        colors={["#E82F73", "#F49658"]}
        style={{
          width: Dimensions.get("window").width,
          height: 112.5,
          backgroundColor: "#E33",
          // marginTop: Platform.OS === "android" ? 150 : 200,
          alignContent: "center",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 30
        }}
      >
        <UserItem
          myProfile={this.myProfile}
          navigation={this.props.navigation}
          currentUser={true}
          user={{
            username: this.props.infoProfile.username,
            avatar: this.props.infoProfile.avatar,
            id: this.props.infoProfile.id,
            points: this.state.score.points,
            position: this.state.score.position,
            referred_route__user__city_id: this.props.infoProfile.city
              ? this.props.infoProfile.city.id
                ? this.props.infoProfile.city.id
                : 0
              : 0
          }}
          // lo faccio piu piccolo dato che sopra metto il selettore per il periodo
          style={{ height: 85 }}
          level={this.props.level}
          fontColor={"#fff"}
          modalType={this.props.role}
          blockRanking={number > 3 ? this.props.blockRanking : false}
          activeSelectable={this.props.activeSelectable}
          community={
            this.props.infoProfile.community
              ? this.props.infoProfile.community.name
              : null
          }
          city={
            activeSelectable != "city"
              ? this.props.infoProfile.city
                ? this.props.infoProfile.city.city_name
                : ""
              : ""
          }
          colorStar={colorStarFirst}
        />
        <Image
          source={require("./../../assets/images/wave_challenge_classifica_top.png")}
          resizeMode={"contain"}
          style={styles.waveContainer}
        />
      </LinearGradient>
    );
  }

  onRefresh() {
    this.setState({ refresh: true });
    this.props.dispatch(
      getChallengeRankingById(this.challenge.id, this.saveData)
    );

    // const loading = setInterval(() => {
    //   this.setState({ refreshingFriend: false });
    //   clearTimeout(loading);
    // }, 1000);
  }

  renderActivityIndicator() {
    if (this.state.refresh) {
      return (
        <ActivityIndicator
          style={{
            alignContent: "center",
            flex: 1,
            paddingTop: 20,
            alignItems: "center",
            alignSelf: "center"
          }}
          size="large"
          color="#3D3D3D"
        />
      );
    } else return <View />;
  }

  render() {
    const color = "#fff";
    let colorStarFirst = "#fab21e",
      number = 0,
      activeSelectable = this.props.standingsState.selectedLeaderboard,
      totPoints = 0;

    if (activeSelectable == "global") {
      number = this.props.standingsState.standing.length;
      totPoints = this.props.standingsState.infoUserGlobalClassification.points;
      position = this.props.standingsState.infoUserGlobalClassification.index;
    }

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
    let leftText = this.state.scroll.interpolate({
      inputRange: [0, 300],
      outputRange: [0, 30],
      extrapolate: "clamp"
    });
    let topText = this.state.scroll.interpolate({
      inputRange: [0, 300],
      outputRange: [Platform.OS === "android" ? 150 : 200, 60],
      extrapolate: "clamp"
    });

    const index = 1;
    const level = 1;
    let colorWave = "#3D3D3D";

    return (
      <View style={styles.mainContainer}>
        <Animated.ScrollView
          contentContainerStyle={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height + 400
          }}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scroll } } }
          ])}
          scrollEventThrottle={16}
          scrollEnabled={this.state.scrollEnabled}
          refreshControl={
            <RefreshControl
              // refreshing={this.state.refresh}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
        >
          <View
            style={{
              backgroundColor: "#F7F8F9",
              marginTop: Platform.OS === "android" ? 150 : 200,
              width: Dimensions.get("window").width,
              alignContent: "center",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            {/* 
            <WavyArea
              data={negativeData}
              color={colorWave}
              style={styles.overlayWave}
            />
            */}
            {this.renderMyself(
              totPoints,
              colorStarFirst,
              number,
              activeSelectable
            )}
            {this.renderScrollLeaderboard()}
            {this.renderActivityIndicator()}
          </View>
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
            overflow: "hidden",
            height: Platform.OS === "android" ? 150 : 200,
            transform: [{ translateY: headerHeight }]
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width,
              overflow: "hidden",
              height: Platform.OS === "android" ? 150 : 200
            }}
          >
            <Animated.View
              style={{
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
                  width:
                    Platform.OS === "android"
                      ? 60 * 3.95833333
                      : 80 * 3.95833333,
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
                    color: "#3d3d3d",
                    fontSize: 15,
                    fontStyle: "normal",
                    transform: [{ translateX: leftText }]
                  }}
                >
                  {this.challenge.title}
                </Animated.Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.Image
          style={{
            width: Dimensions.get("window").width,
            height: 50,
            // top: 0,
            // left: 0,
            // right: 0,

            transform: [{ translateY: headerHeightWave }]
          }}
          resizeMode="stretch"
          source={images[0]}
        />

        <Animated.View
          style={{
            // top: Platform.OS === "android" ? 150 : 200,
            transform: [{ translateY: topText }],
            right: Dimensions.get("window").height * 0.075 - 25,
            position: "absolute"
          }}
        >
          <OwnIcon
            name="challenges_icn_active"
            size={25}
            color={"#E82F73"}
            // click={() => {
            //   this.props.navigation.navigate("LeaderboardChallengeScreen");
            // }}
          />
        </Animated.View>
      </View>
    );
  }
}

const images = {
  // 1: require("../../assets/images/wawe_mobility_habits_light_blue.png"),
  // 4: require("../../assets/images/wave_trainings_pink.png"),
  // 2: require("../../assets/images/wawe_mobility_habits_pink.png"),
  // 3: require("../../assets/images/wawe_mobility_habits_green.png"),
  0: require("../../assets/images/wave_challenge.png")
  // 0: require("../../assets/images/wave_trainings_yellow.png")
};

export const master = {
  0: require("../../assets/images/trainings/training_master_special.png"),
  // 1: require("../../assets/images/trainings/training_master_newbie.png"),
  1: require("../../assets/images/challenge_eni_prima.png"),
  2: require("../../assets/images/trainings/training_master_rookie.png"),
  3: require("../../assets/images/trainings/training_master_pro.png"),
  4: require("../../assets/images/trainings/training_master_star.png")
};

styleStandings = {
  mainContainer: {
    flex: 1,
    backgroundColor: "#F7F8F9"
  },
  selectableHeader: {
    height: Dimensions.get("window").height * 0.06,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around"
  },
  notSelectable: {
    flex: 1,
    marginHorizontal: 6
  },
  selectable: {
    marginHorizontal: 6,
    borderBottomColor: "#9D9B9C",
    borderBottomWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: 35,
    width: Dimensions.get("window").width * 0.25
  },
  selectableTouchable: {
    justifyContent: "center",
    alignItems: "center"
  },
  selectableContainer: {
    height: 35,
    width: Dimensions.get("window").width * 0.2,
    justifyContent: "center",
    alignItems: "center"
  },
  selectableLabel: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3D3D3D",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center"
  },
  overlayWave: {
    height: 140,
    width: Dimensions.get("window").width,
    position: "absolute"
    // top: Dimensions.get("window").height * 0.04 + 14
  },
  containerList: {},
  userContainer: {
    width: Dimensions.get("window").width,
    height: 110,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  firstUser: {
    position: "absolute"
    // top: Dimensions.get("window").height * 0.04 + 10
  },
  challengesList: {
    top: Dimensions.get("window").height * 0.04 + 95 - 30,
    height: Dimensions.get("window").height - 230 + 90
  }
};

const styles = StyleSheet.create({
  ...styleStandings,
  mainContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height + 150,
    backgroundColor: "#F7F8F9"
  },
  headerContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.3,
    backgroundColor: "#aabb3380"
  },
  verticalText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3d3d3d",
    fontSize: 12
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
  rewardText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#fff",
    fontSize: 13
  },
  rewardInfoText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 15,
    marginHorizontal: 7
  },
  infoRegularText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 12
  },
  waveContainer: {
    // width: Dimensions.get("window").width,
    // height: Dimensions.get("window").width / 9.52
    width: Dimensions.get("window").width * 2,
    height: 50
  }
});

const getProfile = state => state.login.infoProfile;
const getProfileNotSave = state => state.login.infoProfileNotSave;
const getProfileState = createSelector(
  [getProfile, getProfileNotSave],
  (infoProfile, infoProfileNotSave) => {
    return {
      ...infoProfile,
      ...infoProfileNotSave
    };
  }
);
const getStandings = state => state.standings;
const getStandingsState = createSelector(
  [getStandings],
  StandingsState => StandingsState
);
const getLevel = state => state.trainings.name;
const getLevelState = createSelector([getLevel], level =>
  level ? level : "Newbie"
);
const getRole = state => state.login.role;
const getRoleState = createSelector([getRole], role =>
  role.roleUser ? (role.roleUser ? role.roleUser : 0) : 0
);
/* 
state.statistics.reduce(
  (acc, item) => (acc > item.points ? acc : item.points),
  0 ) 
*/
// modal_type
const withConnect = connect(state => {
  return {
    standingsState: getStandingsState(state),
    infoProfile: getProfileState(state),
    level: getLevelState(state),
    role: getRoleState(state),
    followed: getFollowedState(state)
  };
});

export default withConnect(LeaderboardChallengeScreen);

// export default LeaderboardChallengeScreen;
