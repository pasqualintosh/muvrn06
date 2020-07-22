/**
 * scena per il riassunto dei dati dell'utente
 * @author push
 */

import React from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  Platform,
  Switch as SwitchIos
} from "react-native";

import { connect } from "react-redux";
import TimePicker from "./../../components/TimePicker/TimePicker";
import { Tester } from "./../../config/Tester";
import { pushNotifications } from "./../../services/";
import {
  postMostFrequentRouteNotSave,
  updateProfileNew,
  setNotificationTime,
  setNotificationBoolean,
  setWeekDaysNotification,
  deleteMostFrequentRoute,
  setSundayNotificationIds,
  deleteSundayNotificationIds,
  setScheduledNotificationIds,
  deleteScheduledNotificationIds,
  getMostFrequentRoute,
  setStillNotification
} from "./../../domains/login/ActionCreators";
import Icon from "react-native-vector-icons/Ionicons";
import SwitchAndroid from "react-native-switch-pro";

// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

import Settings from "./../../config/Settings";

import { strings } from "../../config/i18n";
import {
  frequentTripsState,
  frequentTripsNotSaveState
} from "./../../domains/login/Selectors.js";

let Switch = Platform.OS == "ios" ? SwitchIos : SwitchAndroid;

const ranking_notification = "15:30";

class PersonalNotificationDataScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      isModalVisible: false,
      isModalVisibleWeight: false,
      load: true,
      data: {},
      scheduled_notification: null,
      notification_set: false,
      choosed_week_days: {
        0: false,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: false
      },
      ranking_notification: false,
      smart_stop_notification: false,
      events: {}
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("id_13_07")}
        </Text>
      )
    };
  };

  componentDidMount() {
    // chiedo i dati delle routine al db
    // this.props.dispatch(getMostFrequentRoute());
    // carico eventuali routine ancora non salvate nel db

    const { infoProfile, infoProfileNotSave } = this.props.user;

    const info = { ...infoProfile, ...infoProfileNotSave };

    this.setState(
      {
        scheduled_notification:
          info.scheduled_notification && info.scheduled_notification !== "--:--"
            ? info.scheduled_notification
            : "--:--",
        notification_set:
          info.scheduled_notification && info.scheduled_notification !== "--:--"
            ? true
            : false,
        ranking_notification: info.ranking_notification ? true : false,
        choosed_week_days: info.choosed_week_days
          ? info.choosed_week_days
          : {
              0: false,
              1: true,
              2: true,
              3: true,
              4: true,
              5: true,
              6: false
            },
        data: { ...infoProfileNotSave },
        smart_stop_notification: info.smart_stop_notification ? true : false,
        challenge_notification: info.challenge_notification ? true : false
      },
      () => {
        if (
          info.scheduled_notification != null &&
          this.props.user.notification_scheduled_ids == null
        ) {
          console.log(this.props.user);
          console.log(info.scheduled_notification);
          this.setState({
            scheduled_notification: "--:--",
            notification_set: false
          });

          pushNotifications.deleteAllNotification();
          if (this.state.ranking_notification) {
            pushNotifications.deleteNotificationByIds(
              this.props.user.notification_sunday_ids
            );
            let ids = [];
            if (Platform.OS == "ios")
              ids = pushNotifications.localWeekNotification(
                ranking_notification
              );
            else
              ids = pushNotifications.localWeeklyNotificationSchedule(
                ranking_notification
              );
            this.props.dispatch(setSundayNotificationIds(ids));
          }
        }
      }
    );
  }

  componentWillUnmount() {
    console.log("aggiornamento dati ");
    this.sendNewChange();
  }

  setDayWeek = index => {
    let days = this.state.choosedWeekDays;
    days[index] = !days[index];

    this.setState({
      choosedWeekDays: days
    });
  };

  changeSundayNotification = () => {
    let notification_state = !this.state.ranking_notification;
    this.setState(
      prevState => {
        return {
          ranking_notification: !prevState.ranking_notification,
          data: {
            ...prevState.data,
            ranking_notification: !prevState.ranking_notification
          }
        };
      },
      () => {
        if (notification_state) {
          let ids = [];
          if (Platform.OS == "ios")
            ids = pushNotifications.localWeekNotification(ranking_notification);
          else
            ids = pushNotifications.localWeeklyNotificationSchedule(
              ranking_notification
            );
          this.props.dispatch(setSundayNotificationIds(ids));
        } else {
          pushNotifications.deleteNotificationByIds(
            this.props.user.notification_sunday_ids
          );
          this.props.dispatch(deleteSundayNotificationIds());
        }
      }
    );
  };

  changeStillNotification = () => {
    let notification_state = !this.state.smart_stop_notification;
    this.setState(
      prevState => {
        return {
          smart_stop_notification: !prevState.smart_stop_notification,
          data: {
            ...prevState.data,
            smart_stop_notification: !prevState.smart_stop_notification
          }
        };
      },
      () => {
        if (notification_state) {
          this.props.dispatch(setStillNotification(true));
        } else {
          this.props.dispatch(setStillNotification(false));
        }
      }
    );
  };

  changeChallangelNotification = () => {
    this.setState(prevState => {
      return {
        challenge_notification: !prevState.challenge_notification,
        data: {
          ...prevState.data,
          challenge_notification: !prevState.challenge_notification
        }
      };
    });
  };

  // metodo per cambiare il parametro specificato in type con il valore value nello stato
  // salvo anche i dati da inviare cosi so che sono nuovi
  // callback, metodo per adattare il formato adatto al db
  changeState = (value, type, callback) => {
    console.log(value);
    console.log(callback);
    callback && typeof callback === "function"
      ? console.log(callback(value))
      : console.log(value);
    this.setState(prevState => {
      return {
        [type]: value,
        data: {
          ...prevState.data,
          [type]:
            callback && typeof callback === "function" ? callback(value) : value
        }
      };
    });
  };

  getNotificationHour = () => {
    if (this.state.scheduled_notification != null) {
      const stringH = this.state.scheduled_notification.substr(0, 2);
      return Number.parseInt(stringH);
    } else {
      return new Date().getHours();
      // return new Date().getHours() > 12
      //   ? new Date().getHours() - 12
      //   : new Date().getHours();
    }
  };

  getNotificationMinute = () => {
    if (this.state.scheduled_notification != null) {
      let stringM = "";

      if (this.getNotificationHour() < 10)
        stringM = this.state.scheduled_notification.substr(2, 2);
      else stringM = this.state.scheduled_notification.substr(3, 2);

      return Number.parseInt(stringM);
    } else {
      return new Date().getMinutes();
    }
  };

  changeScheduledNotification = () => {
    let notification_state = !this.state.notification_set;

    if (!notification_state) {
      pushNotifications.deleteNotificationByIds(
        this.props.user.notification_scheduled_ids
      );
      pushNotifications.deleteAllNotification();
      this.props.dispatch(deleteScheduledNotificationIds());
      this.setState({
        notification_set: false,
        scheduled_notification: null
      });
      this.changeState(false, "notification_set", null);
      this.props.dispatch(
        updateProfileNew({
          data: {
            scheduled_notification: null,
          }
        })
      );
      if (this.state.ranking_notification) {
        pushNotifications.deleteNotificationByIds(
          this.props.user.notification_sunday_ids
        );
        let ids = [];
        if (Platform.OS == "ios")
          ids = pushNotifications.localWeekNotification();
        else ids = pushNotifications.localWeeklyNotificationSchedule();
        this.props.dispatch(setSundayNotificationIds(ids));
      }
    } else {
      this.setState({
        notification_set: true
      });
    }
  };

  changeNotificationScheduleTime = (h, m, notification_set, type, callback) => {
    const value = `${h}:${m}`;

    this.props.dispatch(
      updateProfileNew({
        data: {
          scheduled_notification: this.state.scheduled_notification
        }
      })
    );

    this.props.dispatch(
      setNotificationTime(value, this.state.choosed_week_days)
    );

    this.props.dispatch(setWeekDaysNotification(this.state.choosed_week_days));

    this.setState(prevState => {
      return {
        [type]: value,
        notification_set,
        data: {
          ...prevState.data,
          [type]:
            callback && typeof callback === "function" ? callback(value) : value
        }
      };
    });

    // workaround da capire come scrivere meglio
    setTimeout(() => {
      pushNotifications.cancelAllLocalNotifications();
      if (this.state.ranking_notification) {
        pushNotifications.deleteNotificationByIds(
          this.props.user.notification_sunday_ids
        );
        let ids = [];
        if (Platform.OS == "ios")
          ids = pushNotifications.localWeekNotification(ranking_notification);
        else
          ids = pushNotifications.localWeeklyNotificationSchedule(
            ranking_notification
          );
        this.props.dispatch(setSundayNotificationIds(ids));
      }

      if (Platform.OS == "ios") {
        ids = pushNotifications.localDailyNotificationSchedule(
          value,
          this.state.choosed_week_days
        );
        this.props.dispatch(setScheduledNotificationIds(ids));
      } else {
        ids = pushNotifications.localNotificationSchedule(
          value,
          this.state.choosed_week_days
        );
        this.props.dispatch(setScheduledNotificationIds(ids));
      }
    }, 1000);

    setTimeout(() => {
      this.sendNewChange();



      Alert.alert(strings("id_13_59"), strings("id_13_60"));
    }, 1200);
  };

  // manda al db le nuove modifiche fatte alle info dell'utente
  sendNewChange = () => {
    if (this.props.user.infoProfile) {
      if (Object.keys(this.state.data).length) {
        this.props.dispatch(
          updateProfileNew({
            data: this.state.data
          })
        );

        this.setState({
          data: {}
        });
      }
    }
  };

  getNotificationHour = () => {
    if (this.state.scheduled_notification != null) {
      const stringH = this.state.scheduled_notification.substr(0, 2);
      return Number.parseInt(stringH);
    } else {
      return new Date().getHours();
    }
  };

  getNotificationMinute = () => {
    if (this.state.scheduled_notification != null) {
      let stringM = "";

      if (this.getNotificationHour() < 10)
        stringM = this.state.scheduled_notification.substr(2, 2);
      else stringM = this.state.scheduled_notification.substr(3, 2);

      return Number.parseInt(stringM);
    } else {
      return new Date().getMinutes();
    }
  };

  renderNotificationSchedulePointer() {
    return (
      <Switch
        style={{ marginRight: 18 }}
        onValueChange={this.changeScheduledNotification}
        value={this.state.notification_set}
      />
    );
  }

  renderNotificationScheduleSettings() {
    // if (Tester.includes(this.props.user.username)) {
    return (
      <View style={styles.other}>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            // alignItems: "center",
            width: Dimensions.get("window").width * 0.5
          }}
        >
          <Text style={styles.left}>{strings("id_13_41")}</Text>
          <Text style={styles.leftDescription}>{strings("id_13_42")}</Text>
        </View>

        <TimePicker
          value={
            this.state.scheduled_notification
              ? this.state.scheduled_notification
              : "--:--"
          }
          mode="time"
          type="scheduled_notification"
          changeState={this.changeNotificationScheduleTime}
          hour={this.getNotificationHour()}
          minute={this.getNotificationMinute()}
          choosedWeekDays={this.state.choosed_week_days}
          changeScheduledNotification={this.changeScheduledNotification}
          notification_set={this.state.notification_set}
        />
        {/* {this.renderNotificationSchedulePointer()} */}
      </View>
    );
    // }
  }

  goToDetailFrequentRoutine = elem => {
    this.props.navigation.navigate("FrequentRoutineMapDetail", {
      routine: elem
    });
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: "#fff"
        }}
      >
        <ScrollView
          style={{
            backgroundColor: "#fff",
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width
          }}
        >
          {this.renderNotificationScheduleSettings()}
          <View style={styles.other}>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                // alignItems: "center",
                height: 100,
                width: Dimensions.get("window").width * 0.5
              }}
            >
              <Text style={styles.left}>{strings("id_13_43")}</Text>
              <Text style={styles.leftDescription}>{strings("id_13_44")}</Text>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <Switch
                style={{ marginRight: 18 }}
                onValueChange={this.changeSundayNotification}
                onSyncPress={this.changeSundayNotification}
                value={this.state.ranking_notification}
              />
            </View>
          </View>
          <View
            style={[
              styles.other,
              {
                // borderBottomColor: "#5F5F5F",
                // borderBottomWidth: 0.3
              }
            ]}
          >
            <View
              style={{
                flexDirection: "column",
                height: 100,
                width: Dimensions.get("window").width * 0.5,
                justifyContent: "center"
              }}
            >
              <Text style={styles.left}>{strings("id_13_45")}</Text>
              <Text style={styles.leftDescription}>{strings("id_13_46")}</Text>
            </View>
            <Switch
              style={{ marginRight: 18 }}
              onValueChange={this.changeChallangelNotification}
              value={this.state.challenge_notification}
            />
          </View>
          <View
            style={[
              styles.other,
              {
                // borderBottomColor: "#5F5F5F",
                // borderBottomWidth: 0.3
              }
            ]}
          >
            <View
              style={{
                flexDirection: "column",
                height: 100,
                width: Dimensions.get("window").width * 0.5,
                justifyContent: "center"
              }}
            >
              <Text style={styles.left}>{strings("id_13_47")}</Text>
              <Text style={styles.leftDescription}>{strings("id_13_48")}</Text>
            </View>
            <Switch
              style={{ marginRight: 18 }}
              onValueChange={this.changeStillNotification}
              value={this.state.smart_stop_notification}
            />
          </View>
          <View
            style={{ paddingBottom: Dimensions.get("window").height / 10 }}
          />
        </ScrollView>
      </View>
    );
  }
}

