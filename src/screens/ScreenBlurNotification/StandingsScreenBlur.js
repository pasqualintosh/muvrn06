import React from "react";
import {
  View,
  Text,
  Platform,
  findNodeHandle,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  NativeModules,
  Image
} from "react-native";
import Aux from "../../helpers/Aux";
import Blur from "../../components/Blur/Blur";
import NotificationPoint from "./../../components/NotificationPoint/NotificationPoint";
import StandingsScreen from "../StandingsScreen/StandingsScreen";
import Settings from "./../../config/Settings";

// import { Analytics, Hits as GAHits } from "react-native-google-analytics";
import Icon from "react-native-vector-icons/Ionicons";
import ModalDropdown from "react-native-modal-dropdown";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import { connect } from "react-redux";
import {
  setLeaderboardSelected,
  setLeaderboardTiming,
  getLeaderboard,
  getMonthlyLeaderboard,
  getWeeklyLeaderboard,
  getLeaderboardByCity,
  getMonthlyLeaderboardByCity,
  getWeeklyLeaderboardByCity,
  getWeeklyLeaderboardByCommunity,
  getWeeklyFriendLeaderboard,
  getTrophiesNew,
  getNextSunday,
  getWeeklyLeaderboardNew,
  getSpecificPositionNew
} from "./../../domains/standings/ActionCreators";

import { getFollowingUser } from "./../../domains/follow/ActionCreators";

import LinearGradient from "react-native-linear-gradient";
import { createSelector } from "reselect";

import DescriptionIcon from "../../components/DescriptionIcon/DescriptionIcon";

import { strings } from "../../config/i18n";
import IconMenuDrawer from "./../../components/IconMenuDrawer/IconMenuDrawer";

import CommunityStandingsScreen from "../CommunityStandingsScreen/CommunityStandingsScreen";

import { addPageCounted } from "./../../domains/login/ActionCreators";

import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from "react-native-google-analytics-bridge";

let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);

const EndGMTTournament = 17;

import analytics from "@react-native-firebase/analytics";
async function trackScreenView(screen) {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
}

