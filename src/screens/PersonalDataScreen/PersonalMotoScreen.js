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
  Alert,
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
  updateProfileNew,
  setMotoProperties
} from "./../../domains/login/ActionCreators";
import PickerAndroid from "./../../components/PickerAndroid/PickerAndroid";
import Modal from "react-native-modal";
import Emoji from "@ardentlabs/react-native-emoji";
import Icon from "react-native-vector-icons/Ionicons";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";
let Picker = Platform.OS === "ios" ? PickerIos : PickerAndroid;
let PickerItem = Picker.Item;
import { strings } from "../../config/i18n";

class MotoSegmentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      motorbike_user: 0, // 0 || 1 || 2
      moto_id: null,
      moto_year: strings("id_0_67"), // -> number
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

      try {
        let moto = props.registerState.get_mobility_moto_values.filter(moto => {
          return moto.id == props.loginState.infoProfile.motorbike_typology;
        })[0];
        this.setState({
          motorbike_user: props.loginState.infoProfile.motorbike_user,
          moto_engine_answer: moto.engine
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  handleMotoOwningAnswer = val => {
    if (val != 0) {
      this.setState({
        motorbike_user: val
      });
    } else {
      this.setState(
        {
          motorbike_user: val,
          moto_year: strings("choose"),
          moto_engine_answer: "",
          moto_cc_answer: 0
        },
        () => {
          this.props.dispatch(
            updateProfileNew({
              motorbike_user: 0,
              moto_typology: null
            })
          );
        }
      );
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
    this.setState({
      moto_engine_answer: val
    });

    this.props.dispatch(updateState({ moto_engine: val }));
  };

  renderTarget = val => {
    if (this.state.moto_engine_answer === val) {
      return (
        <View>
          <View
            style={{
              width: 10,
              height: 10,
              position: "absolute",
              top: 0,
              left: -35,
              borderLeftColor: "#fff",
              borderTopColor: "#fff",
              borderLeftWidth: 1,
              borderTopWidth: 1
            }}
          />
          <View
            style={{
              width: 10,
              height: 10,
              position: "absolute",
              top: 0,
              right: -30,
              borderRightColor: "#fff",
              borderTopColor: "#fff",
              borderRightWidth: 1,
              borderTopWidth: 1
            }}
          />
          <View
            style={{
              width: 10,
              height: 10,
              position: "absolute",
              top: 70,
              left: -35,
              borderLeftColor: "#fff",
              borderBottomColor: "#fff",
              borderLeftWidth: 1,
              borderBottomWidth: 1
            }}
          />
          <View
            style={{
              width: 10,
              height: 10,
              position: "absolute",
              top: 70,
              right: -30,
              borderRightColor: "#fff",
              borderBottomColor: "#fff",
              borderRightWidth: 1,
              borderBottomWidth: 1
            }}
          />
        </View>
      );
    }
  };

  renderMotoEngine() {
    return this.state.moto_engine_possibilities.map((element, index) => {
      console.log(element);
      return (
        <View key={index} style={styles.answerBoxes}>
          <TouchableWithoutFeedback
            onPress={() => {
              if (this.state.motorbike_user != 0)
                this.handleMotoStrokesChange(element);
            }}
          >
            <View style={styles.checkboxesContainer}>
              {/* 
              <View
                style={[
                  styles.checkboxes,
                  {
                    // backgroundColor: this.props.checkboxColor
                    backgroundColor:
                      this.state.motorbike_user != 0
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
              */}
              {this.renderTarget(element)}
              <OwnIcon
                name={"onboarding-stroke_icn"}
                size={70}
                color={this.state.motorbike_user != 0 ? "#fff" : "#3d3d3d50"}
                style={{ marginVertical: 7 }}
                // color={
                //   this.state.car_fuel_possibilities.includes(val)
                //     ? "#fff"
                //     : "#3d3d3d50"
                // }
              />
              <View style={{ height: 25 }} />
              <View
                style={{ justifyContent: "center", alignContent: "center" }}
              >
                {element == "2_stroke" ? (
                  <Text style={styles.checkboxesText}>
                    {strings("id_0_85")}
                  </Text>
                ) : (
                  <Text style={styles.checkboxesText}>
                    {strings("id_0_86")}
                  </Text>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    });
  }

  renderMotoOwningCheckbox(index, label) {
    return (
      <View style={styles.answerBoxesYesorNo}>
        <TouchableWithoutFeedback
          onPress={() => this.handleMotoOwningAnswer(index)}
        >
          <View style={styles.checkboxesContainerYesOrNo}>
            <View style={[styles.checkboxes]}>
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1 }}
                locations={[0, 1.0]}
                colors={["#7D4D99", "#6497CC"]}
                style={[
                  styles.checkboxesGradient,
                  {
                    opacity: this.state.motorbike_user == index ? 1 : 0
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
            this.setState({ modal_visible: false }, () => {});
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
            if (this.state.motorbike_user != 0)
              this.setState({
                modal_visible: true,
                moto_year: this.state.moto_year_possibilities[0]
              });
          }}
        >
          <View
            style={{
              backgroundColor:
                this.state.motorbike_user != 0 ? "#fff" : "#ffffff60",
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
                .replace("2013-2019", "from 2013")
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
          <View>{this.renderMotoOwning()}</View>
          {/* 
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
          */}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={[
                  styles.textSection,
                  {
                    color: this.state.motorbike_user != 0 ? "#fff" : "#3d3d3d50"
                  }
                ]}
              >
                {strings("id_0_84")}
              </Text>
            </View>
            <View
              style={{
                height: 10,
                justifyContent: "center",
                alignItems: "center"
              }}
            />
            <View
              style={{
                height: 150,
                width: Dimensions.get("window").width * 0.9,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center"
              }}
            >
              {this.renderMotoEngine()}
            </View>
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
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.dispatch(
                    updateState({
                      moto_engine_answer: this.state.moto_engine_answer
                    })
                  );
                  if (this.state.motorbike_user != 0)
                    if (this.state.moto_engine_answer != 0) {
                      this.props.dispatch(
                        setMotoProperties({
                          motorbike_user: this.state.motorbike_user,
                          moto_engine_answer: this.state.moto_engine_answer
                        })
                      );

                      this.props.dispatch(
                        updateProfileNew({
                          data: {
                            motorbike_user: this.state.motorbike_user
                          }
                        })
                      );

                      this.props.navigation.navigate("PersonalMotoCcScreen");
                    } else {
                      Alert.alert(strings("id_0_10"), strings("id_0_65"));
                    }
                  else this.props.navigation.navigate("PersonalMotoCcScreen");
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
  answerBoxesYesorNo: {
    height: 80,
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  answerBoxes: {
    height: 150,

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
  checkboxesContainerYesOrNo: {
    height: 90,
    width: Dimensions.get("window").width * 0.2,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  checkboxesContainer: {
    height: 150,
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
    registerState: state.register,
    loginState: state.login
  };
});

export default withData(MotoSegmentScreen);
