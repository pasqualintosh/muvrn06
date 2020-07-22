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
  ScrollView
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

import {
  updateState,
  checkEmail,
  createAccountNewSocial
} from "./../../domains/register/ActionCreators";

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
import { getMaintenance } from "./../../domains/login/ActionCreators";

import Settings from "./../../config/Settings";
import FacebookLinkButton from "./../../components/FacebookLinkButton/FacebookLinkButton";
import { getStatusBarHeight } from "./../../helpers/notch";

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

class LoginWithSocial extends React.Component {
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

  componentDidMount() {
    // this.props.dispatch(
    // createAccountNewSocial()
    // )
    Tracker.trackScreenView("Login.js");
    trackScreenView("Login.js");
    // this.setupGoogleSignin();
    this.setState({ loginAction: true });
    // tolgo eventuali errori precedenti essendo che apro l'app la prima volta e sono sul login
    this.props.dispatch({
      type: START_LOGIN,
      payload: {
        status: ""
      }
    });

    // branch.subscribe(({ error, params }) => {
    //   if (error) {
    //     console.log("Error from Branch: " + error);
    //     return;
    //   }

    //   if (params["+clicked_branch_link"]) {
    //     // ricevo url dell'utente e l'id
    //     console.log("Received link response from Branch");
    //     alert("Received link response from Branch \n" + JSON.stringify(params));
    //   }

    //   console.log("params: " + JSON.stringify(params));
    // });

    // branch.subscribe(({ error, params }) => {
    //   if (error) {
    //     console.log("Error from Branch: " + error);
    //     return;
    //   }

    //   if (params["+clicked_branch_link"]) {
    //     console.log("Received link response from Branch");
    //     // alert("Received link response from Branch \n" + JSON.stringify(params));

    //     let link = params["~referring_link"];
    //     let sender_id = params.sender_id;

    //     // alert(link);
    //     // alert(sender_id);

    //     // this.props.dispatch(
    //     //   postFollowUser({
    //     //     followed_user_id: sender_id,
    //     //     referral_url: link,
    //     //     link_status: 3
    //     //   })
    //     // );
    //     this.props.dispatch(saveBranchTempData(sender_id, link, 0));
    //   }

    //   console.log("params: " + JSON.stringify(params));
    // });
    // alert("a");
    // this.props.dispatch(getMaintenance());
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
        this.showAlert(strings('id_0_22'));
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
          alignItems: "center",
          paddingTop: 10
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

  createAccount = () => {
    console.log("crea account");
    this.props.dispatch(
      updateState({
        name: "",
        surname: "",
        email: "",
        username: "",
        access_token_social: "",
        social_backend: ""
      })
    );
    this.props.navigation.navigate("SurveyUserData");
  };

  loginAccount = () => {
    // cancello gli eventuali dati presi dai social

    console.log("login account");
    this.props.navigation.navigate("Login");
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
              // marginBottom: 48, // se ho navigation bar in android in basso che non viene considerata per posizionare gli oggetti
              flex: 1,
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "space-between"
            }}
          >
           <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 100, lexDirection: "column",
              alignContent: "center",
              justifyContent: "center" }}
            >
            {/* <View
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
            /> */}

            <View style={styles.icon}>
              <View style={styles.textHeaderContainer}></View>
              <Image 
               style={{
                height: Dimensions.get("window").height < 700 ? 80 : 130, // 200 x 300 , 1,5
                width: Dimensions.get("window").height < 700 ? 80 * 1.5 : 130 * 1.5,
               
               }}
               
               source={require("../../assets/images/onboardingImage/logo_muv_trademark.png")}
               ></Image>
              {this.renderLogoText()}
            </View>
            <View
              style={{
                height: 30,
                width: Dimensions.get("window").width,
                
                
              }}
            />
            <View style={styles.textcondition}>
              <Text>
                {this.getUnderlinedSubStr(
                  strings("id_0_01"),
                  {
                    color: "#FFFFFF",
                    fontFamily: "OpenSans-Regular",
                    fontWeight: "400",
                    fontSize: 15,
                    textAlignVertical: "center",
                    textAlign: "center"
                  },
                  {
                    // posizione testo clickabile
                    "1": () => {
                      this.moveCondition();
                    },
                    // posizione testo clickabile
                    "3": () => {
                      this.movePrivacy();
                    }
                  }
                )}
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
            <TouchableOpacity
              onPress={() => this.createAccount()}
              style={{ padding: 10 }}
            >
              <Text
                style={{
                  // margin: 10,
                  color: "#FFFFFF",
                  fontFamily: "OpenSans-Bold",
                  fontWeight: "700",
                  fontSize: 15,
                  textAlignVertical: "center",
                  textAlign: "center",
                  textDecorationLine: "underline",
                  textDecorationStyle: "solid"
                }}
              >
                {strings("id_0_02")}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                height: 30,
                width: Dimensions.get("window").width,
                
                
              }}
            />
            <View>
              <TouchableOpacity
                onPress={() => this.loginAccount()}
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
                  {strings("id_0_03")}
                </Text>
              </TouchableOpacity>
            </View>
            <View>
            <View
              style={{
                height: 30,
                width: Dimensions.get("window").width,
                
                
              }}
            />
              <FacebookLinkButton
                dispatch={this.props.dispatch}
                navigate={this.props.navigation.navigate}
              />
            
              <GoogleLogin
                dispatch={this.props.dispatch}
                navigate={this.props.navigation.navigate}
              />
            </View>
            </ScrollView>
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
    alignItems: "center"
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
    status: state.login.status ? state.login.status : false
  };
});

export default ConnectLogin(LoginWithSocial);
