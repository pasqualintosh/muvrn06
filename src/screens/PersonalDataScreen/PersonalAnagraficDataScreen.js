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
  Platform
} from "react-native";
import Svg, {
  Circle,
  LinearGradient,
  Line,
  Defs,
  Stop
} from "react-native-svg";
import { connect } from "react-redux";
import PickerModalContent from "./../../components/PickerModalContent/PickerModalContent";
import DatePicker from "./../../components/DatePicker/DatePicker";
import TimePicker from "./../../components/TimePicker/TimePicker";
import ChangeNameModalContent from "./../../components/ChangeNameModalContent/ChangeNameModalContent";
import ChangeCityModalContent from "./../../components/ChangeCityModalContent/ChangeCityModalContent";
import ChangeCommunityModalContent from "./../../components/ChangeCommunityModalContent/ChangeCommunityModalContent";

import MobilityHabitsPicker from "./../../components/MobilityHabitsPicker/MobilityHabitsPicker";
import Switch from "react-native-switch-pro";
import { images } from "./../../components/InfoUserHome/InfoUserHome";
import { Tester } from "./../../config/Tester";
import { pushNotifications } from "./../../services/";
import LogOut from "../../components/LogOut/LogOut";

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
  BikeSharingChoose: [strings("no"), strings("yes")],
  CarSharingChoose: [strings("no"), strings("yes")],
  localTransportSubscriberChoose: ["No", "Monthly", "Annual"],
  trainTransportSubscriberChoose: ["No", "Monthly", "Annual"],
  poolingPilotChoose: [strings("no"), strings("yes")],
  poolingPassengerChoose: [strings("no"), strings("yes")],
  occupation: [
    strings("to_fill"),
    strings("unemployed"),
    strings("student"),
    strings("employee"),
    strings("freelancer"),
    strings("entrepreneur"),
    strings("homemaker")
  ],
  weight: Array(81)
    .fill(0)
    .map((e, i) => i + 40)
    .map(elem => elem.toString()),
  gender: [strings("prefer_not_to_s"), strings("male"), strings("female")],
  height: Array(121)
    .fill(0)
    .map((e, i) => i + 100)
    .map(elem => elem.toString())
};

class PersonalAnagraficDataScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      Car: false,
      BusPass: false,
      CarSharing: false,
      Bikesharing: false,
      BikeSharingService: [strings("no"), strings("yes")],
      BikeSharingChoose: "No",
      CarSharingService: [strings("no"), strings("yes")],
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
      gender: strings("prefer_not_to_s"),
      height: "0",
      first_name: strings("to_fill"),
      last_name: strings("to_fill"),
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
      cityName: strings("to_fill"),
      city: null,
      community: null
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
          {strings("personal_data")}
        </Text>
      )
      // headerRight: <LogOut />
    };
  };

  componentDidMount() {
    // chiedo i dati delle routine al db
    // this.props.dispatch(getMostFrequentRoute());
    // carico eventuali routine ancora non salvate nel db

    const { infoProfile, infoProfileNotSave } = this.props.user;

    const info = { ...infoProfile, ...infoProfileNotSave };

    console.log(infoProfile);
    console.log(this.props.infoProfile);

    // se non ho info non salvate nel db, le metto in data

    this.setState(
      {
        weight: info.weight ? info.weight.toString() : strings("to_fill"),
        birthdate: info.birthdate
          ? info.birthdate.length
            ? info.birthdate
            : strings("to_fill")
          : strings("to_fill"),
        gender: info.gender ? info.gender : strings("prefer_not_to_s"),
        height: info.height ? info.height.toString() : strings("to_fill"),
        first_name: info.first_name ? info.first_name : strings("to_fill"),
        last_name: info.last_name ? info.last_name : strings("to_fill"),
        avatar: info.avatar <= 48 && info.avatar > 0 ? info.avatar : 1,
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
        poolingPassengerChoose: infoProfile.pooling_passenger ? "Yes" : "No",
        community: infoProfile.community
          ? infoProfile.community.id
            ? infoProfile.community.id
            : null
          : null,
        communityName: infoProfile.community
          ? infoProfile.community.name
            ? infoProfile.community.name
            : null
          : null,
        occupation: info.occupation ? info.occupation : strings("to_fill")
      },
      () => {
        console.log(this.state);
      }
    );
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
      setNotificationTime(value, this.state.choosed_week_days)
    );

    this.props.dispatch(setWeekDaysNotification(this.state.choosed_week_days));

    this.props.dispatch(
      UpdateProfile({
        data: {
          public_profile: {
            notification_schedule: this.state.notification_schedule
          }
        }
      })
    );

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
    this.sendNewChange();
  };

  ConvertId = value => {
    if (value === strings("male")) {
      return 1;
    } else if (value === strings("female")) {
      return 2;
    } else {
      return 0;
    }
  };

  ConvertOccupation = value => {
    if (value === strings("to_fill")) {
      return 0;
    } else if (value === strings("unemployed")) {
      return 1;
    } else if (value === strings("student")) {
      return 2;
    } else if (value === strings("employee")) {
      return 3;
    } else if (value === strings("freelancer")) {
      return 4;
    } else if (value === strings("entrepreneur")) {
      return 5;
    } else if (value === strings("homemaker")) {
      return 6;
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
              // ...this.state.data,
              private_profile: {
                weight: this.state.weight,
                birthdate: this.state.birthdate,
                // gender: this.state.gender,
                height: this.state.height,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                ...this.state.data
              },
              public_profile: {
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
                    text: strings("ok").toLocaleUpperCase(),
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
                      pushNotifications.cancelAllLocalNotifications();
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
        <Text style={styles.Left}>Schedule notification</Text>
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
          <View style={styles.other}>
            <View style={styles.session}>
              <Text style={styles.Left}>{strings("first_name")}</Text>
              <ChangeNameModalContent
                title={"Insert your first name"}
                placeholder={strings("first_name")}
                value={
                  this.state.first_name
                    ? this.state.first_name
                    : strings("to_fill")
                }
                type={"first_name"}
                changeState={this.changeState}
              />
            </View>
          </View>
          <View style={styles.other}>
            <View style={styles.session}>
              <Text style={styles.Left}>{strings("last_name")}</Text>
              <ChangeNameModalContent
                title={"Insert your last name"}
                placeholder={strings("last_name")}
                value={
                  this.state.last_name
                    ? this.state.last_name
                    : strings("to_fill")
                }
                type={"last_name"}
                changeState={this.changeState}
              />
            </View>
          </View>
          {/*
          <View style={styles.other}>
            <View style={styles.session}>
              <View style={styles.halfSession}>
                <Text style={styles.LeftTitle}>{strings("city")}</Text>
                <Text style={styles.LeftDescr}>
                  {strings("select_the_city")}
                </Text>
              </View>
              <View
                style={{
                  alignContent: "center",
                  justifyContent: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("ChangeCityScreen", {
                      changeState: this.changeState
                    });
                  }}
                  style={{
                    flexDirection: "row"
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "center",

                      fontFamily: "OpenSans-Regular",
                      fontWeight: "400",
                      fontSize: 13,
                      color: "#3D3D3D"
                    }}
                  >
                    {this.state.cityName
                      ? this.state.cityName
                      : strings("to_fill")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
           
            <ChangeCityModalContent
              title={strings("select_your_cit")}
              placeholder="City"
              value={
                this.state.cityName ? this.state.cityName : strings("to_fill")
              }
              type={"cityName"}
              changeState={this.changeState}
              cityId={this.state.city}
            /> 
            
          </View> 

          <View style={styles.other}>
            <View style={styles.session}>
              <View style={styles.halfSession}>
                <Text style={styles.LeftTitle}>{"Community"}</Text>
                <Text style={styles.LeftDescr}>
                  {"Partecipa a una communita"}
                </Text>
              </View>
              <ChangeCommunityModalContent
                title={strings("select_your_cit")}
                placeholder="Community"
                value={
                  this.state.communityName
                    ? this.state.communityName
                    : strings("to_fill")
                }
                type={"community"}
                changeState={this.changeState}
                communityId={this.state.community}
                dispatch={this.props.dispatch}
              />
            </View>
          </View>
          */}
          <View style={styles.other}>
            <View style={styles.session}>
              <View style={styles.halfSession}>
                <Text style={styles.LeftTitle}>{strings("date_of_birth")}</Text>
                <Text style={styles.LeftDescr}>
                  {strings("we_d_like_to_kn")}
                </Text>
              </View>
              <DatePicker
                value={
                  this.state.birthdate
                    ? this.state.birthdate
                    : strings("to_fill")
                }
                type={"birthdate"}
                changeState={this.changeState}
              />
            </View>
          </View>
          <View style={styles.other}>
            <View style={[styles.session]}>
              <View style={styles.halfSession}>
                <Text style={styles.LeftTitle}>{strings("gender")}</Text>
                <Text style={styles.LeftDescr}>
                  {strings("this_will_make_")}
                </Text>
              </View>
              <PickerModalContent
                value={
                  this.state.gender
                    ? typeof this.state.gender === "number"
                      ? select.gender[this.state.gender]
                      : this.state.gender
                    : strings("prefer_not_to_s")
                }
                type={"gender"}
                changeState={this.changeState}
                listValue={[
                  strings("prefer_not_to_s"),
                  strings("male"),
                  strings("female")
                ]}
                extraValue={""}
                function={this.ConvertId}
              />
            </View>
          </View>
          <View style={styles.other}>
            <View style={[styles.session]}>
              <View style={styles.halfSession}>
                <Text style={styles.LeftTitle}>{strings("occupation")}</Text>
                <Text style={styles.LeftDescr}>
                  {strings("this_will_help_")}
                </Text>
              </View>
              <PickerModalContent
                value={
                  this.state.occupation
                    ? typeof this.state.occupation === "number"
                      ? select.occupation[this.state.occupation]
                      : this.state.occupation
                    : strings("to_fill")
                }
                type={"occupation"}
                changeState={this.changeState}
                listValue={[
                  strings("to_fill"),
                  // strings("prefer_not_to_s"),
                  strings("unemployed"),
                  strings("student"),
                  strings("employee"),
                  strings("freelancer"),
                  strings("entrepreneur"),
                  strings("homemaker")
                ]}
                extraValue={""}
                function={this.ConvertOccupation}
              />
            </View>
          </View>
          <View style={styles.other}>
            <View style={styles.session}>
              <View style={styles.halfSession}>
                <Text style={styles.LeftTitle}>{strings("height")}</Text>
                <Text style={styles.LeftDescr}>
                  {strings("this_will_make_")}
                </Text>
              </View>
              <PickerModalContent
                value={
                  this.state.height !== "0"
                    ? this.state.height
                    : strings("to_fill")
                }
                type={"height"}
                changeState={this.changeState}
                listValue={select.height}
                extraValue={"cm"}
                function={parseInt}
              />
            </View>
          </View>
          <View style={styles.other}>
            <View style={styles.session}>
              <View style={styles.halfSession}>
                <Text style={styles.LeftTitle}>{strings("weight")}</Text>
                <Text style={styles.LeftDescr}>
                  {strings("this_will_make_")}
                </Text>
              </View>
              <PickerModalContent
                value={
                  this.state.weight !== "0"
                    ? this.state.weight
                    : strings("to_fill")
                }
                type={"weight"}
                changeState={this.changeState}
                listValue={select.weight}
                extraValue={"kg"}
                function={parseInt}
              />
            </View>
          </View>
          <View style={{ height: 200 }} />
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

export default withData(PersonalAnagraficDataScreen);

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
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    justifyContent: "center",
    borderTopColor: "#5F5F5F",
    borderTopWidth: 0.3,
    backgroundColor: "#fff"
  },
  last: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderTopColor: "#5F5F5F",
    borderTopWidth: 0.3
  },
  LeftFrequentRoute: {
    fontSize: 15,
    fontWeight: "bold"
    // alignSelf: "center",
    // textAlignVertical: "center",
    // flex: 1,
    // left: 20
  },
  Left: {
    alignSelf: "center",
    textAlignVertical: "center",
    flex: 1,
    fontSize: 12,
    fontWeight: "bold",

    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
  },
  LeftTitle: {
    alignSelf: "flex-start",
    textAlignVertical: "center",
    textAlign: "left",

    fontSize: 12,
    fontWeight: "bold",

    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
  },
  LeftDescr: {
    alignSelf: "auto",
    textAlignVertical: "center",
    textAlign: "left",

    fontSize: 11,

    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D"
  },
  session: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",

    height: Dimensions.get("window").height * 0.1,
    width: Dimensions.get("window").width * 0.9
  },
  halfSession: {
    width: Dimensions.get("window").width * 0.45
  },
  Right: {
    alignSelf: "center",
    right: 20,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },
  RightAndroid: {
    alignSelf: "center",
    right: 10
  },
  RightText: {
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
