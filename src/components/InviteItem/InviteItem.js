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

import { styles } from "./Style";
import Emoji from "@ardentlabs/react-native-emoji";

import pointsDecimal from "../../helpers/pointsDecimal";
import { images } from "./../InfoUserHome/InfoUserHome";
import OwnIcon from "../OwnIcon/OwnIcon";
import LinearGradient from "react-native-linear-gradient";
import { strings } from "../../config/i18n";
import branch, { RegisterViewEvent, BranchEvent } from "react-native-branch";

const defaultBUO = {
  title: "MUV"
};

class InviteItem extends React.PureComponent {
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
        points: this.props.Points,
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
    let backgroundColor = "transparent";

    return (
      <ImageBackground
        source={this.props.wave}
        style={{
          height: 120,
          width: Dimensions.get("window").width,
          
        }}
      >
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
            <Text style={styles.userPosition}>{""}</Text>
          </View>
          <View style={styles.userAvatarContainer}>
            {/* <View style={styles.userAvatar} /> */}
            <Image
              style={styles.userAvatarImage}
              source={require("../../assets/images/friends_banner_icn.png")}
            />
          </View>
          <View style={styles.ViewLabel}>
            <Text style={[styles.userLabel, {color: this.props.textColor}]}>{this.props.description}</Text>
          </View>
          <View
            style={{
              flex: 2,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center"
            }}
          >
            <View style={{ width: Dimensions.get("window").width * 0.2 }}>
              
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 1.0, y: 0.0 }}
                locations={[0, 1.0]}
                colors={this.props.colorInvite}
                style={{
                  width: Dimensions.get("window").width * 0.17,
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
                  width: Dimensions.get("window").width * 0.17,
                  height: 30,
                  borderRadius: 15,
                  alignItems: "center",
                 
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
                          
                          color: this.props.textColorInvite,
                          fontFamily: "OpenSans-Regular",

                          fontSize: 14
                        }}
                      >
                         {strings('invite')}
                      </Text>
                    ) : (
                      <ActivityIndicator size="small" color="white" />
                    )}
                  </View>
                </TouchableHighlight>
              </LinearGradient>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}



InviteItem.defaultProps = {
  description: strings("invite_your_fri"),
  wave: require("../../assets/images/invite_friend_wave_list.png"),
  // invite_friend_wave_list_purple.png
  colorInvite: ["#7D4D99", "#6497CC"],
  textColorInvite: '#FFFFFF',
  textColor: '#3D3D3D'
  
};



export default InviteItem;
