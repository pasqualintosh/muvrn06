import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import OwnIcon from "./../OwnIcon/OwnIcon";

class RedFlagChallenges extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.0, y: 1 }}
        locations={[0, 1.0]}
        colors={[this.props.colorStart, this.props.colorEnd]}
        style={{
          width: this.props.width,
          height: this.props.height,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          right: -2,
          bottom: Dimensions.get("window").height * 0.06 + 15 // 1/2 dell'altezza del contenitore
        }}
      >
        <OwnIcon name={this.props.icon} size={25} color={this.props.color} />
      </LinearGradient>
    );
  }
}

RedFlagChallenges.defaultProps = {
  color: "#fff",
  colorStart: "#E82F73",
  colorEnd: "#F49658",
  icon: 'challenges_icn_active'
};

export default RedFlagChallenges;
