import React from "react";
import {
  View,
  Text,
  Animated,
  Button,
  TouchableHighlight,
  Image,
  Dimensions
} from "react-native";
import OwnIcon from "../OwnIcon/OwnIcon";
import LinearGradient from "react-native-linear-gradient";

class ComponentAnimated2 extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0.5), // Initial value for opacity: 0
    positionX: new Animated.Value(0), // Initial value for opacity: 0
    positionY: new Animated.Value(0) // Initial value for opacity: 0
  };

  // usiamo componentWillMount per settare la posizione iniziale dell'oggetto
  onClickAnimated = () => {
    // setto la posizione inizale di questo componente
    // 0 e 0 si intende prendendo il punto in alto  a sinistra dell'oggetto
    // quindi è in alto a sinstra dello schermo
    this.position = new Animated.ValueXY(0, 0);
    // creo l'animazione passando la posizione iniziale e poi quella  finale mediante un oggetto
    // specificando la proprieta toValue con un oggetto con cordinate x e y
    // e poi faccio partire l'animazione
    // Spring cambia la posizione di un componente
    // di default l'animazione dura 1 secondi

    Animated.add(
      Animated.timing(this.state.positionX, {
        toValue: 0,
        duration: 1000
      }).start(),
      Animated.timing(this.state.positionY, {
        toValue: 200,
        duration: 1000
      }).start(),
      Animated.timing(
        // Animate over time
        this.state.fadeAnim, // The animated value to drive
        {
          toValue: 1, // Animate to opacity: 1 (opaque)
          duration: 1000 // Make it take a while
        }
      ).start()
    );
  };

  componentDidMount() {}

  render() {
    let { fadeAnim, positionX, positionY } = this.state;

    return (
      <Animated.Image // Special animatable View
        style={{
          opacity: fadeAnim, // Bind opacity to animated value
          marginBottom: positionY,
          marginLeft: positionX
        }}
      >
        <Image
          source={require("../../assets/images/bike-icon.png")}
          style={styles.image}
        />
      </Animated.Image>
    );
  }
}

const styles = {
  ballStyle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 25
  },
  image: {
    width: Dimensions.get("window").width / 2,
    height: Dimensions.get("window").height / 3
  }
};

export default ComponentAnimated2;
