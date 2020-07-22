/*
 * ChangeNameModalContent
 * picker per la modifica del nome utente come first and last
 * value, valore corrente selezionato,
 * extraValue, eventuale testo aggiuntivo da mettere nel pulsante con value
 * type, quale tipo di valore si sta passando
 * changeState, funzione passata dal padre per cambiare lo stato del padre
 * listValue, lista dei possibili valori
 * function, funzione che viene applicato al valore salvato prima di essere mandato al db per essere coerente
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
  Alert
} from "react-native";

import { Input } from "react-native-elements";

import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import OwnIcon from "../OwnIcon/OwnIcon";
import LinearGradient from "react-native-linear-gradient";
import { strings } from "../../config/i18n";

class ChangeNameModalContent extends React.Component {
  constructor() {
    super();
    this.state = {
      isModalVisible: false,
      value: null,
      ValidationValue: true
    };
  }

  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  /* _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.buttonConferm}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  ); */

  _renderButton = (text, onPress) => (
    <View style={styles.buttonConfermWhite}>
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
    </View>
  );

  handleEmail = text => {
    // deve avere almeno la lunghezza uno
    const length = !text.length;
    console.log(text);
    console.log(!length);

    this.setState({ value: text, ValidationValue: !length });
  };

  // il modal utilizzato per modificare il nome dell'utente mediante un popup

  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text style={styles.titleText}>
        {this.props.title ? this.props.title : ""}
      </Text>
      <Input
        returnKeyType={"done"}
        placeholder={this.props.placeholder}
        value={this.state.value !== null ? this.state.value : this.props.value}
        errorStyle={{ color: "red" }}
        errorMessage={this.props.placeholder + " non valid"}
        onChangeText={text => this.handleEmail(text)}
        leftIcon={<OwnIcon name="username-icn" size={24} color="#E83475" />}
        autoCorrect={false}
        containerStyle={{
          marginTop: 20,
          backgroundColor: "white",
          borderColor: "#f7f8f9",
          borderWidth: 1
        }}
        onSubmitEditing={() => {
          this.closeModelChangeValue();
        }}
      />

      {this._renderButton(strings("id_13_23"), () => {
        this.closeModelChangeValue();
      })}
    </View>
  );

  closeModelChangeValue = () => {
    if (this.state.value !== null && this.state.value.length >= 2) {
      this.props.changeState(
        this.state.value !== null &&
          this.state.value !== this.props.value &&
          this.state.ValidationValue
          ? this.state.value
          : this.props.value,
        this.props.type,
        this.props.function
      );
    }

    this.setState({ isModalVisible: false, value: null });
  };

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
            onPress={this._toggleModal}
            style={{
              flexDirection: "row",
              alignSelf: "center",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignContent: "center",
              alignItems: "center",

              height: Dimensions.get("window").height * 0.1,
              width: Dimensions.get("window").width * 0.45
            }}
          >
            <Text style={styles.Right}>
              {" "}
              {this.props.value} {this.props.extraValue}
            </Text>
            {/* <Icon name="ios-arrow-down" size={18} color="#3D3D3D" /> */}
          </TouchableOpacity>

          <Modal
            isVisible={this.state.isModalVisible}
            onBackdropPress={() =>
              this.setState({ isModalVisible: false, value: null })
            }
            onBackButtonPress={() => {
              this.setState({ isModalVisible: false, value: null });
            }}
          >
            {this._renderModalContent()}
          </Modal>
        </View>
      );
    } else {
      return (
        <View style={styles.RightAndroid}>
          <TouchableOpacity
            onPress={this._toggleModal}
            style={{
              flexDirection: "row",
              alignSelf: "center",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignContent: "center",
              alignItems: "center",

              height: Dimensions.get("window").height * 0.1,
              width: Dimensions.get("window").width * 0.45
            }}
          >
            <Text style={[styles.rightText]}>
              {" "}
              {this.props.value} {this.props.extraValue}
            </Text>
            {/* <Icon name="md-arrow-dropdown" size={19} color="#202020" /> */}
          </TouchableOpacity>

          <Modal
            isVisible={this.state.isModalVisible}
            onBackdropPress={() =>
              this.setState({ isModalVisible: false, value: null })
            }
            onBackButtonPress={() => {
              this.setState({ isModalVisible: false, value: null });
            }}
          >
            {this._renderModalContent()}
          </Modal>
        </View>
      );
    }
  }
}

export default ChangeNameModalContent;

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
  titleText: {
    alignSelf: "center",
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 14,
    color: "#3D3D3D"
  },
  RightAndroid: {
    alignSelf: "center"
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
  buttonConferm: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  buttonConfermWhite: {
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4
  },
  sfondo: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
    backgroundColor: "transparent"
  },
  image: {
    width: Dimensions.get("window").width / 2,
    height: Dimensions.get("window").height / 3
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around"
  },
  button: {
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").height / 20,
    borderRadius: 5,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 2
  },
  buttonConfermClick: {
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").height / 20,
    borderRadius: 5,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 2
  },
  buttonLoginSocial: {
    width: Dimensions.get("window").width / 2.3,
    height: Dimensions.get("window").height / 20,
    borderRadius: 5,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 2
  },
  login: {
    alignItems: "center",
    borderColor: "#f7f8f9",
    borderWidth: 1
  },
  buttonPrecedente: {
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").height / 20,
    alignItems: "center",
    margin: 10
  },
  icon: {
    margin: 10,
    width: Dimensions.get("window").width / 13,
    height: Dimensions.get("window").height / 40
  }
});
