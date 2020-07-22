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

import { images } from "./../InfoUserHome/InfoUserHome";
import { limitAvatar } from "./../UserItem/UserItem";
import FriendSingleView from "./../FriendSingleView/FriendSingleView";

class FriendsThreesome extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  tripleFriends = (elemTot, index) => {
    console.log(this.props.group);

    return elemTot.map((elem, id) => {
      if (elem.type) {
        // ho il type che posso usare per fare amici di fare vari tipi
        if (elem.type == "friend") {
          return (
            <FriendSingleView
              key={id + 3 * index + 1}
              user={elem}
              type={"friend"}
            />
          );
        } else if (elem.type == "sendFriend") {
          return (
            <FriendSingleView
              key={id + 3 * index + 1}
              user={elem}
              type={"sendFriend"}
            />
          );
        } else if (elem.type == "inviteFriend") {
          return (
            <FriendSingleView
              key={id + 3 * index + 1}
              user={elem}
              type={"inviteFriend"}
              action={this.props.action}
            />
          );
        }
      } else if (elem.id) {
        // amici che hanno accettato
        return (
          <FriendSingleView
            key={id + 3 * index + 1}
            user={elem}
            type={""}
          />
        );
      } else if (elem.to_user) {
        // amici a chi ho inviato la richiesta
        return (
          <FriendSingleView
            key={id + 3 * index + 1}
            user={elem.to_user}
            type={"sendFriend"}
          />
        );
      }
    });
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

            flexDirection: "row",
            justifyContent: "flex-start",
            alignContent: "center",
            alignSelf: "center",
            paddingBottom: 10,
            paddingTop: 10,
          }}
        >
          {this.tripleFriends(this.props.group, this.props.row)}
        </View>
      </View>
    );
  }
}

export default FriendsThreesome;
