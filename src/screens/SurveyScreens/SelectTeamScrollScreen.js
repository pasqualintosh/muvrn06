import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Platform,
  TouchableWithoutFeedback,
  NativeModules,
  Alert,
  StatusBar
} from "react-native";
import WavyArea from "./../../components/WavyArea/WavyArea";
import SelectCityScroll from "./../../components/SelectCityScroll/SelectCityScroll";
import LinearGradient from "react-native-linear-gradient";
import { BoxShadow } from "react-native-shadow";
import { connect } from "react-redux";
import { updateState, getCity } from "./../../domains/register/ActionCreators";
import Emoji from "@ardentlabs/react-native-emoji";
import Icon from "react-native-vector-icons/Ionicons";
import BackgroundGeolocation from "./../../helpers/geolocation";
import Geocoder from "./../../components/Geocoder/Geocoder";
import { prefixesList } from "./../../assets/ListPrefixes";

import {
  setReferralFromRegistration,
  clearReferralFromRegistration
} from "./../../domains/register/ActionCreators";

import { strings } from "../../config/i18n";

class SelectTeamScrollScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: null
    };
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    if (
      this.props.registerState &&
      this.props.registerState.referral_url != null
    ) {
      this.props.dispatch(setReferralFromRegistration());
    }

    this.setBackgroundGeolocation();

    if (Platform.OS == "ios")
      navigator.geolocation.getCurrentPosition(
        position => {
          console.log(position.coords);
          // BackgroundGeolocation.stop();
          this.unsetBackgroundGeolocation();

          this.props.dispatch(
            updateState({
              location: {
                latitude: position.coords.latitude, //  posizione per la regitrazione
                longitude: position.coords.latitude
              }
            })
          );
        },
        error => alert(error.message),
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
      );
  }

  handleTapAvatar = id => {
    this.setState({ avatar: id });
  };

  setBackgroundGeolocation = () => {
    BackgroundGeolocation.configure({
      desiredAccuracy: 0,
      // stationaryRadius: 50,
      // distanceFilter: 50,
      debug: false,
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000, // android
      fastestInterval: 5000, // android
      activitiesInterval: 10000, // android
      stopOnStillActivity: false,
      url: "http://192.168.81.15:3000/location",
      httpHeaders: {
        "X-FOO": "bar"
      },
      // customize post properties
      postTemplate: {
        lat: "@latitude",
        lon: "@longitude",
        foo: "bar" // you can also add your own properties
      },
      notificationTitle: "MUV",
      notificationText: "Background tracking"
    });

    BackgroundGeolocation.on("location", location => {
      BackgroundGeolocation.startTask(taskKey => {
        this.props.dispatch(
          updateState({
            location: {
              latitude: location.latitude, //  posizione per la regitrazione
              longitude: location.latitude
            }
          })
        );

        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on("error", error => {
      console.log("[ERROR] BackgroundGeolocation error:", error);
    });

    BackgroundGeolocation.on("start", () => {
      console.log("[INFO] BackgroundGeolocation service has been started");
    });

    BackgroundGeolocation.on("stop", () => {
      console.log("[INFO] BackgroundGeolocation service has been stopped");
    });

    BackgroundGeolocation.on("authorization", status => {
      console.log(
        "[INFO] BackgroundGeolocation authorization status: " + status
      );
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(
          () =>
            Alert.alert(
              "Permissions",
              "MUV wants to access your position. To save your battery we reccomend you to select 'Allow only while...'",
              [
                {
                  text: strings("id_14_03"),
                  onPress: () => BackgroundGeolocation.showAppSettings()
                },
                {
                  text: strings("id_14_04"),
                  onPress: () => console.log("No Pressed"),
                  style: "cancel"
                }
              ]
            ),
          1000
        );
      }
    });

    BackgroundGeolocation.on("background", () => {
      console.log("[INFO] App is in background");
    });

    BackgroundGeolocation.on("foreground", () => {
      console.log("[INFO] App is in foreground");
    });

    BackgroundGeolocation.start();
  };

  unsetBackgroundGeolocation = () => {
    // unregister all event listeners
    BackgroundGeolocation.events.forEach(event =>
      BackgroundGeolocation.removeAllListeners(event)
    );
    BackgroundGeolocation.stop();
  };

  renderCityList() {
    return (
      <View style={{}}>
        <SelectCityScroll
          {...this.props}
          handleNextTap={() => {}}
          nearestCity={""}
          style={{ height: Dimensions.get("window").height - 140 }}
        />
      </View>
    );
  }

  render() {
    let shadowOpt;
    if (Platform.OS == "ios") {
      shadowOpt = {
        width: Dimensions.get("window").width * 0.2,
        height: 40,
        color: "#111",
        border: 4,
        radius: 5,
        opacity: 0.25,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: 10
        }
      };
      if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
        shadowOpt = {
          width: Dimensions.get("window").width * 0.2,
          height: 28,
          color: "#111",
          border: 4,
          radius: 5,
          opacity: 0.25,
          x: 0,
          y: 1,
          style: {
            position: "absolute",
            top: 10
          }
        };
      }
    } else
      shadowOpt = {
        width: Dimensions.get("window").width * 0.2,
        height: 40,
        color: "#444",
        border: 6,
        radius: 5,
        opacity: 0.35,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: 10
        }
      };
    return (
      <ImageBackground
        source={require("./../../assets/images/bg-login.png")}
        style={styles.backgroundImage}
      >
        {/* HEADER */}
        <StatusBar backgroundColor={"#736fb1"} barStyle="light-content" />
        <View
          style={{
            height: 60,
            backgroundColor: "transparent",
            justifyContent: "space-around",
            flexDirection: "row"
          }}
        />
        {/* BODY */}
        <View
          style={{
            height: Dimensions.get("window").height - 140,
            backgroundColor: "transparent"
          }}
        >
          {this.renderCityList()}
        </View>
        {/* FOOTER */}
        <View
          style={{
            height: 60,
            backgroundColor: "transparent",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          {/* <WavyArea
            data={negativeData}
            color={"#F7F8F9"}
            style={styles.bottomOverlayWave}
          /> */}
        </View>
        <ImageBackground
          source={require("../../assets/images/purple_wave_onbording.png")}
          style={styles.backgroundImageWave}
        >
          <View
            style={{
              height: 100,
              backgroundColor: "transparent",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <View style={styles.textHeaderContainer}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.unsetBackgroundGeolocation();
                  this.props.navigation.goBack(null);
                }}
              >
                <View style={{ width: 30, height: 30 }}>
                  <Icon
                    name="ios-arrow-back"
                    style={{ marginTop: Platform.OS == "ios" ? 4 : 2 }}
                    size={18}
                    color="#fff"
                  />
                </View>
              </TouchableWithoutFeedback>
              <Text style={styles.textHeader}>
                {strings("_123_select_your_cit")}
              </Text>
            </View>
          </View>
        </ImageBackground>
        <ImageBackground
          source={require("../../assets/images/purple_wave_onbording_bottom.png")}
          style={styles.backgroundImageWaveDown}
        >
          <View
            style={{
              height: 130,
              backgroundColor: "transparent",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <View
              // start={{ x: 0.0, y: 0.0 }}
              // end={{ x: 0.0, y: 1.0 }}
              // locations={[0, 1.0]}
              // colors={["#6497cc", "#7d4d99"]}
              style={{
                width: Dimensions.get("window").width,
                height: 130,
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View style={styles.textFooterContainer}>
                  <Text style={styles.textFooter}>
                    {strings("your_city_will_")}
                  </Text>
                </View>

                <View style={styles.buttonContainer}>
                  {/* <BoxShadow setting={shadowOpt} /> */}
                  <TouchableWithoutFeedback
                    onPress={() => {
                      // this.props.navigation.navigate("SurveyEnd");
                      // this.props.navigation.navigate("GDPRScreen");
                      // if (
                      //   this.props.registerState.location &&
                      //   this.props.registerState.location.latitude != 0
                      // ) {
                      if (true) {
                        this.unsetBackgroundGeolocation();
                        this.props.navigation.navigate("SurveyAvatar");
                      } else
                        Alert.alert(
                          strings("id_0_10"),
                          strings("seems_like_you_")
                        );
                    }}
                  >
                    <View style={[styles.buttonBox]}>
                      <Text style={styles.buttonGoOnText}>
                        {strings("id_0_15")}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>

            {/* <WavyArea
            data={negativeData}
            color={"#F7F8F9"}
            style={styles.bottomOverlayWave}
          /> */}
          </View>
        </ImageBackground>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  backgroundImageWave: {
    height: 100,
    width: Dimensions.get("window").width,
    position: "absolute"
    // top: Dimensions.get("window").height * 0.04 + 14
  },
  backgroundImageWaveDown: {
    height: 130,
    width: Dimensions.get("window").width,
    position: "absolute",
    bottom: 0
  },
  topOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: 50,
    top:
      Platform.OS == "ios"
        ? Dimensions.get("window").height * 0.2 - 50
        : Dimensions.get("window").height * 0.16 - 50
  },
  bottomOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: 70,
    top: 0
  },
  textHeaderContainer: {
    left: 20,
    flexDirection: "row",
    width: Dimensions.get("window").width * 0.85
  },
  textHeader: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold"
  },
  textFooterContainer: {
    // width: Dimensions.get("window").width * 0.6,
    // justifyContent: "center",
    // alignItems: "center"
    width: Dimensions.get("window").width * 0.6,
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center"
    // marginBottom: Platform.OS == "ios" ? 10 : 20
  },
  textFooter: {
    fontFamily: "OpenSans-Regular",
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "left"
  },
  buttonContainer: {
    width: Dimensions.get("window").width * 0.3,
    height: 60,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  buttonBox: {
    width: Dimensions.get("window").width * 0.2,
    height: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1
  },
  buttonGoOnText: {
    color: "#3363AD",
    fontFamily: "OpenSans-Regular",
    fontSize: 14
  }
});

export const positiveData = [
  {
    value: 60
  },
  {
    value: 40
  },
  {
    value: 50
  },
  {
    value: 40
  },
  {
    value: 50
  }
];

export const negativeData = [
  {
    value: -60
  },
  {
    value: -40
  },
  {
    value: -50
  },
  {
    value: -40
  },
  {
    value: -50
  }
];

const withData = connect(state => {
  return {
    registerState: state.register
  };
});

export default withData(SelectTeamScrollScreen);
