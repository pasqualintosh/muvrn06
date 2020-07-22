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
  Platform,
  Linking
} from "react-native";
import Svg, {
  Circle,
  LinearGradient,
  Line,
  Defs,
  Stop
} from "react-native-svg";
import { connect } from "react-redux";
import TimePicker from "./../../components/TimePicker/TimePicker";
import Switch from "react-native-switch-pro";
import { images } from "./../../components/InfoUserHome/InfoUserHome";
import { Tester } from "./../../config/Tester";
import { pushNotifications } from "./../../services/";
import Icon from "react-native-vector-icons/Ionicons";

import DeviceInfo from "react-native-device-info";
import { getDevice } from "../../helpers/deviceInfo"
import { limitAvatar } from "./../../components/UserItem/UserItem";
import { resetTutorial } from "../../domains/login/ActionCreators.js";

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
  setSundayNotificationIds,
  deleteSundayNotificationIds,
  setScheduledNotificationIds,
  deleteScheduledNotificationIds,
  getMostFrequentRoute
} from "./../../domains/login/ActionCreators";
import {
  frequentTripsState,
  frequentTripsNotSaveState
} from "./../../domains/login/Selectors.js";

import { strings } from "../../config/i18n";

class PersonalDataScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      avatar: 1,

      version: 1.0
    };
  }

  review = () => {
    if (Platform.OS == "ios") {
      Linking.openURL(
        "https://apps.apple.com/app/id1398343153?action=write-review"
      );
    } else {
      Linking.openURL("market://details?id=com.muv&showAllReviews=true");
    }
  };

  componentDidMount() {
    // chiedo i dati delle routine al db
    // this.props.dispatch(getMostFrequentRoute());
    const version = DeviceInfo.getVersion();

    const { infoProfile, infoProfileNotSave } = this.props.user;
    const info = { ...infoProfile, ...infoProfileNotSave };
    // se non ho info non salvate nel db, le metto in data

    this.setState({
      version,
      avatar: limitAvatar(info.avatar)
    });
  }

  // componentWillUnmount() {
  //   console.log("aggiornamento dati ");
  //   this.sendNewChange();
  // }

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

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("id_13_49")}
        </Text>
      )
    };
  };

  sendFeedBackTypeform = async () => {
    const device = await getDevice()
    this.props.navigation.navigate("FeedbackWebView", {
      device,
      report: false,
      feedbackMail: true
    });
  };

  sendFeedBack = async () => {
    /* try {
        Linking.openURL(
          "mailto:support@domain.com?subject=Hey buddies, I’ve a feedback about MUV 🤓 📬&body=Ciao,\nit’s [your name]\nand since I don’t have much time, here is my very brief feedback about MUV:\n- 🤬 this didn’t work --> ...\n- 🤯 I didn’t get this --> ...\n- 🤔 you should work better on this --> ...\n- 🤩 this is pretty neat! --> ...\n\nI'm sure you'll apreciate this and I hope my feedback will improve my beloved app.\nLove you all,\n[your name] 💞"
        );
      } catch (error) {
        console.log(error);
        alert(JSON.stringify(error));
        try {
          Linking.openURL(
            "googlegmail://?subject=Hey buddies, I’ve a feedback about MUV 🤓 📬&body=Ciao,\nit’s [your name]\nand since I don’t have much time, here is my very brief feedback about MUV:\n- 🤬 this didn’t work --> ...\n- 🤯 I didn’t get this --> ...\n- 🤔 you should work better on this --> ...\n- 🤩 this is pretty neat! --> ...\n\nI'm sure you'll apreciate this and I hope my feedback will improve my beloved app.\nLove you all,\n[your name] 💞"
          );
        } catch (error) {
          console.log(error);
          alert(JSON.stringify(error));
        }
      } */
      const device = await getDevice()

    const url =
      "mailto:feedback@muvgame.com?subject=" +
      strings("id_13_55") +
      "&body=" +
      strings("id_13_56") +
      device;

    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: " + url);
          const urlGmail =
            "googlegmail:feedback@muvgame.com?subject=" +
            strings("id_13_55") +
            "&body=" +
            strings("id_13_56") +
            device;
          Linking.canOpenURL(urlGmail)
            .then(supported => {
              if (!supported) {
                console.log("Can't handle url: " + urlGmail);
              } else {
                return Linking.openURL(urlGmail);
              }
            })
            .catch(err => console.error("An error occurred", err));
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error("An error occurred", err));
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
          <View style={styles.first}>
            <View style={styles.paddingStart} />
            <View style={styles.sessionFirst}>
              <View>
                <Text style={styles.left}>{strings("id_13_01")}</Text>
                <Text style={styles.leftDescription}>
                  {strings("id_13_02")}
                </Text>
                {/* 
                <Text style={styles.leftDescription}>
                  {strings("check_out_the_n")}
                </Text> 
                */}
              </View>
            </View>
            <TouchableOpacity
              style={{
                alignContent: "center",
                alignItems: "center",
                alignSelf: "center"
              }}
              onPress={() =>
                this.props.navigation.navigate("ChangeAvatarScreen", {
                  avatar: this.state.avatar,
                  ConfermNewAvatar: this.ConfermNewAvatar
                })
              }
            >
              <Image
                style={{
                  width: 80,
                  height: 80
                }}
                source={images[this.state.avatar]}
              />
            </TouchableOpacity>
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate("PersonalAnagraficDataScreen");
            }}
          >
            <View style={styles.other}>
              <View style={styles.paddingStart} />
              <View style={styles.session}>
                <View>
                  <Text style={styles.left}>{strings("id_13_03")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("id_13_04")}
                  </Text>
                </View>
              </View>
              <View style={styles.IconSession}>
                <Icon name="md-arrow-forward" size={18} color="#3d3d3d" />
              </View>
            </View>
          </TouchableWithoutFeedback>
          {/* <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate("PersonalMobilityDataScreen");
            }}
          >
            <View style={styles.other}>
              <View style={styles.session}>
                <View>
                  <Text style={styles.left}>{strings("mobility_habits")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("tell_us_more_ab")}
                  </Text>
                </View>
              </View>
              <Icon
                name="md-arrow-forward"
                size={18}
                color="#3d3d3d"
                style={{ alignSelf: "center", marginRight: 17 }}
              />
            </View>
          </TouchableWithoutFeedback> */}
          {/* <TouchableWithoutFeedback
            onPress={() =>
              this.props.navigation.navigate("PersonalFrequentTripDataScreen")
            }
          >
            <View style={styles.other}>
              <View style={styles.session}>
                <View>
                  <Text style={styles.left}>{strings("id_6_01")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("manage_your_dai")}
                  </Text>
                </View>
              </View>
              <Icon
                name="md-arrow-forward"
                size={18}
                color="#3d3d3d"
                style={{ alignSelf: "center", marginRight: 17 }}
              />
            </View>
          </TouchableWithoutFeedback> */}
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate("PrivacyAndSecurity");
            }}
          >
            <View style={styles.other}>
              <View style={styles.paddingStart} />
              <View style={styles.session}>
                <View>
                  <Text style={styles.left}>{strings("id_13_05")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("id_13_06")}
                  </Text>
                </View>
              </View>
              <View style={styles.IconSession}>
                <Icon name="md-arrow-forward" size={18} color="#3d3d3d" />
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate("PersonalNotificationDataScreen");
            }}
          >
            <View style={styles.other}>
              <View style={styles.paddingStart} />
              <View style={styles.session}>
                <View>
                  <Text style={styles.left}>{strings("id_13_07")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("id_13_08")}
                  </Text>
                </View>
              </View>
              <View style={styles.IconSession}>
                <Icon name="md-arrow-forward" size={18} color="#3d3d3d" />
              </View>
            </View>
          </TouchableWithoutFeedback>
          {/* <TouchableWithoutFeedback
            onPress={() => this.props.navigation.navigate("FAQScreen")}
          >
            <View style={styles.other}>
              <View style={styles.paddingStart} />
              <View style={styles.session}>
                <View>
                  <Text style={styles.left}>{"Rules and FAQ"}</Text>
                  <Text style={styles.leftDescription}>
                    {"Frequently Asked Questions"}
                  </Text>
                </View>
              </View>
              <View style={styles.IconSession}>
                <Icon name="md-arrow-forward" size={18} color="#3d3d3d" />
              </View>
            </View>
          </TouchableWithoutFeedback> */}
          <TouchableWithoutFeedback onPress={() => this.sendFeedBack()}>
            <View style={styles.other}>
              <View style={styles.paddingStart} />
              <View style={styles.session}>
                <View>
                  <Text style={styles.left}>{strings("id_13_53")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("id_13_54")}
                  </Text>
                </View>
              </View>
              <View style={styles.IconSession}>
                <Icon name="md-arrow-forward" size={18} color="#3d3d3d" />
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => this.props.navigation.navigate("LanguagesScreen")}
          >
            <View style={styles.other}>
              <View style={styles.paddingStart} />
              <View style={styles.session}>
                <View>
                  <Text style={styles.left}>{strings("id_13_09")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("id_13_10")}
                  </Text>
                </View>
              </View>
              <View style={styles.IconSession}>
                <Icon name="md-arrow-forward" size={18} color="#3d3d3d" />
              </View>
            </View>
          </TouchableWithoutFeedback>
          {/* <TouchableWithoutFeedback
            onPress={() => this.review()}
          >
            <View style={styles.other}>
              <View style={styles.paddingStart} />
              <View style={styles.session}>
                <View>
                  <Text style={styles.left}>Rate the App</Text>
                  <Text style={styles.leftDescription}>
                    Enjoying MUV?
                  </Text>
                </View>
              </View>
              <View style={styles.IconSession}>
                <Icon name="md-arrow-forward" size={18} color="#3d3d3d" />
              </View>
            </View>
          </TouchableWithoutFeedback> */}
          <TouchableWithoutFeedback
            onPress={() => this.props.dispatch(resetTutorial("tutorialStart"))}
          >
            <View style={styles.other}>
              <View style={styles.paddingStart} />
              <View style={styles.session}>
                <View>
                  <Text style={styles.left}>{strings("id_13_11")}</Text>
                  <Text style={styles.leftDescription}>
                    {strings("id_13_12")}
                  </Text>
                </View>
              </View>
              <View style={styles.IconSession}>
                <Icon name="md-arrow-forward" size={18} color="#3d3d3d" />
              </View>
            </View>
          </TouchableWithoutFeedback>

          <View style={styles.other}>
            <View style={styles.paddingStart} />
            <View style={styles.session}>
              <View>
                <Text style={styles.left}>{strings("id_13_13")}</Text>
                <Text style={styles.leftDescription}>{this.state.version}</Text>
              </View>
            </View>
            <View style={styles.IconSession}></View>
          </View>

          <View style={styles.lastPadding} />
          {/* {this.renderNotificationScheduleSettings()} */}
          {/* 
          {this.state.load
            ? this.props.routine.map((elem, index) => (
                <View
                  key={elem.id}
                  style={{
                    flexDirection: "row",
                    borderRadius: 4,
                    marginTop: 7,
                    justifyContent: "space-around",
                    alignItems: "center",
                    height: Dimensions.get("window").height * 0.1,

                    borderBottomColor: "#5F5F5F",
                    borderBottomWidth: 0.3
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.goToDetailFrequentRoutine(elem)}
                    style={{
                      height: 40,
                      width: Dimensions.get("window").width * 0.6,
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center"
                    }}
                  >
                    <View
                      style={{
                        marginHorizontal: 12,
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <Svg height="40" width="40">
                        <Defs>
                          <LinearGradient
                            id="grad"
                            x1="0"
                            y1="0"
                            x2="10"
                            y2="0"
                          >
                            <Stop
                              offset="0"
                              stopColor="#7D4D99"
                              stopOpacity="1"
                            />
                            <Stop
                              offset="1"
                              stopColor="#6497CC"
                              stopOpacity="1"
                            />
                          </LinearGradient>
                          <LinearGradient
                            id="grad2"
                            x1="0"
                            y1="0"
                            x2="10"
                            y2="0"
                          >
                            <Stop
                              offset="0"
                              stopColor="#E82F73"
                              stopOpacity="1"
                            />
                            <Stop
                              offset="1"
                              stopColor="#F49658"
                              stopOpacity="1"
                            />
                          </LinearGradient>
                        </Defs>
                        <Circle cx="5" cy="5" r="5" fill="url(#grad)" />
                        <Line
                          x1="5"
                          y1="11"
                          x2="5"
                          y2="15"
                          stroke="#3D3D3D"
                          strokeWidth="1"
                        />
                        <Line
                          x1="5"
                          y1="17"
                          x2="5"
                          y2="21"
                          stroke="#3D3D3D"
                          strokeWidth="1"
                        />
                        <Line
                          x1="5"
                          y1="23"
                          x2="5"
                          y2="27"
                          stroke="#3D3D3D"
                          strokeWidth="1"
                        />
                        <Circle cx="5" cy="33" r="5" fill="url(#grad2)" />
                      </Svg>
                      <View
                        style={{
                          marginHorizontal: 18,
                          flexDirection: "row",
                          alignItems: "center"
                        }}
                      >
                        <Text style={styles.mfrText}>
                          {type[elem.start_type]}
                        </Text>
                        <View
                          style={{
                            width: 40,
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center"
                          }}
                        >
                          <Text style={styles.mfrText}>{"<"}</Text>
                          <Text style={styles.mfrText}>{">"}</Text>
                        </View>
                        <Text style={styles.mfrText}>
                          {type[elem.end_type]}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {this.renderDeleteBtn(index, elem.id)}
                </View>
              ))
            : <View />}
          {this.state.load
            ? this.props.routineNotSave.map((elem, index) => (
                <View
                  key={index + this.props.routine.length}
                  style={{
                    height: 40,
                    flexDirection: "row",
                    borderRadius: 4,
                    marginTop: 7,
                    justifyContent: "space-around",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      height: 40,
                      width: Dimensions.get("window").width * 0.6,
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center"
                    }}
                  >
                    <View
                      style={{
                        marginHorizontal: 12,
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <Svg height="40" width="40">
                        <Defs>
                          <LinearGradient
                            id="grad"
                            x1="0"
                            y1="0"
                            x2="10"
                            y2="0"
                          >
                            <Stop
                              offset="0"
                              stopColor="#7D4D99"
                              stopOpacity="1"
                            />
                            <Stop
                              offset="1"
                              stopColor="#6497CC"
                              stopOpacity="1"
                            />
                          </LinearGradient>
                          <LinearGradient
                            id="grad2"
                            x1="0"
                            y1="0"
                            x2="10"
                            y2="0"
                          >
                            <Stop
                              offset="0"
                              stopColor="#E82F73"
                              stopOpacity="1"
                            />
                            <Stop
                              offset="1"
                              stopColor="#F49658"
                              stopOpacity="1"
                            />
                          </LinearGradient>
                        </Defs>
                        <Circle cx="5" cy="5" r="5" fill="url(#grad)" />
                        <Line
                          x1="5"
                          y1="11"
                          x2="5"
                          y2="15"
                          stroke="#3D3D3D"
                          strokeWidth="1"
                        />
                        <Line
                          x1="5"
                          y1="17"
                          x2="5"
                          y2="21"
                          stroke="#3D3D3D"
                          strokeWidth="1"
                        />
                        <Line
                          x1="5"
                          y1="23"
                          x2="5"
                          y2="27"
                          stroke="#3D3D3D"
                          strokeWidth="1"
                        />
                        <Circle cx="5" cy="33" r="5" fill="url(#grad2)" />
                      </Svg>
                      <View
                        style={{
                          marginHorizontal: 18,
                          flexDirection: "row",
                          alignItems: "center"
                        }}
                      >
                        <Text style={styles.mfrText}>
                          {type[elem.start_type]}
                        </Text>
                        <View
                          style={{
                            width: 40,
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center"
                          }}
                        >
                          <Text style={styles.mfrText}>{"<"}</Text>
                          <Text style={styles.mfrText}>{">"}</Text>
                        </View>
                        <Text style={styles.mfrText}>
                          {type[elem.end_type]}
                        </Text>
                      </View>
                    </View>
                  </View>
                
                </View>
              ))
            : <View />} 
            */}
          <View
            style={{ paddingBottom: Dimensions.get("window").height / 10 }}
          />
        </ScrollView>
      </View>
    );
  }
}

