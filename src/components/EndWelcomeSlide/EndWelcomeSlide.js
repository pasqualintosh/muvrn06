import React from "react";
import {
  View,
  Text,
  Platform,
  Dimensions,
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
  Modal,
  Linking,
  Alert,
  ScrollView,
  SafeAreaView
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import CheckBox from "react-native-check-box";
import WavyArea from "./../WavyArea/WavyArea";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";
import { styles, negativeData, positiveData } from "./Style";
import { BoxShadow } from "react-native-shadow";
import HTML from "react-native-render-html";
import { terms } from "./../../assets/terms_and_condition";
import Icon from "react-native-vector-icons/Ionicons";

import { strings, switchLanguage } from "../../config/i18n";
import { connect } from "react-redux";

import branch, { BranchEvent } from "react-native-branch";
import { saveBranchTempData } from "./../../domains/register/ActionCreators";
import { getMaintenance } from "./../../domains/login/ActionCreators";
import GoogleLogin from "../../components/GoogleLogin/GoogleLogin";
import FacebookLinkButton from "../../components/FacebookLinkButton/FacebookLinkButton";

class EndWelcomeSlide extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkboxes: [
        {
          checked: false,
          rightText: strings("i_am_over_16_ye"),
          rightTextView: null
        },
        {
          checked: false,
          rightText: "",
          rightTextView: this.renderUnderlinedCheckboxText()
        }
      ],
      buttonBgColor: "#ffffff70",
      modalVisible: false,
      friend: ""
    };
  }

  componentDidMount() {
    branch.subscribe(({ error, params }) => {
      console.log("link branch");
      console.log(params);
      if (error) {
        console.log("Error from Branch: " + error);
        return;
      }

      if (params["+clicked_branch_link"]) {
        console.log("Received link response from Branch");
        // alert("Received link response from Branch \n" + JSON.stringify(params));

        let link = params["~referring_link"];
        let sender_id = params.sender_id;
        let first_name = params.first_name;

        this.setState({
          friend: first_name
        });

        // alert(link);
        // alert(sender_id);

        // this.props.dispatch(
        //   postFollowUser({
        //     followed_user_id: sender_id,
        //     referral_url: link,
        //     link_status: 3
        //   })
        // );
        this.props.dispatch(saveBranchTempData(sender_id, link, 0));
      }

      console.log("params: " + JSON.stringify(params));
    });

    // this.props.dispatch(getMaintenance());
  }

  static navigationOptions = {
    header: null
  };
  _handleCheckboxClick = index => {
    console.log(index);

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
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
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
            color: "#fff",
            fontSize: Platform.OS == "ios" ? 13 : 13,
            fontFamily: "OpenSans-Regular"
          }}
        >
          {strings("i_accept_")}{" "}
        </Text>

        <TouchableWithoutFeedback
          onPress={() => {
            () => {};
          }}
        >
          <View>
            <Text
              style={{
                color: "#fff",
                textDecorationLine: "underline",
                fontSize: Platform.OS == "ios" ? 13 : 13,
                fontFamily: "OpenSans-Regular"
              }}
            >
              {strings("terms_and_condi")}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
  _goToHome = () => {
    this.props.navigation.navigate("Login");
  };
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
            color: "#fff",
            fontSize: Platform.OS == "ios" ? 13 : 13,
            fontFamily: "OpenSans-Regular"
          }}
          rightTextView={item.rightTextView ? item.rightTextView : null}
          checkBoxColor={"#fff"}
        />
      </View>
    ));
  }
  renderCheckboxes() {
    return <View style={styles.checkboxesContainer}>{this.checkboxes()}</View>;
  }
  renderWelcomeText() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: 160,
          backgroundColor: "transparent",
          position: "absolute",
          // top: Dimensions.get("window").height * 0.6,
          top: Dimensions.get("window").height * 0.5 - 20,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 20,
            fontFamily: "OpenSans-Regular"
          }}
        >
          {strings("welcome__newbie")} 👋
        </Text>
        {this.state.friend.length ? (
          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              fontFamily: "OpenSans-Regular"
            }}
          >
            {"by "}
            {this.state.friend}
          </Text>
        ) : (
          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              fontFamily: "OpenSans-Regular",
              opacity: 0
            }}
          >
            by
          </Text>
        )}
      </View>
    );
  }
  renderLogoText() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: 160,
          backgroundColor: "transparent",
          position: "absolute",
          top: Dimensions.get("window").height * 0.3 - 50,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text
          style={{
            color: "#3d3d3d",
            fontSize: 16,
            fontFamily: "Montserrat-ExtraBold"
          }}
        >
          TO THE NEXT LEVEL
        </Text>
      </View>
    );
  }

  renderFooterTitle() {
    return (
      <View style={styles.linkContainer}>
        <Text style={styles.textDescription}>{strings("do_you_already_")}</Text>
        <TouchableWithoutFeedback onPress={this._goToHome}>
          <View>
            <Text
              style={[
                styles.textDescription,
                { textDecorationLine: "underline", color: "#FAB21E" }
              ]}
            >
              {strings("here_")}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
  render() {
    let shadowOpt;
    if (Platform.OS == "ios")
      shadowOpt = {
        width: Dimensions.get("window").width * 0.68,
        height: 40,
        color: "#333",
        border: 8,
        radius: 5,
        opacity: 0.25,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: 0
        }
      };
    else
      shadowOpt = {
        width: Dimensions.get("window").width * 0.68,
        height: 40,
        color: "#444",
        border: 6,
        radius: 5,
        opacity: 0.35,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: 0
        }
      };

    return (
      <View style={styles.mainContainer}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.modalContainer}>
              <ScrollView
                style={{
                  width: Dimensions.get("window").width * 0.95,
                  backgroundColor: "#F7F8F9",
                  alignSelf: "center"
                }}
              >
                <HTML
                  onLinkPress={(event, href) => {
                    Linking.openURL(href);
                  }}
                  html={terms}
                  containerStyle={{
                    marginTop: 10
                  }}
                />
              </ScrollView>
              <TouchableWithoutFeedback
                style={{
                  width: 40,
                  height: 40,
                  position: "absolute",
                  backgroundColor: "trasparent",
                  top: 15,
                  right: 10
                }}
                onPress={() => {
                  this.setModalVisible(false);
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "trasparent",
                    position: "absolute",
                    top: 15,
                    right: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row"
                  }}
                >
                  <Icon
                    name="ios-close-circle"
                    // style={{ marginTop: 4 }}
                    size={20}
                    color="#3d3d3d"
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </SafeAreaView>
        </Modal>

        {/* fine testo header */}
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#6497cc", "#7d4d99"]}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height * 0.6,
            position: "absolute",
            top: Dimensions.get("window").height * 0.4 + 150
          }}
        />

        <ImageBackground
          source={require("./../../assets/images/first_screen_wave.png")}
          style={{
            width: Dimensions.get("window").width,
            height: 150,
            backgroundColor: "transparent",
            position: "absolute",
            top: Dimensions.get("window").height * 0.4
          }}
        />

        {/* <WavyArea
          data={negativeData}
          color={"#F7F8F9"}
          style={[
            styles.overlayWave,
            {
              
            }
          ]}
        /> */}

        {/* testo footer 
        <View style={styles.textFooterContainer}>
          <Text style={styles.textFooter}>Let's</Text>
        </View>
        fine testo footer*/}

        {/* logo footer */}
        <View style={styles.logoFooterContainer}>
          <OwnIcon name="MUV_logo" size={200} color="#3d3d3d" />
        </View>
        {this.renderLogoText()}
        {/* fine logo footer*/}

        {/* checkboxes */}
        {this.renderWelcomeText()}
        {this.renderCheckboxes()}

        {/* fine checkboxes */}

        {/* bottone survey */}
        <View style={styles.SocialbuttonContainer}>
          <FacebookLinkButton
            dispatch={this.props.dispatch}
            register={true}
            navigate={this.props.navigation.navigate}
          />
          <GoogleLogin
            dispatch={this.props.dispatch}
            register={true}
            navigate={this.props.navigation.navigate}
          />
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            let flag = true;
            this.state.checkboxes.forEach((elem, index) => {
              if (elem.checked == false) flag = false;
            });
            // if (flag) this.props.navigation.navigate("SurveyAvatar");
            if (flag) this.props.navigation.navigate("SurveySelectTeam");
          }}
        >
          <View style={styles.buttonContainer}>
            {/* <BoxShadow setting={shadowOpt} /> */}
            <View
              style={[
                styles.buttonBox,
                { backgroundColor: this.state.buttonBgColor }
              ]}
            >
              <Text style={styles.buttonText}>{strings("let_s_begin")}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        {/* fine bottone survey */}

        {/* testo cliccabile */}
        <TouchableWithoutFeedback
          onPress={() => {
            this.setModalVisible(true);
          }}
        >
          <View
            style={{
              width: 145,
              height: Platform.OS == "ios" ? 20 : 30,
              top:
                Platform.OS == "ios"
                  ? Dimensions.get("window").height * 0.775 - 20 - 90
                  : Dimensions.get("window").height > 830
                  ? Dimensions.get("window").height * 0.75 - 20 - 90
                  : Dimensions.get("window").height * 0.775 - 20 - 90,
              left: Dimensions.get("window").width * 0.35,
              backgroundColor: "transparent",
              // backgroundColor: "#000",
              position: "absolute"
            }}
          />
        </TouchableWithoutFeedback>

        {/* 
        <ImageBackground
          source={require("./../../assets/images/bg-login.png")}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height * 0.5,
            backgroundColor: "transparent",
            position: "absolute",
            top: Dimensions.get("window").height * 0
          }}
        /> 
        */}
        {/* 
        <Image
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height * 0.35,
            backgroundColor: "transparent",
            position: "absolute",
            top: Dimensions.get("window").height * 0.3
          }}
          source={require("../../assets/images/skater.png")}
          resizeMethod={"scale"}
          resizeMode={"contain"}
        /> 
        */}
        {this.renderFooterTitle()}
      </View>
    );
  }
}

const Friend = connect();

export default Friend(EndWelcomeSlide);
