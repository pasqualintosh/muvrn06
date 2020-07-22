import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Platform,
  NativeModules,
  TouchableWithoutFeedback,
  Image,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Animated,
  Keyboard,
  Alert
} from "react-native";
import WavyArea from "./../../components/WavyArea/WavyArea";
import LinearGradient from "react-native-linear-gradient";
import { BoxShadow } from "react-native-shadow";
import { connect } from "react-redux";
import {
  createAccountNew,
  createAccountNewSocial,
  updateState,
  checkFilterUniqueAccount
} from "./../../domains/register/ActionCreators";
import Emoji from "@ardentlabs/react-native-emoji";
import Icon from "react-native-vector-icons/Ionicons";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";

import { strings } from "../../config/i18n";
import WebService from "../../config/WebService";
import { getStatusBarHeight } from "./../../helpers/notch";

class EndScreen extends React.Component {
  constructor(props) {
    super(props);
    this.keyboardHeight = new Animated.Value(0);
    this.state = {
      username: "",
      placeholderUsername: strings("id_0_13"),
      def_modal_split: [
        {
          label: "walk",
          value: 0,
        },
        {
          label: "bike",
          value: 0,
        },
        {
          label: "bus",
          value: 0,
        },
        {
          label: "car",
          value: 0,
        },
        {
          label: "motorbike",
          value: 0,
        },
        {
          label: "car_pooling",
          value: 0,
        },
      ],
      button_tapped: false,
      statusValidationEmail: false
    };
  }

  static navigationOptions = {
    header: null,
  };

  error = () => {
    this.setState({
      statusValidationEmail: false,
    });
    // riprova piu tardi
  };

  alertParam = (data) => {
    this.setState({
      statusValidationEmail: false,
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
      statusValidationEmail: false,
    });
    // ho controllato il nickname che non esiste, quindi creo l'account
    this.setState({ button_tapped: true }, () => {
      
      console.log(this.props.registerState);
      // const overall_modal_split = this.getOverallModalSplit(
    //   this.state.def_modal_split
    // );
    // const overall_modal_split = this.getOverallModalSplit(
    //   this.props.registerState.generalModalSplit
    // );
    // const mfr_modal_split = this.getMFRModalSplit(
    //   this.props.registerState.mostFrequentRaceModalSplit
    // );
    const account = {
      ...this.props.registerState,
      // overall_modal_split: this.state.def_modal_split,
      // ...mfr_modal_split,
      ...this.getModalParams(),
    };
    console.log(account);
    // se è registrazione classica o social
    if (this.props.registerState.social_backend) {
      // social
      this.props.dispatch(
        createAccountNewSocial(account, () => {
          this.setState({ button_tapped: false });
        })
      );
    } else {
      // classica
      this.props.dispatch(
        createAccountNew(account, () => {
          this.setState({ button_tapped: false });
        })
      );
    }
    });

    

    
  };

  validation = () => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // return re.test(String(email).toLowerCase());
    // console.log(re.test(String(email).toLowerCase()));

    // filtro per il nickname, solo lettere, numeri e _ e .
    var nicknameTest = /^[a-zA-Z0-9/\_//\.//\-/]+$/i;
    const { username } = this.state;

    let error_txt = "";

    if (username.length < 4 || username.length > 20) {
      error_txt = error_txt + "\n- " + strings("id_0_19");
    }
    else if (!nicknameTest.test(username)) {
      error_txt = error_txt + "\n- " + strings("id_0_19");
    }

    if (
      username.length > 3 &&
      username.length < 21 &&
      nicknameTest.test(username)
    ) {
      this.props.dispatch(
        updateState({ username: this.state.username })
      );
      this.setState({
        statusValidationEmail: true,
      });

      this.props.dispatch(
        checkFilterUniqueAccount(
          { username },
          this.alertParam,
          this.goOn,
          this.error
        )
      );
      
      // this.props.navigation.navigate("GDPRScreen");
    } else {
      this.setState({ show_tips: true });
      Alert.alert(strings("id_0_17"), strings("id_0_18") + error_txt + "\n");
    }
  };

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
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardDidShow = (event) => {
    // 200
    // event.endCoordinates.height
    console.log(event);
    Animated.timing(this.keyboardHeight, {
      duration: 750,
      toValue:
        -(Dimensions.get("window").height < 700 ? 180 : 230) +
        getStatusBarHeight(),
    }).start();
  };

  keyboardDidHide = (event) => {
    Animated.timing(this.keyboardHeight, {
      duration: 750,
      toValue: 0,
    }).start();
  };

