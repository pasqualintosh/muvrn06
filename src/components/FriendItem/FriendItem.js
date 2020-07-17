import React from "react";
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Dimensions,
  Alert
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
  Stop
} from "react-native-svg";
import { deleteFollowedUser } from "./../../domains/standings/ActionCreators";
import Modal from "react-native-modal";
import Aux from "./../../helpers/Aux";

import { strings } from "../../config/i18n";

export function citiesImage(city) {
  switch (city) {
    case "Amsterdam":
      return 1;
      break;
    case "Barcelona":
      return 2;
      break;
    case "Fundão":
      return 3;
      break;
    case "Gent":
      return 4;
      break;
    case "Helsinki":
      return 5;
      break;
    case "Palermo":
      return 6;
      break;
    case "Katowice":
      return 7;
      break;
    case "Oostende":
      return 8;
      break;
    case "Roma":
      return 9;
      break;
    case "Šabac":
      return 10;
      break;
    case "Teresina":
      return 11;
      break;
    case "Veszprém":
      return 12;
      break;
    case "Dudelange":
      return 13;
      break;
    case "Gliwice":
      return 14;
      break;
    case "Sosnowiec":
      return 15;
      break;
    case "Milano":
      return 16;
      break;
    case "Cagliari":
      return 17;
      break;
    case "München":
      return 18;
      break;

    default:
      return 0;
      break;
  }
}

// mi da l'id di corrispondenza di una città
export function citiesId(city = "") {
  switch (city) {
    case "Amsterdam":
      return 753;
      break;
    case "Barcelona":
      return 617;
      break;
    case "Fundão":
      return 1165;
      break;
    case "Gent":
      return 915;
      break;
    case "Helsinki":
      return 869;
      break;
    case "Palermo":
      return 1122;
      break;
    case "Katowice":
      return 418;
      break;
    case "Oostende":
      return 1170;
      break;
    case "Roma":
      return 547;
      break;
    case "Šabac":
      return 1169;
      break;
    case "Teresina":
      return 1168;
      break;
    case "Veszprém":
      return 1171;
      break;
    case "Dudelange":
      return 1172;
      break;
    case "Gliwice":
      return 348;
      break;
    case "Sosnowiec":
      return 635;
      break;
    case "Milano":
      return 478;
      break;
    case "Cagliari":
      return 551;
      break;
    case "München":
      return 934;
      break;
    default:
      return 0;
      break;
  }
}

// per sapere se è girone A o B
export function divisionTournamentCitiesInA(city) {

  switch (city) {
    case "Palermo":
    case "Amsterdam":
    case "Fundão":
    case "Teresina":
    case "Milano":
    case "München":
    case "Katowice":
    case "Oostende":
      return 1;
      break;

    default:
      return 0;
      break;
  }
}


// per sapere le città che partecipano al torneo
export function TournamentCities(city) {
  console.log(city);
  switch (city) {
    case "Palermo":
    case "Amsterdam":
    case "Fundão":
    case "Roma":
    case "Helsinki":
    case "Teresina":
    case "Barcelona":
    case "Gent":
    case "Milano":
    case "Cagliari":
    case "München":
    case "Šabac":
    case "Gliwice":
    case "Sosnowiec":
    case "Katowice":
    case "Oostende":

      return 1;
      break;

    default:
      return 0;
      break;
  }
}

export const imagesCity = {
  1: require("../../assets/images/cities/amsterdam.png"),
  2: require("../../assets/images/cities/barcelona.png"),
  3: require("../../assets/images/cities/fundao.png"),
  4: require("../../assets/images/cities/ghent.png"),
  5: require("../../assets/images/cities/helsinki.png"),
  6: require("../../assets/images/cities/palermo.png"),
  7: require("../../assets/images/cities/katowice.png"),
  8: require("../../assets/images/cities/oostende.png"),
  9: require("../../assets/images/cities/roma.png"),
  10: require("../../assets/images/cities/sabac.png"),
  11: require("../../assets/images/cities/teresina.png"),
  12: require("../../assets/images/cities/veszprem.png"),
  13: require("../../assets/images/cities/dudelange.png"),
  14: require("../../assets/images/cities/gliwice.png"),
  15: require("../../assets/images/cities/sosnowiec.png"),
  16: require("../../assets/images/cities/milano.png"),
  17: require("../../assets/images/cities/cagliari.png"),
  18: require("../../assets/images/cities/munich.png")
};

