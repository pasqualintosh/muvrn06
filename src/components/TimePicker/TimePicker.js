import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TimePickerAndroid,
  Switch as SwitchIos,
  Platform
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { styles } from "./Style";
import HourPicker from "./../HourPicker/HourPicker";
import MinutePicker from "./../MinutePicker/MinutePicker";
import MeridianPicker from "./../MeridianPicker/MeridianPicker";
import WeekDayNotificationPicker from "./../WeekDayNotificationPicker/WeekDayNotificationPicker";
import { connect } from "react-redux";
import SwitchAndroid from "react-native-switch-pro";

let Switch = Platform.OS == "ios" ? SwitchIos : SwitchAndroid;

import { strings } from "../../config/i18n";

class TimePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      chosenDate: new Date(), // iOs
      hour: this.props.hour, // android
      minute: this.props.minute, // android
      meridian: this.props.hour ? (this.props.hour > 12 ? "PM" : "AM") : "AM",
      choosedWeekDays: this.props.choosedWeekDays,
      btn_tapped: false
    };

    this.setDate = this.setDate.bind(this);
    this.setDayWeek = this.setDayWeek.bind(this);
  }

  componentDidMount() {
    // se lo ricevo dalle props
    // setto la data da visualizzare
    if (this.props.hour != null) {
      const today = new Date();
      today.setHours(this.props.hour);
      today.setMinutes(this.props.hour);
      this.setState({
        chosenDate: today
      });
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      // hour: props.hour > 12 ? props.hour - 12 : props.hour,
      hour: props.hour,
      minute: props.minute,
      meridian: props.hour
        ? props.hour > 12
          ? "PM"
          : "AM"
        : new Date().getHours() > 12
        ? "PM"
        : "AM",
      choosedWeekDays: props.choosedWeekDays
    });
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  pad2 = number => {
    return (number < 10 ? "0" : "") + number;
  };

  setDayWeek = index => {
    let days = this.state.choosedWeekDays;
    days[index] = !days[index];

    this.setState({
      choosedWeekDays: days
    });
  };

  setHour = h => {
    this.setState({ hour: h });
  };

  setMinutes = m => {
    this.setState({ minute: m });
  };

  setMeridian = m => {
    this.setState({ meridian: m });
  };

  setDate(newDate) {
    this.props.changeState(
      this.pad2(newDate.getHours()),
      this.pad2(newDate.getMinutes()),
      true,
      this.props.type,
      null
    );
    this.setState({ chosenDate: newDate });
  }

  showAndroidTimePicker = async () => {
    try {
      let { action, hour, minute } = await TimePickerAndroid.open({
        hour: this.props.hour,
        minute: this.props.minute,
        mode: "spinner",
        is24Hour: false // Will display '2 PM',
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        // Selected hour (0-23), minute (0-59)

        hour = this.pad2(hour);
        minute = this.pad2(minute);

        this.setState({ hour, minute }, () => {
          this.props.changeState(hour, minute, true, this.props.type, null);
        });
      }
    } catch ({ code, message }) {
      console.warn("Cannot open time picker", message);
    }
  };

  renderButton = (text, onPress) => (
    <View style={styles.buttonConfermWhite}>
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 0.0 }}
        locations={[0, 1.0]}
        colors={["#e82f73", "#f49658"]}
        style={styles.buttonConfermClick}
      >
        <TouchableHighlight onPress={onPress}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text style={{ color: "#FFFFFF" }}> {text} </Text>
          </View>
        </TouchableHighlight>
      </LinearGradient>
    </View>
  );

  // il picker funziona in modo differente su android e ios
  // su ios faccio spuntate un popup
  // mentre su android lo fa in automatico
  renderModalContent = () => {
    // se lo ricevo dalle props
    // setto la data da visualizzare
    if (this.props.hour != null) {
      const today = new Date();
      today.setHours(this.props.hour);
      today.setMinutes(this.props.minute);
      return (
        <View style={styles.modalContent}>
          {/* 
          <DatePickerIOS
            date={today}
            onDateChange={this.setDate}
            mode={this.props.mode ? this.props.mode : "time"}
          />
          {this.renderButton("Confirm", () =>
            this.setState({ isModalVisible: false })
          )} 
          */}
          <View style={styles.pickerContainer}>
            <HourPicker hour={this.state.hour} setHour={this.setHour} />
            <View style={styles.twoPointsContainer}>
              <Text style={styles.twoPoints}>:</Text>
            </View>
            <MinutePicker
              minute={this.state.minute}
              setMinutes={this.setMinutes}
            />
            {/* 
            <MeridianPicker
              meridian={this.state.meridian}
              setMeridian={this.setMeridian}
            /> 
            */}
          </View>
          <View style={styles.weekDayContainer}>
            <WeekDayNotificationPicker
              index={1}
              dayName={strings("id_0_35").toLocaleUpperCase()}
              selected={this.state.choosedWeekDays[1]}
              onPress={this.setDayWeek}
            />
            <WeekDayNotificationPicker
              index={2}
              dayName={strings("id_0_36").toLocaleUpperCase()}
              selected={this.state.choosedWeekDays[2]}
              onPress={this.setDayWeek}
            />
            <WeekDayNotificationPicker
              index={3}
              dayName={strings("id_0_37").toLocaleUpperCase()}
              selected={this.state.choosedWeekDays[3]}
              onPress={this.setDayWeek}
            />
            <WeekDayNotificationPicker
              index={4}
              dayName={strings("id_0_38").toLocaleUpperCase()}
              selected={this.state.choosedWeekDays[4]}
              onPress={this.setDayWeek}
            />
            <WeekDayNotificationPicker
              index={5}
              dayName={strings("id_0_39").toLocaleUpperCase()}
              selected={this.state.choosedWeekDays[5]}
              onPress={this.setDayWeek}
            />
            <WeekDayNotificationPicker
              index={6}
              dayName={strings("id_0_40").toLocaleUpperCase()}
              selected={this.state.choosedWeekDays[6]}
              onPress={this.setDayWeek}
            />
            <WeekDayNotificationPicker
              index={0}
              dayName={strings("id_0_41").toLocaleUpperCase()}
              selected={this.state.choosedWeekDays[0]}
              onPress={this.setDayWeek}
            />
          </View>
          {this.renderButtonsContainer()}
        </View>
      );
    } else {
      return (
        <View style={styles.modalContent}>
          {/* 
          <DatePickerIOS
            date={this.state.chosenDate}
            onDateChange={this.setDate}
            mode={this.props.mode ? this.props.mode : "time"}
          />
          {this.renderButton("Confirm", () =>
            this.setState({ isModalVisible: false })
          )} 
          */}
          <View style={styles.pickerContainer}>
            <HourPicker hour={this.state.hour} setHour={h => this.setHour(h)} />
            <View style={styles.twoPointsContainer}>
              <Text style={styles.twoPoints}>:</Text>
            </View>
            <MinutePicker
              minute={this.state.minute}
              setMinutes={this.setMinutes}
            />
            {/* 
            <MeridianPicker
              meridian={this.state.meridian}
              setMeridian={this.setMeridian}
            /> 
            */}
          </View>
          <View style={styles.weekDayContainer}>
            <WeekDayNotificationPicker
              index={1}
              dayName={"MON"}
              selected={this.state.choosedWeekDays[1]}
              onPress={this.setDayWeek}
            />
            <WeekDayNotificationPicker
              index={2}
              dayName={"TUE"}
              selected={this.state.choosedWeekDays[2]}
              onPress={this.setDayWeek}
            />
            <WeekDayNotificationPicker
              index={3}
              dayName={"WED"}
              selected={this.state.choosedWeekDays[3]}
              onPress={this.setDayWeek}
            />
            <WeekDayNotificationPicker
              index={4}
              dayName={"THU"}
              selected={this.state.choosedWeekDays[4]}
              onPress={this.setDayWeek}
            />
            <WeekDayNotificationPicker
              index={5}
              dayName={"FRI"}
              selected={this.state.choosedWeekDays[5]}
              onPress={this.setDayWeek}
            />
            <WeekDayNotificationPicker
              index={6}
              dayName={"SAT"}
              selected={this.state.choosedWeekDays[6]}
              onPress={this.setDayWeek}
            />
            <WeekDayNotificationPicker
              index={0}
              dayName={"SUN"}
              selected={this.state.choosedWeekDays[0]}
              onPress={this.setDayWeek}
            />
          </View>
          {this.renderButtonsContainer()}
        </View>
      );
    }
  };

  renderButtonsContainer() {
    return (
      <View style={styles.buttonsContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.changeScheduledNotification();
            this.setState({ isModalVisible: false });
            // this.toggleModal();
          }}
        >
          <View style={styles.buttonContainer}>
            <Text style={styles.textButton}>
              {strings("id_0_68").toLocaleUpperCase()}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ isModalVisible: false }, () => {
              const h = this.state.hour;

              // this.props.changeScheduledNotification();
              this.props.changeState(
                h,
                this.pad2(this.state.minute),
                true,
                this.props.type,
                null
              );
            });
          }}
        >
          <View style={styles.buttonContainer}>
            <Text style={styles.textButton}>
              {strings("id_0_12").toLocaleUpperCase()}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    // if (Platform.OS === "ios") {
    return (
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row"
          // width: 150
          // marginRight: 22
        }}
      >
        <TouchableOpacity
          onPress={this.toggleModal}
          style={{
            flexDirection: "row",
            // left: -10,
            width: 80
          }}
        >
          <Text style={styles.Right}>{this.props.value}</Text>
          <Icon name="ios-arrow-down" size={18} color="#3D3D3D" />
        </TouchableOpacity>

        <Switch
          style={{ marginRight: 18 }}
          onValueChange={() => {
            this.props.changeScheduledNotification();

            setTimeout(() => {
              if (this.props.notification_set)
                this.setState({ isModalVisible: true });
            }, 500);
          }}
          onSyncPress={() => {
            this.props.changeScheduledNotification();

            setTimeout(() => {
              if (this.props.notification_set)
                this.setState({ isModalVisible: true });
            }, 500);
          }}
          value={this.props.notification_set}
        />

        <Modal
          isVisible={this.state.isModalVisible}
          onBackdropPress={() => {
            this.setState({ isModalVisible: false });
            if ((this.props.value = "--:--"))
              this.props.changeScheduledNotification();
          }}
          onBackButtonPress={() => {
            this.setState({ isModalVisible: false });
            if ((this.props.value = "--:--"))
              this.props.changeScheduledNotification();
          }}
        >
          {this.renderModalContent()}
        </Modal>
      </View>
    );
    // } else {
    //   return (
    //     <View style={styles.RightAndroid}>
    //       <TouchableOpacity
    //         onPress={() => this.showAndroidTimePicker()}
    //         style={{
    //           flexDirection: "row",
    //           left: -20
    //         }}
    //       >
    //         <Text style={{ paddingRight: 20, color: "black" }}>
    //           {this.props.value}
    //         </Text>
    //         <Icon name="md-arrow-dropdown" size={19} color="#202020" />
    //       </TouchableOpacity>
    //     </View>
    //   );
    // }
  }
}

const withData = connect(state => {
  // prendo solo le routine
  return {
    loginState: state.login
  };
});

export default withData(TimePicker);
