import React from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  Alert,
  Modal,
  Picker as PickerIos,
  Image,
  KeyboardAvoidingView
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import CheckBox from "react-native-check-box";
import { styles } from "./Style";
import FacebookLoginButton from "./../FacebookLoginButton/FacebookLoginButton";
import { Input } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import OwnIcon from "../OwnIcon/OwnIcon";
// import { FBLoginManager } from "react-native-facebook-login";
import {
  updateState,
  checkEmail
} from "./../../domains/register/ActionCreators";
import GoOnButton from "../GoOnButton/GoOnButton";
import { prefixes, prefixesList } from "./../../assets/ListPrefixes";
import ModalDropdown from "react-native-modal-dropdown";
import { connect } from "react-redux";
import ModalNative from "react-native-modal";
import PickerAndroid from "./../PickerAndroid/PickerAndroid";
import { countries } from "./../../assets/countries";
import Emoji from "@ardentlabs/react-native-emoji";

let Picker = PickerAndroid;
let PickerItem = PickerAndroid.Item;

import { strings } from "../../config/i18n";

// let FBLogin;
// if (Platform.OS === "ios")
//   FBLogin = require("./../../components/FBLogin/FBLogin").FBLogin;
// else FBLogin = require("react-native-facebook-login").FBLogin;

