import React from "react";
import {
  View,
  Text,
  Animated,
  Button,
  TouchableHighlight,
  Dimensions
} from "react-native";
import OwnIcon from "../OwnIcon/OwnIcon";
import LinearGradient from "react-native-linear-gradient";

class ComponentAnimated4 extends React.Component {
  // setto i valori inziali di posizione x e y e opacita che avranno le icone e che cambieranno nel tempo
  state = {
    fadeAnim: new Animated.Value(0.5), // Initial value for opacity: 0
    positionX: new Animated.Value(0), // Initial value for opacity: 0
    positionY: new Animated.Value(0), // Initial value for opacity: 0
    animated: false
  };

  // click relativo all'avvio dell'animazione
  onClickAnimated = () => {
    // unisco tre animazioni relative a
    // x , y e opacita
    // in 500 ms il valore corrente nello stato deve diventare 100 nel corso del tempo
    Animated.spring();
    Animated.add(
      Animated.timing(this.state.positionX, {
        toValue: 100,
        duration: 500
      }).start(),
      Animated.timing(this.state.positionY, {
        toValue: 100,
        duration: 500
      }).start(),
      Animated.timing(
        // Animate over time
        this.state.fadeAnim, // The animated value to drive
        {
          toValue: 1, // Animate to opacity: 1 (opaque)
          duration: 500 // Make it take a while
        }
      ).start()
    );
    // poi setto che ho fatto l'animazione di apertura nello stato, utile per poi fare quella di chiusura
    this.setState(prevState => {
      return { animated: !prevState.animated };
    });
  };

  // relativa all'animazione di chiusura
  onClickAnimatedClose = () => {
    // riporto i valori a 0
    Animated.add(
      Animated.timing(this.state.positionX, {
        toValue: 0,
        duration: 500
      }).start(),
      Animated.timing(this.state.positionY, {
        toValue: 0,
        duration: 500
      }).start(),
      Animated.timing(
        // Animate over time
        this.state.fadeAnim, // The animated value to drive
        {
          toValue: 0, // Animate to opacity: 1 (opaque)
          duration: 500 // Make it take a while
        }
      ).start()
    );
    // cambia il valore dì animated dello stato per dire che ho chiuso il menu con l'animazione di chiusura
    this.setState(prevState => {
      return { animated: !prevState.animated };
    });
  };

  render() {
    // prendo dallo stato l'occorrente
    let { fadeAnim, positionX, positionY, animated } = this.state;

    // creo una view generica dove metto tutti le icone che devo muovere
    // ogni Animated.View per ogni icona, insieme alla view e Animated.View che li raccoglie tutti insieme
    // animated ? this.onClickAnimatedClose : this.onClickAnimated
    // per sapere quale animazione devo fare

    // le altre Animated.View oltre la prima per la prima icona sono position: "absolute", poiche sono una sopra l'altra

    return (
      <View
        style={{
          ...this.props.style,
          position: "absolute",
          bottom: 0,
          right: Dimensions.get("window").width / 2
        }}
      >
        <Animated.View // Special animatable View
          style={{
            position: "relative"
          }}
        >
          <View
            style={{
              position: "relative"
            }}
          >
            <TouchableHighlight
              style={{
                width: 48,
                height: 48,
                borderRadius: 48 / 2,
                alignSelf: "center"
              }}
              onPress={
                animated ? this.onClickAnimatedClose : this.onClickAnimated
              }
            >
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1.0 }}
                locations={[0, 1.0]}
                colors={["#e82f73", "#f49658"]}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 48 / 2,
                  alignSelf: "center"
                }}
              >
                <OwnIcon
                  name="MUV_logo"
                  size={48}
                  color="#FFFFFF"
                  style={{ alignSelf: "center" }}
                />
              </LinearGradient>
            </TouchableHighlight>
          </View>
        </Animated.View>

        <Animated.View // Special animatable View
          style={{
            opacity: fadeAnim, // Bind opacity to animated value
            position: "absolute",
            bottom: positionY,
            left: positionX
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
                style={{ borderRadius: 25 }}
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
            bottom: positionY,
            right: positionX
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
                style={{ borderRadius: 25 }}
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
            bottom: positionY,
            right: 0
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
                style={{ borderRadius: 25 }}
              >
                <OwnIcon name="MUV_logo" size={48} color="#FFFFFF" />
              </LinearGradient>
            </TouchableHighlight>
          </View>
        </Animated.View>
      </View>
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

export default ComponentAnimated4;
