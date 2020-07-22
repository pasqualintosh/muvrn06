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
    let endAngle = 359,
      endStart = 0,
      completeCircle = false;

    const circle = 250,
      center = circle / 2,
      radius = circle / 3,
      d = describeArc(0, 0, 100, 0, endStart),
      d2 = describeArc(0, 0, 100, endStart, endAngle),
      endCurve = polarToCartesian(0, 0, 100, 0),
      fill = "rgb(134, 65, 244)";

    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.3 + 100,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Svg height={circle} width={circle}>
          <Circle cx={center} cy={center} r={radius} fill="url(#gradCicle)" />
          <G id="webCompatible2">
            <Path
              d={d2}
              transform={`translate(${center},${center})rotate(0)`}
              stroke="#3d3d3d"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="0, 10"
            />
          </G>
          <G id="webCompatible">
            <Path
              d={d}
              transform={`translate(${center},${center})rotate(0)`}
              stroke="url(#gradCicle)"
              strokeWidth="7"
              fill="none"
            />
          </G>

          <Circle
            cx={endCurve.x}
            cy={endCurve.y}
            r={6}
            fill="url(#gradCicleArrow)"
            transform={`translate(${center},${center})rotate(0)`}
          />
          {this.props.child}
        </Svg>
      </View>
    );
  }
}

export default PointedCircleSvg;