const p = prefixes();

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validationEmail: false,
      validationPassword: true,
      checkEmail: false,
      username: "",
      name: "",
      surname: "",
      email: "",
      phone: "",
      password: "",
      social_backend: null, // so se sto facendo una registrazione social o no cosi so se devo togliere il campo password
      showPassword: false,
      loggedInFromFb: false,
      showTips: false,
      prefixIndex: 0,
      prefix: "-",
      modalVisible: false,
      prefixSelected: false,
      modal_native_visible: false,
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
      ]
    };
    this.focusNextField = this.focusNextField.bind(this);
    // to store our input refs
    this.inputs = {};
    this.scrollView = null;
  }

  // metodi per gestire il campo di input premento su invio sulla tastiera
  refInput = (input, NameInput) => {
    this.inputs[NameInput] = input;
  };

  setModalVisible(visible) {
    // controllo l'email se vado avanti
    if (visible) {
      if (this.state.validationEmail) {
        this.setState({ modalVisible: true });
      } else {
        this.validateEmail();
      }
    } else {
      this.setState({ modalVisible: visible });
    }
  }

  validateEmail = () => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // return re.test(String(email).toLowerCase());
    // console.log(re.test(String(email).toLowerCase()));

    const { name, surname, phone, password, email } = this.state;
    if (
      name.length &&
      surname.length &&
      phone.length &&
      password.length > 8 &&
      email.length &&
      re.test(String(email).toLowerCase())
    ) {
      this.setState({
        checkEmail: true
      });

      this.props.dispatch(checkEmail(email, this.setValidationEmail));
      // controllo l'email se valida setto lo status a true cosi finisce il caricamento e poi vado avanti
    } else {
      this.setState({ showTips: true });
    }
  };

  setValidationEmail = status => {
    this.setState({ validationEmail: status, checkEmail: false });
    // se lo email è valida allora, faccio apparire la modal
    if (status) {
      this.setState({ modalVisible: true });
    } else {
      Alert.alert("Oops", strings("the_email_you_t"));
    }
  };

  focusNextField(key) {
    this.inputs[key].focus();
  }

  sortFunction = (a, b) => {
    if (Number(a) < Number(b)) {
      return -1;
    }
    if (Number(a) > Number(b)) {
      return 1;
    }
    return 0;
  };

  componentWillMount() {
    console.log(this.props.registerState);
    // se ho preso i dati dai social li metto nei rispettivi campi
    if (this.props.registerState.social_backend) {
      this.setState({
        username: this.props.registerState.username,
        name: this.props.registerState.name,
        surname: this.props.registerState.surname,
        email: this.props.registerState.email,
        social_backend: this.props.registerState.social_backend
      });
    }
  }

  componentDidMount() {
    // this.setupGoogleSignin();

    if (this.props.registerState.prefix != null) {
      this.setState({
        prefix: this.props.registerState.prefix,
        prefixIndex: this.props.registerState.prefixIndex
      });
    }
  }

  randomPassword = length => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
    let pass = "";
    for (let x = 0; x < length; x++) {
      let i = Math.floor(Math.random() * chars.length);
      pass += chars.charAt(i);
    }
    return pass;
  };

  hanldeGoOnTap = () => {
    const {
      name,
      surname,
      phone,
      password,
      email: username,
      email,
      prefixSelected
    } = this.state;

    console.log(phone);

    if (
      password.length > 8 &&
      // phone != "" &&
      this.state.validationEmail == true
      // && prefixSelected == true
    ) {
      if (this.props.registerState.email_is_present) {
        Alert.alert("Oops", strings("the_email_you_t"));
      } else {
        this.props.dispatch(
          updateState({
            name,
            surname,
            phone,
            password,
            username,
            email
            // customisation_gdpr: this.state.checkboxes[0].checked,
            // sponsorships_gdpr: this.state.checkboxes[1].checked,
            // commercialisation_gdpr: this.state.checkboxes[2].checked,
            // mailinglist_gdpr: this.state.checkboxes[3].checked
          })
        );
        this.props.handleNextTap();
      }
    } else {
      this.setState({ showTips: true });
      Alert.alert("Oops", strings("seems_like_you_"));
    }
  };
  handleSetVisibleModal = () => {
    const {
      name,
      surname,
      phone,
      password,
      email: username,
      email
    } = this.state;

    if (
      password.length > 8 &&
      phone != "" &&
      this.state.validationEmail == true
    ) {
      if (this.props.registerState.email_is_present) {
        Alert.alert("Oops", strings("the_email_you_t"));
      } else {
        this.props.dispatch(
          updateState({ name, surname, phone, password, username, email })
        );
        // this.props.handleNextTap();
        this.setModalVisible(true);
      }
    } else {
      this.setState({ showTips: true });
      Alert.alert("Oops", strings("seems_like_you_"));
    }
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
  /**
   * lettura del token e chiamata alle api di facebook per
   * leggere il profilo utente
   */
  handleFacebookLogin = data => {
    if (this.props.register == true) {
      var api = `https://graph.facebook.com/v2.3/me?fields=id,email,first_name,last_name&redirect=false&access_token=${data.token}`;
      fetch(api)
        .then(response => response.json())
        .then(responseData => {
          console.log(responseData);
          const { first_name: name, last_name: surname, email } = responseData;
          this.props.dispatch(
            updateState({
              name,
              surname,
              email,
              password: name + "." + surname,
              phone: "0"
            })
          );
          FBLoginManager.logout((err, data) => {
            console.log(err);
          });
        })
        .done(data => {
          this.props.canSlide();
          this.props.handleNextTap();
        });
    }
  };
  /**
   * attualmente cambia solo il testo del pulsante
   */
  handleFacebookLogout = () => {
    this.setState({ loggedInFromFb: false });
  };

  renderButtonsModal() {
    return (
      <View style={styles.nativeButtonsContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ modal_native_visible: false });
          }}
        >
          <View style={styles.nativeButtonContainer}>
            <Text style={styles.textButton}>
              {strings("id_0_68").toLocaleUpperCase()}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ modal_native_visible: false }, () => {});
          }}
        >
          <View style={styles.nativeButtonContainer}>
            <Text style={styles.textButton}>
              {strings("id_0_12").toLocaleUpperCase()}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderNativeModal() {
    const values = p
      .sort((a, b) => this.sortFunction(a, b))
      .map((element, index) => (
        <PickerItem
          key={index}
          label={"" + element.replace(/_/g, " ")}
          value={"" + element}
          emoji={`flag-${countries
            .find(el => {
              return (
                el.name ==
                prefixesList.find(e => {
                  return e.code == element;
                }).name
              );
            })
            .code.toLocaleLowerCase()}`}
        />
      ));
    return (
      <ModalNative
        isVisible={this.state.modal_native_visible}
        onBackdropPress={() => this.setState({ modal_native_visible: false })}
        onBackButtonPress={() => this.setState({ modal_native_visible: false })}
      >
        <View
          style={{
            height: 400,
            backgroundColor: "white",
            borderRadius: 4,
            borderColor: "rgba(0, 0, 0, 0.1)",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Picker
            style={{
              width: 250,
              height: 250
            }}
            selectedValue={this.state.prefix}
            onValueChange={(itemValue, itemIndex) => {
              this.props.dispatch(
                updateState({
                  prefix: itemValue,
                  phone: itemValue + this.state.phone
                })
              );
              this.setState({
                prefixIndex: itemIndex,
                prefixSelected: true,
                prefix: itemValue
                // modal_native_visible: false
                // phone: this.state.prefix + this.state.phone
              });
            }}
          >
            {values}
          </Picker>
          {this.renderButtonsModal()}
        </View>
      </ModalNative>
    );
  }

  // handleGoogleLogin = () => {
  //   if (this.props.register == true) {
  //     GoogleSignin.signIn()
  //       .then(user => {
  //         console.log(user);
  //         const { familyName: surname, givenName: name, email } = user;
  //         this.props.dispatch(
  //           updateState({
  //             name,
  //             surname,
  //             email,
  //             password: name + "." + surname,
  //             phone: "0"
  //           })
  //         );
  //         this.handleGoogleLogout();
  //       })
  //       .catch(err => {
  //         console.log("WRONG SIGNIN", err);
  //       })
  //       .done(() => {
  //         this.props.canSlide();
  //         this.props.handleNextTap();
  //       });
  //   }
  // };
  // handleGoogleLogout = () => {
  //   GoogleSignin.revokeAccess()
  //     .then(() => GoogleSignin.signOut())
  //     .then(() => {
  //       // this.setState({ user: null });
  //     })
  //     .done();
  // };
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
        <View
          style={{
            width: Dimensions.get("window").width * 0.95,
            height: 150,
            marginTop: 0
          }}
        >
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
            I declare that I want to:
          </Text>
        </View>

        {this.checkboxes()}
      </View>
    );
  }
  renderTips() {
    if (this.state.showTips)
      return <Text style={styles.tips}>{strings("remember__fill_")}</Text>;
  }
  renderModal() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          // alert("Modal has been closed.");
        }}
      >
        {/* <TouchableWithoutFeedback
          onPress={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}
        > */}
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0.0, 1.0]}
          colors={["#7d4d99", "#6497cc"]}
          style={styles.modalContainer}
        >
          {this.renderCheckboxes()}
          <GoOnButton
            topPosition={{ top: Dimensions.get("window").height * 0.85 }}
            handleNextTap={() => {
              this.setModalVisible(false);
              setTimeout(
                () => {
                  this.hanldeGoOnTap();
                },
                Platform.OS === "android" ? 600 : 200
              );
            }}
          />
        </LinearGradient>
        {/* </TouchableWithoutFeedback> */}
      </Modal>
    );
  }

  getState = () => {
    return this.state;
  };

  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: 4,
          width: Dimensions.get("window").width / 1.2,
          height: Dimensions.get("window").height * 0.4,
          alignSelf: "center"
        }}
        ref={c => {
          this.scrollView = c;
        }}
      >
        {this.renderModal()}
        {this.renderNativeModal()}
        <Input
          value={this.state.username}
          placeholder={"username" + "*"}
          leftIcon={<OwnIcon name="name_icn" size={40} color="#E82F73" />}
          containerStyle={styles.input}
          onChangeText={text => {
            this.setState({ username: text });
          }}
          blurOnSubmit={false}
          onSubmitEditing={text => {
            this.focusNextField("Name");
          }}
          onEndEditing={text => {
            this.props.dispatch(updateState({ username: this.state.username }));
          }}
          returnKeyType={"next"}
        />
        <Input
          value={this.state.name}
          placeholder={strings("name") + "*"}
          leftIcon={<OwnIcon name="name_icn" size={40} color="#E82F73" />}
          containerStyle={styles.input}
          onChangeText={text => {
            this.setState({ name: text });
          }}
          blurOnSubmit={false}
          onSubmitEditing={text => {
            this.focusNextField("Surname");
          }}
          onEndEditing={text => {
            this.props.dispatch(updateState({ name: this.state.name }));
          }}
          ref={input => this.refInput(input, "Name")}
          returnKeyType={"next"}
        />
        <Input
          value={this.state.surname}
          placeholder={strings("surname") + "*"}
          leftIcon={<OwnIcon name="name_icn" size={40} color="#E82F73" />}
          containerStyle={styles.input}
          onChangeText={text => {
            this.setState({ surname: text });
          }}
          blurOnSubmit={false}
          onSubmitEditing={text => {
            this.focusNextField("Email");
          }}
          onEndEditing={text => {
            this.props.dispatch(updateState({ surname: this.state.surname }));
          }}
          ref={input => this.refInput(input, "Surname")}
          returnKeyType={"next"}
        />
        <Input
          value={this.state.email}
          autoCapitalize="none"
          placeholder={strings("email") + "*"}
          leftIcon={<OwnIcon name="mail_icn" size={40} color="#E82F73" />}
          containerStyle={styles.input}
          onChangeText={text => {
            // setto l'email e se l'ho cambia forse non è piu valida
            this.setState({
              email: text.toLocaleLowerCase(),
              validationEmail: false
            });
            this.props.dispatch(
              updateState({ email: text.toLocaleLowerCase() })
            );
          }}
          blurOnSubmit={false}
          onSubmitEditing={text => {
            this.focusNextField("Password");
          }}
          onEndEditing={text => {
            this.props.dispatch(updateState({ email: this.state.email }));
          }}
          keyboardType="email-address"
          ref={input => this.refInput(input, "Email")}
          returnKeyType={"next"}
        />

        {/* <Input
          placeholder={strings("phone_number")}
          leftIcon={
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({ modal_native_visible: true });
                }}
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    borderRightWidth: 1,
                    borderColor: "#3d3d3d60",
                    width: 105
                  }}
                >
                  <OwnIcon name="phone_icn" size={40} color="#E82F73" />
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontWeight: "400",
                      color: "#3d3d3d",
                      fontSize: 12
                    }}
                  >
                    {this.state.prefix}
                    &nbsp;&nbsp;&nbsp;
                    {this.state.prefix != "-" ? (
                      <Emoji
                        name={`flag-${countries
                          .find(el => {
                            return (
                              el.name ==
                              prefixesList.find(e => {
                                return e.code == this.state.prefix;
                              }).name
                            );
                          })
                          .code.toLocaleLowerCase()}`}
                      />
                    ) : (
                      ""
                    )}
                    &nbsp;&nbsp;&nbsp;
                  </Text>
                  <Icon
                    name="md-arrow-forward"
                    size={12}
                    color="#3d3d3d"
                  />
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontWeight: "400",
                      color: "#3d3d3d",
                      fontSize: 12
                    }}
                  >
                    &nbsp;&nbsp;&nbsp;
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          }
          containerStyle={styles.input}
          onChangeText={text => {
            // let numberWithPrefix = `${p[this.state.prefixIndex]} ${text}`;
            // console.log(numberWithPrefix);
            this.setState({ phone: text });
          }}
          onSubmitEditing={text => {
            this.focusNextField("Password");
          }}
          onEndEditing={text => {
            let numberWithPrefix = `${p[this.state.prefixIndex]} ${text}`;
            this.props.dispatch(
              updateState({ phone: this.state.prefix + this.state.phone })
            );
          }}
          keyboardType="phone-pad"
          ref={input => this.refInput(input, "Phone number")}
          returnKeyType={"next"}
        /> */}
        {this.state.social_backend ? (
          <View />
        ) : (
          <Input
            autoCapitalize="none"
            placeholder={strings("password__9_cha") + "*"}
            leftIcon={<OwnIcon name="password_icn" size={40} color="#E82F73" />}
            containerStyle={styles.input}
            onFocus={() => {
              this.scrollView.scrollTo({
                y: 80,
                animated: true
              });
            }}
            // inputStyle={{ marginRight: -48 }}
            rightIcon={
              <TouchableWithoutFeedback
                onPress={this.props.handleShowPasswordTap}
              >
                <View style={{ right: 60 }}>
                  <Icon
                    name={this.props.hidePasswordIcon}
                    size={18}
                    color="#60368C"
                  />
                </View>
              </TouchableWithoutFeedback>
            }
            secureTextEntry={this.props.hidePassword}
            onChangeText={text => {
              this.setState({ password: text });
              this.props.dispatch(updateState({ password: text }));
            }}
            blurOnSubmit={true}
            onEndEditing={text => {
              this.scrollView.scrollTo({
                y: 0,
                animated: true
              });
              this.props.dispatch(
                updateState({ password: this.state.password })
              );
            }}
            ref={input => this.refInput(input, "Password")}
            returnKeyType={"done"}
          />
        )}
        {/* 
        <View style={{ marginTop: 15 }}>
          <Text
            style={{
              fontFamily: "OpenSans-Regular",
              fontWeight: "400",
              color: "#3d3d3d",
              fontSize: 13
            }}
          >
            Or
          </Text>
        </View> 
        */}
        {/* 
        <View style={styles.buttonsContainer}>
          <FBLogin
            containerStyle={styles.containerFBLogin}
            style={
              {
                // marginHorizontal: 8,
                // alignSelf: "center",
                // marginTop: 0,
                // borderRadius: 5
              }
            }
            onClickColor={"transparent"}
            buttonView={
              <FacebookLoginButton
                text={
                  this.state.loggedInFromFb ? "LOG OUT" : "LOGIN WITH FACEBOOK"
                }
                onPress={this.handleLogin}
              />
            }
            loginBehavior={FBLoginManager.LoginBehaviors.Native}
            permissions={["email"]}
            onLogin={data => {
              this.handleFacebookLogin(data);
            }}
            onLogout={this.handleFacebookLogout}
            onLoginFound={data => {
              console.log("Existing login found.");
              console.log(data);
            }}
            onLoginNotFound={() => {
              console.log("No user logged in.");
            }}
            onError={data => {
              console.log("ERROR");
              console.log(data);
            }}
            onCancel={() => {
              console.log("User cancelled.");
            }}
            onPermissionsMissing={data => {
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
                // marginHorizontal: 8
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
        {this.renderTips()}
        {/* <GoOnButton
          handleNextTap={() => {
            this.setModalVisible(true);
            // this.hanldeGoOnTap();
          }}
          status={this.state.checkEmail ? "In register" : ""}
        /> */}
      </ScrollView>
    );
  }
}

const withRegister = connect(state => {
  return {
    registerState: state.register
  };
});

export default withRegister(RegisterForm);

// export default RegisterForm;
