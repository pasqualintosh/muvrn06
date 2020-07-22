import React from "react";
import {
  View,
  Dimensions,
  Platform,
  findNodeHandle,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import { styles } from "./Style";
import { connect } from "react-redux";

import ListRecapActivity from "./../../components/ListRecapActivity/ListRecapActivity";
import BlurHome from "./../../components/BlurHome/BlurHome";
import InfoUserHome from "./../../components/InfoUserHome/InfoUserHome";
import InfoCityTournamentUserHome from "./../../components/InfoCityTournamentUserHome/InfoCityTournamentUserHome";

import Aux from "./../../helpers/Aux";

import {
  getProfile,
  GetListRoute,
  getMostFrequentRoute,
  changeStatusButton,
  setSundayNotificationIds,
  setRemoteNotificationId,
  setNotificationTime,
  setWeekDaysNotification,
  setNotificationBoolean,
  setScheduledNotificationIds,
  setFirstConfiguration,
  UpdateProfile,
  setSessionToken,
  getTypeformSoddFrust,
  savePositionUsage,
  saveAppVersionUsage,
  updateProfileNew,
} from "./../../domains/login/ActionCreators";
import {
  resumeRoute,
  ResetPreviousRoute,
  CheckStateToValidateAndSave,
} from "./../../domains/tracking/ActionCreators";
import { getStats } from "./../../domains/statistics/ActionCreators";
import { getSpecificLeaderboard } from "./../../domains/standings/ActionCreators";
import {
  changeScreenProfile,
  emptyOfflineSTReward,
  getSpecialTrainingSessions,
  getSpecialTrainingSessionSubscribed,
  setNewStPivots,
} from "./../../domains/trainings/ActionCreators";

import { createSelector } from "reselect";

Array.prototype.clone = function () {
  return this.slice(0);
};

import { pushNotifications } from "./../../services/";
import { Tester } from "./../../config/Tester";
import branch, { BranchEvent } from "react-native-branch";
import { getDevice } from "../../helpers/deviceInfo";

const SUNDAY_NOTIFICATION = "15:30";

import { strings, switchLanguage, getLanguageI18n } from "../../config/i18n";

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    // const hour = new Date().getHours();
    const hour = 16;
    const t = hour < 12 ? 120 - (hour - 5) * 12.6 : 4 + (hour - 12) * 12.6;
    const l = hour < 12 ? 5 + (hour - 6) * 27.5 : [(hour - 6) * 27.5] - 10;

    this.state = {
      sender_id: "",
      t,
      l,
      load: false,
      data: [
        {
          value: 10,
        },
        {
          value: 5,
        },
        {
          value: 2,
        },
        {
          value: 6,
        },
        {
          value: 8,
        },
        {
          value: 1,
        },
      ],
      newData: [
        {
          value: 2,
        },
        {
          value: 8,
        },
        {
          value: 6,
        },
        {
          value: 1,
        },
        {
          value: 9,
        },
        {
          value: 1,
        },
      ],
      animate: false,
      ValueBlur: 0,
      viewRef: null,
      refreshing: false,
    };
  }

  componentWillReceiveProps(props) {
    console.log("cambio");
    console.log(props);
  }

  onRegister(token) {
    // alert("Registered !" + JSON.stringify(token));
    console.log(token);
    this.setState({ registerToken: token.token, gcmRegistered: true });
    this.props.dispatch(setRemoteNotificationId(token.token));
  }

  onNotif(notif) {
    console.log(notif);
    // alert(notif.title, notif.message);
  }

  handlePerm(perms) {
    console.log(perms);
    // alert(JSON.stringify(perms));
  }

  // metodo per gestire il blur con l'aumentare dello scroll
  onScrollBlur = (event) => {
    //console.log(event.nativeEvent.contentOffset.y);
    const offsetY = event.nativeEvent.contentOffset.y;

    let ValueBlur = parseInt(offsetY / 10);
    if (ValueBlur > 6) {
      ValueBlur = 6;
      if (this.state.ValueBlur !== 6)
        this.setState((prevState) => {
          return { ValueBlur };
        });
    } else if (ValueBlur === 0) {
      ValueBlur = 0;
      if (this.state.ValueBlur !== 0)
        this.setState((prevState) => {
          return { ValueBlur };
        });
    } else if (ValueBlur < 0) {
      ValueBlur = 1;
      if (this.state.ValueBlur !== 1)
        this.setState((prevState) => {
          return { ValueBlur };
        });
    } else {
      // se il valore nuovo è diverso da quello corrente allora aggiorna
      if (this.state.ValueBlur !== ValueBlur)
        this.setState((prevState) => {
          return { ValueBlur };
        });
    }
  };

  setIntervalCheck = (time) => {
    Check = setTimeout(() => {
      console.log("riprendi");
      const prova = this.props.dispatch(CheckStateToValidateAndSave());
      console.log(prova);
      if (prova === 3) {
        console.log("posso cancellare dati precedenti");
        this.props.dispatch(ResetPreviousRoute());
        clearTimeout(Check);
        this.setIntervalCheck(100000);
      } else if (prova === 1 || prova === 2) {
        console.log("sto controllando o ho iniziato a validare di nuovo ");
        clearTimeout(Check);
        this.setIntervalCheck(100000);
      } else if (prova === 0) {
        console.log("non ce nulla da controllare");
        clearTimeout(Check);
        this.setIntervalCheck(100000);
      }
    }, time);
  };

  setLocalNotifications = () => {
    try {
      let timing =
        this.props.registerState.frequent_trip_start_time != null &&
          this.props.registerState.frequent_trip_start_time != undefined
          ? this.props.registerState.frequent_trip_start_time
          : "07:30";
      if (
        this.props.first_configuration_v5 == undefined ||
        this.props.first_configuration_v5 == false
      ) {
        pushNotifications.cancelAllLocalNotifications();
        this.props.dispatch(
          updateProfileNew({
            data: {
              notification_schedule: timing,
            },
          })
        );
        let ids = [];
        if (Platform.OS == "ios") {
          ids = pushNotifications.localDailyNotificationSchedule(timing, [
            false,
            true,
            true,
            true,
            true,
            true,
            false,
          ]);
        } else {
          ids = pushNotifications.localNotificationSchedule(timing, [
            false,
            true,
            true,
            true,
            true,
            true,
            false,
          ]);
        }
        this.props.dispatch(setScheduledNotificationIds(ids));
        this.props.dispatch(setNotificationTime(timing, []));
        this.props.dispatch(
          setWeekDaysNotification([false, true, true, true, true, true, false])
        );

        let week_ids = [];
        if (Platform.OS == "ios")
          week_ids = pushNotifications.localWeekNotification();
        else week_ids = pushNotifications.localWeeklyNotificationSchedule();
        this.props.dispatch(setSundayNotificationIds(week_ids));

        console.log(week_ids);

        this.props.dispatch(setFirstConfiguration());
      }
    } catch (error) {
      console.error(error);
    }
  };

  responseCommunity = (community) => {
    console.log("community");
    console.log(community);
  };

  createRef = (ref) => {
    this.setState({ viewRef: findNodeHandle(ref) });
  };

  updateUserAgent = async () => {
    const device = await getDevice();

    if (this.props.profileState.user_agent != device) {
      console.log("!=");

      this.props.dispatch(
        updateProfileNew({
          data: {
            user_agent: device,
          },
        })
      );
    } else {
      console.log("==");
    }
  };

  componentDidMount() {
    // quando ho caricato il componente, posso dire a blur che è possibile fare il blur usando questa variabile
    // if (!this.state.viewRef) {
    //   this.setState({ viewRef: findNodeHandle(this.view) });
    // }

    this.setState({
      load: true,
    });

    // setTimeout(() => {
    //   if (this.props.notification_scheduled_ids == undefined)
    //     this.setLocalNotifications();
    // }, 1000 * 20);

    console.log("mount Home screen");

    // this.props.dispatch(emptyOfflineSTReward());

    if (Tester.includes(this.props.username)) {
      // Alert.alert(
      //   "Test for survey",
      //   "Do u want to ...",
      //   [
      //     {
      //       text: "Yes",
      //       onPress: () => {
      //         this.props.navigation.navigate("SurveyWebView");
      //       }
      //     },
      //     {
      //       text: "No",
      //       onPress: () => {
      //         return;
      //       },
      //       style: "cancel"
      //     }
      //   ],
      //   { cancelable: false }
      // );

      if (
        this.props.remote_notification_configured == undefined ||
        this.props.remote_notification_configured == false
      ) {
        try {
          // alert(this.props.loginState.remote_notification_sender_id);
          // pushNotifications.checkPermission(this.handlePerm);
          pushNotifications.configureRemoteNotif(
            this.onRegister.bind(this),
            this.onNotif.bind(this),
            this.props.remote_notification_sender_id
          );
        } catch (error) {
          console.log(error);
          alert("error " + JSON.stringify(error));
        }
      }
    }

    savePositionUsage();
    saveAppVersionUsage();
    // recupero delle invio che potrebbero cambiare ogni tanto come la posizione dell'utente e la versione dell'app

    // avvio un timer che controlla se sta validando o se ho inviato tratte che non sto validando

    // this.setIntervalCheck(50000);

    /* 
    BackgroundGeolocation.checkStatus(status => {
      console.log(status);
      if (
        !status.isRunning &&
        !status.hasPermissions &&
        Platform.OS !== "ios"
      ) {
        BackgroundGeolocation.start();
        BackgroundGeolocation.stop();
        BackgroundGeolocation.events.forEach(event =>
          BackgroundGeolocation.removeAllListeners(event)
        );
      }
    });

    if (Platform.OS === "ios") {
      // su iphone la richiesta gps è differente e quindi la richiedo con la richiesta di sistema che da tre possibilita
      navigator.geolocation.requestAuthorization();
    } 
    */

    // console.log(this.props.notification_sunday_ids);

    // if (this.props.notification_sunday_ids == undefined) {
    //   // cancella le precedenti!
    //   let ids = pushNotifications.localWeeklyNotificationSchedule(
    //     SUNDAY_NOTIFICATION
    //   );
    //   this.props.dispatch(setSundayNotificationIds(ids));
    // }

    branch.subscribe(({ error, params }) => {
      if (error) {
        console.log("Error from Branch: " + error);
        return;
      }
      console.log(params);

      /* $ios_passive_deepview: "branch_passive_default"
$marketing_title: "Test con parametro"
$og_description: "The MUV base game mechanism is extremely simple.The user, once downloaded the smartphone application, automatically becomes a player and he/she can earn points by moving throughout the city in a sustainable way."
$og_title: "MUV Mobility Urban Values"
$one_time_use: false
+click_timestamp: 1593792516
+clicked_branch_link: true
+is_first_session: false
+match_guaranteed: true
codice: "1111111"
~creation_source: 1
~feature: "Share"
~id: "807629657545347338"
~marketing: true
~referring_link: "https://muv.app.link/CZZVIbd7O7" */

      // if (params["+clicked_branch_link"]) {
      //   console.log("Received link response from Branch");
      //   // alert("Received link response from Branch \n" + JSON.stringify(params));

      //   // se non è stato settato nella registrazione
      //   // let link = params["~referring_link"];
      //   let sender_id = params.sender_id;

      //   console.log("params: " + JSON.stringify(params));
      //   console.log(sender_id);

      //   // se è il mio stesso invito, quindi stesso id, vado nel mio profilo
      //   if (sender_id == this.props.user_id) {
      //     // this.props.dispatch(changeScreenProfile("myself"));
      //     this.props.navigation.navigate("Info");
      //   } else {
      //     this.props.navigation.navigate("FriendDetailFromGlobal", {
      //       friendData: params,
      //       can_follow: true
      //     });
      //   }

      //   // alert(link);
      //   // alert(sender_id);

      //   // this.props.dispatch(
      //   //   postFollowUser({
      //   //     followed_user_id: sender_id,
      //   //     referral_url: link,
      //   //     link_status: 0,
      //   //     coin_followed_earned: 0,
      //   //     coin_follower_earned: 0
      //   //   })
      //   // );
      // }
    });

    // if (this.props.sessionTokenState)
    //   if (this.props.sessionTokenState.expired_date < +new Date()) {
    //     // token non valido
    //     this.props.dispatch(setSessionToken());
    //   } else {
    //     // token valido
    //   }
    // else this.props.dispatch(setSessionToken());
    //  this.props.dispatch(getTypeformSoddFrust(getTypeformUrl));
  }

  componentWillUnmount() {
    if (this.state.viewRef) {
      this.setState({ viewRef: null });
    }
    /* 
    if (Check) {
      clearTimeout(Check);
    } 
    */
  }

  componentWillReceiveProps(props) {
    if (props.status !== "Get route") {
      this.setState({ refreshing: false });
    }
  }

  componentWillMount() {
    // tolgo l'eventuale blur se residuo di un'attivita precedente
    this.props.dispatch(changeStatusButton(false));
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this.props.dispatch(ResetPreviousRoute());

    this.props.dispatch(GetListRoute());

    setTimeout(() => {
      this.props.dispatch(getProfile());
    }, 2000);

    // setTimeout(() => {
    //   if (
    //     this.props.registerState &&
    //     this.props.registerState.referral_from_registration != null
    //   ) {
    //     console.log("chiamata per following");
    //     this.props.dispatch(
    //       postFollowUser({
    //         followed_user_id: this.props.registerState.followed_user_id,
    //         referral_url: this.props.registerState.referral_url,
    //         link_status: this.props.registerState.link_status,
    //         coin_followed_earned: 3,
    //         coin_follower_earned: 2
    //         // followed_user_id: 2,
    //         // referral_url: "https:muv.app.link/aa11",
    //         // link_status: 0
    //       }, true)
    //     );

    //   }
    // }, 2500);

    setTimeout(() => {
      this.props.dispatch(resumeRoute());
    }, 4000);

    // this.props.dispatch(stop());
    // poi route
    AfterRefresh = setTimeout(() => {
      console.log("2 secondi ");
      this.props.dispatch(getMostFrequentRoute());
    }, 5000);

    // poi classifica

    AfterRoute = setTimeout(() => {
      dispatch(getSpecificLeaderboard());
    }, 6000);

    // poi statistiche

    AfterLeader = setTimeout(() => {
      this.props.dispatch(getStats());
    }, 8000);

    setTimeout(() => {
      this.props.dispatch(ResetPreviousRoute());
    }, 9000);

    setTimeout(() => {
      this.props.dispatch(getSpecialTrainingSessions());
      this.props.dispatch(getSpecialTrainingSessionSubscribed());
    }, 10000);
  }

  /* 
  shouldComponentUpdate(nextProps) {
    let isFocused = nextProps.navigation.isFocused();
    console.log("focus");
    console.log(isFocused);
    return isFocused;
  } 
  */

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.trainingsState.special_training_sessions !==
      this.props.trainingsState.special_training_sessions
    ) {
      let new_st_index = this.props.trainingsState.special_training_sessions.map(
        (el, index) => {
          if (!prevProps.trainingsState.special_training_sessions.includes(el))
            return index;
        }
      );

      // this.props.dispatch(setNewStPivots(new_st_index));
    } else {
      // do nothing
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.navigation.isFocused();
  }

  render() {
    if (this.state.load) {
      return (
        <View style={styles.mainContainer}>
          <Aux>
            <InfoCityTournamentUserHome
              createRef={this.createRef}
              navigation={this.props.navigation}
            />

            <BlurHome
              viewRef={this.state.viewRef}
              ValueBlur={this.state.ValueBlur}
            />
            <ListRecapActivity
              navigation={this.props.navigation}
              points={this.props.points}
              ValueBlur={this.state.ValueBlur}
              avatar={this.props.avatar}
              onScrollBlur={this.onScrollBlur}
            />
          </Aux>
        </View>
      );
    } else {
      return <View />;
    }
  }
}