export const imagesBanners = {
  1: require("../../assets/images/bandiere/Netherlands.png"),
  2: require("../../assets/images/bandiere/Spain.png"),
  3: require("../../assets/images/bandiere/Portugal.png"),
  4: require("../../assets/images/bandiere/Belgium.png"),
  5: require("../../assets/images/bandiere/Finland.png"),
  6: require("../../assets/images/bandiere/Italy.png"),
  7: require("../../assets/images/bandiere/Poland.png"),
  8: require("../../assets/images/bandiere/Belgium.png"),
  9: require("../../assets/images/bandiere/Italy.png"),
  10: require("../../assets/images/bandiere/Serbia.png"),
  11: require("../../assets/images/bandiere/Brazil.png"),
  12: require("../../assets/images/bandiere/Hungary.png"),
  13: require("../../assets/images/bandiere/Luxembourg.png"),
  14: require("../../assets/images/bandiere/Poland.png"),
  15: require("../../assets/images/bandiere/Poland.png"),
  16: require("../../assets/images/bandiere/Italy.png"),
  17: require("../../assets/images/bandiere/Italy.png"),
  18: require("../../assets/images/bandiere/Germany.png"),
};

class FriendItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modal_visible: false,
      modal_avatar: null, // int
      modal_action: null // "add" || "remove"
    };
  }

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

  renderModal() {
    let userAvatar = limitAvatar(this.props.friendData.avatar);

    const colorCircle = ["#333333", "#6CBA7E", "#E83475", "#FAB21E"];
    const colorText = ["#FFFFFF", "#000000", "#FFFFFF", "#000000"];
    const colorKpi = colorCircle[this.props.modalType];
    const colorTextRelative = colorText[this.props.modalType];
    let backgroundColor = "transparent";
    let color = this.props.fontColor ? "#fff" : "#3D3D3D";
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
                {this.props.level}
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
              {this.props.follower
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
                if (this.props.follower) {
                  this.props.addFriend(this.props.friendData.user_id);
                } else {
                  this.props.deleteFriend(this.props.friendData.user_id);
                }

                this.setState({ modal_visible: false });
              }}
            >
              <View style={styles.buttonContainer}>
                <Text style={styles.modalBtnText}>
                  {this.props.follower
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

  TrophiesView() {
    if (this.props.user.position < 4 && this.props.blockRanking) {
      const baseTrophies = this.props.activeSelectable === "global" ? 0 : 3;
      /* return (
        <Text style={[styles.userPoints, { fontSize: 16 }]}>
          <Emoji name="fire" />
        </Text>
      ); */
      return (
        <Image
          style={{ height: 40, width: 40 }}
          source={trophies[this.props.user.position + baseTrophies]}
        />
      );
    } else {
      return <View style={{ height: 20, width: 20 }} />;
    }
  }

  deleteFriend() {
    return (
      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: 15
        }}
      >
        <TouchableHighlight
          style={{
            backgroundColor: "#fff",
            height: 18,
            width: 18,
            borderRadius: 15,
            alignItems: "center",
            shadowRadius: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            elevation: 2,
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={() => {
            this.setState({ modal_visible: true }, () => { });
          }}
        >
          <OwnIcon name="delete_icn" size={18} color="#FC6754" />
          {/* <Svg height="18" width="18" viewBox="0 0 100 100" fill="white">
          <Line
            x1="30"
            y1="30"
            x2="70"
            y2="70"
            stroke="white"
            strokeWidth="2"
          />
          <Line
            x1="70"
            y1="30"
            x2="30"
            y2="70"
            stroke="white"
            strokeWidth="2"
          />
        </Svg> */}
        </TouchableHighlight>
      </View>
    );
  }

  addFriend = () => {
    return (
      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: 15
        }}
      >
        <TouchableHighlight
          style={{
            backgroundColor: "#fff",
            height: 18,
            width: 18,
            borderRadius: 15,
            alignItems: "center",
            shadowRadius: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            elevation: 2,
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={() => {
            this.setState({ modal_visible: true }, () => { });
          }}
        >
          {/* <Svg height="18" width="18" viewBox="0 0 100 100" fill="white">
            <Line
              x1="50"
              y1="25"
              x2="50"
              y2="75"
              stroke="white"
              strokeWidth="2"
            />
            <Line
              x1="25"
              y1="50"
              x2="75"
              y2="50"
              stroke="white"
              strokeWidth="2"
            />
          </Svg> */}

          <OwnIcon name="add_icn" size={18} color="#6CBA7E" />
        </TouchableHighlight>
      </View>
    );
  };

  render() {
    let userAvatar = limitAvatar(this.props.friendData.avatar);

    const colorCircle = ["#333333", "#6CBA7E", "#E83475", "#FAB21E"];
    const colorText = ["#FFFFFF", "#000000", "#FFFFFF", "#000000"];
    const colorKpi = colorCircle[this.props.modalType];
    const colorTextRelative = colorText[this.props.modalType];
    let backgroundColor = "transparent";
    let color = this.props.fontColor ? "#fff" : "#3D3D3D";
    if (this.props.rowID)
      backgroundColor = this.props.rowID % 2 === 0 ? "#F7F8F9" : "#FFFFFF";

    let add = false;
    // se sono nella schermata di chi mi segue, vedo chi posso aggiungere o gia aggiunto
    if (this.props.followed) {
      const followed = this.props.followed;
      for (i = 0; i < followed.length; i++) {
        if (followed[i].user_id == this.props.user.user_id) {
          // l'ho gia aggiunto quindi non c'e bisogno di cercare ancora
          break;
        } else if (i == followed.length - 1) {
          // se neanche l'ultimo match allora lo posso aggiungere
          add = true;
        } else {
          continue;
        }
      }
    }

    let id = 0;
    if (this.props.city && this.props.city.length) {
      // vedo se è tra le città pilota
      id = citiesImage(this.props.city);
    }

    return (
      <Aux>
        {this.renderModal()}
        <TouchableHighlight
          onPress={() =>
            this.props.goToFriend(this.props.friendData, this.props.can_follow)
          }
        >
          <View
            key={this.props.user.position}
            style={[
              styles.userContainer,
              {
                backgroundColor
              },
              this.props.style
            ]}
          >
            <View style={styles.userAvatarContainer}>
              {/* <View style={styles.userAvatar} /> */}
              <Image
                style={styles.userAvatarImage}
                source={images[userAvatar]}
              />
              <View style={[styles.userBadge, { backgroundColor: colorKpi }]}>
                <Text style={[styles.badgeText, { color: colorTextRelative }]}>
                  {this.props.level}
                </Text>
              </View>
            </View>

            <View style={styles.otherContainer}>
              <View
                style={{
                  width: 10,
                  justifyContent: "center",
                  flexDirection: "row"
                }}
              />

              <View
                style={{
                  width: Dimensions.get("window").width * 0.25 - 10,
                  justifyContent: "center",
                  flexDirection: "column",
                  height: 100,
                  alignContent: "center",

                  justifyContent: "center"
                }}
              >
                <Text style={[styles.userLabel, { color }]}>
                  {this.props.friendData.first_name
                    ? this.props.friendData.first_name.charAt(0).toUpperCase() +
                    this.props.friendData.first_name.toLowerCase().slice(1)
                    : ""}{" "}
                  {this.props.friendData.last_name
                    ? this.props.friendData.last_name
                      .substr(0, 1)
                      .toUpperCase() + "."
                    : " "}
                </Text>
              </View>

              {id ? (
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.25,
                    height: 100,
                    alignContent: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <TouchableHighlight
                    onPress={() => this.props.goToCity(id, this.props.city)}
                  // disabled={true}
                  >
                    <Image
                      source={imagesCity[id]}
                      style={{
                        width: 30,
                        height: 30
                      }}
                    />
                  </TouchableHighlight>
                </View>
              ) : (
                  <View
                    style={{
                      width: Dimensions.get("window").width * 0.25,
                      height: 100,
                      alignContent: "center",
                      flexDirection: "column",
                      justifyContent: "center",

                      alignItems: "center"
                    }}
                  >
                    <Text style={[styles.userPoints, { color }]}>
                      {this.props.city}
                    </Text>
                  </View>
                )}

              <View
                style={{
                  width: Dimensions.get("window").width * 0.25,
                  justifyContent: "center",
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  height: 100
                }}
              >
                <Text style={[styles.userIndex, { color }]}>
                  {this.props.index}
                </Text>
                <View
                  style={{
                    width: 20,
                    justifyContent: "center",
                    flexDirection: "column",
                    height: 100,
                    alignContent: "center",
                    alignItems: "center",

                    justifyContent: "center"
                  }}
                />

                {/* 
              {this.props.follower != true ? (
                add ? (
                  this.addFriend()
                ) : (
                  this.deleteFriend()
                )
              ) : (
                <View />
              )} 
              */}

                {this.props.follower ? (
                  !this.props.can_follow ? (
                    this.addFriend()
                  ) : (
                      <View />
                    )
                ) : (
                    this.deleteFriend()
                  )}
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </Aux>
    );
  }
}

const trophies = {
  1: require("../../assets/images/trophies/trophy_global_first_small.png"),
  2: require("../../assets/images/trophies/trophy_global_second_small.png"),
  3: require("../../assets/images/trophies/trophy_global_third_small.png"),
  4: require("../../assets/images/trophies/trophy_city_first_small.png"),
  5: require("../../assets/images/trophies/trophy_city_second_small.png"),
  6: require("../../assets/images/trophies/trophy_city_third_small.png")
};

export default FriendItem;
