import React from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableHighlight,
  ImageBackground,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { strings } from "../../config/i18n";
import Icon from "react-native-vector-icons/Ionicons";

class CheckEmail extends React.Component {
  constructor() {
    super();
  }

  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     headerTitle: (
  //       <Text
  //         style={{
  //           left: Platform.OS == "android" ? 20 : 0
  //         }}
  //       >
  //         Reset password
  //       </Text>
  //     )
  //   };
  // };

  static navigationOptions = {
    header: null,
  };

  moveLogin = () => {
    this.props.navigation.navigate("Login");
  };

  render() {
    return (
      <View>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#7D4D99", "#6497CC"]}
          style={styles.sfondo}
        >
          <ImageBackground
            source={require("./../../assets/images/profile_card_bg_muver.png")}
            style={styles.sfondo}
          >
            <SafeAreaView
              style={{
                flex: 1,
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "center",
                alignItems: 'center'
              }}
            >
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingBottom: 100,
                  flexDirection: "column",
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: 'center'
                }}
              >
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
                <Image
                  source={require("../../assets/images/check_email.png")}
                  style={{
                    width: 200,
                    height: 300,
                    marginLeft: 50,
                    alignContent: "center",
                  }}
                  resizeMethod={"scale"}
                  resizeMode={"contain"}
                />
                <View
                  style={{
                    alignContent: "center",
                    marginTop: 30,
                    justifyContent: "center",
                    flexDirection: "column",
                    width: Dimensions.get("window").width * 0.8,
                  }}
                >
                  <Text style={styles.textResetPassword}>
                    {strings("id_0_134")}
                  </Text>
                </View>
                <View
                  style={{
                    height: 30,
                    // marginTop: 30,
                  }}
                />
                <TouchableOpacity
                  onPress={this.moveLogin}
                  style={styles.buttonRegister}
                >
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
                    {strings("id_0_135")}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </SafeAreaView>
          </ImageBackground>
        </LinearGradient>
      </View>
    );
  }
}

// elevation: 2 per avere l'ombra su android con versione 5 in su

const styles = {
  title: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "center",
  },
  textHeaderContainer: {
    flexDirection: "row",
    width: Dimensions.get("window").width,
    height: 90
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
  sfondo: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "#FFFFFF",
    backgroundColor: "transparent",
  },
  image: {
    width: Dimensions.get("window").width / 2,
    height: Dimensions.get("window").height / 3,
  },
  center: {
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "center",
    alignSelf: "center",
    top: 40,
    height: Dimensions.get("window").height / 2,
    width: Dimensions.get("window").width,
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
    elevation: 2,
  },
  buttonTouch: {
    width: Dimensions.get("window").width * 0.3,
    height: Dimensions.get("window").height / 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonLoginSocial: {
    width: Dimensions.get("window").width / 2.3,
    height: Dimensions.get("window").height / 20,
    borderRadius: 3,
  },
  buttonLoginGoogle: {
    width: Dimensions.get("window").width / 2.3,
    height: Dimensions.get("window").height / 20,
    borderRadius: 5,
    shadowRadius: 5,
  },
  login: {
    width: Dimensions.get("window").width / 1.2,
    height: Dimensions.get("window").height / 15,
    alignItems: "center",

    borderColor: "#f7f8f9",
    borderWidth: 1,
  },
  buttonPrecedente: {
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").height / 20,
    alignItems: "center",
    margin: 10,
  },
  icon: {
    margin: 10,
    width: Dimensions.get("window").width / 13,
    height: Dimensions.get("window").height / 40,
  },
  containerFBLogin: {},
  textResetPassword: {
    alignContent: "center",
    marginBottom: 9,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    textAlign: "center",
    fontSize: 12,
    color: "#FFFFFF",
  },
};

export default CheckEmail;
