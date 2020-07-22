import React from "react";
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  ImageBackground,
  Dimensions,
  ActivityIndicator
} from "react-native";

import Emoji from "@ardentlabs/react-native-emoji";

import LinearGradient from "react-native-linear-gradient";
import { strings } from "../../config/i18n";
import branch, { RegisterViewEvent, BranchEvent } from "react-native-branch";
import { connect } from "react-redux";

const defaultBUO = {
  title: "MUV"
};

class InviteNoFriendScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      url: "",
      loadingUrl: false
    };
    this.buo = null;
  }

  isFiredUser() {
    if (this.props.user.fired)
      return (
        <Text style={[styles.userPoints, { fontSize: 16 }]}>
          <Emoji name="fire" />
        </Text>
      );
    else {
      return <View style={{ height: 20, width: 20 }} />;
    }
  }

  randomString() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  writeToClipboard = async () => {
    await Clipboard.setString(this.state.url);
  };

  addResult(type, slug, payload) {
    let result = { type, slug, payload };
    this.setState({
      results: [result, ...this.state.results].slice(0, 10)
    });
  }

  createBranchUniversalObject = async () => {
    try {
      let result = await branch.createBranchUniversalObject(
        this.randomString(),
        defaultBUO
      );
      if (this.buo) this.buo.release();
      this.buo = result;
      console.log("createBranchUniversalObject", result);
      this.addResult("success", "createBranchUniversalObject", result);
    } catch (err) {
      console.log("createBranchUniversalObject err", err.toString());
      this.addResult("error", "createBranchUniversalObject", err.toString());
    }
  };

  generateShortUrl = async () => {
    this.setState({ loadingUrl: true });
    if (!this.buo) await this.createBranchUniversalObject();
    try {
      let linkProperties = {
        sender_id: this.props.infoProfile.user_id,
        first_name: this.props.infoProfile.first_name,
        last_name: this.props.infoProfile.last_name,
        avatar: this.props.infoProfile.avatar,
        points: 0,
        role: this.props.infoProfile.role,
        coins: this.props.infoProfile.coins,
        level: JSON.stringify(this.props.infoProfile.level),
        roleIndex: JSON.stringify(this.props.roleAll),
        city: this.props.infoProfile.city
          ? this.props.infoProfile.city.city_name
            ? this.props.infoProfile.city.city_name
            : ""
          : ""
        // roleUser: this.props.loginState.role.roleUser,
        // indexRole: this.props.loginState.role.indexRole
      };
      let result = await this.buo.generateShortUrl({}, linkProperties);

      // console.log("generateShortUrl", result);
      // alert(result.url);
      console.log("linkProperties", linkProperties);

      console.log(result.url);

      this.setState({ url: result.url, loadingUrl: false });

      this.addResult("success", "generateShortUrl", result);

      this.props.navigation.navigate("InviteScreen", { url: result.url });

      if (!this.buo) return;
      this.buo.release();
    } catch (err) {
      console.log("generateShortUrl err", err);
      this.addResult("error", "generateShortUrl", err.toString());
      this.setState({ loadingUrl: false });
    }
  };

  invite = () => {
    //console.log(this.props);
    this.generateShortUrl();
  };

  render() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,

          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          alignSelf: "center",
          alignItems: "center"
        }}
      >
        <Text
          style={{
            fontFamily: "Montserrat-ExtraBold",
            color: "#3F3F3F",
            fontSize: 20,
            textAlign: "left",
            textAlignVertical: "center"
          }}
        >
          {strings("invite_your_fri")}
        </Text>
        <View
          style={{
            width: Dimensions.get("window").width,
            height: 30,
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            alignSelf: "center",
            alignItems: "center"
          }}
        />
        <Image
          source={require("./../../assets/images/followers_empty_list.png")}
          style={{
            width: Dimensions.get("window").width * 0.5,
            height: Dimensions.get("window").width * 0.5
          }}
        />
        <View
          style={{
            width: Dimensions.get("window").width,
            height: 30,
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            alignSelf: "center",
            alignItems: "center"
          }}
        />
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.0 }}
          locations={[0, 1.0]}
          colors={["#7D4D99", "#6497CC"]}
          style={{
            width: Dimensions.get("window").width * 0.25,
            height: 30,
            borderRadius: 15,
            alignItems: "center",
            shadowRadius: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            elevation: 1
          }}
        >
          <TouchableHighlight
            onPress={this.invite}
            style={{
              width: Dimensions.get("window").width * 0.25,
              height: 30,
              borderRadius: 15,
              alignItems: "center"
            }}

            // disabled={this.props.status === "Inviting" ? true : false}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {!this.state.loadingUrl ? (
                <Text
                  style={{
                    // margin: 10,
                    color: "#FFFFFF",
                    fontFamily: "OpenSans-Regular",

                    fontSize: 14
                  }}
                >
                  {strings("invite")}
                </Text>
              ) : (
                <ActivityIndicator size="small" color="white" />
              )}
            </View>
          </TouchableHighlight>
        </LinearGradient>
        <View
          style={{
            width: Dimensions.get("window").width,
            height: 300,
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            alignSelf: "center",
            alignItems: "center"
          }}
        />
      </View>
    );
  }
}

const withConnect = connect(state => {
  return {
    roleAll: state.login.role
  };
});

export default withConnect(InviteNoFriendScreen);
