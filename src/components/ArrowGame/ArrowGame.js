import React from "react";
import { View } from "react-native";

import Svg, { Circle, Polygon, Line } from "react-native-svg";

class ArrowGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let points =
      this.props.width / 2 +
      "," +
      45 +
      " " +
      this.props.width / 2 +
      "," +
      55 +
      " " +
      (this.props.width / 2 -
        (this.props.center ? 0 : this.props.right ? -10 : 10)) +
      "," +
      50 +
      " ";
    let y1 = "25";
    let y2 = "75";

    if (this.props.height === 80) {
      points =
        this.props.width / 2 +
        "," +
        35 +
        " " +
        this.props.width / 2 +
        "," +
        45 +
        " " +
        (this.props.width / 2 -
          (this.props.center ? 0 : this.props.right ? -10 : 10)) +
        "," +
        40 +
        " ";
      y1 = "20";

      y2 = "60";
    }
    return (
      <View>
        <Svg
          height={this.props.height}
          width={this.props.width}
          style={{
            // elevation: 4,
            shadowRadius: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5
          }}
        >
          <Line
            x1={this.props.width / 2}
            y1={y1}
            x2={this.props.width / 2}
            y2={y2}
            stroke={this.props.color}
            strokeWidth="2"
          />
          <Polygon
            points={points}
            fill={this.props.color}
            stroke={this.props.color}
            strokeWidth="1"
          />
        </Svg>
      </View>
    );
  }
}

ArrowGame.defaultProps = {
  width: 100,
  color: "#E83475",
  right: false,
  center: false,
  height: 100
};

export default ArrowGame;
