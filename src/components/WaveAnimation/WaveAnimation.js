import React from "react";
import { View, Dimensions, Platform } from "react-native";
import { Animated, Easing } from "react-native";
import LottieView from "lottie-react-native/src/js";

class WaveAnimation extends React.Component {
  constructor() {
    super();

    this.animationWrapperProgress = new Animated.Value(0);
    // per sapere se l'animazione è in avanti o in indietro, true in avanti
    this.mode = true;
    // se è stata stoppata l'animazione
    this.activeWave = true;
  }

  componentDidMount() {
    this.playAnimation();
  }

  componentWillReceiveProps(props) {
    const { type } = props;
    if (type === "") {
      this.animationWrapperProgress.stopAnimation();
    }
  }

  playAnimation() {
    Animated.timing(this.animationWrapperProgress, {
      toValue: 0.99,
      duration: 35000,
      easing: Easing.linear
    }).start(() => {
      this.mode = false;
      this.playBackAnimation();

      // console.log("==> Animation loop time: " + new Date());
    });
  }

  playBackAnimation() {
    Animated.timing(this.animationWrapperProgress, {
      toValue: 0.01,
      duration: 35000,
      easing: Easing.linear
    }).start(() => {
      this.mode = true;
      this.playAnimation();

      // console.log("==> Animation loop time: " + new Date());
    });
  }

  /* resumeAnimation() {
    console.log(this.animationWrapperProgress._value);

    if (this.mode) {
      console.log("indietro");
      Animated.timing(this.animationWrapperProgress, {
        toValue: 0.01,
        duration: 35000 - this.animationWrapperProgress * 35000,
        easing: Easing.linear
      }).start(() => {
        this.mode = true;
        this.playAnimation();

        // console.log("==> Animation loop time: " + new Date());
      });
    } else {
      console.log("avanti");
      Animated.timing(this.animationWrapperProgress, {
        toValue: 0.99,
        duration: 35000 - (0.99 - this.animationWrapperProgress) * 35000,
        easing: Easing.linear
      }).start(() => {
        this.mode = false;
        this.playBackAnimation();

        // console.log("==> Animation loop time: " + new Date());
      });
    }
  }

  // StatusButton

  componentWillReceiveProps(props) {
    const { StatusButton } = props;
    if (this.props.StatusButton !== StatusButton) {
      console.log("cambio");
      if (StatusButton && this.activeWave) {
        console.log("stop");
        this.activeWave = false;
        Animated.timing(this.animationWrapperProgress).stop();
        Animated.timing(this.animationWrapperProgress).stop();
      } else if (!StatusButton && !this.activeWave) {
        this.activeWave = true;
        console.log("riprendi");
        this.resumeAnimation();
      }
    }
  } */

  componentWillUnmount() {
    this.animationWrapperProgress.stopAnimation();
  }
  

  // supporto iphone x, max , l'onda la faccio partire un po piu sopra
  render() {
    return (
      <View
        style={{
          position: "absolute",
          top:
            Dimensions.get("window").height -
            (Platform.OS === "ios" &&
            ((Dimensions.get("window").height === 812 ||
              Dimensions.get("window").width === 812) || (Dimensions.get("window").height === 896 ||
              Dimensions.get("window").width === 896) )
              ? 400
              : 300)
        }}
      >
        <LottieView
          progress={this.animationWrapperProgress}
          hardwareAccelerationAndroid={true}
          renderToHardwareTextureAndroid={true}
          imageAssetsFolder={"lottie/animation_wave"}
          source={wavyJson[this.props.type ? this.props.type : "Walking"]}
          style={{
            height: 300,
            width: Dimensions.get("window").width
          }}
          enableMergePathsAndroidForKitKatAndAbove
        />
      </View>
    );
  }
}

const styles = {};

const wavyJson = {
  Walking: require("./../../assets/wavy_walk.json"),
  Biking: require("./../../assets/wavy_bike.json"),
  Public: require("./../../assets/wavy_public.json")
};

export default WaveAnimation;
