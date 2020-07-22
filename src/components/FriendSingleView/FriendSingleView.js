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

class FriendSingleView extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  addTypeImage = () => {
    if (this.props.type == "sendFriend") {
      return (
        <TouchableOpacity onPress={() => {}} style={{
          width: Dimensions.get("window").width * 0.08,
          height: Dimensions.get("window").width * 0.08,
          alignSelf: "center",
          position: "absolute",
          top: Dimensions.get("window").width * 0.2,
          left: Dimensions.get("window").width * 0.2,
        }}>
        <Image
          source={require("../../assets/images/friend/friend_wait_icn.png")}
          style={{
            width: Dimensions.get("window").width * 0.08,
            height: Dimensions.get("window").width * 0.08,
            
            
          }}
        />
        </TouchableOpacity>
      );
    } else if (this.props.type == "friend") {
      return (
        <TouchableOpacity onPress={() => {}} style={{
          width: Dimensions.get("window").width * 0.08,
          height: Dimensions.get("window").width * 0.08,
          alignSelf: "center",
          position: "absolute",
          top: Dimensions.get("window").width * 0.2,
          left: Dimensions.get("window").width * 0.2,
        }}>
        <Image
          source={require("../../assets/images/friend/friend_ok_icn.png")}
          style={{
            width: Dimensions.get("window").width * 0.08,
            height: Dimensions.get("window").width * 0.08,
           
          }}
        />
        </TouchableOpacity>
      );
    }  else if (this.props.type == "inviteFriend") {
      return (
        <TouchableOpacity onPress={this.sendFriend} style={{
          width: Dimensions.get("window").width * 0.08,
          height: Dimensions.get("window").width * 0.08,
          alignSelf: "center",
          position: "absolute",
          top: Dimensions.get("window").width * 0.2,
          left: Dimensions.get("window").width * 0.2,
        }}>
        <Image
          source={require("../../assets/images/friend/friend_add_icn.png")}
          style={{
            width: Dimensions.get("window").width * 0.08,
            height: Dimensions.get("window").width * 0.08,
            
          }}
        />
        </TouchableOpacity>
      );
    } else {
      return <View />;
    }

    
  };

  // invite = () => {
  //   if (this.props.type == "sendFriend") {
  //     // gia invitato
      
  //   } else if (this.props.type == "friend") {
  //     // gia amici 
  //   }  else if (this.props.type == "inviteFriend") {
  //     // posso invitare 
  //   } else {
  //     // altri casi ma siamo gia amici 
  //   }

    
  // };

  sendFriend = () => {
this.props.action(this.props.user)
  }

  render() {
    return (
      <TouchableOpacity onPress={() => {}}>
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
              source={this.props.user.photoPath ? {uri: this.props.user.photoPath} : images[limitAvatar(this.props.user.avatar)]}
              style={{
                width: Dimensions.get("window").width * 0.23,
                height: Dimensions.get("window").width * 0.23,
                alignSelf: "center",
              }}
            />
            {this.addTypeImage()}
          </ImageBackground>
          <Text
            style={{
              paddingTop: 5,
              textAlign: "center",
              fontFamily: "Montserrat-ExtraBold",

              color: "#3D3D3D",
              fontSize: 14,
            }}
          >
            {this.props.user.username}
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
            {" "}{/*  Newbie */}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default FriendSingleView;
