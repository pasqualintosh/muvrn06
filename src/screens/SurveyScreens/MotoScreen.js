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
import PickerAndroid from "./../../components/PickerAndroid/PickerAndroid";
import Modal from "react-native-modal";
import Emoji from "@ardentlabs/react-native-emoji";
import Icon from "react-native-vector-icons/Ionicons";

let Picker = Platform.OS === "ios" ? PickerIos : PickerAndroid;
let PickerItem = Picker.Item;

import { strings } from "../../config/i18n";

class MotoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moto_owning_answer: 0, // 0 || 1 || 2
      moto_id: null,
      temp_moto_year: strings("id_0_67"), // -> number
      moto_year: strings("id_0_67"), // -> number
      moto_engine_answer: 0, // 0 || 1 || 2
      moto_cc_answer: "", // 0 || 1 || 2 || 3
      moto_year_possibilities: ["-"],
      moto_engine_possibilities: ["2_stroke", "4_stroke"],
      moto_cc_possibilities: [
        "less_50cm3",
        "more_51cm3",
        "51_250cm3",
        "251_750cm3",
        "more_751cm3"
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
      let moto_cc_possibilities = [];
      let moto_possibilities = [];

      moto_possibilities = props.registerState.get_mobility_moto_values.filter(
        element => {
          return element.engine == props.registerState.moto_engine_answer;
        }
      );

      moto_possibilities.forEach((item, index) => {
        if (item.type != null)
          if (moto_cc_possibilities.length > 0) {
            if (!moto_cc_possibilities.includes(item.type))
              moto_cc_possibilities.push(item.type);
          } else {
            moto_cc_possibilities.push(item.type);
          }
      });

      console.log(moto_possibilities);
      console.log(moto_cc_possibilities);

      this.setState({ moto_cc_possibilities });
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
        moto_year: strings("id_0_67"),
        moto_engine_answer: "",
        moto_cc_answer: 0
      });
    }
  };

  handleMotoYearChange = val => {
    // if (val == "2013-2019") val = "2007-2019"; // errore boella ?

    this.setState({
      moto_year: val
    });

    const filtered_moto_m_v = this.props.registerState.get_mobility_moto_values.filter(
      e => {
        return (
          e.year == val &&
          e.engine == this.props.registerState.moto_engine_answer &&
          e.type == this.state.moto_cc_answer
        );
      }
    );

    console.log(filtered_moto_m_v);

    if (filtered_moto_m_v.length > 0)
      this.props.dispatch(
        updateState({
          moto: filtered_moto_m_v[0].id
        })
      );
    else
      this.props.dispatch(
        updateState({
          moto: null
        })
      );

    // let moto_engine_possibilities = [];

    // filtered_moto_m_v.forEach((item, index) => {
    //   if (item.engine != null)
    //     if (moto_engine_possibilities.length > 0) {
    //       if (!moto_engine_possibilities.includes(item.engine))
    //         moto_engine_possibilities.push(item.engine);
    //     } else {
    //       moto_engine_possibilities.push(item.engine);
    //     }
    // });

    // this.setState({
    //   moto_engine_possibilities: moto_engine_possibilities.sort()
    // });
  };

  handleMotoStrokesChange = val => {
    if (this.state.moto_year != strings("id_0_67")) {
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

  handleMotoCcChange = val => {
    const filtered_moto_m_v = this.props.registerState.get_mobility_moto_values.filter(
      e => {
        return (
          e.type == val &&
          e.engine == this.props.registerState.moto_engine_answer
        );
      }
    );

    let moto_year_possibilities = [];

    filtered_moto_m_v.forEach((item, index) => {
      if (moto_year_possibilities.length > 0) {
        if (!moto_year_possibilities.includes(item.year))
          moto_year_possibilities.push(item.year);
      } else {
        moto_year_possibilities.push(item.year);
      }
    });

    console.log(moto_year_possibilities);
    console.log(filtered_moto_m_v);

    this.setState({ moto_year_possibilities, moto_cc_answer: val });
  };

  renderMotoEngine() {
    return this.state.moto_engine_possibilities.map((element, index) => {
      return (
        <View key={index} style={styles.answerBoxes}>
          <TouchableWithoutFeedback
            onPress={() => {
              if (this.state.moto_owning_answer != 0)
                this.handleMotoStrokesChange(element);
            }}
          >
            <View style={styles.checkboxesContainer}>
              <View
                style={[
                  styles.checkboxes,
                  {
                    // backgroundColor: this.props.checkboxColor
                    backgroundColor:
                      this.state.moto_owning_answer != 0
                        ? "#F7F8F9"
                        : "#ffffff60"
                  }
                ]}
              >
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 0.0, y: 1 }}
                  locations={[0, 1.0]}
                  colors={["#7D4D99", "#6497CC"]}
                  style={[
                    styles.checkboxesGradient,
                    {
                      opacity: this.state.moto_engine_answer == element ? 1 : 0
                    }
                  ]}
                />
              </View>
              <View style={{ height: 25 }} />
              <View
                style={{ justifyContent: "center", alignContent: "center" }}
              >
                <Text style={styles.checkboxesText}>
                  {element.replace(/_/g, "-")}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    });
  }

  renderMotoCc() {
    return this.state.moto_cc_possibilities.map((element, index) => {
      return (
        <View key={index} style={styles.answerBoxes}>
          <TouchableWithoutFeedback
            onPress={() => {
              // console.log(element);
              this.handleMotoCcChange(element);
            }}
          >
            <View style={styles.checkboxesContainer}>
              <View
                style={[
                  styles.checkboxes,
                  {
                    // backgroundColor: this.props.checkboxColor
                    backgroundColor: "#F7F8F9"
                  }
                ]}
              >
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 0.0, y: 1 }}
                  locations={[0, 1.0]}
                  colors={["#7D4D99", "#6497CC"]}
                  style={[
                    styles.checkboxesGradient,
                    {
                      opacity: this.state.moto_cc_answer == element ? 1 : 0
                    }
                  ]}
                />
              </View>
              <View style={{ height: 25 }} />
              <View
                style={{ justifyContent: "center", alignContent: "center" }}
              >
                <Text style={styles.checkboxesText}>
                  {element.replace("more_", " ≥ ").replace("less_", " ≤ ") ==
                  "≥751cm3".replace(/_/g, "-")
                    ? "≥ 751 cm3"
                    : element
                        .replace("more_", "≥ ")
                        .replace("less_", "≤ ")
                        .replace(/_/g, "-")}
                </Text>
              </View>
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
                colors={["#7D4D99", "#6497CC"]}
                style={[
                  styles.checkboxesGradient,
                  {
                    opacity: this.state.moto_owning_answer == index ? 1 : 0
                  }
                ]}
              />
            </View>
            <View style={{ height: 25 }} />
            <View style={{ justifyContent: "center", alignContent: "center" }}>
              <Text style={styles.checkboxesText}>{label}</Text>
            </View>
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
        {this.renderMotoOwningCheckbox(0, strings("id_0_54"))}
        {this.renderMotoOwningCheckbox(1, strings("id_0_55"))}
        {this.renderMotoOwningCheckbox(2, strings("id_0_56"))}
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
              {strings("id_0_68").toLocaleUpperCase()}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            this.handleMotoYearChange(this.state.temp_moto_year);
            this.setState(
              { modal_visible: false, moto_year: this.state.temp_moto_year },
              () => {}
            );
          }}
        >
          <View style={styles.buttonModalContainer}>
            <Text style={styles.textButton}>
              {strings("id_0_67").toLocaleUpperCase()}
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
            .replace("2013-2019", strings("id_0_96"))
            .replace("up_to_1999", strings("id_0_92"))
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
            height: 400,
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
            selectedValue={"" + this.state.temp_moto_year}
            onValueChange={(itemValue, itemIndex) => {
              // this.setState({ modal_visible: false }, () => {
              // this.handleMotoYearChange(itemValue);
              this.setState({ temp_moto_year: itemValue });
              // });
            }}
          >
            {values}
          </Picker>
          {this.renderButtonsModal()}
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
            if (
              this.state.moto_year_possibilities.length > 0 &&
              this.state.moto_cc_answer != ""
            )
              this.setState({
                modal_visible: true
                // moto_year: this.state.moto_year_possibilities[0]
              });
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              // backgroundColor:
              //   this.state.moto_owning_answer != 0 ? "#fff" : "#ffffff60",
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
                .replace("2007-2019", "2007-2012")
                .replace("2013-2019", strings("id_0_96"))
                .replace("up_to_1999", strings("id_0_92"))
                .replace(/_/g, " ")}
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
          top: 10
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
            top: 10
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
          top: 10
        }
      };
    return (
      <ImageBackground
        source={require("./../../assets/images/purple_bg.png")}
        style={styles.backgroundImage}
      >
        <View
          style={{
            height: 100,
            backgroundColor: "transparent"
          }}
        >
          <ImageBackground
            source={require("../../assets/images/white_wave_onbording_top.png")}
            style={styles.backgroundImageWave}
          />
          <View
            style={{
              height: 100,
              backgroundColor: "transparent",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <View style={styles.textHeaderContainer}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.navigation.goBack(null);
                }}
              >
                <View style={{ width: 30, height: 30 }}>
                  <Icon
                    name="ios-arrow-back"
                    style={{ marginTop: Platform.OS == "ios" ? 4 : 2 }}
                    size={18}
                    color="#3d3d3d"
                  />
                </View>
              </TouchableWithoutFeedback>
              <Text style={styles.textHeader}>{strings("id_0_83")}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: Dimensions.get("window").height - 230,
            width: Dimensions.get("window").width * 0.9,
            alignSelf: "center",
            justifyContent: "space-around"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.9,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={styles.textSection}>{strings("id_0_78")}</Text>
          </View>
          <View
            style={{
              height: Dimensions.get("window").height * 0.15,
              width: Dimensions.get("window").width * 0.9,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center"
            }}
          >
            {/* {this.renderMotoOwning()} */}
            {/* <Text>moto cc ... </Text> */}
            {this.renderMotoCc()}
          </View>
          <View
            style={{
              height: Dimensions.get("window").height * 0.2,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={styles.textSection}>{strings("id_0_66")}</Text>
            {this.renderMotoYear()}
          </View>
        </View>
        <View
          style={{
            height: 130,
            backgroundColor: "transparent",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center"
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
              alignItems: "center"
            }}
          >
            <View style={styles.textFooterContainer}>
              <Text style={styles.textFooter}>{strings("id_0_64")}</Text>
            </View>

            <View style={[styles.buttonContainer]}>
              {/* <BoxShadow setting={shadowOpt} /> */}
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.dispatch(
                    updateState({
                      moto_owning_answer: this.state.moto_owning_answer,
                      moto_engine_answer: this.state.moto_engine_answer,
                      moto_year: this.state.moto_year
                    })
                  );
                  if (
                    this.state.moto_owning_answer != 0 &&
                    this.state.moto_engine_answer != ""
                  ) {
                    // this.props.navigation.navigate("SurveyMotoCc");
                  } else this.props.navigation.navigate("GDPRScreen");
                }}
                disabled={this.props.status === "In register" ? true : false}
              >
                <View style={[styles.buttonBox]}>
                  {this.props.status !== "In register" ? (
                    <Text style={styles.buttonGoOnText}>
                      {this.props.text ? this.props.text : strings("id_0_15")}
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
  backgroundImageWave: {
    height: 100,
    width: Dimensions.get("window").width,
    position: "absolute"
    // top: Dimensions.get("window").height * 0.04 + 14
  },
  textHeaderContainer: {
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
    width: Dimensions.get("window").width * 0.6,
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center"
  },
  textFooter: {
    fontFamily: "OpenSans-Regular",
    color: "#fff",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "left"
  },
  buttonContainer: {
    width: Dimensions.get("window").width * 0.3,
    height: 60,
    backgroundColor: "transparent",
    justifyContent: "center",
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

    textAlign: "center"
  },
  checkboxesContainer: {
    height: 90,
    width: Dimensions.get("window").width * 0.2,
    flexDirection: "column",
    justifyContent: "flex-start",
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
    fontWeight: "bold"
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
    registerState: state.register
  };
});

export default withData(MotoScreen);
