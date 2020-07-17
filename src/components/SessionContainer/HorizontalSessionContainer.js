import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
  TouchableWithoutFeedback,
  Alert,
  ImageBackground
} from "react-native";
import { withNavigation } from "react-navigation";
import LinearGradient from "react-native-linear-gradient";
import { putSession } from "../../domains/trainings/ActionCreators";

import { strings } from "../../config/i18n";

export function getBackground(index) {
  switch (index) {
    case 0:
      return "#FAB21E";
      break;
    case 1:
      return "#5FC4E2";
      break;

    case 2:
      return "#E83475";
      break;

    case 3:
      return "#6CBA7E";
      break;

    case 4:
      return "#60368C";
      break;

    default:
      break;
  }
}
class HorizontalSessionContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  alertUnlock = trainingSessionId => {
    let testo = "Unlock this session for ";
    if (this.props.coins && !this.props.points) {
      testo += this.props.coins + " coins" + " ?";
    } else if (!this.props.coins && this.props.points) {
      testo += this.props.points + " points" + " ?";
    } else {
      testo +=
        this.props.coins + " coins and " + this.props.points + " points" + " ?";
    }
    console.log(trainingSessionId);
    Alert.alert(
      "Session",
      testo,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () =>
            this.props.dispatch(
              putSession({
                sessionIdToActive: trainingSessionId,
                new_status: 1,
                unlock: true
              })
            )
        }
      ],
      { cancelable: false }
    );
  };

  renderEventsOrCoins(opacity) {
    if (this.props.coins) {
      const value = this.props.coins.toString();

      return (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignContent: "center",
            alignItems: "center",
            width: Dimensions.get("window").width * 0.1,
            height: Dimensions.get("window").height * 0.1,
            ...opacity
          }}
        >
          <Image
            source={require("../../assets/images/insert_coin_icn.png")}
            style={{
              width: 10,
              height: 10 * 2.5,
              marginTop: Platform.OS == "ios" ? 3 : 0,
              ...opacity
            }}
          />
          <View
            style={{
              width: 5,
              height: 5
            }}
          />
          <Text
            style={[
              styles.completedStats,
              {
                fontSize: 15,
                textAlign: "right",
                color: "#3D3D3D",
                opacity: 1,
                // fontSize: 15,
                // backgroundColor: "#00000050",
                fontWeight: "bold",
                alignContent: "center",
                alignItems: "center",

                fontFamily: "Montserrat-ExtraBold",
                ...opacity
              }
            ]}
          >
            {value}
          </Text>
        </View>
      );
    } else {
      return (
        <Text style={styles.completedStats}>
          {this.props.eventsNumber
            ? this.props.eventsCompleted + "/" + this.props.eventsNumber
            : ""}
        </Text>
      );
    }
  }

  // status={status}
  //             sessionName={e.name}
  //             completed={completeSession}
  //             eventsNumber={e.events.length}
  //             eventsCompleted={
  //               completeSession
  //                 ? e.events.length
  //                 : this.getCompletedTrainings(e.id)
  //             }
  //             levelCorrent={true}
  //             events={e.events.sort((a, b) => {
  //               return a.id - b.id;
  //             })}
  //             id={e.id}
  //             obtainableCoins={e.obtainable_coins}
  //             scrollSessions={this.scrollSessions}
  //             index={index}

  moveDetailTraining = () => {
    this.props.navigation.navigate("DetailTrainingScreen", {
      sessionName: this.props.sessionName,
      completed: this.props.completed,
      eventsNumber: this.props.eventsNumber,
      eventsCompleted: this.props.eventsCompleted,
      levelCorrent: this.props.levelCorrent,
      events: this.props.events,
      id: this.props.id,
      obtainableCoins: this.props.obtainableCoins,
      scrollSessions: this.props.scrollSessions,
      index: this.props.index,
      color: getBackground(this.props.level),
      level: this.props.level,
      indexSession: this.props.indexSession
    });
  };

  render() {
    const lockedCoins = this.props.coins ? this.props.status < 2 : false;
    const checklevel = this.props.levelCorrent
      ? this.props.status < 2
        ? this.props.active
          ? true
          : false
        : true
      : false;
    const opacity = checklevel ? {} : { opacity: 0.7 };
    const border =
      !this.props.completed && this.props.levelCorrent && checklevel
        ? {
            borderWidth: 1,
            borderRadius: 4,
            borderColor: getBackground(this.props.level)
          }
        : {};
    console.log(border);
    const shadow = checklevel
      ? {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2
        }
      : {};

    console.log(this.props.completed);
    //console.log(this.props.index);
    // console.log(getBackground(this.props.level));
    if (this.props.level) {
      const shadow = checklevel
        ? {
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2
          }
        : {};

      return (
        <View style={[styles.container, shadow, border]}>
          <TouchableWithoutFeedback
            disabled={
              this.props.active
                ? false
                : this.state.animating || this.props.status < 2
            }
            onPress={
              this.props.active
                ? () => this.alertUnlock(this.props.idSession)
                : () => this.moveDetailTraining()
            }
          >
            <View
              style={
                {
                  // shadowColor: "#000",
                  // shadowOffset: {
                  //   width: 0,
                  //   height: 1
                  // },
                  // shadowOpacity: 0.2,
                  // shadowRadius: 1.41,
                  // elevation: 2
                  // backgroundColor: getBackground(this.props.level),
                }
              }
            >
              <View
                style={[
                  styles.senseiContainer,
                  {
                    backgroundColor: getBackground(this.props.level),
                    ...opacity
                  }
                ]}
              >
                <Image
                  source={master[this.props.level]}
                  style={[
                    styles.icon,
                    {
                      marginTop: 0,
                      marginRight: 0,
                      // transform: [{ scale: scaleV }]
                      // height: 47.5,
                      // width: 37.5,
                      width: Dimensions.get("window").width * 0.17 * 2.4,
                      height: Dimensions.get("window").width * 0.17,
                      ...opacity
                    }
                  ]}
                />
                <View style={{ backgroundColor: 'white', width: 30, height: 20, right: 0, top: 10, position: 'absolute', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, alignContent: 'center', justifyContent: 'center', flexDirection: 'row' }} >
                <Text style={[styles.numberSession, {color: getBackground(this.props.level), ...opacity}]}>
                  { this.props.indexSession + 1}
                  </Text>
                </View>
              </View>

              <ImageBackground
                source={masterWave[this.props.level]}
                style={{
                  marginTop: 0,
                  marginRight: 0,
                  width: Dimensions.get("window").width * 0.62,
                  height: 21,
                  ...opacity
                }}
              />
              <View style={styles.titleContainer}>
                <View
                  style={{
                    flex: 0.8,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start"
                  }}
                >
                  <Text style={[styles.titleSession, opacity]}>
                    {lockedCoins
                      ? strings("unlock_it_")
                      : this.props.sessionName}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.2,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {this.props.completed ? (
                    <Image
                      source={masterCheck[this.props.level]}
                      style={{
                        width: 30,
                        height: 30,
                        // marginTop: Dimensions.get("window").height * 0.08 + 45,
                        ...opacity
                      }}
                    />
                  ) : (
                    this.renderEventsOrCoins(opacity)
                  )}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    } else {
      const shadow = checklevel
        ? {
            shadowColor: "#FAB21E",
            shadowOffset: {
              width: 0,
              height: 1
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2
          }
        : {};
      return (
        <View
          style={{
            borderWidth: 2,
            borderRadius: 4,
            borderColor: "#FAB21E",
            width: Dimensions.get("window").width * 0.62 + 8,
            height: Dimensions.get("window").height * 0.25 + 8,
            marginHorizontal: 15,
            ...shadow
          }}
        >
          <View style={[styles.containerSpecial, shadow]}>
            <TouchableWithoutFeedback
              disabled={
                this.props.active
                  ? false
                  : this.state.animating || this.props.status < 2
              }
              onPress={
                this.props.active
                  ? () => this.alertUnlock(this.props.idSession)
                  : () => this.moveDetailTraining()
              }
            >
              <View
                style={
                  {
                    // shadowColor: "#000",
                    // shadowOffset: {
                    //   width: 0,
                    //   height: 1
                    // },
                    // shadowOpacity: 0.2,
                    // shadowRadius: 1.41,
                    // elevation: 2
                  }
                }
              >
                <View
                  style={[
                    styles.senseiContainer,
                    {
                      ...opacity
                    }
                  ]}
                >
                  <LinearGradient
                    start={{ x: 0.0, y: 0.0 }}
                    end={{ x: 0.0, y: 1.0 }}
                    locations={[0, 1.0]}
                    colors={["#FAB21E", "#FA941E"]}
                    style={[styles.senseiContainer]}
                  >
                    <Image
                      source={master[this.props.level]}
                      style={[
                        styles.icon,
                        {
                          marginTop: 0,
                          marginRight: 0,
                          // transform: [{ scale: scaleV }]
                          // height: 47.5,
                          // width: 37.5,
                          width: Dimensions.get("window").width * 0.17 * 2.4,
                          height: Dimensions.get("window").width * 0.17 + 10,
                          ...opacity
                        }
                      ]}
                    />
                  </LinearGradient>
                </View>

                <ImageBackground
                  source={masterWave[this.props.level]}
                  style={[
                    styles.icon,
                    {
                      marginTop: 0,
                      marginRight: 0,
                      // transform: [{ scale: scaleV }]
                      // height: 47.5,
                      // width: 37.5,
                      width: Dimensions.get("window").width * 0.62,
                      height: 21,
                      ...opacity
                    }
                  ]}
                />
                <View style={styles.titleContainer}>
                  <View
                    style={{
                      flex: 0.8,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start"
                    }}
                  >
                    <Text style={[styles.titleSession, opacity]}>
                      {lockedCoins
                        ? strings("unlock_it_")
                        : this.props.sessionName}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.2,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    {this.props.completed ? (
                      <Image
                        source={masterCheck[this.props.level]}
                        style={{
                          width: 30,
                          height: 30,
                          // marginTop: Dimensions.get("window").height * 0.08 + 45,
                          ...opacity
                        }}
                      />
                    ) : (
                      this.renderEventsOrCoins(opacity)
                    )}
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      );
    }
  }
}

export const master = {
  0: require("../../assets/images/trainings/training_master_special.png"),
  1: require("../../assets/images/trainings/training_master_newbie.png"),
  2: require("../../assets/images/trainings/training_master_rookie.png"),
  3: require("../../assets/images/trainings/training_master_pro.png"),
  4: require("../../assets/images/trainings/training_master_star.png")
};

export const masterWave = {
  0: require("../../assets/images/trainings/wave_training_card_special.png"),
  1: require("../../assets/images/trainings/wave_training_card_newbie.png"),
  2: require("../../assets/images/trainings/wave_training_card_rookie.png"),
  3: require("../../assets/images/trainings/wave_training_card_pro.png"),
  4: require("../../assets/images/trainings/wave_training_card_star.png")
};

export const masterCheck = {
  1: require("../../assets/images/trainings/check_icn_training_newbie.png"),
  2: require("../../assets/images/trainings/check_icn_training_rookie.png"),
  3: require("../../assets/images/trainings/check_icn_training_pro.png"),
  4: require("../../assets/images/trainings/check_icn_training_star.png")
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7F8F9",

    width: Dimensions.get("window").width * 0.62 + 6,
    height: Dimensions.get("window").height * 0.25 + 6,
    marginHorizontal: 15,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: "#F7F8F9",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center"
  },
  containerSpecial: {
    backgroundColor: "#F7F8F9",
    borderWidth: 2,
    borderRadius: 4,
    borderColor: "#F7F8F9"
  },
  senseiContainer: {
    width: Dimensions.get("window").width * 0.62,
    height: Dimensions.get("window").height * 0.17 - 21,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    justifyContent: "center",
    alignItems: "center"
  },
  titleContainer: {
    backgroundColor: "#F7F8F9",
    width: Dimensions.get("window").width * 0.62,
    height: Dimensions.get("window").height * 0.08,
    padding: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4
  },
  titleSession: {
    color: "#3d3d3d",
    fontSize: 11,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    textAlign: "left"
  },
  numberSession:{
    color: "#3d3d3d",
    fontSize: 15,
    textAlign: "left",
    fontFamily: "Montserrat-ExtraBold"
  },
  icon: {
    width: 37.5,
    height: 47.5
    // backgroundColor: "#00000050"
  },
  completedStats: {
    color: "#9D9B9C",
    fontSize: 12,
    textAlign: "left",
    fontWeight: "400",
    fontFamily: "OpenSans-Regular"
  }
});


HorizontalSessionContainer.defaultProps = {
  indexSession: 0
};

export default withNavigation(HorizontalSessionContainer);
