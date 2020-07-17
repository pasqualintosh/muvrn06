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
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Alert,
  Platform,
  Linking
} from "react-native";
import Svg, {
  Circle,
  LinearGradient,
  Line,
  Defs,
  Stop
} from "react-native-svg";
import { connect } from "react-redux";
import TimePicker from "./../../components/TimePicker/TimePicker";
import Switch from "react-native-switch-pro";
import { images } from "./../../components/InfoUserHome/InfoUserHome";
import { Tester } from "./../../config/Tester";
import { pushNotifications } from "./../../services/";
import Icon from "react-native-vector-icons/Ionicons";

import DeviceInfo from "react-native-device-info";
import { limitAvatar } from "./../../components/UserItem/UserItem";
import { resetTutorial } from "../../domains/login/ActionCreators.js";

// <View style={{ paddingBottom: Dimensions.get("window").height / 10 }} />
// aggiungere un po di padding alla fine cosi è possibile vedere tutti gli elementti
// anche se c'e la notifica e l'onda

import {
  postMostFrequentRouteNotSave,
  UpdateProfile,
  setNotificationTime,
  setNotificationBoolean,
  setWeekDaysNotification,
  deleteMostFrequentRoute,
  setSundayNotificationIds,
  deleteSundayNotificationIds,
  setScheduledNotificationIds,
  deleteScheduledNotificationIds,
  getMostFrequentRoute
} from "./../../domains/login/ActionCreators";

import { strings } from "../../config/i18n";

// tipi di routine
const type = [
  "Other",
  "Home",
  "Work",
  "Gym",
  "SCHOOL",
  "Work#2",
  "Mom/Dad",
  "Grandma/Grandpa",
  "Girlfriend/Boyfriend",
  "Kids' school",
  "Friends' Place",
  "Supermarket",
  "Bar/Restaurant",
  "Cinema/Theater"
];

// tipi di scelte
const select = {
  BikeSharingChoose: ["No", "Yes"],
  CarSharingChoose: ["No", "Yes"],
  localTransportSubscriberChoose: ["No", "Monthly", "Annual"],
  trainTransportSubscriberChoose: ["No", "Monthly", "Annual"],
  poolingPilotChoose: ["No", "Yes"],
  poolingPassengerChoose: ["No", "Yes"],
  weight: Array(81)
    .fill(0)
    .map((e, i) => i + 40)
    .map(elem => elem.toString()),
  gender: ["Prefer not to say", "Male", "Female"],
  height: Array(121)
    .fill(0)
    .map((e, i) => i + 100)
    .map(elem => elem.toString())
};

class PersonalDataScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      Car: false,
      BusPass: false,
      CarSharing: false,
      Bikesharing: false,
      BikeSharingService: ["No", "Yes"],
      BikeSharingChoose: "No",
      CarSharingService: ["No", "Yes"],
      CarSharingChoose: "No",
      trainTransportSubscriberChoose: "No",
      localTransportSubscriberChoose: "No",
      localTransportSubscriberService: ["No", "Monthly", "Annual"],
      trainTransportSubscriberService: ["No", "Monthly", "Annual"],
      poolingPilotChoose: "No",
      poolingPassengerChoose: "No",
      isModalVisible: false,
      isModalVisibleWeight: false,
      load: true,
      weight: "0",
      birthdate: "",
      data: {},
      gender: "Prefer not to say",
      height: "0",
      avatar: 1,
      notification_schedule: null,
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
      city: null,
      version: 1.0
    };
  }

  componentDidMount() {
    // chiedo i dati delle routine al db
    // this.props.dispatch(getMostFrequentRoute());
    const version = DeviceInfo.getVersion();

    


    const { infoProfile, infoProfileNotSave } = this.props.user;
    const info = { ...infoProfile, ...infoProfileNotSave };
    // se non ho info non salvate nel db, le metto in data

    this.setState({
      version,
      avatar: limitAvatar(info.avatar),
      notification_schedule:
        info.notification_schedule != null
          ? info.notification_schedule
          : "--:--",
      notification_set: info.notification_schedule != null ? true : false,
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
      cityName: infoProfile.city
        ? infoProfile.city.city_name
          ? infoProfile.city.city_name
          : ""
        : "",
      city: infoProfile.city
        ? infoProfile.city.id
          ? infoProfile.city.id
          : 0
        : 0,
      trainTransportSubscriberChoose: this.getLocalTransportChoose(
        infoProfile.public_local_transport_subscriber
      ),
      localTransportSubscriberChoose: this.getLocalTransportChoose(
        infoProfile.public_train_transport_subscriber
      ),
      BikeSharingChoose: infoProfile.bike_sharing_user ? "Yes" : "No",
      CarSharingChoose: infoProfile.car_sharing_user ? "Yes" : "No",
      poolingPilotChoose: infoProfile.pooling_pilot ? "Yes" : "No",
      poolingPassengerChoose: infoProfile.pooling_passenger ? "Yes" : "No"
    });
  }

  componentWillUnmount() {
    console.log("aggiornamento dati ");
    this.sendNewChange();
  }

  ConfermNewAvatar = avatar => {
    // this.unsetBackgroundGeolocation();
    console.log(avatar);
    this.setState(prevState => {
      return {
        avatar,
        data: {
          ...prevState.data,
          avatar
        }
      };
    });
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("settings")}
        </Text>
      )
    };
  };

  getLocalTransportValue = v => {
    switch (v) {
      case "No":
        return 0;
        break;

      case "Monthly":
        return 1;
        break;

      case "Annual":
        return 2;
        break;

      default:
        return 0;
        break;
    }
  };

  getLocalTransportChoose = v => {
    switch (v) {
      case 0:
        return "No";
        break;

      case 1:
        return "Monthly";
        break;

      case 2:
        return "Annual";
        break;

      default:
        return "No";
        break;
    }
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

  changeNotificationScheduleTime = (h, m, notification_set, type, callback) => {
    const value = `${h}:${m}`;

    this.props.dispatch(
      UpdateProfile({
        data: {
          public_profile: {
            notification_schedule: this.state.notification_schedule
          }
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
      if (Platform.OS == "ios") {
        let ids = pushNotifications.localDailyNotificationSchedule(
          value,
          this.state.choosed_week_days
        );
        this.props.dispatch(setScheduledNotificationIds(ids));
      } else {
        let ids = pushNotifications.localNotificationSchedule(
          value,
          this.state.choosed_week_days
        );
        this.props.dispatch(setScheduledNotificationIds(ids));
      }
    }, 1000);

    setTimeout(() => {
      this.sendNewChange();

      Alert.alert("Yeeey!", "Your notifications have been set :)");
    }, 1200);
  };

  ConvertId = value => {
    if (value === "Male") {
      return 1;
    } else if (value === "Female") {
      return 2;
    } else {
      return 0;
    }
  };

  // manda al db le nuove modifiche fatte alle info dell'utente
  sendNewChange = () => {
    // preparo i dati che sono cambiati
    // se esistono le info dell'utente
    if (this.props.user.infoProfile) {
      // se qualche dato è cambiato
      // se vuoto da 0
      if (Object.keys(this.state.data).length) {
        // this.props.dispatch(
        //   setNotificationBoolean(this.state.notification_set)
        // );

        this.props.dispatch(
          UpdateProfile({
            data: {
              ...this.state.data,
              public_profile: {
                ...this.state.data,
                bike_sharing_user:
                  this.state.BikeSharingChoose == "Yes" ? true : false,
                car_sharing_user:
                  this.state.CarSharingChoose == "Yes" ? true : false,
                pooling_pilot:
                  this.state.poolingPilotChoose == "Yes" ? true : false,
                pooling_passenger:
                  this.state.poolingPassengerChoose == "Yes" ? true : false,
                public_local_transport_subscriber: this.getLocalTransportValue(
                  this.state.localTransportSubscriberChoose
                ),
                public_train_transport_subscriber: this.getLocalTransportValue(
                  this.state.trainTransportSubscriberChoose
                )
              }
            }
          })
        );
        // this.props.dispatch(
        //   UpdateProfile({
        //     data: {
        //       bike_sharing_user:
        //         this.state.BikeSharingChoose == "yes" ? true : false
        //     }
        //   })
        // );
        // inviati cancello i dati
        this.setState({
          data: {}
        });
      }
    }
  };

  // switch se si possiede un mezzo o un pass, type specifica il tipo di switch cliccato e il relativo dato su state
  changeSwitch = type => {
    this.setState(prevState => {
      if (type === 1) {
        return { Car: !prevState.Car };
      } else if (type === 2) {
        return { BusPass: !prevState.BusPass };
      } else if (type === 3) {
        return { CarSharing: !prevState.CarSharing };
      } else if (type === 4) {
        return { Bikesharing: !prevState.Bikesharing };
      }
    });
  };

  getNotificationHour = () => {
    if (this.state.notification_schedule != null) {
      const stringH = this.state.notification_schedule.substr(0, 2);
      return Number.parseInt(stringH);
    } else {
      return new Date().getHours();
      // return new Date().getHours() > 12
      //   ? new Date().getHours() - 12
      //   : new Date().getHours();
    }
  };

  getNotificationMinute = () => {
    if (this.state.notification_schedule != null) {
      let stringM = "";

      if (this.getNotificationHour() < 10)
        stringM = this.state.notification_schedule.substr(2, 2);
      else stringM = this.state.notification_schedule.substr(3, 2);

      return Number.parseInt(stringM);
    } else {
      return new Date().getMinutes();
    }
  };

  renderDeleteBtn(index, id) {
    const numFrequentTrips = this.props.routine.length;
    // al momento il tasto x non c'e
    if (numFrequentTrips > 1)
      return (
        <View
          style={{
            width: 18,
            height: 18
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              Alert.alert(
                strings("frequent_trip"),
                strings("delete_this_fre"),
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  {
                    text: strings("ok.toLocaleUpperCase()"),
                    onPress: () =>
                      this.props.dispatch(deleteMostFrequentRoute({}, id))
                  }
                ],
                { cancelable: false }
              );
            }}
          >
            <View
              style={{
                width: 18,
                height: 18,
                backgroundColor: "#FC6754",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 1,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 0.01 },
                shadowOpacity: 0.2
              }}
            >
              <Text style={styles.iconText}>x</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    else
      return (
        <View
          style={{
            width: 18,
            height: 18,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
            right: -5,
            borderRadius: 1,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0.01 },
            shadowOpacity: 0.2
          }}
        />
      );
  }

  renderNotificationSchedulePointer() {
    return (
      <View
        style={{
          width: 8,
          height: 8,
          alignSelf: "center",
          position: "absolute",
          left: -60
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            if (this.state.notification_set) {
              Alert.alert(
                "Cancel all the notification schedule",
                "Are you sure? :/",
                [
                  {
                    text: "Yes",
                    onPress: () => {
                      pushNotifications.deleteNotificationByIds(
                        this.props.user.notification_scheduled_ids
                      );
                      this.props.dispatch(deleteScheduledNotificationIds());
                      // this.props.dispatch(
                      //   setNotificationTime(
                      //     "--:--",
                      //     this.state.choosed_week_days
                      //   )
                      // );
                      this.setState({
                        notification_set: false,
                        notification_schedule: null
                      });
                      this.changeState(false, "notification_set", null);
                      // this.changeNotificationScheduleTime(
                      //   "--",
                      //   "--",
                      //   false,
                      //   "notification_schedule",
                      //   null
                      // );
                      this.props.dispatch(
                        UpdateProfile({
                          data: {
                            public_profile: { notification_schedule: null }
                          }
                        })
                      );
                    }
                  },
                  { text: "No" }
                ],
                { cancelable: false }
              );
            }
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 5,
              backgroundColor: this.state.notification_set
                ? "#87D99A"
                : "#FC6754"
            }}
          />
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderNotificationScheduleSettings() {
    // if (Tester.includes(this.props.user.username)) {
    return (
      <View style={styles.other}>
        <Text style={styles.left}>Schedule notification</Text>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this.renderNotificationSchedulePointer()}
          <TimePicker
            value={
              this.state.notification_schedule
                ? this.state.notification_schedule
                : strings("to_fill")
            }
            mode="time"
            type="notification_schedule"
            changeState={this.changeNotificationScheduleTime}
            hour={this.getNotificationHour()}
            minute={this.getNotificationMinute()}
            choosedWeekDays={this.state.choosed_week_days}
          />
        </View>
      </View>
    );
    // }
  }
  goToDetailFrequentRoutine = elem => {
    this.props.navigation.navigate("FrequentRoutineMapDetail", {
      routine: elem
    });
  };

  sendFeedBackTypeform = () => {
    const systemName = DeviceInfo.getSystemName();
    const systemVersion = DeviceInfo.getSystemVersion();
    const model = DeviceInfo.getModel();
    const manufacturer = DeviceInfo.getManufacturer();
    const deviceId = DeviceInfo.getDeviceId();

    const device =
      manufacturer +
      " " +
      deviceId +
      " " +
      model +
      " " +
      systemVersion +
      " " +
      systemName;
    this.props.navigation.navigate("FeedbackWebView", {
      device,
      report: false,
      feedbackMail: true
    });
  };

  sendFeedBack = () => {
    /* try {
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
      } */
    const systemName = DeviceInfo.getSystemName();
    const systemVersion = DeviceInfo.getSystemVersion();
    const model = DeviceInfo.getModel();
    const manufacturer = DeviceInfo.getManufacturer();
    const deviceId = DeviceInfo.getDeviceId();

    const device =
      manufacturer +
      " " +
      deviceId +
      " " +
      model +
      " " +
      systemVersion +
      " " +
      systemName;

    const url =
      "mailto:developers@wepush.org?subject=" +
      strings("hey_buddies__i_") +
      "&body=" +
      strings("ciao__it_s__you") +
      device;

    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: " + url);
          const urlGmail =
            "googlegmail:developers@wepush.org?subject=" +
            strings("hey_buddies__i_") +
            "&body=" +
            strings("ciao__it_s__you") +
            device;
          Linking.canOpenURL(urlGmail)
            .then(supported => {
              if (!supported) {
                console.log("Can't handle url: " + urlGmail);
              } else {
                return Linking.openURL(urlGmail);
              }
            })
            .catch(err => console.error("An error occurred", err));
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error("An error occurred", err));
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
          <View style={styles.first}>
            <View style={styles.paddingStart} />
            <View style={styles.sessionFirst}>
              <View>
                <Text style={styles.left}>{strings("avatar")}</Text>
                <Text style={styles.leftDescription}>
                  {strings("select_the_avat")}
                </Text>
                <Text style={styles.leftDescription}>
                  {strings("check_out_the_n")}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                alignContent: "center",
                alignItems: "center",
                alignSelf: "center"
              }}
              onPress={() =>
                this.props.navigation.navigate("ChangeAvatarScreen", {
                  avatar: this.state.avatar,
                  ConfermNewAvatar: this.ConfermNewAvatar
                })
              }
            >
              <Image
                style={{
                  width: 80,
                  height: 80
                }}
                source={images[this.state.avatar]}
              />
            </TouchableOpacity>
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate("PersonalAnagraficDataScreen");
            }}
          >
            <View style={styles.other}>
              <View style={styles.paddingStart} />
              <View style={styles.session}>
                <View>
                  <Text style={styles.left}>{strings("personal_data")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("complete_your_p")}
                  </Text>
                </View>
              </View>
              <View style={styles.IconSession}>
                <Icon name="md-arrow-forward" size={18} color="#3d3d3d" />
              </View>
            </View>
          </TouchableWithoutFeedback>
          {/* <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate("PersonalMobilityDataScreen");
            }}
          >
            <View style={styles.other}>
              <View style={styles.session}>
                <View>
                  <Text style={styles.left}>{strings("mobility_habits")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("tell_us_more_ab")}
                  </Text>
                </View>
              </View>
              <Icon
                name="md-arrow-forward"
                size={18}
                color="#3d3d3d"
                style={{ alignSelf: "center", marginRight: 17 }}
              />
            </View>
          </TouchableWithoutFeedback> */}
          {/* <TouchableWithoutFeedback
            onPress={() =>
              this.props.navigation.navigate("PersonalFrequentTripDataScreen")
            }
          >
            <View style={styles.other}>
              <View style={styles.session}>
                <View>
                  <Text style={styles.left}>{strings("frequent_trips")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("manage_your_dai")}
                  </Text>
                </View>
              </View>
              <Icon
                name="md-arrow-forward"
                size={18}
                color="#3d3d3d"
                style={{ alignSelf: "center", marginRight: 17 }}
              />
            </View>
          </TouchableWithoutFeedback> */}
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate("PrivacyAndSecurity");
            }}
          >
            <View style={styles.other}>
              <View style={styles.paddingStart} />
              <View style={styles.session}>
                <View>
                  <Text style={styles.left}>{strings("privacy_and_sec")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("change_your_pas")}
                  </Text>
                </View>
              </View>
              <View style={styles.IconSession}>
                <Icon name="md-arrow-forward" size={18} color="#3d3d3d" />
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate("PersonalNotificationDataScreen");
            }}
          >
            <View style={styles.other}>
              <View style={styles.paddingStart} />
              <View style={styles.session}>
                <View>
                  <Text style={styles.left}>{strings("notifications")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("activate_and_cu")}
                  </Text>
                </View>
              </View>
              <View style={styles.IconSession}>
                <Icon name="md-arrow-forward" size={18} color="#3d3d3d" />
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => this.props.navigation.navigate("FAQScreen")}
          >
            <View style={styles.other}>
              <View style={styles.paddingStart} />
              <View style={styles.session}>
                <View>
                  <Text style={styles.left}>{"Rules and FAQ"}</Text>
                  <Text style={styles.leftDescription}>
                    {"Frequently Asked Questions"}
                  </Text>
                </View>
              </View>
              <View style={styles.IconSession}>
                <Icon name="md-arrow-forward" size={18} color="#3d3d3d" />
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => this.sendFeedBackTypeform()}>
            <View style={styles.other}>
              <View style={styles.paddingStart} />
              <View style={styles.session}>
                <View>
                  <Text style={styles.left}>{strings("give_us_feedbac")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("let_us_know_wha")}
                  </Text>
                </View>
              </View>
              <View style={styles.IconSession}>
                <Icon name="md-arrow-forward" size={18} color="#3d3d3d" />
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => this.props.navigation.navigate("LanguagesScreen")}
          >
            <View style={styles.other}>
              <View style={styles.paddingStart} />
              <View style={styles.session}>
                <View>
                  <Text style={styles.left}>{strings("language")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("change_muv_lang")}
                  </Text>
                </View>
              </View>
              <View style={styles.IconSession}>
                <Icon name="md-arrow-forward" size={18} color="#3d3d3d" />
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => this.props.dispatch(resetTutorial("tutorialStart"))}
          >
            <View style={styles.other}>
              <View style={styles.paddingStart} />
              <View style={styles.session}>
                <View>
                  <Text style={styles.left}>Tutorial</Text>
                  <Text style={styles.leftDescription}>
                    Repeat Tutorial
                  </Text>
                </View>
              </View>
              <View style={styles.IconSession}>
                <Icon name="md-arrow-forward" size={18} color="#3d3d3d" />
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.other}>
            <View style={styles.paddingStart} />
            <View style={styles.session}>
              <View>
                <Text style={styles.left}>Version</Text>
                <Text style={styles.leftDescription}>
                  {this.state.version}
                </Text>
              </View>
            </View>
            <View style={styles.IconSession}>

            </View>
          </View>



          <View style={styles.lastPadding} />
          {/* {this.renderNotificationScheduleSettings()} */}
          {/* 
          {this.state.load
            ? this.props.routine.map((elem, index) => (
                <View
                  key={elem.id}
                  style={{
                    flexDirection: "row",
                    borderRadius: 4,
                    marginTop: 7,
                    justifyContent: "space-around",
                    alignItems: "center",
                    height: Dimensions.get("window").height * 0.1,

                    borderBottomColor: "#5F5F5F",
                    borderBottomWidth: 0.3
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.goToDetailFrequentRoutine(elem)}
                    style={{
                      height: 40,
                      width: Dimensions.get("window").width * 0.6,
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center"
                    }}
                  >
                    <View
                      style={{
                        marginHorizontal: 12,
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <Svg height="40" width="40">
                        <Defs>
                          <LinearGradient
                            id="grad"
                            x1="0"
                            y1="0"
                            x2="10"
                            y2="0"
                          >
                            <Stop
                              offset="0"
                              stopColor="#7D4D99"
                              stopOpacity="1"
                            />
                            <Stop
                              offset="1"
                              stopColor="#6497CC"
                              stopOpacity="1"
                            />
                          </LinearGradient>
                          <LinearGradient
                            id="grad2"
                            x1="0"
                            y1="0"
                            x2="10"
                            y2="0"
                          >
                            <Stop
                              offset="0"
                              stopColor="#E82F73"
                              stopOpacity="1"
                            />
                            <Stop
                              offset="1"
                              stopColor="#F49658"
                              stopOpacity="1"
                            />
                          </LinearGradient>
                        </Defs>
                        <Circle cx="5" cy="5" r="5" fill="url(#grad)" />
                        <Line
                          x1="5"
                          y1="11"
                          x2="5"
                          y2="15"
                          stroke="#3D3D3D"
                          strokeWidth="1"
                        />
                        <Line
                          x1="5"
                          y1="17"
                          x2="5"
                          y2="21"
                          stroke="#3D3D3D"
                          strokeWidth="1"
                        />
                        <Line
                          x1="5"
                          y1="23"
                          x2="5"
                          y2="27"
                          stroke="#3D3D3D"
                          strokeWidth="1"
                        />
                        <Circle cx="5" cy="33" r="5" fill="url(#grad2)" />
                      </Svg>
                      <View
                        style={{
                          marginHorizontal: 18,
                          flexDirection: "row",
                          alignItems: "center"
                        }}
                      >
                        <Text style={styles.mfrText}>
                          {type[elem.start_type]}
                        </Text>
                        <View
                          style={{
                            width: 40,
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center"
                          }}
                        >
                          <Text style={styles.mfrText}>{"<"}</Text>
                          <Text style={styles.mfrText}>{">"}</Text>
                        </View>
                        <Text style={styles.mfrText}>
                          {type[elem.end_type]}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {this.renderDeleteBtn(index, elem.id)}
                </View>
              ))
            : <View />}
          {this.state.load
            ? this.props.routineNotSave.map((elem, index) => (
                <View
                  key={index + this.props.routine.length}
                  style={{
                    height: 40,
                    flexDirection: "row",
                    borderRadius: 4,
                    marginTop: 7,
                    justifyContent: "space-around",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      height: 40,
                      width: Dimensions.get("window").width * 0.6,
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center"
                    }}
                  >
                    <View
                      style={{
                        marginHorizontal: 12,
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <Svg height="40" width="40">
                        <Defs>
                          <LinearGradient
                            id="grad"
                            x1="0"
                            y1="0"
                            x2="10"
                            y2="0"
                          >
                            <Stop
                              offset="0"
                              stopColor="#7D4D99"
                              stopOpacity="1"
                            />
                            <Stop
                              offset="1"
                              stopColor="#6497CC"
                              stopOpacity="1"
                            />
                          </LinearGradient>
                          <LinearGradient
                            id="grad2"
                            x1="0"
                            y1="0"
                            x2="10"
                            y2="0"
                          >
                            <Stop
                              offset="0"
                              stopColor="#E82F73"
                              stopOpacity="1"
                            />
                            <Stop
                              offset="1"
                              stopColor="#F49658"
                              stopOpacity="1"
                            />
                          </LinearGradient>
                        </Defs>
                        <Circle cx="5" cy="5" r="5" fill="url(#grad)" />
                        <Line
                          x1="5"
                          y1="11"
                          x2="5"
                          y2="15"
                          stroke="#3D3D3D"
                          strokeWidth="1"
                        />
                        <Line
                          x1="5"
                          y1="17"
                          x2="5"
                          y2="21"
                          stroke="#3D3D3D"
                          strokeWidth="1"
                        />
                        <Line
                          x1="5"
                          y1="23"
                          x2="5"
                          y2="27"
                          stroke="#3D3D3D"
                          strokeWidth="1"
                        />
                        <Circle cx="5" cy="33" r="5" fill="url(#grad2)" />
                      </Svg>
                      <View
                        style={{
                          marginHorizontal: 18,
                          flexDirection: "row",
                          alignItems: "center"
                        }}
                      >
                        <Text style={styles.mfrText}>
                          {type[elem.start_type]}
                        </Text>
                        <View
                          style={{
                            width: 40,
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center"
                          }}
                        >
                          <Text style={styles.mfrText}>{"<"}</Text>
                          <Text style={styles.mfrText}>{">"}</Text>
                        </View>
                        <Text style={styles.mfrText}>
                          {type[elem.end_type]}
                        </Text>
                      </View>
                    </View>
                  </View>
                
                </View>
              ))
            : <View />} 
            */}
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
    routine: state.login.mostFrequentRoute ? state.login.mostFrequentRoute : [],
    routineNotSave: state.login.mfr_modal_split_NotSave
      ? state.login.mfr_modal_split_NotSave
      : [],
    user: state.login,
    infoProfile: state.login.infoProfile,
    points:
      state.statistics.statistics === []
        ? 0
        : state.statistics.statistics.reduce((total, elem, index, array) => {
          return total + elem.points;
        }, 0)
  };
});

