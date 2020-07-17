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
  ActivityIndicator
} from "react-native";
import CardFlip from "react-native-card-flip";
import SvgCityPolygon from "./../../components/SvgCityPolygon/SvgCityPolygon";
import CityScreenCardsFooter from "./../../components/CityScreenCardsFooter/CityScreenCardsFooter";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import pointsDecimal from "../../helpers/pointsDecimal";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";
import DescriptionIcon from "./../../components/DescriptionIcon/DescriptionIcon";
import FriendScreenCardsFooter from "./../../components/FriendScreenCardsFooter/FriendScreenCardsFooter";

import Settings from "./../../config/Settings";
import DeviceInfo from "react-native-device-info";
// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

import { strings } from "../../config/i18n";

import {
  images,
  backgroundImage
} from "../../components/ProfileScreenCards/ProfileScreenCards";
import { getCityInfo } from "./../../domains/login/ActionCreators";
import { limitAvatar } from "../../components/UserItem/UserItem";
import {
  citiesImage,
  imagesCity
} from "../../components/FriendItem/FriendItem";
import LinearGradient from "react-native-linear-gradient";

class CityScreenCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalActive: false,
      iconChoose: "round_info_icn",
      city: null
    };
  }

  callback = data => {
    this.setState({
      city: data
    });
  };

  componentDidMount() {
    // chiedo i dati al db
    this.props.dispatch(
      getCityInfo({ city_id: this.props.city_id }, this.callback)
    );
  }

  componentWillMount() {
    // const ga = new Analytics(
    //   Settings.analyticsCode,
    //   DeviceInfo.getUniqueID(),
    //   1,
    //   DeviceInfo.getUserAgent()
    // );
    // const screenView = new GAHits.ScreenView(
    //   Settings.analyticsAppName,
    //   this.constructor.name,
    //   DeviceInfo.getReadableVersion(),
    //   DeviceInfo.getBundleId()
    // );
    // ga.send(screenView);
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

  render() {
    let avatarId = this.props.city;
    const idCity = this.props.cityId;
    console.log(idCity);

    let role = 0;

    const colorText = ["#FFFFFF", "#000000", "#FFFFFF", "#000000"];

    const colorName = colorText[role];

    let overall = 0;
    let urban_cyclist = 0;
    let bus_lover = 0;
    let footslogger = 0;
    let active_users = 0;
    let total_users = 0;

    let level = 0;

    // a seconda che l'index sia presente o no
    const indexRoleCheck = this.state.city
      ? this.state.city.city_name
        ? true
        : false
      : false;

    if (indexRoleCheck) {
      active_users = this.state.city
        ? this.state.city.active_users
          ? this.state.city.active_users
          : 0
        : 0;
      total_users = this.state.city
        ? this.state.city.total_users
          ? this.state.city.total_users
          : 0
        : 0;
      levels = this.state.city
        ? this.state.city.levels
          ? this.state.city.levels
          : []
        : [];
      index = this.state.city
        ? this.state.city.index
          ? this.state.city.index
          : [{}]
        : [{}];
      overall = index[0].overall ? parseInt(index[0].overall) : 0;
      urban_cyclist = index[0].urban_cyclist
        ? parseInt(index[0].urban_cyclist)
        : 0;
      bus_lover = index[0].bus_lover ? parseInt(index[0].bus_lover) : 0;
      footslogger = index[0].footslogger ? parseInt(index[0].footslogger) : 0;
    }

    const backgroundColorCity = citiesColor(this.props.city);

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
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 0.0, y: 1.0 }}
                  locations={[0, 1.0]}
                  colors={["#E82F73", "#F49658"]}
                  style={styles.content}
                >
                  <ImageBackground
                    source={require("./../../assets/images/cities/city_page_bg.png")}
                    style={[
                      styles.ImageContent,
                      { backgroundColor: backgroundColorCity }
                    ]}
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
                      <Text style={[styles.nameText]}>{this.props.city}</Text>
                      <Text style={[styles.levelText]}>
                        {citiesDescription(this.props.city)}
                      </Text>
                    </View>
                    <View style={styles.cityImage}>
                      <View style={styles.cityCircle}>
                        <Image
                          style={styles.avatarImage}
                          // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
                          source={imagesCity[idCity]}
                        />
                      </View>
                    </View>
                  </ImageBackground>
                </LinearGradient>
                <View
                  style={{
                    height: Dimensions.get("window").height * 0.1,
                    flexDirection: "column",
                    justifyContent: "center"
                  }}
                >
                  {indexRoleCheck ? (
                    <CityScreenCardsFooter
                      idCity={idCity}
                      activeUser={active_users}
                      user={total_users}
                      overall={overall}
                      avatarId={avatarId}
                      style={{ marginTop: -15 }}
                    />
                  ) : (
                    <View />
                  )}
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.card}
              onPress={() => this.card.flip()}
            >
              <SvgCityPolygon
                idCity={idCity}
                walk={footslogger}
                bike={urban_cyclist}
                publicTrasport={bus_lover}
                activeUser={active_users}
                user={total_users}
                overall={overall}
                level={this.getLevelFromInt(level)}
                colorProfile={"#000000"}
                colorTitle={"#9D9B9C"}
                avatarId={avatarId}
                city={this.props.city}
                subCity={citiesDescription(this.props.city)}
                onPress={() => this.card.flip()}
              />
            </TouchableOpacity>
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
              disabled={!this.state.city}
            >
              <View style={styles.contentContainer}>
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 0.0, y: 1.0 }}
                  locations={[0, 1.0]}
                  colors={["#E82F73", "#F49658"]}
                  style={styles.content}
                >
                  <ImageBackground
                    source={require("./../../assets/images/cities/city_page_bg.png")}
                    style={[
                      styles.ImageContent,
                      { backgroundColor: backgroundColorCity }
                    ]}
                  >
                    {this.state.city ? (
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
                      <Text style={styles.nameText}>{this.props.city}</Text>
                      <Text style={styles.levelText}>
                        {citiesDescription(this.props.city)}
                      </Text>
                    </View>
                    <View style={styles.cityImage}>
                      <View style={styles.cityCircle}>
                        <Image
                          style={styles.avatarImage}
                          // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
                          source={imagesCity[idCity]}
                        />
                      </View>
                    </View>
                  </ImageBackground>
                </LinearGradient>

                <View
                  style={{
                    height: Dimensions.get("window").height * 0.1,
                    flexDirection: "column",
                    justifyContent: "center"
                  }}
                >
                  {indexRoleCheck ? (
                    <CityScreenCardsFooter
                      idCity={idCity}
                      activeUser={active_users}
                      user={total_users}
                      overall={overall}
                      avatarId={avatarId}
                      style={{ marginTop: -15 }}
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
            <TouchableOpacity
              activeOpacity={1}
              style={styles.card}
              onPress={() => this.card.flip()}
            >
              <SvgCityPolygon
                idCity={idCity}
                walk={footslogger}
                bike={urban_cyclist}
                publicTrasport={bus_lover}
                overall={overall}
                activeUser={active_users}
                user={total_users}
                level={this.getLevelFromInt(level)}
                colorProfile={"#000000"}
                colorTitle={"#9D9B9C"}
                avatarId={avatarId}
                city={this.props.city}
                subCity={citiesDescription(this.props.city)}
                onPress={() => this.card.flip()}
              />
            </TouchableOpacity>
          </CardFlip>
        )}
      </View>
    );
  }
}

