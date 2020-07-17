import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import WavyArea from "./../../components/WavyArea/WavyArea";

import { styles, negativeData } from "./Style";

import Emoji from "@ardentlabs/react-native-emoji";
import branch, { BranchEvent } from "react-native-branch";
import { saveBranchTempData } from "./../../domains/register/ActionCreators";

import { connect } from "react-redux";

import { strings } from "../../config/i18n";

class Welcome extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  componentDidMount() {
    branch.subscribe(({ error, params }) => {
      if (error) {
        console.log("Error from Branch: " + error);
        return;
      }

      if (params["+clicked_branch_link"]) {
        console.log("Received link response from Branch");
        // alert("Received link response from Branch \n" + JSON.stringify(params));

        let link = params["~referring_link"];
        let sender_id = params.sender_id;

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
  }

  _goToHome = () => {
    this.props.navigation.navigate("Login");
  };
  renderTitle() {
    if (this.props.title || this.props.title == "") {
      return <Text style={styles.greetingsTitle}>{this.props.title}</Text>;
    } else {
      return (
        <Text style={styles.greetingsTitle}>
          {strings("ciao_and_welcom")} <Emoji name="wave" />
        </Text>
      );
    }
  }
  renderSubTitle() {
    if (this.props.subTitle || this.props.subTitle == "") {
      return (
        <View>
          {/* <Text style={styles.textDescription}>
            {this.props.title} <Emoji name="muscle" />
          </Text> */}
          <Text style={styles.textDescription}>{this.props.subTitle}</Text>
        </View>
      );
    } else {
      return (
        <Text style={styles.textDescription}>{strings("are_you_ready_t")}</Text>
      );
    }
  }
  renderFooterTitle() {
    if (this.props.footerTitle || this.props.footerTitle == "") {
      return (
        <View style={styles.linkContainer}>
          <Text style={styles.textDescription}>{this.props.footerTitle}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.linkContainer}>
          <Text style={styles.textDescription}>
            {strings("do_you_already_")}&nbsp;
          </Text>
          <TouchableWithoutFeedback onPress={this._goToHome}>
            <View>
              <Text
                style={[
                  styles.textDescription,
                  { textDecorationLine: "underline" }
                ]}
              >
                {strings("here_")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    }
  }
  render() {
    return (
      <View style={styles.mainContainer}>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#6497cc", "#7d4d99"]}
          style={styles.linearGradient}
        />
        <View style={styles.logoContainer}>
          <OwnIcon name="MUV_logo" size={150} color="#000" />
        </View>
        <WavyArea
          data={this.props.curve ? this.props.curve : negativeData}
          color={"#F7F8F9"}
          style={[
            styles.overlayWave,
            {
              position: "absolute",
              top: Dimensions.get("window").height * 0.5
            }
          ]}
        />
        <View style={styles.imageContainer}>
          <Image
            source={this.props.imageSource}
            style={[
              {
                width: 200 * 0.85,
                height: 300 * 0.85,
                alignSelf: "center"
              },
              styles.imageIpad
            ]}
            resizeMethod={"scale"}
            resizeMode={"contain"}
          />
        </View>
        <View style={styles.greetingsContainer}>
          {this.renderTitle()}
          {this.renderSubTitle()}
        </View>
        {this.renderFooterTitle()}
      </View>
    );
  }
}

const withData = connect(state => {
  return {};
});

export default withData(Welcome);
