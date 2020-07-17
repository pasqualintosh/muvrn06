/**
 * Blur è il componente per realizzare l'effetto blur sull'interfaccia
 * quando si clicca sul pulsante
 * @push
 */

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

class Blur extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewRef: null, value: 0 };
  }

  componentDidMount() {
    this.setState({ viewRef: findNodeHandle(this) });
  }

  // blurAmount={this.state.value - 1} perche il valore iniziale di blur è 0 e io inizio con i valori da 1
  // cosi copro da 0 a 5 per ios
  // android parte da 1 e quindi da 1 a 6

  // se il blur non funziona, aggiungere alla stile della view backgroundColor: "transparent"
  // oppure con un colore tipo backgroundColor: "#F7F8F9" cosi lo applica a tutta la screen

  componentWillReceiveProps(props) {
    let Animate;
    if (this.props.Status !== props.Status) {
      if (props.Status) {
        if (Animate) {
          clearTimeout(Animate);
        }
        Animate = requestAnimationFrame(() => {
          this.setState(prevState => {
            if (prevState.value >= 3) {
              clearTimeout(Animate);
            } else {
              return { value: prevState.value + 1 };
            }
          });
        }, 100);
      } else {
        if (Animate) {
          clearTimeout(Animate);
        }
        Animate = requestAnimationFrame(() => {
          this.setState(prevState => {
            if (prevState.value <= 0) {
              clearTimeout(Animate);
            } else {
              return { value: prevState.value - 1 };
            }
          });
        }, 100);
      }
    }
  }

  render() {
    let ViewBlur = null;
    if (this.state.value > 0) {
      ViewBlur = (
        <BlurView
          style={styles.absolute}
          blurType="light"
          viewRef={this.props.viewRef}
          blurAmount={
            Platform.OS === "ios" ? this.state.value + 1 : this.state.value
          }
        />
      );
    }

    return ViewBlur;
  }
}
// prendo quando l'utente ha cliccato o no il bottome play
const Status = connect(state => {
  return {
    Status: state.login.StatusButton
  };
});

export default Status(Blur);

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});
