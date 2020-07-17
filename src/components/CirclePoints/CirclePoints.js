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

// componente per visualizzare dei cerchi con differenti colori al cui centro i punti

// props
// points, punti da visualizzare

// in caso fare delle props per i colori da visualizzare
// color, un array con i valori rgba
// colorCircle , colore del cerchio principale dentro gli altri cerchi tipo green

// usando i colori con la trasperenza alfa, accede che se ci sono piu colori uno sopra l'altro, si uniscono in un unico colore
// altrimenti usare i colori esadecimali

// esempio
// <CirclePoints color={[250, 178, 30, 0.05]} colorCircle="yellow" /> giallo
// <CirclePoints color={[255, 0, 0, 0.05]} colorCircle="red" /> rosso
// <CirclePoints color={[0, 255, 0, 0.05]} colorCircle="green" /> verde

class CirclePoints extends React.Component {
  state = {
    fadeAnim: new Animated.Value(1), // Initial value for opacity: 0
    animated: false
  };
  componentDidMount() {
    requestAnimationFrame(() => {
      Animated.sequence([
        Animated.timing(
          // Animate over time
          this.state.fadeAnim, // The animated value to drive
          {
            toValue: 0.1, // Animate to opacity: 1 (opaque)
            duration: 1500, // Make it take a while
            useNativeDriver: true
          }
        ),
        Animated.timing(
          // Animate over time
          this.state.fadeAnim, // The animated value to drive
          {
            toValue: 1, // Animate to opacity: 1 (opaque)
            duration: 1500, // Make it take a while
            useNativeDriver: true
          }
        )
      ]).start();
    }, 3000);
  }

  render() {
    let { fadeAnim, animated } = this.state;
    let { color, colorCircle } = this.props;

    return (
      <Animated.View
        style={{
          flex: 1,
          alignContent: "center",
          alignSelf: "center",
          opacity: fadeAnim
        }}
      >
        <View style={styles.icon}>
          <OwnIcon name="MUV_logo" size={30} color="black" />
        </View>
        <View
          style={[
            styles.circle,
            {
              backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${
                color[3]
              })`
            }
          ]}
        >
          <View
            style={[
              styles.circle2,
              {
                backgroundColor: `rgba(${color[0]}, ${color[1]}, ${
                  color[2]
                }, 0.1)`
              }
            ]}
          >
            <View
              style={[
                styles.circle3,
                {
                  backgroundColor: `rgba(${color[0]}, ${color[1]}, ${
                    color[2]
                  }, 0.3)`
                }
              ]}
            >
              <View
                style={[
                  styles.circle4,
                  {
                    backgroundColor: `${colorCircle}`
                  }
                ]}
              >
                <View
                  style={[
                    styles.circle5,
                    {
                      backgroundColor: `rgba(${color[0]}, ${color[1]}, ${
                        color[2]
                      }, 0.3)`
                    }
                  ]}
                >
                  <View style={styles.circle6}>
                    <View style={styles.TextView}>
                      <Text style={styles.Punti}>{this.props.points}</Text>

                      <Text style={styles.Pt}>pt </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }
}

// se non specificato i punti valgono 0
CirclePoints.defaultProps = {
  points: 0,
  color: [0, 255, 0, 0.05],
  colorCircle: "green"
};

const styles = {
  circle: {
    width: Dimensions.get("window").width / 1.2,
    height: Dimensions.get("window").width / 1.2,
    borderRadius: Dimensions.get("window").width / 1.2,
    justifyContent: "center",
    alignItems: "center"
  },
  circle2: {
    width: Dimensions.get("window").width / 1.4,
    height: Dimensions.get("window").width / 1.4,
    borderRadius: Dimensions.get("window").width / 1.4,
    justifyContent: "center",
    alignItems: "center"
  },
  circle3: {
    width: Dimensions.get("window").width / 1.6,
    height: Dimensions.get("window").width / 1.6,
    borderRadius: Dimensions.get("window").width / 1.6,
    justifyContent: "center",
    alignItems: "center"
  },
  circle4: {
    width: Dimensions.get("window").width / 1.8,
    height: Dimensions.get("window").width / 1.8,
    borderRadius: Dimensions.get("window").width / 1.8,
    justifyContent: "center",
    alignItems: "center"
  },
  circle5: {
    width: Dimensions.get("window").width / 1.85,
    height: Dimensions.get("window").width / 1.85,
    borderRadius: Dimensions.get("window").width / 1.85,
    justifyContent: "center",
    alignItems: "center"
  },
  circle6: {
    width: Dimensions.get("window").width / 2,
    height: Dimensions.get("window").width / 2,
    borderRadius: Dimensions.get("window").width / 2,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center"
  },
  TextView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    flexDirection: "row"
  },
  Punti: {
    fontSize: 30
  },
  Pt: {
    paddingBottom: 15,
    fontSize: 14
  },
  icon: {
    width: Dimensions.get("window").width / 10,
    height: Dimensions.get("window").width / 10,
    borderRadius: Dimensions.get("window").width / 10,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: Dimensions.get("window").width / 1.4,
    top: Dimensions.get("window").width / 7,
    zIndex: 5,
    elevation: 2
  }
};

export default CirclePoints;
