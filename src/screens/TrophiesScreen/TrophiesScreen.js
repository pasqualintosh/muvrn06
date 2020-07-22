import React from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  RefreshControl,
  ActivityIndicator,
  TouchableWithoutFeedback,
  NativeModules,
  Image,
  ImageBackground
} from "react-native";
import moment from "moment";

import { getTrophiesNew } from "./../../domains/standings/ActionCreators";
import { connect } from "react-redux";
// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

import { createSelector } from "reselect";
import Aux from "../../helpers/Aux";
import { strings, getLanguageI18n } from "../../config/i18n";
import WebService from "../../config/WebService";
class TrophiesScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      modalActive: false,
      iconChoose: "round_info_icn"
    };
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.props.dispatch(getTrophiesNew());
    // if (this.props.statisticsState.error)
    //   Alert.alert("Oops", "Seems like an error occured");
    const loading = setInterval(() => {
      this.setState({ refreshing: false });
      clearTimeout(loading);
    }, 1000);
  }

  componentWillMount() {
    const language = getLanguageI18n();
    console.log(language);
    try {
      switch (language) {
        case "en":
          break;
        case "nl":
          require("moment/locale/nl");
          break;
        case "sv":
          require("moment/locale/sv");
          break;
        case "es":
          require("moment/locale/es");
          break;
        case "it":
          require("moment/locale/it");
          break;
        case "ca":
          require("moment/locale/ca");
          break;
        case "pt":
          require("moment/locale/pt");
          break;
        case "br":
          require("moment/locale/br");
        case "rs":
          break;
        case "pl":
          require("moment/locale/pl");
          break;
        default:
          break;
      }
    } catch (error) {}
  }

  componentDidMount() {
    this.props.dispatch(getTrophiesNew());
  }

  viewTrophies = trophies => {
    return trophies.map((elemTot, index) => (
      <View
        key={index * 3}
        style={{
          width: Dimensions.get("window").width * 0.9,

          flexDirection: "row",
          justifyContent: "flex-start",
          alignContent: "center",
          alignSelf: "center",
          paddingBottom: 10,
          paddingTop: 10
        }}
      >
        {this.tripleTrophies(elemTot, index)}
      </View>
    ));
  };

  renderEmptyTrophies() {
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
            width: Dimensions.get("window").width * 0.9
          }}
        >
          <View
            style={[
              styles.headerNotrophyContainer,
              { height: 75, alignSelf: "center" }
            ]}
          >
            <Text style={styles.headerNoTrophyText}>{strings("id_9_02")}</Text>
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
              source={require("./../../assets/images/trophies/trophy_empty.png")}
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

  tripleTrophies = (elemTot, index) => {
    return elemTot.map((elem, id) => (
      <TouchableOpacity
        key={id + 3 * index + 1}
        onPress={() => this.props.detailTrophies(elem)}
      >
        <View>
          <Image
            source={{ uri: WebService.url + elem.trophy.img }}
            style={{
              width: Dimensions.get("window").width * 0.3,
              height: Dimensions.get("window").width * 0.3
            }}
          />
          <Text
            style={{
              paddingTop: 5,
              textAlign: "center",
              fontFamily: "OpenSans-Regular",

              color: "#3D3D3D",
              fontSize: 8
            }}
          >
            {moment(elem.week_date).format("Do MMMM")}
          </Text>
        </View>
      </TouchableOpacity>
    ));
  };

  renderTrophies() {
    // divido i trofei per anno 2020 e 2021
    console.log(this.props.trophies);
    const trophies2020 = this.props.trophies.filter(
      trophy => trophy.week_date.slice(0, 4) === "2020"
    );
    console.log(trophies2020);
    const trophies2021 = this.props.trophies.filter(
      trophy => trophy.week_date.slice(0, 4) === "2021"
    );
    Array.prototype.chunk = function(n) {
      if (!this.length) {
        return [];
      }
      return [this.slice(0, n)].concat(this.slice(n).chunk(n));
    };

    const trophies2020List = trophies2020.chunk(3);
    console.log(trophies2020List);
    const trophies2021List = trophies2021.chunk(3);
    console.log(trophies2021List);

    return (
      <View
        style={{
          backgroundColor: "#fff",
          height: Dimensions.get("window").height,
          width: Dimensions.get("window").width
        }}
      >
        <ImageBackground
          style={styles.curveContainer}
          source={require("./../../assets/images/purple_waves_bg.png")}
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          style={{
            // backgroundColor: "#fff",
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width
          }}
          contentContainerStyle={{
            alignItems: "center",
            // backgroundColor: "#fff",
            justifyContent: "flex-start",
            alignItems: "center",
            width: Dimensions.get("window").width,
            paddingBottom: 30

            // height: Dimensions.get("window").height
          }}
        >
          {this.viewShowcase(trophies2020List, trophies2021List)}
        </ScrollView>
      </View>
    );
  }

  viewShowcase = (trophies2020List, trophies2021List) => {
    if (trophies2021List.length && trophies2020List.length) {
      return (
        <View
          style={{
            flexDirection: "column",
            justifyContent: "flex-start",
            position: "relative",
            alignSelf: "center",
            paddingTop: 10,
            width: Dimensions.get("window").width * 0.9
          }}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>SHOWCASE 2021</Text>
          </View>
          {this.viewTrophies(trophies2021List)}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>SHOWCASE 2020</Text>
          </View>
          {this.viewTrophies(trophies2020List)}
        </View>
      );
    } else if (trophies2021List.length) {
      return (
        <View
          style={{
            flexDirection: "column",
            justifyContent: "flex-start",
            position: "relative",
            alignSelf: "center",
            paddingTop: 10,
            width: Dimensions.get("window").width * 0.9
          }}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>SHOWCASE 2021</Text>
          </View>
          {this.viewTrophies(trophies2021List)}
        </View>
      );
    } else {
      return (
        <View
          style={{
            flexDirection: "column",
            justifyContent: "flex-start",
            position: "relative",
            alignSelf: "center",
            paddingTop: 10,
            width: Dimensions.get("window").width * 0.9
          }}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>SHOWCASE 2020</Text>
          </View>
          {this.viewTrophies(trophies2020List)}
        </View>
      );
    }
  };

  render() {
    return (
      <Aux>
        {this.props.trophies.length
          ? this.renderTrophies()
          : this.renderEmptyTrophies()}
      </Aux>
    );
  }
}

