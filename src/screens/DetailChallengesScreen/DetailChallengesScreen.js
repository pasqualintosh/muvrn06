import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  TouchableWithoutFeedback,
  Image
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import {
  postSubscribeChallenge,
  getChallengeRankingById,
  getChallenges,
  getChallengeRankingByUser,
  getChallengesAllowed,
  getChallengesRewards
} from "./../../domains/challenges/ActionCreators";
import { strings } from "../../config/i18n";
import Aux from "../../helpers/Aux";

const SCREEN_WIDTH = Dimensions.get("window").width;
class DetailChallengesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollEnabled: true,
      scroll: new Animated.Value(0),
      day_until_end_date: false,
      hour_until_end_date: false,
      minute_until_end_date: false,
      day_until_start_date: false,
      hour_until_start_date: false,
      minute_until_start_date: false,
      rewards_map: [],
      score: {
        points: 0,
        challenge: null,
        username: null,
        avatar: null,
        position: null
      },
      leaderboard: [],
      showSlideBtn: true
    };
    this.challenge = null;
  }

  saveData = data => {
    this.setState({
      leaderboard: [...data.results]
    });
  };

  getLevelFromInt(level) {
    switch (level) {
      case 1:
        return "NEWBIE";
        break;

      case 2:
        return "ROOKIE";
        break;
      case 3:
        return "PRO";
        break;
      case 4:
        return "STAR";
        break;

      default:
        return "NEWBIE";
        break;
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      rewards_map: [...nextProps.availableRewardsState]
    });
  }

  componentWillMount() {
    this.challenge = this.props.navigation.state.params.challenge;
    this.props.dispatch(
      getChallengeRankingById(this.challenge.id, this.saveData)
    );
    this.props.dispatch(getChallengesRewards());

    if (this.props.activeChallengesState.length > 0) {
      this.setState({
        score: this.props.activeChallengesState.filter(e => {
          return e.challenge == this.challenge.id;
        })[0]
      });
    }

    let today = new Date();

    let e_msec = new Date(this.challenge.end_time) - today;
    let e_mins = Math.floor(e_msec / 60000);
    let e_hrs = Math.floor(e_mins / 60);
    let e_a_mins = Math.floor(e_msec / 60000) - e_hrs * 60;
    let e_days = Math.floor(e_hrs / 24);
    let e_a_hrs = e_hrs - e_days * 24;

    this.setState(
      {
        day_until_end_date: e_days,
        hour_until_end_date: e_a_hrs,
        minute_until_end_date: e_a_mins,
        rewards_map: [...this.props.availableRewardsState]
      },
      () => {
        let t = new Date(),
          start_signin_time = new Date(this.challenge.start_signin_time),
          start_time = new Date(this.challenge.start_time);

        let e_msec = start_time - t;
        let e_mins = Math.floor(e_msec / 60000);
        let e_hrs = Math.floor(e_mins / 60);
        let e_days = Math.floor(e_hrs / 24);
        let e_a_hrs = e_hrs - e_days * 24;
        let e_a_mins = Math.floor(e_msec / 60000) - e_hrs * 60;

        this.setState({
          day_until_start_date: e_days,
          hour_until_start_date: e_a_hrs,
          minute_until_start_date: e_a_mins
        });

        setInterval(() => {
          this.decrementEndTimer();
        }, 1000 * 60);
      }
    );

    if (e_hrs < 0) {
      this.setState({ special_training_expired: true });
    }
  }

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

  back = () => {
    this.props.navigation.goBack();
  };

  renderEndCounter() {
    // if (
    //   (this.state.hour_until_end_date || this.state.minute_until_end_date) &&
    //   this.state.hour_until_end_date > 0
    // ) {
    if (this.challenge.active && !this.challenge.waiting) {
      let days_string =
        Number.parseInt(this.state.day_until_end_date) > 1
          ? strings("id_4_02")
          : strings("id_4_03");

      let hours_string =
        Number.parseInt(this.state.hour_until_end_date) > 1
          ? strings("id_4_04")
          : strings("id_4_05");
      return (
        <View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#EB2F74",
              // borderTopWidth: 1,
              // borderTopColor: "#EB2F74",
              // justifyContent: "center",
              // alignItems: "center",
              // alignSelf: "center",
              width: Dimensions.get("window").width * 0.9,
              height: 1
            }}
          />
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 0.0, y: 1.0 }}
            locations={[0, 1.0]}
            colors={["#E82F73", "#F49658"]}
            style={{
              width: Dimensions.get("window").width * 0.4,
              height: 30,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center"
              // paddingHorizontal: 20
            }}
          >
            <OwnIcon name="timer_icn" size={18} color="#FFF" />
            <Text style={styles.startCounterText}>
              - {this.state.day_until_end_date}
              {" " + days_string + " " + strings("id_4_09") + " "}
              {this.state.hour_until_end_date}
              {" " + hours_string}
            </Text>
          </LinearGradient>
        </View>
      );
    }
  }

  renderSessionWhat() {
    return (
      <View
        style={{
          paddingBottom: 10,
          paddingTop: 10,
          // borderBottomWidth: 1,
          // borderBottomColor: "#EB2F74",
          borderTopWidth: 1,
          borderTopColor: "#EB2F74",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center"
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width * 0.9,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center"
            // height: 60,
            // minHeight: 60,
          }}
        >
          <View
            style={{
              // width: 50,
              // height: 40,
              // position: "absolute",
              // left: 0,
              // top: 15,
              justifyContent: "center",
              alignItems: "flex-end",
              alignSelf: "center",
              transform: [{ rotate: "-90deg" }]
            }}
          >
            <Text style={styles.verticalText}>
              {strings("id_3_05").toUpperCase()}
            </Text>
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
            <Text style={styles.verticalText}>
              {strings("id_3_05").toUpperCase()}
            </Text>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.9 - 60,
              marginLeft: 5,
              marginRight: 5,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              flexDirection: "row",
              left: -40
            }}
          >
            <Text style={styles.texWhatSession}>
              {this.challenge.description}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  renderSessionWhen() {
    if (!this.challenge.active || this.challenge.waiting)
      return (
        <View
          style={{
            paddingBottom: 10,
            paddingTop: 10,
            // borderBottomWidth: 1,
            // borderBottomColor: "#EB2F74",
            borderTopWidth: 1,
            borderTopColor: "#EB2F74",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.9,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center"
              // height: 60,
              // minHeight: 60,
            }}
          >
            <View
              style={{
                // width: 50,
                // height: 40,
                // position: "absolute",
                // left: 0,
                // top: 15,
                justifyContent: "center",
                alignItems: "flex-end",
                alignSelf: "center",
                transform: [{ rotate: "-90deg" }]
              }}
            >
              <Text style={styles.verticalText}>
                {strings("id_3_06").toUpperCase()}
              </Text>
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
              <Text style={styles.verticalText}>
                {strings("id_3_06").toUpperCase()}
              </Text>
            </View>
            <View
              style={{
                width: Dimensions.get("window").width * 0.9 - 60,
                marginLeft: 5,
                marginRight: 5,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                flexDirection: "row",
                left: -40
              }}
            >
              <View
                style={{
                  width: Dimensions.get("window").width * 0.45 - 30,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  alignContent: "center"
                }}
              >
                <Image
                  source={require("../../assets/images/date_start.png")}
                  style={{ width: 25, height: 25 }}
                />
                <Text style={styles.whenRegularText}>
                  {moment(this.challenge.start_time).format("ll")}
                </Text>
                <Text style={styles.whenRegularText}>
                  {moment(this.challenge.start_time).format("LT")}
                </Text>
              </View>
              <View
                style={{
                  width: Dimensions.get("window").width * 0.45 - 30,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  alignContent: "center"
                }}
              >
                <Image
                  source={require("../../assets/images/date_end.png")}
                  style={{ width: 25, height: 25 }}
                />
                <Text style={styles.whenRegularText}>
                  {moment(this.challenge.end_time).format("ll")}
                </Text>
                <Text style={styles.whenRegularText}>
                  {moment(this.challenge.end_time).format("LT")}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    else return <View />;
  }

  renderSessionInfoFirstRow() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.9 - 60,
          marginLeft: 5,
          marginRight: 5,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          flexDirection: "row",
          left: -40
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width * 0.45 - 30,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            alignContent: "center"
          }}
        >
          <Text style={styles.infoRegularText}>{strings("id_3_11")}</Text>
          <Text style={styles.infoBoldText}>
            {Number.parseInt(this.challenge.rewards_number)}
            {/* {"da aggiungere"} */}
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
            alignItems: "center",
            flexDirection: "column",
            alignContent: "center"
          }}
        >
          <Text style={styles.infoRegularText}>{strings("id_3_18")}</Text>
          <Text style={styles.infoBoldText}>
            {this.challenge.target_all ? "∞" : "∞"}
          </Text>
        </View>
      </View>
    );
  }

  renderSessionInfoCoin() {
    if (this.challenge.access_payment) {
      return (
        <View
          style={{
            width: Dimensions.get("window").width * 0.45 - 30,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            alignContent: "center"
          }}
        >
          <Text style={styles.infoRegularText}>{strings("id_3_19")}</Text>
          <Text style={styles.infoBoldText}>
            {this.challenge.access_payment ? this.challenge.access_payment : 0}
          </Text>
        </View>
      );
    } else {
      return <View />;
    }
  }

  renderSessionInfoAccessCode() {
    if (this.challenge.access_code) {
      return (
        <View
          style={{
            width: Dimensions.get("window").width * 0.45 - 30,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            alignContent: "center"
          }}
        >
          <Text style={styles.infoRegularText}>{strings("id_3_20")}</Text>
          <Text style={styles.infoBoldText}>
            {this.challenge.access_code ? "???" : strings("id_14_04")}
          </Text>
        </View>
      );
    } else return <View />;
  }

  renderSessionInfoSecondRow() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.9 - 60,
          marginLeft: 5,
          marginRight: 5,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          flexDirection: "row",
          left: -40,
          marginTop: 5
        }}
      >
        {this.renderSessionInfoCoin()}
        {this.renderSessionInfoAccessCode()}
      </View>
    );
  }

  renderSessionInfo() {
    if (!this.challenge.active || this.challenge.waiting)
      return (
        <View
          style={{
            paddingBottom: 10,
            paddingTop: 10,
            // borderBottomWidth: 1,
            // borderBottomColor: "#EB2F74",
            borderTopWidth: 1,
            borderTopColor: "#EB2F74",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.9,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center"
              // height: 60,
              // minHeight: 60,
            }}
          >
            <View
              style={{
                // width: 50,
                // height: 40,
                // position: "absolute",
                // left: 0,
                // top: 15,
                justifyContent: "center",
                alignItems: "flex-end",
                alignSelf: "center",
                transform: [{ rotate: "-90deg" }]
              }}
            >
              <Text style={styles.verticalText}>
                {strings("id_3_07").toUpperCase()}
              </Text>
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
              <Text style={styles.verticalText}>
                {strings("id_3_07").toUpperCase()}
              </Text>
            </View>
            <View>
              {this.renderSessionInfoFirstRow()}
              {this.renderSessionInfoSecondRow()}
            </View>
          </View>
        </View>
      );
    else return <View />;
  }

  renderSponsor() {
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
          // onPress={() => this.showDescriptionIconModalSponsor()}
          >
            <View>
              <View>
                <Text
                  style={[
                    styles.textDescriptionSession,
                    { textAlign: "center" }
                  ]}
                >
                  {strings("id_3_04")}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
          // onPress={() => this.showDescriptionIconModalSponsor()}
          >
            <View>
              <View>
                <Text
                  style={[
                    styles.textDescriptionNameSponsor,
                    { textAlign: "center", fontWeight: "bold" }
                  ]}
                >
                  {this.challenge.sponsor}
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

  renderSessionReward() {
    return (
      <TouchableWithoutFeedback onPress={() => {}}>
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
              width: Dimensions.get("window").width * 0.3,
              height: 20,
              backgroundColor: "#E82F73",
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={styles.rewardText}>{strings("id_3_08")}</Text>
          </View>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 0.0, y: 1.0 }}
            locations={[0, 1.0]}
            colors={["#E82F73", "#F49658"]}
            style={{
              width: Dimensions.get("window").width * 0.9,
              height: 150,
              borderTopRightRadius: 5,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
              // flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
              // paddingHorizontal: 20
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
                width: Dimensions.get("window").width * 0.9
              }}
            >
              <View
                style={{
                  // width: 50, height: 50
                  flex: 0.35,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Image
                  source={require("../../assets/images/rewards/subscriptions.png")}
                  style={{ width: 60, height: 60 }}
                />
              </View>
              <View
                style={{
                  flex: 0.7,
                  // minHeight: 50,
                  justifyContent: "center",
                  alignItems: "flex-start"
                }}
              >
                <Text style={styles.rewardInfoText}>
                  {this.getRewardName()}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  getRewardName() {
    if (this.challenge.rewards.length > 1) {
      // return this.challenge.rewards.map((e, i) => (
      //   <Text key={i} style={styles.rewardInfoText}>
      //     {this.state.rewards_map.filter(el => el.id == e)[0].name}
      //   </Text>
      // ));
      let reward = this.state.rewards_map.filter(
        e => e.id == this.challenge.rewards[0]
      )[0];
      return reward.name ? reward.name : "";
    } else {
      let reward = this.state.rewards_map.filter(
        e => e.id == this.challenge.rewards[0]
      )[0];
      return reward.name ? reward.name : "";
    }
  }

  hideSlideBtn = () => {
    this.props.dispatch(getChallengeRankingByUser());
    this.props.dispatch(getChallenges());
    this.props.dispatch(getChallengesAllowed());

    this.setState({ showSlideBtn: false }, () => {
      this.props.navigation.navigate("TrainingsScreen");
    });
  };

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
              {Number.parseInt(this.state.day_until_start_date)}
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
                  {this.state.hour_until_start_date
                    ? this.state.hour_until_start_date +
                      " " +
                      hours_txt +
                      " " +
                      strings("id_4_09") +
                      " "
                    : ""}
                  {this.state.minute_until_start_date}
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
            <Text style={styles.countdownTxt}>{" " + strings("id_3_23")}</Text>
          </View>
        )}
      </View>
    );
  };

  renderSlideBtn() {
    let t = new Date(),
      start_signin_time = new Date(this.challenge.start_signin_time),
      start_time = new Date(this.challenge.start_time);

    let e_msec = start_time - t;
    let e_mins = Math.floor(e_msec / 60000);
    let e_hrs = Math.floor(e_mins / 60);
    let e_days = Math.floor(e_hrs / 24);
    let e_a_hrs = e_hrs - e_days * 24;
    let e_a_mins = Math.floor(e_msec / 60000) - e_hrs * 60;

    if (!this.challenge.active && this.state.showSlideBtn)
      return (
        <View style={slide_btn_styles.container}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.dispatch(
                postSubscribeChallenge(this.challenge.id, this.hideSlideBtn)
              );
              // this.props.navigation.navigate("LeaderboardChallengeScreen", {
              //   challenge: this.challenge,
              //   score: this.state.score
              // });
            }}
          >
            <LinearGradient
              start={{ x: 0.0, y: 0.0 }}
              end={{ x: 1.0, y: 0.0 }}
              locations={[0, 1.0]}
              colors={["#E82F73", "#F49658"]}
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
                  {strings("id_3_10")}
                </Text>
              </View>
            </LinearGradient>
          </TouchableWithoutFeedback>
        </View>
      );
    else if (this.challenge.waiting) {
      let days_txt = e_days > 1 ? strings("id_4_03") : strings("id_4_02"),
        hours_txt = e_hrs > 1 ? strings("id_4_05") : strings("id_4_04"),
        min_txt = e_mins > 1 ? strings("id_4_07") : strings("id_4_06"),
        checkDay = e_days > 0;

      return this.getCountdownTxt(days_txt, hours_txt, min_txt, checkDay);
    } else return <View />;
  }

  renderRewardGradient() {
    console.log(this.challenge);
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 70
        }}
      >
        <View
          style={{
            shadowRadius: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            elevation: 2
          }}
        >
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 0.0, y: 1.0 }}
            locations={[0, 1.0]}
            colors={["#E82F73", "#F49658"]}
            style={{
              width: 60,
              height: 60,
              borderRadius: 60,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                width: 58,
                height: 58,
                borderRadius: 60,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text style={styles.subscriberRewardText}>
                {this.challenge.rewards_number}
              </Text>
            </View>
          </LinearGradient>
        </View>

        <Text style={styles.subscriberRewardBottomText}>
          {strings("id_3_11")}
        </Text>
      </View>
    );
  }

  renderSubscriberGradient() {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 70
        }}
      >
        <View
          style={{
            shadowRadius: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            elevation: 2
          }}
        >
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 0.0, y: 1.0 }}
            locations={[0, 1.0]}
            colors={["#E82F73", "#F49658"]}
            style={{
              width: 60,
              height: 60,
              borderRadius: 60,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                width: 58,
                height: 58,
                borderRadius: 60,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text style={styles.subscriberRewardText}>
                {this.state.leaderboard.length}
              </Text>
            </View>
          </LinearGradient>
        </View>
        <Text style={styles.subscriberRewardBottomText}>
          {strings("id_3_13")}
        </Text>
      </View>
    );
  }

  renderCompletionOrPosition() {
    if (this.challenge.type == 1) {
      // time-based
      return (
        <View>
          <Text style={styles.completionText}>
            {/* {this.state.score.points} */}
            {this.state.score.points}/{this.challenge.goal_time}
          </Text>
        </View>
      );
    } else if (this.challenge.type == 2) {
      // ranking-based
      return (
        <View>
          <Text style={styles.completionText}>
            {this.state.score.position}/{this.state.leaderboard.length}
            {/* {this.state.score.position} */}
          </Text>
        </View>
      );
    } else return <View />; // boh
  }

  renderCompletionOrPositionText() {
    if (this.challenge.type == 1) {
      // time-based
      return (
        <View>
          <Text style={styles.subscriberRewardBottomText}>
            {strings("id_3_12")}
          </Text>
        </View>
      );
    } else if (this.challenge.type == 2) {
      // ranking-based
      return (
        <View>
          <Text style={styles.subscriberRewardBottomText}>
            {strings("id_3_14")}
          </Text>
        </View>
      );
    } else return <View />; // boh
  }

  renderCompletionGradient() {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 110
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            // if (this.challenge.type != 1 && this.state.leaderboard.length > 1) {
            if (this.challenge.type == 2 && this.state.leaderboard.length > 1) {
              this.props.navigation.navigate("LeaderboardChallengeScreen", {
                challenge: this.challenge,
                score: this.state.score
              });
            }
          }}
        >
          <View>
            <View
              style={{
                shadowRadius: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                elevation: 2
              }}
            >
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1.0 }}
                locations={[0, 1.0]}
                colors={["#E82F73", "#F49658"]}
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 90,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    width: 104,
                    height: 104,
                    borderRadius: 90,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {/* <Text style={styles.completionText}>{this.challenge.completion}</Text> */}
                  {/* <Text style={styles.completionText}>{"da aggiungere"}</Text> */}
                  {/* <Text style={styles.completionText}> {this.state.score.points}/{this.challenge.counter_value}</Text> */}
                  {this.renderCompletionOrPosition()}
                </View>
              </LinearGradient>
            </View>
            {this.renderCompletionOrPositionText()}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderRewardsCompletionSubscribers() {
    if (this.challenge.active && !this.challenge.waiting)
      return (
        <View
          style={{
            width: Dimensions.get("window").width * 0.9,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            alignSelf: "center",
            marginTop: 50
          }}
        >
          {this.renderRewardGradient()}
          {this.renderCompletionGradient()}
          {this.renderSubscriberGradient()}
        </View>
      );
    else return <View />;
  }

  getUnderlinedSubStr(str, style, onPresses) {
    let result = str.split("%");

    return result.map((e, i) => {
      if (i % 2 == 0)
        return (
          <Text key={i} style={style}>
            {/* {e} */}
          </Text>
        );
      else
        return (
          <Text
            key={i}
            style={[style, { textDecorationLine: "underline" }]}
            onPress={onPresses[i]}
          >
            {e}
          </Text>
        );
    });
  }

  render() {
    const color = "#fff";

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

    return (
      <View style={styles.mainContainer}>
        <Animated.ScrollView
          contentContainerStyle={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height + 600
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
              width: Dimensions.get("window").width,
              alignContent: "center",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <View
              style={{
                height: 50,
                width: Dimensions.get("window").width,
                alignSelf: "center"
              }}
            />
            {this.renderSponsor()}
            {this.renderSessionWhat()}
            {this.renderSessionWhen()}
            {this.renderSessionInfo()}
            {this.renderEndCounter()}
            {this.renderRewardsCompletionSubscribers()}
            <View
              style={{
                height: 20,
                width: Dimensions.get("window").width * 0.9,
                alignSelf: "center",
                marginTop: 30
              }}
            />
            {this.renderSessionReward()}
            <View
              style={{
                height: 50,
                width: Dimensions.get("window").width,
                alignSelf: "center"
              }}
            />
            {this.renderSlideBtn()}
            <View
              style={{
                width: Dimensions.get("window").width * 0.8,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {/* <Text style={styles.rules}>{strings("id_3_09")}</Text> */}
              <Text>
                {this.getUnderlinedSubStr(strings("id_3_09"), styles.rules, {
                  // posizione testo clickabile
                  "1": () => {
                    this.props.navigation.navigate("ChallengeRulesScreen", {
                      challenge: this.challenge
                    });
                  }
                })}
              </Text>
            </View>
            <View
              style={{
                height: 400,
                width: Dimensions.get("window").width * 0.8
              }}
            />
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
                    // fontStyle: "normal",
                    color: "#3d3d3d",
                    fontSize: 15,
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

        {/* <View
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
        */}
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

const styles = StyleSheet.create({
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
  rules: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 12,
    textAlign: "center"
  },
  texWhatSession: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3D3D3D",
    fontSize: 12,
    alignContent: "center"
  },
  whenRegularText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 10,
    textAlign: "center"
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
  subscriberRewardBottomText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 12,
    textAlign: "center",
    paddingTop: 5
  },
  startCounterText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#fff",
    fontSize: 10
  },
  subscriberRewardText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3d3d3d",
    fontSize: 12
  },
  completionText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3d3d3d",
    fontSize: 14
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
    width: SCREEN_WIDTH * 0.6,
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

const getAvailableRewars = state => state.challenges.rewards_list;

const getActiveChallenges = state =>
  state.challenges.active_challenges ? state.challenges.active_challenges : [];

const getAvailableRewarsState = createSelector([getAvailableRewars], rewards =>
  rewards ? rewards : []
);

const getActiveChallengesState = createSelector(
  [getActiveChallenges],
  challenges => (challenges ? challenges : [])
);

const withData = connect(state => {
  return {
    availableRewardsState: getAvailableRewarsState(state),
    activeChallengesState: getActiveChallengesState(state)
  };
});

export default withData(DetailChallengesScreen);

// export default DetailChallengesScreen;
