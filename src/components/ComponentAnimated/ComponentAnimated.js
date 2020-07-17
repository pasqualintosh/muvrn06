import React from "react";
import { View, Text, Animated, Button, TouchableHighlight } from "react-native";
import OwnIcon from "../OwnIcon/OwnIcon";
import LinearGradient from "react-native-linear-gradient";

class ComponentAnimated extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0), // Initial value for opacity: 0
    positionX: new Animated.Value(0), // Initial value for opacity: 0
    positionY: new Animated.Value(0), // Initial value for opacity: 0
    animated: false
  };

  onClickAnimated = () => {
    console.log(this.state);
    // setto la posizione inizale di questo componente
    // 0 e 0 si intende prendendo il punto in alto  a sinistra dell'oggetto
    // quindi è in alto a sinstra dello schermo
    // creo l'animazione passando la posizione iniziale e poi quella  finale mediante un oggetto
    // specificando la proprieta toValue con un oggetto con cordinate x e y
    // e poi faccio partire l'animazione
    // Spring cambia la posizione di un componente
    // di default l'animazione dura 1 secondi

    Animated.add(
      Animated.timing(this.state.positionX, {
        toValue: 200,
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
    this.setState(prevState => {
      return { animated: !prevState.animated };
    });
  };

  onClickAnimatedClose = () => {
    Animated.add(
      Animated.timing(this.state.positionX, {
        toValue: 0,
        duration: 1000
      }).start(),
      Animated.timing(this.state.positionY, {
        toValue: 0,
        duration: 1000
      }).start(),
      Animated.timing(
        // Animate over time
        this.state.fadeAnim, // The animated value to drive
        {
          toValue: 0, // Animate to opacity: 1 (opaque)
          duration: 1000 // Make it take a while
        }
      ).start()
    );
    this.setState(prevState => {
      return { animated: !prevState.animated };
    });
  };

  componentDidMount() {}

  render() {
    let { fadeAnim, positionX, positionY, animated } = this.state;

    return (
      <Animated.View // Special animatable View
        style={{
          opacity: fadeAnim, // Bind opacity to animated value
          position: "absolute"
        }}
      >
        <View
          style={{
            position: "relative"
          }}
        >
          <Animated.View // Special animatable View
            style={{
              opacity: fadeAnim, // Bind opacity to animated value
              position: "relative",
              paddingBottom: positionY,
              paddingLeft: positionX
            }}
          >
            <View
              style={{
                position: "relative"
              }}
            >
              <TouchableHighlight
                style={{ borderRadius: 25 }}
                onPress={
                  animated ? this.onClickAnimatedClose : this.onClickAnimated
                }
              >
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 0.0, y: 1.0 }}
                  locations={[0, 1.0]}
                  colors={["#e82f73", "#f49658"]}
                  style={{ elevation: 10, borderRadius: 25 }}
                >
                  <OwnIcon name="MUV_logo" size={48} color="#FFFFFF" />
                </LinearGradient>
              </TouchableHighlight>
            </View>
          </Animated.View>

          <Animated.View // Special animatable View
            style={{
              opacity: fadeAnim, // Bind opacity to animated value
              position: "absolute",
              paddingBottom: positionY,
              paddingRight: positionX
            }}
          >
            <View
              style={{
                position: "absolute"
              }}
            >
              <TouchableHighlight
                style={{ borderRadius: 25 }}
                onPress={
                  animated ? this.onClickAnimatedClose : this.onClickAnimated
                }
              >
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 0.0, y: 1.0 }}
                  locations={[0, 1.0]}
                  colors={["#e82f73", "#f49658"]}
                  style={{ elevation: 10, borderRadius: 25 }}
                >
                  <OwnIcon name="MUV_logo" size={48} color="#FFFFFF" />
                </LinearGradient>
              </TouchableHighlight>
            </View>
          </Animated.View>
        </View>
      </Animated.View>
    );
  }
}

const styles = {
  ballStyle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 25
  }
};

export default ComponentAnimated;
