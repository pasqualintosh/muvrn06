import React from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableHighlight,
  ImageBackground,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from "react-native-permissions";
import Icon from "react-native-vector-icons/Ionicons";
import { strings } from "../../config/i18n";
import { updateState, getCity } from "./../../domains/register/ActionCreators";
import BackgroundGeolocation from "./../../helpers/geolocation";
import LinearGradient from "react-native-linear-gradient";
import {
  changeStatusPerm,
} from "./../../domains/statistics/ActionCreators";
import AppleHealthKit from "rn-apple-healthkit";
import GoogleFit, { Scopes } from "react-native-google-fit";

class AppPermissionsScreen extends React.Component {
  // Costruttore per creare lo stato che poi contiene email e password
  // showPassword per dire se mostrare la password
  constructor() {
    super();
    this.state = {
      iosMotion: false,
      iosGPS: false,
      androidGPS: false,
      complete: false,
      healthPerm: false
    };
  }

  //   static navigationOptions = ({ navigation }) => {
  //     return {
  //       headerTitle: (
  //         <Text
  //           style={{
  //             left: Platform.OS == "android" ? 20 : 0
  //           }}
  //         >
  //           {strings("id_13_24")}
  //         </Text>
  //       )
  //     };
  //   };

  static navigationOptions = {
    header: null,
  };

