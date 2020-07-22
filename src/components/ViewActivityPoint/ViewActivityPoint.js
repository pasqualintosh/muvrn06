import React from "react";
import {
  View,
  Text,
  Animated,
  Button,
  TouchableHighlight,
  Dimensions,
  ImageBackground,
  Image
} from "react-native";
import OwnIcon from "../OwnIcon/OwnIcon";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { strings } from "../../config/i18n";
import SvgWaveTopNotification  from "../SvgWaveTopNotification/SvgWaveTopNotification";

// componente per visualizzare i punti che ho guadagnato in questo preciso momento

// props
// title titolo della notifica
// descr descrizione della notifica
// point punti ottenuti
// color colore della view
// color1, insieme a color1 per fare il gradient
// click azione collegata all'icona della notifica

// color lo passa allo stile inline di view

class ViewActivityPoint extends React.Component {
  render() {
    return (
      <View style={styles.viewAll}>
        <SvgWaveTopNotification
          color={this.props.color}
        />
        <View
          // colors={[this.props.color, this.props.color1]}
          style={[styles.view, { backgroundColor: this.props.color }]}
        />
        <View style={styles.viewContent}>
          <View>
            <Text style={styles.textTitle}>{strings("id_1_20")}</Text>
            {/* <Text style={styles.textDescr}>{this.props.descr}</Text> */}
          </View>
          <View />

          {this.props.isMetro ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../assets/images/puntini_bianchi.gif")}
                style={{
                  height: 12,
                  width: 20
                }}
              />
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.points}>{this.props.point.toFixed(0)}</Text>
              <Text style={styles.pt}>pt</Text>
            </View>
          )}

          <TouchableHighlight
            style={styles.icon}
            onPress={() => this.props.click()}
          >
            <Icon
              name="ios-arrow-forward"
              size={30}
              color="white"
              onPress={() => this.props.click()}
            />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const image = {
  "#6CBA7E": require("../../assets/images/wave/live_wave_walk.png"),
  "#FAB21E": require("../../assets/images/wave/live_wave_bus.png"),
  "#E83475": require("../../assets/images/wave/live_wave_bike.png")
};

const styles = {
  viewAll: {
    width: Dimensions.get("window").width,
    height: 85
  },
  viewContent: {
    width: Dimensions.get("window").width,
    height: 85,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    top: -85
  },
  sfondo: {
    width: Dimensions.get("window").width,
    height: 25
  },
  view: {
    width: Dimensions.get("window").width,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  textTitle: {
    fontSize: 15,
    color: "white"
  },
  textDescr: {
    fontSize: 12,
    color: "white"
  },
  points: {
    fontSize: 20,
    color: "white"
  },
  pt: {
    fontSize: 16,
    color: "white",
    marginTop: 5
  },
  icon: {}
};

// se non specificato
ViewActivityPoint.defaultProps = {
  title: "Great, friend!             ",
  descr: "You are on the right track!",
  point: 0,
  color: "rgba(108, 186, 126, 1)",
  click: null
};

export default ViewActivityPoint;
