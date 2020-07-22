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
import SurveySelectAvatar, {
  AvatarList
} from "./../../components/SurveySelectAvatar/SurveySelectAvatar";
import LinearGradient from "react-native-linear-gradient";
import { BoxShadow } from "react-native-shadow";
import { connect } from "react-redux";
import { updateState } from "./../../domains/register/ActionCreators";
import SelectCity from "./../../components/SelectCity/SelectCity";
import Emoji from "@ardentlabs/react-native-emoji";
import Icon from "react-native-vector-icons/Ionicons";

import { strings } from "../../config/i18n";

class SelectTeamScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static navigationOptions = {
    header: null
  };

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
        <StatusBar backgroundColor={"#736fb1"} barStyle="light-content" />
        {/* HEADER */}
        <View
          style={{
            height: 100,
            backgroundColor: "transparent"
          }}
        >
          <ImageBackground
            source={require("../../assets/images/purple_wave_onbording.png")}
            style={styles.backgroundImageWave}
          />
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
        </View>
        {/* BODY */}
        <View
          style={{
            height: Dimensions.get("window").height - 420,
            backgroundColor: "transparent",
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          <SelectCity
            {...this.props}
            handleNextTap={() => {}}
            nearestCity={this.props.registerState.nearestCity}
          />
        </View>
        {/* FOOTER */}
        <ImageBackground
          source={require("../../assets/images/city_wave_onbording.png")}
          style={styles.backgroundImageWaveDown}
        >
          <View
            style={{
              height: 50,
              backgroundColor: "transparent"
            }}
          />
          <View
            style={{
              height: 270,
              backgroundColor: "transparent",
              alignContent: "center",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <View
              style={{
                height: 140,
                backgroundColor: "transparent",
                alignContent: "center",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  alignContent: "center",
                  flexDirection: "row",
                  justifyContent: "center"
                }}
              >
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.8,
                    alignContent: "center",
                    flexDirection: "column",
                    justifyContent: "center"
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontWeight: "400",
                      fontSize: 11,
                      color: "#fff",
                      textAlign: "center"
                    }}
                  >
                    {strings("if_it_s_not_amo")}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  alignContent: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.props.navigation.navigate("SelectCity");
                  }}
                >
                  <View>
                    <LinearGradient
                      start={{ x: 0.0, y: 0.0 }}
                      end={{ x: 0.0, y: 1.0 }}
                      locations={[0, 1.0]}
                      colors={["#F9B224", "#FFCC00"]}
                      style={{
                        borderWidth: 1,
                        padding: 10,
                        height: 45,
                        width: Dimensions.get("window").width * 0.6,

                        // backgroundColor: "#3D3D3D",
                        // color: "#fff",
                        borderRadius: 4,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",

                        borderColor: "transparent"
                      }}
                    >
                      <Emoji style={{}} name={"city_sunset"} />
                      <Text
                        style={{
                          fontFamily: "OpenSans-Regular",
                          fontWeight: "400",
                          fontSize: 15,
                          color: "#3d3d3d",
                          textAlign: "center",
                          marginRight: Dimensions.get("window").width * 0.2
                        }}
                      >
                        {this.props.registerState.nearestCity
                          ? this.props.registerState.nearestCity
                          : strings("choose")}
                      </Text>
                      <Icon
                        name="md-arrow-forward"
                        size={18}
                        color="#3d3d3d"
                        style={{}}
                      />
                    </LinearGradient>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            <View
              style={{
                height: 130,
                backgroundColor: "transparent",
                alignContent: "center",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <View
                style={{
                  flex: 1,
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

                <View style={[styles.buttonContainer]}>
                  {/* <BoxShadow setting={shadowOpt} /> */}
                  <TouchableWithoutFeedback
                    onPress={() => {
                      // this.props.navigation.navigate("SurveyEnd");
                      if (this.props.registerState.cityId != undefined) {
                        this.props.navigation.navigate("GDPRScreen");
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
  topOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: 50,
    top:
      Platform.OS == "ios"
        ? Dimensions.get("window").height * 0.2 - 50
        : Dimensions.get("window").height * 0.16 - 50
  },
  backgroundImageWave: {
    height: 100,
    width: Dimensions.get("window").width,
    position: "absolute"
    // top: Dimensions.get("window").height * 0.04 + 14
  },
  backgroundImageWaveDown: {
    height: 320,
    width: Dimensions.get("window").width,
    position: "absolute",
    bottom: 0
  },
  bottomOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: 70,
    top: 0
  },
  textHeaderContainer: {
    marginTop: Platform.OS == "ios" ? 30 : 15,
    marginLeft: 20,
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
    width: Dimensions.get("window").width * 0.6,
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center"
  },
  textFooter: {
    fontFamily: "OpenSans-Regular",
    color: "#fff",
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

export default withData(SelectTeamScreen);
