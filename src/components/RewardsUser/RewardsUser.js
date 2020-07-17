import React from "react";
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  Dimensions
} from "react-native";

import { styles } from "./Style";
import Emoji from "@ardentlabs/react-native-emoji";

import pointsDecimal from "../../helpers/pointsDecimal";
import { images } from "./../InfoUserHome/InfoUserHome";
import OwnIcon from "../OwnIcon/OwnIcon";
import { citiesImage, imagesCity } from "../FriendItem/FriendItem";
import { limitAvatar } from "./../UserItem/UserItem";

class RewardsUser extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  conversionLevel = level => {
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
        avatar: this.props.user.referred_route__user__avatar,
        role: this.props.user.role,
        level: this.conversionLevel(this.props.user.level),
        first_name: this.props.user.referred_route__user__first_name,
        last_name: this.props.user.referred_route__user__last_name,
        city: this.props.user.referred_route__user__city__city_name
      };
      console.log(data);
      console.log(this.props.navigation.state.routeName);
      if (this.props.navigation.state.routeName === "GlobalStandingsScreen") {
        this.props.navigation.navigate("FriendDetailFromGlobal", {
          friendData: data,
          can_follow: false
        });
      } else {
        this.props.navigation.navigate("FriendDetailFromStanding", {
          friendData: data,
          can_follow: false
        });
      }
    }
  };

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

  goToCity = id => {
    if (this.props.navigation.state.routeName === "GlobalStandingsScreen") {
      this.props.navigation.navigate("CityDetailScreenBlurFromGlobal", {
        city: id,
        cityName: this.props.city
      });
    } else {
      this.props.navigation.navigate("CityDetailScreenBlurFromStanding", {
        city: id,
        cityName: this.props.city
      });
    }
  };

  TrophiesView() {
    return <View style={{ height: 40, width: 40 }} />;
  }

  render() {
    let userAvatar = limitAvatar(this.props.user.avatar);

    // role: "muver"
    const role = Number.isInteger(this.props.user.role) ? this.props.user.role : 0

    const colorCircle = ["#60368C", "#6CBA7E", "#E83475", "#FAB21E"];
    const colorText = ["#FFFFFF", "#000000", "#FFFFFF", "#000000"];
    const colorKpi = colorCircle[role];
    const colorTextRelative = colorText[role];
    let backgroundColor = "#FFFFFF";
    let color = this.props.fontColor ? "#fff" : "#3D3D3D";
    if (this.props.rowIDColor) {
      backgroundColor = this.props.rowIDColor % 2 === 0 ? "#FFFFFF" : "#F7F8F9";
    }
      
    return (
      <View
        key={this.props.rowID}
        // onPress={() => this.goToFriend()}
        disabled={this.props.currentUser}
      >
        <View
          style={[
            styles.userContainer,
            {
              backgroundColor: backgroundColor
            },
            this.props.style
          ]}
        >
          <View style={styles.userPositionContainer}>
            <Text style={[styles.userPosition, { color }]}>
              {this.props.rowID}
            </Text>
          </View>

          <View style={styles.userAvatarContainer}>
            {/* <View style={styles.userAvatar} /> */}
            <Image style={styles.userAvatarImage} source={images[userAvatar]} />
            <View style={[styles.userBadge, { backgroundColor: colorKpi }]}>
              <Text style={[styles.badgeText, { color: colorTextRelative }]}>
                {this.props.user.level
                  ? this.props.user.level.name.charAt(0).toUpperCase()
                  : "N"}
              </Text>
            </View>
          </View>
          <View style={{ width: 20 }} />
          {this.props.community ? (
            <View style={styles.ViewLabel}>
              <Text style={[styles.userLabel, { color }]}>
                {this.props.user.first_name
                  ? this.props.user.first_name.charAt(0).toUpperCase() +
                    this.props.user.first_name.toLowerCase().slice(1)
                  : ""}{" "}
                {this.props.user.last_name
                  ? this.props.user.last_name.substr(0, 1) + "."
                  : " "}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  paddingTop: 5
                }}
              >
                <OwnIcon name="star_icn" size={15} color={"#fab21e"} />
                <Text style={[styles.userLabel, { color }]}>
                  {" "}
                  by {this.props.community.toUpperCase()}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.ViewLabel}>
              <Text style={[styles.userLabel, { color }]}>
                {this.props.user.first_name
                  ? this.props.user.first_name.charAt(0).toUpperCase() +
                    this.props.user.first_name.toLowerCase().slice(1)
                  : ""}{" "}
                {this.props.user.last_name
                  ? this.props.user.last_name.substr(0, 1) + "."
                  : " "}
              </Text>
            </View>
          )}

          <View
            style={{
              width: 45,
              height: 100,

              borderRightColor: "#FAB21E",
              borderLeftColor: "#FAB21E",
              borderRightWidth: 1,
              borderLeftWidth: 1,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={[styles.userLabel]}>{this.props.medal}</Text>
          </View>

          <View
            style={{
              width: 80,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                width: 80,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={[styles.userPoints, { color }]}>
                {pointsDecimal(this.props.points)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

RewardsUser.defaultProps = {
  rowID: 1,
  rowIDColor: 1,
  last_name: "last_name",
  first_name: "first_name",
  medal: 1,
  points: 281,
  user: {
    user_id: 264,
    first_name: "Maria",
    last_name: "P",
    avatar: 30,
    level: {
      id: 1,
      name: "newbie",
      level_number: 1
    },
    role: "1"
  }
};

export default RewardsUser;