// Roma: #FBB03B
// Sosnowiec: #F4C204
// Kayowice: #3466B9
// Ghent: #F4492C
// Cagliari: #191F37
// Sabac: #FF0000
// Amsterdam: #0AA04E
// Fundao: #29ABE2
// Ostend: #FFE600
// Teresina: #AA1840
// Gliwice: #FF0619
// Monaco: #FFE600
// Barcellona: #FF9700
// Helsinki: #0072C6
// Milano: #C1272D
// Palermo: #EE7AAA

export function citiesColor(city) {
  const cityLower = city.toLowerCase();
  switch (cityLower) {
    case "amsterdam":
      return "#0AA04E";
      break;
    case "barcelona":
      return "#FF9700";
      break;
    case "fundão":
      return "#29ABE2";
      break;
    case "gent":
      return "#F4492C";
      break;
    case "helsinki":
      return "#0072C6";
      break;
    case "palermo":
      return "#EE7AAA";
      break;
    case "katowice":
      return "#3466B9";
      break;
    case "oostende":
      return "#FFE600";
      break;
    case "roma":
      return "#FBB03B";
      break;
    case "šabac":
      return "#FF0000";
      break;
    case "teresina":
      return "#AA1840";
      break;
    case "veszprém":
      return "#2E2667";
      break;
    case "dudelange":
      return "#242438";
      break;
      case "gliwice":
      return "#FF0619";
      break;
    case "sosnowiec":
      return "#F4C204";
      break;
    case "milano":
      return "#C1272D";
      break;
    case "cagliari":
      return "#191F37";
      break;
    case "münchen":
      return "#FFE600";
      break;

    default:
      return "#242438";
      break;
  }
}

export function citiesDescription(city) {
  const cityLower = city.toLowerCase();
  switch (cityLower) {
    case "amsterdam":
      return "Netherlands";
      break;
    case "barcelona":
      return "Spain";
      break;
    case "fundão":
      return "Portugal";
      break;
    case "gent":
      return "Belgium";
      break;
    case "helsinki":
      return "Finland";
      break;
    case "palermo":
      return "Italy";
      break;
    case "katowice":
      return "Poland";
      break;
    case "oostende":
      return "Belgium";
      break;
    case "roma":
      return "Italy";
      break;
    case "šabac":
      return "Serbia";
      break;
    case "teresina":
      return "Brazil";
      break;
    case "veszprém":
      return "Hungary";
      break;
    case "dudelange":
      return "Luxembourg";
      break;
      case "gliwice":
      return "Poland";
      break;
    case "sosnowiec":
      return "Poland";
      break;
    case "milano":
      return "Italy";
      break;
    case "cagliari":
      return "Italy";
      break;
    case "münchen":
      return "Germany";
      break;

      

    default:
      return "";
      break;
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
    height: Dimensions.get("window").height * 0.45
    // backgroundColor: "#3d3d3d"
  },

  ImageContent: {
    width: Dimensions.get("window").width * 0.83,
    // height: Dimensions.get("window").height * 0.4,
    height: Dimensions.get("window").height * 0.45
    // backgroundColor: "#3d3d3d"
  },
  avatarImage: {
    // flex: 1,
    // position: "absolute",
    width: 150,
    height: 150,
    alignSelf: "center",
    opacity: 1
  },
  cityImage: {
    flex: 1,
    // position: "absolute",

    width: 214,
    height: 350,
    alignSelf: "center",
    justifyContent: "center",
    flexDirection: "row",
    opacity: 1
  },
  cityCircle: {
    // position: "absolute",
    // borderRadius: 100,

    width: 200,
    height: 200,
    alignSelf: "center",
    justifyContent: "center",
    flexDirection: "row"
    // backgroundColor: "rgba(255, 255, 255, 0.5)"
  },
  nameText: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    fontFamily: "Montserrat-ExtraBold"
  },
  levelText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Montserrat-Regular"
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

export default withData(CityScreenCards);
