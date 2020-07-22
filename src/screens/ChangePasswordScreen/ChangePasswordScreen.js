import React from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableHighlight,
  ImageBackground,
  Platform,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback
} from "react-native";
import CheckBox from "react-native-check-box";
import LinearGradient from "react-native-linear-gradient";
import InputEmail from "../../components/InputLogin/InputEmail";
import { Input } from "react-native-elements";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import InputPassword from "../../components/InputLogin/InputPassword";
import { connect } from "react-redux";
import {
  changePasswordNew,
  deleteProfile
} from "./../../domains/login/ActionCreators";
import { START_LOGIN } from "../../domains/login/ActionTypes";

import { strings } from "../../config/i18n";

class ChangePasswordScreen extends React.Component {
  // Costruttore per creare lo stato che poi contiene email e password
  // showPassword per dire se mostrare la password
  constructor() {
    super();
    this.state = {
      oldPassword: "",
      newPassword: "",
      newPasswordCheck: "",
      validationPassword: false,
      showPassword: false,
      checkboxes: [
        {
          checked: true,
          rightText: "Customized content",
          rightTextView: null
        },
        {
          checked: true,
          rightText: "Sponsorships",
          rightTextView: null
        },
        {
          checked: true,
          rightText: "Mailing list",
          rightTextView: null
        },
        {
          checked: true,
          rightText: "",
          rightTextView: this.renderUnderlinedCheckboxText()
        }
      ]
    };

    this.focusNextField = this.focusNextField.bind(this);
    // to store our input refs
    this.inputs = {};
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("id_13_24")}
        </Text>
      )
    };
  };

  componentDidMount() {}

  // gestire il valore del campo email
  // riceve il testo del campo email, text
  handleEmail = text => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    this.setState({
      email: text,
      validationPassword: re.test(String(text).toLowerCase())
    });
  };

  showAlert = msg => {
    Alert.alert(strings("id_0_10"), msg);
  };
  handleResetPassword = () => {
    const { oldPassword, newPassword, newPasswordCheck } = this.state;

    if (newPassword !== newPasswordCheck) {
      this.showAlert(strings("id_13_57"));
    } else {
      const ExpRegPassword = /^([a-zA-Z0-9_.,\-+*!#@?]{6,25})$/;
      const validOld = ExpRegPassword.test(String(oldPassword).toLowerCase());
      if (validOld) {
        const validNew = ExpRegPassword.test(String(newPassword).toLowerCase());
        if (validNew) {
          // recupero password
          this.props.dispatch(
            changePasswordNew({
              oldPassword,
              newPassword,
              callback: this.props.navigation.goBack()
            })
          );
        } else {
          this.showAlert(strings("id_13_57"));
        }
      } else {
        this.showAlert(strings("id_13_58"));
      }
    }
  };

  // metodi per gestire il campo di input premento su invio sulla tastiera
  refInput = (input, NameInput) => {
    this.inputs[NameInput] = input;
  };

  focusNextField(key) {
    this.inputs[key].focus();
  }

  handleOldPassword = text => {
    this.setState({ oldPassword: text });
  };

  handleNewPassword = text => {
    this.setState({ newPassword: text });
  };

  handleNewPasswordCheck = text => {
    this.setState({ newPasswordCheck: text });
  };

  handlePassword = text => {
    const ExpRegPassword = /^([a-zA-Z0-9_.,\-+*!#@?]{6,25})$/;
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

  // cambiare se mostrare la password o no
  handleShowPassword = () => {
    this.setState(prevState => {
      return { showPassword: !prevState.showPassword };
    });
  };

  componentWillMount() {
    this.props.dispatch({
      type: START_LOGIN,
      payload: {
        status: ""
      }
    });
  }

  _handleCheckboxClick = index => {
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

  renderUnderlinedCheckboxText() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: 10
        }}
      >
        <Text
          style={{
            color: "#3d3d3d",
            fontSize: 12,
            fontFamily: "OpenSans-Regular"
          }}
        >
          I accept&nbsp;
        </Text>
        {/* <TouchableWithoutFeedback onPress={() => this.setModalVisible(true)}> */}
        <View>
          <Text
            style={{
              color: "#3d3d3d",
              textDecorationLine: "underline",
              fontSize: 12,
              fontFamily: "OpenSans-Regular"
            }}
          >
            terms and conditions
          </Text>
        </View>
        {/* </TouchableWithoutFeedback> */}
      </View>
    );
  }

  checkboxes() {
    return this.state.checkboxes.map((item, index) => (
      <View style={styles.checkboxContainer} key={index}>
        <CheckBox
          style={{
            flex: 1
          }}
          onClick={() => this._handleCheckboxClick(index)}
          isChecked={item.checked}
          rightText={item.rightText ? item.rightText : null}
          rightTextStyle={{
            color: "#3d3d3d",
            fontSize: 12,
            fontFamily: "OpenSans-Regular"
          }}
          rightTextView={item.rightTextView ? item.rightTextView : null}
          checkBoxColor={"#3d3d3d"}
        />
      </View>
    ));
  }
  renderCheckboxes() {
    return <View style={styles.checkboxesContainer}>{this.checkboxes()}</View>;
  }

  render() {
    const {
      email,

      validationPassword
    } = this.state;

    let IconTypePassword = "pass-show-icn";
    if (this.state.showPassword) {
      IconTypePassword = "pass-hide-icn";
    }

    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,

          backgroundColor: "#FFFFFF"
        }}
      >
        <View style={styles.half}>
          <View
            style={
              {
                // justifyContent: "center",
                // alignItems: "center"
                // marginTop: 20
              }
            }
          >
            <InputPassword
              name={"oldPassword"}
              returnKeyType={"done"}
              placeholder={strings("id_13_30")}
              password={this.state.oldPassword}
              ValidationPassword={true}
              showPassword={this.state.showPassword}
              handlePassword={this.handleOldPassword}
              handleShowPassword={this.handleShowPassword}
              IconTypePassword={IconTypePassword}
              onSubmitEditing={() => {
                this.focusNextField("newPassword");
              }}
              refInput={this.refInput}
              styleForm={{
                borderRadius: 8,
                backgroundColor: "#F7F8F9",
                shadowRadius: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                elevation: 1
              }}
            />
          </View>
          <View
            style={{
              borderRadius: 8,
              shadowRadius: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              elevation: 1,
              borderColor: "#E8E8E8"
            }}
          >
            <InputPassword
              name={"newPassword"}
              returnKeyType={"next"}
              placeholder={strings("id_13_31")}
              password={this.state.newPassword}
              ValidationPassword={true}
              showPassword={this.state.showPassword}
              handlePassword={this.handleNewPassword}
              handleShowPassword={this.handleShowPassword}
              IconTypePassword={IconTypePassword}
              onSubmitEditing={() => {
                this.focusNextField("newPasswordCheck");
              }}
              refInput={this.refInput}
              styleForm={{
                borderTopLeftRadius: 7,
                borderTopRightRadius: 7,
                backgroundColor: "#F7F8F9",
                borderBottomColor: "#E8E8E8",
                elevation: 1
              }}
            />
            <InputPassword
              name={"newPasswordCheck"}
              returnKeyType={"done"}
              placeholder={strings("id_13_32")}
              password={this.state.newPasswordCheck}
              ValidationPassword={true}
              showPassword={this.state.showPassword}
              handlePassword={this.handleNewPasswordCheck}
              handleShowPassword={this.handleShowPassword}
              IconTypePassword={IconTypePassword}
              onSubmitEditing={this.handleResetPassword}
              refInput={this.refInput}
              styleForm={{
                borderBottomLeftRadius: 7,
                borderBottomRightRadius: 7,
                backgroundColor: "#F7F8F9",
                elevation: 1
              }}
            />
          </View>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.0, y: 0.0 }}
            locations={[0, 1.0]}
            colors={["#e82f73", "#f49658"]}
            style={[styles.button, { marginTop: 10 }]}
          >
            <TouchableHighlight
              onPress={this.handleResetPassword}
              disabled={this.props.status === "Reset Password" ? true : false}
              style={{
                width: Dimensions.get("window").width / 3,
                height: Dimensions.get("window").height / 20,
                borderRadius: 5,
                alignItems: "center",
                shadowRadius: 5
              }}
            >
              <View
                style={{
                  height: Dimensions.get("window").height / 20,
                  alignItems: "center",
                  justifyContent: "center",
                  alignContent: "center",
                  flexDirection: "row"
                }}
              >
                {this.props.status !== "Reset Password" ? (
                  <Text style={{ color: "#FFFFFF" }}>
                    {strings("id_13_23")}
                  </Text>
                ) : (
                  <ActivityIndicator size="small" color="white" />
                )}
              </View>
            </TouchableHighlight>
          </LinearGradient>

          {/* campi per il GDPR */}
          {/* {this.renderCheckboxes()} */}
        </View>
      </View>
    );
  }
}

// elevation: 2 per avere l'ombra su android con versione 5 in su

const styles = {
  sfondo: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  half: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2,
    alignItems: "center",
    justifyContent: "space-around",

    flexDirection: "column",
    marginTop: 20
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
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
    // height: Dimensions.get("window").height / 2,
    // width: Dimensions.get("window").width
  },
  button: {
    width: Dimensions.get("window").width / 3,
    height: Dimensions.get("window").height / 20,
    borderRadius: 5,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1
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
  containerFBLogin: {},
  textResetPassword: {
    alignContent: "center",
    marginBottom: 9,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    textAlign: "center",
    fontSize: 12,
    color: "#3D3D3D"
  },
  checkboxesContainer: {
    width: Dimensions.get("window").width,
    height: 200,
    // backgroundColor: "transparent",
    // position: "absolute",
    // top: Dimensions.get("window").height * 0.75,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
    // backgroundColor: "#3e3"
  },
  checkboxContainer: {
    width: Dimensions.get("window").width * 0.7,
    height: 28,
    marginVertical: 5
  }
};

const ConnectLogin = connect(state => {
  return {
    status: state.login.status ? state.login.status : false
  };
});

export default ConnectLogin(ChangePasswordScreen);
