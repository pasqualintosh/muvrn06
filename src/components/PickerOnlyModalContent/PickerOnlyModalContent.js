/**
 * PickerModalContent
 * picker per la selezione di una lista di parametri
 * value, valore corrente selezionato,
 * extraValue, eventuale testo aggiuntivo da mettere nel pulsante con value
 * type, quale tipo di valore si sta passando
 * changeState, funzione passata dal padre per cambiare lo stato del padre
 * listOption, lista dei possibili valori
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
  Image,
} from "react-native";

import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { BoxShadow } from "react-native-shadow";
import PickerAndroid from "./../../components/PickerAndroid/PickerAndroid";

let Picker = Platform.OS === "ios" ? PickerIos : PickerAndroid;
let PickerItem = Picker.Item;

import { strings } from "../../config/i18n";
import { getStringValuesGarage} from "../../helpers/translateLabelDB"


class PickerOnlyModalContent extends React.Component {
  constructor() {
    super();
    this.state = {
      itemValue: "", 
      itemIndex: 0
    };
  }

  _toggleModal = () => {
    try {
      if (this.props.value == "-") {
        this.props.changeState(
          this.props.listOption[0],
          this.props.type,
          this.props.function
        );
      }
    } catch (error) {
      console.log(error);
    }

    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
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
      valueStart: this.props.valueAlert,
    });
  }
  

  _renderButton = (text, onPress) => {
    return (
      <TouchableHighlight onPress={onPress} style={styles.buttonRegister}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#ffffff",
              fontFamily: "OpenSans-Regular",
              fontWeight: "400",
              fontSize: 15,
              textAlignVertical: "center",
              textAlign: "center",
            }}
          >
            {text}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  // il picker funziona in modo differente su android e ios
  // su ios faccio spuntate un popup
  // mentre su android lo fa in automatico
  _renderModalContent = () => (
    <View style={styles.modalContent}>
     <View
          style={{
            paddingTop: 5,
            paddingBottom: 5,
            alignContent: "center",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#3d3d3d",
              fontSize: 20,
              fontFamily: "Montserrat-ExtraBold",
              textAlign: "center",
            }}
          >
            {this.props.titleAlert}
          </Text>
        </View>
      <Picker
        selectedValue={this.state.itemValue}
        onValueChange={(itemValue, itemIndex) => {
              this.setState({ itemValue, itemIndex });
              
            }}
      >
        {this.props.listOption.map((elem, index) => (
          <Picker.Item
            key={index}
            label={"" + getStringValuesGarage(elem)}
            value={"" + elem}
          />
        ))}
      </Picker>
      {this._renderButton(strings("id_13_23"), () => {
        if (this.state.itemValue) {
            this.props.confermModal(this.state.itemValue, this.props.paramAlert , this.state.itemIndex)
          } else {
            // primo elemento, non ho spostato il cursore 
            this.props.confermModal(this.props.listOption[0], this.props.paramAlert , 0)
            
          }
      })}
    </View>
  );

  renderButtonsModal() {
    return (
      <TouchableHighlight
        onPress={() => {
          if (this.state.itemValue) {
            this.props.confermModal(this.state.itemValue, this.props.paramAlert , this.state.itemIndex)
          } else {
            this.props.confermModal(this.props.listOption[0], this.props.paramAlert , 0)

          }
          
        }}
        style={styles.buttonRegister}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#ffffff",
              fontFamily: "OpenSans-Regular",
              fontWeight: "400",
              fontSize: 15,
              textAlignVertical: "center",
              textAlign: "center",
            }}
          >
            {strings("id_13_23")}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  _renderModalContentAndroid = () => {
    const values = this.props.listOption.map((element, index) => (
      <PickerItem
        width={Dimensions.get("window").width * 0.8}
        key={index}
        label={getStringValuesGarage(element)}
        value={"" + element}
      />
    ));
    return (
      <View
        style={{
          padding: 22,
          backgroundColor: "white",
          borderRadius: 10,
          alignItems: "center",

          flexDirection: "column",
          justifyContent: "center",
          shadowRadius: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.5,
        }}
      >
        <View
          style={{
            paddingTop: 5,
            paddingBottom: 5,
            alignContent: "center",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#3d3d3d",
              fontSize: 20,
              fontFamily: "Montserrat-ExtraBold",
              textAlign: "center",
            }}
          >
            {this.props.titleAlert}
          </Text>
        </View>
        <View
          style={{
            height: 250,
            backgroundColor: "white",

            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Picker
            style={{
              width: 250,
              height: 250,
            }}
            width={Dimensions.get("window").width * 0.8}
            selectedValue={this.state.itemValue}
            mode={"dropdown"}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({ itemValue, itemIndex });
              
            }}
          >
            {values}
          </Picker>
        </View>
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

  //       {this.props.listOption.map((elem, index) => (
  //         <Picker.Item
  //           key={index}
  //           itemStyle={styles.RightText}
  //           label={elem}
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
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 50,
              height: 50,
            }}
            source={this.returnOkImage(this.props.mode)}
          />
          <Icon name="ios-arrow-forward" size={15} color="#FFFFFF" />
        </View>
      );
    else
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 50,
              height: 50,
            }}
            source={this.returnBWImage(this.props.mode)}
          />
          <Icon name="ios-arrow-forward" size={15} color="#FFFFFF" />
        </View>
      );
  }

  render() {
    if (Platform.OS === "ios") {
      return (
        <View style={{ flex: 1}}> 
        

        <Modal
        isVisible={this.props.isModalVisible}
        onSwipeComplete={() => {
          this.props.closeModal(this.props.infoSend);
        }}
        onBackButtonPress={() => {
          this.props.closeModal(this.props.infoSend);
        }}
        onBackdropPress={() => {
          this.props.closeModal(this.props.infoSend);
        }}
      >
            {this._renderModalContent()}
          </Modal>
          </View>
      );
    } else {
      return (
        

        <Modal
        isVisible={this.props.isModalVisible}
        onSwipeComplete={() => {
          this.props.closeModal(this.props.infoSend);
        }}
        onBackButtonPress={() => {
          this.props.closeModal(this.props.infoSend);
        }}
        onBackdropPress={() => {
          this.props.closeModal(this.props.infoSend);
        }}
        
      >
            {this._renderModalContentAndroid()}
          </Modal>
       
      );
    }
  }
}

export default PickerOnlyModalContent;

const styles = StyleSheet.create({
  buttonRegister: {
    width: Dimensions.get("window").width * 0.3,
    height: 44,
    borderRadius: 22,
    borderColor: "#ffffff",
    borderWidth: 1,
    backgroundColor: "#6377B2",
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  other: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderBottomColor: "#5F5F5F",
    borderBottomWidth: 0.3,
    backgroundColor: "#fff",
  },
  Right: {
    alignSelf: "center",

    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 16,
    color: "#FFFFFF",
  },
  RightAndroid: {
    alignSelf: "center",
    right: 10,
  },
  RightText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 10,
    color: "#FFFFFF",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderColor: "#3363AD",
    borderWidth: 4,
    borderRadius: 10,
    // alignItems: "center",
    // flexDirection: "column",
    // justifyContent: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
  },
  modalContentAndroid: {
    height: 250,
    backgroundColor: "white",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  buttonConfermClick: {
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").height / 20,
    borderRadius: 5,
    alignItems: "center",
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
    borderRadius: 4,
  },
  buttonsContainer: {
    height: 50,
    width: 280,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: Platform.OS == "ios" ? 0 : 10,
  },
  buttonModalContainer: {
    width: Dimensions.get("window").width * 0.2,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  textButton: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 12,
    color: "#51AEC9",
  },
  textSection: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
  },
});
