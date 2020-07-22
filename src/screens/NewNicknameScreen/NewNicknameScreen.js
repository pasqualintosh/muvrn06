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
  TextInput,
  Animated,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import IconBack from "react-native-vector-icons/Ionicons";
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
import {
  startLoginNew,
  deleteToken
} from "./../../domains/login/ActionCreators";

import {
  updateState,
  checkFilterUniqueAccount
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

class NewNicknameScreen extends React.Component {
  // Costruttore per creare lo stato che poi contiene email e password
  // showPassword per dire se mostrare la password
  constructor() {
    super();
    this.keyboardHeight = new Animated.Value(0);
    this.state = {
      email: "",
      ValidationEmail: true,
      password: "",
      passwordKeystone: "", // password recuperata dalla memoria tipo con face id
      ValidationPassword: true,
      username: "",
      loggedInFromFb: false,
      loginAction: false,
      hide_password: false,
      hide_password_icon: "ios-eye-off",
      placeholderEmail: strings("id_06"),
      placeholderPassword: strings("id_07"),
      placeholderUsername: strings("id_0_13"),
      statusValidationEmail: false
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

            password: credentials.password,
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
    this.setState({ placeholderEmail: "" });
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
    this.props.dispatch(deleteToken());
    Tracker.trackScreenView("NewNicknameScreen.js");
    trackScreenView("NewNicknameScreen.js");
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
    //
    // this.props.dispatch(getMaintenance());
  }

  componentWillMount() {
    if (Platform.OS == "ios") {
      // su ios funziona keyboardWillShow
      this.keyboardWillShowSub = Keyboard.addListener(
        "keyboardWillShow",
        this.keyboardWillShow
      );
      this.keyboardWillHideSub = Keyboard.addListener(
        "keyboardWillHide",
        this.keyboardWillHide
      );
    } else {
      // su android funziona keyboardDidShow
      this.keyboardWillShowSub = Keyboard.addListener(
        "keyboardDidShow",
        this.keyboardDidShow
      );
      this.keyboardWillHideSub = Keyboard.addListener(
        "keyboardDidHide",
        this.keyboardDidHide
      );
    }
  }

  componentWillUnmount() {
    this.setState({ loginAction: false });
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardDidShow = event => {
    // 200
    // event.endCoordinates.height
    console.log(event);
    Animated.timing(this.keyboardHeight, {
      duration: 750,
      toValue:
        -(Dimensions.get("window").height < 700 ? 180 : 230) +
        getStatusBarHeight() +
       40
    }).start();
  };

  keyboardDidHide = event => {
    Animated.timing(this.keyboardHeight, {
      duration: 750,
      toValue: 0
    }).start();
  };

  keyboardWillShow = event => {
    // 200
    // event.endCoordinates.height
    console.log(event);
    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: -(Dimensions.get("window").height < 700 ? 180 : 230) + 40
    }).start();
  };

  keyboardWillHide = event => {
    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0
    }).start();
  };

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
    Alert.alert(strings("id_0_10"), msg);
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
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.length) {
      setTimeout(() => {
        this.showAlert(strings("id_0_11"));
      }, 50);
      // Keyboard.dismiss()
    } else if (!re.test(String(email).toLowerCase())) {
      // se non ho inserito un email
      setTimeout(() => {
        this.showAlert(strings("id_0_11"));
      }, 50);
    } else if (!password.length) {
      setTimeout(() => {
        this.showAlert(strings("id_0_11"));
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

  handleShowPasswordTap = () => {
    const hide_password = !this.state.hide_password;
    let hide_password_icon = "ios-eye-off";

    if (hide_password) hide_password_icon = "ios-eye";

    this.setState({ hide_password, hide_password_icon });
  };

  // se dimentica la password
  handlePasswordForget = () => {
    // cambia schermata o manda un azione di recupero
    this.props.navigation.navigate("ResetPassword");
  };

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

  alertParam = data => {
    this.setState({
      statusValidationEmail: false
    });
    console.log(data);
    // username usato

    if (data.username && data.email) {
      Alert.alert(strings("id_0_25"), strings("id_0_26"));
    } else if (data.username) {
      Alert.alert(strings("id_0_25"), strings("id_0_26"));
    } else if (data.email) {
      Alert.alert(strings("id_0_124"), strings("id_0_27"));
    } else if (data.badword) {
      Alert.alert(strings("id_0_123"), strings("id_0_28"));
    }
  };

  goOn = () => {
    this.setState({
      statusValidationEmail: false
    });

    this.props.dispatch({
      type: START_LOGIN,
      payload: {
        username: this.state.username
      }
    });
    // else this.props.navigation.navigate("GDPRScreen");
    this.props.navigation.navigate("NewPasswordScreen");
    // this.props.navigation.navigate("GDPRScreen");
    // else this.setState({ modal_visible: true });
  };

  error = () => {
    this.setState({
      statusValidationEmail: false
    });
    // riprova piu tardi
  };

  handleNickname = () => {
    const { username } = this.state;
    // filtro per il nickname, solo lettere, numeri e _ e .
    var nicknameTest = /^[a-zA-Z0-9/\_//\.//\-/]+$/i;
    let error_txt = "";
    if (
      !nicknameTest.test(username) ||
      !(username.length > 3 && username.length < 21)
    ) {
      error_txt = error_txt + "\n- " + strings("id_0_19");
    }
    if (error_txt.length) {
      Alert.alert(strings("id_0_17"), strings("id_0_18") + error_txt + "\n");
    } else {
      this.props.dispatch(
        checkFilterUniqueAccount(
          { email: "", username },
          this.alertParam,
          this.goOn,
          this.error
        )
      );
    }
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
            
           
            <Animated.View style={{ 
               
                 transform: [{ translateY: this.keyboardHeight }]}}>
              <View style={styles.icon}>
                <View style={styles.textHeaderContainer}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.props.navigation.goBack(null);
                    }}
                  >
                    <View style={{ width: 30, height: 30, marginLeft: 20 }}>
                      <IconBack
                        name="ios-arrow-back"
                        style={{ marginTop: Platform.OS == "ios" ? 4 : 2 }}
                        size={18}
                        color="#3d3d3d"
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <Image
                  source={require("../../assets/images/create_nickname.png")}
                  style={{
                    width: Dimensions.get("window").width * 0.7 - 100,
                    height: Dimensions.get("window").width * 0.7 - 100
                  }}
                />
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
                   {strings('id_0_137')}
                </Text>
              </View>

              <View style={{ height: 24 }}></View>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  
                }}
              >
                <View style={styles.input}>
                  <OwnIcon
                    name="name_icn"
                    size={40}
                    color={"#FFFFFF"}
                    style={{ paddingLeft: 10 }}
                  />

                  <TextInput
                    value={this.state.username}
                    autoCapitalize="none"
                    placeholder={this.state.placeholderUsername}
                    placeholderTextColor={"#FFFFFF"}
                    onChangeText={text => {
                      this.setState({ username: text.toLowerCase() });
                    }}
                    blurOnSubmit={false}
                    style={styles.inputText}
                    blurOnSubmit={false}
                    onSubmitEditing={text => {
                      // this.focusNextField("Name");
                    }}
                    onEndEditing={text => {
                      this.props.dispatch(
                        updateState({ username: this.state.username })
                      );
                    }}
                    autoCorrect={false}
                    // onFocus={this.onFocus}
                    returnKeyType={"next"}
                    selectionColor={"#ffffff"}
                    onFocus={() => {
                      this.setState({ placeholderUsername: "" });
                    }}
                    onBlur={() => {
                      this.setState({
                        placeholderUsername: strings("id_0_13")
                      });
                    }}
                  />
                </View>
              </View>
              <View style={{ height: 24 }}></View>

              <View>
                <TouchableOpacity
                  onPress={this.handleNickname}
                  style={styles.buttonRegister}
                >
                  {!this.state.statusValidationEmail ? (
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
            </Animated.View>
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
          </SafeAreaView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    );
  }
}

// elevation: 2 per avere l'ombra su android con versione 5 in su

const styles = {
  textcondition: {
    width: Dimensions.get("window").width * 0.8,
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 24
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

export default ConnectLogin(NewNicknameScreen);
