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
  TouchableOpacity
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";

import { Input } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import InputEmail from "../../components/InputLogin/InputEmail";
import InputPassword from "../../components/InputLogin/InputPassword";
import GoogleLogin from "../../components/GoogleLogin/GoogleLogin";
import * as Keychain from "react-native-keychain";
// import { FBLoginManager } from "react-native-facebook-login";
import WebService from "../../config/WebService";
import { Client } from "bugsnag-react-native";
const bugsnag = new Client(WebService.BugsnagAppId);

import { connect } from "react-redux";
import { startLoginNew } from "./../../domains/login/ActionCreators";

import { saveBranchTempData } from "./../../domains/register/ActionCreators";

import axios from "axios";
import { START_LOGIN } from "../../domains/login/ActionTypes";

// let FBLogin;
// if (Platform.OS === "ios")
//   FBLogin = require("./../../components/FBLogin/FBLogin").FBLogin;
// else FBLogin = require("react-native-facebook-login").FBLogin;

import { BoxShadow } from "react-native-shadow";

// import branch, { BranchEvent } from "react-native-branch";

import { strings } from "../../config/i18n";
import { getActiveStatusProfile } from "./../../domains/login/ActionCreators";

import Settings from "./../../config/Settings";
import FacebookLinkButton from "./../../components/FacebookLinkButton/FacebookLinkButton";
import { getStatusBarHeight } from "./../../helpers/notch";

import { store } from "../../store";

import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from "react-native-google-analytics-bridge";

let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);

import analytics from "@react-native-firebase/analytics";
async function trackScreenView(screen) {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
}

class WelcomeMUVToNewMUV extends React.Component {
  // Costruttore per creare lo stato che poi contiene email e password
  // showPassword per dire se mostrare la password
  constructor() {
    super();
    this.state = {
      email: "",
      ValidationEmail: true,
      password: "",
      passwordKeystone: "", // password recuperata dalla memoria tipo con face id
      ValidationPassword: true,
      showPassword: false,
      loggedInFromFb: false,
      loginAction: false
    };

    this.focusNextField = this.focusNextField.bind(this);
    // to store our input refs
    this.inputs = {};
  }

  static navigationOptions = {
    header: null
  };

