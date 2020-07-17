import React from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
  StyleSheet,
  Animated,
  Easing
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

class MotoEngine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.marginTopValue = new Animated.Value(0);
  }

  /**
   * muovo il contenitore principale verso il basso
   */
  animateToBottom() {
    this.marginTopValue.setValue(0);
    Animated.timing(this.marginTopValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear
    }).start();
  }

  /**
   * muovo il contenitore principale verso l alto
   */
  animateToTop() {
    this.marginTopValue.setValue(1);
    Animated.timing(this.marginTopValue, {
      toValue: 0,
      duration: 1000,
      easing: Easing.linear
    }).start();
  }

  componentWillReceiveProps(props) {
    if (this.props.animateEngine != props.animateEngine)
      if (props.animateEngine == true) {
        this.animateToBottom();
      } else {
        this.animateToTop();
      }
  }

  renderEngineCheckbox(val) {
    if (
      this.props.motoEnginePossibilities.includes(val) ||
      this.props.motoEnginePossibilities == null
    ) {
      return (
        <View style={styles.answerBoxes}>
          <TouchableWithoutFeedback
            onPress={() => this.props.handleMotoEngineChange(val)}
          >
            <View style={styles.checkboxesContainer}>
              <View
                style={[
                  styles.checkboxes,
                  {
                    backgroundColor: this.props.checkboxColor
                  }
                ]}
              >
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 0.0, y: 1 }}
                  locations={[0, 1.0]}
                  colors={["#E82F73", "#F49658"]}
                  style={[
                    styles.checkboxes,
                    {
                      opacity: this.props.motoEngineAnswer == val ? 1 : 0
                    }
                  ]}
                />
              </View>
              <Text style={styles.checkboxesText}>
                {val.replace(/_/g, " ")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    }
  }

  render() {
    const marginTop = this.marginTopValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 75]
    });
    return (
      <Animated.View
        style={{
          height: 33,
          width: Dimensions.get("window").width * 0.8,
          alignSelf: "center",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          marginTop,
          marginBottom: 5
        }}
      >
        <Text style={styles.segmentLabel}>Engine:</Text>
        {this.renderEngineCheckbox("2_stroke")}
        {this.renderEngineCheckbox("4_stroke")}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    height: 100,
    width: Dimensions.get("window").width * 0.8,
    alignSelf: "center",
    flexDirection: "row"
  },
  answerContainer: {
    height: 100,
    width: Dimensions.get("window").width * 0.5,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center"
  },
  yearContainer: {
    height: 100,
    width: Dimensions.get("window").width * 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  answerBoxes: {
    height: 20,
    width: Dimensions.get("window").width * 0.2,
    justifyContent: "center",
    alignContent: "center",
    marginHorizontal: 5
  },
  checkboxes: {
    height: 20,
    width: 20
    // backgroundColor: "#F7F8F9"
  },
  checkboxesText: {
    marginHorizontal: 5,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 11
  },
  checkboxesContainer: {
    height: 20,
    width: Dimensions.get("window").width * 0.3,
    flexDirection: "row"
  },
  segmentLabel: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3d3d3d",
    fontSize: 13
  },
  selectYearContainer: {
    height: 25,
    width: Dimensions.get("window").width * 0.2,
    // backgroundColor: "#F7F8F9",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default MotoEngine;
