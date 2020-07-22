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
  AlertIOS,
  ActivityIndicator,
  StatusBar,
  Keyboard,
  NativeEventEmitter,
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
// import Push from 'appcenter-push';

// const NotificationHub = require('react-native-azurenotificationhub');
// const PushNotificationEmitter = new NativeEventEmitter(NotificationHub);
const NotificationHub = require("react-native-azurenotificationhub/index.ios");

const NOTIF_REGISTER_AZURE_HUB_EVENT = "azureNotificationHubRegistered";
const NOTIF_AZURE_HUB_REGISTRATION_ERROR_EVENT =
  "azureNotificationHubRegistrationError";
const DEVICE_NOTIF_EVENT = "remoteNotificationReceived";

const connectionString =
  "Endpoint=sb://muvnotificationhubns.servicebus.windows.net/;SharedAccessKeyName=DefaultListenSharedAccessSignature;SharedAccessKey=NCvSs1cSfmz3BNezty3Y1YXUKXl3EX/H0j8wPkv12bc="; // The Notification Hub connection string
const hubName = "muv_notificationhub"; // The Notification Hub name
const senderID = "1"; // The Sender ID from the Cloud Messaging tab of the Firebase console
const tags = []; // The set of tags to subscribe to
var remoteNotificationsDeviceToken = ""; // The device token registered with APNS

import FacebookLoginButton from "./../../components/FacebookLoginButton/FacebookLoginButton";

import { connect } from "react-redux";
import {
  TestToken,
  startLoginWithFacebook,
  startLoginWithGoogle,
  startApp
} from "./../../domains/login/ActionCreators";

import {
  startLogin,
  getProfile,
  refreshToken
} from "./../../domains/login/ActionCreators";

import { saveBranchTempData } from "./../../domains/register/ActionCreators";

import axios from "axios";
import { START_LOGIN } from "../../domains/login/ActionTypes";

// let FBLogin;
// if (Platform.OS === "ios")
//   FBLogin = require("./../../components/FBLogin/FBLogin").FBLogin;
// else FBLogin = require("react-native-facebook-login").FBLogin;

import { BoxShadow } from "react-native-shadow";

import branch, { BranchEvent } from "react-native-branch";

import { strings } from "../../config/i18n";
import { getMaintenance } from "./../../domains/login/ActionCreators";

import Settings from "./../../config/Settings";

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

class AzureNotification extends React.Component {
  // Costruttore per creare lo stato che poi contiene email e password
  // showPassword per dire se mostrare la password
  constructor() {
    super();
    this.state = {
      email: "",
      ValidationEmail: true,
      password: "",
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

            password: "XXXXXXXXXXXX"
          });
          setTimeout(() => Keyboard.dismiss(), 1000);

          this.props.dispatch(
            startLogin(
              {
                username: credentials.username,
                password: credentials.password,
                keychain: true
              },
              true
            )
          );
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

  async azurenotification() {
    let pushEnabled = await Push.isEnabled();
    console.log(pushEnabled);
    // await Push.setEnabled(false);      // Disable push

    await Push.setEnabled(true); // Re-enable it
    pushEnabled = await Push.isEnabled();
    console.log(pushEnabled);
    Push.setListener({
      onPushNotificationReceived: function(pushNotification) {
        let message = pushNotification.message;
        let title = pushNotification.title;

        if (message === null) {
          // Android messages received in the background don't include a message. On Android, that fact can be used to
          // check if the message was received in the background or foreground. For iOS the message is always present.
          title = "Android background";
          message = "<empty>";
        }

        // Custom name/value pairs set in the App Center web portal are in customProperties
        if (
          pushNotification.customProperties &&
          Object.keys(pushNotification.customProperties).length > 0
        ) {
          message +=
            "\nCustom properties:\n" +
            JSON.stringify(pushNotification.customProperties);
        }

        if (AppState.currentState === "active") {
          Alert.alert(title, message);
        } else {
          // Sometimes the push callback is received shortly before the app is fully active in the foreground.
          // In this case you'll want to save off the notification info and wait until the app is fully shown
          // in the foreground before displaying any UI. You could use AppState.addEventListener to be notified
          // when the app is fully in the foreground.
        }
      }
    });
  }

