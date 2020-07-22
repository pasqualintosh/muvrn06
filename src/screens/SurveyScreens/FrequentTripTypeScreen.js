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
  Image,
  Picker as PickerIos
} from "react-native";
import WavyArea from "./../../components/WavyArea/WavyArea";
import LinearGradient from "react-native-linear-gradient";
import { BoxShadow } from "react-native-shadow";
import { connect } from "react-redux";
import Modal from "react-native-modal";
import PickerAndroid from "./../../components/PickerAndroid/PickerAndroid";
import { updateState } from "./../../domains/register/ActionCreators";
import Icon from "react-native-vector-icons/Ionicons";
import Emoji from "@ardentlabs/react-native-emoji";

let Picker = Platform.OS === "ios" ? PickerIos : PickerAndroid;
let PickerItem = Picker.Item;

import { strings } from "../../config/i18n";

class FrequentTripTypeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      // Cinema/Theater
      type_possibilities: [
        {
          label: strings("home") + " - " + strings("mom_dad"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 6
          }
        },
        {
          label: strings("home") + " - " + strings("grandma_grandpa"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 7
          }
        },
        {
          label: strings("home") + " - " + strings("girlfriend_boyf"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 8
          }
        },
        {
          label: strings("home") + " - " + strings("kids__school"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 9
          }
        },
        {
          label: strings("home") + " - " + strings("supermarket"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 11
          }
        },
        {
          label: strings("home") + " - " + strings("gym"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 3
          }
        },
        {
          label: strings("work") + " - " + strings("gym"),
          to_save: {
            frequent_trip_type_start: 2,
            frequent_trip_type_end: 3
          }
        },

        {
          label: strings("home") + " - " + strings("work__2"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 5
          }
        },

        {
          label: strings("home") + " - " + strings("friend_s_place"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 10
          }
        },

        {
          label: strings("home") + " - " + strings("bar_restaurant"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 12
          }
        },
        {
          label: strings("home") + " - " + strings("cinema_theater"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 13
          }
        },
        {
          label: strings("home") + " - " + strings("other"),
          to_save: {
            frequent_trip_type_start: 1,
            frequent_trip_type_end: 0
          }
        }
      ],
      type_selected: 0,
      modal_visible: false,
      selected_index: 0
    };
  }

  static navigationOptions = {
    header: null
  };

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
            height: Dimensions.get("window").height * 0.475,
            justifyContent: "space-around",
            alignItems: "center"
          }}
        >
          <View
            style={{
              height: Dimensions.get("window").height * 0.1,
              width: Dimensions.get("window").width * 0.6
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ selected: true, selected_index: 1 });
                this.props.dispatch(
                  updateState({
                    frequent_trip_type_start: 1,
                    frequent_trip_type_end: 2
                  })
                );
              }}
            >
              <View
                style={[
                  styles.buttonTypeBox,
                  {
                    backgroundColor:
                      this.state.selected_index == 1 ? "#ffffff70" : "#fff"
                  }
                ]}
              >
                <Text style={styles.buttonTypeText}>
                  <Emoji name="house" /> {strings("home").toLocaleUpperCase()} -{" "}
                  {strings("work").toLocaleUpperCase()}
                  <Emoji name="office" />
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View
            style={{
              height: Dimensions.get("window").height * 0.1,
              width: Dimensions.get("window").width * 0.6
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ selected: true, selected_index: 2 });
                this.props.dispatch(
                  updateState({
                    frequent_trip_type_start: 1,
                    frequent_trip_type_end: 4
                  })
                );
              }}
            >
              <View
                style={[
                  styles.buttonTypeBox,
                  {
                    backgroundColor:
                      this.state.selected_index == 2 ? "#ffffff70" : "#fff"
                  }
                ]}
              >
                <Text style={styles.buttonTypeText}>
                  <Emoji name="house" /> {strings("home").toLocaleUpperCase()} -{" "}
                  {strings("school_universi").toLocaleUpperCase()}
                  <Emoji name="school" />
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View
            style={{
              height: Dimensions.get("window").height * 0.1,
              width: Dimensions.get("window").width * 0.6
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState(
                  { modal_visible: true, selected_index: 3, selected: true },
                  () => {
                    this.props.dispatch(
                      updateState({
                        frequent_trip_type_start: 1,
                        frequent_trip_type_end: 6
                      })
                    );
                  }
                );
              }}
            >
              <View
                style={[
                  styles.buttonTypeBox,
                  {
                    backgroundColor:
                      this.state.selected_index == 3 ? "#ffffff70" : "#fff"
                  }
                ]}
              >
                <Text style={styles.buttonTypeText}>
                  {this.state.type_possibilities[
                    this.state.type_selected
                  ].label.toLocaleUpperCase()}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
                <Icon name="md-arrow-forward" size={18} color="#3d3d3d" />
              </View>
            </TouchableWithoutFeedback>
          </View>
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
    const values = this.state.type_possibilities.map((element, index) => (
      <PickerItem
        key={index}
        label={"" + element.label.replace(/_/g, " ")}
        value={index}
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
            selectedValue={this.state.type_selected}
            onValueChange={(itemValue, itemIndex) => {
              this.setState(
                {
                  selected: true,
                  type_selected: itemValue,
                  modal_visible: false
                },
                () => {
                  this.props.dispatch(
                    updateState(
                      this.state.type_possibilities[itemValue].to_save
                    )
                  );
                }
              );
            }}
            itemStyle={{ fontSize: 16 }}
          >
            {values}
          </Picker>
          {/* {this.renderButtonsModal()} */}
        </View>
      </Modal>
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
              <Text style={styles.textHeader}>
                {strings("what_s_your_mos")}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: Dimensions.get("window").height - 230,
            backgroundColor: "transparent",
            justifyContent: "center"
          }}
        >
          {this.renderModal()}
          {this.renderBody()}
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
              <Text style={styles.textFooter}>
                {strings("this_informatio")}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              {/* <BoxShadow setting={shadowOpt} /> */}
              <TouchableWithoutFeedback
                onPress={() => {
                  if (this.state.selected)
                    this.props.navigation.navigate("SurveyFrequentTrip");
                  else
                    Alert.alert(strings("id_0_10"), strings("id_0_46"));
                }}
              >
                <View style={styles.buttonBox}>
                  <Text style={styles.buttonGoOnText}>{strings("id_0_15")}</Text>
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
  backgroundImageWave: {
    height: 100,
    width: Dimensions.get("window").width,
    position: "absolute"
    // top: Dimensions.get("window").height * 0.04 + 14
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
  buttonTypeBox: {
    height: Dimensions.get("window").height * 0.1,
    width: Dimensions.get("window").width * 0.6,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    flexDirection: "row"
  },
  buttonTypeText: {
    color: "#3D3D3D",
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    textAlign: "center"
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

export default withData(FrequentTripTypeScreen);
