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
  NativeModules
} from "react-native";

import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

let locale = undefined;

if (Platform.OS == "ios") {
  locale = NativeModules.SettingsManager.settings.AppleLocale;
  if (locale === undefined) {
    // iOS 13 workaround, take first of AppleLanguages array  ["en", "en-NZ"]
    locale = NativeModules.SettingsManager.settings.AppleLanguages[0]
    if (locale == undefined) {
          locale = "en" // default language
    }
}
}
else locale = NativeModules.I18nManager.localeIdentifier;

locale = locale.substr(0, 2);

import { strings } from "../../config/i18n";

class DatePicker extends React.Component {
  constructor() {
    super();
    this.state = {
      isModalVisible: false,
      chosenDate: new Date()
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
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text
              style={{
                margin: 10,
                color: "#FFFFFF",
                fontFamily: "OpenSans-Regular",
                fontWeight: "400",
                fontSize: 13
              }}
            >
              {text}
            </Text>
          </View>
        </TouchableHighlight>
      </LinearGradient>
    </View>
  );

  // il picker funziona in modo differente su android e ios
  // su ios faccio spuntate un popup
  // mentre su android lo fa in automatico
  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <DatePickerIOS
        date={
          this.props.value !== strings("to_fill")
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
      {this._renderButton("Confirm", () =>
        this.setState({ isModalVisible: false })
      )}
    </View>
  );

  setDate(newDate) {
    console.log(newDate);
    this.props.changeState(newDate, this.props.type);
  }

  showAndroidDatePicker = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        locale,
        date:
          this.props.value !== strings("to_fill")
            ? new Date(this.props.value)
            : this.state.chosenDate,
        mode: "spinner",
        maxDate: new Date().setUTCFullYear(new Date().getUTCFullYear() - 16)
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
      day: "numeric"
    };
    if (Platform.OS === "ios") {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignSelf: "center",
            width: Dimensions.get("window").width * 0.45
          }}
        >
          <TouchableOpacity
            onPress={this._toggleModal}
            style={{
              flexDirection: "row"
            }}
          >
            <Text style={styles.Right}>
              {/* da microsecondi a anni */}
              {this.props.value !== strings("to_fill")
                ? new Date(this.props.value)
                    .toLocaleDateString(locale, localeDateOpt)
                    .replace("-", "/") +
                  " (" +
                  (new Date(
                    Date.now() - new Date(this.props.value).getTime()
                  ).getUTCFullYear() -
                    1970) +
                  ")"
                : "-"}
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
              flexDirection: "row"
            }}
          >
            <Text
              style={{
                fontFamily: "OpenSans-Regular",
                fontWeight: "400",
                fontSize: 13,
                color: "#3D3D3D"
              }}
            >
              {" "}
              {/* da microsecondi a anni */}
              {this.props.value !== strings("to_fill")
                ? new Date(this.props.value).toDateString().slice(4) +
                  " (" +
                  (new Date(
                    Date.now() - new Date(this.props.value).getTime()
                  ).getUTCFullYear() -
                    1970) +
                  ")"
                : "-"}
            </Text>
            {/* <Icon name="md-arrow-dropdown" size={19} color="#202020" /> */}
          </TouchableOpacity>
        </View>
      );
    }
  }
}

export default DatePicker;

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
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.45
  },
  RightText: {
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
