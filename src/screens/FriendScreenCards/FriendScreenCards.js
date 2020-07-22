import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Image,
  ImageBackground,
  NativeModules,
  Share,
  ScrollView,
  ActivityIndicator,
  TouchableHighlight
} from "react-native";
import CardFlip from "react-native-card-flip";
import SvgPolygon from "./../../components/SvgPolygon/SvgPolygon";
import FriendScreenCardsFooter from "./../../components/FriendScreenCardsFooter/FriendScreenCardsFooter";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import pointsDecimal from "../../helpers/pointsDecimal";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";
import DescriptionIcon from "./../../components/DescriptionIcon/DescriptionIcon";

import Settings from "./../../config/Settings";

// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

import { strings } from "../../config/i18n";

import {
  images,
  backgroundImage
} from "../../components/ProfileScreenCards/ProfileScreenCards";
import { getUserInfo, getUserInfoNew } from "./../../domains/follow/ActionCreators";
import { limitAvatar } from "../../components/UserItem/UserItem";
import {
  citiesImage,
  citiesId,
  imagesCity
} from "../../components/FriendItem/FriendItem";
import { data } from "./../../assets/ListCities";
import SponsorCard from "../../components/SponsorCard/SponsorCard";
import { getSponsor } from "./../../helpers/Sponsors.js";
import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from "react-native-google-analytics-bridge";

let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);

import analytics from "@react-native-firebase/analytics";
async function trackScreenView(screen) {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
}

class FriendScreenCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalActive: false,
      iconChoose: "round_info_icn",
      user: null
    };
  }

  callback = data => {
    this.setState({
      user: data
    });
  };

  componentDidMount() {
    console.log(this.props.friendData);
    
    
      const username = this.props.friendData.username;
      console.log(username);
      if (username) {
        // chiedo i dati al db
      this.props.dispatch(getUserInfoNew({ username }, this.callback));

      }
      
    }
  

  componentWillMount() {
   
    let communityInfo = { sponsor: false };
    console.log(this.props.friendData);
    if (
      this.props.friendData.community &&
      this.props.friendData.community.name
    ) {
      communityInfo = getSponsor(this.props.friendData.community.name);
    }

    if (communityInfo.sponsor && communityInfo.name) {
      Tracker.trackScreenView("Friends " + communityInfo.name);
      trackScreenView("Friends " + communityInfo.name);
    }
  }

  DescriptionIconModal = typeIcon => {
    // Alert.alert("weather");
    this.setState({
      modalActive: true,
      iconChoose: typeIcon
    });
  };

  DeleteDescriptionIconModal = () => {
    // Alert.alert("weather");
    this.setState({
      modalActive: false
    });
  };

  isInt(value) {
    return (
      !isNaN(value) &&
      parseInt(Number(value)) == value &&
      !isNaN(parseInt(value, 10))
    );
  }

  share = () => {
    Share.share(
      {
        message:
          "Wow, did you see that? Share and download MUV: https://www.muvapp.eu/muv/#download",
        url: "https://www.muvapp.eu/muv/#download",
        title: "Wow, did you see that? Share and download MUV"
      },
      {
        // Android only:
        dialogTitle: "Share and download MUV",
        // iOS only:
        excludedActivityTypes: []
      }
    );
  };

  moveGlobalRanking = () => {
    this.props.navigation.navigate("GlobalStandingsScreen");
  };

  getLevelFromInt(level) {
    switch (level) {
      case 1:
        return "NEWBIE";
        break;

      case 2:
        return "ROOKIE";
        break;
      case 3:
        return "PRO";
        break;
      case 4:
        return "STAR";
        break;

      default:
        return "NEWBIE";
        break;
    }
  }

  goToCity = (id, city) => {
    const cityId = citiesId(city);

    if (
      this.props.navigation.state.routeName === "StandingsScreen" ||
      this.props.navigation.state.routeName === "FriendDetailFromStanding"
    ) {
      this.props.navigation.navigate("CityDetailScreenBlurFromStanding", {
        city: id,
        cityName: city,
        cityId
      });
    } else {
      this.props.navigation.navigate("CityDetailScreenBlurFromGlobal", {
        city: id,
        cityName: city,
        cityId
      });
    }
  };

  render() {
    let avatarId = limitAvatar(
      this.props.friendData
        ? this.props.friendData.avatar
          ? this.props.friendData.avatar
          : 1
        : 1
    );

    console.log(this.props.friendData);

    // se è una stringa la uso direttamente,
    // se è un id lo converto prima in stringa

    let city = this.props.friendData
      ? this.props.friendData.city
        ? Number.isInteger(this.props.friendData.city)
          ? data.cities[this.props.friendData.city - 1]
            ? data.cities[this.props.friendData.city - 1].name
            : ""
          : this.props.friendData.city
        : ""
      : "";
    console.log(city);
    let id = citiesImage(city);

    let role = 0;
    if (this.props.friendData.role) {
      if (
        this.props.friendData.role == "none" ||
        this.props.friendData.role == "muver" ||
        this.props.friendData.role == "Null"
      ) {
        role = 0;
      } else {
        role = this.props.friendData.role;
      }
    }

    const colorCircle = ["#60368C", "#6CBA7E", "#E83475", "#FAB21E"];
    const colorRGBA = [
      "rgba(96, 54, 140, 0.5)",
      "rgba(108, 186, 126, 0.5)",
      "rgba(232, 52, 117, 0.5)",
      "rgba(250, 178, 30, 0.5)"
    ];
    const colorText = ["#FFFFFF", "#000000", "#FFFFFF", "#000000"];

    const colorProfile = colorRGBA[role];
    const colorTitle = colorCircle[role];
    const colorName = colorText[role];

    let walk = 0;
    let bike = 0;
    let publicTrasport = 0;
    let overall = 0;
    let coins = 0;
    let points = 0;

    // a seconda che l'index sia presente o no
    const indexRoleCheck = this.props.friendData.roleIndex ? true : false;

    if (!indexRoleCheck) {
      // aprendo da follow o da standings
      points = this.state.user
        ? this.state.user.points
          ? this.state.user.points
          : 0
        : 0;
      coins = this.state.user
        ? this.state.user.coins
          ? this.state.user.coins
          : 0
        : 0;
      if (this.state.user && this.state.user.indexes.length) {
        this.state.user.indexes.forEach(elem => {
          if (elem.modal === 1) {
            walk = parseInt(elem.index);
          } else if (elem.modal === 2) {
            bike = parseInt(elem.index);
          } else if (elem.modal === 3) {
            publicTrasport = parseInt(elem.index);
          } else if (elem.overall_index) {
            overall = parseInt(elem.overall_index);
          }
        });
      }
    } else {
      // ricevendo il link
      coins = this.props.friendData.coins;
      points = this.props.friendData.points;
      const indexRole = this.props.friendData.roleIndex
        ? this.props.friendData.roleIndex
          ? JSON.parse(this.props.friendData.roleIndex).indexRole
          : []
        : [];

      console.log(indexRole);
      if (indexRole.length) {
        indexRole.forEach(elem => {
          if (elem.modal === 1) {
            walk = parseInt(elem.index);
          } else if (elem.modal === 2) {
            bike = parseInt(elem.index);
          } else if (elem.modal === 3) {
            publicTrasport = parseInt(elem.index);
          } else if (elem.overall_index) {
            overall = parseInt(elem.overall_index);
          }
        });
      }
    }

    const level = this.props.friendData.level
      ? typeof this.props.friendData.level === "string"
        ? JSON.parse(this.props.friendData.level)
          ? JSON.parse(this.props.friendData.level).level_number
            ? JSON.parse(this.props.friendData.level).level_number
            : 1
          : 1
        : this.props.friendData.level
        ? this.props.friendData.level.level_number
          ? this.props.friendData.level.level_number
          : this.props.friendData.level
        : 1
      : 1;

    console.log(level);
    console.log(avatarId);
    console.log(role);
    let communityInfo = { sponsor: false };
    console.log(this.props.friendData);
    if (
      this.props.friendData.community &&
      this.props.friendData.community.name
    ) {
      communityInfo = getSponsor(this.props.friendData.community.name);
    }

    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          // marginTop: Dimensions.get("window").height * 0.12
          marginTop: 10
        }}
      >
        <DescriptionIcon
          active={this.state.modalActive}
          icon={this.state.iconChoose}
          DeleteDescriptionIconModal={this.DeleteDescriptionIconModal}
        />
        {indexRoleCheck ? (
          <CardFlip
            style={styles.cardContainer}
            ref={card => (this.card = card)}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.card}
              onPress={() => this.card.flip()}
            >
              <View style={styles.contentContainer}>
                <ImageBackground
                  source={backgroundImage[role]}
                  style={[styles.content, { backgroundColor: colorProfile }]}
                >
                  <View>
                    <View
                      style={{
                        position: "absolute",
                        right: 5,
                        top: 5
                      }}
                    >
                      <OwnIcon
                        name="rotate_card_icn"
                        size={20}
                        color={colorName}
                        click={() => this.card.flip()}
                      />
                    </View>
                    <Text style={[styles.nameText, { color: colorName }]}>
                      {this.props.friendData.first_name
                        ? this.props.friendData.first_name.toUpperCase() +
                          " " +
                          this.props.friendData.last_name
                            .charAt(0)
                            .toUpperCase() +
                          "."
                        : " Mario R."}
                    </Text>
                    <Text style={[styles.levelText, { color: colorTitle }]}>
                      {this.getLevelFromInt(level)}
                    </Text>
                  </View>
                  <Image
                    style={styles.avatarImage}
                    // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
                    source={
                      this.isInt(avatarId) &&
                      this.isInt(role) &&
                      this.isInt(level)
                        ? images[avatarId][role][level - 1]
                        : images[0][0][0]
                    }
                  />
                </ImageBackground>
                <View
                  style={{
                    height: Dimensions.get("window").height * 0.1,
                    flexDirection: "column",
                    justifyContent: "center"
                  }}
                >
                  {indexRoleCheck ? (
                    <FriendScreenCardsFooter
                      walk={walk}
                      bike={bike}
                      publicTrasport={publicTrasport}
                      overall={overall}
                      style={{ marginTop: -15 }}
                      avatarId={avatarId}
                    />
                  ) : (
                    <View />
                  )}x
                </View>
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity
              activeOpacity={1}
              style={styles.card}
              onPress={() => this.card.flip()}
            >
              <SvgPolygon
                walk={walk}
                bike={bike}
                publicTrasport={publicTrasport}
                overall={overall}
                level={this.getLevelFromInt(level)}
                colorProfile={"#000000"}
                colorTitle={colorTitle}
                avatarId={avatarId}
                first_name={this.props.friendData.first_name}
                last_name={this.props.friendData.last_name}
                onPress={() => this.card.flip()}
              />
            </TouchableOpacity> */}
          </CardFlip>
        ) : (
          <CardFlip
            style={styles.cardContainer}
            ref={card => (this.card = card)}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.card}
              onPress={() => this.card.flip()}
              disabled={!this.state.user}
            >
              <View style={styles.contentContainer}>
                <ImageBackground
                  source={backgroundImage[role]}
                  style={[styles.content, { backgroundColor: colorProfile }]}
                >
                  {this.state.user ? (
                    <View
                      style={{
                        position: "absolute",
                        right: 5,
                        top: 5
                      }}
                    >
                      <OwnIcon
                        name="rotate_card_icn"
                        size={20}
                        color={colorName}
                        click={() => this.card.flip()}
                      />
                    </View>
                  ) : (
                    <View />
                  )}

                  <View>
                    <Text style={[styles.nameText, { color: colorName }]}>
                      {this.props.friendData.first_name
                        ? this.props.friendData.first_name.toUpperCase() +
                          " " +
                          this.props.friendData.last_name
                            .charAt(0)
                            .toUpperCase() +
                          "."
                        : " Mario R."}
                    </Text>
                    <Text style={[styles.levelText, { color: colorTitle }]}>
                      {this.getLevelFromInt(level)}
                    </Text>
                  </View>
                  <Image
                    style={styles.avatarImage}
                    // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
                    source={images[avatarId][role][level - 1]}
                  />
                </ImageBackground>
                <View
                  style={{
                    height: Dimensions.get("window").height * 0.1,
                    flexDirection: "column",
                    justifyContent: "center"
                  }}
                >
                  {this.state.user ? (
                    <FriendScreenCardsFooter
                      walk={walk}
                      bike={bike}
                      publicTrasport={publicTrasport}
                      overall={overall}
                      style={{ marginTop: -15 }}
                      avatarId={avatarId}
                    />
                  ) : (
                    <View style={{ marginTop: -15 }}>
                      <ActivityIndicator
                        style={{}}
                        size="small"
                        color="#3D3D3D"
                      />
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity
              activeOpacity={1}
              style={styles.card}
              onPress={() => this.card.flip()}
            >
              <SvgPolygon
                walk={walk}
                bike={bike}                                             
                publicTrasport={publicTrasport}
                overall={overall}
                level={this.getLevelFromInt(level)}
                colorProfile={"#000000"}
                colorTitle={colorTitle}
                avatarId={avatarId}
                first_name={this.props.friendData.first_name}
                last_name={this.props.friendData.last_name}
                onPress={() => this.card.flip()}
              />
            </TouchableOpacity> */}
          </CardFlip>
        )}
        {communityInfo.sponsor ? (
          <SponsorCard sponsor={communityInfo} screenRefer={"Friends"} />
        ) : (
          <View />
        )}
        <View
          style={{
            width: Dimensions.get("window").width * 0.9,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <TouchableWithoutFeedback
            // onPress={() => this.DescriptionIconModal("infoPoints")}
            onPress={() => this.moveGlobalRanking()}
          >
            <View
              style={{
                flexDirection: "column",
                alignContent: "center",
                alignItems: "center",
                alignSelf: "center"
              }}
            >
              <Text style={styles.Value}>{pointsDecimal(points)}</Text>
              <Text style={styles.ValueDescr}>
                {strings("total_points").toLocaleUpperCase()}
              </Text>
            </View>
          </TouchableWithoutFeedback>

          <View
            style={{
              flexDirection: "column",
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
              position: "absolute",
              width: 50,
              // right: -9
              right: Dimensions.get("window").width * 0.45 - 25
              // - 38
            }}
          >
            {id ? (
              <TouchableHighlight
                onPress={() => this.goToCity(id, city)}
                // disabled={true}
              >
                <Image
                  source={imagesCity[id]}
                  style={{
                    width: 40,
                    height: 40
                    // position: "absolute",
                    // right: Dimensions.get("window").width * 0.5 - 20
                  }}
                />
              </TouchableHighlight>
            ) : (
              <View
                style={{
                  width: 40,
                  height: 40
                  // position: "absolute",
                  // right: Dimensions.get("window").width * 0.5 - 20
                }}
              />
            )}
          </View>
          <TouchableWithoutFeedback
            onPress={() => this.DescriptionIconModal("infoCoins")}
          >
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                alignSelf: "center"
              }}
            >
              <View>
                <Image
                  style={{
                    width: 45,
                    height: 45
                  }}
                  source={require("../../assets/images/coins_icn_friends_banner.png")}
                />
              </View>

              <View
                style={{
                  width: 10,
                  height: 10
                }}
              />
              <View
                style={{
                  flexDirection: "column",
                  alignContent: "center",
                  alignItems: "center",
                  alignSelf: "center"
                }}
              >
                <Text
                  style={styles.Value}
                  onPress={() => this.DescriptionIconModal("infoCoins")}
                >
                  {coins}
                </Text>
                <Text
                  style={styles.ValueDescr}
                  onPress={() => this.DescriptionIconModal("infoCoins")}
                >
                  {strings("coins").toLocaleUpperCase()}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  Value: {
    color: "#FFFFFF",
    fontSize: 30,
    textAlign: "center",
    fontFamily: "Montserrat-ExtraBold"
  },
  ValueDescr: {
    color: "#9D9B9C",
    fontSize: 10,
    textAlign: "center",
    fontWeight: "600",
    fontFamily: "OpenSans-Bold"
  },
  cardContainer: {
    width: Dimensions.get("window").width * 0.9,
    // + 45 cosi i punti sono piu sotto e ha piu spazio per fare il giro della card
    height: Dimensions.get("window").height * 0.55 + 25
  },
  card: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.55,
    backgroundColor: "#FE474C",
    borderRadius: 5,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  card1: {
    backgroundColor: "#FE474C"
  },
  card2: {
    backgroundColor: "#FEB12C"
  },
  label: {
    lineHeight: 470,
    textAlign: "center",
    fontSize: 55,
    fontFamily: "System",
    color: "#ffffff",
    backgroundColor: "transparent"
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.55,
    borderRadius: 4
  },
  content: {
    marginTop: 14,
    width: Dimensions.get("window").width * 0.83,
    // height: Dimensions.get("window").height * 0.4,
    height: Dimensions.get("window").height * 0.45,
    backgroundColor: "#3d3d3d"
  },
  avatarImage: {
    flex: 1,
    // position: "absolute",
    width: 214,
    height: 350,
    alignSelf: "center"
  },
  nameText: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    fontFamily: "Montserrat-ExtraBold"
  },
  levelText: {
    color: "#E83475",
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Montserrat-ExtraBold"
  }
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    avatarImage: {
      flex: 1,
      // position: "absolute",
      width: 102,
      height: 168,
      alignSelf: "center"
    },
    cardContainer: {
      width: Dimensions.get("window").width * 0.8,
      height: Dimensions.get("window").height * 0.45
    },
    card: {
      width: Dimensions.get("window").width * 0.8,
      height: Dimensions.get("window").height * 0.45,
      backgroundColor: "#FE474C",
      borderRadius: 5,
      shadowColor: "rgba(0,0,0,0.5)",
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.5,
      justifyContent: "center",
      alignItems: "center"
    },
    contentContainer: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: "flex-start",
      alignItems: "center",
      width: Dimensions.get("window").width * 0.8,
      height: Dimensions.get("window").height * 0.45,
      borderRadius: 4
    },
    content: {
      marginTop: 14,
      width: Dimensions.get("window").width * 0.73,
      height: Dimensions.get("window").height * 0.35,
      backgroundColor: "#3d3d3d"
    },
    nameText: {
      color: "#fff",
      fontSize: 18,
      textAlign: "center",
      fontFamily: "Montserrat-ExtraBold"
    },
    levelText: {
      color: "#E83475",
      fontSize: 16,
      textAlign: "center",
      fontFamily: "Montserrat-ExtraBold"
    }
  });
}

const withData = connect();

export default withData(FriendScreenCards);
