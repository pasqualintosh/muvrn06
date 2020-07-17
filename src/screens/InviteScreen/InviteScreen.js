import React from "react";
import {
  View,
  Text,
  Clipboard,
  Dimensions,
  Image,
  TouchableHighlight,
  ImageBackground,
  Platform,
  ActivityIndicator,
  Alert,
  Linking,
  Share
} from "react-native";

import LinearGradient from "react-native-linear-gradient";

import InputEmail from "../../components/InputLogin/InputEmail";
import { connect } from "react-redux";

import OwnIcon from "../../components/OwnIcon/OwnIcon";
import Svg, { Circle } from "react-native-svg";

import Settings from "../../config/Settings";
import DeviceInfo from "react-native-device-info";
// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

import { strings } from "../../config/i18n";

class InviteScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      events: {}
    };
  }

  sendEventShared = () => {
    // const ga = new Analytics(
    //   Settings.analyticsCode,
    //   DeviceInfo.getUniqueID(),
    //   1,
    //   DeviceInfo.getUserAgent()
    // );
    // let event = this.state.events["shared-clicked"];
    // let gaEvent = new GAHits.Event(
    //   "user interaction", // category
    //   "shared clicked", // action
    //   "sharing", // label
    //   event // value
    // );
    // ga.send(gaEvent);
  };

  inviteWhatsApp = url => {
    this.sendEventShared();
    const link = `whatsapp://send?text=${url}`;

    Linking.canOpenURL(link)
      .then(supported => {
        if (!supported) {
          if (Platform.OS !== "android") {
            // se iphone
            Linking.openURL(
              "https://apps.apple.com/app/whatsapp-messenger/id310633997"
            );
          } else {
            // se android
            Linking.openURL("market://details?id=com.whatsapp");
          }
        } else {
          return Linking.openURL(link);
        }
      })
      .catch(err => console.error("An error occurred con whatsapp", err));
  };

  inviteGmail = url => {
    // try {
    //   // Linking.openURL("mailto:receiver@domain.com?subject=MUV&body=" + link);

    //   Linking.openURL(
    //     "https://mail.google.com/mail/?view=cm&su={MUV}&body={" +
    //       this.state.url +
    //       "}"
    //   );
    // } catch (error) {
    //   console.log(error);
    //   alert(JSON.stringify(error));
    // }

    try {
      this.sendEventShared();
      Linking.openURL("googlegmail://?subject=MUV&body={" + url + "}");
    } catch (error) {
      console.log(error);
      alert(JSON.stringify(error));
    }
  };

  inviteEmail = url => {
    this.sendEventShared();
    const urlEmail = "mailto:?subject=MUV&body={" + url + "}";

    Linking.canOpenURL(urlEmail)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: " + urlEmail);
          const urlGmail = "googlegmail://?subject=MUV&body={" + url + "}";
          Linking.canOpenURL(urlGmail)
            .then(supported => {
              if (!supported) {
                console.log("Can't handle url con gmail: " + urlGmail);
              } else {
                return Linking.openURL(urlGmail);
              }
            })
            .catch(err => console.error("An error occurred con gmail", err));
        } else {
          return Linking.openURL(urlEmail);
        }
      })
      .catch(err => console.error("An error occurred con email", err));
  };

  inviteTelegram = url => {
    this.sendEventShared();
    // controllo se ho telegram, in caso lo scarico dallo store
    const link = `tg://msg?text=${url}`;

    Linking.canOpenURL(link)
      .then(supported => {
        if (!supported) {
          if (Platform.OS !== "android") {
            // se iphone
            Linking.openURL(
              "https://apps.apple.com/app/telegram-messenger/id686449807"
            );
          } else {
            // se android
            Linking.openURL("market://details?id=org.telegram.messenger");
          }
        } else {
          return Linking.openURL(link);
        }
      })
      .catch(err => console.error("An error occurred con telegram", err));
  };

  inviteOther = url => {
    this.sendEventShared();
    Share.share(
      {
        message: url,
        url: url,
        title: "Share and download MUV"
      },
      {
        dialogTitle: "Share and download MUV",
        excludedActivityTypes: []
      }
    );
  };

  writeToClipboard = async url => {
    this.sendEventShared();
    await Clipboard.setString(url);
  };

  render() {
    const url = this.props.navigation.getParam("url", "");
    console.log(url);
    return (
      <View>
        <ImageBackground
          source={require("../../assets/images/add_friends_bg.png")}
          style={styles.sfondo}
        >
          <Image
            style={{
              width: 60,
              height: 60,
              position: "absolute",
              top: Dimensions.get("window").height * 0.4 - 45,
              right: 20
            }}
            source={require("../../assets/images/coins_icn_friends_banner.png")}
          />
          <View style={styles.center}>
            <View
              style={{
                height: Dimensions.get("window").height * 0.35,
                width: Dimensions.get("window").width,
                flexDirection: "column",
                justifyContent: "space-around",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  height: Dimensions.get("window").height * 0.2,
                  width: Dimensions.get("window").width,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignContent: "center",
                  alignItems: "center"
                }}
              >
                <Image
                  source={require("../../assets/images/friends_banner_icn.png")}
                  style={{
                    width: Dimensions.get("window").height / 5 - 30,
                    height: Dimensions.get("window").height / 5 - 30
                  }}
                />
                <View style={{ alignContent: "center" }}>
                  <Text style={styles.textInviteDescr}>
                    {strings("invite_your_fri").toUpperCase()}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignContent: "space-around",
                  alignItems: "center"
                }}
              >
                <View style={{ alignContent: "center" }}>
                  <View style={styles.labelFase}>
                    <View style={{ alignContent: "center", width: 20 }} />
                    <View style={styles.Fase}>
                      <Text style={styles.textFase}>{strings("phase")} 1</Text>
                    </View>
                    <View style={{ alignContent: "center", width: 20 }} />
                    <View style={styles.restFase}>
                      <Text style={styles.textFaseDescr}>
                        {strings("share_your_pers")}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.labelFase}>
                    <View style={{ alignContent: "center", width: 20 }} />
                    <View style={styles.Fase}>
                      <Text style={styles.textFase}>{strings("phase")} 2</Text>
                    </View>
                    <View style={{ alignContent: "center", width: 20 }} />
                    <View style={styles.restFase}>
                      <Text style={styles.textFaseDescr}>
                        {strings("wait_them_to_do")}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.labelFase}>
                    <View style={{ alignContent: "center", width: 20 }} />
                    <View style={styles.Fase}>
                      <Text style={styles.textFase}>{strings("phase")} 3</Text>
                    </View>
                    <View style={{ alignContent: "center", width: 20 }} />
                    <View style={styles.restFase}>
                      <Text style={styles.textFaseDescr}>
                        {strings("get_2_extra_coi")}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                height: Dimensions.get("window").height * 0.05,
                width: Dimensions.get("window").width,
                flexDirection: "column",
                justifyContent: "space-around",
                alignContent: "center",
                alignItems: "center"
              }}
            />
            <View
              style={{
                height: Dimensions.get("window").height * 0.5,
                width: Dimensions.get("window").width,
                flexDirection: "column",
                justifyContent: "space-around",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <View style={styles.shareView}>
                <Text style={styles.share}>{strings("share_via_")}</Text>
                <View style={styles.shareBoxDivide}>
                  <TouchableHighlight onPress={() => this.inviteWhatsApp(url)}>
                    <View style={styles.shareBox}>
                      <View
                        style={{
                          alignContent: "center",
                          width: 6
                        }}
                      />
                      <Image
                        source={require("../../assets/images/social/whatsapp_icn.png")}
                        style={{
                          width: Dimensions.get("window").height / 20 - 6,
                          height: Dimensions.get("window").height / 20 - 6
                        }}
                      />
                      <View
                        style={{
                          alignContent: "center",
                          width: 6
                        }}
                      />
                      <Text style={styles.social}>WhatsApp</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight onPress={() => this.inviteEmail(url)}>
                    <View style={styles.shareBox}>
                      <View
                        style={{
                          alignContent: "center",
                          width: 6
                        }}
                      />
                      <Image
                        source={require("../../assets/images/social/email_share_icn.png")}
                        style={{
                          width: Dimensions.get("window").height / 20 - 6,
                          height: Dimensions.get("window").height / 20 - 6
                        }}
                      />
                      <View
                        style={{
                          alignContent: "center",
                          width: 6
                        }}
                      />
                      <Text style={styles.social}>Email</Text>
                    </View>
                  </TouchableHighlight>
                </View>
                <View
                  style={{
                    alignContent: "center",
                    height: Dimensions.get("window").height / 30
                  }}
                />
                <View style={styles.shareBoxDivide}>
                  <TouchableHighlight onPress={() => this.inviteTelegram(url)}>
                    <View style={styles.shareBox}>
                      <View
                        style={{
                          alignContent: "center",
                          width: 6
                        }}
                      />
                      <Image
                        source={require("../../assets/images/social/telegram_icn.png")}
                        style={{
                          width: Dimensions.get("window").height / 20 - 6,
                          height: Dimensions.get("window").height / 20 - 6
                        }}
                      />
                      <View
                        style={{
                          alignContent: "center",
                          width: 6
                        }}
                      />
                      <Text style={styles.social}>Telegram</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight onPress={() => this.inviteOther(url)}>
                    <View style={styles.shareBox}>
                      <View
                        style={{
                          alignContent: "center",
                          width: 6
                        }}
                      />

                      <View
                        style={{
                          flexDirection: "row",
                          width: Dimensions.get("window").height / 20 - 6,
                          height: Dimensions.get("window").height / 20 - 6,
                          alignItems: "center"
                        }}
                      >
                        <Svg
                          height={Dimensions.get("window").height / 60 - 2}
                          width={Dimensions.get("window").height / 60 - 2}
                          viewBox="0 0 33 100"
                        >
                          <Circle
                            cx="50"
                            cy="50"
                            r="20"
                            //stroke="white"
                            fill="#3D3D3D"
                          />
                        </Svg>
                        <Svg
                          height={Dimensions.get("window").height / 60 - 2}
                          width={Dimensions.get("window").height / 60 - 2}
                          viewBox="0 0 33 100"
                        >
                          <Circle
                            cx="50"
                            cy="50"
                            r="20"
                            //stroke="white"
                            fill="#3D3D3D"
                          />
                        </Svg>
                        <Svg
                          height={Dimensions.get("window").height / 60 - 2}
                          width={Dimensions.get("window").height / 60 - 2}
                          viewBox="0 0 33 100"
                        >
                          <Circle
                            cx="50"
                            cy="50"
                            r="20"
                            //stroke="white"
                            fill="#3D3D3D"
                          />
                        </Svg>
                      </View>

                      <View
                        style={{
                          alignContent: "center",
                          width: 6
                        }}
                      />
                      <Text style={styles.social}>Other</Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>

              <View style={styles.shareView}>
                <Text style={styles.share}>{strings("or_use_your_cus")}</Text>
                <View style={styles.shareBoxDivide}>
                  <View style={styles.shareBoxLink}>
                    <View style={{ width: 20 }} />
                    <View
                      style={{
                        width:
                          Dimensions.get("window").width * 0.8 -
                          100 -
                          (Dimensions.get("window").height / 20 -
                            Dimensions.get("window").height / 24) *
                            2,
                        flexDirection: "column",

                        justifyContent: "center"
                      }}
                    >
                      <Text style={styles.shareLinkText}>{url}</Text>
                    </View>
                    <View
                      style={{
                        width: 80,
                        justifyContent: "center",
                        flexDirection: "row"
                      }}
                    >
                      <LinearGradient
                        start={{ x: 0.0, y: 0.0 }}
                        end={{ x: 0.0, y: 1.0 }}
                        locations={[0, 1.0]}
                        colors={["#7D4D99", "#6497CC"]}
                        style={styles.button}
                      >
                        <TouchableHighlight
                          onPress={() => this.writeToClipboard(url)}
                          disabled={
                            this.props.status === "Invite" ? true : false
                          }
                          style={{
                            width: 80,
                            height: Dimensions.get("window").height / 24,
                            borderRadius: 5,
                            alignItems: "center"
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            {this.props.status !== "Invite" ? (
                              <Text style={styles.textCopyLink}>
                                {strings("copy_link")}
                              </Text>
                            ) : (
                              <ActivityIndicator size="small" color="white" />
                            )}
                          </View>
                        </TouchableHighlight>
                      </LinearGradient>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    alignContent: "center",
                    height: Dimensions.get("window").height / 30
                  }}
                />
              </View>
              <View
                style={{
                  height: Dimensions.get("window").height * 0.1,
                  width: Dimensions.get("window").width,
                  flexDirection: "column",
                  justifyContent: "space-around",
                  alignContent: "center",
                  alignItems: "center"
                }}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

// elevation: 2 per avere l'ombra su android con versione 5 in su

const styles = {
  textCopyLink: {
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    textAlign: "center",
    // margin: 10,
    color: "#ffffff",
    backgroundColor: "transparent"
  },
  social: {
    fontSize: 12,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    textAlign: "left",

    color: "#3D3D3D",
    backgroundColor: "transparent"
  },
  sfondo: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  labelFase: {
    flexDirection: "row",
    justifyContent: "center",
    width: Dimensions.get("window").width
  },
  Fase: {
    width: 50
  },
  restFase: {
    width: Dimensions.get("window").width - 90
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
    backgroundColor: "transparent"
  },
  image: {
    width: Dimensions.get("window").width / 2,
    height: Dimensions.get("window").height / 3
  },
  center: {
    alignItems: "center",

    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width
  },
  button: {
    width: 80,
    height: Dimensions.get("window").height / 24,
    borderRadius: 5,
    alignItems: "center",
    shadowRadius: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2
  },
  buttonLoginSocial: {
    width: Dimensions.get("window").width / 2.3,
    height: Dimensions.get("window").height / 20,
    borderRadius: 3
  },
  buttonLoginGoogle: {
    width: Dimensions.get("window").width / 2.3,
    height: Dimensions.get("window").height / 20,
    borderRadius: 5,
    shadowRadius: 5
  },
  login: {
    width: Dimensions.get("window").width / 1.2,
    height: Dimensions.get("window").height / 15,
    alignItems: "center",

    borderColor: "#f7f8f9",
    borderWidth: 1
  },
  buttonPrecedente: {
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").height / 20,
    alignItems: "center",
    margin: 10
  },
  icon: {
    margin: 10,
    width: Dimensions.get("window").width / 13,
    height: Dimensions.get("window").height / 40
  },
  containerFBLogin: {},
  textInviteDescr: {
    alignContent: "center",
    marginBottom: 9,
    fontFamily: "Montserrat-ExtraBold",
    textAlign: "left",
    fontSize: 20,
    color: "#60368C"
  },
  textFaseDescr: {
    alignContent: "center",
    marginBottom: 9,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    textAlign: "left",
    fontSize: 10,
    color: "#3D3D3D"
  },
  share: {
    alignContent: "center",
    marginBottom: 9,
    fontFamily: "OpenSans-Regular",
    fontWeight: "700",
    textAlign: "left",
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "bold"
  },
  shareBox: {
    width: Dimensions.get("window").width * 0.35,
    height: Dimensions.get("window").height / 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.01 },
    shadowOpacity: 5,
    elevation: 1,
    flexDirection: "row",
    // justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  shareBoxLink: {
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").height / 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.01 },
    shadowOpacity: 5,
    elevation: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  shareBoxDivide: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  shareView: {
    width: Dimensions.get("window").width * 0.8
  },
  textFase: {
    alignContent: "center",
    marginBottom: 9,
    fontFamily: "Montserrat-ExtraBold",
    textAlign: "left",
    fontSize: 10,
    color: "#3D3D3D"
  },
  shareLinkText: {
    textAlign: "left",

    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    textAlign: "left",
    fontSize: 12,
    color: "#3D3D3D"
  }
};

export default InviteScreen;
