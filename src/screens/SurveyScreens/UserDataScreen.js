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
  Alert,
  Modal,
  ActivityIndicator,
  Keyboard
} from "react-native";
import WavyArea from "./../../components/WavyArea/WavyArea";
import LinearGradient from "react-native-linear-gradient";
import { BoxShadow } from "react-native-shadow";
import { connect } from "react-redux";
import {
  updateState,
  checkEmail
} from "./../../domains/register/ActionCreators";
import RegisterForm from "./../../components/RegisterForm/RegisterForm";
import GoOnButton from "./../../components/GoOnButton/GoOnButton";
import CheckBox from "react-native-check-box";
import Emoji from "@ardentlabs/react-native-emoji";
import Icon from "react-native-vector-icons/Ionicons";

import { strings } from "../../config/i18n";

class UserDataScreen extends React.Component {
  constructor(props) {
    super(props);
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
          description: strings("receive_persona")
        },
        {
          checked: false,
          rightText: strings("sponsorship_off"),
          rightTextView: null,
          description: strings("receive_sponsor")
        },
        {
          checked: false,
          rightText: strings("commercially_us"),
          rightTextView: null,
          description: strings("allow_data_prod")
        },
        {
          checked: false,
          rightText: strings("mailing_list"),
          rightTextView: null,
          description: strings("be_added_to_the")
        }
      ],
      statusValidationEmail: false
    };
  }

  static navigationOptions = {
    header: null
  };

  goOn = status => {
    this.setState({
      statusValidationEmail: false
    });
    if (!status) Alert.alert(strings("id_0_10"), strings("the_email_you_t"));
    // else this.props.navigation.navigate("GDPRScreen");
    // else this.props.navigation.navigate("SurveySelectTeam");
    else this.props.navigation.navigate("GDPRScreen");
    // else this.setState({ modal_visible: true });
  };

  validation = () => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // return re.test(String(email).toLowerCase());
    // console.log(re.test(String(email).toLowerCase()));
    const {
      name,
      surname,
      social_backend,
      username,
      phone,
      password,
      email,
      prefix
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

    if (username == "") {
      error_txt = error_txt + "\n- " + "username non presente" + "; ";
    }
    if (name == "")
      error_txt = error_txt + "\n- " + strings("_423_do_not_leave_th") + "; ";
    if (surname == "")
      error_txt = error_txt + "\n- " + strings("_424_do_not_leave_th") + "; ";
    // if (phone == "")
    //   error_txt = error_txt + "\n- " + strings("_425_do_not_leave_th + ";";
    if (password.length < 9 && !social_backend)
      error_txt = error_txt + "\n- " + strings("_426_passwords_must_") + "; ";
    // if (prefix == undefined)
    //   error_txt = error_txt + "\n- " + strings("_427_don_t_forget_th + ";";
    if (email == "" || !re.test(String(email).toLowerCase()))
      error_txt = error_txt + "\n- " + strings("_428_enter_a_valid_e") + "; ";

    if (
      name.length &&
      surname.length &&
      // phone.length &&
      (password.length > 8 || social_backend) &&
      email.length &&
      re.test(String(email).toLowerCase())
      // && prefix != undefined
    ) {
      this.setState({
        statusValidationEmail: true
      });
      // this.props.dispatch(checkEmail(email, this.goOn));
      this.props.navigation.navigate("GDPRScreen");
    } else {
      this.setState({ show_tips: true });
      Alert.alert(
        strings("id_0_10"),
        strings("_429_please__fix_the") +
          ":" +
          error_txt +
          "\n" +
          strings("_430_then_you_can_go")
      );
    }
  };

  handleShowPasswordTap = () => {
    const hide_password = !this.state.hide_password;
    let hide_password_icon = "ios-eye-off";

    if (hide_password) hide_password_icon = "ios-eye";

    this.setState({ hide_password, hide_password_icon });
  };

  handleCheckboxClick = index => {
    let checkboxes = this.state.checkboxes;
    checkboxes[index].checked = !checkboxes[index].checked;
    this.setState({ checkboxes });

    let found = checkboxes.find(function(element) {
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
            height: 20
          }}
          onClick={() => this.handleCheckboxClick(index)}
          isChecked={item.checked}
          rightText={item.rightText ? item.rightText : null}
          rightTextStyle={{
            color: "#fff",
            fontSize: 11,
            fontFamily: "OpenSans-Regular"
          }}
          // rightTextView={item.rightTextView ? item.rightTextView : null}
          checkBoxColor={"#fff"}
        />
        <Text
          style={{
            color: "#fff",
            fontSize: 10,
            fontFamily: "OpenSans-Regular"
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
            fontFamily: "OpenSans-Regular"
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
            marginTop: 5
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
            alignItems: "center"
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
                    mailinglist_gdpr: this.state.checkboxes[3].checked
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
    let shadowOpt;

    if (Platform.OS == "ios") {
      shadowOpt = {
        width: Dimensions.get("window").width * 0.2,
        height: 40,
        color: "#111",
        border: 4,
        radius: 5,
        opacity: 0.25,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: 10
        }
      };
      if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
        shadowOpt = {
          width: Dimensions.get("window").width * 0.2,
          height: 28,
          color: "#111",
          border: 4,
          radius: 5,
          opacity: 0.25,
          x: 0,
          y: 1,
          style: {
            position: "absolute",
            top: 10
          }
        };
      }
    } else
      shadowOpt = {
        width: Dimensions.get("window").width * 0.2,
        height: 40,
        color: "#444",
        border: 6,
        radius: 5,
        opacity: 0.35,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: 10
        }
      };
    return (
      <ImageBackground
        source={require("./../../assets/images/purple_bg.png")}
        style={styles.backgroundImage}
        onPress={() => Keyboard.dismiss()}
      >
        {/* {this.renderModal()} */}
        <View
          style={{
            height: 100,
            backgroundColor: "transparent"
          }}
        >
          <ImageBackground
            source={require("../../assets/images/white_wave_onbording_top.png")}
            style={styles.backgroundImageWave}
          />
          <TouchableWithoutFeedback
            style={{
              height: 100,

              backgroundColor: "transparent",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center"
            }}
            onPress={() => Keyboard.dismiss()}
          >
            <View style={styles.textHeaderContainer}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.navigation.goBack(null);
                }}
              >
                <View style={{ width: 30, height: 30 }}>
                  <Icon
                    name="ios-arrow-back"
                    style={{ marginTop: Platform.OS == "ios" ? 4 : 2 }}
                    size={18}
                    color="#3d3d3d"
                  />
                </View>
              </TouchableWithoutFeedback>
              <Text style={styles.textHeader}>
                {strings("now_you_are_rea")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View
            style={{
              height: Dimensions.get("window").height - 230,
              backgroundColor: "transparent",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <RegisterForm
              handleNextTap={() => {}}
              hidePasswordIcon={this.state.hide_password_icon}
              handleShowPasswordTap={() => this.handleShowPasswordTap()}
              hidePassword={this.state.hide_password}
              register={true}
              canSlide={() => {}}
              ref={ref => (this.input = ref)}
            />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View
            style={{
              height: 130,
              backgroundColor: "transparent",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            {/* <WavyArea
            data={positiveData}
            color={"#fff"}
            style={styles.topOverlayWave}
          /> */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View style={styles.textFooterContainer}>
                <Text style={styles.textFooter}>
                  {strings("enter_your_info")} {strings("you_can_always_")}
                </Text>
              </View>

              <View style={[styles.buttonContainer]}>
                {/* <BoxShadow setting={shadowOpt} /> */}
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.validation();
                    // this.setState({ modal_visible: true });
                  }}
                >
                  <View style={[styles.buttonBox]}>
                    {!this.state.statusValidationEmail ? (
                      <Text style={styles.buttonGoOnText}>
                        {this.props.text ? this.props.text : strings("id_0_15")}
                      </Text>
                    ) : (
                      <ActivityIndicator size="small" color="#6497CC" />
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  backgroundImageWave: {
    height: 100,
    width: Dimensions.get("window").width,
    position: "absolute"
    // top: Dimensions.get("window").height * 0.04 + 14
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
  textHeaderContainer: {
    marginTop: Platform.OS == "ios" ? 30 : 15,
    marginLeft: 20,
    flexDirection: "row",
    width: Dimensions.get("window").width * 0.85
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
  }
});

export const positiveData = [
  {
    value: 60
  },
  {
    value: 40
  },
  {
    value: 50
  },
  {
    value: 40
  },
  {
    value: 50
  }
];

export const negativeData = [
  {
    value: -60
  },
  {
    value: -40
  },
  {
    value: -50
  },
  {
    value: -40
  },
  {
    value: -50
  }
];

const withData = connect(state => {
  return {
    registerState: state.register
  };
});

export default withData(UserDataScreen);
