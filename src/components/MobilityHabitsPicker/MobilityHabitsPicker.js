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
  Picker,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Modal as ReactModal
} from "react-native";

import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { BoxShadow } from "react-native-shadow";
import MobilityHabitsModal from "./../MobilityHabitsModal/MobilityHabitsModal";
import MobilityHabitsCarModal from "./../MobilityHabitsModal/MobilityHabitsCarModal";
import MobilityHabitsMotoModal from "./../MobilityHabitsModal/MobilityHabitsMotoModal";

class MobilityHabitsPicker extends React.Component {
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
                alignItems: "center",
                shadowRadius: 5
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
      {this.props.modal == "car" ? (
        <MobilityHabitsCarModal checkboxColor={"#F7F8F9"} />
      ) : (
        <MobilityHabitsMotoModal checkboxColor={"#F7F8F9"} />
      )}
      {this._renderButton("Confirm", () => {
        this.setState({ isModalVisible: false });
        // this.props.changeState(
        //   this.props.value === "to fill"
        //     ? this.props.listValue[0]
        //     : this.props.value,
        //   this.props.type,
        //   this.props.function
        // );
      })}
    </View>
  );

  _renderModalContentAndroid = () => (
    <ReactModal
      animationType="slide"
      transparent={false}
      visible={this.state.isModalVisible}
      onRequestClose={() => {
        alert("Modal has been closed.");
      }}
    >
      <View style={{}}>
        {this.props.modal == "car" ? (
          <MobilityHabitsCarModal checkboxColor={"#F7F8F9"} />
        ) : (
          <MobilityHabitsMotoModal checkboxColor={"#F7F8F9"} />
        )}

        {this._renderButton("Confirm", () => {
          this.setState({ isModalVisible: false });
        })}
      </View>
    </ReactModal>
  );

  render() {
    if (Platform.OS === "ios") {
      return (
        <View
          style={{
            alignContent: "center",
            justifyContent: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (this.props.modal == "car")
                this.props.navigation.navigate("EditCarFuelScreen"); // this.props.navigation.navigate("EditCarScreen");
              if (this.props.modal == "moto")
                this.props.navigation.navigate("EditMotoSegmentScreen");
            }}
            // onPress={this._toggleModal}
            style={{
              flexDirection: "row"
            }}
          >
            {/* <Text style={styles.Right}>
              {" "}
              {this.props.value}{" "}
              {this.props.value !== "to fill" ? this.props.extraValue : ""}
            </Text> */}
            <Icon name="ios-arrow-down" size={18} color="#3D3D3D" />
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
        <View style={[{}]}>
          <TouchableHighlight
            onPress={() => {
              if (this.props.modal == "car")
                this.props.navigation.navigate("EditCarFuelScreen"); // this.props.navigation.navigate("EditCarScreen");
              if (this.props.modal == "moto")
                this.props.navigation.navigate("EditMotoSegmentScreen");
            }}
            // onPress={() => {
            //   let visible = this.state.isModalVisible;
            //   this.setState({ isModalVisible: !visible });
            // }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                width: 60,
                height: Dimensions.get("window").height * 0.1
                // backgroundColor: "#ee333370"
              }}
            >
              {/* <Text style={styles.rightText}>Open</Text> */}
              <Icon name="ios-arrow-down" size={18} color="#3d3d3d" />
            </View>
          </TouchableHighlight>
          {this._renderModalContentAndroid()}
        </View>
      );
    }
  }
}

export default MobilityHabitsPicker;

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
    right: 20,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },
  RightAndroid: {
    alignSelf: "center",
    right: 10
  },
  rightText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
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
  }
});