// trofei
const getTrophiesList = state => state.standings.trophies;

// prendo i trofei
// reverse cosi metto prima quelli nuovi
const getTrophiesState = createSelector([getTrophiesList], trophies =>
  trophies ? trophies : []
);

// dati d'esempio
// const getTrophiesState = createSelector([getTrophiesList], trophies =>
//   trophies ? [
//     {
//       id: 160 ,
//       key: 160,
//       points: 51026,
//       created_at: "2020-12-23 17:01:00.000000",
//       week_date: "2020-12-23 17:01:00.000000",
//       city_id: 1122,
//       trophy_id: 4,
//       trophy: {key: 4},
//       user_id: 211
//     }
//   ] : [
//     {
//       id: 160 ,
//       key: 160,
//       points: 51026,
//       created_at: "2020-12-23 17:01:00.000000",
//       week_date: "2020-12-23 17:01:00.000000",
//       city_id: 1122,
//       trophy_id: 4,
//       trophy: {key: 4},
//       user_id: 211
//     }
//   ]
// );

// 161,30015,2020-12-23 17:01:00.000000,2020-12-23 17:01:00.000000,1122,5,70
// 162,22858,2020-12-23 17:01:00.000000,2020-12-23 17:01:00.000000,1122,6,69
// 163,18604,2020-12-23 17:01:00.000000,2020-12-23 17:01:00.000000,915,4,663
// 164,14371,2020-12-23 17:01:00.000000,2020-12-23 17:01:00.000000,915,5,644
// 165,11044,2020-12-23 17:01:00.000000,2020-12-23 17:01:00.000000,915,6,640
// 166,35259,2020-12-23 17:01:00.000000,2020-12-23 17:01:00.000000,869,4,442
// 167,12242,2020-12-23 17:01:00.000000,2020-12-23 17:01:00.000000,869,5,401

const withData = connect(state => {
  return {
    trophies: getTrophiesState(state)
  };
});

export default withData(TrophiesScreen);

export const images = {
  1: require("./../../assets/images/trophies/trophy_global_first.png"),
  2: require("./../../assets/images/trophies/trophy_global_second.png"),
  3: require("./../../assets/images/trophies/trophy_global_third.png"),
  4: require("./../../assets/images/trophies/trophy_city_first.png"),
  5: require("./../../assets/images/trophies/trophy_city_second.png"),
  6: require("./../../assets/images/trophies/trophy_city_third.png")
};

const styles = StyleSheet.create({
  headerContainer: {
    width: Dimensions.get("window").width * 0.9,
    alignContent: "center",
    alignSelf: "center",
    height: 50,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  headerNotrophyContainer: {
    width: Dimensions.get("window").width * 0.8,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  curveContainer: {
    width: Dimensions.get("window").width,
    height: 320,
    position: "absolute",
    top: 0,
    left: 0
  },
  headerText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 16,
    textAlignVertical: "center"
  },
  headerNoTrophyText: {
    fontFamily: "OpenSans-Regular",
    color: "#3F3F3F",
    fontSize: 12,
    textAlignVertical: "center"
  },
  centerTextContainer: {
    position: "absolute",
    top: 120
  },
  centerValue: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 37,
    textAlign: "center",
    textAlignVertical: "center"
  },
  centerTextParam: {
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
    fontWeight: "400",
    color: "#9D9B9C",
    fontSize: 9,
    fontWeight: "bold"
  },
  iconText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 10,
    textAlignVertical: "center"
  },
  mfrText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3D3D3D",
    fontSize: 13,
    marginRight: 0
  },
  deleteContainer: {
    width: 18,
    height: 18
  },
  mainContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.06,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  sideContainer: {
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").height * 0.06,
    // backgroundColor: "#6397CB",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#fff",
    fontSize: 10,
    marginVertical: 1
  },
  underline: {
    width: Dimensions.get("window").width * 0.25,
    height: 6,
    backgroundColor: "#FFFFFF",
    marginVertical: 4
  }
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    deleteContainer: {
      width: 18,
      height: 18,
      right: 35
    }
  });
}
