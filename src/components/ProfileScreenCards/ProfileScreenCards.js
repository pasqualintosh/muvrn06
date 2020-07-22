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
  TouchableHighlight,
} from "react-native";
import CardFlip from "react-native-card-flip";
import SvgPolygon from "./../SvgPolygon/SvgPolygon";
import ProfileScreenCardsFooter from "./../ProfileScreenCardsFooter/ProfileScreenCardsFooter";
import Icon from "react-native-vector-icons/Ionicons";
import IconBack from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import pointsDecimal from "../../helpers/pointsDecimal";
import OwnIcon from "./../OwnIcon/OwnIcon";
import DescriptionIcon from "../../components/DescriptionIcon/DescriptionIcon";
import SponsorCard from "../../components/SponsorCard/SponsorCard";
import Settings from "./../../config/Settings";
// import { Analytics, Hits as GAHits } from "react-native-google-analytics";
import { strings } from "../../config/i18n";
import { limitAvatar } from "./../UserItem/UserItem";
import {
  citiesImage,
  imagesCity,
} from "../../components/FriendItem/FriendItem";
import { getProfile } from "./../../domains/login/Selectors";
import { getSponsor } from "./../../helpers/Sponsors.js";
import Aux from "./../../helpers/Aux";
import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings,
} from "react-native-google-analytics-bridge";
let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);
import analytics from "@react-native-firebase/analytics";
async function trackScreenView(screen) {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
}

class ProfileScreenCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalActive: false,
      iconChoose: "round_info_icn",
      communityInfo: { sponsor: false },
    };
  }

  nameLevel = (level) => {
    let NameLevel = "Newbie";
    switch (level) {
      case 1:
        // code block
        NameLevel = "Newbie";
        break;
      case 2:
        // code block
        NameLevel = "Rookie";
        break;
      case 3:
        // code block
        NameLevel = "Pro";
        break;
      case 4:
        // code block
        NameLevel = "Star";
        break;
      default:
        // code block
        NameLevel = "Newbie";
    }
    return NameLevel;
  };

  componentWillMount() {
    let communityInfo = { sponsor: false };
    if (
      this.props.infoProfile.community &&
      this.props.infoProfile.community.name
    ) {
      communityInfo = getSponsor(this.props.infoProfile.community.name);
    }
    if (communityInfo.sponsor && communityInfo.name) {
      Tracker.trackScreenView("Profile " + communityInfo.name);
      trackScreenView("Profile " + communityInfo.name);
    }
  }

  DescriptionIconModal = (typeIcon) => {
    // Alert.alert("weather");
    this.setState({
      modalActive: true,
      iconChoose: typeIcon,
    });
  };

  DeleteDescriptionIconModal = () => {
    // Alert.alert("weather");
    this.setState({
      modalActive: false,
    });
  };

  share = () => {
    Share.share(
      {
        message:
          "Wow, did you see that? Share and download MUV: https://www.muvapp.eu/muv/#download",
        url: "https://www.muvapp.eu/muv/#download",
        title: "Wow, did you see that? Share and download MUV",
      },
      {
        // Android only:
        dialogTitle: "Share and download MUV",
        // iOS only:
        excludedActivityTypes: [],
      }
    );
  };

  moveGlobalRanking = () => {
    this.props.navigation.navigate("GlobalStandingsScreen");
  };

  goToCity = (id, city) => {
    this.props.navigation.navigate("CityDetailScreenBlurFromGlobal", {
      city: id,
      cityName: city,
      cityId: this.props.infoProfile.city ? this.props.infoProfile.city.id : 0,
    });
  };

  renderCounterRoutes = () => {
    let routes = 0;

    routes = +this.props.statisticsState.statistics.total_carpooling;
    routes = +this.props.statisticsState.statistics.total_train;
    routes = +this.props.statisticsState.statistics.total_metro;
    routes = +this.props.statisticsState.statistics.total_bus;
    routes = +this.props.statisticsState.statistics.total_biking;
    routes = +this.props.statisticsState.statistics.total_walking;
    return (
      <TouchableOpacity onPress={this.navigateDistance}>
      <View style={styles.LigthDetailEnd}>
        <Text style={styles.trip}>Tratte</Text>
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.tripDetail}>{routes}</Text>
          <View
            style={{
              height: 60,
              width: 40,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconBack
                        name="ios-arrow-back"
                        style={{ transform: [{ rotateZ: "180deg" }] }}
                        size={18}
                        color="#000000"
                      />
          </View>
        </View>
      </View>
      </TouchableOpacity>
    );
  };

  renderHeaderPointAndCoin = () => {
    return (
      <View style={styles.LigthUp}>
              <View style={styles.LigthUpColumn}>
                <Text style={styles.valueStyle}>
                  {pointsDecimal(
                    this.props.infoProfile.points
                      ? this.props.infoProfile.points
                      : 0
                  )}
                </Text>
                <Text style={styles.valueTextStyle}>PUNTI</Text>
              </View>
              <View style={styles.LigthUpColumnCenter}></View>
              <View style={styles.LigthUpColumn}>
                <Text style={styles.valueStyle}>
                  {this.props.infoProfile.coins
                    ? this.props.infoProfile.coins
                    : 0}
                </Text>
                <Text style={styles.valueTextStyle}>MONETE</Text>
              </View>
            </View>
    )
  }

  navigateDistance = () => {
    this.props.navigation.navigate('StatisticsRoutesScreen')
  }

  renderDistance = () => {
    let distance = this.props.statisticsState.statistics.total_distance,
      distanceInt = Number.parseInt(distance);
    distanceInt = distanceInt
      ? distanceInt
      : Number.parseInt((distance - distanceInt * 1000) * 1000);
    return (
      <TouchableOpacity onPress={this.navigateDistance}>
      <View style={styles.LigthDetailUp}>
        <Text style={styles.trip}>Distanza percorsa</Text>
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.tripDetail}>
            {distanceInt} {distanceInt ? "km" : "m"}
          </Text>
          <View
            style={{
              height: 60,
              width: 40,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
           <IconBack
                        name="ios-arrow-back"
                        style={{ transform: [{ rotateZ: "180deg" }] }}
                        size={18}
                        color="#000000"
                      />
          </View>
        </View>
      </View>
      </TouchableOpacity>);
  };

  headerStatistics = () => {
    return (
      <View>
        <ImageBackground
          source={require("./../../assets/images/recap/route_summary_banner_ligth_gray.png")}
          style={styles.backgroundImageLigth}
        />
        <View style={[styles.Rest, { height: 280 - 60 }]}>
          <Aux>

            

            {this.renderHeaderPointAndCoin()}
            {this.renderDistance()}
            {this.renderCounterRoutes()}
            
            
            {/* <View style={styles.LigthDetailEnd}>
              <Text style={styles.trip}>Newbie</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.tripDetail}>123,80 Km</Text>
                <View
                  style={{
                    width: 40,
                    flexDirection: "row",
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                 
                 
                  <IconBack
                        name="ios-arrow-back"
                        style={{ transform: [{ rotateZ: "180deg" }] }}
                        size={18}
                        color="#000000"
                      />
                </View>
              </View>
            </View> */}
          </Aux>
        </View>
      </View>
    );
  };

  headerTeam = () => {
    return (
      <View
        style={{
          position: "relative",
          height: 70,
          width: Dimensions.get("window").width * 0.9 - 30,
          top: -40,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {this.circleTeam()}
        {this.circleTeam()}
        {this.circleTeam()}
      </View>
    );
  };

  circleTeam = () => {
    return (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: 70,
            width: 70,
            backgroundColor: "#FFFFFF",
            flexDirection: "column",
            justifyContent: "center",
            borderRadius: 35,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,

            elevation: 8,
          }}
        ></View>
        <View style={{ paddingTop: 5 }}>
          <Text>TEAM</Text>
        </View>
      </View>
    );
  };

  render() {
    let avatarId = limitAvatar(
      this.props.infoProfile
        ? this.props.infoProfile.avatar
          ? this.props.infoProfile.avatar
          : 1
        : 1
    );

    const colorCircle = ["#60368C", "#6CBA7E", "#E83475", "#FAB21E"];
    const colorRGBA = [
      "rgba(96, 54, 140, 0.5)",
      "rgba(108, 186, 126, 0.5)",
      "rgba(232, 52, 117, 0.5)",
      "rgba(250, 178, 30, 0.5)",
    ];
    const colorText = ["#FFFFFF", "#000000", "#FFFFFF", "#000000"];

    const colorProfile =
      colorRGBA[this.props.infoProfile.role ? this.props.infoProfile.role : 1];
    const colorTitle =
      colorCircle[
        this.props.infoProfile.role ? this.props.infoProfile.role : 1
      ];
    const colorName =
      colorText[this.props.infoProfile.role ? this.props.infoProfile.role : 1];

    let city = this.props.infoProfile
      ? this.props.infoProfile.city
        ? this.props.infoProfile.city.city_name
          ? this.props.infoProfile.city.city_name
          : ""
        : ""
      : "";
    let id = citiesImage(city);

    let walk = this.props.infoProfile.walking_index
      ? this.props.infoProfile.walking_index
      : 0;
    let bike = this.props.infoProfile.biking_index
      ? this.props.infoProfile.biking_index
      : 0;
    let publicTrasport = this.props.infoProfile.lpt_index
      ? this.props.infoProfile.lpt_index
      : 0;
    let carpooling = this.props.infoProfile.carpooling_index
      ? this.props.infoProfile.carpooling_index
      : 0;
    let overall = this.props.infoProfile.global_index
      ? this.props.infoProfile.global_index
      : 0;

    let communityInfo = { sponsor: false };
    if (
      this.props.infoProfile.community &&
      this.props.infoProfile.community.name
    ) {
      communityInfo = getSponsor(this.props.infoProfile.community.name);
    }

    // {() => this.DescriptionIconModal("trainingOne")}

    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          // marginTop: Dimensions.get("window").height * 0.12
          marginTop: 10,
        }}
      >
        <DescriptionIcon
          active={this.state.modalActive}
          icon={this.state.iconChoose}
          DeleteDescriptionIconModal={this.DeleteDescriptionIconModal}
        />
        {/* <CardFlip style={styles.cardContainer} ref={card => (this.card = card)}> */}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.card}
          // onPress={() => this.card.flip()}

          onPress={() =>
            this.props.navigation.navigate("ChangeAvatarScreen", {
              avatar: avatarId,
            })
          }
        >
          <View style={styles.contentContainer}>
            <ImageBackground
              source={
                backgroundImage[
                  this.props.infoProfile.role ? this.props.infoProfile.role : 1
                ]
              }
              style={[styles.content, { backgroundColor: colorProfile }]}
            >
              <View>
                {/* 
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
                */}
                <Text style={[styles.nameText, { color: colorName }]}>
                  {this.props.infoProfile.first_name
                    ? this.props.infoProfile.username.toUpperCase()
                    : ""}
                  {/* 
                    {this.props.infoProfile.first_name
                      ? this.props.infoProfile.first_name.toUpperCase() +
                        " " +
                        this.props.infoProfile.last_name
                          .charAt(0)
                          .toUpperCase() +
                        "."
                      : " Mario R."} 
                    */}
                </Text>
                <Text style={[styles.levelText, { color: colorTitle }]}>
                  {this.nameLevel(
                    this.props.infoProfile.role
                      ? this.props.infoProfile.role
                      : 1
                  ).toUpperCase()}
                </Text>
              </View>
              <Image
                style={styles.avatarImage}
                // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
                source={
                  images[avatarId][
                    this.props.infoProfile.role
                      ? this.props.infoProfile.role
                      : 1
                  ][
                    this.props.infoProfile.level_of_experience
                      ? this.props.infoProfile.level_of_experience - 1
                      : 0
                  ]
                }
              />
            </ImageBackground>

            {/* <View
              style={{
                height: Dimensions.get("window").height * 0.1,
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <ProfileScreenCardsFooter
                walk={walk}
                bike={bike}
                publicTrasport={publicTrasport}
                overall={overall}
                style={{ marginTop: -15 }}
                avatarId={avatarId}
                profile={this.props.infoProfile}
                loginState={this.props.loginState}
              />
            </View> */}
          </View>
        </TouchableOpacity>
        {this.headerTeam()}
        {this.headerStatistics()}
        {/* 
          <TouchableOpacity
            activeOpacity={1}
            style={styles.card}
            onPress={() => this.card.flip()}
          >
            <SvgPolygon
              walk={walk}
              bike={bike}
              publicTrasport={publicTrasport}
              overall={overall}
              level={this.nameLevel(
                this.props.infoProfile.role ? this.props.infoProfile.role : 1
              )}
              colorProfile={"#000000"}
              colorTitle={colorTitle}
              avatarId={avatarId}
              first_name={this.props.infoProfile.first_name}
              last_name={this.props.infoProfile.last_name}
              onPress={() => this.card.flip()}
            />
          </TouchableOpacity> 
          */}
        {/* </CardFlip> */}
        {/* 
        {communityInfo.sponsor ? (
          <SponsorCard sponsor={communityInfo} screenRefer={"Profile"} />
        ) : (
          <View />
        )} 
        */}
        {/* 
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
              <Text style={styles.Value}>
                {pointsDecimal(
                  this.props.infoProfile.points
                    ? this.props.infoProfile.points
                    : 0
                )}
              </Text>
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
                  }}
                />
              </TouchableHighlight>
            ) : (
              <View
                style={{
                  width: 40,
                  height: 40
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
                  {this.props.infoProfile.coins}
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
        */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  valueStyle: {
    fontFamily: "Montserrat-ExtraBold",

    textAlign: "center",
    fontSize: 21,
    color: "#000000",
  },
  valueTextStyle: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 6,
    color: "#3D3D3D",
  },
  tripDetail: {
    fontFamily: "OpenSans-Regular",

    textAlign: "right",
    fontSize: 15,
    color: "#3D3D3D",
  },
  LigthUp: {
    width: Dimensions.get("window").width * 0.8,
    height: 60,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#9D9B9C",
    borderBottomWidth: 0.5,
    // top: -20
  },
  LigthUpColumn: {
    width: Dimensions.get("window").width * 0.4 - 2,
    height: 60,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    // top: -20
  },
  LigthUpColumnCenter: {
    width: 0.5,
    height: 40,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#9D9B9C",
    // top: -20
  },
  LigthDetailUp: {
    width: Dimensions.get("window").width * 0.8,
    height: 60,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#9D9B9C",
    borderBottomWidth: 0.5,
    // top: -30
  },
  LigthDetailEnd: {
    width: Dimensions.get("window").width * 0.8,
    height: 60,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    // top: -30
  },
  trip: {
    fontWeight: "600",
    fontFamily: "OpenSans-Regular",

    textAlign: "left",
    fontSize: 15,
    color: "#3D3D3D",
  },
  Rest: {
    width: Dimensions.get("window").width,
    justifyContent: "flex-start",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#F7F8F9",
    //  top: -40
  },
  backgroundImageLigth: {
    width: Dimensions.get("window").width,
    height: 25,
    // top: -30
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  Value: {
    color: "#FFFFFF",
    fontSize: 30,
    textAlign: "center",
    fontFamily: "Montserrat-ExtraBold",
  },
  ValueDescr: {
    color: "#9D9B9C",
    fontSize: 10,
    textAlign: "center",
    fontWeight: "600",
    fontFamily: "OpenSans-Bold",
  },
  cardContainer: {
    width: Dimensions.get("window").width * 0.9,
    // + 45 cosi i punti sono piu sotto e ha piu spazio per fare il giro della card
    height: Dimensions.get("window").height * 0.45 + 30,
  },
  card: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.45 + 30,
    backgroundColor: "#FE474C",
    borderRadius: 5,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  card1: {
    backgroundColor: "#FE474C",
  },
  card2: {
    backgroundColor: "#FEB12C",
  },
  label: {
    lineHeight: 470,
    textAlign: "center",
    fontSize: 55,
    fontFamily: "System",
    color: "#ffffff",
    backgroundColor: "transparent",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.45 + 30,
    borderRadius: 4,
  },
  content: {
    margin: 15,

    width: Dimensions.get("window").width * 0.9 - 30,
    // height: Dimensions.get("window").height * 0.4,
    height: Dimensions.get("window").height * 0.45,
    backgroundColor: "#3d3d3d",
  },
  avatarImage: {
    flex: 1,
    // position: "absolute",
    width: 214,
    height: 350,
    alignSelf: "center",
  },
  nameText: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    fontFamily: "Montserrat-ExtraBold",
  },
  levelText: {
    color: "#E83475",
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Montserrat-ExtraBold",
  },
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    avatarImage: {
      flex: 1,
      // position: "absolute",
      width: 102,
      height: 168,
      alignSelf: "center",
    },
    cardContainer: {
      width: Dimensions.get("window").width * 0.8,
      height: Dimensions.get("window").height * 0.45,
    },
    card: {
      width: Dimensions.get("window").width * 0.8,
      height: Dimensions.get("window").height * 0.45,
      backgroundColor: "#FE474C",
      borderRadius: 5,
      shadowColor: "rgba(0,0,0,0.5)",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.5,
      justifyContent: "center",
      alignItems: "center",
    },
    contentContainer: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: "flex-start",
      alignItems: "center",
      width: Dimensions.get("window").width * 0.8,
      height: Dimensions.get("window").height * 0.45,
      borderRadius: 4,
    },
    content: {
      marginTop: 14,
      width: Dimensions.get("window").width * 0.73,
      height: Dimensions.get("window").height * 0.35,
      backgroundColor: "#3d3d3d",
    },
    nameText: {
      color: "#fff",
      fontSize: 18,
      textAlign: "center",
      fontFamily: "Montserrat-ExtraBold",
    },
    levelText: {
      color: "#E83475",
      fontSize: 16,
      textAlign: "center",
      fontFamily: "Montserrat-ExtraBold",
    },
  });
}

