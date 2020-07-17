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

class CarSegment extends React.Component {
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
    if (this.props.animateSegment != props.animateSegment)
      if (props.animateSegment == true) {
        this.animateToBottom();
      } else {
        this.animateToTop();
      }
  }

  renderCheckbox(val) {
    if (
      this.props.carSegmentPossibilities.includes(val) ||
      this.props.carSegmentPossibilities == null
    )
      return (
        <View style={styles.answerBoxes}>
          <TouchableWithoutFeedback
            onPress={() => this.props.handleCarSegmentChange(val)}
          >
            <View style={styles.checkboxesContainer}>
              <View
                style={[
                  styles.checkboxes,
                  {
                    backgroundColor: this.props.checkboxColor
                      ? this.props.checkboxColor
                      : "#F7F8F9"
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
                      opacity: this.props.carSegmentAnswer == val ? 1 : 0
                    }
                  ]}
                />
              </View>
              <Text style={styles.checkboxesText}>{val}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
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
        <Text style={styles.segmentLabel}>Segment:</Text>
        {this.renderCheckbox("mini")}
        {this.renderCheckbox("small")}
        {this.renderCheckbox("medium")}
        {this.renderCheckbox("large")}
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
  answerBoxes: {
    height: 20,
    width: Dimensions.get("window").width * 0.17,
    justifyContent: "center",
    alignContent: "center"
  },
  checkboxes: {
    height: 20,
    width: 20
  },
  checkboxesText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 11,
    marginHorizontal: 1
  },
  checkboxesContainer: {
    height: 20,
    width: Dimensions.get("window").width * 0.17,
    flexDirection: "row"
  },
  segmentLabel: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3d3d3d",
    fontSize: 13
  }
});

export default CarSegment;