class StandingsScreenBlur extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewRef: null,
      showPicker: false,
      language: null,
      activeSelectable: "city",
      blockRanking: this.blockRanking(),
      time: 0,
      modalActive: false,
      iconChoose: "round_info_icn",

      // selectedTime: this.props.standingsState.selectedTiming
      //   ? this.props.standingsState.selectedTiming
      //   : "overall", // overall || monthly || weekly
      // index: this.props.standingsState.indexTiming
      //   ? this.props.standingsState.indexTiming
      //   : 0
      selectedTime: "weekly", // overall || monthly || weekly
      friends: false,
      index: "0",
      days_until_end_date: false,
      hour_until_end_date: false,
      minute_until_end_date: false
    };
  }

  DescriptionIconModal = typeIcon => {
    // Alert.alert("weather");
    this.setState({
      modalActive: true,
      iconChoose: typeIcon
    });
  };

  DeleteDescriptionIconModal = () => {
    // Alert.alert("weather");
    this.setState({
      modalActive: false
    });
  };

  updateCurrentTime() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    const DifferenceMinutesUTC = now.getTimezoneOffset() / 60; // in italia da -60 quindi divido per 60 per avere meno -1

    // tolgo il check sulla data per il freeze della classifica dato che ho il timer avviato
    if (this.timer) clearTimeout(this.timer);
    console.log(hour);

    // se sono le 18 passate
    // il timer è 10 ore quindi 6 ore alle 12 e 4
    let seconds = 0;
    if (hour >= EndGMTTournament - DifferenceMinutesUTC) {
      seconds =
        10 * 3600 -
        ((hour - (EndGMTTournament - DifferenceMinutesUTC)) * 3600 +
          minute * 60 +
          second);
    } else {
      // sono prima delle 6
      seconds =
        (3 - DifferenceMinutesUTC) * 3600 -
        (hour * 3600 + minute * 60 + second);
    }
    // se i secondi ci sono allora li salvo e visualizzo
    console.log(seconds);
    if (seconds) {
      this.setState({ time: seconds });
      this.timeoutId = setTimeout(this.updateCurrentTime.bind(this), 1000);
    } else {
      // altrimenti l'attesa e conclusa
      this.setState({ time: seconds, blockRanking: false });
      // ricarico i dati
      this.props.dispatch(getWeeklyLeaderboardNew());
      this.props.dispatch(getWeeklyLeaderboardByCity());
    }

    // come test

    /* if (parseInt(second / 30) === 0) {
      this.setState({
        blockRanking: false
      });
    } */
  }

  // per sapere se devo bloccare la classifica
  blockRanking = () => {
    const now = new Date();
    const DifferenceMinutesUTC = now.getTimezoneOffset() / 60; // in italia da -60 quindi divido per 60 per avere meno -1
    console.log(DifferenceMinutesUTC);

    // cosi è disabilitato
    // return false;

    // se è domenica e sono le 18 minimo
    // oppure lunedi prima delle 6
    // 0 è domenica oppure se è lunedi fino alle 6
    if (
      now.getDay() === 0 &&
      now.getHours() >= EndGMTTournament - DifferenceMinutesUTC
    ) {
      this.props.dispatch(getTrophiesNew());
      if (!this.timeoutId) {
        this.updateCurrentTime();
      }

      return true;
    } else if (
      now.getDay() === 1 &&
      now.getHours() < 3 - DifferenceMinutesUTC
    ) {
      this.props.dispatch(getTrophiesNew());
      if (!this.timeoutId) {
        this.updateCurrentTime();
      }
      return true;
    } /* else if (
      now.getDay() === 2 &&
      now.getHours() > 8 - DifferenceMinutesUTC
    ) {
      return true;
    } */ else {
      return false;
    }
  };

  checkBlockRanking = () => {
    const now = new Date();
    console.log("check orario " + now.toUTCString());

    const DifferenceMinutesUTC = now.getTimezoneOffset() / 60; // in italia da -60 quindi divido per 60 per avere -1
    console.log(DifferenceMinutesUTC);

    // se è domenica e sono le 18 minimo
    // oppure lunedi prima delle 6
    // 0 è domenica oppure se è lunedi fino alle 6
    if (
      now.getDay() === 0 &&
      now.getHours() >= EndGMTTournament - DifferenceMinutesUTC
    ) {
      this.setState({
        blockRanking: true
      });
      this.props.dispatch(getTrophiesNew());
      if (!this.timeoutId) {
        this.updateCurrentTime();
      }
    } else if (
      now.getDay() === 1 &&
      now.getHours() < 3 - DifferenceMinutesUTC
    ) {
      this.props.dispatch(getTrophiesNew());
      this.setState({
        blockRanking: true
      });
      if (!this.timeoutId) {
        this.updateCurrentTime();
      }
    } /* else if (
      now.getDay() === 2 &&
      now.getHours() > 8 - DifferenceMinutesUTC
    ) {
      this.props.dispatch(getTrophiesNew());
      this.setState({
        blockRanking: true
      });
      if (!this.timeoutId) {
        this.updateCurrentTime();
      }
    } */
    return true;
  };

  componentWillMount() {

  }

  static navigationOptions = ({ navigation, screenProps }) => ({
    headerTitle: navigation.state.params
      ? navigation.state.params.headerTitle
      : null,
    headerRight: navigation.state.params
      ? navigation.state.params.headerRight
      : null
  });

  componentWillReceiveProps(nextProps) {
    // this.props.navigation.setOptions({
    //   headerTitle: nextProps.navigation.state.params.Challenges
    // });
    this.setState({
      selectedTime: nextProps.standingsState.selectedTiming,
      index: nextProps.standingsState.indexTiming
    });

    this.updateCounterEndChallenge();
  }

  timer = null;
  timeoutId = null;

  componentWillUnmount() {
    // tolgo il check sulla data per il freeze della classifica
    if (this.timer) clearTimeout(this.timer);
    // tolgo il timeout relativo allo scadere del tempo
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  repeatCheck = () => {
    this.timer = setInterval(() => this.checkBlockRanking(), 60000);
  };

  updateCounterEndChallenge() {
    let nxtSunday = new Date(getNextSunday());
    nxtSunday.setUTCHours(EndGMTTournament);
    nxtSunday.setMinutes(0);
    console.log(nxtSunday);

    let today = new Date();

    let e_msec = nxtSunday - today;
    console.log(e_msec);
    let e_mins = Math.floor(e_msec / 60000);
    let e_hrs = Math.floor(e_mins / 60);
    let e_days = Math.floor(e_hrs / 24);
    let e_a_hrs = e_hrs - e_days * 24;
    let e_a_mins = Math.floor(e_msec / 60000) - e_hrs * 60;
    console.log(e_a_mins);

    if (e_days > 0 || e_hrs > 0 || e_a_mins > 0)
      this.setState({
        days_until_end_date: e_days,
        hour_until_end_date: e_a_hrs,
        minute_until_end_date: e_a_mins
      });
  }

  componentDidMount() {
    let nxtSunday = new Date(getNextSunday());
    nxtSunday.setUTCHours(EndGMTTournament);
    nxtSunday.setMinutes(0);
    console.log(nxtSunday);

    let today = new Date();

    let e_msec = nxtSunday - today;
    console.log(e_msec);
    let e_mins = Math.floor(e_msec / 60000);
    let e_hrs = Math.floor(e_mins / 60);
    let e_days = Math.floor(e_hrs / 24);
    let e_a_hrs = e_hrs - e_days * 24;
    let e_a_mins = Math.floor(e_msec / 60000) - e_hrs * 60;
    console.log(e_a_mins);

    if (e_days > 0 || e_hrs > 0 || e_a_mins > 0)
      this.setState({
        days_until_end_date: e_days,
        hour_until_end_date: e_a_hrs,
        minute_until_end_date: e_a_mins
      });

    // quando ho caricato il componente, posso dire a blur che è possibile fare il blur usando questa variabile
    this.setState({ viewRef: findNodeHandle(this.view) });
    console.log(this.state.index);

    // const now = new Date();
    // cosi è disabilitato
    // return false;

    // se è domenica
    // oppure lunedi
    // test || now.getDay() === 2
    /* if (now.getDay() === 0 || now.getDay() === 1) {
      if (!this.timeoutId && !this.time) {
        console.log("check timer");
        const seconds = now.getSeconds();
        // ogni minuti controllo e lo faccio partire il minuto successivo
        setTimeout(() => this.repeatCheck(), (60 - seconds) * 1000);
      }
    } */

    // Set route params
    this.props.navigation.setParams({
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {/* 
          {this.state.activeSelectable.charAt(0).toUpperCase()}
          {this.state.activeSelectable.slice(1)}
          {" Ranking"} 
          */}
          {strings("id_4_01")}
        </Text>
      )
    });

    this.addTrackerGA();

    getSpecificPositionNew();

    if (this.props.selectedLeaderboard === "city") {
      this.props.dispatch(getWeeklyLeaderboardByCity());
    } else if (this.props.selectedLeaderboard === "global") {
      this.props.dispatch(getWeeklyLeaderboardNew());
    } else if (this.props.selectedLeaderboard === "friend") {
      this.props.dispatch(getWeeklyFriendLeaderboard());
      this.props.dispatch(getFollowingUser());
    } else if (this.props.selectedLeaderboard == "community") {
      this.props.dispatch(getWeeklyLeaderboardByCommunity());
    } else {
      this.props.dispatch(getWeeklyLeaderboardNew());
      // this.props.dispatch(getWeeklyLeaderboardByCity());
    }
  }

  static navigationOptions = props => ({
    headerTitle: (
      <Text
        style={{
          left: Platform.OS == "android" ? 20 : 0
        }}
      >
        {strings("id_4_01")}
      </Text>
    ),
    headerLeft: null,
    headerRight: <IconMenuDrawer navigation={props.navigation} />
  });

  addTrackerGA() {
    // if (this.props.sessionTokenState) {
    //   console.log("SESSION TOKEN");
    //   console.log(new Date(this.props.sessionTokenState.expired_date));
    //   if (new Date() > new Date(this.props.sessionTokenState.expired_date)) {
    //     console.log("token scaduto");
    //   } else {
    //     console.log("token non scaduto");
    //     if (this.props.sessionTokenState.pages) {
    //       if (
    //         !this.props.sessionTokenState.pages.includes(
    //           "StandingsScreenBlur.js - " + this.state.selectedTime
    //         )
    //       ) {
    //         console.log("ADD");
    //         this.props.dispatch(
    //           addPageCounted(
    //             "StandingsScreenBlur.js - " + this.state.selectedTime
    //           )
    //         );
    //         Tracker.trackScreenView(
    //           "SESSION: StandingsScreenBlur.js - " + this.state.selectedTime
    //         );
    //       }
    //     } else {
    //       console.log("ADD");
    //       this.props.dispatch(
    //         addPageCounted(
    //           "StandingsScreenBlur.js - " + this.state.selectedTime
    //         )
    //       );
    //       Tracker.trackScreenView(
    //         "SESSION: StandingsScreenBlur.js - " + this.state.selectedTime
    //       );
    //     }
    //   }
    // }

    Tracker.trackScreenView(
      "StandingsScreenBlur.js - " + this.state.activeSelectable
    );
    trackScreenView("StandingsScreenBlur.js - " + this.state.activeSelectable);
  }

  onSelect = (idx, value) => {
    // this.props.dispatch(setLeaderboardSelected(value.toLowerCase()));
    const selectTab = value.toLowerCase();
    const weeklySelect = selectTab == "weekly";
    if (selectTab == "monthly") {
      this.props.dispatch(getMonthlyLeaderboard());
      this.props.dispatch(getMonthlyLeaderboardByCity());
      this.props.dispatch(setLeaderboardTiming(selectTab, idx));
    } else if (weeklySelect) {
      this.props.dispatch(getWeeklyLeaderboardNew());
      this.props.dispatch(getWeeklyLeaderboardByCity());
      this.props.dispatch(setLeaderboardTiming(selectTab, idx));
    } else if (selectTab === "community") {
      // communita
      this.props.dispatch(getWeeklyLeaderboardByCommunity());
      this.props.dispatch(setLeaderboardTiming(selectTab, idx));
    }

    this.setState({
      // activeSelectable: value.toLowerCase(),
      blockRanking: weeklySelect ? this.blockRanking() : false,
      selectedTime: selectTab,
      index: idx
    });

    this.updateCounterEndChallenge();
  };

  checkBlock = () => {
    if (
      (this.props.activeSelectable == "city" ||
        this.props.activeSelectable == "world") &&
      !this.state.blockRanking
    ) {
      const block = this.blockRanking();
      this.setState({
        blockRanking: block
      });
      if (!this.timeoutId && block) {
        this.updateCurrentTime();
      }
    }
    this.updateCounterEndChallenge();
  };

  getOverChallange = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text style={styles.restartTxt}>
          <Text style={styles.restartBoldTxt}>{strings("id_4_10")}</Text>
          {". " + strings("id_4_11") + " "}
          <Text style={styles.restartBoldTxt}>{strings("id_4_12")}</Text>
          {" " + strings("id_4_13")}
        </Text>
      </View>
    );
  };

  getCountdownTxt = (days_txt, hours_txt, min_txt, checkDay) => {
    // if(this.state.hour_until_end_date>0)
    // return ({strings("missing") + " "}
    // <Text style={styles.countdownBoldTxt}>
    //   {this.state.days_until_end_date}
    //   {" " + strings("id_4_02")}
    // </Text>
    // {" " + strings("left_to_the_end")})

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <OwnIcon
          name="timer_icn"
          size={20}
          color={checkDay ? "#FC6754" : "#FAB21E"}
        />
        <View style={{ width: 5, height: 5 }} />
        {/* <Text style={styles.Timer}>
        -{this.state.blockRanking ? time : "false"}
      </Text> */}
        {checkDay ? (
          <Text style={styles.countdownTxt}>
            <Text style={styles.countdownBoldTxt}>
              {Number.parseInt(this.state.days_until_end_date)}
              {" " + days_txt}
            </Text>

            {" " + strings("id_4_08")}
          </Text>
        ) : (
          <Aux>
            <View>
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
              <View
                style={{
                  borderBottomColor: "#FAB21E",
                  borderBottomWidth: 1
                }}
              />
            </View>
            <Text style={styles.countdownTxtWhite}>
              {" " + strings("id_4_08")}
            </Text>
          </Aux>
        )}
      </View>
    );
  };

  changeActiveSelectable = (value, id = -1) => {
    const selectedLeaderboard = value.toLowerCase();
    this.props.dispatch(setLeaderboardSelected(selectedLeaderboard));
    // this.props.dispatch(setLeaderboardTiming("weekly", "0"));

    const indexTiming = this.props.standingsState.indexTiming
      ? this.props.standingsState.indexTiming
      : 0;

    // friend;

    this.setState({
      index: indexTiming,
      blockRanking: this.blockRanking()
    });

    if (selectedLeaderboard === "city") {
      if (this.props.city == "CITY" || this.props.city == undefined) {
        // non hai una città, vieni portato alla schermata per aggiornare la tua città
        this.props.navigation.navigate("PersonalAnagraficDataScreen");
      } else {
        this.props.dispatch(getWeeklyLeaderboardByCity());
      }
    } else if (selectedLeaderboard === "global") {
      this.props.dispatch(getWeeklyLeaderboardNew());
    } else if (selectedLeaderboard === "friend") {
      this.props.dispatch(getWeeklyFriendLeaderboard());
      this.props.dispatch(getFollowingUser());
    } else if (selectedLeaderboard == "community") {
      this.props.dispatch(getWeeklyLeaderboardByCommunity());
    } else {
      this.props.dispatch(getWeeklyLeaderboardNew());
      // this.props.dispatch(getWeeklyLeaderboardByCity());
    }

    let newstate;
    if (id !== -1) {
      newstate = {
        activeSelectable: selectedLeaderboard
        // index: id
      };
    } else {
      newstate = {
        activeSelectable: selectedLeaderboard
      };
    }

    this.setState(newstate);
  };

  renderSelectableTournamentHeader(colorWave) {
    // this.props.community
    const community = this.props.community
      ? this.props.community.name
        ? true
        : false
      : false;
    const threeFields = community
      ? { width: Dimensions.get("window").width / 3 }
      : {};

    if (this.state.blockRanking) {
      const time = new Date(this.state.time * 1000).toISOString().slice(11, 19);
      return (
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#e82f73", "#f49658"]}
          style={styles.selectableHeaderBlock}
        >
          <View style={{ height: 5 }} />
          <View style={styles.HeaderTimer}>
            <View style={{ width: 30, height: 30 }} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <OwnIcon name="timer_icn" size={30} color="#FFFFFF" />
              <View style={{ width: 5, height: 5 }} />
              <Text style={styles.Timer}>
                -{this.state.blockRanking ? time : "false"}
              </Text>
            </View>
            <OwnIcon
              name="round_info_icn"
              click={() => this.DescriptionIconModal("infoWeek")}
              size={28}
              color="#FFFFFF"
            />
          </View>
          <View style={{ height: 5 }} />
          <View style={styles.selectableHeaderRow}>
            <View style={styles.mainContainer}>
              {community ? (
                this.props.community.name ? (
                  <TouchableWithoutFeedback
                    onPress={() => this.onSelect(0, "community")}
                  >
                    <View style={[styles.sideContainer, threeFields]}>
                      <Text
                        style={[
                          styles.text,
                          {
                            color:
                              this.state.selectedTime === "community"
                                ? "#3D3D3D"
                                : "#9D9B9C"
                          }
                        ]}
                      >
                        {this.props.community.name.toUpperCase()} CHALLENGE
                      </Text>
                      <View
                        style={[
                          styles.underline,
                          {
                            backgroundColor:
                              this.state.selectedTime === "community"
                                ? colorWave
                                : "#9D9B9C"
                          }
                        ]}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                ) : (
                  <View />
                )
              ) : (
                <View />
              )}
              <TouchableWithoutFeedback
                onPress={() => this.onSelect(0, "Weekly")}
              >
                <View style={[styles.sideContainer, threeFields]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color:
                          this.state.selectedTime === "weekly"
                            ? "#3D3D3D"
                            : "#FFFFFF"
                      }
                    ]}
                  >
                    {strings("_502_weekly_challeng").toLocaleUpperCase()}
                  </Text>
                  <View
                    style={[
                      styles.underline,
                      {
                        backgroundColor:
                          this.state.selectedTime === "weekly"
                            ? "#3D3D3D"
                            : "#FFFFFF"
                      }
                    ]}
                  />
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => this.onSelect(1, "Overall")}
              >
                <View style={[styles.sideContainer, threeFields]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color:
                          this.state.selectedTime === "overall"
                            ? "#3D3D3D"
                            : "#FFFFFF"
                      }
                    ]}
                  >
                    {strings("city_tournament").toLocaleUpperCase()}
                  </Text>
                  <View
                    style={[
                      styles.underline,
                      {
                        backgroundColor:
                          this.state.selectedTime === "overall"
                            ? "#3D3D3D"
                            : "#FFFFFF"
                      }
                    ]}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </LinearGradient>
      );
    } else {
      return (
        <View style={styles.endFlex}>
          <View style={styles.mainContainer}>
            {community ? (
              this.props.community.name ? (
                <TouchableWithoutFeedback
                  onPress={() => this.onSelect(0, "community")}
                >
                  <View style={[styles.sideContainer, threeFields]}>
                    <Text
                      style={[
                        styles.text,
                        {
                          color:
                            this.state.selectedTime === "community"
                              ? "#3D3D3D"
                              : "#9D9B9C"
                        }
                      ]}
                    >
                      {this.props.community.name.toUpperCase()} CHALLENGE
                    </Text>
                    <View
                      style={[
                        styles.underline,
                        {
                          backgroundColor:
                            this.state.selectedTime === "community"
                              ? colorWave
                              : "#9D9B9C"
                        }
                      ]}
                    />
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                <View />
              )
            ) : (
              <View />
            )}
            <TouchableWithoutFeedback
              onPress={() => this.onSelect(0, "Weekly")}
            >
              <View style={[styles.sideContainer, threeFields]}>
                <Text
                  style={[
                    styles.text,
                    {
                      color:
                        this.state.selectedTime === "weekly"
                          ? "#3D3D3D"
                          : "#9D9B9C"
                    }
                  ]}
                >
                  {strings("_502_weekly_challeng").toLocaleUpperCase()}
                </Text>
                <View
                  style={[
                    styles.underline,
                    {
                      backgroundColor:
                        this.state.selectedTime === "weekly"
                          ? "#3D3D3D"
                          : "#9D9B9C"
                    }
                  ]}
                />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => this.onSelect(1, "Overall")}
            >
              <View style={[styles.sideContainer, threeFields]}>
                <Text
                  style={[
                    styles.text,
                    {
                      color:
                        this.state.selectedTime === "overall"
                          ? "#3D3D3D"
                          : "#9D9B9C"
                    }
                  ]}
                >
                  {strings("city_tournament").toLocaleUpperCase()}
                </Text>
                <View
                  style={[
                    styles.underline,
                    {
                      backgroundColor:
                        this.state.selectedTime === "overall"
                          ? "#3D3D3D"
                          : "#9D9B9C"
                    }
                  ]}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      );
    }
  }

  renderTournamentCountdown(colorWave) {
    // this.props.community
    const community = this.props.community
      ? this.props.community.name
        ? true
        : false
      : false;
    const threeFields = community
      ? { width: Dimensions.get("window").width / 3 }
      : {};

    if (
      // this.state.days_until_end_date > 0 ||
      // this.state.hour_until_end_date > 0 ||
      // this.state.minute_until_end_date > 0
      true
    ) {
      // if (this.state.blockRanking) {
      const time = new Date(this.state.time * 1000).toISOString().slice(11, 19);
      let days_txt =
        this.state.days_until_end_date > 1
          ? strings("id_4_02")
          : strings("id_4_03");

      let hours_txt =
        this.state.hour_until_end_date > 1
          ? strings("id_4_04")
          : strings("id_4_05");
      let min_txt =
        this.state.minute_until_end_date > 1
          ? strings("id_4_06")
          : strings("id_4_07");
      const checkDay = this.state.days_until_end_date > 0;
      // #FC6754
      return (
        // <LinearGradient
        //   start={{ x: 0.0, y: 0.0 }}
        //   end={{ x: 0.0, y: 1.0 }}
        //   locations={[0, 1.0]}
        //   colors={["#e82f73", "#f49658"]}
        //   style={styles.selectableHeaderBlock}
        // >
        <View
          style={[
            styles.selectableHeaderBlock,
            {
              backgroundColor: checkDay
                ? "#fff"
                : this.state.blockRanking
                ? "#87D99A"
                : "#FC6754"
            }
          ]}
        >
          <View style={{ height: 5 }} />
          {this.state.blockRanking ? (
            <View style={styles.HeaderTimer}>{this.getOverChallange()}</View>
          ) : (
            <View style={styles.HeaderTimer}>
              {this.getCountdownTxt(days_txt, hours_txt, min_txt, checkDay)}
            </View>
          )}
          <View style={{ height: 5 }} />
          <View style={styles.selectableHeaderRow}>
            <View style={styles.mainContainer}>
              {community ? (
                this.props.community.name ? (
                  <TouchableWithoutFeedback
                    onPress={() => this.onSelect(0, "community")}
                  >
                    <View style={[styles.sideContainer, threeFields]}>
                      <Text
                        style={[
                          styles.text,
                          {
                            color:
                              this.state.selectedTime === "community"
                                ? colorWave
                                : checkDay
                                ? "#9D9B9C"
                                : "#F7F8F9"
                          }
                        ]}
                      >
                        {this.props.community.name.toUpperCase()} CHALLENGE
                      </Text>
                      <View
                        style={[
                          styles.underline,
                          {
                            backgroundColor:
                              this.state.selectedTime === "community"
                                ? colorWave
                                : checkDay
                                ? "#9D9B9C"
                                : "#F7F8F9"
                          }
                        ]}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                ) : (
                  <View />
                )
              ) : (
                <View />
              )}
              <TouchableWithoutFeedback
                onPress={() => this.onSelect(0, "Weekly")}
              >
                <View style={[styles.sideContainer, threeFields]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color:
                          this.state.selectedTime === "weekly"
                            ? "#3D3D3D"
                            : checkDay
                            ? "#9D9B9C"
                            : "#F7F8F9"
                      }
                    ]}
                  >
                    {strings("_502_weekly_challeng").toLocaleUpperCase()}
                  </Text>
                  <View
                    style={[
                      styles.underline,
                      {
                        backgroundColor:
                          this.state.selectedTime === "weekly"
                            ? "#3D3D3D"
                            : checkDay
                            ? "#9D9B9C"
                            : "#F7F8F9"
                      }
                    ]}
                  />
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => this.onSelect(1, "Overall")}
              >
                <View style={[styles.sideContainer, threeFields]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color:
                          this.state.selectedTime === "overall"
                            ? "#3D3D3D"
                            : checkDay
                            ? "#9D9B9C"
                            : "#F7F8F9"
                      }
                    ]}
                  >
                    {strings("city_tournament").toLocaleUpperCase()}
                  </Text>
                  <View
                    style={[
                      styles.underline,
                      {
                        backgroundColor:
                          this.state.selectedTime === "overall"
                            ? "#3D3D3D"
                            : checkDay
                            ? "#9D9B9C"
                            : "#F7F8F9"
                      }
                    ]}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
          {/* </LinearGradient> */}
        </View>
      );
    } else {
      return (
        <View style={styles.endFlex}>
          <View style={styles.mainContainer}>
            {community ? (
              this.props.community.name ? (
                <TouchableWithoutFeedback
                  onPress={() => this.onSelect(0, "community")}
                >
                  <View style={[styles.sideContainer, threeFields]}>
                    <Text
                      style={[
                        styles.text,
                        {
                          color:
                            this.state.selectedTime === "community"
                              ? "#3D3D3D"
                              : "#9D9B9C"
                        }
                      ]}
                    >
                      {this.props.community.name.toUpperCase()} CHALLENGE
                    </Text>
                    <View
                      style={[
                        styles.underline,
                        {
                          backgroundColor:
                            this.state.selectedTime === "community"
                              ? colorWave
                              : "#9D9B9C"
                        }
                      ]}
                    />
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                <View />
              )
            ) : (
              <View />
            )}
            <TouchableWithoutFeedback
              onPress={() => this.onSelect(0, "Weekly")}
            >
              <View style={[styles.sideContainer, threeFields]}>
                <Text
                  style={[
                    styles.text,
                    {
                      color:
                        this.state.selectedTime === "weekly"
                          ? "#3D3D3D"
                          : "#9D9B9C"
                    }
                  ]}
                >
                  {strings("_502_weekly_challeng").toLocaleUpperCase()}
                </Text>
                <View
                  style={[
                    styles.underline,
                    {
                      backgroundColor:
                        this.state.selectedTime === "weekly"
                          ? "#3D3D3D"
                          : "#9D9B9C"
                    }
                  ]}
                />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => this.onSelect(1, "Overall")}
            >
              <View style={[styles.sideContainer, threeFields]}>
                <Text
                  style={[
                    styles.text,
                    {
                      color:
                        this.state.selectedTime === "overall"
                          ? "#3D3D3D"
                          : "#9D9B9C"
                    }
                  ]}
                >
                  {strings("city_tournament").toLocaleUpperCase()}
                </Text>
                <View
                  style={[
                    styles.underline,
                    {
                      backgroundColor:
                        this.state.selectedTime === "overall"
                          ? "#3D3D3D"
                          : "#9D9B9C"
                    }
                  ]}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      );
    }
  }

  renderCountdown() {
    // this.props.community

    // if (this.state.blockRanking) {
    const time = new Date(this.state.time * 1000).toISOString().slice(11, 19);
    let days_txt =
      this.state.days_until_end_date > 1
        ? strings("id_4_02")
        : strings("id_4_03");

    let hours_txt =
      this.state.hour_until_end_date > 1
        ? strings("id_4_04")
        : strings("id_4_05");
    let min_txt =
      this.state.minute_until_end_date > 1
        ? strings("id_4_06")
        : strings("id_4_07");
    const checkDay = this.state.days_until_end_date > 0;
    // #FC6754
    return (
      // <LinearGradient
      //   start={{ x: 0.0, y: 0.0 }}
      //   end={{ x: 0.0, y: 1.0 }}
      //   locations={[0, 1.0]}
      //   colors={["#e82f73", "#f49658"]}
      //   style={styles.selectableHeaderBlock}
      // >
      <View
        style={[
          styles.selectableHeaderBlock,
          {
            backgroundColor: checkDay
              ? "#fff"
              : this.state.blockRanking
              ? "#87D99A"
              : "#FC6754"
          }
        ]}
      >
        <View style={{ height: 5 }} />
        {this.state.blockRanking ? (
          <View style={styles.HeaderTimer}>{this.getOverChallange()}</View>
        ) : (
          <View style={styles.HeaderTimer}>
            {this.getCountdownTxt(days_txt, hours_txt, min_txt, checkDay)}
          </View>
        )}
        <View style={{ height: 5 }} />
        {/* </LinearGradient> */}
      </View>
    );
  }

  DescriptionIconModal = typeIcon => {
    // Alert.alert("weather");
    this.setState({
      modalActive: true,
      iconChoose: typeIcon
    });
  };

  DeleteDescriptionIconModal = () => {
    // Alert.alert("weather");
    this.setState({
      modalActive: false
    });
  };

  renderEmptyCityTournament() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "#ffffff"
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-around",
            height: Dimensions.get("window").height * 0.64,
            position: "relative",
            alignSelf: "center",
            width: Dimensions.get("window").width * 0.8,
            backgroundColor: "#ffffff"
          }}
        >
          <View>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>COMING SOON</Text>
              <OwnIcon
                name="round_info_icn"
                click={() => this.DescriptionIconModal("infoCityTournament")}
                size={25}
                color="#3D3D3D"
              />
            </View>
            <Text
              style={{
                fontFamily: "OpenSans-Bold",
                textAlign: "center",
                color: "#3d3d3d",
                fontSize: 12
              }}
            >
              The tournament is about to kick off.
            </Text>
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
              source={require("./../../assets/images/city_tournament_empty.png")}
              style={{
                width: Dimensions.get("window").width * 0.6,
                height: Dimensions.get("window").width * 0.6
              }}
            />
          </View>
        </View>
      </View>
    );
  }
  render() {
    // const colorWave = this.props.community
    //   ? this.props.community.community_color
    //     ? this.props.community.community_color
    //     : "#FAB21E"
    //   : "#FAB21E";
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />

        <View
          ref={view => {
            this.view = view;
          }}
          style={{ backgroundColor: "#fff" }}
        >
          <DescriptionIcon
            active={this.state.modalActive}
            icon={this.state.iconChoose}
            DeleteDescriptionIconModal={this.DeleteDescriptionIconModal}
          />
          {/* {this.renderSelectableTournamentHeader(colorWave)} */}
          {/* {this.renderTournamentCountdown(colorWave)} */}

          {/* {this.state.selectedTime === "weekly" ? (
            <StandingsScreen
              navigation={this.props.navigation}
              activeSelectable={this.props.activeSelectable}
              selectedTime={this.state.selectedTime}
              changeActiveSelectable={this.changeActiveSelectable}
              blockRanking={
                this.props.activeSelectable !== "friend"
                  ? this.state.blockRanking
                  : false
              }
              city={this.props.city ? this.props.city.toUpperCase() : "CITY"}
              checkBlock={this.checkBlock}
              standingsState={this.props.standingsState}
            />
          ) : this.state.selectedTime === "community" ? (
            <CommunityStandingsScreen
              navigation={this.props.navigation}
              activeSelectable={this.props.activeSelectable}
              selectedTime={this.state.selectedTime}
              changeActiveSelectable={this.changeActiveSelectable}
              blockRanking={false}
              city={this.props.city ? this.props.city.toUpperCase() : "CITY"}
              checkBlock={this.checkBlock}
              standingsState={this.props.standingsState}
              colorWave={colorWave}
            />
          ) : (
            this.renderEmptyCityTournament()
          )} */}
          {this.renderCountdown()}
          <StandingsScreen
            navigation={this.props.navigation}
            activeSelectable={this.props.activeSelectable}
            selectedTime={this.state.selectedTime}
            changeActiveSelectable={this.changeActiveSelectable}
            blockRanking={
              this.props.activeSelectable === "friend" ||
              this.props.activeSelectable === "community"
                ? false
                : this.state.blockRanking
            }
            city={this.props.city ? this.props.city.toUpperCase() : "CITY"}
            checkBlock={this.checkBlock}
            standingsState={this.props.standingsState}
            community={this.props.community}
          />
        </View>
        <Blur viewRef={this.state.viewRef} />
      </Aux>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    width: Dimensions.get("window").width * 0.8,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 20,
    textAlign: "left",
    textAlignVertical: "center"
  },
  selectableTournamentHeader: {
    height: 30,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    backgroundColor: "#fff"
  },
  selectableHeader: {
    height: 30,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    backgroundColor: "#fff"
  },
  selectableContainerFirst: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  selectableHeaderBlock: {
    height: 40
  },
  selectableHeaderRow: {
    height: 40,
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
    height: 30,
    width: Dimensions.get("window").width * 0.25
  },
  selectableTournament: {
    width: Dimensions.get("window").width * 0.25,
    height: 6,

    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    // height: 30,
    width: Dimensions.get("window").width * 0.45
  },
  selectableContainerEnd: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    alignContent: "flex-end",
    width: Dimensions.get("window").width * 0.5,
    height: 6
  },
  selectableContainerStart: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
    width: Dimensions.get("window").width * 0.5,
    height: 6
  },
  HeaderTimer: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: 30,
    flexDirection: "row",
    width: Dimensions.get("window").width,
    // left: Dimensions.get("window").width * 0.05,

    // right: Dimensions.get("window").width * 0.0125,

    // left: Dimensions.get("window").width * 0,
    // right: Dimensions.get("window").width * 0.025,
    alignSelf: "flex-start"
  },
  selectableTouchable: {
    justifyContent: "center",
    alignItems: "center"
  },
  selectableTournamentContainer: {
    height: 40,
    width: Dimensions.get("window").width * 0.5,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "column"
  },
  selectableContainer: {
    height: 30,
    width: Dimensions.get("window").width * 0.5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  selectableLabel: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3D3D3D",
    fontSize: 10,
    fontWeight: "bold",
    // marginBottom: 4,
    marginVertical: 0,
    textAlign: "left"
  },
  Timer: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    // marginBottom: 4,
    marginVertical: 0,
    textAlign: "center"
  },

  mainContainer: {
    width: Dimensions.get("window").width,
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  endFlex: {
    width: Dimensions.get("window").width,
    height: 40,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  sideContainer: {
    width: Dimensions.get("window").width * 0.5,
    height: 40,
    // backgroundColor: "#6397CB",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  text: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#fff",
    fontSize: 10,
    marginVertical: 10,
    justifyContent: "center"
  },
  underline: {
    width: Dimensions.get("window").width * 0.25,
    height: 6,
    backgroundColor: "#FFFFFF"
    //marginVertical: 4
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
  },
  restartBoldTxt: {
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 10
  },
  restartTxt: {
    fontFamily: "OpenSans-Regular",
    textAlign: "center",

    color: "#FFFFFF",
    fontSize: 8
  },
  countdownTxtWhite: {
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 10
  },
  countdownBoldTxtWhite: {
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 10
  }
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    selectableLabel: {
      fontFamily: "Montserrat-ExtraBold",
      color: "#3D3D3D",
      fontSize: 8,
      fontWeight: "bold",
      // marginBottom: 4,
      marginVertical: 0,
      marginTop: 3,
      textAlign: "center"
    }
  });
}

// export default StandingsScreenBlur;

const getCity = state => state.login.infoProfile;

const getStandings = state => state.standings;

const getActiveSelectable = state => state.standings.selectedLeaderboard;

const getLocalSession = state =>
  state.login.sessionToken ? state.login.sessionToken : null;

const getActiveSelectableState = createSelector(
  [getActiveSelectable],
  selectedLeaderboard => (selectedLeaderboard ? selectedLeaderboard : "city")
);

const getCityState = createSelector([getCity], infoProfile =>
  infoProfile.city
    ? infoProfile.city.city_name
      ? infoProfile.city.city_name
      : "City"
    : "City"
);

const getCommunityState = createSelector([getCity], infoProfile =>
  infoProfile.community ? infoProfile.community : null
);

const getStandingsState = createSelector(
  [getStandings],
  standings => standings
);

const getSessionToken = createSelector([getLocalSession], s => s);

const withData = connect(state => {
  return {
    activeSelectable: getActiveSelectableState(state),
    standingsState: getStandingsState(state),
    city: getCityState(state),
    community: getCommunityState(state),
    sessionTokenState: getSessionToken(state)
  };
});

export default withData(StandingsScreenBlur);
