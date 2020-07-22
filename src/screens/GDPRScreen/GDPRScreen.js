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
  TouchableWithoutFeedback,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import CheckBox from "react-native-check-box";
import LinearGradient from "react-native-linear-gradient";
import InputEmail from "../../components/InputLogin/InputEmail";
import { Input } from "react-native-elements";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import InputPassword from "../../components/InputLogin/InputPassword";
import { connect } from "react-redux";

import Icon from "react-native-vector-icons/Ionicons";
import Emoji from "@ardentlabs/react-native-emoji";

import { strings } from "../../config/i18n";

class GDPRScreen extends React.Component {
  // Costruttore per creare lo stato che poi contiene email e password
  // showPassword per dire se mostrare la password
  constructor() {
    super();
  }

  //   static navigationOptions = ({ navigation }) => {
  //     return {
  //       headerTitle: (
  //         <Text
  //           style={{
  //             left: Platform.OS == "android" ? 20 : 0
  //           }}
  //         >
  //           {strings("id_13_24")}
  //         </Text>
  //       )
  //     };
  //   };

  static navigationOptions = {
    header: null
  };

  nextGDPR = () => {
    this.props.navigation.navigate("GdprDataScreen");
  };

  videoGDPR = () => {
    this.props.navigation.navigate("GDPRVideoScreen", {
      typeGDPR: "GDPRScreen"
    });
  };

  componentDidMount() {}

  render() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,

          backgroundColor: "#FFFFFF"
        }}
      >
        
         <ImageBackground
          source={require("./../../assets/images/profile_card_bg.png")}
          style={styles.backgroundImage}
        >
          <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingBottom: 100,
                  flexDirection: "column",
                  alignContent: "center",
                  justifyContent: "center",
            }}
          >
           
             
                <View
                  style={{
                    flexDirection: "row",
                    width: Dimensions.get("window").width,
                    
                    justifyContent: 'flex-start'
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.goBack(null);
                    }}
                  >
                    <View style={{ width: 30, height: 30 }}>
                      <Icon
                        name="md-arrow-forward"
                        size={18}
                        color="#31343F"
                        style={{ transform: [{ rotateZ: "180deg" }] }}
                      />
                    </View>
                  </TouchableOpacity>
                  <Text
                    style={{
                      // margin: 10,
                      color: "#31343F",
                      fontFamily: "OpenSans-Bold",
                      fontWeight: "700",
                      fontSize: 15,
                      marginLeft: 20,
                      textAlign: "left",
                    }}
                  >
                    {strings("id_0_105")}
                  </Text>
                </View>
              
          
        <View style={styles.half}>
          <View style={{ width: Dimensions.get("window").width * 0.9 }}>
            <Text style={styles.textFooter}>{strings("id_0_106")}</Text>
            <Text style={styles.textFooter} />
            <Text style={styles.textFooter}>{strings("id_0_107")}</Text>

            {/* 
            <Text>
              <Text style={styles.textFooter}>{strings("dear")}</Text>
              <Text style={styles.textFooterBold}>
                {` ` + strings("muver")}
              </Text>
              <Text style={styles.textFooter}>{`,`}</Text>
            </Text>
            <Text>
              <Text style={styles.textFooter}>
                {strings("in_compliance_w")}
              </Text>
              <Text style={styles.textFooterBold}>{`GDPR`}</Text>
              <Text style={styles.textFooter}>
                {strings("__regarding_the")}
              </Text>
            </Text> 
            */}
          </View>
          <View style={{ width: Dimensions.get("window").width * 0.9 }}>
            <Text style={styles.textFooter} />
          </View>
          {/* <View style={{ width: Dimensions.get("window").width * 0.9 }}>
            <Text style={styles.textFooter}>{strings("please_note_tha")}</Text>
          </View> */}
        </View>
        <View
          style={{
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",

            alignSelf: "center",
            alignItems: "center",
            // top: -2,
            height: 150
          }}
        >
          <OwnIcon
            name="onboarding-gdpr-lock"
            size={150}
            color="#000000"
            style={{ position: "relative", top: 75 }}
          />
          <OwnIcon
            name="onboarding-gdpr-yellow_stars"
            size={150}
            color="#FAB21E"
            style={{ position: "relative", top: -75 }}
          />
        </View>

        <View
          style={{
            height: 80,
            paddingTop: 20,
                backgroundColor: "transparent",
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignSelf: "center",
                alignItems: "center",
                width: Dimensions.get("window").width * 0.9,
                paddingBottom: 50,
          }}
        >
          <View style={[styles.button, { marginTop: 10 }]}>
            <TouchableHighlight
              onPress={this.nextGDPR}
              style={{
                width: 70,
                height: 41,
                borderRadius: 25,
                alignItems: "center",
                shadowRadius: 5
              }}
            >
            <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.0, y: 1.0 }}
        locations={[0, 1.0]}
        colors={["#62357C", "#6497CC"]}
        style={{
                width: 70,
                height: 41,
                borderRadius: 25,
                alignItems: "center",
                shadowRadius: 5
              }}
      >
              <View
                style={{
                  height: 41,
                  alignItems: "center",
                  justifyContent: "center",
                  alignContent: "center",
                  flexDirection: "row"
                }}
              >
                <Text style={{ color: "#FFFFFF" }}>{strings("id_0_118")}</Text>
              </View>
              </LinearGradient>
            </TouchableHighlight>
          </View>
        </View>
        </ScrollView>
        </SafeAreaView>
        </ImageBackground>
      </View>
    );
  }
}

// elevation: 2 per avere l'ombra su android con versione 5 in su

const styles = {
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  sfondo: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  half: {
    width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height - 430,
    alignItems: "center",
    justifyContent: "center",

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
    width: 70,
    height: 41,
    borderRadius: 25,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1,
    // backgroundColor: "#6CBA7E"
  },
  buttonVideo: {
    width: 70,
    height: 41,
    borderRadius: 25,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1,
    backgroundColor: "#F7F8F9"
  },
  textFooter: {
    fontFamily: "OpenSans-Regular",
    fontSize: 14
    // textAlign: "left"
  },
  textFooterBold: {
    fontFamily: "OpenSans-Regular",

    fontSize: 12,
    fontWeight: "bold"
    // textAlign: "left"
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
  },
  backgroundImageWave: {
    height: 100,
    width: Dimensions.get("window").width,
    position: "absolute"
    // top: Dimensions.get("window").height * 0.04 + 14
  },
  textHeaderContainer: {
    marginLeft: 20,
    flexDirection: "row",
    width: Dimensions.get("window").width * 0.85
  },
  textHeader: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3d3d3d",
    fontSize: 15,
    fontWeight: "bold"
  }
};

export default GDPRScreen;
