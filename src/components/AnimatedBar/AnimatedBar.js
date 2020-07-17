import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";

class AnimatedBar extends React.Component {
  state = {
    animation: new Animated.Value(this.props.progress)
  };

  componentWillMount() {
    this.widthInterpolate = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"],
      extrapolate: "clamp"
    });
  }

  componentDidMount() {
    this.attachListener();
  }

  attachListener = () => {
    this.removeListeners();

    if (typeof this.props.onAnimate === "function") {
      this.attachListener(this.props.onAnimate);
    }
  };
  removeListeners = () => {
    this.state.animation.removeAllListeners();
  };
  componentWillUnmount() {
    this.removeListeners();
  }

  componentDidUpdate(prevProps, prevState) {
    //If our function changes then attach the new one
    if (prevProps.onAnimate !== this.props.onAnimate) {
      this.attachListener();
    }

    //If our progress has changed we should animate
    if (prevProps.progress !== this.props.progress) {
      if (this.props.animate) {
        Animated.timing(this.state.animation, {
          toValue: this.props.progress,
          duration: this.props.duration
        }).start();
      } else {
        this.state.animation.setValue(this.props.progress);
      }
    }
  }

  render() {
    const {
      children,
      height,
      borderColor,
      borderWidth,
      borderRadius,
      barColor,
      fillColor,
      row,
      style,
      wrapStyle,
      fillStyle,
      barStyle,
      width
    } = this.props;

    return (
      <Animated.View
        style={[
          styles.outer,
          { height, position: "absolute", top: 0 },
          row ? styles.flex : undefined,
          style,
          { width }
        ]}
      >
        <TouchableWithoutFeedback onPress={evt => this.props.handleClick(evt)}>
          <Animated.View
            style={[
              styles.flex,
              { borderColor, borderWidth, borderRadius },
              wrapStyle
            ]}
          >
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: fillColor },
                fillStyle
              ]}
            />
            <Animated.View
              style={[
                styles.bar,
                {
                  width: this.widthInterpolate,
                  backgroundColor: barColor
                },
                barStyle
              ]}
            />
            {children}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start"
                // alignItems: "center"
              }}
            >
              <Text
                style={{
                  width,
                  alignSelf: "center",
                  position: "absolute",
                  textAlign: "center",
                  color: "#9D9B9C70",
                  fontFamily: "Montserrat-ExtraBold",
                  fontSize: 15
                }}
              >
                {this.props.modalSplit}
              </Text>
              <View
                style={{
                  height: height - 2,
                  width: 1,
                  left: Dimensions.get("window").width * 0.15,
                  backgroundColor: "#F7F8F9"
                }}
              />
              <View
                style={{
                  height: height - 2,
                  width: 1,
                  left: Dimensions.get("window").width * 0.3 - 2,
                  backgroundColor: "#F7F8F9"
                }}
              />
              <View
                style={{
                  height: height - 2,
                  width: 1,
                  left: Dimensions.get("window").width * 0.45 - 4,
                  backgroundColor: "#F7F8F9"
                }}
              />
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  outer: {
    flexDirection: "row"
  },
  flex: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#F7F8F9"
  },
  bar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0
  }
});

AnimatedBar.defaultProps = {
  height: 10,
  borderColor: "#fff",
  borderWidth: 1,
  borderRadius: 0,
  barColor: "#FFF",
  fillColor: "rgba(0,0,0,.5)",
  duration: 100,
  animate: true
};

export default AnimatedBar;
