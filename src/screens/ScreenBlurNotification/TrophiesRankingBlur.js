import React from "react";
import {
  View,
  Text,
  Platform,
  findNodeHandle,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  NativeModules,
  ListView
} from "react-native";


import Aux from "../../helpers/Aux";
import Blur from "../../components/Blur/Blur";
import NotificationPoint from "./../../components/NotificationPoint/NotificationPoint";
import TrophiesRanking from "../TrophiesRanking/TrophiesRanking";
import Settings from "./../../config/Settings";
import DeviceInfo from "react-native-device-info";
// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

import { connect } from "react-redux";
import { getTrophiesDetail } from "./../../domains/standings/ActionCreators";
import LinearGradient from "react-native-linear-gradient";

class TrophiesRankingBlur extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      trophies: [],
      viewRef: null,
      title: "City"
    };
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

    const trophy = this.props.navigation.getParam("trophy", []);

    this.props.dispatch(getTrophiesDetail(trophy, this.saveTrophies));
  }

  saveTrophies = data => {
    this.setState({
      trophies: data
    });
  };

  static navigationOptions = ({ navigation, screenProps }) => ({
    headerTitle: navigation.state.params
      ? navigation.state.params.headerTitle
      : null
  });

  componentDidMount() {
    // quando ho caricato il componente, posso dire a blur che è possibile fare il blur usando questa variabile
    this.setState({ viewRef: findNodeHandle(this.view) });
    // Individual Standings
    const trophy = this.props.navigation.getParam("trophy", []);

    const title = trophy.city ? "Individual" : "World";

    this.setState({
      title: trophy.city ? "City" : "World"
    });

    // Set route params
    this.props.navigation.setParams({
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {/* 
          {this.state.activeSelectable.charAt(0).toUpperCase()}
          {this.state.activeSelectable.slice(1)}
          {" Ranking"} 
          */}
          {title}
          {" Standing"}
        </Text>
      )
    });
  }

  renderHeader(myTrophy) {
    // prendo la data dal navigation
    /* const date = new Date(myTrophy.updated_at);
    console.log(date);
    const upDayTen = date.getDate().toString().length;
    const textDate = date.toDateString();
    let time = "";
    if (upDayTen === 2) {
      time = textDate.slice(4, 10) + "th " + textDate.slice(10);
    } else {
      time =
        textDate.slice(4, 8) +
        " " +
        textDate.slice(9, 10) +
        "th " +
        textDate.slice(10);
    } */
    let dataStart = new Date("2018-11-25T00:00:00.465Z");
    if (myTrophy.updated_at.slice(0, 4) === "2019") {
      // l'ultima domenica del 2018 come riferimento
      dataStart = new Date("2018-12-30T00:00:00.465Z");
    }

    const dateNow = new Date(myTrophy.updated_at);
    const differenceData = dateNow - dataStart;
    console.log(differenceData);
    const seconds = new Date(differenceData).getTime();
    console.log(seconds);
    const weeks = parseInt(seconds / 604800000);

    console.log(weeks);

    // const Roman = this.ASCIItoRomanNumeralConverter(weeks);
    const descr =
      " " +
      this.state.title +
      " " +
      "Weekly" +
      " " +
      "Challenge '" +
      dateNow
        .getFullYear()
        .toString()
        .slice(2, 4);

    return (
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.0, y: 1.0 }}
        locations={[0, 1.0]}
        colors={["#3D3D3D", "rgba(61, 61, 61, 0.9)"]}
        style={styles.selectableHeaderBlock}
      >
        <View style={{ height: 10 }} />
        <View
          style={{
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            flexDirection: "column",
            width: Dimensions.get("window").width
          }}
        >
          <View style={styles.HeaderTimer}>
            <Text>
              <Text style={styles.TimerItalics}>
                {/* {weeks} */}
                {this.ordinaSuffixOf(weeks)}
              </Text>
              <Text style={styles.Timer}>{descr}</Text>
            </Text>
          </View>
        </View>
        <View style={{ height: 10 }} />
      </LinearGradient>
    );
  }

  ordinaSuffixOf = i => {
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  };

  refreshTrophies = () => {
    const trophy = this.props.navigation.getParam("trophy", []);

    this.props.dispatch(getTrophiesDetail(trophy, this.saveTrophies));
  };

  ASCIItoRomanNumeralConverter = num => {
    const lookup = {
      C: 100000,
      XC: 90000,
      L: 50000,
      XL: 40000,
      X: 10000,
      MX: 9000,
      V: 5000,
      MV: 4000,
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IV: 9,
      VIII: 8,
      VII: 7,
      VI: 6,
      V: 5,
      IV: 4,
      III: 3,
      II: 2,
      I: 1
    };
    let roman = "";
    let i = 0;
    for (i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  };

  render() {
    const trophy = this.props.navigation.getParam("trophy", []);
    console.log(trophy);

    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />
        <View
          ref={view => {
            this.view = view;
          }}
          style={{
            backgroundColor: "#fff",
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height
          }}
        >
          {this.renderHeader(trophy)}
          <TrophiesRanking
            navigation={this.props.navigation}
            trophy={trophy}
            trophies={this.state.trophies}
            refreshTrophies={this.refreshTrophies}
          />
        </View>
        <Blur viewRef={this.state.viewRef} />
      </Aux>
    );
  }
}

const styles = StyleSheet.create({
  selectableHeader: {
    height: 30,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    backgroundColor: "#fff"
  },
  selectableHeaderBlock: {
    height: 50
  },
  selectableHeaderRow: {
    height: 30,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around"
  },

  notSelectable: {
    flex: 1,
    marginHorizontal: 6
  },
  selectable: {
    marginHorizontal: 6,
    borderBottomColor: "#9D9B9C",
    borderBottomWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: 30,
    width: Dimensions.get("window").width * 0.25
  },
  HeaderTimer: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: 30,
    flexDirection: "row"

    // left: Dimensions.get("window").width * 0.1
  },
  selectableTouchable: {
    justifyContent: "center",
    alignItems: "center"
  },
  selectableContainer: {
    height: 30,
    width: Dimensions.get("window").width * 0.2,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  selectableLabel: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3D3D3D",
    fontSize: 10,
    // fontWeight: "bold",
    // marginBottom: 4,
    marginVertical: 0,
    textAlign: "center"
  },
  Timer: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#FFFFFF",
    fontSize: 20,
    // fontWeight: "bold",
    // marginBottom: 4,
    marginVertical: 0,
    textAlign: "center"
  },
  TimerItalics: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#FFFFFF",
    fontSize: 20,
    fontStyle: "italic",
    // fontWeight: "bold",
    // marginBottom: 4,
    marginVertical: 0,
    textAlign: "center"
  }
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    selectableLabel: {
      fontFamily: "Montserrat-ExtraBold",
      color: "#3D3D3D",
      fontSize: 8,
      // fontWeight: "bold",
      // marginBottom: 4,
      marginVertical: 0,
      marginTop: 3,
      textAlign: "center"
    }
  });
}

const withData = connect();

export default withData(TrophiesRankingBlur);
