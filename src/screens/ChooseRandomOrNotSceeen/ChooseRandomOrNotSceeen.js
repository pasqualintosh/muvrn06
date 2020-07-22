import React from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  Button,
  TouchableHighlight,
  ImageBackground,
  TouchableWithoutFeedback,
  Platform,
  Alert,
  ActivityIndicator,
  StatusBar,
  Keyboard,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import LinearGradient from "react-native-linear-gradient";
import { strings } from "../../config/i18n";

import WebService from "../../config/WebService";
import { Client } from "bugsnag-react-native";

const bugsnag = new Client(WebService.BugsnagAppId);

import { connect } from "react-redux";

import Settings from "./../../config/Settings";

import { getStatusBarHeight } from "./../../helpers/notch";
import {
  updateState,
  getAvatars,
} from "./../../domains/register/ActionCreators";

import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings,
} from "react-native-google-analytics-bridge";

let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);

import analytics from "@react-native-firebase/analytics";
async function trackScreenView(screen) {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
}

class ChooseRandomOrNotSceeen extends React.Component {
  // Costruttore per creare lo stato che poi contiene email e password
  // showPassword per dire se mostrare la password
  constructor() {
    super();
    this.state = {
      avatar: 0,
      loadingAvatar: false,
      avatarDetail: null,
    };
  }

  static navigationOptions = {
    header: null,
  };

  error = () => {
    this.setState({
      loadingAvatar: false,
    });
  };

  getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Il max è incluso e il min è incluso
  };

  callbackAfterResponse = (data) => {
    this.setState({
      loadingAvatar: false,
    });
    if (data.length) {
      const random = this.getRandomIntInclusive(0, data.length - 1);
      const avatar = data[random].id;
      const avatarDetail = data[random];
      this.setState({
        avatar,
        avatarDetail,
      });
      this.props.dispatch(
        updateState({
          avatar: avatar,
          avatarDetail: avatarDetail,
        })
      );
      this.props.navigation.navigate("AppPermissionsScreen");
    }
  };

  getAvatarRandom = () => {
    this.setState({
      loadingAvatar: true,
    });
    // prendo un avatar generico di quelli unisex
    getAvatars(
      {
        name: "string",
        gender: 3,
        min_age: 0,
        max_age: 99,
      },
      this.callbackAfterResponse,
      this.error
    );
  };

  nextScreen = () => {
    this.props.navigation.navigate("WhoYouAreScreen");
  };

  skip = () => {
    this.props.navigation.navigate("ChooseRandomAvatarScreen");
  };

  render() {
    return (
      <View>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#7D4D99", "#6497CC"]}
          style={styles.sfondo}
        >
          <ImageBackground
            source={require("./../../assets/images/profile_card_bg_muver.png")}
            style={styles.sfondo}
          >
            <SafeAreaView
              style={{
                //paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
                // marginBottom: 48, // se ho navigation bar in android in basso che non viene considerata per posizionare gli oggetti
                flex: 1,
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "space-between",
              }}
            >
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingBottom: 100,
                  lexDirection: "column",
                  alignContent: "center",
                  justifyContent: "center",
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
                        color="#ffffff"
                        style={{ transform: [{ rotateZ: "180deg" }] }}
                      />
                    </View>
                  </TouchableOpacity>
                  <Text
                    style={{
                      // margin: 10,
                      color: "#FFFFFF",
                      fontFamily: "OpenSans-Bold",
                      fontWeight: "700",
                      fontSize: 15,
                      marginLeft: 20,
                      textAlign: "left",
                    }}
                  >
                    {strings("id_0_117")}
                  </Text>
                </View>
                <View style={styles.icon}>
                  <View style={styles.textHeaderContainer}></View>
                  <ImageBackground
                    style={styles.imageBox}
                    source={require("../../assets/images/onboardingImage/wave_icn_onboarding.png")}
                  >
                    <Image
                      source={require("../../assets/images/friends_banner_icn.png")}
                      style={styles.imageBox}
                    />
                  </ImageBackground>
                </View>
                <View
                  style={{
                    height: 30,
                    width: Dimensions.get("window").width,
                  }}
                />
                <View style={styles.textcondition}>
                  <Text
                    style={{
                      // margin: 10,
                      color: "#FFFFFF",
                      fontFamily: "OpenSans-Regular",

                      fontSize: 15,

                      textAlign: "center",
                    }}
                  >
                    {strings("id_0_116")}
                  </Text>
                  {/* 
              <Text>
                <Text
                  style={{
                    // margin: 10,
                    color: "#FFFFFF",
                    fontFamily: "OpenSans-Regular",
                    fontWeight: "400",
                    fontSize: 15,
                    textAlignVertical: "center",
                    textAlign: "center"
                  }}
                >
                  Creando un nuovo account o eseguendo il login, confermi di
                  accettare le nostre
                </Text>
                <Text
                  style={{
                    // margin: 10,
                    color: "#FFFFFF",
                    fontFamily: "OpenSans-Regular",
                    fontWeight: "400",
                    fontSize: 15,
                    textAlignVertical: "center",
                    textAlign: "center",
                    textDecorationLine: "underline",
                    textDecorationStyle: "solid"
                  }}
                  onPress={() => this.moveCondition()}
                >
                  {" Condizioni di utilizzo "}
                </Text>
                <Text
                  style={{
                    // margin: 10,
                    color: "#FFFFFF",
                    fontFamily: "OpenSans-Regular",
                    fontWeight: "400",
                    fontSize: 15,
                    textAlignVertical: "center",
                    textAlign: "center"
                  }}
                >
                  e l’
                </Text>
                <Text
                  style={{
                    // margin: 10,
                    color: "#FFFFFF",
                    fontFamily: "OpenSans-Regular",
                    fontWeight: "400",
                    fontSize: 15,
                    textAlignVertical: "center",
                    textAlign: "center",
                    textDecorationLine: "underline",
                    textDecorationStyle: "solid"
                  }}
                  onPress={() => this.movePrivacy()}
                >
                  {"Informativa sulla Privacy."}
                </Text>
              </Text> 
              */}
                </View>
                <View
                  style={{
                    height: 30,
                    width: Dimensions.get("window").width,
                  }}
                />
                <View>
                  <TouchableOpacity onPress={() => this.nextScreen()}>
                    <LinearGradient
                      start={{ x: 0.0, y: 0.0 }}
                      end={{ x: 0.0, y: 1.0 }}
                      locations={[0, 1.0]}
                      colors={["#FAB21E", "#FA941E"]}
                      style={styles.buttonSmall}
                    >
                      <Text
                        style={{
                          // margin: 10,
                          color: "#FFFFFF",
                          fontFamily: "OpenSans-Regular",
                          fontWeight: "400",
                          fontSize: 14,
                          textAlignVertical: "center",
                          textAlign: "center",
                        }}
                      >
                        {strings("id_0_117")}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    height: 90,
                    width: Dimensions.get("window").width,
                  }}
                />
                <View>
                <View style={styles.textcondition}>
                <Text
                    style={{
                      // margin: 10,
                      color: "#FFFFFF",
                      fontFamily: "OpenSans-Regular",

                      fontSize: 15,

                      textAlign: "center",
                    }}
                  >
                    {strings("id_0_24")}
                  </Text>
                  </View>
                  <View
                  style={{
                    height: 30,
                    width: Dimensions.get("window").width,
                  }}
                />
                  <TouchableOpacity
                    onPress={() => this.getAvatarRandom()}
                    style={styles.buttonLogin}
                    disabled={this.state.loadingAvatar}
                  >
                    {this.state.loadingAvatar ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text
                        style={{
                          // margin: 10,
                          color: "#FFFFFF",
                          fontFamily: "OpenSans-Regular",
                          fontWeight: "400",
                          fontSize: 15,
                          textAlignVertical: "center",
                          textAlign: "center",
                        }}
                      >
                        {strings("id_0_142")}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
                {/* <View>
              <FacebookLinkButton
                dispatch={this.props.dispatch}
                navigate={this.props.navigation.navigate}
              />
              <GoogleLogin
                dispatch={this.props.dispatch}
                navigate={this.props.navigation.navigate}
              />
            </View> */}
              </ScrollView>
            </SafeAreaView>
          </ImageBackground>
        </LinearGradient>
      </View>
    );
  }
}

// elevation: 2 per avere l'ombra su android con versione 5 in su

const styles = {
  imageBox: {
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").width * 0.5,
    alignSelf: "center",
    justifyContent: "center",
  },
  textHeaderContainer: {
    flexDirection: "row",
    width: Dimensions.get("window").width,
    height: 90,
  },
  sfondo: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  icon: {
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  textcondition: {
    width: Dimensions.get("window").width * 0.8,
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  buttonSmall: {
    width: Dimensions.get("window").width * 0.4,
    height: 44,
    borderRadius: 22,
    // borderColor: "#FFFFFF",
    // borderWidth: 1,
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  buttonLogin: {
    width: Dimensions.get("window").width * 0.75,
    height: 44,
    borderRadius: 22,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  StatusBar: {
    height: 50,
    width: Dimensions.get("window").width,
    position: "absolute",
    top: 0,
    backgroundColor: "white",
  },
  backgroundImageWave: {
    height: 90,
    width: Dimensions.get("window").width,
    position: "absolute",
    top: getStatusBarHeight(),
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
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  button: {
    width: Dimensions.get("window").width * 0.3,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonShadow: {
    width: Dimensions.get("window").width * 0.3,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 2,
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
  containerFBLogin: {},
};

const ConnectLogin = connect((state) => {
  return {
    status: state.login.status ? state.login.status : false,
  };
});

export default ConnectLogin(ChooseRandomOrNotSceeen);
