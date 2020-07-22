import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
} from "react-native";
import { connect } from "react-redux";
import {
  postFollowUser,
  deleteFollowedUser,
  sendRequestFriend
} from "./../../domains/follow/ActionCreators";

import { strings } from "../../config/i18n";
import Modal from "react-native-modal";
import Aux from "./../../helpers/Aux";
import { styles } from "./Style";
import { images } from "./../InfoUserHome/InfoUserHome";
import { getLevelFirstCharFromInt } from "./../FriendScreen/FriendScreen";
import { limitAvatar } from "./../UserItem/UserItem";
import {
  getlistFriendState,
  getlistSendRequestFriendState,
  getStatusState,
  
} from "./../../domains/follow/Selectors";
import AlertCarPooling from "../../components/AlertCarPooling/AlertCarPooling";

class FriendScreenHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal_visible: false,
      typeFriend: "",
      userInvite: { username: "pippo", id: 0, avatar: 1 },
      AlertCarPooling: false,
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(props) {
    console.log("componentWillReceiveProps", props);
    console.log("this.props", this.props);
    // appena ricevo l'utente o nuovi amici ricalcolo l'amicizia, o dopo aver mandato la richiesta
    if (!this.props.user && props.user) {
      const typeFriend = this.checkStatusFriendFromId(props.user.id, props);
      this.setState({
        typeFriend,
      });
    } else if (
      props.user &&
      this.props.listFriend.length != props.listFriend.length
    ) {
      const typeFriend = this.checkStatusFriendFromId(props.user.id, props);
      this.setState({
        typeFriend,
      });
    } else if (
      props.user &&
      this.props.listRequestFriend.length != props.listRequestFriend.length
    ) {
      const typeFriend = this.checkStatusFriendFromId(props.user.id,props );
      this.setState({
        typeFriend,
      });
    }
  }

  /**
   * controlla se l'id passato
   * è un utente che segui
   */
  checkFollowingFromId = (id) => {
    return this.props.followState.followed.filter(
      (item) => item.user_followed.user_id == id
    ).length > 0
      ? true
      : false;
  };

  checkStatusFriendFromId = (id, props) => {
    let typeFriend = "";
    if (props.listFriend.findIndex((friend) => friend.id == id) != -1) {
      // è un mio amico
      typeFriend = "friend";
    } else if (
      props.listRequestFriend.findIndex(
        (friend) => friend.to_user.id == id
      ) != -1
    ) {
      // l'ho gia invitato
      typeFriend = "sendFriend";
    }
    return typeFriend;
  };

  getFeedContentFromString = (str, rplc_text) => {
    let first_perc = str.indexOf("%");
    let last_perc = str.indexOf("%", first_perc + 1);
    let introduction = str.substr(0, first_perc);
    let ending = str.substr(last_perc + 1, str.length);

    return (
      <Text style={styles.textDescr}>
        {introduction}
        <Text style={styles.textDescrBold}>{rplc_text}</Text>
        {ending}
      </Text>
    );
  };

  deleteFriend = (id) => {
    this.props.dispatch(deleteFollowedUser({ id }));
  };

  addFriend = (id) => {
    let link = this.props.friendData["~referring_link"];
    if (link) {
      this.props.dispatch(
        postFollowUser({
          followed_user_id: id,
          referral_url: link,
        })
      );
    } else {
      this.props.dispatch(
        postFollowUser({
          followed_user_id: id,
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
              width: Dimensions.get("window").width * 0.6,
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
                  { borderRightColor: "#707070", borderRightWidth: 1 },
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

  closeTutorialCarPooling = () => {
    this.setState({
      AlertCarPooling: false,
    });
  };

  sendRequest = (data) => {
    sendRequestFriend(data);
    this.closeTutorialCarPooling();
  };

  showAlertCarPooling = (userInvite) => {
    this.setState({
      AlertCarPooling: true,
      userInvite,
    });
  };

  render() {
    // prendo l'id dell'utente a seconda se sono nella lista amici o se mi arriva il link
    const user_id =
      this.props.user && this.props.user.id ? this.props.user.id : 0;
    // se non ho l'id dell'utente, sto caricando
    let button = <View />;
    if (!user_id || this.props.fetchingData) {
      button = (
        <Aux>
          <View style={styles.endFlex}>
            <View style={styles.mainContainer}>
              <View style={styles.sideContainer}>
                <ActivityIndicator
                  // hidesWhenStopped={false}
                  // animating={this.props.fetchingData}
                  size="small"
                  color={"#fff"}
                />
              </View>
            </View>
          </View>
        </Aux>
      );
    } else if (this.state.typeFriend == "friend")
      button = (
        <Aux>
          <View style={styles.endFlex}>
            <View style={styles.mainContainer}>
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
                  <Text style={styles.text}>Unfollow</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Aux>
      );
    else if (this.state.typeFriend == "sendFriend")
      button = (
        <Aux>
          <View style={styles.endFlex}>
            <View style={styles.mainContainer}>
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
                  <Text style={styles.text}>Wait</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Aux>
      );
    else
      button = (
        <Aux>
          <View style={styles.endFlex}>
            <View style={styles.mainContainer}>
              <TouchableWithoutFeedback
                // onPress={() =>
                //   this.props.dispatch(deleteFollowedUser({ id: user_id }))
                // }
                onPress={() => {
                  this.showAlertCarPooling(this.props.user)
                }}
              >
                <View
                  style={[styles.sideContainer, { backgroundColor: "#FC6754" }]}
                >
                  <Text style={[styles.text, { color: "#fff" }]}>Follow</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Aux>
      );

    return (
      <Aux>
        <AlertCarPooling
          isModalVisible={this.state.AlertCarPooling}
          closeModal={this.closeTutorialCarPooling}
          confermModal={this.sendRequest}
          type={"SearchFriend"}
          infoAlert={this.state.userInvite}
          infoSend={{ message: "", to_user: this.state.userInvite.id }}
        />
        {button}
      </Aux>
    );
  }
}

const withData = connect((state) => {
  return {
    listFriend: getlistFriendState(state),
    listRequestFriend: getlistSendRequestFriendState(state),
    fetchingData: getStatusState(state),
  };
});

export default withData(FriendScreenHeader);
