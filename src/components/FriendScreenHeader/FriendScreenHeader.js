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
  sendRequestFriend,
  deleteFriend
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

import LinearGradient from "react-native-linear-gradient";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

class FriendScreenHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal_visible: false,
      typeFriend: "AddFriend",
      userInvite: { username: "pippo", id: 0, avatar: 1 },
      AlertCarPooling: false,
    };
  }

  componentDidMount() {
    const typeFriend = this.checkStatusFriendFromId(this.props.user.id, this.props);
      this.setState({
        typeFriend,
      });
  }

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
      const typeFriend = this.checkStatusFriendFromId(props.user.id, props);
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
    console.log(id)
    console.log(props)
    let typeFriend = "AddFriend";
    if (props.listFriend.findIndex((friend) => friend.id == id) != -1) {
      // è un mio amico
      typeFriend = "friend";
    } else if (
      props.listRequestFriend.findIndex((friend) => friend.to_user.id == id) !=
      -1
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

  sendDeleteFriend = (data) => {
    deleteFriend(data);
    this.closeTutorialCarPooling();
  }

  showAlertCarPooling = (userInvite) => {
    this.setState({
      AlertCarPooling: true,
      userInvite,
    });
  };

  sendRequestConfirm = (data) => {
    if (this.state.typeFriend == "AddFriend") {
      this.sendRequest(data)
    } else if (this.state.typeFriend == "friend") {
      this.sendDeleteFriend(data)
    } else {
      this.closeTutorialCarPooling();
    }
  }

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
            <LinearGradient
              start={{ x: 0.2, y: 1.0 }}
              end={{ x: 0.8, y: 0.0 }}
              locations={[0, 1.0]}
              colors={["#7D4D99", "#6497CC"]}
              style={styles.mainContainer}
            >
              <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                <ActivityIndicator
                  // hidesWhenStopped={false}
                  // animating={this.props.fetchingData}
                  size="small"
                  color={"#fff"}
                />
              </View>
            </LinearGradient>
          </View>
        </Aux>
      );
    } else if (this.state.typeFriend == "friend")
      button = (
        <Aux>
          <View style={styles.endFlex}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.showAlertCarPooling(this.props.user);
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
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1.0 }}
                locations={[0, 1.0]}
                colors={["#920005", "#DC4711"]}
                style={styles.mainContainer}
              >
                <Text style={styles.text}>Unfollow</Text>
                <View style={{ paddingLeft: 10 }}>
                  <OwnIcon
                    name="eliminate_friend_icn"
                    size={20}
                    color={"#FFFFFF"}
                  />
                </View>
              </LinearGradient>
            </TouchableWithoutFeedback>
          </View>
        </Aux>
      );
    else if (this.state.typeFriend == "sendFriend")
      button = (
        <Aux>
          <View style={styles.endFlex}>
            
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1.0 }}
                locations={[0, 1.0]}
                colors={["#FAB21E", "#FA941E"]}
                style={styles.mainContainer}
              >
                <Text style={styles.text}>Attendi</Text>
                <View style={{ paddingLeft: 10 }}>
                  <OwnIcon
                    name="wait_for_friend_icn"
                    size={20}
                    color={"#FFFFFF"}
                  />
                </View>
              </LinearGradient>
            
          </View>
        </Aux>
      );
    else 
      button = (
        <Aux>
          <View style={styles.endFlex}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.showAlertCarPooling(this.props.user);
              }}
            >
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1.0 }}
                locations={[0, 1.0]}
                colors={["#6CBA7E", "#007C1C"]}
                style={styles.mainContainer}
              >
                <Text style={[styles.text, { color: "#fff" }]}>AGGIUNGI</Text>
                <View style={{ paddingLeft: 10 }}>
                  <OwnIcon name="add_friend_icn" size={20} color={"#FFFFFF"} />
                </View>
              </LinearGradient>
            </TouchableWithoutFeedback>
          </View>
        </Aux>
      );

    return (
      <Aux>
        <AlertCarPooling
          isModalVisible={this.state.AlertCarPooling}
          closeModal={this.closeTutorialCarPooling}
          confermModal={this.sendRequestConfirm}
          type={this.state.typeFriend}
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
