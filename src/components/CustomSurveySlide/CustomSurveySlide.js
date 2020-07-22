import React from "react";
import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  Alert,
  Image,
  NativeModules
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import WavyArea from "./../WavyArea/WavyArea";
import SurveySelectAvatar, {
  AvatarList
} from "./../SurveySelectAvatar/SurveySelectAvatar";
import ProgressSurveyQuery from "./../ProgressSurveyQuery/ProgressSurveyQuery";
import SelectMostFrequentRace from "./../SelectMostFrequentRace/SelectMostFrequentRace";
import MobilityHabitsCarSlide from "../MobilityHabitsSlide/MobilityHabitsCarSlide";
import MobilityHabitsMotoSlide from "./../MobilityHabitsSlide/MobilityHabitsMotoSlide";
import RegisterForm from "./../RegisterForm/RegisterForm";
import SelectCity from "./../SelectCity/SelectCity";
import EndSurveySlide from "./../EndSurveySlide/EndSurveySlide";
import GoOnButton from "./../GoOnButton/GoOnButton";
import Emoji from "@ardentlabs/react-native-emoji";
import round from "round";
import { styles, negativeData, positiveData } from "./Style";
import { updateState, getCity } from "./../../domains/register/ActionCreators";
import BackgroundGeolocation from "./../../helpers/geolocation";
import { BoxShadow } from "react-native-shadow";

import { strings } from "../../config/i18n";

const PROGRESS = [
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
];

