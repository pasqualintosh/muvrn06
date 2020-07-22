import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Alert,
  Modal,
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Animated,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import {
  updateState,
  checkEmail,
  checkUniqueAccount,
  checkFilterUniqueAccount,
} from "./../../domains/register/ActionCreators";
import RegisterFormWithNickname from "./../../components/RegisterFormWithNickname/RegisterFormWithNickname";
import GoOnButton from "./../../components/GoOnButton/GoOnButton";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import CheckBox from "react-native-check-box";
import Icon from "react-native-vector-icons/Ionicons";
import IconBack from "react-native-vector-icons/Ionicons";
import { strings } from "../../config/i18n";
import { getStatusBarHeight } from "./../../helpers/notch";
const eni_domain_list = [
  "agi.it",
  "be.eni.com",
  "coralflng.com",
  "ecofuel.eni.com",
  "eni.com",
  "eni.it",
  "eni.kz",
  "eniadfin.it",
  "enicorporateuniversity.eni.it",
  "enigaseluce.com",
  "enighana.eni.com",
  "eni-insurance.ie",
  "eniinternational.com",
  "enimed.eni.it",
  "enipakistan.com.pk",
  "enipower.eni.it",
  "enirewind.com",
  "eniservizi.eni.it",
  "enjoy.eni.com",
  "fasen.eni.it",
  "floaters.eni.com",
  "fr.eni.com",
  "greenstreambv.com",
  "lng.eni.it",
  "mrvspa.com",
  "polimerieuropa.com",
  "res.eni.com",
  "scogat.eni.com",
  "serfactoring.eni.it",
  "serviziaerei.eni.it",
  "ttpc.eni.com",
  "varenergi.no",
  "versalis.eni.com",
  "zfod.eni.com",
  "wepush.org",
];

class UserDataWithNicknameScreen extends React.Component {
  constructor(props) {
    super(props);
    this.keyboardHeight = new Animated.Value(0);
    this.state = {
      hide_password: true,
      hide_password_icon: "ios-eye",
      show_tips: false,
      modal_visible: false,
      checkboxes: [
        {
          checked: false,
          rightText: strings("customized_cont"),
          rightTextView: null,
          description: strings("receive_persona"),
        },
        {
          checked: false,
          rightText: strings("sponsorship_off"),
          rightTextView: null,
          description: strings("receive_sponsor"),
        },
        {
          checked: false,
          rightText: strings("commercially_us"),
          rightTextView: null,
          description: strings("allow_data_prod"),
        },
        {
          checked: false,
          rightText: strings("mailing_list"),
          rightTextView: null,
          description: strings("be_added_to_the"),
        },
      ],
      statusValidationEmail: false,
    };
  }