  //  requestPermissions() {
  //   NotificationHub.addEventListener('register', this._onRegistered);
  //   NotificationHub.addEventListener('registrationError', this._onRegistrationError);
  //   NotificationHub.addEventListener('registerAzureNotificationHub', this._onAzureNotificationHubRegistered);
  //   NotificationHub.addEventListener('azureNotificationHubRegistrationError', this._onAzureNotificationHubRegistrationError);
  //   NotificationHub.addEventListener('notification', this._onRemoteNotification);
  //   NotificationHub.addEventListener('localNotification', this._onLocalNotification);

  //   NotificationHub.requestPermissions();
  // }

  // register() {
  //   NotificationHub.register(remoteNotificationsDeviceToken, {connectionString, hubName, senderID, tags});
  // }

  // unregister() {
  //   NotificationHub.unregister();
  // }

  requestPermissions() {
    NotificationHub.addEventListener("register", this._onRegistered);
    NotificationHub.addEventListener(
      "registrationError",
      this._onRegistrationError
    );
    NotificationHub.addEventListener(
      "registerAzureNotificationHub",
      this._onAzureNotificationHubRegistered
    );
    NotificationHub.addEventListener(
      "azureNotificationHubRegistrationError",
      this._onAzureNotificationHubRegistrationError
    );
    NotificationHub.addEventListener(
      "notification",
      this._onRemoteNotification
    );
    NotificationHub.addEventListener(
      "localNotification",
      this._onLocalNotification
    );

    NotificationHub.requestPermissions();
  }

  register() {
    NotificationHub.register(remoteNotificationsDeviceToken, {
      connectionString,
      hubName,
      senderID,
      tags
    });
  }

  unregister() {
    NotificationHub.unregister();
  }

  _onRegistered(deviceToken) {
    remoteNotificationsDeviceToken = deviceToken;
    AlertIOS.alert(
      "Registered For Remote Push",
      `Device Token: ${deviceToken}`,
      [
        {
          text: "Dismiss",
          onPress: null
        }
      ]
    );
  }

  _onRegistrationError(error) {
    AlertIOS.alert(
      "Failed To Register For Remote Push",
      `Error (${error.code}): ${error.message}`,
      [
        {
          text: "Dismiss",
          onPress: null
        }
      ]
    );
  }

  _onRemoteNotification(notification) {
    AlertIOS.alert(
      "Push Notification Received",
      "Alert message: " + notification.getMessage(),
      [
        {
          text: "Dismiss",
          onPress: null
        }
      ]
    );
  }

  _onAzureNotificationHubRegistered(registrationInfo) {
    AlertIOS.alert(
      "Registered For Azure notification hub",
      "Registered For Azure notification hub"[
        {
          text: "Dismiss",
          onPress: null
        }
      ]
    );
  }

  _onAzureNotificationHubRegistrationError(error) {
    AlertIOS.alert(
      "Failed To Register For Azure Notification Hub",
      `Error (${error.code}): ${error.message}`,
      [
        {
          text: "Dismiss",
          onPress: null
        }
      ]
    );
  }

  _onLocalNotification(notification) {
    AlertIOS.alert(
      "Local Notification Received",
      "Alert message: " + notification.getMessage(),
      [
        {
          text: "Dismiss",
          onPress: null
        }
      ]
    );
  }

  componentDidMount() {
    // this.azurenotification()

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

    branch.subscribe(({ error, params }) => {
      if (error) {
        console.log("Error from Branch: " + error);
        return;
      }

      if (params["+clicked_branch_link"]) {
        console.log("Received link response from Branch");
        // alert("Received link response from Branch \n" + JSON.stringify(params));

        let link = params["~referring_link"];
        let sender_id = params.sender_id;

        // alert(link);
        // alert(sender_id);

        // this.props.dispatch(
        //   postFollowUser({
        //     followed_user_id: sender_id,
        //     referral_url: link,
        //     link_status: 3
        //   })
        // );
        this.props.dispatch(saveBranchTempData(sender_id, link, 0));
      }

      console.log("params: " + JSON.stringify(params));
    });
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

    this.setState({ password: text, ValidationPassword: length || RisValid });
  };

