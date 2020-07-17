import React from "react";
import { View, Dimensions } from "react-native";
import { LineChart, XAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { Circle, G, Line, Rect, Text } from "react-native-svg";

// Compontente per visualizzare un plot che interpolando i dati passati mediante una curva
// visualizza anche un cerchietto in un punto della curca e un popup con il punteggio a seconda dell'indice scelto dei dati passati

// props
// data , array delle y
// index, quale elemento delle y visualizzare con un popup nel grafico

class PlotPoint extends React.PureComponent {
  Tooltip = ({ x, y }, item, index) => (
    <G
      x={x(index) - 75 / 2}
      key={"tooltip"}
      onPress={() => console.log("tooltip clicked")}
      key={index}
    >
      <G y={y(item) + 40}>
        <Rect
          height={40}
          width={75}
          stroke={"#E83475"}
          fill={"white"}
          ry={10}
          rx={10}
        />
        <Text
          x={75 / 2}
          dy={20}
          alignmentBaseline={"middle"}
          textAnchor={"middle"}
          stroke={"#E83475"}
        >
          {`${item}pt`}
        </Text>
      </G>
      <G x={75 / 2}>
        <Circle
          cy={y(item)}
          r={6}
          stroke={"#E83475"}
          strokeWidth={2}
          fill={"white"}
        />
      </G>
    </G>
  );

  render() {
    data = [10, 30, 30, 10, 40, 10, 30, 30, 10];
    index = 2;

    /**
     * Both below functions should preferably be their own React Components
     */

    // curve utlizzabili insieme ai cerchi che rappresentano un punto preciso con il punteggio
    // curveCardinal
    // curveCatmullRom
    // curveNatural

    // altre tipi di curve https://github.com/d3/d3-shape#curves

    return (
      <View style={styles.grafico}>
        <LineChart
          style={{ flex: 1 }}
          data={data}
          svg={{
            stroke: "#E83475",
            strokeWidth: 2
          }}
          contentInset={{ top: 20, bottom: 20 }}
          curve={shape.curveCardinal}
          extras={[
            axis => this.Tooltip(axis, this.props.data[index], this.props.index)
          ]}
          showGrid={false}
        />
        <XAxis
          style={{ marginHorizontal: 0 }}
          data={data}
          formatLabel={value => "Mar" + ++value}
          contentInset={{ top: 20, bottom: 20 }}
          svg={{ fontSize: 10 }}
        />
      </View>
    );
  }
}

styles = {
  grafico: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2,
    padding: 20,
    backgroundColor: "white"
  }
};

// se non specificato i punti valgono 0
PlotPoint.defaultProps = {
  data: [10, 30, 30, 10, 40, 10, 30, 30, 10],
  index: 2
};

export default PlotPoint;
