import React from "react";
import {
  Text,
  Dimensions,
  Platform,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableWithoutFeedback
} from "react-native";

import { strings } from "../../config/i18n";

import AutoAnimation from "./../../components/AutoAnimation/AutoAnimation";


function roundUsing(func, number, prec) {
  var tempnumber = number * Math.pow(10, prec);
  tempnumber = func(tempnumber);
  return tempnumber / Math.pow(10, prec);
}

class SustainabilitySection extends React.Component {
  render() {
    return (
      <View
        style={{
          // marginTop: 300,
          // height: 400,
          justifyContent: "flex-start",
          alignItems: "center",
          width: Dimensions.get("window").width,
          // position: 'absolute',
          top: -35
        }}
      >
        <Image
          source={require("../../assets/images/wave/green_wave_top.png")}
          style={styles.backgroundImageTop}
        />
        <View style={styles.View}>
          <View style={styles.FirstView}>
            <Text
              style={{
                fontFamily: "Montserrat-ExtraBold",
                color: "#fff",
                fontSize: 20,
                textAlign: "left"
              }}
            >
              {strings("id_5_07").toUpperCase()}
            </Text>
          </View>

          <View style={styles.SecondView}>
            <View
              style={{
                width: Dimensions.get("window").width * 0.8,
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  width: Dimensions.get("window").width * 0.8 - 90
                }}
              >
                <Text>
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontWeight: "700",
                      color: "#FFFFFF",
                      fontSize: 12,
                      textAlign: "left"
                    }}
                  >
                    {strings("id_5_08")}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "OpenSans-Regular",
                      fontWeight: "400",
                      color: "#FFFFFF",
                      fontSize: 12,
                      textAlign: "left"
                    }}
                  >
                    {"\n" + strings("id_5_09")}
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  width: 10,
                  height: 10
                }}
              />
              <View
                style={{
                  flexDirection: "column",
                  width: 80,
                  alignContent: "flex-end",
                  justifyContent: "center",
                  alignItems: "flex-end"
                }}
              >
                <View>
                  <Text>
                    <Text
                      style={{
                        fontFamily: "Montserrat-ExtraBold",
                        color: "#3D3D3D",
                        fontSize: 10,
                        textAlign: "left"
                      }}
                    >
                      CO
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Montserrat-ExtraBold",
                        color: "#3D3D3D",
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
                        color: "#FFFFFF",
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
                        color: "#FFFFFF",
                        fontSize: 10,
                        textAlign: "left"
                      }}
                    >
                      Kg
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
            <AutoAnimation />
          </View>

          <View style={styles.FirstView}>
            <Text
              style={{
                fontFamily: "Montserrat-ExtraBold",
                color: "#fff",
                fontSize: 20,
                textAlign: "left"
              }}
            >
              {strings("id_5_10").toUpperCase()}
            </Text>
          </View>

          <View
            style={{
              width: Dimensions.get("window").width * 0.8,
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                width: Dimensions.get("window").width * 0.8 - 90
              }}
            >
              <Text
                style={{
                  fontFamily: "OpenSans-Regular",
                  fontWeight: "400",
                  color: "#FFFFFF",
                  fontSize: 12,
                  textAlign: "left"
                }}
              >
                {"\n" + strings("id_5_18")}
              </Text>
            </View>
            <View
              style={{
                width: 10,
                height: 10
              }}
            />
            <View
              style={{
                flexDirection: "column",
                width: 80,
                alignContent: "flex-end",
                justifyContent: "center",
                alignItems: "flex-end"
              }}
            >
              {/* <View>
                <Text>
                  <Text
                    style={{
                      fontFamily: "Montserrat-ExtraBold",
                      color: "#3D3D3D",
                      fontSize: 10,
                      textAlign: "left"
                    }}
                  >
                    CO
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Montserrat-ExtraBold",
                      color: "#3D3D3D",
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
                      color: "#FFFFFF",
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
                      color: "#FFFFFF",
                      fontSize: 10,
                      textAlign: "left"
                    }}
                  >
                    Kg
                  </Text>
                </Text>
              </View> */}
            </View>
          </View>
          {/* {this.renderEniStats()} */}
          <View style={{ height: 80 }}></View>
         
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerTextContainer: {
    position: "absolute",
    // top: 100
    top:
      Dimensions.get("window").height * 0.6 +
      115 +
      Dimensions.get("window").width * 0.35,
    left: Dimensions.get("window").width * 0.5 - 39,
    width: 78
  },
  centerValue: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#fff",
    fontSize: 37,
    textAlign: "center",
    textAlignVertical: "center"
  },
  centerTextParam: {
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
    fontWeight: "400",
    color: "#fff",
    fontSize: 8,
    fontWeight: "bold"
  },
  backgroundImageTop: {
    height: 35,
    width: Dimensions.get("window").width
  },
  View: {
    backgroundColor: "#6CBA7E",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "center",
    height: 350 + 180, // padding finale 
    width: Dimensions.get("window").width
  },
  FirstView: {
    backgroundColor: "#6CBA7E",
    justifyContent: "center",
    alignItems: "flex-start",
    alignContent: "center",
    height: 40,
    width: Dimensions.get("window").width * 0.8
  },
  OtherView: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: 40,
    width: Dimensions.get("window").width
  },
  SecondView: {
    backgroundColor: "#6CBA7E",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: 90,
    width: Dimensions.get("window").width
  },
  LastView: {
    backgroundColor: "#6CBA7E",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: 30,
    width: Dimensions.get("window").width
  },
  boxContainer: {
    width: Dimensions.get("window").width * 0.8,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F8F9",
    borderRadius: 4,
    shadowRadius: 2,
    shadowColor: "#B2B2B2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    elevation: 0.9
  },
  routesContainer: {
    width: Dimensions.get("window").width * 0.52,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  eniLogoContainer: {
    width: Dimensions.get("window").width * 0.26,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  co2Text: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 10
  }
});



export default SustainabilitySection;
