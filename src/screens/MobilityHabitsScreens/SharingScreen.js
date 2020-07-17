import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Alert,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import Svg, { Circle, Line } from "react-native-svg";
import Icon from "react-native-vector-icons/Ionicons";

import { UpdateProfile } from "./../../domains/login/ActionCreators";

import { strings } from "../../config/i18n";

class SharingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bike_sharing_user: 0,
      car_sharing_user: 0,
      ride_sharing_user: 0,
      tapped: false
    };
  }

  static navigationOptions = {
    header: null
  };

  componentWillMount() {
    this.setState({
      bike_sharing_user: this.props.loginState.infoProfile.bike_sharing_user,
      car_sharing_user: this.props.loginState.infoProfile.car_sharing_user,
      ride_sharing_user: this.props.loginState.infoProfile.ride_sharing_user
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
            bike_sharing_user: this.state.bike_sharing_user,
            car_sharing_user: this.state.car_sharing_user,
            ride_sharing_user: this.state.ride_sharing_user
          }
        }
      })
    );
    console.log(this.props.navigation.state.params);
    if (this.props.navigation.state.params)
      this.props.navigation.navigate("EditCarFuelScreen", { slides: true });
    // this.props.navigation.navigate("EndMobilityScreen", { slides: true });
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
                colors={["#3D3D3D", "#3D3D3D90"]}
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
            height: Dimensions.get("window").width * 0.25,
            justifyContent: "center",
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
          <Text style={styles.textSection}>{strings("which_services_")}</Text>
        </View>
        <Image
          source={require("../../assets/images/wawe_mobility_habits_black.png")}
          style={{
            height: 50,
            width: Dimensions.get("window").width
            // marginLeft: 50,
            // alignContent: "center"
          }}
          resizeMethod={"auto"}
        />
        <ScrollView contentContainerStyle={styles.bodyContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              {strings("bike_sharing")
                .charAt(0)
                .toUpperCase() +
                strings("bike_sharing")
                  .toLowerCase()
                  .slice(1)}
            </Text>
          </View>
          <View style={styles.boxesContainer}>
            {this.renderCheckbox(
              0,
              strings("no"),
              () => {
                this.setState({ bike_sharing_user: 0 });
              },
              this.state.bike_sharing_user == 0
            )}
            {this.renderCheckbox(
              1,
              strings("yes"),
              () => {
                this.setState({ bike_sharing_user: 1 });
              },
              this.state.bike_sharing_user == 1
            )}
            {this.renderCheckbox(
              2,
              strings("i_m_not_sure_th"),
              () => {
                this.setState({ bike_sharing_user: 2 });
              },
              this.state.bike_sharing_user == 2
            )}
            {this.renderCheckbox(
              3,
              strings("this_service_is"),
              () => {
                this.setState({ bike_sharing_user: 3 });
              },
              this.state.bike_sharing_user == 3
            )}
          </View>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              {strings("car_sharing")
                .charAt(0)
                .toUpperCase() +
                strings("car_sharing")
                  .toLowerCase()
                  .slice(1)}
            </Text>
          </View>
          <View style={styles.boxesContainer}>
            {this.renderCheckbox(
              0,
              strings("no"),
              () => {
                this.setState({ car_sharing_user: 0 });
              },
              this.state.car_sharing_user == 0
            )}
            {this.renderCheckbox(
              1,
              strings("yes"),
              () => {
                this.setState({ car_sharing_user: 1 });
              },
              this.state.car_sharing_user == 1
            )}
            {this.renderCheckbox(
              2,
              strings("i_m_not_sure_th"),
              () => {
                this.setState({ car_sharing_user: 2 });
              },
              this.state.car_sharing_user == 2
            )}
            {this.renderCheckbox(
              3,
              strings("this_service_is"),
              () => {
                this.setState({ car_sharing_user: 3 });
              },
              this.state.car_sharing_user == 3
            )}
          </View>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              {strings("_750_scooter_sharing")
                .charAt(0)
                .toUpperCase() +
                strings("_750_scooter_sharing")
                  .toLowerCase()
                  .slice(1)}
            </Text>
          </View>
          <View style={styles.boxesContainer}>
            {this.renderCheckbox(
              0,
              strings("no"),
              () => {
                this.setState({ ride_sharing_user: 0 });
              },
              this.state.ride_sharing_user == 0
            )}
            {this.renderCheckbox(
              1,
              strings("yes"),
              () => {
                this.setState({ ride_sharing_user: 1 });
              },
              this.state.ride_sharing_user == 1
            )}
            {this.renderCheckbox(
              2,
              strings("i_m_not_sure_th"),
              () => {
                this.setState({ ride_sharing_user: 2 });
              },
              this.state.ride_sharing_user == 2
            )}
            {this.renderCheckbox(
              3,
              strings("this_service_is"),
              () => {
                this.setState({ ride_sharing_user: 3 });
              },
              this.state.ride_sharing_user == 3
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
        </ScrollView>

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
    backgroundColor: "#3D3D3D",
    width: Dimensions.get("window").width,
    height: 125,
    justifyContent: "center",
    alignItems: "center"
  },
  bodyContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 1.4,
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
    height: 150,
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
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").height * 0.1,
    // flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  boxesContainer: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.25,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    alignSelf: "center"
    // backgroundColor: "#e33"
  },
  labelContainer: {
    width: Dimensions.get("window").width * 0.95,
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
    // backgroundColor: "#e33"
  },
  btnContainer: {
    backgroundColor: "#3D3D3D",
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

export default withData(SharingScreen);
