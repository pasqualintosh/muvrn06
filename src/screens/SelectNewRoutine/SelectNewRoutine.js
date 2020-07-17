import React from "react";
import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback,
  NativeModules
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import WavyArea from "./../../components/WavyArea/WavyArea";
import ProgressSurveyQuery from "./../../components/ProgressSurveyQuery/ProgressSurveyQuery";
import SelectMostFrequentRace from "./../../components/SelectMostFrequentRace/SelectMostFrequentRace";
import GoOnButton from "./../../components/GoOnButton/GoOnButton";
import Emoji from "@ardentlabs/react-native-emoji";
import round from "round";
import { styles, negativeData } from "./Style";
import { updateState, getCity } from "./../../domains/register/ActionCreators";

import { postMostFrequentRoute } from "./../../domains/login/ActionCreators";
import { connect } from "react-redux";

import { strings } from "../../config/i18n";

import BackgroundGeolocation from "./../../helpers/geolocation";


class SelectNewRoutine extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: [
        {
          label: "walk",
          value: 0,
          color: "#6CBA7E"
        },
        {
          label: "bike",
          value: 0,
          color: "#E83475"
        },
        {
          label: "bus",
          value: 0,
          color: "#FAB21E"
        },
        {
          label: "car",
          value: 0,
          color: "#60368C"
        },
        {
          label: "motorbike",
          value: 0,
          color: "#5FC4E2"
        },
        {
          label: "car_pooling",
          value: 0,
          color: "#3363AD"
        }
      ],
      total: 0,
      hidePassword: true,
      hidePasswordIcon: "ios-eye",
      avatar: null,
      activeBackgroundGeolocation: false,
      key: (+new Date() + 2).toString(),
      colors: ["#7d4d99", "#6497cc"],
      mostFrequentRace: true,
      mostFrequentRaceFrequency: "-",
      startLabel: "Usually",
      endLabel: "Often",
      image: true,
      imageSource: require("../../assets/images/bike-icon.png")
    };
  }
  calculateModalSplitTotalValue = () => {
    let total = 0;
    this.state.progress.forEach((item, index) => {
      total += item.value;
    });

    return total;
  };

  hanldeGoOnTap = state => {
    console.log(state);
    this.props.dispatch(updateState(state));
    // ritorni indietro
    // this.props.handleNextTap();
  };

  handleFrequencyChange = value => {
    this.setState({ mostFrequentRaceFrequency: value });
  };
  _handleProgressTap = (positionX, width, index) => {
    const total = this.calculateModalSplitTotalValue();
    items = total;

    let increment =
      round((100 / width) * positionX, 25, "up") / 100 -
      this.state.progress[index].value;

    items += increment;
    items = items * 4;

    if (items < 11) {
      let progress;
      if (positionX < 15) {
        progress = 0;
      } else {
        progress = round((100 / width) * positionX, 25, "up");
      }
      let progressState = this.state.progress;
      progressState[index].value = progress / 100;
      if (items == 10) this.setState({ progress: [...progressState] });
      else this.setState({ progress: [...progressState] });
    }
  };
  renderSlots() {
    const total = this.calculateModalSplitTotalValue() * 4;
    const items = [];
    for (let i = 0; i < 10; i++) items.push("");
    return items.map((item, index) => (
      <View
        style={{
          marginHorizontal: 2,
          backgroundColor: index < total ? "#FFCC00" : "#fff",
          width: Dimensions.get("window").width * 0.05,
          height: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 0.01 },
          shadowOpacity: 0.2
        }}
      />
    ));
  }
  renderSlotsContainer() {
    const styles = {
      mainContainer: { flexDirection: "row", height: 35, marginVertical: 3 },
      iconContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 0.2,
        height: 5
      },
      queryContainer: {
        flex: 0.8,
        height: 35,
        alignItems: "center",
        justifyContent: "center"
      },
      bar: {
        // backgroundColor: "#FAB21E",
        width: Dimensions.get("window").width * 0.6,
        height: 5,
        flexDirection: "row"
      }
    };
    return (
      <View style={styles.mainContainer}>
        <View style={styles.iconContainer}>
          <View style={{ width: 8, height: 16 }} />
        </View>
        <View style={styles.queryContainer}>
          <View style={styles.bar}>{this.renderSlots()}</View>
        </View>
      </View>
    );
  }
  renderProgressQuery(index) {
    let height = 25;
    if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
      height = 15;
    }
    return (
      <ProgressSurveyQuery
        key={Number.parseInt(index)}
        progress={this.state.progress[index].value}
        height={height}
        fillColor="#fff"
        barColor={this.state.progress[index].color}
        // borderColor="#DDD"
        // borderRadius={5}
        width={Dimensions.get("window").width * 0.6}
        handleClick={evt =>
          this._handleProgressTap(
            evt.nativeEvent.locationX,
            Dimensions.get("window").width * 0.6,
            index
          )
        }
        handleIconClick={() =>
          this._handleProgressTap(
            0,
            Dimensions.get("window").width * 0.6,
            index
          )
        }
        modalSplit={this.state.progress[index].label
          .toUpperCase()
          .replace("_", " ")}
        handleNextTap={() => console.log("avanti")}
        label={this.state.progress[index].label.replace("_", "")}
      />
    );
  }

  renderMostFrequentRace() {
    if (this.state.mostFrequentRace) {
      return (
        <View style={{}}>
          <SelectMostFrequentRace
            handleFrequencyChange={value => this.handleFrequencyChange(value)}
            {...this.props}
            DaysChoose={this.state.mostFrequentRaceFrequency}
            mostFrequentRaceFrequencyPosition={
              this.props.mostFrequentRaceFrequencyPosition
            }
          />

          {this.renderSlotsContainer()}
          {this.state.progress.map((item, index) =>
            this.renderProgressQuery(index)
          )}
          {/* 
          <GoOnButton
            handleNextTap={() => {
              navigator.geolocation.getCurrentPosition(
                position => {
                  this.props.dispatch(
                    updateState({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude
                    })
                  );
                  this.props.dispatch(
                    getCity({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude
                    })
                  );
                },
                error => alert(error.message),
                { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
              );
              this.unsetBackgroundGeolocation();
              this.hanldeGoOnTap({
                mostFrequentRaceModalSplit: this.state.progress,
                mostFrequentRaceFrequency: this.state.mostFrequentRaceFrequency
              });
            }}
          /> 
          */}
        </View>
      );
    }
  }

  ConfermNewRoutine = () => {
    // this.unsetBackgroundGeolocation();
    this.hanldeGoOnTap({
      mostFrequentRaceModalSplit: this.state.progress,
      mostFrequentRaceFrequency: this.state.mostFrequentRaceFrequency
    });
    this.props.dispatch(postMostFrequentRoute());
    // devo vedere se in questo momento c'e il live tracking attivo, se si non stop il gps
    if (!this.props.live) {
      BackgroundGeolocation.stop();
    }

    this.props.navigation.goBack();
  };

  renderTitle() {
    if (this.state.titleIcon) {
      const icons = this.state.icons.map((item, index) => (
        <Emoji
          style={styles.textTitle}
          key={Number.parseInt(index) + Math.random() + 10}
          name={item}
        />
      ));
      return (
        <View style={styles.titleIconContainer}>
          <Text style={styles.textTitle}>
            {this.state.title ? this.state.title : "Create new frequent trip"}
          </Text>
          <View style={styles.iconContainer}>{icons}</View>
        </View>
      );
    } else {
      return (
        <Text style={styles.textTitle}>
          {this.state.title ? this.state.title : "Create new frequent trip"}
        </Text>
      );
    }
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        // BackgroundGeolocation.stop();
        this.props.dispatch(
          updateState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        );
      },
      error => alert(error.message),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );
    // this.setBackgroundGeolocation();
  }

  componentWillUnmount() {
    // this.unsetBackgroundGeolocation();
  }

  render() {
    const total = this.calculateModalSplitTotalValue();
    return (
      <View style={[styles.mainContainer, { marginTop: -30 }]}>
        <ImageBackground
          source={require("../../assets/images/bg-login.png")}
          style={styles.backgroundImage}
        />
        {this.renderSlots()}
        {/* 
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={this.state.colors}
          style={styles.footerContainer}
        />
        <WavyArea
          data={negativeData}
          color={"#F7F8F9"}
          style={[
            styles.overlayWave,
            {
              position: "absolute",
              top: Dimensions.get("window").height * 0.7
            }
          ]}
        /> 
        */}
        <View style={styles.titleContainer}>{this.renderTitle()}</View>
        <View style={styles.contentContainer}>
          {this.renderMostFrequentRace()}
        </View>
        {this.state.mostFrequentRaceFrequency !== "-" &&
        this.props.mostFrequentRaceFrequencyPosition &&
        total > 0 ? (
          <View style={[styles.buttonContainer]}>
            <TouchableWithoutFeedback onPress={() => this.ConfermNewRoutine()}>
              <View style={styles.buttonBox}>
                <Text style={styles.buttonGoOnText}>{strings("ok")}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        ) : (
          <View style={[styles.buttonContainer, { opacity: 0.4 }]}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.buttonBox}>
                <Text style={styles.buttonGoOnText}>{strings("ok")}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
      </View>
    );
  }
}

const withDailyRoutine = connect(state => {
  return {
    mostFrequentRaceFrequencyPosition:
      state.register.mostFrequentRaceFrequencyPosition,
    live: state.tracking.activityChoice.type ? true : false
  };
});

export default withDailyRoutine(SelectNewRoutine);
