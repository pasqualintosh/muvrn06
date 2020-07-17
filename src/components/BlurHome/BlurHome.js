/**
 * BlurHome è il componente per realizzare l'effetto blur sull'interfaccia
 * quando si è sulla home e riceve un parametro per indicare il valore del blur
 * @push
 */

// ValueBlur
// valore del blur d'applicare

import React from "react";
import {
  Image,
  Platform,
  View,
  Dimensions,
  StyleSheet,
  findNodeHandle
} from "react-native";
import { connect } from "react-redux";
import { BlurView, VibrancyView } from "@react-native-community/blur";

class BlurHome extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  componentDidMount() {
    this.setState({ viewRef: findNodeHandle(this) });
  }
  // blurAmount={this.props.ValueBlur - 1} perche il valore iniziale di blur è 0 e io inizio con i valori da 1
  // cosi copro da 0 a 5 per ios
  // android parte da 1 e quindi da 1 a 6

  render() {
    let ViewBlur = null;
    if (this.props.ValueBlur > 0) {
      ViewBlur = (
        <BlurView
          style={styles.absolute}
          blurType="light"
          viewRef={this.props.viewRef}
          blurAmount={
            Platform.OS === "ios"
              ? this.props.ValueBlur - 1
              : this.props.ValueBlur
          }
        />
      );
    }
    return ViewBlur;
  }
}

export default BlurHome;

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});
