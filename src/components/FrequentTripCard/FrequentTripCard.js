import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Image,
  ImageBackground,
  NativeModules,
  Share,
  ScrollView,
  TouchableHighlight,
  Alert,
} from "react-native";
import CardFlip from "react-native-card-flip";

import ProfileScreenCardsFooter from "./../ProfileScreenCardsFooter/ProfileScreenCardsFooter";
import OnboardingWeekDay from "./../../components/WeekDayNotificationPicker/OnboardingWeekDay";
import { connect } from "react-redux";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";

import InteractionManager from "../../helpers/loadingComponent";
import MapView, { AnimatedRegion, Animated } from "react-native-maps";
import { StackedAreaChart } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { strings } from "../../config/i18n";
import { deleteMostFrequentRoute } from "./../../domains/login/ActionCreators";
import Aux from "../../helpers/Aux";
import Modal from "react-native-modal";

class FrequentTripCard extends React.Component {
  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const routine = navigation.getParam("routine", null);

    if (routine) {
      console.log(routine);
      const routineLength = navigation.getParam("routineLength", 0);
      console.log(routineLength);

      const { start_type, end_type, start_point, end_point } = routine;
      this.state = {
        isModalVisible: false,
        type: ["Home", "Work", "Gym", "School", "Other"],
        points: [start_point, end_point],
        selectType: [start_type, end_type],
        ButtonAndroid: -1,
        viewRef: null,
        load: false,
        visible: true,
        routine,
        routineLength,
        frequent_type: [
          strings("id_0_140").toLocaleUpperCase(),
          strings("id_0_32").toLocaleUpperCase(),
          strings("id_0_33").toLocaleUpperCase(), // +1
          strings("id_0_139").toLocaleUpperCase(), // +2
        ],
      };
    } else {
      this.state = {
        isModalVisible: false,
        points: [],
        type: ["Home", "Work", "Gym", "School", "Other"],
        selectType: [-1, -1],
        ButtonAndroid: -1,
        viewRef: null,
        load: false,
        visible: true,
        routine: {},
        routineLength: 0,
        frequent_type: [
          strings("id_0_140").toLocaleUpperCase(),
          strings("id_0_32").toLocaleUpperCase(),
          strings("id_0_33").toLocaleUpperCase(), // +1
          strings("id_0_139").toLocaleUpperCase(), // +2
        ],
      };
    }
  }

  // componentWillReceiveProps(nextProps) {

  // }

  // componentWillMount() {
  //   const { navigation } = this.props;
  //   const routine = navigation.getParam("routine", []);

  //   const { start_type, end_type, start_point, end_point } = routine;
  //   console.log("ciao");

  //   const routineLength = navigation.getParam("routineLength", 0);
  //   console.log(routineLength);

  //   this.setState({
  //     points: [start_point, end_point],
  //     selectType: [start_type, end_type],
  //     routine,
  //     routineLength
  //   });
  // }

  closeModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

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
          type: "walk_slider",
          value: this.state.routine.walk_slider,
        },
        {
          label: "bike",
          type: "bike_slider",
          value: this.state.routine.bike_slider,
        },
        {
          label: "bus",
          type: "bus_slider",
          value: this.state.routine.bus_slider,
        },
        {
          label: "car",
          type: "car_slider",
          value: this.state.routine.car_slider,
        },
        {
          label: "motorbike",
          type: "motorbike_slider",
          value: this.state.routine.motorbike_slider,
        },
        {
          label: "train",
          type: "train_slider",
          value: this.state.routine.train_slider,
        },
      ],
      count_values = 0;
    const dim =
      Dimensions.get("window").height * 0.07 >
      Dimensions.get("window").width * 0.25
        ? Dimensions.get("window").width * 0.25
        : Dimensions.get("window").height * 0.07;

    let array_sliders_2 = array_sliders.splice(3);
    return (
      <View style={{ backgroundColor: "#637FB8" }}>
        <View style={styles.imagesContainer}>
          {array_sliders.map((e, i) => (
            <Image
              key={e.label}
              style={{
                height: dim,
                width: dim,
                opacity: this.state.routine[e.type] ? 1 : 0.4,
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
                width: dim,
                height: dim,
                opacity: this.state.routine[e.type] ? 1 : 0.4,
              }}
              source={this.getImagePath(e.label)}
            />
          ))}
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

  renderTimeBox() {
    return (
      <View style={styles.timeContainer}>
        <Image
          style={{
            height: Dimensions.get("window").height * 0.1,
            width: Dimensions.get("window").height * 0.1,
          }}
          source={require("../../assets/images/frequent_trip_wave.png")}
        />
        <View style={{ flexDirection: "row" }}>
          <OwnIcon name={"onboarding-time_icn"} size={25} color={"#637FB8"} />
          <Text style={styles.startTimeText}>
            {this.state.routine.start_time.substring(0, 5)}
          </Text>
          <Text style={styles.slashTimeText}>{" / "}</Text>
          <Text style={styles.endTimeText}>
            {this.state.routine.end_time.substring(0, 5)}
          </Text>
        </View>
        <Image
          style={{
            height: Dimensions.get("window").height * 0.1,
            width: Dimensions.get("window").height * 0.1,
            opacity: 0,
          }}
          source={require("../../assets/images/frequent_trip_wave.png")}
        />
      </View>
    );
  }

  renderWeekdays() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.9,
          height: Dimensions.get("window").height * 0.15,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          flexDirection: "row",
        }}
      >
        <OnboardingWeekDay
          index={1}
          dayName={strings("id_0_35").toLocaleUpperCase()}
          // onPress={this.setDayWeek}
          onPress={() => {}}
          selected={this.state.routine.monday}
          detailScreen={true}
          style={{ alignItems: "center" }}
          styleBox={{ alignSelf: "center" }}
        />
        <OnboardingWeekDay
          index={2}
          dayName={strings("id_0_36").toLocaleUpperCase()}
          // onPress={this.setDayWeek}
          onPress={() => {}}
          selected={this.state.routine.tuesday}
          detailScreen={true}
          style={{ alignItems: "center" }}
          styleBox={{ alignSelf: "center" }}
        />
        <OnboardingWeekDay
          index={3}
          dayName={strings("id_0_37").toLocaleUpperCase()}
          selected={this.state.routine.wednesday}
          // onPress={this.setDayWeek}
          onPress={() => {}}
          detailScreen={true}
          style={{ alignItems: "center" }}
          styleBox={{ alignSelf: "center" }}
        />
        <OnboardingWeekDay
          index={4}
          dayName={strings("id_0_38").toLocaleUpperCase()}
          selected={this.state.routine.thursday}
          // onPress={this.setDayWeek}
          onPress={() => {}}
          detailScreen={true}
          style={{ alignItems: "center" }}
          styleBox={{ alignSelf: "center" }}
        />
        <OnboardingWeekDay
          index={5}
          dayName={strings("id_0_39").toLocaleUpperCase()}
          selected={this.state.routine.friday}
          // onPress={this.setDayWeek}
          onPress={() => {}}
          detailScreen={true}
          style={{ alignItems: "center" }}
          styleBox={{ alignSelf: "center" }}
        />
        <OnboardingWeekDay
          index={6}
          dayName={strings("id_0_40").toLocaleUpperCase()}
          selected={this.state.routine.saturday}
          // onPress={this.setDayWeek}
          onPress={() => {}}
          detailScreen={true}
          style={{ alignItems: "center" }}
          styleBox={{ alignSelf: "center" }}
        />
        <OnboardingWeekDay
          index={0}
          dayName={strings("id_0_41").toLocaleUpperCase()}
          selected={this.state.routine.sunday}
          // onPress={this.setDayWeek}
          onPress={() => {}}
          detailScreen={true}
          style={{ alignItems: "center" }}
          styleBox={{ alignSelf: "center" }}
        />
      </View>
    );
  }

  changeFrequentTrip = () => {
    this.props.navigation.navigate("ChangeFrequentTripScreen", {
      routine: this.state.routine,
    });
  };

  afterDeleteFRT = () => {
    this.props.navigation.goBack();
  };

  deleteFrequentTrip = () => {
    console.log(this.state.routine);
    if (this.state.routine.id) {
      this.props.dispatch(
        deleteMostFrequentRoute({}, this.state.routine.id, this.afterDeleteFRT)
      );
      this.closeModal();
    }
  };

  modalDeleteFRT = () => {
    return (
      <Modal
        isVisible={this.state.isModalVisible}
        onSwipeComplete={() => {
          this.closeModal();
        }}
        onBackButtonPress={() => {
          this.closeModal();
        }}
        onBackdropPress={() => {
          this.closeModal();
        }}
        swipeDirection="left"
        //useNativeDriver={true}
        style={{
          borderRadius: 10,
          alignItems: "center",
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          shadowRadius: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.5,

          // backgroundColor: "white"
        }}
        backdropOpacity={0.7}
      >
        <View
          style={{
            borderRadius: 10,
            alignItems: "center",

            flexDirection: "column",
            justifyContent: "space-between",
            shadowRadius: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            borderColor: "#3363AD",
            borderWidth: 4,

            height: Dimensions.get("window").height * 0.4,
            width: Dimensions.get("window").width * 0.8,
            backgroundColor: "white",
          }}
        >
          <Image
            style={{
              width: Dimensions.get("window").height * 0.2,
              height: Dimensions.get("window").height * 0.2,
              paddingTop: 10,
            }}
            // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
            source={require("../../assets/images/routinary_empty.png")}
          />

          <View
            style={{
              width: Dimensions.get("window").width * 0.7,
              alignContent: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                color: "#3d3d3d",
                fontSize: 14,
                fontFamily: "OpenSans-Bold",
                textAlign: "center",
              }}
            >
              {strings("id_6_03")}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              paddingBottom: 10,
            }}
          >
            <TouchableOpacity onPress={this.deleteFrequentTrip}>
              <Image
                source={require("./../../assets/images/check_green_icn.png")}
                style={styles.buttonImageStyle}
              />
            </TouchableOpacity>

            <View style={styles.buttonModalImageStyle} />
            <TouchableOpacity onPress={this.closeModal}>
              <Image
                source={require("./../../assets/images/cancel_icn.png")}
                style={styles.buttonImageStyle}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

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

    // {() => this.DescriptionIconModal("trainingOne")}

    return (
      <Aux>
        {this.modalDeleteFRT()}
        <ScrollView
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            backgroundColor: "#fff",
            flex: 1,
          }}
        >
          {this.state.load ? (
            <View
              style={{
                justifyContent: "flex-start",
                alignItems: "center",
                flexDirection: "column",
                // marginTop: Dimensions.get("window").height * 0.12
                paddingTop: 10,
                backgroundColor: "#FFFFFF",
                height: Dimensions.get("window").height,
                paddingBottom: 200,
              }}
            >
              <View
                style={{
                  marginBottom: 15,
                  width: Dimensions.get("window").width * 0.9,

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
                  <Text style={styles.ftTypeText}>{"<"}</Text>
                  <Text style={styles.ftTypeText}> </Text>
                  <Text style={styles.ftTypeText}>{">"}</Text>
                  <Text style={styles.ftText}>
                    {this.state.frequent_type[this.state.routine.end_type]}
                  </Text>
                </View>
              </View>
              <CardFlip
                style={styles.cardContainer}
                ref={(card) => (this.card = card)}
                flipDirection={"y"}
              >
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.9,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableWithoutFeedback
                    style={styles.card}
                    onPress={() => this.card.flip()}
                  >
                    <View
                      style={{
                        alignContent: "center",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View style={styles.card}>
                        <View style={styles.contentContainer}>
                          <MapView
                            ref={(ref) => {
                              this.mapRef = ref;
                            }}
                            style={styles.MapContainer}
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
                                  edgePadding: {
                                    top: 40,
                                    right: 20,
                                    bottom: 80,
                                    left: 20,
                                  },
                                  animated: false,
                                }
                              )
                            }
                            loadingEnabled
                          >
                            {this.ReturnPoints()}
                            {this.ReturnCircles()}
                          </MapView>
                        </View>
                      </View>

                      <View style={styles.cardPadding}></View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.9,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableWithoutFeedback
                    style={styles.card}
                    onPress={() => this.card.flip()}
                  >
                    <View
                      style={{
                        alignContent: "center",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View style={styles.card}>
                        <View style={styles.contentContainer}>
                          {this.renderTimeBox()}
                          {this.renderWeekdays()}
                          <StackedAreaChart
                            style={{
                              height: Dimensions.get("window").height * 0.1,
                              width: Dimensions.get("window").width * 0.9,
                              top: 1, // per togliere la base bianca
                            }}
                            data={[
                              {
                                dates: 1100,
                              },
                              {
                                dates: 1000,
                              },
                              {
                                dates: 1400,
                              },
                              {
                                dates: 1300,
                              },
                              {
                                dates: 1700,
                              },
                              {
                                dates: 1600,
                              },
                              {
                                dates: 2000,
                              },
                            ]}
                            keys={["dates"]}
                            colors={["#637FB8"]}
                            curve={shape.curveNatural}
                            showGrid={false}
                          />
                          {this.renderImages()}
                        </View>
                      </View>

                      <View style={styles.cardPaddingMap}>
                        <MapView
                          ref={(ref) => {
                            this.mapRef2 = ref;
                          }}
                          style={styles.cardPaddingMap}
                          onMapReady={() =>
                            this.mapRef2.fitToCoordinates(
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
                                edgePadding: {
                                  top: 40,
                                  right: 20,
                                  bottom: 80,
                                  left: 20,
                                },
                                animated: false,
                              }
                            )
                          }
                          loadingEnabled
                        ></MapView>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </CardFlip>

              <View
                style={{
                  paddingTop: 40,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity onPress={this.changeFrequentTrip}>
                  <Image
                    source={require("./../../assets/images/modify_blue_icn.png")}
                    style={styles.buttonImageStyle}
                  />
                </TouchableOpacity>
                {this.state.routineLength > 1 ? (
                  <Aux>
                    <View style={styles.buttonImageStyle} />
                    <TouchableOpacity onPress={this.closeModal}>
                      <Image
                        source={require("./../../assets/images/cancel_icn.png")}
                        style={styles.buttonImageStyle}
                      />
                    </TouchableOpacity>
                  </Aux>
                ) : (
                  <View />
                )}
              </View>
            </View>
          ) : (
            <View />
          )}
        </ScrollView>
      </Aux>
    );
  }
}

const styles = StyleSheet.create({
  buttonImageStyle: {
    width: 50,
    height: 50,
  },
  buttonModalImageStyle: {
    width: 30,
    height: 30,
  },
  buttonRegister: {
    width: Dimensions.get("window").width * 0.3,
    height: 44,
    borderRadius: 22,
    borderColor: "#3363AD",
    borderWidth: 1,

    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  imagesContainer: {
    height: Dimensions.get("window").height * 0.1,
    width: Dimensions.get("window").width * 0.9,
    alignSelf: "center",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#637FB8",
  },
  weekDayContainer: {
    // marginTop: 120,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  timeContainer: {
    height: Dimensions.get("window").height * 0.1,
    width: Dimensions.get("window").width * 0.9,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontSize: 18,
    color: "#637FB8",
  },
  slashTimeText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 18,
    color: "#637FB8",
  },
  endTimeText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 18,
    color: "#637FB8",
  },

  ftText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 17,
    color: "#3d3d3d",
    paddingLeft: 8,
  },
  ftTypeText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 17,
    color: "#3d3d3d",
    paddingLeft: 8,
  },
  ftTypes: {
    width: Dimensions.get("window").width * 0.9,

    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  Value: {
    color: "#FFFFFF",
    fontSize: 30,
    textAlign: "center",
    fontFamily: "Montserrat-ExtraBold",
  },
  ValueDescr: {
    color: "#9D9B9C",
    fontSize: 10,
    textAlign: "center",
    fontWeight: "600",
    fontFamily: "OpenSans-Bold",
  },
  cardContainer: {
    width: Dimensions.get("window").width * 0.9,
    // + 45 cosi i punti sono piu sotto e ha piu spazio per fare il giro della card
    height: Dimensions.get("window").height * 0.55 + 25,
  },
  card: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.55,
    backgroundColor: "#FE474C",
    borderRadius: 5,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  cardPadding: {
    width: Dimensions.get("window").width * 0.8 - 8,
    height: 36,
    backgroundColor: "#3363AD",
    borderColor: "#F7F8F9",
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,

    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    shadowOpacity: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  cardPaddingMap: {
    width: Dimensions.get("window").width * 0.8,
    height: 40,
    backgroundColor: "#3363AD",

    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    shadowOpacity: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  card1: {
    backgroundColor: "#FE474C",
  },
  card2: {
    backgroundColor: "#FEB12C",
  },
  label: {
    lineHeight: 470,
    textAlign: "center",
    fontSize: 55,
    fontFamily: "System",
    color: "#ffffff",
    backgroundColor: "transparent",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.55,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#3363AD",
    flexDirection: "column",
  },
  MapContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
    width: Dimensions.get("window").width * 0.9 - 2,
    height: Dimensions.get("window").height * 0.55 - 2,
    borderRadius: 4,
  },
  content: {
    marginTop: 14,
    width: Dimensions.get("window").width * 0.83,
    // height: Dimensions.get("window").height * 0.4,
    height: Dimensions.get("window").height * 0.45,
    backgroundColor: "#3d3d3d",
  },
  avatarImage: {
    flex: 1,
    // position: "absolute",
    width: 214,
    height: 350,
    alignSelf: "center",
  },
  nameText: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    fontFamily: "Montserrat-ExtraBold",
  },
  levelText: {
    color: "#E83475",
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Montserrat-ExtraBold",
  },
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    avatarImage: {
      flex: 1,
      // position: "absolute",
      width: 102,
      height: 168,
      alignSelf: "center",
    },
    cardContainer: {
      width: Dimensions.get("window").width * 0.8,
      height: Dimensions.get("window").height * 0.45,
    },
    card: {
      width: Dimensions.get("window").width * 0.8,
      height: Dimensions.get("window").height * 0.45,
      backgroundColor: "#FE474C",
      borderRadius: 5,
      shadowColor: "rgba(0,0,0,0.5)",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.5,
      justifyContent: "center",
      alignItems: "center",
    },
    contentContainer: {
      // flex: 1,
      // backgroundColor: "#fff",
      // justifyContent: "flex-start",
      // alignItems: "center",
      // width: Dimensions.get("window").width * 0.8,
      // height: Dimensions.get("window").height * 0.45,
      // borderRadius: 4

      flex: 1,
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
      alignContent: "center",
      width: Dimensions.get("window").width * 0.9,
      height: Dimensions.get("window").height * 0.55,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: "#3363AD",
      flexDirection: "column",
    },
    content: {
      marginTop: 14,
      width: Dimensions.get("window").width * 0.73,
      height: Dimensions.get("window").height * 0.35,
      backgroundColor: "#3d3d3d",
    },
    nameText: {
      color: "#fff",
      fontSize: 18,
      textAlign: "center",
      fontFamily: "Montserrat-ExtraBold",
    },
    levelText: {
      color: "#E83475",
      fontSize: 16,
      textAlign: "center",
      fontFamily: "Montserrat-ExtraBold",
    },
  });
}

const RecapUser = connect((state) => {
  return {
    // latitude: state.register.latitude ? state.register.latitude : 38.1146969,
    // longitude: state.register.longitude ? state.register.longitude : 13.3650935,
    // mostFrequentRaceFrequencyPosition: state.register
    //   .mostFrequentRaceFrequencyPosition
    //   ? state.register.mostFrequentRaceFrequencyPosition
    //   : null
  };
});

export default RecapUser(FrequentTripCard);