  askForFitAuth() {
    if (Platform.OS == "ios") {
      let perm = {
        permissions: {
          read: [
            "StepCount"
          ]
        },
        observers: [{ type: "StepCount" }]
      };
      AppleHealthKit.initHealthKit(perm, (err, results) => {
        if (err) {
          err;
          this.setState({ healthPerm: true });
          this.props.navigation.navigate("GDPRScreen");
          console.log("error initializing Healthkit: ", err);
          return;
        }
        // ho ottenuto il permesso, lo salvo
        
          this.props.dispatch(changeStatusPerm(true));
        

          this.setState({ healthPerm: true });
          this.props.navigation.navigate("GDPRScreen");


       
      });
    } else {
      // The list of available scopes inside of src/scopes.js file
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          Scopes.FITNESS_ACTIVITY_READ_WRITE,
          Scopes.FITNESS_BODY_READ,
          Scopes.FITNESS_BODY_READ_WRITE,
          Scopes.FITNESS_NUTRITION_READ,
          Scopes.FITNESS_LOCATION_READ_WRITE,
          
        ]
      };

    
      GoogleFit.authorize(options)
        .then(res => {
          console.log("authorized >>>", res);
          this.setState({ healthPerm: true });
          if (res.success) {
            // ho ottenuto il permesso, lo salvo      
              this.props.dispatch(changeStatusPerm(true));
          }
          this.props.navigation.navigate("GDPRScreen");
        })
        .catch(err => {
          this.setState({ healthPerm: true });
          console.log("err >>> ", err);
          this.setState({ log: "err >>> " + JSON.stringify(err) });
          this.props.navigation.navigate("GDPRScreen");
        });
     
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      !nextState.complete &&
      ((nextState.iosGPS && nextState.iosMotion) || nextState.androidGPS) &&
      nextProps.registerState.location &&
      nextProps.registerState.location.latitude
    ) {
      this.setState({
        complete: true,
      });
      this.unsetBackgroundGeolocation();
      this.askForFitAuth()
      
    }
  }

  getPosition = () => {
    this.setBackgroundGeolocation();

    if (Platform.OS == "ios")
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position.coords);
          // BackgroundGeolocation.stop();
          this.unsetBackgroundGeolocation();

          this.props.dispatch(
            updateState({
              location: {
                latitude: position.coords.latitude, //  posizione per la regitrazione
                longitude: position.coords.latitude,
              },
            })
          );
          this.props.dispatch(
            getCity({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
          );
        },
        (error) => alert(error.message),
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
      );
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
        "X-FOO": "bar",
      },
      // customize post properties
      postTemplate: {
        lat: "@latitude",
        lon: "@longitude",
        foo: "bar", // you can also add your own properties
      },
      notificationTitle: "MUV",
      notificationText: "Background tracking",
    });

    BackgroundGeolocation.on("location", (location) => {
      BackgroundGeolocation.startTask((taskKey) => {
        this.props.dispatch(
          updateState({
            location: {
              latitude: location.latitude, //  posizione per la regitrazione
              longitude: location.latitude,
            },
          })
        );
        this.props.dispatch(
          getCity({
            latitude: location.latitude,
            longitude: location.longitude
          })
        );

        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on("error", (error) => {
      console.log("[ERROR] BackgroundGeolocation error:", error);
    });

    BackgroundGeolocation.on("start", () => {
      console.log("[INFO] BackgroundGeolocation service has been started");
    });

    BackgroundGeolocation.on("stop", () => {
      console.log("[INFO] BackgroundGeolocation service has been stopped");
    });

    BackgroundGeolocation.on("authorization", (status) => {
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
                  onPress: () => BackgroundGeolocation.showAppSettings(),
                },
                {
                  text: strings("id_14_04"),
                  onPress: () => console.log("No Pressed"),
                  style: "cancel",
                },
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
    BackgroundGeolocation.events.forEach((event) =>
      BackgroundGeolocation.removeAllListeners(event)
    );
    BackgroundGeolocation.stop();
  };

  askPermissions = () => {
    if (
      ((this.state.iosGPS && this.state.iosMotion) || this.state.androidGPS) &&
      this.props.registerState.location &&
      this.props.registerState.location.latitude != 0
    ) {
      this.setState({
        complete: true,
      });
      this.unsetBackgroundGeolocation();
      this.askForFitAuth()
    } 
    else if (this.state.healthPerm){
      this.props.navigation.navigate("GDPRScreen");
    } else {
      if (Platform.OS == "ios") {
        Promise.all([
          check(PERMISSIONS.IOS.MOTION),
          check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE),
        ])
          .then(([result, resultGPS]) => {
            console.log(result);
            switch (result) {
              case RESULTS.UNAVAILABLE:
                // simulatore
                console.log(
                  "This feature is not available (on this device / in this context)"
                );
                this.setState({ iosMotion: true });
                break;
              case RESULTS.DENIED:
                console.log(
                  "The permission has not been requested / is denied but requestable"
                );
                request(PERMISSIONS.IOS.MOTION).then((result) => {
                  console.log(result);
                  if (result == "granted") {
                    this.setState({ iosMotion: true });
                  }
                });
                break;
              case RESULTS.GRANTED:
                console.log("The permission is granted");
                this.setState({ iosMotion: true });
                break;
              case RESULTS.BLOCKED:
                console.log(
                  "The permission is denied and not requestable anymore"
                );

                Alert.alert(strings("id_0_122"), strings("id_0_127"), [
                  {
                    text: strings("id_14_03"),
                    onPress: () => {
                      openSettings().catch(() =>
                        console.warn("cannot open settings")
                      );
                    },
                  },
                  {
                    text: strings("id_14_04"),

                    style: "cancel",
                  },
                ]);

                break;
            }
            console.log(resultGPS);
            switch (resultGPS) {
              case RESULTS.UNAVAILABLE:
                // simulatore
                console.log(
                  "This gps is not available (on this device / in this context)"
                );
                this.setState({ iosGPS: true });
                this.getPosition();
                break;
              case RESULTS.DENIED:
                console.log(
                  "The permission gps has not been requested / is denied but requestable"
                );
                request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
                  console.log(result);
                  if (result == "granted") {
                    this.setState({ iosGPS: true });
                    this.getPosition();
                  }
                });
                break;
              case RESULTS.GRANTED:
                console.log("The permission gps is granted");
                this.setState({ iosGPS: true });
                this.getPosition();
                break;
              case RESULTS.BLOCKED:
                console.log(
                  "The permission iosGPS is denied and not requestable anymore"
                );

                Alert.alert(strings("id_0_128"), strings("id_0_127"), [
                  {
                    text: strings("id_14_03"),
                    onPress: () => {
                      openSettings().catch(() =>
                        console.warn("cannot open settings")
                      );
                    },
                  },
                  {
                    text: strings("id_14_04"),

                    style: "cancel",
                  },
                ]);

                break;
            }
          })
          .catch((error) => {
            console.log(error);
            // …
          });
      } else {
        // devo fare un check differente a seconda se è un android 10 in poi
        // per il 10 in poi devo chiedere l'uso dell'app sempre, anche in background
        if (Platform.Version >= 29) {
          check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION)
            .then((result) => {
              console.log(result);
              switch (result) {
                case RESULTS.UNAVAILABLE:
                  // simulatore
                  console.log(
                    "This feature is not available (on this device / in this context)"
                  );
                  this.setState({ androidGPS: true });
                  this.getPosition();
                  break;
                case RESULTS.DENIED:
                  console.log(
                    "The permission has not been requested / is denied but requestable"
                  );
                  request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION).then(
                    (result) => {
                      console.log(result);
                      if (result == "granted") {
                        this.setState({ androidGPS: true });
                        this.getPosition();
                      }
                    }
                  );
                  break;
                case RESULTS.GRANTED:
                  console.log("The permission is granted");
                  this.setState({ androidGPS: true });
                  this.getPosition();
                  break;
                case RESULTS.BLOCKED:
                  console.log(
                    "The permission is denied and not requestable anymore"
                  );

                  Alert.alert(
                    "GPS is disabled",
                    "Would you like to open settings to active that option?",
                    [
                      {
                        text: strings("id_14_03"),
                        onPress: () => {
                          openSettings().catch(() =>
                            console.warn("cannot open settings")
                          );
                        },
                      },
                      {
                        text: strings("id_14_04"),

                        style: "cancel",
                      },
                    ]
                  );

                  break;
              }
            })
            .catch((error) => {
              console.log(error);
              // …
            });
        } else {
          check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
            .then((result) => {
              console.log(result);
              switch (result) {
                case RESULTS.UNAVAILABLE:
                  // simulatore
                  console.log(
                    "This feature is not available (on this device / in this context)"
                  );
                  this.setState({ androidGPS: true });
                  this.getPosition();
                  break;
                case RESULTS.DENIED:
                  console.log(
                    "The permission has not been requested / is denied but requestable"
                  );
                  request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
                    (result) => {
                      console.log(result);
                      if (result == "granted") {
                        this.setState({ androidGPS: true });
                        this.getPosition();
                      }
                    }
                  );
                  break;
                case RESULTS.GRANTED:
                  console.log("The permission is granted");
                  this.setState({ androidGPS: true });
                  this.getPosition();
                  break;
                case RESULTS.BLOCKED:
                  console.log(
                    "The permission is denied and not requestable anymore"
                  );

                  Alert.alert(
                    "GPS is disabled",
                    "Would you like to open settings to active that option?",
                    [
                      {
                        text: strings("id_14_03"),
                        onPress: () => {
                          openSettings().catch(() =>
                            console.warn("cannot open settings")
                          );
                        },
                      },
                      {
                        text: strings("id_14_04"),

                        style: "cancel",
                      },
                    ]
                  );

                  break;
              }
            })
            .catch((error) => {
              console.log(error);
              // …
            });
        }
      }
    }
  };

  videoGDPR = () => {
    this.props.navigation.navigate("GDPRVideoScreen", {
      typeGDPR: "GDPRScreen",
    });
  };

  componentDidMount() {}

  render() {
    return (
      <View
        style={{
          flex: 1,

          backgroundColor: "#FFFFFF",
        }}
      >
      <ImageBackground
          source={require("./../../assets/images/profile_card_bg.png")}
          style={styles.backgroundImage}
        >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <View>
              <View
                style={{
                  height: 30,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.goBack(null);
                    }}
                  >
                    <View style={{ width: 30, height: 30 }}>
                      <Icon
                        name="md-arrow-forward"
                        size={18}
                        color="#31343F"
                        style={{ transform: [{ rotateZ: "180deg" }] }}
                      />
                    </View>
                  </TouchableOpacity>
                  <Text
                    style={{
                      // margin: 10,
                      color: "#31343F",
                      fontFamily: "OpenSans-Bold",
                      fontWeight: "700",
                      fontSize: 15,
                      marginLeft: 20,
                      textAlign: "left",
                    }}
                  >
                    {strings("id_0_98")}
                  </Text>
                </View>
              </View>
              <View style={styles.half}>
                <View style={{ width: Dimensions.get("window").width * 0.9 }}>
                  <Text>
                    <Text style={styles.textFooter}>{strings("id_0_99")}</Text>
                  </Text>
                  <Text style={styles.textFooterBold}> </Text>
                  <Text style={styles.textFooterBold}>
                    {strings("id_0_100")}
                  </Text>
                  <Text style={styles.textFooter}>{strings("id_0_125")}</Text>
                  <Text style={styles.textFooterBold}> </Text>
                  <Text style={styles.textFooterBold}>
                    {strings("id_0_126")}
                  </Text>
                  <Text style={styles.textFooter}>{strings("id_0_101")}</Text>
                  <Text style={styles.textFooterBold}> </Text>
                  <Text style={styles.textFooterBold}>
                    {strings("id_0_102")}
                  </Text>
                  <Text style={styles.textFooter}>{strings("id_0_103")}</Text>
                  {/* 
            <Text style={styles.textFooterBold}>Salute</Text>
            <Text style={styles.textFooter}>
              I dati di monitoraggio di salute (Apple HealthKit e Google Fit) ci
              permettono di misurare le calorie spese e darti punti in base ai
              minuti di attività giornaliera.
            </Text> 
            */}
                </View>
              </View>
            </View>
            <View
              style={{
                height: 80,
                backgroundColor: "transparent",
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignSelf: "center",
                alignItems: "center",
                width: Dimensions.get("window").width * 0.9,
                paddingBottom: 50,
              }}
            >
              <View style={[styles.button, { marginTop: 10 }]}>
                <TouchableHighlight
                  onPress={this.askPermissions}
                  style={{
                width: 70,
                height: 41,
                borderRadius: 25,
                alignItems: "center",
                shadowRadius: 5
              }}
            >
            <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.0, y: 1.0 }}
        locations={[0, 1.0]}
        colors={["#62357C", "#6497CC"]}
        style={{
                width: 70,
                height: 41,
                borderRadius: 25,
                alignItems: "center",
                shadowRadius: 5
              }}
      >
                  <View
                    style={{
                      height: 41,
                      alignItems: "center",
                      justifyContent: "center",
                      alignContent: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Text style={{ color: "#FFFFFF" }}>
                      {strings("id_0_104").toUpperCase()}
                    </Text>
                  </View>
                  </LinearGradient>
                </TouchableHighlight>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
        </ImageBackground>
      </View>
    );
  }
}

