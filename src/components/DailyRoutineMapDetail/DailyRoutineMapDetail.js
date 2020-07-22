import React from "react";
import {
  View,
  Text,
  Dimensions,
  Alert,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import MapView, { AnimatedRegion, Animated } from "react-native-maps";
import { connect } from "react-redux";
import { updateState } from "./../../domains/register/ActionCreators";
import { BoxShadow } from "react-native-shadow";
import InteractionManager from "../../helpers/loadingComponent";
import OnboardingWeekDay from "./../../components/WeekDayNotificationPicker/OnboardingWeekDay";
import { strings } from "../../config/i18n";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";
import Icon from "react-native-vector-icons/Ionicons";

// import MarkerRoutine from "../MarkerRoutine/MarkerRoutine"

// componente utile per selezionare la tratta effettuata dall'utente,
// selezionando punto inziale e finale

class DailyRoutineMapDetail extends React.Component {
  constructor() {
    super();
    this.mapRef = null;
    this.state = {
      points: [],
      type: ["Home", "Work", "Gym", "School", "Other"],
      selectType: [-1, -1],
      ButtonAndroid: -1,
      viewRef: null,
      load: false,
      visible: true,
      routine: {},
      frequent_type: [
        strings("id_0_140").toLocaleUpperCase(),
        strings("id_0_32").toLocaleUpperCase(),
        strings("id_0_33").toLocaleUpperCase(), // +1
        strings("id_0_139").toLocaleUpperCase(), // +2
      ],
    };
  }

  convertionModalType(value) {
    switch (value) {
      case this.state.frequent_type[0]:
        return 0;
        break;
      case this.state.frequent_type[1]:
        return 1;
        break;
      case this.state.frequent_type[2]:
        return 2;
        break;
      case this.state.frequent_type[3]:
        return 3;
        break;

      default:
        return 0;
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        load: true,
      });
    });
  }

  componentWillUnmount() {
    this.setState({
      load: false,
    });
  }

  componentWillMount() {
    const { navigation } = this.props;
    const routine = navigation.getParam("routine", []);

    console.log(routine);

    const { start_type, end_type, start_point, end_point } = routine;
    this.setState({
      points: [start_point, end_point],
      selectType: [start_type, end_type],
      routine,
    });
  }

  setDayWeek = (index) => {
    // let days = this.state.choosed_week_days;
    // days[index] = !days[index];

    // this.setState({
    //   choosed_week_days: days
    // });

    switch (index) {
      case 1:
        day = this.state.routine.monday;
        this.setState({
          routine: { ...this.state.routine, monday: !day },
        });
        break;
      case 2:
        day = this.state.routine.tuesday;
        this.setState({
          routine: { ...this.state.routine, tuesday: !day },
        });
        break;
      case 3:
        day = this.state.routine.wednesday;
        this.setState({
          routine: { ...this.state.routine, wednesday: !day },
        });
        break;
      case 4:
        day = this.state.routine.thursday;
        this.setState({
          routine: { ...this.state.routine, thursday: !day },
        });
        break;
      case 5:
        day = this.state.routine.friday;
        this.setState({
          routine: { ...this.state.routine, friday: !day },
        });
        break;
      case 6:
        day = this.state.routine.saturday;
        this.setState({
          routine: { ...this.state.routine, saturday: !day },
        });
        break;
      case 0:
        day = this.state.routine.sunday;
        this.setState({
          routine: { ...this.state.routine, sunday: !day },
        });
        break;

      default:
        break;
    }
  };

  renderWeekdays() {
    return (
      <View
        style={{
          marginTop: 15,
          width: Dimensions.get("window").width * 0.8,
          height: Dimensions.get("window").height * 0.125,
          justifyContent: "flex-start",
          alignItems: "center",
          alignSelf: "flex-start",
          paddingHorizontal: 15,
        }}
      >
        <View style={styles.ftTypes}>
          <Text style={styles.ftText}>
            {this.state.frequent_type[this.state.routine.start_type]}
          </Text>
          <Text style={styles.ftTypeText}>{" < > "}</Text>
          <Text style={styles.ftText}>
            {this.state.frequent_type[this.state.routine.end_type]}
          </Text>
        </View>
        <View style={styles.weekDayContainer}>
          <OnboardingWeekDay
            index={1}
            dayName={strings("id_0_35").toLocaleUpperCase()}
            // onPress={this.setDayWeek}
            onPress={() => {}}
            selected={this.state.routine.monday}
            detailScreen={true}
          />
          <OnboardingWeekDay
            index={2}
            dayName={strings("id_0_36").toLocaleUpperCase()}
            // onPress={this.setDayWeek}
            onPress={() => {}}
            selected={this.state.routine.tuesday}
            detailScreen={true}
          />
          <OnboardingWeekDay
            index={3}
            dayName={strings("id_0_37").toLocaleUpperCase()}
            selected={this.state.routine.wednesday}
            // onPress={this.setDayWeek}
            onPress={() => {}}
            detailScreen={true}
          />
          <OnboardingWeekDay
            index={4}
            dayName={strings("id_0_38").toLocaleUpperCase()}
            selected={this.state.routine.thursday}
            // onPress={this.setDayWeek}
            onPress={() => {}}
            detailScreen={true}
          />
          <OnboardingWeekDay
            index={5}
            dayName={strings("id_0_39").toLocaleUpperCase()}
            selected={this.state.routine.friday}
            // onPress={this.setDayWeek}
            onPress={() => {}}
            detailScreen={true}
          />
          <OnboardingWeekDay
            index={6}
            dayName={strings("id_0_40").toLocaleUpperCase()}
            selected={this.state.routine.saturday}
            // onPress={this.setDayWeek}
            onPress={() => {}}
            detailScreen={true}
          />
          <OnboardingWeekDay
            index={0}
            dayName={strings("id_0_41").toLocaleUpperCase()}
            selected={this.state.routine.sunday}
            // onPress={this.setDayWeek}
            onPress={() => {}}
            detailScreen={true}
          />
        </View>
      </View>
    );
  }

  ReturnPoints = () => {
    {
      const points = this.state.points.map((item, num) => (
        <MapView.Marker
          calloutVisible={true}
          onCalloutVisibleChange={(visible) => this.setState({ visible })}
          title={this.state.type[this.state.selectType[num] - 1]}
          key={num}
          coordinate={{
            latitude: item.latitude,
            longitude: item.longitude,
          }}
          image={
            num
              ? require("./../../assets/images/Map_pin_2.png")
              : require("./../../assets/images/Map_pin_1.png")
          }
          anchor={{ x: 0.5, y: 0.5 }}
        />
      ));

      return points;
    }
  };

  ReturnCircles = () => {
    {
      const circles = this.state.points.map((item, num) => (
        <MapView.Circle
          key={num}
          center={{
            latitude: item.latitude,
            longitude: item.longitude,
          }}
          radius={100}
          fillColor="rgba(255, 255, 255, 0.52)"
          strokeColor="rgba(0, 0, 0, 0.33)"
          zIndex={-1}
        />
      ));
      return circles;
    }
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0,
          }}
        >
          {strings("id_6_01")}
        </Text>
      ),
    };
  };

  getImagePath = (label) => {
    switch (label) {
      case "walk":
        return require("../../assets/images/onboarding-walk.png");
      case "bike":
        return require("../../assets/images/onboarding-bike.png");
      case "bus":
        return require("../../assets/images/onboarding-bus.png");
      case "car":
        return require("../../assets/images/onboarding-car.png");
      case "motorbike":
        return require("../../assets/images/onboarding-moto.png");
      case "train":
        return require("../../assets/images/onboarding-train.png");
      case "car_pooling": // car_pooling dal 15/02/2019 diventa train
        return require("../../assets/images/carpooling_icn.png");
      default:
        return require("../../assets/images/onboarding-walk.png");
    }
  };

  renderImages() {
    let array_sliders = [
        {
          label: "walk",
          value: this.state.routine.walk_slider,
        },
        {
          label: "bike",
          value: this.state.routine.bike_slider,
        },
        {
          label: "bus",
          value: this.state.routine.bus_slider,
        },
        {
          label: "car",
          value: this.state.routine.car_slider,
        },
        {
          label: "motorbike",
          value: this.state.routine.motorbike_slider,
        },
        {
          label: "train",
          value: this.state.routine.train_slider,
        },
      ],
      count_values = 0;

    array_sliders.forEach((element) => {
      if (element.value > 0) count_values++;
    });

    if (count_values > 3) {
      let array_sliders_2 = array_sliders.splice(3);
      return (
        <View>
          <View style={styles.imagesContainer}>
            {array_sliders.map((e, i) => (
              <Image
                key={e.label}
                style={{
                  width: 80,
                  height: 80,
                }}
                source={this.getImagePath(e.label)}
              />
            ))}
          </View>
          <View style={styles.imagesContainer}>
            {array_sliders_2.map((e, i) => (
              <Image
                key={e.label}
                style={{
                  width: 80,
                  height: 80,
                }}
                source={this.getImagePath(e.label)}
              />
            ))}
          </View>
        </View>
      );
    } else {
      let array_sliders_2 = array_sliders.filter((e) => {
        return e.value > 0;
      });
      return (
        <View>
          <View style={styles.imagesContainer}>
            {array_sliders_2.map((e, i) => (
              <Image
                key={e.label}
                style={{
                  width: 80,
                  height: 80,
                }}
                source={this.getImagePath(e.label)}
              />
            ))}
          </View>
        </View>
      );
    }
  }

  renderTimeBox() {
    return (
      <View style={styles.timeContainer}>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1 }}
          locations={[0, 1.0]}
          colors={
            this.props.detailScreen
              ? ["#7D4D99", "#6497CC"]
              : ["#7D4D99", "#6497CC"]
          }
          style={[styles.gradientIcon]}
        >
          <OwnIcon name={"onboarding-time_icn"} size={20} color={"#fff"} />
        </LinearGradient>
        <View style={styles.timeView}>
          <Text style={styles.startTimeText}>
            {this.state.routine.start_time.substring(0, 5)}
          </Text>
          <Text style={styles.slashTimeText}>{" / "}</Text>
          <Text style={styles.endTimeText}>
            {this.state.routine.end_time.substring(0, 5)}
          </Text>
        </View>
      </View>
    );
  }

  renderAbsoluteLG() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.navigation.navigate("ChangeFrequentTripScreen", {
            routine: { ...this.state.routine },
          });
        }}
      >
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1 }}
          locations={[0, 1.0]}
          colors={
            this.props.detailScreen
              ? ["#7D4D99", "#6497CC"]
              : ["#7D4D99", "#6497CC"]
          }
          style={styles.absGradientIcon}
        >
          <OwnIcon name={"onboarding-gdpr-pencil"} size={40} color={"#fff"} />
        </LinearGradient>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    let MaxLatitude = Math.max.apply(null, [
      this.state.points[0].latitude,
      this.state.points[1].latitude,
    ]);
    let MaxLongitude = Math.max.apply(null, [
      this.state.points[0].longitude,
      this.state.points[1].longitude,
    ]);
    let MinLatitude = Math.min.apply(null, [
      this.state.points[0].latitude,
      this.state.points[1].latitude,
    ]);
    let MinLongitude = Math.min.apply(null, [
      this.state.points[0].longitude,
      this.state.points[1].longitude,
    ]);

    let shadowOpt;
    if (Platform.OS == "ios")
      shadowOpt = {
        width: Dimensions.get("window").width * 0.68,
        height: 40,
        color: "#555",
        border: 8,
        radius: 5,
        opacity: 0.25,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: 0,
        },
      };
    else
      shadowOpt = {
        width: Dimensions.get("window").width * 0.68,
        height: 40,
        color: "#444",
        border: 6,
        radius: 5,
        opacity: 0.35,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: 0,
        },
      };
    return (
      <View style={styles.mainContainer}>
        {this.state.load ? (
          <MapView
            ref={(ref) => {
              this.mapRef = ref;
            }}
            style={styles.mapContainer}
            onMapReady={() =>
              this.mapRef.fitToCoordinates(
                [
                  {
                    latitude: MinLatitude - 0.001,
                    longitude: MinLongitude - 0.001,
                  },
                  {
                    latitude: MaxLatitude + 0.001,
                    longitude: MaxLongitude + 0.001,
                  },
                ],
                {
                  edgePadding: { top: 40, right: 20, bottom: 80, left: 20 },
                  animated: false,
                }
              )
            }
            loadingEnabled
          >
            {this.ReturnPoints()}
            {this.ReturnCircles()}
          </MapView>
        ) : (
          <View />
        )}

        {/**/}
        {this.renderWeekdays()}
        {this.renderTimeBox()}
        {this.renderImages()}
        {this.renderAbsoluteLG()}
      </View>
    );
  }
}

