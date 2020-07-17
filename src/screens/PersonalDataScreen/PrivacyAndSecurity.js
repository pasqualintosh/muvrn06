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

import { deleteProfile } from "./../../domains/login/ActionCreators";
import { BoxShadow } from "react-native-shadow";
import LogOut from "../../components/LogOut/LogOut";

import { strings } from "../../config/i18n";

// <View style={{ paddingBottom: Dimensions.get("window").height / 10 }} />
// aggiungere un po di padding alla fine cosi è possibile vedere tutti gli elementti
// anche se c'e la notifica e l'onda

class PrivacyAndSecurity extends React.Component {
  constructor() {
    super();
    this.state = {
      isVisible: false
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
          {strings("privacy_and_sec")}
        </Text>
      )
      // headerRight: <LogOut />
    };
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
    this.props.dispatch(deleteProfile());
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
                {strings("we_re_sorry_to_")}
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
                  {strings("are_you_sure_yo")}
                </Text>
                <Text
                  style={{
                    color: "#3d3d3d",
                    fontSize: 10,
                    fontFamily: "OpenSans-Regular",
                    textAlign: "center"
                  }}
                >
                  {strings("the_action_is_i")}
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
                          {strings("yes__delete_it_")}
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
                  <Text style={styles.LeftTitle}>
                    {strings("change_password")}
                  </Text>
                  <Text style={styles.LeftDescr}>
                    {strings("security_is_nev")}
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
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate("PersonalGdprDataScreen");
            }}
          >
            <View style={styles.other}>
              <View style={styles.session}>
                <View>
                  <Text style={styles.LeftTitle}>
                    {strings("informed_consen")}
                  </Text>
                  <Text style={styles.LeftDescr}>
                    {strings("also_known_as_t")}
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
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => this.openModal()}>
            <View style={styles.other}>
              <View style={styles.session}>
                <View>
                  <Text style={styles.LeftTitle}>
                    {strings("delete_your_pro")}
                  </Text>
                  <Text style={styles.LeftDescr}>
                    {strings("why_would_you_w")}
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
          </TouchableWithoutFeedback>

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
