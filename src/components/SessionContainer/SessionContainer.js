import React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  Easing,
  Platform,
  Image,
  NativeModules,
  Alert
} from "react-native";
import { styles } from "./Style";
import { BoxShadow } from "react-native-shadow";
import { connect } from "react-redux";
import { putSession } from "../../domains/trainings/ActionCreators";

class SessionContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      showDescription: false,
      animating: false
    };
    this.heightValue = new Animated.Value(0);
    this.iconScaleValue = new Animated.Value(0);
    this.auxValue = new Animated.Value(0);
  }

  animateAuxValueUp() {
    this.auxValue.setValue(0);

    Animated.timing(this.auxValue, {
      toValue: 1,
      duration: 400,
      easing: Easing.linear,

      isInteraction: true
    }).start(() => {});
  }

  animateAuxValueDown() {
    this.auxValue.setValue(1);

    Animated.timing(this.auxValue, {
      toValue: 0,
      duration: 400,
      easing: Easing.linear,

      isInteraction: true
    }).start(() => {});
  }

  animateIncrementHeight() {
    this.heightValue.setValue(0);
    this.setState({ animating: true });

    Animated.timing(this.heightValue, {
      toValue: 1,
      duration: 400,
      easing: Easing.linear,

      isInteraction: true
    }).start(() => {});

    setTimeout(() => {
      this.setState({
        collapsed: true,
        showDescription: true,
        animating: false
      });
    }, 400);
  }

  componentDidMount() {
    if (this.props.scrollSessions) {
      console.log("prova a spostare");
      this.props.scrollSessions();
    }
  }

  animateDecrementHeight() {
    this.heightValue.setValue(1);

    this.setState({ animating: true });

    Animated.timing(this.heightValue, {
      toValue: 0,
      duration: 400,
      easing: Easing.linear,

      isInteraction: true
    }).start(() => {});

    setTimeout(() => {
      this.setState({
        collapsed: false,
        showDescription: false,
        animating: false
      });
    }, 200);
  }

  renderCheckImage(eventId) {
    const txtHeight = this.heightValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 20]
    });
    if (this.props.eventsCompleted == this.props.eventsNumber) {
      return (
        <Animated.View
          style={{
            width: 40,
            height: 40,
            marginTop: 0,
            opacity: this.heightValue,
            justifyContent: "flex-end",
            flexDirection: "row"
          }}
        >
          <Animated.Image
            source={require("../../assets/images/check_icn.png")}
            style={{
              width: 20,
              height: txtHeight,
              marginTop: Platform.OS == "ios" ? 3 : 0,
              opacity: this.heightValue
            }}
          />
        </Animated.View>
      );
    } else {
      let flag = false;
      this.props.trainingsState.training_events.forEach(e => {
        if (e.event.id == eventId && e.status == 1) flag = true;
      });
      if (flag)
        return (
          <Animated.View
            style={{
              width: 40,
              height: 40,
              marginTop: 0,
              opacity: this.heightValue,
              justifyContent: "flex-end",
              flexDirection: "row"
            }}
          >
            <Animated.Image
              source={require("../../assets/images/check_icn.png")}
              style={{
                width: 20,
                height: txtHeight,
                marginTop: Platform.OS == "ios" ? 3 : 0,
                opacity: this.heightValue
              }}
            />
          </Animated.View>
        );
      else {
        return (
          <Animated.View
            style={{
              width: 40,
              height: 40,
              marginTop: 0,
              opacity: this.heightValue,
              justifyContent: "flex-end",
              flexDirection: "row"
            }}
          />
        );
      }
    }
  }

  checkImage(eventId) {
    if (this.props.eventsCompleted == this.props.eventsNumber) {
      return true;
    } else {
      let flag = false;
      this.props.trainingsState.training_events.forEach(e => {
        if (e.event.id == eventId && e.status == 1) flag = true;
      });
      if (flag) return true;
      else {
        return false;
      }
    }
  }

  renderEventsDescription() {
    if (this.props.events)
      return this.props.events.map(e => (
        <Animated.View
          key={e.id}
          style={{
            flex: 1,
            alignContent: "center",
            justifyContent: "center",
            flexDirection: "row",
            opacity: this.heightValue,
            paddingBottom: 10
          }}
        >
          <View style={[styles.sessionEvent]}>
            <View
              style={[
                styles.sessionIconEvent,
                {
                  backgroundColor: this.checkImage(e.id) ? "#6CBA7E" : "#FFFFFF"
                }
              ]}
            />
          </View>
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-start",
                flexDirection: "column",
                width: Dimensions.get("window").width * 0.7 - 10,
                height: 30,
                borderRadius: 4,
                backgroundColor: this.checkImage(e.id) ? "#6CBA7E" : "#FFFFFF"
              }}
            >
              <Text
                style={[
                  styles.trainingSession,
                  {
                    position: "relative",
                    color: this.checkImage(e.id) ? "#FFFFFF" : "#3D3D3D",
                    paddingLeft: 2
                  }
                ]}
              >
                {e.quiz
                  ? "Answer a quick quiz"
                  : e.survey
                  ? "Answer a quick survey about your mobility habits"
                  : e.text_description}
                {"   "}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: 10
            }}
          />
        </Animated.View>
      ));
  }

  componentWillMount() {
    if (this.props.status === 2) {
      this.animateIncrementHeight();
      this.animateAuxValueUp();
    }
  }

  renderObtainableCoins() {
    return (
      <Animated.View style={[styles.coinView, { opacity: this.heightValue }]}>
        <Text style={[styles.coinSession, { fontSize: 20 }]}>
          {this.props.obtainableCoins}
        </Text>
        <View style={{ width: 7 }} />
        <Image
          source={require("../../assets/images/coins_shadow_icn.png")}
          style={{
            width: 20,
            height: 20,
            marginTop: 3
          }}
        />
      </Animated.View>
    );
  }

  renderDescriptionBox() {
    const height = this.heightValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        0,
        this.props.events.length > 3
          ? this.props.events.length > 4
            ? Dimensions.get("window").height * 0.33
            : Dimensions.get("window").height * 0.3
          : Dimensions.get("window").height * 0.2
      ]
    });

    return (
      <Animated.View style={[styles.descriptionBox, { height }]}>
        <View style={[styles.sessionDescription]}>
          {this.renderEventsDescription()}
          {this.renderObtainableCoins()}
        </View>
      </Animated.View>
    );
  }

  renderBoxTitle(lockedCoins) {
    return (
      <View style={[styles.sessionText]}>
        <Text style={[styles.titleSession]}>
          {lockedCoins ? "UNLOCK IT!" : this.props.sessionName}
        </Text>
      </View>
    );
  }

  renderCompletedImage() {
    if (this.props.completed)
      return (
        <Image
          source={require("../../assets/images/session_completed_icn.png")}
          style={{
            width: 30,
            height: 30,
            position: "relative",
            // top: -10,
            top: 0,
            left: 0
            // borderRadius: 30,
            // backgroundColor: "#02B52B",
          }}
        />
      );
  }

  eventsOrCoins = () => {
    if (this.props.coins) {
      const value = this.props.coins.toString();
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
            width: Dimensions.get("window").width * 0.1,
            height: Dimensions.get("window").height * 0.1,
            marginRight: 5
          }}
        >
          <Animated.Image
            source={require("../../assets/images/coins_shadow_icn.png")}
            style={{
              width: Dimensions.get("window").height * 0.09 - 35,
              height: Dimensions.get("window").height * 0.09 - 35,
              marginTop: Platform.OS == "ios" ? 3 : 0
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

                fontFamily: "Montserrat-ExtraBold"
              }
            ]}
          >
            {value}
            {"  "}
          </Text>
        </View>
      );
    } else {
      return (
        <Text style={styles.completedStats}>
          {this.props.eventsCompleted + "/" + this.props.eventsNumber}
        </Text>
      );
    }
  };

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

  render() {
    const height = this.heightValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        Dimensions.get("window").height * 0.1,
        this.props.events.length > 3
          ? this.props.events.length > 4
            ? Dimensions.get("window").height * 0.44
            : Dimensions.get("window").height * 0.4
          : Dimensions.get("window").height * 0.3
      ]
    });

    const shadowOpt = {
      width: Dimensions.get("window").width * 0.9,
      height: Dimensions.get("window").height * 0.1,
      color: "#555",
      border: 2,
      radius: 5,
      opacity: 0.2,
      x: 0,
      y: 0,
      style: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        alignSelf: "center"
      }
    };

    const lockedCoins = this.props.coins ? this.props.status < 2 : false;

    return (
      <View style={this.props.style}>
        <Animated.View style={[styles.mainContainer, { height }]}>
          <BoxShadow setting={shadowOpt}>
            <TouchableWithoutFeedback
              disabled={
                this.props.active
                  ? false
                  : this.state.animating || this.props.status < 2
              }
              onPress={
                this.props.active
                  ? () => this.alertUnlock(this.props.idSession)
                  : () => {
                      if (this.state.collapsed) {
                        this.animateDecrementHeight();
                        this.animateAuxValueDown();
                      } else {
                        this.animateIncrementHeight();
                        this.animateAuxValueUp();
                      }
                    }
              }
            >
              <Animated.View
                style={[
                  styles.sessionContainer,
                  { height },

                  this.props.levelCorrent
                    ? this.props.status < 2
                      ? this.props.active
                        ? {}
                        : { opacity: 0.7 }
                      : {}
                    : { opacity: 0.3 }
                ]}
              >
                <View style={styles.headerBox}>
                  <View style={[styles.sessionIcon]}>
                    <Image
                      source={
                        lockedCoins
                          ? require("../../assets/images/mentore_training_unlock.png")
                          : require("../../assets/images/mentore_training.png")
                      }
                      style={[
                        styles.icon,
                        {
                          marginTop: 0,
                          marginRight: 0,
                          // transform: [{ scale: scaleV }]
                          // height: 47.5,
                          // width: 37.5,
                          width: Dimensions.get("window").width * 0.1,
                          height: Dimensions.get("window").width * 0.1 + 10
                        }
                      ]}
                    />
                    {/* 
                    <Animated.View
                      style={[
                        styles.icon,
                        {
                          marginTop: marginTopIcon,
                          transform: [{ scale: scaleV }]
                        }
                      ]}
                    /> 
                    */}
                  </View>

                  {this.renderBoxTitle(lockedCoins)}

                  <View style={[styles.sessionCompleted]}>
                    <View>{this.eventsOrCoins()}</View>
                  </View>
                </View>
                {this.renderDescriptionBox()}
              </Animated.View>
            </TouchableWithoutFeedback>
          </BoxShadow>
        </Animated.View>
        <View
          style={{
            // borderRadius: 30,
            // backgroundColor: "#02B52B",
            position: "absolute",
            // top: -10,
            top: -7,
            right: 0
          }}
        >
          {this.renderCompletedImage()}
          {/* 
          <Image
            source={require("../../assets/images/session_completed_icn.png")}
            style={{
              width: 30,
              height: 30,
              position: "relative",
              // top: -10,
              top: 0,
              left: 0
              // borderRadius: 30,
              // backgroundColor: "#02B52B",
            }}
          />
          */}
        </View>
      </View>
    );
  }
}

const withData = connect(state => {
  return {
    trainingsState: state.trainings
  };
});

export default withData(SessionContainer);
