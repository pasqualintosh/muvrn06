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
import {
  frequentTripsState,
  frequentTripsNotSaveState
} from "./../../domains/login/Selectors.js";
import { data } from "./../../assets/ListCities";

// <View style={{ paddingBottom: Dimensions.get("window").height / 10 }} />
// aggiungere un po di padding alla fine cosi è possibile vedere tutti gli elementti
// anche se c'e la notifica e l'onda

import {
  postMostFrequentRouteNotSave,
  updateProfileNew,
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
  BikeSharingChoose: [strings("id_14_04"), strings("id_14_03")],
  CarSharingChoose: [strings("id_14_04"), strings("id_14_03")],
  localTransportSubscriberChoose: ["No", "Monthly", "Annual"],
  trainTransportSubscriberChoose: ["No", "Monthly", "Annual"],
  poolingPilotChoose: [strings("id_14_04"), strings("id_14_03")],
  poolingPassengerChoose: [strings("id_14_04"), strings("id_14_03")],
  employment: [
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
  gender: [strings("id_13_22"), strings("id_13_20"), strings("id_13_21")],
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
      BikeSharingService: [strings("id_14_04"), strings("id_14_03")],
      BikeSharingChoose: "No",
      CarSharingService: [strings("id_14_04"), strings("id_14_03")],
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
      date_of_birth: "",
      data: {},
      gender: strings("id_13_22"),
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
          {strings("id_13_03")}
        </Text>
      )
      // headerRight: <LogOut />
    };
  };

  componentDidMount() {
    console.log(this.state.date_of_birth);

    // chiedo i dati delle routine al db
    // this.props.dispatch(getMostFrequentRoute());
    // carico eventuali routine ancora non salvate nel db

    const { infoProfile, infoProfileNotSave } = this.props.user;

    const info = { ...infoProfile, ...infoProfileNotSave };

    // se non ho info non salvate nel db, le metto in data

    this.setState(
      {
        weight: info.weight ? info.weight.toString() : "-",
        date_of_birth: info.date_of_birth
          ? info.date_of_birth.length
            ? info.date_of_birth
            : strings("to_fill")
          : strings("to_fill"),
        gender: info.gender ? info.gender : "-",
        height: info.height ? info.height.toString() : "-",
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
        // prendo il nome della città dal file json
        cityName: infoProfile.city
          ? data.cities[infoProfile.city - 1]
            ? data.cities[infoProfile.city - 1].name
            : strings("id_13_67")
          : strings("id_13_67"),
        city: infoProfile.city ? infoProfile.city : 0,
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
        employment: info.employment ? info.employment : strings("to_fill")
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

  // da string a   03/02/2020
  conversDate = string => {
    console.log(string);
    // const date = moment(string).format('L')
    // const date = new Date(string).toISOString().substring(0, 10)

    date = new Date(string);
    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();

    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }

    dateTot = year + "-" + month + "-" + dt;

    console.log(dateTot);
    return dateTot;
  };

  ConvertId = value => {
    if (value === strings("id_13_20")) {
      return 1;
    } else if (value === strings("id_13_21")) {
      return 2;
    } else {
      return 0;
    }
  };

  Convertemployment = value => {
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
          updateProfileNew({
            data: this.state.data
            // {
            //   first_name: this.state.first_name,
            //   last_name: this.state.last_name,
            //   date_of_birth: this.state.date_of_birth,
            //   gender: this.state.gender,
            //   employment: this.state.employment,
            //   weight: this.state.weight,
            //   height: this.state.height
            // }
          })
        );

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
              <Text style={styles.Left}>{strings("id_0_14")}</Text>
              <ChangeNameModalContent
                title={strings("id_0_14")}
                placeholder={strings("id_0_14")}
                value={this.state.first_name ? this.state.first_name : "-"}
                type={"first_name"}
                changeState={this.changeState}
              />
            </View>
          </View>
          <View style={styles.other}>
            <View style={styles.session}>
              <Text style={styles.Left}>{strings("id_0_16")}</Text>
              <ChangeNameModalContent
                title={strings("id_0_16")}
                placeholder={strings("id_0_16")}
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

          <View style={styles.other}>
            <View style={styles.session}>
              <View style={styles.halfSession}>
                <Text style={styles.LeftTitle}>{strings("id_13_65")}</Text>
                <Text style={styles.LeftDescr}>
                  {strings("id_13_66")}
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
                    alignSelf: "center",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignContent: "center",
                    alignItems: "center",
                    height: Dimensions.get("window").height * 0.1,
                    width: Dimensions.get("window").width * 0.45
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
                      : strings("id_13_67")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* 

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
                <Text style={styles.LeftTitle}>{strings("id_13_14")}</Text>
                <Text style={styles.LeftDescr}>{strings("id_13_15")}</Text>
              </View>
              <DatePicker
                value={
                  this.state.date_of_birth
                    ? this.state.date_of_birth
                    : strings("to_fill")
                }
                type={"date_of_birth"}
                changeState={this.changeState}
                function={this.conversDate}
              />
            </View>
          </View>
          <View style={styles.other}>
            <View style={[styles.session]}>
              <View style={styles.halfSession}>
                <Text style={styles.LeftTitle}>{strings("id_13_16")}</Text>
                <Text style={styles.LeftDescr}>{strings("id_13_17")}</Text>
              </View>
              <PickerModalContent
                value={
                  this.state.gender
                    ? typeof this.state.gender === "number"
                      ? select.gender[this.state.gender]
                      : this.state.gender
                    : "-"
                }
                type={"gender"}
                changeState={this.changeState}
                listValue={[
                  strings("id_13_22"),
                  strings("id_13_20"),
                  strings("id_13_21")
                ]}
                extraValue={""}
                function={this.ConvertId}
              />
            </View>
          </View>
          {/* <View style={styles.other}>
            <View style={[styles.session]}>
              <View style={styles.halfSession}>
                <Text style={styles.LeftTitle}>{strings("occupation")}</Text>
                <Text style={styles.LeftDescr}>
                  {strings("this_will_help_")}
                </Text>
              </View>
              <PickerModalContent
                value={
                  this.state.employment
                    ? typeof this.state.employment === "number"
                      ? select.employment[this.state.employment]
                      : this.state.employment
                    : strings("to_fill")
                }
                type={"employment"}
                changeState={this.changeState}
                listValue={[
                  strings("to_fill"),
                  // strings("id_13_22"),
                  strings("unemployed"),
                  strings("student"),
                  strings("employee"),
                  strings("freelancer"),
                  strings("entrepreneur"),
                  strings("homemaker")
                ]}
                extraValue={""}
                function={this.Convertemployment}
              />
            </View>
          </View> */}
          <View style={styles.other}>
            <View style={styles.session}>
              <View style={styles.halfSession}>
                <Text style={styles.LeftTitle}>{strings("id_13_18")}</Text>
                <Text style={styles.LeftDescr}>{strings("id_13_17")}</Text>
              </View>
              <PickerModalContent
                value={this.state.height !== "0" ? this.state.height : "-"}
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
                <Text style={styles.LeftTitle}>{strings("id_13_19")}</Text>
                <Text style={styles.LeftDescr}>{strings("id_13_17")}</Text>
              </View>
              <PickerModalContent
                value={this.state.weight !== "0" ? this.state.weight : "-"}
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
    routine: frequentTripsState(state),
    routineNotSave: frequentTripsNotSaveState(state),
    user: state.login,
    infoProfile: state.login.infoProfile
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
