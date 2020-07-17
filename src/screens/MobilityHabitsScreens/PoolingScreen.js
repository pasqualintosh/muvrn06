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

class PoolingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      car_pooling: 0,
      moto_pooling: 0,
      tapped: false
    };
  }

  static navigationOptions = {
    header: null
  };

  componentWillMount() {
    this.setState({
      car_pooling: this.props.loginState.infoProfile.car_pooling,
      moto_pooling: this.props.loginState.infoProfile.moto_pooling
    });
  }

  handleBikeTap = (index, func) => {
    this.setState({ tapped: true }, () => {
      func();
    });
  };

  handleContinueTap = () => {
    this.props.dispatch(
      UpdateProfile({
        data: {
          public_profile: {
            car_pooling: this.state.car_pooling,
            moto_pooling: this.state.moto_pooling
          }
        }
      })
    );
    if (this.props.navigation.state.params)
      this.props.navigation.navigate("SharingScreen", { slides: true });
    else this.props.navigation.goBack();
  };

  renderCheckbox(index, label, func, bool) {
    return (
      <View style={styles.answerBoxes}>
        <TouchableWithoutFeedback
          onPress={() => this.handleBikeTap(index, func)}
        >
          <View style={styles.checkboxesContainer}>
            <View style={[styles.checkboxes]}>
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1 }}
                locations={[0, 1.0]}
                colors={["#3363AD", "#3383AD"]}
                style={[
                  styles.checkboxesGradient,
                  {
                    opacity: bool ? 1 : 0
                  }
                ]}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View
          style={{
            width: Dimensions.get("window").width * 0.2,
            height: Dimensions.get("window").height * 0.1,
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <Text style={styles.checkboxesText}>{label}</Text>
        </View>
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
            <Text style={styles.textSection}>{strings("do_you_travel_u")}</Text>
          </View>
        </View>
        <Image
          source={require("../../assets/images/wawe_mobility_habits_blue.png")}
          style={{
            height: 50,
            width: Dimensions.get("window").width
            // marginLeft: 50,
            // alignContent: "center"
          }}
          resizeMethod={"auto"}
        />
        <View style={styles.bodyContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              {strings("carpooling")
                .charAt(0)
                .toUpperCase() +
                strings("carpooling")
                  .toLowerCase()
                  .slice(1)}
            </Text>
          </View>
          <View style={styles.boxesContainer}>
            {this.renderCheckbox(
              0,
              strings("no__never"),
              () => {
                this.setState({ car_pooling: 0 });
              },
              this.state.car_pooling == 0
            )}
            {this.renderCheckbox(
              1,
              strings("yes__usually_as"),
              () => {
                this.setState({ car_pooling: 1 });
              },
              this.state.car_pooling == 1
            )}
            {this.renderCheckbox(
              2,
              strings("_330_yes__usually_as"),
              () => {
                this.setState({ car_pooling: 2 });
              },
              this.state.car_pooling == 2
            )}
            {this.renderCheckbox(
              3,
              strings("yes__in_both_wa"),
              () => {
                this.setState({ car_pooling: 3 });
              },
              this.state.car_pooling == 3
            )}
          </View>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              {strings("motopooling")
                .charAt(0)
                .toUpperCase() +
                strings("motopooling")
                  .toLowerCase()
                  .slice(1)}
            </Text>
          </View>
          <View style={styles.boxesContainer}>
            {this.renderCheckbox(
              0,
              strings("no__never"),
              () => {
                this.setState({ moto_pooling: 0 });
              },
              this.state.moto_pooling == 0
            )}
            {this.renderCheckbox(
              1,
              strings("yes__usually_as"),
              () => {
                this.setState({ moto_pooling: 1 });
              },
              this.state.moto_pooling == 1
            )}
            {this.renderCheckbox(
              2,
              strings("_330_yes__usually_as"),
              () => {
                this.setState({ moto_pooling: 2 });
              },
              this.state.moto_pooling == 2
            )}
            {this.renderCheckbox(
              3,
              strings("yes__in_both_wa"),
              () => {
                this.setState({ moto_pooling: 3 });
              },
              this.state.moto_pooling == 3
            )}
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
            top: 110
          }}
          source={require("../../assets/images/carpooling_icn.png")}
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
    backgroundColor: "#3363AD",
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
    marginTop: 20,
    textAlign: "center"
  },
  answerBoxes: {
    height: 80,
    marginVertical: 5,
    justifyContent: "space-between",
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
    marginLeft: 6,
    textAlign: "center"
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
  labelContainer: {
    width: Dimensions.get("window").width * 0.95,
    height: 80,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center"
    // backgroundColor: "#e33"
  },
  btnContainer: {
    backgroundColor: "#3363AD",
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
  },
  label: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3d3d3d",
    fontSize: 15,
    textAlign: "left"
  }
});

const withData = connect(state => {
  return {
    loginState: state.login
  };
});

export default withData(PoolingScreen);
