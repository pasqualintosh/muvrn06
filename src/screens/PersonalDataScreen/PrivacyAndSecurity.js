/**
 * scena per il riassunto della privacy e sicurezza dell'utente
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
  TouchableHighlight,
  ActivityIndicator
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";

import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";

import { deleteProfileNew } from "./../../domains/login/ActionCreators";
import { BoxShadow } from "react-native-shadow";
import LogOut from "../../components/LogOut/LogOut";
import * as Keychain from "react-native-keychain";

import { strings } from "../../config/i18n";

// <View style={{ paddingBottom: Dimensions.get("window").height / 10 }} />
// aggiungere un po di padding alla fine cosi è possibile vedere tutti gli elementti
// anche se c'e la notifica e l'onda

class PrivacyAndSecurity extends React.Component {
  constructor() {
    super();

    this.state = {
      isVisible: false,
      perm: null,
      security: null
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("id_13_05")}
        </Text>
      )
      // headerRight: <LogOut />
    };
  };

  alertdeleteCredentials = () => {
    Alert.alert(strings("are_you_sure___"), "", [
      {
        text: strings("id_14_03"),
        onPress: () => {
          this.deleteCredentials();
        }
      },
      {
        text: strings("id_14_04"),
        onPress: () => {},
        style: "cancel"
      }
    ]);
  };

  closeModal = () => {
    this.setState({
      isVisible: false
    });
  };

  openModal = () => {
    this.setState({
      isVisible: true
    });
  };

  handleDeleteAccount = () => {
    this.props.dispatch(deleteProfileNew());
  };

  shadow = () => {
    if (Platform.OS == "android") {
      return (
        <BoxShadow
          setting={{
            width: Dimensions.get("window").width * 0.4,
            height: 40,

            color: "#111",
            border: 1,
            radius: 10,
            opacity: 0.35,
            x: 0,
            y: 3,
            overflow: "hidden",
            style: {
              marginVertical: 0,
              position: "absolute",
              top: 10,
              right: 0,
              overflow: "hidden"
            }
          }}
        />
      );
    } else {
      return <View />;
    }
  };

  componentWillMount() {
    // Keychain.getSupportedBiometryType().then( perm => {
    //   this.setState({ perm})
    // })
    // Keychain.getSecurityLevel().then( security => {
    //   this.setState({ security})
    // })
  }

  deleteCredentials = () => {
    Keychain.resetGenericPassword().then();
  };

  updateCredentials = () => {
    const AUTH_OPTIONS = {
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      authenticationPrompt: strings("id_0_133"),
      authenticateType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS
    };
    // Store the credentials
    Keychain.setGenericPassword(username, password, AUTH_OPTIONS).then();
  };

  modalDeleteAccount = () => {
    return (
      <Modal
        isVisible={this.state.isVisible}
        onSwipe={() => {
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
          shadowOpacity: 0.5

          // backgroundColor: "white"
        }}
        backdropOpacity={0.7}
      >
        <View
          style={{
            borderRadius: 10,
            alignItems: "center",

            flexDirection: "column",
            justifyContent: "space-around",
            shadowRadius: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,

            height: Dimensions.get("window").height * 0.4,
            width: Dimensions.get("window").width * 0.8,
            backgroundColor: "white"
          }}
        >
          <Image
            style={{
              width: Dimensions.get("window").height * 0.15,
              height: Dimensions.get("window").height * 0.15,
              top: 10
            }}
            // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
            source={require("../../assets/images/delete_profile_icn.png")}
          />
          <View
            style={{
              height: Dimensions.get("window").height * 0.25,

              alignSelf: "center",
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-around",
              alignContent: "center"
            }}
          >
            <View
              style={{
                width: Dimensions.get("window").width * 0.7,
                height: Dimensions.get("window").height * 0.25,
                alignSelf: "center",
                flexDirection: "column",
                justifyContent: "space-around",
                alignContent: "center"
              }}
            >
              <Text
                style={{
                  color: "#3d3d3d",
                  fontSize: 14,
                  fontFamily: "OpenSans-Bold",
                  textAlign: "center"
                }}
              >
                {strings("id_13_33")}
              </Text>
              <View>
                <Text
                  style={{
                    color: "#3d3d3d",
                    fontSize: 10,
                    fontFamily: "OpenSans-Regular",
                    textAlign: "center"
                  }}
                >
                  {strings("id_13_34")}
                </Text>
                <Text
                  style={{
                    color: "#3d3d3d",
                    fontSize: 10,
                    fontFamily: "OpenSans-Regular",
                    textAlign: "center"
                  }}
                >
                  {strings("id_13_35")}
                </Text>
              </View>

              <View
                style={{
                  alignSelf: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                  shadowRadius: 5,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 0.5,
                  elevation: 1,
                  borderRadius: 5
                }}
              >
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 1.0, y: 0.0 }}
                  locations={[0, 1.0]}
                  colors={["#7D4D99", "#6497CC"]}
                  style={styles.button}
                >
                  <TouchableHighlight
                    onPress={this.handleDeleteAccount}
                    style={styles.button}
                    disabled={
                      this.props.status === "Delete Account" ? true : false
                    }
                  >
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {this.props.status !== "Delete Account" ? (
                        <Text
                          style={{
                            margin: 10,
                            color: "#FFFFFF",
                            fontSize: 14,
                            fontFamily: "OpenSans-Regular",
                            textAlign: "center"
                          }}
                        >
                          {strings("id_13_36")}
                        </Text>
                      ) : (
                        <ActivityIndicator size="small" color="white" />
                      )}
                    </View>
                  </TouchableHighlight>
                </LinearGradient>
              </View>
              <View style={{ width: 10 }} />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: "#fff"
        }}
      >
        {this.modalDeleteAccount()}
        <ScrollView
          style={{
            backgroundColor: "#fff",
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate("ChangePasswordScreen");
            }}
          >
            <View style={styles.other}>
              <View style={styles.session}>
                <View>
                  <Text style={styles.LeftTitle}>{strings("id_13_24")}</Text>
                  <Text style={styles.LeftDescr}>{strings("id_13_25")}</Text>
                </View>
              </View>
              <Icon
                name="md-arrow-forward"
                size={18}
                color="#3d3d3d"
                style={{ alignSelf: "center", marginRight: 17 }}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate("PersonalGdprDataScreen");
            }}
          >
            <View style={styles.other}>
              <View style={styles.session}>
                <View>
                  <Text style={styles.LeftTitle}>{strings("id_13_26")}</Text>
                  <Text style={styles.LeftDescr}>{strings("id_13_27")}</Text>
                </View>
              </View>
              <Icon
                name="md-arrow-forward"
                size={18}
                color="#3d3d3d"
                style={{ alignSelf: "center", marginRight: 17 }}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate("PrivacyPolicy");
            }}
          >
            <View style={styles.other}>
              <View style={styles.session}>
                <View>
                  <Text style={styles.LeftTitle}>{strings("id_13_63")}</Text>
                  <Text style={styles.LeftDescr}>{strings("id_13_64")}</Text>
                </View>
              </View>
              <Icon
                name="md-arrow-forward"
                size={18}
                color="#3d3d3d"
                style={{ alignSelf: "center", marginRight: 17 }}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate("TemsAndConditions");
            }}
          >
            <View style={styles.other}>
              <View style={styles.session}>
                <View>
                  <Text style={styles.LeftTitle}>{strings("id_13_61")}</Text>
                  <Text style={styles.LeftDescr}>{strings("id_13_62")}</Text>
                </View>
              </View>
              <Icon
                name="md-arrow-forward"
                size={18}
                color="#3d3d3d"
                style={{ alignSelf: "center", marginRight: 17 }}
              />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => this.openModal()}>
            <View style={styles.other}>
              <View style={styles.session}>
                <View>
                  <Text style={styles.LeftTitle}>{strings("id_13_28")}</Text>
                  <Text style={styles.LeftDescr}>{strings("id_13_28")}</Text>
                </View>
              </View>
              <Icon
                name="md-arrow-forward"
                size={18}
                color="#3d3d3d"
                style={{ alignSelf: "center", marginRight: 17 }}
              />
            </View>
          </TouchableWithoutFeedback>
          {/* {this.state.perm || this.state.security == 'SECURE_HARDWARE'  ? <View><TouchableWithoutFeedback onPress={() => this.openModal()}>
            <View style={styles.other}>
              <View style={styles.session}>
                <View>
                  <Text style={styles.LeftTitle}>
                    {"Salva le tue credenziali d'accesso"}
                  </Text>
                  <Text style={styles.LeftDescr}>
                    {"Per avere un pensiero in meno."}
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
          </TouchableWithoutFeedback><TouchableWithoutFeedback onPress={() => this.alertdeleteCredentials()}>
            <View style={styles.other}>
              <View style={styles.session}>
                <View>
                  <Text style={styles.LeftTitle}>
                    {"Cancella le tue credenziali d'accesso rapido"}
                  </Text>
                  <Text style={styles.LeftDescr}>
                    {"Perché complicarsi la vita?"}
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
          </TouchableWithoutFeedback></View> : <View/>} */}

          <View
            style={{ paddingBottom: Dimensions.get("window").height / 10 }}
          />
        </ScrollView>
      </View>
    );
  }
}

const ConnectLogin = connect(state => {
  return {
    status: state.login.status ? state.login.status : false
  };
});

export default ConnectLogin(PrivacyAndSecurity);

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
  last: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderTopColor: "#9D9B9C",
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
    alignSelf: "center",
    textAlignVertical: "center",
    flex: 1,
    fontSize: 12,
    fontWeight: "bold",
    left: 20,
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
  },
  LeftTitle: {
    alignSelf: "flex-start",
    textAlignVertical: "center",
    textAlign: "left",

    fontSize: 12,
    fontWeight: "bold",
    left: 20,
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
  },
  LeftDescr: {
    alignSelf: "auto",
    textAlignVertical: "center",
    textAlign: "left",

    fontSize: 11,

    left: 20,
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D"
  },
  session: {
    alignSelf: "flex-start",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
    height: Dimensions.get("window").height * 0.1
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
  button: {
    width: Dimensions.get("window").width * 0.4,
    height: 40,
    borderRadius: 5,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5
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
  }
});
