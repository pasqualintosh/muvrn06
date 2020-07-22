import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeModules,
  Platform,
  Alert
} from "react-native";
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton
} from "react-native-google-signin";

// componente per il login di google

// props
// style per ereditare lo stile passato
import {
  updateState,
  checkUniqueAccount
} from "./../../domains/register/ActionCreators";
import {
  startLoginNewSocial,
  deleteToken
} from "./../../domains/login/ActionCreators";

class GoogleLogin extends React.Component {
  // configuro il componente
  componentDidMount() {
    //  GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true }).then(
    //    result => {
    //      console.log(result)
    //     GoogleSignin.configure({
    //       scopes: ['https://www.googleapis.com/auth/userinfo.email',
    //       'https://www.googleapis.com/auth/userinfo.profile',],
    //       // iosClientId:
    //       //   "1000447429429-gio3armp5rdmop4mvui41m7el1r4sub9.apps.googleusercontent.com" // only for iOS
    //       iosClientId:
    //           "1000447429429-gio3armp5rdmop4mvui41m7el1r4sub9.apps.googleusercontent.com",
    //         webClientId:
    //           "627922584945-ncgsp02emcplkj3dju3t9g922qvgovtl.apps.googleusercontent.com",
    //     })
    //    }
    //  ).catch((err) => {
    //   console.log("Play services error", err.code, err.message);
    //   });
  }
  // provo il login, quando clicco il pulsante,
  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true
      });
      GoogleSignin.configure({
        scopes: [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile"
        ],
        // iosClientId:
        //   "1000447429429-gio3armp5rdmop4mvui41m7el1r4sub9.apps.googleusercontent.com" // only for iOS
        iosClientId:
          "858150606475-1cc4uu94gq0b6mj3l6206l249lvlrv07.apps.googleusercontent.com",
        webClientId:
          "858150606475-inall3ao1gu1trerovcta9sa9nlgc57q.apps.googleusercontent.com",
        androidClientId:
          "858150606475-vctgnh3h6355v2qqoek64qb10as12qv0.apps.googleusercontent.com"
      });

      GoogleSignin.signIn()
        .then(userInfo => {
          console.log(userInfo);
          const currentUser = GoogleSignin.getTokens()
            .then(currentUser => {
              console.log(currentUser);
              this.setState({ currentUser });
              this.setState({ userInfo });
              // tolgo eventuali token precedenti
              this.props.dispatch(deleteToken());

              this.props.dispatch(
                updateState({
                  name: userInfo.user.givenName,
                  surname: userInfo.user.familyName,

                  email: userInfo.user.email,
                  // username: userInfo.user.name.replace(" ","_"),
                  access_token_social: currentUser.accessToken,
                  social_backend: "google-oauth2"
                })
              );
              this.props.dispatch(
                checkUniqueAccount(
                  { email: userInfo.user.email },
                  this.loginSocial,
                  this.registerSocial
                )
              );
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  loginSocial = data => {
    console.log("accedi");

    if (data.length) {
      if (data[0].social && data[0].social.provider == "google-oauth2") {
        // ti sei registrato con google
        this.props.dispatch(startLoginNewSocial());
      } else {
        // quindi non puoi accedere con facebook avvisa
        Alert.alert(
          "Ti sei gia registrato usando " +
            (data[0].social ? "un account Facebook" : "un email")
        );
      }
    }
  };

  registerSocial = () => {
    console.log("registrati ");
    this.props.navigate("SurveyUserData");
  };

  // render() {
  //   return (
  //     <GoogleSigninButton
  //       style={this.props.style}
  //       size={GoogleSigninButton.Size.Wide}
  //       color={GoogleSigninButton.Color.Light}
  //       onPress={this._signIn}
  //     >
  //       {this.props.children}
  //     </GoogleSigninButton>

  //   );
  // }

  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this._signIn();
        }}
      >
        <View style={styles.buttonContainer}>
          {/* <BoxShadow setting={shadowOpt} /> */}

          <Image
            source={require("../../assets/images/google_login_icn.png")}
            style={{
              height: 22,
              width: 22
            }}
          />
          <View
            style={{
              height: 5,
              width: 5
            }}
          />

          <Text style={styles.buttonText}>{"Accedi con Google"}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  shareText: {
    fontSize: 20,
    margin: 10
  },
  mainContainer: {
    flex: 1,
    // backgroundColor: "#3d3d3d",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  overlayWave: {
    width: Dimensions.get("window").width,
    height: 100
  },
  textHeaderContainer: {
    width: 120,
    height: 60,
    backgroundColor: "transparent",
    position: "absolute",
    top: Dimensions.get("window").height * 0.08,
    left: 16
  },
  textHeader: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#fff",
    fontSize: 30
    // marginVertical: 1
  },
  textFooterContainer: {
    width: 120,
    height: 60,
    backgroundColor: "transparent",
    position: "absolute",
    top: Dimensions.get("window").height * 0.6,
    right: 20
  },
  textFooter: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#fff",
    fontSize: 24,
    // marginVertical: 1,
    fontWeight: "bold"
  },
  logoFooterContainer: {
    width: 280,
    height: 180,
    // backgroundColor: "#e33",
    position: "absolute",
    top: Dimensions.get("window").height * 0.3 - 150,
    left: Dimensions.get("window").width * 0.5 - 140,
    justifyContent: "center",
    alignItems: "center"
    // right: 0
  },
  checkboxesContainer: {
    width: Dimensions.get("window").width,
    height: 160,
    backgroundColor: "transparent",
    position: "absolute",
    top: Dimensions.get("window").height * 0.65 - 20,
    // top: Dimensions.get("window").height * 0.55,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  checkboxContainer: {
    width: Dimensions.get("window").width * 0.7,
    height: 28,
    backgroundColor: "transparent"
    // marginVertical: 0
  },
  buttonContainer: {
    width: Dimensions.get("window").width,
    height: 45,

    justifyContent: "flex-start",
    alignItems: "center"
    // shadowRadius: 2,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5
  },
  buttonContainer: {
    width: Dimensions.get("window").width,
    height: 44,

    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
    // shadowRadius: 2,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5
  },
  buttonBox: {
    width: Dimensions.get("window").width * 0.68,
    height: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    elevation: 1
    // shadowColor: "#000",
    // shadowOffset: { width: 3, height: 3 }
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "OpenSans-Bold",
    fontWeight: "700",
    fontSize: 12,
    textAlignVertical: "center",
    textAlign: "center",
    textDecorationLine: "underline",
    textDecorationStyle: "solid"
  },
  modalContainer: {
    flex: 1,
    // marginTop: 22,
    backgroundColor: "#F7F8F9",
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.5
  },
  modalTitle: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3D3D3D",
    fontSize: 18,
    // marginVertical: 1,
    fontWeight: "bold",
    textAlign: "center",
    // marginVertical: 7,
    marginHorizontal: 20
  },
  modalParagraph: {
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D",
    fontSize: 12,
    // marginVertical: 1,
    textAlign: "left",
    // marginVertical: 7,
    marginHorizontal: 20
  },
  modalBold: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3D3D3D",
    fontSize: 14,
    // marginVertical: 1,
    fontWeight: "bold",
    textAlign: "left",
    // marginVertical: 7,
    marginHorizontal: 20
  },
  textDescription: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#FFFFFF",
    fontSize: Platform.OS == "ios" ? 13 : 13,
    // marginVertical: 8,
    textAlign: "center"
  },
  linkContainer: {
    // backgroundColor: "#000",
    position: "absolute",
    // top: Dimensions.get("window").height * 0.8,
    top: Dimensions.get("window").height * 0.93 - 20,
    width: Dimensions.get("window").width * 0.8,
    height: 20,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row"
  }
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    textFooterContainer: {
      width: 120,
      height: 60,
      backgroundColor: "transparent",
      position: "absolute",
      top: Dimensions.get("window").height * 0.6,
      right: -5
    },
    textFooter: {
      fontFamily: "OpenSans-ExtraBold",
      color: "#fff",
      fontSize: 20,
      // marginVertical: 1,
      fontWeight: "bold"
    },
    textHeaderContainer: {
      width: 120,
      height: 60,
      backgroundColor: "transparent",
      position: "absolute",
      top: Dimensions.get("window").height * 0.08,
      left: 20
    },
    textHeader: {
      fontFamily: "Montserrat-ExtraBold",
      color: "#fff",
      fontSize: 20
      // marginVertical: 1
    }
  });
}

GoogleLogin.defaultProps = {
  register: false,
  dispatch: () => {},
  navigate: () => {}
};

export default GoogleLogin;
