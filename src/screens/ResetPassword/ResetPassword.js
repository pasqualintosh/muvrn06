import React from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableHighlight,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import IconBack from "react-native-vector-icons/Ionicons";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

import { connect } from "react-redux";

import { ResetPasswordWithEmailNew } from "./../../domains/login/ActionCreators";

import { START_LOGIN } from "../../domains/login/ActionTypes";

import { strings } from "../../config/i18n";
import { getStatusBarHeight } from "./../../helpers/notch";
import LinearGradient from "react-native-linear-gradient";

class ResetPassword extends React.Component {
  // Costruttore per creare lo stato che poi contiene email e password
  // showPassword per dire se mostrare la password
  constructor() {
    super();
    this.state = {
      email: "",
      validationEmail: false,
      placeholderEmail: strings("email_address")
    };
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    // tolgo eventuali errori precedenti essendo che apro l'app la prima volta e sono sul login
    this.props.dispatch({
      type: START_LOGIN,
      payload: {
        status: ""
      }
    });
  }

  // gestire il valore del campo email
  // riceve il testo del campo email, text
  handleEmail = text => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    this.setState({
      email: text,
      validationEmail: re.test(String(text).toLowerCase())
    });
  };

  showAlert = msg => {
    Alert.alert(strings("id_0_10"), msg);
  };
  handleResetPassword = () => {
    const { email, validationEmail } = this.state;

    if (!validationEmail) {
      this.showAlert(strings('id_0_22'));
    } else {
      // recupero password
      this.props.dispatch(
        ResetPasswordWithEmailNew(
          email.toLowerCase(),
          this.props.navigation.navigate("CheckEmail")
        )
      );
    }
  };

  render() {
    const {
      email,

      validationEmail
    } = this.state;
    return (
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
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View>
            
            <View>
              <View style={styles.icon}>
              <View style={styles.textHeaderContainer}>
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
                    </View>
                <View style={{ height: 24 }}></View>
                <Image
                  source={require("../../assets/images/lostpassword.png")}
                  style={{
                    width: Dimensions.get("window").width * 0.7 - 100,
                    height: Dimensions.get("window").width * 0.7 - 100
                  }}
                />
                <View style={{ height: 24 }}></View>
                <View
                  style={{
                    alignContent: "center",
                    width: Dimensions.get("window").width * 0.85,
                    alignItems: "center",
                    flexDirection: "column"
                  }}
                >
                  <Text style={styles.textResetPassword}>
                    {strings("id_0_130")}
                  </Text>
                  <Text style={styles.textResetPassword}>
                    {strings("id_0_131")}
                  </Text>
                </View>
                <View style={{ height: 24 }}></View>
                <View style={styles.input}>
                  <OwnIcon
                    name="mail_icn"
                    size={40}
                    color={"#FFFFFF"}
                    style={{ paddingLeft: 10 }}
                  />

                  <TextInput
                    value={this.state.email}
                    autoCapitalize="none"
                    placeholder={strings("id_0_06")}
                    placeholderTextColor={"#FFFFFF"}
                    displayError={!this.state.ValidationEmail}
                    errorStyle={{ color: "red" }}
                    errorMessage="Email is invalid"
                    style={styles.inputText}
                    onChangeText={this.handleEmail}
                    blurOnSubmit={false}
                    onSubmitEditing={this.handleResetPassword}
                    keyboardType="email-address"
                    autoCorrect={false}
                    returnKeyType={"done"}
                    selectionColor={"#ffffff"}
                    onFocus={() => {
                      this.setState({ placeholderEmail: "" });
                    }}
                    onBlur={() => {
                      this.setState({
                        placeholderEmail: strings("email_address")
                      });
                    }}
                  />
                </View>
                <View style={{ height: 24 }}></View>
                <View>
                  <TouchableOpacity
                    disabled={
                      this.props.status === "Reset Password" ? true : false
                    }
                    onPress={this.handleResetPassword}
                    style={styles.buttonRegister}
                  >
                    {this.props.status !== "Reset Password" ? (
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
                        {strings("id_0_132")}
                      </Text>
                    ) : (
                      <ActivityIndicator size="small" color="#ffffff" />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={{ height: 24 }}></View>
              </View>
            </View>
            </View></TouchableWithoutFeedback></ScrollView></SafeAreaView>
          </ImageBackground></LinearGradient>
    );
  }
}

// elevation: 2 per avere l'ombra su android con versione 5 in su

const styles = {
  sfondo: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
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
    justifyContent: "space-around",
    height: Dimensions.get("window").height / 2,
    width: Dimensions.get("window").width
  },
  button: {
    width: Dimensions.get("window").width * 0.3,
    height: Dimensions.get("window").height / 20,
    borderRadius: 5,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
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
  textResetPassword: {
    alignContent: "center",
    marginBottom: 9,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    textAlign: "center",
    fontSize: 15,
    color: "#FFFFFF"
  },
  backgroundImageWave: {
    height: 90,
    width: Dimensions.get("window").width,
    position: "absolute",
    top: getStatusBarHeight()
  },
  textHeaderContainer: {
    flexDirection: "row",
    width: Dimensions.get("window").width,
    height: 90
  },
  input: {
    width: Dimensions.get("window").width * 0.85,
    height: 44,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    // backgroundColor: "transparent",
    // opacity: 0.15,
    // borderRadius: 4
    borderColor: "#FFFFFF",
    borderWidth: 1

    // marginVertical: 4
  },
  inputText: {
    // textDecorationColor: '#FFFFFF',
    color: "#ffffff",
    flex: 1,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    textAlign: "left",
    fontSize: 16
  },
  backgroundImageWaveDown: {
    height: 80,
    width: Dimensions.get("window").width
  },
  sfondo: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  icon: {
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "column",
    alignItems: "center"
  },
  buttonRegister: {
    width: Dimensions.get("window").width * 0.3,
    height: 44,
    borderRadius: 22,
    borderColor: "#FFFFFF",
    borderWidth: 1,

    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "column",
    alignItems: "center"
  },
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  topOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    top: Platform.OS == "ios" ? 0 : -30
  },
  bottomOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    top: Dimensions.get("window").height * 0.8
  },
  textHeader: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3d3d3d",
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
  },
  checkboxesContainer: {
    height: Dimensions.get("window").height * 0.85,
    width: Dimensions.get("window").width * 0.85,
    // backgroundColor: "transparent",
    // position: "absolute",
    // top: Dimensions.get("window").height * 0.75,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    // backgroundColor: "#3e3",
    marginTop: 5
  },
  checkboxContainer: {
    width: Dimensions.get("window").width * 0.85,
    marginVertical: 5
  },
  sfondo: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
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
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around"
  },
  button: {
    width: Dimensions.get("window").width * 0.3,
    height: 40,
    borderRadius: 20,
    alignItems: "center"
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
  containerFBLogin: {}
};

const ConnectLogin = connect(state => {
  return {
    status: state.login.status ? state.login.status : false
  };
});

export default ConnectLogin(ResetPassword);
