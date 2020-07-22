import React from "react";
import {
  Text,
  Dimensions,
  Platform,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableWithoutFeedback
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { getMostFrequentRoute } from "./../../domains/login/ActionCreators";
import ProfileScreenHeader from "./../../components/ProfileScreenHeader/ProfileScreenHeader";
import ProfileScreenCards from "./../../components/ProfileScreenCards/ProfileScreenCards";
import ProfileScreenTranings from "./../../components/ProfileScreenTranings/ProfileScreenTranings";
import FriendScreen from "./../../components/FriendScreen/FriendScreen";
import { changeScreenProfile } from "../../domains/trainings/ActionCreators";
import { strings } from "../../config/i18n";
import MultiPointedCircleSvg from "./../../components/MultiPointedCircleSvg/MultiPointedCircleSvg";
import { getPermActivitiesState } from "./../../domains/statistics/Selectors";
import { getStatsNew } from "./../../domains/statistics/ActionCreators";
import PieChart from "./../../components/AreaStack/PieChart";
import AutoAnimation from "./../../components/AutoAnimation/AutoAnimation";
import ChartsStats from "./../../components/ChartsStats/ChartsStats";
import pointsDecimal from "./../../helpers/pointsDecimal";
import { BoxShadow } from "react-native-shadow";
import EnableHealthButton from "./../../components/EnableHealthButton/EnableHealthButton";

function roundUsing(func, number, prec) {
  var tempnumber = number * Math.pow(10, prec);
  tempnumber = func(tempnumber);
  return tempnumber / Math.pow(10, prec);
}

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("id_5_15")}
        </Text>
      ),
      headerRight: (
        <OwnIcon
          name="settings_icn"
          size={40}
          color="#9D9B9C"
          click={() => navigation.navigate("PersonalDataScreen")}
        />
      )
    };
  };

  componentWillMount() {
    this.props.dispatch(getStatsNew());
  }

  renderPieChart() {
    let distance = this.props.statisticsState.statistics.total_distance,
      walkPerc = 33.3,
      bikePerc = 33.3,
      publicPerc = 33.3;

    if (distance != 0) {
      walkPerc =
        (this.props.statisticsState.statistics.total_walking /
          this.props.statisticsState.statistics.total_distance) *
        100;
      bikePerc =
        (this.props.statisticsState.statistics.total_biking /
          this.props.statisticsState.statistics.total_distance) *
        100;
      publicPerc =
        (this.props.statisticsState.statistics.total_bus /
          this.props.statisticsState.statistics.total_distance) *
        100;
    }
    const data = [walkPerc, publicPerc, bikePerc];
    const colors = ["#6CBA7E", "#FAB21E", "#E83475"];
    const labels = ["walk", "public_transport", "bike"];

    const pieData = data.map((value, index) => ({
      value,
      svg: {
        fill: colors[index],
        label: labels[index],
        onPress: () => console.log("press", index)
      },
      key: `pie-${index}`
    }));
    return (
      <View
        style={{
          width: (Dimensions.get("window").width / 2) * 0.1,
          height: (Dimensions.get("window").width / 2) * 0.1,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          top: Dimensions.get("window").width * 0.48,
          right: Dimensions.get("window").width * 0
          // left: 0
        }}
      >
        <PieChart
          style={{
            width: Dimensions.get("window").width / 2,
            height: Dimensions.get("window").width / 2
          }}
          data={pieData}
          renderDecorator={({ item, pieCentroid, labelCentroid, index }) => {}}
        />
      </View>
    );
  }

  renderSustainabilitySection(CO2) {
    return (
      <View
        style={{
          // marginTop: 300,
          // height: 400,
          justifyContent: "flex-start",
          alignItems: "center",
          width: Dimensions.get("window").width,
          // position: 'absolute',
          top: -35
        }}
      >
        <Image
          source={require("../../assets/images/wave/green_wave_top.png")}
          style={styles.backgroundImageTop}
        />
        <View style={styles.View}>
          <View style={styles.FirstView}>
            <Text
              style={{
                fontFamily: "Montserrat-ExtraBold",
                color: "#fff",
                fontSize: 20,
                textAlign: "left"
              }}
            >
              {strings("id_5_07").toUpperCase()}
            </Text>
          </View>

          <View style={styles.SecondView}>
            <View
              style={{
                width: Dimensions.get("window").width * 0.8,
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  width: Dimensions.get("window").width * 0.8 - 90
                }}
              >
                <Text>
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontWeight: "700",
                      color: "#FFFFFF",
                      fontSize: 12,
                      textAlign: "left"
                    }}
                  >
                    {strings("id_5_08")}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontWeight: "400",
                      color: "#FFFFFF",
                      fontSize: 12,
                      textAlign: "left"
                    }}
                  >
                    {"\n" + strings("id_5_09")}
                  </Text>
                </Text>
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
                  width: 80,
                  alignContent: "flex-end",
                  justifyContent: "center",
                  alignItems: "flex-end"
                }}
              >
                <View>
                  <Text>
                    <Text
                      style={{
                        fontFamily: "Montserrat-ExtraBold",
                        color: "#3D3D3D",
                        fontSize: 10,
                        textAlign: "left"
                      }}
                    >
                      CO
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Montserrat-ExtraBold",
                        color: "#3D3D3D",
                        fontSize: 7,
                        textAlign: "left"
                      }}
                    >
                      2
                    </Text>
                  </Text>
                  <Text>
                    <Text
                      style={{
                        fontFamily: "Montserrat-ExtraBold",
                        color: "#FFFFFF",
                        fontSize: 25,
                        textAlign: "left"
                      }}
                    >
                      {roundUsing(Math.floor, CO2, 1)
                        .toString()
                        .replace(".", ",")}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "OpenSans-Regular",
                        fontWeight: "400",
                        color: "#FFFFFF",
                        fontSize: 10,
                        textAlign: "left"
                      }}
                    >
                      Kg
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
            <AutoAnimation />
          </View>

          <View style={styles.FirstView}>
            <Text
              style={{
                fontFamily: "Montserrat-ExtraBold",
                color: "#fff",
                fontSize: 20,
                textAlign: "left"
              }}
            >
              {strings("id_5_10").toUpperCase()}
            </Text>
          </View>

          <View
            style={{
              width: Dimensions.get("window").width * 0.8,
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                width: Dimensions.get("window").width * 0.8 - 90
              }}
            >
              <Text
                style={{
                  fontFamily: "OpenSans-Regular",
                  fontWeight: "400",
                  color: "#FFFFFF",
                  fontSize: 12,
                  textAlign: "left"
                }}
              >
                {"\n" + strings("id_5_18")}
              </Text>
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
                width: 80,
                alignContent: "flex-end",
                justifyContent: "center",
                alignItems: "flex-end"
              }}
            >
              {/* <View>
                <Text>
                  <Text
                    style={{
                      fontFamily: "Montserrat-ExtraBold",
                      color: "#3D3D3D",
                      fontSize: 10,
                      textAlign: "left"
                    }}
                  >
                    CO
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Montserrat-ExtraBold",
                      color: "#3D3D3D",
                      fontSize: 7,
                      textAlign: "left"
                    }}
                  >
                    2
                  </Text>
                </Text>
                <Text>
                  <Text
                    style={{
                      fontFamily: "Montserrat-ExtraBold",
                      color: "#FFFFFF",
                      fontSize: 25,
                      textAlign: "left"
                    }}
                  >
                    {roundUsing(Math.floor, CO2, 1)
                      .toString()
                      .replace(".", ",")}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontWeight: "400",
                      color: "#FFFFFF",
                      fontSize: 10,
                      textAlign: "left"
                    }}
                  >
                    Kg
                  </Text>
                </Text>
              </View> */}
            </View>
          </View>
          {/* {this.renderEniStats()} */}
          <View style={{ height: 80 }}></View>
         
        </View>
      </View>
    );
  }

  renderTextStats() {
    let distance = this.props.statisticsState.statistics.total_distance,
      distanceInt = Number.parseInt(distance);
    distanceInt = distanceInt
      ? distanceInt
      : Number.parseInt((distance - distanceInt * 1000) * 1000);
    // distanceInt = Number.parseInt(619.00594595952894);
    return (
      <View
        style={[
          styles.centerTextContainer
          // , { backgroundColor: "#e33" }
        ]}
      >
        <Text
          style={[
            styles.centerValue,
            { fontSize: distanceInt > 100 ? 30 : 37 }
          ]}
        >
          {distanceInt}
        </Text>
        <Text style={styles.centerTextParam}>{distanceInt ? "km" : "m"}</Text>
      </View>
    );
  }

  renderStats() {
    let routes = 0;

    routes = +this.props.statisticsState.statistics.total_carpooling;
    routes = +this.props.statisticsState.statistics.total_train;
    routes = +this.props.statisticsState.statistics.total_metro;
    routes = +this.props.statisticsState.statistics.total_bus;
    routes = +this.props.statisticsState.statistics.total_biking;
    routes = +this.props.statisticsState.statistics.total_walking;

    let distance = this.props.statisticsState.statistics.total_distance,
      calories = this.props.statisticsState.statistics.total_calories,
      time = this.props.statisticsState.statistics.total_duration * 60,
      CO2 = this.props.statisticsState.statistics.total_co2,
      distanceInt = Number.parseInt(distance);
    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.8,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          marginTop: 20
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width * 0.8,
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat-ExtraBold",
              color: "#fff",
              fontSize: 20,
              textAlign: "left",
              textAlignVertical: "center"
            }}
          >
            {strings("id_5_03").toLocaleUpperCase()}
          </Text>
        </View>
        <ChartsStats
          routes={pointsDecimal(routes)}
          distance={pointsDecimal(distanceInt)}
          calories={pointsDecimal(calories)}
          time={Number.parseInt(time)}
        />
      </View>
    );
  }

  renderEniStats() {
    let shadowOpt;
    if (Platform.OS == "ios")
      shadowOpt = {
        width: Dimensions.get("window").width * 0.8,
        height: 50,
        color: "#888",
        border: 4,
        radius: 5,
        opacity: 0.25,
        x: 0,
        y: 1
      };
    else
      shadowOpt = {
        width: Dimensions.get("window").width * 0.8,
        height: 50,
        color: "#444",
        border: 3,
        radius: 5,
        opacity: 0.35,
        x: 0,
        y: 1
      };
    return (
      <View style={{ marginTop: 15 }}>
        <BoxShadow setting={shadowOpt}>
          <View style={styles.boxContainer}>
            <View style={styles.routesContainer}>
              <Text style={styles.co2Text}>{strings("id_5_12")}</Text>
            </View>

            <View style={styles.eniLogoContainer}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.navigation.navigate("EniDetailScreenBlur");
                }}
              >
                <Image
                  source={require("../../assets/images/Eni_logo.png")}
                  style={{
                    width: 45,
                    height: 45
                  }}
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
        </BoxShadow>
      </View>
    );
  }

  renderPage() {
    let distance = this.props.statisticsState.statistics.total_distance,
      CO2 = this.props.statisticsState.statistics.total_co2,
      distanceInt = Number.parseInt(distance);
    return (
      <ScrollView
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height
        }}
        showsVerticalScrollIndicator={false}
        ref={ref => (this.ref = ref)}
      >
        {/* <View
          style={{
            // height: 300,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: Dimensions.get("window").height * 0.55 + 120,
            left: Dimensions.get("window").width * 0
            // left: Dimensions.get("window").height * 0.45 * 0.018
            // left: 0
          }}
        >
          <MultiPointedCircleSvg child={this.renderPieChart()} />
        </View> */}
        <ProfileScreenCards navigation={this.props.navigation} statisticsState={this.props.statisticsState}/>
        {/* {this.renderTextStats()}
        {this.renderStats()} */}
        {this.renderSustainabilitySection(CO2)}
        
      </ScrollView>
    );
  }

  render() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "transparent"
        }}
      >
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#6C6C6C", "#3D3D3D"]}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height
          }}
        >
          {/* 
          <ProfileScreenHeader
            handleChangePage={page => this._handleChangePage(page)}
            page={this.props.page}
          /> 
          */}

          {/* <ProfileScreenCards /> */}
          {this.renderPage()}
          <EnableHealthButton />
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerTextContainer: {
    position: "absolute",
    // top: 100
    top:
      Dimensions.get("window").height * 0.6 +
      115 +
      Dimensions.get("window").width * 0.35,
    left: Dimensions.get("window").width * 0.5 - 39,
    width: 78
  },
  centerValue: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#fff",
    fontSize: 37,
    textAlign: "center",
    textAlignVertical: "center"
  },
  centerTextParam: {
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
    fontWeight: "400",
    color: "#fff",
    fontSize: 8,
    fontWeight: "bold"
  },
  backgroundImageTop: {
    height: 35,
    width: Dimensions.get("window").width
  },
  View: {
    backgroundColor: "#6CBA7E",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "center",
    height: 350 + 180, // padding finale 
    width: Dimensions.get("window").width
  },
  FirstView: {
    backgroundColor: "#6CBA7E",
    justifyContent: "center",
    alignItems: "flex-start",
    alignContent: "center",
    height: 40,
    width: Dimensions.get("window").width * 0.8
  },
  OtherView: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: 40,
    width: Dimensions.get("window").width
  },
  SecondView: {
    backgroundColor: "#6CBA7E",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: 90,
    width: Dimensions.get("window").width
  },
  LastView: {
    backgroundColor: "#6CBA7E",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: 30,
    width: Dimensions.get("window").width
  },
  boxContainer: {
    width: Dimensions.get("window").width * 0.8,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F8F9",
    borderRadius: 4,
    shadowRadius: 2,
    shadowColor: "#B2B2B2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    elevation: 0.9
  },
  routesContainer: {
    width: Dimensions.get("window").width * 0.52,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  eniLogoContainer: {
    width: Dimensions.get("window").width * 0.26,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  co2Text: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 10
  }
});

const withData = connect(state => {
  return {
    statisticsState: state.statistics ? state.statistics : [],
    perm: getPermActivitiesState(state)
  };
});

export default withData(ProfileScreen);
