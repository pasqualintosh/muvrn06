import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Alert
} from "react-native";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import Svg, { Circle, Line } from "react-native-svg";

import {
  UpdateProfile,
  addCompletePeriodicFeed,
  postIncreaseCoins
} from "./../../domains/login/ActionCreators";

// prendo le esultanze
import { images } from "../../screens/SurveyScreens/EndScreen.js";

import { strings } from "../../config/i18n";

class EndMobilityScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bike: 0,
      tapped: false
    };
  }

  static navigationOptions = {
    header: null
  };

  componentWillMount() {
    this.setState({ bike: this.props.loginState.infoProfile.bike });
    // salvo che hai completato il mobility habits tra i feed se non l'ho gia fatto e do le monete
    const checkPeridicFeed = this.props.loginState.periodicFeed[2]
      ? this.props.loginState.periodicFeed[2].completed
      : "";
    console.log(checkPeridicFeed);
    if (!checkPeridicFeed.length) {
      this.props.dispatch(addCompletePeriodicFeed(2));

      // do le monete all'utente quando finisce
      this.props.dispatch(postIncreaseCoins({ coins: 2 }));
    }
  }

  handleBikeTap = index => {
    this.setState({ bike: index, tapped: true });
  };

  handleContinueTap = () => {
    if (this.state.tapped) {
      this.props.dispatch(
        UpdateProfile({
          data: {
            public_profile: { bike: this.state.bike }
          }
        })
      );
      this.props.navigation.navigate("HomeTab");
    } else Alert.alert("Oops", strings("seems_like_you_"));
  };

  renderCheckbox(index, label) {
    return (
      <View style={styles.answerBoxes}>
        <TouchableWithoutFeedback onPress={() => this.handleBikeTap(index)}>
          <View style={styles.checkboxesContainer}>
            <View style={[styles.checkboxes]}>
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1 }}
                locations={[0, 1.0]}
                colors={["#E83475", "#BA0043"]}
                style={[
                  styles.checkboxesGradient,
                  {
                    opacity: this.state.bike == index ? 1 : 0
                  }
                ]}
              />
            </View>
            <Text style={styles.checkboxesText}>{label}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View
            style={{
              width: Dimensions.get("window").width * 0.7,
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: 80
            }}
          >
            <Text style={styles.textSection}>{strings("thank_you")}</Text>
          </View>
        </View>
        <Image
          source={require("../../assets/images/wawe_mobility_habits_purple.png")}
          style={{
            height: 50,
            width: Dimensions.get("window").width
            // marginLeft: 50,
            // alignContent: "center"
          }}
          resizeMethod={"auto"}
        />
        <View style={styles.bodyContainer}>
          <View style={styles.boxesContainer}>
            <View
              style={{
                width: Dimensions.get("window").width * 0.7,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={styles.descriptionText}>
                {strings("you_earned")}
              </Text>
              <Text style={styles.coinText}>2</Text>
              <Text
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  color: "#3d3d3d",
                  fontSize: 10,
                  // fontWeight: "bold",
                  // marginTop: 20,
                  textAlign: "center"
                }}
              >
                {strings("coins").toLocaleUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* 
        <Image
          style={{
            width: 60,
            height: 60,
            position: "absolute",
            left: Dimensions.get("window").width * 0.5 - 30,
            top: Dimensions.get("window").width * 0.25 - 25
          }}
          source={require("../../assets/images/coins_icn_friends_banner.png")}
        /> 
        */}

        <Image
          style={{
            width: 200,
            height: Dimensions.get("window").height * 0.4,
            position: "absolute",
            right: Dimensions.get("window").width * 0.5 - 100,
            top: Dimensions.get("window").height * 0.4
          }}
          source={images[this.props.loginState.infoProfile.avatar]}
        />
        <Image
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            position: "absolute",
            top: Dimensions.get("window").height * 0.1
          }}
          resizeMethod={"auto"}
          source={require("../../assets/images/quiz_win_coin.png")}
        />
        <View
          style={{
            position: "absolute",
            right: Dimensions.get("window").width * 0.0125,
            top: Dimensions.get("window").height * 0.08,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 3
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            elevation: 6
          }}
        >
          <Svg height={60} width={60} viewBox="0 0 100 100">
            <Circle
              cx="50"
              cy="50"
              r="25"
              strokeWidth="1"
              fill="#E6332A"
              // onPress={() => this.props.navigation.goBack()}
              onPress={() => this.props.navigation.navigate("HomeTab")}
            />
            <Line
              x1="45"
              y1="45"
              x2="55"
              y2="55"
              stroke="white"
              strokeWidth="2"
              // onPress={() => this.props.navigation.goBack()}
              onPress={() => this.props.navigation.navigate("HomeTab")}
            />
            <Line
              x1="55"
              y1="45"
              x2="45"
              y2="55"
              stroke="white"
              strokeWidth="2"
              // onPress={() => this.props.navigation.goBack()}
              onPress={() => this.props.navigation.navigate("HomeTab")}
            />
          </Svg>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  headerContainer: {
    backgroundColor: "#60368C",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.6 - 50,
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center"
  },
  bodyContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.4,
    // flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  textSection: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#fff",
    fontSize: 30,
    // fontWeight: "bold",
    // marginTop: 20,
    textAlign: "center"
  },
  coinText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#FAB21E",
    fontSize: 35,
    // fontWeight: "bold",
    // marginTop: 20,
    textAlign: "center"
  },
  answerBoxes: {
    height: 80,
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  checkboxes: {
    height: 35,
    width: 35,
    borderRadius: 20,
    backgroundColor: "#F7F8F9",
    justifyContent: "center",
    alignItems: "center"
  },
  checkboxesGradient: {
    height: 18,
    width: 18,
    borderRadius: 10,
    backgroundColor: "#F7F8F9"
  },
  checkboxesText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 11,
    marginLeft: 6
  },
  checkboxesContainer: {
    width: Dimensions.get("window").width * 0.25,
    height: Dimensions.get("window").height * 0.1,
    // flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  boxesContainer: {
    width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height * 0.15,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 140
    // backgroundColor: "#e33"
  },
  btnContainer: {
    backgroundColor: "#60368C",
    width: Dimensions.get("window").width * 0.3,
    height: 30,
    borderRadius: 4,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50
  },
  btnText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 15
  },
  descriptionText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 14,
    textAlign: "center"
  }
});

const withData = connect(state => {
  return {
    loginState: state.login
  };
});

export default withData(EndMobilityScreen);
