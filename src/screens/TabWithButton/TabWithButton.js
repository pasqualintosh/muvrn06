/**
 * TabWithButton è il componente Tab con il bottone con i mezzi insieme alla tab cosi
 * viene visualizzato solo in questo caso e non in altre view
 * @push
 */

import React from "react";
import { Image, Platform, View, Dimensions, StyleSheet } from "react-native";
import { connect } from "react-redux";

import Menu from "../TabNavigator/TabNavigator";

import ButtonPlayOrStop from "../../components/ButtonPlayOrStop/ButtonPlayOrStop";
import WavyArea from "../../components/WavyArea/WavyArea";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import Aux from "../../helpers/Aux";

// importo il pacchetto di icone Ionicons
import Icon from "react-native-vector-icons/Ionicons";

class TabWithButton extends React.Component {
  static navigationOptions = {
    header: null
  };
  renderAndroidAnimatedTabButton() {
    // Dimensions.get("window").width / 2 - 30
    // ovvero centro - 30 poiche il bottone è 60 di dimensioni
    // prendo altezza e larghezza dello schermo
    const { height, width } = Dimensions.get("window");
    // eventuale extra per sollevare l'onda sopra se si sta usando un dispositivo con tacca
    let extra = 0;
    // onda piu grande su plus o su altri device
    let heightPlus = 0;
    let style = {
      bottom: 15,
      left: width / 2 - 30
    };

    // stile per creare il layer sotto ai pulsanti cosi se si clicca fuori i pulsanti, si avvia la chiusura dei mezzi
    const LayerButton = {
      position: "absolute",
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
      left: -(width / 2) + 30,
      opacity: 0
    };
    if (Platform.OS === "android") {
      style = {
        bottom: 18,
        left: width / 2 - 30
      };
      extra = -20;
    }
    // iphone x, x max
  if (Platform.OS === "ios" && ((height === 812 || width === 812) || (height === 896 || width ===  896 ))) {
    extra = 35;
    style = {
      bottom: 18 + extra,
      left: width / 2 - 30
    };
  }

    if (Platform.OS === "ios")
      return (
        <Aux>
          {/* <Image
            style={{
              width: width,
              height: 55,
              position: "absolute",
              bottom: 34.5
            }}
            source={require("./../../assets/images/tab/drawable-xhdpi/tab-bar.png")}
          /> */}
          <Image
            style={{
              width: width * 0.3785,
              height: 30,
              position: "absolute",
              bottom: 34.5 + extra
            }}
            source={require("./../../assets/images/tab-bar_left.png")}
          />
          <Image
            style={{
              width: width * 0.248,
              left: width * 0.377,
              height: 55,
              position: "absolute",
              bottom: 34.5 + extra
            }}
            source={require("./../../assets/images/tab-bar_center.png")}
          />
          <Image
            style={{
              width: width * 0.3785,
              left: width * 0.6228,
              height: 30,
              position: "absolute",
              bottom: 34.5 + extra
            }}
            source={require("./../../assets/images/tab-bar_right.png")}
          />
          <ButtonPlayOrStop
            style={style}
            styleView={[
              LayerButton,
              {
                bottom: -18 - extra
              }
            ]}
          />
        </Aux>
      );
    else
      return (
        <ButtonPlayOrStop
          style={style}
          styleView={[
            LayerButton,
            {
              bottom: -18 - extra
            }
          ]}
        />
      );
  }

  render() {
    return (
      <Aux>
        <Menu />
      </Aux>
    );
  }
}

const Point = connect(state => {
  return {
    points: state.tracking.points,
    totPoints: state.tracking.totPoints
  };
});

const styles = StyleSheet.create({
  overlayWave: {
    width: Dimensions.get("window").width,
    height: 100
  }
});

const negativeData = [
  {
    value: 0
  },
  {
    value: 1500
  },
  {
    value: 2500
  },
  {
    value: 2800
  },
  {
    value: 2500
  },
  {
    value: 1500
  },
  {
    value: 0
  }
];

export default Point(TabWithButton);