  async loadIcloud() {
    try {
      // Retreive the credentials
      console.log("provs");
      const perm = await Keychain.getSupportedBiometryType();
      const security = await Keychain.getSecurityLevel();

      console.log(perm);
      console.log(security);
      // Alert.alert("perm: " + perm , "security: " + security);

      if (perm || security == "SECURE_HARDWARE") {
        const AUTH_OPTIONS = {
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
          authenticationPrompt: strings("id_0_133"),
          authenticateType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS
        };
        const credentials = await Keychain.getGenericPassword(AUTH_OPTIONS);
        if (credentials && credentials.username) {
          console.log(
            "Credentials successfully loaded for user " + credentials.username
          );
          console.log(
            "Credentials successfully loaded for password " +
              credentials.password
          );
          this.setState({
            email: credentials.username,

            password: "XXXXXXXXXXXX",
            passwordKeystone: credentials.password
          });

          if (Platform.OS === "ios") {
            // solo con iphone faccio il login automatico
            this.props.dispatch(
              startLoginNew(
                {
                  email: credentials.username,
                  password: credentials.password,
                  keychain: true
                },
                true
              )
            );
          }

          setTimeout(() => {
            Keyboard.dismiss();
          }, 1000);
        } else {
          console.log("No credentials stored");
        }
      }
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  }

  onFocus = () => {
    if (!this.state.email.length) {
      try {
        this.loadIcloud()
          .then()
          .catch();
      } catch (error) {
        console.log(error);
      }
    }
  };

  handleStatus = data => {
    if (data.is_active) {
      // account attivo, vado nella home
      this.props.dispatch(startLoginNew({}, false));
    } else {
      if (data.is_not_present) {
        // non c'e nel db
        console.log("non trovato utente nel db");
        this.props.dispatch({
          type: START_LOGIN,
          payload: {
            status: "",
            access_token: "",
            refresh_token: "",
            date: 0
          }
        });
        this.props.dispatch({
          type: START_LOGIN,
          payload: {
            infoProfile: {
              user_id: 0,
              id: 0, // per il nuovo muv
              username: "", // per il nuovo muv
              first_name: "",
              customisation_gdpr: false,
              sponsorships_gdpr: false
            }
          }
        });
        Alert.alert("Oops", strings("id_0_141"));
      } else {
        // c'e ma è d'attivare, rimango qui
        console.log(" trovato utente nel db, da attivare");
      }
    }
  };

  componentDidMount() {
    Tracker.trackScreenView("WelcomeMUVToNewMUV.js");
    trackScreenView("LoginWelcomeMUVToNewMUV.js");
    // this.setupGoogleSignin();
    this.setState({ loginAction: true });
    // tolgo eventuali errori precedenti essendo che apro l'app la prima volta e sono sul login
    // tolgo il token che non serve piu
    if (!store.getState().login.email) {
      this.props.dispatch({
        type: START_LOGIN,
        payload: {
          status: "",
          access_token: "",
          refresh_token: "",
          date: 0,
          email: store.getState().login.email
            ? store.getState().login.email
            : store.getState().login.username
        }
      });
    } else {
      this.props.dispatch({
        type: START_LOGIN,
        payload: {
          status: ""
        }
      });
    }

    getActiveStatusProfile(this.handleStatus);
  }

  componentWillUnmount() {
    this.setState({ loginAction: false });
  }

  // async setupGoogleSignin() {
  //   try {
  //     await GoogleSignin.hasPlayServices({ autoResolve: true });
  //     await GoogleSignin.configure({
  //       iosClientId:
  //         "1000447429429-gio3armp5rdmop4mvui41m7el1r4sub9.apps.googleusercontent.com",
  //       webClientId:
  //         "627922584945-ncgsp02emcplkj3dju3t9g922qvgovtl.apps.googleusercontent.com",
  //       offlineAccess: false
  //     });

  //     const user = await GoogleSignin.currentUserAsync();
  //     this.setState({ user });
  //   } catch (err) {
  //     console.log("Google signin error", err.code, err.message);
  //   }
  // }

  showAlert = msg => {
    Alert.alert("Oops", msg);
  };

  // gestire il valore del campo email
  // riceve il testo del campo email, text
  handleEmail = text => {
    this.setState({ email: text });

    // espresione regolare per l'email
    //  const  ExpRegMail = /\S+@\S+\.\S+/; versione basilare
    const ExpRegMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // controllo se il testo dell'email è valido
    const RisValid = ExpRegMail.test(text);
    // controllo la lunghezza per sapere se ha inserito qualcosa
    const length = !text.length;
    // se inserisce qualcosa e non è valida allora non è valida
    // quando si mandano i dati controllare la lunghezza se è 0 poiche qui è valido

    this.setState({ email: text, ValidationEmail: length || RisValid });
  };

  handlePassword = text => {
    const ExpRegPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9_.,\-+*!#@?]{6,25})$/;
    // altrimenti /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[_.,\-+*!#@?])([a-zA-Z0-9_.,\-+*!#@?]{6,25})$/
    // per avere Almeno uno tra questi caratteri speciali: .,_-+*!#@

    /*    ovvero 
    Almeno un numero
    Almeno un carattere alfanumerico minuscolo
    Almeno un carattere alfanumerico maiuscolo
    Lunghezza compresa tra 6 e 25 caratteri 
    */
    // controllo se il testo della password è valido
    // const RisValid = ExpRegPassword.test(text);
    // controllo la lunghezza per sapere se ha inserito qualcosa
    const length = !text.length;
    // se inserisce qualcosa e non è valida allora non è valida
    // quando si mandano i dati controllare la lunghezza se è 0 poiche qui è valido

    const RisValid = text.length > 8 ? true : false;

    this.setState({
      password: text,
      ValidationPassword: length || RisValid,
      passwordKeystone: ""
    });
  };

  // il click al tasto Login
  handleLogin = () => {
    Keyboard.dismiss();
    const {
      email,
      password,
      ValidationEmail,
      ValidationPassword,
      passwordKeystone
    } = this.state;

    // setto loginAction a false per evitare che venga
    // azionato durante la registrazione
    // DA TOGLIERE IN FUTURO E LASCIARE SOLO SU SIGN_UP
    this.setState({ loginAction: false });
    // controllo che i dati inseriri non siano nulli

    if (!email.length) {
      setTimeout(() => {
        this.showAlert(strings("id_0_22"));
      }, 50);
      // Keyboard.dismiss()
    } else if (!password.length) {
      setTimeout(() => {
        this.showAlert("Please, fill the password field");
      }, 50);
    } else {
      setTimeout(() => {
        this.props.dispatch(
          startLoginNew(
            { email, password: passwordKeystone ? passwordKeystone : password },
            true
          )
        );
      }, 50);
    }
  };

  // il click al tasto SignUp
  handleSignUp = () => {
    // setto loginAction a false per evitare che venga
    // azionato durante la registrazione
    this.setState({ loginAction: false });
    this.props.navigation.navigate("Welcome");
  };

  // cambiare se mostrare la password o no
  handleShowPassword = () => {
    this.setState(prevState => {
      return { showPassword: !prevState.showPassword };
    });
  };

  renderLogoText() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,

          backgroundColor: "transparent",

          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 13,
            fontFamily: "Montserrat-ExtraBold"
          }}
        >
          TO THE NEXT LEVEL
        </Text>
      </View>
    );
  }

  moveHome = () => {
    this.props.navigation.navigate("Welcome");
  };

  // metodi per gestire il campo di input premento su invio sulla tastiera
  refInput = (input, NameInput) => {
    this.inputs[NameInput] = input;
  };

  focusNextField(key) {
    this.inputs[key].focus();
  }

  movePrivacy = () => {
    console.log("condizioni premute");
    this.props.navigation.navigate("PrivacyPolicy");
  };

  moveCondition = () => {
    console.log("condizioni premute");
    this.props.navigation.navigate("TemsAndConditions");
  };

  nextScreen = () => {
    console.log("login account");
    this.props.navigation.navigate("NewNicknameScreen");
  };

  getUnderlinedSubStr(str, style, onPresses) {
    let result = str.split("%");

    return result.map((e, i) => {
      if (i % 2 == 0)
        return (
          <Text key={i} style={style}>
            {e}
          </Text>
        );
      else
        return (
          <Text
            key={i}
            style={[style, { textDecorationLine: "underline" }]}
            onPress={onPresses[i]}
          >
            {e}
          </Text>
        );
    });
  }

  render() {
    console.log(Dimensions.get("window").width)
    return (
      <View>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#7D4D99", "#6497CC"]}
          style={styles.sfondo}
        >
          <SafeAreaView
            style={{
              //paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
              marginBottom: 48, // se ho navigation bar in android in basso che non viene considerata per posizionare gli oggetti
              flex: 1,
              flexDirection: "column",

              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <View
              style={{
                height: getStatusBarHeight(),
                width: Dimensions.get("window").width,
                backgroundColor: "white",
                position: "absolute",
                top: 0
              }}
            ></View>
            <ImageBackground
              source={require("../../assets/images/wave/white_wave_onbording_top_new.png")}
              style={styles.backgroundImageWave}
            />
            <View>
              <View style={styles.icon}>
                <View style={styles.textHeaderContainer}></View>
                <Image
                  source={require("../../assets/images/start_nickname.png")}
                  style={{
                    width: Dimensions.get("window").width > 400 ? Dimensions.get("window").width * 0.7 : Dimensions.get("window").width * 0.5,
                    height: Dimensions.get("window").width > 400 ? Dimensions.get("window").width * 0.7 : Dimensions.get("window").width * 0.5,
                  }}
                />
              </View>
            </View>
            <View style={styles.textcondition}>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontFamily: "OpenSans-Regular",
                  fontWeight: "400",
                  fontSize: 15,
                  textAlignVertical: "center",
                  textAlign: "center"
                }}
              >
                {strings("id_0_136")}
              </Text>
            </View>

            <View style={{ paddingTop: 20 }}>
              <TouchableOpacity
                onPress={() => this.nextScreen()}
                style={styles.buttonLogin}
              >
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
                  {strings("id_0_118")}
                </Text>
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
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }
}

// elevation: 2 per avere l'ombra su android con versione 5 in su

const styles = {
  textHeaderContainer: {
    flexDirection: "row",
    width: Dimensions.get("window").width,
    height: 90
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
  textcondition: {
    width: Dimensions.get("window").width * 0.8,
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 24
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
    alignItems: "center"
  },
  StatusBar: {
    height: 50,
    width: Dimensions.get("window").width,
    position: "absolute",
    top: 0,
    backgroundColor: "white"
  },
  backgroundImageWave: {
    height: 90,
    width: Dimensions.get("window").width,
    position: "absolute",
    top: getStatusBarHeight()
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
   
  };
});

export default ConnectLogin(WelcomeMUVToNewMUV);
