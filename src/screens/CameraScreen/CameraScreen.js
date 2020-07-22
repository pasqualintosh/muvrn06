import React from "react";
import {
  View,
  Text,
  Platform,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  CameraRoll,
  PermissionsAndroid,
  Image,
  ActivityIndicator,
  Linking
} from "react-native";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import Svg, { Circle, Line } from "react-native-svg";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { RNCamera } from "react-native-camera";
import ImageMarker from "react-native-image-marker";
import ImageResizer from "react-native-image-resizer";
import ImageManipulator from "react-native-photo-manipulator";

import Share from "react-native-share";
import { strings } from "../../config/i18n";

import Aux from "../../helpers/Aux";
import FillToAspectRatio from "../../helpers/FillToAspectRatio";
import { ShareDialog } from "react-native-fbsdk";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import { validateStPhoto } from "./../../domains/trainings/ActionCreators";
import InteractionManager from "../../helpers/loadingComponent";

const flashModeOrder = {
  off: "on",
  on: "auto",
  auto: "torch",
  torch: "off"
};

const wbOrder = {
  auto: "sunny",
  sunny: "cloudy",
  cloudy: "shadow",
  shadow: "fluorescent",
  fluorescent: "incandescent",
  incandescent: "auto"
};

const landmarkSize = 2;

class CameraScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      base64: "",
      flash: "off",
      zoom: 0,
      autoFocus: "on",
      autoFocusPoint: {
        normalized: { x: 0.5, y: 0.5 }, // normalized values required for autoFocusPointOfInterest
        drawRectPosition: {
          x: Dimensions.get("window").width * 0.5 - 32,
          y: Dimensions.get("window").width - 32
        }
      },
      depth: 0,
      type: "front",
      whiteBalance: "auto",
      ratio: "1:1",
      recordOptions: {
        // mute: false,
        // maxDuration: 5,
        // quality: RNCamera.Constants.VideoQuality["288p"]
      },
      isRecording: false,
      canDetectFaces: false,
      canDetectText: false,
      canDetectBarcode: false,
      faces: [],
      textBlocks: [],
      barcodes: [],
      // component variables
      render_image: false,
      render_camera: true,
      image_path: "",
      loading: false,
      markResult: null,
      orientValue: 1,
      cache_path: "",
      saved: false,
      show: false,
      frameW: 2000,
      imgW: 1224
    };
  }

  flip = async () => {
    const manipResult = await ImageManipulator.manipulate(
      this.state.cache_path,
      [{ flip: { horizontal: true } }],
      { format: "jpeg" }
    );
    console.log(manipResult);
    this.setState(
      {
        image: manipResult,
        cache_path: manipResult.uri,
        imgW: manipResult.width
      },
      () => {
        this.applyMarkerImage(manipResult.uri);
      }
    );
  };

  convertBase64 = async () => {
    const manipResult = await ImageManipulator.manipulate(
      this.state.cache_path,
      [],
      { format: "jpeg", base64: true }
    );
    console.log(manipResult);
    return manipResult.base64;
  };

  sendPhotoEmail = () => {
    this.convertBase64().then(image => {
      const to = "support@domain.com";
      const subjectEncoded = "Send Photo Mail";
      console.log(image);
      const bodyEncoded = `<img alt="receipt" width="100%" src="data:image/jpeg;base64,${image}">`;
      let gmailUrl = `googlegmail://co?to=${to}&subject=${subjectEncoded}&body=${bodyEncoded}`;
      let outlookUrl = `ms-outlook://compose?to=${to}&subject=${subjectEncoded}&body=${bodyEncoded}`;
      let yahooMail = `ymail://mail/compose?to=${to}&subject=${subjectEncoded}&body=${bodyEncoded}`;
      let sparkUrl = `readdle-spark://compose?recipient=${to}&subject=${subjectEncoded}&body=${bodyEncoded}`;
      let defaultUrl = `mailto:${to}?subject=${subjectEncoded}&body=${bodyEncoded}`;

      Linking.canOpenURL(gmailUrl)
        .then(supported => {
          if (!supported) {
            console.log("Can't handle url: " + gmailUrl);
            Linking.canOpenURL(outlookUrl)
              .then(supported => {
                if (!supported) {
                  console.log("Can't handle url: " + outlookUrl);
                  Linking.canOpenURL(yahooMail)
                    .then(supported => {
                      if (!supported) {
                        console.log("Can't handle url: " + yahooMail);
                        Linking.canOpenURL(sparkUrl)
                          .then(supported => {
                            if (!supported) {
                              console.log("Can't handle url: " + sparkUrl);
                              Linking.openURL(defaultUrl);
                            } else {
                              return Linking.openURL(sparkUrl);
                            }
                          })
                          .catch(err =>
                            console.error("An error occurred", err)
                          );
                      } else {
                        return Linking.openURL(yahooMail);
                      }
                    })
                    .catch(err => console.error("An error occurred", err));
                } else {
                  return Linking.openURL(outlookUrl);
                }
              })
              .catch(err => console.error("An error occurred", err));
          } else {
            return Linking.openURL(gmailUrl);
          }
        })
        .catch(err => console.error("An error occurred", err));
    });
  };

  rotateImage() {
    let exifOrientation = this.state.orientValue;
    switch (exifOrientation) {
      case 3:
        return "180deg";
        break;
      case 4:
        return "180deg";
        break;
      case 5:
        return "90deg";
        break;
      case 6:
        return "90deg";
        break;
      case 7:
        return "270deg";
        break;
      case 8:
        return "0deg";
        break;
      default:
        return "0deg";
    }
  }

  getRotationInt() {
    let exifOrientation = this.state.orientValue;
    switch (exifOrientation) {
      case 3:
        return 180;
        break;
      case 4:
        return 180;
        break;
      case 5:
        return 90;
        break;
      case 6:
        return 90;
        break;
      case 7:
        return 270;
        break;
      case 8:
        return 0;
        break;
      default:
        return 0;
    }
  }

  static navigationOptions = {
    headerTitle: (
      <Text
        style={{
          left: Platform.OS == "android" ? 20 : 0
        }}
      >
        Celebrate
      </Text>
    )
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        load: true
      });
    });
    setTimeout(() => {
      if (Platform.OS != "ios") this.requestCameraPermission();
    }, 10000);
  }

  async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Camera Permission",
          message:
            "MUV needs to access your camera to allow you to take pictures and 'victory selfies'",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  renderImage() {
    return (
      <View
        style={{
          // flex: 1,
          justifyContent: "space-between",
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").width,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {this.state.show ? (
          <Image
            source={{
              uri: this.state.cache_path
            }}
            // source={{
            //   uri: this.state.saved
            //     ? this.state.image_path
            //     : this.state.cache_path
            // }}
            resizeMode={"cover"}
            // resizeMethod={"resize"}
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").width
              // alignSelf: "center",
              // justifyContent: "center",
              // alignItems: "center"
            }}
          />
        ) : (
            <View />
          )}

        {/* 
        <Image
          source={{
            uri: this.state.saved
              ? this.state.image_path
              : this.state.cache_path
          }}
          resizeMode={"cover"}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").width
          }}
        /> 
        */}
      </View>
    );
  }

  toggleFacing() {
    this.setState({
      type: this.state.type === "back" ? "front" : "back"
    });
  }

  toggleFlash() {
    this.setState({
      // flash: flashModeOrder[this.state.flash]
      flash: this.state.flash == "off" ? "torch" : "off"
    });
  }

  toggleWB() {
    this.setState({
      whiteBalance: wbOrder[this.state.whiteBalance]
    });
  }

  toggleFocus() {
    this.setState({
      autoFocus: this.state.autoFocus === "on" ? "off" : "on"
    });
  }

  touchToFocus(event) {
    const { pageX, pageY } = event.nativeEvent;
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const isPortrait = screenHeight > screenWidth;

    let x = pageX / screenWidth;
    let y = pageY / screenHeight;
    // Coordinate transform for portrait. See autoFocusPointOfInterest in docs for more info
    if (isPortrait) {
      x = pageY / screenHeight;
      y = -(pageX / screenWidth) + 1;
    }

    this.setState({
      autoFocusPoint: {
        normalized: { x, y },
        drawRectPosition: { x: pageX, y: pageY }
      }
    });
  }

  zoomOut() {
    this.setState({
      zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1
    });
  }

  zoomIn() {
    this.setState({
      zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1
    });
  }

  setFocusDepth(depth) {
    this.setState({
      depth
    });
  }

  // renderShareButton = () => {
  //   return (
  //     <Aux>
  //       <View style={{ paddingLeft: 5 }}>
  //         <LinearGradient
  //           start={{ x: 0.0, y: 0.0 }}
  //           end={{ x: 1.0, y: 0.0 }}
  //           locations={[0, 1.0]}
  //           colors={["#7D4D99", "#6497CC"]}
  //           style={styles.buttonConfermClick}
  //         >
  //           <TouchableWithoutFeedback
  //             onPress={() => {
  //               this.sharePicture();
  //             }}
  //             style={styles.buttonConfermClickTouch}
  //           >
  //             <View
  //               style={{
  //                 flex: 1,
  //                 alignItems: "center",
  //                 justifyContent: "center",
  //                 paddingLeft: 10,
  //                 paddingRight: 10
  //               }}
  //             >
  //               <Text style={styles.addButton}>Share</Text>
  //             </View>
  //           </TouchableWithoutFeedback>
  //         </LinearGradient>
  //       </View>
  //       <View style={{ paddingLeft: 5 }}>
  //         <LinearGradient
  //           start={{ x: 0.0, y: 0.0 }}
  //           end={{ x: 1.0, y: 0.0 }}
  //           locations={[0, 1.0]}
  //           colors={["#7D4D99", "#6497CC"]}
  //           style={styles.buttonConfermClick}
  //         >
  //           <TouchableWithoutFeedback
  //             onPress={() => {
  //               this.sharePictureFacebook();
  //             }}
  //             style={styles.buttonConfermClickTouch}
  //           >
  //             <View
  //               style={{
  //                 flex: 1,
  //                 alignItems: "center",
  //                 justifyContent: "center",
  //                 paddingLeft: 10,
  //                 paddingRight: 10
  //               }}
  //             >
  //               <Text style={styles.addButton}>Share facebook</Text>
  //             </View>
  //           </TouchableWithoutFeedback>
  //         </LinearGradient>
  //       </View>
  //       <View style={{ paddingLeft: 5 }}>
  //         <LinearGradient
  //           start={{ x: 0.0, y: 0.0 }}
  //           end={{ x: 1.0, y: 0.0 }}
  //           locations={[0, 1.0]}
  //           colors={["#7D4D99", "#6497CC"]}
  //           style={styles.buttonConfermClick}
  //         >
  //           <TouchableWithoutFeedback
  //             onPress={() => {
  //               this.sharePictureInstagram();
  //             }}
  //             style={styles.buttonConfermClickTouch}
  //           >
  //             <View
  //               style={{
  //                 flex: 1,
  //                 alignItems: "center",
  //                 justifyContent: "center",
  //                 paddingLeft: 10,
  //                 paddingRight: 10
  //               }}
  //             >
  //               <Text style={styles.addButton}>Share instagram</Text>
  //             </View>
  //           </TouchableWithoutFeedback>
  //         </LinearGradient>
  //       </View>
  //     </Aux>
  //   );
  // };

  renderSaveButton = () => {
    return (
      <View style={{ paddingLeft: 5 }}>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.0 }}
          locations={[0, 1.0]}
          colors={["#7D4D99", "#6497CC"]}
          style={styles.buttonConfermClick}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              this.savePicture();
            }}
            style={styles.buttonConfermClickTouch}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 10,
                paddingRight: 10,
                flexDirection: "row"
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#FAB21E",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20
                }}
              >
                <Icon
                  name="md-share"
                  style={{
                    fontSize: 14,
                    color: "#fff"
                  }}
                />
              </View>
              <Text style={[styles.addButton, { marginLeft: 4 }]}>
                {strings("id_1_39")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </LinearGradient>
      </View>
    );
  };

  renderShareButton = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center"
          // width: Dimensions.get("window").width / 3
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            this.sharePicture();
          }}
        >
          <View
            style={{
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              backgroundColor: "transparent",
              elevation: 2,
              borderRadius: 25,
              height: 50,
              width: 50,
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              borderColor: "#3d3d3d",
              borderWidth: 0.5
            }}
          >
            <OwnIcon name="share_icn" size={25} color={"#3D3D3D"} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  renderMailShareButton = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center"
          // width: Dimensions.get("window").width / 3
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            this.sendPhotoEmail();
          }}
        >
          <View
            style={{
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              backgroundColor: "transparent",
              elevation: 2,
              borderRadius: 25,
              height: 50,
              width: 50,
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              borderColor: "#3d3d3d",
              borderWidth: 0.5
            }}
          >
            <OwnIcon name="share_icn" size={25} color={"red"} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  renderInstaButton = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center"
          // width: Dimensions.get("window").width / 3
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            this.sharePictureInstagram();
          }}
        >
          <View
            style={{
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              backgroundColor: "transparent",
              elevation: 2,
              borderRadius: 25,
              height: 50,
              width: 50,
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              borderColor: "#3d3d3d",
              borderWidth: 0.5
            }}
          >
            <OwnIcon name="instagram_icn" size={30} color={"#3D3D3D"} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  renderFbButton = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center"
          // width: Dimensions.get("window").width / 3
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            this.sharePictureFacebook();
          }}
        >
          <View
            style={{
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              backgroundColor: "transparent",
              elevation: 2,
              borderRadius: 25,
              height: 50,
              width: 50,
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              borderColor: "#3d3d3d",
              borderWidth: 0.5
            }}
          >
            <OwnIcon name="facebook_icn" size={25} color={"#3D3D3D"} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  renderDeleteButton = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center"
          // width: Dimensions.get("window").width / 3
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.navigation.goBack(null);
          }}
        >
          <View
            style={{
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              backgroundColor: "transparent",
              elevation: 2,
              borderRadius: 25,
              height: 50,
              width: 50,
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              borderColor: "#3d3d3d",
              borderWidth: 0.5
            }}
          >
            <View
              style={{
                elevation: 2,
                borderRadius: 25,
                height: 25,
                width: 25,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff",
                borderColor: "#9D9B9C",
                borderWidth: 0.5
              }}
            >
              <Svg height="18" width="18" viewBox="0 0 100 100" fill="white">
                <Line
                  x1="30"
                  y1="30"
                  x2="70"
                  y2="70"
                  stroke="#9D9B9C"
                  strokeWidth="2"
                />
                <Line
                  x1="70"
                  y1="30"
                  x2="30"
                  y2="70"
                  stroke="#9D9B9C"
                  strokeWidth="2"
                />
              </Svg>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  rotateBeforeSave = uri => {
    ImageResizer.createResizedImage(
      uri,
      2000,
      2000,
      "JPEG",
      100,
      this.getRotationInt(),
      null
    )
      .then(response => {
        // response.uri is the URI of the new image that can now be displayed, uploaded...
        // response.path is the path of the new image
        // response.name is the name of the new image with the extension
        // response.size is the size of the new image
        console.log(response);
        CameraRoll.saveToCameraRoll(response.uri)
          .then(d => {
            console.log("then ", d);
            this.setState(
              {
                image_path: d,
                render_camera: false,
                render_image: true,
                loading: false
              },
              () => { }
            );
          })
          .catch(e => {
            console.log("error ", e);
          });
      })
      .catch(err => {
        // Oops, something went wrong. Check that the filename is correct and
        // inspect err to get more details.
      });
  };

  applyMarkerImage = uri => {
    console.log(
      Dimensions.get("window").width > 360
        ? 0.38 * (this.state.imgW / this.state.frameW)
        : 0.35 * (this.state.imgW / this.state.frameW)
    );

    let k = Dimensions.get("window").width > 360 ? 0.38 : 0.35;
    if (this.state.type != "front") k = k * 0.5;

    ImageMarker.markImage({
      src: uri,
      markerSrc: require("./../../assets/images/frame.png"),
      position: "center", // topLeft, topCenter,topRight, bottomLeft, bottomCenter , bottomRight, center
      scale: 1,
      markerScale:
        Platform.OS == "ios"
          ? 1 * (this.state.imgW / this.state.frameW)
          : Dimensions.get("window").width > 360
            ? k * (this.state.imgW / this.state.frameW)
            : k * (this.state.imgW / this.state.frameW),
      quality: 100
    })
      .then(res => {
        console.log("the path is" + res);
        // this.rotateBeforeSave(
        //   Platform.OS === "android" ? "file://" + res : res
        // );

        this.setState(
          {
            cache_path: Platform.OS === "android" ? "file://" + res : res,
            render_camera: false,
            render_image: true,
            loading: false
          },
          () => {
            this.savePicture();
            setTimeout(() => {
              this.setState({ show: true });
            }, 1000);
          }
        );
      })
      .catch(err => {
        console.log(err, "err");
        this.setState({
          err
        });
      });
  };

  activateST = () => {
    this.props.dispatch(validateStPhoto(this.props.st_kalsa));
  };

  sharePicture = () => {
    if (this.props.navigation.state.params)
      if (this.props.navigation.state.params.validate_kalsa) this.activateST();

    if (Platform.OS !== "android") {
      this.convertBase64().then(image => {
        var shareImageBase64 = {
          // title: "Share",
          type: "image/jpg",
          // message: "MUV Game",
          url: "data:image/jpg;base64," + image

          // subject: "Share Link",
          //  social: "facebook"
        };

        // User did not share
        try {
          Share.open(shareImageBase64)
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              err && console.log(err);
            });
        } catch { }
      });
    } else {
      var shareImageBase64 = {
        // title: "Share",
        type: "image/jpg",
        // message: "MUV Game",
        // url: "data:image/jpg;base64," + image,
        url:
          Platform.OS !== "android"
            ? "file://" + this.state.cache_path
            : this.state.cache_path

        // subject: "Share Link",
        //  social: "facebook"
      };

      // User did not share
      try {
        Share.open(shareImageBase64)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            err && console.log(err);
          });
      } catch { }
    }
  };

  sharePictureFacebook = () => {
    if (this.props.navigation.state.params)
      if (this.props.navigation.state.params.validate_muvtoget)
        this.activateST();

    if (Platform.OS !== "android") {
      const shareLinkContent = {
        contentType: "photo",
        photos: [{ imageUrl: "file://" + this.state.cache_path }]
      };
      ShareDialog.canShow(shareLinkContent)
        .then(function (canShow) {
          if (canShow) {
            return ShareDialog.show(shareLinkContent);
          }
        })
        .then(
          function (result) {
            // prima controllo se c'e il risultato
            if (result) {
              if (result.isCancelled) {
                // alert('Share operation was cancelled');
              } else {
                // alert('Share was successful with postId: '
                //   + result.postId);
              }
            }
          },
          function (error) {
            // alert('Share failed with error: ' + error.message);
          }
        );
    } else {
      Share.isPackageInstalled("com.facebook.katana").then(
        ({ isInstalled }) => {
          if (isInstalled) {
            const shareOptions = {
              // type: 'image/jpg',
              // type: 'image/jpg',
              title: "Share via",
              message: "some message",
              forceDialog: true,
              // url: "data:image/jpg;base64," + image,

              url:
                Platform.OS !== "android"
                  ? "file://" + this.state.cache_path
                  : this.state.cache_path,
              social: "facebook",
              fileURL:
                Platform.OS !== "android"
                  ? "file://" + this.state.cache_path
                  : this.state.cache_path
            };
            // Share.shareSingle(shareOptions);
            Share.shareSingle(
              Object.assign(shareOptions, {
                social: Share.Social.FACEBOOK
              })
            )
              .then(res => {
                console.log(res);
              })
              .catch(err => {
                err && console.log(err);
              });
          } else {
            // apro lo store

            Linking.openURL("market://details?id=com.facebook.katana");
          }
        }
      );
    }
  };

  sharePictureInstagram = () => {
    if (this.props.navigation.state.params)
      if (this.props.navigation.state.params.validate_muvtoget)
        this.activateST();

    if (Platform.OS !== "android") {
      const shareOptions = {
        type: "image/jpg",
        title: "Share via",
        message: "some message",
        // url: "data:image/jpg;base64," + image,
        url:
          Platform.OS !== "android"
            ? "file://" + this.state.cache_path
            : this.state.cache_path
      };

      Share.shareSingle(
        Object.assign(shareOptions, {
          social: Share.Social.INSTAGRAM
        })
      )
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    } else {
      Share.isPackageInstalled("com.instagram.android").then(
        ({ isInstalled }) => {
          if (isInstalled) {
            const shareOptions = {
              type: "image/jpg",
              title: "Share via",
              message: "some message",
              forceDialog: true,
              // url: "data:image/jpg;base64," + image,
              url:
                Platform.OS !== "android"
                  ? "file://" + this.state.cache_path
                  : this.state.cache_path
            };

            Share.shareSingle(
              Object.assign(shareOptions, {
                social: Share.Social.INSTAGRAM
              })
            )
              .then(res => {
                console.log(res);
              })
              .catch(err => {
                err && console.log(err);
              });
          } else {
            // apro lo store
            Linking.openURL("market://details?id=com.instagram.android");
          }
        }
      );
    }
  };

  savePicture = () => {
    CameraRoll.saveToCameraRoll(this.state.cache_path)
      .then(d => {
        console.log("then ", d);
        // this.setState({
        //   image_path: d,
        //   saved: true
        // });
      })
      .catch(e => {
        console.log("error ", e);
      });
  };

  takePicture = async function () {
    // if (!this.state.loading)
    if (this.camera) {
      const data = await this.camera.takePictureAsync({
        // width: 2000,
        // height: 2000,
        exif: true,
        mirrorImage: false,
        fixOrientation: true,
        cropToPreview: true
      });
      console.warn("takePicture ", data);
      this.setState({
        orientValue: data.exif.Orientation,
        loading: true,
        render_camera: false,
        cache_path: data.uri,
        imgW: data.width
      });
      // this.applyMarkerImage(data.uri);
      if (this.state.type == "front") this.flip();
      else this.applyMarkerImage(data.uri);
    }
  };

  takeVideo = async function () {
    if (this.camera) {
      try {
        const promise = this.camera.recordAsync(this.state.recordOptions);

        if (promise) {
          this.setState({ isRecording: true });
          const data = await promise;
          this.setState({ isRecording: false });
          console.warn("takeVideo", data);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  toggle = value => () =>
    this.setState(prevState => ({ [value]: !prevState[value] }));

  facesDetected = ({ faces }) => this.setState({ faces });

  renderFace = ({ bounds, faceID, rollAngle, yawAngle }) => (
    <View
      key={faceID}
      transform={[
        { perspective: 600 },
        { rotateZ: `${rollAngle.toFixed(0)}deg` },
        { rotateY: `${yawAngle.toFixed(0)}deg` }
      ]}
      style={[
        styles.face,
        {
          ...bounds.size,
          left: bounds.origin.x,
          top: bounds.origin.y
        }
      ]}
    >
      <Text style={styles.faceText}>ID: {faceID}</Text>
      <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
      <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
    </View>
  );

  renderLandmarksOfFace(face) {
    const renderLandmark = position =>
      position && (
        <View
          style={[
            styles.landmark,
            {
              left: position.x - landmarkSize / 2,
              top: position.y - landmarkSize / 2
            }
          ]}
        />
      );
    return (
      <View key={`landmarks-${face.faceID}`}>
        {renderLandmark(face.leftEyePosition)}
        {renderLandmark(face.rightEyePosition)}
        {renderLandmark(face.leftEarPosition)}
        {renderLandmark(face.rightEarPosition)}
        {renderLandmark(face.leftCheekPosition)}
        {renderLandmark(face.rightCheekPosition)}
        {renderLandmark(face.leftMouthPosition)}
        {renderLandmark(face.mouthPosition)}
        {renderLandmark(face.rightMouthPosition)}
        {renderLandmark(face.noseBasePosition)}
        {renderLandmark(face.bottomMouthPosition)}
      </View>
    );
  }

  renderFaces = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderFace)}
    </View>
  );

  renderLandmarks = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderLandmarksOfFace)}
    </View>
  );

  renderTextBlocks = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.textBlocks.map(this.renderTextBlock)}
    </View>
  );

  renderTextBlock = ({ bounds, value }) => (
    <React.Fragment key={value + bounds.origin.x}>
      <Text
        style={[
          styles.textBlock,
          { left: bounds.origin.x, top: bounds.origin.y }
        ]}
      >
        {value}
      </Text>
      <View
        style={[
          styles.text,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y
          }
        ]}
      />
    </React.Fragment>
  );

  textRecognized = object => {
    const { textBlocks } = object;
    this.setState({ textBlocks });
  };

  barcodeRecognized = ({ barcodes }) => this.setState({ barcodes });

  renderBarcodes = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.barcodes.map(this.renderBarcode)}
    </View>
  );

  renderBarcode = ({ bounds, data, type }) => (
    <React.Fragment key={data + bounds.origin.x}>
      <View
        style={[
          styles.text,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y
          }
        ]}
      >
        <Text style={[styles.textBlock]}>{`${data} ${type}`}</Text>
      </View>
    </React.Fragment>
  );

  renderCamera() {
    const { canDetectFaces, canDetectText, canDetectBarcode } = this.state;
    const drawFocusRingPosition = {
      top: this.state.autoFocusPoint.drawRectPosition.y - 32,
      left: this.state.autoFocusPoint.drawRectPosition.x - 32
    };
    return (
      <FillToAspectRatio>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={{
            flex: 1,
            justifyContent: "space-between",
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").width,
            alignItems: "center",
            justifyContent: "center"
          }}
          captureAudio={false}
          type={this.state.type}
          flashMode={this.state.flash}
          ratio={this.state.ratio}
          playSoundOnCapture={true}
        >
          <Image
            source={require("./../../assets/images/frame.png")}
            resizeMode={"cover"}
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").width
            }}
          />
        </RNCamera>
      </FillToAspectRatio>
    );
  }

  renderSpinner() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").width,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {/* <ActivityIndicator size="large" color="#F49658" /> */}
        <Image
          source={require("./../../assets/images/puntini_big.gif")}
          style={{
            height: 25,
            width: 40
          }}
        />
      </View>
    );
  }

  renderSpinnerOrImage() {
    return this.state.loading ? this.renderSpinner() : this.renderImage();
  }

  renderCaptureBtn() {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: 80,
          height: 80
        }}
      >
        <TouchableWithoutFeedback
          style={styles.captureBtn}
          onPress={() => {
            this.takePicture();
          }}
        >
          <Image
            source={require("./../../assets/images/camera_button_icn.png")}
            style={styles.captureBtn}
            resizeMode={"contain"}
          />
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderSwitchCamera() {
    return (
      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center"
          // width: Dimensions.get("window").width / 3
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            this.toggleFacing();
          }}
        >
          <View
            style={{
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              backgroundColor: "transparent",
              elevation: 2,
              borderRadius: 25,
              height: 50,
              width: 50,
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              borderColor: "#3d3d3d",
              borderWidth: 0.5
            }}
          >
            {Platform.OS !== "android" ? (
              <Svg height="40" width="40">
                <Circle cx="20" cy="20" r="20" fill="white" />
                <OwnIcon name="switch_camera_icn" size={40} color={"#3d3d3d"} />
              </Svg>
            ) : (
                <OwnIcon
                  style={{
                    position: "relative",
                    backgroundColor: "transparent",

                    top: 0,
                    left: 0
                  }}
                  name="switch_camera_icn"
                  size={40}
                  color={"#3d3d3d"}
                />
              )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderSwitchFlash() {
    return (
      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center"
          // width: Dimensions.get("window").width / 3
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            this.toggleFlash();
          }}
        >
          <View
            style={{
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              backgroundColor: "transparent",
              elevation: 2,
              borderRadius: 25,
              height: 50,
              width: 50,
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              borderColor: "#3d3d3d",
              borderWidth: 0.5
            }}
          >
            {Platform.OS !== "android" ? (
              <Svg height="40" width="40">
                <Circle cx="20" cy="20" r="20" fill="white" />
                <OwnIcon name="flash_icn" size={40} color={"#3d3d3d"} />
              </Svg>
            ) : (
                <OwnIcon
                  style={{
                    position: "relative",
                    backgroundColor: "transparent",

                    top: 0,
                    left: 0
                  }}
                  name="flash_icn"
                  size={40}
                  color={"#3d3d3d"}
                />
              )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderCameraButtons() {
    return (
      <View style={styles.commandsContainer}>
        {this.renderSwitchCamera()}
        {this.renderCaptureBtn()}
        {this.renderSwitchFlash()}
      </View>
    );
  }

  renderImageButtons() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height:
            Dimensions.get("window").height - Dimensions.get("window").width,
          backgroundColor: "#fff",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          marginTop: Dimensions.get("window").height * 0
        }}
      >
        <Text
          style={{
            color: "#3d3d3d",
            fontFamily: "Montserrat-ExtraBold",
            fontSize: 18,
            marginTop: Dimensions.get("window").height * 0.05
          }}
        >
          {strings("id_1_39")}!
        </Text>
        <View
          style={{
            width: Dimensions.get("window").width,
            justifyContent: "space-around",
            flexDirection: "row",
            alignItems: "center",
            alignItems: "flex-start",
            marginTop: Dimensions.get("window").height * 0.05
            // flexDirection: 'row'
          }}
        >
          {this.renderMailShareButton()}

          {/* {this.renderShareButton()}
          {this.renderFbButton()}
          {this.renderInstaButton()} */}
          {this.renderDeleteButton()}
        </View>
      </View>
    );
  }

  render() {
    console.log(this.props);
    if (this.state.load) {
      return (
        <View style={styles.mainContainer}>
          {/* <View style={styles.cameraContainer}> */}
          {this.state.render_camera
            ? this.renderCamera()
            : this.renderSpinnerOrImage()}
          {/* </View> */}
          {/* 
        <View style={styles.commandsContainer}>
          {this.state.render_camera
            ? this.renderCaptureBtn()
            : this.renderSaveBtn()}
        </View> 
        */}
          {this.state.render_camera
            ? this.renderCameraButtons()
            : this.renderImageButtons()}
        </View>
      );
    } else {
      return <View />;
    }
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  cameraContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center"
  },
  commandsContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - Dimensions.get("window").width,
    backgroundColor: "#fff",
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center"
  },
  captureBtn: {
    width: 80,
    height: 80
  },
  saveBtn: {
    width: Dimensions.get("window").width,
    height: 80,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonSaveText: {
    color: "#3d3d3d",
    fontFamily: "OpenSans-Regular",
    fontSize: 14
  },
  iconText: {
    fontWeight: "bold",
    fontFamily: "OpenSans-Bold",
    fontSize: 12,
    textAlign: "center",
    color: "#3D3D3D"
  },
  buttonConfermClick: {
    width: 130,
    height: 50,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 2,
    borderRadius: 25,
    alignItems: "center"
  },
  buttonConfermClickTouch: {
    width: 130,
    height: 50
  },
  addButton: {
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "bold"
  },

  // --- CAMERA style
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#000"
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
    borderColor: "white",
    borderWidth: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  autoFocusBox: {
    position: "absolute",
    height: 64,
    width: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
    opacity: 0.4
  },
  flipText: {
    color: "white",
    fontSize: 15
  },
  zoomText: {
    position: "absolute",
    bottom: 70,
    zIndex: 2,
    left: 2
  },
  picButton: {
    backgroundColor: "darkseagreen"
  },
  facesContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: "absolute",
    borderColor: "#FFD700",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: "absolute",
    backgroundColor: "red"
  },
  faceText: {
    color: "#FFD700",
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
    backgroundColor: "transparent"
  },
  text: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: "absolute",
    borderColor: "#F00",
    justifyContent: "center"
  },
  textBlock: {
    color: "#F00",
    position: "absolute",
    textAlign: "center",
    backgroundColor: "transparent"
  }
});

