import React from "react";
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
  ImageBackground,
  Platform,
  Button
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

class TransportModes extends React.Component {
  constructor() {
    super();
    this.state = { active: false };
  }

  _onPressButton = () => {
    const status = !this.state.active;
    this.setState(previousState => {
      return { active: !previousState.active };
    });

    // mi salvo se quel bottone con quel titolo è stato cliccato

    this.props.clickModes(this.props.label, status);
  };
  render() {
    if (this.state.active) {
      return (
        <View>
          <TouchableWithoutFeedback onPress={this._onPressButton}>
            <View style={{ flexDirection: "row" }}>
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.0, y: 1.0 }}
                locations={[0, 1.0]}
                colors={["#e82f73", "#f49658"]}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25
                }}
              >
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    position: "relative",

                    right: -5,
                    top: 5
                  }}
                  source={this.props.img}
                />
              </LinearGradient>

              <LinearGradient
                start={{ x: 0.0, y: -0.2 }}
                end={{ x: 0.0, y: 1.2 }}
                locations={[0.0, 1.0]}
                colors={["#e82f73", "#f49658"]}
                style={{
                  height: 30,
                  position: "relative",
                  top: 10,
                  right: 5,

                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    flexDirection: "column",
                    alignContent: "center",
                    alignSelf: "center",
                    height: 30,
                    marginRight: 10,
                    marginLeft: 10,
                    elevation: 2
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      textAlign: "center",
                      fontSize: 12,
                      fontFamily: "OpenSans-Regular"
                    }}
                  >
                    {this.props.title}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    } else {
      return (
        <View>
          <TouchableWithoutFeedback onPress={this._onPressButton}>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: "white",
                  elevation: 2,
                  shadowRadius: 5,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 0.5
                }}
              >
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    position: "relative",

                    right: -5,
                    top: 5
                  }}
                  source={this.props.img}
                />
              </View>

              <View
                style={{
                  // width: 100,
                  height: 30,
                  position: "relative",
                  top: 10,
                  right: 5,
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                  backgroundColor: "white",
                  elevation: 2,
                  shadowRadius: 5,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 0.0
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    flexDirection: "column",
                    alignContent: "center",
                    alignSelf: "center",
                    height: 30,
                    marginRight: 10,
                    marginLeft: 10,
                    elevation: 2
                  }}
                >
                  <Text
                    style={{
                      color: "#3D3D3D",
                      textAlign: "center",
                      fontSize: 12,
                      fontFamily: "OpenSans-Regular"
                    }}
                  >
                    {this.props.title}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    }
  }
}

TransportModes.defaultProps = {
  title: "LOCAL PUBLIC TRANSPORT",
  subtitle: "uber",
  img: require("../../assets/images/bus_icn.png")
};

export default TransportModes;