  keyboardWillShow = (event) => {
    // 200
    // event.endCoordinates.height
    console.log(event);
    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: -(Dimensions.get("window").height < 700 ? 180 : 230) - 80,
    }).start();
  };

  keyboardWillHide = (event) => {
    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0,
    }).start();
  };

  getModalParams = () => {
    let modalObj = {
      bike: 0,
      public_local_transport_subscriber: 0,
      public_train_transport_subscriber: 0,
      pooling_pilot: false,
      pooling_passenger: false,
      bike_sharing_user: false,
      car_sharing_user: false,
      ride_sharing_user: false,
    };

    if (this.props.registerState.bicycle != undefined)
      modalObj = { ...modalObj, bike: 1 };

    if (this.props.registerState.local_public_transport != undefined)
      modalObj = { ...modalObj, public_local_transport_subscriber: 1 };

    if (this.props.registerState.train != undefined)
      modalObj = { ...modalObj, public_train_transport_subscriber: 1 };

    if (this.props.registerState.car_sharing != undefined)
      modalObj = { ...modalObj, car_sharing_user: true };

    if (this.props.registerState.bike_sharing != undefined)
      modalObj = { ...modalObj, bike_sharing_user: true };

    if (this.props.registerState.ride_sharing != undefined)
      modalObj = { ...modalObj, ride_sharing_user: true };

    return modalObj;
  };

  getOverallModalSplit = (modal_splits) => {
    const overall_modal_split = {
      overall_modal_split_walk: 0,
      overall_modal_split_bike: 0,
      overall_modal_split_bus: 0,
      overall_modal_split_car_pooling: 0,
      overall_modal_split_car: 0,
    };
    modal_splits.forEach((item) => {
      switch (item.label) {
        case "walk":
          overall_modal_split.overall_modal_split_walk = item.value;
          break;
        case "bike":
          overall_modal_split.overall_modal_split_bike = item.value;
          break;
        case "bus":
          overall_modal_split.overall_modal_split_bus = item.value;
          break;
        case "car":
          overall_modal_split.overall_modal_split_car = item.value;
          break;
        case "car_pooling":
          overall_modal_split.overall_modal_split_car_pooling = item.value;
          break;
      }
    });
    return overall_modal_split;
  };

  getMFRModalSplit = (modal_splits) => {
    const mfr_modal_split = {
      mfr_modal_split_walk: 0,
      mfr_modal_split_bike: 0,
      mfr_modal_split_bus: 0,
      mfr_modal_split_car_pooling: 0,
      mfr_modal_split_car: 0,
    };
    modal_splits.forEach((item) => {
      switch (item.label) {
        case "walk":
          mfr_modal_split.mfr_modal_split_walk = item.value;
          break;
        case "bike":
          mfr_modal_split.mfr_modal_split_bike = item.value;
          break;
        case "bus":
          mfr_modal_split.mfr_modal_split_bus = item.value;
          break;
        case "car":
          mfr_modal_split.mfr_modal_split_car = item.value;
          break;
        case "car_pooling":
          mfr_modal_split.mfr_modal_split_car_pooling = item.value;
          break;
      }
    });
    return mfr_modal_split;
  };

  render() {
    let extra = 0;
    if (
      Platform.OS === "ios" &&
      (Dimensions.get("window").height === 812 ||
        Dimensions.get("window").width === 812 ||
        Dimensions.get("window").height === 896 ||
        Dimensions.get("window").width === 896)
    ) {
      extra = 20;
    }
    let shadowOpt;
    if (Platform.OS == "ios") {
      shadowOpt = {
        width: Dimensions.get("window").width * 0.6,
        height: 40,
        color: "#111",
        border: 4,
        radius: 5,
        opacity: 0.25,
        x: 0,
        y: 1,
        style: {
          marginTop: 0,
          position: "absolute",
          top: 0,
        },
      };
      if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
        shadowOpt = {
          width: Dimensions.get("window").width * 0.6,
          height: 28,
          color: "#111",
          border: 4,
          radius: 5,
          opacity: 0.25,
          x: 0,
          y: 1,
          style: {
            marginTop: 0,
            position: "absolute",
            top: 0,
          },
        };
      }
    } else
      shadowOpt = {
        width: Dimensions.get("window").width * 0.6,
        height: 40,
        color: "#444",
        border: 6,
        radius: 5,
        opacity: 0.35,
        x: 0,
        y: 1,
        style: {
          marginTop: 0,
          position: "absolute",
          top: 0,
        },
      };
    return (
      <ImageBackground
        source={require("./../../assets/images/onboardingImage/onbording_final_bg.png")}
        style={styles.backgroundImage}
      >
        <StatusBar backgroundColor="white" barStyle="light-content" />
        <SafeAreaView
          style={{
            //paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            // marginBottom: 48, // se ho navigation bar in android in basso che non viene considerata per posizionare gli oggetti
            flex: 1,
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <Animated.View
              style={{
                transform: [{ translateY: this.keyboardHeight }],
                height: Dimensions.get("window").height,
                flex: 1,

                alignItems: "center",
                backgroundColor: "transparent",
              }}
            >
             <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View
                style={{
                  height: 150,
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  
                  // paddingTop: extra,
                }}
              >
               <Image 
               style={{
                height: 130, // 200 x 300 , 1,5
                width: 130 * 1.5
               }}
               
               source={require("../../assets/images/onboardingImage/logo_muv_trademark.png")}
               ></Image>
              </View>
              </TouchableWithoutFeedback><TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View
                style={{
                  height: Dimensions.get("window").height - 450,
                  backgroundColor: "transparent",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{
                    width:
                      ((Dimensions.get("window").height - 450) / 1.4056) * 0.9,
                    height: (Dimensions.get("window").height - 450) * 0.9,
                    alignSelf: "center",
                  }}
                  // source={require("../../assets/images/avatars/end_trip/8/Esultanzaxhdpi.png")}
                  // source={images[this.props.registerState.avatar]}
                  source={{
                    uri:
                      WebService.url +
                      (this.props.registerState &&
                      this.props.registerState.avatarDetail &&
                      this.props.registerState.avatarDetail.esultanza
                        ? this.props.registerState.avatarDetail.esultanza
                        : "/media/avatar_images/Samantha/Esultanzaxhdpi.png"),
                  }}
                />
              </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}><
                View
                style={{
                  height: 250,
                  backgroundColor: "transparent",
                  justifyContent: "space-around",
                  alignContent: "center",
                  alignItems: "center",
                  top: Platform.OS == "ios" ? 0 : -15,
                }}
              >
                <View
                  style={{
                    backgroundColor: "transparent",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View style={styles.textFooterContainer}>
                      <Text
                        style={[
                          styles.textFooter,
                          { fontSize: 18, paddingBottom: 5 },
                        ]}
                      >
                        {this.props.registerState &&
                        this.props.registerState.username
                          ? strings("id_0_119").replace(
                              "nickname",
                              this.props.registerState.username
                            )
                          : strings("id_0_119")}
                      </Text>
                      <Text style={styles.textFooter}>
                        {strings("id_0_120")}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.input}>
                  <OwnIcon
                    name="name_icn"
                    size={40}
                    color="#636EAB"
                    style={{ paddingLeft: 10 }}
                  />
                  <TextInput
                    value={this.state.username}
                    autoCapitalize={"none"}
                    autoCompleteType={"off"}
                    autoCorrect={false}
                    placeholder={this.state.placeholderUsername}
                    placeholderTextColor={"#636CA9"}
                    style={styles.inputText}
                    onChangeText={(text) => {
                      this.setState({ username: text });
                    }}
                    blurOnSubmit={false}
                    onSubmitEditing={(text) => {
                     this.validation()
                    }}
                    onEndEditing={(text) => {
                      // this.props.dispatch(
                      //   updateState({ username: this.state.username })
                      // );
                    }}
                    returnKeyType={"next"}
                    selectionColor={"#636CA9"}
                    onFocus={() => {
                      this.setState({ placeholderUsername: "" });
                    }}
                    onBlur={() => {
                      this.setState({
                        placeholderUsername: strings("id_0_13"),
                      });
                    }}
                  />
                </View>
                <View
                  style={{
                    backgroundColor: "transparent",
                    justifyContent: "center",
                  }}
                >
                  <View style={[styles.buttonContainer]}>
                    {/* <BoxShadow setting={shadowOpt} /> */}
                    <TouchableOpacity
                      onPress={() => {
                        if (!this.state.button_tapped && !this.state.statusValidationEmail) {
                          this.validation();
                          
                        }
                      }}
                      disabled={
                        this.state.button_tapped || this.state.statusValidationEmail
                          ? true
                          : false
                      }
                    >
                      <LinearGradient
                        start={{ x: 0.0, y: 0.0 }}
                        end={{ x: 0.0, y: 1.0 }}
                        locations={[0, 1.0]}
                        colors={["#FAB21E", "#FA941E"]}
                        style={styles.buttonBox}
                      >
                        {this.state.button_tapped || this.state.statusValidationEmail ? (
                          <ActivityIndicator size="small" color="#3363AD" />
                        ) : (
                          <Text style={styles.buttonGoOnText}>
                            {strings("id_0_121")}
                          </Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: Dimensions.get("window").width * 0.85,
    height: 44,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "#ffffff",
    // opacity: 0.15,
    // borderRadius: 4
    borderColor: "#636CA9",
    borderWidth: 1,

    // marginVertical: 4
  },
  inputText: {
    // textDecorationColor: '#FFFFFF',
    color: "#636CA9",
    flex: 1,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    textAlign: "left",
    fontSize: 16,
  },
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  topOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.6,
    top: 0,
  },
  bottomOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.1,
    top: Dimensions.get("window").height * 0,
  },
  textHeaderContainer: {
    marginTop: Platform.OS == "ios" ? 30 : 15,
    marginLeft: 20,
    flexDirection: "row",
    width: Dimensions.get("window").width * 0.85,
  },
  textHeader: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3d3d3d",
    fontSize: 15,
    fontWeight: "bold",
  },
  textFooterContainer: {
    padding: 5,
    width: Dimensions.get("window").width * 0.9,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  textFooter: {
    fontFamily: "OpenSans-Regular",
    color: "#000000",
    fontSize: 13,
    fontWeight: "400",
    textAlign: "center",
    paddingBottom: 10,
  },
  buttonContainer: {
    width: Dimensions.get("window").width * 0.6,
    height: 60,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonBox: {
    width: Dimensions.get("window").width * 0.6,
    height: 40,

    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    elevation: 1,
  },
  buttonGoOnText: {
    color: "#000000",
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
  },
});

export const positiveData = [
  {
    value: 60,
  },
  {
    value: 40,
  },
  {
    value: 50,
  },
  {
    value: 40,
  },
  {
    value: 50,
  },
];

export const negativeData = [
  {
    value: -60,
  },
  {
    value: -20,
  },
  {
    value: -50,
  },
  {
    value: -40,
  },
  {
    value: -50,
  },
];

export const images = {
  1: require("../../assets/images/avatars/end_trip/1/Esultanzaxhdpi.png"),
  2: require("../../assets/images/avatars/end_trip/2/Esultanzaxhdpi.png"),
  3: require("../../assets/images/avatars/end_trip/3/Esultanzaxhdpi.png"),
  4: require("../../assets/images/avatars/end_trip/4/Esultanzaxhdpi.png"),
  5: require("../../assets/images/avatars/end_trip/5/Esultanzaxhdpi.png"),
  6: require("../../assets/images/avatars/end_trip/6/Esultanzaxhdpi.png"),
  7: require("../../assets/images/avatars/end_trip/7/Esultanzaxhdpi.png"),
  8: require("../../assets/images/avatars/end_trip/8/Esultanzaxhdpi.png"),
  9: require("../../assets/images/avatars/end_trip/9/Esultanzaxhdpi.png"),
  10: require("../../assets/images/avatars/end_trip/10/Esultanzaxhdpi.png"),
  11: require("../../assets/images/avatars/end_trip/11/Esultanzaxhdpi.png"),
  12: require("../../assets/images/avatars/end_trip/12/Esultanzaxhdpi.png"),
  13: require("../../assets/images/avatars/end_trip/13/Esultanzaxhdpi.png"),
  14: require("../../assets/images/avatars/end_trip/14/Esultanzaxhdpi.png"),
  15: require("../../assets/images/avatars/end_trip/15/Esultanzaxhdpi.png"),
  16: require("../../assets/images/avatars/end_trip/16/Esultanzaxhdpi.png"),
  17: require("../../assets/images/avatars/end_trip/17/Esultanzaxhdpi.png"),
  18: require("../../assets/images/avatars/end_trip/18/Esultanzaxhdpi.png"),
  19: require("../../assets/images/avatars/end_trip/19/Esultanzaxhdpi.png"),
  20: require("../../assets/images/avatars/end_trip/20/Esultanzaxhdpi.png"),
  21: require("../../assets/images/avatars/end_trip/21/Esultanzaxhdpi.png"),
  22: require("../../assets/images/avatars/end_trip/22/Esultanzaxhdpi.png"),
  23: require("../../assets/images/avatars/end_trip/23/Esultanzaxhdpi.png"),
  24: require("../../assets/images/avatars/end_trip/24/Esultanzaxhdpi.png"),
  25: require("../../assets/images/avatars/end_trip/25/Esultanzaxhdpi.png"),
  26: require("../../assets/images/avatars/end_trip/26/Esultanzaxhdpi.png"),
  27: require("../../assets/images/avatars/end_trip/27/Esultanzaxhdpi.png"),
  28: require("../../assets/images/avatars/end_trip/28/Esultanzaxhdpi.png"),
  29: require("../../assets/images/avatars/end_trip/29/Esultanzaxhdpi.png"),
  30: require("../../assets/images/avatars/end_trip/30/Esultanzaxhdpi.png"),
  31: require("../../assets/images/avatars/end_trip/31/Esultanzaxhdpi.png"),
  32: require("../../assets/images/avatars/end_trip/32/Esultanzaxhdpi.png"),
  33: require("../../assets/images/avatars/end_trip/33/Esultanzaxhdpi.png"),
  34: require("../../assets/images/avatars/end_trip/34/Esultanzaxhdpi.png"),
  35: require("../../assets/images/avatars/end_trip/35/Esultanzaxhdpi.png"),
  36: require("../../assets/images/avatars/end_trip/36/Esultanzaxhdpi.png"),
  37: require("../../assets/images/avatars/end_trip/37/Esultanzaxhdpi.png"),
  38: require("../../assets/images/avatars/end_trip/38/Esultanzaxhdpi.png"),
  39: require("../../assets/images/avatars/end_trip/39/Esultanzaxhdpi.png"),
  40: require("../../assets/images/avatars/end_trip/40/Esultanzaxhdpi.png"),
  41: require("../../assets/images/avatars/end_trip/41/Esultanzaxhdpi.png"),
  42: require("../../assets/images/avatars/end_trip/42/Esultanzaxhdpi.png"),
  43: require("../../assets/images/avatars/end_trip/43/Esultanzaxhdpi.png"),
  44: require("../../assets/images/avatars/end_trip/44/Esultanzaxhdpi.png"),
  45: require("../../assets/images/avatars/end_trip/45/Esultanzaxhdpi.png"),
  46: require("../../assets/images/avatars/end_trip/46/Esultanzaxhdpi.png"),
  47: require("../../assets/images/avatars/end_trip/47/Esultanzaxhdpi.png"),
  48: require("../../assets/images/avatars/end_trip/48/Esultanzaxhdpi.png"),
  49: require("../../assets/images/avatars/end_trip/49/Esultanzaxhdpi.png"),
  50: require("../../assets/images/avatars/end_trip/50/Esultanzaxhdpi.png"),
  51: require("../../assets/images/avatars/end_trip/51/Esultanzaxhdpi.png"),
  52: require("../../assets/images/avatars/end_trip/52/Esultanzaxhdpi.png"),
  53: require("../../assets/images/avatars/end_trip/53/Esultanzaxhdpi.png"),
  54: require("../../assets/images/avatars/end_trip/54/Esultanzaxhdpi.png"),
  55: require("../../assets/images/avatars/end_trip/55/Esultanzaxhdpi.png"),
  56: require("../../assets/images/avatars/end_trip/56/Esultanzaxhdpi.png"),
  57: require("../../assets/images/avatars/end_trip/57/Esultanzaxhdpi.png"),
  58: require("../../assets/images/avatars/end_trip/58/Esultanzaxhdpi.png"),
  59: require("../../assets/images/avatars/end_trip/59/Esultanzaxhdpi.png"),
  60: require("../../assets/images/avatars/end_trip/60/Esultanzaxhdpi.png"),
  61: require("../../assets/images/avatars/end_trip/61/Esultanzaxhdpi.png"),
  62: require("../../assets/images/avatars/end_trip/62/Esultanzaxhdpi.png"),
  63: require("../../assets/images/avatars/end_trip/63/Esultanzaxhdpi.png"),
  64: require("../../assets/images/avatars/end_trip/64/Esultanzaxhdpi.png"),
  65: require("../../assets/images/avatars/end_trip/65/Esultanzaxhdpi.png"),
  66: require("../../assets/images/avatars/end_trip/66/Esultanzaxhdpi.png"),
  67: require("../../assets/images/avatars/end_trip/67/Esultanzaxhdpi.png"),
  68: require("../../assets/images/avatars/end_trip/68/Esultanzaxhdpi.png"),
  69: require("../../assets/images/avatars/end_trip/69/Esultanzaxhdpi.png"),
  70: require("../../assets/images/avatars/end_trip/70/Esultanzaxhdpi.png"),
  71: require("../../assets/images/avatars/end_trip/71/Esultanzaxhdpi.png"),
  72: require("../../assets/images/avatars/end_trip/72/Esultanzaxhdpi.png"),
  73: require("../../assets/images/avatars/end_trip/73/Esultanzaxhdpi.png"),
};

const withData = connect((state) => {
  return {
    registerState: state.register,
    loginStateStatus: state.login.status,
  };
});

export default withData(EndScreen);
