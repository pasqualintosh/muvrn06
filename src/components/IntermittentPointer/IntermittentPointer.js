import React from "react";
import { Animated } from "react-native";

class IntermittentPointer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(1)
    };
  }
  componentWillMount() {
    this.pointAnimate();
  }
  componentWillUnmount() {
    this.setState({ opacity: new Animated.Value(1) });
  }
  pointAnimate = () => {
    /* Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(this.state.opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        })
      ])
    ).start(); */
    this.props.updateCurrentTimeAnimation();
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 1000
    }).start(() => {
      this.props.updateCurrentTimeAnimation();
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 1000
      }).start(() => {
        this.props.updateCurrentTimeAnimation();
        this.pointAnimate();
      });
    });
  };

  render() {
    return (
      <Animated.View
        style={[...this.props.styles, { opacity: this.state.opacity }]}
      />
    );
  }
}

export default IntermittentPointer;
