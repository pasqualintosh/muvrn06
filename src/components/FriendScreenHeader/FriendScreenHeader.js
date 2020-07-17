import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image
} from "react-native";
import { connect } from "react-redux";
import {
  postFollowUser,
  deleteFollowedUser
} from "./../../domains/follow/ActionCreators";

import { strings } from "../../config/i18n";
import Modal from "react-native-modal";
import Aux from "./../../helpers/Aux";
import { styles } from "./Style";
import { images } from "./../InfoUserHome/InfoUserHome";
import { getLevelFirstCharFromInt } from "./../FriendScreen/FriendScreen";
import { limitAvatar } from "./../UserItem/UserItem";

class FriendScreenHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal_visible: false
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(props) {
    console.log("componentWillReceiveProps", props);
  }

  /**
   * controlla se l'id passato
   * è un utente che segui
   */
  checkFollowingFromId = id => {
    return this.props.followState.followed.filter(
      item => item.user_followed.user_id == id
    ).length > 0
      ? true
      : false;
  };

  getFeedContentFromString = (str, rplc_text) => {
    let first_perc = str.indexOf("%");
    let last_perc = str.indexOf("%", first_perc + 1);
    let introduction = str.substr(0, first_perc);
    let ending = str.substr(last_perc + 1, str.lenght);

    return (
      <Text style={styles.textDescr}>
        {introduction}
        <Text style={styles.textDescrBold}>{rplc_text}</Text>
        {ending}
      </Text>
    );
  };

  deleteFriend = id => {
    this.props.dispatch(deleteFollowedUser({ id }));
  };

  addFriend = id => {
    let link = this.props.friendData["~referring_link"];
    if (link) {
      this.props.dispatch(
        postFollowUser({
          followed_user_id: id,
          referral_url: link
        })
      );
    } else {
      this.props.dispatch(
        postFollowUser({
          followed_user_id: id
        })
      );
    }
  };

  renderModal(user_id) {
    let userAvatar = limitAvatar(this.props.friendData.avatar);

    const level = this.props.friendData.level
    ? typeof this.props.friendData.level === "string"
      ? JSON.parse(this.props.friendData.level)
        ? JSON.parse(this.props.friendData.level).level_number
          ? JSON.parse(this.props.friendData.level).level_number
          : 1
        : 1
      : this.props.friendData.level
    : 1;

    let role = 0;
    if (this.props.friendData.role) {
      if (
        this.props.friendData.role === "none" ||
        this.props.friendData.role === "muver" ||
        this.props.friendData.role === "Null"
      ) {
        role = 0;
      } else {
        role = this.props.friendData.role;
      }
    }

    const colorCircle = ["#333333", "#6CBA7E", "#E83475", "#FAB21E"];
    const colorText = ["#FFFFFF", "#000000", "#FFFFFF", "#000000"];
    const colorKpi = colorCircle[role];
    const colorTextRelative = colorText[role];

    const follower = !this.checkFollowingFromId(user_id);
    return (
      <Modal
        isVisible={this.state.modal_visible}
        onBackdropPress={() => this.setState({ modal_visible: false })}
        onBackButtonPress={() => this.setState({ modal_visible: false })}
      >
        <View style={styles.modalContainer}>
          <View style={styles.userAvatarContainer}>
            <Image style={styles.userAvatarImage} source={images[userAvatar]} />
            <View style={[styles.userBadge, { backgroundColor: colorKpi }]}>
              <Text style={[styles.badgeText, { color: colorTextRelative }]}>
                {getLevelFirstCharFromInt(level)}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 20,
              width: Dimensions.get("window").width * 0.6
            }}
          >
            <Text style={styles.modalText}>
              {follower
                ? this.getFeedContentFromString(
                    strings("_571_are_you_sure_yo"),
                    this.props.friendData.first_name
                  )
                : this.getFeedContentFromString(
                    strings("_572_are_you_sure_yo"),
                    this.props.friendData.first_name
                  )}
            </Text>
          </View>

          <View style={styles.modalButtonsContainer}>
            <TouchableWithoutFeedback
              style={styles.buttonContainer}
              onPress={() => {
                this.setState({ modal_visible: false });
              }}
            >
              <View
                style={[
                  styles.buttonContainer,
                  { borderRightColor: "#707070", borderRightWidth: 1 }
                ]}
              >
                <Text style={styles.modalBtnText}>
                  {strings("cancel").toUpperCase()}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={styles.buttonContainer}
              onPress={() => {
                if (follower) {
                  this.addFriend(user_id);
                } else {
                  this.deleteFriend(user_id);
                }

                this.setState({ modal_visible: false });
              }}
            >
              <View style={styles.buttonContainer}>
                <Text style={styles.modalBtnText}>
                  {follower
                    ? strings("follow").toUpperCase()
                    : strings("unfollow").toUpperCase()}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    // prendo l'id dell'utente a seconda se sono nella lista amici o se mi arriva il link
    const user_id = this.props.friendData.user_id
      ? this.props.friendData.user_id
      : this.props.friendData.sender_id;
    if (!this.checkFollowingFromId(user_id))
      return (
        <Aux>
          {this.renderModal(user_id)}
          <View style={styles.endFlex}>
            <View style={styles.mainContainer}>
              {/* <Text style={styles.textDescrInvite}>
              {this.getFeedContentFromString(
                strings("_571_are_you_sure_yo"),
                this.props.friendData.first_name
                  ? this.props.friendData.first_name
                  : ""
              )}
            </Text> */}
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({ modal_visible: true });
                }}
                // onPress={() => {
                //   let link = this.props.friendData["~referring_link"];
                //   this.props.dispatch(
                //     postFollowUser({
                //       followed_user_id: user_id,
                //       referral_url: link
                //     })
                //   );
                // }}
              >
                <View style={styles.sideContainer}>
                  {this.props.followState.fetchingData ? (
                    <ActivityIndicator
                      hidesWhenStopped={false}
                      animating={this.props.followState.fetchingData}
                      size="small"
                      // color={"#fff"}
                    />
                  ) : (
                    <Text style={styles.text}>Follow</Text>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Aux>
      );
    else
      return (
        <Aux>
          {this.renderModal(user_id)}
          <View style={styles.endFlex}>
            <View style={styles.mainContainer}>
              {/* <Text style={styles.textDescrInvite}>
                {this.getFeedContentFromString(
                strings("_572_are_you_sure_yo"),
                this.props.friendData.first_name
                  ? this.props.friendData.first_name
                  : ""
              )} 
              </Text>*/}
              <TouchableWithoutFeedback
                // onPress={() =>
                //   this.props.dispatch(deleteFollowedUser({ id: user_id }))
                // }
                onPress={() => {
                  this.setState({ modal_visible: true });
                }}
              >
                <View
                  style={[styles.sideContainer, { backgroundColor: "#FC6754" }]}
                >
                  {this.props.followState.fetchingData ? (
                    <ActivityIndicator
                      hidesWhenStopped={false}
                      animating={this.props.followState.fetchingData}
                      size="small"
                      color={"#fff"}
                    />
                  ) : (
                    <Text style={[styles.text, { color: "#fff" }]}>
                      Unfollow
                    </Text>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Aux>
      );
  }
}

const withData = connect(state => {
  return {
    followState: state.follow
  };
});

export default withData(FriendScreenHeader);
