import React from "react";
import {
  View,
  ImageBackground,
} from "react-native";

class ArrowGif extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const WinHome =
      this.props.total_point_home > this.props.total_point_away;
      const eveningMatch =   this.props.total_point_home == this.props.total_point_away;
    const DifferencePoint =
      Math.abs(
        this.props.total_point_home - this.props.total_point_away
      ) / 100;
    const widthArrow = DifferencePoint
      ? DifferencePoint > 40
        ? 50
        : DifferencePoint + 10
      : 10;
    
    return (
      <View
      style={{
        height: 100,
        width: 125,
        justifyContent: "center",
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        alignSelf: "center"
      }}
    >
      {!eveningMatch && WinHome ? (
        <ImageBackground
          source={require("../../assets/images/wave/stripe_white.gif")}
          style={{
            height: 20,
            width: widthArrow
          }}
        />
      ) : (
        <View style={{ height: 20, width: widthArrow }} />
      )}
      <View
        style={{ height: 40, width: 2, backgroundColor: "#FFFFFF" }}
      />
      {eveningMatch || WinHome ? (
        <View style={{ height: 20, width: widthArrow }} />
      ) : (
        <ImageBackground 
          source={require("../../assets/images/wave/stripe_white_inv.gif")}
          style={{
            height: 20,
            width: widthArrow
          }}
        />
      )}
    </View>
    );
  }
}

ArrowGif.defaultProps = {
  total_point_home: 10,
  total_point_away: 0,
};

export default ArrowGif;
