import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";

class WeekDayNotificationPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.weekDayContainer}>
        <Text
          style={[
            styles.weekDayText,
            {
              color: this.props.selected ? "#3d3d3d" : "#9D9B9C"
            }
          ]}
        >
          {this.props.dayName}
        </Text>
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.onPress(this.props.index);
          }}
        >
          <View
            style={[
              styles.weekDayBorder,
              {
                borderColor: this.props.selected ? "#3d3d3d" : "#9D9B9C"
              }
            ]}
          >
            <View
              style={[
                styles.weekDay,
                {
                  backgroundColor: this.props.selected
                    ? "#3d3d3d"
                    : "transparent"
                }
              ]}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  weekDayContainer: {
    height: 40,
    width: 40,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  weekDayBorder: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#9D9B9C"
  },
  weekDay: {
    width: 12,
    height: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#9D9B9C"
  },
  weekDayText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#9D9B9C"
  }
});

export default WeekDayNotificationPicker;
