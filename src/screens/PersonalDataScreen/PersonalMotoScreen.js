import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Platform,
  NativeModules,
  TouchableWithoutFeedback,
  Picker as PickerIos
} from "react-native";
import WavyArea from "./../../components/WavyArea/WavyArea";
import LinearGradient from "react-native-linear-gradient";
import { BoxShadow } from "react-native-shadow";
import { connect } from "react-redux";
import {
  updateState,
  getMobilityCarValues,
  getMobilityMotoValues
} from "./../../domains/register/ActionCreators";
import {
  setMotoProperties,
  UpdateProfile
} from "./../../domains/login/ActionCreators";
import PickerAndroid from "./../../components/PickerAndroid/PickerAndroid";
import Modal from "react-native-modal";
import Emoji from "@ardentlabs/react-native-emoji";
import Icon from "react-native-vector-icons/Ionicons";

let Picker = Platform.OS === "ios" ? PickerIos : PickerAndroid;
let PickerItem = Picker.Item;

import { strings } from "../../config/i18n";

class PersonalMotoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moto_owning_answer: 0, // 0 || 1 || 2
      moto_id: null,
      moto_year: strings("choose"), // -> number
      moto_engine_answer: 0, // 0 || 1 || 2
      moto_cc_answer: "", // 0 || 1 || 2 || 3
      moto_year_possibilities: ["-"],
      moto_engine_possibilities: ["2_stroke", "4_stroke"],
      moto_cc_possibilities: [
        "less_50cm3",
        "51_250cm3",
        "251_750cm3",
        "more_751cm3",
        "more_51cm3"
      ],
      modal_visible: false
    };
  }

  static navigationOptions = {
    header: null
  };

  componentWillMount() {
    this.props.dispatch(getMobilityMotoValues());
  }

  componentWillReceiveProps(props) {
    if (
      this.props.registerState.get_mobility_moto_values !=
      props.registerState.get_mobility_moto_values
    ) {
      let moto_year_possibilities = [];

      props.registerState.get_mobility_moto_values.forEach((item, index) => {
        if (item.year != null)
          if (moto_year_possibilities.length > 0) {
            if (!moto_year_possibilities.includes(item.year))
              moto_year_possibilities.push(item.year);
          } else {
            moto_year_possibilities.push(item.year);
          }
      });

      this.setState({ moto_year_possibilities });

      if (
        props.registerState.get_mobility_moto_values.length > 0 &&
        (props.loginState.infoProfile.moto != {} &&
          props.loginState.infoProfile.moto != null)
      ) {
        try {
          this.setState(
            {
              moto_owning_answer:
                props.loginState.infoProfile.moto_owning_answer,
              moto_cc_answer: props.loginState.infoProfile.moto.type,
              moto_year: props.loginState.infoProfile.moto.year,
              moto_engine_answer: props.loginState.infoProfile.moto.engine
            },
            () => {}
          );
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  handleMotoOwningAnswer = val => {
    if (val != 0) {
      this.setState({
        moto_owning_answer: val
      });
    } else {
      this.setState({
        moto_owning_answer: val,
        moto_year: strings("choose"),
        moto_engine_answer: "",
        moto_cc_answer: 0
      });
      this.props.dispatch(
        UpdateProfile({
          data: {
            public_profile: { moto: null, moto_owning_answer: 0 }
          }
        })
      );
      this.props.dispatch(setMotoProperties(null));
      this.props.navigation.goBack(null);
    }
  };

  handleMotoYearChange = val => {
    if (val == "2013-2019") val = "2007-2019"; // errore boella ?

    this.setState({
      moto_year: val
    });

    const filtered_moto_m_v = this.props.registerState.get_mobility_moto_values.filter(
      e => {
        return e.year == val;
      }
    );

    let moto_engine_possibilities = [];

    filtered_moto_m_v.forEach((item, index) => {
      if (item.engine != null)
        if (moto_engine_possibilities.length > 0) {
          if (!moto_engine_possibilities.includes(item.engine))
            moto_engine_possibilities.push(item.engine);
        } else {
          moto_engine_possibilities.push(item.engine);
        }
    });

    this.setState({
      moto_engine_possibilities: moto_engine_possibilities.sort()
    });
  };

  handleMotoStrokesChange = val => {
    if (this.state.moto_year != "choose") {
      this.setState({
        moto_engine_answer: val
      });

      const filtered_moto_m_v = this.props.registerState.get_mobility_moto_values.filter(
        e => {
          return e.year == this.state.moto_year && e.engine == val;
        }
      );

      let moto_cc_possibilities = [];

      filtered_moto_m_v.forEach((item, index) => {
        if (moto_cc_possibilities.length > 0) {
          if (!moto_cc_possibilities.includes(item.type))
            moto_cc_possibilities.push(item.type);
        } else {
          moto_cc_possibilities.push(item.type);
        }
      });

      console.log(moto_cc_possibilities);

      this.setState({ moto_cc_possibilities }, () => {
        this.props.dispatch(updateState({ moto: null }));
      });
    }
  };

  renderMotoEngine() {
    return this.state.moto_engine_possibilities.map((element, index) => {
      return (
        <View key={index} style={styles.answerBoxes}>
          <TouchableWithoutFeedback
            onPress={() => this.handleMotoStrokesChange(element)}
          >
            <View style={styles.checkboxesContainer}>
              <View
                style={[
                  styles.checkboxes,
                  {
                    // backgroundColor: this.props.checkboxColor
                  }
                ]}
              >
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 0.0, y: 1 }}
                  locations={[0, 1.0]}
                  colors={["#E82F73", "#F49658"]}
                  style={[
                    styles.checkboxesGradient,
                    {
                      opacity: this.state.moto_engine_answer == element ? 1 : 0
                    }
                  ]}
                />
              </View>
              <Text style={styles.checkboxesText}>
                {element.replace(/_/g, "-")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    });
  }

  renderMotoOwningCheckbox(index, label) {
    return (
      <View style={styles.answerBoxes}>
        <TouchableWithoutFeedback
          onPress={() => this.handleMotoOwningAnswer(index)}
        >
          <View style={styles.checkboxesContainer}>
            <View style={[styles.checkboxes]}>
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1 }}
                locations={[0, 1.0]}
                colors={["#E82F73", "#F49658"]}
                style={[
                  styles.checkboxesGradient,
                  {
                    opacity: this.state.moto_owning_answer == index ? 1 : 0
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

  renderMotoOwning() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center"
        }}
      >
        {this.renderMotoOwningCheckbox(0, strings("no"))}
        {this.renderMotoOwningCheckbox(1, strings("yes"))}
        {this.renderMotoOwningCheckbox(2, strings("yes__it_is_at_m"))}
      </View>
    );
  }

  renderButtonsModal() {
    return (
      <View style={styles.buttonsContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ modal_visible: false });
          }}
        >
          <View style={styles.buttonModalContainer}>
            <Text style={styles.textButton}>
              {strings("undo").toLocaleUpperCase()}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ modal_visible: false }, () => {});
          }}
        >
          <View style={styles.buttonModalContainer}>
            <Text style={styles.textButton}>
              {strings("ok").toLocaleUpperCase()}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderModal() {
    const values = this.state.moto_year_possibilities.map((element, index) => (
      <PickerItem
        key={index}
        label={
          "" +
          element
            .replace("2007-2019", "2007-2012")
            .replace("2013-2019", strings("from_2013_onwar"))
            .replace(/_/g, " ")
        }
        value={"" + element}
      />
    ));
    return (
      <Modal
        isVisible={this.state.modal_visible}
        onBackdropPress={() => this.setState({ modal_visible: false })}
        onBackButtonPress={() => this.setState({ modal_visible: false })}
      >
        <View
          style={{
            height: 250,
            backgroundColor: "white",
            borderRadius: 4,
            borderColor: "rgba(0, 0, 0, 0.1)",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Picker
            style={{
              width: 250,
              height: 250
            }}
            selectedValue={"" + this.state.moto_year}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({ modal_visible: false }, () => {
                this.handleMotoYearChange(itemValue);
              });
            }}
          >
            {values}
          </Picker>
          {/* {this.renderButtonsModal()} */}
        </View>
      </Modal>
    );
  }

  renderMotoYear() {
    return (
      <View>
        {this.renderModal()}
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({
              modal_visible: true,
              moto_year: this.state.moto_year_possibilities[0]
            });
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 4,
              width: 180,
              height: 80,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10
            }}
          >
            <Text>
              {this.state.moto_year
                ? this.state.moto_year
                    .replace("2007-2019", "2007-2012")
                    .replace("2013-2019", "from 2013")
                    .replace(/_/g, " ")
                : strings("choose")}
              &nbsp;
            </Text>
            <Icon
              name="ios-arrow-down"
              size={18}
              color="#3d3d3d"
              // style={{ alignSelf: "center", marginRight: 17 }}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    let shadowOpt;
    if (Platform.OS == "ios") {
      shadowOpt = {
        width: Dimensions.get("window").width * 0.2,
        height: 40,
        color: "#111",
        border: 4,
        radius: 5,
        opacity: 0.25,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: 0
        }
      };
      if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
        shadowOpt = {
          width: Dimensions.get("window").width * 0.2,
          height: 28,
          color: "#111",
          border: 4,
          radius: 5,
          opacity: 0.25,
          x: 0,
          y: 1,
          style: {
            position: "absolute",
            top: 0
          }
        };
      }
    } else
      shadowOpt = {
        width: Dimensions.get("window").width * 0.2,
        height: 40,
        color: "#444",
        border: 6,
        radius: 5,
        opacity: 0.35,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: 0
        }
      };
    return (
      <ImageBackground
        source={require("./../../assets/images/purple_bg.png")}
        style={styles.backgroundImage}
      >
        <View
          style={{
            height:
              Platform.OS == "ios"
                ? Dimensions.get("window").height * 0.2
                : Dimensions.get("window").height * 0.16,
            backgroundColor: "transparent"
          }}
        >
          <WavyArea
            data={negativeData}
            color={"#fff"}
            style={styles.topOverlayWave}
          />
          <View style={styles.textHeaderContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.navigation.goBack(null);
              }}
            >
              <View style={{ width: 30, height: 30 }}>
                <Icon
                  name="ios-arrow-back"
                  style={{ marginTop: 4 }}
                  size={18}
                  color="#3d3d3d"
                />
              </View>
            </TouchableWithoutFeedback>
            <Text style={styles.textHeader}>
              Do you have a moto? <Emoji name="racing_motorcycle" />{" "}
              <Emoji name="racing_motorcycle" />
            </Text>
          </View>
        </View>
        <View
          style={{
            height: Dimensions.get("window").height * 0.6,
            backgroundColor: "transparent",
            justifyContent: "space-around"
          }}
        >
          <View
            style={{
              height: Dimensions.get("window").height * 0.15
            }}
          >
            {this.renderMotoOwning()}
          </View>
          <View
            style={{
              height: Dimensions.get("window").height * 0.2,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={styles.textSection}>Year:</Text>
            {this.renderMotoYear()}
          </View>
          <View
            style={{
              height: Dimensions.get("window").height * 0.2,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                height: Dimensions.get("window").height * 0.05,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={styles.textSection}>Engine:</Text>
            </View>
            <View
              style={{
                height: Dimensions.get("window").height * 0.15,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {this.renderMotoEngine()}
            </View>
          </View>
        </View>
        <View
          style={{
            height: Dimensions.get("window").height * 0.2,
            backgroundColor: "transparent"
          }}
        >
          {/* <WavyArea
            data={positiveData}
            color={"#fff"}
            style={styles.topOverlayWave}
          /> */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              top: 60
            }}
          >
            <View style={styles.textFooterContainer}>
              <Text style={styles.textFooter}>
                We need this information to estimate your CO2 emissions.
              </Text>
            </View>

            <View style={[styles.buttonContainer]}>
              {/* <BoxShadow setting={shadowOpt} /> */}
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.dispatch(
                    setMotoProperties({
                      moto_owning_answer: this.state.moto_owning_answer,
                      moto_year: this.state.moto_year,
                      moto_engine_answer: this.state.moto_engine_answer,
                      moto_cc_possibilities: this.state.moto_cc_possibilities
                    })
                  );

                  if (
                    this.state.moto_owning_answer != 0 &&
                    this.state.moto_engine_answer != 0 &&
                    this.state.moto_year != "choose"
                  )
                    this.props.navigation.navigate("PersonalMotoCcScreen");
                  else {
                  }
                }}
                disabled={this.props.status === "In register" ? true : false}
              >
                <View style={[styles.buttonBox]}>
                  {this.props.status !== "In register" ? (
                    <Text style={styles.buttonGoOnText}>
                      {this.props.text ? this.props.text : strings("go_on")}
                    </Text>
                  ) : (
                    <ActivityIndicator size="small" color="#6497CC" />
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  topOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    top: Platform.OS == "ios" ? 0 : -30
  },
  bottomOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    top: Dimensions.get("window").height * 0.8
  },
  textHeaderContainer: {
    marginTop: Platform.OS == "ios" ? 30 : 15,
    marginLeft: 20,
    flexDirection: "row",
    width: Dimensions.get("window").width * 0.85
  },
  textHeader: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3d3d3d",
    fontSize: 15,
    fontWeight: "bold"
  },
  textFooterContainer: {
    padding: 5,
    width: Dimensions.get("window").width * 0.7,
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    marginBottom: Platform.OS == "ios" ? 20 : 30
  },
  textFooter: {
    fontFamily: "OpenSans-Regular",
    color: "#fff",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "left"
  },
  buttonContainer: {
    width: Dimensions.get("window").width * 0.2,
    height: 60,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center"
  },
  buttonBox: {
    width: Dimensions.get("window").width * 0.2,
    height: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1
  },
  buttonGoOnText: {
    color: "#3363AD",
    fontFamily: "OpenSans-Regular",
    fontSize: 14
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
    flexDirection: "column",
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
    color: "#fff",
    fontSize: 11,
    marginLeft: 6
  },
  checkboxesContainer: {
    height: 80,
    width: Dimensions.get("window").width * 0.2,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center"
  },
  buttonsContainer: {
    // height: 50,
    width: 280,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: Platform.OS == "ios" ? 0 : 10
  },
  buttonModalContainer: {
    width: Dimensions.get("window").width * 0.2,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  textButton: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 12,
    color: "#51AEC9"
  },
  textSection: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#fff",
    fontSize: 16,
    fontWeight: "400"
  }
});

export const positiveData = [
  {
    value: 60
  },
  {
    value: 40
  },
  {
    value: 50
  },
  {
    value: 40
  },
  {
    value: 50
  }
];

export const negativeData = [
  {
    value: -60
  },
  {
    value: -40
  },
  {
    value: -50
  },
  {
    value: -40
  },
  {
    value: -50
  }
];

const withData = connect(state => {
  return {
    registerState: state.register,
    loginState: state.login
  };
});

export default withData(PersonalMotoScreen);
