/**
 * PickerModalContent
 * picker per la selezione di una lista di parametri
 * value, valore corrente selezionato,
 * extraValue, eventuale testo aggiuntivo da mettere nel pulsante con value
 * type, quale tipo di valore si sta passando
 * changeState, funzione passata dal padre per cambiare lo stato del padre
 * listValue, lista dei possibili valori
 * function, funzione che viene applicato al valore salvato prima di essere mandato al db per essere coerente
 * placeholder
 * @author push
 */

import React from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
  Dimensions,
  StyleSheet,
  Picker as PickerIos,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Image
} from "react-native";

import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { BoxShadow } from "react-native-shadow";
import PickerAndroid from "./../../components/PickerAndroid/PickerAndroid";

let Picker = Platform.OS === "ios" ? PickerIos : PickerAndroid;
let PickerItem = Picker.Item;

import { strings } from "../../config/i18n";

class PickerModalContent extends React.Component {
  constructor() {
    super();
    this.state = {
      isModalVisible: false
    };
  }

  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  /* 
  _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  ); 
  */

  componentDidMount() {
    this.setState({
      valueStart: this.props.value
    });
  }

  _renderButton = (text, onPress) => {
    let shadowOpt;
    if (Platform.OS == "ios")
      shadowOpt = {
        width: Dimensions.get("window").width / 1.5,
        height: Dimensions.get("window").height / 20,
        color: "#000",
        border: 4,
        radius: 5,
        opacity: 0.25,
        x: 0,
        y: 1
      };
    else
      shadowOpt = {
        width: Dimensions.get("window").width / 1.5,
        height: Dimensions.get("window").height / 20,
        color: "#444",
        border: 4,
        radius: 5,
        opacity: 0.35,
        x: 0,
        y: 1
      };

    return (
      <View style={styles.buttonConfermWhite}>
        <BoxShadow setting={shadowOpt}>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.0, y: 0.0 }}
            locations={[0, 1.0]}
            colors={["#e82f73", "#f49658"]}
            style={styles.buttonConfermClick}
          >
            <TouchableHighlight
              onPress={onPress}
              style={{
                width: Dimensions.get("window").width / 1.5,
                height: Dimensions.get("window").height / 20,
                borderRadius: 5,
                alignItems: "center"
              }}
            >
              <View
                style={{
                  height: Dimensions.get("window").height / 20,
                  alignItems: "center",
                  justifyContent: "center",
                  alignContent: "center",
                  flexDirection: "row"
                }}
              >
                <Text style={{ color: "#FFFFFF" }}> {text} </Text>
              </View>
            </TouchableHighlight>
          </LinearGradient>
        </BoxShadow>
      </View>
    );
  };

  // il picker funziona in modo differente su android e ios
  // su ios faccio spuntate un popup
  // mentre su android lo fa in automatico
  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <Picker
        selectedValue={this.props.value}
        onValueChange={(itemValue, itemIndex) => {
          // this.setState({ isModalVisible: false });
          this.props.changeState(
            itemValue,
            this.props.type,
            this.props.function
          );
        }}
      >
        {this.props.listValue.map((elem, index) => (
          <Picker.Item
            key={index}
            label={elem + " " + this.props.extraValue}
            value={elem}
          />
        ))}
      </Picker>

      {this._renderButton("Confirm", () => {
        this.setState({ isModalVisible: false });
        this.props.changeState(
          this.props.value === "to fill"
            ? this.props.listValue[0]
            : this.props.value,
          this.props.type,
          this.props.function
        );
      })}
    </View>
  );

  renderButtonsModal() {
    return (
      <View style={styles.buttonsContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ isModalVisible: false }, () => {});
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
            this.setState({ isModalVisible: false }, () => {});
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

  _renderModalContentAndroid = () => {
    const values = this.props.listValue.map((element, index) => (
      <PickerItem key={index} label={"" + element} value={"" + element} />
    ));
    return (
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
          selectedValue={this.props.value}
          mode={"dropdown"}
          onValueChange={(itemValue, itemIndex) => {
            // this.setState({ isModalVisible: false });
            this.props.changeState(
              itemValue,
              this.props.type,
              this.props.function ? this.props.function : parseInt
            );
          }}
        >
          {values}
        </Picker>
        {this.renderButtonsModal()}
      </View>
    );
  };

  // _renderModalContentAndroid = () => (
  //   <View style={styles.modalContentAndroid}>
  //     <Picker
  //       selectedValue={this.props.value}
  //       onValueChange={(itemValue, itemIndex) => {
  //         if (itemValue !== "---") {
  //           this.props.changeState(
  //             itemValue,
  //             this.props.type,
  //             this.props.function ? this.props.function : parseInt
  //           );
  //         }
  //       }}
  //     >
  //       <Picker.Item
  //         key={-1}
  //         itemStyle={styles.RightText}
  //         label={"---"}
  //         value={"---"}
  //       />

  //       {this.props.listValue.map((elem, index) => (
  //         <Picker.Item
  //           key={index}
  //           itemStyle={styles.RightText}
  //           label={elem + " " + this.props.extraValue}
  //           value={elem}
  //         />
  //       ))}
  //     </Picker>
  //   </View>
  // );

  returnOkImage(type) {
    switch (type) {
      case "bike":
        return require("./../../assets/images/garage_icons/bike_garage_ok.png");

      case "tpl":
        return require("./../../assets/images/garage_icons/lpt_garage_ok.png");

      case "pooling":
        return require("./../../assets/images/garage_icons/pooling_garage_ok.png");

      case "sharing":
        return require("./../../assets/images/garage_icons/sharing_garage_ok.png");

      default:
        return require("./../../assets/images/garage_icons/sharing_garage_ok.png");
    }
  }

  returnBWImage(type) {
    switch (type) {
      case "bike":
        return require("./../../assets/images/garage_icons/bike_garage.png");

      case "tpl":
        return require("./../../assets/images/garage_icons/lpt_garage.png");

      case "pooling":
        return require("./../../assets/images/garage_icons/pooling_garage.png");

      case "sharing":
        return require("./../../assets/images/garage_icons/sharing_garage.png");

      default:
        return require("./../../assets/images/garage_icons/sharing_garage.png");
    }
  }

  renderCheckIcn(type) {
    if (this.props["setted"] == true)
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            style={{
              width: 50,
              height: 50
            }}
            source={this.returnOkImage(this.props.mode)}
          />
          <Icon name="ios-arrow-forward" size={15} color="#3D3D3D" />
        </View>
      );
    else
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            style={{
              width: 50,
              height: 50
            }}
            source={this.returnBWImage(this.props.mode)}
          />
          <Icon name="ios-arrow-forward" size={15} color="#3D3D3D" />
        </View>
      );
  }

  render() {
    if (Platform.OS === "ios") {
      return (
        <View
          style={{
            alignContent: "center",
            justifyContent: "center",
            width: Dimensions.get("window").width * 0.45
          }}
        >
          <TouchableOpacity
            onPress={
              this.props.navigate ? this.props.navigate : this._toggleModal
            }
            style={{
              flexDirection: "row",
              justifyContent: "flex-end"
            }}
          >
            {/*
            <Text style={styles.Right}>
              {this.props.value !== strings("to fill") ? this.props.value : "-"}
            </Text> 
            */}

            {this.props.setted ? (
              this.renderCheckIcn(this.props.setted)
            ) : (
              <View>
                <Text style={styles.Right}>
                  {this.props.value !== strings("to fill")
                    ? this.props.value
                    : "-"}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Modal
            isVisible={this.state.isModalVisible}
            onBackdropPress={() => this.setState({ isModalVisible: false })}
            onBackButtonPress={() => this.setState({ isModalVisible: false })}
          >
            {this._renderModalContent()}
          </Modal>
        </View>
      );
    } else {
      return (
        <View
          style={{
            alignContent: "center",
            justifyContent: "center",
            // width: 120,
            width: Dimensions.get("window").width * 0.45
          }}
        >
          <TouchableOpacity
            // onPress={this._toggleModal}
            onPress={
              this.props.navigate ? this.props.navigate : this._toggleModal
            }
            style={{
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-end"
            }}
          >
            {/* <Text style={styles.Right}>
              {this.props.value !== strings("to fill") ? this.props.value : "-"}
            </Text> */}

            {this.props.setted ? (
              this.renderCheckIcn(this.props.setted)
            ) : (
              <View>
                <Text style={styles.Right}>
                  {this.props.value !== strings("to fill")
                    ? this.props.value
                    : "-"}
                </Text>
              </View>
            )}

            {/* <Icon name="ios-arrow-down" size={18} color="#3D3D3D" /> */}
          </TouchableOpacity>

          <Modal
            isVisible={this.state.isModalVisible}
            onBackdropPress={() => this.setState({ isModalVisible: false })}
            onBackButtonPress={() => this.setState({ isModalVisible: false })}
          >
            {this._renderModalContentAndroid()}
          </Modal>
        </View>
      );
    }
  }
}

export default PickerModalContent;

const styles = StyleSheet.create({
  other: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderBottomColor: "#5F5F5F",
    borderBottomWidth: 0.3,
    backgroundColor: "#fff"
  },
  Right: {
    alignSelf: "center",

    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },
  RightAndroid: {
    alignSelf: "center",
    right: 10
  },
  RightText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 10,
    color: "#3D3D3D"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContentAndroid: {
    width: 120,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  buttonConfermClick: {
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").height / 20,
    borderRadius: 5,
    alignItems: "center"
    // shadowRadius: 5
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 0.5,
    // elevation: 2
  },
  buttonConfermWhite: {
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4
  },
  buttonsContainer: {
    height: 50,
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
