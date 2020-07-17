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

// componente per gestire i dati d'input di login della password
// props
// password
// ValidationPassword
// showPassword
// password-icn, icona da usare

// metodi da passare
// handlePassword
// handleShowPassword

// styleForm , modificare lo stile del form

class InputPassword extends React.Component {
  render() {
    return (
      <View
        style={this.props.styleForm ? [this.props.styleForm] : styles.login}
      >
        <Input
          autoCapitalize="none"
          placeholder={
            this.props.placeholder ? this.props.placeholder : strings("password__9_cha")
          }
          // placeholder={strings("password__9_cha")}
          value={this.props.password}
          displayError={!this.props.ValidationPassword}
          errorStyle={{ color: "red" }}
          errorMessage="Password is invalid"
          onChangeText={text => this.props.handlePassword(text)}
          leftIcon={
            <OwnIcon
              name="password_icn"
              size={40}
              color="#E83475"
              // style={{ marginTop: Platform.OS == "android" ? -6 : -3 }}
            />
          }
          rightIcon={
            <OwnIcon
              name={this.props.IconTypePassword}
              click={this.props.handleShowPassword}
              size={20}
              color="#9D9B9C"
              style={{ marginTop: Platform.OS == "android" ? -3 : 0 }}
            />
          }
          autoCorrect={false}
          secureTextEntry={!this.props.showPassword}
          containerStyle={
            this.props.styleForm
              ? [
                styles.login,
                { backgroundColor: "white" },
                this.props.styleForm
              ]
              : [styles.login, { backgroundColor: "white" }]
          }
          inputStyle={{ width: Dimensions.get("window").width / 1.2 - 105,
    height: Dimensions.get("window").height / 15 }}
          returnKeyType={this.props.returnKeyType}
          onSubmitEditing={this.props.onSubmitEditing}
          blurOnSubmit={this.props.blurOnSubmit}
          ref={input =>
            this.props.refInput(
              input,
              this.props.name ? this.props.name : "Password"
            )
          }
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
    shadowOpacity: 0.5,
    elevation: 2
  },
  login: {
    width: Dimensions.get("window").width / 1.2,
    height: Dimensions.get("window").height / 15,
    alignItems: "center"

    // borderColor: "#f7f8f9",
    // borderWidth: 1
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

export default InputPassword;
