// SvgPolygon componente per disegnare mediante svg il grafico a triangoli con le statistiche
// deve ricevere differenti parametri da visualizzare

import React from "react";
import { View, Dimensions, Text as TextReact, StyleSheet } from "react-native";
import Svg, {
  Text,
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Use,
  Defs,
  Stop,
  TSpan,
  Image
} from "react-native-svg";
import { connect } from "react-redux";

import ProfileScreenCardsFooter from "./../ProfileScreenCardsFooter/ProfileScreenCardsFooter";
import OwnIcon from "./../OwnIcon/OwnIcon";

class SvgPolygon extends React.Component {
  render() {
    // x
    width = Dimensions.get("window").width;

    const height = Dimensions.get("window").height * 0.38;
    // centro y
    // const y = 120 ;
    const y = height / 2;
    const raggio = parseInt((y / 3) * 2);
    // dimensione massima 100
    points = "300, " + width / 2 + " 70," + width / 2 + " 25,95";
    // centro  width / 2 + ",120 "
    // primo destra
    // secondo centro
    // terzo sinistra

    // parametri da passare
    // da 0 a 100, ovviamente togliere - 5 essendo che parte gia da 5
    const Walking = this.props.walk;
    const Public = this.props.publicTrasport;
    const Bike = this.props.bike;

    // punti che costituiscono i punti per formare il triangolo
    // vari punti per vari triangoli
    points =
      width / 2 +
      100 * Math.cos(Math.PI / 6) +
      "," +
      (y + 100 * Math.sin(Math.PI / 6)) +
      " " +
      width / 2 +
      "," +
      (y - 100) +
      " " +
      (width / 2 - 100 * Math.cos(Math.PI / 6)) +
      "," +
      (y + 100 * Math.sin(Math.PI / 6)) +
      " ";
    points2 =
      width / 2 +
      (10 + Walking) * Math.cos(Math.PI / 6) +
      "," +
      (y + (10 + Walking) * Math.sin(Math.PI / 6)) +
      " " +
      width / 2 +
      "," +
      (y - (10 + Bike)) +
      " " +
      (width / 2 - (10 + Public) * Math.cos(Math.PI / 6)) +
      "," +
      (y + (10 + Public) * Math.sin(Math.PI / 6)) +
      " ";
    // ombra
    points3 =
      width / 2 +
      (10 + Walking) * Math.cos(Math.PI / 6) +
      "," +
      (y + (10 + Walking) * Math.sin(Math.PI / 6)) +
      " " +
      width / 2 +
      "," +
      (y - (10 + Bike)) +
      " " +
      (width / 2 - (10 + Public) * Math.cos(Math.PI / 6)) +
      "," +
      (y + (10 + Public) * Math.sin(Math.PI / 6)) +
      " ";

    const traslateWalking =
      "translate(" +
      (width / 2 + 100 * Math.cos(Math.PI / 6)) +
      ", " +
      (y + 100 * Math.sin(Math.PI / 6)) +
      ")";

    const traslatePublic =
      "translate(" +
      (width / 2 - 100 * Math.cos(Math.PI / 6)) +
      ", " +
      (y + 100 * Math.sin(Math.PI / 6)) +
      ")";

    return (
      <View
        style={{
          backgroundColor: "#fff",
          justifyContent: "flex-start",
          alignItems: "center",
          width: Dimensions.get("window").width * 0.9,
          height: Dimensions.get("window").height * 0.55,
          borderRadius: 4
        }}
      >
        <View
          style={{
            alignContent: "center",
            alignItems: "center",

            marginTop: 14,
            width: Dimensions.get("window").width * 0.83,
            // height: Dimensions.get("window").height * 0.4,
            height: Dimensions.get("window").height * 0.45,

            backgroundColor: "#F7F8F9",
            opacity: 1,
            borderColor: "white"
          }}
        >
          <View
            style={{
              position: "absolute",
              right: 5,
              top: 5
            }}
          >
            <OwnIcon
              name="rotate_card_icn"
              size={20}
              color={this.props.colorName}
              click={() => this.props.onPress()}
            />
          </View>
          <TextReact
            style={{
              color: "#3F3F3F",
              fontSize: 22,
              textAlign: "center",
              fontFamily: "Montserrat-ExtraBold",
              color: this.props.colorName
            }}
          >
            {this.props.first_name
              ? this.props.first_name.toUpperCase() +
                " " +
                this.props.last_name.charAt(0).toUpperCase() +
                "."
              : " Mario R."}
          </TextReact>

          <TextReact
            style={{
              color: "#6CBA7E",
              fontSize: 20,
              textAlign: "center",
              fontFamily: "Montserrat-ExtraBold",
              color: this.props.colorTitle
            }}
          >
            {" "}
            {this.props.level.toUpperCase()}{" "}
          </TextReact>
          <View>
            <Svg height={height} width={width}>
              <Defs>
                <LinearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#F49658" stopOpacity="0.74" />
                  <Stop offset="100%" stopColor="#E82F73" stopOpacity="0.74" />
                </LinearGradient>
              </Defs>
              <Circle cx={width / 2} cy={y + 5} r={100} fill="url(#grad3)" />
              <Circle cx={width / 2} cy={y} r={100} fill="white" />
              <Defs>
                <LinearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#F49658" stopOpacity="0.74" />
                  <Stop offset="100%" stopColor="#E82F73" stopOpacity="0.74" />
                </LinearGradient>
              </Defs>
              <Defs>
                <LinearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#000000" stopOpacity="0.1" />
                  <Stop offset="100%" stopColor="#F7F8F9" stopOpacity="0.1" />
                </LinearGradient>
              </Defs>
              <Polygon points={points2} fill="url(#grad2)" />
              <Polygon points={points3} fill="url(#grad3)" />

              {/* <Circle
                cx={width / 2 + (10 + Walking) * Math.cos(Math.PI / 6)}
                cy={y + (10 + Walking) * Math.sin(Math.PI / 6)}
                r="2"
                fill="black"
              />
              <Circle
                cx={width / 2 - (10 + Public) * Math.cos(Math.PI / 6)}
                cy={y + (10 + Public) * Math.sin(Math.PI / 6)}
                r="2"
                fill="black"
              />
              <Circle cx={width / 2} cy={y - (10 + Bike)} r="2" fill="black" /> */}
              <Line
                x1={width / 2}
                y1={y}
                y2={y + 100 * Math.sin(Math.PI / 6)}
                x2={width / 2 - 100 * Math.cos(Math.PI / 6)}
                stroke="#E0E1E2"
                strokeOpacity="0.8"
                strokeWidth="0.8"
              />
              <Line
                x1={width / 2}
                y1={y}
                y2={y + 100 * Math.sin(Math.PI / 6)}
                x2={width / 2 + 100 * Math.cos(Math.PI / 6)}
                stroke="#E0E1E2"
                strokeOpacity="0.8"
                strokeWidth="0.8"
              />
              <Line
                x1={width / 2}
                y1={y}
                y2={y - 100}
                x2={width / 2}
                stroke="#E0E1E2"
                strokeOpacity="0.8"
                strokeWidth="0.8"
              />
              <Circle
                cx={width / 2}
                cy={y - 100}
                r="7"
                fill="white"
                stroke="#E83475"
                strokeWidth="5"
              />
              <Circle
                cx={width / 2 + 100 * Math.cos(Math.PI / 6)}
                cy={y + 100 * Math.sin(Math.PI / 6)}
                r="7"
                fill="white"
                stroke="#6CBA7E"
                strokeWidth="5"
              />
              <Circle
                cx={width / 2 - 100 * Math.cos(Math.PI / 6)}
                cy={y + 100 * Math.sin(Math.PI / 6)}
                r="7"
                fill="white"
                stroke="#FAB21E"
                strokeWidth="5"
              />
              {/*  <G transform={traslatePublic}>
                <Image
                  x="-60"
                  y="-25"
                  width="50"
                  height="50"
                  preserveAspectRatio="xMidYMid slice"
                  opacity="1"
                  href={require("../../assets/images/bus_icn.png")}
                />
              </G>

              <Image
                x={width / 2 - 25}
                y={y - 100 - 50}
                width="50"
                height="50"
                preserveAspectRatio="xMidYMid slice"
                opacity="1"
                href={require("../../assets/images/bike_icn.png")}
              />
              <G transform={traslateWalking}>
                <Image
                  x="0"
                  y="-25"
                  width="50"
                  height="50"
                  preserveAspectRatio="xMidYMid slice"
                  opacity="1"
                  href={require("../../assets/images/walk_icn.png")}
                />
              </G> */}

              <Text
                dx={width - 135}
                y={height - 20}
                fill="#9D9B9C"
                fontSize="8"
              >
                <TSpan x="12" dy="4">
                  your performance
                </TSpan>
              </Text>

              <Rect
                x={width - 50}
                y={height - 23}
                width="10"
                height="10"
                fill="url(#grad2)"
              />
            </Svg>
          </View>
        </View>
        <View
          style={{
            height: Dimensions.get("window").height * 0.1,
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <ProfileScreenCardsFooter
            // style={{ marginTop: -10 }}
            walk={this.props.walk}
            bike={this.props.bike}
            publicTrasport={this.props.publicTrasport}
            overall={this.props.overall}
            style={{ marginTop: -15 }}
            avatarId={this.props.avatarId}
          />
        </View>
      </View>
    );
  }
}



export default SvgPolygon;
