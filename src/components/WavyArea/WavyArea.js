import React from "react";
// import { StackedAreaChart } from "react-native-svg-charts";
// import AreaStack from "./../AreaStack/AreaStack";
import * as shape from "d3-shape";
import { Platform } from "react-native";
import { StackedAreaChart } from "react-native-svg-charts";

export default class WavyArea extends React.Component {
  render() {
    const data = [
      {
        value: 1000
      },
      {
        value: 1800
      },
      {
        value: 600
      },
      {
        value: 200
      },
      {
        value: 600
      },
      {
        value: 1200
      },
      {
        value: 900
      }
    ];

    const colors =
      this.props.color != undefined ? [this.props.color] : ["#fff"];
    const keys = ["value"];

    return (
      <StackedAreaChart
        newData={this.props.newData ? this.props.newData : []}
        style={[
          {
            height: Platform.OS === "ios" ? 76 : 66
          },
          this.props.style
        ]}
        data={this.props.data != undefined ? this.props.data : data}
        keys={keys}
        colors={colors}
        curve={shape.curveNatural}
        showGrid={false}
        
      />
    );
  }
}
