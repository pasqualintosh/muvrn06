import React from "react";
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";

import { styles } from "./Style";
import Emoji from "@ardentlabs/react-native-emoji";

import pointsDecimal from "../../helpers/pointsDecimal";
import { images } from "./../InfoUserHome/InfoUserHome";
import OwnIcon from "../OwnIcon/OwnIcon";
import { citiesImage, imagesCity } from "../FriendItem/FriendItem";
import { getSponsor } from "./../../helpers/Sponsors.js";
import Settings from "./../../config/Settings";





// limiti l'avatar per gli avatar disponibili
export function limitAvatar(avatar) {
  if (avatar <= 73 && avatar > 0) {
    return avatar;
  } else {
    return 1;
  }
}

class UserItemCommunity extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    
  }



  render() {
   
    let userAvatar = limitAvatar(this.props.user.referred_route__user__avatar);

   
    return (
      <View style={{ width: Dimensions.get("window").width - 20, marginRight: 10, marginLeft: 10, height: 70, flexDirection: "row", alignContent: "center", alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#FFFFFF', borderBottomWidth: 1}}>
           <View style={styles.userPositionContainer}>
            <Text style={styles.userPosition}>
            {this.props.user.position}
            </Text>
          </View>
          <Image style={styles.userAvatarImage} source={images[userAvatar]} />
          <View style={{ width: 20 }} />
          <View style={styles.ViewLabel}>
              <Text style={styles.userLabel}>
                {this.props.user.referred_route__user__first_name
                  ? this.props.user.referred_route__user__first_name
                      .charAt(0)
                      .toUpperCase() +
                    this.props.user.referred_route__user__first_name
                      .toLowerCase()
                      .slice(1)
                  : ""}{" "}
                {this.props.user.referred_route__user__last_name
                  ? this.props.user.referred_route__user__last_name.substr(
                      0,
                      1
                    ) + "."
                  : " "}
              </Text>
            </View>
            <View style={{ width: 10 }} />
            <View
              style={{
                width: 50,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={styles.userPoints}>
                {pointsDecimal(
                  this.props.user.points ? this.props.user.points : 0
                )}
              </Text>
            </View>
           </View>);
  }
}

UserItemCommunity.defaultProps = {
  colorStar: "#fab21e"
};

const trophies = {
  1: require("../../assets/images/trophies/trophy_global_first_small.png"),
  2: require("../../assets/images/trophies/trophy_global_second_small.png"),
  3: require("../../assets/images/trophies/trophy_global_third_small.png"),
  4: require("../../assets/images/trophies/trophy_city_first_small.png"),
  5: require("../../assets/images/trophies/trophy_city_second_small.png"),
  6: require("../../assets/images/trophies/trophy_city_third_small.png")
};

export default UserItemCommunity;
