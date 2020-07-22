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
import pointsDecimal from "../../helpers/pointsDecimal";
import { getUniversityImg } from "./../../screens/ChooseTeamScreen/ChooseTeamScreen";

async function trackScreenView(screen) {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
}

class UniversityGameOnlyPointsItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      is_modal_visibile: false,
      email: "",
      submitted: false
    };
  }

  renderLogo() {
    return (
      <View
        style={{
          // paddingLeft: 10,
          paddingRight: 10,
          // backgroundColor: "#e33",

          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image
          style={styles.userAvatarImage}
          source={getUniversityImg(this.props.logo)}
        />
      </View>
    );
  }

  renderCity() {
    return (
      <View
        style={{
          flex: 0.7,
          justifyContent: "center",
          alignItems: "flex-start"
        }}
      >
        <Text style={[styles.userLabel, { color: this.props.colorText }]}>
          {this.props.name}
        </Text>
        <Text style={[styles.userPoints, { color: this.props.colorText }]}>
          {this.props.country}
        </Text>
      </View>
    );
  }

  renderPosition() {
    return (
      <View
        style={{
          width: 30,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text style={[styles.parameter, { color: this.props.colorText }]}>
          {this.props.position}
        </Text>
      </View>
    );
  }

  renderBtn() {
    return (
      <View
        style={{
          flex: 0.3,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text style={[styles.parameter, { color: this.props.colorText }]}>
          {pointsDecimal(this.props.points, ".")}
        </Text>
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
        {this.renderPosition()}
        {this.renderLogo()}
        {this.renderCity()}
        {this.renderBtn()}
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

UniversityGameOnlyPointsItem.defaultProps = {
  colorStar: "#fab21e",
  points: 0,
  colorText: "#3D3D3D"
};

export default UniversityGameOnlyPointsItem;