function getTypeformUrl() {
  const languageSet = getLanguageI18n();

  switch (languageSet) {
    case "it":
      return "https://push564474.typeform.com/to/fFflcF";

    case "en":
      return "https://push564474.typeform.com/to/f8W2mU";

    case "es":
      return "https://push564474.typeform.com/to/lmCm8m";

    default:
      return "https://push564474.typeform.com/to/fFflcF";
  }
}

const getProfileInfo = (state) => state.login.infoProfile;
const getProfileNotSave = (state) => state.login.infoProfileNotSave;
const getStatus = (state) => state.login.status;
const getInfo = (state) => state.login;
const getLocalSession = (state) =>
  state.login.sessionToken ? state.login.sessionToken : null;

const getProfileState = createSelector(
  [getProfileInfo, getProfileNotSave],
  (infoProfile, infoProfileNotSave) => {
    console.log(infoProfile);
    return {
      ...infoProfile,
      ...infoProfileNotSave,
      city: infoProfile.city,
    };
  }
);

const getUserState = createSelector([getProfileInfo], (infoProfile) =>
  infoProfile.user_id ? infoProfile.user_id : 1
);

const getUsernameState = createSelector([getInfo], (info) => info.username);
const getRemote_notification_configuredState = createSelector(
  [getInfo],
  (info) => info.remote_notification_configured
);

const getRemote_notification_sender_idState = createSelector(
  [getInfo],
  (info) => info.remote_notification_sender_id
);

const getFirst_configuration_v5State = createSelector(
  [getInfo],
  (info) => info.first_configuration_v5
);

const getStatusState = createSelector([getStatus], (status) => status);

const getSessionToken = createSelector([getLocalSession], (s) => s);

const Recap = connect((state) => {
  return {
    status: getStatusState(state),
    user_id: getUserState(state),
    username: getUsernameState(state),
    remote_notification_configured: getRemote_notification_configuredState(
      state
    ),
    remote_notification_sender_id: getRemote_notification_sender_idState(state),
    first_configuration_v5: getFirst_configuration_v5State(state),
    registerState: state.register,
    trainingsState: state.trainings,
    sessionTokenState: getSessionToken(state),
    profileState: state.login.infoProfile,
    notification_scheduled_ids: state.login.notification_scheduled_ids,
  };
});

export default Recap(HomeScreen);
