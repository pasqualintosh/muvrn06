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
  Image,
  Picker as PickerIos,
  Alert
} from "react-native";
import WavyArea from "./../../components/WavyArea/WavyArea";
import LinearGradient from "react-native-linear-gradient";
import { BoxShadow } from "react-native-shadow";
import Modal from "react-native-modal";
import PickerAndroid from "./../../components/PickerAndroid/PickerAndroid";
import { connect } from "react-redux";
import { updateState } from "./../../domains/register/ActionCreators";
import Emoji from "@ardentlabs/react-native-emoji";
import Icon from "react-native-vector-icons/Ionicons";

let Picker = Platform.OS === "ios" ? PickerIos : PickerAndroid;
let PickerItem = Picker.Item;

import { strings } from "../../config/i18n";

class ChangeFrequentTripFromRecapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frequecy_values: [1, 2, 3, 4, 5, 6, 7],
      frequency_selected: 0,
      modal_visible: false,
      frequent_type: [
        "OTHER",
        "HOME",
        "WORK",
        "GYM",
        "SCHOOL",
        "WORK#2",
        "MOM/DAD",
        "GRANDMA/GRANDPA",
        "GIRLFRIEND/BOYFRIEND",
        "KIDS' SCHOOL",
        "FRIEND'S PLACE",
        "SUPERMARKET",
        "BAR/RESTAURANT",
        "CINEMA/THEATER"
      ],
      start_point: null,
      end_point: null,
      frequent_trip_type_start: null,
      frequent_trip_type_end: null
    };
  }

  static navigationOptions = {
    header: null
  };

  convertionModalType(value) {
    switch (value) {
      case this.state.frequent_type[0]:
        return 0;
        break;
      case this.state.frequent_type[1]:
        return 1;
        break;
      case this.state.frequent_type[2]:
        return 2;
        break;
      case this.state.frequent_type[3]:
        return 3;
        break;
      case this.state.frequent_type[4]:
        return 4;
        break;
      case this.state.frequent_type[5]:
        return 5;
        break;

      case this.state.frequent_type[6]:
        return 6;
        break;
      case this.state.frequent_type[7]:
        return 7;
        break;
      case this.state.frequent_type[8]:
        return 8;
        break;
      case this.state.frequent_type[9]:
        return 9;
        break;
      case this.state.frequent_type[10]:
        return 10;
        break;
      case this.state.frequent_type[11]:
        return 11;
        break;
      case this.state.frequent_type[12]:
        return 12;
        break;
      case this.state.frequent_type[13]:
        return 13;
        break;

      default:
        return 0;
    }
  }

  componentDidMount() {
    // console.log(this.props.navigation.state.params);
  }

  componentWillReceiveProps(props) {
    // if (this.props != props) {
    //   console.log(this.props.navigation.state.params.start_point);
    //   console.log(this.props.navigation.state.params.end_point);
    // }
  }

  renderBoxA() {
    let shadowOpt;
    if (Platform.OS == "ios") {
      shadowOpt = {
        width: Dimensions.get("window").width * 0.585,
        height: Dimensions.get("window").height * 0.09,
        color: "#111",
        border: 4,
        radius: 5,
        opacity: 0.25,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: Dimensions.get("window").height * 0.04,
          left: Dimensions.get("window").width * 0.28
        }
      };
    } else
      shadowOpt = {
        width: Dimensions.get("window").width * 0.585,
        height: Dimensions.get("window").height * 0.09,
        color: "#444",
        border: 6,
        radius: 5,
        opacity: 0.35,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: Dimensions.get("window").height * 0.04,
          left: Dimensions.get("window").width * 0.28
        }
      };
    return (
      <View style={styles.tripPointersContainer}>
        <View
          style={{
            flex: 0.2
          }}
        >
          <Text style={styles.tripLeftText}>
            {
              this.state.frequent_type[
                this.props.registerState.mostFrequentRaceFrequencyPosition
                  .start_type
              ]
            }
          </Text>
        </View>
        <BoxShadow setting={shadowOpt} />
        <TouchableWithoutFeedback>
          <View style={styles.tripPointContainer}>
            <Text style={styles.textTrip}>Selected</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderBoxB() {
    let shadowOpt;
    if (Platform.OS == "ios") {
      shadowOpt = {
        width: Dimensions.get("window").width * 0.585,
        height: Dimensions.get("window").height * 0.09,
        color: "#111",
        border: 4,
        radius: 5,
        opacity: 0.25,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: Dimensions.get("window").height * 0.04,
          left: Dimensions.get("window").width * 0.28
        }
      };
    } else
      shadowOpt = {
        width: Dimensions.get("window").width * 0.585,
        height: Dimensions.get("window").height * 0.09,
        color: "#444",
        border: 6,
        radius: 5,
        opacity: 0.35,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: Dimensions.get("window").height * 0.04,
          left: Dimensions.get("window").width * 0.28
        }
      };
    return (
      <View style={styles.tripPointersContainer}>
        <View
          style={{
            flex: 0.2
          }}
        >
          <Text style={styles.tripLeftText}>
            {
              this.state.frequent_type[
                this.props.registerState.mostFrequentRaceFrequencyPosition
                  .end_type
              ]
            }
          </Text>
        </View>
        <BoxShadow setting={shadowOpt} />
        <TouchableWithoutFeedback>
          <View style={styles.tripPointContainer}>
            <Text style={styles.textTrip}>Selected</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderFrequencyBox() {
    return (
      <View
        style={{
          height:
            Platform.OS == "ios"
              ? Dimensions.get("window").height * 0.125
              : Dimensions.get("window").height * 0.1,
          width: Dimensions.get("window").width * 0.85,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        {this.renderModal()}

        <View style={{ flex: 0.6 }}>
          <Text style={styles.textFrequency}>{strings("how_many_days_a")}</Text>
        </View>

        <View style={{ flex: 0.2 }}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({ modal_visible: true });
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 4,
                height: Dimensions.get("window").height * 0.09,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                bottom: 4
              }}
            >
              <Text>{this.state.frequency_selected}</Text>
              <Icon
                name="ios-arrow-down"
                size={18}
                color="#3d3d3d"
                // style={{ alignSelf: "center", marginRight: 17 }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
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
              {strings("id_0_12").toLocaleUpperCase()}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderModal() {
    const values = this.state.frequecy_values.map((element, index) => (
      <PickerItem key={index} label={"" + element} value={"" + element} />
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
            selectedValue={"" + this.state.frequency_selected}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({
                frequency_selected: this.convertionModalType(itemValue),
                modal_visible: false
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

  renderBody() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.9,
          alignSelf: "center"
        }}
      >
        <View
          style={{
            height: Dimensions.get("window").height * 0.125
          }}
        >
          <Image
            source={require("../../assets/images/trip_a_b.png")}
            style={{
              height: Dimensions.get("window").height * 0.125,
              width: "auto"
            }}
          />
        </View>

        <View
          style={{
            height: Dimensions.get("window").height * 0.35
          }}
        >
          {this.renderBoxA()}
          {this.renderBoxB()}
        </View>

        <View
          style={{
            width: Dimensions.get("window").width * 0.9,
            height:
              Platform.OS == "ios"
                ? Dimensions.get("window").height * 0.125
                : Dimensions.get("window").height * 0.1,
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {this.renderFrequencyBox()}
        </View>
      </View>
    );
  }

  render() {
    // console.log(this.props.navigation.state.params.start_point);
    // console.log(this.props.navigation.state.params.end_point);

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
            <Text style={styles.textHeader}>{strings("insert_your_mos")}</Text>
          </View>
        </View>
        <View
          style={{
            height:
              Platform.OS == "ios"
                ? Dimensions.get("window").height * 0.6
                : Dimensions.get("window").height * 0.565,
            backgroundColor: "transparent"
          }}
        >
          {this.renderBody()}
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
              top: 50
            }}
          >
            <View style={styles.textFooterContainer}>
              <Text style={styles.textFooter}>
                {strings("please_enter_th")}
              </Text>
            </View>

            <View style={[styles.buttonContainer]}>
              {/* <BoxShadow setting={shadowOpt} /> */}
              <TouchableWithoutFeedback
                onPress={() => {
                  if (this.state.frequency_selected != 0) {
                    this.props.dispatch(
                      updateState({
                        mostFrequentRaceFrequency: this.state.frequency_selected
                      })
                    );
                    this.props.navigation.navigate(
                      "ChangeFrequentTripModalSplitScreen"
                    );
                  } else {
                    Alert.alert("Oops", strings("id_0_46"));
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
  tripPointContainer: {
    flex: 0.65,
    backgroundColor: "#ffffff70",
    height: Dimensions.get("window").height * 0.09,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center"
  },
  tripPointersContainer: {
    height: Dimensions.get("window").height * 0.175,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  textTrip: {
    fontFamily: "OpenSans-Regular",
    color: "#3d3d3d",
    fontSize: 12,
    fontWeight: "400",
    marginLeft: 6
  },
  tripLeftText: {
    color: "#fff",
    fontFamily: "Montserrat-ExtraBold",
    fontSize: 12
  },
  textFrequency: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#fff",
    fontSize: 12,
    fontWeight: "400"
  },
  textFrequencyValue: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3d3d3d",
    fontSize: 12,
    fontWeight: "400"
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

export default withData(ChangeFrequentTripFromRecapScreen);
