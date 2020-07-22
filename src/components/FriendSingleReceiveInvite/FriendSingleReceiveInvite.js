import React from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";

import { styles } from "./Style";
import Emoji from "@ardentlabs/react-native-emoji";

import pointsDecimal from "../../helpers/pointsDecimal";
import { images } from "./../InfoUserHome/InfoUserHome";
import { limitAvatar } from "./../UserItem/UserItem";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";

import Svg, {
  Circle,
  LinearGradient,
  Line,
  Defs,
  Stop,
} from "react-native-svg";
import { deleteFollowedUser } from "./../../domains/standings/ActionCreators";
import Modal from "react-native-modal";
import Aux from "./../../helpers/Aux";

import { strings } from "../../config/i18n";
import { responseRequestFriend } from "../../domains/follow/ActionCreators";

class FriendSingleReceiveInvite extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  singleRow = (elem, index) => {
    // amici a chi devo accettare o no la richiesta
    return (
      <View
        key={index}
        style={{
          width: Dimensions.get("window").width * 0.9,
          marginBottom: 20,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width * 0.3,

            flexDirection: "column",
            justifyContent: "flex-start",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <ImageBackground
            style={{
              width: Dimensions.get("window").width * 0.28,
              height: Dimensions.get("window").width * 0.28,
              alignSelf: "center",
              justifyContent: "center",
            }}
            source={require("../../assets/images/rewards_item_bg.png")}
          >
            <Image
              source={images[limitAvatar(elem.from_user.avatar)]}
              style={{
                width: Dimensions.get("window").width * 0.23,
                height: Dimensions.get("window").width * 0.23,
                alignSelf: "center",
              }}
            />
          </ImageBackground>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width * 0.3,

            flexDirection: "column",
            justifyContent: "flex-start",
            alignContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              paddingTop: 5,
              textAlign: "center",
              fontFamily: "Montserrat-ExtraBold",

              color: "#3D3D3D",
              fontSize: 14,
            }}
          >
            {elem.from_user.username}
          </Text>
          <Text
            style={{
              paddingTop: 3,
              textAlign: "center",
              fontFamily: "OpenSans-Regular",

              color: "#3D3D3D",
              fontSize: 10,
            }}
          >
            Newbie
          </Text>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width * 0.3,

            flexDirection: "row",
            justifyContent: "space-around",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() =>
              responseRequestFriend({
                other_user: elem.from_user.id,
                accept: true,
              })
            }
          >
            <Image
              source={require("../../assets/images/check_green_icn.png")}
              style={{
                width: Dimensions.get("window").width * 0.1,
                height: Dimensions.get("window").width * 0.1,

                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              responseRequestFriend({
                other_user: elem.from_user.id,
                accept: false,
              })
            }
          >
            <Image
              source={require("../../assets/images/cancel_icn.png")}
              style={{
                width: Dimensions.get("window").width * 0.1,
                height: Dimensions.get("window").width * 0.1,
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "flex-start",

          alignSelf: "center",

          width: Dimensions.get("window").width * 0.9,
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width * 0.9,

            flexDirection: "column",
            justifyContent: "flex-start",
            alignContent: "center",
            alignSelf: "center",

            paddingTop: 25,
            //  paddingBottom: 20,
            borderBottomColor: "#FAB21E",
            borderBottomWidth: 4,
            borderRadius: 2,
          }}
        >
          {this.props.invites.map((elem, index) => this.singleRow(elem, index))}
        </View>
      </View>
    );
  }
}

export default FriendSingleReceiveInvite;
