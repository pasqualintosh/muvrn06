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
  Platform
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import OwnIcon from "../OwnIcon/OwnIcon";

import { strings } from "../../config/i18n";

// su android conviene fare ogni input un componente altrimenti qualche campo input salta

// componente per gestire i dati d'input di login dell'email
// props
// email
// ValidationEmail
// leftIcon, componente icona
// styleForm , modificare lo stile del form

// metodi da passare
// handleEmail

class InputEmail extends React.Component {
  render() {
    // tipo se c'e un errore nell'inserimento email fa cambiare il colore del testo esempio non implementato
    let coloreScritta = "red";

    if (this.props.ValidationEmail) {
      coloreScritta = "black";
    }
    return (
      <View
        style={
          this.props.styleForm
            ? [styles.login, this.props.styleForm]
            : [styles.login]
        }
      >
        <Input
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder={strings("email_address")}
          value={this.props.email}
          displayError={!this.props.ValidationEmail}
          errorStyle={{ color: "red" }}
          errorMessage="Email is invalid"
          onChangeText={text => this.props.handleEmail(text)}
          leftIcon={
            this.props.leftIcon ? (
              this.props.leftIcon
            ) : (
              <OwnIcon
              name="mail_icn" size={40}
                color="#E83475"
                // style={{ marginTop: Platform.OS == "android" ? -3 : 0 }}
              />
            )
          }
          autoCorrect={false}
          onFocus={this.props.onFocus ? this.props.onFocus : () => {}}
          inputStyle={{width: Dimensions.get("window").width / 1.2 - 80,
    height: Dimensions.get("window").height / 15}}
          containerStyle={
            this.props.styleForm
              ? [
                  styles.login,
                  { backgroundColor: "white" },
                  this.props.styleForm
                ]
              : [styles.login, { backgroundColor: "white" }]
          }
          returnKeyType={this.props.returnKeyType}
          onSubmitEditing={() => {
            this.props.onSubmitEditing();
          }}
          blurOnSubmit={this.props.blurOnSubmit}
        />
      </View>
    );
  }
}

const styles = {
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
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").height / 20,
    borderRadius: 5,
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
    borderRadius: 5,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5
    // elevation: 2
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
  }
};

export default InputEmail;