const withData = connect(state => {
  // prendo solo le routine
  return {
    routine: frequentTripsState(state),
    routineNotSave: frequentTripsNotSaveState(state),
    user: state.login,
    infoProfile: state.login.infoProfile
  };
});

export default withData(PersonalNotificationDataScreen);

const styles = StyleSheet.create({
  first: {
    flex: 1,
    height:
      Dimensions.get("window").height * 0.1 > 100
        ? Dimensions.get("window").height * 0.1
        : 100,
    flexDirection: "row",
    borderTopColor: "#5F5F5F",
    borderTopWidth: 0.3,
    backgroundColor: "#fff"
  },
  other: {
    flex: 1,
    height: Dimensions.get("window").height * 0.15,
    flexDirection: "row",
    borderTopColor: "#5F5F5F",
    borderTopWidth: 0.3,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center"
  },
  last: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderTopColor: "#5F5F5F",
    borderTopWidth: 0.3
  },
  leftFrequentRoute: {
    fontSize: 15,
    fontWeight: "bold"
  },
  left: {
    alignSelf: "flex-start",
    textAlignVertical: "center",
    textAlign: "left",
    fontSize: 12,
    fontWeight: "bold",
    left: 20,
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
  },
  leftDescription: {
    alignSelf: "auto",
    textAlignVertical: "center",
    textAlign: "left",
    fontSize: 11,
    left: 20,
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D"
  },
  right: {
    marginHorizontal: 7,
    fontSize: 13,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D"
  },
  rightAndroid: {
    alignSelf: "center",
    right: 10
  },
  rightText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },
  centerTextContainer: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.1 + 190
  },
  centerValue: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 37,
    textAlign: "center",
    textAlignVertical: "center"
  },
  centerTextParam: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#9D9B9C",
    fontSize: 9,
    fontWeight: "bold"
  },
  iconText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 10,
    textAlignVertical: "center"
  },
  mfrText: {
    fontFamily: "OpenSans-Regular",
    marginRight: 0,
    fontWeight: "bold",
    color: "#3D3D3D",
    fontSize: 13,
    textAlign: "center"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,

    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContentAndroid: {
    width: 120,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  }
});
