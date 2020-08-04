
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

import { backgroundImage, images } from "./../../components/ProfileScreenCards/ProfileScreenCards";

import IconBack from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import pointsDecimal from "../../helpers/pointsDecimal";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";
import DescriptionIcon from "../../components/DescriptionIcon/DescriptionIcon";

import Settings from "./../../config/Settings";
// import { Analytics, Hits as GAHits } from "react-native-google-analytics";
import { strings } from "../../config/i18n";
import { limitAvatar } from "./../../components/UserItem/UserItem";
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

class FriendScreenCards extends React.Component {
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
      Tracker.trackScreenView("Friend " + communityInfo.name);
      trackScreenView("Friend " + communityInfo.name);
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

    routes = +this.props.infoProfile.stats.total_carpooling;
    routes = +this.props.infoProfile.stats.total_train;
    routes = +this.props.infoProfile.stats.total_metro;
    routes = +this.props.infoProfile.stats.total_bus;
    routes = +this.props.infoProfile.stats.total_biking;
    routes = +this.props.infoProfile.stats.total_walking;
    return (
     
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
          
        </View>
      </View>
      
    );
  };

  renderHeaderPointAndCoin = (colorTitle) => {
    return (
      <View style={styles.LigthUp}>
      {/* <View style={styles.LigthUpColumn}>
                <Text style={styles.valueStyle}>
                  {this.props.infoProfile.coins
                    ? this.props.infoProfile.coins
                    : 0}
                </Text>
                <Text style={styles.valueTextStyle}>MONETE</Text>
              </View> */}
              <View style={styles.LigthUpColumn}>
              
              <OwnIcon
                    name="play-icn"
                    size={50}
                    color={colorTitle}
                    
                  />
              </View>
               {/* <View style={styles.LigthUpColumnCenter}></View> */}
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
             
              
            </View>
    )
  }

  navigateDistance = () => {
    this.props.navigation.navigate('StatisticsRoutesScreen')
  }

  renderDistance = () => {
    let distance = this.props.infoProfile.stats.total_distance,
      distanceInt = Number.parseInt(distance);
    distanceInt = distanceInt
      ? distanceInt
      : Number.parseInt((distance - distanceInt * 1000) * 1000);
    return (
      
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
        </View>
      </View>
      );
  };

  headerStatistics = (colorTitle) => {
    return (
      <View>
        <ImageBackground
          source={require("./../../assets/images/recap/route_summary_banner_ligth_gray.png")}
          style={styles.backgroundImageLigth}
        />
        <View style={[styles.Rest, { height: 280 - 60 }]}>
          <Aux>

            

            {this.renderHeaderPointAndCoin(colorTitle)}
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
          justifyContent: "space-around",
        }}
      >
        {this.circleTeam()}
         {/*
         {this.circleTeam()}
        
        {this.circleTeam()} */}
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

    const colorCircle = ["#62367E", "#6CBA7E", "#E83475", "#FAB21E", '#3363AD'];
    const colorRGBA = [
      "rgba(96, 54, 140, 0.5)",
      "rgba(108, 186, 126, 0.5)",
      "rgba(232, 52, 117, 0.5)",
      "rgba(250, 178, 30, 0.5)",
    ];
    const colorText = ["#FFFFFF", "#000000", "#FFFFFF", "#000000"];

    // this.props.infoProfile.role ? this.props.infoProfile.role : 0
    const colorProfile =
      colorRGBA[0];
    const colorTitle =
      colorCircle[
        0
      ];
    const colorName =
      colorText[0];

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
        <View
          
          style={styles.card}
          // onPress={() => this.card.flip()}

          
        >
          <View style={styles.contentContainer}>
            <ImageBackground
              source={
                backgroundImage[
                  // this.props.infoProfile.role ? this.props.infoProfile.role : 1
                  0
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
                  {this.props.infoProfile.username
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
        </View>
        {this.headerTeam()}
        {this.headerStatistics(colorTitle)}
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
    width: Dimensions.get("window").width * 0.4,
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
   
  };
});



export default RecapUser(FriendScreenCards);
