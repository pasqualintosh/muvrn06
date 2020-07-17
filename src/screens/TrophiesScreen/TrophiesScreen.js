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
  Image
} from "react-native";

import { getTrophies } from "./../../domains/standings/ActionCreators";
import { connect } from "react-redux";
import Settings from "./../../config/Settings";
import DeviceInfo from "react-native-device-info";
// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

import OwnIcon from "../../components/OwnIcon/OwnIcon";
import DescriptionIcon from "../../components/DescriptionIcon/DescriptionIcon";
import { createSelector } from "reselect";
import Aux from "../../helpers/Aux";
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
    this.props.dispatch(getTrophies());
    // if (this.props.statisticsState.error)
    //   Alert.alert("Oops", "Seems like an error occured");
    const loading = setInterval(() => {
      this.setState({ refreshing: false });
      clearTimeout(loading);
    }, 1000);
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

  componentDidMount() {
    this.props.dispatch(getTrophies());
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
            width: Dimensions.get("window").width * 0.8
          }}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>SHOWCASE </Text>
            <OwnIcon
              name="round_info_icn"
              click={() => this.DescriptionIconModal("infoNoTrophies")}
              size={25}
              color="#3D3D3D"
            />
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
            source={images[elem.trophy.key]}
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
            {new Date(elem.updated_at).getDate().toString().length === 2
              ? new Date(elem.updated_at).toDateString().slice(4, 10) +
                ", " +
                new Date(elem.updated_at).toDateString().slice(10)
              : new Date(elem.updated_at).toDateString().slice(4, 8) +
                " " +
                new Date(elem.updated_at).toDateString().slice(9, 10) +
                ", " +
                new Date(elem.updated_at).toDateString().slice(10)}
          </Text>
        </View>
      </TouchableOpacity>
    ));
  };

  renderTrophies() {
    // divido i trofei per anno 2019 e 2018
    console.log(this.props.trophies);
    const trophies2018 = this.props.trophies.filter(
      trophy => trophy.updated_at.slice(0, 4) === "2018"
    );
    console.log(trophies2018);
    const trophies2019 = this.props.trophies.filter(
      trophy => trophy.updated_at.slice(0, 4) === "2019"
    );
    Array.prototype.chunk = function(n) {
      if (!this.length) {
        return [];
      }
      return [this.slice(0, n)].concat(this.slice(n).chunk(n));
    };

    const trophies2018List = trophies2018.chunk(3);
    console.log(trophies2018List);
    const trophies2019List = trophies2019.chunk(3);
    console.log(trophies2019List);

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
        style={{
          backgroundColor: "#fff",
          height: Dimensions.get("window").height,
          width: Dimensions.get("window").width
        }}
        contentContainerStyle={{
          alignItems: "center",
          backgroundColor: "#fff",
          justifyContent: "flex-start",
          alignItems: "center",
          width: Dimensions.get("window").width,
          paddingBottom: 30

          // height: Dimensions.get("window").height
        }}
      >
        {this.viewShowcase(trophies2018List, trophies2019List)}
      </ScrollView>
    );
  }

  viewShowcase = (trophies2018List, trophies2019List) => {
    if (trophies2019List.length && trophies2018List.length) {
      return (
        <View
          style={{
            flexDirection: "column",
            justifyContent: "flex-start",
            position: "relative",
            alignSelf: "center",
            paddingTop: 10,
            width: Dimensions.get("window").width * 0.8
          }}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>SHOWCASE '19</Text>
            <OwnIcon
              name="round_info_icn"
              click={() => this.DescriptionIconModal("infoTrophies")}
              size={25}
              color="#3D3D3D"
            />
          </View>
          {this.viewTrophies(trophies2019List)}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>SHOWCASE '18</Text>
          </View>
          {this.viewTrophies(trophies2018List)}
        </View>
      );
    } else if (trophies2019List.length) {
      return (
        <View
          style={{
            flexDirection: "column",
            justifyContent: "flex-start",
            position: "relative",
            alignSelf: "center",
            paddingTop: 10,
            width: Dimensions.get("window").width * 0.8
          }}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>SHOWCASE '19</Text>
            <OwnIcon
              name="round_info_icn"
              click={() => this.DescriptionIconModal("infoTrophies")}
              size={25}
              color="#3D3D3D"
            />
          </View>
          {this.viewTrophies(trophies2019List)}
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
            width: Dimensions.get("window").width * 0.8
          }}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>SHOWCASE '18</Text>
            <OwnIcon
              name="round_info_icn"
              click={() => this.DescriptionIconModal("infoTrophies")}
              size={25}
              color="#3D3D3D"
            />
          </View>
          {this.viewTrophies(trophies2018List)}
        </View>
      );
    }
  };

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

  render() {
    return (
      <Aux>
        <DescriptionIcon
          active={this.state.modalActive}
          icon={this.state.iconChoose}
          DeleteDescriptionIconModal={this.DeleteDescriptionIconModal}
        />
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
const getTrophiesState = createSelector(
  [getTrophiesList],
  trophies => (trophies ? trophies.reverse() : [])
);

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
    width: Dimensions.get("window").width * 0.8,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 20,
    textAlign: "left",
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