const RecapUser = connect((state) => {
  return {
    infoProfile: getProfile(state),
    loginState: state.login,
  };
});

export const backgroundImage = [
  require("./../../assets/images/profile_card_bg_muver.png"),
  require("./../../assets/images/profile_card_bg_walk.png"),
  require("./../../assets/images/profile_card_bg_bike.png"),
  require("./../../assets/images/profile_card_bg_bus.png"),
];

export const images = {
  1: [
    [
      require("../../assets/images/avatars/bodies/1/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/1/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/1/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/1/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/1/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/1/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/1/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/1/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/1/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/1/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/1/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/1/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/1/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/1/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/1/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/1/Bus4xhdpi.png"),
    ],
  ],
  2: [
    [
      require("../../assets/images/avatars/bodies/2/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/2/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/2/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/2/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/2/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/2/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/2/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/2/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/2/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/2/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/2/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/2/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/2/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/2/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/2/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/2/Bus4xhdpi.png"),
    ],
  ],
  3: [
    [
      require("../../assets/images/avatars/bodies/3/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/3/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/3/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/3/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/3/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/3/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/3/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/3/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/3/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/3/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/3/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/3/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/3/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/3/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/3/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/3/Bus4xhdpi.png"),
    ],
  ],
  4: [
    [
      require("../../assets/images/avatars/bodies/4/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/4/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/4/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/4/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/4/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/4/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/4/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/4/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/4/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/4/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/4/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/4/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/4/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/4/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/4/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/4/Bus4xhdpi.png"),
    ],
  ],
  5: [
    [
      require("../../assets/images/avatars/bodies/5/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/5/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/5/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/5/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/5/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/5/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/5/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/5/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/5/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/5/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/5/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/5/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/5/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/5/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/5/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/5/Bus4xhdpi.png"),
    ],
  ],
  6: [
    [
      require("../../assets/images/avatars/bodies/6/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/6/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/6/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/6/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/6/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/6/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/6/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/6/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/6/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/6/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/6/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/6/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/6/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/6/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/6/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/6/Bus4xhdpi.png"),
    ],
  ],
  7: [
    [
      require("../../assets/images/avatars/bodies/7/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/7/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/7/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/7/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/7/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/7/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/7/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/7/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/7/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/7/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/7/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/7/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/7/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/7/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/7/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/7/Bus4xhdpi.png"),
    ],
  ],
  8: [
    [
      require("../../assets/images/avatars/bodies/8/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/8/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/8/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/8/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/8/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/8/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/8/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/8/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/8/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/8/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/8/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/8/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/8/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/8/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/8/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/8/Bus4xhdpi.png"),
    ],
  ],
  9: [
    [
      require("../../assets/images/avatars/bodies/9/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/9/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/9/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/9/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/9/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/9/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/9/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/9/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/9/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/9/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/9/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/9/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/9/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/9/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/9/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/9/Bus4xhdpi.png"),
    ],
  ],
  10: [
    [
      require("../../assets/images/avatars/bodies/10/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/10/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/10/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/10/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/10/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/10/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/10/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/10/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/10/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/10/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/10/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/10/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/10/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/10/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/10/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/10/Bus4xhdpi.png"),
    ],
  ],
  11: [
    [
      require("../../assets/images/avatars/bodies/11/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/11/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/11/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/11/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/11/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/11/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/11/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/11/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/11/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/11/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/11/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/11/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/11/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/11/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/11/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/11/Bus4xhdpi.png"),
    ],
  ],
  12: [
    [
      require("../../assets/images/avatars/bodies/12/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/12/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/12/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/12/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/12/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/12/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/12/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/12/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/12/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/12/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/12/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/12/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/12/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/12/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/12/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/12/Bus4xhdpi.png"),
    ],
  ],
  13: [
    [
      require("../../assets/images/avatars/bodies/13/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/13/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/13/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/13/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/13/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/13/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/13/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/13/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/13/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/13/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/13/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/13/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/13/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/13/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/13/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/13/Bus4xhdpi.png"),
    ],
  ],
  14: [
    [
      require("../../assets/images/avatars/bodies/14/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/14/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/14/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/14/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/14/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/14/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/14/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/14/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/14/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/14/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/14/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/14/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/14/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/14/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/14/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/14/Bus4xhdpi.png"),
    ],
  ],
  15: [
    [
      require("../../assets/images/avatars/bodies/15/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/15/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/15/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/15/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/15/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/15/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/15/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/15/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/15/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/15/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/15/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/15/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/15/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/15/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/15/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/15/Bus4xhdpi.png"),
    ],
  ],
  16: [
    [
      require("../../assets/images/avatars/bodies/16/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/16/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/16/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/16/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/16/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/16/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/16/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/16/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/16/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/16/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/16/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/16/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/16/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/16/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/16/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/16/Bus4xhdpi.png"),
    ],
  ],
  17: [
    [
      require("../../assets/images/avatars/bodies/17/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/17/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/17/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/17/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/17/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/17/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/17/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/17/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/17/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/17/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/17/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/17/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/17/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/17/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/17/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/17/Bus4xhdpi.png"),
    ],
  ],
  18: [
    [
      require("../../assets/images/avatars/bodies/18/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/18/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/18/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/18/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/18/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/18/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/18/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/18/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/18/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/18/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/18/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/18/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/18/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/18/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/18/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/18/Bus4xhdpi.png"),
    ],
  ],
  19: [
    [
      require("../../assets/images/avatars/bodies/19/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/19/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/19/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/19/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/19/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/19/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/19/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/19/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/19/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/19/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/19/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/19/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/19/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/19/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/19/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/19/Bus4xhdpi.png"),
    ],
  ],
  20: [
    [
      require("../../assets/images/avatars/bodies/20/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/20/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/20/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/20/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/20/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/20/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/20/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/20/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/20/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/20/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/20/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/20/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/20/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/20/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/20/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/20/Bus4xhdpi.png"),
    ],
  ],
  21: [
    [
      require("../../assets/images/avatars/bodies/21/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/21/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/21/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/21/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/21/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/21/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/21/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/21/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/21/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/21/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/21/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/21/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/21/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/21/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/21/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/21/Bus4xhdpi.png"),
    ],
  ],
  22: [
    [
      require("../../assets/images/avatars/bodies/22/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/22/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/22/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/22/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/22/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/22/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/22/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/22/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/22/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/22/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/22/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/22/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/22/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/22/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/22/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/22/Bus4xhdpi.png"),
    ],
  ],
  23: [
    [
      require("../../assets/images/avatars/bodies/23/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/23/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/23/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/23/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/23/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/23/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/23/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/23/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/23/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/23/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/23/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/23/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/23/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/23/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/23/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/23/Bus4xhdpi.png"),
    ],
  ],
  24: [
    [
      require("../../assets/images/avatars/bodies/24/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/24/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/24/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/24/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/24/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/24/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/24/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/24/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/24/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/24/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/24/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/24/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/24/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/24/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/24/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/24/Bus4xhdpi.png"),
    ],
  ],
  25: [
    [
      require("../../assets/images/avatars/bodies/25/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/25/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/25/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/25/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/25/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/25/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/25/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/25/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/25/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/25/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/25/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/25/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/25/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/25/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/25/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/25/Bus4xhdpi.png"),
    ],
  ],
  26: [
    [
      require("../../assets/images/avatars/bodies/26/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/26/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/26/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/26/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/26/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/26/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/26/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/26/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/26/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/26/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/26/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/26/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/26/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/26/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/26/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/26/Bus4xhdpi.png"),
    ],
  ],
  27: [
    [
      require("../../assets/images/avatars/bodies/27/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/27/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/27/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/27/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/27/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/27/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/27/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/27/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/27/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/27/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/27/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/27/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/27/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/27/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/27/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/27/Bus4xhdpi.png"),
    ],
  ],
  28: [
    [
      require("../../assets/images/avatars/bodies/28/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/28/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/28/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/28/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/28/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/28/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/28/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/28/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/28/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/28/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/28/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/28/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/28/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/28/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/28/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/28/Bus4xhdpi.png"),
    ],
  ],
  29: [
    [
      require("../../assets/images/avatars/bodies/29/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/29/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/29/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/29/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/29/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/29/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/29/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/29/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/29/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/29/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/29/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/29/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/29/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/29/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/29/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/29/Bus4xhdpi.png"),
    ],
  ],
  30: [
    [
      require("../../assets/images/avatars/bodies/30/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/30/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/30/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/30/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/30/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/30/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/30/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/30/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/30/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/30/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/30/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/30/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/30/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/30/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/30/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/30/Bus4xhdpi.png"),
    ],
  ],
  31: [
    [
      require("../../assets/images/avatars/bodies/31/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/31/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/31/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/31/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/31/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/31/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/31/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/31/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/31/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/31/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/31/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/31/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/31/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/31/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/31/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/31/Bus4xhdpi.png"),
    ],
  ],
  32: [
    [
      require("../../assets/images/avatars/bodies/32/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/32/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/32/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/32/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/32/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/32/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/32/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/32/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/32/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/32/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/32/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/32/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/32/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/32/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/32/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/32/Bus4xhdpi.png"),
    ],
  ],
  33: [
    [
      require("../../assets/images/avatars/bodies/33/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/33/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/33/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/33/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/33/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/33/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/33/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/33/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/33/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/33/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/33/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/33/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/33/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/33/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/33/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/33/Bus4xhdpi.png"),
    ],
  ],
  34: [
    [
      require("../../assets/images/avatars/bodies/34/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/34/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/34/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/34/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/34/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/34/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/34/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/34/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/34/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/34/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/34/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/34/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/34/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/34/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/34/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/34/Bus4xhdpi.png"),
    ],
  ],
  35: [
    [
      require("../../assets/images/avatars/bodies/35/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/35/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/35/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/35/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/35/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/35/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/35/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/35/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/35/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/35/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/35/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/35/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/35/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/35/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/35/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/35/Bus4xhdpi.png"),
    ],
  ],
  36: [
    [
      require("../../assets/images/avatars/bodies/36/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/36/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/36/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/36/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/36/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/36/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/36/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/36/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/36/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/36/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/36/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/36/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/36/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/36/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/36/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/36/Bus4xhdpi.png"),
    ],
  ],
  37: [
    [
      require("../../assets/images/avatars/bodies/37/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/37/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/37/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/37/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/37/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/37/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/37/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/37/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/37/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/37/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/37/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/37/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/37/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/37/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/37/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/37/Bus4xhdpi.png"),
    ],
  ],
  38: [
    [
      require("../../assets/images/avatars/bodies/38/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/38/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/38/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/38/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/38/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/38/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/38/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/38/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/38/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/38/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/38/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/38/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/38/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/38/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/38/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/38/Bus4xhdpi.png"),
    ],
  ],
  39: [
    [
      require("../../assets/images/avatars/bodies/39/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/39/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/39/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/39/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/39/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/39/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/39/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/39/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/39/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/39/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/39/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/39/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/39/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/39/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/39/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/39/Bus4xhdpi.png"),
    ],
  ],
  40: [
    [
      require("../../assets/images/avatars/bodies/40/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/40/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/40/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/40/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/40/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/40/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/40/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/40/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/40/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/40/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/40/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/40/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/40/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/40/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/40/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/40/Bus4xhdpi.png"),
    ],
  ],
  41: [
    [
      require("../../assets/images/avatars/bodies/41/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/41/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/41/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/41/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/41/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/41/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/41/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/41/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/41/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/41/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/41/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/41/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/41/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/41/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/41/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/41/Bus4xhdpi.png"),
    ],
  ],
  42: [
    [
      require("../../assets/images/avatars/bodies/42/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/42/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/42/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/42/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/42/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/42/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/42/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/42/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/42/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/42/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/42/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/42/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/42/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/42/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/42/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/42/Bus4xhdpi.png"),
    ],
  ],
  43: [
    [
      require("../../assets/images/avatars/bodies/43/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/43/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/43/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/43/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/43/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/43/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/43/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/43/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/43/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/43/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/43/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/43/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/43/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/43/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/43/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/43/Bus4xhdpi.png"),
    ],
  ],
  44: [
    [
      require("../../assets/images/avatars/bodies/44/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/44/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/44/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/44/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/44/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/44/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/44/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/44/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/44/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/44/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/44/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/44/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/44/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/44/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/44/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/44/Bus4xhdpi.png"),
    ],
  ],
  45: [
    [
      require("../../assets/images/avatars/bodies/45/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/45/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/45/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/45/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/45/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/45/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/45/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/45/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/45/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/45/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/45/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/45/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/45/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/45/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/45/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/45/Bus4xhdpi.png"),
    ],
  ],
  46: [
    [
      require("../../assets/images/avatars/bodies/46/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/46/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/46/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/46/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/46/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/46/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/46/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/46/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/46/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/46/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/46/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/46/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/46/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/46/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/46/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/46/Bus4xhdpi.png"),
    ],
  ],
  47: [
    [
      require("../../assets/images/avatars/bodies/47/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/47/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/47/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/47/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/47/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/47/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/47/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/47/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/47/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/47/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/47/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/47/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/47/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/47/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/47/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/57/Bus4xhdpi.png"),
    ],
  ],
  48: [
    [
      require("../../assets/images/avatars/bodies/48/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/48/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/48/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/48/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/48/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/48/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/48/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/48/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/48/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/48/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/48/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/48/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/48/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/48/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/48/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/48/Bus4xhdpi.png"),
    ],
  ],
  49: [
    [
      require("../../assets/images/avatars/bodies/49/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/49/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/49/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/49/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/49/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/49/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/49/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/49/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/49/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/49/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/49/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/49/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/49/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/49/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/49/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/49/Bus4xhdpi.png"),
    ],
  ],
  50: [
    [
      require("../../assets/images/avatars/bodies/50/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/50/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/50/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/50/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/50/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/50/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/50/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/50/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/50/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/50/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/50/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/50/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/50/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/50/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/50/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/50/Bus4xhdpi.png"),
    ],
  ],
  51: [
    [
      require("../../assets/images/avatars/bodies/51/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/51/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/51/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/51/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/51/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/51/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/51/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/51/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/51/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/51/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/51/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/51/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/51/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/51/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/51/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/51/Bus4xhdpi.png"),
    ],
  ],
  52: [
    [
      require("../../assets/images/avatars/bodies/52/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/52/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/52/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/52/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/52/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/52/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/52/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/52/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/52/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/52/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/52/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/52/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/52/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/52/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/52/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/52/Bus4xhdpi.png"),
    ],
  ],
  53: [
    [
      require("../../assets/images/avatars/bodies/53/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/53/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/53/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/53/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/53/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/53/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/53/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/53/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/53/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/53/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/53/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/53/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/53/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/53/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/53/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/53/Bus4xhdpi.png"),
    ],
  ],
  54: [
    [
      require("../../assets/images/avatars/bodies/54/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/54/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/54/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/54/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/54/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/54/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/54/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/54/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/54/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/54/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/54/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/54/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/54/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/54/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/54/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/54/Bus4xhdpi.png"),
    ],
  ],
  55: [
    [
      require("../../assets/images/avatars/bodies/55/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/55/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/55/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/55/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/55/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/55/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/55/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/55/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/55/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/55/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/55/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/55/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/55/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/55/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/55/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/55/Bus4xhdpi.png"),
    ],
  ],
  56: [
    [
      require("../../assets/images/avatars/bodies/56/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/56/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/56/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/56/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/56/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/56/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/56/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/56/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/56/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/56/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/56/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/56/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/56/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/56/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/56/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/56/Bus4xhdpi.png"),
    ],
  ],
  57: [
    [
      require("../../assets/images/avatars/bodies/57/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/57/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/57/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/57/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/57/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/57/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/57/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/57/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/57/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/57/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/57/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/57/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/57/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/57/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/57/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/57/Bus4xhdpi.png"),
    ],
  ],
  58: [
    [
      require("../../assets/images/avatars/bodies/58/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/58/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/58/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/58/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/58/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/58/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/58/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/58/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/58/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/58/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/58/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/58/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/58/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/58/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/58/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/58/Bus4xhdpi.png"),
    ],
  ],
  59: [
    [
      require("../../assets/images/avatars/bodies/59/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/59/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/59/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/59/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/59/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/59/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/59/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/59/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/59/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/59/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/59/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/59/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/59/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/59/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/59/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/59/Bus4xhdpi.png"),
    ],
  ],
  60: [
    [
      require("../../assets/images/avatars/bodies/60/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/60/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/60/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/60/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/60/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/60/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/60/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/60/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/60/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/60/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/60/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/60/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/60/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/60/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/60/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/60/Bus4xhdpi.png"),
    ],
  ],
  61: [
    [
      require("../../assets/images/avatars/bodies/61/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/61/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/61/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/61/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/61/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/61/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/61/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/61/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/61/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/61/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/61/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/61/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/61/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/61/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/61/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/61/Bus4xhdpi.png"),
    ],
  ],
  62: [
    [
      require("../../assets/images/avatars/bodies/62/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/62/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/62/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/62/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/62/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/62/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/62/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/62/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/62/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/62/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/62/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/62/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/62/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/62/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/62/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/62/Bus4xhdpi.png"),
    ],
  ],
  63: [
    [
      require("../../assets/images/avatars/bodies/63/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/63/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/63/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/63/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/63/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/63/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/63/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/63/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/63/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/63/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/63/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/63/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/63/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/63/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/63/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/63/Bus4xhdpi.png"),
    ],
  ],
  64: [
    [
      require("../../assets/images/avatars/bodies/64/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/64/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/64/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/64/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/64/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/64/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/64/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/64/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/64/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/64/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/64/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/64/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/64/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/64/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/64/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/64/Bus4xhdpi.png"),
    ],
  ],
  65: [
    [
      require("../../assets/images/avatars/bodies/65/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/65/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/65/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/65/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/65/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/65/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/65/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/65/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/65/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/65/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/65/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/65/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/65/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/65/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/65/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/65/Bus4xhdpi.png"),
    ],
  ],
  66: [
    [
      require("../../assets/images/avatars/bodies/66/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/66/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/66/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/66/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/66/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/66/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/66/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/66/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/66/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/66/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/66/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/66/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/66/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/66/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/66/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/66/Bus4xhdpi.png"),
    ],
  ],
  67: [
    [
      require("../../assets/images/avatars/bodies/67/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/67/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/67/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/67/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/67/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/67/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/67/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/67/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/67/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/67/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/67/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/67/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/67/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/67/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/67/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/67/Bus4xhdpi.png"),
    ],
  ],
  68: [
    [
      require("../../assets/images/avatars/bodies/68/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/68/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/68/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/68/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/68/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/68/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/68/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/68/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/68/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/68/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/68/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/68/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/68/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/68/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/68/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/68/Bus4xhdpi.png"),
    ],
  ],
  69: [
    [
      require("../../assets/images/avatars/bodies/69/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/69/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/69/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/69/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/69/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/69/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/69/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/69/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/69/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/69/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/69/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/69/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/69/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/69/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/69/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/69/Bus4xhdpi.png"),
    ],
  ],
  70: [
    [
      require("../../assets/images/avatars/bodies/70/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/70/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/70/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/70/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/70/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/70/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/70/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/70/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/70/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/70/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/70/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/70/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/70/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/70/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/70/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/70/Bus4xhdpi.png"),
    ],
  ],
  71: [
    [
      require("../../assets/images/avatars/bodies/71/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/71/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/71/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/71/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/71/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/71/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/71/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/71/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/71/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/71/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/71/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/71/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/71/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/71/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/71/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/71/Bus4xhdpi.png"),
    ],
  ],
  72: [
    [
      require("../../assets/images/avatars/bodies/72/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/72/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/72/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/72/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/72/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/72/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/72/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/72/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/72/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/72/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/72/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/72/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/72/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/72/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/72/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/72/Bus4xhdpi.png"),
    ],
  ],
  73: [
    [
      require("../../assets/images/avatars/bodies/73/Muver1xhdpi.png"),
      require("../../assets/images/avatars/bodies/73/Muver2xhdpi.png"),
      require("../../assets/images/avatars/bodies/73/Muver3xhdpi.png"),
      require("../../assets/images/avatars/bodies/73/Muver4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/73/Runner1xhdpi.png"),
      require("../../assets/images/avatars/bodies/73/Runner2xhdpi.png"),
      require("../../assets/images/avatars/bodies/73/Runner3xhdpi.png"),
      require("../../assets/images/avatars/bodies/73/Runner4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/73/Biker1xhdpi.png"),
      require("../../assets/images/avatars/bodies/73/Biker2xhdpi.png"),
      require("../../assets/images/avatars/bodies/73/Biker3xhdpi.png"),
      require("../../assets/images/avatars/bodies/73/Biker4xhdpi.png"),
    ],
    [
      require("../../assets/images/avatars/bodies/73/Bus1xhdpi.png"),
      require("../../assets/images/avatars/bodies/73/Bus2xhdpi.png"),
      require("../../assets/images/avatars/bodies/73/Bus3xhdpi.png"),
      require("../../assets/images/avatars/bodies/73/Bus4xhdpi.png"),
    ],
  ],
};

export default RecapUser(ProfileScreenCards);