export default withData(PersonalDataScreen);

const styles = StyleSheet.create({
  first: {
    flex: 1,
    height:
      Dimensions.get("window").height * 0.1 > 100
        ? Dimensions.get("window").height * 0.1
        : 100,
    flexDirection: "row",
    borderTopColor: "#9D9B9C",
    borderTopWidth: 0.3,
    backgroundColor: "#fff"
  },

  other: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderTopColor: "#9D9B9C",
    borderTopWidth: 0.3,

    backgroundColor: "#fff"
  },
  IconSession: {
    width: 40,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#fff"
  },
  lastPadding: {
    flex: 1,
    height: Dimensions.get("window").height * 0.2,
    flexDirection: "row"
  },
  last: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderTopColor: "#9D9B9C",
    borderTopWidth: 0.3
  },
  leftFrequentRoute: {
    // alignSelf: "center",
    // textAlignVertical: "center",
    // flex: 1,
    fontSize: 15,
    fontWeight: "bold"
    // left: 20
  },
  left: {
    alignSelf: "flex-start",
    textAlignVertical: "center",
    textAlign: "left",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
  },
  leftDescription: {
    alignSelf: "auto",
    textAlignVertical: "center",
    textAlign: "left",
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D"
  },
  session: {
    alignSelf: "flex-start",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "flex-start",
    alignItems: "flex-start",
    width: Dimensions.get("window").width - 60,
    height: Dimensions.get("window").height * 0.1
  },
  paddingStart: {
    width: 20,
    height: Dimensions.get("window").height * 0.1
  },
  sessionFirst: {
    alignSelf: "flex-start",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "flex-start",
    alignItems: "flex-start",
    width: Dimensions.get("window").width - 100,
    height:
      Dimensions.get("window").height * 0.1 > 100
        ? Dimensions.get("window").height * 0.1
        : 100
  },
  right: {
    alignSelf: "center",
    right: 20,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
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
    // width: 200,
    // height: 200,
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
    // color: "black",
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
