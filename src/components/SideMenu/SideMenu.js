import React from "react";
import { NavigationActions } from "react-navigation";
import PropTypes from "prop-types";
import {
  ScrollView,
  Text,
  Alert,
  View,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Dimensions
} from "react-native";
import { DrawerActions } from "react-navigation";
import LinearGradient from "react-native-linear-gradient";
import NotificationNumberCircle from "../NotificationNumberCircle/NotificationNumberCircle";
import Icon from "react-native-vector-icons/Ionicons";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import { connect } from "react-redux";
import { logOut } from "../../domains/login/ActionCreators";
import { strings } from "../../config/i18n";

class DrawerScreen extends React.Component {
  navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
  };

  actionLogOut = () => {
    this.props.dispatch(logOut());
  };

  logout = () => {
    Alert.alert(
      strings("logout"),
      "Are you sure you want to logout?",

      [
        {
          text: strings("yes"),
          onPress: () => {
            this.actionLogOut();
          }
        },
        {
          text: strings("no"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  };

  render() {
    return (
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.0, y: 1.0 }}
        locations={[0, 1.0]}
        colors={["#7D4D99", "#6497CC"]}
        style={{
          backgroundColor: "#7D4D99",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <View>
          <View style={{ height: Dimensions.get("window").height * 0.05 }} />
          <View>
            <TouchableWithoutFeedback
              onPress={this.navigateToScreen("ProfileStack")}
            >
              <View style={styles.menuItem}>
                {0 ? (
                  <NotificationNumberCircle
                    style={styles.notification}
                    numberNotification={0}
                  />
                ) : (
                  <View />
                )}
                <View style={styles.textIcon}>
                  <Text
                    onPress={this.navigateToScreen("ProfileStack")}
                    style={styles.title}
                  >
                    {strings("profile")}
                  </Text>
                  <View style={{ width: 15 }} />
                  <OwnIcon name={"profile_icn"} size={25} color={"#FFFFFF"} />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                if (this.props.routine.length == 0) {
                  this.props.navigation.navigate("ChangeFrequentTripScreen");
                } else {
                  // this.navigateToScreen("PersonalFrequentTripDataScreen");
                  this.props.navigation.navigate(
                    "PersonalFrequentTripDataScreen"
                  );
                }
              }}
            >
              <View style={styles.menuItem}>
                {0 ? (
                  <NotificationNumberCircle
                    style={styles.notification}
                    numberNotification={1}
                  />
                ) : (
                  <View />
                )}
                <View style={styles.textIcon}>
                  <Text
                    // onPress={this.navigateToScreen(
                    //   "PersonalFrequentTripDataScreen"
                    // )}
                    style={styles.title}
                  >
                    {strings("frequent_trips")}
                  </Text>
                  <View style={{ width: 15 }} />
                  <OwnIcon name={"frequent_icn"} size={25} color={"#FFFFFF"} />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={this.navigateToScreen("PersonalMobilityDataScreen")}
            >
              <View style={styles.menuItem}>
                {0 ? (
                  <NotificationNumberCircle
                    style={styles.notification}
                    numberNotification={1}
                  />
                ) : (
                  <View />
                )}
                <View style={styles.textIcon}>
                  <Text
                    onPress={this.navigateToScreen(
                      "PersonalMobilityDataScreen"
                    )}
                    style={styles.title}
                  >
                    {strings("garage")}
                  </Text>
                  <View style={{ width: 15 }} />
                  <OwnIcon name={"garage_icn"} size={25} color={"#FFFFFF"} />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={this.navigateToScreen("FriendStack")}
            >
              <View style={styles.menuItem}>
                {0 ? (
                  <NotificationNumberCircle
                    style={styles.notification}
                    numberNotification={1}
                  />
                ) : (
                  <View />
                )}
                <View style={styles.textIcon}>
                  <Text
                    onPress={this.navigateToScreen("FriendStack")}
                    style={styles.title}
                  >
                    {strings("friends")}
                  </Text>
                  <View style={{ width: 15 }} />
                  <OwnIcon name={"friends_icn"} size={25} color={"#FFFFFF"} />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={this.navigateToScreen("ChartsStack")}
            >
              <View style={styles.menuItem}>
                {0 ? (
                  <NotificationNumberCircle
                    style={styles.notification}
                    numberNotification={0}
                  />
                ) : (
                  <View />
                )}
                <View style={styles.textIcon}>
                  <Text
                    onPress={this.navigateToScreen("ChartsStack")}
                    style={styles.title}
                  >
                    {strings("stats")}
                  </Text>
                  <View style={{ width: 15 }} />
                  <OwnIcon name={"stats_icn"} size={25} color={"#FFFFFF"} />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={this.navigateToScreen("Trophies")}
            >
              <View style={styles.menuItem}>
                {0 ? (
                  <NotificationNumberCircle
                    style={styles.notification}
                    numberNotification={1}
                  />
                ) : (
                  <View />
                )}
                <View style={styles.textIcon}>
                  <Text
                    onPress={this.navigateToScreen("Trophies")}
                    style={styles.title}
                  >
                    {strings("trophies")}
                  </Text>
                  <View style={{ width: 15 }} />
                  <OwnIcon name={"trophies_icn"} size={25} color={"#FFFFFF"} />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={this.navigateToScreen("RewardsStack")}
            >
              <View style={styles.menuItem}>
                {0 ? (
                  <NotificationNumberCircle
                    style={styles.notification}
                    numberNotification={1}
                  />
                ) : (
                  <View />
                )}
                <View style={styles.textIcon}>
                  <Text
                    onPress={this.navigateToScreen("RewardsStack")}
                    style={styles.title}
                  >
                    {strings("rewards")}
                  </Text>
                  <View style={{ width: 15 }} />
                  <OwnIcon name={"rewards_icn"} size={25} color={"#FFFFFF"} />
                </View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={this.navigateToScreen("SettingsStack")}
            >
              <View style={styles.menuLastItem}>
                {0 ? (
                  <NotificationNumberCircle
                    style={styles.notification}
                    numberNotification={1}
                  />
                ) : (
                  <View />
                )}
                <View style={styles.textIcon}>
                  <Text
                    onPress={this.navigateToScreen("SettingsStack")}
                    style={styles.title}
                  >
                    {strings("settings")}
                  </Text>
                  <View style={{ width: 15 }} />
                  <OwnIcon name={"settings_icn"} size={25} color={"#FFFFFF"} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View>
          <TouchableWithoutFeedback onPress={this.logout}>
            <View style={styles.lastItem}>
              <View />

              <View style={styles.textLastIcon}>
                <Text onPress={this.logout} style={styles.title}>
                  {strings("logout")}
                </Text>
                <View style={{ width: 15 }} />
                <OwnIcon
                  name={"logout_icn"}
                  size={25}
                  color={"#FFFFFF"}
                  click={this.logout}
                />
                {/* <OwnIcon
                name="arrow_icn"
                size={25}
                style={{ position: "relative", left: -25 }}
                color="#FC6754"
              /> */}
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View style={{ height: Dimensions.get("window").height * 0.05 }} />
        </View>
      </LinearGradient>
    );
  }
}

styles = StyleSheet.create({
  notification: {
    height: 15,
    width: 15,

    borderRadius: 8,
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",

    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 1
  },
  textIcon: {
    flexDirection: "row",
    alignItems: "center"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  heading: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  menuItem: {
    height: Dimensions.get("window").height * 0.09,
    maxHeight: 65,
    paddingRight: 15,

    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    marginLeft: 20,
    // borderWidth: 1,
    borderColor: "#d6d7da",
    borderBottomWidth: 1
  },
  menuLastItem: {
    height: Dimensions.get("window").height * 0.09,
    maxHeight: 65,
    paddingRight: 15,

    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    marginLeft: 20
  },
  lastItem: {
    height: Dimensions.get("window").height * 0.09,
    paddingRight: 15,
    maxHeight: 65,

    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    marginLeft: 20,
    // borderWidth: 1,
    borderColor: "#d6d7da",
    borderTopWidth: 1
  },
  textLastIcon: {
    flexDirection: "row",
    alignItems: "center"
  },
  title: {
    color: "#FFFFFF",
    textAlignVertical: "center"
  }
});

DrawerScreen.propTypes = {
  navigation: PropTypes.object
};

const logOutAction = connect(state => {
  // prendo solo le routine
  return {
    routine: state.login.mostFrequentRoute ? state.login.mostFrequentRoute : []
  };
});

export default logOutAction(DrawerScreen);