  static navigationOptions = {
    header: null,
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
            fontFamily: "Montserrat-ExtraBold",
          }}
        >
          TO THE NEXT LEVEL
        </Text>
      </View>
    );
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
        getStatusBarHeight() +
        20,
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
      toValue: -(Dimensions.get("window").height < 700 ? 180 : 230) + 20,
    }).start();
  };

  keyboardWillHide = (event) => {
    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0,
    }).start();
  };

  goOn = () => {
    this.setState({
      statusValidationEmail: false,
    });

    // else this.props.navigation.navigate("GDPRScreen");
    this.props.navigation.navigate("ChooseRandomOrNotSceeen");
    // this.props.navigation.navigate("GDPRScreen");
    // else this.setState({ modal_visible: true });
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

  validation = () => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // return re.test(String(email).toLowerCase());
    // console.log(re.test(String(email).toLowerCase()));

    // filtro per il nickname, solo lettere, numeri e _ e .
    var nicknameTest = /^[a-zA-Z0-9/\_//\.//\-/]+$/i;
    const {
      name,
      surname,
      social_backend,
      username,
      phone,
      password,
      email,
      prefix,
    } = this.props.registerState;
    // if (this.input) {

    //    const values  = this.input.getState();
    //    console.log(values)
    //     name = values.name
    //     surname = values.surname
    //     phone = values.phone
    //     password = values.password
    //     email = values.email
    //     //prefix = values.name

    //   this.props.dispatch(
    //     updateState({
    //       name,
    //       surname,
    //       phone,
    //       password,
    //       username: email,
    //       email
    //     })
    //   );
    // }

    let error_txt = "";

    // if (username.length < 4 || username.length > 20) {
    //   error_txt = error_txt + "\n- " + strings("id_0_19");
    // }
    // if (!nicknameTest.test(username)) {
    //   error_txt = error_txt + "\n- " + strings("id_0_19");
    // }
    if (name.length < 2 || name.length > 20)
      error_txt = error_txt + "\n- " + strings("id_0_20");
    if (surname.length < 2 || surname.length > 20)
      error_txt = error_txt + "\n- " + strings("id_0_21");
    // if (phone == "")
    //   error_txt = error_txt + "\n- " + strings("_425_do_not_leave_th + ";";
    if (password.length < 9 && !social_backend)
      error_txt = error_txt + "\n- " + strings("id_0_23");
    // if (prefix == undefined)
    //   error_txt = error_txt + "\n- " + strings("_427_don_t_forget_th + ";";

    let eni_flag_email = true;
    // eni_domain_list.forEach(e => {
    //   if (email.includes(e)) eni_flag_email = true;
    // });

    if (email == "" || !re.test(String(email).toLowerCase()) || !eni_flag_email)
      error_txt = error_txt + "\n- " + strings("id_0_22");

    if (
      name.length >= 2 &&
      name.length <= 21 &&
      surname.length >= 2 &&
      surname.length < 21 &&
      // phone.length &&
      (password.length > 8 || social_backend) &&
      // username.length > 3 &&
      // username.length < 21 &&
      email.length &&
      re.test(String(email).toLowerCase()) &&
      // nicknameTest.test(username) &&
      eni_flag_email
      // && prefix != undefined
    ) {
      this.setState({
        statusValidationEmail: true,
      });

      this.props.dispatch(
        checkFilterUniqueAccount(
          { email: email },
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

  handleShowPasswordTap = () => {
    const hide_password = !this.state.hide_password;
    let hide_password_icon = "ios-eye-off";

    if (hide_password) hide_password_icon = "ios-eye";

    this.setState({ hide_password, hide_password_icon });
  };

  handleCheckboxClick = (index) => {
    let checkboxes = this.state.checkboxes;
    checkboxes[index].checked = !checkboxes[index].checked;
    this.setState({ checkboxes });

    let found = checkboxes.find(function (element) {
      return element.checked == false;
    });

    // se found è uguale a undefined non ci sono elementi con
    // checked == false
    if (found == undefined) {
      this.setState({ buttonBgColor: "#ffffff" });
    } else {
      this.setState({ buttonBgColor: "#ffffff70" });
    }
  };

  checkboxes() {
    return this.state.checkboxes.map((item, index) => (
      <View style={styles.checkboxContainer} key={index}>
        <CheckBox
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
            height: 20,
          }}
          onClick={() => this.handleCheckboxClick(index)}
          isChecked={item.checked}
          rightText={item.rightText ? item.rightText : null}
          rightTextStyle={{
            color: "#fff",
            fontSize: 11,
            fontFamily: "OpenSans-Regular",
          }}
          // rightTextView={item.rightTextView ? item.rightTextView : null}
          checkBoxColor={"#fff"}
        />
        <Text
          style={{
            color: "#fff",
            fontSize: 10,
            fontFamily: "OpenSans-Regular",
          }}
        >
          {item.description}
        </Text>
      </View>
    ));
  }

  renderCheckboxes() {
    return (
      <View style={styles.checkboxesContainer}>
        <Text
          style={{
            color: "#fff",
            fontSize: 11,
            fontFamily: "OpenSans-Regular",
          }}
        >
          {strings("dear_muver__in_")}
        </Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 11,
            fontFamily: "OpenSans-Regular",
            fontWeight: "bold",
            alignSelf: "center",
            marginTop: 5,
          }}
        >
          {strings("i_declare_that_")}
        </Text>

        {this.checkboxes()}
      </View>
    );
  }

  renderModal() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modal_visible}
        onRequestClose={() => {
          // alert("Modal has been closed.");
        }}
      >
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0.0, 1.0]}
          colors={["#7d4d99", "#6497cc"]}
          style={{
            flex: 1,
            backgroundColor: "#F7F8F9",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {this.renderCheckboxes()}
          <GoOnButton
            topPosition={{ top: Dimensions.get("window").height * 0.85 }}
            handleNextTap={() => {
              this.setState({ modal_visible: false });
              setTimeout(() => {
                this.props.dispatch(
                  updateState({
                    customisation_gdpr: this.state.checkboxes[0].checked,
                    sponsorships_gdpr: this.state.checkboxes[1].checked,
                    commercialisation_gdpr: this.state.checkboxes[2].checked,
                    mailinglist_gdpr: this.state.checkboxes[3].checked,
                  })
                );
                // this.validation();
                // this.props.navigation.navigate("SurveySelectTeam");
                this.props.navigation.navigate("GDPRScreen");
              }, 600);
            }}
          />
        </LinearGradient>
        {/* </TouchableWithoutFeedback> */}
      </Modal>
    );
  }

  input = null;

  render() {
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
            style={styles.backgroundImage}
          >
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
                <Animated.View
                  style={{
                    transform: [{ translateY: this.keyboardHeight }],
                    flex: 1,
                    flexDirection: "column",
                    alignContent: "center",
                    justifyContent: "space-between",
                  }}
                >
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
                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        alignContent: "center",
                      }}
                    >
                     <Image 
               style={{
                height: Dimensions.get("window").height < 700 ? 80 : 130, // 200 x 300 , 1,5
                width: Dimensions.get("window").height < 700 ? 80 * 1.5 : 130 * 1.5,
                
               }}
               
               source={require("../../assets/images/onboardingImage/logo_muv_trademark.png")}
               ></Image>
                      {this.renderLogoText()}
                    </View>
                  </View>
                  <View
                        style={{
                          width: Dimensions.get("window").width,
                        height: 50,
                        }}
                      ></View>
                  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View
                      style={{
                        backgroundColor: "transparent",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                     
                      <RegisterFormWithNickname
                        handleNextTap={() => {}}
                        hidePasswordIcon={this.state.hide_password_icon}
                        handleShowPasswordTap={() =>
                          this.handleShowPasswordTap()
                        }
                        hidePassword={this.state.hide_password}
                        register={true}
                        canSlide={() => {}}
                        validation={this.validation}
                        ref={(ref) => (this.input = ref)}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  <View>
                  <View
                        style={{
                          width: Dimensions.get("window").width,
                        height: 50,
                        }}
                      ></View>
                    <TouchableOpacity
                      onPress={() => this.validation()}
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
                            textAlign: "center",
                          }}
                        >
                          {strings("id_0_15")}
                        </Text>
                      ) : (
                        <ActivityIndicator size="small" color="#ffffff" />
                      )}
                    </TouchableOpacity>
                  </View>
                </Animated.View>
                </TouchableWithoutFeedback>
              </ScrollView>
            </SafeAreaView>
          </ImageBackground>
        </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImageWave: {
    height: 90,
    width: Dimensions.get("window").width,
    position: "absolute",
    top: getStatusBarHeight(),
  },
  textHeaderContainer: {
    flexDirection: "row",
    width: Dimensions.get("window").width,
    height: 50,
  },
  backgroundImageWaveDown: {
    height: 80,
    width: Dimensions.get("window").width,
  },
  sfondo: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  icon: {
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "column",
    alignItems: "center",
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
    alignItems: "center",
  },
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  topOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    top: Platform.OS == "ios" ? 0 : -30,
  },
  bottomOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    top: Dimensions.get("window").height * 0.8,
  },
  textHeader: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3d3d3d",
    fontSize: 15,
    fontWeight: "bold",
  },
  textFooterContainer: {
    width: Dimensions.get("window").width * 0.6,
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center",
  },
  textFooter: {
    fontFamily: "OpenSans-Regular",
    color: "#fff",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "left",
  },
  buttonContainer: {
    width: Dimensions.get("window").width * 0.3,
    height: 60,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
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
    elevation: 1,
  },
  buttonGoOnText: {
    color: "#3363AD",
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
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
    marginTop: 5,
  },
  checkboxContainer: {
    width: Dimensions.get("window").width * 0.85,
    marginVertical: 5,
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
    value: -40,
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

const withData = connect((state) => {
  return {
    registerState: state.register,
  };
});

export default withData(UserDataWithNicknameScreen);