// elevation: 2 per avere l'ombra su android con versione 5 in su

const styles = {
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  sfondo: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  half: {
    width: Dimensions.get("window").width,
    //  flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",

    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
    backgroundColor: "transparent",
  },
  image: {
    width: Dimensions.get("window").width / 2,
    height: Dimensions.get("window").height / 3,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    // height: Dimensions.get("window").height / 2,
    // width: Dimensions.get("window").width
  },
  button: {
    width: 70,
    height: 41,
    borderRadius: 25,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1,
    
  },
  buttonVideo: {
    width: 70,
    height: 41,
    borderRadius: 25,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1,
    backgroundColor: "#F7F8F9",
  },
  textFooter: {
    fontFamily: "OpenSans-Regular",

    fontSize: 15,

    // textAlign: "left"
  },
  textFooterBold: {
    fontFamily: "OpenSans-Regular",

    fontSize: 15,
    fontWeight: "bold",
    // textAlign: "left"
  },
  buttonLoginSocial: {
    width: Dimensions.get("window").width / 2.3,
    height: Dimensions.get("window").height / 20,
    borderRadius: 3,
  },
  buttonLoginGoogle: {
    width: Dimensions.get("window").width / 2.3,
    height: Dimensions.get("window").height / 20,
    borderRadius: 5,
    shadowRadius: 5,
  },
  login: {
    width: Dimensions.get("window").width / 1.2,
    height: Dimensions.get("window").height / 15,
    alignItems: "center",

    borderColor: "#f7f8f9",
    borderWidth: 1,
  },
  buttonPrecedente: {
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").height / 20,
    alignItems: "center",
    margin: 10,
  },
  icon: {
    margin: 10,
    width: Dimensions.get("window").width / 13,
    height: Dimensions.get("window").height / 40,
  },
  containerFBLogin: {},
  textResetPassword: {
    alignContent: "center",
    marginBottom: 9,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    textAlign: "center",
    fontSize: 12,
    color: "#3D3D3D",
  },
  checkboxesContainer: {
    width: Dimensions.get("window").width,
    height: 200,
    // backgroundColor: "transparent",
    // position: "absolute",
    // top: Dimensions.get("window").height * 0.75,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#3e3"
  },
  checkboxContainer: {
    width: Dimensions.get("window").width * 0.7,
    height: 28,
    marginVertical: 5,
  },
  backgroundImageWave: {
    height: 100,
    width: Dimensions.get("window").width,
    position: "absolute",
    // top: Dimensions.get("window").height * 0.04 + 14
  },
  textHeaderContainer: {
    marginLeft: 20,
    flexDirection: "row",
    width: Dimensions.get("window").width * 0.85,
  },
  textHeader: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3d3d3d",
    fontSize: 15,
    fontWeight: "bold",
  },
};

const withData = connect((state) => {
  return {
    registerState: state.register,
  };
});

export default withData(AppPermissionsScreen);
