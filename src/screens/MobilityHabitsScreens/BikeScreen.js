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
import Icon from "react-native-vector-icons/Ionicons";

import { UpdateProfile } from "./../../domains/login/ActionCreators";

import { strings } from "../../config/i18n";

class BikeScreen extends React.Component {
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
  }

  handleBikeTap = index => {
    this.setState({ bike: index, tapped: true });
  };

  handleContinueTap = () => {
    this.props.dispatch(
      UpdateProfile({
        data: {
          public_profile: { bike: this.state.bike }
        }
      })
    );

    if (this.props.navigation.state.params)
      this.props.navigation.navigate("TplScreen", { slides: true });
    else this.props.navigation.goBack();
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
          <Text style={styles.textSection}>{strings("do_you_have_a_b")}</Text>
        </View>
        <Image
          source={require("../../assets/images/wawe_mobility_habits_pink.png")}
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
            {this.renderCheckbox(0, strings("no__i_don_t"))}
          </View>
          <View
            style={[
              styles.boxesContainer,
              {
                height: 20,
                justifyContent: "center",
                alignItems: "flex-start",
                marginBottom: 20
              }
            ]}
          >
            <Text
              style={[
                styles.textSection,
                { color: "#3d3d3d", fontSize: 11, fontWeight: "bold" }
              ]}
            >
              {strings("yes__i_do_and_i")}
            </Text>
          </View>
          <View style={styles.boxesContainer}>
            {this.renderCheckbox(1, strings("city_bike"))}
            {this.renderCheckbox(2, strings("mountain_bike"))}
            {this.renderCheckbox(3, strings("racing_bike"))}
          </View>
          <View style={styles.boxesContainer}>
            {this.renderCheckbox(4, strings("bmx"))}
            {this.renderCheckbox(5, strings("foldable_bike"))}
            {this.renderCheckbox(6, strings("e_bike"))}
          </View>
          <View style={[styles.boxesContainer, { marginTop: 20 }]}>
            <View>
              <TouchableWithoutFeedback onPress={this.handleContinueTap}>
                <View style={styles.btnContainer}>
                  <Text style={styles.btnText}>{strings("continue")}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>

        <Image
          style={{
            width: 60,
            height: 60,
            position: "absolute",
            left: Dimensions.get("window").width * 0.0125,
            top: 125
          }}
          source={require("../../assets/images/coins_icn_friends_banner.png")}
        />
        <Image
          style={{
            width: 100,
            height: 100,
            position: "absolute",
            right: Dimensions.get("window").width * 0.0125,
            top: 100
          }}
          source={require("../../assets/images/bike_icn_recap.png")}
        />
        <View
          style={{
            position: "absolute",
            // right: Dimensions.get("window").width * 0.0125,
            left: Dimensions.get("window").width * 0.06,
            top: 50,
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
          <TouchableWithoutFeedback
            onPress={() => this.props.navigation.goBack()}
          >
            <View style={{ width: 30, height: 30 }}>
              <Icon
                name="ios-arrow-back"
                size={18}
                color="#fff"
                // style={{ alignSelf: "center", marginRight: 17 }}
              />
            </View>
          </TouchableWithoutFeedback>

          {/* <Svg height={60} width={60} viewBox="0 0 100 100">
            <Circle
              cx="50"
              cy="50"
              r="25"
              // stroke="#3D3D3D"
              strokeWidth="1"
              fill="#E6332A"
              // onPress={() => this.props.navigation.goBack()}
              onPress={() => {
                if (this.props.navigation.state.params)
                  this.props.navigation.navigate("HomeTab");
                else this.props.navigation.goBack();
              }}
            />
            <Line
              x1="45"
              y1="45"
              x2="55"
              y2="55"
              stroke="white"
              strokeWidth="2"
              // onPress={() => this.props.navigation.goBack()}
              onPress={() => {
                if (this.props.navigation.state.params)
                  this.props.navigation.navigate("HomeTab");
                else this.props.navigation.goBack();
              }}
            />
            <Line
              x1="55"
              y1="45"
              x2="45"
              y2="55"
              stroke="white"
              strokeWidth="2"
              // onPress={() => this.props.navigation.goBack()}
              onPress={() => {
                if (this.props.navigation.state.params)
                  this.props.navigation.navigate("HomeTab");
                else this.props.navigation.goBack();
              }}
            />
          </Svg> */}
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
    backgroundColor: "#E83475",
    width: Dimensions.get("window").width,
    height: 125,
    justifyContent: "center",
    alignItems: "center"
  },
  bodyContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.75,
    // flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  textSection: {
    fontFamily: "OpenSans-Regular",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20
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
    height: Dimensions.get("window").height * 0.15,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start"
    // backgroundColor: "#e33"
  },
  btnContainer: {
    backgroundColor: "#E83475",
    width: Dimensions.get("window").width * 0.4,
    height: 40,
    borderRadius: 4,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  btnText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 15
  }
});

const withData = connect(state => {
  return {
    loginState: state.login
  };
});

export default withData(BikeScreen);
