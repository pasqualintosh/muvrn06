import React from "react";
import { View, Text, Platform, Dimensions, Image } from "react-native";
import { styles } from "./Style";
import { BoxShadow } from "react-native-shadow";

import { strings } from "../../config/i18n";

class TravelsStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let shadowOpt;
    if (Platform.OS == "ios")
      shadowOpt = {
        width: Dimensions.get("window").width * 0.8,
        height: 50,
        color: "#888",
        border: 4,
        radius: 5,
        opacity: 0.25,
        x: 0,
        y: 1
      };
    else
      shadowOpt = {
        width: Dimensions.get("window").width * 0.8,
        height: 50,
        color: "#444",
        border: 3,
        radius: 5,
        opacity: 0.35,
        x: 0,
        y: 1
      };
    return (
      <View style={styles.mainContainer}>
        <View style={styles.textContainer}>
          <View
            style={[
              styles.routesContainer,
              { justifyContent: "flex-start", alignItems: "flex-start" }
            ]}
          >
            <Text style={styles.co2Text}>{strings("id_5_11")}</Text>
          </View>
          <View style={styles.eniLogoContainer}>
            <View>
              <Text>
                <Text
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    color: "#69BB7C",
                    fontSize: 10,
                    textAlign: "left"
                  }}
                >
                  CO
                </Text>
                <Text
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    color: "#69BB7C",
                    fontSize: 7,
                    textAlign: "left"
                  }}
                >
                  2
                </Text>
              </Text>
              <Text>
                <Text
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    color: "#3d3d3d",
                    fontSize: 25,
                    textAlign: "left"
                  }}
                >
                  {roundUsing(Math.floor, this.props.CO2, 1)
                    .toString()
                    .replace(".", ",")}
                </Text>
                <Text
                  style={{
                    fontFamily: "OpenSans-Regular",
                    fontWeight: "400",
                    color: "#3d3d3d",
                    fontSize: 10,
                    textAlign: "left"
                  }}
                >
                  %
                </Text>
              </Text>
            </View>
          </View>
        </View>
        <BoxShadow setting={shadowOpt}>
          <View style={styles.boxContainer}>
            <View style={styles.routesContainer}>
              <Text style={styles.co2Text}>{strings("id_5_12")}</Text>
            </View>

            <View style={styles.eniLogoContainer}>
              <Image
                source={require("../../assets/images/Eni_logo.png")}
                style={{
                  width: 45,
                  height: 45
                }}
              />
            </View>
          </View>
        </BoxShadow>
      </View>
    );
  }
}

function roundUsing(func, number, prec) {
  var tempnumber = number * Math.pow(10, prec);
  tempnumber = func(tempnumber);
  return tempnumber / Math.pow(10, prec);
}

export default TravelsStats;
