import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import LinearGradient from "react-native-linear-gradient";

class OnboardingWeekDay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderLinearGradientCheckbox() {
    if (this.props.selected)
      return (
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1 }}
          locations={[0, 1.0]}
          colors={
            this.props.detailScreen
              ? ["#7D4D99", "#6497CC"]
              : ["#7D4D99", "#6497CC"]
          }
          style={[styles.checkboxesGradient]}
        />
      );
  }

  render() {
    return (
      <View
        style={[
          styles.weekDayContainer,
          {
            alignItems: this.props.detailScreen ? "center" : "center"
          },
          this.props.style
        ]}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.onPress(this.props.index);
          }}
        >
          <View
            style={[
              styles.weekDayBorder,
              {
                borderColor: "#fff",
                backgroundColor: this.props.detailScreen ? "#fff" : "#fff",
                alignSelf: this.props.detailScreen ? "center" : "center"
              },
              this.props.styleBox
            ]}
          >
            {this.renderLinearGradientCheckbox()}
          </View>
        </TouchableWithoutFeedback>
        <Text
          style={[
            styles.weekDayText,
            {
              color: this.props.detailScreen ? "#3d3d3d" : "#fff",
              fontSize: this.props.detailScreen ? 9 : 13
            }
          ]}
        >
          {this.props.dayName}
        </Text>
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
    alignItems: "center",
    alignSelf: "center"
  },
  weekDayBorder: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#fff"
    // borderWidth: 2,
    // borderColor: "#9D9B9C"
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
    color: "#9D9B9C",
    textAlign: "center",
    paddingTop: 4
  },
  checkboxesGradient: {
    height: 8,
    width: 8,
    borderRadius: 10,
    backgroundColor: "#F7F8F9"
  }
});

OnboardingWeekDay.defaultProps = {
  style: {},
  styleBox: {}
};
export default OnboardingWeekDay;
