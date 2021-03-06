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
import PickerModalContentMobility from "./../../components/PickerModalContentMobility/PickerModalContentMobility";
import DatePicker from "./../../components/DatePicker/DatePicker";
import TimePicker from "./../../components/TimePicker/TimePicker";
import ChangeNameModalContent from "./../../components/ChangeNameModalContent/ChangeNameModalContent";
import ChangeCityModalContent from "./../../components/ChangeCityModalContent/ChangeCityModalContent";
import MobilityHabitsPicker from "./../../components/MobilityHabitsPicker/MobilityHabitsPicker";
import Switch from "react-native-switch-pro";
import { images } from "./../../components/InfoUserHome/InfoUserHome";
import { Tester } from "./../../config/Tester";
import { pushNotifications } from "./../../services/";
import Icon from "react-native-vector-icons/Ionicons";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

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
import {
  frequentTripsState,
  frequentTripsNotSaveState
} from "./../../domains/login/Selectors.js";

import { strings } from "../../config/i18n";

// tipi di scelte
const select = {
  bikeChoose: [
    "",
    "City Bike",
    "Mountain Bike",
    "Racing Bike",
    "BMX",
    "Foldable Bike",
    "E-Bike",
    "Not Selected"
  ],
  BikeSharingChoose: ["No", "Yes"],
  CarSharingChoose: ["No", "Yes"],
  localTransportSubscriberChoose: [
    "No",
    "Monthly",
    "Annual",
    "Occasional User"
  ],
  trainTransportSubscriberChoose: [
    "No",
    "Monthly",
    "Annual",
    "Occasional User"
  ],
  poolingPilotChoose: ["No", "Yes"],
  carPoolingChoose: ["No", "Pilot", "Passenger", "Both"],
  motoPoolingChoose: ["No", "Pilot", "Passenger", "Both"],
  poolingPassengerChoose: ["No", "Yes"],
  rideSharingChoose: ["No", "Yes"],
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

class PersonalMobilityDataScreen extends React.Component {
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
      bikeChoose: "No",
      trainTransportSubscriberChoose: "No",
      localTransportSubscriberChoose: "No",
      localTransportSubscriberService: ["No", "Monthly", "Annual"],
      trainTransportSubscriberService: ["No", "Monthly", "Annual"],
      poolingPilotChoose: "No",
      carPoolingChoose: "No",
      motoPoolingChoose: "No",
      rideSharingChoose: "No",
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
      setted_bike: false,
      setted_car: false,
      setted_moto: false,
      setted_tpl: false,
      setted_pooling: false,
      setted_sharing: false
    };
  }

  componentDidMount() {
    // chiedo i dati delle routine al db
    // this.props.dispatch(getMostFrequentRoute());
    // carico eventuali routine ancora non salvate nel db

    const { infoProfile, infoProfileNotSave } = this.props.user;

    const info = { ...infoProfile, ...infoProfileNotSave };

    console.log(infoProfile);
    console.log(
      infoProfile.moto != {} && infoProfile.moto != undefined ? true : false
    );

    let setted_tpl = false;
    if (
      infoProfile.lpt_user != undefined &&
      infoProfile.train_user != undefined
    )
      setted_tpl = true;

    let setted_pooling = false;
    if (
      infoProfile.car_pooler != undefined &&
      infoProfile.moto_pooler != undefined
    )
      setted_pooling = true;

    let setted_sharing = false;
    if (
      infoProfile.bike_sharing_user != undefined &&
      infoProfile.car_sharing_user != undefined &&
      infoProfile.scooter_sharing_user != undefined
    )
      setted_sharing = true;

    // se non ho info non salvate nel db, le metto in data

    this.setState(
      {
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
          infoProfile.lpt_user
        ),
        localTransportSubscriberChoose: this.getLocalTransportChoose(
          infoProfile.lpt_user
        ),
        BikeSharingChoose: infoProfile.bike_sharing_user ? "Yes" : "No",
        CarSharingChoose: infoProfile.car_sharing_user ? "Yes" : "No",
        poolingPilotChoose: infoProfile.pooling_pilot ? "Yes" : "No", // da non considerare piu'
        poolingPassengerChoose: infoProfile.pooling_passenger ? "Yes" : "No", // da non considerare piu'
        carPoolingChoose: infoProfile.car_pooling
          ? this.getPoolingChoose(infoProfile.car_pooling)
          : "No",
        motoPoolingChoose: infoProfile.moto_pooling
          ? this.getPoolingChoose(infoProfile.moto_pooling)
          : "No",
        rideSharingChoose: infoProfile.ride_sharing_user ? "Yes" : "No",
        bikeChoose: infoProfile.bike_tipology
          ? select.bikeChoose[infoProfile.bike_tipology]
          : "No",
        setted_car:
          infoProfile.car_user != {} && infoProfile.car_user != undefined
            ? true
            : false,
        setted_moto:
          infoProfile.motorbike_user != {} &&
          infoProfile.motorbike_user != undefined
            ? true
            : false,
        setted_bike: infoProfile.bike != undefined ? true : false,
        setted_tpl,
        setted_pooling,
        setted_sharing
      },
      () => {
        console.log(this.state);
      }
    );
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

      case "Occasional User":
        return 3;
        break;

      default:
        return 0;
        break;
    }
  };

  getPoolingValue = v => {
    switch (v) {
      case "No":
        return 0;
        break;

      case "Pilot":
        return 1;
        break;

      case "Passenger":
        return 2;
        break;

      case "Both":
        return 3;
        break;

      default:
        return 0;
        break;
    }
  };

  getPoolingChoose = v => {
    switch (v) {
      case 0:
        return "No";
        break;

      case 1:
        return "Pilot";
        break;

      case 2:
        return "Passenger";
        break;

      case 3:
        return "Both";
        break;

      default:
        return "No";
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

      case 3:
        return "Occasional User";
        break;

      default:
        return "No";
        break;
    }
  };

  getBikeValue = v => {
    switch (v) {
      case select.bikeChoose[0]:
        return 0;
        break;

      case select.bikeChoose[1]:
        return 1;
        break;

      case select.bikeChoose[2]:
        return 2;
        break;

      case select.bikeChoose[3]:
        return 4;
        break;

      case select.bikeChoose[4]:
        return 4;
        break;

      case select.bikeChoose[5]:
        return 5;
        break;

      case select.bikeChoose[6]:
        return 6;
        break;

      case select.bikeChoose[7]:
        return 7;
        break;

      default:
        return 0;
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

  ConvertId = value => {
    if (value === "Male") {
      return 1;
    } else if (value === "Female") {
      return 2;
    } else {
      return 0;
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

  returnOkImage(type) {
    switch (type) {
      case "car":
        return require("./../../assets/images/garage_icons/car_garage_ok.png");

      case "moto":
        return require("./../../assets/images/garage_icons/motorcycle_garage_ok.png");

      default:
        return require("./../../assets/images/garage_icons/car_garage_ok.png");
    }
  }

  returnBWImage(type) {
    switch (type) {
      case "car":
        return require("./../../assets/images/garage_icons/car_garage.png");

      case "moto":
        return require("./../../assets/images/garage_icons/motorcycle_garage.png");

      default:
        return require("./../../assets/images/garage_icons/car_garage.png");
    }
  }

  renderCheckIcn(type) {
    if (this.state["setted_" + type] == true)
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 60,
            flexDirection: "row"
          }}
        >
          <Image
            style={{
              width: 50,
              height: 50
            }}
            source={this.returnOkImage(type)}
          />
          <Icon name="ios-arrow-forward" size={15} color="#3D3D3D" />
        </View>
      );
    else
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 60,
            flexDirection: "row"
            // backgroundColor: "#e33"
          }}
        >
          {/* <Icon name="md-arrow-forward" size={18} color="#3D3D3D" /> */}
          <Image
            style={{
              width: 50,
              height: 50
            }}
            source={this.returnBWImage(type)}
          />
          <Icon name="ios-arrow-forward" size={15} color="#3D3D3D" />
        </View>
      );
  }

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
          <View
            style={[
              styles.other,
              { justifyContent: "center", alignItems: "center" }
            ]}
          >
            <View style={styles.session}>
              <View
                style={{
                  alignSelf: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  // height: Dimensions.get("window").height * 0.125,
                  width: Dimensions.get("window").width * 0.9 - 35,
                  marginTop: 5,
                  marginBottom: 5
                }}
              >
                <OwnIcon name={"garage_icn"} size={35} color={"#000000"} />

                <View style={{ marginLeft: 10, marginRight: 10 }}>
                  <Text style={[styles.iconText, { color: "#3d3d3d" }]}>
                    {strings("_755_share_something")}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.other}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.navigation.navigate("BikeScreen");
              }}
            >
              <View style={styles.session}>
                {/* <View
                  style={{
                    width: Dimensions.get("window").width * 0.15,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Image
                    source={require("../../assets/images/bike_icn.png")}
                    style={{ width: 30, height: 30 }}
                  />
                </View> */}
                <View style={styles.descriptionContainer}>
                  <Text style={styles.Left}>{strings("bike")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("the_best_human_")}
                  </Text>
                </View>
                <PickerModalContentMobility
                  value={this.state.bikeChoose}
                  type={"bikeChoose"}
                  changeState={this.changeState}
                  listValue={select.bikeChoose}
                  extraValue={""}
                  navigate={() => {
                    this.props.navigation.navigate("BikeScreen");
                  }}
                  setted={this.state.setted_bike}
                  mode={"bike"}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.other}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.navigation.navigate("TplScreen");
              }}
            >
              <View style={styles.session}>
                {/* <View
                  style={{
                    width: Dimensions.get("window").width * 0.15,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Image
                    source={require("../../assets/images/bus_icn.png")}
                    style={{ width: 30, height: 30 }}
                  />
                </View> */}
                <View style={styles.descriptionContainer}>
                  <Text style={styles.Left}>
                    {/* {strings("local_public_tr.toLocaleLowerCase()} */}
                    {strings("local_public_tr")
                      .charAt(0)
                      .toUpperCase() +
                      strings("local_public_tr")
                        .toLocaleLowerCase()
                        .slice(1)}
                  </Text>
                  <Text style={styles.leftDescription}>
                    {strings("they_move_smoot")}
                  </Text>
                </View>
                <PickerModalContentMobility
                  value={this.state.localTransportSubscriberChoose}
                  type={"localTransportSubscriberChoose"}
                  changeState={this.changeState}
                  listValue={select.localTransportSubscriberChoose}
                  extraValue={""}
                  navigate={() => {
                    this.props.navigation.navigate("TplScreen");
                  }}
                  setted={this.state.setted_tpl}
                  mode={"tpl"}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.other}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.navigation.navigate("EditCarFuelScreen");
              }}
            >
              <View style={styles.session}>
                {/* 
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.15,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Image
                    source={require("../../assets/images/onboarding-car.png")}
                    style={{ width: 40, height: 40 }}
                  />
                </View>
                 */}
                <View style={[styles.descriptionContainer, { left: 0 }]}>
                  <Text style={styles.Left}>{strings("_757_car")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("for_some_people")}
                  </Text>
                </View>
                {this.renderCheckIcn("car")}
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.other}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.navigation.navigate("EditMotoSegmentScreen");
              }}
            >
              <View style={styles.session}>
                {/* 
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.15,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Image
                    source={require("../../assets/images/moto_icn.png")}
                    style={{ width: 40, height: 40 }}
                  />
                </View> 
                */}
                <View style={[styles.descriptionContainer, { left: 0 }]}>
                  <Text style={styles.Left}>{strings("motorcycle")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("the_best_invent")}
                  </Text>
                </View>
                {this.renderCheckIcn("moto")}
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.other}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.navigation.navigate("PoolingScreen");
              }}
            >
              <View style={styles.session}>
                {/* <View
                  style={{
                    width: Dimensions.get("window").width * 0.15,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Image
                    source={require("../../assets/images/carpooling_icn.png")}
                    style={{ width: 40, height: 40 }}
                  />
                </View> */}
                <View style={styles.descriptionContainer}>
                  <Text style={styles.Left}>{strings("pooling")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("an_arrangement_")}
                  </Text>
                </View>
                <PickerModalContentMobility
                  value={this.state.carPoolingChoose}
                  type={"carPoolingChoose"}
                  changeState={this.changeState}
                  listValue={select.carPoolingChoose}
                  extraValue={""}
                  navigate={() => {
                    this.props.navigation.navigate("PoolingScreen");
                  }}
                  setted={this.state.setted_pooling}
                  mode={"pooling"}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.other}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.navigation.navigate("SharingScreen");
              }}
            >
              <View style={styles.session}>
                {/* <View
                  style={{
                    width: Dimensions.get("window").width * 0.15,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Image
                    source={require("../../assets/images/car_sharing_icn.png")}
                    style={{ width: 40, height: 40 }}
                  />
                </View> */}
                <View style={styles.descriptionContainer}>
                  <Text style={styles.Left}>{strings("sharing")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("a_service_in_wh")}
                  </Text>
                </View>
                <PickerModalContentMobility
                  value={this.state.rideSharingChoose}
                  type={"rideSharingChoose"}
                  changeState={this.changeState}
                  listValue={select.rideSharingChoose}
                  extraValue={""}
                  navigate={() => {
                    // this.props.navigation.navigate("EndMobilityScreen");
                    this.props.navigation.navigate("SharingScreen");
                  }}
                  setted={this.state.setted_sharing}
                  mode={"sharing"}
                />
              </View>
            </TouchableWithoutFeedback>
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

