import React from "react";
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  Dimensions,
  TouchableWithoutFeedback,
  TextInput,
  StyleSheet,
  Alert
} from "react-native";
import { styles } from "./Style";
import Settings from "./../../config/Settings";
import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from "react-native-google-analytics-bridge";
let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);
import analytics from "@react-native-firebase/analytics";
import { strings } from "../../config/i18n";
import Modal from "react-native-modal";
import OwnIcon from "../OwnIcon/OwnIcon";
const SCREEN_WIDTH = Dimensions.get("window").width;
import {
  patchTournamentQualification,
  getTournamentsQualification
} from "./../../domains/tournaments/ActionCreators";
import { connect } from "react-redux";
import { createSelector } from "reselect";

async function trackScreenView(screen) {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
}

class ChooseItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      is_modal_visibile: false,
      email: "",
      submitted: false
    };
  }

  renderModalContent() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.8,
          // height: Dimensions.get("window").height * 0.4,
          borderColor: "#62367E",
          borderWidth: 4,
          borderRadius: 10,
          backgroundColor: "#fff",
          alignSelf: "center",
          justifyContent: "space-around",
          alignItems: "center"
        }}
      >
        {this.renderLogoAlert()}
        {this.renderTextModal()}
        {this.renderTextInput()}
        {this.renderBtnModal()}
      </View>
    );
  }

  renderModal() {
    return (
      <Modal
        isVisible={this.state.is_modal_visibile}
        onBackdropPress={() => {
          this.setState({ is_modal_visibile: false });
        }}
        onBackButtonPress={() => {
          this.setState({ is_modal_visibile: false });
        }}
        style={{
          borderRadius: 10,
          alignItems: "center",
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          shadowRadius: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.5

          // backgroundColor: "white"
        }}
        backdropOpacity={0.7}
      >
        {this.renderModalContent()}
      </Modal>
    );
  }

  renderBtnModal() {
    const SubmitBtn = (
      <View style={slide_btn_styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.submitEmail();
          }}
        >
          <View
            style={{
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 35,
              backgroundColor: "#6BBA7E"
            }}
          >
            <View
              style={[
                slide_btn_styles.buttonInner,
                {
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center"
                }
              ]}
            >
              <Text style={slide_btn_styles.button}>{strings("id_15_18")}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );

    const CheckBtn = (
      <View style={slide_btn_styles.container}>
        <Text style={styles.modalText}>Indirizzo email valido!</Text>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View
            style={{
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 35
            }}
          >
            <Image
              style={styles.userAvatarImage}
              source={require("../../assets/images/check_green_icn.png")}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );

    if (!this.state.submitted) return SubmitBtn;
    else return CheckBtn;
  }

  renderTextModal() {
    return (
      <View
        style={{
          padding: 10,
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 4,
          width: Dimensions.get("window").width * 0.7
        }}
      >
        <Text style={styles.modalText}>{strings("id_2_05")}</Text>
      </View>
    );
  }

  updateState = () => {
    this.setState({ submitted: true, is_modal_visibile: false }, () => {
      // this.props.dispatch(getTournamentsQualification());
      this.props.navigation.navigate("TeamScreen", {
        university: this.props.university
      });
    });
  };

  submitEmail = () => {
    if (this.state.email.includes(this.props.university.domain)) {
      this.props.dispatch(
        patchTournamentQualification(
          this.props.tournament.id,
          this.props.university.id,
          this.state.email,
          this.updateState
        )
      );
    } else {
      Alert.alert(strings("id_0_10"), strings("id_0_22"));
    }
  };

  renderTextInput() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.6,
          margin: 10,
          height: 44,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "flex-start",
          borderColor: "#62367E",
          borderWidth: 3,
          borderRadius: 12
        }}
      >
        <OwnIcon
          name="mail_icn"
          size={40}
          color={"#62367E"}
          style={{ paddingLeft: 10 }}
        />
        <TextInput
          autoCapitalize={"none"}
          placeholder={strings("id_2_06")}
          placeholderTextColor={"#62367E"}
          style={{
            color: "#62367E",
            flex: 1,
            fontFamily: "OpenSans-Regular",
            fontWeight: "400",
            textAlign: "left",
            fontSize: 16
          }}
          onChangeText={text => {
            this.setState({ email: text });
          }}
          blurOnSubmit={false}
          // onSubmitEditing={text => {}}
          // onEndEditing={text => {}}
          // returnKeyType={"next"}
          selectionColor={"#62367E"}
          onFocus={() => {
            // this.setState({ plaeceholder_email: "" });
          }}
          onBlur={() => {
            // this.setState({ plaeceholder_email: strings("id_0_16") });
          }}
        />
      </View>
    );
  }

  renderLogoAlert() {
    return (
      <View
        style={{
          padding: 10,
          // backgroundColor: "#e33",
          // height: 100,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image style={styles.userAvatarImageModal} source={this.props.logo} />
      </View>
    );
  }

  renderLogo() {
    return (
      <View
        style={{
          flex: 0.2,
          // backgroundColor: "#e33",
          height: 100,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image style={styles.userAvatarImage} source={this.props.logo} />
      </View>
    );
  }

  renderCity() {
    return (
      <View
        style={{
          flex: 0.6,
          height: 100,
          justifyContent: "center",
          alignItems: "flex-start"
        }}
      >
        <Text style={styles.userLabel}>{this.props.name}</Text>
        <Text style={styles.userPoints}>{this.props.country}</Text>
      </View>
    );
  }

  renderBtn() {
    return (
      <View
        style={{
          flex: 0.2,
          height: 100,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ is_modal_visibile: true });
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.2 * 0.8,
              height: 25,
              borderColor: "#62367E",
              borderWidth: 1,
              borderRadius: 24,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={styles.chooseBtnText}>
              {strings("id_0_67").toLocaleUpperCase()}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    let backgroundColor = "#FFFFFF";
    if (this.props.rowID)
      backgroundColor = this.props.rowID % 2 === 0 ? "#F7F8F9" : "#FFFFFF";
    return (
      <View
        style={[
          styles.userContainer,
          {
            backgroundColor
          },
          this.props.style
        ]}
      >
        {this.renderModal()}
        {this.renderLogo()}
        {this.renderCity()}
        {this.renderBtn()}
      </View>
    );
  }

  noRender() {
    let backgroundColor = "#FFFFFF";
    if (this.props.rowID)
      backgroundColor = this.props.rowID % 2 === 0 ? "#F7F8F9" : "#FFFFFF";
    return (
      <View
        style={[
          styles.userContainer,
          {
            backgroundColor
          },
          this.props.style
        ]}
      >
        <View style={styles.userPositionContainer}>
          <Text style={styles.userPosition}>{1}</Text>
        </View>
        <View style={styles.userAvatarContainer}>
          {/* <View style={styles.userAvatar} /> */}
          <Image style={styles.userAvatarImage} source={this.props.logo} />
        </View>
        <View style={{ width: 20 }} />
        <View
          style={{
            width: 25,
            height: 25
          }}
        />
        <View style={{ width: 10 }} />
        <View
          style={{
            width: 90,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <View
            style={{
              width: 50,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={styles.userPoints}>ciao</Text>
          </View>
        </View>
      </View>
    );
  }
}

const slide_btn_styles = StyleSheet.create({
  container: {
    marginVertical: 15
  },
  buttonOuter: {
    marginTop: 20
  },
  buttonInner: {
    width: SCREEN_WIDTH * 0.5 - 40,
    height: 50,
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row"
  },
  button: {
    fontSize: 15,
    fontFamily: "OpenSans-Regular",
    color: "#fff",
    fontWeight: "bold",
    alignContent: "center"
  }
});

ChooseItem.defaultProps = {
  colorStar: "#fab21e"
};

const withData = connect(state => {
  return {};
});

export default withData(ChooseItem);

// export default ChooseItem;
