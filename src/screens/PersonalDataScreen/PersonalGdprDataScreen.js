import React from "react";
import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  SafeAreaView
} from "react-native";
import CheckBox from "react-native-check-box";
import { connect } from "react-redux";
import {
  ChangePassword,
  deleteProfile
} from "./../../domains/login/ActionCreators";
import { START_LOGIN } from "../../domains/login/ActionTypes";
import { UpdateProfile } from "./../../domains/login/ActionCreators";

import { strings } from "../../config/i18n";

class PersonalGdprDataScreen extends React.Component {
  // Costruttore per creare lo stato che poi contiene email e password
  // showPassword per dire se mostrare la password
  constructor() {
    super();
    this.state = {
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
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("informed_consen")}
        </Text>
      )
    };
  };

  componentWillUnmount() {
    this.props.dispatch(
      UpdateProfile({
        data: {
          public_profile: {
            customisation_gdpr: this.state.checkboxes[0].checked,
            sponsorships_gdpr: this.state.checkboxes[1].checked,
            commercialisation_gdpr: this.state.checkboxes[2].checked,
            mailinglist_gdpr: this.state.checkboxes[3].checked
          }
        }
      })
    );
  }

  componentWillReceiveProps(props) {
    if (this.props != props) {
      let checkboxes = [...this.state.checkboxes];

      checkboxes[0].checked = props.loginState.infoProfile.customisation_gdpr;
      checkboxes[1].checked = props.loginState.infoProfile.sponsorships_gdpr;
      checkboxes[2].checked =
        props.loginState.infoProfile.commercialisation_gdpr;
      checkboxes[3].checked = props.loginState.infoProfile.mailinglist_gdpr;

      // console.log(checkboxes);

      this.setState({ checkboxes: [...checkboxes] });
    }
  }

  showAlert = msg => {
    Alert.alert("Oops", msg);
  };

  componentWillMount() {
    this.props.dispatch({
      type: START_LOGIN,
      payload: {
        status: ""
      }
    });
  }

  handleCheckboxClick = index => {
    let checkboxes = this.state.checkboxes;
    checkboxes[index].checked = !checkboxes[index].checked;
    this.setState({ checkboxes });

    let found = checkboxes.find(function(element) {
      return element.checked == false;
    });
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
          isChecked={this.state.checkboxes[index].checked}
          rightText={item.rightText ? item.rightText : null}
          rightTextStyle={{
            color: "#3d3d3d",
            fontSize: 11,
            fontFamily: "OpenSans-Bold"
          }}
          // rightTextView={item.rightTextView ? item.rightTextView : null}
          checkBoxColor={"#3d3d3d"}
        />
        <View style={{ right: -35 }}>
          <Text
            style={{
              color: "#3d3d3d",
              fontSize: 10,
              fontFamily: "OpenSans-Regular",
              marginTop: 0,
              alignSelf: "flex-start"
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
            width: Dimensions.get("window").width * 0.9
          }}
        >
          <Text
            style={{
              color: "#3d3d3d",
              fontSize: 10,
              fontFamily: "OpenSans-Regular"
            }}
          >
            {strings("dear_muver__in_")}
          </Text>
          <View
            style={{
              height: 10
            }}
          />
          <View
            style={{
              borderTopColor: "#9D9B9C",
              borderTopWidth: 0.3
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
          height: Dimensions.get("window").height
        }}
      >
        <ImageBackground
          source={require("../../assets/images/bg-login.png")}
          style={styles.sfondo}
        >
          <SafeAreaView style={styles.center}>
            {/* campi per il GDPR */}
            {this.renderCheckboxes()}
            <Text
              style={{
                color: "#3d3d3d",
                fontSize: 12,
                fontFamily: "OpenSans-Bold",
                fontWeight: "bold",
                alignSelf: "center",
                marginTop: 5
              }}
            >
              {strings("i_declare_that_")}
            </Text>
            {this.checkboxes()}
          </SafeAreaView>
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
    color: "#ffffff",
    backgroundColor: "transparent"
  },
  image: {
    width: Dimensions.get("window").width / 2,
    height: Dimensions.get("window").height / 3
  },
  center: {
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 15,

    flexDirection: "column",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 100
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
    elevation: 2
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

    // backgroundColor: "transparent",
    // position: "absolute",
    // top: Dimensions.get("window").height * 0.75,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
    // backgroundColor: "#3e3",
    // marginTop: 30
  },
  checkboxContainer: {
    width: Dimensions.get("window").width * 0.7,
    // height: 110,
    marginVertical: 5
  }
};

const ConnectLogin = connect(state => {
  return {
    status: state.login.status ? state.login.status : false,
    loginState: state.login
  };
});

export default ConnectLogin(PersonalGdprDataScreen);
