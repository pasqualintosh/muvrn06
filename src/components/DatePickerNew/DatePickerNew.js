/**
 * DatePicker
 * picker per la selezione della data di nascita su android e ios
 * value, valore corrente selezionato,
 * extraValue, eventuale testo aggiuntivo da mettere nel pulsante con value
 * type, quale tipo di valore si sta passando
 * changeState, funzione passata dal padre per cambiare lo stato del padre
 * @author push
 */

import React from "react";
import {
  View,
  Text,
  ScrollView,
  DatePickerIOS,
  Platform,
  Dimensions,
  StyleSheet,
  Picker,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  DatePickerAndroid,
  NativeModules,
} from "react-native";

import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

let locale = undefined;

if (Platform.OS == "ios") {
  locale = NativeModules.SettingsManager.settings.AppleLocale;
  if (locale === undefined) {
    // iOS 13 workaround, take first of AppleLanguages array  ["en", "en-NZ"]
    locale = NativeModules.SettingsManager.settings.AppleLanguages[0];
    if (locale == undefined) {
      locale = "en"; // default language
    }
  }
} else locale = NativeModules.I18nManager.localeIdentifier;

locale = locale.substr(0, 2);

import { strings } from "../../config/i18n";

class DatePickerNew extends React.Component {
  constructor() {
    super();
    this.state = {
      isModalVisible: false,
      chosenDate: new Date(),
    };

    this.setDate = this.setDate.bind(this);
  }

  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  /* _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  ); */

  _renderButton = (text, onPress) => (
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

  // il picker funziona in modo differente su android e ios
  // su ios faccio spuntate un popup
  // mentre su android lo fa in automatico
  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <DatePickerIOS
        date={
          this.props.value !== ""
            ? new Date(this.props.value)
            : this.state.chosenDate
        }
        onDateChange={this.setDate}
        mode="date"
        maximumDate={
          new Date(new Date().setUTCFullYear(new Date().getUTCFullYear() - 16))
        }
        locale={locale}
      />
      {this._renderButton(strings("id_13_23"), () =>
        this.setState({ isModalVisible: false })
      )}
    </View>
  );

  setDate(newDate) {
    console.log(newDate);
    this.props.changeState(newDate, this.props.type, this.props.function);
  }

  showAndroidDatePicker = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        locale,
        date:
          this.props.value !== ""
            ? new Date(this.props.value)
            : this.state.chosenDate,
        mode: "spinner",
        maxDate: new Date().setUTCFullYear(new Date().getUTCFullYear() - 16),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        var date = new Date(year, month, day);
        this.setDate(date.toISOString());
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  };

  render() {
    console.log(this.props.value);
    const localeDateOpt = {
      //weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    if (Platform.OS === "ios") {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignSelf: "center",
            width: Dimensions.get("window").width * 0.45,
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

              height: 44,
              width: Dimensions.get("window").width * 0.45,
            }}
          >
            <Text style={styles.Right}>
              {/* da microsecondi a anni */}
              {this.props.value !== ""
                ? this.props.function(this.props.value) + " " + this.props.extraValue
                : "-" + " " + this.props.extraValue}
            </Text>
            {/* <Icon name="ios-arrow-down" size={18} color="#3D3D3D" /> */}
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
        <View style={styles.RightAndroid}>
          <TouchableOpacity
            onPress={() => this.showAndroidDatePicker()}
            style={{
              flexDirection: "row",
              alignSelf: "center",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignContent: "center",
              alignItems: "center",

              height: 44,
              width: Dimensions.get("window").width * 0.45,
            }}
          >
            <Text
              style={{
                fontFamily: "OpenSans-Regular",
                fontWeight: "400",
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              {" "}
              {/* da microsecondi a anni */}
              {this.props.value !== ""
                ? this.props.function(this.props.value) + " " + this.props.extraValue
                : "-" + " " + this.props.extraValue}
            </Text>
            {/* <Icon name="md-arrow-dropdown" size={19} color="#202020" /> */}
          </TouchableOpacity>
        </View>
      );
    }
  }
}

{
  /* (new Date(
                    Date.now() - new Date(this.props.value).getTime()
                  ).getUTCFullYear() -
                    1970)  */
}

export default DatePickerNew;

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
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.45,
  },
  RightText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 16,
    color: "#FFFFFF",
  },

  modalContent: {
    backgroundColor: "white",
    padding: 22,

    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  modalContentAndroid: {
    width: 120,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
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
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 2,
  },
  buttonConfermWhite: {
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
});
