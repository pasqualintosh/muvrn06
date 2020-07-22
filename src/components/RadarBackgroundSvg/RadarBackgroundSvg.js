import React from "react";
import { View, Dimensions, Animated } from "react-native";
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

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

class RadarBackgroundSvg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let endAngle = 358,
      endStart = 0;

    // vedo quanti cerchi devo fare
    const height = Dimensions.get("window").height;
    const dimSpace = 75;
    const numCircle = Math.ceil(height / 2 / dimSpace);
    const arrayCircle = Array.apply(null, Array(numCircle)).map(function(x, i) {
      return describeArc(0, 0, (i + 1) * dimSpace, endStart, endAngle);
    });
    const centerX = Dimensions.get("window").width / 2;
    const centerY = Dimensions.get("window").height / 2;
    const fill = "rgb(134, 65, 244)";

    const strokeOpacity = this.props.opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      
    });

    return (
      
      <View
        style={{
          position: "absolute",
          top: 0,
          height: Dimensions.get("window").height,
          width: Dimensions.get("window").width,
         //  opacity: 
        }}
      >
        <Svg
          height={Dimensions.get("window").height}
          width={Dimensions.get("window").width}
        >
          <AnimatedCircle
            cx={centerX}
            cy={(centerY + centerX) / 2}
            r="8"
            fill="none"
            stroke={this.props.colors[0]}
            strokeWidth="2"
            strokeOpacity={strokeOpacity}
          />
          {arrayCircle.map((elem, id) => {
            return (
              <G id={"webCompatible" + id} key={id}>
                <AnimatedPath
                  d={elem}
                  transform={`translate(${centerX},${(centerY + centerX) /
                    2})rotate(0)`}
                  stroke={this.props.colors[0]}
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="0, 10"
                  strokeOpacity={strokeOpacity}
                />
              </G>
            );
          })}

          {this.props.child}
        </Svg>
      </View>
    );
  }
}


RadarBackgroundSvg.defaultProps = {
  
  stroke: "#3363AD",
  colors: [`rgba(108, 186, 126, 1)`, `rgba(108, 186, 126, 0.4)`]
};

export default RadarBackgroundSvg;
