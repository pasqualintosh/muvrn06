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
  ChangePassword,
  deleteProfile
} from "./../../domains/login/ActionCreators";
import { START_LOGIN } from "../../domains/login/ActionTypes";

import { strings } from "../../config/i18n";
import Icon from "react-native-vector-icons/Ionicons";
import Emoji from "@ardentlabs/react-native-emoji";
import { updateState } from "./../../domains/register/ActionCreators";

class SponsorshipScreen extends React.Component {
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
  //           {strings("change_password")}
  //         </Text>
  //       )
  //     };
  //   };

  static navigationOptions = {
    header: null
  };

  nextGDPR = (status = false) => {
    this.props.dispatch(
      updateState({
        sponsorships_gdpr: status
      })
    );
    // this.props.dispatch(
    // updateState({
    //     customisation_gdpr: this.state.checkboxes[0].checked,
    //     sponsorships_gdpr: this.state.checkboxes[1].checked,
    //     commercialisation_gdpr: this.state.checkboxes[2].checked,
    //     mailinglist_gdpr: this.state.checkboxes[3].checked
    //   })
    // );
    this.props.navigation.navigate("CustomizedContentScreen");
  };

  videoGDPR = () => {
    this.props.navigation.navigate("GDPRVideoScreen", { typeGDPR: 'SponsorshipScreen'});
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
          <View
            style={{
              height: 100,

              backgroundColor: "transparent",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center"
            }}
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
                {strings("informed_consen")}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.half}>
          <View
            style={{
              width: Dimensions.get("window").width * 0.9,
              justifyContent: "center",
              flexDirection: "column"
            }}
          >
            <View
              style={{
                width: Dimensions.get("window").width * 0.9,
                justifyContent: "center",
                flexDirection: "column",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={styles.textFooterBold}>
                {strings("_591_sponsorship_off")}
              </Text>
            </View>
            <View />
            <Text style={styles.textFooter}>
              {strings("_623_i_consent_to_re")}
            </Text>
          </View>
          <OwnIcon
            name="onboarding-gdpr-star"
            size={200}
            color="#000000"
            // style={{ position: "relative", top: 100 }}
          />
        </View>
        {/* <View
          style={{
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",

            alignSelf: "center",
            alignItems: "center",
            // top: -2,
            height: 200
          }}
        >
          
        </View> */}

        <View
          style={{
            height: 130,
            backgroundColor: "transparent",
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            width: Dimensions.get("window").width,
            position: "absolute",
            bottom: 0
          }}
        >
        <View
            
            style={[styles.button, { marginTop: 10 }]}
          >
            <TouchableHighlight
              onPress={this.videoGDPR}
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
              <OwnIcon
            name="video_btn_icn"
            size={30}
            color="#E83475"
           
          />
              </View>
            </TouchableHighlight>
          </View>
          <View
            style={{
              width: 20
            }}
          />
          <View
            
            style={[styles.button, { marginTop: 10 }]}
          >
            <TouchableHighlight
              onPress={() => this.nextGDPR(false)}
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
                <Text style={{ color: "#3D3D3D" }}>
                  {strings("no").toUpperCase()}
                </Text>
              </View>
            </TouchableHighlight>
          </View>

          <View
            style={{
              width: 20
            }}
          />
          <View
          
            style={[styles.button, { marginTop: 10,
              backgroundColor: '#6CBA7E' }]}
          >
            <TouchableHighlight
              onPress={() => this.nextGDPR(true)}
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
                <Text style={{ color: "#FFFFFF" }}>
                  {strings("yes").toUpperCase()}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
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
    height: Dimensions.get("window").height - 230,
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
    width: 70,
    height: 41,
    borderRadius: 25,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1,
    backgroundColor: '#F7F8F9' 
  },
  textFooter: {
    fontFamily: "OpenSans-Regular",

    fontSize: 12

    // textAlign: "left"
  },
  textFooterBold: {
    fontFamily: "OpenSans-ExtraBold",

    fontSize: 16,
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

const GDPR = connect();

export default GDPR(SponsorshipScreen);