const withData = connect(state => {
  // prendo solo le routine
  return {
    // routine: frequentTripsState(state),
    // routineNotSave: frequentTripsNotSaveState(state),
    user: state.login,
    infoProfile: state.login.infoProfile
  };
});

export default withData(PersonalDataScreen);

const styles = StyleSheet.create({
  first: {
    flex: 1,
    height:
      Dimensions.get("window").height * 0.1 > 100
        ? Dimensions.get("window").height * 0.1
        : 100,
    flexDirection: "row",
    borderTopColor: "#9D9B9C",
    borderTopWidth: 0.3,
    backgroundColor: "#fff"
  },

  other: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderTopColor: "#9D9B9C",
    borderTopWidth: 0.3,

    backgroundColor: "#fff"
  },
  IconSession: {
    width: 40,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#fff"
  },
  lastPadding: {
    flex: 1,
    height: Dimensions.get("window").height * 0.2,
    flexDirection: "row"
  },
  last: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderTopColor: "#9D9B9C",
    borderTopWidth: 0.3
  },
  leftFrequentRoute: {
    // alignSelf: "center",
    // textAlignVertical: "center",
    // flex: 1,
    fontSize: 15,
    fontWeight: "bold"
    // left: 20
  },
  left: {
    alignSelf: "flex-start",
    textAlignVertical: "center",
    textAlign: "left",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
  },
  leftDescription: {
    alignSelf: "auto",
    textAlignVertical: "center",
    textAlign: "left",
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D"
  },
  session: {
    alignSelf: "flex-start",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "flex-start",
    alignItems: "flex-start",
    width: Dimensions.get("window").width - 60,
    height: Dimensions.get("window").height * 0.1
  },
  paddingStart: {
    width: 20,
    height: Dimensions.get("window").height * 0.1
  },
  sessionFirst: {
    alignSelf: "flex-start",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "flex-start",
    alignItems: "flex-start",
    width: Dimensions.get("window").width - 100,
    height:
      Dimensions.get("window").height * 0.1 > 100
        ? Dimensions.get("window").height * 0.1
        : 100
  },
  right: {
    alignSelf: "center",
    right: 20,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },
  rightAndroid: {
    alignSelf: "center",
    right: 10
  },
  rightText: {
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
