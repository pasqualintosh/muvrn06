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

import { UpdateProfile } from "./../../domains/login/ActionCreators";

import { strings } from "../../config/i18n";

class IntroMobilityScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bike: 0
    };
  }

  static navigationOptions = {
    header: null
  };

  componentWillMount() {
    this.setState({ bike: this.props.loginState.infoProfile.bike });
  }

  handleBikeTap = index => {
    this.setState({ bike: index, tapped: true });
  };

  handleContinueTap = () => {
    this.props.navigation.navigate("BikeScreen", {
      slides: true
    });
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
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={styles.textSection}>
              {strings("_494_mobility_habits")}
            </Text>
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
                {strings("hey_there__than")}
              </Text>
              <Text style={styles.descriptionText}>
                {strings("we_use_this_inf")}
              </Text>
            </View>
            <TouchableWithoutFeedback onPress={this.handleContinueTap}>
              <View style={styles.btnContainer}>
                <Text style={styles.btnText}>{strings("continue")}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

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

        <Image
          style={{
            width: 238 * 1.2,
            height: 90 * 1.2,
            position: "absolute",
            right: Dimensions.get("window").width * 0.5 - 119 * 1.2,
            top: Dimensions.get("window").height * 0.495
          }}
          source={require("../../assets/images/wawe_mobility_habits_graphic.png")}
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
              // stroke="#3D3D3D"
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
    justifyContent: "center",
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
    fontSize: 24,
    // fontWeight: "bold",
    marginTop: 20,
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
    marginTop: 60
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
    fontWeight: "bold",
    color: "#3d3d3d",
    fontSize: 12,
    textAlign: "center"
  }
});

const withData = connect(state => {
  return {
    loginState: state.login
  };
});

export default withData(IntroMobilityScreen);
