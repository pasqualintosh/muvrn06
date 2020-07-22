import React from "react";
import {
  View,
  Text,
  Alert,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Platform,
  NativeModules,
  TouchableWithoutFeedback,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";

import { connect } from "react-redux";
import {
  updateState,
  getAvatars,
} from "./../../domains/register/ActionCreators";

import Icon from "react-native-vector-icons/Ionicons";

import { strings } from "../../config/i18n";
import WebService from "../../config/WebService";

class ChooseRandomAvatarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: 0,
      listAvatar: [],
      avatarDetail: null
    };
  }

  static navigationOptions = {
    header: null,
  };

  getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Il max è incluso e il min è incluso
  };

  getRandom = (arr, n) => {
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  };

  callbackAfterResponse = (data) => {
    Array.prototype.chunk = function (n) {
      if (!this.length) {
        return [];
      }
      return [this.slice(0, n)].concat(this.slice(n).chunk(n));
    };

    let avatarArray = data;

    if (data.length > 4) {
      // let randomArray = []
      avatarArray = this.getRandom(avatarArray, 4);
      // while (randomArray.length != 6) {
      //   const random = this.getRandomIntInclusive(0, data.length - 1)
      //   console.log(random)
      //   if (!randomArray.includes(random)) {
      //     randomArray = [...randomArray, random]
      //     avatarArray = [...avatarArray, data[random]]
      //   }
      // }
    }

    // divido gli avatar in coppie di due
    const listAvatar = avatarArray.chunk(2);

    this.setState({
      listAvatar,
    });
  };

  componentWillMount() {
    // prendo gli avatar a seconda il sesso preso prima
    getAvatars(
      {
        name: "string",
        gender: this.props.registerState && this.props.registerState.gender
          ? this.props.registerState.gender
          : 3,
        min_age: 0,
        max_age: 99,
      },
      this.callbackAfterResponse
    );
  }

  chooseAvatar = (avatar) => {
    this.setState({
      avatar: avatar.id,
      avatarDetail: avatar
    });
  };

  navigateToPerm = () => {
    this.props.dispatch(
      updateState({
        avatar: this.state.avatar,
        avatarDetail: this.state.avatarDetail
      })
    );
    this.props.navigation.navigate("AppPermissionsScreen");
  };

  viewAvatars = () => {
    return this.state.listAvatar.map((couple, index) => (
      <View
        key={index}
        style={{
          width: Dimensions.get("window").width * 0.9,

          flexDirection: "row",
          justifyContent: "flex-start",
          alignContent: "center",
          alignSelf: "center",
          paddingBottom: 10,
          paddingTop: 10,
        }}
      >
        {this.coupleAvatars(couple, index)}
      </View>
    ));
  };

  coupleAvatars = (couple, indexCouple) => {
    return couple.map((elemTot, indexSingle) => (
      <View
        key={indexSingle}
        style={{
          width: Dimensions.get("window").width * 0.45,

          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center",
          alignSelf: "center",
        }}
      >
        {this.singleAvatar(elemTot, indexSingle)}
      </View>
    ));
  };

  singleAvatar = (single, indexSingle) => {
    return (
      <TouchableOpacity onPress={() => this.chooseAvatar(single)}>
        {this.state.avatar == single.id ? (
          <ImageBackground
            style={styles.backgroundImageBox}
            source={require("../../assets/images/onboardingImage/avatar_blob_selected.png")}
          >
            {single.avatar_image ? (
              <Image
                style={styles.imageBox}
                source={{
                  uri: WebService.url + single.avatar_image,
                }}
              />
            ) : (
              <Image
                source={{
                  uri:
                    WebService.url +
                    "/media/avatar_images/Samantha/1_xhdpi.png",
                }}
                style={styles.imageBox}
              />
            )}
          </ImageBackground>
        ) : (
          <ImageBackground
            style={styles.backgroundImageBox}
            source={require("../../assets/images/onboardingImage/avatar_blob.png")}
          >
            {single.avatar_image ? (
              <Image
                style={styles.imageBox}
                source={{
                  uri: WebService.url + single.avatar_image,
                }}
              />
            ) : (
              <Image
                source={{
                  uri:
                    WebService.url +
                    "/media/avatar_images/Samantha/1_xhdpi.png",
                }}
                style={styles.imageBox}
              />
            )}
          </ImageBackground>
        )}
        {/* <ImageBackground
                style={styles.backgroundImageBox}
                source={require("../../assets/images/rewards_item_bg.png")}
              >
                <Image
                  source={require("../../assets/images/avatars/faces/7_xhdpi.png")}
                  style={styles.imageBox}
                />
              </ImageBackground> */}
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.0, y: 1.0 }}
        locations={[0, 1.0]}
        colors={["#62357C", "#6497CC"]}
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
      >
        <ImageBackground
          source={require("./../../assets/images/profile_card_bg_muver.png")}
          style={styles.backgroundImage}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack(null);
                }}
              >
                <View style={{ width: 30, height: 30, marginLeft: 10 }}>
                  <Icon
                    name="md-arrow-forward"
                    size={18}
                    color="#ffffff"
                    style={{ transform: [{ rotateZ: "180deg" }] }}
                  />
                </View>
              </TouchableOpacity>
              <View style={{ padding: 10 }}>
                <Text style={styles.title}>{strings('id_0_29')}</Text>
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
                  {strings('id_0_30')}
                </Text>
              </View>
              <View style={styles.borderTopAvatar} />

              {this.viewAvatars()}
              <View style={{}}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    top: 50,
                  }}
                >
                  <View style={styles.buttonContainer}>
                    <View>
                      <TouchableOpacity
                        disabled={!this.state.avatar}
                        onPress={this.navigateToPerm}
                        style={[
                          styles.buttonRegister,
                          { opacity: this.state.avatar ? 1 : 0.6 },
                        ]}
                      >
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
                          {strings("id_0_118")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </ImageBackground>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImageBox: {
    width: Dimensions.get("window").width * 0.35,
    height: Dimensions.get("window").width * 0.35,
    alignSelf: "center",
    justifyContent: "center",
  },
  imageBox: {
    width: Dimensions.get("window").width * 0.27,
    height: Dimensions.get("window").width * 0.27,
    alignSelf: "center",
    justifyContent: "center",
  },
  textcondition: {
    width: Dimensions.get("window").width * 0.9,
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 30,
  },
  borderTopAvatar: {
    width: Dimensions.get("window").width * 0.8,
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "column",
    alignItems: "center",
    height: 1,
    backgroundColor: "#FFFFFF",
  },
  paddingCalories: {
    paddingTop: 10,
    width: Dimensions.get("window").width * 0.85,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  paddingInput: {
    paddingTop: 30,
    width: Dimensions.get("window").width * 0.85,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  LeftTitle: {
    alignSelf: "center",

    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 16,
    color: "#FFFFFF",
  },
  titleCalories: {
    textAlign: "left",

    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 11,
    color: "#FFFFFF",
  },
  inputView: {
    width: Dimensions.get("window").width * 0.85,
    height: 44,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  borderInput: {
    width: Dimensions.get("window").width * 0.85 - 5,
    height: 1,
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonRegister: {
    width: Dimensions.get("window").width * 0.35,
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
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  topOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    top: Platform.OS == "ios" ? 0 : -30,
  },
  bottomOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    top: Dimensions.get("window").height * 0.8,
  },
  textHeaderContainer: {
    marginTop: Platform.OS == "ios" ? 30 : 15,
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
  textFooterContainer: {
    padding: 5,
    width: Dimensions.get("window").width * 0.7,
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    marginBottom: Platform.OS == "ios" ? 20 : 30,
  },
  textFooter: {
    fontFamily: "OpenSans-Regular",
    color: "#fff",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "left",
  },
  buttonContainer: {
    width: Dimensions.get("window").width,
    height: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-evenly",
    alignItems: "center",
    alignSelf: "center",
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
    elevation: 1,
  },
  buttonGoOnText: {
    color: "#3363AD",
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
  },
  sliderSubText: {
    color: "#fff",
    fontFamily: "OpenSans-Regular",
    fontSize: 8,
  },
});

const withData = connect((state) => {
  return {
    registerState: state.register,
  };
});

export default withData(ChooseRandomAvatarScreen);
