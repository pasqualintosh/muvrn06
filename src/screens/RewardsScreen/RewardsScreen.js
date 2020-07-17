import React from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  RefreshControl
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import { strings } from "../../config/i18n";
import {
  getSpecialTrainingSessions,
  getSpecialTrainingSessionSubscribed
} from "./../../domains/trainings/ActionCreators";
import { getSponsor } from "./../../helpers/specialTrainingSponsors";
import { translateSpecialEvent } from "../../helpers/translateSpecialEvent";

import Settings from "./../../config/Settings";

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

class RewardsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  onRefresh() {
    this.setState({ refreshing: true });
    // this.props.dispatch(getSpecialTrainingSessions());
    this.props.dispatch(getSpecialTrainingSessionSubscribed());
    // if (this.props.statisticsState.error)
    //   Alert.alert("Oops", "Seems like an error occured");
    const loading = setInterval(() => {
      this.setState({ refreshing: false });
      clearTimeout(loading);
    }, 3000);
  }

  componentDidMount() {
    // this.props.dispatch(getSpecialTrainingSessions());
    this.props.dispatch(getSpecialTrainingSessionSubscribed());
    Tracker.trackScreenView("RewardsScreen.js");
    trackScreenView("RewardsScreen.js");

  }

  getSTId = title => {
    return this.props.trainingsState.subscribed_special_training.filter(e => {
      // console.log(e);
      return e.training_title == title;
    })[0].training_title;
  };

  getSTInfo = title => {
    const text = this.props.trainingsState.subscribed_special_training.filter(e => {
      // console.log(e);
      return e.training_title == title;
    })[0].training_description
    return text ? text : "";
  };

  getImage(id) {
    switch (id) {
      case 12:
        return (
          <Image
            source={require("../../assets/images/rewards/bar.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case 37:
        return (
          <Image
            source={require("../../assets/images/rewards/gifts.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case "Giretto d'Italia 2019":
        return (
          <Image
            source={require("../../assets/images/rewards/gifts.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case 38:
        return (
          <Image
            source={require("../../assets/images/rewards/games.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case "Mobilità Agrodolce 2019":
        return (
          <Image
            source={require("../../assets/images/rewards/games.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case 39:
        return (
          <Image
            source={require("../../assets/images/rewards/gifts.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case "Street Parade":
        return (
          <Image
            source={require("../../assets/images/rewards/gifts.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case 40:
        return (
          <Image
            source={require("../../assets/images/rewards/art.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case "Milano Bike Week":
        return (
          <Image
            source={require("../../assets/images/rewards/art.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case 41:
        return (
          <Image
            source={require("../../assets/images/rewards/games.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case "Passeio Ciclístico CAIS-PM-PI":
        return (
          <Image
            source={require("../../assets/images/rewards/games.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case 42:
        return (
          <Image
            source={require("../../assets/images/rewards/bar.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case "Movimento a ritmo africano":
        return (
          <Image
            source={require("../../assets/images/rewards/bar.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case 43:
        return (
          <Image
            source={require("../../assets/images/rewards/furniture.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case "Al mercato per una mattonella (che non si mangia)!":
        return (
          <Image
            source={require("../../assets/images/rewards/furniture.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case 44:
        return (
          <Image
            source={require("../../assets/images/rewards/games.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case "Take part and you will be rewarded!":
        return (
          <Image
            source={require("../../assets/images/rewards/games.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;
      case 45:
        return (
          <Image
            source={require("../../assets/images/rewards/gifts.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case "Stunning Sant Andreu":
        return (
          <Image
            source={require("../../assets/images/rewards/gifts.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      case 25:
        return (
          <Image
            source={require("../../assets/images/rewards/bar.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;

      default:
        return (
          <Image
            source={require("../../assets/images/rewards/subscriptions.png")}
            style={{
              width: 50,
              height: 50
            }}
            resizeMethod={"auto"}
          />
        );
        break;
    }
  }

  getLinkContentFromReward = (str = "") => {
    // var str = "Hellofewfweesf  wweffewfewfew https://palermo.muv2020.eu/muv-open-day/ %sito% ciaowedsffewf";
    var first_perc = str.indexOf("https");

    if (first_perc == -1) {
      return <Text style={styles.rewardDescription}>{str}</Text>;
    } else {
      let last_perc = str.indexOf("/ ", first_perc);

      let didascaliaStart = str.indexOf("%", last_perc);
      let didascaliaEnd = str.indexOf("%", didascaliaStart + 1);

      let introduction = str.substr(0, first_perc);

      let link = str.substr(first_perc, last_perc - first_perc + 1);
      let didascalia = str.substr(
        didascaliaStart + 1,
        didascaliaEnd - didascaliaStart - 1
      );

      let end = str.substr(didascaliaEnd + 1, str.lenght);

      // let end = str.substr(last_perc + 1, str.lenght);
      // document.getElementById("demo").innerHTML =   introduction + link + end ;

      return (
        <View>
          <Text style={styles.rewardDescription}>
            {introduction}
            <Text
              style={[
                styles.rewardDescription,
                { textDecorationLine: "underline" }
              ]}
              onPress={() => this.moveWeb({ website: link })}
            >
              {didascalia}
            </Text>
            {end}
          </Text>
        </View>
      );
    }
  };

  renderItem = (id, title) => {
    let st_id = this.getSTId(title);
    console.log(st_id);
    let sponsor = getSponsor(st_id);
    let info = this.getSTInfo(title);
    console.log(sponsor);
    console.log(info);

    return (
      <TouchableWithoutFeedback
        key={id}
        onPress={() => {
          this.props.navigation.navigate("RewardDetailScreen", { id });
        }}
      >
        <View style={styles.itemContainer}>
          <View style={styles.item}>
            <View style={styles.leftContainer}>
              {/* <Image
                style={{
                  width: 50,
                  height: 50
                }}
                source={require("./../../assets/images/rewards/subscriptions.png")}
              /> */}
              {this.getImage(st_id)}
            </View>
            <View style={styles.centerContainer}>
              <Text style={styles.rewardTxt}>{title}</Text>
              {/* <Text style={styles.rewardDescription}>
                {translateSpecialEvent(info)}
              </Text> */}
              {this.getLinkContentFromReward(translateSpecialEvent(info))}
              <Text style={styles.rewardPoweredBy}>
                {"by "}
                <Text style={[styles.rewardPoweredBy, { fontWeight: "bold" }]}>
                  {sponsor.name}
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.rightContainer}>
            <Icon
              name="md-arrow-forward"
              size={18}
              color="#3d3d3d"
              style={{}}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  renderItemList() {
    return this.props.trainingsState.subscribed_special_training
      .filter(e => {
        return e.status == 1;
      })
      .map(e => {
        return this.renderItem(e.reward_id, e.training_title);
      });
  }

  renderEmptyRewards() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "#fff",
          flex: 1
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-around",
            height: Dimensions.get("window").height * 0.64,
            position: "relative",
            alignSelf: "center",
            width: Dimensions.get("window").width * 0.8
          }}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{strings("your_next_rewar")}</Text>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.6,
              height: Dimensions.get("window").width * 0.6,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignSelf: "center"
            }}
          >
            <Image
              source={require("./../../assets/images/rewards_empty.png")}
              style={{
                width: Dimensions.get("window").width * 0.6,
                height: Dimensions.get("window").width * 0.6
              }}
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  render() {
    console.log(this.props);
    // console.log(
    //   this.props.trainingsState.subscribed_special_training.filter(e => {
    //     return e.status == 1;
    //   }).length
    // );
    if (
      this.props.trainingsState.subscribed_special_training &&
      this.props.trainingsState.subscribed_special_training.filter(e => {
        return e.status == 1;
      }).length > 0
    ) {
      return (
        <ScrollView
          style={{
            backgroundColor: "#fff",
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width
          }}
          refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
        >
          <View style={{ height: 20 }} />
          {this.renderItemList()}
          <View
              style={{
                height: 100,

                flexDirection: "row"
              }}
            />
        </ScrollView>
      );
    } else {
      return this.renderEmptyRewards();
    }
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    width: Dimensions.get("window").width * 0.8,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  headerText: {
    fontFamily: "OpenSans-Regular",
    color: "#3F3F3F",
    fontSize: 12,
    textAlignVertical: "center"
  },
  itemContainer: {
    flex: 1,
    // minHeight: 100,
    flexDirection: "row",
    // borderTopColor: "#9D9B9C",
    // borderTopWidth: 0.3,
    borderBottomColor: "#9D9B9C",
    borderBottomWidth: 0.3,
    backgroundColor: "#fff"
  },
  rewardTxt: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D",
    textAlign: "left"
  },
  rewardDescription: {
    fontSize: 10,
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D",
    textAlign: "left"
  },
  rewardPoweredBy: {
    fontSize: 9,
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D",
    textAlign: "left",
    marginTop: 7
  },
  item: {
    flexDirection: "row"
    // height: Dimensions.get("window").height * 0.1
  },
  leftContainer: {
    width: Dimensions.get("window").width * 0.3,
    // height: 100,
    justifyContent: "center",
    alignItems: "center"
  },
  centerContainer: {
    width: Dimensions.get("window").width * 0.5,
    // height: 100,
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 10
  },
  rightContainer: {
    width: Dimensions.get("window").width * 0.2,
    // height: 100,
    justifyContent: "center",
    alignItems: "center"
  }
});

export const rewardImage = [
  require("./../../assets/images/rewards/wines.png"),
  require("./../../assets/images/rewards/accessories.png"),
  require("./../../assets/images/rewards/art.png"),
  require("./../../assets/images/rewards/bar.png"),
  require("./../../assets/images/rewards/clothing.png"),
  require("./../../assets/images/rewards/communication_services.png"),
  require("./../../assets/images/rewards/consulting_services.png"),
  require("./../../assets/images/rewards/domestic_appliances.png"),
  require("./../../assets/images/rewards/domotic.png"),
  require("./../../assets/images/rewards/food.png"),
  require("./../../assets/images/rewards/furniture.png"),
  require("./../../assets/images/rewards/games.png"),
  require("./../../assets/images/rewards/gifts.png"),
  require("./../../assets/images/rewards/graphic_design.png"),
  require("./../../assets/images/rewards/hardwares.png"),
  require("./../../assets/images/rewards/ict_services.png"),
  require("./../../assets/images/rewards/maintenance_repair_services.png"),
  require("./../../assets/images/rewards/music.png"),
  require("./../../assets/images/rewards/plants.png"),
  require("./../../assets/images/rewards/print_service.png"),
  require("./../../assets/images/rewards/restaurant.png"),
  require("./../../assets/images/rewards/shoes.png"),
  require("./../../assets/images/rewards/software.png"),
  require("./../../assets/images/rewards/sport.png"),
  require("./../../assets/images/rewards/subscriptions.png"),
  require("./../../assets/images/rewards/training_courses.png"),
  require("./../../assets/images/rewards/travel.png"),
  require("./../../assets/images/rewards/utilities.png"),
  require("./../../assets/images/rewards/wellness.png"),
  require("./../../assets/images/rewards/books.png")
];

const withData = connect(state => {
  return {
    trainingsState: state.trainings
  };
});

export default withData(RewardsScreen);
