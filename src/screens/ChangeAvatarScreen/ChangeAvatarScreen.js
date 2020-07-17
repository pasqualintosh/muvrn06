/**
 * scena per il riassunto della tratta
 * lo zoom si adatta a seconda le coordinate settate in fitToCoordinates
 * con il comppnente MapView.Polyline creiamo un tratto che unisce le coordinate utile per sapere il percorso effettuato
 * MapView.Marker componente per mettere dei punti nella mappa utili per sapere dove è inziato il tracciamento e dove è finito
 * @author push
 */

import React from "react";
import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  Alert,
  Image,
  Platform,
  TouchableWithoutFeedback,
  StyleSheet
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import SurveySelectAvatar, {
  AvatarList
} from "../../components//SurveySelectAvatar/SurveySelectAvatar";
import GoOnButton from "../../components/GoOnButton/GoOnButton";
import WavyArea from "../../components/WavyArea/WavyArea";
import { updateState, getCity } from "./../../domains/register/ActionCreators";
import {
  styles,
  negativeData,
  positiveData
} from "../../components/CustomSurveySlide/Style.js";

import { UpdateProfile } from "./../../domains/login/ActionCreators";
import { connect } from "react-redux";

import { strings } from "../../config/i18n";
import { changeScreenProfile } from "./../../domains/trainings/ActionCreators";

class ChangeAvatarScreen extends React.Component {
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
      avatar: null,
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

  componentDidMount() {
    this.setState({
      avatar: this.props.navigation.getParam("avatar")
    });
  }

  ConfermNewAvatar = () => {
    const avatar = this.props.navigation.getParam("avatar");
    const saveData = this.props.navigation.getParam(
      "ConfermNewAvatar",
      avatar =>
        this.props.dispatch(
          UpdateProfile({
            data: {
              public_profile: { avatar }
            }
          })
        )
    );
    if (avatar !== this.state.avatar) {
      saveData(this.state.avatar);
    }
    console.log("prova");
    this.props.dispatch(changeScreenProfile("myself"));

    // this.props.navigation.goBack();
    this.props.navigation.navigate("Info");
  };

  handleTapAvatar = id => {
    this.setState({ avatar: id, canSlide: true }, () => {
      const saveData = this.props.navigation.getParam(
        "ConfermNewAvatar",
        () => {}
      );
      saveData(this.state.avatar);
    });
  };

  static navigationOptions = {
    headerTitle: (
      <Text
        style={{
          left: Platform.OS == "android" ? 20 : 0
        }}
      >
        Avatar
      </Text>
    )
  };

  renderAvatarsList() {
    const avatar = this.props.navigation.getParam("avatar");

    return (
      <View style={{}}>
        <SurveySelectAvatar
          selectedAvatar={this.state.avatar ? this.state.avatar : avatar}
          handleTapAvatar={id => this.handleTapAvatar(id)}
          {...this.props}
          avatarsList={AvatarList()}
          style={{ height: Dimensions.get("window").height - 120 }}
        />
      </View>
    );
  }

  render() {
    const endBoxScroll = Platform.OS === "ios" ? 180 : 160;
    return (
      <View style={styles.mainContainer}>
        <ImageBackground
          source={require("../../assets/images/bg-login.png")}
          style={styles.backgroundImage}
        >
          {/* 
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#7d4d99", "#6497cc"]}
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

          {/* BODY */}
          <View
            style={{
              height: Dimensions.get("window").height - endBoxScroll,
              backgroundColor: "transparent"
            }}
          >
            {this.renderAvatarsList()}
          </View>

          <ImageBackground
            source={require("../../assets/images/white_wave_profile.png")}
            style={style.backgroundImageWaveDown}
          >
            <View
              style={{
                height: 180,
                backgroundColor: "transparent",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignContent: "center"
              }}
            >
              <View
                // start={{ x: 0.0, y: 0.0 }}
                // end={{ x: 0.0, y: 1.0 }}
                // locations={[0, 1.0]}
                // colors={["#6497cc", "#7d4d99"]}
                style={{
                  width: Dimensions.get("window").width,
                  height: 140,
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignContent: "center"
                }}
              >
                <View style={style.buttonContainer}>
                  <TouchableWithoutFeedback
                    onPress={() => this.ConfermNewAvatar()}
                  >
                    <LinearGradient
                      start={{ x: 0.0, y: 0.0 }}
                      end={{ x: 0.0, y: 1.0 }}
                      locations={[0, 1.0]}
                      colors={["#E82F73", "#F49658"]}
                      style={style.buttonBox}
                    >
                      <Text style={style.buttonGoOnText}>{strings("ok")}</Text>
                    </LinearGradient>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </ImageBackground>
        </ImageBackground>
      </View>
    );
  }
}

const style = StyleSheet.create({
  mainContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  titleContainer: {
    position: "absolute",
    top: 0,
    // top:
    //   Platform.OS === "ios"
    //     ? Dimensions.get("window").height * 0 + 18
    //     : Dimensions.get("window").height * 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.15,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  },
  titleIconContainer: {},
  textTitle: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 14,
    marginVertical: 1,
    fontWeight: "bold"
  },
  iconContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  contentContainer: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.15,
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").height * 0.8,
    backgroundColor: "transparent"
  },
  footerContainer: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.7,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.3,
    backgroundColor: "violet"
  },
  overlayWave: {
    width: Dimensions.get("window").width,
    height: 100
  },
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  backgroundImageWave: {
    height: 100,
    width: Dimensions.get("window").width,
    position: "absolute"
    // top: Dimensions.get("window").height * 0.04 + 14
  },
  backgroundImageWaveDown: {
    height: 180,
    width: Dimensions.get("window").width,
    position: "absolute",
    bottom: 0
  },
  buttonContainer: {
    width: Dimensions.get("window").width,
    height: 80,
    backgroundColor: "transparent",
    position: "absolute",
    justifyContent: "flex-start",
    alignItems: "center",
    shadowRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5
  },
  buttonBox: {
    width: Dimensions.get("window").width * 0.68,
    height: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    elevation: 1
  },
  buttonGoOnText: {
    color: "#3363AD",
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    color: "#FFFFFF"
  }
});

const withData = connect();

export default withData(ChangeAvatarScreen);