  // il click al tasto Login
  handleLogin = () => {
    Keyboard.dismiss();
    const { email, password, ValidationEmail, ValidationPassword } = this.state;

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
        this.props.dispatch(startLogin({ username: email, password }, true));
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

  // se dimentica la password
  handlePasswordForget = () => {
    // cambia schermata o manda un azione di recupero
    this.props.navigation.navigate("ResetPassword");
  };

  /**
   * lettura del token e chiamata alle api di facebook per
   * leggere il profilo utente
   */
  handleFacebookLogin = data => {
    if (this.state.loginAction === true && Platform.OS === "ios") {
      var api = `https://graph.facebook.com/v2.3/me?fields=id,email,first_name,last_name&redirect=false&access_token=${data.token}`;
      fetch(api)
        .then(response => response.json())
        .then(responseData => {
          this.setState({
            loggedInFromFb: true
          });
          let { first_name: name, last_name: surname, email } = responseData;
          const password = name + "." + surname;
          this.props.dispatch(
            startLogin({
              username: email,
              password,
              afterCallback: this.moveHome
            })
          );
        })
        .catch(err => {
          Alert.alert("Facebook Error", JSON.stringify(err));
        })
        .done(data => {
          FBLoginManager.logout((err, data) => {
            this.setState({
              loggedInFromFb: false
            });
          });
        });
    } else if (this.state.loginAction === true) {
      this.setState({
        loggedInFromFb: true
      });
      let { first_name: name, last_name: surname, email } = data.profile;
      const password = name + "." + surname;
      this.props.dispatch(
        startLogin({ username: email, password, afterCallback: startApp })
      );
      FBLoginManager.logout((err, data) => {
        this.setState({
          loggedInFromFb: false
        });
      });
    }
  };

  /**
   * attualmente cambia solo il testo del pulsante
   */
  handleFacebookLogout = () => {
    this.setState({ loggedInFromFb: false });
  };

  // handleGoogleLogin = () => {
  //   if (this.state.loginAction === true) {
  //     GoogleSignin.signIn()
  //       .then(user => {
  //         const { familyName: surname, givenName: name, email } = user;
  //         const password = name + "." + surname;
  //         this.props.dispatch(startLogin({ username: email, password }));
  //       })
  //       .catch(err => {
  //         console.log("WRONG SIGNIN", err);
  //       })
  //       .done(() => {
  //         this.handleGoogleLogout();
  //       });
  //   }
  // };

  // handleGoogleLogout = () => {
  //   GoogleSignin.revokeAccess()
  //     .then(() => GoogleSignin.signOut())
  //     .then(() => {
  //       this.setState({ user: null });
  //     })
  //     .done();
  // };

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

  render() {
    const {
      email,
      password,
      showPassword,
      ValidationEmail,
      ValidationPassword
    } = this.state;
    // a seconda se si deve mostrare la password o no
    // usiamo due icone differenti
    let IconTypePassword = "pass-show-icn";
    if (this.state.showPassword) {
      IconTypePassword = "pass-hide-icn";
    }

    let shadowOpt;
    if (Platform.OS == "ios")
      shadowOpt = {
        width: Dimensions.get("window").width * 0.3,
        height: 40,
        color: "#000",
        border: 4,
        radius: 20,
        opacity: 0.25,
        x: 0,
        y: 1
      };
    else
      shadowOpt = {
        width: Dimensions.get("window").width * 0.3,
        height: 40,
        color: "#444",
        border: 4,
        radius: 20,
        opacity: 0.35,
        x: 0,
        y: 1
      };

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>
          <ImageBackground
            source={require("../../assets/images/bg-login.png")}
            style={styles.sfondo}
          >
            <ImageBackground
              source={require("../../assets/images/purple_wave_onbording_bottom.png")}
              style={styles.backgroundImageWaveDown}
            />
            <TouchableOpacity onPress={this.requestPermissions.bind(this)}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Request permission</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.requestPermissions.bind(this)}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Request permission</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.container}>
              <TouchableOpacity onPress={this.register.bind(this)}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Register</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.unregister.bind(this)}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Unregister</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.center}>
              <OwnIcon name="MUV_logo" size={110} color="#000000" />
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 8,
                  shadowRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  elevation: 1,
                  borderColor: "#E8E8E8"
                }}
              >
                <InputEmail
                  email={email}
                  ValidationEmail={true}
                  handleEmail={this.handleEmail}
                  returnKeyType={"next"}
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    this.focusNextField("Password");
                  }}
                  secondTextInput={this.secondTextInput}
                  styleForm={{
                    borderTopLeftRadius: 7,
                    borderTopRightRadius: 7,
                    backgroundColor: "#F7F8F9",
                    borderBottomColor: "#E8E8E8",
                    elevation: 1
                  }}
                  onFocus={this.onFocus}
                />
                <InputPassword
                  name={"Password"}
                  returnKeyType={"done"}
                  password={password}
                  ValidationPassword={true}
                  showPassword={showPassword}
                  handlePassword={this.handlePassword}
                  handleShowPassword={this.handleShowPassword}
                  IconTypePassword={IconTypePassword}
                  refInput={this.refInput}
                  onSubmitEditing={this.handleLogin}
                  styleForm={{
                    borderBottomLeftRadius: 7,
                    borderBottomRightRadius: 7,
                    backgroundColor: "#F7F8F9",
                    backgroundColor: "#F7F8F9",
                    borderBottomColor: "#E8E8E8",
                    elevation: 1
                  }}
                />
              </View>

              <BoxShadow setting={shadowOpt}>
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 0.0, y: 1.0 }}
                  locations={[0, 1.0]}
                  colors={["#e82f73", "#f49658"]}
                  style={styles.buttonShadow}
                >
                  <TouchableHighlight
                    onPress={this.handleLogin}
                    style={styles.button}
                    disabled={this.props.status === "In connect" ? true : false}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {this.props.status !== "In connect" ? (
                        <Text
                          style={{
                            // margin: 10,
                            color: "#FFFFFF",
                            fontFamily: "OpenSans-Regular",
                            fontWeight: "400",
                            fontSize: 15
                          }}
                        >
                          {strings("login")}
                        </Text>
                      ) : (
                        <ActivityIndicator size="small" color="white" />
                      )}
                    </View>
                  </TouchableHighlight>
                </LinearGradient>
              </BoxShadow>

              <TouchableWithoutFeedback onPress={this.handlePasswordForget}>
                <View>
                  <Text style={{ margin: 10, color: "#9D9B9C", fontSize: 11 }}>
                    {strings("forgot_password")}
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              {/* 
            <View>
              <Text style={{ margin: 10, color: "#3D3D3D", fontSize: 15 }}>
                Or
              </Text>
            </View> 
            */}

              {/* 
            <View
              style={{
                width: Dimensions.get("window").width,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <FBLogin
                containerStyle={styles.containerFBLogin}
                onClickColor={"transparent"}
                buttonView={
                  <FacebookLoginButton
                    text={
                      this.state.loggedInFromFb
                        ? "LOGIN WITH FACEBOOK"
                        : "LOGIN WITH FACEBOOK"
                    }
                    onPress={this.handleLogin}
                  />
                }
                loginBehavior={FBLoginManager.LoginBehaviors.Native}
                permissions={["email"]}
                onLogin={data => this.handleFacebookLogin(data)}
                onLogout={this.handleFacebookLogout}
                onLoginFound={function(data) {
                  console.log("Existing login found.");
                  console.log(data);
                }}
                onLoginNotFound={function() {
                  console.log("No user logged in.");
                }}
                onError={function(data) {
                  console.log("ERROR");
                  console.log(data);
                }}
                onCancel={function() {
                  console.log("User cancelled.");
                }}
                onPermissionsMissing={function(data) {
                  console.log("Check permissions!");
                  console.log(data);
                }}
              />

              <TouchableWithoutFeedback onPress={this.handleGoogleLogin}>
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.35,
                    height: Dimensions.get("window").height / 20,
                    borderRadius: 6,
                    backgroundColor: "#fff",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 3
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontWeight: "400",
                      color: "#9D9B9C",
                      fontSize: 11
                    }}
                  >
                    LOGIN WITH GOOGLE
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text style={{ margin: 10, color: "#F7F8F9", fontSize: 16 }}>
                  {strings("don_t_have_an_a")}
                </Text>
                <Text
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    color: "#F7F8F9",
                    fontSize: 16,
                    textDecorationLine: "underline",
                    textDecorationStyle: "solid"
                  }}
                  onPress={this.handleSignUp}
                >
                  {strings("sign_up")}
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

// elevation: 2 per avere l'ombra su android con versione 5 in su

const styles = {
  sfondo: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  backgroundImageWaveDown: {
    height: 130,
    width: Dimensions.get("window").width,
    position: "absolute",
    bottom: 0
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "black",
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
  icon: {
    margin: 10,
    width: Dimensions.get("window").width / 13,
    height: Dimensions.get("window").height / 40
  },
  containerFBLogin: {}
};

const ConnectLogin = connect(state => {
  return {
    status: state.login.status ? state.login.status : false
  };
});

export default ConnectLogin(AzureNotification);