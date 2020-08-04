import React from "react";
import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  TouchableHighlight,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from "react-native";
import CheckBox from "react-native-check-box";
import CheckBoxGradient from "../../components/CheckBoxGradient/CheckBoxGradient";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";

import { updateState } from "./../../domains/register/ActionCreators";
import Icon from "react-native-vector-icons/Ionicons";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

import { strings } from "../../config/i18n";

class GdprDataScreen extends React.Component {
  // Costruttore per creare lo stato che poi contiene email e password
  // showPassword per dire se mostrare la password
  constructor() {
    super();
    this.state = {
      checkboxes: [
        {
          checked: true,
          rightText: strings("id_0_110"),
          rightTextView: null,
          description: strings("id_0_111"),
        },
        {
          checked: true,
          rightText: strings("id_0_112"),
          rightTextView: null,
          description: strings("id_0_113"),
        },
        {
          checked: true,
          rightText: strings("id_0_114"),
          rightTextView: null,
          description: strings("id_0_115"),
        },
        // {
        //   checked: true,
        //   rightText: strings("id_0_116"),
        //   rightTextView: null,
        //   description: strings("id_0_117"),
        // },
      ],
    };
  }

  static navigationOptions = {
    header: null,
  };

  nextScreen = () => {
    this.props.dispatch(
      updateState({
        customisation_gdpr: this.state.checkboxes[0].checked,
        sponsorships_gdpr: this.state.checkboxes[1].checked,
        commercialisation_gdpr: this.state.checkboxes[2].checked,
        mailinglist_gdpr: false
      })
    );
    this.props.navigation.navigate("SurveyEnd");
  };

  handleCheckboxClick = (index) => {
    let checkboxes = this.state.checkboxes;
    checkboxes[index].checked = !checkboxes[index].checked;
    this.setState({ checkboxes });

    let found = checkboxes.find(function (element) {
      return element.checked == false;
    });
  };

  checkboxes() {
    return this.state.checkboxes.map((item, index) => (
      <View style={styles.checkboxContainer} key={index}>
        <CheckBoxGradient
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
          }}
          onClick={() => this.handleCheckboxClick(index)}
          isChecked={this.state.checkboxes[index].checked}
          rightText={item.rightText ? item.rightText : null}
          rightTextStyle={{
            color: "#3d3d3d",
            fontSize: 14,
            fontFamily: "OpenSans-Bold",
          }}
          // rightTextView={item.rightTextView ? item.rightTextView : null}
          checkBoxColor={"#3d3d3d"}
        />
        <View style={{ marginLeft: 30 }}>
          <Text
            style={{
              color: "#3d3d3d",
              fontSize: 13,
              fontFamily: "OpenSans-Regular",
              marginTop: 0,
              alignSelf: "flex-start",
            }}
          >
            {item.description}
          </Text>
        </View>
      </View>
    ));
  }
  renderCheckboxes() {
    return (
      <View style={styles.checkboxesContainer}>
        <View
          style={{
            width: Dimensions.get("window").width * 0.9,
          }}
        >
          <Text
            style={{
              color: "#3d3d3d",
              fontSize: 10,
              fontFamily: "OpenSans-Regular",
            }}
          >
            {strings("dear_muver__in_")}
          </Text>
          <View
            style={{
              height: 10,
            }}
          />
          <View
            style={{
              borderTopColor: "#9D9B9C",
              borderTopWidth: 0.3,
            }}
          />
        </View>
      </View>
    );
  }

  render() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "#FFFFFF",
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

                  justifyContent: "flex-start",
                  height: 30,
                  paddingTop: 10
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.goBack(null);
                  }}
                >
                  <View style={{ width: 30, height: 30, paddingLeft: 10 }}>
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

              <View contentContainerStyle={styles.half}>
                <View style={styles.halfCenter}>
                  {/* campi per il GDPR */}

                  <Text
                    style={{
                      color: "#3d3d3d",
                      fontSize: 14,
                      fontFamily: "OpenSans-Bold",
                      fontWeight: "bold",
                      alignSelf: "center",
                    }}
                  >
                    {strings("id_0_109")}
                  </Text>
                  <View
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewCheckboxContainer}
                  >
                    {this.checkboxes()}
                  </View>
                </View>
              </View>
              <View
                style={{
                  height: 80,
                  backgroundColor: "transparent",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                  alignSelf: "center",
                  alignItems: "center",
                  width: Dimensions.get("window").width * 0.9,
                  paddingBottom: 50,
                  paddingTop: 20,
                }}
              >
                <View style={[styles.button, { marginTop: 10 }]}>
                  <TouchableHighlight
                    onPress={this.nextScreen}
                    style={{
                      width: 70,
                      height: 41,
                      borderRadius: 25,
                      alignItems: "center",
                      shadowRadius: 5,
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
                        shadowRadius: 5,
                      }}
                    >
                      <View
                        style={{
                          height: 41,
                          alignItems: "center",
                          justifyContent: "center",
                          alignContent: "center",
                          flexDirection: "row",
                        }}
                      >
                        <Text style={{ color: "#FFFFFF" }}>
                          {strings("id_0_118")}
                        </Text>
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
    height: Dimensions.get("window").height,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
    backgroundColor: "transparent",
  },
  image: {
    width: Dimensions.get("window").width / 2,
    height: Dimensions.get("window").height / 3,
  },
  center: {
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 15,

    flexDirection: "column",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 100,
    // height: Dimensions.get("window").height / 2,
    // width: Dimensions.get("window").width
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
    elevation: 2,
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
    color: "#3D3D3D",
  },
  checkboxesContainer: {
    width: Dimensions.get("window").width * 0.8,

    // backgroundColor: "transparent",
    // position: "absolute",
    // top: Dimensions.get("window").height * 0.75,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#3e3",
    // marginTop: 30
  },
  scrollView: {
    width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height * 0.4,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    alignSelf: 'center',
    marginVertical: 5,
    marginTop: 20,
  },
  scrollViewCheckboxContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    alignSelf: 'center',
    
  },
  checkboxContainer: {
    width: Dimensions.get("window").width * 0.8,
    // height: 110,
    marginVertical: 5,
    marginTop: 20,
  },
  sfondo: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  half: {
    width: Dimensions.get("window").width,
    
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: 20,
  },
  halfCenter: {
    width: Dimensions.get("window").width,
    
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
    backgroundColor: "transparent",
  },
  image: {
    width: Dimensions.get("window").width / 2,
    height: Dimensions.get("window").height / 3,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
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
    backgroundColor: "#F7F8F9",
  },
  textFooter: {
    fontFamily: "OpenSans-Regular",

    fontSize: 12,

    // textAlign: "left"
  },
  textFooterBold: {
    fontFamily: "OpenSans-Regular",

    fontSize: 12,
    fontWeight: "bold",
    // textAlign: "left"
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
    color: "#3D3D3D",
  },
  backgroundImageWave: {
    height: 100,
    width: Dimensions.get("window").width,
    position: "absolute",
    // top: Dimensions.get("window").height * 0.04 + 14
  },
  textHeaderContainer: {
    marginLeft: 20,
    flexDirection: "row",
    width: Dimensions.get("window").width * 0.85,
  },
  textHeader: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3d3d3d",
    fontSize: 15,
    fontWeight: "bold",
  },
};

const ConnectLogin = connect((state) => {
  return {
    status: state.login.status ? state.login.status : false,
    loginState: state.login,
  };
});

export default ConnectLogin(GdprDataScreen);
