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
  Alert
} from "react-native";

import LinearGradient from "react-native-linear-gradient";

class CheckEmail extends React.Component {
  constructor() {
    super();
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          Reset password
        </Text>
      )
    };
  };

  moveLogin = () => {
    this.props.navigation.navigate("Login");
  };

  render() {
    return (
      <View>
        <ImageBackground
          source={require("../../assets/images/purple_bg.png")}
          style={styles.sfondo}
        >
          <View style={styles.center}>
            <Image
              source={require("../../assets/images/check_email.png")}
              style={{
                width: 200,
                height: 300,
                marginLeft: 50,
                alignContent: "center"
              }}
              resizeMethod={"scale"}
              resizeMode={"contain"}
            />
            <View style={{ alignContent: "center", top: 30 }}>
              <Text style={styles.textResetPassword}>Check your email</Text>
              <Text style={styles.textResetPassword} />
              <Text style={styles.textResetPassword} />
            </View>

            <LinearGradient
              start={{ x: 0.0, y: 0.0 }}
              end={{ x: 1.0, y: 0.0 }}
              locations={[0, 1.0]}
              colors={["#e82f73", "#f49658"]}
              style={styles.button}
            >
              <TouchableHighlight
                onPress={this.moveLogin}
                style={styles.buttonTouch}
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
                  <Text style={{ color: "#FFFFFF" }}> Back to login</Text>
                </View>
              </TouchableHighlight>
            </LinearGradient>
          </View>
        </ImageBackground>
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
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "#FFFFFF",
    backgroundColor: "transparent"
  },
  image: {
    width: Dimensions.get("window").width / 2,
    height: Dimensions.get("window").height / 3
  },
  center: {
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "center",
    alignSelf: "center",
    top: 40,
    height: Dimensions.get("window").height / 2,
    width: Dimensions.get("window").width
  },
  button: {
    width: Dimensions.get("window").width * 0.3,
    height: Dimensions.get("window").height / 20,
    borderRadius: 5,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 2
  },
  buttonTouch: {
    width: Dimensions.get("window").width * 0.3,
    height: Dimensions.get("window").height / 20,
    borderRadius: 5,
    alignItems: "center"
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
    color: "#FFFFFF"
  }
};

export default CheckEmail;
