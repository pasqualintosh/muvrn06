import React from "react";
import {
  View,
  Text,
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import { Input } from "react-native-elements";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import OwnIcon from "../OwnIcon/OwnIcon";
import LinearGradient from "react-native-linear-gradient";
import JsonQuery from "json-query";
import { data } from "./../../assets/ListCities";

class ChangeCityModalContent extends React.Component {
  constructor() {
    super();
    this.state = {
      isModalVisible: false,
      value: null,
      ValidationValue: true,
      showAutocomplete: false,
      result: "",
      cityId: null
    };
  }

  componentDidMount() {
    this.setState({ cityId: this.props.cityId ? this.props.cityId : null });
  }

  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  renderButton = (text, onPress) => (
    <View style={[styles.buttonConfermWhite]}>
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
            <Text style={{ color: "#FFFFFF" }}>{text}</Text>
          </View>
        </TouchableHighlight>
      </LinearGradient>
    </View>
  );

  handleCity = (text, result) => {
    this.setState({ value: text, result });
    if (result.length > 0) {
      this.setState({ showAutocomplete: true });
    }
    if (text == "") this.setState({ result: "" });
  };

  renderScrollAutofocus(result) {
    console.log(result);

    return (
      <View
        style={{
          backgroundColor: "#fff",
          width: Dimensions.get("window").width * 0.6,
          height: 125,
          alignSelf: "center"
          // position: "absolute",
          // top: Platform.OS === "ios" ? 65 : 70
        }}
      >
        <ScrollView
        // contentContainerStyle={{
        //   backgroundColor: "#fff",
        //   width: Dimensions.get("window").width * 0.6,
        //   height: 120,
        //   alignSelf: "center",
        //   justifyContent: "flex-start",
        //   flexDirection: "row",
        //   alignContent: "center"
        // }}
        >
          {result.length > 0
            ? result.map((item, index) => (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => {
                    console.log(item);
                    this.setState({
                      value: item.name,
                      showAutocomplete: false,
                      cityId: item.id
                    });
                  }}
                >
                  <View
                    style={{
                      borderBottomColor: "#aaa",
                      borderBottomWidth: 1,
                      width: Dimensions.get("window").width * 0.8,
                      height: 30
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "OpenSans-Regular",
                        fontWeight: "400",
                        color: "#3d3d3d",
                        fontSize: 16
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              ))
            : [].map((item, index) => <Text key={index}>{item}</Text>)}
        </ScrollView>
      </View>
    );
  }

  // il modal utilizzato per modificare il nome dell'utente mediante un popup
  renderModalContent = () => {
    const result =
      this.state.cityName != ""
        ? JsonQuery(`cities[*name~/${this.state.value}/i]`, {
            allowRegexp: true,
            data: data
          }).value
        : "";

    return (
      <View style={styles.modalContent}>
        <Text style={styles.titleText}>
          {this.props.title ? this.props.title : ""}
        </Text>
        <Input
          // returnKeyType={"done"}
          placeholder={this.props.placeholder}
          value={
            this.state.value !== null ? this.state.value : this.props.value
          }
          onChangeText={text => this.handleCity(text, result)}
          errorStyle={{ color: "red" }}
          errorMessage={this.props.placeholder + " non valid"}
          leftIcon={<Icon name="ios-search" size={18} color="#3D3D3D" />}
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
          onFocus={() => {
            if (result.length > 0) {
              this.setState({ showAutocomplete: true });
            }
          }}
        />
        {this.renderScrollAutofocus(result)}

        {this.renderButton("Confirm", () => {
          this.closeModelChangeValue();
        })}
      </View>
    );
  };

  closeModelChangeValue = () => {
    this.props.changeState(
      this.state.value !== null &&
        this.state.value !== this.props.value &&
        this.state.ValidationValue
        ? this.state.value
        : this.props.value,
      this.props.type,
      this.props.function
    );
    this.props.changeState(this.state.cityId, "city", this.props.function);
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
              left: -10
            }}
          >
            <Text style={styles.Right}>{this.props.value}</Text>
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
            {this.renderModalContent()}
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
              left: -20
            }}
          >
            <Text
              style={{
                paddingRight: 20,
                fontFamily: "OpenSans-Regular",
                fontWeight: "400",
                fontSize: 13,
                color: "#3D3D3D"
              }}
            >
              {this.props.value}
            </Text>
            {/* <Icon name="md-arrow-dropdown" size={19} color="#202020" /> */}
          </TouchableOpacity>

          <KeyboardAvoidingView behavior="position">
            <Modal
              isVisible={this.state.isModalVisible}
              onBackdropPress={() =>
                this.setState({ isModalVisible: false, value: null })
              }
              onBackButtonPress={() => {
                this.setState({ isModalVisible: false, value: null });
              }}
            >
              {this.renderModalContent()}
            </Modal>
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
}

export default ChangeCityModalContent;

const styles = StyleSheet.create({
  other: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderBottomColor: "#5F5F5F",
    borderBottomWidth: 0.3,
    backgroundColor: "#fff"
  },
  titleText: {
    alignSelf: "center",
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 14,
    color: "#3D3D3D"
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
  RightText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },

  modalContent: {
    height: Dimensions.get("window").height * 0.4 + 120,
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
    top: 20,
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
