/**
 * componente per selezionare il numero di giorni in cui si effettua la routine
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
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";

import Modal from "react-native-modal";
import Aux from "../../helpers/Aux";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

class RoutineDayInWeek extends React.Component {
  constructor() {
    super();
    // numero di giorni
    this.state = {
      Days: ["0", "1", "2", "3", "4", "5", "6", "7"],
      isModalVisible: false
    };
  }

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  _renderButton = (text, onPress) => (
    <View style={styles.buttonConfermWhite}>
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 0.0 }}
        locations={[0, 1.0]}
        colors={["#e82f73", "#f49658"]}
        style={styles.buttonConfermClick}
      >
        <TouchableOpacity
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
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text
              style={{
                fontFamily: "OpenSans-Regular",
                fontWeight: "400",
                color: "#FFFFFF"
              }}
            >
              {text}
            </Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  // il picker funziona in modo differente su android e ios
  // su ios faccio spuntate un popup
  // mentre su android lo fa in automatico
  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <Picker
        selectedValue={this.props.DaysChoose}
        onValueChange={(itemValue, itemIndex) => {
          if (itemValue !== "0") {
            this.props.handleFrequencyChange(itemValue);
          }
        }}
        mode="dialog"
      >
        {this.state.Days.map((elem, index) => (
          <Picker.Item key={index} label={elem} value={elem} />
        ))}
      </Picker>
      {this._renderButton("Confirm", () =>
        this.setState({ isModalVisible: false })
      )}
    </View>
  );

  _renderModalContentAndroid = () => (
    <View
      style={[
        styles.modalContentAndroid,
        {
          borderBottomWidth: 1,
          borderBottomColor: "#3d3d3d80"
        }
      ]}
    >
      <Picker
        style={{
          height: 50,
          width: 100
        }}
        selectedValue={this.props.DaysChoose}
        itemStyle={styles.RightText}
        onValueChange={(itemValue, itemIndex) => {
          if (itemValue !== "0") {
            this.props.handleFrequencyChange(itemValue);
          }
        }}
        mode="dropdown"
      >
        {this.state.Days.map((elem, index) => (
          <Picker.Item
            itemStyle={styles.RightText}
            key={index}
            label={elem}
            value={elem}
          />
        ))}
      </Picker>
    </View>
  );

  render() {
    return (
      <View style={styles.other}>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.Left}> How many times</Text>
          <Text style={styles.Left}> per week?</Text>
        </View>
        {Platform.OS === "ios" ? (
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
                borderBottomColor: "#5F5F5F",
                borderBottomWidth: 0.3,
                left: 10
              }}
            >
              <Text style={styles.Right}> {this.props.DaysChoose}</Text>
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
        ) : (
          <View style={styles.RightAndroid}>
            {this._renderModalContentAndroid()}
          </View>
        )}
      </View>
    );
  }
}

const Info = connect(state => {
  // prendo solo le routine
  return {
    Routine: state.login.mostFrequentRoute ? state.login.mostFrequentRoute : [],
    RoutineNotSave: state.login.mfr_modal_split_NotSave
      ? state.login.mfr_modal_split_NotSave
      : []
  };
});

export default Info(RoutineDayInWeek);

const styles = StyleSheet.create({
  first: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderBottomColor: "#5F5F5F",
    borderBottomWidth: 0.3,
    borderTopColor: "#5F5F5F",
    borderTopWidth: 0.3
  },
  other: {
    alignContent: "center",
    justifyContent: "flex-start",
    flexDirection: "row"
  },
  last: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row"
  },
  Left: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 12,
    alignSelf: "center"
  },
  Right: {
    paddingRight: 10,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },
  RightAndroid: {
    alignSelf: "center",
    marginRight: -100,
    bottom: 10,
    right: -10,
    backgroundColor: "white",
    flexDirection: "row"
  },

  RightText: {
    fontSize: 13,
    alignContent: "center",
    textAlign: "center"
  },
  centerTextContainer: {
    // width: 200,
    // height: 200,
    position: "absolute",
    top: Dimensions.get("window").height * 0.1 + 190
  },
  centerValue: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 37,
    textAlign: "center",
    textAlignVertical: "center"
  },
  centerTextParam: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#9D9B9C",
    fontSize: 9,
    fontWeight: "bold"
  },
  iconText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#9D9B9C",
    fontSize: 14
  },
  mfrText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "black",
    fontSize: 10,
    marginRight: 0
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
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 2
  },
  buttonConfermWhite: {
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4
  }
});