class CustomSurveySlide extends React.Component {
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
      mostFrequentRaceFrequency: "-",
      canSlide: false,
      mfrFrequencyPivotFlag: false,
      mfrRoutesPivotFlag: false
    };
  }

  setBackgroundGeolocation = () => {
    BackgroundGeolocation.configure({
      desiredAccuracy: 10,
      stationaryRadius: 50,
      distanceFilter: 50,
      debug: false,
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
      url: "http://192.168.81.15:3000/location",
      httpHeaders: {
        "X-FOO": "bar"
      },
      // customize post properties
      postTemplate: {
        lat: "@latitude",
        lon: "@longitude",
        foo: "bar" // you can also add your own properties
      },
      notificationTitle: "MUV",
      notificationText: "Background tracking"
    });

    BackgroundGeolocation.on("location", location => {
      BackgroundGeolocation.startTask(taskKey => {
        console.log(location);

        this.props.dispatch(
          updateState({
            latitude: location.latitude,
            longitude: location.longitude
          })
        );

        // BackgroundGeolocation.stop();
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on("error", error => {
      console.log("[ERROR] BackgroundGeolocation error:", error);
    });

    BackgroundGeolocation.on("start", () => {
      console.log("[INFO] BackgroundGeolocation service has been started");
    });

    BackgroundGeolocation.on("stop", () => {
      console.log("[INFO] BackgroundGeolocation service has been stopped");
    });

    BackgroundGeolocation.on("authorization", status => {
      console.log(
        "[INFO] BackgroundGeolocation authorization status: " + status
      );
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(
          () =>
            Alert.alert(
              "App requires location tracking permission",
              "Would you like to open app settings?",
              [
                {
                  text: strings("id_14_03"),
                  onPress: () => BackgroundGeolocation.showAppSettings()
                },
                {
                  text: strings("id_14_04"),
                  onPress: () => console.log("No Pressed"),
                  style: "cancel"
                }
              ]
            ),
          1000
        );
      }
    });

    BackgroundGeolocation.on("background", () => {
      console.log("[INFO] App is in background");
    });

    BackgroundGeolocation.on("foreground", () => {
      console.log("[INFO] App is in foreground");
    });

    BackgroundGeolocation.start();
    this.setState({ activeBackgroundGeolocation: true });
  };
  unsetBackgroundGeolocation = () => {
    // unregister all event listeners
    BackgroundGeolocation.events.forEach(event =>
      BackgroundGeolocation.removeAllListeners(event)
    );
  };
  calculateModalSplitTotalValue = () => {
    let total = 0;
    this.state.progress.forEach((item, index) => {
      total += item.value;
    });
    return total;
  };
  hanldeGoOnTap = state => {
    this.props.dispatch(updateState(state));
    this.setState({ progress: PROGRESS });
    // if (this.state.canSlide) {
    this.props.handleNextTap();
    this.setState({ canSlide: false });
    // }
  };
  handleTapAvatar = id => {
    this.setState({ avatar: id, canSlide: true });
  };
  handleFrequencyChange = value => {
    this.setState({
      mostFrequentRaceFrequency: value,
      mfrFrequencyPivotFlag: true
    });
  };
  _handleProgressTap = (positionX, width, index) => {
    const total = this.calculateModalSplitTotalValue();
    items = total;

    let increment =
      round((100 / width) * positionX, 25, "down") / 100 -
      this.state.progress[index].value;

    items += increment;
    items = items * 4;

    if (items < 11) {
      let progress;
      if (positionX < 25) {
        progress = 0;
      } else {
        progress = round((100 / width) * positionX, 25, "up");
      }
      let progressState = this.state.progress;
      progressState[index].value = progress / 100;
      if (items > 0)
        this.setState({ progress: [...progressState], canSlide: true });
      else this.setState({ progress: [...progressState] });
    }
  };
  _handleShowPasswordTap = () => {
    const hidePassword = !this.state.hidePassword;
    let hidePasswordIcon = "ios-eye-off";

    if (hidePassword) hidePasswordIcon = "ios-eye";

    this.setState({ hidePassword, hidePasswordIcon });
  };
  showAlert = () => {
    Alert.alert("Oops", strings("seems_like_you_"));
  };
  renderSlots() {
    const total = this.calculateModalSplitTotalValue() * 4;
    const items = [];

    const shadowOpt = {
      width: Dimensions.get("window").width * 0.05,
      height: 3,
      marginHorizontal: 2,
      position: "absolute",
      top: 0,
      color: "#333",
      border: 3,
      radius: 1,
      opacity: 0.15,
      x: 0,
      y: 1,
      style: {
        marginHorizontal: 2
      }
    };

    for (let i = 0; i < 10; i++) items.push("");
    return items.map((item, index) => (
      <View>
        <BoxShadow setting={shadowOpt} />
        <View
          key={index}
          style={{
            marginHorizontal: 2,
            backgroundColor: index < total ? "#FFCC00" : "#fff",
            width: Dimensions.get("window").width * 0.05,
            height: 5,
            position: "absolute",
            top: 0
            // shadowColor: "#000",
            // shadowOffset: { width: 0, height: 0.01 },
            // shadowOpacity: 0.2
          }}
        />
      </View>
    ));
  }
  renderProgressQuery(index) {
    return (
      <ProgressSurveyQuery
        key={index}
        progress={this.state.progress[index].value}
        height={25}
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
        handleNextTap={() => this.props.handleNextTap()}
        modalSplit={this.state.progress[index].label
          .toUpperCase()
          .replace("_", " ")}
        label={this.state.progress[index].label.replace("_", "")}
      />
    );
  }
  renderCity(name) {
    return (
      <View>
        <Text>{name}</Text>
      </View>
    );
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
    if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
      Object.assign(styles, {
        mainContainer: { flexDirection: "row", height: 20, marginVertical: 3 },
        queryContainer: {
          flex: 0.8,
          height: 20,
          alignItems: "center",
          justifyContent: "center"
        }
      });
    }

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
  renderMostFrequentRaceQuery(index) {
    return (
      <ProgressSurveyQuery
        key={index}
        progress={this.state.progress[index].value}
        height={25}
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
        {...this.props}
        label={this.state.progress[index].label.replace("_", "")}
      />
    );
  }
  renderModalSplitSlide() {
    if (this.props.selectable) {
      return (
        <View style={{}}>
          {this.renderSlotsContainer()}
          {this.state.progress.map((item, index) =>
            this.renderProgressQuery(index)
          )}
          <GoOnButton
            handleNextTap={() => {
              if (this.state.canSlide) {
                this.setBackgroundGeolocation();
                this.hanldeGoOnTap({ generalModalSplit: this.state.progress });
                this.setState({ canSlide: false });
              } else {
                this.showAlert();
              }
            }}
          />
        </View>
      );
    }
  }
  renderMostFrequentRace() {
    if (this.props.mostFrequentRace) {
      return (
        <View style={{}}>
          {this.renderSlotsContainer()}
          <SelectMostFrequentRace
            handleFrequencyChange={value => this.handleFrequencyChange(value)}
            {...this.props}
            DaysChoose={this.state.mostFrequentRaceFrequency}
            changeFrequencyPivot={() =>
              this.setState({ mfrFrequencyPivotFlag: true })
            }
            changeRoutesPivot={() =>
              this.setState({ mfrRoutesPivotFlag: true })
            }
          />
          {this.state.progress.map((item, index) =>
            this.renderProgressQuery(index)
          )}
          <GoOnButton
            handleNextTap={() => {
              navigator.geolocation.getCurrentPosition(
                position => {
                  BackgroundGeolocation.stop();
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
              // controllo che i giorni , la routine e lo split siano inseriti prima di andare avanti
              if (
                this.state.canSlide &&
                this.state.mfrRoutesPivotFlag &&
                this.state.mostFrequentRaceFrequency !== "-"
              ) {
                this.hanldeGoOnTap({
                  mostFrequentRaceModalSplit: this.state.progress,
                  mostFrequentRaceFrequency: this.state
                    .mostFrequentRaceFrequency
                });
                this.setState({ canSlide: false });
              } else {
                this.showAlert();
              }
            }}
          />
        </View>
      );
    }
  }
  renderUserData() {
    if (this.props.userData) {
      return (
        <RegisterForm
          {...this.props}
          handleNextTap={() => {
            this.props.handleNextTap();
            this.setState({ canSlide: false });
          }}
          hidePasswordIcon={this.state.hidePasswordIcon}
          handleShowPasswordTap={() => this._handleShowPasswordTap()}
          hidePassword={this.state.hidePassword}
          register={true}
          canSlide={() => {
            this.setState({ canSlide: true });
          }}
        />
      );
    }
  }
  renderAvatarsList() {
    if (this.props.avatarsList)
      return (
        <View style={{}}>
          <SurveySelectAvatar
            selectedAvatar={this.state.avatar}
            handleTapAvatar={id => this.handleTapAvatar(id)}
            {...this.props}
            avatarsList={AvatarList()}
          />
          <GoOnButton
            handleNextTap={() => {
              if (this.state.canSlide) {
                this.hanldeGoOnTap({ avatar: this.state.avatar });
                this.setState({ canSlide: false });
              } else {
                this.showAlert();
              }
            }}
          />
        </View>
      );
  }
  renderTitle() {
    if (this.props.endSurveySlide) {
      // vedi renderHeader
    } else if (this.props.titleIcon) {
      const icons = this.props.icons.map((item, index) => (
        <Emoji style={styles.textTitle} key={index} name={item} />
      ));
      return (
        <View style={styles.titleIconContainer}>
          <Text style={styles.textTitle}>
            {this.props.title ? this.props.title : "Slide title"}
          </Text>
          <View style={styles.iconContainer}>{icons}</View>
        </View>
      );
    } else {
      return (
        <Text style={styles.textTitle}>
          {this.props.title ? this.props.title : "Slide title"}
        </Text>
      );
    }
  }
  renderSelectCity() {
    if (this.props.selectCity)
      return (
        <SelectCity
          {...this.props}
          handleNextTap={state => {
            this.hanldeGoOnTap({ city: state });
          }}
          nearestCity={this.state.nearestCity}
        />
      );
  }
  renderMobilityHabitsCar() {
    if (this.props.mobilityHabitsCar)
      return <MobilityHabitsCarSlide hanldeGoOnTap={this.hanldeGoOnTap} />;
  }
  renderMobilityHabitsMoto() {
    if (this.props.mobilityHabitsMoto)
      return <MobilityHabitsMotoSlide hanldeGoOnTap={this.hanldeGoOnTap} />;
  }
  renderEndSurvey() {
    if (this.props.endSurveySlide)
      return (
        <EndSurveySlide
          {...this.props}
          handleNextTap={() => this.props.navigation.navigate("Home")}
        />
      );
  }
  renderHeader() {
    if (this.props.endSurveySlide == true)
      return (
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0.0, 1.0]}
          colors={["#7d4d99", "#6497cc"]}
          style={{
            position: "absolute",
            top: Dimensions.get("window").height * 0,
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height * 0.3
          }}
        />
      );
  }
  renderHeaderTitle() {
    if (this.props.endSurveySlide == true) {
      const styles = {
        container: {
          position: "absolute",
          top: Dimensions.get("window").height * 0.08,
          width: Dimensions.get("window").width,
          height: 40,
          justifyContent: "center",
          alignItems: "center"
        },
        text: {
          fontFamily: "Montserrat-ExtraBold",
          color: "#fff",
          fontSize: 30,
          marginVertical: 1
        }
      };

      if (NativeModules.RNDeviceInfo.model.includes("iPad"))
        Object.assign(styles, {
          container: {
            position: "absolute",
            top: Dimensions.get("window").height * 0,
            width: Dimensions.get("window").width,
            height: 30,
            justifyContent: "center",
            alignItems: "center"
          },
          text: {
            fontFamily: "Montserrat-ExtraBold",
            color: "#fff",
            fontSize: 20,
            marginVertical: 1
          }
        });

      return (
        <View style={styles.container}>
          <Text style={styles.text}>START MOVE</Text>
        </View>
      );
    }
  }
  renderEndWavyArea() {
    if (this.props.endSurveySlide == true)
      return (
        <WavyArea
          data={positiveData}
          color={"#F7F8F9"}
          style={[
            styles.overlayWave,
            {
              // height: Dimensions.get("window").height * 0.1,
              position: "absolute",
              top: Dimensions.get("window").height * 0.3 - 100
            }
          ]}
        />
      );
  }
  renderEndImage() {
    if (this.props.endSurveySlide == true) {
      const styles = {
        imageContainer: {
          position: "absolute",
          top: Dimensions.get("window").height * 0.1,
          width: Dimensions.get("window").width * 0.6,
          height: Dimensions.get("window").height * 0.55,
          // backgroundColor: "#FAB21E",
          alignSelf: "center"
        },
        image: {
          width: Dimensions.get("window").width * 0.6,
          height: Dimensions.get("window").height * 0.55
        }
      };

      if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
        Object.assign(styles, {
          imageContainer: {
            position: "absolute",
            top: Dimensions.get("window").height * 0.3,
            width: Dimensions.get("window").width * 0.36,
            height: Dimensions.get("window").height * 0.33,
            // backgroundColor: "#FAB21E",
            alignSelf: "center"
          },
          image: {
            width: Dimensions.get("window").width * 0.36,
            height: Dimensions.get("window").height * 0.33
          }
        });
      }
      return (
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("./../../assets/images/letsgo.png")}
          />
        </View>
      );
    }
  }
  render() {
    this.calculateModalSplitTotalValue();
    return (
      <View style={styles.mainContainer}>
        <ImageBackground
          source={require("../../assets/images/bg-login.png")}
          style={styles.backgroundImage}
        />
        {this.renderSlots()}
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={this.props.colors}
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
        <View style={styles.titleContainer}>{this.renderTitle()}</View>
        <View style={styles.contentContainer}>
          {this.renderAvatarsList()}
          {this.renderModalSplitSlide()}
          {this.renderMostFrequentRace()}
          {this.renderMobilityHabitsCar()}
          {this.renderMobilityHabitsMoto()}
          {this.renderUserData()}
          {this.renderSelectCity()}
          {this.renderEndSurvey()}
        </View>

        {this.renderHeader()}
        {this.renderHeaderTitle()}
        {this.renderEndWavyArea()}
        {this.renderEndImage()}
      </View>
    );
  }
}

export default CustomSurveySlide;