export default withData(PersonalMobilityDataScreen);

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
    // height: Dimensions.get("window").height * 0.125,
    flexDirection: "row",
    borderTopColor: "#5F5F5F",
    borderTopWidth: 0.3,
    backgroundColor: "#fff"
  },
  sessionStart: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    // height: Dimensions.get("window").height * 0.125,
    width: Dimensions.get("window").width * 0.9
    // paddingVertical: 13
  },
  session: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    flex: 1,
    // height: Dimensions.get("window").height * 0.125,
    width: Dimensions.get("window").width,
    paddingVertical: 13
  },
  halfSession: {
    width: Dimensions.get("window").width * 0.45
  },
  last: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderTopColor: "#5F5F5F",
    borderTopWidth: 0.3
  },
  LeftFrequentRoute: {
    // alignSelf: "center",
    // textAlignVertical: "center",
    // flex: 1,
    fontSize: 15,
    fontWeight: "bold"
    // left: 20
  },
  Left: {
    // alignSelf: "center",
    // textAlignVertical: "center",
    flex: 1,
    fontSize: 12,
    fontWeight: "bold",
    // left: 20,
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
  },
  leftDescription: {
    // alignSelf: "auto",
    // textAlignVertical: "center",
    // textAlign: "left",
    fontSize: 11,
    // left: 20,
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D"
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
  },
  descriptionContainer: {
    alignSelf: "center",
    left: 0,
    // height: 60,
    width: Dimensions.get("window").width * 0.7
  }
});
