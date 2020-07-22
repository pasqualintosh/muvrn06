import React from "react";
import { View, Dimensions } from "react-native";
import Svg, { G, Circle, Path } from "react-native-svg";
import WebService from "./../../config/WebService";
let IS_DEV = true;
WebService.url.includes("23.97.216.36") ? (IS_DEV = true) : (IS_DEV = false);

export function coefCO2(type) {
  switch (type) {
    case 1:
    case 2:
      // a piedi
      // in bici
      // un kilo corrisponde tot kg
      return 0.14285714;
      break;
    case 3:
    case 5:
    case 6:
    case 7:
      // mezzi pubblici
      return 0.07142857;
      break;
    default:
      return 0.14285714;
      break;
  }
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y
  ].join(" ");

  return d;
}

class PointedCircleSvg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(Dimensions.get("window").width * 0.45);

    let endAngle = 358,
      endStart = 0;

    const center = (Dimensions.get("window").width * 1) / 2,
      d2 = describeArc(
        0,
        0,
        Dimensions.get("window").width * 1 * 0.25,
        endStart,
        endAngle
      ),
      d3 = describeArc(
        0,
        0,
        Dimensions.get("window").width * 1 * 0.38,
        endStart,
        endAngle
      ),
      d4 = describeArc(
        0,
        0,
        Dimensions.get("window").width * 1 * 0.5,
        endStart,
        endAngle
      ),
      d5 = describeArc(
        0,
        0,
        Dimensions.get("window").width * 1 * 0.62,
        endStart,
        endAngle
      ),
      fill = "rgb(134, 65, 244)";

    return (
      <View
        style={{
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Svg
          height={Dimensions.get("window").width}
          width={Dimensions.get("window").width}
        >
          <G id="webCompatible2">
            <Path
              d={d2}
              transform={`translate(${center},${center})rotate(0)`}
              stroke="#fff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="0, 10"
            />
          </G>
          <G id="webCompatible3">
            <Path
              d={d3}
              transform={`translate(${center},${center})rotate(0)`}
              stroke="#fff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="0, 10"
            />
          </G>
          <G id="webCompatible4">
            <Path
              d={d4}
              transform={`translate(${center},${center})rotate(0)`}
              stroke="#fff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="0, 10"
            />
          </G>
          {/* <G id="webCompatible4">
            <Path
              d={d5}
              transform={`translate(${center},${center})rotate(0)`}
              stroke="#fff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="0, 10"
            />
          </G> */}
          {this.props.child}
        </Svg>
      </View>
    );
  }
}

export default PointedCircleSvg;