const withDailyRoutine = connect((state) => {
  return {
    latitude: state.register.latitude ? state.register.latitude : 38.1146969,
    longitude: state.register.longitude ? state.register.longitude : 13.3650935,
    mostFrequentRaceFrequencyPosition: state.register
      .mostFrequentRaceFrequencyPosition
      ? state.register.mostFrequentRaceFrequencyPosition
      : null,
  };
});

export default withDailyRoutine(DailyRoutineMapDetail);

const styles = StyleSheet.create({
  absGradientIcon: {
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: Dimensions.get("window").height * 0.4 - 30,
    right: 40,
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
  },
  imagesContainer: {
    height: 80,
    width: Dimensions.get("window").width * 0.9,
    alignSelf: "center",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  timeContainer: {
    height: 40,
    width: Dimensions.get("window").width,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  gradientIcon: {
    height: 40,
    width: Dimensions.get("window").width * 0.15,
    justifyContent: "center",
    alignItems: "flex-end",
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: 9,
  },
  timeView: {
    height: 40,
    width: Dimensions.get("window").width * 0.3,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: 10,
  },
  startTimeText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3d3d3d",
  },
  slashTimeText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3d3d3d",
  },
  endTimeText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3d3d3d",
  },
  ftText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 13,
    color: "#3d3d3d",
  },
  ftTypeText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3d3d3d",
  },
  ftTypes: {
    width: Dimensions.get("window").width * 0.8,
    height: 30,
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  weekDayContainer: {
    // marginTop: 120,
    height: 40,
    width: 280,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  mainContainer: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    backgroundColor: "#fff",
  },
  mapContainer: {
    height: Dimensions.get("window").height * 0.4,
    width: Dimensions.get("window").width,
    backgroundColor: "#f7f8f9",
  },
  paginationDots: {
    height: 16,
    margin: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  leftButtonContainer: {
    position: "absolute",
    left: 0,
  },
  rightButtonContainer: {
    position: "absolute",
    right: 0,
  },
  bottomButtonContainer: {
    height: 44,
    marginHorizontal: 16,
  },
  bottomButton: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, .3)",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    backgroundColor: "transparent",
    color: "white",
    fontSize: 18,
    padding: 16,
  },
  buttonContainer: {
    width: Dimensions.get("window").width,
    height: 60,
    backgroundColor: "transparent",
    position: "absolute",
    bottom:
      Dimensions.get("window").height -
      Dimensions.get("window").height * 0.7 -
      160,
    justifyContent: "flex-start",
    alignItems: "center",
    shadowRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
  },
  buttonBox: {
    width: Dimensions.get("window").width * 0.68,
    height: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
  },
  buttonGoOnText: {
    color: "#3363AD",
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
  },
});
