import * as React from "react";
import Svg, { Defs, Path } from "react-native-svg";

class WaveBottomLive extends React.Component {
  render() {
    return (
      <Svg viewBox="0 0 300 200" {...this.props}>
        <Path
          d="M0 200h300V95.3C275 55.2 235 .7 201.3 0 147.8-1.1 65.5 90.7 65.5 90.7S39 134.2 0 123.2V200z"
          opacity={0.4}
          fill={this.props.colors[0]}
        />
        <Path
          d="M0 200h300v-69.4S209.4 38 117.7 54.9C51.6 67.2 31.3 99.9 0 118.6V200z"
          fill={this.props.colors[0]}
        />
      </Svg>
    );
  }
}
WaveBottomLive.defaultProps = {
  colors: [`rgba(108, 186, 126, 1)`, `rgba(108, 186, 126, 0.4)`],
};

export default WaveBottomLive;
