import React from "react";
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";

import { styles } from "./Style";
import Emoji from "@ardentlabs/react-native-emoji";

import pointsDecimal from "../../helpers/pointsDecimal";
import { images } from "./../InfoUserHome/InfoUserHome";
import OwnIcon from "../OwnIcon/OwnIcon";
import { citiesImage, imagesCity } from "../FriendItem/FriendItem";
import { getSponsor } from "./../../helpers/Sponsors.js";
import Settings from "./../../config/Settings";

import { DeleteUserInGroupPooling  } from "../../domains/connection/ActionCreators"

import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings,
} from "react-native-google-analytics-bridge";

let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);

import analytics from "@react-native-firebase/analytics";
import { store } from "../../store";
async function trackScreenView(screen) {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
}

// limiti l'avatar per gli avatar disponibili
export function limitAvatar(avatar) {
  if (avatar <= 73 && avatar > 0) {
    return avatar;
  } else {
    return 1;
  }
}

class UserItemPooling extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  conversionLevel = (level) => {
    let NameLevel = 1;
    switch (level) {
      case "newbie":
      case "Newbie":
      case "N":
        // code block
        NameLevel = 1;
        break;
      case "Rookie":
      case "rookie":
      case "R":
        // code block
        NameLevel = 2;
        break;
      case "Pro":
      case "pro":
      case "P":
        // code block
        NameLevel = 3;
        break;
      case "Star":
      case "star":
      case "S":
        // code block
        NameLevel = 4;
        break;
      default:
        // code block
        NameLevel = 1;
    }
    return NameLevel;
  };

  // user_follower

  goToFriend = () => {
    // se ho un id allora vado nel mio profilo
    // se uguale al mio id
    console.log(this.props.user.id);
    console.log(this.props.user.referred_route__user_id);
    if (this.props.user.id == this.props.user.referred_route__user_id) {
      if (this.props.myProfile) {
        this.props.myProfile();
      }
    } else {
      data = {
        user_id: this.props.user.referred_route__user_id,
        avatar: this.props.user.avatar,
        role: this.props.modalType,
        level: this.conversionLevel(this.props.level),
        first_name: this.props.user.referred_route__user__first_name,
        last_name: this.props.user.referred_route__user__last_name,
        city: this.props.user.referred_route__user__city__city_name,
        community: {
          name: this.props.user.referred_route__user__community__name,
        },
      };
      console.log(data);
      console.log(this.props.navigation.state.routeName);
      // if (
      //   this.props.navigation.state.routeName === "GlobalStandingsScreen" ||
      //   this.props.navigation.state.routeName === "TeamTournamentBlur"
      // ) {
      //   this.props.navigation.navigate("FriendDetailFromGlobal", {
      //     friendData: data,
      //     can_follow: false
      //   });
      // } else {
      //   this.props.navigation.navigate("FriendDetailFromStanding", {
      //     friendData: data,
      //     can_follow: false
      //   });
      // }
    }
  };

  goToCity = (id) => {
    if (this.props.navigation.state.routeName === "GlobalStandingsScreen") {
      this.props.navigation.navigate("CityDetailScreenBlurFromGlobal", {
        city: id,
        cityName: this.props.city,
        cityId: this.props.user.referred_route__user__city_id
          ? this.props.user.referred_route__user__city_id
          : 0,
      });
    } else {
      this.props.navigation.navigate("CityDetailScreenBlurFromStanding", {
        city: id,
        cityName: this.props.city,
        cityId: this.props.user.referred_route__user__city_id
          ? this.props.user.referred_route__user__city_id
          : 0,
      });
    }
  };

  moveSponsor = () => {
    const communityInfo = getSponsor(this.props.community);
    if (!communityInfo.sponsor) {
      // vai alla comunita
    } else {
      // vai allo sponsor
      this.props.navigation.navigate("DetailSponsorScreenBlurFromStanding", {
        communityInfo,
      });
    }
  };

  render() {
    let id = 0;
    if (this.props.city && this.props.city.length) {
      // vedo se è tra le città pilota
      id = citiesImage(this.props.city ? this.props.city : "");
    }
    let userAvatar = limitAvatar(this.props.user.avatar);

    const colorCircle = ["#60368C", "#6CBA7E", "#E83475", "#FAB21E"];
    const colorText = ["#FFFFFF", "#000000", "#FFFFFF", "#000000"];
    const colorKpi = colorCircle[this.props.modalType];
    const colorTextRelative = colorText[this.props.modalType];
    let backgroundColor = "#FFFFFF";
    let color = this.props.fontColor ? "#fff" : "#3D3D3D";
    if (this.props.rowID)
      backgroundColor = this.props.rowID % 2 === 0 ? "#FFFFFF" : "#F7F8F9";
    return (
      <TouchableHighlight
        key={this.props.user.position}
        onPress={() => this.goToFriend()}
        disabled={this.props.currentUser}
      >
        <View
          style={[
            styles.userContainer,
            {
              backgroundColor,
            },
            this.props.style,
          ]}
        >
          <View style={styles.userPositionContainer}></View>

          <View style={styles.userAvatarContainer}>
            {/* <View style={styles.userAvatar} /> */}
            <Image style={styles.userAvatarImage} source={images[userAvatar]} />
            <View style={[styles.userBadge, { backgroundColor: colorKpi }]}>
              <Text style={[styles.badgeText, { color: colorTextRelative }]}>
                {this.props.level
                  ? this.props.level.charAt(0).toUpperCase()
                  : "N"}
              </Text>
            </View>
          </View>
          <View style={{ width: 20 }} />
          {this.props.community ? (
            <View style={styles.ViewLabel}>
              <Text style={[styles.userLabel, { color }]}>
                {this.props.user.username ? this.props.user.username : " "}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  paddingTop: 5,
                }}
              >
                <OwnIcon
                  name="star_icn"
                  size={15}
                  color={this.props.colorStar}
                />
                <Text style={[styles.userLabel, { color }]}>
                  {" "}
                  by {this.props.community.toUpperCase()}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.ViewLabel}>
              <Text style={[styles.userLabel, { color }]}>
                {this.props.user.username ? this.props.user.username : " "}
              </Text>
            </View>
          )}
          {id ? (
            <TouchableHighlight
              onPress={() => this.goToCity(id)}
              // disabled={true}
            >
              <Image
                source={imagesCity[id]}
                style={{
                  width: 25,
                  height: 25,
                }}
              />
            </TouchableHighlight>
          ) : (
            <View
              style={{
                width: 25,
                height: 25,
              }}
            />
          )}
          <View style={{ width: 10 }} />
          <View
            style={{
              width: 130,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 130,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {this.props.masterIs ? (
                this.props.user.username == this.props.myNickname ? (
                  <TouchableOpacity style={{}}>
                    <View>
                      <OwnIcon
                        name="steering_icn"
                        size={23}
                        color={"rgba(61, 61, 61, 1)"}
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => { DeleteUserInGroupPooling(this.props.all.id)}}>
                    <Image
                      style={{ height: 25, width: 25 }}
                      source={require("./../../assets/images/cancel_icn.png")}
                    />
                  </TouchableOpacity>
                )
              ) : this.props.user.username == this.props.myNickname ? (
                <TouchableOpacity onPress={() => { DeleteUserInGroupPooling(this.props.all.id)}}>
                  <Image
                    style={{ height: 25, width: 25 }}
                    source={require("./../../assets/images/cancel_icn.png")}
                  />
                </TouchableOpacity>
              ) : (
                <View />
              )}
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

UserItemPooling.defaultProps = {
  colorStar: "#fab21e",
  imageEnd: null,
};

export default UserItemPooling;
