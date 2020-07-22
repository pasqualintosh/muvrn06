// componente per visualizzare un onda che permette di invitare degli amici

import React from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Platform,
  ImageBackground,
  Linking,
  TouchableHighlight,
  ActivityIndicator
} from "react-native";

import Svg, {
  Circle,
  LinearGradient,
  Line,
  Defs,
  Stop
} from "react-native-svg";

import { styles } from "./Style";

import Aux from "./../../helpers/Aux";

class SVGFrequentTripIcon extends React.PureComponent {
  render() {
    return (
      <View>
        <Svg height="40" width="40">
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="10" y2="0">
              <Stop offset="0" stopColor="#7D4D99" stopOpacity="1" />
              <Stop offset="1" stopColor="#6497CC" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="grad2" x1="0" y1="0" x2="10" y2="0">
              <Stop offset="0" stopColor="#E82F73" stopOpacity="1" />
              <Stop offset="1" stopColor="#F49658" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Circle cx="5" cy="5" r="5" fill="url(#grad)" />
          <Line
            x1="5"
            y1="11"
            x2="5"
            y2="15"
            stroke="#3D3D3D"
            strokeWidth="1"
          />
          <Line
            x1="5"
            y1="17"
            x2="5"
            y2="21"
            stroke="#3D3D3D"
            strokeWidth="1"
          />
          <Line
            x1="5"
            y1="23"
            x2="5"
            y2="27"
            stroke="#3D3D3D"
            strokeWidth="1"
          />
          <Circle cx="5" cy="33" r="5" fill="url(#grad2)" />
        </Svg>
      </View>
    );
  }
}

export default SVGFrequentTripIcon;
