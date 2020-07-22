import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions, NativeModules, Platform, Image, Alert
} from "react-native";


import { LoginManager, ShareDialog, ShareApi, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import {
  updateState,
  checkUniqueAccount
} from "./../../domains/register/ActionCreators";
import {
  startLoginNewSocial,
  deleteToken
} from "./../../domains/login/ActionCreators";


class FacebookLinkButton extends React.PureComponent {
  constructor(props) {
    super(props);
    const shareLinkContent = {
      contentType: 'link',
      photos: [{ imageUrl: 'https://www.repstatic.it/content/nazionale/img/2019/03/21/121534084-66c55ba1-4714-4656-ae03-9958ffb28ab0.jpg' }],
      contentUrl: 'https://www.repstatic.it/content/nazionale/img/2019/03/21/121534084-66c55ba1-4714-4656-ae03-9958ffb28ab0.jpg',
      contentDescription: 'Cat',
      quote: 'Great, 1080 Points, Cat, Cat, Cat.....',
    };

    const photoUri = 'file://' + "MUV/src/assets/images/walk_icn_recap.png"
    const sharePhotoContent = {
      contentType: 'photo',
      photos: [{ imageUrl: photoUri }],
    }


    this.state = { shareLinkContent: shareLinkContent, sharePhotoContent: sharePhotoContent };
  }

  responseCallback = (error, result) => {
    let response = {}
    console.log(result)
    if (error) {
      response.ok = false
      response.error = error
      return (response)
    } else {
      this.props.dispatch(deleteToken())
      this.props.dispatch(
        updateState({

          name: result.first_name,
          surname: result.last_name,

          email: result.email, // email è ottenuta solo che l'app viene approvata da facebook 
          // username: result.name.replace(" ","_"),
        }))
      response.ok = true
      response.json = result
      // setTimeout(() => {
      // this.props.dispatch(
      //   createAccountNewSocial()
      //   )

     
        
        this.props.dispatch(
          checkUniqueAccount({ email: result.email, }, this.loginSocial, this.registerSocial )
        )
      

      

    


      //}, 1000)
      return (response)

    }
  }

  loginSocial = (data) => {
    console.log('accedi')
    if (data.length) {
      if (data[0].social && data[0].social.provider == "facebook") {
        // ti sei registrato con facebook 
        this.props.dispatch(
          startLoginNewSocial()
          )
      } else {
        // quindi non puoi accedere con google avvisa 
        Alert.alert('Ti sei gia registrato usando ' + (data[0].social ? "un account Google" : "un email"))
      }
      
    }
   
  }

  registerSocial = () => {
    console.log('registrati ')
    this.props.navigate('SurveyUserData')
  }

  // the famous params object...





  shareLinkWithShareDialog() {
    var tmp = this;
    ShareDialog.canShow(this.state.shareLinkContent).then(
      function (canShow) {
        if (canShow) {
          return ShareDialog.show(tmp.state.shareLinkContent);
        }
      }
    ).then(
      function (result) {
        if (result.isCancelled) {
          alert('Share cancelled');
        } else {
          alert('Share success with postId: ' + result.postId);
        }
      },
      function (error) {
        alert('Share fail with error: ' + error);
      }
    );
  }

  sharePhotoWithShareDialog() {
    // ShareDialog.show(this.state.sharePhotoContent);
    const sharePhoto = {
      imageUrl: 'file:///sdcard/test.png',// <diff_path_for_ios>
      userGenerated: false,
      caption: 'hello'
    };
    const sharePhotoContent = {
      contentType: 'photo',
      photos: [sharePhoto]
    };
    ShareApi.share(sharePhotoContent, '/me', 'Hello')
      .then((result) => {
        alert(JSON.stringify(result));
      })
      .catch((error) => {
        alert(JSON.stringify(error));
      });

  }

  getFacebook = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
       (result) => {
        console.log(result)
        if (result.isCancelled) {
          console.log(result)
          // alert("Login was cancelled");
        } else {

          console.log(result)
          // alert("Login was successful with permissions: " + result.grantedPermissions)
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              console.log(data)
              console.log(data.accessToken.toString())
              this.props.dispatch(
                updateState({

                  access_token_social: data.accessToken.toString(),
                  social_backend: "facebook"
                }))
              profileRequestParams = {
                fields: {
                  string: 'id, name, email, first_name, last_name, gender'
                }
              }

              profileRequestConfig = {
                httpMethod: 'GET',
                version: 'v2.5',
                parameters: profileRequestParams,
                accessToken: data.accessToken.toString()
              }

              profileRequest = new GraphRequest(
                '/me',
                profileRequestConfig,
                this.responseCallback,
              )
              new GraphRequestManager().addRequest(profileRequest).start();
            }
          )
        }
      })
  }




  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.getFacebook()
        }}
      >
        <View style={styles.buttonContainer}>
          {/* <BoxShadow setting={shadowOpt} /> */}
          

          <Image
          
          source={require("../../assets/images/facebook_login_icn.png")}
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

          
            <Text style={styles.buttonText}>{"Accedi con Facebook"}</Text>
          
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  shareText: {
    fontSize: 20,
    margin: 10,
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
    fontSize: 30,
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
    backgroundColor: "transparent",
    // marginVertical: 0
  },
  buttonContainer: {
    width: Dimensions.get("window").width,
    height: 44,

    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row'
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
      fontSize: 20,
      // marginVertical: 1
    }
  });
}

FacebookLinkButton.defaultProps = {
  register: false,
  dispatch: () => {},
  navigate: () => {},
};

export default FacebookLinkButton;