const getStTeatroMassimo = state =>
  state.trainings.st_teatro_massimo ? state.trainings.st_teatro_massimo : false;
const getStBallarak = state =>
  state.trainings.st_ballarak ? state.trainings.st_ballarak : false;
const getStMuvtoget = state =>
  state.trainings.st_muvtoget ? state.trainings.st_muvtoget : false;
const getStKalsa = state =>
  state.trainings.st_kalsa ? state.trainings.st_kalsa : false;

const getStTeatroMassimoState = createSelector([getStTeatroMassimo], stTeatro =>
  stTeatro ? stTeatro : false
);

const getStBallarakState = createSelector([getStBallarak], stBallarak =>
  stBallarak ? stBallarak : false
);

const getStMuvtogetState = createSelector([getStMuvtoget], stMuvtoget =>
  stMuvtoget ? stMuvtoget : false
);

const getStKalsaState = createSelector([getStKalsa], stKalsa =>
  stKalsa ? stKalsa : false
);

const withData = connect(state => {
  return {
    st_teatro_massimo: getStTeatroMassimoState(state),
    st_ballarak: getStBallarakState(state),
    st_muvtoget: getStMuvtogetState(state),
    st_kalsa: getStKalsaState(state)
  };
});

export default withData(CameraScreen);

// export default CameraScreen;
