import React from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import Svg, {
  G,
  Circle,
  LinearGradient,
  Line,
  Defs,
  Stop,
  Path,
  Rect,
  Polygon
} from "react-native-svg";

import { strings } from "../../config/i18n";

import WebService from "./../../config/WebService";

import { styles } from "./Style";
import Aux from "../../helpers/Aux";
import { alea } from "../../components/ListRecapActivity/ListRecapActivity";

function circlePath(cx, cy, r) {
  return (
    "M " +
    cx +
    " " +
    cy +
    " m -" +
    r +
    ", 0 a " +
    r +
    "," +
    r +
    " 0 1,0 " +
    r * 2 +
    ",0 a " +
    r +
    "," +
    r +
    " 0 1,0 -" +
    r * 2 +
    ",0"
  );
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

class DailyActivities extends React.Component {
  label = [
    "Need to get on with it…",
    "Start getting active",
    "It's time for a great performance",
    "Keep it up!",
    "Now you're getting somewhere!",
    "This is going to be legendary!",
    "That's being active!",
    "Just impressive!",
    "You're doing a masterpiece…",
    "You're on fire!",
    "Here's a true athlete!",
    "Nailed it!"
  ];

  randomFunc = alea(new Date().getHours());
  random = this.randomFunc();

  casualValue = parseInt(this.random * 3);

  render() {
    // const circle = Dimensions.get("window").width * 0.6;
    const circle = 250;
    const center = circle / 2;
    const radius = circle / 3;
    console.log(radius);
    console.log(center);
    // const d = `M ${center},0 A ${center},${center} 0 0 1 -${center},0 A ${center},${center} 0 0 1 ${center},0`;
    // const d = describeArc(circle,circle,circle, 0, 30)
    // con angle 0 non funziona, bisogna creare una circonferenza con i puntini
    // const angle = 10
    let endAngle = 360;
    let endStart = this.props.angle;
    let completeCircle = false;
    if (!this.props.angle) {
      endAngle = 359;
    } else {
      if (endStart >= 360) {
        endStart = 360;
        completeCircle = true;
      }
    }
    const d = describeArc(0, 0, 100, 0, endStart);
    const endCurve = polarToCartesian(0, 0, 100, this.props.angle);

    const d2 = describeArc(0, 0, 100, endStart, endAngle);
    const fill = "rgb(134, 65, 244)";

    let position = 0;
    if (this.props.minutes > 29) {
      position = 1;
    }
    if (this.props.minutes > 59) {
      position = 2;
    }
    if (this.props.minutes > 89) {
      position = 3;
    }
    console.log(position);
    console.log(this.casualValue);
    console.log(this.random);

    return (
      <View style={{ width: Dimensions.get("window").width, flexDirection: "column", alignContent: "center", justifyContent: 'center', alignSelf: "center",alignContent: "center", alignItems: "center"}}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>DAILY ACTIVITIES</Text>
        </View>
        <View
          onPress={() =>
            this.props.navigation.navigate("ChartsWavesScreenBlur")
          }
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.3 + 100,
              // flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Svg height={circle} width={circle}>
              <LinearGradient id="gradCicle" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#E82F73" stopOpacity="1" />
                <Stop offset="100%" stopColor="#F49658" stopOpacity="1" />
              </LinearGradient>
              <LinearGradient
                id="gradCicleArrow"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#7D4D99" stopOpacity="1" />
                <Stop offset="100%" stopColor="#6497CC" stopOpacity="1" />
              </LinearGradient>
              {completeCircle ? (
                <Aux>
                  <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="url(#gradCicle)"
                  />
                  <Circle
                    cx={center}
                    cy={center}
                    r={radius + 17}
                    fill="none"
                    stroke="url(#gradCicle)"
                    strokeWidth="7"
                  />
                </Aux>
              ) : (
                <Circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="url(#gradCicle)"
                />
              )}

              <G id="webCompatible2">
                <Path
                  d={d2}
                  // d="M 64,0 A 64,64 0 0 1 -64,0 A 64,64 0 0 1 64,0"
                  // transform={`translate(${center},${center})rotate(+90)`}
                  transform={`translate(${center},${center})rotate(0)`}
                  stroke="#3d3d3d"
                  strokeWidth="2"
                  fill="none"
                  // strokeLinecap='round'
                  // strokeLinejoin='bevel'
                  // strokeDashoffset='8'
                  // strokeDasharray={[2,2,2,2,2,2,2,2]}
                  strokeLinecap="round"
                  strokeDasharray="0, 10"
                />
              </G>
              <G id="webCompatible">
                <Path
                  d={d}
                  // d="M 64,0 A 64,64 0 0 1 -64,0 A 64,64 0 0 1 64,0"
                  // transform={`translate(${center},${center})rotate(+90)`}
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
              <G
                id="webCompatibleAwwor"
                transform={`translate(${endCurve.x + center},${endCurve.y +
                  center})rotate(${this.props.angle + 180})`}
              >
                <Line
                  x1="-2"
                  y1="0"
                  x2="1"
                  y2="3"
                  stroke="#ffffff"
                  strokeWidth="1"
                />
                <Line
                  x1="-2"
                  y1="0"
                  x2="1"
                  y2="-3"
                  stroke="#ffffff"
                  strokeWidth="1"
                />
              </G>
            </Svg>
          </View>
          
        </View>
        <View
          style={styles.centerCircleContainer}
          onPress={() =>
            this.props.navigation.navigate("ChartsWavesScreenBlur")
          }
        >
          <View>
            <Text style={styles.centerCircleValue}>{this.props.minutes}</Text>
            <Text style={styles.centerTextCircleParam}> Minutes</Text>
          </View>
        </View>
        
        <View style={styles.headerContainerActivities}>
          <Text style={styles.headerTextActivities}>
            {this.label[position * 3 + this.casualValue]}
          </Text>
        </View>
      </View>
    );
  }
}

DailyActivities.defaultProps = {
  angle: 180,
  minutes: 34
};

export default DailyActivities;
