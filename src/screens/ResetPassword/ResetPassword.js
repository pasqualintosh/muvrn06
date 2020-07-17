import React from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableHighlight,
  ImageBackground,
  Platform,
  ActivityIndicator,
  Alert
} from "react-native";

import LinearGradient from "react-native-linear-gradient";

import InputEmail from "../../components/InputLogin/InputEmail";
import { Input } from "react-native-elements";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

import { connect } from "react-redux";

import { ResetPasswordWithEmail } from "./../../domains/login/ActionCreators";

import { START_LOGIN } from "../../domains/login/ActionTypes";

import { strings } from "../../config/i18n";

class ResetPassword extends React.Component {
  // Costruttore per creare lo stato che poi contiene email e password
  // showPassword per dire se mostrare la password
  constructor() {
    super();
    this.state = {
      email: "",
      validationEmail: false
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
          {strings("reset_password")}
        </Text>
      )
    };
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
    Alert.alert("Oops", msg);
  };
  handleResetPassword = () => {
    const { email, validationEmail } = this.state;

    if (!validationEmail) {
      this.showAlert("Please, provide an email address");
    } else {
      // recupero password
      this.props.dispatch(
        ResetPasswordWithEmail(
          email,
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
      <View>
        <ImageBackground
          source={require("../../assets/images/purple_bg.png")}
          style={styles.sfondo}
        >
          <View style={styles.center}>
            <Image
              source={require("../../assets/images/lostpassword.png")}
              style={{
                width: 80,
                height: 80
              }}
            />
            <View style={{ alignContent: "center" }}>
              <Text style={styles.textResetPassword}>
                {strings("hey__it_happens")}
              </Text>
              <Text style={styles.textResetPassword}>
                {strings("just_let_us_kno")}
              </Text>
              <Text style={styles.textResetPassword}>
                {strings("and_we_ll_send_")}
              </Text>
            </View>
            <View>
              <InputEmail
                leftIcon={<OwnIcon name="mail_icn" size={40} color="#E82F73" />}
                ValidationEmail={true}
                email={email}
                handleEmail={this.handleEmail}
                returnKeyType={"done"}
                blurOnSubmit={false}
                onSubmitEditing={this.handleResetPassword}
                secondTextInput={this.secondTextInput}
                styleForm={{ borderRadius: 10 }}
              />
            </View>

            <LinearGradient
              start={{ x: 0.0, y: 0.0 }}
              end={{ x: 1.0, y: 0.0 }}
              locations={[0, 1.0]}
              colors={["#e82f73", "#f49658"]}
              style={styles.button}
            >
              <TouchableHighlight
                onPress={this.handleResetPassword}
                style={{
                  width: Dimensions.get("window").width * 0.3,
                  height: Dimensions.get("window").height / 20,
                  borderRadius: 5,
                  alignItems: "center",
                  shadowRadius: 5
                }}
                disabled={this.props.status === "In connect" ? true : false}
              >
                <View
                  style={{
                    height: Dimensions.get("window").height / 20,
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent: "center",
                    flexDirection: "row"
                  }}
                >
                  {this.props.status !== "Reset Password" ? (
                    <Text style={{ color: "#FFFFFF" }}>{strings("send")}</Text>
                  ) : (
                      <ActivityIndicator size="small" color="white" />
                    )}
                </View>
              </TouchableHighlight>
            </LinearGradient>
          </View>
        </ImageBackground>
      </View>
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
    fontSize: 12,
    color: "#FFFFFF"
  }
};

const ConnectLogin = connect(state => {
  return {
    status: state.login.status ? state.login.status : false
  };
});

export default ConnectLogin(ResetPassword);
